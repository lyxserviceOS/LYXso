// app/(protected)/integrasjoner/IntegrationsPageClient.tsx
"use client";

import React, { useState } from "react";
import type {
  Integration,
  IntegrationType,
  IntegrationProvider,
  IntegrationStatus,
} from "@/types/integration";

const INTEGRATIONS_CATALOG: {
  type: IntegrationType;
  type_label: string;
  providers: {
    provider: IntegrationProvider;
    name: string;
    description: string;
    logo?: string;
    coming_soon?: boolean;
  }[];
}[] = [
  {
    type: "accounting",
    type_label: "Regnskap",
    providers: [
      {
        provider: "fiken",
        name: "Fiken",
        description: "Perfekt for små og mellomstore bedrifter. Send bilag og fakturaer direkte.",
      },
      {
        provider: "poweroffice",
        name: "PowerOffice Go",
        description: "Avansert regnskapsflyt for byråer og større bedrifter.",
      },
    ],
  },
  {
    type: "payment_terminal",
    type_label: "Betalingsterminaler",
    providers: [
      {
        provider: "izettle",
        name: "Zettle (iZettle)",
        description: "Populær terminal for kortbetaling i butikk. Automatisk avstemming.",
      },
      {
        provider: "sumup",
        name: "SumUp",
        description: "Enkel og rimelig terminal for små virksomheter.",
      },
      {
        provider: "nets",
        name: "Nets",
        description: "Tradisjonell betalingsløsning med bred støtte.",
        coming_soon: true,
      },
    ],
  },
  {
    type: "payment_online",
    type_label: "Online betaling",
    providers: [
      {
        provider: "vipps",
        name: "Vipps",
        description: "Norges mest brukte betalingsapp. Perfekt for booking og forskudd.",
      },
      {
        provider: "stripe",
        name: "Stripe",
        description: "Internasjonal betalingsløsning med avanserte funksjoner.",
        coming_soon: true,
      },
    ],
  },
  {
    type: "sms",
    type_label: "SMS",
    providers: [
      {
        provider: "sveve",
        name: "Sveve",
        description: "Norsk SMS-gateway med god pris og API.",
      },
      {
        provider: "twilio",
        name: "Twilio",
        description: "Internasjonal SMS- og kommunikasjonsplattform.",
      },
    ],
  },
  {
    type: "email",
    type_label: "E-post",
    providers: [
      {
        provider: "sendgrid",
        name: "SendGrid",
        description: "Populær e-postplattform med gode leveringsrater.",
      },
      {
        provider: "mailjet",
        name: "Mailjet",
        description: "Europeisk e-postplattform med fokus på GDPR.",
      },
    ],
  },
];

// Mock connected integrations
const MOCK_INTEGRATIONS: Integration[] = [
  {
    id: "int-1",
    org_id: "demo",
    type: "accounting",
    provider: "fiken",
    status: "connected",
    credentials: null,
    settings: {
      fiken_company_slug: "lyxbil-oslo",
      fiken_default_account: "3000",
      fiken_vat_type: "HIGH",
    },
    last_sync_at: "2024-11-27T10:00:00Z",
    last_sync_status: "success",
    last_sync_error: null,
    is_active: true,
    auto_sync_enabled: true,
    sync_interval_minutes: 60,
    connected_at: "2024-10-15T12:00:00Z",
    created_at: "2024-10-15T12:00:00Z",
    updated_at: "2024-11-27T10:00:00Z",
  },
  {
    id: "int-2",
    org_id: "demo",
    type: "sms",
    provider: "sveve",
    status: "connected",
    credentials: null,
    settings: {
      sms_sender_name: "LYXBil",
      sms_country_code: "+47",
    },
    last_sync_at: null,
    last_sync_status: null,
    last_sync_error: null,
    is_active: true,
    auto_sync_enabled: false,
    sync_interval_minutes: null,
    connected_at: "2024-11-01T09:00:00Z",
    created_at: "2024-11-01T09:00:00Z",
    updated_at: "2024-11-01T09:00:00Z",
  },
];

const getStatusColor = (status: IntegrationStatus): string => {
  switch (status) {
    case "connected": return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "connecting": return "bg-amber-100 text-amber-700 border-amber-200";
    case "error": return "bg-red-100 text-red-700 border-red-200";
    case "disconnected": return "bg-slate-100 text-slate-700 border-slate-200";
    default: return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

const getStatusLabel = (status: IntegrationStatus): string => {
  switch (status) {
    case "connected": return "Tilkoblet";
    case "connecting": return "Kobler til...";
    case "error": return "Feil";
    case "disconnected": return "Frakoblet";
    default: return "Ikke tilkoblet";
  }
};

export default function IntegrationsPageClient() {
  const [integrations, setIntegrations] = useState<Integration[]>(MOCK_INTEGRATIONS);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<{
    type: IntegrationType;
    provider: IntegrationProvider;
    name: string;
  } | null>(null);
  const [connecting, setConnecting] = useState(false);

  const getIntegration = (provider: IntegrationProvider): Integration | undefined => {
    return integrations.find(i => i.provider === provider);
  };

  const handleConnect = (type: IntegrationType, provider: IntegrationProvider, name: string) => {
    setSelectedProvider({ type, provider, name });
    setShowConnectModal(true);
  };

  const handleConfirmConnect = () => {
    if (!selectedProvider) return;
    
    setConnecting(true);
    // Simulate connection
    setTimeout(() => {
      const newIntegration: Integration = {
        id: `int-${Date.now()}`,
        org_id: "demo",
        type: selectedProvider.type,
        provider: selectedProvider.provider,
        status: "connected",
        credentials: null,
        settings: {},
        last_sync_at: null,
        last_sync_status: null,
        last_sync_error: null,
        is_active: true,
        auto_sync_enabled: false,
        sync_interval_minutes: null,
        connected_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setIntegrations(prev => [...prev, newIntegration]);
      setConnecting(false);
      setShowConnectModal(false);
      setSelectedProvider(null);
    }, 1500);
  };

  const handleDisconnect = (integrationId: string) => {
    setIntegrations(prev => prev.filter(i => i.id !== integrationId));
  };

  const connectedCount = integrations.filter(i => i.status === "connected").length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">Integrasjoner</h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Koble LYXso til regnskapssystem, betalingsløsninger og kommunikasjonsverktøy.
          Alle integrasjoner er bygget for å spare tid og redusere manuelt arbeid.
        </p>
      </header>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Aktive integrasjoner</p>
          <p className="text-2xl font-bold text-emerald-600">{connectedCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Tilgjengelige</p>
          <p className="text-2xl font-bold text-slate-900">
            {INTEGRATIONS_CATALOG.reduce((sum, cat) => sum + cat.providers.filter(p => !p.coming_soon).length, 0)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Kommer snart</p>
          <p className="text-2xl font-bold text-slate-400">
            {INTEGRATIONS_CATALOG.reduce((sum, cat) => sum + cat.providers.filter(p => p.coming_soon).length, 0)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Siste synk</p>
          <p className="text-lg font-semibold text-slate-900">
            {integrations[0]?.last_sync_at 
              ? new Date(integrations[0].last_sync_at).toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" })
              : "—"}
          </p>
        </div>
      </div>

      {/* Active Integrations */}
      {integrations.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">Aktive integrasjoner</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {integrations.map((integration) => (
              <div key={integration.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-600">
                    {integration.provider.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 capitalize">{integration.provider}</p>
                    <p className="text-xs text-slate-500 capitalize">{integration.type.replace("_", " ")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${getStatusColor(integration.status)}`}>
                    {getStatusLabel(integration.status)}
                  </span>
                  {integration.last_sync_at && (
                    <span className="text-xs text-slate-400">
                      Synket {new Date(integration.last_sync_at).toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDisconnect(integration.id)}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    Koble fra
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Available Integrations */}
      <div className="space-y-6">
        {INTEGRATIONS_CATALOG.map((category) => (
          <section key={category.type} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">{category.type_label}</h2>
            </div>
            <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
              {category.providers.map((provider) => {
                const existing = getIntegration(provider.provider);
                const isConnected = existing?.status === "connected";
                
                return (
                  <div
                    key={provider.provider}
                    className={`rounded-lg border p-4 ${
                      isConnected 
                        ? "border-emerald-200 bg-emerald-50" 
                        : provider.coming_soon
                        ? "border-slate-200 bg-slate-50 opacity-60"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-600">
                          {provider.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{provider.name}</p>
                          {provider.coming_soon && (
                            <span className="text-[10px] text-slate-400">Kommer snart</span>
                          )}
                        </div>
                      </div>
                      {isConnected && (
                        <span className="text-xs text-emerald-600">✓ Tilkoblet</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mb-3">{provider.description}</p>
                    {!provider.coming_soon && (
                      <button
                        type="button"
                        onClick={() => !isConnected && handleConnect(category.type, provider.provider, provider.name)}
                        disabled={isConnected}
                        className={`w-full rounded-lg px-3 py-2 text-xs font-medium transition ${
                          isConnected
                            ? "bg-emerald-100 text-emerald-700 cursor-default"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {isConnected ? "Tilkoblet" : "Koble til"}
                      </button>
                    )}
                    {provider.coming_soon && (
                      <button
                        type="button"
                        disabled
                        className="w-full rounded-lg bg-slate-200 px-3 py-2 text-xs font-medium text-slate-400 cursor-not-allowed"
                      >
                        Kommer snart
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Info Section */}
      <section className="rounded-xl border border-blue-200 bg-blue-50 p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Hvordan integrasjoner fungerer</h3>
        <div className="grid gap-4 md:grid-cols-3 text-sm text-blue-800">
          <div>
            <p className="font-medium mb-1">1. Koble til</p>
            <p className="text-xs">Klikk &quot;Koble til&quot; og logg inn hos leverandøren. LYXso ber kun om nødvendige tilganger.</p>
          </div>
          <div>
            <p className="font-medium mb-1">2. Automatisk synk</p>
            <p className="text-xs">Data synkroniseres automatisk basert på dine innstillinger. Du slipper manuell overføring.</p>
          </div>
          <div>
            <p className="font-medium mb-1">3. Full kontroll</p>
            <p className="text-xs">Du kan når som helst koble fra en integrasjon. Data i LYXso påvirkes ikke.</p>
          </div>
        </div>
      </section>

      {/* Connect Modal */}
      {showConnectModal && selectedProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-semibold">Koble til {selectedProvider.name}</h2>
              <button
                type="button"
                onClick={() => {
                  setShowConnectModal(false);
                  setSelectedProvider(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600">
                Du vil bli sendt til {selectedProvider.name} for å logge inn og godkjenne tilkoblingen.
                LYXso vil kun be om tilganger som er nødvendige for integrasjonen.
              </p>
              
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-700 mb-2">LYXso vil kunne:</p>
                <ul className="text-xs text-slate-600 space-y-1">
                  {selectedProvider.type === "accounting" && (
                    <>
                      <li>• Opprette og lese fakturaer</li>
                      <li>• Opprette bilag og transaksjoner</li>
                      <li>• Lese kundedata</li>
                    </>
                  )}
                  {selectedProvider.type === "payment_terminal" && (
                    <>
                      <li>• Lese transaksjonsdata</li>
                      <li>• Hente dagsoppgjør</li>
                    </>
                  )}
                  {selectedProvider.type === "sms" && (
                    <>
                      <li>• Sende SMS på vegne av din bedrift</li>
                      <li>• Lese leveringsrapporter</li>
                    </>
                  )}
                  {selectedProvider.type === "email" && (
                    <>
                      <li>• Sende e-post på vegne av din bedrift</li>
                      <li>• Lese åpnings- og klikkstatistikk</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowConnectModal(false);
                    setSelectedProvider(null);
                  }}
                  className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Avbryt
                </button>
                <button
                  type="button"
                  onClick={handleConfirmConnect}
                  disabled={connecting}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {connecting ? "Kobler til..." : `Koble til ${selectedProvider.name}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
