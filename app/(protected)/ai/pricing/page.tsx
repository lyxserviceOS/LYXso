"use client";

import { useState } from "react";
import { useOrgPlan } from "@/components/OrgPlanContext";
import { buildOrgApiUrl } from "@/lib/apiConfig";
import {
  TrendingUp,
  DollarSign,
  Target,
  Zap,
  BarChart3,
  AlertCircle,
  Sparkles,
  RefreshCw,
} from "lucide-react";

interface PricingRecommendation {
  serviceId: string;
  serviceName: string;
  currentPrice: number;
  recommendedPrice: number;
  reasoning: string;
  confidence: number;
  expectedImpact: {
    revenueChange: string;
    demandChange: string;
    marginChange: string;
  };
}

export default function AIPricingPage() {
  const { org } = useOrgPlan();
  const [analyzing, setAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<PricingRecommendation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [settings, setSettings] = useState({
    strategy: "balanced",
    targetMargin: 30,
    competitiveness: "medium",
    seasonality: true,
    demandBased: true,
  });

  const analyzePricing = async () => {
    if (!org?.id) return;

    setAnalyzing(true);
    setError(null);

    try {
      const endpoint = buildOrgApiUrl(org.id, "ai/pricing/analyze");
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Kunne ikke analysere prising");
      }

      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (err: any) {
      setError(err.message || "Noe gikk galt");
    } finally {
      setAnalyzing(false);
    }
  };

  const applyRecommendation = async (serviceId: string, newPrice: number) => {
    if (!org?.id) return;

    try {
      const endpoint = buildOrgApiUrl(org.id, `services/${serviceId}`);
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: newPrice }),
      });

      if (!response.ok) {
        throw new Error("Kunne ikke oppdatere pris");
      }

      setRecommendations((prev) =>
        prev.filter((rec) => rec.serviceId !== serviceId)
      );
    } catch (err: any) {
      alert(err.message || "Kunne ikke oppdatere pris");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">AI Prising (MarginMotor™)</h1>
        </div>
        <p className="text-gray-600">
          AI-drevet dynamisk prising for å maksimere inntekt og margin
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Ø Margin</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {settings.targetMargin}%
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Strategi</span>
          </div>
          <p className="text-lg font-semibold text-gray-900 capitalize">
            {settings.strategy}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            <span className="text-sm text-gray-600">Anbefalinger</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {recommendations.length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-600">Konkurranseevne</span>
          </div>
          <p className="text-lg font-semibold text-gray-900 capitalize">
            {settings.competitiveness}
          </p>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Prising Innstillinger
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prising Strategi
            </label>
            <select
              value={settings.strategy}
              onChange={(e) =>
                setSettings({ ...settings, strategy: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="aggressive">Aggressiv (Markedsandel)</option>
              <option value="balanced">Balansert (Anbefalt)</option>
              <option value="premium">Premium (Maksimal margin)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mål Margin (%)
            </label>
            <input
              type="number"
              value={settings.targetMargin}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  targetMargin: parseInt(e.target.value) || 30,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              max="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Konkurranseevne
            </label>
            <select
              value={settings.competitiveness}
              onChange={(e) =>
                setSettings({ ...settings, competitiveness: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Lav (Høyere priser)</option>
              <option value="medium">Medium</option>
              <option value="high">Høy (Lavere priser)</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.seasonality}
                onChange={(e) =>
                  setSettings({ ...settings, seasonality: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Bruk sesongbasert prising
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.demandBased}
                onChange={(e) =>
                  setSettings({ ...settings, demandBased: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Bruk etterspørselsbasert prising
              </span>
            </label>
          </div>
        </div>

        <button
          onClick={analyzePricing}
          disabled={analyzing}
          className="mt-4 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          {analyzing ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Analyserer...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Analyser Priser
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            AI Anbefalinger
          </h2>

          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.serviceId}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {rec.serviceName}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{rec.reasoning}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Nåværende pris</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {rec.currentPrice} kr
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Anbefalt pris</p>
                    <p className="text-2xl font-bold text-green-600">
                      {rec.recommendedPrice} kr
                    </p>
                  </div>

                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Tillit</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${rec.confidence}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {rec.confidence}%
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      applyRecommendation(rec.serviceId, rec.recommendedPrice)
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Bruk
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-600">Inntekt endring</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {rec.expectedImpact.revenueChange}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Etterspørsel endring</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {rec.expectedImpact.demandChange}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Margin endring</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {rec.expectedImpact.marginChange}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!analyzing && recommendations.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            Klikk "Analyser Priser" for å få AI-drevne prisanbefalinger
          </p>
        </div>
      )}
    </div>
  );
}
