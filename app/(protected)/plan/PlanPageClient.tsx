// app/(protected)/plan/PlanPageClient.tsx
"use client";

import {
  getOrgPlanLabel,
  getOrgPlanPriceInfo,
  getOrgPlanShortInfo,
} from "@/lib/orgPlan";
import { useOrgPlan } from "@/lib/useOrgPlan";

export default function PlanPageClient() {
  const { loading, error, plan, features } = useOrgPlan();

  return (
    <div className="h-full w-full overflow-y-auto px-6 py-6">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Abonnement & plan
          </h1>
          <p className="text-sm text-slate-400">
            Her ser du hvilken LYXso-plan bedriften din bruker nå, og hva
            som er inkludert. Endring av plan gjøres fra adminpanelet eller
            ved å kontakte LYXso.
          </p>
        </header>

        {/* Status-boks */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          {loading && (
            <p className="text-sm text-slate-300">Henter plan …</p>
          )}

          {error && (
            <p className="text-sm text-red-400">
              Klarte ikke å hente plan: {error}
            </p>
          )}

          {!loading && !error && (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Nåværende plan
                </p>
                <p className="text-lg font-semibold text-slate-50">
                  {getOrgPlanLabel(plan)}
                </p>
                <p className="text-xs text-slate-400">
                  {getOrgPlanShortInfo(plan)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Pris
                </p>
                <p className="text-base font-semibold text-slate-50">
                  {getOrgPlanPriceInfo(plan)}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* En enkel oversikt over hvilke features som faktisk er slått på */}
        {!loading && !error && (
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-100">
              Funksjoner i din plan
            </h2>

            <div className="grid gap-3 sm:grid-cols-2">
              <FeatureCard
                label="Grunnleggende booking"
                description="Kalender, timebok og enkel kundehåndtering."
                enabled={features.basicBooking}
              />
              <FeatureCard
                label="Reklame i systemet"
                description="Visning av annonser/bannere i den gratis planen."
                enabled={features.ads}
              />
              <FeatureCard
                label="AI-markedsføring (LYXba)"
                description="Automatiske kampanjer, annonser og lead-oppfølging."
                enabled={features.aiMarketing}
              />
              <FeatureCard
                label="LYXvision / avansert AI-modul"
                description="Ekstra modul for visuell kontroll, analyser m.m."
                enabled={features.lyxVision}
              />
            </div>
          </section>
        )}

        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-400">
          <p>
            Merk: Dette er en teknisk oversikt for partner. Offisiell
            fakturering og avtalevilkår følger kontrakten med LYXso og
            Enkel Utleie AS.
          </p>
        </section>
      </div>
    </div>
  );
}

type FeatureCardProps = {
  label: string;
  description: string;
  enabled: boolean;
};

function FeatureCard({ label, description, enabled }: FeatureCardProps) {
  return (
    <div className="flex items-start justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-3">
      <div className="pr-3">
        <p className="text-sm font-medium text-slate-100">{label}</p>
        <p className="mt-1 text-xs text-slate-400">{description}</p>
      </div>
      <span
        className={[
          "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em]",
          enabled
            ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40"
            : "bg-slate-800 text-slate-500 border border-slate-700",
        ].join(" ")}
      >
        {enabled ? "Aktiv" : "Ikke aktiv"}
      </span>
    </div>
  );
}
