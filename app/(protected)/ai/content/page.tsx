"use client";

import { useState } from "react";
import { useOrgPlan } from "@/components/OrgPlanContext";
import { buildOrgApiUrl } from "@/lib/apiConfig";
import AIChatInterface from "@/components/ai/AIChatInterface";
import {
  FileText,
  Zap,
  Copy,
  Eye,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader2,
  Edit3,
  MessageSquare,
} from "lucide-react";

export default function AIContentPage() {
  const { org } = useOrgPlan();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [contentType, setContentType] = useState("landing-page");
  const [service, setService] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [tone, setTone] = useState("profesjonell");

  const handleGenerate = async () => {
    if (!org?.id) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const path = contentType === "landing-page" 
        ? "ai/content/landing-page"
        : contentType === "blog"
        ? "ai/content/blog-post"
        : "ai/content/sms";

      const endpoint = buildOrgApiUrl(org.id, path);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service,
          targetAudience,
          tone,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Kunne ikke generere innhold");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Noe gikk galt");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      const content = result.content || result.text || JSON.stringify(result, null, 2);
      navigator.clipboard.writeText(content);
      alert("Kopiert til utklippstavlen!");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            AI Innhold Assistent
          </h1>
        </div>
        <p className="text-gray-600">
          AI-drevet innholdsgenerering for web, blogg og markedsføring
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-amber-600" />
            <span className="text-sm text-gray-600">Generert innhold</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">234</p>
          <p className="text-xs text-gray-500 mt-1">Totalt</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Edit3 className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Blogginnlegg</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">47</p>
          <p className="text-xs text-gray-500 mt-1">Publisert</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Visninger</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">12.4k</p>
          <p className="text-xs text-gray-500 mt-1">På AI-innhold</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-gray-600">Tid spart</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">86t</p>
          <p className="text-xs text-gray-500 mt-1">Med AI</p>
        </div>
      </div>

      {/* Main Content - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: AI Chat */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Chat med Innhold AI
          </h2>
          <AIChatInterface
            orgId={org?.id || ""}
            context="content"
            welcomeMessage="Hei! Jeg er din AI innholds-assistent. Jeg kan hjelpe deg med å lage landingssider, blogginnlegg, SMS-meldinger, sosiale medier-poster og annet markedsføringsinnhold. Hva skal vi lage?"
            placeholder="Spør om innholdshjelp..."
          />
        </div>

        {/* Right: Content Generator */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-amber-600" />
              Generer Innhold
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Innholdstype
                </label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="landing-page">Landingsside</option>
                  <option value="blog">Blogginnlegg</option>
                  <option value="sms">SMS-melding</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tjeneste/tema
                </label>
                <input
                  type="text"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  placeholder="F.eks. 'coating', 'dekkhotell', 'detailing'"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                  placeholder="F.eks. 'bilentusiaster', 'vanlige bilister'"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="profesjonell">Profesjonell</option>
                  <option value="entusiastisk">Entusiastisk</option>
                  <option value="avslappet">Avslappet</option>
                  <option value="prestisje">Prestisje/luksus</option>
                </select>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !service || !org?.id}
                className="w-full px-4 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Genererer innhold...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generer Innhold
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
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <h3 className="font-semibold text-amber-900">AI-generert innhold</h3>
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className="px-3 py-1 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors flex items-center gap-1 text-sm"
                    >
                      <Copy className="w-4 h-4" />
                      Kopier
                    </button>
                  </div>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap">
                    {result.content || result.text || JSON.stringify(result, null, 2)}
                  </div>
                </div>
              </div>
            )}

            {!loading && !result && !error && (
              <div className="mt-4 text-center py-8">
                <Edit3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  Fyll ut feltene over og få AI-generert innhold
                </p>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6">
            <h3 className="font-semibold text-amber-900 mb-4">
              Hva AI kan hjelpe med
            </h3>
            <div className="space-y-2 text-sm text-amber-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Landingssider med call-to-action</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>SEO-optimaliserte blogginnlegg</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Korte SMS- og e-postmeldinger</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Sosiale medier-innlegg</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Produktbeskrivelser og tjenesteinfo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
