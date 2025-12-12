// app/lyxba/page.tsx

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "LYXba – AI Booking Agent for bilpleie",
  description:
    "LYXba er din AI-drevne booking-assistent som tar telefoner, svarer på meldinger og booker timer 24/7. Aldri gå glipp av en kunde igjen.",
};

export default function LyxbaPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <main className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
        {/* Hero */}
        <section className="space-y-6 pb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            LYXba – AI Booking Agent
          </div>

          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Aldri gå glipp av en kunde igjen med{" "}
            <span className="text-emerald-400">AI som booker for deg</span>
          </h1>

          <p className="max-w-2xl text-lg text-slate-200">
            LYXba er din AI-drevne booking-assistent som svarer på telefoner, 
            håndterer meldinger og booker timer døgnet rundt. Kundene får svar med en gang – 
            du slipper å avbryte jobben.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="#demo"
              className="rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-500"
            >
              Hør demo av LYXba
            </Link>
            <Link
              href="/kontakt"
              className="rounded-md border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-100 hover:border-slate-500"
            >
              Kontakt oss
            </Link>
          </div>
        </section>

        {/* Hva er LYXba */}
        <section className="grid gap-8 py-12 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Hva er LYXba?</h2>
            <p className="text-sm text-slate-300">
              LYXba er en AI-agent som fungerer som din digitale resepsjonist og booking-ansvarlig. Den kan:
            </p>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>
                  <strong className="text-slate-100">Ta telefoner 24/7</strong> – svarer med en gang, selv når du er opptatt
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>
                  <strong className="text-slate-100">Booke timer direkte</strong> – sjekker kalender og finner ledig plass
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>
                  <strong className="text-slate-100">Håndtere avbestillinger</strong> – kunden kan kansellere eller endre time
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>
                  <strong className="text-slate-100">Svare på vanlige spørsmål</strong> – priser, åpningstider, tjenester
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>
                  <strong className="text-slate-100">Sende påminnelser</strong> – SMS og e-post før timeavtale
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              Eksempel: Samtale med LYXba
            </p>
            <div className="mt-4 space-y-3 text-sm">
              <div className="rounded-lg border border-slate-700 bg-slate-950/80 p-3">
                <p className="text-xs text-slate-400">👤 Kunde</p>
                <p className="mt-1 text-sm text-slate-200">
                  "Hei, jeg vil bestille coating på bilen min. Har dere ledig neste uke?"
                </p>
              </div>
              <div className="rounded-lg border border-emerald-700/70 bg-emerald-900/20 p-3">
                <p className="text-xs text-emerald-300">🤖 LYXba</p>
                <p className="mt-1 text-sm text-emerald-100">
                  "Ja, vi har ledig torsdag 14. mars kl. 09:00 og fredag 15. mars kl. 13:00. 
                  Hvilken dag passer best?"
                </p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-950/80 p-3">
                <p className="text-xs text-slate-400">👤 Kunde</p>
                <p className="mt-1 text-sm text-slate-200">
                  "Fredag er perfekt!"
                </p>
              </div>
              <div className="rounded-lg border border-emerald-700/70 bg-emerald-900/20 p-3">
                <p className="text-xs text-emerald-300">🤖 LYXba</p>
                <p className="mt-1 text-sm text-emerald-100">
                  "Flott! Du er booket fredag 15. mars kl. 13:00 for coating. 
                  Du får bekreftelse på SMS og e-post. Ha en fin dag!"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Fordeler */}
        <section className="space-y-6 py-12">
          <h2 className="text-2xl font-semibold">Hvorfor trenger du LYXba?</h2>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <h3 className="text-lg font-semibold text-slate-50">Aldri gå glipp av leads</h3>
              <p className="mt-2 text-sm text-slate-400">
                60% av kundene som ringer etter stengetid eller ikke får svar, bestiller hos en annen. 
                LYXba tar alle henvendelser – alltid.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <h3 className="text-lg font-semibold text-slate-50">Frigjør tid til det som betyr noe</h3>
              <p className="mt-2 text-sm text-slate-400">
                Slutt å avbryte jobben for å svare "Når har dere ledig?". 
                LYXba håndterer bookingen – du fokuserer på verkstedet.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <h3 className="text-lg font-semibold text-slate-50">24/7 booking uten ekstra bemanning</h3>
              <p className="mt-2 text-sm text-slate-400">
                Kunder kan booke når de vil – også kl. 22 på kvelden eller i helgene. 
                Du trenger ikke ansette flere.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 space-y-4 text-center">
          <h2 className="text-2xl font-semibold">Når kommer LYXba?</h2>
          <p className="text-sm text-slate-300">
            LYXba er under utvikling og rulles ut til utvalgte LYXso-partnere i løpet av 2025. 
            Vil du være tidlig ute? Kontakt oss for å bli pilotbruker.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/kontakt"
              className="rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-500"
            >
              Bli pilotbruker
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
