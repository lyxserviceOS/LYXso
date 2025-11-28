// components/MessageAnalysisCard.tsx
// Component for displaying image and text analysis results
"use client";

import React, { useState } from "react";
import type { ImageTag } from "@/types/vision";

type TextAnalysisData = {
  intent: string;
  serviceInterest: string | null;
  urgency: string;
  sentiment: string;
  entities: Array<{
    type: string;
    value: string;
    confidence: number;
  }>;
  suggestedResponse: string | null;
};

type ImageAnalysisData = {
  imageUrl: string;
  tags: string[];
  confidence: number;
  analysis: string;
  severity: string | null;
  recommendations: string[];
};

type PaintConditionData = {
  score: number;
  description: string;
};

type WorkEstimateData = {
  minHours: number;
  maxHours: number;
  breakdown: Array<{ task: string; hours: number }>;
};

type MessageAnalysisCardProps = {
  analysisId: string;
  summary: string;
  recommendedAction: string;
  textAnalysis?: TextAnalysisData;
  imageAnalyses?: ImageAnalysisData[];
  paintCondition?: PaintConditionData;
  workEstimate?: WorkEstimateData;
  analyzedAt: string;
  onClose?: () => void;
};

const TAG_LABELS: Record<ImageTag, string> = {
  scratch: "Ripe",
  swirl: "Svirlmerke",
  dent: "Bulk",
  chip: "Steinsprut",
  oxidation: "Oksidering",
  water_spot: "Vannflekk",
  contamination: "Forurensning",
  clean: "Ren",
  coated: "Coatet",
  polished: "Polert",
  before: "Før",
  after: "Etter",
};

const INTENT_LABELS: Record<string, string> = {
  booking: "Ønsker å bestille",
  inquiry: "Har spørsmål",
  complaint: "Klage",
  feedback: "Tilbakemelding",
  support: "Trenger hjelp",
  general: "Generell henvendelse",
};

const SENTIMENT_LABELS: Record<string, string> = {
  positive: "Positiv",
  neutral: "Nøytral",
  negative: "Negativ",
};

const SENTIMENT_COLORS: Record<string, string> = {
  positive: "bg-emerald-100 text-emerald-700",
  neutral: "bg-slate-100 text-slate-700",
  negative: "bg-red-100 text-red-700",
};

const URGENCY_COLORS: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-slate-100 text-slate-500",
};

const SEVERITY_COLORS: Record<string, string> = {
  severe: "bg-red-100 text-red-700 border-red-200",
  moderate: "bg-amber-100 text-amber-700 border-amber-200",
  minor: "bg-blue-100 text-blue-700 border-blue-200",
};

function getScoreColor(score: number): string {
  if (score >= 8) return "text-emerald-600";
  if (score >= 6) return "text-amber-600";
  if (score >= 4) return "text-orange-600";
  return "text-red-600";
}

export default function MessageAnalysisCard({
  analysisId,
  summary,
  recommendedAction,
  textAnalysis,
  imageAnalyses,
  paintCondition,
  workEstimate,
  analyzedAt,
  onClose,
}: MessageAnalysisCardProps) {
  const [expandedImage, setExpandedImage] = useState<number | null>(null);

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
            <svg
              className="h-4 w-4 text-purple-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </span>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">AI-analyse</h3>
            <p className="text-xs text-slate-500">
              {new Date(analyzedAt).toLocaleString("nb-NO")}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Summary */}
      <div className="border-b border-slate-100 px-4 py-3">
        <p className="text-sm text-slate-700">{summary}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Anbefaling:</span>
          <span className="text-xs text-purple-600">{recommendedAction}</span>
        </div>
      </div>

      {/* Text Analysis */}
      {textAnalysis && (
        <div className="border-b border-slate-100 px-4 py-3">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Tekstanalyse
          </h4>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700">
              {INTENT_LABELS[textAnalysis.intent] || textAnalysis.intent}
            </span>
            {textAnalysis.serviceInterest && (
              <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                {textAnalysis.serviceInterest}
              </span>
            )}
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${SENTIMENT_COLORS[textAnalysis.sentiment]}`}
            >
              {SENTIMENT_LABELS[textAnalysis.sentiment] || textAnalysis.sentiment}
            </span>
            {textAnalysis.urgency !== "low" && (
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${URGENCY_COLORS[textAnalysis.urgency]}`}
              >
                {textAnalysis.urgency === "high" ? "Haster!" : "Moderat prioritet"}
              </span>
            )}
          </div>

          {/* Extracted entities */}
          {textAnalysis.entities.length > 0 && (
            <div className="mt-3">
              <p className="mb-1 text-xs text-slate-500">Funnet informasjon:</p>
              <div className="flex flex-wrap gap-1.5">
                {textAnalysis.entities.map((entity, idx) => (
                  <span
                    key={idx}
                    className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                  >
                    {entity.type === "date"
                      ? "📅"
                      : entity.type === "time"
                        ? "🕐"
                        : entity.type === "phone"
                          ? "📞"
                          : entity.type === "email"
                            ? "📧"
                            : entity.type === "vehicle"
                              ? "🚗"
                              : "📝"}{" "}
                    {entity.value}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Suggested response */}
          {textAnalysis.suggestedResponse && (
            <div className="mt-3 rounded-lg bg-emerald-50 p-3">
              <p className="mb-1 text-xs font-medium text-emerald-700">Foreslått svar:</p>
              <p className="text-sm text-emerald-800">{textAnalysis.suggestedResponse}</p>
            </div>
          )}
        </div>
      )}

      {/* Image Analyses */}
      {imageAnalyses && imageAnalyses.length > 0 && (
        <div className="border-b border-slate-100 px-4 py-3">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Bildeanalyse ({imageAnalyses.length}{" "}
            {imageAnalyses.length === 1 ? "bilde" : "bilder"})
          </h4>

          {/* Paint condition score */}
          {paintCondition && (
            <div className="mb-3 flex items-center gap-3 rounded-lg bg-slate-50 p-3">
              <div
                className={`text-3xl font-bold ${getScoreColor(paintCondition.score)}`}
              >
                {paintCondition.score}/10
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Lakktilstand</p>
                <p className="text-xs text-slate-500">{paintCondition.description}</p>
              </div>
            </div>
          )}

          {/* Individual image analyses */}
          <div className="space-y-3">
            {imageAnalyses.map((img, idx) => (
              <div
                key={idx}
                className={`rounded-lg border p-3 ${
                  img.severity ? SEVERITY_COLORS[img.severity] : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Thumbnail */}
                  <button
                    onClick={() => setExpandedImage(expandedImage === idx ? null : idx)}
                    className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100"
                  >
                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </button>

                  {/* Analysis details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-1 mb-1">
                      {img.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-white/80 px-1.5 py-0.5 text-[10px] font-medium"
                        >
                          {TAG_LABELS[tag as ImageTag] || tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-current/80">{img.analysis}</p>
                    <div className="mt-1 flex items-center gap-2 text-[10px]">
                      <span>Sikkerhet: {img.confidence}%</span>
                      {img.severity && (
                        <span className="font-medium">
                          {img.severity === "severe"
                            ? "Alvorlig"
                            : img.severity === "moderate"
                              ? "Moderat"
                              : "Mindre"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                {img.recommendations.length > 0 && expandedImage === idx && (
                  <div className="mt-2 border-t border-current/10 pt-2">
                    <p className="mb-1 text-[10px] font-medium">Anbefalinger:</p>
                    <ul className="space-y-0.5 text-xs">
                      {img.recommendations.map((rec, recIdx) => (
                        <li key={recIdx} className="flex items-start gap-1">
                          <span className="text-current/60">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Work Estimate */}
      {workEstimate && workEstimate.breakdown.length > 0 && (
        <div className="px-4 py-3">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Tidsestimat
          </h4>
          <div className="rounded-lg bg-blue-50 p-3">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-blue-700">
                {workEstimate.minHours} - {workEstimate.maxHours}
              </span>
              <span className="text-sm text-blue-600">timer</span>
            </div>
            <div className="mt-2 space-y-1">
              {workEstimate.breakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="text-blue-700">{item.task}</span>
                  <span className="text-blue-600">{item.hours}t</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-slate-50 px-4 py-2">
        <p className="text-[10px] text-slate-400">
          Analyse-ID: {analysisId}
        </p>
      </div>
    </div>
  );
}
