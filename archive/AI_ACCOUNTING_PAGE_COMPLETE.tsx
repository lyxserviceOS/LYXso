"use client";

import { useState } from "react";
import { useOrgPlan } from "@/components/OrgPlanContext";
import { buildOrgApiUrl } from "@/lib/apiConfig";
import AIChatInterface from "@/components/ai/AIChatInterface";
import {
  Calculator,
  DollarSign,
  TrendingUp,
  FileText,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader2,
  PieChart,
} from "lucide-react";

export default function AIAccountingPage() {
  const { org } = useOrgPlan();
  const [analyzing, setAnalyzing] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const analyzeFinancials = async () => {
    if (!org?.id) return;

    setAnalyzing(true);
    setError(null);
    try {
      const endpoint = buildOrgApiUrl(org.id, "ai/accounting/analyze");
      const response = await fetch(endpoint, {
        method: "POST",
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Analyse feilet");
      }

      const data = await response.json();
      setInsights(data.insights || []);
    } catch (err: any) {
      setError(err.message || "Kunne ikke analysere finanser");
      console.error("Accounting analysis error:", err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            AI Regnskap Assistent
          </h1>
        </div>
        <p className="text-gray-600">
          AI-drevet finansiell analyse og regnskapsautomatisering
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Inntekt</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">125k</p>
          <p className="text-xs text-gray-500 mt-1">Denne måneden</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Utgifter</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">45k</p>
          <p className="text-xs text-gray-500 mt-1">Denne måneden</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-600">Margin</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">64%</p>
          <p className="text-xs text-gray-500 mt-1">Bruttomargin</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-gray-600">Fakturaer</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">23</p>
          <p className="text-xs text-gray-500 mt-1">Ubetalt</p>
        </div>
      </div>

      {/* Main Content - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: AI Chat */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Chat med Regnskap AI
          </h2>
          <AIChatInterface
            orgId={org?.id || ""}
            context="accounting"
            welcomeMessage="Hei! Jeg er din AI regnskap-assistent. Jeg kan hjelpe deg med finansiell analyse, utgiftskategorisering, og innsikt i din økonomi. Hva kan jeg hjelpe deg med?"
            placeholder="Spør om regnskap..."
          />
        </div>

        {/* Right: Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-green-600" />
              Finansiell Analyse
            </h2>

            <button
              onClick={analyzeFinancials}
              disabled={analyzing || !org?.id}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyserer...
                </>
              ) : (
                <>
                  <Calculator className="w-5 h-5" />
                  Analyser Økonomi
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            {insights.length > 0 && (
              <div className="mt-4 space-y-3">
                {insights.map((insight, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {insight.title || "Innsikt"}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {insight.description || insight.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!analyzing && insights.length === 0 && !error && (
              <div className="mt-4 text-center py-8">
                <Calculator className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  Klikk knappen over for å få AI-drevet finansiell analyse
                </p>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-green-900 mb-4">
              Hva AI kan hjelpe med
            </h3>
            <div className="space-y-2 text-sm text-green-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>Automatisk utgiftskategorisering</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>Finansiell trendanalyse</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>Budsjett og prognoser</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>Faktura-påminnelser</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>MVA og skatterapporter</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
