// app/(protected)/betaling/BetalingPageClient.tsx
"use client";

import React, { useEffect, useState } from "react";
import { PlanGate } from "../../../components/PlanGate";

type PaymentProvider = {
  id: string;
  org_id: string;
  provider_type: string;
  provider_name: string;
  is_active: boolean;
  config_encrypted: string;
  last_sync_at: string | null;
  created_at: string;
  updated_at: string;
};

type PaymentStats = {
  total_amount: number;
  transaction_count: number;
  pending_amount: number;
  captured_amount: number;
  refunded_amount: number;
};

export default function BetalingPageClient() {
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState<PaymentProvider[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        
        // Fetch providers
        const providersRes = await fetch(`${API_BASE}/api/payments/providers`, {
          headers: { "x-org-id": "org-placeholder" },
        });
        if (!providersRes.ok) throw new Error("Failed to fetch providers");
        const providersData = await providersRes.json();
        setProviders(providersData.providers || []);
        
        // Fetch stats
        const statsRes = await fetch(`${API_BASE}/api/payments/stats`, {
          headers: { "x-org-id": "org-placeholder" },
        });
        if (!statsRes.ok) throw new Error("Failed to fetch stats");
        const statsData = await statsRes.json();
        setStats(statsData.stats || null);
      } catch (err) {
        console.error("[BetalingPageClient] load error", err);
        setError("Kunne ikke laste betalingsdata");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-sm">
      <div>
        <h1 className="text-2xl font-semibold">Betaling</h1>
        <p className="mt-1 text-slate-600">
          Her samles oppsett for betalingsterminaler og online-betaling. Når
          både betaling og regnskap er koblet, kan LYXso ta seg av
          regnskapsføringen slik at partneren slipper å bruke tid på bilag.
        </p>
        <p className="mt-1 text-[11px] text-slate-500 max-w-xl">
          Første versjon vil støtte regnskapssystemer som Fiken og PowerOffice,
          og betaling via iZettle, SumUp og nettbetaling. Gratis-brukere har
          kun booking – Pro/partner får betalingsflyten.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stats cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-5">
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="text-[10px] text-slate-500 uppercase tracking-wide">Total omsetning</div>
            <div className="text-xl font-bold text-slate-900 mt-1">
              {new Intl.NumberFormat("no-NO", { style: "currency", currency: "NOK" }).format(stats.total_amount)}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="text-[10px] text-slate-500 uppercase tracking-wide">Transaksjoner</div>
            <div className="text-xl font-bold text-slate-900 mt-1">{stats.transaction_count}</div>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <div className="text-[10px] text-amber-700 uppercase tracking-wide">Venter</div>
            <div className="text-xl font-bold text-amber-900 mt-1">
              {new Intl.NumberFormat("no-NO", { style: "currency", currency: "NOK" }).format(stats.pending_amount)}
            </div>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-3">
            <div className="text-[10px] text-green-700 uppercase tracking-wide">Betalt</div>
            <div className="text-xl font-bold text-green-900 mt-1">
              {new Intl.NumberFormat("no-NO", { style: "currency", currency: "NOK" }).format(stats.captured_amount)}
            </div>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 p-3">
            <div className="text-[10px] text-red-700 uppercase tracking-wide">Refundert</div>
            <div className="text-xl font-bold text-red-900 mt-1">
              {new Intl.NumberFormat("no-NO", { style: "currency", currency: "NOK" }).format(stats.refunded_amount)}
            </div>
          </div>
        </div>
      )}

      <PlanGate allowedPlans={["trial", "paid"]} title="Betalingsintegrasjoner" description="For å bruke betalingsintegrasjoner må du ha en prøve- eller betalt plan.">
        <section className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)]">
          {/* Venstre: terminaler */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
            <h2 className="text-lg font-medium">Betalingsterminaler</h2>
            <p className="text-xs text-slate-600">
              Status for kobling mot fysiske terminaler. Integrasjon mot
              iZettle og SumUp planlegges her.
            </p>

            {loading ? (
              <p className="text-xs text-slate-400">Laster...</p>
            ) : (
              <div className="space-y-3 text-[11px]">
                {providers.filter(p => ["izettle", "sumup"].includes(p.provider_type)).map(provider => (
                  <div key={provider.id} className="rounded-lg border border-slate-200 p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{provider.provider_name}</p>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        provider.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                      }`}>
                        {provider.is_active ? "✓ Aktiv" : "Inaktiv"}
                      </span>
                    </div>
                    <p className="mt-1 text-[10px] text-slate-500">
                      {provider.last_sync_at 
                        ? `Sist synkronisert: ${new Date(provider.last_sync_at).toLocaleString("no-NO")}`
                        : "Aldri synkronisert"}
                    </p>
                  </div>
                ))}
                
                {providers.filter(p => ["izettle", "sumup"].includes(p.provider_type)).length === 0 && (
                  <>
                    <div className="rounded-lg border border-slate-200 p-3">
                      <p className="font-medium">iZettle</p>
                      <p className="mt-1 text-slate-600">
                        Status: <span className="font-semibold">Ikke koblet</span>
                      </p>
                      <p className="mt-1 text-[10px] text-slate-500">
                        Når API-tilkobling er klar, vil LYXso kunne hente omsetning
                        direkte fra terminalen og koble den mot regnskap.
                      </p>
                    </div>

                    <div className="rounded-lg border border-slate-200 p-3">
                      <p className="font-medium">SumUp</p>
                      <p className="mt-1 text-slate-600">
                        Status: <span className="font-semibold">Ikke koblet</span>
                      </p>
                      <p className="mt-1 text-[10px] text-slate-500">
                        Brukes for kortbetaling i butikk. Transaksjoner kan senere
                        matches mot fakturaer og bokføres automatisk.
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

            <button
              type="button"
              disabled
              className="mt-2 inline-flex items-center justify-center rounded-md border border-slate-300 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 disabled:opacity-60"
            >
              Konfigurer terminal (kommer snart)
            </button>
          </div>

          {/* Høyre: online-betaling og regnskap */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
            <h2 className="text-lg font-medium">Online-betaling & regnskap</h2>
            <p className="text-xs text-slate-600">
              Brukes for betaling direkte fra bookingskjema eller landingssiden
              (f.eks. depositum, forskudd eller gavekort) og for å koble mot
              regnskapssystemer som Fiken og PowerOffice.
            </p>

            {loading ? (
              <p className="text-xs text-slate-400">Laster...</p>
            ) : (
              <div className="space-y-3 text-[11px]">
                {providers.filter(p => ["stripe", "vipps", "paypal"].includes(p.provider_type)).map(provider => (
                  <div key={provider.id} className="rounded-lg border border-slate-200 p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{provider.provider_name}</p>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        provider.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                      }`}>
                        {provider.is_active ? "✓ Aktiv" : "Inaktiv"}
                      </span>
                    </div>
                    <p className="mt-1 text-[10px] text-slate-500">
                      {provider.last_sync_at 
                        ? `Sist synkronisert: ${new Date(provider.last_sync_at).toLocaleString("no-NO")}`
                        : "Aldri synkronisert"}
                    </p>
                  </div>
                ))}
                
                {providers.filter(p => ["stripe", "vipps", "paypal"].includes(p.provider_type)).length === 0 && (
                  <>
                    <div className="rounded-lg border border-slate-200 p-3">
                      <p className="font-medium">Vipps / kortbetaling</p>
                      <p className="mt-1 text-slate-600">
                        Status: <span className="font-semibold">Ikke koblet</span>
                      </p>
                      <p className="mt-1 text-[10px] text-slate-500">
                        API-tilkobling kan senere brukes for å ta betalt ved booking
                        og koble betalingen til riktig ordre.
                      </p>
                    </div>

                    <div className="rounded-lg border border-slate-200 p-3">
                      <p className="font-medium">Regnskap (Fiken / PowerOffice)</p>
                      <p className="mt-1 text-slate-600">
                        Status: <span className="font-semibold">Planlagt</span>
                      </p>
                      <p className="mt-1 text-[10px] text-slate-500">
                        Når betaling og regnskap er koblet, kan LYXso generere
                        bilag, føre inntekter og holde regnskapet à jour – slik at
                        partneren slipper å sitte med regneark etter arbeidstid.
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

            <button
              type="button"
              disabled
              className="mt-2 inline-flex items-center justify-center rounded-md border border-slate-300 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 disabled:opacity-60"
            >
              Konfigurer online-betaling (kommer snart)
            </button>
          </div>
        </section>
      </PlanGate>
    </div>
  );
}
