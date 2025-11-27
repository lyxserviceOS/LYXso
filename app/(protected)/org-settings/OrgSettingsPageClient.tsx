"use client";

import React, { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID;

type OrgSettings = {
  id: string;
  name: string | null;
  logoUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  isActive: boolean | null;
  plan: string | null; // f.eks. "free", "trial", "pro"
};

export default function OrgSettingsPageClient() {
  const [org, setOrg] = useState<OrgSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!API_BASE || !ORG_ID) {
        setError("Mangler NEXT_PUBLIC_API_BASE eller NEXT_PUBLIC_ORG_ID.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${API_BASE}/api/orgs/${ORG_ID}/settings`,
          { cache: "no-store" },
        );

        if (!res.ok) {
          throw new Error(`Feil fra API (${res.status})`);
        }

        const json = await res.json();
        setOrg(json.org as OrgSettings);
      } catch (err: any) {
        setError(err?.message ?? "Ukjent feil ved henting av org-settings");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const currentPlan = org?.plan ?? "free";

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-lg font-semibold text-slate-100">
          Organisasjonsinnstillinger
        </h1>
        <p className="text-sm text-slate-400">
          Her ser du hvilken LYXso-plan denne bedriften ligger på, og hvilke
          moduler som er aktivert.
        </p>
      </header>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {loading && <p className="text-sm text-slate-400">Laster …</p>}

      {org && (
        <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Bedrift
              </p>
              <p className="text-sm font-medium text-slate-100">
                {org.name ?? "Uten navn"}
              </p>
              <p className="text-xs text-slate-500">
                Status: {org.isActive ? "Aktiv" : "Deaktivert"}
              </p>
            </div>
            {org.logoUrl && (
              <img
                src={org.logoUrl}
                alt="Logo"
                className="h-10 w-10 rounded-md border border-slate-800 object-contain bg-slate-900"
              />
            )}
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {/* Gratis plan */}
            <div
              className={[
                "rounded-lg border p-3 text-xs",
                currentPlan === "free"
                  ? "border-blue-600 bg-slate-900/80"
                  : "border-slate-800 bg-slate-950/40",
              ].join(" ")}
            >
              <p className="font-semibold text-slate-100">Free</p>
              <p className="text-[11px] text-slate-400">
                Enkelt bookingsystem med reklame. Ingen kostnad.
              </p>
              <ul className="mt-2 space-y-1 text-[11px] text-slate-300">
                <li>• Online booking</li>
                <li>• En bruker</li>
                <li>• Enkel kundeliste</li>
              </ul>
            </div>

            {/* Prøveperiode */}
            <div
              className={[
                "rounded-lg border p-3 text-xs",
                currentPlan === "trial"
                  ? "border-emerald-500 bg-slate-900/80"
                  : "border-slate-800 bg-slate-950/40",
              ].join(" ")}
            >
              <p className="font-semibold text-slate-100">14 dagers prøve</p>
              <p className="text-[11px] text-slate-400">
                Delvis full tilgang i 14 dager før dere går over til Free eller
                Betalt.
              </p>
              <ul className="mt-2 space-y-1 text-[11px] text-slate-300">
                <li>• Det meste av partner-modulene aktivert</li>
                <li>• God måte å teste LYXso i drift</li>
              </ul>
            </div>

            {/* Betalt plan */}
            <div
              className={[
                "rounded-lg border p-3 text-xs",
                currentPlan === "pro"
                  ? "border-amber-500 bg-slate-900/80"
                  : "border-slate-800 bg-slate-950/40",
              ].join(" ")}
            >
              <p className="font-semibold text-slate-100">
                LYXso Partner (betalt)
              </p>
              <p className="text-[11px] text-slate-400">
                Full plattform med AI, regnskap og tilleggsmoduler.
              </p>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-[11px] text-slate-500 line-through">
                  1&nbsp;495,-
                </span>
                <span className="text-sm font-semibold text-emerald-400">
                  990,- / måned
                </span>
                <span className="text-[10px] text-slate-500">introkampanje</span>
              </div>

              <ul className="mt-2 space-y-1 text-[11px] text-slate-300">
                <li>• Full partner-portal</li>
                <li>• Regnskapsflyt via Fiken/PowerOffice</li>
                <li>• Mulighet for AI-markedsføring og LYXvision-modul</li>
                <li>• Flere brukere og tilleggsmoduler mot ekstra månedspris</li>
              </ul>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
