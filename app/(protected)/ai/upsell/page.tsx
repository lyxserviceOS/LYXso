"use client";

import { useState, useEffect } from "react";
import { useOrgPlan } from "@/components/OrgPlanContext";
import { buildOrgApiUrl } from "@/lib/apiConfig";
import {
  TrendingUp,
  DollarSign,
  Target,
  Sparkles,
  Users,
  Package,
  Loader2,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

interface UpsellOpportunity {
  customerId: string;
  customerName: string;
  currentService: string;
  recommendedUpsells: Array<{
    serviceId: string;
    serviceName: string;
    price: number;
    reasoning: string;
    confidence: number;
    expectedRevenue: number;
  }>;
  totalPotentialRevenue: number;
  likelihood: number;
}

export default function AIUpsellPage() {
  const { org } = useOrgPlan();
  const [loading, setLoading] = useState(false);
  const [opportunities, setOpportunities] = useState<UpsellOpportunity[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState({
    totalOpportunities: 0,
    potentialRevenue: 0,
    averageValue: 0,
    conversionRate: 0,
  });

  const [filters, setFilters] = useState({
    minConfidence: 70,
    minRevenue: 500,
    sortBy: "revenue",
  });

  useEffect(() => {
    if (org?.id) {
      fetchOpportunities();
    }
  }, [org?.id, filters]);

  const fetchOpportunities = async () => {
    if (!org?.id) return;

    setLoading(true);
    setError(null);

    try {
      const endpoint = buildOrgApiUrl(org.id, "ai/upsell/opportunities");
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        throw new Error("Kunne ikke hente mersalgsmuligheter");
      }

      const data = await response.json();
      setOpportunities(data.opportunities || []);
      setStats(data.stats || stats);
    } catch (err: any) {
      setError(err.message || "Noe gikk galt");
    } finally {
      setLoading(false);
    }
  };

  const sendUpsellOffer = async (customerId: string, serviceIds: string[]) => {
    if (!org?.id) return;

    try {
      const endpoint = buildOrgApiUrl(org.id, "ai/upsell/send-offer");
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          serviceIds,
        }),
      });

      if (!response.ok) {
        throw new Error("Kunne ikke sende tilbud");
      }

      // Remove from opportunities
      setOpportunities((prev) =>
        prev.filter((opp) => opp.customerId !== customerId)
      );

      alert("Tilbud sendt til kunde!");
    } catch (err: any) {
      alert(err.message || "Kunne ikke sende tilbud");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">AI Mersalgsmotor</h1>
        </div>
        <p className="text-gray-600">
          AI-drevet mersalg basert på kundedata og kjøpshistorikk
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Muligheter</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {stats.totalOpportunities}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Potensiell inntekt</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {stats.potentialRevenue.toLocaleString()} kr
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-600">Ø Verdi</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {stats.averageValue.toLocaleString()} kr
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-gray-600">Konvertering</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {stats.conversionRate}%
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtrer muligheter</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min. Tillit (%)
            </label>
            <input
              type="number"
              value={filters.minConfidence}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  minConfidence: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              max="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min. Inntekt (kr)
            </label>
            <input
              type="number"
              value={filters.minRevenue}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  minRevenue: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sorter etter
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters({ ...filters, sortBy: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="revenue">Høyest inntekt</option>
              <option value="confidence">Høyest tillit</option>
              <option value="likelihood">Høyest sannsynlighet</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            <div>
              <p className="font-semibold text-blue-900">
                Analyserer mersalgsmuligheter...
              </p>
              <p className="text-sm text-blue-700">
                AI-en studerer kundedata og historikk
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-2">
            <TrendingUp className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Opportunities */}
      {opportunities.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Mersalgsmuligheter ({opportunities.length})
          </h2>

          <div className="space-y-6">
            {opportunities.map((opp) => (
              <div
                key={opp.customerId}
                className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">
                        {opp.customerName}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Siste tjeneste: {opp.currentService}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Potensial</p>
                    <p className="text-2xl font-bold text-green-600">
                      {opp.totalPotentialRevenue.toLocaleString()} kr
                    </p>
                  </div>
                </div>

                {/* Recommended Upsells */}
                <div className="space-y-3 mb-4">
                  {opp.recommendedUpsells.map((upsell) => (
                    <div
                      key={upsell.serviceId}
                      className="bg-gray-50 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {upsell.serviceName}
                          </h4>
                          <p className="text-sm text-gray-600">{upsell.reasoning}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-lg font-bold text-gray-900">
                            {upsell.price.toLocaleString()} kr
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600">Tillit:</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${upsell.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-gray-900">
                            {upsell.confidence}%
                          </span>
                        </div>
                        <span className="text-xs text-green-600 font-semibold">
                          +{upsell.expectedRevenue.toLocaleString()} kr forventet
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">
                      Sannsynlighet: <strong>{opp.likelihood}%</strong>
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      sendUpsellOffer(
                        opp.customerId,
                        opp.recommendedUpsells.map((u) => u.serviceId)
                      )
                    }
                    className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all flex items-center gap-2"
                  >
                    Send tilbud
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && opportunities.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Ingen nye mersalgsmuligheter
          </h3>
          <p className="text-gray-600">
            AI-en fant ingen high-confidence upsell-muligheter akkurat nå. Prøv å
            justere filtrene.
          </p>
        </div>
      )}

      {/* How it works */}
      <div className="mt-8 bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6">
        <h3 className="font-semibold text-orange-900 mb-4">
          Slik fungerer AI Mersalgsmotor
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-orange-900">
                Analyserer kunder
              </span>
            </div>
            <p className="text-sm text-orange-700">
              AI studerer kjøpshistorikk og preferanser
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-orange-900">Matcher tjenester</span>
            </div>
            <p className="text-sm text-orange-700">
              Finner relevante tilleggstjenester basert på data
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-orange-900">Sender tilbud</span>
            </div>
            <p className="text-sm text-orange-700">
              Automatiske personlige tilbud til kunder
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
