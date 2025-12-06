"use client";

import { useState } from "react";
import { useOrgPlan } from "@/components/OrgPlanContext";
import { buildOrgApiUrl } from "@/lib/apiConfig";
import AIChatInterface from "@/components/ai/AIChatInterface";
import {
  BarChart3,
  Clock,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader2,
  Activity,
  MessageSquare,
} from "lucide-react";

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
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            AI Kapasitet Assistent
          </h1>
        </div>
        <p className="text-gray-600">
          AI-drevet kapasitetsoptimalisering og ressursplanlegging
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            <span className="text-sm text-gray-600">Utnyttelse</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">76%</p>
          <p className="text-xs text-gray-500 mt-1">Gjennomsnitt</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Ledig tid</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">18t</p>
          <p className="text-xs text-gray-500 mt-1">Denne uken</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <span className="text-sm text-gray-600">Flaskehalser</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">3</p>
          <p className="text-xs text-gray-500 mt-1">Identifisert</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Potensial</span>
          </div>
          <p className="text-2xl font-bold text-green-600">+32%</p>
          <p className="text-xs text-gray-500 mt-1">Økning mulig</p>
        </div>
      </div>

      {/* Main Content - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: AI Chat */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Chat med Kapasitet AI
          </h2>
          <AIChatInterface
            orgId={org?.id || ""}
            context="capacity"
            welcomeMessage="Hei! Jeg er din AI kapasitets-assistent. Jeg kan hjelpe deg med å analysere kapasitetsutnyttelse, identifisere flaskehalser, optimalisere ressursbruk og foreslå forbedringer. Hva vil du vite om kapasiteten din?"
            placeholder="Spør om kapasitetshjelp..."
          />
        </div>

        {/* Right: Capacity Analyzer */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              Analyser Kapasitet
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
                  placeholder="F.eks. 'Januar 2024' eller 'Siste 30 dager'"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bookinger
                </label>
                <textarea
                  value={bookings}
                  onChange={(e) => setBookings(e.target.value)}
                  placeholder="F.eks. '45 bookinger i januar, flest på torsdager, 60% detailing, 30% coating, 10% dekk'"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ressurser
                </label>
                <textarea
                  value={resources}
                  onChange={(e) => setResources(e.target.value)}
                  placeholder="F.eks. '3 ansatte, 2 haller, åpent man-fre 08-16, lør 10-14'"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={handleAnalyzeCapacity}
                disabled={loading || !period || !bookings || !org?.id}
                className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyserer kapasitet...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Analyser Kapasitet
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
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-4">
                  <div className="flex items-start gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-indigo-900 mb-2">AI-analyse av kapasitet</h3>
                      <div className="text-sm text-gray-700 whitespace-pre-wrap">
                        {result.analysis || JSON.stringify(result, null, 2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!loading && !result && !error && (
              <div className="mt-4 text-center py-8">
                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  Fyll ut feltene over og få AI-drevet kapasitetsanalyse
                </p>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-6">
            <h3 className="font-semibold text-indigo-900 mb-4">
              Hva AI kan hjelpe med
            </h3>
            <div className="space-y-2 text-sm text-indigo-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span>Analysere kapasitetsutnyttelse</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span>Identifisere dødtid og flaskehalser</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span>Optimalisere ressursallokering</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span>Foreslå åpningstider og bemanning</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span>Beregne potensial for vekst</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
