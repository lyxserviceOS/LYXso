'use client';

import { Calendar, Clock, MapPin, Phone, Car, AlertCircle } from 'lucide-react';
import { useState } from 'react';

type Booking = {
  id: string;
  starts_at: string;
  ends_at: string;
  status: string;
  total_amount: number;
  services: { name: string; duration_minutes: number } | null;
  vehicles: { registration_number: string; model: string } | null;
  orgs: { name: string; phone: string } | null;
};

type Props = {
  booking: Booking;
  isPast: boolean;
};

export default function BookingCard({ booking, isPast }: Props) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const date = new Date(booking.starts_at);
  const now = new Date();
  const hoursUntil = (date.getTime() - now.getTime()) / (1000 * 60 * 60);
  const canCancel = !isPast && hoursUntil > 24; // Kan avbestille hvis >24t til

  async function handleCancel() {
    setCancelling(true);
    try {
      const response = await fetch(`/api/customer/bookings/${booking.id}/cancel`, {
        method: 'PATCH',
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert('Kunne ikke avbestille. Vennligst kontakt oss.');
      }
    } catch (error) {
      alert('Noe gikk galt. Vennligst prøv igjen.');
    }
    setCancelling(false);
  }

  const statusColors: Record<string, string> = {
    confirmed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const statusLabels: Record<string, string> = {
    confirmed: 'Bekreftet',
    pending: 'Venter bekreftelse',
    completed: 'Fullført',
    cancelled: 'Avbestilt',
  };

  return (
    <div className="card">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        {/* Left side - Info */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 text-lg">
                {booking.services?.name || 'Booking'}
              </h3>
              <span
                className={`inline-block px-2 py-1 text-xs font-semibold rounded mt-1 ${
                  statusColors[booking.status] || 'bg-slate-100 text-slate-800'
                }`}
              >
                {statusLabels[booking.status] || booking.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="w-4 h-4" />
              <span>
                {date.toLocaleDateString('nb-NO', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="w-4 h-4" />
              <span>
                {date.toLocaleTimeString('nb-NO', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                {booking.services?.duration_minutes &&
                  ` (${booking.services.duration_minutes} min)`}
              </span>
            </div>

            {booking.vehicles && (
              <div className="flex items-center gap-2 text-slate-600">
                <Car className="w-4 h-4" />
                <span>
                  {booking.vehicles.registration_number} - {booking.vehicles.model}
                </span>
              </div>
            )}

            {booking.orgs && (
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-4 h-4" />
                <span>{booking.orgs.name}</span>
              </div>
            )}
          </div>

          {booking.total_amount > 0 && (
            <div className="text-sm">
              <span className="text-slate-600">Pris: </span>
              <span className="font-semibold text-slate-900">
                {booking.total_amount.toLocaleString('nb-NO')} kr
              </span>
            </div>
          )}
        </div>

        {/* Right side - Actions */}
        {!isPast && canCancel && booking.status !== 'cancelled' && (
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setShowCancelDialog(true)}
              className="px-4 py-2 text-sm font-semibold text-red-600 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              Avbestill
            </button>
            {booking.orgs?.phone && (
              <a
                href={`tel:${booking.orgs.phone}`}
                className="px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-center"
              >
                <Phone className="w-4 h-4 inline mr-1" />
                Ring oss
              </a>
            )}
          </div>
        )}

        {!canCancel && !isPast && booking.status !== 'cancelled' && (
          <div className="text-sm text-slate-600 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              Mindre enn 24t til. Kontakt oss for å endre eller avbestille.
            </span>
          </div>
        )}
      </div>

      {/* Cancel dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Avbestill booking?
            </h3>
            <p className="text-slate-600 mb-6">
              Er du sikker på at du vil avbestille denne bookingen?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
                disabled={cancelling}
              >
                Avbryt
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg"
                disabled={cancelling}
              >
                {cancelling ? 'Avbestiller...' : 'Ja, avbestill'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
