// app/lyx-vision/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import VisionAnalyzerDemo from "./VisionAnalyzerDemo";

export const metadata: Metadata = {
  title: "LYX Vision – AI-bildeanalyse for coating og bilpleie",
  description:
    "LYX Vision bruker AI til å analysere tilstand på lakk, coating og biler. Få konsistente vurderinger, dokumentasjon og estimater på sekunder.",
};

export default function LyxVisionPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <main className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
        {/* Hero */}
        <section className="space-y-6 pb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-purple-200">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
            LYX Vision
          </div>

          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            AI-drevet bildeanalyse for{" "}
            <span className="text-purple-400">lakk og coating</span>
          </h1>

          <p className="max-w-2xl text-lg text-slate-200">
            LYX Vision analyserer bilder av biler, lakk og coating med AI – og gir deg konsistente vurderinger, 
            tilstandsrapporter og estimater på sekunder. Slutt med subjektive vurderinger og lange inspeksjoner.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="#demo"
              className="rounded-md bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-500"
            >
              Prøv demo
            </Link>
            <Link
              href="/kontakt"
              className="rounded-md border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-100 hover:border-slate-500"
            >
              Kontakt oss
            </Link>
          </div>
        </section>

        {/* Hva er LYX Vision */}
        <section className="grid gap-8 py-12 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Hva er LYX Vision?</h2>
            <p className="text-sm text-slate-300">
              LYX Vision er en AI-modul som analyserer bilder av biler og gir objektive vurderinger på:
            </p>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-400" />
                <span>
                  <strong className="text-slate-100">Lakktilstand</strong> – skader, riper, oksidasjon, hologrammer
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-400" />
                <span>
                  <strong className="text-slate-100">Coating-vurdering</strong> – gjenstående beskyttelse, når coating bør fornyes
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-400" />
                <span>
                  <strong className="text-slate-100">Estimering</strong> – hvor mye arbeid trengs for å fikse lakken
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-400" />
                <span>
                  <strong className="text-slate-100">Dokumentasjon</strong> – før/etter-bilder med AI-notater
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              Eksempel: AI-analyse
            </p>
            <div className="mt-4 space-y-3 text-sm">
              <div className="rounded-lg border border-slate-700 bg-slate-950/80 p-3">
                <p className="font-medium text-slate-100">Lakktilstand: 6/10</p>
                <p className="mt-1 text-xs text-slate-400">
                  Moderat oksidasjon på panser og tak. Lette hologrammer på sidepaneler. 
                  3-4 timer polering anbefales før coating.
                </p>
              </div>
              <div className="rounded-lg border border-purple-700/70 bg-purple-900/20 p-3">
                <p className="font-medium text-purple-200">Coating: 40% gjenstående</p>
                <p className="mt-1 text-xs text-purple-200/80">
                  Coating er slitt på eksponerte områder. Anbefaler årskontroll om 4-6 måneder.
                </p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-950/80 p-3">
                <p className="font-medium text-slate-100">Estimert: 3,5 timer + materialer</p>
                <p className="mt-1 text-xs text-slate-400">
                  Inkludert dekontaminering, 2-trinns polering og ny coating.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Fordeler */}
        <section className="space-y-6 py-12">
          <h2 className="text-2xl font-semibold">Hvorfor bruke AI-bildeanalyse?</h2>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <h3 className="text-lg font-semibold text-slate-50">Konsistente vurderinger</h3>
              <p className="mt-2 text-sm text-slate-400">
                Alle biler vurderes etter samme standard – uavhengig av hvem som sjekker. 
                Slutt med "jeg synes"-diskusjoner med kunden.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <h3 className="text-lg font-semibold text-slate-50">Spar tid på inspeksjon</h3>
              <p className="mt-2 text-sm text-slate-400">
                Ta bilder med mobilen, få analyse på sekunder. Bruk tiden på verkstedgulvet 
                istedenfor i møterom med kunden.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <h3 className="text-lg font-semibold text-slate-50">Dokumentasjon som selger</h3>
              <p className="mt-2 text-sm text-slate-400">
                Send profesjonelle rapporter til kunden med før/etter og AI-vurderinger. 
                Gjør det enklere å selge årskontroller og nye coating-pakker.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Demo */}
        <section id="demo" className="space-y-6 py-12">
          <h2 className="text-2xl font-semibold">Prøv AI-analysen selv</h2>
          <p className="text-sm text-slate-300">
            Test hvordan LYX Vision analyserer kundemeldinger og bilder. Skriv inn tekst eller legg til bilde-URLer for å se analysen i aksjon.
          </p>
          <VisionAnalyzerDemo />
        </section>

        {/* CTA */}
        <section className="mt-12 space-y-4 text-center">
          <h2 className="text-2xl font-semibold">Vil du teste LYX Vision?</h2>
          <p className="text-sm text-slate-300">
            LYX Vision er tilgjengelig for utvalgte LYXso-partnere. Kontakt oss for å bli pilotbruker.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/kontakt"
              className="rounded-md bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-500"
            >
              Kontakt oss
            </Link>
            <Link
              href="/"
              className="rounded-md border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-100 hover:border-slate-500"
            >
              Tilbake til hovedside
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
