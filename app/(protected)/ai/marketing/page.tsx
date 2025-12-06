"use client";

import { useState } from "react";
import { useOrgPlan } from "@/components/OrgPlanContext";
import { buildOrgApiUrl } from "@/lib/apiConfig";
import AIChatInterface from "@/components/ai/AIChatInterface";
import {
  Megaphone,
  TrendingUp,
  Users,
  Target,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader2,
  Lightbulb,
  MessageSquare,
} from "lucide-react";

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
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg">
            <Megaphone className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            AI Marketing Assistent
          </h1>
        </div>
        <p className="text-gray-600">
          AI-drevet kampanjegenerering og markedsføringsoptimalisering
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-pink-600" />
            <span className="text-sm text-gray-600">Aktive kampanjer</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">8</p>
          <p className="text-xs text-gray-500 mt-1">Kjører nå</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-600">Rekkevidde</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">2.4k</p>
          <p className="text-xs text-gray-500 mt-1">Denne måneden</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Konvertering</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">4.2%</p>
          <p className="text-xs text-gray-500 mt-1">ROI: 320%</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-gray-600">AI-generert</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">142</p>
          <p className="text-xs text-gray-500 mt-1">Kampanjer</p>
        </div>
      </div>

      {/* Main Content - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: AI Chat */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Chat med Marketing AI
          </h2>
          <AIChatInterface
            orgId={org?.id || ""}
            context="marketing"
            welcomeMessage="Hei! Jeg er din AI marketing-assistent. Jeg kan hjelpe deg med å lage kampanjer, skrive annonsetekster, analysere målgrupper og optimalisere budsjetter. Hva ønsker du å markedsføre?"
            placeholder="Spør om markedsføringshjelp..."
          />
        </div>

        {/* Right: Campaign Generator */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-pink-600" />
              Generer Kampanjeidéer
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kampanjemål
                </label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="F.eks. 'Øke bookinger i januar' eller 'Lansere ny tjeneste'"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tjenester
                </label>
                <input
                  type="text"
                  value={services}
                  onChange={(e) => setServices(e.target.value)}
                  placeholder="F.eks. 'coating, detailing, dekkhotell'"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Målgruppe
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="F.eks. 'bilentusiaster 25-45 år'"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
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
                className="w-full px-4 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Genererer kampanjer...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generer Kampanjeidéer
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
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-4">
                  <div className="flex items-start gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-pink-900 mb-2">AI-genererte kampanjeidéer</h3>
                      <div className="text-sm text-gray-700 whitespace-pre-wrap">
                        {result.ideas || JSON.stringify(result, null, 2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!loading && !result && !error && (
              <div className="mt-4 text-center py-8">
                <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  Fyll ut feltene over og få AI-drevne kampanjeidéer
                </p>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-6">
            <h3 className="font-semibold text-pink-900 mb-4">
              Hva AI kan hjelpe med
            </h3>
            <div className="space-y-2 text-sm text-pink-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-pink-600 flex-shrink-0" />
                <span>Generere kampanjeidéer og strategier</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-pink-600 flex-shrink-0" />
                <span>Skrive overbevisende annonsetekster</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-pink-600 flex-shrink-0" />
                <span>Analysere målgrupper og segmentering</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-pink-600 flex-shrink-0" />
                <span>Optimalisere budsjetter og ROI</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-pink-600 flex-shrink-0" />
                <span>Foreslå kanaler og timing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
