// app/(protected)/settings/subscription/SubscriptionPageClient.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getApiBaseUrl } from '@/lib/apiConfig';

const API_BASE = getApiBaseUrl();
const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID;

type Plan = {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: Record<string, any>;
};

type Subscription = {
  id: string;
  org_id: string;
  plan_id: string;
  status: string;
  plan: Plan;
};

type Addon = {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
};

type OrgAddon = {
  id: string;
  addon_id: string;
  status: string;
  addon: Addon;
};

type Usage = {
  bookings_count: number;
  customers_count: number;
  employees_count: number;
  locations_count: number;
  ai_analyses_count: number;
  storage_used_mb: number;
};

export default function SubscriptionPageClient() {
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [orgAddons, setOrgAddons] = useState<OrgAddon[]>([]);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
  const [availableAddons, setAvailableAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showChangePlan, setShowChangePlan] = useState(false);
  const [showAddAddon, setShowAddAddon] = useState(false);

  useEffect(() => {
    fetchSubscription();
    fetchAvailablePlans();
    fetchAvailableAddons();
  }, []);

  async function fetchSubscription() {
    try {
      const res = await fetch(`${API_BASE}/api/orgs/${ORG_ID}/subscription`);
      if (res.ok) {
        const data = await res.json();
        setSubscription(data.subscription);
        setOrgAddons(data.addons || []);
        setUsage(data.usage);
      }
    } catch (err) {
      console.error('Error fetching subscription:', err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAvailablePlans() {
    try {
      const res = await fetch(`${API_BASE}/api/public/plans`);
      if (res.ok) {
        const data = await res.json();
        setAvailablePlans(data.plans || []);
      }
    } catch (err) {
      console.error('Error fetching plans:', err);
    }
  }

  async function fetchAvailableAddons() {
    try {
      const res = await fetch(`${API_BASE}/api/public/addons`);
      if (res.ok) {
        const data = await res.json();
        setAvailableAddons(data.addons || []);
      }
    } catch (err) {
      console.error('Error fetching addons:', err);
    }
  }

  async function changePlan(newPlanId: string) {
    try {
      const res = await fetch(`${API_BASE}/api/orgs/${ORG_ID}/subscription`, {
        method: subscription ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: newPlanId })
      });

      if (res.ok) {
        await fetchSubscription();
        setShowChangePlan(false);
        alert('Plan oppdatert!');
      } else {
        alert('Kunne ikke oppdatere plan');
      }
    } catch (err) {
      console.error('Error changing plan:', err);
      alert('Feil ved endring av plan');
    }
  }

  async function addAddon(addonId: string) {
    try {
      const res = await fetch(`${API_BASE}/api/orgs/${ORG_ID}/addons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addonId })
      });

      if (res.ok) {
        await fetchSubscription();
        setShowAddAddon(false);
        alert('Addon lagt til!');
      } else {
        alert('Kunne ikke legge til addon');
      }
    } catch (err) {
      console.error('Error adding addon:', err);
      alert('Feil ved tillegg av addon');
    }
  }

  async function removeAddon(addonId: string) {
    if (!confirm('Er du sikker på at du vil fjerne dette tillegget?')) return;

    try {
      const res = await fetch(`${API_BASE}/api/orgs/${ORG_ID}/addons/${addonId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        await fetchSubscription();
        alert('Addon fjernet!');
      } else {
        alert('Kunne ikke fjerne addon');
      }
    } catch (err) {
      console.error('Error removing addon:', err);
      alert('Feil ved fjerning av addon');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const currentPlan = subscription?.plan;
  const monthlyTotal = (currentPlan?.price_monthly || 0) + 
    orgAddons.reduce((sum, oa) => sum + (oa.addon?.price_monthly || 0), 0);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Abonnement</h1>
        <p className="text-slate-600">Administrer din plan, addons og bruksdata</p>
      </div>

      {/* Current Plan */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Nåværende plan</h2>
            <p className="text-sm text-slate-600">
              {currentPlan ? currentPlan.name : 'Ingen aktiv plan'}
            </p>
          </div>
          <button
            onClick={() => setShowChangePlan(!showChangePlan)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {currentPlan ? 'Endre plan' : 'Velg plan'}
          </button>
        </div>

        {currentPlan && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-slate-600 mb-1">Månedlig kostnad</p>
              <p className="text-2xl font-bold text-slate-900">
                {currentPlan.price_monthly.toLocaleString('no-NO')} kr
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Status</p>
              <span className="inline-flex px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full">
                Aktiv
              </span>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Neste fornyelse</p>
              <p className="text-slate-900">
                {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('nb-NO')}
              </p>
            </div>
          </div>
        )}

        {/* Change Plan Modal */}
        {showChangePlan && (
          <div className="mt-6 border-t border-slate-200 pt-6">
            <h3 className="font-semibold text-slate-900 mb-4">Velg ny plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {availablePlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors ${
                    plan.id === currentPlan?.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200'
                  }`}
                  onClick={() => plan.id !== currentPlan?.id && changePlan(plan.id)}
                >
                  <h4 className="font-semibold text-slate-900">{plan.name}</h4>
                  <p className="text-2xl font-bold text-slate-900 my-2">
                    {plan.price_monthly.toLocaleString('no-NO')} kr
                  </p>
                  <p className="text-sm text-slate-600">{plan.description}</p>
                  {plan.id === currentPlan?.id && (
                    <p className="text-sm text-blue-600 mt-2">Nåværende plan</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Addons */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Tilleggsmoduler</h2>
            <p className="text-sm text-slate-600">Utvid funksjonaliteten med kraftige tillegg</p>
          </div>
          <button
            onClick={() => setShowAddAddon(!showAddAddon)}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            + Legg til addon
          </button>
        </div>

        {orgAddons.length === 0 ? (
          <p className="text-slate-500 text-center py-8">Ingen aktive addons</p>
        ) : (
          <div className="space-y-3">
            {orgAddons.map((oa) => (
              <div
                key={oa.id}
                className="flex justify-between items-center border border-slate-200 rounded-lg p-4"
              >
                <div>
                  <h4 className="font-medium text-slate-900">{oa.addon.name}</h4>
                  <p className="text-sm text-slate-600">{oa.addon.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-semibold text-slate-900">
                    {oa.addon.price_monthly.toLocaleString('no-NO')} kr/mnd
                  </p>
                  <button
                    onClick={() => removeAddon(oa.addon_id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Fjern
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Addon Modal */}
        {showAddAddon && (
          <div className="mt-6 border-t border-slate-200 pt-6">
            <h3 className="font-semibold text-slate-900 mb-4">Velg addon</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableAddons
                .filter(addon => !orgAddons.some(oa => oa.addon_id === addon.id))
                .map((addon) => (
                  <div
                    key={addon.id}
                    className="border border-slate-200 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors"
                    onClick={() => addAddon(addon.id)}
                  >
                    <h4 className="font-semibold text-slate-900">{addon.name}</h4>
                    <p className="text-sm text-slate-600 my-2">{addon.description}</p>
                    <p className="font-semibold text-slate-900">
                      {addon.price_monthly.toLocaleString('no-NO')} kr/mnd
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Usage Stats */}
      {usage && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Bruksdata denne måneden</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <p className="text-sm text-slate-600 mb-1">Bookinger</p>
              <p className="text-2xl font-bold text-slate-900">{usage.bookings_count}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Kunder</p>
              <p className="text-2xl font-bold text-slate-900">{usage.customers_count}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Ansatte</p>
              <p className="text-2xl font-bold text-slate-900">{usage.employees_count}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Lokasjoner</p>
              <p className="text-2xl font-bold text-slate-900">{usage.locations_count}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">AI-analyser</p>
              <p className="text-2xl font-bold text-slate-900">{usage.ai_analyses_count}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Lagring</p>
              <p className="text-2xl font-bold text-slate-900">
                {(usage.storage_used_mb / 1024).toFixed(1)} GB
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Total Cost Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-blue-100 mb-1">Total månedlig kostnad</p>
            <p className="text-3xl font-bold">{monthlyTotal.toLocaleString('no-NO')} kr</p>
          </div>
          <button
            onClick={() => router.push('/settings/billing')}
            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Se fakturaer →
          </button>
        </div>
      </div>
    </div>
  );
}
