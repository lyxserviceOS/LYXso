"use client";

import { useState, useEffect } from "react";
import { useOrgPlan } from "@/components/OrgPlanContext";
import { buildOrgApiUrl } from "@/lib/apiConfig";
import {
  Package,
  TrendingDown,
  AlertTriangle,
  ShoppingCart,
  Sparkles,
  Loader2,
  CheckCircle,
  BarChart3,
} from "lucide-react";

interface InventoryInsight {
  productId: string;
  productName: string;
  currentStock: number;
  recommendedStock: number;
  usage: {
    dailyAverage: number;
    weeklyAverage: number;
    trend: "increasing" | "decreasing" | "stable";
  };
  prediction: {
    daysUntilEmpty: number;
    suggestedOrderDate: string;
    suggestedOrderQuantity: number;
  };
  reasoning: string;
  priority: "critical" | "high" | "medium" | "low";
}

export default function AIInventoryPage() {
  const { org } = useOrgPlan();
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<InventoryInsight[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState({
    lowStock: 0,
    outOfStock: 0,
    overStock: 0,
    totalValue: 0,
  });

  useEffect(() => {
    if (org?.id) {
      fetchInsights();
    }
  }, [org?.id]);

  const fetchInsights = async () => {
    if (!org?.id) return;

    setLoading(true);
    setError(null);

    try {
      const endpoint = buildOrgApiUrl(org.id, "ai/inventory/insights");
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error("Kunne ikke hente lagerinnsikt");
      }

      const data = await response.json();
      setInsights(data.insights || []);
      setStats(data.stats || stats);
    } catch (err: any) {
      setError(err.message || "Noe gikk galt");
    } finally {
      setLoading(false);
    }
  };

  const createPurchaseOrder = async (productId: string, quantity: number) => {
    if (!org?.id) return;

    try {
      const endpoint = buildOrgApiUrl(org.id, "inventory/purchase-orders");
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity,
          status: "draft",
        }),
      });

      if (!response.ok) {
        throw new Error("Kunne ikke opprette bestilling");
      }

      // Remove from insights
      setInsights((prev) =>
        prev.filter((insight) => insight.productId !== productId)
      );

      alert("Bestilling opprettet!");
    } catch (err: any) {
      alert(err.message || "Kunne ikke opprette bestilling");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingDown className="w-4 h-4 text-green-600 rotate-180" />;
      case "decreasing":
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <BarChart3 className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
            <Package className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">AI Lagerassistent</h1>
        </div>
        <p className="text-gray-600">
          Intelligent lageroptimalisering med AI-drevet prediktiv analyse
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-gray-600">Lavt lager</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.lowStock}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-sm text-gray-600">Tomt lager</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.outOfStock}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Overlager</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.overStock}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Total verdi</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {stats.totalValue.toLocaleString()} kr
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            <div>
              <p className="font-semibold text-blue-900">Analyserer lager...</p>
              <p className="text-sm text-blue-700">
                AI-en genererer innsikt og anbefalinger
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Insights */}
      {insights.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              AI Anbefalinger ({insights.length})
            </h2>
            <button
              onClick={fetchInsights}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Sparkles className="w-4 h-4" />
              Oppdater
            </button>
          </div>

          <div className="space-y-4">
            {insights.map((insight) => (
              <div
                key={insight.productId}
                className={`border rounded-lg p-4 ${getPriorityColor(
                  insight.priority
                )}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {insight.productName}
                      </h3>
                      {getTrendIcon(insight.usage.trend)}
                    </div>
                    <p className="text-sm text-gray-600">{insight.reasoning}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold uppercase`}
                  >
                    {insight.priority}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Nåværende lager</p>
                    <p className="text-lg font-bold text-gray-900">
                      {insight.currentStock}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Anbefalt lager</p>
                    <p className="text-lg font-bold text-green-600">
                      {insight.recommendedStock}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Dager til tomt</p>
                    <p className="text-lg font-bold text-orange-600">
                      {insight.prediction.daysUntilEmpty}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Forbruk/uke</p>
                    <p className="text-lg font-bold text-blue-600">
                      {insight.usage.weeklyAverage.toFixed(1)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-300">
                  <div>
                    <p className="text-xs text-gray-600">Foreslått bestilling</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {insight.prediction.suggestedOrderQuantity} stk senest{" "}
                      {new Date(
                        insight.prediction.suggestedOrderDate
                      ).toLocaleDateString("no-NO")}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      createPurchaseOrder(
                        insight.productId,
                        insight.prediction.suggestedOrderQuantity
                      )
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Opprett bestilling
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && insights.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Lageret er optimalt!
          </h3>
          <p className="text-gray-600">
            AI-en fant ingen kritiske lageranbefalinger akkurat nå
          </p>
        </div>
      )}

      {/* How it works */}
      <div className="mt-8 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-4">
          Slik fungerer AI Lagerassistent
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-900">Analyserer historikk</span>
            </div>
            <p className="text-sm text-blue-700">
              AI studerer forbruksmønstre og trender
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-900">Prediktiv analyse</span>
            </div>
            <p className="text-sm text-blue-700">
              Forutsier fremtidig behov basert på data
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-900">Automatiske forslag</span>
            </div>
            <p className="text-sm text-blue-700">
              Får anbefalinger om når og hvor mye du skal bestille
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
