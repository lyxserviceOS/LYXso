"use client";

import React, { useEffect, useState } from "react";
import type { Booking, BookingStatus, BookingSource, PaymentStatus } from "../types/booking";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const ORG_ID =
  process.env.NEXT_PUBLIC_ORG_ID ??
  "ae407558-7f44-40cb-8fe9-1d023212b926";

type DashboardStats = {
  todayCount: number;
  weekCount: number;
  upcoming: Booking[];
};

function calculateStats(bookings: Booking[]): DashboardStats {
  const now = new Date();

  // I enkel versjon bruker vi UTC-dato – senere kan vi finjustere til Europe/Oslo
  const todayIso = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  )
    .toISOString()
    .slice(0, 10); // YYYY-MM-DD

  // Finn start på denne uken (mandag)
  const day = now.getDay(); // 0 = søn, 1 = man, ...
  const diffToMonday = (day + 6) % 7; // antall dager siden mandag
  const monday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - diffToMonday
  );
  const mondayIso = monday.toISOString().slice(0, 10);

  let todayCount = 0;
  let weekCount = 0;

  const futureBookings: Booking[] = [];

  for (const b of bookings) {
    if (!b.startTime) continue;

    const d = new Date(b.startTime);
    const dateIso = d.toISOString().slice(0, 10);

    if (dateIso === todayIso) {
      todayCount += 1;
    }

    if (dateIso >= mondayIso) {
      weekCount += 1;
    }

    if (d >= now) {
      futureBookings.push(b);
    }
  }

  // Sorter kommende bookinger etter starttid og ta topp 5
  futureBookings.sort((a, b) => {
    const da = a.startTime ? new Date(a.startTime).getTime() : 0;
    const db = b.startTime ? new Date(b.startTime).getTime() : 0;
    return da - db;
  });

  const upcoming = futureBookings.slice(0, 5);

  return {
    todayCount,
    weekCount,
    upcoming,
  };
}

function formatTime(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "-";

  return d.toLocaleTimeString("nb-NO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "-";

  return d.toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function DashboardClient() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookings() {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !ORG_ID) {
        console.error("Mangler Supabase-konfigurasjon");
        setError("Mangler Supabase-konfigurasjon");
        setLoading(false);
        return;
      }

      try {
        console.log("Dashboard client fetching bookings with config:", {
          url: SUPABASE_URL,
          hasKey: !!SUPABASE_ANON_KEY,
          orgId: ORG_ID,
        });

        const headers = {
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          apikey: SUPABASE_ANON_KEY,
          "Content-Type": "application/json",
        };

        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/bookings?org_id=eq.${ORG_ID}`,
          { headers }
        );

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Bookings API error:", {
            status: res.status,
            statusText: res.statusText,
            body: errorText,
            url: `${SUPABASE_URL}/rest/v1/bookings?org_id=eq.${ORG_ID}`,
          });
          setError(`Feil ved henting av bookinger: ${res.status}`);
          setLoading(false);
          return;
        }

        const json = await res.json();
        console.log(
          "Dashboard client successfully fetched bookings:",
          json?.length || 0,
          "items"
        );

        if (!Array.isArray(json)) {
          setBookings([]);
          setLoading(false);
          return;
        }

        // Map database fields (snake_case) to TypeScript interface (camelCase)
        const mappedBookings: Booking[] = json.map((item: Record<string, unknown>) => ({
          id: item.id as string,
          orgId: (item.org_id as string) || "",
          customerId: (item.customer_id as string) || null,
          serviceId: (item.service_id as string) || null,
          employeeId: (item.employee_id as string) || null,
          locationId: (item.location_id as string) || null,
          resourceId: (item.resource_id as string) || null,
          customerName:
            (item.customer_name as string) ||
            (item.customerName as string) ||
            "Ukjent kunde",
          serviceName:
            (item.service_name as string) ||
            (item.serviceName as string) ||
            "Uspesifisert tjeneste",
          startTime: (item.start_time as string) || (item.startTime as string) || null,
          endTime: (item.end_time as string) || (item.endTime as string) || null,
          status: ((item.status as string) || "pending") as BookingStatus,
          title: (item.title as string) || null,
          notes: (item.notes as string) || null,
          internalNotes: (item.internal_notes as string) || null,
          source: ((item.source as string) || "manual") as BookingSource,
          referralCode: (item.referral_code as string) || null,
          campaignId: (item.campaign_id as string) || null,
          totalAmount: (item.total_amount as number) || null,
          depositAmount: (item.deposit_amount as number) || null,
          discountAmount: (item.discount_amount as number) || null,
          currency: (item.currency as string) || null,
          paymentStatus: ((item.payment_status as string) || "not_required") as PaymentStatus,
          isRecurring: (item.is_recurring as boolean) || false,
          recurrenceRule: (item.recurrence_rule as string) || null,
          parentBookingId: (item.parent_booking_id as string) || null,
          createdAt: (item.created_at as string) || null,
          updatedAt: (item.updated_at as string) || null,
          confirmedAt: (item.confirmed_at as string) || null,
          completedAt: (item.completed_at as string) || null,
          cancelledAt: (item.cancelled_at as string) || null,
        }));

        setBookings(mappedBookings);
        setLoading(false);
      } catch (err) {
        console.error("Uventet feil ved henting av bookinger:", err);
        setError("Uventet feil ved henting av bookinger");
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  const stats = calculateStats(bookings);
  const hasUpcoming = stats.upcoming.length > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400">Laster dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8 lg:py-10">
        {/* Toppseksjon */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              HJEM • DASHBOARD
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50">
              Velkommen til LYXso-partnerpanelet
            </h1>
            <p className="mt-1 max-w-xl text-sm text-slate-400">
              Her ser du dagens bookinger, denne ukens trykk og kjappe
              snarveier til de viktigste delene av systemet.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-slate-300">
            <span className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1">
              Org-ID aktivert
            </span>
            <span className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1">
              Booking + Tjenester + Produkter
            </span>
          </div>
        </div>

        {/* KPI-kort */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Dagens bookinger
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-50">
              {stats.todayCount}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Antall planlagte jobber i kalenderen i dag.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Denne uken
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-50">
              {stats.weekCount}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Bookinger fra mandag og frem til nå.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Moduler
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-50">
              4
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Booking, Tjenester & produkter, CRM, Markedsføring{" "}
              <span className="text-[10px] text-emerald-400">
                (utvides senere)
              </span>
            </p>
          </div>
        </div>

        {/* Hovedgrid: kommende bookinger + snarveier */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Kommende bookinger */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Kommende bookinger
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  Neste avtaler i kalenderen din.
                </p>
              </div>
            </div>

            <div className="mt-3 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
              {hasUpcoming ? (
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-slate-800 bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
                    <tr>
                      <th className="px-4 py-3">Dato</th>
                      <th className="px-4 py-3">Tid</th>
                      <th className="px-4 py-3">Kunde</th>
                      <th className="px-4 py-3">Tjeneste</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.upcoming.map((b) => (
                      <tr
                        key={b.id}
                        className="border-t border-slate-800/80 hover:bg-slate-800/40"
                      >
                        <td className="px-4 py-3 text-xs text-slate-200">
                          {formatDate(b.startTime)}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-300">
                          {formatTime(b.startTime)}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-200">
                          {b.customerName || "Ukjent kunde"}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-200">
                          {b.serviceName || "Uspesifisert tjeneste"}
                        </td>
                        <td className="px-4 py-3 text-[11px]">
                          <span
                            className={[
                              "inline-flex rounded-full px-2 py-0.5",
                              b.status === "confirmed"
                                ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40"
                                : b.status === "completed"
                                ? "bg-blue-500/10 text-blue-300 border border-blue-500/40"
                                : b.status === "cancelled"
                                ? "bg-rose-500/10 text-rose-300 border border-rose-500/40"
                                : "bg-amber-500/10 text-amber-300 border border-amber-500/40",
                            ].join(" ")}
                          >
                            {b.status || "pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="px-4 py-6 text-sm text-slate-400">
                  Ingen kommende bookinger funnet.{" "}
                  <span className="text-slate-300">
                    Gå til Booking for å opprette den første.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Snarveier */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Snarveier
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Typiske ting du gjør daglig.
              </p>

              <div className="mt-4 space-y-2 text-xs">
                <a
                  href="/booking"
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 hover:border-blue-500/60 hover:bg-slate-900 hover:text-slate-50"
                >
                  <span>Åpne kalender / booking</span>
                  <span className="text-[11px] text-slate-400">
                    Shift + B
                  </span>
                </a>
                <a
                  href="/tjenester"
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 hover:border-blue-500/60 hover:bg-slate-900 hover:text-slate-50"
                >
                  <span>Justér tjenester og priser</span>
                  <span className="text-[11px] text-slate-400">
                    Shift + T
                  </span>
                </a>
                <a
                  href="/kunder"
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 hover:border-blue-500/60 hover:bg-slate-900 hover:text-slate-50"
                >
                  <span>Se kunder og historikk</span>
                  <span className="text-[11px] text-slate-400">
                    Shift + K
                  </span>
                </a>
                <a
                  href="/markedsforing"
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 hover:border-blue-500/60 hover:bg-slate-900 hover:text-slate-50"
                >
                  <span>Jobb med kampanjer og leads</span>
                  <span className="text-[11px] text-slate-400">
                    Shift + M
                  </span>
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Neste steg i LYXso
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Når du er klar kan vi bygge:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-300">
                <li>
                  Ekte kunderegister koblet til bookings (customer_id).
                </li>
                <li>Enkel omsetningsrapport per uke/måned.</li>
                <li>
                  Styring av moduler i Kontrollpanel (Booking Agent
                  m.m.).
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
