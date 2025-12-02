"use client";

import { useState } from "react";
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

const localizer = momentLocalizer(moment);

interface BookingEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: {
    customerId: string;
    customerName: string;
    vehicleReg?: string;
    status: string;
    services: string[];
    resourceName?: string;
    employeeName?: string;
  };
}

interface BookingCalendarProps {
  bookings: any[];
  onSelectEvent?: (booking: any) => void;
  onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
  filters: {
    locationId?: string;
    resourceId?: string;
    employeeId?: string;
    status?: string[];
  };
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#3B82F6", // Blue
  confirmed: "#10B981", // Green
  in_progress: "#F59E0B", // Amber
  completed: "#6B7280", // Gray
  cancelled: "#EF4444", // Red
  no_show: "#F97316", // Orange
};

export default function BookingCalendar({
  bookings,
  onSelectEvent,
  onSelectSlot,
  filters,
}: BookingCalendarProps) {
  const [view, setView] = useState<View>("week");
  const [date, setDate] = useState(new Date());

  // Transform bookings to calendar events
  const events: BookingEvent[] = bookings.map((booking) => ({
    id: booking.id,
    title: `${booking.customer?.name || "Ukjent"} - ${
      booking.services?.map((s: any) => s.name).join(", ") || "Ingen tjeneste"
    }`,
    start: new Date(booking.scheduled_start),
    end: new Date(booking.scheduled_end || booking.scheduled_start),
    resource: {
      customerId: booking.customer_id,
      customerName: booking.customer?.name || "Ukjent",
      vehicleReg: booking.vehicle?.registration_number,
      status: booking.status,
      services: booking.services?.map((s: any) => s.name) || [],
      resourceName: booking.resource?.name,
      employeeName: booking.employee?.name,
    },
  }));

  // Custom event style based on status
  const eventStyleGetter = (event: BookingEvent) => {
    const status = event.resource?.status || "pending";
    const backgroundColor = STATUS_COLORS[status] || STATUS_COLORS.pending;

    return {
      style: {
        backgroundColor,
        borderRadius: "4px",
        opacity: 0.9,
        color: "white",
        border: "0px",
        display: "block",
        fontSize: "13px",
        padding: "4px",
      },
    };
  };

  // Custom day cell style
  const dayPropGetter = (date: Date) => {
    const isToday = moment(date).isSame(moment(), "day");
    return {
      style: {
        backgroundColor: isToday ? "#EFF6FF" : undefined,
      },
    };
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDate(moment(date).subtract(1, view === "month" ? "month" : "week").toDate())}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
          >
            ←
          </button>
          <button
            onClick={() => setDate(new Date())}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
          >
            I dag
          </button>
          <button
            onClick={() => setDate(moment(date).add(1, view === "month" ? "month" : "week").toDate())}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
          >
            →
          </button>
          <span className="ml-4 text-lg font-semibold">
            {format(date, "MMMM yyyy", { locale: nb })}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("day")}
            className={`px-3 py-1 rounded text-sm ${
              view === "day"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Dag
          </button>
          <button
            onClick={() => setView("week")}
            className={`px-3 py-1 rounded text-sm ${
              view === "week"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Uke
          </button>
          <button
            onClick={() => setView("month")}
            className={`px-3 py-1 rounded text-sm ${
              view === "month"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Måned
          </button>
          <button
            onClick={() => setView("agenda")}
            className={`px-3 py-1 rounded text-sm ${
              view === "agenda"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Liste
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 py-2 border-b bg-gray-50 flex items-center gap-4 text-xs">
        <span className="font-medium text-gray-700">Status:</span>
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <div key={status} className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: color }}
            />
            <span className="text-gray-600 capitalize">
              {status === "pending" && "Ny"}
              {status === "confirmed" && "Bekreftet"}
              {status === "in_progress" && "Pågår"}
              {status === "completed" && "Fullført"}
              {status === "cancelled" && "Avlyst"}
              {status === "no_show" && "Møtte ikke"}
            </span>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="flex-1 p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          onSelectEvent={onSelectEvent}
          onSelectSlot={onSelectSlot}
          selectable
          eventPropGetter={eventStyleGetter}
          dayPropGetter={dayPropGetter}
          step={15}
          timeslots={4}
          defaultView="week"
          views={["month", "week", "day", "agenda"]}
          messages={{
            today: "I dag",
            previous: "Forrige",
            next: "Neste",
            month: "Måned",
            week: "Uke",
            day: "Dag",
            agenda: "Liste",
            date: "Dato",
            time: "Tid",
            event: "Booking",
            noEventsInRange: "Ingen bookinger i denne perioden",
          }}
        />
      </div>
    </div>
  );
}
