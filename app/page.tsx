// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Innhold */}
      <main className="mx-auto max-w-6xl space-y-12 px-4 py-10 lg:px-8 lg:py-14">
        {/* Hero */}
        <section
          id="produkt"
          className="grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2.2fr)]"
        >
          <div className="space-y-6">
            <p className="inline-flex items-center rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-blue-200">
              LYXso • ServiceOS for bilpleie
            </p>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Ett system for hele{" "}
              <span className="text-blue-400">
                bil-driften, systemet bedriften din har savnet.
              </span>
            </h1>

            <p className="max-w-xl text-sm text-slate-200">
              LYXso samler booking, kalender, kundekort, markedsføring,
              regnskap og AI-oppfølging i én plattform –{" "}
              <span className="font-medium">
                spesielt tilpasset bedrifter innen bilbransjen.
              </span>
            </p>

            <div className="flex flex-wrap gap-3 text-xs">
              <Link 
                href="/lyx-vision"
                className="inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-500/10 px-3 py-1 text-purple-100 hover:bg-purple-500/20 transition-colors"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-purple-300" />
                LYX Vision – AI bildeanalyse
              </Link>
              <Link
                href="/lyxba"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-emerald-200 hover:bg-emerald-500/20 transition-colors"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                LYXba – AI Booking Agent
              </Link>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/login"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
              >
                Logg inn som partner
              </Link>
              <Link
                href="#moduler"
                className="rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-100 hover:border-slate-500"
              >
                Book en gjennomgang
              </Link>
            </div>

            <p className="pt-2 text-[11px] text-slate-400">
              LYXso er utviklet i Norge – og laget for å være det beste
              alt-i-ett-systemet for bilbransjen i Norden.
            </p>
          </div>

          {/* Høyre: partnerpanel-glimt */}
          <aside className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              Et glimt inn i partnerpanelet
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-700 bg-slate-950/80 p-4">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  I dag
                </p>
                <p className="mt-1 text-2xl font-semibold text-slate-50">
                  8 bookinger
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Coating, rens, hjulskift og dekkhotell.
                </p>
              </div>

              <div className="rounded-xl border border-emerald-700/70 bg-emerald-900/20 p-4">
                <p className="text-[11px] font-medium uppercase tracking-wide text-emerald-300">
                  Omsetning denne måneden
                </p>
                <p className="mt-1 text-2xl font-semibold text-emerald-200">
                  287 100,-
                </p>
                <p className="mt-1 text-[11px] text-emerald-200/80">
                  Hentet direkte fra bankterminal og booking.
                </p>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-950/80 p-4">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Årskontroller coating
                </p>
                <p className="mt-1 text-xl font-semibold text-slate-50">
                  23 avtaler
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  LYXso følger opp kundene for deg.
                </p>
              </div>

              <div className="rounded-xl border border-purple-700/70 bg-purple-900/25 p-4">
                <p className="text-[11px] font-medium uppercase tracking-wide text-purple-200">
                  Leads klare for AI
                </p>
                <p className="mt-1 text-xl font-semibold text-purple-100">
                  14 nye
                </p>
                <p className="mt-1 text-[11px] text-purple-100/80">
                  LYXba ringer, svarer og booker automatisk.
                </p>
              </div>
            </div>

            <p className="pt-1 text-[10px] text-slate-500">
              Skjermbildene er illustrasjoner, men basert på ekte moduler i
              partnerpanelet.
            </p>
          </aside>
        </section>

        {/* Moduler i LYXso */}
        <section id="moduler" className="space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
            Moduler i LYXso
          </p>
          <h2 className="text-xl font-semibold text-slate-50">
            Alt du trenger – bygd for bilbransjen, ikke generiske
            “one-size-fits-all”-systemer.
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-sm font-semibold text-slate-50">
                Booking &amp; kalender
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Smarte kalendere, kapasitet per ansatt og tydelig oversikt over
                dag, uke og måned.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-sm font-semibold text-slate-50">
                Kunder &amp; CRM
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Kundekort, historikk, kjøretøy og dekkhotell – alt på ett sted.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-sm font-semibold text-slate-50">
                Regnskap &amp; betaling
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Klar for integrasjoner mot bankterminal og regnskap – med
                AI-støtte for bokføring.
              </p>
            </div>
            
            <Link href="/lyx-vision" className="rounded-2xl border border-purple-700/70 bg-purple-900/20 p-4 hover:bg-purple-900/30 transition-colors">
              <p className="text-sm font-semibold text-purple-100">
                LYX Vision – AI bildeanalyse
              </p>
              <p className="mt-1 text-xs text-purple-200/80">
                AI-analyse av lakk, coating og tilstand. Konsistente vurderinger og estimater på sekunder.
              </p>
            </Link>
            
            <Link href="/lyxba" className="rounded-2xl border border-emerald-700/70 bg-emerald-900/20 p-4 hover:bg-emerald-900/30 transition-colors">
              <p className="text-sm font-semibold text-emerald-200">
                LYXba – AI Booking Agent
              </p>
              <p className="mt-1 text-xs text-emerald-200/80">
                AI som tar telefoner, booker timer og følger opp kunder 24/7. Aldri gå glipp av en lead.
              </p>
            </Link>
            
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-sm font-semibold text-slate-50">
                Coating-løp &amp; årskontroller
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Automatisk oppfølging av coating-kunder, påminnelser om årskontroll og dokumentasjon.
              </p>
            </div>
          </div>
        </section>

        {/* Fordeler */}
        <section id="fordeler" className="space-y-2 pt-6 text-sm text-slate-300">
          <h2 className="text-base font-semibold text-slate-50">Fordeler</h2>
          <p>
            Mindre tid i Excel og innboksen – mer tid på verkstedgulvet. LYXso
            er laget sammen med bilpleie-miljøet og optimalisert for coating,
            rens, dekk og skade.
          </p>
        </section>

        {/* Om LYXso */}
        <section id="om-lyxso" className="space-y-2 pt-4 text-sm text-slate-300">
          <h2 className="text-base font-semibold text-slate-50">Om LYXso</h2>
          <p>
            LYXso er utviklet i Norge, for norske og nordiske bedrifter i
            bilbransjen. Systemet rulles først ut hos LYX Bil sine egne
            lokasjoner, før plattformen åpnes for utvalgte partnere i Norge og
            resten av Norden.
          </p>
          <p>
            Målet er enkelt: å være det mest komplette alt-i-ett-systemet for
            bil-driften – fra første lead til ferdig betalt jobb.
          </p>
        </section>

        {/* Kontakt */}
        <section
          id="kontakt"
          className="mt-8 border-t border-slate-800 pt-6 space-y-2 text-sm text-slate-300"
        >
          <h2 className="text-base font-semibold text-slate-50">Kontakt</h2>
          <p>Interessert i å bli pilotpartner eller vil du se en demo?</p>
          <p className="text-sm text-slate-200">
            Send en e-post til{" "}
            <a
              href="mailto:post@lyxso.no"
              className="text-blue-400 hover:underline"
            >
              post@lyxso.no
            </a>{" "}
            eller book en gjennomgang direkte i partnerportalen.
          </p>
        </section>
      </main>
    </div>
  );
}
