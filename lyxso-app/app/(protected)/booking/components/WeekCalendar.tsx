// app/(protected)/booking/components/WeekCalendar.tsx
"use client";

import React, { useMemo, useState } from "react";
import type { Booking } from "@/types/booking";
import type { Resource } from "@/types/location";

type WeekCalendarProps = {
  bookings: Booking[];
  resources: Resource[];
  onBookingClick: (bookingId: string) => void;
  onBookingDrop?: (bookingId: string, newStartTime: string, newResourceId?: string) => Promise<void>;
  selectedBookingId: string | null;
  startDate: Date;
  viewMode?: "day" | "week";
};

const HOURS = Array.from({ length: 13 }, (_, i) => 7 + i); // 07:00 - 19:00
const HOUR_HEIGHT = 60; // pixels per hour

export function WeekCalendar({
  bookings,
  resources,
  onBookingClick,
  onBookingDrop,
  selectedBookingId,
  startDate,
  viewMode = "week",
}: WeekCalendarProps) {
  const [draggedBookingId, setDraggedBookingId] = useState<string | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(startDate);
  const [dropPreview, setDropPreview] = useState<{day: number, hour: number} | null>(null);

  const weekDays = useMemo(() => {
    const days = [];
    const daysToShow = viewMode === "day" ? 1 : 7;
    for (let i = 0; i < daysToShow; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  }, [currentWeekStart, viewMode]);

  // Group bookings by day
  const bookingsByDay = useMemo(() => {
    const map = new Map<string, Booking[]>();
    
    for (const booking of bookings) {
      const startDate = booking.startTime ? new Date(booking.startTime) : null;
      if (!startDate) continue;
      
      const dayKey = startDate.toISOString().slice(0, 10);
      if (!map.has(dayKey)) {
        map.set(dayKey, []);
      }
      
      map.get(dayKey)!.push(booking);
    }
    
    return map;
  }, [bookings]);

  // Calculate capacity for a specific hour slot
  function calculateCapacity(dayDate: Date, hour: number) {
    const slotStart = new Date(dayDate);
    slotStart.setHours(hour, 0, 0, 0);
    const slotEnd = new Date(slotStart);
    slotEnd.setHours(hour + 1, 0, 0, 0);
    
    // Count bookings that overlap with this hour
    const overlappingBookings = bookings.filter(b => {
      if (!b.startTime || !b.endTime) return false;
      const bStart = new Date(b.startTime).getTime();
      const bEnd = new Date(b.endTime).getTime();
      return bStart < slotEnd.getTime() && bEnd > slotStart.getTime();
    });
    
    // Calculate max capacity from resources
    const maxCapacity = resources.reduce((sum, r) => sum + (r.max_concurrent_bookings || 1), 0);
    const used = overlappingBookings.length;
    const percentage = maxCapacity > 0 ? (used / maxCapacity) * 100 : 0;
    
    return {
      used,
      max: maxCapacity,
      percentage,
      isFull: used >= maxCapacity,
      isHigh: percentage >= 90,
      isMedium: percentage >= 70 && percentage < 90,
      isLow: percentage < 70,
    };
  }

  function getTimePosition(timeString: string | null): number {
    if (!timeString) return 0;
    const date = new Date(timeString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return ((hours - 7) * 60 + minutes) / 60; // Position in hours from 07:00
  }

  function getBookingHeight(start: string | null, end: string | null): number {
    if (!start || !end) return 1;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
    return diffMinutes / 60; // Height in hours
  }

  function handleDragStart(e: React.DragEvent, bookingId: string) {
    setDraggedBookingId(bookingId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", bookingId);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    
    // Extract day and hour from target element for preview
    const target = e.currentTarget as HTMLElement;
    const dayIdx = parseInt(target.dataset.dayIdx || "0");
    const hour = parseInt(target.dataset.hour || "0");
    
    if (!isNaN(dayIdx) && !isNaN(hour)) {
      setDropPreview({ day: dayIdx, hour });
    }
  }

  async function handleDrop(e: React.DragEvent, dayDate: Date, hourOffset: number) {
    e.preventDefault();
    setDraggedBookingId(null);
    setDropPreview(null);
    
    if (!onBookingDrop || !draggedBookingId) return;

    const booking = bookings.find(b => b.id === draggedBookingId);
    if (!booking) return;

    // Calculate new start time
    const newStart = new Date(dayDate);
    const totalMinutes = hourOffset * 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    newStart.setHours(7 + hours, minutes, 0, 0);

    await onBookingDrop(draggedBookingId, newStart.toISOString());
  }

  function navigateWeek(direction: "prev" | "next") {
    const newStart = new Date(currentWeekStart);
    const daysToMove = viewMode === "day" ? 1 : 7;
    newStart.setDate(newStart.getDate() + (direction === "next" ? daysToMove : -daysToMove));
    setCurrentWeekStart(newStart);
  }

  function goToToday() {
    setCurrentWeekStart(new Date());
  }

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-4 bg-white rounded-lg border border-slate-200 p-3">
        <button
          type="button"
          onClick={() => navigateWeek("prev")}
          className="p-2 hover:bg-slate-100 rounded-lg transition"
          title="Forrige"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goToToday}
            className="px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            I dag
          </button>
          <div className="text-sm font-semibold text-slate-900">
            {viewMode === "day" 
              ? weekDays[0].toLocaleDateString("no-NO", { day: "numeric", month: "long", year: "numeric" })
              : `${weekDays[0].toLocaleDateString("no-NO", { day: "numeric", month: "short" })} - ${weekDays[weekDays.length - 1].toLocaleDateString("no-NO", { day: "numeric", month: "long", year: "numeric" })}`
            }
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigateWeek("next")}
          className="p-2 hover:bg-slate-100 rounded-lg transition"
          title="Neste"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Calendar */}
      <div className="flex-1 border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
        {/* Header with days */}
        <div className={`grid ${viewMode === "day" ? "grid-cols-[80px_1fr]" : "grid-cols-[80px_repeat(7,1fr)]"} border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white sticky top-0 z-10`}>
          <div className="p-3 text-xs font-semibold text-slate-600 border-r border-slate-200">
            Tid
          </div>
          {weekDays.map((day, idx) => {
            const today = isToday(day);
            return (
              <div 
                key={idx} 
                className={`p-3 text-center border-l border-slate-100 ${today ? "bg-sky-50/50" : ""}`}
              >
                <div className={`text-xs font-semibold uppercase tracking-wide ${today ? "text-sky-700" : "text-slate-700"}`}>
                  {day.toLocaleDateString("no-NO", { weekday: "short" })}
                </div>
                <div className={`text-lg font-bold ${today ? "text-sky-600" : "text-slate-900"} mt-0.5`}>
                  {day.getDate()}
                </div>
                <div className="text-[10px] text-slate-500">
                  {day.toLocaleDateString("no-NO", { month: "short" })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Calendar grid */}
        <div className="relative overflow-auto" style={{ maxHeight: "600px" }}>
          {/* Time slots */}
          <div className={`grid ${viewMode === "day" ? "grid-cols-[80px_1fr]" : "grid-cols-[80px_repeat(7,1fr)]"}`}>
            {HOURS.map((hour) => (
              <React.Fragment key={hour}>
                <div className="border-t border-slate-100 p-2 pr-3 text-right text-xs font-medium text-slate-500 bg-slate-50/50 border-r border-slate-200 sticky left-0">
                  {String(hour).padStart(2, "0")}:00
                </div>
                {weekDays.map((day, dayIdx) => {
                  const today = isToday(day);
                  const showPreview = dropPreview && dropPreview.day === dayIdx && dropPreview.hour === (hour - 7);
                  const capacity = calculateCapacity(day, hour);
                  
                  return (
                    <div
                      key={`${hour}-${dayIdx}`}
                      data-day-idx={dayIdx}
                      data-hour={hour - 7}
                      className={`border-t border-l border-slate-100 relative ${today ? "bg-sky-50/20" : ""} ${showPreview ? "bg-blue-100/40" : ""} ${capacity.isFull ? "bg-red-50/30" : ""}`}
                      style={{ height: `${HOUR_HEIGHT}px` }}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, day, hour - 7)}
                      onDragLeave={() => setDropPreview(null)}
                    >
                      {/* Capacity indicator */}
                      {capacity.max > 0 && (
                        <div className="absolute top-1 right-1 z-10">
                          <div 
                            className={`w-2 h-2 rounded-full ${
                              capacity.isFull ? "bg-red-500" :
                              capacity.isHigh ? "bg-red-400" :
                              capacity.isMedium ? "bg-yellow-400" :
                              "bg-green-400"
                            }`}
                            title={`Kapasitet: ${capacity.used}/${capacity.max} (${Math.round(capacity.percentage)}%)`}
                          />
                        </div>
                      )}
                      
                      {/* 15-minute markers */}
                      <div className="absolute top-1/4 left-0 right-0 border-t border-slate-50"></div>
                      <div className="absolute top-1/2 left-0 right-0 border-t border-slate-100"></div>
                      <div className="absolute top-3/4 left-0 right-0 border-t border-slate-50"></div>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>

          {/* Bookings overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{ left: "80px" }}>
            <div className={`grid ${viewMode === "day" ? "grid-cols-1" : "grid-cols-7"} h-full`}>
              {weekDays.map((day, dayIdx) => {
                const dayKey = day.toISOString().slice(0, 10);
                const dayBookings = bookingsByDay.get(dayKey) || [];

                return (
                  <div key={dayIdx} className="relative">
                    {dayBookings.map((booking) => {
                      const top = getTimePosition(booking.startTime);
                      const height = getBookingHeight(booking.startTime, booking.endTime);
                      const isSelected = booking.id === selectedBookingId;
                      const isDragging = booking.id === draggedBookingId;

                      const statusColors = {
                        pending: "bg-amber-100 border-amber-300 text-amber-900",
                        confirmed: "bg-emerald-100 border-emerald-300 text-emerald-900",
                        in_progress: "bg-blue-100 border-blue-300 text-blue-900",
                        completed: "bg-slate-200 border-slate-300 text-slate-700",
                        cancelled: "bg-red-100 border-red-300 text-red-900",
                        no_show: "bg-orange-100 border-orange-300 text-orange-900",
                      };

                      const colorClass = statusColors[booking.status] || statusColors.pending;

                      return (
                        <div
                          key={booking.id}
                          draggable={!!onBookingDrop}
                          onDragStart={(e) => handleDragStart(e, booking.id)}
                          onDragEnd={() => setDraggedBookingId(null)}
                          onClick={() => onBookingClick(booking.id)}
                          className={`absolute left-1 right-1 rounded-lg px-2 py-1.5 text-left pointer-events-auto transition-all cursor-pointer border-l-4 ${
                            isDragging
                              ? "opacity-50 scale-95"
                              : isSelected
                              ? "bg-sky-500 text-white border-sky-700 shadow-lg z-20 scale-[1.02]"
                              : `${colorClass} hover:shadow-md z-10`
                          }`}
                          style={{
                            top: `${top * HOUR_HEIGHT}px`,
                            height: `${height * HOUR_HEIGHT}px`,
                            minHeight: "44px",
                          }}
                        >
                          {/* Series indicator */}
                          {booking.seriesId && (
                            <div className="absolute top-0.5 right-0.5" title={`Del av serie (${booking.seriesIndex !== null ? `#${booking.seriesIndex + 1}` : ""})`}>
                              <svg className="w-3 h-3 text-current opacity-60" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                          
                          <div className="text-xs font-semibold truncate">
                            {booking.customerName || "Ukjent kunde"}
                          </div>
                          <div className="text-[10px] opacity-90 truncate">
                            {booking.serviceName || booking.title || "Tjeneste"}
                          </div>
                          {height > 1 && (
                            <div className="text-[9px] opacity-75 mt-0.5">
                              {new Date(booking.startTime!).toLocaleTimeString("no-NO", {hour: "2-digit", minute: "2-digit"})}
                              {" - "}
                              {new Date(booking.endTime!).toLocaleTimeString("no-NO", {hour: "2-digit", minute: "2-digit"})}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current time indicator */}
          {weekDays.some(isToday) && (() => {
            const now = new Date();
            const todayIdx = weekDays.findIndex(isToday);
            if (todayIdx === -1) return null;
            
            const currentTimePosition = ((now.getHours() - 7) * 60 + now.getMinutes()) / 60;
            if (currentTimePosition < 0 || currentTimePosition > 12) return null;

            return (
              <div 
                className="absolute left-0 right-0 pointer-events-none z-30"
                style={{ 
                  top: `${currentTimePosition * HOUR_HEIGHT}px`,
                  left: viewMode === "day" ? "80px" : `${80 + (todayIdx * (100 / 7))}%`,
                  width: viewMode === "day" ? "calc(100% - 80px)" : `${100 / 7}%`,
                }}
              >
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 -ml-1.5"></div>
                  <div className="flex-1 h-0.5 bg-red-500"></div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
        <span className="font-medium text-slate-600">Status:</span>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300"></div>
          <span className="text-slate-600">Bekreftet</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-amber-100 border border-amber-300"></div>
          <span className="text-slate-600">Venter</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-blue-100 border border-blue-300"></div>
          <span className="text-slate-600">Pågår</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-slate-200 border border-slate-300"></div>
          <span className="text-slate-600">Fullført</span>
        </div>
        
        {/* Capacity legend */}
        <div className="ml-4 border-l pl-4 border-slate-200">
          <span className="font-medium text-slate-600 mr-3">Kapasitet:</span>
          <div className="inline-flex items-center gap-1.5 mr-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span className="text-slate-600">&lt;70%</span>
          </div>
          <div className="inline-flex items-center gap-1.5 mr-2">
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            <span className="text-slate-600">70-90%</span>
          </div>
          <div className="inline-flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-400"></div>
            <span className="text-slate-600">&gt;90%</span>
          </div>
        </div>
        
        {onBookingDrop && (
          <span className="ml-auto text-slate-500 italic">💡 Dra og slipp for å flytte bookinger</span>
        )}
      </div>
    </div>
  );
}
