// app/(protected)/ai-agent/AiAgentPageClient.tsx
"use client";

import Link from "next/link";
import { useOrgPlan } from "@/lib/useOrgPlan";
import {
  getOrgPlanLabel,
  getOrgPlanShortInfo,
  getOrgPlanPriceInfo,
} from "@/lib/orgPlan";

export default function AiAgentPageClient() {
  const { loading, error, plan, features } = useOrgPlan();
  const canUseAiAgent = features.aiMarketing;

  return (
    <div className="h-full w-full overflow-y-auto px-6 py-6">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            LYXba – Booking Agent
          </h1>
          <p className="text-sm text-slate-400">
            AI-agent som håndterer leads, meldinger og bookinger på
            autopilot. Tilgjengelig i prøve- og betalt plan.
          </p>
        </header>

        {/* Status / plan-info */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          {loading && (
            <p className="text-sm text-slate-300">
              Henter plan og funksjoner …
            </p>
          )}

          {error && (
            <p className="text-sm text-red-400">
              Klarte ikke å hente org-plan: {error}
            </p>
          )}

          {!loading && !error && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Din LYXso-plan
                </p>
                <p className="text-base font-semibold text-slate-50">
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
                <p className="text-sm font-semibold text-slate-50">
                  {getOrgPlanPriceInfo(plan)}
                </p>
                <Link
                  href="/plan"
                  className="mt-2 inline-flex items-center rounded-md border border-blue-500/60 bg-blue-600/10 px-3 py-1.5 text-xs font-medium text-blue-200 hover:bg-blue-600/20"
                >
                  Se / endre plan
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Innhold avhengig av plan */}
        {!loading && !error && (
          <>
            {canUseAiAgent ? (
              <section className="space-y-6">
                <h2 className="text-sm font-semibold text-slate-100">
                  Oppsett av AI-agent
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
                    <h3 className="text-sm font-semibold text-slate-100">
                      Kanaler & leads
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                      Her vil du kunne koble til kontaktskjema, kampanjer og
                      annonsesystemer slik at LYXba kan fange opp alle
                      henvendelser.
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
                    <h3 className="text-sm font-semibold text-slate-100">
                      Booking-regler
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                      Definer åpningstider, hvilke tjenester AI-agenten kan
                      booke, og hvordan den skal håndtere pris og kapasitet.
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
                    <h3 className="text-sm font-semibold text-slate-100">
                      Tone of voice
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                      Tilpass språk og stil på meldingene slik at
                      kundekommunikasjonen matcher din merkevare.
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
                    <h3 className="text-sm font-semibold text-slate-100">
                      Automatisering & varsler
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                      Sett opp når du vil at LYXba skal kontakte kunde på
                      nytt, hvilke SMS/e-poster som sendes, og hvilke leads
                      som skal sendes videre til deg manuelt.
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-500">
                  Merk: Selve AI-koblingen og bookingsystem-integrasjonen
                  implementeres i neste steg – nå er dette en struktur for UI
                  og plan-låsing.
                </p>
              </section>
            ) : (
              <section className="space-y-4">
                <div className="rounded-xl border border-yellow-500/40 bg-yellow-500/10 p-4">
                  <h2 className="text-sm font-semibold text-yellow-100">
                    AI-agenten er låst på din nåværende plan
                  </h2>
                  <p className="mt-1 text-xs text-yellow-50/90">
                    LYXba – Booking Agent er tilgjengelig i prøveperioden og
                    den betalte planen. Du bruker nå en plan som ikke
                    inkluderer AI-markedsføring.
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-yellow-50/90">
                    <li>
                      Automatisk oppfølging av leads fra skjema og kampanjer
                    </li>
                    <li>AI-drevet booking på SMS, e-post og chat</li>
                    <li>Mer tid til drift, mindre tid i innboksen</li>
                  </ul>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      href="/plan"
                      className="inline-flex items-center rounded-md bg-yellow-400 px-3 py-1.5 text-xs font-semibold text-slate-900 hover:bg-yellow-300"
                    >
                      Oppgrader plan
                    </Link>
                    <Link
                      href="/kontrollpanel"
                      className="inline-flex items-center rounded-md border border-yellow-500/60 px-3 py-1.5 text-xs font-medium text-yellow-100 hover:bg-yellow-500/10"
                    >
                      Tilbake til kontrollpanel
                    </Link>
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
