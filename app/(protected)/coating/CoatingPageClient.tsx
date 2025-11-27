// app/(protected)/coating/CoatingPageClient.tsx
"use client";

import Link from "next/link";
import { useOrgPlan } from "@/lib/useOrgPlan";
import {
  getOrgPlanLabel,
  getOrgPlanShortInfo,
  getOrgPlanPriceInfo,
} from "@/lib/orgPlan";

export default function CoatingPageClient() {
  const { loading, error, plan, features } = useOrgPlan();
  const hasLyxVision = features.lyxVision;

  return (
    <div className="h-full w-full overflow-y-auto px-6 py-6">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* HEADER */}
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Lakk & coating – LYXvision
          </h1>
          <p className="text-sm text-slate-400">
            Her samler du tjenester for polering, keramisk coating og
            LYXvision-modulen som visualiserer jobbene og kvalitetssikrer
            resultatet.
          </p>
        </header>

        {/* PLAN-INFO / STATUS */}
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

        {/* INNHOLD AVHENGIG AV PLAN */}
        {!loading && !error && (
          <>
            {hasLyxVision ? (
              <section className="space-y-6">
                <h2 className="text-sm font-semibold text-slate-100">
                  LYXvision – aktiv på din plan
                </h2>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                    <h3 className="text-sm font-semibold text-slate-100">
                      Coating-løp & sjekklister
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                      Sett opp standardiserte løp for forvask, polering,
                      wipedown og coating. Hver jobb kan få en digital
                      sjekkliste som lagres på kunden og kjøretøyet.
                    </p>
                    <p className="mt-3 text-[11px] text-slate-500">
                      Senere kobler vi dette direkte mot LYXvision-brillene
                      slik at du kan se hvilke steg som er gjennomført i sanntid.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                    <h3 className="text-sm font-semibold text-slate-100">
                      Visuell kvalitetssikring (AR)
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                      LYXvision kan markere områder med coating, manglende
                      dekning, varme ved polering og potensielle gjennomslip.
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] text-slate-400">
                      <li>Blå: coating påført</li>
                      <li>Lilla: herdet område</li>
                      <li>Rød: rester/feil</li>
                      <li>Varsel ved for høy temperatur på panelene</li>
                    </ul>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                    <h3 className="text-sm font-semibold text-slate-100">
                      Dokumentasjon til kunde
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                      Lag før/etter-bilder og en enkel rapport som kunden kan
                      få på e-post: hva som er gjort, hvilke produkter som er
                      brukt og når neste årskontroll anbefales.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                    <h3 className="text-sm font-semibold text-slate-100">
                      Integrasjon mot garantibevis
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                      På sikt kan LYXvision automatisk fylle ut
                      garantisertifikater basert på coating-løpet og bildene
                      som er tatt underveis.
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-500">
                  Akkurat nå er dette en struktur og et UI for LYXvision.
                  Selve brillene, AR-integrasjonen og live-dataene kobles på i
                  egne utviklingssteg.
                </p>
              </section>
            ) : (
              <section className="space-y-4">
                <div className="rounded-xl border border-purple-500/50 bg-purple-500/10 p-4">
                  <h2 className="text-sm font-semibold text-purple-100">
                    LYXvision er låst på din nåværende plan
                  </h2>
                  <p className="mt-1 text-xs text-purple-50/90">
                    LYXvision er en tilleggsmodul for coating og lakk der du
                    får AR-basert kvalitetssikring og dokumentasjon. Modulen er
                    inkludert i prøveperioden og den betalte planen.
                  </p>

                  <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] text-purple-50/90">
                    <li>Visualiser hvor coating faktisk ligger på bilen</li>
                    <li>Oppdag manglende dekning eller varme ved polering</li>
                    <li>Bygg dokumentasjon og garantibevis for hver jobb</li>
                  </ul>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      href="/plan"
                      className="inline-flex items-center rounded-md bg-purple-400 px-3 py-1.5 text-xs font-semibold text-slate-900 hover:bg-purple-300"
                    >
                      Oppgrader plan for å låse opp LYXvision
                    </Link>
                    <Link
                      href="/addons"
                      className="inline-flex items-center rounded-md border border-purple-500/60 px-3 py-1.5 text-xs font-medium text-purple-100 hover:bg-purple-500/10"
                    >
                      Se alle tillegg (addons)
                    </Link>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <h3 className="text-sm font-semibold text-slate-100">
                    Vanlige coating-tjenester
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Selv uten LYXvision kan du fortsatt bruke LYXso til å
                    definere coating-pakker, priser og tidsbruk – og koble dem
                    direkte mot bookingmotoren.
                  </p>
                  <p className="mt-3 text-[11px] text-slate-500">
                    Når du senere oppgraderer vil alle eksisterende tjenester
                    kunne kobles til LYXvision-modulen uten at du må bygge
                    alt på nytt.
                  </p>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
