// app/(protected)/hjelp/HelpPageClient.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";

type FaqItem = {
  question: string;
  answer: string;
  category: string;
};

const FAQ_ITEMS: FaqItem[] = [
  {
    category: "Kom i gang",
    question: "Hvordan legger jeg til min første tjeneste?",
    answer: "Gå til Tjenester i menyen, klikk 'Ny tjeneste' og fyll inn navn, varighet og pris. Tjenesten blir automatisk tilgjengelig i bookingkalenderen.",
  },
  {
    category: "Kom i gang",
    question: "Hvordan setter jeg opp åpningstider?",
    answer: "Under Innstillinger → Åpningstider kan du definere åpningstider for hver ukedag. Disse brukes av bookingmotoren for å vise ledige tider til kundene.",
  },
  {
    category: "Booking",
    question: "Kan kunder booke direkte på nettsiden min?",
    answer: "Ja! Når du har satt opp landingssiden din under Landingsside-innstillinger, får kundene en booking-widget der de kan velge tjeneste og tid. Du kan også embedde booking-widgeten på din egen nettside.",
  },
  {
    category: "Booking",
    question: "Hvordan kansellerer jeg en booking?",
    answer: "Åpne bookingen i kalenderen, klikk på den og velg 'Kanseller'. Kunden får automatisk beskjed via e-post eller SMS hvis du har aktivert varsler.",
  },
  {
    category: "Kunder",
    question: "Hvordan eksporterer jeg kundelisten?",
    answer: "Under Kunder kan du bruke eksport-knappen øverst til høyre for å laste ned kundelisten som CSV eller Excel-fil.",
  },
  {
    category: "Økonomi",
    question: "Støtter LYXso integrasjon med regnskapssystemer?",
    answer: "Ja, vi jobber med integrasjoner mot Fiken og PowerOffice. Under Regnskap-innstillinger kan du koble til ditt regnskapssystem for automatisk overføring av bilag.",
  },
  {
    category: "AI & markedsføring",
    question: "Hva er LYXba?",
    answer: "LYXba er vår AI-drevne booking-agent som kan håndtere leads, sende påminnelser og til og med ringe kunder for å bekrefte bookinger. Tilgjengelig på prøve- og betalt plan.",
  },
  {
    category: "Teknisk",
    question: "Hvordan endre passord?",
    answer: "Logg inn, gå til din profil øverst til høyre, og velg 'Endre passord'. Du kan også bruke 'Glemt passord'-funksjonen på innloggingssiden.",
  },
];

const QUICK_START_STEPS = [
  {
    step: 1,
    title: "Sett opp profilen din",
    description: "Legg inn bedriftsnavn, logo, kontaktinfo og åpningstider.",
    link: "/onboarding",
    linkText: "Gå til onboarding",
  },
  {
    step: 2,
    title: "Legg til tjenester",
    description: "Definer hva du tilbyr, varighet og priser.",
    link: "/tjenester",
    linkText: "Administrer tjenester",
  },
  {
    step: 3,
    title: "Importer eller legg til kunder",
    description: "Start med eksisterende kundebase eller legg til nye.",
    link: "/kunder",
    linkText: "Gå til kunder",
  },
  {
    step: 4,
    title: "Aktiver booking",
    description: "Sett opp landingsside eller embed booking på egen nettside.",
    link: "/landingsside",
    linkText: "Sett opp landingsside",
  },
  {
    step: 5,
    title: "Koble betaling (valgfritt)",
    description: "Koble terminal eller online-betaling for å ta imot betalinger.",
    link: "/regnskap",
    linkText: "Gå til regnskap",
  },
];

const CHECKLIST_ITEMS = [
  { id: "profile", label: "Bedriftsprofil utfylt", category: "Grunnoppsett" },
  { id: "hours", label: "Åpningstider satt", category: "Grunnoppsett" },
  { id: "services", label: "Minst én tjeneste opprettet", category: "Grunnoppsett" },
  { id: "landing", label: "Landingsside publisert", category: "Online" },
  { id: "booking_widget", label: "Booking-widget aktivert", category: "Online" },
  { id: "payment", label: "Betalingsløsning koblet", category: "Økonomi" },
  { id: "accounting", label: "Regnskapssystem koblet", category: "Økonomi" },
  { id: "backup", label: "Backup-rutiner bekreftet", category: "Teknisk" },
  { id: "ssl", label: "SSL-sertifikat aktivt", category: "Teknisk" },
];

export default function HelpPageClient() {
  const [activeTab, setActiveTab] = useState<"quickstart" | "faq" | "checklist" | "contact">("quickstart");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const toggleCheckItem = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalCheckItems = CHECKLIST_ITEMS.length;

  const faqCategories = [...new Set(FAQ_ITEMS.map(item => item.category))];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Hjelp & dokumentasjon</h1>
        <p className="text-sm text-slate-500">
          Kom i gang, finn svar på vanlige spørsmål og kontakt support.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-6">
          {[
            { key: "quickstart", label: "Kom i gang" },
            { key: "faq", label: "FAQ" },
            { key: "checklist", label: "Sjekkliste" },
            { key: "contact", label: "Kontakt" },
          ].map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`pb-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Quick Start tab */}
      {activeTab === "quickstart" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <h2 className="text-sm font-semibold text-blue-900">
              🚀 Kom i gang på 10 minutter
            </h2>
            <p className="text-xs text-blue-700 mt-1">
              Følg disse stegene for å sette opp LYXso for din bedrift.
            </p>
          </div>

          <div className="space-y-4">
            {QUICK_START_STEPS.map((step) => (
              <div
                key={step.step}
                className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                  {step.step}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-slate-900">{step.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{step.description}</p>
                </div>
                <Link
                  href={step.link}
                  className="flex-shrink-0 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  {step.linkText}
                </Link>
              </div>
            ))}
          </div>

          {/* Video placeholder */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              📹 Introduksjonsvideo
            </h3>
            <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
              <span className="text-sm">Video kommer snart</span>
            </div>
          </div>
        </div>
      )}

      {/* FAQ tab */}
      {activeTab === "faq" && (
        <div className="space-y-6">
          {faqCategories.map(category => (
            <div key={category}>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">
                {category}
              </h3>
              <div className="space-y-2">
                {FAQ_ITEMS
                  .filter(item => item.category === category)
                  .map((item, idx) => {
                    const globalIdx = FAQ_ITEMS.indexOf(item);
                    const isExpanded = expandedFaq === globalIdx;
                    return (
                      <div
                        key={globalIdx}
                        className="rounded-lg border border-slate-200 bg-white overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => toggleFaq(globalIdx)}
                          className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-slate-50"
                        >
                          <span className="text-sm font-medium text-slate-900">
                            {item.question}
                          </span>
                          <span className={`text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                            ▼
                          </span>
                        </button>
                        {isExpanded && (
                          <div className="px-4 pb-4 text-xs text-slate-600">
                            {item.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Checklist tab */}
      {activeTab === "checklist" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-900">
                Klar for produksjon?
              </h2>
              <span className="text-xs text-slate-500">
                {completedCount} av {totalCheckItems} fullført
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-6">
              <div 
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${(completedCount / totalCheckItems) * 100}%` }}
              />
            </div>

            {/* Checklist items grouped by category */}
            {[...new Set(CHECKLIST_ITEMS.map(item => item.category))].map(category => (
              <div key={category} className="mb-4">
                <h4 className="text-xs font-medium text-slate-500 mb-2">{category}</h4>
                <div className="space-y-2">
                  {CHECKLIST_ITEMS
                    .filter(item => item.category === category)
                    .map(item => (
                      <label
                        key={item.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={checkedItems[item.id] || false}
                          onChange={() => toggleCheckItem(item.id)}
                          className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className={`text-sm ${checkedItems[item.id] ? "text-slate-400 line-through" : "text-slate-700"}`}>
                          {item.label}
                        </span>
                      </label>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {completedCount === totalCheckItems && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
              <p className="text-sm font-semibold text-emerald-900">
                🎉 Gratulerer! Alt er klart for produksjon.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Contact tab */}
      {activeTab === "contact" && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              📧 E-post support
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Send oss en e-post, så svarer vi innen 24 timer (hverdager).
            </p>
            <a
              href="mailto:support@lyxso.no"
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              support@lyxso.no
            </a>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              💬 Chat med oss
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Trenger du rask hjelp? Start en chat (hverdager 09-17).
            </p>
            <button
              type="button"
              disabled
              className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-400 cursor-not-allowed"
            >
              Chat kommer snart
            </button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              📚 Teknisk dokumentasjon
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              API-dokumentasjon, integrasjonsguider og utviklerdocs.
            </p>
            <button
              type="button"
              disabled
              className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-400 cursor-not-allowed"
            >
              Docs kommer snart
            </button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              🐛 Rapporter en feil
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Fant du en bug? Gi oss beskjed så fikser vi det fort.
            </p>
            <a
              href="mailto:bugs@lyxso.no?subject=Feilrapport"
              className="inline-flex items-center rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Rapporter feil
            </a>
          </div>
        </div>
      )}

      {/* System info */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
        <p className="font-medium text-slate-700 mb-2">Systeminformasjon</p>
        <div className="grid grid-cols-2 gap-2">
          <div>Versjon: 1.0.0-beta</div>
          <div>Miljø: Produksjon</div>
          <div>Sist oppdatert: {new Date().toLocaleDateString("nb-NO")}</div>
          <div>Status: ✅ Operativt</div>
        </div>
      </div>
    </div>
  );
}
