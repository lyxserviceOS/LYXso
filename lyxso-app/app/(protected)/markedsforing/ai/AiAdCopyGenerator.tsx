// app/(protected)/markedsforing/ai/AiAdCopyGenerator.tsx
"use client";

import { useState } from "react";
import { Sparkles, Loader2, Copy, Check } from "lucide-react";
import { getApiBaseUrl, getDefaultOrgId } from "@/lib/apiConfig";

const API_BASE_URL = getApiBaseUrl();
const ORG_ID = getDefaultOrgId();

type AdVariation = {
  headline: string;
  body: string;
  cta: string;
  tone: string;
};

type GenerateResponse = {
  jobId: string;
  status: string;
  output: {
    variations: AdVariation[];
  };
};

export default function AiAdCopyGenerator() {
  const [goal, setGoal] = useState("");
  const [channel, setChannel] = useState<"meta" | "google" | "email" | "sms">("meta");
  const [loading, setLoading] = useState(false);
  const [variations, setVariations] = useState<AdVariation[]>([]);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!goal.trim()) {
      setError("Vennligst skriv inn et mål for annonsen");
      return;
    }

    setLoading(true);
    setError("");
    setVariations([]);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/orgs/${ORG_ID}/ai/marketing/ad-copy`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            goal: goal.trim(),
            channel,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Kunne ikke generere annonsetekster");
      }

      const data: GenerateResponse = await response.json();

      if (data.output && data.output.variations) {
        setVariations(data.output.variations);
      } else {
        throw new Error("Ugyldig respons fra server");
      }
    } catch (err: any) {
      setError(err.message || "En feil oppstod");
      console.error("Feil ved generering:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getChannelLabel = (ch: string) => {
    const labels: Record<string, string> = {
      meta: "Meta / Facebook",
      google: "Google Ads",
      email: "E-post",
      sms: "SMS",
    };
    return labels[ch] || ch;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold">AI Annonsetekst-generator</h2>
      </div>

      <p className="text-gray-600 text-sm mb-6">
        Generer overbevisende annonsetekster tilpasset ulike kanaler
      </p>

      {/* Input skjema */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hva vil du oppnå med annonsen? *
          </label>
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="F.eks: Få flere bookinger, Selge coating-pakker"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Velg kanal
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {(["meta", "google", "email", "sms"] as const).map((ch) => (
              <button
                key={ch}
                onClick={() => setChannel(ch)}
                className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                  channel === ch
                    ? "border-blue-600 bg-blue-50 text-blue-700 font-medium"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                disabled={loading}
              >
                {getChannelLabel(ch)}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !goal.trim()}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Genererer annonsetekster...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generer AI-annonsetekster</span>
            </>
          )}
        </button>
      </div>

      {/* Error melding */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Resultater */}
      {variations.length > 0 && (
        <div className="space-y-4">
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">
              {variations.length} AI-genererte varianter:
            </h3>
          </div>

          {variations.map((variation, index) => {
            const fullText = `${variation.headline}\n\n${variation.body}\n\n${variation.cta}`;

            return (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    Variant {index + 1}
                  </span>
                  <button
                    onClick={() => copyToClipboard(fullText, index)}
                    className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-green-600">Kopiert!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Kopier alt</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">OVERSKRIFT:</p>
                    <p className="text-lg font-bold text-gray-900">{variation.headline}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">BRØDTEKST:</p>
                    <p className="text-gray-700">{variation.body}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">CALL-TO-ACTION:</p>
                    <p className="text-blue-600 font-medium">{variation.cta}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">TONE:</p>
                    <p className="text-sm text-gray-600 italic">{variation.tone}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t flex gap-2">
                  <button
                    onClick={() => copyToClipboard(variation.headline, index * 10)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    Kopier overskrift
                  </button>
                  <button
                    onClick={() => copyToClipboard(variation.body, index * 10 + 1)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    Kopier brødtekst
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info */}
      {variations.length === 0 && !loading && !error && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            💡 <strong>Tips:</strong> Vi genererer flere varianter slik at du kan A/B-teste 
            og finne den som fungerer best for din målgruppe!
          </p>
        </div>
      )}
    </div>
  );
}
