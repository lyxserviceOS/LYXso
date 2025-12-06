// app/demo/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import analytics from "@/lib/analytics";

const industries = [
  "Bilpleie",
  "Verksted",
  "Dekkhotell",
  "PPF & Folie",
  "Skade & Lakk",
  "Bilutleie",
  "Annet",
];

export default function DemoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    industry: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Track page view
  useEffect(() => {
    analytics.pageView('Demo Booking');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Track form submission
    analytics.formSubmit('Demo booking');

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Track demo booked
    analytics.demoBooked(formData.industry);

    setSubmitted(true);
    setLoading(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-emerald-600/20 p-6">
              <svg
                className="h-16 w-16 text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl font-bold">Takk for din interesse!</h1>
          <p className="text-xl text-slate-300">
            Vi har mottatt din forespørsel og vil kontakte deg innen 24 timer.
          </p>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-200">
              Hva skjer nå?
            </h2>
            <ul className="space-y-3 text-left text-slate-300">
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">1.</span>
                <span>
                  Vi går gjennom din forespørsel og forbereder en demo tilpasset
                  din bransje
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">2.</span>
                <span>
                  Du får en e-post med bekreftelse og kalenderinvitasjon
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">3.</span>
                <span>
                  Vi viser deg systemet og svarer på alle spørsmål du måtte ha
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500 transition-colors"
            >
              Tilbake til forsiden
            </Link>
            <Link
              href="/priser"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-slate-600 bg-slate-900/80 px-6 py-3 font-semibold text-slate-100 hover:border-blue-400 transition-colors"
            >
              Se priser
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Tilbake
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-800/50 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950"></div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-600/30 bg-blue-600/10 px-4 py-1.5 text-xs font-medium text-blue-400">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              20-minutters demo
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-slate-50 via-blue-100 to-slate-50 bg-clip-text text-transparent">
              Se hvordan LYXso transformerer bilbedriften din
            </h1>

            <p className="text-xl text-slate-300 leading-relaxed">
              Book en personlig demo og se systemet i aksjon. Vi tilpasser
              presentasjonen til din bransje og dine behov.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left: Benefits */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  Hva får du i demoen?
                </h2>
                <ul className="space-y-4">
                  {[
                    {
                      title: "Personlig gjennomgang",
                      description:
                        "Vi viser funksjonene som er mest relevante for din bransje",
                    },
                    {
                      title: "Se systemet i aksjon",
                      description:
                        "Live-demonstrasjon av booking, kalender, dekkhotell, AI og mer",
                    },
                    {
                      title: "Svar på spørsmål",
                      description:
                        "Få alle svar du trenger for å ta en beslutning",
                    },
                    {
                      title: "ROI-beregning",
                      description:
                        "Vi regner ut hvor mye din bedrift kan spare med LYXso",
                    },
                    {
                      title: "Ingen forpliktelser",
                      description: "Demoen er helt gratis og uforpliktende",
                    },
                  ].map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600/20">
                        <svg
                          className="h-5 w-5 text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-200">
                          {benefit.title}
                        </p>
                        <p className="text-sm text-slate-400 mt-1">
                          {benefit.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trust indicators */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
                <h3 className="font-semibold text-slate-200 mb-4">
                  Trygt valg
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <svg
                      className="h-5 w-5 text-emerald-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    150+ bedrifter
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <svg
                      className="h-5 w-5 text-emerald-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Norsk support
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <svg
                      className="h-5 w-5 text-emerald-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    GDPR-sikker
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <svg
                      className="h-5 w-5 text-emerald-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    14 dagers prøve
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div>
              <div className="rounded-2xl border-2 border-slate-800 bg-slate-900/50 p-8">
                <h2 className="text-2xl font-bold mb-6">Book din demo</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-slate-300 mb-2"
                    >
                      Fullt navn *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Ola Nordmann"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-300 mb-2"
                    >
                      E-post *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="ola@bedrift.no"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-slate-300 mb-2"
                    >
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="+47 XXX XX XXX"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium text-slate-300 mb-2"
                    >
                      Bedriftsnavn *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      required
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Bedrift AS"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="industry"
                      className="block text-sm font-medium text-slate-300 mb-2"
                    >
                      Bransje *
                    </label>
                    <select
                      id="industry"
                      name="industry"
                      required
                      value={formData.industry}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="">Velg bransje</option>
                      {industries.map((industry) => (
                        <option key={industry} value={industry}>
                          {industry}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-slate-300 mb-2"
                    >
                      Melding (valgfritt)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Fortell oss gjerne litt om hva du ser etter..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-blue-600 px-6 py-4 font-semibold text-white hover:bg-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sender...
                      </>
                    ) : (
                      <>
                        Book demo nå
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </>
                    )}
                  </button>

                  <p className="text-xs text-slate-500 text-center">
                    Ved å sende inn dette skjemaet godtar du at vi kontakter deg
                    angående LYXso.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alternative: Calendly Integration */}
      <section className="py-16 border-t border-slate-800/50 bg-slate-900/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl font-bold">Eller book direkte i kalenderen</h2>
          <p className="text-slate-400">
            Foretrekker du å velge tid selv? Book direkte i vår kalender.
          </p>
          <div className="pt-4">
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-600 bg-slate-900/80 px-6 py-3 font-semibold text-slate-100 hover:border-blue-400 transition-colors"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Se ledige tider
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
