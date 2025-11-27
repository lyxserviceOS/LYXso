"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  fetchBookingDashboardData,
  fetchBookings,
  createBooking,
  updateBooking,
} from "@/repos/bookingsRepo";
import type {
  Booking,
  BookingStatus,
  Employee,
  Service,
  BookingCustomerSummary,
} from "@/types/booking";

type NewBookingPayload = {
  customerName: string;
  serviceName: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  employeeId?: string;
  customerId?: string;
  notes?: string;
};

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Venter",
  confirmed: "Bekreftet",
  completed: "Fullført",
  cancelled: "Kansellert",
};

type ViewMode = "list" | "day";

function formatDateTime(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("no-NO", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTime(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleTimeString("no-NO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getDateKey(value: string | null): string {
  if (!value) return "ukjent";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "ukjent";
  // YYYY-MM-DD
  return d.toISOString().slice(0, 10);
}

function formatDateLabel(value: string | null): string {
  if (!value) return "Ukjent dato";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Ukjent dato";
  return d.toLocaleDateString("no-NO", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
}

// Skjema-state for ny booking
type NewBookingForm = {
  customerName: string;
  customerId: string; // "none" eller faktisk id
  serviceName: string;
  employeeId: string; // "none" eller faktisk id
  startTime: string; // "2025-11-25T10:00"
  endTime: string;
  notes: string;
  status: BookingStatus;
};

const EMPTY_NEW_BOOKING: NewBookingForm = {
  customerName: "",
  customerId: "none",
  serviceName: "",
  employeeId: "none",
  startTime: "",
  endTime: "",
  notes: "",
  status: "confirmed",
};

export default function BookingPageClient() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [customers, setCustomers] = useState<BookingCustomerSummary[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | "all">(
    "all",
  );
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | "all">(
    "all",
  );
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );

  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // Ny booking-modal state
  const [showNewModal, setShowNewModal] = useState(false);
  const [newForm, setNewForm] = useState<NewBookingForm>(EMPTY_NEW_BOOKING);
  const [savingNew, setSavingNew] = useState(false);
  const [newError, setNewError] = useState<string | null>(null);

  // Status-oppdatering på valgt booking
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // -----------------------------
  // Last inn data ved første render
  // -----------------------------
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchBookingDashboardData();
        setServices(data.services ?? []);
        setEmployees(data.employees ?? []);
        setCustomers(data.customers ?? []);
        setBookings(data.bookings ?? []);
      } catch (err) {
        console.error("[BookingPageClient] load error", err);
        setError("Kunne ikke hente booking-data.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // Enkel “refresh” som kun henter bookinger på nytt
  async function handleRefreshBookings() {
    setRefreshing(true);
    setError(null);
    try {
      const fresh = await fetchBookings();
      setBookings(fresh ?? []);
    } catch (err) {
      console.error("[BookingPageClient] refresh error", err);
      setError("Kunne ikke oppdatere booking-listen.");
    } finally {
      setRefreshing(false);
    }
  }

  // Åpne modal for ny booking
  function handleOpenNewBooking() {
    setNewForm(EMPTY_NEW_BOOKING);
    setNewError(null);
    setShowNewModal(true);
  }

  // Lukke modal
  function handleCloseNewBooking() {
    if (savingNew) return;
    setShowNewModal(false);
  }

  // Når man velger en kunde fra listen → sett både id og navn
  function handleChangeCustomerSelect(value: string) {
    if (value === "none") {
      setNewForm((prev) => ({
        ...prev,
        customerId: "none",
        customerName: prev.customerName,
      }));
      return;
    }
    const selected = customers.find((c) => c.id === value);
    setNewForm((prev) => ({
      ...prev,
      customerId: value,
      customerName: selected?.name ?? prev.customerName,
    }));
  }

  // -----------------------------
  // Lagre ny booking
  // -----------------------------
  async function handleSubmitNewBooking(e: React.FormEvent) {
    e.preventDefault();
    setNewError(null);

    const trimmedCustomerName = newForm.customerName.trim();
    const trimmedServiceName = newForm.serviceName.trim();

    if (!trimmedCustomerName) {
      setNewError("Kundenavn må fylles ut.");
      return;
    }
    if (!trimmedServiceName) {
      setNewError("Tjenestenavn må fylles ut.");
      return;
    }
    if (!newForm.startTime) {
      setNewError("Starttid må fylles ut.");
      return;
    }
    if (!newForm.endTime) {
      setNewError("Sluttid må fylles ut.");
      return;
    }

    setSavingNew(true);
    try {
      const payload: NewBookingPayload = {
        customerName: trimmedCustomerName,
        serviceName: trimmedServiceName,
        startTime: newForm.startTime,
        endTime: newForm.endTime,
        status: newForm.status,
      };

      if (newForm.employeeId !== "none") {
        payload.employeeId = newForm.employeeId;
      }
      if (newForm.customerId !== "none") {
        payload.customerId = newForm.customerId;
      }
      if (newForm.notes.trim()) {
        payload.notes = newForm.notes.trim();
      }

      const { booking } = await createBooking(payload);

      setBookings((prev) => [...prev, booking]);
      setSelectedBookingId(booking.id);

      setShowNewModal(false);
    } catch (err) {
      console.error("[BookingPageClient] createBooking error", err);
      setNewError("Kunne ikke opprette booking. Sjekk felt og prøv igjen.");
    } finally {
      setSavingNew(false);
    }
  }

  // -----------------------------
  // Oppdatere status på valgt booking
  // -----------------------------
  async function handleChangeStatus(newStatus: BookingStatus) {
    if (!selectedBookingId) return;
    setUpdatingStatus(true);
    setError(null);

    try {
      const { booking } = await updateBooking(selectedBookingId, {
        status: newStatus,
      });

      setBookings((prev) =>
        prev.map((b) => (b.id === booking.id ? booking : b)),
      );
    } catch (err) {
      console.error("[BookingPageClient] updateBooking error", err);
      setError("Kunne ikke oppdatere status på booking.");
    } finally {
      setUpdatingStatus(false);
    }
  }

  // -----------------------------
  // Filtrering og sortering
  // -----------------------------
  const filteredBookings = useMemo(() => {
    let list = bookings.slice();

    if (selectedStatus !== "all") {
      list = list.filter((b) => b.status === selectedStatus);
    }
    if (selectedEmployeeId !== "all") {
      list = list.filter((b) => b.employeeId === selectedEmployeeId);
    }

    list.sort((a, b) => {
      const da = a.startTime ? new Date(a.startTime).getTime() : 0;
      const db = b.startTime ? new Date(b.startTime).getTime() : 0;
      return da - db;
    });

    return list;
  }, [bookings, selectedStatus, selectedEmployeeId]);

  const selectedBooking = useMemo(
    () => filteredBookings.find((b) => b.id === selectedBookingId) ?? null,
    [filteredBookings, selectedBookingId],
  );

  function getEmployeeName(employeeId: string | null): string {
    if (!employeeId) return "Uten tildelt ansatt";
    const emp = employees.find((e) => e.id === employeeId);
    return emp?.name ?? "Ukjent ansatt";
  }

  function getCustomerName(b: Booking): string {
    if (typeof b.customerName === "string" && b.customerName.trim()) {
      return b.customerName;
    }
    const c = customers.find((c) => c.id === b.customerId);
    return c?.name ?? "Ukjent kunde";
  }

  function getServiceName(b: Booking): string {
    if (typeof b.serviceName === "string" && b.serviceName.trim()) {
      return b.serviceName;
    }
    return "Tjeneste";
  }

  // -----------------------------
  // Dagvisning – gruppering på dato
  // -----------------------------
  const dayGroups = useMemo(() => {
    const groups: Record<
      string,
      { dateKey: string; firstStart: string | null; bookings: Booking[] }
    > = {};

    for (const b of filteredBookings) {
      const key = getDateKey(b.startTime);
      if (!groups[key]) {
        groups[key] = {
          dateKey: key,
          firstStart: b.startTime ?? null,
          bookings: [],
        };
      }
      groups[key].bookings.push(b);
      if (!groups[key].firstStart && b.startTime) {
        groups[key].firstStart = b.startTime;
      }
    }

    const arr = Object.values(groups);

    // Sorter gruppene på dato
    arr.sort((a, b) => {
      const da = a.firstStart
        ? new Date(a.firstStart).getTime()
        : Number.MAX_SAFE_INTEGER;
      const db = b.firstStart
        ? new Date(b.firstStart).getTime()
        : Number.MAX_SAFE_INTEGER;
      return da - db;
    });

    // Sorter bookinger i hver dag-gruppe på starttid
    for (const g of arr) {
      g.bookings.sort((a, b) => {
        const da = a.startTime ? new Date(a.startTime).getTime() : 0;
        const db = b.startTime ? new Date(b.startTime).getTime() : 0;
        return da - db;
      });
    }

    return arr;
  }, [filteredBookings]);

  // -----------------------------
  // RENDER
  // -----------------------------

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-4 text-2xl font-semibold">Booking</h1>
        <p className="text-sm text-slate-500">Laster booking-data …</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Booking</h1>
          <p className="text-xs text-slate-500">
            Administrer alle bookinger for verkstedet – liste eller dagvisning.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Visningsmodus */}
          <div className="inline-flex items-center rounded-full border border-slate-300 bg-slate-50 p-0.5 text-[11px]">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`rounded-full px-3 py-1 ${
                viewMode === "list"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Liste
            </button>
            <button
              type="button"
              onClick={() => setViewMode("day")}
              className={`rounded-full px-3 py-1 ${
                viewMode === "day"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Dagvisning
            </button>
          </div>

          {error && (
            <span className="rounded bg-red-50 px-2 py-1 text-xs text-red-700">
              {error}
            </span>
          )}
          <button
            type="button"
            onClick={handleRefreshBookings}
            disabled={refreshing}
            className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {refreshing ? "Oppdaterer …" : "Oppdater bookinger"}
          </button>
          <button
            type="button"
            onClick={handleOpenNewBooking}
            className="inline-flex items-center rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-50 hover:bg-slate-800"
          >
            Ny booking
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[260px_minmax(0,1.4fr)_minmax(0,1fr)]">
        {/* VENSTRE: Filtre */}
        <aside className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 text-sm">
          <div>
            <h2 className="mb-2 text-sm font-medium">Filtre</h2>

            <label className="mb-1 block text-xs font-medium text-slate-500">
              Status
            </label>
            <select
              className="mb-3 w-full rounded border border-slate-300 px-2 py-1 text-xs"
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(e.target.value as BookingStatus | "all")
              }
            >
              <option value="all">Alle</option>
              <option value="pending">Venter / tilgjengelig</option>
              <option value="confirmed">Bekreftet</option>
              <option value="completed">Fullført</option>
              <option value="cancelled">Kansellert</option>
            </select>

            <label className="mb-1 block text-xs font-medium text-slate-500">
              Ansatt
            </label>
            <select
              className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
              value={selectedEmployeeId}
              onChange={(e) =>
                setSelectedEmployeeId(
                  e.target.value === "all" ? "all" : e.target.value,
                )
              }
            >
              <option value="all">Alle</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          <div className="border-t border-slate-200 pt-3 text-xs text-slate-500">
            <p className="mb-1">
              Viser <strong>{filteredBookings.length}</strong> bookinger etter
              filtrering.
            </p>
            <p className="text-[11px]">
              I dagvisning grupperes alle bookinger etter dato, så du raskt ser
              belastning per dag.
            </p>
          </div>
        </aside>

        {/* MIDTEN: Liste eller dagvisning */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
          <h2 className="mb-3 text-sm font-medium">
            {viewMode === "list" ? "Bookinger" : "Dagvisning"}
          </h2>

          {filteredBookings.length === 0 ? (
            <p className="text-xs text-slate-500">
              Ingen bookinger funnet med valgte filtre.
            </p>
          ) : viewMode === "list" ? (
            // LISTEVISNING
            <div className="max-h-[520px] overflow-auto">
              <table className="min-w-full border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                    <th className="px-2 py-1 text-left">Tid</th>
                    <th className="px-2 py-1 text-left">Kunde</th>
                    <th className="px-2 py-1 text-left">Tjeneste</th>
                    <th className="px-2 py-1 text-left">Ansatt</th>
                    <th className="px-2 py-1 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b) => {
                    const isSelected = b.id === selectedBookingId;
                    return (
                      <tr
                        key={b.id}
                        className={`cursor-pointer border-b border-slate-100 hover:bg-slate-50 ${
                          isSelected ? "bg-sky-50" : ""
                        }`}
                        onClick={() =>
                          setSelectedBookingId(isSelected ? null : b.id)
                        }
                      >
                        <td className="px-2 py-1 align-top">
                          {formatDateTime(b.startTime)}
                        </td>
                        <td className="px-2 py-1 align-top">
                          {b.customerId ? (
                            <Link
                              href={`/kunder/${b.customerId}`}
                              className="text-sky-700 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {getCustomerName(b)}
                            </Link>
                          ) : (
                            getCustomerName(b)
                          )}
                        </td>
                        <td className="px-2 py-1 align-top">
                          {getServiceName(b)}
                        </td>
                        <td className="px-2 py-1 align-top">
                          {getEmployeeName(b.employeeId ?? null)}
                        </td>
                        <td className="px-2 py-1 align-top">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${
                              b.status === "confirmed"
                                ? "bg-emerald-50 text-emerald-700"
                                : b.status === "completed"
                                ? "bg-slate-900 text-slate-50"
                                : b.status === "cancelled"
                                ? "bg-red-50 text-red-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {STATUS_LABELS[b.status] ?? b.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            // DAGVISNING
            <div className="max-h-[520px] space-y-4 overflow-auto">
              {dayGroups.map((group) => {
                const firstStart =
                  group.bookings[0]?.startTime ?? group.firstStart;
                const label = formatDateLabel(firstStart ?? null);

                return (
                  <div
                    key={group.dateKey}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {label}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {group.bookings.length}{" "}
                        {group.bookings.length === 1
                          ? "booking"
                          : "bookinger"}
                      </div>
                    </div>

                    <div className="grid gap-2 md:grid-cols-2">
                      {group.bookings.map((b) => {
                        const isSelected = b.id === selectedBookingId;
                        return (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() =>
                              setSelectedBookingId(isSelected ? null : b.id)
                            }
                            className={`flex flex-col items-stretch rounded-md border px-3 py-2 text-left text-[11px] transition ${
                              isSelected
                                ? "border-sky-400 bg-white"
                                : "border-slate-200 bg-white hover:border-sky-300"
                            }`}
                          >
                            <div className="mb-1 flex items-center justify-between">
                              <span className="font-medium text-slate-900">
                                {b.customerId ? (
                                  <Link
                                    href={`/kunder/${b.customerId}`}
                                    className="text-sky-700 hover:underline"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {getCustomerName(b)}
                                  </Link>
                                ) : (
                                  getCustomerName(b)
                                )}
                              </span>
                              <span className="ml-2 text-[10px] text-slate-500">
                                {formatTime(b.startTime)}–
                                {formatTime(b.endTime)}
                              </span>
                            </div>
                            <div className="mb-1 text-[11px] text-slate-600">
                              {getServiceName(b)}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-slate-500">
                                {getEmployeeName(b.employeeId ?? null)}
                              </span>
                              <span
                                className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                  b.status === "confirmed"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : b.status === "completed"
                                    ? "bg-slate-900 text-slate-50"
                                    : b.status === "cancelled"
                                    ? "bg-red-50 text-red-700"
                                    : "bg-amber-50 text-amber-700"
                                }`}
                              >
                                {STATUS_LABELS[b.status] ?? b.status}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* HØYRE: Detaljer for valgt booking */}
        <aside className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
          <h2 className="mb-3 text-sm font-medium">Detaljer</h2>

          {!selectedBooking ? (
            <p className="text-xs text-slate-500">
              Klikk på en booking i listen eller dagvisningen for å se detaljer.
            </p>
          ) : (
            <div className="space-y-3 text-xs">
              <div>
                <div className="text-[11px] font-medium text-slate-500">
                  Kunde
                </div>
                <div>
                  {selectedBooking.customerId ? (
                    <Link
                      href={`/kunder/${selectedBooking.customerId}`}
                      className="text-sky-700 hover:underline"
                    >
                      {getCustomerName(selectedBooking)}
                    </Link>
                  ) : (
                    getCustomerName(selectedBooking)
                  )}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-medium text-slate-500">
                  Tjeneste
                </div>
                <div>{getServiceName(selectedBooking)}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[11px] font-medium text-slate-500">
                    Start
                  </div>
                  <div>{formatDateTime(selectedBooking.startTime)}</div>
                </div>
                <div>
                  <div className="text-[11px] font-medium text-slate-500">
                    Slutt
                  </div>
                  <div>{formatDateTime(selectedBooking.endTime)}</div>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-medium text-slate-500">
                  Ansatt
                </div>
                <div>{getEmployeeName(selectedBooking.employeeId ?? null)}</div>
              </div>

              <div>
                <div className="text-[11px] font-medium text-slate-500">
                  Status
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      selectedBooking.status === "confirmed"
                        ? "bg-emerald-50 text-emerald-700"
                        : selectedBooking.status === "completed"
                        ? "bg-slate-900 text-slate-50"
                        : selectedBooking.status === "cancelled"
                        ? "bg-red-50 text-red-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {STATUS_LABELS[selectedBooking.status] ??
                      selectedBooking.status}
                  </span>

                  <div className="flex flex-wrap gap-1">
                    {selectedBooking.status !== "confirmed" && (
                      <button
                        type="button"
                        disabled={updatingStatus}
                        onClick={() => handleChangeStatus("confirmed")}
                        className="rounded border border-slate-300 px-2 py-0.5 text-[10px] text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                      >
                        Sett som bekreftet
                      </button>
                    )}
                    {selectedBooking.status !== "completed" && (
                      <button
                        type="button"
                        disabled={updatingStatus}
                        onClick={() => handleChangeStatus("completed")}
                        className="rounded border border-emerald-400 px-2 py-0.5 text-[10px] text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
                      >
                        Marker som fullført
                      </button>
                    )}
                    {selectedBooking.status !== "cancelled" && (
                      <button
                        type="button"
                        disabled={updatingStatus}
                        onClick={() => handleChangeStatus("cancelled")}
                        className="rounded border border-red-400 px-2 py-0.5 text-[10px] text-red-700 hover:bg-red-50 disabled:opacity-50"
                      >
                        Kanseller booking
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {selectedBooking.notes && (
                <div>
                  <div className="text-[11px] font-medium text-slate-500">
                    Notater
                  </div>
                  <p className="whitespace-pre-line text-slate-700">
                    {selectedBooking.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </aside>
      </div>

      {/* MODAL: Ny booking */}
      {showNewModal && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Ny booking</h2>
              <button
                type="button"
                onClick={handleCloseNewBooking}
                className="text-xs text-slate-500 hover:text-slate-700"
                disabled={savingNew}
              >
                Lukk
              </button>
            </div>

            {newError && (
              <p className="mb-2 rounded bg-red-50 px-2 py-1 text-xs text-red-700">
                {newError}
              </p>
            )}

            <form onSubmit={handleSubmitNewBooking} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Kunde (velg eksisterende)
                </label>
                <select
                  className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                  value={newForm.customerId}
                  onChange={(e) => handleChangeCustomerSelect(e.target.value)}
                >
                  <option value="none">Ingen valgt</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Kundenavn (vises i booking)
                </label>
                <input
                  type="text"
                  className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                  value={newForm.customerName}
                  onChange={(e) =>
                    setNewForm((prev) => ({
                      ...prev,
                      customerName: e.target.value,
                    }))
                  }
                  placeholder="F.eks. Ola Nordmann"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Tjeneste
                </label>
                <select
                  className="mb-2 w-full rounded border border-slate-300 px-2 py-1 text-xs"
                  value={newForm.serviceName}
                  onChange={(e) =>
                    setNewForm((prev) => ({
                      ...prev,
                      serviceName: e.target.value,
                    }))
                  }
                >
                  <option value="">Velg tjeneste …</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Ansatt
                </label>
                <select
                  className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                  value={newForm.employeeId}
                  onChange={(e) =>
                    setNewForm((prev) => ({
                      ...prev,
                      employeeId: e.target.value,
                    }))
                  }
                >
                  <option value="none">Ingen tildelt</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    Starttid
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                    value={newForm.startTime}
                    onChange={(e) =>
                      setNewForm((prev) => ({
                        ...prev,
                        startTime: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    Sluttid
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                    value={newForm.endTime}
                    onChange={(e) =>
                      setNewForm((prev) => ({
                        ...prev,
                        endTime: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Status
                </label>
                <select
                  className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                  value={newForm.status}
                  onChange={(e) =>
                    setNewForm((prev) => ({
                      ...prev,
                      status: e.target.value as BookingStatus,
                    }))
                  }
                >
                  <option value="pending">Venter</option>
                  <option value="confirmed">Bekreftet</option>
                  <option value="completed">Fullført</option>
                  <option value="cancelled">Kansellert</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Notater (valgfritt)
                </label>
                <textarea
                  className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                  rows={2}
                  value={newForm.notes}
                  onChange={(e) =>
                    setNewForm((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseNewBooking}
                  className="rounded border border-slate-300 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                  disabled={savingNew}
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  disabled={savingNew}
                  className="rounded bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-50 hover:bg-slate-800 disabled:opacity-50"
                >
                  {savingNew ? "Lagrer …" : "Lagre booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
