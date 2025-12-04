"use client";

import React, { useState, useEffect } from "react";
import { getApiBaseUrl } from "@/lib/apiConfig";

const API_BASE_URL = getApiBaseUrl();
const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID;

if (!ORG_ID) {
  console.warn(
    "[PublicBookingPageClient] NEXT_PUBLIC_ORG_ID mangler – public booking vil feile."
  );
}

function getPublicBookingUrl() {
  if (!ORG_ID) {
    throw new Error(
      "[PublicBookingPageClient] NEXT_PUBLIC_ORG_ID er ikke satt."
    );
  }
  return `${API_BASE_URL}/api/public/orgs/${ORG_ID}/bookings`;
}

type PublicBookingForm = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceName: string;
  startLocal: string; // datetime-local
  endLocal: string; // datetime-local
  notes: string;
};

type AvailableSlot = {
  date: string;
  start: string;
  end: string;
  available: boolean;
};

// Mock booking settings (in production, fetch from API)
const MOCK_BOOKING_SETTINGS = {
  allow_auto_booking: true, // Partner has enabled auto-booking
  show_available_slots: true,
  booking_slot_duration_minutes: 60,
};

// Generate mock available slots for the next 7 days
function generateMockSlots(): AvailableSlot[] {
  const slots: AvailableSlot[] = [];
  const now = new Date();
  
  for (let day = 1; day <= 7; day++) {
    const date = new Date(now);
    date.setDate(date.getDate() + day);
    const dateStr = date.toISOString().split('T')[0];
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    // Generate slots from 9:00 to 16:00
    const hours = [9, 10, 11, 12, 13, 14, 15, 16];
    hours.forEach(hour => {
      slots.push({
        date: dateStr,
        start: `${hour.toString().padStart(2, '0')}:00`,
        end: `${(hour + 1).toString().padStart(2, '0')}:00`,
        available: Math.random() > 0.3, // 70% availability
      });
    });
  }
  
  return slots;
}

const EMPTY_FORM: PublicBookingForm = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  serviceName: "",
  startLocal: "",
  endLocal: "",
  notes: "",
};

export default function PublicBookingPageClient() {
  const [form, setForm] = useState<PublicBookingForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Slot selection state
  const [bookingMode, setBookingMode] = useState<"slots" | "manual">(
    MOCK_BOOKING_SETTINGS.show_available_slots ? "slots" : "manual"
  );
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  
  // Load available slots
  useEffect(() => {
    if (MOCK_BOOKING_SETTINGS.show_available_slots) {
      setAvailableSlots(generateMockSlots());
    }
  }, []);
  
  // Get unique dates from available slots
  const availableDates = [...new Set(availableSlots.map(s => s.date))];
  
  // Get slots for selected date
  const slotsForSelectedDate = availableSlots.filter(s => s.date === selectedDate);

  function handleChange<K extends keyof PublicBookingForm>(
    key: K,
    value: PublicBookingForm[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }
  
  function handleSelectSlot(slot: AvailableSlot) {
    if (!slot.available) return;
    
    setSelectedSlot(slot);
    
    // Convert to datetime-local format for form
    const startDateTime = `${slot.date}T${slot.start}`;
    const endDateTime = `${slot.date}T${slot.end}`;
    
    setForm(prev => ({
      ...prev,
      startLocal: startDateTime,
      endLocal: endDateTime,
    }));
  }

  function toIso(localValue: string): string | null {
    if (!localValue) return null;
    const d = new Date(localValue);
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!ORG_ID) {
      setError("Systemfeil: organisasjon mangler i oppsett.");
      return;
    }

    const trimmedName = form.customerName.trim();
    const trimmedEmail = form.customerEmail.trim();
    const trimmedPhone = form.customerPhone.trim();
    const trimmedService = form.serviceName.trim();

    if (!trimmedName) {
      setError("Navn må fylles ut.");
      return;
    }
    if (!trimmedEmail && !trimmedPhone) {
      setError("Minst én av e-post eller telefon må fylles ut.");
      return;
    }
    if (!trimmedService) {
      setError("Tjeneste må fylles ut.");
      return;
    }

    const startIso = toIso(form.startLocal);
    const endIso = toIso(form.endLocal);

    if (!startIso || !endIso) {
      setError("Start- og sluttid må fylles ut.");
      return;
    }

    setSubmitting(true);
    try {
      const url = getPublicBookingUrl();

      const payload = {
        startTime: startIso,
        endTime: endIso,
        customerName: trimmedName,
        customerEmail: trimmedEmail || null,
        customerPhone: trimmedPhone || null,
        serviceName: trimmedService,
        notes: form.notes.trim() || null,
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error(
          "[PublicBookingPageClient] create public booking error",
          res.status,
          await res.text()
        );
        setError(
          "Kunne ikke sende inn forespørselen. Prøv igjen, eller ta kontakt på telefon."
        );
        return;
      }

      setForm(EMPTY_FORM);
      setSuccessMessage(
        "Takk! Forespørselen er sendt. Du får bekreftelse når vi har gått gjennom ønsket tidspunkt."
      );
    } catch (err) {
      console.error("[PublicBookingPageClient] submit error", err);
      setError(
        "Noe gikk galt under innsending. Prøv igjen senere eller kontakt oss direkte."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-10">
      <header className="mb-8">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          LYXso • Online booking
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          Bestill time
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Fyll inn ønsket tidspunkt og kontaktinformasjon, så bekrefter vi
          bookingen så fort som mulig.
        </p>
      </header>

      <main className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        {error && (
          <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-3 rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Navn
              </label>
              <input
                type="text"
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                value={form.customerName}
                onChange={(e) => handleChange("customerName", e.target.value)}
                placeholder="F.eks. Ola Nordmann"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                E-post
              </label>
              <input
                type="email"
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                value={form.customerEmail}
                onChange={(e) => handleChange("customerEmail", e.target.value)}
                placeholder="kunde@epost.no"
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Telefon
              </label>
              <input
                type="tel"
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                value={form.customerPhone}
                onChange={(e) => handleChange("customerPhone", e.target.value)}
                placeholder="Mobilnummer"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Du kan fylle ut enten e-post, telefon – eller begge.
              </p>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Ønsket tjeneste
              </label>
              <input
                type="text"
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                value={form.serviceName}
                onChange={(e) => handleChange("serviceName", e.target.value)}
                placeholder="F.eks. Keramisk coating, polering, dekkhotell …"
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Ønsket starttid
              </label>
              <input
                type="datetime-local"
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                value={form.startLocal}
                onChange={(e) => handleChange("startLocal", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Ønsket sluttid
              </label>
              <input
                type="datetime-local"
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                value={form.endLocal}
                onChange={(e) => handleChange("endLocal", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Kommentar (valgfritt)
            </label>
            <textarea
              className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
              rows={3}
              value={form.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Skriv gjerne inn registreringsnummer, spesielle ønsker eller annen info."
            />
          </div>

          <div className="mt-4 flex items-center justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-slate-900 px-5 py-2 text-xs font-medium text-slate-50 hover:bg-slate-800 disabled:opacity-60"
            >
              {submitting ? "Sender …" : "Send forespørsel"}
            </button>
          </div>
        </form>
      </main>

      <footer className="mt-6 text-center text-[11px] text-slate-400">
        Forespørselen blir lagret som{" "}
        <span className="font-medium">“pending”</span> booking i systemet, og
        dere kan bekrefte den i intern bookingkalender.
      </footer>
    </div>
  );
}
