// app/kontakt/page.tsx

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kontakt LYXso",
  description:
    "Ta kontakt med LYXso for spørsmål om partneravtale, funksjoner eller teknisk oppsett.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-10 space-y-10">
        {/* Intro */}
        <section className="space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">
            KONTAKT
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            La oss se om LYXso passer{" "}
            <span className="text-blue-400">din drift</span>.
          </h1>
          <p className="max-w-2xl text-sm text-slate-300">
            Har du spørsmål om funksjoner, pris, integrasjoner eller hvordan
            LYXso kan settes opp for din bedrift? Send oss en kort beskrivelse,
            så tar vi kontakt.
          </p>
        </section>

        {/* Kontaktinfo */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-200">
            <h2 className="text-sm font-semibold">Direkte kontakt</h2>
            <p className="text-xs text-slate-300">
              LYXso leveres av LYX Bilpleie AS. Henvendelser om systemet kan
              gå via samme kontaktpunkter.
            </p>
            <div className="mt-2 space-y-1 text-xs">
              <p>
                <span className="font-semibold">E-post:</span>{" "}
                <a
                  href="mailto:post@lyxbil.no"
                  className="text-blue-300 hover:underline"
                >
                  post@lyxbil.no
                </a>
              </p>
              <p>
                <span className="font-semibold">Telefon:</span>{" "}
                <a
                  href="tel:+4747304730"
                  className="text-blue-300 hover:underline"
                >
                  +47 473 04 730
                </a>
              </p>
              <p>
                <span className="font-semibold">Adresse:</span> Eikenga 25,
                0579 Oslo
              </p>
            </div>
          </div>

          {/* “Skjema” – foreløpig bare tekst + knapper */}
          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm">
            <h2 className="text-sm font-semibold">Hva ønsker du hjelp med?</h2>
            <p className="text-xs text-slate-300">
              Typiske henvendelser handler om oppsett av booking, flyt for
              coating-kontroller, dekkhotell, integrasjoner mot regnskap og
              hvor langt vi har kommet med AI-modulene.
            </p>
            <ul className="mt-2 space-y-1 text-xs text-slate-200">
              <li>• Komme i gang som LYXso-partner</li>
              <li>• Flytting fra eksisterende bookingsystem</li>
              <li>• Spesielle behov (flere avdelinger, mobile team osv.)</li>
            </ul>

            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/bli-partner"
                className="inline-flex items-center rounded-lg bg-blue-500 px-4 py-2 text-xs font-medium text-white hover:bg-blue-400"
              >
                Bli partner / book gjennomgang
              </Link>
              <a
                href="mailto:post@lyxbil.no?subject=Spørsmål%20om%20LYXso"
                className="inline-flex items-center rounded-lg border border-slate-600 bg-slate-950 px-4 py-2 text-xs font-medium text-slate-100 hover:border-blue-400"
              >
                Send oss en e-post
              </a>
            </div>
          </div>
        </section>

        <p className="text-[11px] text-slate-500">
          Vi foretrekker å sette opp LYXso tett på faktisk drift. Jo mer du
          forteller om hvordan verkstedet jobber i dag, jo lettere er det å
          gi deg en konkret anbefaling.
        </p>
      </div>
    </div>
  );
}
