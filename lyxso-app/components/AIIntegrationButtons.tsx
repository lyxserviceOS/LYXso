"use client";

import Link from "next/link";
import { useState } from "react";

type AIModule = {
  id: string;
  name: string;
  icon: string;
  description: string;
  href: string;
  color: string;
  features: string[];
  requiresPlan?: "free" | "pro" | "enterprise";
};

type AIIntegrationButtonProps = {
  module: AIModule;
  context?: "booking" | "marketing" | "crm" | "accounting" | "capacity" | "all";
  onActivate?: () => void;
};

export function AIIntegrationButton({ module, context, onActivate }: AIIntegrationButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <Link
        href={module.href}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`flex items-center gap-3 rounded-xl border-2 p-4 transition-all hover:shadow-lg hover:scale-105 ${module.color}`}
        onClick={onActivate}
      >
        <div className="text-3xl">{module.icon}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm">{module.name}</h3>
          <p className="text-xs text-slate-600">{module.description}</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">
            AI
          </span>
          <span className="text-xs text-slate-500">→</span>
        </div>
      </Link>

      {/* Tooltip with features */}
      {showTooltip && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-lg border border-slate-200 bg-white p-4 shadow-xl">
          <h4 className="mb-2 font-semibold text-sm">✨ Funksjoner:</h4>
          <ul className="space-y-1">
            {module.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs">
                <span className="text-green-500">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          {module.requiresPlan && module.requiresPlan !== "free" && (
            <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              <strong>📦 Krever {module.requiresPlan === "pro" ? "Pro" : "Enterprise"}-plan</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// AI Modules som kan brukes på forskjellige sider
export const aiModules: Record<string, AIModule> = {
  marketing: {
    id: "marketing",
    name: "Marketing AI",
    icon: "📣",
    description: "AI-drevet kampanjer og annonser",
    href: "/ai/marketing",
    color: "border-purple-200 bg-purple-50 hover:border-purple-400",
    features: [
      "Automatisk kampanjegenerering",
      "Google/Meta annonseoptimalisering",
      "Målgruppeanalyse",
      "A/B-testing med AI",
      "Budsjettoptimalisering",
    ],
    requiresPlan: "pro",
  },
  booking: {
    id: "booking",
    name: "Booking AI",
    icon: "📆",
    description: "Smart booking og timeplanlegging",
    href: "/ai/booking",
    color: "border-blue-200 bg-blue-50 hover:border-blue-400",
    features: [
      "Intelligent tidsluke-forslag",
      "Automatisk rebooking",
      "No-show prediksjon",
      "Optimal rutetid",
      "SMS-påminnelser med AI",
    ],
    requiresPlan: "pro",
  },
  crm: {
    id: "crm",
    name: "CRM AI",
    icon: "🎯",
    description: "Kundeanalyse og oppfølging",
    href: "/ai/crm",
    color: "border-green-200 bg-green-50 hover:border-green-400",
    features: [
      "Lead scoring",
      "Churn-prediksjon",
      "Personaliserte tilbud",
      "Automatisk segmentering",
      "Next best action",
    ],
    requiresPlan: "pro",
  },
  accounting: {
    id: "accounting",
    name: "Regnskap AI",
    icon: "💰",
    description: "Automatisk regnskapsførsel",
    href: "/ai/accounting",
    color: "border-yellow-200 bg-yellow-50 hover:border-yellow-400",
    features: [
      "Auto-kategorisering",
      "Fakturagenerering",
      "MVA-beregning",
      "Økonomiske prognoser",
      "Anomali-deteksjon",
    ],
    requiresPlan: "enterprise",
  },
  capacity: {
    id: "capacity",
    name: "Kapasitet AI",
    icon: "📊",
    description: "Optimalisering av ressurser",
    href: "/ai/capacity",
    color: "border-orange-200 bg-orange-50 hover:border-orange-400",
    features: [
      "Bemanningsoptimalisering",
      "Utstyrsplanlegging",
      "Etterspørselsprognose",
      "Flaskehals-analyse",
      "Workload balansering",
    ],
    requiresPlan: "pro",
  },
  content: {
    id: "content",
    name: "Innhold AI",
    icon: "✍️",
    description: "AI-generert innhold",
    href: "/ai/content",
    color: "border-pink-200 bg-pink-50 hover:border-pink-400",
    features: [
      "Automatiske produktbeskrivelser",
      "SEO-optimalisering",
      "Sosiale medier-innlegg",
      "E-post kampanjer",
      "Bloggartikler",
    ],
    requiresPlan: "pro",
  },
  lyxba: {
    id: "lyxba",
    name: "LYXba Booking Agent",
    icon: "🤖",
    description: "AI som booker for deg 24/7",
    href: "/ai-agent",
    color: "border-indigo-200 bg-indigo-50 hover:border-indigo-400",
    features: [
      "24/7 telefon & SMS-behandling",
      "Automatisk booking",
      "Multilingual support",
      "Lead nurturing",
      "Selvlærende AI per bedrift",
    ],
    requiresPlan: "enterprise",
  },
};

type AIIntegrationPanelProps = {
  /** Which context to show relevant AI modules for */
  context?: "booking" | "marketing" | "crm" | "accounting" | "capacity" | "all";
  /** Custom title */
  title?: string;
  /** Show as compact cards or full grid */
  compact?: boolean;
};

export function AIIntegrationPanel({ 
  context = "all", 
  title = "🤖 Aktiver AI-assistanse",
  compact = false 
}: AIIntegrationPanelProps) {
  // Filter modules based on context
  const getRelevantModules = () => {
    if (context === "all") {
      return Object.values(aiModules);
    }
    
    const contextMap: Record<string, string[]> = {
      booking: ["booking", "lyxba", "capacity", "crm"],
      marketing: ["marketing", "content", "crm"],
      crm: ["crm", "marketing", "booking"],
      accounting: ["accounting", "capacity"],
      capacity: ["capacity", "booking", "accounting"],
    };
    
    return contextMap[context]?.map(id => aiModules[id]).filter(Boolean) || [];
  };

  const modules = getRelevantModules();

  if (compact) {
    return (
      <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-sm">
          <span className="text-lg">🤖</span>
          {title}
        </h3>
        <div className="flex flex-wrap gap-2">
          {modules.map((module) => (
            <Link
              key={module.id}
              href={module.href}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium shadow-sm transition-all hover:shadow-md hover:scale-105"
            >
              <span className="text-lg">{module.icon}</span>
              <span>{module.name}</span>
              <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">
                AI
              </span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-3 text-xl font-bold">
          <span className="text-2xl">🤖</span>
          {title}
        </h2>
        <Link
          href="/ai"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Se alle AI-moduler →
        </Link>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <AIIntegrationButton key={module.id} module={module} context={context} />
        ))}
      </div>

      <div className="mt-6 rounded-lg bg-white/80 p-4 text-sm text-slate-700">
        <p>
          💡 <strong>Tips:</strong> AI-modulene lærer seg din bedrift over tid og blir stadig mer presise. 
          Start med én modul og utvid etter hvert som du ser verdien.
        </p>
      </div>
    </div>
  );
}
