"use client";

import React, { useEffect, useState } from "react";
import {
  ORG_PLANS,
  normalizeOrgPlan,
  getOrgPlanLabel,
  getOrgPlanShortInfo,
  getOrgPlanPriceInfo,
} from "@/lib/orgPlan";
import type { OrgPlan } from "@/types/org";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

type OrgRow = {
  id: string;
  name: string;
  org_number: string | null;
  is_active: boolean;
  plan: string | null;
  created_at: string;
};

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "-";
  // Stabil, ingen locale-magi → unngår hydration-trøbbel
  return dateStr.slice(0, 10);
}

export default function PartnerePageClient() {
  const [orgs, setOrgs] = useState<OrgRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadOrgs() {
      if (!API_BASE) {
        setError(
          "Mangler NEXT_PUBLIC_API_BASE i miljøvariabler for frontend.",
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const base = API_BASE.replace(/\/$/, "");
        const res = await fetch(`${base}/api/admin/orgs`);
        const json = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(
            json?.error ??
              `Feil ved henting av partnere (status ${res.status})`,
          );
        }

        if (!cancelled) {
          setOrgs((json?.orgs as OrgRow[]) ?? []);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const errorMessage = err instanceof Error ? err.message : "Ukjent feil ved henting av partner-oversikt.";
          setError(errorMessage);
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

  async function updateOrg(
    orgId: string,
    patch: { plan?: OrgPlan; is_active?: boolean },
  ) {
    if (!API_BASE) {
      setError(
        "Mangler NEXT_PUBLIC_API_BASE i miljøvariabler for frontend.",
      );
      return;
    }

    try {
      setSavingId(orgId);
      setError(null);

      const base = API_BASE.replace(/\/$/, "");
      const res = await fetch(`${base}/api/admin/orgs/${orgId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patch),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          json?.error ??
            `Feil ved oppdatering av organisasjon (status ${res.status})`,
        );
      }

      const updated = json?.org as OrgRow | undefined;
      if (updated) {
        setOrgs((prev) =>
          prev.map((org) => (org.id === orgId ? { ...org, ...updated } : org)),
        );
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Ukjent feil ved oppdatering av organisasjon.";
      setError(errorMessage);
    } finally {
      setSavingId(null);
    }
  }

  function handleChangePlan(org: OrgRow, nextPlan: OrgPlan) {
    const current = normalizeOrgPlan(org.plan);
    if (current === nextPlan) return;
    updateOrg(org.id, { plan: nextPlan });
  }

  function handleToggleActive(org: OrgRow, nextActive: boolean) {
    if (org.is_active === nextActive) return;
    updateOrg(org.id, { is_active: nextActive });
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 lg:px-8">
      <header className="flex flex-col gap-2 border-b border-slate-800 pb-4">
        <h1 className="text-lg font-semibold text-slate-50">
          Partnere & planer
        </h1>
        <p className="max-w-3xl text-sm text-slate-400">
          Her styrer du hvilke organisasjoner som har tilgang til LYXso,
          hvilken plan de står på
          {" ("}
          <span className="font-medium">free</span>,{" "}
          <span className="font-medium">trial</span>,{" "}
          <span className="font-medium">paid</span>
          {")"}, og om de er aktive. Gratis-versjon har enkel booking med
          reklame. Trial gir 14 dager delvis full tilgang, og betalt plan
          gir full tilgang til AI-moduler som LYXba og LYXvision.
        </p>
      </header>

      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-950/40 px-4 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-md border border-slate-800 bg-slate-950 px-4 py-8 text-sm text-slate-400">
          Laster partner-oversikt …
        </div>
      ) : orgs.length === 0 ? (
        <div className="rounded-md border border-slate-800 bg-slate-950 px-4 py-8 text-sm text-slate-400">
          Ingen organisasjoner funnet ennå.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/60">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-slate-900/80">
              <tr className="text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3 text-left">Navn</th>
                <th className="px-4 py-3 text-left">Org.nr</th>
                <th className="px-4 py-3 text-left">Plan</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Opprettet</th>
              </tr>
            </thead>
            <tbody>
              {orgs.map((org, index) => {
                const plan = normalizeOrgPlan(org.plan);
                const isSaving = savingId === org.id;

                return (
                  <tr
                    key={org.id}
                    className={
                      index % 2 === 0
                        ? "border-t border-slate-800/80 bg-slate-950"
                        : "border-t border-slate-800/80 bg-slate-950/80"
                    }
                  >
                    <td className="px-4 py-3 align-top">
                      <div className="font-medium text-slate-50">
                        {org.name || "Uten navn"}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {org.id}
                      </div>
                    </td>

                    <td className="px-4 py-3 align-top">
                      <div className="text-sm text-slate-100">
                        {org.org_number || <span className="text-slate-500">-</span>}
                      </div>
                    </td>

                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-col gap-1">
                        <select
                          className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-50 outline-none transition hover:border-blue-500 focus:border-blue-500"
                          value={plan}
                          onChange={(e) =>
                            handleChangePlan(
                              org,
                              e.target.value as OrgPlan,
                            )
                          }
                          disabled={isSaving}
                        >
                          {ORG_PLANS.map((p) => (
                            <option key={p} value={p}>
                              {getOrgPlanLabel(p)}
                            </option>
                          ))}
                        </select>
                        <div className="text-[11px] text-slate-400">
                          {getOrgPlanShortInfo(plan)}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {getOrgPlanPriceInfo(plan)}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-col gap-1 text-xs">
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="h-3 w-3 accent-blue-500"
                            checked={org.is_active}
                            onChange={(e) =>
                              handleToggleActive(org, e.target.checked)
                            }
                            disabled={isSaving}
                          />
                          <span className="text-slate-100">
                            {org.is_active ? "Aktiv" : "Deaktivert"}
                          </span>
                        </label>
                        {isSaving && (
                          <span className="text-[11px] text-blue-400">
                            Lagrer …
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 align-top text-xs text-slate-400">
                      {formatDate(org.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
