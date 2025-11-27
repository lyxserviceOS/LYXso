// app/(protected)/betaling/BetalingPageClient.tsx
"use client";

import React from "react";
import { PlanGate } from "../../../components/PlanGate";

export default function BetalingPageClient() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 text-sm">
      <div>
        <h1 className="text-2xl font-semibold">Betaling</h1>
        <p className="mt-1 text-slate-600">
          Her samles oppsett for betalingsterminaler og online-betaling. Når
          både betaling og regnskap er koblet, kan LYXso ta seg av
          regnskapsføringen slik at partneren slipper å bruke tid på bilag.
        </p>
        <p className="mt-1 text-[11px] text-slate-500 max-w-xl">
          Første versjon vil støtte regnskapssystemer som Fiken og PowerOffice,
          og betaling via iZettle, SumUp og nettbetaling. Gratis-brukere har
          kun booking – Pro/partner får betalingsflyten.
        </p>
      </div>

      <PlanGate requiredPlan="pro" featureLabel="Betalingsintegrasjoner">
        <section className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)]">
          {/* Venstre: terminaler */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
            <h2 className="text-lg font-medium">Betalingsterminaler</h2>
            <p className="text-xs text-slate-600">
              Status for kobling mot fysiske terminaler. Integrasjon mot
              iZettle og SumUp planlegges her.
            </p>

            <div className="space-y-3 text-[11px]">
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="font-medium">iZettle</p>
                <p className="mt-1 text-slate-600">
                  Status:{" "}
                  <span className="font-semibold">Ikke koblet</span>
                </p>
                <p className="mt-1 text-[10px] text-slate-500">
                  Når API-tilkobling er klar, vil LYXso kunne hente omsetning
                  direkte fra terminalen og koble den mot regnskap.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 p-3">
                <p className="font-medium">SumUp</p>
                <p className="mt-1 text-slate-600">
                  Status:{" "}
                  <span className="font-semibold">Ikke koblet</span>
                </p>
                <p className="mt-1 text-[10px] text-slate-500">
                  Brukes for kortbetaling i butikk. Transaksjoner kan senere
                  matches mot fakturaer og bokføres automatisk.
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled
              className="mt-2 inline-flex items-center justify-center rounded-md border border-slate-300 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 disabled:opacity-60"
            >
              Konfigurer terminal (kommer snart)
            </button>
          </div>

          {/* Høyre: online-betaling og regnskap */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
            <h2 className="text-lg font-medium">Online-betaling & regnskap</h2>
            <p className="text-xs text-slate-600">
              Brukes for betaling direkte fra bookingskjema eller landingssiden
              (f.eks. depositum, forskudd eller gavekort) og for å koble mot
              regnskapssystemer som Fiken og PowerOffice.
            </p>

            <div className="space-y-3 text-[11px]">
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="font-medium">Vipps / kortbetaling</p>
                <p className="mt-1 text-slate-600">
                  Status:{" "}
                  <span className="font-semibold">Ikke koblet</span>
                </p>
                <p className="mt-1 text-[10px] text-slate-500">
                  API-tilkobling kan senere brukes for å ta betalt ved booking
                  og koble betalingen til riktig ordre.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 p-3">
                <p className="font-medium">Regnskap (Fiken / PowerOffice)</p>
                <p className="mt-1 text-slate-600">
                  Status:{" "}
                  <span className="font-semibold">Planlagt</span>
                </p>
                <p className="mt-1 text-[10px] text-slate-500">
                  Når betaling og regnskap er koblet, kan LYXso generere
                  bilag, føre inntekter og holde regnskapet à jour – slik at
                  partneren slipper å sitte med regneark etter arbeidstid.
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled
              className="mt-2 inline-flex items-center justify-center rounded-md border border-slate-300 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 disabled:opacity-60"
            >
              Konfigurer online-betaling (kommer snart)
            </button>
          </div>
        </section>
      </PlanGate>
    </div>
  );
}
