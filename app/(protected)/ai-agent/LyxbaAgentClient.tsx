// app/(protected)/ai-agent/LyxbaAgentClient.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useOrgPlan } from "@/lib/useOrgPlan";
import {
  getOrgPlanLabel,
  getOrgPlanShortInfo,
} from "@/lib/orgPlan";
import type { 
  AIConversation, 
  AIAgentKPIs, 
  AIAgentConfig,
  AIConversationChannel 
} from "@/types/ai";

// Mock configuration
const MOCK_CONFIG: AIAgentConfig = {
  id: "config-1",
  org_id: "demo",
  is_enabled: true,
  name: "LYXba",
  greeting_message: "Hei! Jeg er LYXba, din personlige bookingassistent. Hvordan kan jeg hjelpe deg i dag?",
  enabled_channels: ["sms", "chat", "landing_page"],
  operating_hours: {
    monday: { start: "08:00", end: "18:00" },
    tuesday: { start: "08:00", end: "18:00" },
    wednesday: { start: "08:00", end: "18:00" },
    thursday: { start: "08:00", end: "18:00" },
    friday: { start: "08:00", end: "17:00" },
  },
  timezone: "Europe/Oslo",
  max_contact_attempts: 3,
  response_delay_seconds: 5,
  allowed_service_ids: ["service-1", "service-2", "service-3"],
  tone: "friendly",
  language: "no",
  created_at: "2024-01-01",
  updated_at: "2024-11-20",
};

// Mock conversations
const MOCK_CONVERSATIONS: AIConversation[] = [
  {
    id: "conv-1",
    org_id: "demo",
    customer_id: "cust-1",
    lead_id: "lead-1",
    channel: "sms",
    status: "completed",
    contact_phone: "+47 912 34 567",
    contact_email: null,
    contact_name: "Ola Nordmann",
    intent: "booking",
    service_interest: "Keramisk coating",
    preferred_date: "2024-12-05",
    preferred_time: "10:00",
    booking_id: "booking-123",
    outcome: "booked",
    started_at: "2024-11-25T14:30:00Z",
    last_message_at: "2024-11-25T14:45:00Z",
    completed_at: "2024-11-25T14:45:00Z",
    created_at: "2024-11-25T14:30:00Z",
    updated_at: "2024-11-25T14:45:00Z",
  },
  {
    id: "conv-2",
    org_id: "demo",
    customer_id: null,
    lead_id: "lead-2",
    channel: "landing_page",
    status: "active",
    contact_phone: "+47 987 65 432",
    contact_email: "kari@example.com",
    contact_name: "Kari Hansen",
    intent: "inquiry",
    service_interest: "Dekkskift",
    preferred_date: null,
    preferred_time: null,
    booking_id: null,
    outcome: null,
    started_at: "2024-11-27T09:15:00Z",
    last_message_at: "2024-11-27T09:20:00Z",
    completed_at: null,
    created_at: "2024-11-27T09:15:00Z",
    updated_at: "2024-11-27T09:20:00Z",
  },
  {
    id: "conv-3",
    org_id: "demo",
    customer_id: "cust-2",
    lead_id: "lead-3",
    channel: "chat",
    status: "handed_off",
    contact_phone: "+47 456 78 901",
    contact_email: "erik@example.com",
    contact_name: "Erik Olsen",
    intent: "support",
    service_interest: null,
    preferred_date: null,
    preferred_time: null,
    booking_id: null,
    outcome: "handed_off",
    started_at: "2024-11-26T16:00:00Z",
    last_message_at: "2024-11-26T16:10:00Z",
    completed_at: "2024-11-26T16:10:00Z",
    created_at: "2024-11-26T16:00:00Z",
    updated_at: "2024-11-26T16:10:00Z",
  },
];

// Mock KPIs
const MOCK_KPIS: AIAgentKPIs = {
  org_id: "demo",
  period: "2024-11",
  total_conversations: 156,
  conversations_by_channel: {
    sms: 45,
    email: 12,
    chat: 68,
    phone: 5,
    landing_page: 26,
  },
  bookings_created: 89,
  leads_handled: 156,
  handed_off_count: 23,
  no_response_count: 18,
  booking_rate: 57.1,
  response_rate: 88.5,
  handoff_rate: 14.7,
  conversions_by_source: {
    "Facebook Ads": { leads: 45, bookings: 28, rate: 62.2 },
    "Google Ads": { leads: 38, bookings: 22, rate: 57.9 },
    "Organic": { leads: 42, bookings: 24, rate: 57.1 },
    "Referral": { leads: 18, bookings: 12, rate: 66.7 },
    "Landing Page": { leads: 13, bookings: 3, rate: 23.1 },
  },
  avg_response_time_seconds: 8,
  avg_conversation_duration_minutes: 4.5,
  created_at: "2024-11-01",
  updated_at: "2024-11-27",
};

const CHANNEL_LABELS: Record<AIConversationChannel, string> = {
  sms: "SMS",
  email: "E-post",
  chat: "Chat",
  phone: "Telefon",
  landing_page: "Landingsside",
};

const getStatusColor = (status: AIConversation["status"]) => {
  switch (status) {
    case "active": return "bg-emerald-100 text-emerald-700";
    case "waiting_response": return "bg-amber-100 text-amber-700";
    case "completed": return "bg-blue-100 text-blue-700";
    case "failed": return "bg-red-100 text-red-700";
    case "handed_off": return "bg-purple-100 text-purple-700";
    default: return "bg-slate-100 text-slate-700";
  }
};

const getStatusLabel = (status: AIConversation["status"]) => {
  switch (status) {
    case "active": return "Aktiv";
    case "waiting_response": return "Venter svar";
    case "completed": return "Fullført";
    case "failed": return "Feilet";
    case "handed_off": return "Overført";
    default: return status;
  }
};

const getOutcomeLabel = (outcome: AIConversation["outcome"]) => {
  switch (outcome) {
    case "booked": return "Booket";
    case "no_capacity": return "Ingen kapasitet";
    case "no_response": return "Ingen svar";
    case "declined": return "Avslått";
    case "handed_off": return "Overført til ansatt";
    default: return "—";
  }
};

export default function LyxbaAgentClient() {
  const { loading, error, plan, features } = useOrgPlan();
  const canUseAiAgent = features.aiMarketing;
  
  const [config, setConfig] = useState<AIAgentConfig>(MOCK_CONFIG);
  const [conversations] = useState<AIConversation[]>(MOCK_CONVERSATIONS);
  const [kpis] = useState<AIAgentKPIs>(MOCK_KPIS);
  const [selectedView, setSelectedView] = useState<"dashboard" | "conversations" | "settings">("dashboard");
  const [showTestModal, setShowTestModal] = useState(false);
  const [testMessage, setTestMessage] = useState("");
  const [testResponse, setTestResponse] = useState<string | null>(null);

  const handleToggleAgent = () => {
    setConfig(prev => ({ ...prev, is_enabled: !prev.is_enabled }));
  };

  const handleTestMessage = () => {
    // Simulate AI response
    setTestResponse("Tusen takk for din henvendelse! Jeg ser du er interessert i våre tjenester. Vi har ledig tid for keramisk coating neste uke. Passer tirsdag kl. 10:00?");
  };

  return (
    <div className="h-full w-full overflow-y-auto px-6 py-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              LYXba – AI Booking Agent
            </h1>
            <p className="text-sm text-slate-500">
              AI-agent som håndterer leads, meldinger og bookinger automatisk.
            </p>
          </div>
          
          {canUseAiAgent && (
            <div className="flex items-center gap-3">
              <span className={`text-sm font-medium ${config.is_enabled ? "text-emerald-600" : "text-slate-500"}`}>
                {config.is_enabled ? "Aktiv" : "Inaktiv"}
              </span>
              <button
                type="button"
                onClick={handleToggleAgent}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.is_enabled ? "bg-emerald-500" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.is_enabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          )}
        </header>

        {/* Plan Status */}
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          {loading && (
            <p className="text-sm text-slate-500">Henter plan og funksjoner …</p>
          )}

          {error && (
            <p className="text-sm text-red-500">Klarte ikke å hente org-plan: {error}</p>
          )}

          {!loading && !error && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                  Din LYXso-plan
                </p>
                <p className="text-base font-semibold text-slate-900">
                  {getOrgPlanLabel(plan)}
                </p>
                <p className="text-xs text-slate-500">
                  {getOrgPlanShortInfo(plan)}
                </p>
              </div>
              <div className="flex gap-2">
                {canUseAiAgent && (
                  <button
                    type="button"
                    onClick={() => setShowTestModal(true)}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Test AI-agenten
                  </button>
                )}
                <Link
                  href="/plan"
                  className="rounded-lg border border-blue-500 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
                >
                  Se / endre plan
                </Link>
              </div>
            </div>
          )}
        </section>

        {!loading && !error && canUseAiAgent && (
          <>
            {/* View Tabs */}
            <div className="flex gap-1 rounded-lg bg-slate-200 p-1">
              {[
                { key: "dashboard", label: "Dashboard" },
                { key: "conversations", label: "Samtaler" },
                { key: "settings", label: "Innstillinger" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedView(tab.key as typeof selectedView)}
                  className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
                    selectedView === tab.key
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Dashboard View */}
            {selectedView === "dashboard" && (
              <>
                {/* KPI Cards */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <KPICard
                    label="Totalt samtaler"
                    value={kpis.total_conversations.toString()}
                    subValue="Denne måneden"
                  />
                  <KPICard
                    label="Bookinger opprettet"
                    value={kpis.bookings_created.toString()}
                    subValue={`${kpis.booking_rate.toFixed(1)}% konvertering`}
                    valueColor="text-emerald-600"
                  />
                  <KPICard
                    label="Gj.snitt responstid"
                    value={`${kpis.avg_response_time_seconds}s`}
                    subValue="Under 10s er bra"
                  />
                  <KPICard
                    label="Overført til ansatt"
                    value={kpis.handed_off_count.toString()}
                    subValue={`${kpis.handoff_rate.toFixed(1)}% av samtaler`}
                  />
                </div>

                {/* Channel Distribution */}
                <section className="rounded-xl border border-slate-200 bg-white p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Samtaler per kanal</h2>
                  <div className="grid gap-3 md:grid-cols-5">
                    {(Object.entries(kpis.conversations_by_channel) as [AIConversationChannel, number][]).map(([channel, count]) => (
                      <div key={channel} className="rounded-lg bg-slate-50 p-4 text-center">
                        <p className="text-xs text-slate-500">{CHANNEL_LABELS[channel]}</p>
                        <p className="text-2xl font-bold text-slate-900">{count}</p>
                        <p className="text-xs text-slate-400">
                          {((count / kpis.total_conversations) * 100).toFixed(0)}%
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Campaign Performance */}
                <section className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                  <div className="border-b border-slate-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-slate-900">Konvertering per kilde</h2>
                    <p className="text-sm text-slate-500">Hvilke kampanjer AI konverterer best fra</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-3 text-left font-medium text-slate-600">Kilde</th>
                          <th className="px-6 py-3 text-right font-medium text-slate-600">Leads</th>
                          <th className="px-6 py-3 text-right font-medium text-slate-600">Bookinger</th>
                          <th className="px-6 py-3 text-right font-medium text-slate-600">Konv. rate</th>
                          <th className="px-6 py-3 text-left font-medium text-slate-600"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(kpis.conversions_by_source).map(([source, data]) => (
                          <tr key={source} className="border-t border-slate-100">
                            <td className="px-6 py-4 font-medium text-slate-900">{source}</td>
                            <td className="px-6 py-4 text-right text-slate-600">{data.leads}</td>
                            <td className="px-6 py-4 text-right text-slate-600">{data.bookings}</td>
                            <td className="px-6 py-4 text-right">
                              <span className={`font-medium ${
                                data.rate >= 50 ? "text-emerald-600" :
                                data.rate >= 30 ? "text-amber-600" :
                                "text-red-600"
                              }`}>
                                {data.rate.toFixed(1)}%
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="h-2 w-24 rounded-full bg-slate-100">
                                <div
                                  className="h-2 rounded-full bg-blue-500"
                                  style={{ width: `${data.rate}%` }}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            )}

            {/* Conversations View */}
            {selectedView === "conversations" && (
              <section className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                <div className="border-b border-slate-200 px-6 py-4">
                  <h2 className="text-lg font-semibold text-slate-900">Siste samtaler</h2>
                </div>
                <div className="divide-y divide-slate-100">
                  {conversations.map((conv) => (
                    <div key={conv.id} className="p-4 hover:bg-slate-50">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-slate-900">
                              {conv.contact_name || conv.contact_phone || conv.contact_email}
                            </span>
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(conv.status)}`}>
                              {getStatusLabel(conv.status)}
                            </span>
                            <span className="text-xs text-slate-400">
                              {CHANNEL_LABELS[conv.channel]}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                            {conv.service_interest && (
                              <span>Interesse: {conv.service_interest}</span>
                            )}
                            {conv.intent && (
                              <span>Hensikt: {conv.intent}</span>
                            )}
                            {conv.outcome && (
                              <span>Resultat: {getOutcomeLabel(conv.outcome)}</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right text-xs text-slate-400">
                          <p>{new Date(conv.started_at).toLocaleDateString("nb-NO")}</p>
                          <p>{new Date(conv.started_at).toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" })}</p>
                        </div>
                      </div>
                      {conv.booking_id && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs text-emerald-600">✓ Booking opprettet</span>
                          <Link
                            href={`/booking/${conv.booking_id}`}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Se booking →
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Settings View */}
            {selectedView === "settings" && (
              <div className="space-y-6">
                {/* Basic Settings */}
                <section className="rounded-xl border border-slate-200 bg-white p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Grunninnstillinger</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Agent-navn
                      </label>
                      <input
                        type="text"
                        value={config.name}
                        onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full max-w-md rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Velkomstmelding
                      </label>
                      <textarea
                        value={config.greeting_message}
                        onChange={(e) => setConfig(prev => ({ ...prev, greeting_message: e.target.value }))}
                        rows={3}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Tone
                      </label>
                      <select
                        value={config.tone}
                        onChange={(e) => setConfig(prev => ({ ...prev, tone: e.target.value as AIAgentConfig["tone"] }))}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      >
                        <option value="formal">Formell</option>
                        <option value="friendly">Vennlig</option>
                        <option value="casual">Uformell</option>
                      </select>
                    </div>
                  </div>
                </section>

                {/* Channels */}
                <section className="rounded-xl border border-slate-200 bg-white p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Kanaler</h2>
                  <div className="space-y-3">
                    {(["sms", "email", "chat", "landing_page"] as AIConversationChannel[]).map((channel) => (
                      <label key={channel} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={config.enabled_channels.includes(channel)}
                          onChange={(e) => {
                            setConfig(prev => ({
                              ...prev,
                              enabled_channels: e.target.checked
                                ? [...prev.enabled_channels, channel]
                                : prev.enabled_channels.filter(c => c !== channel),
                            }));
                          }}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600"
                        />
                        <span className="text-sm text-slate-700">{CHANNEL_LABELS[channel]}</span>
                      </label>
                    ))}
                  </div>
                </section>

                {/* Behavior */}
                <section className="rounded-xl border border-slate-200 bg-white p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Oppførsel</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Maks kontaktforsøk
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={config.max_contact_attempts}
                        onChange={(e) => setConfig(prev => ({ ...prev, max_contact_attempts: parseInt(e.target.value) }))}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Responsforsinkelse (sekunder)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={60}
                        value={config.response_delay_seconds}
                        onChange={(e) => setConfig(prev => ({ ...prev, response_delay_seconds: parseInt(e.target.value) }))}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                </section>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Lagre innstillinger
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Locked state for non-AI plans */}
        {!loading && !error && !canUseAiAgent && (
          <section className="rounded-xl border border-purple-200 bg-purple-50 p-6">
            <h2 className="text-lg font-semibold text-purple-900 mb-2">
              LYXba er låst på din nåværende plan
            </h2>
            <p className="text-sm text-purple-700 mb-4">
              AI-agenten LYXba er tilgjengelig i prøveperioden og den betalte planen.
            </p>
            <ul className="list-disc space-y-1 pl-4 text-sm text-purple-700 mb-4">
              <li>Automatisk oppfølging av leads fra skjema og kampanjer</li>
              <li>AI-drevet booking på SMS, e-post og chat</li>
              <li>Slå opp tjenester, kapasitet og priser automatisk</li>
              <li>Logg alle samtaler på kundekortet</li>
            </ul>
            <div className="flex gap-3">
              <Link
                href="/plan"
                className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
              >
                Oppgrader plan
              </Link>
              <Link
                href="/kontrollpanel"
                className="rounded-lg border border-purple-300 px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-100"
              >
                Tilbake til kontrollpanel
              </Link>
            </div>
          </section>
        )}
      </div>

      {/* Test Modal */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-semibold">Test AI-agenten</h2>
              <button
                type="button"
                onClick={() => {
                  setShowTestModal(false);
                  setTestMessage("");
                  setTestResponse(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Simuler kundemelding
                </label>
                <textarea
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  rows={3}
                  placeholder="Hei, jeg er interessert i keramisk coating for min Tesla Model 3..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <button
                type="button"
                onClick={handleTestMessage}
                disabled={!testMessage.trim()}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Send til AI
              </button>
              {testResponse && (
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500 mb-1">AI-svar:</p>
                  <p className="text-sm text-slate-700">{testResponse}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KPICard({
  label,
  value,
  subValue,
  valueColor = "text-slate-900",
}: {
  label: string;
  value: string;
  subValue?: string;
  valueColor?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
      {subValue && <p className="text-xs text-slate-400 mt-1">{subValue}</p>}
    </div>
  );
}
