// app/kontakt/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

export default function KontaktPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    category: "general",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
    ticketNumber?: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/support/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Noe gikk galt");
      }

      setSubmitStatus({
        type: "success",
        message: data.message,
        ticketNumber: data.ticket_number,
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        company: "",
        category: "general",
        subject: "",
        message: "",
      });
    } catch (error: any) {
      setSubmitStatus({
        type: "error",
        message: error.message || "Kunne ikke sende melding. Prøv igjen.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <main className="mx-auto max-w-4xl space-y-16 px-4 py-12 lg:px-8 lg:py-16">
        
        {/* Hero */}
        <section className="space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Kontakt oss
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Vil du vite mer om LYXso, bli partner eller bare stille et spørsmål? Vi hjelper deg gjerne.
          </p>
        </section>

        {/* Kontaktmåter */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600/20">
                <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">E-post</h3>
                <p className="text-sm text-slate-400">Generelle henvendelser</p>
              </div>
            </div>
            <a 
              href="mailto:post@lyxso.no" 
              className="block text-blue-400 hover:text-blue-300 transition-colors"
            >
              post@lyxso.no
            </a>
            <p className="text-sm text-slate-400">
              Vi svarer normalt innen 24 timer på hverdager.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-600/20">
                <svg className="h-6 w-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Partner-support</h3>
                <p className="text-sm text-slate-400">For eksisterende partnere</p>
              </div>
            </div>
            <a 
              href="mailto:support@lyxso.no" 
              className="block text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              support@lyxso.no
            </a>
            <p className="text-sm text-slate-400">
              Dedikert support for tekniske spørsmål og hjelp.
            </p>
          </div>
        </section>

        {/* Bli partner CTA */}
        <section className="rounded-2xl border-2 border-blue-600/50 bg-gradient-to-br from-blue-900/20 to-slate-900/40 p-8 lg:p-10 text-center space-y-6">
          <h2 className="text-2xl font-bold">Vil du bli partner?</h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Vi tar inn et begrenset antall partnere i 2025. Fyll ut partnerforespørselen, så tar vi kontakt for en uforpliktende prat om hvordan LYXso kan passe for din bedrift.
          </p>
          <Link
            href="/bli-partner"
            className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
          >
            Søk om partnerskap
          </Link>
        </section>

        {/* FAQ */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Ofte stilte spørsmål</h2>
          
          <div className="space-y-4">
            <details className="group rounded-xl border border-slate-800 bg-slate-900/60 p-6">
              <summary className="cursor-pointer text-lg font-semibold text-slate-100 flex justify-between items-center">
                Hva koster LYXso?
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                LYXso har tre plannivåer: Start (grunnleggende funksjoner), Pro (full CRM, dekkhotell og coating), og Max (inkluderer AI-moduler). Prisen avhenger av hvilke moduler du trenger og hvor mange brukere. Kontakt oss for et tilpasset tilbud.
              </p>
            </details>

            <details className="group rounded-xl border border-slate-800 bg-slate-900/60 p-6">
              <summary className="cursor-pointer text-lg font-semibold text-slate-100 flex justify-between items-center">
                Er det noen bindingstid?
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                Nei, LYXso har ingen bindingstid. Du kan si opp når som helst med 30 dagers varsel. Vi tjener på at systemet faktisk fungerer for deg, ikke på å låse deg inn.
              </p>
            </details>

            <details className="group rounded-xl border border-slate-800 bg-slate-900/60 p-6">
              <summary className="cursor-pointer text-lg font-semibold text-slate-100 flex justify-between items-center">
                Kan jeg teste LYXso først?
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                Ja, vi tilbyr demo og en prøveperiode for nye partnere. Du får full tilgang til systemet i en testperiode hvor vi hjelper deg med oppsett og onboarding. Ingen betaling før du er klar til å gå live.
              </p>
            </details>

            <details className="group rounded-xl border border-slate-800 bg-slate-900/60 p-6">
              <summary className="cursor-pointer text-lg font-semibold text-slate-100 flex justify-between items-center">
                Kan jeg importere data fra mitt nåværende system?
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                Ja, vi hjelper deg med å importere kunder, kjøretøy, bookinger og annen data fra eksisterende systemer. Hvor enkelt det er avhenger av hvilken løsning du kommer fra, men vi har erfaring med de fleste vanlige systemene.
              </p>
            </details>

            <details className="group rounded-xl border border-slate-800 bg-slate-900/60 p-6">
              <summary className="cursor-pointer text-lg font-semibold text-slate-100 flex justify-between items-center">
                Hvilke integrasjoner støtter LYXso?
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                Vi integrerer med norske og nordiske systemer som Fiken, Tripletex, PowerOffice (regnskap), Vipps og Stripe (betaling), samt SendGrid og Twilio (e-post/SMS). Flere integrasjoner kommer løpende basert på partnernes behov.
              </p>
            </details>

            <details className="group rounded-xl border border-slate-800 bg-slate-900/60 p-6">
              <summary className="cursor-pointer text-lg font-semibold text-slate-100 flex justify-between items-center">
                Får jeg hjelp med oppstart og opplæring?
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                Ja, alle partnere får onboarding hvor vi hjelper med oppsett, import av data og opplæring av teamet ditt. På Pro og Max-planene får du dedikert onboarding med prioritert support de første månedene.
              </p>
            </details>
          </div>
        </section>

        {/* Kontaktskjema */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 space-y-6">
          <h2 className="text-2xl font-bold">Send oss en melding</h2>
          <p className="text-sm text-slate-400">
            Fyll ut skjemaet under, så tar vi kontakt så snart som mulig.
          </p>
          
          {submitStatus.type === "success" && (
            <div className="rounded-lg border border-emerald-600 bg-emerald-900/20 p-4">
              <p className="text-sm text-emerald-400 font-medium">
                ✅ {submitStatus.message}
              </p>
              {submitStatus.ticketNumber && (
                <p className="text-xs text-emerald-300 mt-2">
                  Ticket-nummer: <strong>{submitStatus.ticketNumber}</strong>
                </p>
              )}
            </div>
          )}

          {submitStatus.type === "error" && (
            <div className="rounded-lg border border-red-600 bg-red-900/20 p-4">
              <p className="text-sm text-red-400">
                ❌ {submitStatus.message}
              </p>
            </div>
          )}
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-slate-200">
                  Navn *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Ditt navn"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-slate-200">
                  E-post *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="din@epost.no"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="company" className="block text-sm font-medium text-slate-200">
                Bedrift
              </label>
              <input
                type="text"
                id="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Bedriftsnavn (valgfritt)"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium text-slate-200">
                Kategori
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-4 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="general">Generelt spørsmål</option>
                <option value="technical">Teknisk support</option>
                <option value="billing">Fakturering</option>
                <option value="partnership">Partnerskap</option>
                <option value="demo">Demo forespørsel</option>
                <option value="feedback">Tilbakemelding</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="block text-sm font-medium text-slate-200">
                Emne
              </label>
              <input
                type="text"
                id="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Kort beskrivelse av henvendelsen"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm font-medium text-slate-200">
                Melding *
              </label>
              <textarea
                id="message"
                required
                rows={6}
                value={formData.message}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Hva lurer du på?"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors disabled:bg-slate-700 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sender..." : "Send melding"}
            </button>
          </form>
        </section>

      </main>
    </div>
  );
}
