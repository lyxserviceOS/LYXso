// app/om-lyxso/page.tsx

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Om LYXso – ServiceOS for bilpleie",
  description:
    "Bakgrunn, visjon og tankene bak LYXso – et drifts- og bookingsystem laget av detailere, for detailere.",
};

export default function AboutLyxsoPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-10 space-y-10">
        {/* Topp-intro */}
        <section className="space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">
            OM LYXSO
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Et driftsystem bygget i en ekte{" "}
            <span className="text-blue-400">bilpleiehverdag</span>.
          </h1>
          <p className="max-w-3xl text-sm text-slate-300">
            LYXso er laget fordi eksisterende bookingsystemer aldri helt traff
            hverdagen i bilpleie, lakk og dekk. Enten var de for generelle, for
            dyre – eller så manglet de kontroll på coating-løp, dekkhotell og
            den virkelige driften bak kulissene.
          </p>
        </section>

        {/* Historie / bakgrunn */}
        <section className="grid gap-6 md:grid-cols-[1.4fr_minmax(0,1fr)]">
          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-lg font-semibold">Bak systemet</h2>
            <p className="text-sm text-slate-300">
              LYXso er utviklet sammen med LYX Bilpleie i Oslo – et senter som
              jobber med keramisk coating, dekkhotell og skade/lakk. Alle
              skjermbilder, moduler og flyter er basert på faktiske behov i
              produksjon, ikke teorier på et kontor.
            </p>
            <p className="text-sm text-slate-300">
              Målet er ikke å være nok et generisk bookingsystem, men et{" "}
              <span className="font-semibold">ServiceOS for bilpleie</span> –
              der booking, kunder, dekk, coating-løp, rapporter og
              markedsføring faktisk henger sammen.
            </p>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
            <h3 className="text-sm font-semibold">
              Hva betyr “ServiceOS for bilpleie”?
            </h3>
            <ul className="space-y-1 text-xs text-slate-200">
              <li>• Ett system for booking, kunder, dekkhotell og coating.</li>
              <li>• Bygget for å tåle AI, automasjoner og integrasjoner.</li>
              <li>• Klar for flere avdelinger, mobile team og samarbeid.</li>
              <li>• Utvidbart – du starter lite, og skrur opp etter behov.</li>
            </ul>
          </div>
        </section>

        {/* Filosofi / roadmappet kort */}
        <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-lg font-semibold">
            Filosofien bak modulene i LYXso
          </h2>
          <p className="text-sm text-slate-300">
            Kjernen i LYXso er enkel: alt som skjer rundt en bil skal kunne
            spores, dokumenteres og brukes videre. Derfor er booking,
            kunderegister, dekkhotell og coating-løp koblet sammen fra dag én.
          </p>
          <p className="text-sm text-slate-300">
            Over dette bygger vi lag på lag med moduler: AI-markedsføring,
            rapporter, regnskapsintegrasjon, årskontroller på coating, og
            avansert kapasitetstyring for flere avdelinger. Du velger selv hvor
            mye du trenger – systemet er laget for å vokse med deg.
          </p>
        </section>

        {/* CTA */}
        <section className="flex flex-col gap-3 rounded-2xl border border-blue-500/40 bg-blue-500/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Vil du være tidlig ute som LYXso-partner?
            </h2>
            <p className="text-sm text-slate-200">
              Vi starter med et begrenset antall partnere for å sikre kvalitet
              på oppsett, flyt og støtte.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/bli-partner"
              className="inline-flex items-center rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400"
            >
              Bli partner
            </Link>
            <Link
              href="/kontakt"
              className="inline-flex items-center rounded-lg border border-slate-600 bg-slate-900/80 px-4 py-2 text-sm font-medium text-slate-100 hover:border-blue-400"
            >
              Kontakt oss
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
