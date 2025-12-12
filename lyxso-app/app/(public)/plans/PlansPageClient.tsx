// app/(public)/plans/PlansPageClient.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getApiBaseUrl } from '@/lib/apiConfig';

const API_BASE = getApiBaseUrl();

type Plan = {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: Record<string, any>;
  is_popular: boolean;
  sort_order: number;
};

type Addon = {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  unit_type: string;
};

export default function PlansPageClient() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    fetchPlans();
    fetchAddons();
  }, []);

  async function fetchPlans() {
    try {
      const res = await fetch(`${API_BASE}/api/public/plans`);
      if (res.ok) {
        const data = await res.json();
        setPlans(data.plans || []);
      }
    } catch (err) {
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAddons() {
    try {
      const res = await fetch(`${API_BASE}/api/public/addons`);
      if (res.ok) {
        const data = await res.json();
        setAddons(data.addons || []);
      }
    } catch (err) {
      console.error('Error fetching addons:', err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold mb-4">
          Enkel og forutsigbar prising
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Velg planen som passer best for din bedrift. Alltid med 30 dagers pengene-tilbake-garanti.
        </p>

        {/* Billing Period Toggle */}
        <div className="mt-8 inline-flex items-center gap-4 bg-slate-900 rounded-lg p-1">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-6 py-2 rounded-md transition-colors ${
              billingPeriod === 'monthly'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Månedlig
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={`px-6 py-2 rounded-md transition-colors relative ${
              billingPeriod === 'yearly'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Årlig
            <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">
              Spar 20%
            </span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const price = billingPeriod === 'monthly' ? plan.price_monthly : plan.price_yearly;
            const displayPrice = billingPeriod === 'monthly' ? price : Math.floor(price / 12);

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border p-8 ${
                  plan.is_popular
                    ? 'border-blue-500 bg-slate-900'
                    : 'border-slate-800 bg-slate-900/50'
                }`}
              >
                {plan.is_popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Mest populær
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-sm text-slate-400 min-h-[3rem]">{plan.description}</p>
                </div>

                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">{displayPrice.toLocaleString('no-NO')}</span>
                    <span className="text-slate-400">kr</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    {billingPeriod === 'monthly' ? 'per måned' : 'per måned (betales årlig)'}
                  </p>
                </div>

                <button
                  onClick={() => router.push(plan.price_monthly === 0 ? '/register' : '/bli-partner')}
                  className={`w-full py-3 rounded-lg font-medium transition-colors mb-6 ${
                    plan.is_popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  {plan.price_monthly === 0 ? 'Kom i gang gratis' : 'Velg plan'}
                </button>

                {/* Features */}
                <div className="space-y-3 text-sm">
                  {Object.entries(plan.features || {}).map(([key, value]) => {
                    if (typeof value === 'boolean' && value) {
                      return (
                        <div key={key} className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-slate-300">
                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                      );
                    } else if (typeof value === 'number' || typeof value === 'string') {
                      return (
                        <div key={key} className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-slate-300">
                            {value} {key.replace(/_/g, ' ')}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Addons Section */}
      {addons.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tilleggsmoduler</h2>
            <p className="text-slate-400">
              Utvid funksjonaliteten med kraftige tilleggsmoduler
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addons.map((addon) => (
              <div
                key={addon.id}
                className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 transition-colors"
              >
                <h3 className="text-xl font-semibold mb-2">{addon.name}</h3>
                <p className="text-sm text-slate-400 mb-4">{addon.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">{addon.price_monthly.toLocaleString('no-NO')}</span>
                  <span className="text-slate-400">kr/mnd</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Ofte stilte spørsmål</h2>
        
        <div className="space-y-4">
          <details className="bg-slate-900/50 rounded-lg border border-slate-800">
            <summary className="px-6 py-4 cursor-pointer font-medium hover:text-blue-400 transition-colors">
              Kan jeg endre plan senere?
            </summary>
            <div className="px-6 pb-4 text-slate-400">
              Ja! Du kan oppgradere eller nedgradere når som helst. Endringen trer i kraft umiddelbart.
            </div>
          </details>

          <details className="bg-slate-900/50 rounded-lg border border-slate-800">
            <summary className="px-6 py-4 cursor-pointer font-medium hover:text-blue-400 transition-colors">
              Hva skjer hvis jeg når grensen på planen min?
            </summary>
            <div className="px-6 pb-4 text-slate-400">
              Vi varsler deg i god tid før du når grensene. Du kan da oppgradere til en høyere plan eller kjøpe tilleggskapasitet.
            </div>
          </details>

          <details className="bg-slate-900/50 rounded-lg border border-slate-800">
            <summary className="px-6 py-4 cursor-pointer font-medium hover:text-blue-400 transition-colors">
              Tilbyr dere support?
            </summary>
            <div className="px-6 pb-4 text-slate-400">
              Ja! Alle planer inkluderer e-post support. Pro og Enterprise får prioritert support og dedikert kontaktperson.
            </div>
          </details>

          <details className="bg-slate-900/50 rounded-lg border border-slate-800">
            <summary className="px-6 py-4 cursor-pointer font-medium hover:text-blue-400 transition-colors">
              Kan jeg kansellere når som helst?
            </summary>
            <div className="px-6 pb-4 text-slate-400">
              Ja, du kan kansellere når som helst uten bindingstid. Ved årlig betaling får du refusjon for ubrukte måneder.
            </div>
          </details>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Klar til å komme i gang?</h2>
          <p className="text-lg text-blue-100 mb-8">
            Start med gratis plan i dag. Ingen kredittkort påkrevd.
          </p>
          <button
            onClick={() => router.push('/register')}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Start gratis →
          </button>
        </div>
      </div>
    </div>
  );
}
