"use client";

import React, { useEffect, useState, FormEvent } from "react";
import type { PaymentSummaryBucket } from "../../../types/payments";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000";
const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID ?? "";

type AccountingProvider = "fiken" | "poweroffice" | "none";

interface OrgSettings {
  org_id: string;
  accounting_provider: AccountingProvider;
  accounting_settings: Record<string, unknown>;
  payment_provider: string | null;
  payment_settings: Record<string, unknown>;
}

type IntegrationState = "not_connected" | "connecting" | "connected";

type Integration = {
  id: "fiken" | "poweroffice" | "terminal";
  name: string;
  description: string;
  state: IntegrationState;
};

export default function AccountingPageClient() {
  const [settings, setSettings] = useState<OrgSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState<boolean>(false);
  const [summary, setSummary] = useState<PaymentSummaryBucket[]>([]);
  const [summaryRange, setSummaryRange] = useState<"day" | "week" | "month" | "year">("day");
  const [summaryLoading, setSummaryLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "fiken",
      name: "Fiken",
      description:
        "Perfekt for små og mellomstore bedrifter. LYXso kan sende ferdig utfylte bilag direkte til Fiken.",
      state: "not_connected",
    },
    {
      id: "poweroffice",
      name: "PowerOffice Go",
      description:
        "Mer avansert regnskapsflyt for byråer og større bedrifter. LYXso kan speile omsetning og MVA-koder.",
      state: "not_connected",
    },
    {
      id: "terminal",
      name: "Betalingsterminal",
      description:
        "Koble betalingsterminalen din slik at dagsoppgjør og salg automatisk kobles mot tjenester og bilag.",
      state: "not_connected",
    },
  ]);

  const [autoDraftEnabled, setAutoDraftEnabled] = useState<boolean>(true);
  const [autoSendEnabled, setAutoSendEnabled] = useState<boolean>(false);

  const fetchSettings = async () => {
    setSettingsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/orgs/${ORG_ID}/settings`);
      if (!res.ok) {
        throw new Error("Kunne ikke hente org_settings");
      }
      const data = await res.json();
      setSettings(
        data.settings ?? {
          org_id: ORG_ID,
          accounting_provider: "none",
          accounting_settings: {},
          payment_provider: null,
          payment_settings: {},
        },
      );
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Ukjent feil ved henting av innstillinger");
    } finally {
      setSettingsLoading(false);
    }
  };

  const fetchSummary = async (range: "day" | "week" | "month" | "year") => {
    setSummaryLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE}/orgs/${ORG_ID}/payments/summary?range=${encodeURIComponent(range)}`,
      );
      if (!res.ok) {
        throw new Error("Kunne ikke hente omsetningsdata");
      }
      const data = await res.json();
      setSummary(data.summary ?? []);
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Ukjent feil ved henting av omsetningsdata");
    } finally {
      setSummaryLoading(false);
    }
  };

  useEffect(() => {
    if (!ORG_ID) {
      setError("Mangler NEXT_PUBLIC_ORG_ID i .env");
      return;
    }
    fetchSettings();
    fetchSummary("day");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/orgs/${ORG_ID}/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Kunne ikke lagre innstillinger");
      }

      await fetchSettings();
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Ukjent feil ved lagring av innstillinger");
    }
  };

  const currentTotal = summary.reduce(
    (acc, b) => acc + (b.total_amount ?? 0),
    0,
  );

  function handleConnectClick(id: Integration["id"]) {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              state:
                i.state === "connected"
                  ? "not_connected"
                  : i.state === "not_connected"
                  ? "connecting"
                  : i.state,
            }
          : i,
      ),
    );

    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((i) =>
          i.id === id
            ? {
                ...i,
                state: i.state === "connecting" ? "connected" : i.state,
              }
            : i,
        ),
      );
    }, 600);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          Regnskap &amp; betalinger
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl">
          Her kobler du LYXso mot regnskapssystem og betalingsterminaler, og
          får oversikt over omsetning per dag, uke, måned og år. Senere kan AI
          hjelpe til med bokføring direkte herfra –{" "}
          <span className="text-slate-100">
            målet er at du kun godkjenner, ikke punchetall.
          </span>
        </p>
      </header>

      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      {/* Øverste grid: oppsett + omsetning */}
      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        {/* Venstre: oppsett for regnskap og betaling */}
        <form
          onSubmit={handleSaveSettings}
          className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
            Oppsett for regnskap og betaling
          </h2>

          {settingsLoading ? (
            <p className="text-xs text-slate-400">Laster innstillinger…</p>
          ) : settings ? (
            <>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">
                  Regnskapssystem (hoved)
                </label>
                <select
                  value={settings.accounting_provider}
                  onChange={(e) =>
                    setSettings((s) =>
                      s
                        ? {
                            ...s,
                            accounting_provider:
                              e.target.value as AccountingProvider,
                          }
                        : s,
                    )
                  }
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-50 outline-none focus:border-blue-500"
                >
                  <option value="none">Ingen</option>
                  <option value="fiken">Fiken</option>
                  <option value="poweroffice">PowerOffice</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">
                  Betalingstjeneste (terminal / online)
                </label>
                <input
                  type="text"
                  value={settings.payment_provider ?? ""}
                  onChange={(e) =>
                    setSettings((s) =>
                      s
                        ? {
                            ...s,
                            payment_provider: e.target.value || null,
                          }
                        : s,
                    )
                  }
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm text-slate-50 outline-none focus:border-blue-500"
                  placeholder="F.eks. zettle, nets, vipps"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500"
              >
                Lagre innstillinger
              </button>
            </>
          ) : (
            <p className="text-xs text-slate-400">
              Ingen innstillinger lest. Sjekk API-tilkobling.
            </p>
          )}

          <div className="pt-3 border-t border-slate-800 mt-2 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Hvordan dette vil fungere
            </p>
            <ul className="list-disc space-y-1 pl-4 text-[11px] text-slate-400">
              <li>
                LYXso foreslår kontoer og MVA basert på tjeneste og produkttype.
              </li>
              <li>
                Du godkjenner forslagene – deretter sendes de videre til valgt
                regnskapssystem.
              </li>
              <li>
                Regnskapsfører kan få egen tilgang for å kvalitetssikre direkte
                i LYXso.
              </li>
            </ul>
          </div>
        </form>

        {/* Høyre: omsetning fra betalinger */}
        <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify_between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              Omsetning (bankterminal)
            </h2>
            <select
              value={summaryRange}
              onChange={(e) => {
                const val = e.target.value as "day" | "week" | "month" | "year";
                setSummaryRange(val);
                fetchSummary(val);
              }}
              className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-50 outline-none focus:border-blue-500"
            >
              <option value="day">Per dag</option>
              <option value="week">Per uke</option>
              <option value="month">Per måned</option>
              <option value="year">Per år</option>
            </select>
          </div>

          {summaryLoading ? (
            <p className="text-xs text-slate-400">Laster omsetning…</p>
          ) : (
            <>
              <div className="rounded-lg border border-slate-700 bg-slate-950/80 px-4 py-3">
                <p className="text-xs text-slate-400">
                  Totalt i valgt periode ({summaryRange}):
                </p>
                <p className="text-xl font-semibold text-slate-50">
                  {currentTotal.toFixed(2)} NOK
                </p>
              </div>

              {summary.length === 0 ? (
                <p className="text-xs text-slate-400">
                  Ingen betalingstransaksjoner registrert i denne perioden.
                </p>
              ) : (
                <ul className="space-y-1">
                  {summary.map((b) => (
                    <li
                      key={b.bucket}
                      className="flex items-center justify-between rounded-md border border-slate-700 bg-slate-950/80 px-3 py-1.5 text-xs"
                    >
                      <span className="text-slate-300">
                        {new Date(b.bucket).toLocaleDateString("no-NO")}
                      </span>
                      <span className="font-medium text-slate-50">
                        {b.total_amount.toFixed(2)} {b.currency}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>
      </section>

      {/* Integrasjoner og automasjon */}
      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
        <div className="flex flex-col gap-2 border-b border-slate-800 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-50">
              Tilkoblinger til regnskap og betaling
            </h2>
            <p className="mt-1 text-xs text-slate-400 max-w-2xl">
              Start med å koble til regnskapssystemet du bruker i dag, og
              betalingsterminalen i lokalet. Senere vil LYXso kunne synkronisere
              dagsoppgjør og omsetning automatisk – du slipper dobbeltføring.
            </p>
          </div>
          <p className="text-[11px] text-slate-500">
            Dette er en UI-demo. I neste steg knyttes dette mot ekte API-ruter.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {integrations.map((integration) => {
            const isConnecting = integration.state === "connecting";
            const isConnected = integration.state === "connected";

            return (
              <div
                key={integration.id}
                className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-50">
                      {integration.name}
                    </p>
                    <span
                      className={[
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                        integration.state === "connected"
                          ? "bg-emerald-900/30 text-emerald-300 border border-emerald-500/40"
                          : integration.state === "connecting"
                          ? "bg-yellow-900/30 text-yellow-300 border border-yellow-500/40"
                          : "bg-slate-900 text-slate-300 border border-slate-700",
                      ].join(" ")}
                    >
                      {integration.state === "connected" && "Tilkoblet"}
                      {integration.state === "connecting" && "Kobler til…"}
                      {integration.state === "not_connected" && "Ikke tilkoblet"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {integration.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleConnectClick(integration.id)}
                    className={[
                      "rounded-md px-3 py-1.5 text-xs font-medium transition",
                      isConnected
                        ? "bg-slate-800 text-slate-100 hover:bg-slate-700"
                        : "bg-blue-600 text-white hover:bg-blue-500",
                    ].join(" ")}
                  >
                    {isConnected
                      ? "Koble fra (demo)"
                      : isConnecting
                      ? "Kobler til…"
                      : "Koble til"}
                  </button>
                  <p className="text-[10px] text-slate-500">
                    På ekte vil denne knappen åpne en sikker innlogging mot
                    leverandøren.
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <input
              type="checkbox"
              checked={autoDraftEnabled}
              onChange={(e) => setAutoDraftEnabled(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500"
            />
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-50">
                Opprett bilagsutkast automatisk
              </p>
              <p className="text-xs text-slate-400">
                LYXso kan lage utkast til bilag basert på bokføringsregler og
                tjenestetype. Du ser en liste med forslag som du godkjenner
                eller justerer før noe sendes videre.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <input
              type="checkbox"
              checked={autoSendEnabled}
              onChange={(e) => setAutoSendEnabled(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500"
            />
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-50">
                Send godkjente bilag automatisk
              </p>
              <p className="text-xs text-slate-400">
                Når bilag er merket som “godkjent” i LYXso, kan systemet
                automatisk sende dem videre til Fiken/PowerOffice uten at du
                trenger å logge inn der hver gang.
              </p>
            </div>
          </label>
        </div>

        <div className="mt-2 text-[11px] text-slate-500">
          Disse valgene styrer kun hvordan LYXso skal oppføre seg når
          integrasjonene er koblet opp. Selve API-kallene setter vi opp i
          backend (lyx-api) i neste runde.
        </div>
      </section>
    </div>
  );
}
