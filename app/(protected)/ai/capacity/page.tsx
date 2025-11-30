"use client";

import { useState } from "react";
import { useOrgPlan } from "@/components/OrgPlanContext";
import { buildOrgApiUrl } from "@/lib/apiConfig";

export default function AICapacityPage() {
  const { org } = useOrgPlan();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [period, setPeriod] = useState("");
  const [bookings, setBookings] = useState("");
  const [resources, setResources] = useState("");

  const handleAnalyzeCapacity = async () => {
    if (!org?.id) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const endpoint = buildOrgApiUrl(org.id, "ai/capacity/analyze");
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          period,
          bookings,
          resources,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Kunne ikke analysere kapasitet");
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
        <h1 className="text-2xl font-bold text-slate-900">AI Kapasitet</h1>
        <p className="mt-1 text-sm text-slate-600">
          Analyser kapasitetsutnyttelse, finn dødtid og optimaliser ressursbruk.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Analyser kapasitet</h2>
        <p className="mt-1 text-sm text-slate-600">
          La AI analysere bookinger og ressurser for å finne forbedringspotensial.
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Periode
            </label>
            <input
              type="text"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder="F.eks. 'Januar 2024' eller 'Siste 30 dager'"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Bookinger
            </label>
            <textarea
              value={bookings}
              onChange={(e) => setBookings(e.target.value)}
              placeholder="F.eks. '45 bookinger i januar, flest på torsdager, 60% detailing, 30% coating, 10% dekk'"
              rows={3}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Ressurser
            </label>
            <textarea
              value={resources}
              onChange={(e) => setResources(e.target.value)}
              placeholder="F.eks. '3 ansatte, 2 haller, åpent man-fre 08-16, lør 10-14'"
              rows={2}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleAnalyzeCapacity}
            disabled={loading || !period || !bookings || !org?.id}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {loading ? "Analyserer..." : "Analyser kapasitet"}
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-4">
            <div className="rounded-md bg-amber-50 border border-amber-200 p-4">
              <h3 className="text-sm font-semibold text-amber-900 mb-2">AI-analyse av kapasitet</h3>
              <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
                {result.analysis}
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
