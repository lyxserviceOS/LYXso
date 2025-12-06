"use client";

import { useState } from "react";
import { useOrgPlan } from "@/components/OrgPlanContext";
import { buildOrgApiUrl } from "@/lib/apiConfig";
import AIChatInterface from "@/components/ai/AIChatInterface";
import {
  Calendar,
  Clock,
  Users,
  Sparkles,
  CheckCircle,
  TrendingUp,
  AlertCircle,
  Loader2,
  CalendarDays,
  MessageSquare,
} from "lucide-react";

export default function AIBookingPage() {
  const { org } = useOrgPlan();
  const [analyzing, setAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const analyzeBookingPatterns = async () => {
    if (!org?.id) return;

    setAnalyzing(true);
    setError(null);
    try {
      const endpoint = buildOrgApiUrl(org.id, "ai/booking/analyze");
      const response = await fetch(endpoint, {
        method: "POST",
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Analyse feilet");
      }

      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (err: any) {
      setError(err.message || "Kunne ikke analysere booking-mønstre");
      console.error("Booking analysis error:", err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            AI Booking Assistent
          </h1>
        </div>
        <p className="text-gray-600">
          AI-drevet booking-optimalisering og automatisk tidsplanlegging
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">I dag</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">12</p>
          <p className="text-xs text-gray-500 mt-1">Bookinger</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Kapasitet</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">78%</p>
          <p className="text-xs text-gray-500 mt-1">Utnyttelse</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-600">Aktive</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">45</p>
          <p className="text-xs text-gray-500 mt-1">Kunder</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-gray-600">Vekst</span>
          </div>
          <p className="text-2xl font-bold text-green-600">+15%</p>
          <p className="text-xs text-gray-500 mt-1">Forrige uke</p>
        </div>
      </div>

      {/* Main Content - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: AI Chat */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Chat med Booking AI
          </h2>
          <AIChatInterface
            orgId={org?.id || ""}
            context="booking"
            welcomeMessage="Hei! Jeg er din AI booking-assistent. Jeg kan hjelpe deg med å optimalisere bookinger, foreslå beste tider, og automatisere påminnelser. Hva kan jeg hjelpe deg med?"
            placeholder="Spør om booking-hjelp..."
          />
        </div>

        {/* Right: Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Smarte Forslag
            </h2>

            <button
              onClick={analyzeBookingPatterns}
              disabled={analyzing || !org?.id}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyserer...
                </>
              ) : (
                <>
                  <CalendarDays className="w-5 h-5" />
                  Analyser Booking-mønstre
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

            {suggestions.length > 0 && (
              <div className="mt-4 space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {suggestion.title || "Forslag"}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {suggestion.description || suggestion.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!analyzing && suggestions.length === 0 && !error && (
              <div className="mt-4 text-center py-8">
                <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  Klikk knappen over for å få AI-drevne forslag
                </p>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-4">
              Hva AI kan hjelpe med
            </h3>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Foreslå optimale booking-tider</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Automatisk påminnelser og oppfølging</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Kapasitetsplanlegging</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Identifiser booking-flaskehalser</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Smart ressursallokering</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
