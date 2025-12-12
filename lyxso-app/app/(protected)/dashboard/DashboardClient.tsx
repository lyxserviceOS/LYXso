"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AIModuleCard } from "@/components/ai/AIModuleCard";
import { SetupWizard } from "@/components/onboarding/SetupWizard";
import OnboardingGuide from "@/components/onboarding/OnboardingGuide";
import { Calendar, Megaphone, Calculator } from "lucide-react";

type Booking = {
  id: string;
  org_id: string | null;
  customer_id: string | null;
  customer_name: string | null;
  service_name: string | null;
  status: string | null;
  start_time: string | null;
  end_time: string | null;
  created_at: string | null;
  updated_at: string | null;
  notes: string | null;
};

type DashboardStats = {
  todayCount: number;
  weekCount: number;
  monthCount: number;
  totalCustomers: number;
  upcoming: Booking[];
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID;

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getCurrentWeekBounds(today: Date): { start: Date; end: Date } {
  const start = startOfDay(today);
  // getDay(): søndag = 0, mandag = 1, ... → vi vil ha mandag som start
  const dayOfWeek = start.getDay();
  const offsetFromMonday = (dayOfWeek + 6) % 7; // 0 for mandag, 6 for søndag
  start.setDate(start.getDate() - offsetFromMonday);

  const end = new Date(start);
  end.setDate(start.getDate() + 6); // mandag–søndag

  return { start, end };
}

function calculateStats(bookings: Booking[]): DashboardStats {
  const now = new Date();
  const today = startOfDay(now);
  const { start: weekStart, end: weekEnd } = getCurrentWeekBounds(now);

  let todayCount = 0;
  let weekCount = 0;
  let monthCount = 0;

  const customerIds = new Set<string>();
  const upcoming: Booking[] = [];

  for (const b of bookings) {
    if (b.customer_id) {
      customerIds.add(b.customer_id);
    } else if (b.customer_name) {
      customerIds.add(`name:${b.customer_name}`);
    }

    if (!b.start_time) continue;

    const start = new Date(b.start_time);
    const startDay = startOfDay(start);

    // Dagens bookinger
    if (startDay.getTime() === today.getTime()) {
      todayCount += 1;
    }

    // Ukens bookinger (mandag–søndag)
    if (startDay >= weekStart && startDay <= weekEnd) {
      weekCount += 1;
    }

    // Månedens bookinger
    if (
      startDay.getFullYear() === today.getFullYear() &&
      startDay.getMonth() === today.getMonth()
    ) {
      monthCount += 1;
    }

    // Kommende bookinger (fra nå og fremover)
    if (start >= now) {
      upcoming.push(b);
    }
  }

  upcoming.sort((a, b) => {
    const da = a.start_time ? new Date(a.start_time).getTime() : 0;
    const db = b.start_time ? new Date(b.start_time).getTime() : 0;
    return da - db;
  });

  return {
    todayCount,
    weekCount,
    monthCount,
    totalCustomers: customerIds.size,
    upcoming,
  };
}

function formatDateTime(value: string | null): string {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";

  const date = d.toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "2-digit",
  });
  const time = d.toLocaleTimeString("nb-NO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${date} kl. ${time}`;
}

export function DashboardClient() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBookings() {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !ORG_ID) {
        setError(
          "Mangler SUPABASE-konfigurasjon (NEXT_PUBLIC_SUPABASE_URL / ANON_KEY / ORG_ID)."
        );
        setLoading(false);
        return;
      }

      try {
        const url = new URL(`${SUPABASE_URL}/rest/v1/bookings`);
        // filter på org_id + hent relevante felter
        url.searchParams.set("org_id", `eq.${ORG_ID}`);
        url.searchParams.set(
          "select",
          [
            "id",
            "org_id",
            "customer_id",
            "customer_name",
            "service_name",
            "status",
            "start_time",
            "end_time",
            "created_at",
            "updated_at",
            "notes",
          ].join(",")
        );
        // sortér på start_time stigende
        url.searchParams.set("order", "start_time.asc");

        const res = await fetch(url.toString(), {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(
            `Feil ved henting av bookinger (${res.status}): ${text}`
          );
        }

        const data = (await res.json()) as Booking[];
        setBookings(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err: any) {
        console.error("Feil ved henting av bookinger:", err);
        setError(
          err?.message ??
            "Uventet feil ved henting av bookinger. Se konsoll for detaljer."
        );
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, []);

  const stats = useMemo(() => calculateStats(bookings), [bookings]);
  const hasUpcoming = stats.upcoming.length > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400">Laster dashboard …</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <p className="text-red-400 text-sm font-medium mb-2">
            Klarte ikke å laste dashboardet.
          </p>
          <p className="text-slate-400 text-xs leading-relaxed">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8 lg:py-10">
        {/* Onboarding Guide - New comprehensive guide */}
        <div className="mb-8">
          <OnboardingGuide />
        </div>

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
              Her ser du dagens bookinger, trykket resten av uken og en kjapp
              oversikt over hvordan kalenderen din ser ut.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-slate-300">
            <span className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1">
              Org-ID aktivert
            </span>
            <span className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1">
              Bookinger fra Supabase
            </span>
          </div>
        </div>

        {/* KPI-kort */}
        <div className="grid gap-4 md:grid-cols-4">
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
              Bookinger fra mandag til søndag denne uken.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Denne måneden
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-50">
              {stats.monthCount}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Totalt antall bookinger i inneværende måned.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Kunder i systemet
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-50">
              {stats.totalCustomers}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Estimert antall unike kunder basert på bookingene.
            </p>
          </div>
        </div>

        {/* Kommende bookinger */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 lg:p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  KOMMENDE JOBBER
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  Neste bookinger i kalenderen din.
                </p>
              </div>
            </div>

            {hasUpcoming ? (
              <ul className="divide-y divide-slate-800/80">
                {stats.upcoming.slice(0, 8).map((b) => (
                  <li
                    key={b.id}
                    className="flex items-center justify-between py-3 gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-50 truncate">
                        {b.service_name || "Booking"}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {b.customer_name || "Ukjent kunde"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-slate-200">
                        {formatDateTime(b.start_time)}
                      </p>
                      <p className="text-[11px] text-slate-500 uppercase tracking-[0.16em]">
                        {b.status || "pending"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-6 text-center text-sm text-slate-400">
                Ingen kommende bookinger enda. Når du legger inn bookinger i
                Supabase, dukker de opp her automatisk.
              </div>
            )}
          </div>

          {/* Sidepanel med “systemstatus” */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                SYSTEMSTATUS
              </p>
              <ul className="mt-3 space-y-2 text-xs text-slate-300">
                <li className="flex items-center justify-between">
                  <span>Supabase tilkobling</span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400 border border-emerald-500/40">
                    OK
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Org-ID</span>
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-200">
                    {ORG_ID?.slice(0, 8)}…
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Bookinger fra database</span>
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-200">
                    {bookings.length}
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                NESTE STEG
              </p>
              <ul className="mt-3 space-y-2 text-xs text-slate-300">
                <li>• Legg til flere bookinger i Supabase for å teste.</li>
                <li>• Koble dashboardet mot booking-kalenderen.</li>
                <li>• Koble inn omsetning (payments_summary) og KPI-grafer.</li>
              </ul>
            </div>

            {/* AI-moduler for rask tilgang */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 px-1">
                AI-ASSISTENTER
              </p>
              
              <AIModuleCard
                module="booking"
                title="AI Booking"
                description="Optimaliser bookinger med AI"
                icon={Calendar}
                href="/ai/booking"
                benefits={["Smart booking", "Automatisk planlegging", "Optimalisering"]}
                isLocked={false}
                gradientFrom="from-blue-500"
                gradientTo="to-cyan-500"
                stats={{ value: "12", label: "I dag" }}
              />

              <AIModuleCard
                module="marketing"
                title="AI Marketing"
                description="Generer kampanjer automatisk"
                icon={Megaphone}
                href="/ai/marketing"
                benefits={["Kampanjegenerering", "Automatisk posting", "Målgruppesegmentering"]}
                isLocked={false}
                gradientFrom="from-pink-500"
                gradientTo="to-purple-500"
                stats={{ value: "8", label: "Aktive" }}
              />

              <AIModuleCard
                module="accounting"
                title="AI Regnskap"
                description="Automatisk finansiell analyse"
                icon={Calculator}
                href="/ai/accounting"
                benefits={["Automatisk kategorisering", "Finansiell analyse", "Rapportgenerering"]}
                isLocked={false}
                gradientFrom="from-emerald-500"
                gradientTo="to-teal-500"
                stats={{ value: "485k", label: "Omsetning" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
