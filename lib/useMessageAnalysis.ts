// lib/useMessageAnalysis.ts
// React hook for analyzing messages with images and text
"use client";

import { useState, useCallback } from "react";
import type { AnalyzeRequestBody, AnalyzeResponseBody } from "@/app/api/analyze/route";

type UseMessageAnalysisOptions = {
  orgId: string;
  includeEstimates?: boolean;
};

type AnalysisState = {
  loading: boolean;
  error: string | null;
  result: AnalyzeResponseBody["data"] | null;
};

export function useMessageAnalysis({ orgId, includeEstimates = true }: UseMessageAnalysisOptions) {
  const [state, setState] = useState<AnalysisState>({
    loading: false,
    error: null,
    result: null,
  });

  const analyzeMessage = useCallback(
    async (
      text: string | null,
      imageUrls: string[],
      customerId?: string,
      conversationId?: string
    ) => {
      setState({ loading: true, error: null, result: null });

      try {
        const requestBody: AnalyzeRequestBody = {
          orgId,
          text: text || undefined,
          imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
          customerId,
          conversationId,
          includeEstimates,
        };

        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        const data: AnalyzeResponseBody = await response.json();

        if (!data.success || !data.data) {
          throw new Error(data.error || "Analysis failed");
        }

        setState({ loading: false, error: null, result: data.data });
        return data.data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        setState({ loading: false, error: errorMessage, result: null });
        throw error;
      }
    },
    [orgId, includeEstimates]
  );

  const analyzeImage = useCallback(async (imageUrl: string, inspectionType?: string) => {
    setState({ loading: true, error: null, result: null });

    try {
      const params = new URLSearchParams({ imageUrl });
      if (inspectionType) {
        params.set("inspectionType", inspectionType);
      }

      const response = await fetch(`/api/analyze?${params.toString()}`);
      const data = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || "Image analysis failed");
      }

      // Convert single image result to message analysis format
      const result: AnalyzeResponseBody["data"] = {
        analysisId: `img-${Date.now()}`,
        summary: data.data.analysis,
        recommendedAction: data.data.recommendations[0] || "Ingen spesifikke anbefalinger",
        analyzedAt: data.data.analyzedAt,
        imageAnalyses: [data.data],
        paintCondition: {
          score: data.data.severity === "severe" ? 3 : data.data.severity === "moderate" ? 6 : 9,
          description: data.data.analysis,
        },
      };

      setState({ loading: false, error: null, result });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      setState({ loading: false, error: errorMessage, result: null });
      throw error;
    }
  }, []);

  const clearResult = useCallback(() => {
    setState({ loading: false, error: null, result: null });
  }, []);

  return {
    loading: state.loading,
    error: state.error,
    result: state.result,
    analyzeMessage,
    analyzeImage,
    clearResult,
  };
}
