// app/priser/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Analytics } from "@vercel/analytics/next";

const packages = [
  {
    id: "lite",
    name: "LYXso Lite",
    price: "599",
    period: "/mnd",
    description: "For små bilpleiere, mobile detailere og enkeltmannsforetak",
    features: [
      "Booking & Kalender",
      "Kunder & Kjøretøy",
      "Tjenester & Produkter",
      "Betaling (Vipps/Stripe)",
      "Kundeportal basic",
      "1 ansattprofil",
    ],
    notIncluded: [
      "Dekkhotell",
      "Coatingjournal",
      "Varelager",
      "Leverandørhub",
      "AI-moduler",
      "PPF-modul",
      "Markedsføring",
    ],
    bestFor: ["Nyoppstartede", "Små bilpleiere", "Mobile bilpleiere", "Enkle verksteder"],
    cta: "Kom i gang med Lite",
    ctaLink: "/register?plan=lite",
    popular: false,
    badge: null,
  },
  {
    id: "pro",
    name: "LYXso Pro",
    price: "1.499",
    period: "/mnd",
    description: "Standard for 80% av markedet",
    features: [
      "Alt i Lite +",
      "Dekkhotell",
      "Coatingjournal",
      "PPF-jobbkort",
      "Lakk/skade-modul",
      "Ansattplanlegging",
      "Fakturering",
      "Betaling (Vipps/Stripe)",
      "Review-generator",
      "Smart kalenderlogikk",
      "Markedsføring Basic",
      "Ubegrensede ansatte",
    ],
    notIncluded: [],
    bestFor: ["Etablerte bilpleiesentre", "Små verksteder", "Dekkhoteller", "PPF-installatører"],
    cta: "Velg Pro",
    ctaLink: "/register?plan=pro",
    popular: true,
    badge: "Mest populær",
  },
  {
    id: "power",
    name: "LYXso Power",
    price: "2.490",
    period: "/mnd",
    description: "For profesjonelle verksteder, store bilpleiesentre og skade/PPF",
    features: [
      "Alt i Pro +",
      "Full varelagerstyring",
      "Strekkode / QR-scanning",
      "Automatisk innkjøp",
      "Materialforbruk per jobb",
      "Leverandørhub (prisjakt)",
      "Lageropptelling med kamera (OCR)",
      "Forbruksanalyse",
      "Prediktivt lager (AI light)",
      "Integrasjoner: GS Bildeler, Bildeler.no, Mekonomen",
    ],
    notIncluded: [],
    valueProposition: "Sparer bedrifter 10.000–50.000 kr/mnd i innkjøp",
    bestFor: ["Store verksteder", "Bilpleiesentre med eget lager", "PPF/folie-bedrifter", "Skade/lakk-verksteder"],
    cta: "Velg Power",
    ctaLink: "/register?plan=power",
    popular: false,
    badge: "Mest lønnsom",
  },
  {
    id: "ai-suite",
    name: "LYXso AI Suite",
    price: "2.990",
    period: "/mnd + bruk",
    description: "Det ultimate AI-systemet for bilbedrifter",
    features: [
      "Alt i Power +",
      "AI Booking Agent (24/7)",
      "AI Mer-salgsmotor",
      "AI Prising (MarginMotor™)",
      "AI Skadeanalyse (DVI+)",
      "AI Coatinganalyse (CoatVision)",
      "AI Kampanje-generator",
      "AI Lagerassistent",
      "AI Kundechat",
      "AI Review-generator",
    ],
    notIncluded: [],
    usagePricing: "0,49 kr per AI-analyse / AI-oppgave",
    bestFor: [],
    cta: "Aktiver AI Suite",
    ctaLink: "/register?plan=ai",
    popular: false,
    badge: "Mest automatisert",
  },
  {
    id: "enterprise",
    name: "LYXso Enterprise",
    price: "Fra 4.990",
    period: "/mnd",
    description: "For kjeder, bilglass, store verksteder, bilforhandlere",
    features: [
      "Alt i AI Suite +",
      "Multilokasjon dashboard",
      "Sentralt økonomipanel",
      "Sentrale prislister",
      "Sentralt kundeinnsikt",
      "Sentralt varelager & logistikk",
      "Ansattflyt mellom avdelinger",
      "AI modulering per lokasjon",
      "Egen prosjektansvarlig",
      "Prioritert support",
      "Dedikert sikkerhet",
    ],
    notIncluded: [],
    scalingNote: "Én kontrakt → 50–200 avdelinger",
    bestFor: ["Verkstedkjeder", "Bilglasskjeder", "Store bilpleiesentre", "Bilforhandlere med service", "Franchise-konsepter"],
    cta: "Book møte med Enterprise-teamet",
    ctaLink: "/kontakt?type=enterprise",
    popular: false,
    badge: "For kjeder",
  },
];

const comparisonFeatures = [
  { name: "Booking & Kalender", lite: true, pro: true, power: true, ai: true, enterprise: true },
  { name: "Kunder & Kjøretøy", lite: true, pro: true, power: true, ai: true, enterprise: true },
  { name: "Dekkhotell", lite: false, pro: true, power: true, ai: true, enterprise: true },
  { name: "Coatingjournal", lite: false, pro: true, power: true, ai: true, enterprise: true },
  { name: "PPF-jobbkort", lite: false, pro: true, power: true, ai: true, enterprise: true },
  { name: "Varelager", lite: false, pro: false, power: true, ai: true, enterprise: true },
  { name: "Leverandørhub", lite: false, pro: false, power: true, ai: true, enterprise: true },
  { name: "AI-moduler", lite: false, pro: false, power: false, ai: true, enterprise: true },
  { name: "Multi-lokasjon", lite: false, pro: false, power: false, ai: false, enterprise: true },
];

const CheckIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XMarkIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function PricingPage() {
  return (
    <>
      <Analytics />
      <div className="min-h-screen bg-slate-950 text-slate-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-slate-800/50 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950"></div>
          
          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-600/30 bg-blue-600/10 px-4 py-1.5 text-xs font-medium text-blue-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Transparente priser
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl bg-gradient-to-r from-slate-50 via-blue-100 to-slate-50 bg-clip-text text-transparent">
                Velg planen som passer din bilbedrift
              </h1>
              
              <p className="text-xl text-slate-300 leading-relaxed">
                Start smått, skaler stort. Ingen bindingstid — kanseller når som helst.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckIcon />
                  <span className="text-emerald-400">14 dagers gratis prøveperiode</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon />
                  <span className="text-emerald-400">Ingen kredittkort nødvendig</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon />
                  <span className="text-emerald-400">Ingen bindingstid</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="relative py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-3">
              {packages.map((pkg, idx) => (
                <div
                  key={pkg.name}
                  className={`relative rounded-2xl border-2 p-8 ${
                    pkg.popular
                      ? "border-blue-500 bg-gradient-to-br from-blue-950/50 to-slate-950/50 shadow-xl shadow-blue-900/20"
                      : "border-slate-800 bg-slate-900/50"
                  } hover:border-blue-500/50 transition-all duration-300 hover:scale-105`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Mest populær
                      </span>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-50">{pkg.name}</h3>
                      <p className="mt-2 text-sm text-slate-400">{pkg.description}</p>
                    </div>

                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold text-slate-50">{pkg.price}</span>
                        <span className="text-slate-400">kr/mnd</span>
                      </div>
                    </div>

                    <Link
                      href={pkg.ctaLink}
                      className={`block w-full rounded-lg py-3 text-center font-semibold transition-all duration-200 ${
                        pkg.popular
                          ? "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30"
                          : "bg-slate-800 text-slate-100 hover:bg-slate-700"
                      }`}
                    >
                      {pkg.cta}
                    </Link>

                    <div className="space-y-3 border-t border-slate-800 pt-6">
                      <p className="text-sm font-semibold text-slate-300">Inkluderer:</p>
                      <ul className="space-y-2">
                        {pkg.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-sm text-slate-400">
                            <span className="text-emerald-400 mt-0.5"><CheckIcon /></span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {pkg.notIncluded.length > 0 && (
                      <div className="space-y-3 border-t border-slate-800/50 pt-4">
                        <p className="text-sm font-semibold text-slate-500">Ikke inkludert:</p>
                        <ul className="space-y-2">
                          {pkg.notIncluded.map((feature) => (
                            <li key={feature} className="flex items-start gap-2 text-sm text-slate-500">
                              <span className="mt-0.5"><XMarkIcon /></span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {pkg.bestFor.length > 0 && (
                      <div className="rounded-lg bg-slate-800/30 p-4">
                        <p className="text-xs font-semibold text-slate-400 mb-2">Passer for:</p>
                        <div className="flex flex-wrap gap-2">
                          {pkg.bestFor.map((type) => (
                            <span key={type} className="rounded-full bg-slate-700/50 px-3 py-1 text-xs text-slate-300">
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="relative py-20 border-t border-slate-800/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold text-slate-50">Sammenlign alle pakker</h2>
              <p className="text-lg text-slate-400">Se nøyaktig hva som inngår i hver pakke</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-800">
                    <th className="py-4 px-4 text-left text-sm font-semibold text-slate-300">Funksjon</th>
                    <th className="py-4 px-4 text-center text-sm font-semibold text-slate-300">Lite</th>
                    <th className="py-4 px-4 text-center text-sm font-semibold text-slate-300">Pro</th>
                    <th className="py-4 px-4 text-center text-sm font-semibold text-slate-300">Power</th>
                    <th className="py-4 px-4 text-center text-sm font-semibold text-slate-300">AI Suite</th>
                    <th className="py-4 px-4 text-center text-sm font-semibold text-slate-300">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature) => (
                    <tr key={feature.name} className="border-b border-slate-800/50 hover:bg-slate-900/30">
                      <td className="py-3 px-4 text-sm text-slate-300">{feature.name}</td>
                      <td className="py-3 px-4 text-center">
                        {feature.lite ? (
                          <span className="text-emerald-400 inline-block"><CheckIcon /></span>
                        ) : (
                          <span className="text-slate-600 inline-block"><XMarkIcon /></span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {feature.pro ? (
                          <span className="text-emerald-400 inline-block"><CheckIcon /></span>
                        ) : (
                          <span className="text-slate-600 inline-block"><XMarkIcon /></span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {feature.power ? (
                          <span className="text-emerald-400 inline-block"><CheckIcon /></span>
                        ) : (
                          <span className="text-slate-600 inline-block"><XMarkIcon /></span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {feature.ai ? (
                          <span className="text-emerald-400 inline-block"><CheckIcon /></span>
                        ) : (
                          <span className="text-slate-600 inline-block"><XMarkIcon /></span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {feature.enterprise ? (
                          <span className="text-emerald-400 inline-block"><CheckIcon /></span>
                        ) : (
                          <span className="text-slate-600 inline-block"><XMarkIcon /></span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-800">
                    <td className="py-4 px-4 text-sm font-semibold text-slate-300">Pris/mnd</td>
                    <td className="py-4 px-4 text-center text-sm font-bold text-slate-50">599 kr</td>
                    <td className="py-4 px-4 text-center text-sm font-bold text-slate-50">1.499 kr</td>
                    <td className="py-4 px-4 text-center text-sm font-bold text-slate-50">2.490 kr</td>
                    <td className="py-4 px-4 text-center text-sm font-bold text-slate-50">2.990 kr</td>
                    <td className="py-4 px-4 text-center text-sm font-bold text-slate-50">Fra 4.990 kr</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </section>

        {/* Add-ons Section */}
        <section className="relative py-20 border-t border-slate-800/50 bg-slate-900/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold text-slate-50">Ekstra tillegg</h2>
              <p className="text-lg text-slate-400">Tilpass systemet etter dine behov</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
              {/* SMS Packages */}
              <div className="rounded-2xl border-2 border-slate-800 bg-slate-900/50 p-8">
                <h3 className="text-xl font-bold text-slate-50 mb-6">SMS-pakker</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30">
                    <div>
                      <p className="font-semibold text-slate-200">Lite</p>
                      <p className="text-sm text-slate-400">100 SMS/mnd</p>
                    </div>
                    <p className="text-xl font-bold text-slate-50">99 kr</p>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30">
                    <div>
                      <p className="font-semibold text-slate-200">Standard</p>
                      <p className="text-sm text-slate-400">500 SMS/mnd</p>
                    </div>
                    <p className="text-xl font-bold text-slate-50">349 kr</p>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30">
                    <div>
                      <p className="font-semibold text-slate-200">Pro</p>
                      <p className="text-sm text-slate-400">2000 SMS/mnd</p>
                    </div>
                    <p className="text-xl font-bold text-slate-50">999 kr</p>
                  </div>
                </div>
              </div>

              {/* Support Levels */}
              <div className="rounded-2xl border-2 border-slate-800 bg-slate-900/50 p-8">
                <h3 className="text-xl font-bold text-slate-50 mb-6">Support-nivåer</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-slate-800/30">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-slate-200">Basic</p>
                      <p className="text-sm text-emerald-400 font-semibold">Inkludert</p>
                    </div>
                    <p className="text-sm text-slate-400">E-post, 24–48t respons</p>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30">
                    <div>
                      <p className="font-semibold text-slate-200">Premium</p>
                      <p className="text-sm text-slate-400">Telefon + prioritert support</p>
                    </div>
                    <p className="text-xl font-bold text-slate-50">+499 kr</p>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30">
                    <div>
                      <p className="font-semibold text-slate-200">VIP</p>
                      <p className="text-sm text-slate-400">Dedikert kontaktperson</p>
                    </div>
                    <p className="text-xl font-bold text-slate-50">+1.499 kr</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Special Offer */}
        <section className="relative py-20 border-t border-slate-800/50">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl border-2 border-blue-600 bg-gradient-to-br from-blue-950/80 to-slate-950/80 p-12 text-center shadow-2xl shadow-blue-900/30">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent"></div>
              
              <div className="relative space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-300">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                  Lanseringstilbud
                </div>

                <h2 className="text-4xl font-bold text-slate-50">
                  Spar 20% første måned
                </h2>
                
                <p className="text-xl text-slate-300">
                  Registrer deg innen <span className="font-bold text-blue-400">31. januar 2025</span> og få 20% rabatt første måned.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-500 transition-all duration-200 shadow-xl shadow-blue-600/30"
                  >
                    Start gratis prøveperiode nå
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>

                <p className="text-sm text-slate-400">
                  Gratis 14-dagers prøveperiode • Ingen kredittkort nødvendig
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="relative py-20 border-t border-slate-800/50">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold text-slate-50">Ofte stilte spørsmål</h2>
              <p className="text-lg text-slate-400">Alt du trenger å vite om priser og pakker</p>
            </div>

            <div className="space-y-6">
              {[
                {
                  q: "Kan jeg prøve LYXso gratis?",
                  a: "Ja! Vi tilbyr 14 dagers gratis prøveperiode — ingen kredittkort nødvendig.",
                },
                {
                  q: "Hvilken pakke passer for meg?",
                  a: "Det avhenger av bransje og størrelse. Små bilpleiere starter gjerne med Lite, mens verksteder med varelager bør velge Power. Trenger du hjelp? Book en demo.",
                },
                {
                  q: "Kan jeg bytte pakke senere?",
                  a: "Ja, du kan oppgradere eller nedgradere når som helst. Endringen trer i kraft fra neste faktureringsperiode.",
                },
                {
                  q: "Har dere bindingstid?",
                  a: "Nei, ingen bindingstid. Du kan kansellere når du vil. Vi tror på at systemet vårt holder deg som kunde, ikke en kontrakt.",
                },
                {
                  q: "Hva skjer med mine data hvis jeg avslutter?",
                  a: "Du får eksportert alle dine data før kontoen stenges. Vi sletter ingenting før du sier OK. Dine data er dine data.",
                },
                {
                  q: "Har dere support på norsk?",
                  a: "Ja! Full support på norsk via e-post, telefon og chat. Vi er her for å hjelpe deg.",
                },
              ].map((faq, idx) => (
                <div key={idx} className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 hover:border-blue-500/30 transition-colors">
                  <h3 className="text-lg font-semibold text-slate-50 mb-2">{faq.q}</h3>
                  <p className="text-slate-400">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative py-20 border-t border-slate-800/50">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <h2 className="text-4xl font-bold text-slate-50">
              Klar til å komme i gang?
            </h2>
            <p className="text-xl text-slate-300">
              Tusenvis av bilbedrifter i Norge leter etter et moderne system. Bli en av pionerene.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-500 transition-all duration-200"
              >
                Prøv gratis i 14 dager
              </Link>
              <Link
                href="/kontakt"
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-slate-600 bg-slate-900/80 px-8 py-4 text-lg font-semibold text-slate-100 hover:border-blue-400 transition-all duration-200"
              >
                Book en demo
              </Link>
            </div>

            <p className="text-sm text-slate-500">
              Ingen kredittkort nødvendig • Kanseller når som helst • Norsk support
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="relative py-12 border-t border-slate-800/50 bg-slate-900/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-2">
              <p className="text-sm text-slate-400">Spørsmål om priser eller pakker?</p>
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                <a href="mailto:kontakt@lyxso.no" className="text-blue-400 hover:text-blue-300 transition-colors">
                  kontakt@lyxso.no
                </a>
                <span className="text-slate-700">•</span>
                <span className="text-slate-400">Eikenga 25, Oslo</span>
                <span className="text-slate-700">•</span>
                <a href="https://lyxso.no" className="text-blue-400 hover:text-blue-300 transition-colors">
                  www.lyxso.no
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
