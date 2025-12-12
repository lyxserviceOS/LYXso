"use client";

import React, { useState, useEffect } from "react";
import { Check, X, ChevronRight, SkipForward, Sparkles } from "lucide-react";
import Link from "next/link";

interface ModuleConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  requiredFields: {
    key: string;
    label: string;
    type: "text" | "email" | "tel" | "textarea" | "select";
    placeholder?: string;
    options?: string[];
  }[];
  category: "essential" | "optional";
}

const MODULES: ModuleConfig[] = [
  {
    id: "booking",
    name: "Booking System",
    description: "Sett opp bookingsystemet ditt for å ta imot bestillinger",
    icon: (props: any) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    requiredFields: [
      { key: "businessHours", label: "Åpningstider", type: "text", placeholder: "09:00-17:00" },
      { key: "bookingDuration", label: "Standard varighet (min)", type: "text", placeholder: "30" },
      { key: "bufferTime", label: "Buffer mellom bookinger (min)", type: "text", placeholder: "15" },
    ],
    category: "essential",
  },
  {
    id: "company",
    name: "Bedriftsinformasjon",
    description: "Grunnleggende informasjon om bedriften din",
    icon: (props: any) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    requiredFields: [
      { key: "companyName", label: "Bedriftsnavn", type: "text", placeholder: "Min Bedrift AS" },
      { key: "orgNumber", label: "Org.nummer", type: "text", placeholder: "123456789" },
      { key: "phone", label: "Telefon", type: "tel", placeholder: "+47 123 45 678" },
      { key: "email", label: "E-post", type: "email", placeholder: "kontakt@minbedrift.no" },
      { key: "address", label: "Adresse", type: "text", placeholder: "Gateveien 1, 0010 Oslo" },
    ],
    category: "essential",
  },
  {
    id: "services",
    name: "Tjenester",
    description: "Legg til tjenestene du tilbyr",
    icon: (props: any) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    requiredFields: [
      { key: "serviceName", label: "Tjenestenavn", type: "text", placeholder: "Dekskifte" },
      { key: "servicePrice", label: "Pris (kr)", type: "text", placeholder: "500" },
      { key: "serviceDuration", label: "Varighet (min)", type: "text", placeholder: "30" },
      { key: "serviceDescription", label: "Beskrivelse", type: "textarea", placeholder: "Skifte av dekk inkl. balansering" },
    ],
    category: "essential",
  },
  {
    id: "employees",
    name: "Ansatte",
    description: "Legg til ansatte som skal kunne ta bookinger",
    icon: (props: any) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    requiredFields: [
      { key: "employeeName", label: "Navn", type: "text", placeholder: "Ola Nordmann" },
      { key: "employeeEmail", label: "E-post", type: "email", placeholder: "ola@minbedrift.no" },
      { key: "employeeRole", label: "Rolle", type: "select", options: ["Mekaniker", "Resepsjon", "Leder", "Annen"] },
    ],
    category: "essential",
  },
  {
    id: "ai-booking",
    name: "AI Booking Assistent",
    description: "La AI-en optimalisere bookingene dine",
    icon: Sparkles,
    requiredFields: [
      { key: "aiBookingEnabled", label: "Aktiver AI Booking", type: "select", options: ["Ja", "Nei"] },
      { key: "aiBookingLanguage", label: "Språk", type: "select", options: ["Norsk", "Engelsk", "Svensk"] },
    ],
    category: "optional",
  },
  {
    id: "marketing",
    name: "Markedsføring",
    description: "Sett opp dine markedsføringskanaler",
    icon: (props: any) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
    requiredFields: [
      { key: "facebookUrl", label: "Facebook Side", type: "text", placeholder: "https://facebook.com/..." },
      { key: "instagramUrl", label: "Instagram", type: "text", placeholder: "@minbedrift" },
      { key: "website", label: "Nettside", type: "text", placeholder: "https://minbedrift.no" },
    ],
    category: "optional",
  },
  {
    id: "dekkhotell",
    name: "Dekkhotell",
    description: "Sett opp dekkhotell-funksjonen",
    icon: (props: any) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    requiredFields: [
      { key: "tireHotelEnabled", label: "Aktiver Dekkhotell", type: "select", options: ["Ja", "Nei"] },
      { key: "tireHotelCapacity", label: "Kapasitet (antall sett)", type: "text", placeholder: "100" },
      { key: "tireHotelPrice", label: "Pris per sesong (kr)", type: "text", placeholder: "500" },
    ],
    category: "optional",
  },
  {
    id: "payment",
    name: "Betalingsmetoder",
    description: "Koble til betalingsleverandører",
    icon: (props: any) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    requiredFields: [
      { key: "vippsEnabled", label: "Vipps", type: "select", options: ["Ja", "Nei"] },
      { key: "stripeEnabled", label: "Stripe/Kort", type: "select", options: ["Ja", "Nei"] },
      { key: "invoiceEnabled", label: "Faktura", type: "select", options: ["Ja", "Nei"] },
    ],
    category: "optional",
  },
];

export function SetupWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [skippedModules, setSkippedModules] = useState<string[]>([]);
  const [formData, setFormData] = useState<Record<string, Record<string, string>>>({});
  const [isVisible, setIsVisible] = useState(true);

  const essentialModules = MODULES.filter((m) => m.category === "essential");
  const optionalModules = MODULES.filter((m) => m.category === "optional");
  const currentModule = MODULES[currentStep];
  const totalSteps = MODULES.length;
  const progress = ((completedModules.length + skippedModules.length) / totalSteps) * 100;

  // Auto-save til localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lyxso_setup_progress", JSON.stringify({
        completedModules,
        skippedModules,
        formData,
        currentStep,
      }));
    }
  }, [completedModules, skippedModules, formData, currentStep]);

  // Last inn fra localStorage ved mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lyxso_setup_progress");
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setCompletedModules(data.completedModules || []);
          setSkippedModules(data.skippedModules || []);
          setFormData(data.formData || {});
          setCurrentStep(data.currentStep || 0);
        } catch (e) {
          console.error("Failed to load setup progress", e);
        }
      }
    }
  }, []);

  const handleFieldChange = (moduleId: string, fieldKey: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [moduleId]: {
        ...(prev[moduleId] || {}),
        [fieldKey]: value,
      },
    }));
  };

  const handleComplete = () => {
    if (!completedModules.includes(currentModule.id)) {
      setCompletedModules([...completedModules, currentModule.id]);
    }
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    if (!skippedModules.includes(currentModule.id)) {
      setSkippedModules([...skippedModules, currentModule.id]);
    }
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleDismiss = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lyxso_setup_dismissed", "true");
    }
    setIsVisible(false);
  };

  const isModuleComplete = (moduleId: string) => completedModules.includes(moduleId);
  const isModuleSkipped = (moduleId: string) => skippedModules.includes(moduleId);

  if (!isVisible) return null;

  const Icon = currentModule.icon;

  return (
    <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-800/90 p-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-50">
              Kom i gang med LYXso
            </h2>
          </div>
          <p className="text-sm text-slate-400">
            La oss sette opp de viktigste modulene for din bedrift
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Fremgang</span>
          <span>{Math.round(progress)}% fullført</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current Module */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 mb-4">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-slate-50">
                {currentModule.name}
              </h3>
              {currentModule.category === "essential" && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                  Viktig
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400">
              {currentModule.description}
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-3">
          {currentModule.requiredFields.map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  placeholder={field.placeholder}
                  rows={3}
                  value={formData[currentModule.id]?.[field.key] || ""}
                  onChange={(e) => handleFieldChange(currentModule.id, field.key, e.target.value)}
                />
              ) : field.type === "select" ? (
                <select
                  className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  value={formData[currentModule.id]?.[field.key] || ""}
                  onChange={(e) => handleFieldChange(currentModule.id, field.key, e.target.value)}
                >
                  <option value="">Velg...</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  placeholder={field.placeholder}
                  value={formData[currentModule.id]?.[field.key] || ""}
                  onChange={(e) => handleFieldChange(currentModule.id, field.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={handleComplete}
            className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Fullfør
          </button>
          <button
            onClick={handleSkip}
            className="px-4 py-2.5 rounded-lg bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700 transition-colors flex items-center gap-2"
          >
            <SkipForward className="w-4 h-4" />
            Hopp over
          </button>
        </div>
      </div>

      {/* Module Overview */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Viktige moduler
          </p>
          <div className="space-y-1.5">
            {essentialModules.map((module) => (
              <div
                key={module.id}
                className={`flex items-center gap-2 text-xs px-2 py-1.5 rounded ${
                  isModuleComplete(module.id)
                    ? "bg-emerald-500/10 text-emerald-400"
                    : isModuleSkipped(module.id)
                    ? "bg-slate-800/40 text-slate-500"
                    : "bg-slate-800/60 text-slate-300"
                }`}
              >
                {isModuleComplete(module.id) ? (
                  <Check className="w-3.5 h-3.5" />
                ) : isModuleSkipped(module.id) ? (
                  <SkipForward className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
                <span className="truncate">{module.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Ekstra moduler
          </p>
          <div className="space-y-1.5">
            {optionalModules.map((module) => (
              <div
                key={module.id}
                className={`flex items-center gap-2 text-xs px-2 py-1.5 rounded ${
                  isModuleComplete(module.id)
                    ? "bg-emerald-500/10 text-emerald-400"
                    : isModuleSkipped(module.id)
                    ? "bg-slate-800/40 text-slate-500"
                    : "bg-slate-800/60 text-slate-300"
                }`}
              >
                {isModuleComplete(module.id) ? (
                  <Check className="w-3.5 h-3.5" />
                ) : isModuleSkipped(module.id) ? (
                  <SkipForward className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
                <span className="truncate">{module.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      {progress === 100 && (
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <Check className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-400 mb-1">
                Gratulerer! Du er klar til å starte 🎉
              </p>
              <p className="text-xs text-slate-400 mb-3">
                Du har fullført all oppsett. Utforsk dashboardet og begynn å bruke LYXso.
              </p>
              <Link
                href="/ai"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/30 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Utforsk AI-moduler
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
