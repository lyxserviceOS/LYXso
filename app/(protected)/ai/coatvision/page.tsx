"use client";

import { useState, useRef } from "react";
import { useOrgPlan } from "@/components/OrgPlanContext";
import { buildOrgApiUrl } from "@/lib/apiConfig";
import {
  Camera,
  Upload,
  Sparkles,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Image as ImageIcon,
  Loader2,
  Download,
} from "lucide-react";

interface CoatingAnalysis {
  id: string;
  image_url: string;
  analysis: {
    coverage: number;
    quality: string;
    defects: Array<{
      type: string;
      severity: string;
      location: string;
      confidence: number;
    }>;
    recommendations: string[];
    overallScore: number;
  };
  timestamp: string;
}

export default function CoatVisionPage() {
  const { org } = useOrgPlan();
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<CoatingAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Vennligst velg en bildefil");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("Bildet er for stort. Maksimal størrelse er 10MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Analyze image
    await analyzeImage(file);
  };

  const analyzeImage = async (file: File) => {
    if (!org?.id) return;

    setAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("orgId", org.id);

      const endpoint = buildOrgApiUrl(org.id, "ai/coatvision/analyze");
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Kunne ikke analysere bilde");
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err: any) {
      setError(err.message || "Noe gikk galt");
    } finally {
      setAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "text-red-600 bg-red-50";
      case "high":
        return "text-orange-600 bg-orange-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getQualityIcon = (quality: string) => {
    switch (quality.toLowerCase()) {
      case "excellent":
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "good":
        return <CheckCircle className="w-6 h-6 text-blue-600" />;
      case "fair":
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
      case "poor":
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-600" />;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">CoatVision™</h1>
        </div>
        <p className="text-gray-600">
          AI-drevet coating analyse med bildeopplasting og defekt-deteksjon
        </p>
      </div>

      {/* Upload Area */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Last opp coating-bilde
        </h2>

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {imagePreview ? (
            <div className="space-y-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-64 mx-auto rounded-lg shadow-md"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setImagePreview(null);
                  setAnalysis(null);
                  setError(null);
                }}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Last opp nytt bilde
              </button>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-700 font-medium mb-2">
                Klikk for å laste opp coating-bilde
              </p>
              <p className="text-sm text-gray-500">
                Støtter JPG, PNG, WEBP (maks 10MB)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Analyzing */}
      {analyzing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            <div>
              <p className="font-semibold text-blue-900">Analyserer bilde...</p>
              <p className="text-sm text-blue-700">
                AI-en undersøker coating for defekter og kvalitet
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Analyse Resultat
              </h2>
              {getQualityIcon(analysis.analysis.quality)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                <p className="text-sm text-blue-700 mb-1">Total Score</p>
                <p className="text-3xl font-bold text-blue-900">
                  {analysis.analysis.overallScore}/100
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                <p className="text-sm text-purple-700 mb-1">Kvalitet</p>
                <p className="text-xl font-bold text-purple-900 capitalize">
                  {analysis.analysis.quality}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                <p className="text-sm text-green-700 mb-1">Dekning</p>
                <p className="text-3xl font-bold text-green-900">
                  {analysis.analysis.coverage}%
                </p>
              </div>
            </div>
          </div>

          {/* Defects */}
          {analysis.analysis.defects.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Defekter funnet ({analysis.analysis.defects.length})
              </h2>

              <div className="space-y-3">
                {analysis.analysis.defects.map((defect, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(
                              defect.severity
                            )}`}
                          >
                            {defect.severity.toUpperCase()}
                          </span>
                          <span className="font-semibold text-gray-900">
                            {defect.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Lokasjon: {defect.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Tillit</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {Math.round(defect.confidence * 100)}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {analysis.analysis.recommendations.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Anbefalinger
              </h2>

              <ul className="space-y-2">
                {analysis.analysis.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Last ned rapport (PDF)
            </button>
            <button
              onClick={() => {
                setImagePreview(null);
                setAnalysis(null);
                setError(null);
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Ny analyse
            </button>
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="mt-8 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
        <h3 className="font-semibold text-purple-900 mb-4">
          Slik fungerer CoatVision™
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Camera className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-900">1. Ta bilde</span>
            </div>
            <p className="text-sm text-purple-700">
              Last opp et bilde av coating-overflaten
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-900">2. AI analyserer</span>
            </div>
            <p className="text-sm text-purple-700">
              Avansert AI detekterer defekter og kvalitet
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-900">3. Få resultat</span>
            </div>
            <p className="text-sm text-purple-700">
              Detaljert rapport med anbefalinger
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
