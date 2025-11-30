// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <main className="mx-auto max-w-7xl space-y-20 px-4 py-12 lg:px-8 lg:py-16">
        
        {/* 2.1 Hero-seksjon */}
        <section className="space-y-8">
          <div className="max-w-4xl space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              ServiceOS for bilbransjen – alt fra booking til dekkhotell og AI i én plattform
            </h1>
            
            <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
              LYXso samler booking, kunder, kjøretøy, dekkhotell, betalinger, regnskap og markedsføring i ett system. Bygd i Norge, sammen med ekte bilpleiebedrifter – for deg som vil ha kontroll på kapasitet, økonomi og vekst.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/bli-partner"
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
              >
                Bli partner
              </Link>
              <Link
                href="#moduler"
                className="rounded-lg border border-slate-600 bg-slate-900/80 px-6 py-3 text-sm font-semibold text-slate-100 hover:border-blue-400 transition-colors"
              >
                Se hvordan LYXso fungerer
              </Link>
            </div>

            <p className="text-xs text-slate-400 pt-2">
              Ingen binding. Du betaler først når du er klar til å bruke systemet i drift.
            </p>
          </div>
        </section>

        {/* 2.2 Social proof / trygghet */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 lg:p-10">
          <h2 className="text-2xl font-bold mb-4">Bygd i verkstedet – ikke på et møterom</h2>
          <p className="text-slate-300 leading-relaxed max-w-3xl">
            LYXso er utviklet sammen med LYX Bil i Oslo og andre bilbedrifter som trengte mer enn bare en kalender. Resultatet er et system som forstår hverdagen din: lange behandlinger, dekkhotell, sesongtopper, coating-oppfølging og kunder som vil ha rask respons.
          </p>
          <p className="text-sm text-slate-400 mt-6">
            På sikt: logoer for partnere kommer her.
          </p>
        </section>

        {/* 2.3 Tre kjernefordeler */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Hvorfor velge LYXso?</h2>
          
          <div className="grid gap-6 md:grid-cols-3 pt-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
              <h3 className="text-xl font-semibold text-blue-400">Full kontroll på kapasitet</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Se kapasiteten din på tvers av ansatte, tjenester og lokasjoner. LYXso hindrer dobbeltbookinger, hjelper deg å fylle hull i kalenderen og gjør det enkelt å planlegge lengre jobber som coating, PPF og skade/lakk.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
              <h3 className="text-xl font-semibold text-blue-400">Alt på ett sted</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Hver kunde får sin egen profil med kjøretøy, historikk, dekksett, behandlinger og notater. Du ser hva som er gjort, hva som er anbefalt neste steg – og hva som kan selges inn ved neste besøk.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
              <h3 className="text-xl font-semibold text-blue-400">AI som jobber når du ikke rekker</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                LYXso sine AI-moduler kan håndtere leads, foreslå bookinger, hjelpe deg å skrive kampanjer og forklare tallene i rapportene. Du velger selv hvor mye du vil automatisere – vi bygger det lag for lag.
              </p>
            </div>
          </div>
        </section>

        {/* 2.4 Moduler / hovedfunksjoner */}
        <section id="moduler" className="space-y-6">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold">Ett system – flere moduler som henger sammen</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 pt-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 space-y-3">
              <h3 className="text-lg font-semibold">Booking & kalender</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Moderne bookingmotor med oversikt per ansatt, tjeneste og ressurs. Se ledige tider, filtrer på tjenester og legg inn bookinger direkte fra telefon, nettbrett eller PC. Systemet tar hensyn til varighet, buffer og åpningstider.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 space-y-3">
              <h3 className="text-lg font-semibold">Kunder, kjøretøy & dekkhotell</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Full kundehistorikk med kjøretøy, dekksett, bilder, notater og tidligere behandlinger. Dekkhotell-modulen gir deg oversikt på hvor hvert dekksett står, hvilken bil det tilhører og når det bør sjekkes eller byttes.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 space-y-3">
              <h3 className="text-lg font-semibold">Coating & oppfølging</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Registrer coating-jobber, produkter, lag, garanti og planlagte kontroller. LYXso kan sette opp automatisk oppfølging i inntil 5 år, med påminnelser til kunden før hver kontroll.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 space-y-3">
              <h3 className="text-lg font-semibold">Markedsføring & leads</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Lag kampanjer, samle inn leads og følg hele løpet fra annonse til booking. AI kan hjelpe deg med annonsetekster, vinklinger og oppfølging av leads for å få flere kunder inn i kalenderen.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 space-y-3">
              <h3 className="text-lg font-semibold">Betaling & regnskap</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Koble LYXso mot kasseløsning, nettbetaling og regnskapssystem. Få oversikt over omsetning per tjeneste, dag, uke og måned – og klargjør data for Fiken, PowerOffice, Tripletex m.fl. (integrasjoner aktiveres per partner).
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 space-y-3">
              <h3 className="text-lg font-semibold">Partnerportal for bedriften din</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Hver bedrift får en egen portal med booking, kunder, dekkhotell, markedsføring, rapporter og innstillinger. Alt er multi-tenant, slik at du trygt kan vokse med flere lokasjoner og ansatte.
              </p>
            </div>
          </div>
        </section>

        {/* 2.5 For hvem? */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 lg:p-10 space-y-6">
          <h2 className="text-3xl font-bold">Hvem er LYXso laget for?</h2>
          <p className="text-slate-300 leading-relaxed max-w-3xl">
            LYXso er skreddersydd for bedrifter som jobber med bil og kjøretøy – og som vil ha mer struktur, mindre manuelt arbeid og bedre utnyttelse av hver time.
          </p>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-4 text-sm">
            <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3">
              <span className="text-blue-400">✓</span>
              <span className="text-slate-200">Bilpleie og detailing</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3">
              <span className="text-blue-400">✓</span>
              <span className="text-slate-200">Dekkhotell og dekksentre</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3">
              <span className="text-blue-400">✓</span>
              <span className="text-slate-200">Bilklargjøring og bilkosmetikk</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3">
              <span className="text-blue-400">✓</span>
              <span className="text-slate-200">PPF- og foliefirma</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3">
              <span className="text-blue-400">✓</span>
              <span className="text-slate-200">Skade, lakk og karosseri</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3">
              <span className="text-blue-400">✓</span>
              <span className="text-slate-200">Mindre verksteder med timebaserte tjenester</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 sm:col-span-2 lg:col-span-1">
              <span className="text-blue-400">✓</span>
              <span className="text-slate-200">Mobile bilpleiere og ambulerende tjenester</span>
            </div>
          </div>
        </section>

        {/* 2.6 AI-lag */}
        <section className="space-y-6">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold">LYXso + AI = mindre mas, mer verdi</h2>
            <p className="text-slate-300">
              AI i LYXso er ikke pynt – det er praktisk hjelp i hverdagen. Du velger selv hvilke byggeklosser du vil aktivere.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 pt-4">
            <div className="rounded-xl border border-blue-700/70 bg-blue-900/20 p-6 space-y-3">
              <h3 className="text-lg font-semibold text-blue-200">AI for leads & booking</h3>
              <p className="text-sm text-blue-100/80 leading-relaxed">
                AI kan ta imot henvendelser, forklare tjenester, foreslå riktig behandling og legge inn bookingforslag direkte i kalenderen. Perfekt når det tikker inn meldinger på kveldstid eller i sesongrush.
              </p>
            </div>

            <div className="rounded-xl border border-purple-700/70 bg-purple-900/20 p-6 space-y-3">
              <h3 className="text-lg font-semibold text-purple-200">AI for kampanjer og tekst</h3>
              <p className="text-sm text-purple-100/80 leading-relaxed">
                Beskriv hva du ønsker å selge – så kan AI hjelpe deg med annonsetekster, e-poster, SMS, landingssider og innhold til sosiale medier, basert på tjenestene du allerede har i LYXso.
              </p>
            </div>

            <div className="rounded-xl border border-emerald-700/70 bg-emerald-900/20 p-6 space-y-3">
              <h3 className="text-lg font-semibold text-emerald-200">AI for rapporter & innsikt</h3>
              <p className="text-sm text-emerald-100/80 leading-relaxed">
                Tall uten forklaring hjelper ingen. LYXso kan oversette booking- og salgsdata til enkel norsk, og gi deg forslag til tiltak: hvilke tjenester som bør pushes, hvilke tider som kan fylles bedre og hvor kampanjene dine faktisk fungerer.
              </p>
            </div>
          </div>
        </section>

        {/* 2.7 Planer & priser */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold">Planer som vokser med bedriften din</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              LYXso er bygget for å være fleksibelt. Du kan starte enkelt, og aktivere flere moduler etter hvert som bedriften vokser.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 pt-4">
            <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold">Start</h3>
                <p className="text-sm text-slate-400 mt-1">For små aktører og testing</p>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>Grunnleggende booking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>Enkle kundekort</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>Standard rapporter</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border-2 border-blue-500 bg-slate-900/80 p-6 space-y-4 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                Populær
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-400">Pro</h3>
                <p className="text-sm text-slate-400 mt-1">For etablerte verksteder og dekkhotell</p>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>Alt i Start</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>Kjøretøy og dekkhotell</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>Coating-oppfølging</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>Markedsføring & leads</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold">Max</h3>
                <p className="text-sm text-slate-400 mt-1">For bedrifter som vil automatisere mest mulig</p>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>Alt i Pro</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>AI-leadshåndtering</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>Avansert rapportering</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>Prioritert support og onboarding</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link
              href="/kontakt"
              className="inline-block rounded-lg border border-slate-600 bg-slate-900/80 px-6 py-3 text-sm font-semibold text-slate-100 hover:border-blue-400 transition-colors"
            >
              Snakk med oss om hvilken plan som passer best for din bedrift
            </Link>
          </div>
        </section>

        {/* 2.8 Testimonials */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Erfaringer fra verkstedgulvet</h2>
          
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 max-w-3xl mx-auto">
            <p className="text-lg text-slate-300 italic leading-relaxed mb-4">
              "Vi gikk fra kaotisk kalender, lapper og Messenger-meldinger – til full oversikt på en skjerm. Dekkhotell, coatingkunder og daglig drift føles endelig håndterbart."
            </p>
            <p className="text-sm text-slate-400">
              – Daglig leder, bilpleieverksted i Oslo
            </p>
          </div>

          <p className="text-xs text-slate-500 text-center">
            Eksempel-sitat (kan byttes med ekte senere)
          </p>
        </section>

        {/* CTA før footer */}
        <section className="rounded-2xl border-2 border-blue-600/50 bg-gradient-to-br from-blue-900/20 to-slate-900/40 p-8 lg:p-12 text-center space-y-6">
          <h2 className="text-3xl font-bold">Klar til å ta kontroll på bil-driften?</h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Bli med i et begrenset antall partnere som bygger fremtidens bilpleie-drift sammen med LYXso.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/bli-partner"
              className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
            >
              Bli partner nå
            </Link>
            <Link
              href="/kontakt"
              className="rounded-lg border border-slate-600 bg-slate-900/80 px-8 py-3 text-sm font-semibold text-slate-100 hover:border-blue-400 transition-colors"
            >
              Kontakt oss
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
