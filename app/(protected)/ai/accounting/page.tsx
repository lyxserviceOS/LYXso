"use client";

import { useState } from "react";
import { useOrgPlan } from "@/components/OrgPlanContext";
import { buildOrgApiUrl } from "@/lib/apiConfig";
import AIChatInterface from "@/components/ai/AIChatInterface";
import {
  Calculator,
  DollarSign,
  TrendingUp,
  PieChart,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileText,
  MessageSquare,
} from "lucide-react";

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
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            AI Regnskap Assistent
          </h1>
        </div>
        <p className="text-gray-600">
          AI-drevet finansiell analyse og økonomisk innsikt
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <span className="text-sm text-gray-600">Omsetning</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">485k</p>
          <p className="text-xs text-gray-500 mt-1">Denne måneden</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Margin</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">68%</p>
          <p className="text-xs text-gray-500 mt-1">Dekningsgrad</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Kostnader</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">155k</p>
          <p className="text-xs text-gray-500 mt-1">Driftskostnader</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-teal-600" />
            <span className="text-sm text-gray-600">Innsikt</span>
          </div>
          <p className="text-2xl font-bold text-teal-600">87</p>
          <p className="text-xs text-gray-500 mt-1">AI-analyser</p>
        </div>
      </div>

      {/* Main Content - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: AI Chat */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Chat med Regnskap AI
          </h2>
          <AIChatInterface
            orgId={org?.id || ""}
            context="accounting"
            welcomeMessage="Hei! Jeg er din AI regnskaps-assistent. Jeg kan hjelpe deg med å forklare finansielle rapporter, analysere trender, identifisere kostnadsbesparelser og gi økonomisk rådgivning. Hva lurer du på?"
            placeholder="Spør om regnskapshjelp..."
          />
        </div>

        {/* Right: Report Explainer */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              Forklar Finansiell Rapport
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Periode
                </label>
                <input
                  type="text"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  placeholder="F.eks. 'Q1 2024' eller 'Januar 2024'"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nøkkeltall og metrics
                </label>
                <textarea
                  value={metrics}
                  onChange={(e) => setMetrics(e.target.value)}
                  placeholder="F.eks. 'Omsetning: 450.000 kr, Lønnskostnader: 180.000 kr, Dekningsgrad: 65%, Antall bookinger: 45, Gj.snitt per booking: 10.000 kr'"
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                onClick={handleExplainReport}
                disabled={loading || !metrics || !period || !org?.id}
                className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyserer rapport...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Forklar Rapport
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            {result && (
              <div className="mt-4 space-y-3">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-4">
                  <div className="flex items-start gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-emerald-900 mb-2">AI-forklaring av rapport</h3>
                      <div className="text-sm text-gray-700 whitespace-pre-wrap">
                        {result.explanation || JSON.stringify(result, null, 2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!loading && !result && !error && (
              <div className="mt-4 text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  Fyll ut nøkkeltall over og få AI-drevet forklaring
                </p>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-6">
            <h3 className="font-semibold text-emerald-900 mb-4">
              Hva AI kan hjelpe med
            </h3>
            <div className="space-y-2 text-sm text-emerald-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Forklare finansielle rapporter enkelt</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Identifisere kostnadsbesparelser</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Analysere økonomiske trender</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Foreslå budsjettoptimalisering</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Beregne nøkkeltall automatisk</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
