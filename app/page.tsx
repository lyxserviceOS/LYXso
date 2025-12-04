// app/page.tsx
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  // Sjekk om bruker er innlogget
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component kan ikke sette cookies
          }
        },
      },
    }
  );
  
  const { data: { session } } = await supabase.auth.getSession();
  
  // Hvis innlogget, redirect til dashboard
  if (session) {
    redirect('/kontrollpanel');
  }

  return (
    <>
      <Analytics />
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <main className="mx-auto max-w-7xl space-y-20 px-4 py-12 lg:px-8 lg:py-16">
          
          {/* 2.1 Hero-seksjon - Forbedret */}
          <section className="space-y-8 pt-8">
            <div className="max-w-4xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-600/30 bg-blue-600/10 px-4 py-1.5 text-xs font-medium text-blue-400 animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Bygd i Norge for norske bilverksteder
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl bg-gradient-to-r from-slate-50 via-blue-100 to-slate-50 bg-clip-text text-transparent animate-fade-in-up">
                Fra kaos til kontroll
                <span className="block text-blue-400 mt-2">på 5 minutter</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-3xl animate-fade-in-up animation-delay-200">
                LYXso er <span className="text-blue-400 font-semibold">komplett driftssystem</span> for bilpleie, dekkhotell og bilverksteder. Alt du trenger på én skjerm – booking, kunder, kjøretøy, dekkhotell, markedsføring og rapportering.
              </p>

              <div className="flex flex-wrap gap-4 pt-6 animate-fade-in-up animation-delay-400">
                <Link
                  href="/register"
                  className="group relative rounded-lg bg-blue-600 px-8 py-4 text-base font-semibold text-white hover:bg-blue-500 transition-all duration-300 shadow-xl shadow-blue-600/30 hover:shadow-2xl hover:shadow-blue-600/40 hover:scale-105"
                >
                  <span className="relative z-10">Start gratis i dag</span>
                  <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></span>
                </Link>
                <Link
                  href="#moduler"
                  className="group rounded-lg border-2 border-slate-600 bg-slate-900/80 px-8 py-4 text-base font-semibold text-slate-100 hover:border-blue-400 hover:bg-slate-900 transition-all duration-300 hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    Se hvordan det fungerer
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </span>
                </Link>
              </div>

              <div className="space-y-3 pt-4 animate-fade-in-up animation-delay-600">
                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Ingen kredittkort</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Klar på 5 minutter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Norsk support 24/7</span>
                  </div>
                </div>
                <p className="text-sm font-medium">
                  <span className="text-blue-400">🔒 Brukt av 150+ bedrifter</span> 
                  <span className="text-slate-500 mx-2">•</span>
                  <span className="text-slate-400">Data lagret i Norge/EU</span>
                  <span className="text-slate-500 mx-2">•</span>
                  <span className="text-slate-400">GDPR-kompatibel</span>
                </p>
              </div>
            </div>
          </section>

        {/* Stats bar - Key metrics - Forbedret */}
        <section className="rounded-2xl border-2 border-slate-800/50 bg-gradient-to-br from-slate-900/60 to-slate-900/30 backdrop-blur-sm px-8 py-10 shadow-xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
            <div className="group hover-lift">
              <div className="flex flex-col items-center gap-2">
                <p className="text-5xl font-bold bg-gradient-to-br from-blue-400 to-blue-600 bg-clip-text text-transparent">2500+</p>
                <p className="text-sm text-slate-400 font-medium">Aktive bookinger</p>
                <p className="text-xs text-slate-500 mt-1">I systemet akkurat nå</p>
              </div>
            </div>
            <div className="group hover-lift">
              <div className="flex flex-col items-center gap-2">
                <p className="text-5xl font-bold bg-gradient-to-br from-emerald-400 to-emerald-600 bg-clip-text text-transparent">8t</p>
                <p className="text-sm text-slate-400 font-medium">Spart per uke</p>
                <p className="text-xs text-slate-500 mt-1">Mindre administrasjon</p>
              </div>
            </div>
            <div className="group hover-lift">
              <div className="flex flex-col items-center gap-2">
                <p className="text-5xl font-bold bg-gradient-to-br from-purple-400 to-purple-600 bg-clip-text text-transparent">5 min</p>
                <p className="text-sm text-slate-400 font-medium">Til oppstart</p>
                <p className="text-xs text-slate-500 mt-1">Fra registrering til booking</p>
              </div>
            </div>
            <div className="group hover-lift">
              <div className="flex flex-col items-center gap-2">
                <p className="text-5xl font-bold bg-gradient-to-br from-blue-400 to-purple-600 bg-clip-text text-transparent">99.8%</p>
                <p className="text-sm text-slate-400 font-medium">Oppetid</p>
                <p className="text-xs text-slate-500 mt-1">Alltid tilgjengelig</p>
              </div>
            </div>
          </div>
        </section>

        {/* Before/After comparison - Forbedret */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-600/30 bg-blue-600/10 px-4 py-1.5 text-xs font-medium text-blue-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Se forskjellen
            </div>
            <h2 className="text-4xl font-bold">Fra kaos til kontroll</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Se hva LYXso gjør for verkstedet ditt – umiddelbart
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 pt-4">
            <div className="group rounded-2xl border-2 border-red-900/50 bg-gradient-to-br from-red-950/30 to-slate-950/30 p-8 space-y-6 hover-lift">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600/20 text-red-400 group-hover:scale-110 transition-transform">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-red-300">Uten LYXso</h3>
                  <p className="text-sm text-red-400/70">Typisk hverdag</p>
                </div>
              </div>
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start gap-3 group/item">
                  <span className="text-red-400 mt-1 flex-shrink-0 text-lg group-hover/item:scale-125 transition-transform">✗</span>
                  <div>
                    <p className="font-medium text-slate-200">Excel-ark overalt, ingen oversikt</p>
                    <p className="text-xs text-slate-500 mt-1">20+ filer, forskjellige versjoner</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 group/item">
                  <span className="text-red-400 mt-1 flex-shrink-0 text-lg group-hover/item:scale-125 transition-transform">✗</span>
                  <div>
                    <p className="font-medium text-slate-200">Tapte bookinger og dobbeltbookinger</p>
                    <p className="text-xs text-slate-500 mt-1">Mister 2-3 kunder per uke</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 group/item">
                  <span className="text-red-400 mt-1 flex-shrink-0 text-lg group-hover/item:scale-125 transition-transform">✗</span>
                  <div>
                    <p className="font-medium text-slate-200">Kunder ringer: "Har dere dekkene mine?"</p>
                    <p className="text-xs text-slate-500 mt-1">15-20 anrop daglig i sesong</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 group/item">
                  <span className="text-red-400 mt-1 flex-shrink-0 text-lg group-hover/item:scale-125 transition-transform">✗</span>
                  <div>
                    <p className="font-medium text-slate-200">10+ timer admin per uke</p>
                    <p className="text-xs text-slate-500 mt-1">= 40+ timer per måned bortkastet</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 group/item">
                  <span className="text-red-400 mt-1 flex-shrink-0 text-lg group-hover/item:scale-125 transition-transform">✗</span>
                  <div>
                    <p className="font-medium text-slate-200">Ingen oversikt over kapasitet</p>
                    <p className="text-xs text-slate-500 mt-1">Tomme tidsluker ikke utnyttet</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 group/item">
                  <span className="text-red-400 mt-1 flex-shrink-0 text-lg group-hover/item:scale-125 transition-transform">✗</span>
                  <div>
                    <p className="font-medium text-slate-200">Glemmer oppfølging og service</p>
                    <p className="text-xs text-slate-500 mt-1">Tapt mersalg og repeat-business</p>
                  </div>
                </li>
              </ul>
              <div className="pt-4 border-t border-red-900/30">
                <p className="text-xs text-red-300/70 text-center">
                  Estimert tap: <span className="font-bold text-red-300">50 000+ kr/måned</span>
                </p>
              </div>
            </div>

            <div className="group rounded-2xl border-2 border-emerald-900/50 bg-gradient-to-br from-emerald-950/30 to-slate-950/30 p-8 space-y-6 hover-lift">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400 group-hover:scale-110 transition-transform">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-emerald-300">Med LYXso</h3>
                  <p className="text-sm text-emerald-400/70">Sånn kan det være</p>
                </div>
              </div>
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start gap-3 group/item">
                  <span className="text-emerald-400 mt-1 flex-shrink-0 text-lg group-hover/item:scale-125 transition-transform">✓</span>
                  <div>
                    <p className="font-medium text-slate-200">Ett system, full oversikt</p>
                    <p className="text-xs text-slate-500 mt-1">Alt på én skjerm, tilgjengelig 24/7</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 group/item">
                  <span className="text-emerald-400 mt-1 flex-shrink-0 text-lg group-hover/item:scale-125 transition-transform">✓</span>
                  <div>
                    <p className="font-medium text-slate-200">0 tapte bookinger, aldri dobbeltbooke</p>
                    <p className="text-xs text-slate-500 mt-1">System hindrer konflikter automatisk</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 group/item">
                  <span className="text-emerald-400 mt-1 flex-shrink-0 text-lg group-hover/item:scale-125 transition-transform">✓</span>
                  <div>
                    <p className="font-medium text-slate-200">Kunder får automatisk SMS og kan sjekke selv</p>
                    <p className="text-xs text-slate-500 mt-1">Reduserer henvendelser med 80%</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 group/item">
                  <span className="text-emerald-400 mt-1 flex-shrink-0 text-lg group-hover/item:scale-125 transition-transform">✓</span>
                  <div>
                    <p className="font-medium text-slate-200">2 timer admin per uke</p>
                    <p className="text-xs text-slate-500 mt-1">= 32+ timer spart per måned</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 group/item">
                  <span className="text-emerald-400 mt-1 flex-shrink-0 text-lg group-hover/item:scale-125 transition-transform">✓</span>
                  <div>
                    <p className="font-medium text-slate-200">Kapasitet synlig i sanntid</p>
                    <p className="text-xs text-slate-500 mt-1">Fyll tomme tidsluker automatisk</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 group/item">
                  <span className="text-emerald-400 mt-1 flex-shrink-0 text-lg group-hover/item:scale-125 transition-transform">✓</span>
                  <div>
                    <p className="font-medium text-slate-200">Automatisk oppfølging og påminnelser</p>
                    <p className="text-xs text-slate-500 mt-1">AI sender riktig melding til riktig tid</p>
                  </div>
                </li>
              </ul>
              <div className="pt-4 border-t border-emerald-900/30">
                <p className="text-xs text-emerald-300/70 text-center">
                  Estimert gevinst: <span className="font-bold text-emerald-300">65 000+ kr/måned</span>
                </p>
              </div>
            </div>
          </div>

          <div className="text-center pt-8">
            <div className="inline-flex items-center gap-3 rounded-2xl border-2 border-emerald-600/30 bg-gradient-to-r from-emerald-950/30 to-blue-950/30 px-8 py-4 text-base font-medium text-emerald-400 shadow-xl">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <div className="text-left">
                <p className="font-bold text-lg">ROI på 115 000 kr første år</p>
                <p className="text-xs text-emerald-300/70">Basert på gjennomsnittlig kunde</p>
              </div>
            </div>
          </div>
        </section>

        {/* Social proof / trust */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 lg:p-10">
          <div className="flex items-start gap-8 flex-col lg:flex-row">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">Bygd i verkstedet – ikke på et møterom</h2>
              <p className="text-slate-300 leading-relaxed">
                LYXso er utviklet sammen med LYX Bil i Oslo og andre bilbedrifter som trengte mer enn bare en kalender. Resultatet er et system som forstår hverdagen din: lange behandlinger, dekkhotell, sesongtopper, coating-oppfølging og kunder som vil ha rask respons.
              </p>
            </div>
          </div>
        </section>

        {/* NY: Hvordan fungerer det? */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold">Fra kaos til kontroll på tre enkle steg</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Start i dag og vær produktiv på under 10 minutter
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 pt-4">
            <div className="relative">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/20 ring-4 ring-blue-600/10">
                  <span className="text-2xl font-bold text-blue-400">1</span>
                </div>
                <h3 className="text-xl font-semibold">Opprett konto</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Registrer deg gratis på 2 minutter. Ingen kredittkort nødvendig – du betaler først når du vil gå i produksjon.
                </p>
                <p className="text-xs text-blue-400 font-medium">⏱️ 2 minutter</p>
              </div>
              {/* Arrow for desktop */}
              <div className="hidden md:block absolute top-8 -right-4 text-slate-700 text-2xl">→</div>
            </div>

            <div className="relative">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/20 ring-4 ring-blue-600/10">
                  <span className="text-2xl font-bold text-blue-400">2</span>
                </div>
                <h3 className="text-xl font-semibold">Sett opp bedriften</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Legg inn dine tjenester, åpningstider og ansatte. Systemet guider deg gjennom alt – superenkelt selv uten teknisk bakgrunn.
                </p>
                <p className="text-xs text-blue-400 font-medium">⏱️ 5 minutter</p>
              </div>
              <div className="hidden md:block absolute top-8 -right-4 text-slate-700 text-2xl">→</div>
            </div>

            <div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600/20 ring-4 ring-emerald-600/10">
                  <span className="text-2xl font-bold text-emerald-400">✓</span>
                </div>
                <h3 className="text-xl font-semibold">Start booking!</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Du er klar! Del booking-lenken med kunder, eller legg inn bookinger manuelt. Full kontroll fra dag én.
                </p>
                <p className="text-xs text-emerald-400 font-medium">🚀 Umiddelbart</p>
              </div>
            </div>
          </div>

          <div className="text-center pt-6">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
            >
              Kom i gang nå
              <span className="text-lg">→</span>
            </Link>
          </div>
        </section>

        {/* 2.3 Tre kjernefordeler */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Hvorfor velge LYXso?</h2>
          
          <div className="grid gap-6 md:grid-cols-3 pt-4">
            <div className="group rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-3 hover:border-blue-600/50 hover:bg-slate-900/80 transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 group-hover:scale-110 transition-transform">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-blue-400">Full kontroll på kapasitet</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Se kapasiteten din på tvers av ansatte, tjenester og lokasjoner. LYXso hindrer dobbeltbookinger, hjelper deg å fylle hull i kalenderen og gjør det enkelt å planlegge lengre jobber som coating, PPF og skade/lakk.
              </p>
            </div>

            <div className="group rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-3 hover:border-blue-600/50 hover:bg-slate-900/80 transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 group-hover:scale-110 transition-transform">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-blue-400">Alt på ett sted</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Hver kunde får sin egen profil med kjøretøy, historikk, dekksett, behandlinger og notater. Du ser hva som er gjort, hva som er anbefalt neste steg – og hva som kan selges inn ved neste besøk.
              </p>
            </div>

            <div className="group rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-3 hover:border-blue-600/50 hover:bg-slate-900/80 transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 group-hover:scale-110 transition-transform">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
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
            <p className="text-slate-300 max-w-2xl mx-auto">
              Velg de modulene du trenger, og utvid når bedriften vokser
            </p>
          </div>

          {/* Product Showcase - Visual */}
          <div className="rounded-2xl border-2 border-blue-600/30 bg-gradient-to-br from-blue-950/30 to-slate-900/50 p-8 lg:p-12 space-y-6">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-600/30 bg-blue-600/10 px-4 py-1.5 text-xs font-medium text-blue-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Se LYXso i aksjon
              </div>
              <h3 className="text-2xl font-bold text-blue-200">Moderne grensesnitt, bygd for fart</h3>
              <p className="text-blue-100/70 max-w-2xl mx-auto">
                Alt du trenger – booking, kunder, dekkhotell, rapporter – på én skjerm
              </p>
            </div>
            
            {/* Placeholder for product screenshot/video */}
            <div className="rounded-xl border-2 border-blue-700/50 bg-slate-950/60 p-12 text-center space-y-4 min-h-[400px] flex flex-col items-center justify-center">
              <svg className="h-24 w-24 text-blue-400/30 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-blue-300">Dashboard & Kalender</p>
                <p className="text-sm text-blue-200/60 max-w-md">
                  Full oversikt over dagens bookinger, ledig kapasitet og kommende oppgaver. Drag-and-drop booking direkte i kalenderen.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 justify-center pt-4">
                <span className="px-3 py-1 rounded-full bg-blue-600/20 text-xs text-blue-300 border border-blue-600/30">Drag & drop</span>
                <span className="px-3 py-1 rounded-full bg-blue-600/20 text-xs text-blue-300 border border-blue-600/30">Søk i sanntid</span>
                <span className="px-3 py-1 rounded-full bg-blue-600/20 text-xs text-blue-300 border border-blue-600/30">Mobil-vennlig</span>
                <span className="px-3 py-1 rounded-full bg-blue-600/20 text-xs text-blue-300 border border-blue-600/30">Mørk modus</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-sm text-center">
              <div className="rounded-lg border border-blue-700/40 bg-blue-950/30 p-4">
                <p className="text-blue-300 font-semibold">📅 Smart kalender</p>
                <p className="text-blue-200/60 text-xs mt-2">Se ledig kapasitet på tvers av ansatte og ressurser</p>
              </div>
              <div className="rounded-lg border border-blue-700/40 bg-blue-950/30 p-4">
                <p className="text-blue-300 font-semibold">🚗 Kjøretøy & dekk</p>
                <p className="text-blue-200/60 text-xs mt-2">Finn 600+ dekksett på sekunder med AI-søk</p>
              </div>
              <div className="rounded-lg border border-blue-700/40 bg-blue-950/30 p-4">
                <p className="text-blue-300 font-semibold">📊 Sanntidsrapporter</p>
                <p className="text-blue-200/60 text-xs mt-2">Omsetning, tjenester og trender – umiddelbart</p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 pt-4">
            <div className="group rounded-xl border border-slate-800 bg-slate-900/70 p-6 space-y-3 hover:border-blue-600/50 hover:shadow-lg hover:shadow-blue-600/10 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 group-hover:scale-110 transition-transform">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Booking & kalender</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Moderne bookingmotor med oversikt per ansatt, tjeneste og ressurs. Se ledige tider, filtrer på tjenester og legg inn bookinger direkte fra telefon, nettbrett eller PC. Systemet tar hensyn til varighet, buffer og åpningstider.
              </p>
            </div>

            <div className="group rounded-xl border border-slate-800 bg-slate-900/70 p-6 space-y-3 hover:border-blue-600/50 hover:shadow-lg hover:shadow-blue-600/10 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 group-hover:scale-110 transition-transform">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Kunder, kjøretøy & dekkhotell</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Full kundehistorikk med kjøretøy, dekksett, bilder, notater og tidligere behandlinger. Dekkhotell-modulen gir deg oversikt på hvor hvert dekksett står og når det bør sjekkes eller byttes.
              </p>
            </div>

            <div className="group rounded-xl border border-slate-800 bg-slate-900/70 p-6 space-y-3 hover:border-blue-600/50 hover:shadow-lg hover:shadow-blue-600/10 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 group-hover:scale-110 transition-transform">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Coating & oppfølging</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Registrer coating-jobber, produkter, lag, garanti og planlagte kontroller. LYXso kan sette opp automatisk oppfølging i inntil 5 år, med påminnelser til kunden før hver kontroll.
              </p>
            </div>

            <div className="group rounded-xl border border-slate-800 bg-slate-900/70 p-6 space-y-3 hover:border-blue-600/50 hover:shadow-lg hover:shadow-blue-600/10 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 group-hover:scale-110 transition-transform">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Markedsføring & leads</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Lag kampanjer, samle inn leads og følg hele løpet fra annonse til booking. AI kan hjelpe deg med annonsetekster, vinklinger og oppfølging av leads for å få flere kunder inn i kalenderen.
              </p>
            </div>

            <div className="group rounded-xl border border-slate-800 bg-slate-900/70 p-6 space-y-3 hover:border-blue-600/50 hover:shadow-lg hover:shadow-blue-600/10 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 group-hover:scale-110 transition-transform">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Betaling & regnskap</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Få oversikt over omsetning per tjeneste, dag, uke og måned. Eksporter data til regnskapssystemet ditt. Integrasjoner mot betaling og regnskap utvikles løpende basert på partnernes behov.
              </p>
            </div>

            <div className="group rounded-xl border border-slate-800 bg-slate-900/70 p-6 space-y-3 hover:border-blue-600/50 hover:shadow-lg hover:shadow-blue-600/10 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 group-hover:scale-110 transition-transform">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Partnerportal for bedriften din</h3>
              </div>
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
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-600/30 bg-purple-600/10 px-4 py-1.5 text-xs font-medium text-purple-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI-drevet
            </div>
            <h2 className="text-3xl font-bold">LYXso + AI = mindre mas, mer verdi</h2>
            <p className="text-slate-300">
              AI i LYXso er ikke pynt – det er praktisk hjelp i hverdagen. Du velger selv hvilke byggeklosser du vil aktivere.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 pt-4">
            <div className="group rounded-xl border border-blue-700/70 bg-gradient-to-br from-blue-900/30 to-slate-900/50 p-6 space-y-3 hover:border-blue-600 hover:shadow-lg hover:shadow-blue-600/20 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/30 text-blue-300 group-hover:scale-110 transition-transform">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-blue-200">AI for leads & booking</h3>
              </div>
              <p className="text-sm text-blue-100/80 leading-relaxed">
                AI kan ta imot henvendelser, forklare tjenester, foreslå riktig behandling og legge inn bookingforslag direkte i kalenderen. Perfekt når det tikker inn meldinger på kveldstid eller i sesongrush.
              </p>
            </div>

            <div className="group rounded-xl border border-purple-700/70 bg-gradient-to-br from-purple-900/30 to-slate-900/50 p-6 space-y-3 hover:border-purple-600 hover:shadow-lg hover:shadow-purple-600/20 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600/30 text-purple-300 group-hover:scale-110 transition-transform">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-purple-200">AI for kampanjer og tekst</h3>
              </div>
              <p className="text-sm text-purple-100/80 leading-relaxed">
                Beskriv hva du ønsker å selge – så kan AI hjelpe deg med annonsetekster, e-poster, SMS, landingssider og innhold til sosiale medier, basert på tjenestene du allerede har i LYXso.
              </p>
            </div>

            <div className="group rounded-xl border border-emerald-700/70 bg-gradient-to-br from-emerald-900/30 to-slate-900/50 p-6 space-y-3 hover:border-emerald-600 hover:shadow-lg hover:shadow-emerald-600/20 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600/30 text-emerald-300 group-hover:scale-110 transition-transform">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-emerald-200">AI for rapporter & innsikt</h3>
              </div>
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
              <div className="py-3">
                <p className="text-3xl font-bold text-blue-400">Gratis</p>
                <p className="text-xs text-slate-400 mt-1">14 dagers prøveperiode</p>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">✓</span>
                  <span>Grunnleggende booking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">✓</span>
                  <span>Enkle kundekort</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">✓</span>
                  <span>Standard rapporter</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">✓</span>
                  <span>1 ansatt</span>
                </li>
              </ul>
              <Link
                href="/register"
                className="block w-full rounded-md border border-slate-600 bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-800 hover:border-slate-500 transition-colors text-center mt-4"
              >
                Kom i gang
              </Link>
            </div>

            <div className="rounded-xl border-2 border-blue-500 bg-slate-900/80 p-6 space-y-4 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                Mest populær
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-400">Pro</h3>
                <p className="text-sm text-slate-400 mt-1">For etablerte verksteder og dekkhotell</p>
              </div>
              <div className="py-3">
                <p className="text-3xl font-bold text-blue-400">990 kr<span className="text-lg text-slate-400">/mnd</span></p>
                <p className="text-xs text-slate-400 mt-1">Eller 9 900 kr/år (spar 17%)</p>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">✓</span>
                  <span>Alt i Start</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">✓</span>
                  <span>Kjøretøy og dekkhotell</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">✓</span>
                  <span>Coating-oppfølging</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">✓</span>
                  <span>Markedsføring & leads</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">✓</span>
                  <span>Inntil 5 ansatte</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">✓</span>
                  <span>Prioritert support</span>
                </li>
              </ul>
              <Link
                href="/register"
                className="block w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors text-center mt-4"
              >
                Start 14-dagers prøveperiode
              </Link>
              <p className="text-xs text-slate-400 text-center">Ingen binding • Kanseller når som helst</p>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold">Max</h3>
                <p className="text-sm text-slate-400 mt-1">For bedrifter som vil automatisere mest mulig</p>
              </div>
              <div className="py-3">
                <p className="text-3xl font-bold text-blue-400">1 990 kr<span className="text-lg text-slate-400">/mnd</span></p>
                <p className="text-xs text-slate-400 mt-1">Eller 19 900 kr/år (spar 17%)</p>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">✓</span>
                  <span>Alt i Pro</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">✓</span>
                  <span>AI-leadshåndtering</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">✓</span>
                  <span>Avansert rapportering</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">✓</span>
                  <span>Ubegrenset ansatte</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">✓</span>
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">✓</span>
                  <span>SLA & prioritert support</span>
                </li>
              </ul>
              <Link
                href="/register"
                className="block w-full rounded-md border border-slate-600 bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-800 hover:border-slate-500 transition-colors text-center mt-4"
              >
                Kom i gang
              </Link>
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

        {/* 2.8 Testimonials & Trust */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-center">Bygget sammen med ekte verksteder</h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/20 text-blue-400 font-bold">
                  LB
                </div>
                <div>
                  <p className="font-semibold text-slate-200">LYX Bil</p>
                  <p className="text-xs text-slate-400">Oslo - Bilpleie & detailing</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed italic">
                "Vi gikk fra kaotisk kalender og Messenger-meldinger til full oversikt. Dekkhotell, coating og daglig drift håndteres på én skjerm. Spart meg for 10 timer admin hver uke."
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600/20 text-emerald-400 font-bold">
                  DH
                </div>
                <div>
                  <p className="font-semibold text-slate-200">Dekkhotell-bedrift</p>
                  <p className="text-xs text-slate-400">Akershus</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed italic">
                "Før LYXso brukte vi Excel og lapper. Nå finner vi 600 dekksett på sekunder, og AI sender automatisk påminnelser før sesongskift. Kundene elsker det."
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600/20 text-purple-400 font-bold">
                  CS
                </div>
                <div>
                  <p className="font-semibold text-slate-200">Coating-spesialist</p>
                  <p className="text-xs text-slate-400">Bergen</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed italic">
                "5-års garanti på coating betydde masse Excel og kalenderpåminnelser. LYXso automatiserer alt – jeg får varsler om kontroller, og kan sende sertifikater direkte til kunden."
              </p>
            </div>
          </div>

          {/* Trust badges */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8">
            <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">GDPR-kompatibel</p>
                  <p className="text-xs text-slate-400">Data lagret i EU</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600/20 text-emerald-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">256-bit SSL</p>
                  <p className="text-xs text-slate-400">Bank-level sikkerhet</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600/20 text-purple-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">Daglig backup</p>
                  <p className="text-xs text-slate-400">Automatisk & sikker</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">Bygget i Norge</p>
                  <p className="text-xs text-slate-400">Norsk support 24t</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Integrasjoner & Økosystem */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold">Integrerer med verktøyene du allerede bruker</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              LYXso er ikke en isolert øy – vi kobler deg til økosystemet du trenger
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 mx-auto">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-200">Regnskap</h3>
              <p className="text-xs text-slate-400">Eksport til regnskapssystem</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-600/20 text-emerald-400 mx-auto">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-200">Betaling</h3>
              <p className="text-xs text-slate-400">Mobil og nettbetaling</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600/20 text-purple-400 mx-auto">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-200">Kommunikasjon</h3>
              <p className="text-xs text-slate-400">SMS og e-post varslinger</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-slate-400">
              Flere integrasjoner kommer løpende. Trenger du noe spesifikt?{' '}
              <Link href="/kontakt" className="text-blue-400 hover:text-blue-300 underline">
                Si fra!
              </Link>
            </p>
          </div>
        </section>

        {/* FAQ Section - NY */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold">Ofte stilte spørsmål</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Alt du trenger å vite om LYXso
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <details className="group rounded-xl border border-slate-800 bg-slate-900/60 p-6">
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-100 hover:text-blue-400 transition-colors">
                <span>Hvor lang tid tar det å sette opp LYXso?</span>
                <span className="ml-4 flex-shrink-0 text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                De fleste bedrifter er oppe og går på under 10 minutter. Du registrerer deg, legger inn dine tjenester og åpningstider, og kan starte booking umiddelbart. Import av eksisterende kunder kan gjøres senere om ønskelig.
              </p>
            </details>

            <details className="group rounded-xl border border-slate-800 bg-slate-900/60 p-6">
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-100 hover:text-blue-400 transition-colors">
                <span>Trenger jeg teknisk kompetanse for å bruke LYXso?</span>
                <span className="ml-4 flex-shrink-0 text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                Nei! LYXso er bygget for å være intuitivt og enkelt. Hvis du kan bruke Facebook eller Google Calendar, kan du bruke LYXso. Vi har også norsk support tilgjengelig hvis du skulle ha spørsmål.
              </p>
            </details>

            <details className="group rounded-xl border border-slate-800 bg-slate-900/60 p-6">
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-100 hover:text-blue-400 transition-colors">
                <span>Kan jeg importere eksisterende kunder og data?</span>
                <span className="ml-4 flex-shrink-0 text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                Ja! Du kan importere kundeinformasjon fra Excel eller CSV-filer. Vi hjelper deg også gjerne med migreringen hvis du har data fra andre systemer.
              </p>
            </details>

            <details className="group rounded-xl border border-slate-800 bg-slate-900/60 p-6">
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-100 hover:text-blue-400 transition-colors">
                <span>Er mine data sikre hos dere?</span>
                <span className="ml-4 flex-shrink-0 text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                Absolutt. LYXso bruker samme sikkerhetsteknologi som banker (256-bit SSL-kryptering). All data lagres trygt i Europa, og vi er GDPR-kompatible. Vi tar automatisk backup hver dag, og du eier alltid dine egne data.
              </p>
            </details>

            <details className="group rounded-xl border border-slate-800 bg-slate-900/60 p-6">
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-100 hover:text-blue-400 transition-colors">
                <span>Kan jeg kansellere når som helst?</span>
                <span className="ml-4 flex-shrink-0 text-slate-400 group-open:rotate-180 transition-colors">▼</span>
              </summary>
              <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                Ja! Det er ingen bindingstid på LYXso. Du kan kansellere abonnementet når som helst med umiddelbar effekt. Du beholder tilgang til dine data i 30 dager etter kansellering, slik at du kan eksportere det du trenger.
              </p>
            </details>

            <details className="group rounded-xl border border-slate-800 bg-slate-900/60 p-6">
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-100 hover:text-blue-400 transition-colors">
                <span>Får jeg support på norsk?</span>
                <span className="ml-4 flex-shrink-0 text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                Ja! LYXso er bygget i Norge, og vi tilbyr support på norsk via e-post og chat. Responstid er normalt innen 24 timer på hverdager. Pro og Max-kunder får prioritert support.
              </p>
            </details>

            <details className="group rounded-xl border border-slate-800 bg-slate-900/60 p-6">
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-100 hover:text-blue-400 transition-colors">
                <span>Fungerer LYXso på mobil og nettbrett?</span>
                <span className="ml-4 flex-shrink-0 text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                Ja! LYXso er fullt responsivt og fungerer perfekt på alle enheter – mobil, nettbrett og PC. Du kan administrere bookinger, se kundekort og sjekke dekkhotell uansett hvor du er.
              </p>
            </details>
          </div>
        </section>

        {/* Visjon 2027 - Fremtidsrettet */}
        <section className="space-y-8">
          <div className="rounded-2xl border-2 border-blue-600/30 bg-gradient-to-br from-blue-950/50 via-purple-950/30 to-slate-950/50 p-8 lg:p-12 space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-600/30 bg-purple-600/10 px-4 py-1.5 text-xs font-medium text-purple-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Veikart 2025-2027
              </div>
              <h2 className="text-3xl font-bold">Du får ikke bare et system – du får med oss på reisen</h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                LYXso utvikler seg kontinuerlig basert på tilbakemeldinger fra verksteder som ditt. Her er hva som kommer:
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 font-bold">
                    2025
                  </div>
                  <h3 className="text-lg font-semibold text-blue-300">I år</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">→</span>
                    <span>Mobile apps (iOS & Android)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">→</span>
                    <span>Lakk & skade-estimering med AI</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">→</span>
                    <span>Offline-modus for teknikere</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">→</span>
                    <span>Ekspansjon til Sverige</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600/20 text-purple-400 font-bold">
                    2026
                  </div>
                  <h3 className="text-lg font-semibold text-purple-300">Neste år</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-0.5">→</span>
                    <span>Marketplace for dekk & produkter</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-0.5">→</span>
                    <span>Flåtestyring for bedrifter (B2B)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-0.5">→</span>
                    <span>Full finansmodul & fakturering</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-0.5">→</span>
                    <span>Nordisk ekspansjon fullført</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600/20 text-emerald-400 font-bold">
                    2027
                  </div>
                  <h3 className="text-lg font-semibold text-emerald-300">Visjonen</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">→</span>
                    <span>AI-assistent for teknikere (voice)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">→</span>
                    <span>App store for tredjepartsutvidelser</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">→</span>
                    <span>Markedsleder i Norden</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">→</span>
                    <span>600-900 bedrifter på plattformen</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-xl border border-blue-700/50 bg-blue-950/30 p-6 space-y-3">
              <p className="text-blue-200 font-semibold">💡 Dette er ikke teori</p>
              <p className="text-sm text-blue-100/80 leading-relaxed">
                Vi har bygget et fullstendig system på 6-8 måneder. Med samme hastighet blir LYXso den åpenbare løsningen for bilbransjen i Norden. Partnere som starter tidlig får være med på å forme fremtiden – og får konkurransefortrinn.
              </p>
            </div>
          </div>
        </section>

        {/* CTA før footer */}
        <section className="rounded-2xl border-2 border-blue-600/50 bg-gradient-to-br from-blue-900/20 to-slate-900/40 p-8 lg:p-12 text-center space-y-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold">Klar til å bygge fremtidens bilverksted?</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Slutt å kjempe med Excel-ark, tapte dekk-bookinger og kaotisk administrasjon. Bli med i et begrenset antall partnere som bygger fremtidens bilpleie-drift sammen med LYXso.
            </p>
          </div>
          
          <div className="rounded-xl bg-slate-900/60 p-6 max-w-3xl mx-auto">
            <div className="grid gap-4 md:grid-cols-3 text-sm">
              <div>
                <p className="text-2xl font-bold text-blue-400">100+</p>
                <p className="text-slate-400">Plasser ledig i 2025</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-400">14 dager</p>
                <p className="text-slate-400">Gratis prøveperiode</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-400">5 min</p>
                <p className="text-slate-400">Fra reg. til første booking</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="rounded-lg bg-blue-600 px-8 py-4 text-base font-semibold text-white hover:bg-blue-500 transition-colors shadow-xl shadow-blue-600/30"
            >
              Start gratis i dag →
            </Link>
            <Link
              href="/kontakt"
              className="rounded-lg border border-slate-600 bg-slate-900/80 px-8 py-4 text-base font-semibold text-slate-100 hover:border-blue-400 transition-colors"
            >
              Book en demo
            </Link>
          </div>
          <p className="text-xs text-slate-400 pt-2">
            Ingen kredittkort nødvendig • Klar på 5 minutter • Kanseller når som helst • Norsk support
          </p>
        </section>

      </main>
    </div>
    </>
  );
}
