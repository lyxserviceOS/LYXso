"use client";

import Link from "next/link";

type RelatedModule = {
  name: string;
  href: string;
  icon: string;
  description: string;
  badge?: string;
};

type CrossNavigationProps = {
  currentModule: string;
  relatedModules: RelatedModule[];
};

/**
 * CrossNavigation viser relaterte moduler som brukeren kan navigere til
 * Dette hjelper med å oppdage funksjoner og forbedrer brukeropplevelsen
 */
export default function CrossNavigation({ currentModule, relatedModules }: CrossNavigationProps) {
  if (relatedModules.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
        <span className="text-lg">🔗</span>
        Relaterte funksjoner til {currentModule}
      </h3>
      
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {relatedModules.map((module) => (
          <Link
            key={module.href}
            href={module.href}
            className="group flex flex-col gap-2 rounded-lg border border-slate-200 p-4 transition-all hover:border-blue-400 hover:bg-blue-50 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{module.icon}</span>
              {module.badge && (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">
                  {module.badge}
                </span>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-900 group-hover:text-blue-600">
                {module.name}
              </h4>
              <p className="mt-1 text-xs text-slate-600">{module.description}</p>
            </div>
            <div className="mt-auto flex items-center justify-end text-xs font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
              Åpne →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/**
 * Predefined navigation maps for each module
 */
export const navigationMaps = {
  booking: [
    {
      name: "Kunder (CRM)",
      href: "/kunder",
      icon: "👥",
      description: "Se kundehistorikk og kontaktinfo",
    },
    {
      name: "Tjenester",
      href: "/tjenester",
      icon: "🛠️",
      description: "Administrer bookbare tjenester",
    },
    {
      name: "Ansatte",
      href: "/ansatte",
      icon: "👤",
      description: "Kapasitet og tilgjengelighet",
    },
    {
      name: "Booking AI",
      href: "/ai/booking",
      icon: "🤖",
      description: "Smart tidsluke-forslag og automatisering",
      badge: "AI",
    },
    {
      name: "Kapasitet AI",
      href: "/ai/capacity",
      icon: "📊",
      description: "Optimalisér ressursbruk",
      badge: "AI",
    },
  ],
  
  kunder: [
    {
      name: "Bookinger",
      href: "/booking",
      icon: "📅",
      description: "Se kundens bookinghistorikk",
    },
    {
      name: "Leads",
      href: "/leads",
      icon: "🎯",
      description: "Potensielle kunder og oppfølging",
    },
    {
      name: "Markedsføring",
      href: "/markedsforing",
      icon: "📣",
      description: "Segmenter og kampanjer",
    },
    {
      name: "CRM AI",
      href: "/ai/crm",
      icon: "🎯",
      description: "AI-drevet kundeanalyse",
      badge: "AI",
    },
  ],

  markedsforing: [
    {
      name: "Leads",
      href: "/leads",
      icon: "🎯",
      description: "Generer og følg opp potensielle kunder",
    },
    {
      name: "Kunder (CRM)",
      href: "/kunder",
      icon: "👥",
      description: "Se målgruppesegmenter",
    },
    {
      name: "Landingsside",
      href: "/landingsside",
      icon: "🌐",
      description: "Rediger landing pages",
    },
    {
      name: "Marketing AI",
      href: "/ai/marketing",
      icon: "📣",
      description: "AI-drevet kampanjegenerering",
      badge: "AI",
    },
    {
      name: "Innhold AI",
      href: "/ai/content",
      icon: "✍️",
      description: "Automatisk innholdsgenerering",
      badge: "AI",
    },
  ],

  regnskap: [
    {
      name: "Bookinger",
      href: "/booking",
      icon: "📅",
      description: "Se transaksjonshistorikk",
    },
    {
      name: "Kunder",
      href: "/kunder",
      icon: "👥",
      description: "Kundefakturering",
    },
    {
      name: "Produkter",
      href: "/produkter",
      icon: "📦",
      description: "Varebeholdning og kostnad",
    },
    {
      name: "Regnskap AI",
      href: "/ai/accounting",
      icon: "💰",
      description: "Automatisk kategorisering og MVA",
      badge: "AI",
    },
  ],

  ansatte: [
    {
      name: "Bookinger",
      href: "/booking",
      icon: "📅",
      description: "Kapasitetsplanlegging",
    },
    {
      name: "Tjenester",
      href: "/tjenester",
      icon: "🛠️",
      description: "Hvilke tjenester kan utføres",
    },
    {
      name: "Kapasitet AI",
      href: "/ai/capacity",
      icon: "📊",
      description: "Optimaliser bemanningen",
      badge: "AI",
    },
  ],

  dekkhotell: [
    {
      name: "Kunder",
      href: "/kunder",
      icon: "👥",
      description: "Kundeinfo og bildata",
    },
    {
      name: "Bookinger",
      href: "/booking",
      icon: "📅",
      description: "Book inn/utlevering",
    },
    {
      name: "Produkter",
      href: "/produkter",
      icon: "📦",
      description: "Lagerstyring dekk",
    },
    {
      name: "LYX Vision",
      href: "/ai/vision",
      icon: "👁️",
      description: "AI analyse av dekk/felg",
      badge: "AI",
    },
  ],

  tjenester: [
    {
      name: "Bookinger",
      href: "/booking",
      icon: "📅",
      description: "Se bookinger per tjeneste",
    },
    {
      name: "Ansatte",
      href: "/ansatte",
      icon: "👤",
      description: "Hvem kan utføre tjenesten",
    },
    {
      name: "Produkter",
      href: "/produkter",
      icon: "📦",
      description: "Knytt produkter til tjenester",
    },
    {
      name: "Markedsføring",
      href: "/markedsforing",
      icon: "📣",
      description: "Promover tjenester",
    },
  ],

  leads: [
    {
      name: "Kunder (CRM)",
      href: "/kunder",
      icon: "👥",
      description: "Konverter leads til kunder",
    },
    {
      name: "Markedsføring",
      href: "/markedsforing",
      icon: "📣",
      description: "Se kampanjeresultater",
    },
    {
      name: "CRM AI",
      href: "/ai/crm",
      icon: "🎯",
      description: "Lead scoring og prioritering",
      badge: "AI",
    },
    {
      name: "LYXba Agent",
      href: "/ai-agent",
      icon: "🤖",
      description: "Automatisk oppfølging 24/7",
      badge: "AI",
    },
  ],

  ai: [
    {
      name: "Dashboard",
      href: "/kontrollpanel",
      icon: "🏠",
      description: "Tilbake til oversikten",
    },
    {
      name: "Plan & Addons",
      href: "/plan",
      icon: "📋",
      description: "Se hvilke AI-moduler som er inkludert",
    },
    {
      name: "Integrasjoner",
      href: "/integrasjoner",
      icon: "🔌",
      description: "Koble AI til eksterne systemer",
    },
  ],
};
