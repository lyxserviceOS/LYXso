// app/demo-booking/page.tsx
"use client";

import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { useState } from "react";

export default function DemoBookingPage() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    businessType: "",
    locations: "1",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission to Supabase or email service
    console.log("Demo booking:", formData);
    alert("Takk! Vi kontakter deg innen 24 timer for å avtale demo.");
  };

  return (
    <>
      <Analytics />
      <div className="min-h-screen bg-slate-950 text-slate-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-slate-800/50 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950"></div>
          
          <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-600/30 bg-blue-600/10 px-4 py-1.5 text-xs font-medium text-blue-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Personlig demonstrasjon
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl bg-gradient-to-r from-slate-50 via-blue-100 to-slate-50 bg-clip-text text-transparent">
                Se hvordan LYXso transformerer din bilbedrift
              </h1>
              
              <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
                Book en 20-minutters demo og se systemet i aksjon. Ingen salgspress — bare en ærlig gjennomgang tilpasset din bedrift.
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Benefits */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-50 mb-6">Hva du får på demoen:</h2>
                <ul className="space-y-4">
                  {[
                    {
                      icon: "🎯",
                      title: "Personlig gjennomgang",
                      desc: "Tilpasset din type bilbedrift og behov"
                    },
                    {
                      icon: "🤖",
                      title: "Se AI i aksjon",
                      desc: "AI booking-agent som booker kunder automatisk 24/7"
                    },
                    {
                      icon: "💰",
                      title: "ROI-kalkulator",
                      desc: "Se nøyaktig hvor mye du kan spare på innkjøp"
                    },
                    {
                      icon: "📊",
                      title: "Live demo-data",
                      desc: "Utforsk systemet med realistiske eksempler"
                    },
                    {
                      icon: "💬",
                      title: "Få svar på alt",
                      desc: "Spør om hva som helst — teknisk eller forretning"
                    },
                    {
                      icon: "🎁",
                      title: "Eksklusivt tilbud",
                      desc: "30% rabatt i 3 måneder for demo-deltakere"
                    }
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-4 p-4 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-blue-500/30 transition-colors">
                      <span className="text-3xl">{item.icon}</span>
                      <div>
                        <h3 className="font-semibold text-slate-50">{item.title}</h3>
                        <p className="text-sm text-slate-400 mt-1">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
                <h3 className="text-lg font-semibold text-slate-50">Hvem passer dette for?</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Bilpleiere",
                    "Verksteder",
                    "PPF-bedrifter",
                    "Dekkhoteller",
                    "Lakk/skade",
                    "Bilkjeder",
                    "Bilforhandlere"
                  ].map((type) => (
                    <span key={type} className="rounded-full bg-blue-600/20 border border-blue-600/30 px-4 py-2 text-sm text-blue-300">
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Testimonial */}
              <div className="rounded-xl border border-blue-600/30 bg-gradient-to-br from-blue-950/20 to-slate-950/20 p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-300 italic mb-3">
                  "Demoen solgte meg på 10 minutter. Nå styrer vi 3 lokasjoner fra ett dashboard og har kuttet admin-tiden med 80%."
                </p>
                <p className="text-sm text-slate-400">
                  — Torstein L., BilService Kjeden AS
                </p>
              </div>
            </div>

            {/* Right Column - Form */}
            <div>
              <div className="rounded-2xl border-2 border-slate-800 bg-slate-900/50 p-8 sticky top-8">
                <h2 className="text-2xl font-bold text-slate-50 mb-6">Book din demo nå</h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                      Ditt navn *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Ola Nordmann"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-2">
                      Bedriftsnavn *
                    </label>
                    <input
                      type="text"
                      id="company"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Din Bilpleie AS"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                      E-post *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="ola@dinbilpleie.no"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="+47 123 45 678"
                    />
                  </div>

                  <div>
                    <label htmlFor="businessType" className="block text-sm font-medium text-slate-300 mb-2">
                      Type bedrift *
                    </label>
                    <select
                      id="businessType"
                      required
                      value={formData.businessType}
                      onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="">Velg type</option>
                      <option value="bilpleie">Bilpleie & Detailing</option>
                      <option value="verksted">Verksted & Service</option>
                      <option value="ppf">PPF & Foliering</option>
                      <option value="dekkhotell">Dekkhotell</option>
                      <option value="lakk">Lakk & Skade</option>
                      <option value="kjede">Bilkjede / Flere lokasjoner</option>
                      <option value="forhandler">Bilforhandler</option>
                      <option value="annet">Annet</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="locations" className="block text-sm font-medium text-slate-300 mb-2">
                      Antall lokasjoner
                    </label>
                    <select
                      id="locations"
                      value={formData.locations}
                      onChange={(e) => setFormData({...formData, locations: e.target.value})}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="1">1 lokasjon</option>
                      <option value="2-3">2-3 lokasjoner</option>
                      <option value="4-10">4-10 lokasjoner</option>
                      <option value="11+">11+ lokasjoner</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                      Har du spesielle spørsmål eller behov? (valgfritt)
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Fortell oss gjerne litt om hva du ønsker å se i demoen..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-500 transition-all duration-200 shadow-xl shadow-blue-600/30"
                  >
                    Book demo nå
                  </button>

                  <p className="text-xs text-slate-500 text-center">
                    Vi kontakter deg innen 24 timer for å avtale tid. Ingen binding eller forpliktelser.
                  </p>
                </form>

                <div className="mt-6 pt-6 border-t border-slate-800 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>20 minutter, tilpasset din bedrift</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Ingen kredittkort eller forpliktelser</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>30% rabatt i 3 mnd for demo-deltakere</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-slate-500">
                  Foretrekker du å prøve selv?{" "}
                  <Link href="/register" className="text-blue-400 hover:text-blue-300 underline">
                    Start gratis prøveperiode
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Footer */}
        <section className="relative py-12 border-t border-slate-800/50 bg-slate-900/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-2">
              <p className="text-sm text-slate-400">Spørsmål?</p>
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                <a href="mailto:kontakt@lyxso.no" className="text-blue-400 hover:text-blue-300 transition-colors">
                  kontakt@lyxso.no
                </a>
                <span className="text-slate-700">•</span>
                <span className="text-slate-400">Eikenga 25, Oslo</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
