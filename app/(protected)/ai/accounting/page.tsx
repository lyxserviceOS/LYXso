"use client";

import { useState } from "react";
import { useOrgPlan } from "@/components/OrgPlanContext";
import { buildOrgApiUrl } from "@/lib/apiConfig";

export default function AIAccountingPage() {
  const { org } = useOrgPlan();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [metrics, setMetrics] = useState("");
  const [period, setPeriod] = useState("");

  const handleExplainReport = async () => {
    if (!org?.id) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const endpoint = buildOrgApiUrl(org.id, "ai/accounting/explain-report");
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metrics,
          period,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Kunne ikke forklare rapport");
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
        <h1 className="text-2xl font-bold text-slate-900">AI Regnskap</h1>
        <p className="mt-1 text-sm text-slate-600">
          Få AI til å forklare rapporter, analysere trender og gi økonomisk innsikt.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Forklar finansiell rapport</h2>
        <p className="mt-1 text-sm text-slate-600">
          Lim inn tall og nøkkeltall, så forklarer AI hva de betyr og hva du bør gjøre.
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
              placeholder="F.eks. 'Q1 2024' eller 'Januar 2024'"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Nøkkeltall og metrics
            </label>
            <textarea
              value={metrics}
              onChange={(e) => setMetrics(e.target.value)}
              placeholder="F.eks. 'Omsetning: 450.000 kr, Lønnskostnader: 180.000 kr, Dekningsgrad: 65%, Antall bookinger: 45, Gj.snitt per booking: 10.000 kr'"
              rows={5}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleExplainReport}
            disabled={loading || !metrics || !period || !org?.id}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {loading ? "Analyserer..." : "Forklar rapport"}
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-4">
            <div className="rounded-md bg-indigo-50 border border-indigo-200 p-4">
              <h3 className="text-sm font-semibold text-indigo-900 mb-2">AI-forklaring av rapport</h3>
              <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
                {result.explanation}
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
