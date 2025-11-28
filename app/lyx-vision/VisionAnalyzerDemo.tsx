// app/lyx-vision/VisionAnalyzerDemo.tsx
// Interactive demo component for LYX Vision image and text analysis
"use client";

import React, { useState } from "react";
import MessageAnalysisCard from "@/components/MessageAnalysisCard";
import { useMessageAnalysis } from "@/lib/useMessageAnalysis";

// Demo organization ID
const DEMO_ORG_ID = "demo-org";

// Sample demo images (placeholder URLs)
const SAMPLE_IMAGES = [
  "https://example.com/car-hood-scratch.jpg",
  "https://example.com/car-swirl-marks.jpg",
  "https://example.com/car-clean-coating.jpg",
];

export default function VisionAnalyzerDemo() {
  const [textInput, setTextInput] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");

  const { loading, error, result, analyzeMessage, clearResult } = useMessageAnalysis({
    orgId: DEMO_ORG_ID,
    includeEstimates: true,
  });

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImageUrls((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (!textInput.trim() && imageUrls.length === 0) {
      return;
    }

    try {
      await analyzeMessage(textInput.trim() || null, imageUrls);
    } catch {
      // Error is handled by the hook
    }
  };

  const handleUseSample = () => {
    setTextInput(
      "Hei! Jeg vil gjerne bestille time for keramisk coating på min Tesla Model 3. Har dere ledig neste uke? Ser at lakken har fått noen riper på panseret som jeg gjerne vil ha fikset først."
    );
    setImageUrls([SAMPLE_IMAGES[0]]);
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h3 className="mb-4 text-lg font-semibold text-slate-100">
          Test AI-analysen
        </h3>

        {/* Text Input */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Kundemelding (tekst)
          </label>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Skriv en melding fra en kunde her..."
            rows={4}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        {/* Image URLs */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Bilder (URL-er)
          </label>
          
          {/* Current images */}
          {imageUrls.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {imageUrls.map((url, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-1.5 text-xs"
                >
                  <span className="max-w-[200px] truncate text-slate-300">
                    {url}
                  </span>
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="text-slate-400 hover:text-red-400"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add image input */}
          <div className="flex gap-2">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="https://example.com/bilde.jpg"
              className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <button
              type="button"
              onClick={handleAddImage}
              disabled={!newImageUrl.trim()}
              className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-600 disabled:opacity-50"
            >
              Legg til
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading || (!textInput.trim() && imageUrls.length === 0)}
            className="rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-purple-500 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Analyserer...
              </span>
            ) : (
              "Analyser melding"
            )}
          </button>

          <button
            type="button"
            onClick={handleUseSample}
            className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 hover:border-slate-500 hover:text-slate-100"
          >
            Bruk eksempel
          </button>

          {result && (
            <button
              type="button"
              onClick={clearResult}
              className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-400 hover:border-slate-500 hover:text-slate-300"
            >
              Nullstill
            </button>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 rounded-lg bg-red-900/30 border border-red-700/50 px-4 py-3">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-100">
            Analyseresultat
          </h3>
          <MessageAnalysisCard
            analysisId={result.analysisId}
            summary={result.summary}
            recommendedAction={result.recommendedAction}
            textAnalysis={result.textAnalysis}
            imageAnalyses={result.imageAnalyses}
            paintCondition={result.paintCondition}
            workEstimate={result.workEstimate}
            analyzedAt={result.analyzedAt}
            onClose={clearResult}
          />
        </div>
      )}

      {/* Info Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <h4 className="mb-3 text-sm font-semibold text-slate-200">
          Hva analyserer LYX Vision?
        </h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-medium text-purple-300">
              📝 Tekstanalyse
            </p>
            <ul className="space-y-1 text-xs text-slate-400">
              <li>• Kundens intensjon (booking, spørsmål, klage)</li>
              <li>• Interesserte tjenester</li>
              <li>• Sentimentanalyse (positiv/negativ)</li>
              <li>• Hastegradsdeteksjon</li>
              <li>• Ekstraksjon av dato, tid, kontaktinfo</li>
              <li>• Automatisk svarforslag</li>
            </ul>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-purple-300">
              📸 Bildeanalyse
            </p>
            <ul className="space-y-1 text-xs text-slate-400">
              <li>• Riper, svirlmerker, bulker</li>
              <li>• Oksidering og vannflekker</li>
              <li>• Coating-tilstand</li>
              <li>• Lakkscore (1-10)</li>
              <li>• Tidsestimat for reparasjon</li>
              <li>• Behandlingsanbefalinger</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
