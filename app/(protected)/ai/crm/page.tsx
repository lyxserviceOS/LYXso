"use client";

import { useState, useEffect } from "react";
import { useOrgPlan } from "@/components/OrgPlanContext";
import { buildOrgApiUrl } from "@/lib/apiConfig";

export default function AICRMPage() {
  const { org } = useOrgPlan();
  const [loading, setLoading] = useState(false);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");

  // Hent kunder ved mount
  useEffect(() => {
    if (org?.id) {
      fetchCustomers();
    }
  }, [org?.id]);

  const fetchCustomers = async () => {
    if (!org?.id) return;
    
    setCustomersLoading(true);
    try {
      const response = await fetch(buildOrgApiUrl(org.id, "customers"));
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers || []);
      }
    } catch (err) {
      console.error("Kunne ikke hente kunder", err);
    } finally {
      setCustomersLoading(false);
    }
  };

  const handleGenerateInsight = async () => {
    if (!org?.id || !selectedCustomerId) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const endpoint = buildOrgApiUrl(org.id, `ai/crm/customer-summary/${selectedCustomerId}`);

      const response = await fetch(endpoint);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ message: "Ukjent feil" }));
        throw new Error(errData.message || "Kunne ikke generere kundeinnsikt");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Noe gikk galt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">AI CRM</h1>
        <p className="mt-1 text-sm text-slate-600">
          Få dypere innsikt i kundene dine med AI-drevet analyse.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Kundeanalyse med AI</h2>
        <p className="mt-1 text-sm text-slate-600">
          Velg en kunde for å få AI-generert sammendrag og anbefalinger.
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Velg kunde
            </label>
            {customersLoading ? (
              <p className="text-sm text-slate-500 mt-2">Laster kunder...</p>
            ) : customers.length === 0 ? (
              <p className="text-sm text-slate-500 mt-2">
                Ingen kunder funnet. Legg til kunder i CRM-modulen først.
              </p>
            ) : (
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">-- Velg kunde --</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name || customer.email || `Kunde ${customer.id.slice(0, 8)}`}
                  </option>
                ))}
              </select>
            )}
          </div>

          <button
            onClick={handleGenerateInsight}
            disabled={loading || !selectedCustomerId || !org?.id}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {loading ? "Analyserer..." : "Generer kundeinnsikt"}
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-4">
            <div className="rounded-md bg-purple-50 border border-purple-200 p-4">
              <h3 className="text-sm font-semibold text-purple-900 mb-2">AI Kundesammendrag</h3>
              <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
                {result.summary || result.insight || JSON.stringify(result, null, 2)}
              </div>
            </div>

            {result.nextActions && (
              <div className="rounded-md bg-blue-50 border border-blue-200 p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Anbefalte tiltak</h3>
                <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
                  {result.nextActions}
                </div>
              </div>
            )}

            <details className="text-xs text-slate-500">
              <summary className="cursor-pointer hover:text-slate-700">
                Teknisk info (debug)
              </summary>
              <pre className="mt-2 overflow-auto rounded bg-slate-100 p-2">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
