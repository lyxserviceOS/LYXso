// app/(protected)/partnere/[orgId]/PartnerDetailPageClient.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

type Org = {
  id: string;
  created_at: string;
  name: string | null;
  org_number: string | null;
  logo_url?: string | null;
  is_active: boolean | null;
  plan: string | null;
};

type Booking = {
  id: string;
  orgId?: string;
  customerId?: string | null;
  employeeId?: string | null;
  serviceId?: string | null;
  customerName?: string | null;
  serviceName?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  status?: string;
};

type Customer = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
};

type Employee = {
  id: string;
  name: string;
};

type CoatingJob = {
  id: string;
};

type TyreSet = {
  id: string;
};

type Lead = {
  id: string;
  created_at: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  source: string | null;
  status: string | null;
};

type PartnerStats = {
  bookingsTotal: number;
  bookingsUpcoming: number;
  customersTotal: number;
  employeesTotal: number;
  leadsTotal: number;
  coatingJobsTotal: number;
  tyreSetsTotal: number;
};

export default function PartnerDetailPageClient() {
  const params = useParams();
  const router = useRouter();
  const orgId = (params?.orgId as string) || "";

  const [org, setOrg] = useState<Org | null>(null);
  const [stats, setStats] = useState<PartnerStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orgId) return;
    if (!API_BASE) {
      setError("Mangler NEXT_PUBLIC_API_BASE.");
      setLoading(false);
      return;
    }

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const orgPromise = fetch(
          `${API_BASE}/api/admin/orgs/${orgId}`
        ).then(async (res) => {
          if (!res.ok) {
            const text = await res.text();
            throw new Error(
              `Feil ved henting av org: ${res.status} ${res.statusText} - ${text}`
            );
          }
          const json = await res.json();
          return json?.org as Org;
        });

        const bookingsPromise = fetch(
          `${API_BASE}/api/orgs/${orgId}/bookings`
        ).then(async (res) => {
          if (!res.ok) return { bookings: [] as Booking[] };
          const json = await res.json();
          return json as { bookings: Booking[] };
        });

        const customersPromise = fetch(
          `${API_BASE}/api/orgs/${orgId}/customers`
        ).then(async (res) => {
          if (!res.ok) return { customers: [] as Customer[] };
          const json = await res.json();
          return json as { customers: Customer[] };
        });

        const employeesPromise = fetch(
          `${API_BASE}/api/orgs/${orgId}/employees`
        ).then(async (res) => {
          if (!res.ok) return { employees: [] as Employee[] };
          const json = await res.json();
          return json as { employees: Employee[] };
        });

        const coatingJobsPromise = fetch(
          `${API_BASE}/api/orgs/${orgId}/coating-jobs`
        ).then(async (res) => {
          if (!res.ok) return { jobs: [] as CoatingJob[] };
          const json = await res.json();
          return json as { jobs: CoatingJob[] };
        });

        const tyreSetsPromise = fetch(
          `${API_BASE}/api/orgs/${orgId}/tyre-sets`
        ).then(async (res) => {
          if (!res.ok) return { tyreSets: [] as TyreSet[] };
          const json = await res.json();
          return json as { tyreSets: TyreSet[] };
        });

        const leadsPromise = fetch(
          `${API_BASE}/orgs/${orgId}/leads`
        ).then(async (res) => {
          if (!res.ok) return { leads: [] as Lead[] };
          const json = await res.json();
          return json as { leads: Lead[] };
        });

        const [
          orgData,
          bookingsData,
          customersData,
          employeesData,
          coatingJobsData,
          tyreSetsData,
          leadsData,
        ] = await Promise.all([
          orgPromise,
          bookingsPromise,
          customersPromise,
          employeesPromise,
          coatingJobsPromise,
          tyreSetsPromise,
          leadsPromise,
        ]);

        setOrg(orgData ?? null);

        const allBookings = bookingsData.bookings ?? [];
        const allLeads = leadsData.leads ?? [];
        setBookings(allBookings);
        setLeads(allLeads);

        const now = new Date();
        const upcomingCount = allBookings.filter((b) => {
          if (!b.startTime) return false;
          const dt = new Date(b.startTime);
          return dt >= now;
        }).length;

        const s: PartnerStats = {
          bookingsTotal: allBookings.length,
          bookingsUpcoming: upcomingCount,
          customersTotal: (customersData.customers ?? []).length,
          employeesTotal: (employeesData.employees ?? []).length,
          leadsTotal: allLeads.length,
          coatingJobsTotal: (coatingJobsData.jobs ?? []).length,
          tyreSetsTotal: (tyreSetsData.tyreSets ?? []).length,
        };

        setStats(s);
      } catch (err: unknown) {
        console.error(err);
        const errorMessage = err instanceof Error ? err.message : "Ukjent feil ved henting av partner-data.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [orgId]);

  if (!orgId) {
    return (
      <div className="max-w-4xl mx-auto text-sm">
        <p className="text-red-600">
          Mangler orgId i URL. Siden må åpnes via partnerlisten.
        </p>
      </div>
    );
  }

  const planLabel = (planRaw: string | null) => {
    const p = (planRaw ?? "free").toLowerCase();
    if (p === "pro") return "Pro";
    if (p === "partner") return "Partner";
    return "Free";
  };

  const statusBadge = (isActive: boolean | null) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center rounded-full border border-emerald-500 bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-800">
          Aktiv
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full border border-slate-400 bg-slate-50 px-2 py-0.5 text-[10px] text-slate-700">
        Deaktivert
      </span>
    );
  };

  const createdText =
    org?.created_at && !Number.isNaN(Date.parse(org.created_at))
      ? new Date(org.created_at).toLocaleString("nb-NO", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "-";

  const latestBookings = bookings.slice(0, 5);
  const latestLeads = leads.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-sm">
      <div className="flex items-center justify-between">
        <div>
          <button
            type="button"
            onClick={() => router.push("/partnere")}
            className="text-[11px] text-slate-500 hover:text-slate-800"
          >
            ← Tilbake til partnere
          </button>
          <h1 className="mt-1 text-2xl font-semibold">
            {org?.name || "Partner"}
          </h1>
          <p className="mt-1 text-slate-600">
            Adminpanel for partneren sin organisasjon i LYXso. Her ser du
            enkle nøkkeltall for bookinger, kunder, leads og mer.
          </p>
        </div>
        {org && (
          <div className="flex flex-col items-end gap-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-slate-300 bg-slate-50 px-2 py-0.5 text-[10px] text-slate-700">
                Plan: {planLabel(org.plan)}
              </span>
              {statusBadge(org.is_active)}
            </div>
            <div className="text-[11px] text-slate-500">
              Org.nr: {org.org_number || "–"}
            </div>
            <div className="text-[11px] text-slate-500">
              Opprettet: {createdText}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-[11px] text-red-600">
          {error}
        </p>
      )}

      {loading && (
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
          Laster partner-data …
        </div>
      )}

      {!loading && org && stats && (
        <>
          {/* Nøkkeltall */}
          <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-7">
            <StatCard
              label="Bookinger (totalt)"
              value={stats.bookingsTotal}
            />
            <StatCard
              label="Kommende bookinger"
              value={stats.bookingsUpcoming}
            />
            <StatCard
              label="Kunder"
              value={stats.customersTotal}
            />
            <StatCard
              label="Ansatte"
              value={stats.employeesTotal}
            />
            <StatCard
              label="Leads"
              value={stats.leadsTotal}
            />
            <StatCard
              label="Coating-jobber"
              value={stats.coatingJobsTotal}
            />
            <StatCard
              label="Dekksett"
              value={stats.tyreSetsTotal}
            />
          </div>

          {/* Senere kan du legge til grafer her – omsetning, bookingkurver osv. */}

          <div className="grid gap-4 lg:grid-cols-2">
            {/* Siste bookinger */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h2 className="text-sm font-medium">
                Siste bookinger
              </h2>
              <p className="mt-1 text-[11px] text-slate-500">
                En enkel liste over de siste 5 bookingene registrert i
                systemet.
              </p>
              {latestBookings.length === 0 && (
                <p className="mt-3 text-xs text-slate-500">
                  Ingen bookinger registrert ennå.
                </p>
              )}
              {latestBookings.length > 0 && (
                <div className="mt-3 overflow-x-auto">
                  <table className="min-w-full border-separate border-spacing-y-1 text-[11px]">
                    <thead>
                      <tr className="text-left text-[10px] uppercase tracking-[0.12em] text-slate-500">
                        <th className="px-2 py-1">Dato</th>
                        <th className="px-2 py-1">Kunde</th>
                        <th className="px-2 py-1">Tjeneste</th>
                        <th className="px-2 py-1">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {latestBookings.map((b) => {
                        const dt =
                          b.startTime &&
                          !Number.isNaN(Date.parse(b.startTime))
                            ? new Date(b.startTime)
                            : null;
                        const dateText = dt
                          ? dt.toLocaleString("nb-NO", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })
                          : "-";

                        return (
                          <tr
                            key={b.id}
                            className="bg-slate-50 hover:bg-slate-100"
                          >
                            <td className="px-2 py-1">{dateText}</td>
                            <td className="px-2 py-1">
                              {b.customerName || "–"}
                            </td>
                            <td className="px-2 py-1">
                              {b.serviceName || "–"}
                            </td>
                            <td className="px-2 py-1">
                              {b.status || "–"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Siste leads */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h2 className="text-sm font-medium">
                Siste leads
              </h2>
              <p className="mt-1 text-[11px] text-slate-500">
                De siste 5 leadene som er registrert på denne partneren.
              </p>
              {latestLeads.length === 0 && (
                <p className="mt-3 text-xs text-slate-500">
                  Ingen leads registrert ennå.
                </p>
              )}
              {latestLeads.length > 0 && (
                <div className="mt-3 overflow-x-auto">
                  <table className="min-w-full border-separate border-spacing-y-1 text-[11px]">
                    <thead>
                      <tr className="text-left text-[10px] uppercase tracking-[0.12em] text-slate-500">
                        <th className="px-2 py-1">Dato</th>
                        <th className="px-2 py-1">Navn</th>
                        <th className="px-2 py-1">Kontakt</th>
                        <th className="px-2 py-1">Kilde</th>
                        <th className="px-2 py-1">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {latestLeads.map((l) => {
                        const dt =
                          l.created_at &&
                          !Number.isNaN(Date.parse(l.created_at))
                            ? new Date(l.created_at)
                            : null;
                        const dateText = dt
                          ? dt.toLocaleString("nb-NO", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })
                          : "-";

                        return (
                          <tr
                            key={l.id}
                            className="bg-slate-50 hover:bg-slate-100"
                          >
                            <td className="px-2 py-1">{dateText}</td>
                            <td className="px-2 py-1">
                              {l.name || "–"}
                            </td>
                            <td className="px-2 py-1">
                              <div className="space-y-0.5">
                                {l.phone && (
                                  <div className="text-slate-800">
                                    {l.phone}
                                  </div>
                                )}
                                {l.email && (
                                  <div className="text-slate-600">
                                    {l.email}
                                  </div>
                                )}
                                {!l.phone && !l.email && <span>–</span>}
                              </div>
                            </td>
                            <td className="px-2 py-1">
                              {l.source || "–"}
                            </td>
                            <td className="px-2 py-1">
                              {l.status || "new"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Liten intern komponent for nøkkeltall-kort
type StatCardProps = {
  label: string;
  value: number | string;
};

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
      <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold text-slate-900">
        {value}
      </div>
    </div>
  );
}
