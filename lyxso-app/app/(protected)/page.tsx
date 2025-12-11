import Link from "next/link";

export default function PartnerHomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Toppseksjon */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              LYXso partnerpanel
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Dette er hovedsiden for din bedrift. Herfra styrer du
              booking, kunder, tjenester, ansatte og oppgjør – alt på
              ett sted.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/booking"
              className="inline-flex items-center rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400"
            >
              + Ny booking
            </Link>
            <Link
              href="/kunder"
              className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-100 hover:border-indigo-400 hover:text-indigo-100"
            >
              Åpne kunderegister
            </Link>
          </div>
        </header>

        {/* KPI-rad – kan kobles til ekte tall senere */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="text-xs uppercase tracking-wide text-slate-400">
              Dagens bookinger
            </div>
            <div className="mt-2 text-2xl font-semibold">0</div>
            <div className="mt-1 text-[11px] text-slate-500">
              Vises automatisk når kalenderen er i bruk.
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="text-xs uppercase tracking-wide text-slate-400">
              Aktive kunder
            </div>
            <div className="mt-2 text-2xl font-semibold">0</div>
            <div className="mt-1 text-[11px] text-slate-500">
              Teller kunder i CRM som har hatt booking siste 12 mnd.
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="text-xs uppercase tracking-wide text-slate-400">
              Årskontroller
            </div>
            <div className="mt-2 text-2xl font-semibold">0</div>
            <div className="mt-1 text-[11px] text-slate-500">
              Her kommer oversikt over coating-/servicekontroller.
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="text-xs uppercase tracking-wide text-slate-400">
              Neste utbetaling
            </div>
            <div className="mt-2 text-2xl font-semibold">
              – kr
            </div>
            <div className="mt-1 text-[11px] text-slate-500">
              Kobles til modul for nettoppgjør og partnerutbetalinger.
            </div>
          </div>
        </section>

        {/* Snarveier til moduler */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-200">
            Moduler i systemet
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/booking"
              className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-4 hover:border-indigo-500 hover:bg-slate-900/90 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold">
                    Booking & kapasitet
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Opprett bookinger, styr kapasitet per ansatt og få
                    oversikt over dagens og fremtidige jobber.
                  </p>
                </div>
                <span className="text-xs text-indigo-300 group-hover:text-indigo-200">
                  Åpne →
                </span>
              </div>
            </Link>

            <Link
              href="/kunder"
              className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-4 hover:border-indigo-500 hover:bg-slate-900/90 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold">
                    Kunder & historikk
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Full oversikt over kunder, kontaktinfo og
                    booking-historikk. Grunnlaget for oppfølging og
                    årskontroller.
                  </p>
                </div>
                <span className="text-xs text-indigo-300 group-hover:text-indigo-200">
                  Åpne →
                </span>
              </div>
            </Link>

            <Link
              href="/tjenester"
              className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-4 hover:border-indigo-500 hover:bg-slate-900/90 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold">
                    Tjenester & priser
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Definer hvilke tjenester du tilbyr, varighet, priser
                    og hvilke ansatte som kan utføre hva.
                  </p>
                </div>
                <span className="text-xs text-indigo-300 group-hover:text-indigo-200">
                  Åpne →
                </span>
              </div>
            </Link>

            <Link
              href="/ansatte"
              className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-4 hover:border-indigo-500 hover:bg-slate-900/90 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold">
                    Ansatte & roller
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Administrer ansatte, roller og hvilke tjenester
                    hver enkelt kan bookes på.
                  </p>
                </div>
                <span className="text-xs text-indigo-300 group-hover:text-indigo-200">
                  Åpne →
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* Info-boks nederst */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <h2 className="text-sm font-semibold text-slate-200">
            Kom i gang med LYXso
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            1) Legg inn ansatte og tjenester. 2) Koble ansatte til
            tjenestene de kan utføre. 3) Opprett de første bookingene
            via booking-panelet. Når det er gjort, vil dashboardet her
            begynne å fylles med ekte tall.
          </p>
        </section>
      </div>
    </div>
  );
}
