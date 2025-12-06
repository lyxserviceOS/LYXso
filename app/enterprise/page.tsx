// app/enterprise/page.tsx
"use client";

import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";

export default function EnterprisePage() {
  return (
    <>
      <Analytics />
      <div className="min-h-screen bg-slate-950 text-slate-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-slate-800/50 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950"></div>
          
          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-600/30 bg-blue-600/10 px-4 py-1.5 text-xs font-medium text-blue-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Enterprise-løsning
              </div>

              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl bg-gradient-to-r from-slate-50 via-blue-100 to-slate-50 bg-clip-text text-transparent">
                LYXso Enterprise
              </h1>
              
              <p className="text-2xl text-slate-200 font-semibold">
                Den moderne motoren som driver bilbedrifter
              </p>

              <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
                For kjeder, bilglass, store verksteder og bilforhandlere. Ett system. Ett operativsystem. Multilokasjon. Sentralstyring. Enterprise-grade sikkerhet.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Link
                  href="/kontakt?type=enterprise"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-500 transition-all duration-200 shadow-xl shadow-blue-600/30"
                >
                  Book møte med Enterprise-teamet
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-slate-600 bg-slate-900/80 px-8 py-4 text-lg font-semibold text-slate-100 hover:border-blue-400 transition-all duration-200"
                >
                  Se funksjonene
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="relative py-20 border-b border-slate-800/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-4xl font-bold text-slate-50">Bilbransjen bruker utdaterte systemer</h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Bilbedrifter taper 50.000–200.000 kr/mnd på ineffektiv drift
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {[
                {
                  title: "Dårlige kalendere",
                  issues: ["Manuell booking", "Ingen oversikt", "Tapte timer"],
                  icon: "📅"
                },
                {
                  title: "Mangler varelagerkontroll",
                  issues: ["Overpris på innkjøp", "Ingen sporbarhet", "Svinn og lekkasje"],
                  icon: "📦"
                },
                {
                  title: "Mangler AI",
                  issues: ["Ingen automatisering", "Manuelt mersalg", "Tapt inntekt 24/7"],
                  icon: "🤖"
                },
                {
                  title: "Mangler økonomistyring",
                  issues: ["Manuell fakturering", "Dårlig marginoversikt", "Ingen prediktering"],
                  icon: "💰"
                },
                {
                  title: "Dårlig integrert drift",
                  issues: ["5-10 separate systemer", "Dobbeltføring av data", "Dyrt og ineffektivt"],
                  icon: "🔗"
                },
                {
                  title: "Mangler skalering",
                  issues: ["Vanskelig å vokse", "Ingen standardisering", "Lokasjonene jobber isolert"],
                  icon: "📈"
                }
              ].map((problem, idx) => (
                <div key={idx} className="rounded-xl border border-red-900/30 bg-gradient-to-br from-red-950/20 to-slate-950/20 p-6 space-y-4">
                  <div className="text-4xl">{problem.icon}</div>
                  <h3 className="text-xl font-bold text-slate-50">{problem.title}</h3>
                  <ul className="space-y-2">
                    {problem.issues.map((issue, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                        <span className="text-red-400 mt-0.5">✗</span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section id="features" className="relative py-20 border-b border-slate-800/50 bg-slate-900/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-4xl font-bold text-slate-50">Ett system. Ett operativsystem.</h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                100% modulbasert. Bygget spesifikt for hele bilbransjen.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  category: "Drift & Booking",
                  icon: "🔵",
                  features: [
                    "AI booking agent (24/7)",
                    "Smart kalender med ressursoptimalisering",
                    "Kundeportal med selvbetjening",
                    "Digitale jobbkort",
                    "Automatisk fakturering"
                  ]
                },
                {
                  category: "Varelager & Leverandørhub",
                  icon: "🟠",
                  features: [
                    "Prisjakt 50+ leverandører",
                    "Automatisk bestilling",
                    "Materialforbruk per jobb",
                    "Strekkode/QR scanning",
                    "Sparer 10–50.000 kr/mnd"
                  ]
                },
                {
                  category: "AI-moduler",
                  icon: "🟣",
                  features: [
                    "AI prising (smart marginmotor)",
                    "AI skadeanalyse (DVI+)",
                    "AI coatinganalyse (CoatVision)",
                    "AI kampanje-generator",
                    "AI lagerassistent"
                  ]
                },
                {
                  category: "Spesialiserte moduler",
                  icon: "🟢",
                  features: [
                    "Dekkhotell (QR-koder)",
                    "Coatingjournal",
                    "PPF jobbkort",
                    "Lakk/skade estimater",
                    "Bilutleie"
                  ]
                },
                {
                  category: "Enterprise",
                  icon: "🔴",
                  features: [
                    "Multilokasjon dashboard",
                    "Sentralt økonomipanel",
                    "Sentralt varelager & logistikk",
                    "Ansattflyt mellom lokasjoner",
                    "Kjedemarkedsføring"
                  ]
                },
                {
                  category: "Sikkerhet & Support",
                  icon: "🔒",
                  features: [
                    "ISO 27001 sertifisert",
                    "GDPR-compliant",
                    "99.9% uptime SLA",
                    "Dedikert prosjektansvarlig",
                    "Prioritert support <2t"
                  ]
                }
              ].map((module, idx) => (
                <div key={idx} className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4 hover:border-blue-500/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{module.icon}</span>
                    <h3 className="text-xl font-bold text-slate-50">{module.category}</h3>
                  </div>
                  <ul className="space-y-2">
                    {module.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="text-emerald-400 mt-0.5">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="relative py-20 border-b border-slate-800/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-4xl font-bold text-slate-50">Dokumenterte resultater</h2>
              <p className="text-xl text-slate-400">Bedrifter tjener mer. Bruker mindre tid. Automatiserer drift.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 mb-16">
              <div className="text-center space-y-3 p-8 rounded-xl border border-slate-800 bg-slate-900/50">
                <div className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">+47%</div>
                <div className="text-slate-300 font-semibold">Økning i bookinger</div>
                <div className="text-sm text-slate-500">Med AI booking agent</div>
              </div>
              <div className="text-center space-y-3 p-8 rounded-xl border border-slate-800 bg-slate-900/50">
                <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">23.400 kr</div>
                <div className="text-slate-300 font-semibold">Spart per måned</div>
                <div className="text-sm text-slate-500">Gjennomsnittlig på innkjøp</div>
              </div>
              <div className="text-center space-y-3 p-8 rounded-xl border border-slate-800 bg-slate-900/50">
                <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">12 timer</div>
                <div className="text-slate-300 font-semibold">Spart per uke</div>
                <div className="text-sm text-slate-500">På administrasjon</div>
              </div>
            </div>

            {/* Case Study */}
            <div className="rounded-2xl border-2 border-blue-600/30 bg-gradient-to-br from-blue-950/20 to-slate-950/20 p-8 max-w-4xl mx-auto">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-600/30 bg-blue-600/10 px-4 py-1.5 text-xs font-medium text-blue-400">
                  Case Study
                </div>
                <h3 className="text-3xl font-bold text-slate-50">Premium Auto (3 lokasjoner)</h3>
                
                <div className="grid md:grid-cols-2 gap-8 text-left pt-6">
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-red-400">Før LYXso:</h4>
                    <ul className="space-y-2 text-slate-300">
                      <li className="flex items-start gap-2">
                        <span className="text-red-400">✗</span>
                        <span>5 separate systemer</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-400">✗</span>
                        <span>3 administrative ansatte</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-400">✗</span>
                        <span>Manuell fakturering</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-400">✗</span>
                        <span>Ingen varelager-oversikt</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-emerald-400">Etter LYXso (6 måneder):</h4>
                    <ul className="space-y-2 text-slate-300">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400">✓</span>
                        <span>1 sentralt dashboard</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400">✓</span>
                        <span>1 administrativ ansatt</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400">✓</span>
                        <span>100% automatisk fakturering</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400">✓</span>
                        <span>Sentralt varelager med prisjakt</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800">
                  <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                    Total ROI: 2.8M kr/år
                  </div>
                  <div className="text-slate-400 text-sm mt-2">
                    1.2M kr spart på admin + 430k kr på innkjøp + 52% flere bookinger
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="relative py-20 border-b border-slate-800/50 bg-slate-900/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-4xl font-bold text-slate-50">Enterprise Pricing</h2>
              <p className="text-xl text-slate-400">Investering & ROI</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
              {[
                {
                  name: "Enterprise Starter",
                  locations: "1-3 lokasjoner",
                  price: "4.990 kr",
                  period: "/mnd per lokasjon",
                  features: [
                    "Full LYXso AI Suite",
                    "Multilokasjon dashboard",
                    "Sentralt varelager",
                    "Dedikert onboarding",
                    "Prioritert support"
                  ]
                },
                {
                  name: "Enterprise Growth",
                  locations: "4-10 lokasjoner",
                  price: "3.990 kr",
                  period: "/mnd per lokasjon",
                  popular: true,
                  features: [
                    "Alt i Starter +",
                    "Volumrabatt",
                    "Egen prosjektansvarlig",
                    "Månedlige strategi-møter",
                    "Custom rapporter"
                  ]
                },
                {
                  name: "Enterprise Scale",
                  locations: "11+ lokasjoner",
                  price: "2.990 kr",
                  period: "/mnd per lokasjon",
                  features: [
                    "Alt i Growth +",
                    "Maksimal volumrabatt",
                    "Dedikert Customer Success Manager",
                    "Kvartalsvis business review",
                    "Custom development inkludert"
                  ]
                }
              ].map((plan, idx) => (
                <div key={idx} className={`rounded-2xl border-2 p-8 ${plan.popular ? 'border-blue-500 bg-gradient-to-br from-blue-950/50 to-slate-950/50' : 'border-slate-800 bg-slate-900/50'}`}>
                  {plan.popular && (
                    <div className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white mb-4">
                      Mest populær
                    </div>
                  )}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-50">{plan.name}</h3>
                      <p className="text-sm text-slate-400 mt-1">{plan.locations}</p>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-slate-50">{plan.price}</div>
                      <div className="text-slate-400 text-sm">{plan.period}</div>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                          <span className="text-emerald-400 mt-0.5">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* ROI Calculator Example */}
            <div className="mt-16 max-w-3xl mx-auto rounded-xl border border-slate-800 bg-slate-900/50 p-8">
              <h3 className="text-2xl font-bold text-slate-50 mb-6 text-center">ROI Eksempel: 5 lokasjoner</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-slate-300">Kostnad:</h4>
                  <ul className="space-y-2 text-slate-400">
                    <li>5 × 3.990 kr = 19.950 kr/mnd</li>
                    <li className="font-bold text-slate-200">239.400 kr/år</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-slate-300">Besparelse:</h4>
                  <ul className="space-y-2 text-slate-400">
                    <li>Admin: 800.000 kr/år</li>
                    <li>Varelager: 400.000 kr/år</li>
                    <li>Økt booking: 600.000 kr/år</li>
                    <li className="font-bold text-emerald-400">Total: 1.800.000 kr/år</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-800 text-center space-y-2">
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  Netto ROI: 1.560.000 kr/år
                </div>
                <div className="text-slate-400">Payback: 1.5 måneder</div>
              </div>
            </div>
          </div>
        </section>

        {/* Implementation Timeline */}
        <section className="relative py-20 border-b border-slate-800/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-4xl font-bold text-slate-50">Fra signering til go-live på 4 uker</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-4 max-w-6xl mx-auto">
              {[
                {
                  week: "Uke 1",
                  title: "Onboarding & Setup",
                  tasks: ["Kick-off møte", "Dataimport", "Brukeropprettelse", "Grunnkonfigurasjon"]
                },
                {
                  week: "Uke 2",
                  title: "Konfigurasjon",
                  tasks: ["Tjenester & priser", "Varelager-setup", "Integrasjoner", "Ansatt-opplæring"]
                },
                {
                  week: "Uke 3",
                  title: "Testing",
                  tasks: ["Pilot på 1 lokasjon", "Justering", "Prosess-finpuss", "Utvidet opplæring"]
                },
                {
                  week: "Uke 4",
                  title: "Full Rollout",
                  tasks: ["Go-live alle lokasjoner", "On-site support", "Daglig oppfølging", "Normal drift"]
                }
              ].map((phase, idx) => (
                <div key={idx} className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600/20 text-blue-400 font-bold text-lg">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-blue-400 text-sm font-semibold">{phase.week}</div>
                    <h3 className="text-lg font-bold text-slate-50 mt-1">{phase.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {phase.tasks.map((task, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                        <span className="text-emerald-400 mt-0.5">✓</span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-600/10 px-6 py-2 text-sm font-medium text-emerald-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Garanti: Hvis ikke systemet er oppe og fungerer innen 4 uker, får dere 1 måned gratis
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl border-2 border-blue-600 bg-gradient-to-br from-blue-950/80 to-slate-950/80 p-12 text-center shadow-2xl shadow-blue-900/30">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent"></div>
              
              <div className="relative space-y-6">
                <h2 className="text-4xl font-bold text-slate-50">
                  La oss snakke om deres kjede
                </h2>
                
                <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                  Book en workshop med Enterprise-teamet. Vi viser hvordan LYXso kan transformere deres drift.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link
                    href="/kontakt?type=enterprise"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-500 transition-all duration-200 shadow-xl shadow-blue-600/30"
                  >
                    Book workshop
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <Link
                    href="/demo-booking"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-slate-400 bg-slate-900/80 px-8 py-4 text-lg font-semibold text-slate-100 hover:border-blue-400 transition-all duration-200"
                  >
                    Se 30-min demo
                  </Link>
                </div>

                <div className="pt-6 space-y-2 text-sm text-slate-400">
                  <p><strong className="text-slate-200">Kontakt:</strong> enterprise@lyxso.no</p>
                  <p>Eikenga 25, Oslo</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Footer */}
        <section className="relative py-12 border-t border-slate-800/50 bg-slate-900/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-2">
              <p className="text-sm text-slate-400">© 2024 LYXso. Alle rettigheter reservert.</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
