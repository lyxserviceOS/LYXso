// app/(protected)/plan/PlanPageClient.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  getOrgPlanLabel,
  getOrgPlanPriceInfo,
  getOrgPlanShortInfo,
} from "@/lib/orgPlan";
import { useOrgPlan } from "@/lib/useOrgPlan";
import type { UsageSummary } from "@/types/plan";

// Mock usage data for demonstration
const MOCK_USAGE: UsageSummary = {
  current_period: "2024-03",
  bookings: { used: 45, limit: 100 },
  customers: { used: 128, limit: 500 },
  users: { used: 3, limit: 5 },
  locations: { used: 1, limit: 1 },
};

function UsageBar({ label, used, limit }: { label: string; used: number; limit: number | null }) {
  const percentage = limit ? Math.min((used / limit) * 100, 100) : 0;
  const isNearLimit = limit && percentage > 80;
  const isAtLimit = limit && percentage >= 100;
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className={`font-medium ${
          isAtLimit ? "text-red-400" : isNearLimit ? "text-amber-400" : "text-slate-200"
        }`}>
          {used} / {limit ?? "∞"}
        </span>
      </div>
      {limit && (
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all ${
              isAtLimit ? "bg-red-500" : isNearLimit ? "bg-amber-500" : "bg-emerald-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default function PlanPageClient() {
  const { loading, error, plan, features } = useOrgPlan();
  const [usage] = useState(MOCK_USAGE);

  return (
    <div className="h-full w-full overflow-y-auto px-6 py-6">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Abonnement & plan
          </h1>
          <p className="text-sm text-slate-400">
            Her ser du hvilken LYXso-plan bedriften din bruker nå, bruksnivå
            og tilgjengelige funksjoner.
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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
              <div className="text-left sm:text-right">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Pris
                </p>
                <p className="text-base font-semibold text-slate-50">
                  {getOrgPlanPriceInfo(plan)}
                </p>
                {plan === "free" && (
                  <Link
                    href="mailto:nikolai@brisner.no?subject=Oppgradering%20LYXso"
                    className="mt-2 inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                  >
                    Oppgrader plan
                  </Link>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Usage section */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                Bruk denne måneden
              </h2>
              <p className="text-xs text-slate-500">
                Periode: {usage.current_period}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <UsageBar 
              label="Bookinger" 
              used={usage.bookings.used} 
              limit={plan === "paid" ? null : usage.bookings.limit} 
            />
            <UsageBar 
              label="Kunder" 
              used={usage.customers.used} 
              limit={plan === "paid" ? null : usage.customers.limit} 
            />
            <UsageBar 
              label="Brukere" 
              used={usage.users.used} 
              limit={plan === "paid" ? 10 : usage.users.limit} 
            />
            <UsageBar 
              label="Lokasjoner" 
              used={usage.locations.used} 
              limit={plan === "paid" ? 5 : usage.locations.limit} 
            />
          </div>

          {plan === "free" && usage.bookings.used / (usage.bookings.limit ?? 1) > 0.7 && (
            <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-200">
              <p className="font-medium">Nærmer deg booking-grensen</p>
              <p className="mt-1">
                Du har brukt {usage.bookings.used} av {usage.bookings.limit} bookinger. 
                Oppgrader for ubegrenset antall bookinger.
              </p>
            </div>
          )}
        </section>

        {/* Features section */}
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
                inverted
              />
              <FeatureCard
                label="AI-markedsføring (LYXba)"
                description="Automatiske kampanjer, annonser og lead-oppfølging."
                enabled={features.aiMarketing}
              />
              <FeatureCard
                label="LYXvision / Coating PRO"
                description="Ekstra modul for visuell kontroll og coating-løp."
                enabled={features.lyxVision}
              />
              <FeatureCard
                label="Dekkhotell PRO"
                description="Lagerposisjon, historikk og booking-integrasjon."
                enabled={features.lyxVision}
              />
              <FeatureCard
                label="Automatisering"
                description="Påminnelser, workflows og automatiske triggere."
                enabled={features.aiMarketing}
              />
            </div>
          </section>
        )}

        {/* Upgrade CTA for free users */}
        {!loading && !error && plan === "free" && (
          <section className="rounded-xl border border-blue-500/40 bg-blue-500/10 p-4">
            <h2 className="text-sm font-semibold text-blue-100">
              Oppgrader til Pro
            </h2>
            <p className="mt-1 text-xs text-blue-200">
              Få tilgang til alle moduler, ubegrenset bookinger og premium support.
            </p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-xl font-bold text-blue-100">990 kr/mnd</span>
              <span className="text-xs text-blue-300 line-through">1 495 kr/mnd</span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                Spar 505 kr
              </span>
            </div>
            <Link
              href="mailto:nikolai@brisner.no?subject=Oppgradering%20LYXso"
              className="mt-4 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Kontakt oss for å oppgradere
            </Link>
          </section>
        )}

        {/* Addons link */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-200">Tilleggspakker</h3>
              <p className="text-xs text-slate-400">
                Aktiver ekstra moduler som passer dine behov.
              </p>
            </div>
            <Link
              href="/addons"
              className="rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800"
            >
              Se tilleggspakker →
            </Link>
          </div>
        </section>

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
  inverted?: boolean;
};

function FeatureCard({ label, description, enabled, inverted }: FeatureCardProps) {
  const showAsEnabled = inverted ? !enabled : enabled;
  
  return (
    <div className="flex items-start justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-3">
      <div className="pr-3">
        <p className="text-sm font-medium text-slate-100">{label}</p>
        <p className="mt-1 text-xs text-slate-400">{description}</p>
      </div>
      <span
        className={[
          "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em]",
          showAsEnabled
            ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40"
            : "bg-slate-800 text-slate-500 border border-slate-700",
        ].join(" ")}
      >
        {showAsEnabled ? "Aktiv" : "Ikke aktiv"}
      </span>
    </div>
  );
}
