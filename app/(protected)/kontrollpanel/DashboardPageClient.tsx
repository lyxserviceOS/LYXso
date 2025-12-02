// app/(protected)/kontrollpanel/DashboardPageClient.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Booking, BookingStatus, BookingSource, PaymentStatus } from "@/types/booking";
import { useOrgPlan } from "@/lib/useOrgPlan";
import {
  getOrgPlanLabel,
  getOrgPlanShortInfo,
  getOrgPlanPriceInfo,
} from "@/lib/orgPlan";

// API-konfig
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001";
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
      if (!ORG_ID) {
        console.error("Mangler ORG_ID i kontrollpanel");
        setBookingsError("Mangler organisasjons-ID");
        setBookingsLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${API_BASE_URL}/api/orgs/${ORG_ID}/bookings`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
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
        const bookingsArray = json.bookings || [];
        
        if (!Array.isArray(bookingsArray)) {
          setBookings([]);
          setBookingsLoading(false);
          return;
        }

        const mapped: Booking[] = bookingsArray.map((item: Record<string, unknown>) => ({
          id: item.id as string,
          orgId: (item.orgId as string) || "",
          customerId: (item.customerId as string) || null,
          serviceId: (item.serviceId as string) || null,
          employeeId: (item.employeeId as string) || null,
          locationId: (item.locationId as string) || null,
          resourceId: (item.resourceId as string) || null,
          customerName:
            (item.customerName as string) || "Ukjent kunde",
          serviceName:
            (item.serviceName as string) || "Uspesifisert tjeneste",
          startTime: (item.startTime as string) || null,
          endTime: (item.endTime as string) || null,
          status: ((item.status as string) || "pending") as BookingStatus,
          title: (item.title as string) || null,
          notes: (item.notes as string) || null,
          internalNotes: (item.internalNotes as string) || null,
          source: ((item.source as string) || "manual") as BookingSource,
          referralCode: (item.referralCode as string) || null,
          campaignId: (item.campaignId as string) || null,
          totalAmount: (item.totalAmount as number) || null,
          depositAmount: (item.depositAmount as number) || null,
          discountAmount: (item.discountAmount as number) || null,
          currency: (item.currency as string) || null,
          paymentStatus: ((item.paymentStatus as string) || "not_required") as PaymentStatus,
          isRecurring: (item.isRecurring as boolean) || false,
          recurrenceRule: (item.recurrenceRule as string) || null,
          parentBookingId: (item.parentBookingId as string) || null,
          seriesId: (item.seriesId as string) || null,
          seriesIndex: (item.seriesIndex as number) || null,
          createdAt: (item.createdAt as string) || null,
          updatedAt: (item.updatedAt as string) || null,
          confirmedAt: (item.confirmedAt as string) || null,
          completedAt: (item.completedAt as string) || null,
          cancelledAt: (item.cancelledAt as string) || null,
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
        {/* Topp: tittel + plan-info (kun for gratis plan) */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#94A3B8]">
              HJEM • DASHBOARD
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#0F172A]">
              Dashboard
            </h1>
            <p className="mt-1 max-w-xl text-sm text-[#475569]">
              Oversikt over drift, bookinger og abonnement for din
              LYXso-partner.
            </p>
          </div>

          {/* Vis plan-info kun for gratisplanen */}
          {!planLoading && !planError && plan === "free" && (
            <div className="rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 text-xs shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                LYXso-plan
              </p>

              <p className="mt-2 text-sm font-semibold text-[#0F172A]">
                {getOrgPlanLabel(plan)}
              </p>
              <p className="text-[11px] text-[#64748B]">
                {getOrgPlanPriceInfo(plan)}
              </p>
              <p className="mt-1 text-[11px] text-[#94A3B8]">
                {getOrgPlanShortInfo(plan)}
              </p>

              <Link
                href="/plan"
                className="mt-3 inline-flex items-center justify-center rounded-lg border border-[#2563EB] bg-[#DBEAFE] px-3 py-1.5 text-[11px] font-medium text-[#1D4ED8] hover:bg-[#BFDBFE]"
              >
                Oppgrader plan
              </Link>
            </div>
          )}
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
            {/* Health Meter */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                Bedriftshelse
              </p>
              <div className="mt-3 flex items-center gap-4">
                <div className="relative h-20 w-20">
                  <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#22C55E"
                      strokeWidth="3"
                      strokeDasharray="75, 100"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-[#0F172A]">75</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#0F172A]">God</p>
                  <p className="text-[11px] text-[#64748B]">
                    Basert på utnyttelse, gjentakskunder og no-show rate
                  </p>
                </div>
              </div>
              <div className="mt-3 space-y-1 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Kapasitetsutnyttelse</span>
                  <span className="text-[#22C55E]">82%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Gjentakskunder</span>
                  <span className="text-[#22C55E]">68%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">No-show rate</span>
                  <span className="text-[#F59E0B]">5%</span>
                </div>
              </div>
            </div>

            {/* Revenue summary */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 text-xs text-[#475569] shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                  Omsetning
                </p>
                <select className="text-[10px] border border-[#E2E8F0] rounded px-2 py-1">
                  <option>Denne måned</option>
                  <option>Forrige måned</option>
                  <option>Siste 90 dager</option>
                </select>
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-[#64748B]">Total</span>
                  <span className="text-lg font-semibold text-[#0F172A]">42 500 kr</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-[#64748B]">Snitt per booking</span>
                  <span className="font-medium text-[#0F172A]">1 890 kr</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-[#64748B]">vs forrige periode</span>
                  <span className="font-medium text-[#22C55E]">+12%</span>
                </div>
              </div>
              <div className="mt-4 h-20 rounded-lg bg-gradient-to-r from-[#DBEAFE] to-[#E0F2FE] flex items-end justify-around px-2 pb-2">
                {[35, 45, 55, 40, 60, 50, 70].map((h, i) => (
                  <div 
                    key={i} 
                    className="w-3 bg-[#2563EB] rounded-t"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Export buttons */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 text-xs shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94A3B8] mb-3">
                Eksporter data
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex-1 rounded-lg border border-[#E2E8F0] px-3 py-2 text-[11px] font-medium text-[#475569] hover:bg-[#F8FAFC]"
                >
                  📊 CSV
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-lg border border-[#E2E8F0] px-3 py-2 text-[11px] font-medium text-[#475569] hover:bg-[#F8FAFC]"
                >
                  📈 Excel
                </button>
              </div>
              <p className="mt-2 text-[10px] text-[#94A3B8]">
                Eksporter bookinger, kunder eller omsetning for valgt periode.
              </p>
            </div>
          </div>
        </section>

        {/* Additional KPIs row */}
        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
              Fullførte
            </p>
            <p className="mt-2 text-2xl font-semibold text-[#22C55E]">
              {bookings.filter(b => b.status === "completed").length}
            </p>
            <p className="mt-1 text-[10px] text-[#64748B]">denne måneden</p>
          </div>
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
              Kansellert
            </p>
            <p className="mt-2 text-2xl font-semibold text-[#EF4444]">
              {bookings.filter(b => b.status === "cancelled").length}
            </p>
            <p className="mt-1 text-[10px] text-[#64748B]">denne måneden</p>
          </div>
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
              Coating-jobber
            </p>
            <p className="mt-2 text-2xl font-semibold text-[#8B5CF6]">0</p>
            <p className="mt-1 text-[10px] text-[#64748B]">aktive garantier</p>
          </div>
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
              Dekkhotell
            </p>
            <p className="mt-2 text-2xl font-semibold text-[#0EA5E9]">0</p>
            <p className="mt-1 text-[10px] text-[#64748B]">sett på lager</p>
          </div>
        </section>

        {/* Bunntekst / forklaring */}
        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 text-xs text-[#64748B]">
          <p>
            Bookingtallene over er ekte, hentet fra Supabase for valgt
            partner. Økonomi-tall og helse-score er demonstrasjonsdata som vil 
            kobles mot ekte transaksjoner når betaling er satt opp.
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
