// app/(protected)/markedsforing/ai/AiCampaignGenerator.tsx
"use client";

import { useState, useEffect } from "react";
import { Sparkles, Loader2, TrendingUp, Target, Calendar, DollarSign } from "lucide-react";
import { getApiBaseUrl, getDefaultOrgId } from "@/lib/apiConfig";

const API_BASE_URL = getApiBaseUrl();
const ORG_ID = getDefaultOrgId();

type CampaignIdea = {
  title: string;
  description: string;
  channels: string[];
  targetAudience: string;
  estimatedReach: number;
  suggestedBudget: number;
  duration: string;
  keyMessages: string[];
};

type GenerateResponse = {
  jobId: string;
  status: string;
  output: {
    ideas: CampaignIdea[];
  };
};

export default function AiCampaignGenerator() {
  const [goal, setGoal] = useState("");
  const [period, setPeriod] = useState("Q1 2025");
  const [targetAudience, setTargetAudience] = useState("");
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<CampaignIdea[]>([]);
  const [error, setError] = useState("");
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    used: number;
    limit: number;
    tier: string;
  } | null>(null);
  const [selectedIdea, setSelectedIdea] = useState<CampaignIdea | null>(null);
  const [creatingCampaign, setCreatingCampaign] = useState(false);

  // Debug: Log when ideas state changes
  useEffect(() => {
    console.log("🔄 Ideas state changed:", {
      ideasLength: ideas.length,
      firstIdea: ideas[0]?.title || 'none'
    });
  }, [ideas]);

  const handleCreateCampaign = async (idea: CampaignIdea) => {
    setSelectedIdea(idea);
    setCreatingCampaign(true);

    try {
      // 1. Generer bilde med DALL-E
      console.log("🎨 Genererer bilde for kampanje:", idea.title);
      const imageResponse = await fetch(
        `${API_BASE_URL}/api/orgs/${ORG_ID}/ai/marketing/generate-image`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: `Professional marketing image for: ${idea.title}. ${idea.description}. High quality, eye-catching, suitable for social media advertising.`,
            size: "1024x1024",
          }),
        }
      );

      if (!imageResponse.ok) {
        throw new Error("Kunne ikke generere bilde");
      }

      const imageData = await imageResponse.json();
      console.log("✅ Bilde generert:", imageData.url);

      // 2. Opprett Facebook/Instagram kampanje
      console.log("📱 Oppretter Meta-kampanje...");
      const campaignResponse = await fetch(
        `${API_BASE_URL}/api/marketing/meta/campaign`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orgId: ORG_ID,
            name: idea.title,
            objective: "OUTCOME_ENGAGEMENT", // Kan være OUTCOME_LEADS, OUTCOME_SALES, etc.
            budget: idea.suggestedBudget,
            targeting: {
              targetAudience: idea.targetAudience,
            },
            creative: {
              headline: idea.title,
              body: idea.description,
              imageUrl: imageData.url,
              callToAction: "LEARN_MORE",
            },
          }),
        }
      );

      if (!campaignResponse.ok) {
        throw new Error("Kunne ikke opprette Meta-kampanje");
      }

      const campaignData = await campaignResponse.json();
      console.log("✅ Kampanje opprettet:", campaignData);

      alert(
        `🎉 Kampanje "${idea.title}" er opprettet!\n\n` +
        `Kampanje-ID: ${campaignData.campaignId}\n` +
        `Status: ${campaignData.status}\n\n` +
        `Gå til Meta Business Manager for å aktivere kampanjen.`
      );
    } catch (err: any) {
      console.error("❌ Feil ved opprettelse av kampanje:", err);
      alert(
        `Kunne ikke opprette kampanje:\n${err.message}\n\n` +
        `Sjekk at Meta-kontoen din er konfigurert riktig.`
      );
    } finally {
      setCreatingCampaign(false);
      setSelectedIdea(null);
    }
  };

  const handleGenerate = async () => {
    if (!goal.trim()) {
      setError("Vennligst skriv inn et mål for kampanjen");
      return;
    }

    setLoading(true);
    setError("");
    setIdeas([]);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/orgs/${ORG_ID}/ai/marketing/campaign-ideas`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            goal: goal.trim(),
            period: period.trim() || undefined,
            targetAudience: targetAudience.trim() || undefined,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        
        // Håndter rate limit
        if (response.status === 429) {
          setRateLimitInfo(errorData.usage);
          throw new Error(errorData.message);
        }
        
        throw new Error(errorData.message || "Kunne ikke generere kampanjeidéer");
      }

      const data: GenerateResponse = await response.json();

      console.log("✅ AI Response received:", data);
      console.log("Response structure:", {
        jobId: data.jobId,
        status: data.status,
        hasOutput: !!data.output,
        outputKeys: data.output ? Object.keys(data.output) : [],
        hasIdeas: data.output?.ideas ? true : false,
        ideasLength: data.output?.ideas?.length || 0
      });

      // Sjekk om vi har ideas i output
      if (data.output && data.output.ideas && Array.isArray(data.output.ideas)) {
        console.log(`✅ Setting ${data.output.ideas.length} campaign ideas to state`);
        setIdeas(data.output.ideas);
      } else {
        console.error("❌ Invalid response structure:", {
          hasOutput: !!data.output,
          outputType: typeof data.output,
          outputValue: data.output
        });
        throw new Error("Ugyldig respons fra server - mangler kampanjeidéer");
      }
    } catch (err: any) {
      setError(err.message || "En feil oppstod");
      console.error("Feil ved generering:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h2 className="text-xl font-semibold">AI Kampanjegenerator</h2>
      </div>

      <p className="text-gray-600 text-sm mb-6">
        Få AI-genererte kampanjeidéer skreddersydd for din bedrift
      </p>

      {/* Input skjema */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hva er målet med kampanjen? *
          </label>
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="F.eks: Øke bookinger med 30%, Selge flere coating-pakker"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Periode
            </label>
            <input
              type="text"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder="Q1 2025, Vår 2025, osv."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Målgruppe (valgfritt)
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Bilentusiaster, Firmabiler, osv."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={loading}
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !goal.trim()}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Genererer kampanjeidéer...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generer AI-kampanjeidéer</span>
            </>
          )}
        </button>
      </div>

      {/* Rate limit info */}
      {rateLimitInfo && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Du har brukt {rateLimitInfo.used} av {rateLimitInfo.limit} AI-kall i dag ({rateLimitInfo.tier}-plan).
            {rateLimitInfo.used >= rateLimitInfo.limit && (
              <span className="block mt-2 font-medium">
                Oppgrader planen din for flere AI-kall per dag.
              </span>
            )}
          </p>
        </div>
      )}

      {/* Error melding */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Resultater */}
      {ideas.length > 0 ? (
        <div className="space-y-6">
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 text-green-600">
              ✅ {ideas.length} AI-genererte kampanjeidéer lastet inn!
            </h3>
          </div>

          {ideas.map((idea, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-900">
                  {idea.title}
                </h4>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                  Idé {index + 1}
                </span>
              </div>

              <p className="text-gray-700 mb-4">{idea.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Target className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Målgruppe:</span>
                  <span className="font-medium">{idea.targetAudience}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Estimert rekkevidde:</span>
                  <span className="font-medium">{idea.estimatedReach.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Foreslått budsjett:</span>
                  <span className="font-medium">{idea.suggestedBudget.toLocaleString()} kr</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Varighet:</span>
                  <span className="font-medium">{idea.duration}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Kanaler:</p>
                <div className="flex flex-wrap gap-2">
                  {idea.channels.map((channel, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                    >
                      {channel}
                    </span>
                  ))}
                </div>
              </div>

              {idea.keyMessages && idea.keyMessages.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Nøkkelmeldinger:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    {idea.keyMessages.map((message, i) => (
                      <li key={i} className="text-sm text-gray-600">
                        {message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-4 pt-4 border-t flex gap-2">
                <button 
                  onClick={() => {
                    const ideaText = `${idea.title}\n\n${idea.description}\n\nMålgruppe: ${idea.targetAudience}\nBudsjett: ${idea.suggestedBudget} kr\nVarighet: ${idea.duration}\n\nNøkkelmeldinger:\n${idea.keyMessages.join('\n')}`;
                    navigator.clipboard.writeText(ideaText);
                    alert('Kampanjeidé kopiert! 📋');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Kopier idé
                </button>
                <button 
                  onClick={() => handleCreateCampaign(idea)}
                  disabled={creatingCampaign}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  {creatingCampaign && selectedIdea === idea ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Oppretter...
                    </span>
                  ) : (
                    "Opprett kampanje"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center text-gray-500">
          {loading ? "Genererer..." : "Ingen kampanjeidéer ennå. Klikk 'Generer' for å starte!"}
        </div>
      )}

      {/* Info om første gangs bruk */}
      {ideas.length === 0 && !loading && !error && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Tips:</strong> Vær så spesifikk som mulig med målet ditt. 
            Jo mer detaljer, jo bedre kampanjeidéer får du fra AI!
          </p>
        </div>
      )}
    </div>
  );
}
