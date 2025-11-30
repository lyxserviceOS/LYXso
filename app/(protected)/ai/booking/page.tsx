"use client";

import { useState } from "react";
import { useOrgPlan } from "@/components/OrgPlanContext";
import { buildOrgApiUrl } from "@/lib/apiConfig";

export default function AIBookingPage() {
  const { org } = useOrgPlan();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [customer, setCustomer] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [desiredServices, setDesiredServices] = useState("");
  const [constraints, setConstraints] = useState("");

  const handleSuggestSlot = async () => {
    if (!org?.id) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const endpoint = buildOrgApiUrl(org.id, "ai/booking/suggest-slot");
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          vehicle,
          desiredServices,
          constraints,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Kunne ikke foreslå tidsluke");
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
        <h1 className="text-2xl font-bold text-slate-900">AI Booking</h1>
        <p className="mt-1 text-sm text-slate-600">
          Få AI til å foreslå optimale tidsluker basert på kunde, kjøretøy og tjenester.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Foreslå tidsluke</h2>
        <p className="mt-1 text-sm text-slate-600">
          AI analyserer kundens behov, kjøretøyets tilstand og din kapasitet for å finne beste tidspunkt.
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Kunde
            </label>
            <input
              type="text"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              placeholder="F.eks. 'Kari Nordmann, tidligere vært her 3 ganger'"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Kjøretøy
            </label>
            <input
              type="text"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              placeholder="F.eks. 'Tesla Model 3, 2022, Hvit'"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Ønskede tjenester
            </label>
            <input
              type="text"
              value={desiredServices}
              onChange={(e) => setDesiredServices(e.target.value)}
              placeholder="F.eks. 'Detailing Premium + coating'"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Begrensninger
            </label>
            <input
              type="text"
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              placeholder="F.eks. 'Kun formiddag, ukedager, ikke i neste uke'"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleSuggestSlot}
            disabled={loading || !customer || !desiredServices || !org?.id}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {loading ? "Analyserer..." : "Foreslå tidsluke"}
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-4">
            <div className="rounded-md bg-green-50 border border-green-200 p-4">
              <h3 className="text-sm font-semibold text-green-900 mb-2">AI-forslag til booking</h3>
              <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
                {result.suggestion}
              </div>
            </div>

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
