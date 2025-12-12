// app/(protected)/admin/AdminPageClient.tsx
"use client";

import { useEffect, useState } from "react";
import type { OrgPlan } from "@/types/org";
import {
  ORG_PLANS,
  getOrgPlanLabel,
  getOrgPlanPriceInfo,
  getOrgPlanShortInfo,
  normalizeOrgPlan,
  planFeatureFlags,
} from "@/lib/orgPlan";
import { getApiBaseUrl } from "@/lib/apiConfig";

const API_BASE_URL = getApiBaseUrl();

type OrgRow = {
  id: string;
  name: string | null;
  org_number: string | null;
  is_active: boolean | null;
  plan: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type OrgsResponse = {
  orgs: OrgRow[];
};

type UpdatePlanResponse = {
  org: OrgRow;
};

export default function AdminPageClient() {
  const [orgs, setOrgs] = useState<OrgRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingOrgId, setSavingOrgId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    async function loadOrgs() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE_URL}/api/admin/orgs`);

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(
            text || `Feil fra API (${res.status} ${res.statusText})`,
          );
        }

        const json = (await res.json()) as OrgsResponse;

        if (!cancelled) {
          setOrgs(json.orgs ?? []);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(
            err?.message ??
              "Ukjent feil ved henting av organisasjoner.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadOrgs();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleChangePlan(orgId: string, newPlan: OrgPlan) {
    try {
      setSavingOrgId(orgId);
      setSuccessMessage(null);
      setError(null);

      const res = await fetch(
        `${API_BASE_URL}/api/admin/orgs/${orgId}/plan`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ plan: newPlan }),
        },
      );

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(
          text || `Feil fra API (${res.status} ${res.statusText})`,
        );
      }

      const json = (await res.json()) as UpdatePlanResponse;

      setOrgs((prev) =>
        prev.map((o) => (o.id === orgId ? json.org : o)),
      );

      setSuccessMessage(
        `Plan oppdatert til "${getOrgPlanLabel(newPlan)}".`,
      );
    } catch (err: any) {
      setError(
        err?.message ??
          "Ukjent feil ved oppdatering av organisasjonsplan.",
      );
    } finally {
      setSavingOrgId(null);
    }
  }

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold text-slate-50">
          Adminpanel – organisasjoner & planer
        </h1>
        <p className="max-w-2xl text-sm text-slate-400">
          Dette panelet er kun for deg som LYXso-admin. Her kan du se
          hvilke organisasjoner som finnes, hvilken plan de har, og
          manuelt sette plan mellom{" "}
          <span className="font-medium">
            Gratis, Prøveperiode og Betalt
          </span>
          .
        </p>
        <p className="max-w-2xl text-xs text-slate-500">
          I senere versjoner vil dette også inneholde full oversikt over
          partnere, statistikk, AI-moduler (LYXba / LYXvision) og
          regnskapstilgang. Nå starter vi med planstyring.
        </p>
      </header>

      {loading && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-xs text-slate-300">
          Laster organisasjoner …
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-800 bg-red-950/40 px-4 py-3 text-xs text-red-200">
          <p className="font-semibold">Feil ved henting av org-data</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {!loading && successMessage && (
        <div className="rounded-xl border border-emerald-800 bg-emerald-950/30 px-4 py-3 text-xs text-emerald-200">
          {successMessage}
        </div>
      )}

      {!loading && !error && orgs.length === 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-xs text-slate-300">
          Ingen organisasjoner funnet. Sjekk at Supabase-tabellen{" "}
          <code className="font-mono text-[11px]">orgs</code> inneholder
          minst én rad.
        </div>
      )}

      {!loading && !error && orgs.length > 0 && (
        <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Organisasjoner
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Klikk i feltet for plan for å endre hvilken LYXso-plan
                organisasjonen ligger på. Oversikten under viser også
                hvilke funksjoner planen gir.
              </p>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto text-xs">
            <table className="min-w-full border-separate border-spacing-y-1">
              <thead>
                <tr className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                  <th className="px-2 py-1 text-left">Navn</th>
                  <th className="px-2 py-1 text-left">Org.nr</th>
                  <th className="px-2 py-1 text-left">Plan</th>
                  <th className="px-2 py-1 text-left">Plan-info</th>
                  <th className="px-2 py-1 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {orgs.map((org) => {
                  const normalizedPlan: OrgPlan = normalizeOrgPlan(
                    org.plan ?? null,
                  );
                  const planLabel = getOrgPlanLabel(normalizedPlan);
                  const planPriceInfo =
                    getOrgPlanPriceInfo(normalizedPlan);
                  const planShortInfo =
                    getOrgPlanShortInfo(normalizedPlan);
                  const features = planFeatureFlags[normalizedPlan];

                  return (
                    <tr
                      key={org.id}
                      className="rounded-xl bg-slate-900/60 text-slate-200"
                    >
                      <td className="px-2 py-2 align-top">
                        <div className="font-medium text-slate-50">
                          {org.name ?? "Uten navn"}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          ID: {org.id}
                        </div>
                      </td>
                      <td className="px-2 py-2 align-top">
                        <span className="text-[11px] text-slate-300">
                          {org.org_number ?? "–"}
                        </span>
                      </td>
                      <td className="px-2 py-2 align-top">
                        <div className="inline-flex flex-col gap-1">
                          <select
                            className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={normalizedPlan}
                            disabled={savingOrgId === org.id}
                            onChange={(e) =>
                              handleChangePlan(
                                org.id,
                                e.target.value as OrgPlan,
                              )
                            }
                          >
                            {ORG_PLANS.map((p) => (
                              <option key={p} value={p}>
                                {getOrgPlanLabel(p)}
                              </option>
                            ))}
                          </select>
                          {savingOrgId === org.id && (
                            <span className="text-[10px] text-slate-500">
                              Lagrer ny plan …
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-2 py-2 align-top">
                        <p className="text-[11px] text-slate-300">
                          {planPriceInfo}
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-500">
                          {planShortInfo}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          <FeaturePill
                            label="Booking"
                            enabled={features.basicBooking}
                          />
                          <FeaturePill
                            label="AI-markedsføring"
                            enabled={features.aiMarketing}
                          />
                          <FeaturePill
                            label="LYXvision"
                            enabled={features.lyxVision}
                          />
                          <FeaturePill
                            label="Reklame"
                            enabled={features.ads}
                          />
                        </div>
                      </td>
                      <td className="px-2 py-2 align-top">
                        <span
                          className={[
                            "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                            org.is_active
                              ? "bg-emerald-900/40 text-emerald-200"
                              : "bg-slate-800 text-slate-300",
                          ].join(" ")}
                        >
                          {org.is_active ? "Aktiv" : "Deaktivert"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

type FeaturePillProps = {
  label: string;
  enabled: boolean;
};

function FeaturePill({ label, enabled }: FeaturePillProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px]",
        enabled
          ? "border border-emerald-500/50 bg-emerald-900/30 text-emerald-100"
          : "border border-slate-700 bg-slate-900 text-slate-400",
      ].join(" ")}
    >
      {label}
    </span>
  );
}
