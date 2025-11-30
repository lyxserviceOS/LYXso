"use client";

import { useState } from "react";
import { useOrgPlan } from "@/components/OrgPlanContext";
import { buildOrgApiUrl } from "@/lib/apiConfig";

export default function AIMarketingPage() {
  const { org } = useOrgPlan();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [goal, setGoal] = useState("");
  const [services, setServices] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [tone, setTone] = useState("profesjonell");

  const handleGenerateCampaignIdeas = async () => {
    if (!org?.id) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const endpoint = buildOrgApiUrl(org.id, "ai/marketing/campaign-ideas");
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal,
          services,
          targetAudience,
          tone,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Kunne ikke generere kampanjeidéer");
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
        <h1 className="text-2xl font-bold text-slate-900">AI Marketing</h1>
        <p className="mt-1 text-sm text-slate-600">
          Generer kampanjeidéer, annonsetekster og målgruppeanalyser med AI.
        </p>
      </div>

      {/* Campaign Ideas Generator */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Generer kampanjeidéer</h2>
        <p className="mt-1 text-sm text-slate-600">
          La AI foreslå konkrete kampanjeidéer basert på dine mål og tjenester.
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Kampanjemål
            </label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="F.eks. 'Fylle kapasitet i januar' eller 'Selge flere coating-pakker'"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Tjenester
            </label>
            <input
              type="text"
              value={services}
              onChange={(e) => setServices(e.target.value)}
              placeholder="F.eks. 'detailing, dekkhotell, coating, PPF'"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Målgruppe
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="F.eks. 'bilentusiaster, småbarnsforeldre, firmaflåter'"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="profesjonell">Profesjonell</option>
              <option value="entusiastisk">Entusiastisk</option>
              <option value="avslappet">Avslappet</option>
              <option value="prestisje">Prestisje/luksus</option>
            </select>
          </div>

          <button
            onClick={handleGenerateCampaignIdeas}
            disabled={loading || !goal || !org?.id}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {loading ? "Genererer..." : "Generer kampanjeidéer"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-md bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-6 space-y-4">
            <div className="rounded-md bg-blue-50 border border-blue-200 p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">AI-genererte kampanjeidéer</h3>
              <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
                {result.ideas}
              </div>
            </div>

            {/* Debug info */}
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
