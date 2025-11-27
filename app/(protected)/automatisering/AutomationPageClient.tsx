// app/(protected)/automatisering/AutomationPageClient.tsx
"use client";

import React, { useState } from "react";
import type { 
  AutomationRule, 
  AutomationEvent, 
  TriggerType, 
  ActionType,
  AutomationEventStatus 
} from "@/types/automation";

// Mock data for demonstration
const MOCK_RULES: AutomationRule[] = [
  {
    id: "1",
    org_id: "org1",
    name: "Booking-påminnelse (24 timer)",
    description: "Send SMS-påminnelse til kunden 24 timer før booking",
    trigger_type: "booking_reminder",
    trigger_config: { hours_before: 24 },
    action_type: "send_sms",
    action_config: { 
      template: "Hei {{customer_name}}! Du har time hos oss i morgen kl {{time}}. Velkommen!"
    },
    conditions: null,
    is_active: true,
    is_system: true,
    last_run_at: "2024-03-15T10:00:00Z",
    run_count: 156,
    created_at: "2024-01-01",
    updated_at: "2024-03-15",
  },
  {
    id: "2",
    org_id: "org1",
    name: "Coating - årskontroll påminnelse",
    description: "Opprett automatisk kontroll-booking 12 måneder etter coating",
    trigger_type: "coating_job_completed",
    trigger_config: { delay_months: 12 },
    action_type: "create_followup",
    action_config: { 
      followup_type: "annual_inspection",
      reminder_days: 14 
    },
    conditions: null,
    is_active: true,
    is_system: false,
    last_run_at: "2024-03-10T14:30:00Z",
    run_count: 23,
    created_at: "2024-01-15",
    updated_at: "2024-03-10",
  },
  {
    id: "3",
    org_id: "org1",
    name: "No-show markering",
    description: "Flagg kunde og send e-post hvis de ikke møter opp",
    trigger_type: "booking_no_show",
    trigger_config: {},
    action_type: "flag_customer",
    action_config: { 
      flag: "no_show",
      send_email: true,
      email_template: "no_show_followup"
    },
    conditions: null,
    is_active: false,
    is_system: false,
    last_run_at: null,
    run_count: 0,
    created_at: "2024-02-01",
    updated_at: "2024-02-01",
  },
];

const MOCK_EVENTS: AutomationEvent[] = [
  {
    id: "e1",
    rule_id: "1",
    org_id: "org1",
    trigger_type: "booking_reminder",
    trigger_data: { booking_id: "b123", customer_phone: "+4712345678" },
    action_type: "send_sms",
    action_result: { message_id: "msg123", status: "delivered" },
    status: "completed",
    error_message: null,
    entity_type: "booking",
    entity_id: "b123",
    scheduled_at: "2024-03-15T09:00:00Z",
    started_at: "2024-03-15T09:00:01Z",
    completed_at: "2024-03-15T09:00:02Z",
    created_at: "2024-03-14T10:00:00Z",
  },
  {
    id: "e2",
    rule_id: "1",
    org_id: "org1",
    trigger_type: "booking_reminder",
    trigger_data: { booking_id: "b124", customer_phone: "+4798765432" },
    action_type: "send_sms",
    action_result: null,
    status: "failed",
    error_message: "Invalid phone number format",
    entity_type: "booking",
    entity_id: "b124",
    scheduled_at: "2024-03-15T10:00:00Z",
    started_at: "2024-03-15T10:00:01Z",
    completed_at: "2024-03-15T10:00:02Z",
    created_at: "2024-03-14T11:00:00Z",
  },
];

const TRIGGER_LABELS: Record<TriggerType, string> = {
  booking_created: "Ny booking opprettet",
  booking_confirmed: "Booking bekreftet",
  booking_reminder: "Booking-påminnelse",
  booking_completed: "Booking fullført",
  booking_cancelled: "Booking kansellert",
  booking_no_show: "Kunde møtte ikke",
  coating_job_completed: "Coatingjobb fullført",
  coating_followup_due: "Coating-kontroll forfaller",
  customer_created: "Ny kunde opprettet",
  lead_created: "Nytt lead mottatt",
  payment_received: "Betaling mottatt",
  schedule: "Planlagt tidspunkt",
};

const ACTION_LABELS: Record<ActionType, string> = {
  send_sms: "Send SMS",
  send_email: "Send e-post",
  create_followup: "Opprett oppfølging",
  create_booking: "Opprett booking",
  update_customer: "Oppdater kunde",
  flag_customer: "Merk kunde",
  notify_staff: "Varsle ansatt",
  webhook: "Kjør webhook",
};

export default function AutomationPageClient() {
  const [rules, setRules] = useState(MOCK_RULES);
  const [events] = useState(MOCK_EVENTS);
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);
  const [activeTab, setActiveTab] = useState<"rules" | "logs">("rules");

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(r => 
      r.id === ruleId ? { ...r, is_active: !r.is_active } : r
    ));
  };

  const getStatusColor = (status: AutomationEventStatus): string => {
    switch (status) {
      case "completed": return "bg-emerald-100 text-emerald-700";
      case "running": return "bg-blue-100 text-blue-700";
      case "pending": return "bg-amber-100 text-amber-700";
      case "failed": return "bg-red-100 text-red-700";
      case "skipped": return "bg-slate-100 text-slate-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusLabel = (status: AutomationEventStatus): string => {
    switch (status) {
      case "completed": return "Fullført";
      case "running": return "Kjører";
      case "pending": return "Venter";
      case "failed": return "Feilet";
      case "skipped": return "Hoppet over";
      default: return status;
    }
  };

  // Stats
  const stats = {
    activeRules: rules.filter(r => r.is_active).length,
    totalRules: rules.length,
    completedToday: events.filter(e => 
      e.status === "completed" && 
      e.completed_at &&
      new Date(e.completed_at).toDateString() === new Date().toDateString()
    ).length,
    failedToday: events.filter(e => 
      e.status === "failed" && 
      e.completed_at &&
      new Date(e.completed_at).toDateString() === new Date().toDateString()
    ).length,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Automatisering</h1>
          <p className="text-sm text-slate-500">
            Sett opp automatiske påminnelser, workflows og triggere som kjører på autopilot.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Ny regel
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Aktive regler</p>
          <p className="text-2xl font-semibold text-emerald-600">{stats.activeRules}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Totalt regler</p>
          <p className="text-2xl font-semibold text-slate-900">{stats.totalRules}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Kjørt i dag</p>
          <p className="text-2xl font-semibold text-blue-600">{stats.completedToday}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Feilet i dag</p>
          <p className="text-2xl font-semibold text-red-600">{stats.failedToday}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-6">
          <button
            type="button"
            onClick={() => setActiveTab("rules")}
            className={`pb-3 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "rules"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Regler
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("logs")}
            className={`pb-3 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "logs"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Kjøringslogg
          </button>
        </nav>
      </div>

      {/* Rules tab */}
      {activeTab === "rules" && (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          {/* Rules list */}
          <section className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="border-b border-slate-200 px-4 py-3">
              <h2 className="text-sm font-semibold text-slate-900">
                Automatiseringsregler ({rules.length})
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {rules.map(rule => (
                <div
                  key={rule.id}
                  onClick={() => setSelectedRule(rule)}
                  className={`p-4 cursor-pointer transition hover:bg-slate-50 ${
                    selectedRule?.id === rule.id ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-slate-900 truncate">
                          {rule.name}
                        </h3>
                        {rule.is_system && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                            System
                          </span>
                        )}
                      </div>
                      {rule.description && (
                        <p className="text-xs text-slate-500 mt-1 truncate">
                          {rule.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                          {TRIGGER_LABELS[rule.trigger_type]}
                        </span>
                        <span className="text-[10px] text-slate-400">→</span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                          {ACTION_LABELS[rule.action_type]}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-400">
                        {rule.run_count} kjøringer
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRule(rule.id);
                        }}
                        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          rule.is_active ? "bg-blue-600" : "bg-slate-200"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            rule.is_active ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Rule detail */}
          <section className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="border-b border-slate-200 px-4 py-3">
              <h2 className="text-sm font-semibold text-slate-900">
                {selectedRule ? "Regeldetaljer" : "Velg en regel"}
              </h2>
            </div>
            {selectedRule ? (
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-900">{selectedRule.name}</h3>
                  {selectedRule.description && (
                    <p className="text-xs text-slate-500 mt-1">{selectedRule.description}</p>
                  )}
                </div>

                <div className="space-y-3 text-xs">
                  <div className="rounded-lg bg-blue-50 p-3">
                    <p className="font-medium text-blue-700 mb-1">Trigger</p>
                    <p className="text-blue-600">{TRIGGER_LABELS[selectedRule.trigger_type]}</p>
                    {Object.keys(selectedRule.trigger_config).length > 0 && (
                      <pre className="mt-2 text-[10px] text-blue-500 bg-blue-100 rounded p-2 overflow-auto">
                        {JSON.stringify(selectedRule.trigger_config, null, 2)}
                      </pre>
                    )}
                  </div>

                  <div className="rounded-lg bg-emerald-50 p-3">
                    <p className="font-medium text-emerald-700 mb-1">Handling</p>
                    <p className="text-emerald-600">{ACTION_LABELS[selectedRule.action_type]}</p>
                    {Object.keys(selectedRule.action_config).length > 0 && (
                      <pre className="mt-2 text-[10px] text-emerald-500 bg-emerald-100 rounded p-2 overflow-auto">
                        {JSON.stringify(selectedRule.action_config, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status</span>
                    <span className={`font-medium ${selectedRule.is_active ? "text-emerald-600" : "text-slate-400"}`}>
                      {selectedRule.is_active ? "Aktiv" : "Inaktiv"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Totalt kjørt</span>
                    <span className="text-slate-900">{selectedRule.run_count} ganger</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sist kjørt</span>
                    <span className="text-slate-900">
                      {selectedRule.last_run_at 
                        ? new Date(selectedRule.last_run_at).toLocaleString("nb-NO")
                        : "Aldri"}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 flex gap-2">
                  <button
                    type="button"
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Rediger
                  </button>
                  {!selectedRule.is_system && (
                    <button
                      type="button"
                      className="rounded-lg border border-red-300 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Slett
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">
                Klikk på en regel for å se detaljer og konfigurere.
              </div>
            )}
          </section>
        </div>
      )}

      {/* Logs tab */}
      {activeTab === "logs" && (
        <section className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="border-b border-slate-200 px-4 py-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Kjøringslogg
            </h2>
            <button
              type="button"
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              Last flere
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border-b border-slate-200 px-4 py-2 text-left font-medium text-slate-600">Tidspunkt</th>
                  <th className="border-b border-slate-200 px-4 py-2 text-left font-medium text-slate-600">Regel</th>
                  <th className="border-b border-slate-200 px-4 py-2 text-left font-medium text-slate-600">Trigger</th>
                  <th className="border-b border-slate-200 px-4 py-2 text-left font-medium text-slate-600">Handling</th>
                  <th className="border-b border-slate-200 px-4 py-2 text-left font-medium text-slate-600">Status</th>
                  <th className="border-b border-slate-200 px-4 py-2 text-left font-medium text-slate-600">Detaljer</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => {
                  const rule = rules.find(r => r.id === event.rule_id);
                  return (
                    <tr key={event.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-600">
                        {new Date(event.scheduled_at).toLocaleString("nb-NO")}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {rule?.name || "Ukjent regel"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {TRIGGER_LABELS[event.trigger_type]}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {ACTION_LABELS[event.action_type]}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${getStatusColor(event.status)}`}>
                          {getStatusLabel(event.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {event.error_message || (event.action_result ? "OK" : "—")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Info section */}
      <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
        <p className="font-medium text-slate-700 mb-2">Om automatisering</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Regler kjøres automatisk basert på triggere (f.eks. booking opprettet, 24 timer før booking).</li>
          <li>System-regler kan ikke slettes, men kan deaktiveres.</li>
          <li>All kommunikasjon sendes via valgt SMS- og e-post-leverandør.</li>
          <li>Se kjøringsloggen for å feilsøke hvis noe ikke fungerer som forventet.</li>
        </ul>
      </section>
    </div>
  );
}
