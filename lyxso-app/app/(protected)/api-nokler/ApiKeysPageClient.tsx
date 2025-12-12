"use client";

import React, { useState } from "react";
import { useOrgPlan } from "@/components/OrgPlanContext";

type TabKey = "oversikt" | "openai" | "kommunikasjon" | "betaling" | "regnskap" | "markedsforing" | "annet";

interface ApiKey {
  id: string;
  service: string;
  key_name: string;
  key_value_masked: string;
  is_active: boolean;
  last_used?: string;
  created_at: string;
}

const API_SERVICES = {
  openai: {
    name: "OpenAI",
    description: "GPT-4, GPT-4 Vision, DALL-E",
    keys: ["OPENAI_API_KEY", "OPENAI_BASE_URL"],
    docs: "https://platform.openai.com/api-keys",
    icon: "🤖",
  },
  sendgrid: {
    name: "SendGrid",
    description: "E-post sending",
    keys: ["SENDGRID_API_KEY", "SENDGRID_FROM_EMAIL", "SENDGRID_FROM_NAME"],
    docs: "https://app.sendgrid.com/settings/api_keys",
    icon: "📧",
  },
  twilio: {
    name: "Twilio",
    description: "SMS sending",
    keys: ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_PHONE_NUMBER"],
    docs: "https://console.twilio.com",
    icon: "📱",
  },
  meta: {
    name: "Meta (Facebook/Instagram)",
    description: "Facebook & Instagram Ads",
    keys: ["META_APP_ID", "META_APP_SECRET", "META_REDIRECT_URI"],
    docs: "https://developers.facebook.com",
    icon: "📘",
  },
  google: {
    name: "Google",
    description: "Analytics & reCAPTCHA",
    keys: ["NEXT_PUBLIC_GA_ID", "NEXT_PUBLIC_RECAPTCHA_SITE_KEY", "RECAPTCHA_SECRET_KEY"],
    docs: "https://console.cloud.google.com",
    icon: "🔍",
  },
  stripe: {
    name: "Stripe",
    description: "Online betalinger",
    keys: ["STRIPE_SECRET_KEY", "STRIPE_PUBLISHABLE_KEY", "STRIPE_WEBHOOK_SECRET"],
    docs: "https://dashboard.stripe.com/apikeys",
    icon: "💳",
  },
  vipps: {
    name: "Vipps",
    description: "Norsk mobilbetaling",
    keys: ["VIPPS_CLIENT_ID", "VIPPS_CLIENT_SECRET", "VIPPS_SUBSCRIPTION_KEY"],
    docs: "https://portal.vipps.no",
    icon: "📲",
  },
  fiken: {
    name: "Fiken",
    description: "Regnskapssystem",
    keys: ["FIKEN_API_KEY", "FIKEN_COMPANY_SLUG"],
    docs: "https://fiken.no/api",
    icon: "📊",
  },
  sentry: {
    name: "Sentry",
    description: "Error tracking",
    keys: ["SENTRY_DSN", "SENTRY_AUTH_TOKEN"],
    docs: "https://sentry.io/settings/account/api/auth-tokens/",
    icon: "🐛",
  },
};

export default function ApiKeysPageClient() {
  const { org, loading } = useOrgPlan();
  const [activeTab, setActiveTab] = useState<TabKey>("oversikt");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-slate-400">Laster API-nøkler...</p>
      </div>
    );
  }

  const tabs = [
    { key: "oversikt", label: "Oversikt" },
    { key: "openai", label: "AI (OpenAI)" },
    { key: "kommunikasjon", label: "E-post & SMS" },
    { key: "betaling", label: "Betaling" },
    { key: "regnskap", label: "Regnskap" },
    { key: "markedsforing", label: "Markedsføring" },
    { key: "annet", label: "Annet" },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-lg font-semibold text-slate-100">API-nøkler</h1>
        <p className="text-sm text-slate-400">
          Administrer API-nøkler for tredjepartstjenester
        </p>
      </header>

      {/* Info banner */}
      <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🔐</span>
          <div>
            <p className="text-sm font-medium text-blue-200">Sikker lagring</p>
            <p className="mt-1 text-xs text-blue-300/80">
              Alle API-nøkler krypteres før lagring i databasen. Kun de siste 4 tegnene vises.
              Nøklene er kun tilgjengelige for din organisasjon.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 rounded-lg bg-slate-800 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as TabKey)}
            className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition ${
              activeTab === tab.key
                ? "bg-slate-700 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Oversikt Tab */}
      {activeTab === "oversikt" && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(API_SERVICES).map(([key, service]) => (
              <ServiceCard
                key={key}
                service={service}
                onConfigure={() => {
                  setSelectedService(key);
                  setShowAddModal(true);
                }}
              />
            ))}
          </div>

          {/* Quick setup guide */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <h2 className="text-sm font-semibold text-slate-100 mb-3">
              ⚡ Rask oppsett
            </h2>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <span className="text-green-400">1.</span>
                <div>
                  <span className="text-slate-300 font-medium">OpenAI:</span> Påkrevd for alle AI-funksjoner.
                  Få nøkkel på <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener" className="text-blue-400 hover:underline">platform.openai.com</a>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400">2.</span>
                <div>
                  <span className="text-slate-300 font-medium">SendGrid + Twilio:</span> Påkrevd for notifikasjoner (e-post & SMS).
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400">3.</span>
                <div>
                  <span className="text-slate-300 font-medium">Valgfritt:</span> Stripe/Vipps for betaling, Fiken for regnskap, Meta for markedsføring.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other tabs - show filtered services */}
      {activeTab !== "oversikt" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-100">
              {tabs.find(t => t.key === activeTab)?.label}
            </h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
            >
              + Legg til nøkkel
            </button>
          </div>

          {/* Service cards for this category */}
          <div className="grid gap-4 sm:grid-cols-2">
            {getServicesForTab(activeTab).map(([key, service]) => (
              <ServiceCard
                key={key}
                service={service}
                onConfigure={() => {
                  setSelectedService(key);
                  setShowAddModal(true);
                }}
                detailed
              />
            ))}
          </div>

          {getServicesForTab(activeTab).length === 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-8 text-center">
              <p className="text-sm text-slate-400">
                Ingen tjenester i denne kategorien ennå
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal - placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-950 p-6">
            <h3 className="text-lg font-semibold text-slate-100">
              {selectedService ? `Konfigurer ${API_SERVICES[selectedService as keyof typeof API_SERVICES]?.name}` : "Legg til API-nøkkel"}
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Funksjonalitet kommer snart. Foreløpig må nøkler legges til via miljøvariabler (.env).
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedService(null);
                }}
                className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
              >
                Lukk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ServiceCard({
  service,
  onConfigure,
  detailed,
}: {
  service: typeof API_SERVICES[keyof typeof API_SERVICES];
  onConfigure: () => void;
  detailed?: boolean;
}) {
  const isConfigured = false; // TODO: Check if keys exist

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{service.icon}</span>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">{service.name}</h3>
            <p className="text-xs text-slate-400">{service.description}</p>
          </div>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
            isConfigured
              ? "bg-green-500/10 text-green-400"
              : "bg-slate-700 text-slate-400"
          }`}
        >
          {isConfigured ? "Aktiv" : "Ikke konfigurert"}
        </span>
      </div>

      {detailed && (
        <div className="mt-3 space-y-2">
          <p className="text-[10px] font-medium text-slate-500 uppercase">Nøkler:</p>
          {service.keys.map((key) => (
            <div key={key} className="flex items-center justify-between rounded-md bg-slate-900/50 px-2 py-1.5">
              <span className="text-xs text-slate-300 font-mono">{key}</span>
              <span className="text-xs text-slate-500">****</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={onConfigure}
          className="flex-1 rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800"
        >
          Konfigurer
        </button>
        <a
          href={service.docs}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800"
        >
          📖 Docs
        </a>
      </div>
    </div>
  );
}

function getServicesForTab(tab: TabKey): [string, typeof API_SERVICES[keyof typeof API_SERVICES]][] {
  const services = Object.entries(API_SERVICES);
  
  switch (tab) {
    case "openai":
      return services.filter(([key]) => key === "openai");
    case "kommunikasjon":
      return services.filter(([key]) => ["sendgrid", "twilio"].includes(key));
    case "betaling":
      return services.filter(([key]) => ["stripe", "vipps"].includes(key));
    case "regnskap":
      return services.filter(([key]) => key === "fiken");
    case "markedsforing":
      return services.filter(([key]) => ["meta", "google"].includes(key));
    case "annet":
      return services.filter(([key]) => key === "sentry");
    default:
      return [];
  }
}
