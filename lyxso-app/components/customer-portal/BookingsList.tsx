'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import BookingCard from './BookingCard';

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
  upcoming: Booking[];
  past: Booking[];
};

export default function BookingsList({ upcoming, past }: Props) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const bookings = activeTab === 'upcoming' ? upcoming : past;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`
            px-4 py-2 border-b-2 font-semibold transition-colors
            ${
              activeTab === 'upcoming'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }
          `}
        >
          Kommende ({upcoming.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`
            px-4 py-2 border-b-2 font-semibold transition-colors
            ${
              activeTab === 'past'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }
          `}
        >
          Tidligere ({past.length})
        </button>
      </div>

      {/* Bookings list */}
      {bookings.length === 0 ? (
        <div className="card text-center py-12">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600">
            {activeTab === 'upcoming'
              ? 'Du har ingen kommende bookinger'
              : 'Ingen tidligere bookinger funnet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              isPast={activeTab === 'past'}
            />
          ))}
        </div>
      )}
    </div>
  );
}
