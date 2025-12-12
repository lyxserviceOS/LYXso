"use client";

import React, { useState, useEffect } from "react";
import { useOrgPlan } from "@/components/OrgPlanContext";

type TabKey = "oversikt" | "historikk" | "innstillinger" | "test";

interface NotificationLog {
  id: string;
  notification_type: string;
  recipient_email?: string;
  recipient_phone?: string;
  subject?: string;
  status: string;
  error_message?: string;
  created_at: string;
}

interface NotificationStats {
  total: number;
  sent_today: number;
  failed_today: number;
  email_count: number;
  sms_count: number;
}

export default function NotificationsPageClient() {
  const { org, loading } = useOrgPlan();
  const [activeTab, setActiveTab] = useState<TabKey>("oversikt");
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [history, setHistory] = useState<NotificationLog[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [testPhone, setTestPhone] = useState("");
  const [testMessage, setTestMessage] = useState("");
  const [sendingTest, setSendingTest] = useState(false);

  useEffect(() => {
    if (org?.id) {
      loadStats();
      loadHistory();
    }
  }, [org?.id]);

  const loadStats = async () => {
    if (!org?.id) return;
    
    setLoadingData(true);
    try {
      const res = await fetch(`/api/orgs/${org.id}/notifications/stats`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setLoadingData(false);
    }
  };

  const loadHistory = async () => {
    if (!org?.id) return;
    
    try {
      const res = await fetch(`/api/orgs/${org.id}/notifications/history?limit=50`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data.logs || []);
      }
    } catch (err) {
      console.error("Failed to load history:", err);
    }
  };

  const sendTestEmail = async () => {
    if (!org?.id || !testEmail) return;
    
    setSendingTest(true);
    try {
      const res = await fetch(`/api/orgs/${org.id}/notifications/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: testEmail,
          subject: "Test e-post fra LYXso",
          content: testMessage || "Dette er en test-e-post fra LYXso notifikasjonssystemet.",
        }),
      });

      if (res.ok) {
        alert("Test e-post sendt!");
        setTestEmail("");
        setTestMessage("");
        loadHistory();
        loadStats();
      } else {
        const data = await res.json();
        alert(`Feil: ${data.error || "Kunne ikke sende e-post"}`);
      }
    } catch (err) {
      alert("Nettverksfeil ved sending av e-post");
    } finally {
      setSendingTest(false);
    }
  };

  const sendTestSMS = async () => {
    if (!org?.id || !testPhone) return;
    
    setSendingTest(true);
    try {
      const res = await fetch(`/api/orgs/${org.id}/notifications/sms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: testPhone,
          message: testMessage || "Test SMS fra LYXso",
        }),
      });

      if (res.ok) {
        alert("Test SMS sendt!");
        setTestPhone("");
        setTestMessage("");
        loadHistory();
        loadStats();
      } else {
        const data = await res.json();
        alert(`Feil: ${data.error || "Kunne ikke sende SMS"}`);
      }
    } catch (err) {
      alert("Nettverksfeil ved sending av SMS");
    } finally {
      setSendingTest(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-slate-400">Laster notifikasjoner...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-lg font-semibold text-slate-100">Notifikasjoner</h1>
        <p className="text-sm text-slate-400">
          Send og administrer e-post og SMS-varsler til kunder
        </p>
      </header>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 rounded-lg bg-slate-800 p-1">
        {[
          { key: "oversikt", label: "Oversikt" },
          { key: "historikk", label: "Historikk" },
          { key: "innstillinger", label: "Innstillinger" },
          { key: "test", label: "Send test" },
        ].map((tab) => (
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
          {loadingData ? (
            <p className="text-sm text-slate-400">Laster statistikk...</p>
          ) : stats ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Totalt sendt"
                value={stats.total.toString()}
                icon="📨"
              />
              <StatCard
                label="Sendt i dag"
                value={stats.sent_today.toString()}
                icon="✅"
              />
              <StatCard
                label="Feilet i dag"
                value={stats.failed_today.toString()}
                icon="❌"
                alert={stats.failed_today > 0}
              />
              <StatCard
                label="E-post vs SMS"
                value={`${stats.email_count} / ${stats.sms_count}`}
                icon="📧"
              />
            </div>
          ) : (
            <p className="text-sm text-slate-400">Ingen statistikk tilgjengelig</p>
          )}

          {/* Quick info */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <h2 className="text-sm font-semibold text-slate-100 mb-3">
              Automatiske påminnelser
            </h2>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Booking-påminnelser sendes 24 timer før avtale</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Coating-påminnelser sendes 14 dager før utløp</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Dekk-påminnelser sendes sesongbasert (vår/høst)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Historikk Tab */}
      {activeTab === "historikk" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-100">
              Sendte notifikasjoner
            </h2>
            <button
              onClick={loadHistory}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              Oppdater
            </button>
          </div>

          {history.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-8 text-center">
              <p className="text-sm text-slate-400">Ingen notifikasjoner ennå</p>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-slate-400 font-medium">Type</th>
                    <th className="px-4 py-3 text-left text-slate-400 font-medium">Mottaker</th>
                    <th className="px-4 py-3 text-left text-slate-400 font-medium">Emne</th>
                    <th className="px-4 py-3 text-left text-slate-400 font-medium">Status</th>
                    <th className="px-4 py-3 text-left text-slate-400 font-medium">Tidspunkt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {history.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-900/50">
                      <td className="px-4 py-3 text-slate-300">
                        {log.notification_type}
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {log.recipient_email || log.recipient_phone || "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {log.subject || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            log.status === "sent"
                              ? "bg-green-500/10 text-green-400"
                              : log.status === "failed"
                              ? "bg-red-500/10 text-red-400"
                              : "bg-slate-700 text-slate-300"
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {new Date(log.created_at).toLocaleString("no-NO")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Innstillinger Tab */}
      {activeTab === "innstillinger" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <h2 className="text-sm font-semibold text-slate-100 mb-4">
              E-post innstillinger
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Avsender e-post
                </label>
                <input
                  type="email"
                  defaultValue="noreply@lyxso.no"
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                  placeholder="noreply@lyxso.no"
                />
                <p className="mt-1 text-[10px] text-slate-500">
                  Må være verifisert i SendGrid
                </p>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Avsender navn
                </label>
                <input
                  type="text"
                  defaultValue={org?.name || "LYXso"}
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <h2 className="text-sm font-semibold text-slate-100 mb-4">
              SMS innstillinger
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  SMS avsender
                </label>
                <input
                  type="text"
                  defaultValue={org?.name || "LYXso"}
                  maxLength={11}
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                />
                <p className="mt-1 text-[10px] text-slate-500">
                  Maks 11 tegn (vises som avsender)
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <h2 className="text-sm font-semibold text-slate-100 mb-4">
              Automatiske påminnelser
            </h2>
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="mt-0.5 rounded border-slate-600"
                />
                <div>
                  <span className="text-sm text-slate-100">Booking-påminnelser</span>
                  <p className="text-xs text-slate-400">
                    Send automatisk påminnelse 24t før booking
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="mt-0.5 rounded border-slate-600"
                />
                <div>
                  <span className="text-sm text-slate-100">Coating-påminnelser</span>
                  <p className="text-xs text-slate-400">
                    Send påminnelse 14 dager før coating utløper
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="mt-0.5 rounded border-slate-600"
                />
                <div>
                  <span className="text-sm text-slate-100">Dekk-påminnelser</span>
                  <p className="text-xs text-slate-400">
                    Send sesongbaserte påminnelser om dekkskift
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700"
            >
              Lagre innstillinger
            </button>
          </div>
        </div>
      )}

      {/* Test Tab */}
      {activeTab === "test" && (
        <div className="space-y-4">
          {/* Test Email */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <h2 className="text-sm font-semibold text-slate-100 mb-4">
              Send test e-post
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Mottaker e-post
                </label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                  placeholder="test@example.com"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Melding (valgfritt)
                </label>
                <textarea
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                  placeholder="Dette er en test-melding..."
                />
              </div>
              <button
                onClick={sendTestEmail}
                disabled={!testEmail || sendingTest}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingTest ? "Sender..." : "Send test e-post"}
              </button>
            </div>
          </div>

          {/* Test SMS */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <h2 className="text-sm font-semibold text-slate-100 mb-4">
              Send test SMS
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Mottaker telefonnummer
                </label>
                <input
                  type="tel"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                  placeholder="+4712345678"
                />
                <p className="mt-1 text-[10px] text-slate-500">
                  Må inkludere landskode (+47 for Norge)
                </p>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Melding (maks 160 tegn)
                </label>
                <textarea
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  maxLength={160}
                  rows={3}
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                  placeholder="Test SMS fra LYXso"
                />
                <p className="mt-1 text-[10px] text-slate-500">
                  {testMessage.length}/160 tegn
                </p>
              </div>
              <button
                onClick={sendTestSMS}
                disabled={!testPhone || sendingTest}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingTest ? "Sender..." : "Send test SMS"}
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
            <p className="text-xs text-amber-200">
              <strong>Merk:</strong> Test-meldinger bruker faktiske API-kall og kan koste penger.
              Sørg for at SendGrid og Twilio er konfigurert i miljøvariablene.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  alert,
}: {
  label: string;
  value: string;
  icon: string;
  alert?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border ${
        alert ? "border-red-500/30 bg-red-500/10" : "border-slate-800 bg-slate-950/60"
      } p-4`}
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-wide text-slate-500">{label}</p>
        <span className="text-xl">{icon}</span>
      </div>
      <p className={`mt-2 text-2xl font-semibold ${alert ? "text-red-400" : "text-slate-100"}`}>
        {value}
      </p>
    </div>
  );
}
