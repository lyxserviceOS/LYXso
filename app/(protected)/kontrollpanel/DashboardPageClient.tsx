// app/(protected)/kontrollpanel/DashboardPageClient.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Booking, BookingStatus } from "@/types/booking";
import { useOrgPlan } from "@/lib/useOrgPlan";
import {
  getOrgPlanLabel,
  getOrgPlanShortInfo,
  getOrgPlanPriceInfo,
} from "@/lib/orgPlan";

// Supabase-konfig (samme som i DashboardClient)
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

  // Enkle datoer (YYYY-MM-DD) – godt nok for V1
  const todayIso = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  )
    .toISOString()
    .slice(0, 10);

  // Start på uken (mandag)
  const day = now.getDay(); // 0 = søn
  const diffToMonday = (day + 6) % 7;
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
    if (Number.isNaN(d.getTime())) continue;

    const dateIso = d.toISOString().slice(0, 10);

    if (dateIso === todayIso) todayCount += 1;
    if (dateIso >= mondayIso) weekCount += 1;
    if (d >= now) futureBookings.push(b);
  }

  futureBookings.sort((a, b) => {
    const da = a.startTime ? new Date(a.startTime).getTime() : 0;
    const db = b.startTime ? new Date(b.startTime).getTime() : 0;
    return da - db;
  });

  return {
    todayCount,
    weekCount,
    upcoming: futureBookings.slice(0, 5),
  };
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

function formatTime(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "-";

  return d.toLocaleTimeString("nb-NO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DashboardPageClient() {
  const {
    plan,
    loading: planLoading,
    error: planError,
  } = useOrgPlan();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookings() {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !ORG_ID) {
        console.error("Mangler Supabase-konfigurasjon i kontrollpanel");
        setBookingsError("Mangler Supabase-konfigurasjon");
        setBookingsLoading(false);
        return;
      }

      try {
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
          const body = await res.text();
          console.error("Feil ved henting av bookinger:", {
            status: res.status,
            statusText: res.statusText,
            body,
          });
          setBookingsError(
            `Feil ved henting av bookinger (${res.status})`
          );
          setBookingsLoading(false);
          return;
        }

        const json = await res.json();
        if (!Array.isArray(json)) {
          setBookings([]);
          setBookingsLoading(false);
          return;
        }

        const mapped: Booking[] = json.map((item: Record<string, unknown>) => ({
          id: item.id as string,
          orgId: (item.org_id as string) || "",
          customerId: (item.customer_id as string) || null,
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
          source: (item.source as string) || null,
          totalAmount: (item.total_amount as number) || null,
          currency: (item.currency as string) || null,
          createdAt: (item.created_at as string) || null,
          updatedAt: (item.updated_at as string) || null,
        }));

        setBookings(mapped);
        setBookingsLoading(false);
      } catch (err) {
        console.error("Uventet feil ved henting av bookinger:", err);
        setBookingsError("Uventet feil ved henting av bookinger");
        setBookingsLoading(false);
      }
    }

    fetchBookings();
  }, []);

  const stats = calculateStats(bookings);
  const hasUpcoming = stats.upcoming.length > 0;

  return (
    <div className="h-full w-full bg-[#F8FAFC] px-6 py-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Topp: tittel + plan-info */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#94A3B8]">
              HJEM • KONTROLLPANEL
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#0F172A]">
              Kontrollpanel
            </h1>
            <p className="mt-1 max-w-xl text-sm text-[#475569]">
              Oversikt over drift, bookinger og abonnement for din
              LYXso-partner.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 text-xs shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
              LYXso-plan
            </p>

            {planLoading && (
              <p className="mt-2 text-sm text-[#64748B]">
                Henter plan …
              </p>
            )}

            {planError && (
              <p className="mt-2 text-sm text-[#EF4444]">
                Klarte ikke å hente plan.
              </p>
            )}

            {!planLoading && !planError && (
              <>
                <p className="mt-2 text-sm font-semibold text-[#0F172A]">
                  {getOrgPlanLabel(plan)}
                </p>
                <p className="text-[11px] text-[#64748B]">
                  {getOrgPlanPriceInfo(plan)}
                </p>
                <p className="mt-1 text-[11px] text-[#94A3B8]">
                  {getOrgPlanShortInfo(plan)}
                </p>
              </>
            )}

            <Link
              href="/plan"
              className="mt-3 inline-flex items-center justify-center rounded-lg border border-[#2563EB] bg-[#DBEAFE] px-3 py-1.5 text-[11px] font-medium text-[#1D4ED8] hover:bg-[#BFDBFE]"
            >
              Se / endre plan
            </Link>
          </div>
        </header>

        {/* KPI-kort */}
        <section className="grid gap-4 md:grid-cols-3">
          <KpiCard
            title="Dagens bookinger"
            subtitle="Bookinger registrert i dag"
            loading={bookingsLoading}
            error={!!bookingsError}
            value={stats.todayCount}
          />
          <KpiCard
            title="Denne uken"
            subtitle="Kommende bookinger fra mandag"
            loading={bookingsLoading}
            error={!!bookingsError}
            value={stats.weekCount}
          />
          <KpiCard
            title="Årskontroller coating"
            subtitle="Kontroller som bør følges opp (kommer)"
            loading={false}
            error={false}
            value={0}
          />
        </section>

        {/* Hovedgrid: kommende bookinger + info-paneler */}
        <section className="grid gap-6 lg:grid-cols-[2fr,1.1fr]">
          {/* Kommende bookinger */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                  Kommende bookinger
                </p>
                <p className="mt-1 text-xs text-[#64748B]">
                  Neste avtaler i kalenderen din.
                </p>
              </div>

              <Link
                href="/booking"
                className="rounded-lg bg-[#2563EB] px-3 py-1.5 text-[11px] font-medium text-white hover:bg-[#1D4ED8]"
              >
                Åpne full kalender
              </Link>
            </div>

            {/* Innhold */}
            <div className="mt-4 overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
              {bookingsLoading && (
                <div className="px-4 py-6 text-sm text-[#64748B]">
                  Laster bookinger …
                </div>
              )}

              {bookingsError && !bookingsLoading && (
                <div className="px-4 py-6 text-sm text-[#EF4444]">
                  {bookingsError}
                </div>
              )}

              {!bookingsLoading && !bookingsError && !hasUpcoming && (
                <div className="px-4 py-6 text-sm text-[#64748B]">
                  Ingen kommende bookinger funnet.
                  <span className="ml-1 text-[#0F172A]">
                    Gå til Booking for å opprette den første.
                  </span>
                </div>
              )}

              {!bookingsLoading && !bookingsError && hasUpcoming && (
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-[#E2E8F0] bg-[#F1F5F9] text-[11px] uppercase tracking-wide text-[#64748B]">
                    <tr>
                      <th className="px-4 py-3">Dato</th>
                      <th className="px-4 py-3">Tid</th>
                      <th className="px-4 py-3">Kunde</th>
                      <th className="px-4 py-3">Tjeneste</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {stats.upcoming.map((b) => (
                      <tr
                        key={b.id}
                        className="border-t border-[#E5E7EB] hover:bg-[#F9FAFB]"
                      >
                        <td className="px-4 py-3 text-xs text-[#0F172A]">
                          {formatDate(b.startTime)}
                        </td>
                        <td className="px-4 py-3 text-xs text-[#475569]">
                          {formatTime(b.startTime)}
                        </td>
                        <td className="px-4 py-3 text-xs text-[#0F172A]">
                          {b.customerName || "Ukjent kunde"}
                        </td>
                        <td className="px-4 py-3 text-xs text-[#0F172A]">
                          {b.serviceName || "Uspesifisert tjeneste"}
                        </td>
                        <td className="px-4 py-3 text-[11px]">
                          <StatusPill status={b.status || "pending"} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Høyre kolonne – info / placeholders */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 text-xs text-[#475569] shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                Omsetning (dummy-data)
              </p>
              <p className="mt-2">
                Her kommer grafer for månedlig omsetning, snittpris per jobb og
                fordeling mellom tjenester.
              </p>
              <div className="mt-4 h-28 rounded-xl border border-dashed border-[#E2E8F0] bg-[#F8FAFC]" />
            </div>

            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 text-xs text-[#475569] shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                Kapasitet & kalender
              </p>
              <p className="mt-2">
                Visuell oversikt over hvor mye kapasitet du har igjen denne
                uken, og hvilke dager som er fullbooket – koblet direkte mot
                bookingmotoren.
              </p>
              <div className="mt-4 h-24 rounded-xl border border-dashed border-[#E2E8F0] bg-[#F8FAFC]" />
            </div>
          </div>
        </section>

        {/* Bunntekst / forklaring */}
        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 text-xs text-[#64748B]">
          <p>
            Bookingtallene over er ekte, hentet fra Supabase for valgt
            partner. Økonomi, kapasitet og AI-statistikk er foreløpig
            placeholders mens vi bygger de neste modulene.
          </p>
        </section>
      </div>
    </div>
  );
}

type KpiCardProps = {
  title: string;
  subtitle: string;
  value: number;
  loading: boolean;
  error: boolean;
};

function KpiCard({
  title,
  subtitle,
  value,
  loading,
  error,
}: KpiCardProps) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
      <p className="text-xs font-medium text-[#64748B]">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-[#0F172A]">
        {loading ? "…" : error ? "–" : value}
      </p>
      <p className="mt-1 text-[11px] text-[#94A3B8]">{subtitle}</p>
    </div>
  );
}

type StatusPillProps = {
  status: string;
};

function StatusPill({ status }: StatusPillProps) {
  const normalized = status.toLowerCase();

  let label = status;
  let classes =
    "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px]";

  if (normalized === "confirmed") {
    classes +=
      " border-[#86EFAC] bg-[#DCFCE7] text-[#166534]";
    label = "Bekreftet";
  } else if (normalized === "completed") {
    classes +=
      " border-[#93C5FD] bg-[#DBEAFE] text-[#1D4ED8]";
    label = "Fullført";
  } else if (normalized === "cancelled") {
    classes +=
      " border-[#FCA5A5] bg-[#FEE2E2] text-[#B91C1C]";
    label = "Kansellert";
  } else {
    classes +=
      " border-[#FED7AA] bg-[#FFEDD5] text-[#C2410C]";
    label = "Planlagt";
  }

  return <span className={classes}>{label}</span>;
}
