// app/(protected)/admin/orgs/AdminOrgsPageClient.tsx
"use client";

import { useEffect, useState } from "react";
import {
  fetchAdminOrgs,
  updateOrgActiveStatus,
  updateOrgPlan,
  type AdminOrg,
} from "@/lib/repos/adminOrgsRepo";

const PLAN_LABELS: Record<NonNullable<AdminOrg["plan"]>, string> = {
  free: "Free • Gratis grunnpakke",
  trial: "Trial • Prøveperiode",
  paid: "Paid • Betalt plan",
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("nb-NO", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default function AdminOrgsPageClient() {
  const [orgs, setOrgs] = useState<AdminOrg[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialError, setInitialError] = useState<string | null>(null);
  const [savingOrgId, setSavingOrgId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Førstegangs-load
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setInitialError(null);
        const data = await fetchAdminOrgs();

        if (!cancelled) {
          setOrgs(data);
        }
      } catch (err: any) {
        if (!cancelled) {
          setInitialError(
            err?.message ||
              "Klarte ikke å hente organisasjoner. Sjekk at API-et (4000) kjører.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleRefresh() {
    try {
      setRefreshing(true);
      const data = await fetchAdminOrgs();
      setOrgs(data);
    } catch (err: any) {
      // Vi vil ikke ta ned hele UI for en refresh-feil: vis kun console-error
      console.error("Feil ved refresh av orgs:", err);
    } finally {
      setRefreshing(false);
    }
  }

  async function handleChangePlan(orgId: string, plan: AdminOrg["plan"]) {
    if (!plan) return;

    setSavingOrgId(orgId);
    try {
      const updated = await updateOrgPlan(orgId, plan);
      setOrgs((prev) =>
        prev.map((org) => (org.id === orgId ? updated : org)),
      );
    } catch (err: any) {
      alert(
        err?.message ||
          "Klarte ikke å oppdatere plan. Sjekk API-loggene (admin/orgs).",
      );
    } finally {
      setSavingOrgId((current) => (current === orgId ? null : current));
    }
  }

  async function handleToggleActive(org: AdminOrg) {
    setSavingOrgId(org.id);
    try {
      const updated = await updateOrgActiveStatus(org.id, !org.isActive);
      setOrgs((prev) =>
        prev.map((o) => (o.id === org.id ? updated : o)),
      );
    } catch (err: any) {
      alert(
        err?.message ||
          "Klarte ikke å oppdatere aktiv-status. Sjekk API-loggene.",
      );
    } finally {
      setSavingOrgId((current) => (current === org.id ? null : current));
    }
  }

  const anyOrgs = orgs.length > 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      {/* Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            ADMIN • ORGANISASJONER
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">
            Organisasjoner &amp; partnere
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Full oversikt over alle partnere i LYXso – med plan, status og
            nøkkeltall du senere kan utvide med omsetning, bookingvolum og
            AI-bruk.
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-2 sm:items-end">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {refreshing ? "Oppdaterer …" : "Oppdater liste"}
          </button>

          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-[11px] text-slate-600 shadow-sm">
            <p className="font-semibold uppercase tracking-[0.18em] text-slate-400">
              STATUS
            </p>
            <p className="mt-1 text-sm text-slate-900">
              Admin-modulen er aktiv
            </p>
            <p className="text-[11px] leading-snug">
              Data hentes fra <code className="font-mono text-[10px]">
                /api/admin/orgs
              </code>{" "}
              i LYXso API-et. Endringer på plan/aktivitet lagres direkte.
            </p>
          </div>
        </div>
      </header>

      {/* Feil / loading */}
      {initialError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-semibold">Klarte ikke å laste organisasjoner</p>
          <p className="text-xs">{initialError}</p>
        </div>
      )}

      {loading && !initialError && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
          Laster organisasjoner …
        </div>
      )}

      {!loading && !initialError && !anyOrgs && (
        <section className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
          <p className="mb-2 font-medium text-slate-700">
            Ingen organisasjoner registrert ennå
          </p>
          <p className="text-xs">
            Når partnere registreres via <code>/bli-partner</code> eller
            onboardes direkte i Supabase, vil de dukke opp her. Du kan så sette
            plan, aktivere/inaktivere og senere se nøkkeltall.
          </p>
        </section>
      )}

      {/* Hovedtabell */}
      {anyOrgs && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50/60 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              ORG-LISTE
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Logo-plassholder, plan, aktiv/inaktiv, trial og farger. Perfekt
              for å styre hvem som har hvilke moduler.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50">
                <tr className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  <th className="px-4 py-2 text-left">Partner</th>
                  <th className="px-4 py-2 text-left">Plan</th>
                  <th className="px-4 py-2 text-left">Trial</th>
                  <th className="px-4 py-2 text-left">Farger</th>
                  <th className="px-4 py-2 text-left">Org.nr</th>
                  <th className="px-4 py-2 text-left">Opprettet</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {orgs.map((org) => {
                  const isSaving = savingOrgId === org.id;
                  const planKey = org.plan ?? "free";

                  return (
                    <tr key={org.id} className="align-top">
                      {/* Partner + logo-plassholder */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                            {org.logoUrl ? (
                              <>
                                {/* 
                                  Anbefalt oppløsning for logo:
                                  160x160 px, kvadratisk, PNG eller SVG.
                                  Du kan senere erstatte <img> med Next.js <Image>.
                                */}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={org.logoUrl}
                                  alt={`Logo for ${org.name}`}
                                  className="h-full w-full object-cover"
                                />
                              </>
                            ) : (
                              <span>LOGO</span>
                            )}
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-sm font-medium text-slate-900">
                              {org.name}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              ID:{" "}
                              <span className="font-mono text-[10px]">
                                {org.id}
                              </span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <select
                            className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-800 outline-none ring-0 focus:border-sky-400 focus:ring-0"
                            value={planKey}
                            disabled={isSaving}
                            onChange={(e) =>
                              handleChangePlan(
                                org.id,
                                e.target.value as AdminOrg["plan"],
                              )
                            }
                          >
                            <option value="free">{PLAN_LABELS.free}</option>
                            <option value="trial">{PLAN_LABELS.trial}</option>
                            <option value="paid">{PLAN_LABELS.paid}</option>
                          </select>
                          <p className="text-[11px] text-slate-400">
                            Styr hvilke moduler partneren får i LYXso.
                          </p>
                        </div>
                      </td>

                      {/* Trial info */}
                      <td className="px-4 py-3 text-xs text-slate-600">
                        <div className="space-y-0.5">
                          <p>
                            Start:{" "}
                            <span className="font-medium">
                              {formatDate(org.trialStartedAt)}
                            </span>
                          </p>
                          <p>
                            Slutt:{" "}
                            <span className="font-medium">
                              {formatDate(org.trialEndsAt)}
                            </span>
                          </p>
                        </div>
                      </td>

                      {/* Farger */}
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                          <div className="flex items-center gap-1">
                            <span className="rounded-full bg-slate-100 px-2 py-0.5">
                              Primær
                            </span>
                            <span className="font-mono text-[10px]">
                              {org.primaryColor || "–"}
                            </span>
                            {org.primaryColor && (
                              <span
                                className="ml-1 inline-block h-3 w-3 rounded-full border border-slate-200"
                                style={{
                                  backgroundColor: org.primaryColor,
                                }}
                              />
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="rounded-full bg-slate-100 px-2 py-0.5">
                              Sekundær
                            </span>
                            <span className="font-mono text-[10px]">
                              {org.secondaryColor || "–"}
                            </span>
                            {org.secondaryColor && (
                              <span
                                className="ml-1 inline-block h-3 w-3 rounded-full border border-slate-200"
                                style={{
                                  backgroundColor: org.secondaryColor,
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Org-nummer */}
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {org.orgNumber ? (
                          <span className="font-mono text-[11px]">
                            {org.orgNumber}
                          </span>
                        ) : (
                          <span className="text-slate-400">Ikke satt</span>
                        )}
                      </td>

                      {/* Opprettet */}
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {formatDate(org.createdAt)}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 text-xs text-slate-600">
                        <div className="flex flex-col items-start gap-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                              org.isActive
                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                                : "bg-slate-100 text-slate-500 ring-1 ring-slate-200"
                            }`}
                          >
                            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
                            {org.isActive ? "Aktiv" : "Inaktiv"}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleToggleActive(org)}
                            disabled={isSaving}
                            className="text-[11px] font-medium text-sky-600 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {org.isActive ? "Deaktiver" : "Aktiver"} partner
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Undertekst */}
          <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 text-[11px] text-slate-500">
            <p>
              Denne admin-oversikten bygger direkte på{" "}
              <code className="font-mono text-[10px]">
                orgs
              </code>{" "}
              -tabellen i Supabase. Du kan trygt utvide med flere felter (f.eks.
              AI-bruk, omsetning, antall bookinger) uten å endre grunnstrukturen
              her.
            </p>
          </div>
        </section>
      )}

      {/* Valgfritt: behold original SQL-kommentar dersom du vil ha referansen i samme fil */}
      {/*
        NEDENFOR: original datamodell/SQL lå tidligere her som kommentar.
        Hele datamodellen ligger nå også i "SQL supabase.txt".
      */}
    </div>
  );
}
