// app/om-lyxso/page.tsx
import Link from "next/link";

export default function OmLyxso Page() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <main className="mx-auto max-w-5xl space-y-16 px-4 py-12 lg:px-8 lg:py-16">
        
        {/* Hero */}
        <section className="space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Om LYXso
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">
            ServiceOS for bilbransjen – bygd av folk som faktisk jobber med biler, ikke bare skriver kode.
          </p>
        </section>

        {/* Historien */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Hvordan LYXso ble til</h2>
          <div className="space-y-4 text-slate-300 leading-relaxed">
            <p>
              LYXso startet ikke som et tech-prosjekt. Det startet med en frustrasjon: hvorfor finnes det ingen systemer som faktisk forstår hverdagen til bilpleie-bedrifter?
            </p>
            <p>
              Mens LYX Bil vokste i Oslo, ble det tydelig at eksisterende bookingsystemer og CRM-løsninger ikke var bygd for langvarige behandlinger, coating-oppfølging over flere år, dekkhotell med hundrevis av dekksett, eller kunder som vil ha rask respons på kveldstid.
            </p>
            <p>
              Så vi bestemte oss for å bygge løsningen selv – ikke som et produkt for å selge, men som et verktøy vi faktisk ville bruke hver dag.
            </p>
            <p>
              Resultatet ble LYXso: et system som tar høyde for de tingene ingen andre tenker på. Som at en coating-kunde trenger oppfølging i 5 år. At dekkhotell-kunder vil ha SMS når det er tid for hjulskift. At verkstedet trenger å vite nøyaktig hvor mange kvadratmeter PPF som ble brukt på en jobb. At AI faktisk kan ta telefoner og booke timer mens du er opptatt med en kunde.
            </p>
          </div>
        </section>

        {/* Visjonen */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 lg:p-10 space-y-6">
          <h2 className="text-3xl font-bold">Visjonen</h2>
          <p className="text-slate-300 leading-relaxed">
            LYXso skal være det mest komplette alt-i-ett-systemet for bil-driften – fra første lead til ferdig betalt jobb. Ikke et lappverk av ulike systemer som ikke snakker sammen, men én plattform hvor alt henger sammen.
          </p>
          <p className="text-slate-300 leading-relaxed">
            Vi vil at partnerne våre skal bruke mindre tid på administrasjon og mer tid på det de faktisk liker: å jobbe med biler.
          </p>
        </section>

        {/* Hva gjør LYXso annerledes */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Hva gjør LYXso annerledes?</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
              <h3 className="text-xl font-semibold text-blue-400">Bygd for bilbransjen</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Andre systemer prøver å passe for alle bransjer. LYXso er kun for bil – og derfor har vi funksjoner som dekkhotell, coating-oppfølging og kjøretøy-kort som standard.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
              <h3 className="text-xl font-semibold text-blue-400">Testet i virkeligheten</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Vi bruker LYXso selv, hver dag, i ekte drift. Hver feature er testet av folk som faktisk jobber på verkstedgulvet – ikke bare utviklere som aldri har sett innsiden av et bilpleie-verksted.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
              <h3 className="text-xl font-semibold text-blue-400">AI som gir mening</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                AI i LYXso er ikke buzzwords – det er praktiske verktøy som faktisk sparer deg tid. Fra AI som tar telefoner og booker timer, til AI som hjelper deg å skrive kampanjer og forklare økonomien.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
              <h3 className="text-xl font-semibold text-blue-400">Norsk og nordisk fokus</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                LYXso er bygd for norske og nordiske bedrifter. Integrasjoner mot Fiken, Tripletex, Vipps og andre systemer som faktisk brukes her – ikke bare amerikanske løsninger.
              </p>
            </div>
          </div>
        </section>

        {/* Teamet */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Teamet bak LYXso</h2>
          <p className="text-slate-300 leading-relaxed">
            LYXso er utviklet av et lite, dedikert team som kombinerer erfaring fra bilbransjen og tech. Vi har jobbet i bilpleie, detailing og coating – og vi har bygget systemer før. Nå bygger vi systemet vi selv ønsker å bruke.
          </p>
          <p className="text-slate-300 leading-relaxed">
            Vi er ikke et stort selskap med 100 ansatte. Vi er en liten gruppe som kan bevege oss raskt, lytte til partnerne våre og faktisk gjøre endringer når noe ikke fungerer.
          </p>
        </section>

        {/* Partnerskapet */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 lg:p-10 space-y-6">
          <h2 className="text-3xl font-bold">Hvordan fungerer partnerskapet?</h2>
          <p className="text-slate-300 leading-relaxed">
            LYXso er ikke et ferdig produkt som du bare "kjøper". Vi ser på det som et partnerskap hvor vi bygger systemet sammen med bedriftene som bruker det.
          </p>
          <p className="text-slate-300 leading-relaxed">
            Det betyr at når du blir partner, får du ikke bare et system – du får en stemme i hvordan LYXso utvikler seg videre. Features, prioriteringer og integrasjoner bestemmes i dialog med partnerne våre.
          </p>
          <p className="text-slate-300 leading-relaxed">
            Vi starter med et begrenset antall partnere for å sikre at vi kan gi god support og faktisk levere på det vi lover. Når systemet er stabilt og modent, åpner vi opp for flere.
          </p>
        </section>

        {/* CTA */}
        <section className="text-center space-y-6 pt-8">
          <h2 className="text-3xl font-bold">Vil du være med å forme fremtiden for bilpleie-drift?</h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Vi ser etter partnere som vil mer enn bare et bookingsystem – partnere som vil digitalisere hele driften og være med på å bygge noe bedre.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              href="/bli-partner"
              className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
            >
              Bli partner
            </Link>
            <Link
              href="/kontakt"
              className="rounded-lg border border-slate-600 bg-slate-900/80 px-8 py-3 text-sm font-semibold text-slate-100 hover:border-blue-400 transition-colors"
            >
              Snakk med oss først
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
