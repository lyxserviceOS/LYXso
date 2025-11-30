// app/(protected)/booking/components/WeekCalendar.tsx
"use client";

import React, { useMemo } from "react";
import type { Booking } from "@/types/booking";
import type { Resource } from "@/types/location";

type WeekCalendarProps = {
  bookings: Booking[];
  resources: Resource[];
  onBookingClick: (bookingId: string) => void;
  selectedBookingId: string | null;
  startDate: Date;
};

const HOURS = Array.from({ length: 12 }, (_, i) => 8 + i); // 08:00 - 19:00

export function WeekCalendar({
  bookings,
  resources,
  onBookingClick,
  selectedBookingId,
  startDate,
}: WeekCalendarProps) {
  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  }, [startDate]);

  // Group bookings by resource and day
  const bookingsByResourceAndDay = useMemo(() => {
    const map = new Map<string, Map<string, Booking[]>>();
    
    for (const booking of bookings) {
      // For now, we'll show all bookings in the first resource (mock assignment)
      const resourceId = resources[0]?.id || "default";
      
      if (!map.has(resourceId)) {
        map.set(resourceId, new Map());
      }
      
      const resourceMap = map.get(resourceId)!;
      const startDate = booking.startTime ? new Date(booking.startTime) : null;
      if (!startDate) continue;
      
      const dayKey = startDate.toISOString().slice(0, 10);
      if (!resourceMap.has(dayKey)) {
        resourceMap.set(dayKey, []);
      }
      
      resourceMap.get(dayKey)!.push(booking);
    }
    
    return map;
  }, [bookings, resources]);

  function getTimePosition(timeString: string | null): number {
    if (!timeString) return 0;
    const date = new Date(timeString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return ((hours - 8) * 60 + minutes) / 60; // Position in hours from 08:00
  }

  function getBookingHeight(start: string | null, end: string | null): number {
    if (!start || !end) return 1;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
    return diffMinutes / 60; // Height in hours
  }

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
      {/* Header with days */}
      <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-slate-200 bg-slate-50">
        <div className="p-2 text-xs font-medium text-slate-500">Tid</div>
        {weekDays.map((day, idx) => (
          <div key={idx} className="p-2 text-center border-l border-slate-200">
            <div className="text-xs font-medium text-slate-900">
              {day.toLocaleDateString("no-NO", { weekday: "short" })}
            </div>
            <div className="text-[10px] text-slate-500">
              {day.toLocaleDateString("no-NO", { day: "2-digit", month: "2-digit" })}
            </div>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="relative">
        {/* Time slots */}
        <div className="grid grid-cols-[80px_repeat(7,1fr)]">
          {HOURS.map((hour) => (
            <React.Fragment key={hour}>
              <div className="border-t border-slate-100 p-2 text-[10px] text-slate-400">
                {String(hour).padStart(2, "0")}:00
              </div>
              {weekDays.map((_, dayIdx) => (
                <div
                  key={`${hour}-${dayIdx}`}
                  className="border-t border-l border-slate-100 h-16 relative"
                >
                  {/* Bookings will be positioned absolutely here */}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>

        {/* Bookings overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="grid grid-cols-[80px_repeat(7,1fr)] h-full">
            <div></div>
            {weekDays.map((day, dayIdx) => {
              const dayKey = day.toISOString().slice(0, 10);
              const resourceId = resources[0]?.id || "default";
              const dayBookings = bookingsByResourceAndDay.get(resourceId)?.get(dayKey) || [];

              return (
                <div key={dayIdx} className="relative border-l border-slate-100">
                  {dayBookings.map((booking) => {
                    const top = getTimePosition(booking.startTime);
                    const height = getBookingHeight(booking.startTime, booking.endTime);
                    const isSelected = booking.id === selectedBookingId;

                    return (
                      <button
                        key={booking.id}
                        type="button"
                        onClick={() => onBookingClick(booking.id)}
                        className={`absolute left-1 right-1 rounded px-2 py-1 text-left pointer-events-auto transition ${
                          isSelected
                            ? "bg-sky-500 text-white border border-sky-600 shadow-md z-10"
                            : "bg-blue-100 text-blue-900 border border-blue-200 hover:bg-blue-200"
                        }`}
                        style={{
                          top: `${top * 64}px`,
                          height: `${height * 64}px`,
                          minHeight: "40px",
                        }}
                      >
                        <div className="text-[10px] font-medium truncate">
                          {booking.customerName || "Ukjent kunde"}
                        </div>
                        <div className="text-[9px] opacity-80 truncate">
                          {booking.serviceName || "Tjeneste"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
