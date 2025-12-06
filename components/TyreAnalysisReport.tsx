// components/TyreAnalysisReport.tsx
"use client";

import React from "react";
import type { TyreCondition } from "@/types/tyre";

interface Position {
  position: string;
  tread_depth_mm: number;
  wear_status: string;
  notes?: string;
}

interface AnalysisResult {
  season?: string;
  dot_year?: number;
  positions: Position[];
  overall_recommendation: string;
  reasoning: string;
  recommended_action?: string;
}

interface Props {
  result: AnalysisResult;
  onClose: () => void;
  onPrepareBooking?: () => void;
  onSendToCustomer?: () => void;
}

const POSITION_LABELS: Record<string, string> = {
  front_left: "Venstre foran",
  front_right: "Høyre foran",
  rear_left: "Venstre bak",
  rear_right: "Høyre bak",
};

const SEASON_LABELS: Record<string, string> = {
  summer: "Sommerdekk",
  winter: "Vinterdekk",
  pigg: "Piggdekk",
  allseason: "Helårsdekk",
};

export default function TyreAnalysisReport({
  result,
  onClose,
  onPrepareBooking,
  onSendToCustomer,
}: Props) {
  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "ok":
        return "bg-green-100 text-green-800 border-green-200";
      case "bør_byttes_snart":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "må_byttes":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRecommendationText = (recommendation: string) => {
    switch (recommendation) {
      case "ok":
        return "✓ Dekkene er i god stand";
      case "bør_byttes_snart":
        return "⚠️ Dekkene bør byttes snart";
      case "må_byttes":
        return "❌ Dekkene må byttes";
      default:
        return recommendation;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ok":
        return "text-green-600";
      case "warn":
        return "text-yellow-600";
      case "critical":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const avgDepth =
    result.positions.reduce((sum, p) => sum + p.tread_depth_mm, 0) /
    result.positions.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2">AI Dekkanalyse</h3>
        <p className="text-sm text-gray-600">Analyse fullført</p>
      </div>

      {/* Overall Recommendation */}
      <div
        className={`border-2 rounded-lg p-4 ${getRecommendationColor(result.overall_recommendation)}`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-lg">
            {getRecommendationText(result.overall_recommendation)}
          </span>
          <span className="text-2xl font-bold">{avgDepth.toFixed(1)} mm</span>
        </div>
        <p className="text-sm mt-2">{result.reasoning}</p>
      </div>

      {/* Season & DOT */}
      <div className="grid grid-cols-2 gap-4">
        {result.season && (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-600">Type</div>
            <div className="text-sm font-medium">
              {SEASON_LABELS[result.season] || result.season}
            </div>
          </div>
        )}
        {result.dot_year && (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-600">Produksjonsår</div>
            <div className="text-sm font-medium">{result.dot_year}</div>
          </div>
        )}
      </div>

      {/* Position Details */}
      <div className="space-y-3">
        <h4 className="font-semibold text-sm">Mønsterdybde per hjul</h4>
        <div className="space-y-2">
          {result.positions.map((pos, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
            >
              <div className="flex-1">
                <div className="font-medium text-sm">
                  {POSITION_LABELS[pos.position] || pos.position}
                </div>
                {pos.notes && (
                  <div className="text-xs text-gray-600 mt-1">{pos.notes}</div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${getStatusColor(pos.wear_status)}`}>
                  {pos.wear_status === "ok" ? "✓ OK" : 
                   pos.wear_status === "warn" ? "⚠️ Advarsel" : 
                   "❌ Kritisk"}
                </span>
                <span className="text-lg font-bold">{pos.tread_depth_mm} mm</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Chart */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-xs text-gray-600 mb-3">Mønsterdybde-graf</div>
        <div className="flex items-end justify-between h-32 gap-2">
          {result.positions.map((pos, idx) => {
            const percentage = (pos.tread_depth_mm / 10) * 100;
            const color =
              pos.wear_status === "ok"
                ? "bg-green-500"
                : pos.wear_status === "warn"
                ? "bg-yellow-500"
                : "bg-red-500";

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gray-200 rounded relative" style={{ height: "100%" }}>
                  <div
                    className={`absolute bottom-0 w-full rounded ${color} transition-all`}
                    style={{ height: `${percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 text-center">
                  {pos.position.split("_")[0] === "front" ? "F" : "B"}
                  {pos.position.split("_")[1] === "left" ? "V" : "H"}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>0 mm</span>
          <span>5 mm</span>
          <span>10 mm</span>
        </div>
      </div>

      {/* Recommended Action */}
      {result.recommended_action && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="font-semibold text-sm mb-1">💡 Anbefalt handling</div>
          <p className="text-sm text-gray-700">{result.recommended_action}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2 pt-4">
        {result.overall_recommendation !== "ok" && onPrepareBooking && (
          <button
            onClick={onPrepareBooking}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            📅 Klargjør booking for dekkskift
          </button>
        )}
        {onSendToCustomer && (
          <button
            onClick={onSendToCustomer}
            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            📧 Send rapport til kunde
          </button>
        )}
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Lukk
        </button>
      </div>
    </div>
  );
}
