"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Booking, BookingStatus } from "@/types/booking";
import type { BookingCustomerSummary } from "@/types/booking";
import type { Location, Resource } from "@/types/location";

type BookingDetailPanelProps = {
  booking: Booking | null;
  customer?: BookingCustomerSummary | null;
  location?: Location | null;
  resource?: Resource | null;
  onStatusChange: (bookingId: string, newStatus: BookingStatus) => Promise<void>;
  onEdit: (booking: Booking) => void;
  onDelete?: (bookingId: string) => Promise<void>;
  loading?: boolean;
};

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; icon: string }> = {
  pending: { label: "Venter", color: "bg-amber-100 text-amber-700 border-amber-200", icon: "⏳" },
  confirmed: { label: "Bekreftet", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: "✓" },
  in_progress: { label: "Pågår", color: "bg-blue-100 text-blue-700 border-blue-200", icon: "🔧" },
  completed: { label: "Fullført", color: "bg-slate-900 text-slate-50 border-slate-900", icon: "✓✓" },
  cancelled: { label: "Kansellert", color: "bg-red-100 text-red-700 border-red-200", icon: "✗" },
  no_show: { label: "Ikke møtt", color: "bg-orange-100 text-orange-700 border-orange-200", icon: "⚠" },
};

export function BookingDetailPanel({
  booking,
  customer,
  location,
  resource,
  onStatusChange,
  onEdit,
  onDelete,
  loading = false,
}: BookingDetailPanelProps) {
  const [changingStatus, setChangingStatus] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!booking) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
        <div className="text-slate-400 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-sm font-medium text-slate-700 mb-1">
          Ingen booking valgt
        </h3>
        <p className="text-xs text-slate-500">
          Velg en booking fra kalenderen for å se detaljer
        </p>
      </div>
    );
  }

  const statusInfo = STATUS_CONFIG[booking.status];

  async function handleStatusChange(newStatus: BookingStatus) {
    if (changingStatus || !booking) return;
    setChangingStatus(true);
    try {
      await onStatusChange(booking.id, newStatus);
    } finally {
      setChangingStatus(false);
    }
  }

  async function handleDelete() {
    if (!onDelete || deleting || !booking) return;
    setDeleting(true);
    try {
      await onDelete(booking.id);
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  }

  function formatDateTime(value: string | null): string {
    if (!value) return "—";
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleString("no-NO", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatTime(value: string | null): string {
    if (!value) return "—";
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleTimeString("no-NO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function calculateDuration(): string {
    if (!booking || !booking.startTime || !booking.endTime) return "—";
    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.round(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} min`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return mins > 0 ? `${hours}t ${mins}min` : `${hours}t`;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 p-4 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Booking-detaljer
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              ID: {booking.id.slice(0, 8)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(booking)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition"
              title="Rediger"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            {onDelete && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
                title="Slett"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${statusInfo.color}`}>
            <span>{statusInfo.icon}</span>
            <span>{statusInfo.label}</span>
          </span>
          {booking.createdAt && (
            <span className="text-[10px] text-slate-400">
              Opprettet {new Date(booking.createdAt).toLocaleDateString("no-NO")}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 max-h-[calc(100vh-320px)] overflow-y-auto">
        {/* Customer Info */}
        <section className="pb-4 border-b border-slate-100">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            👤 Kunde
          </h4>
          <div className="space-y-2">
            {booking.customerId && customer ? (
              <>
                <div>
                  <Link
                    href={`/kunder/${booking.customerId}`}
                    className="text-sm font-medium text-sky-600 hover:text-sky-700 hover:underline"
                  >
                    {customer.name}
                  </Link>
                </div>
                {customer.email && (
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href={`mailto:${customer.email}`} className="hover:underline">
                      {customer.email}
                    </a>
                  </div>
                )}
                {customer.phone && (
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${customer.phone}`} className="hover:underline">
                      {customer.phone}
                    </a>
                  </div>
                )}
              </>
            ) : (
              <div className="text-sm text-slate-700">
                {booking.customerName || "Ukjent kunde"}
              </div>
            )}
          </div>
        </section>

        {/* Service & Time */}
        <section className="pb-4 border-b border-slate-100">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            🔧 Tjeneste & Tid
          </h4>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-slate-500 mb-0.5">Tjeneste</div>
              <div className="text-sm font-medium text-slate-900">
                {booking.serviceName || booking.title || "Ikke spesifisert"}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-slate-500 mb-0.5">Start</div>
                <div className="text-sm text-slate-900">
                  {formatDateTime(booking.startTime)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-0.5">Slutt</div>
                <div className="text-sm text-slate-900">
                  {formatDateTime(booking.endTime)}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg px-3 py-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">Varighet:</span>
                <span className="text-sm font-medium text-slate-900">
                  {calculateDuration()}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Location & Resource */}
        {(location || resource) && (
          <section className="pb-4 border-b border-slate-100">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              📍 Lokasjon & Ressurs
            </h4>
            <div className="space-y-2">
              {location && (
                <div>
                  <div className="text-xs text-slate-500 mb-0.5">Lokasjon</div>
                  <div className="text-sm text-slate-900 flex items-center gap-1">
                    {location.name}
                    {location.is_primary && <span className="text-amber-500">⭐</span>}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {location.address}, {location.city}
                  </div>
                </div>
              )}
              {resource && (
                <div>
                  <div className="text-xs text-slate-500 mb-0.5">Ressurs</div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: resource.color || '#6B7280' }}
                    />
                    <span className="text-sm text-slate-900">
                      {resource.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      ({resource.type})
                    </span>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Notes */}
        {booking.notes && (
          <section className="pb-4 border-b border-slate-100">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              📝 Notater
            </h4>
            <div className="text-sm text-slate-700 whitespace-pre-line bg-slate-50 rounded-lg p-3">
              {booking.notes}
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            ⚡ Hurtighandlinger
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {booking.status !== "confirmed" && (
              <button
                type="button"
                onClick={() => handleStatusChange("confirmed")}
                disabled={changingStatus}
                className="px-3 py-2 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition text-xs font-medium disabled:opacity-50"
              >
                ✓ Bekreft
              </button>
            )}
            {booking.status !== "in_progress" && booking.status !== "completed" && booking.status !== "cancelled" && (
              <button
                type="button"
                onClick={() => handleStatusChange("in_progress")}
                disabled={changingStatus}
                className="px-3 py-2 rounded-lg border border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 transition text-xs font-medium disabled:opacity-50"
              >
                🔧 Start
              </button>
            )}
            {booking.status !== "completed" && booking.status !== "cancelled" && (
              <button
                type="button"
                onClick={() => handleStatusChange("completed")}
                disabled={changingStatus}
                className="px-3 py-2 rounded-lg border border-slate-300 bg-slate-900 text-white hover:bg-slate-800 transition text-xs font-medium disabled:opacity-50"
              >
                ✓✓ Fullført
              </button>
            )}
            {booking.status !== "cancelled" && booking.status !== "completed" && (
              <button
                type="button"
                onClick={() => handleStatusChange("cancelled")}
                disabled={changingStatus}
                className="px-3 py-2 rounded-lg border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 transition text-xs font-medium disabled:opacity-50"
              >
                ✗ Kanseller
              </button>
            )}
            {booking.status !== "no_show" && booking.status !== "completed" && (
              <button
                type="button"
                onClick={() => handleStatusChange("no_show")}
                disabled={changingStatus}
                className="px-3 py-2 rounded-lg border border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100 transition text-xs font-medium disabled:opacity-50"
              >
                ⚠ No-show
              </button>
            )}
          </div>
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 text-center mb-2">
              Slett booking?
            </h3>
            <p className="text-sm text-slate-600 text-center mb-6">
              Er du sikker på at du vil slette denne bookingen? Dette kan ikke angres.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition text-sm font-medium disabled:opacity-50"
              >
                Avbryt
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition text-sm font-medium disabled:opacity-50"
              >
                {deleting ? "Sletter..." : "Slett"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
