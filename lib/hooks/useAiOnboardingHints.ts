// lib/hooks/useAiOnboardingHints.ts
// Hook for getting real-time AI hints during onboarding

import { useState, useEffect, useRef, useCallback } from "react";
import type { OnboardingStepData } from "@/types/ai-onboarding";
import { getApiBaseUrl } from "@/lib/apiConfig";

const API_BASE_URL = getApiBaseUrl();

// TODO: Create dedicated /api/orgs/:orgId/ai/onboarding/hints endpoint in lyx-api
// This should be a lightweight endpoint that returns quick suggestions
// without the full AI onboarding flow complexity

export interface AiHint {
  type: "service" | "pricing" | "capacity" | "hours" | "general";
  title: string;
  message: string;
  relevance: number; // 0-1, how relevant this hint is
}

export interface AiHintsResponse {
  hints: AiHint[];
  confidence: number;
}

interface UseAiOnboardingHintsOptions {
  enabled: boolean;
  debounceMs?: number;
}

export function useAiOnboardingHints(
  orgId: string | null,
  onboardingData: Partial<OnboardingStepData>,
  options: UseAiOnboardingHintsOptions = { enabled: true, debounceMs: 2000 }
) {
  const [hints, setHints] = useState<AiHint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastRequestRef = useRef<string>("");

  const fetchHints = useCallback(async () => {
    if (!orgId || !options.enabled) {
      return;
    }

    // Check if we have enough data to generate hints
    const hasData = 
      onboardingData.industries && onboardingData.industries.length > 0;

    if (!hasData) {
      setHints([]);
      return;
    }

    // Create a cache key from the current data
    const cacheKey = JSON.stringify({
      industries: onboardingData.industries,
      locationType: onboardingData.locationType,
      priceLevel: onboardingData.priceLevel,
      selectedServicesLength: onboardingData.selectedServices?.length || 0,
    });

    // Skip if we already fetched hints for this exact data
    if (cacheKey === lastRequestRef.current) {
      return;
    }

    lastRequestRef.current = cacheKey;

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      // TODO: Replace this with dedicated hints endpoint
      // For now, we generate hints client-side based on the data
      // This avoids hitting the full AI onboarding endpoint unnecessarily
      
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      const generatedHints = generateClientSideHints(onboardingData);
      setHints(generatedHints);
      setLoading(false);

      /* 
      // Future implementation when backend endpoint is ready:
      const response = await fetch(
        `${API_BASE_URL}/api/orgs/${orgId}/ai/onboarding/hints`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            industries: onboardingData.industries || [],
            locationType: onboardingData.locationType,
            selectedServices: onboardingData.selectedServices || [],
            priceLevel: onboardingData.priceLevel,
            capacityHeavyJobsPerDay: onboardingData.capacityHeavyJobsPerDay,
          }),
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch AI hints");
      }

      const data: AiHintsResponse = await response.json();
      setHints(data.hints);
      setLoading(false);
      */
    } catch (err: any) {
      if (err.name === "AbortError") {
        // Request was cancelled, ignore
        return;
      }
      console.error("Error fetching AI hints:", err);
      setError("Kunne ikke hente AI-forslag");
      setHints([]);
      setLoading(false);
    }
  }, [orgId, onboardingData, options.enabled]);

  // Debounced effect to fetch hints
  useEffect(() => {
    if (!options.enabled) {
      setHints([]);
      return;
    }

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      fetchHints();
    }, options.debounceMs || 2000);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [fetchHints, options.enabled, options.debounceMs]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    hints,
    loading,
    error,
    hasHints: hints.length > 0,
  };
}

// Client-side hint generation (temporary until backend endpoint is ready)
function generateClientSideHints(data: Partial<OnboardingStepData>): AiHint[] {
  const hints: AiHint[] = [];
  const industry = data.industries?.[0];

  // Industry-specific service suggestions
  if (industry === "car_detailing") {
    hints.push({
      type: "service",
      title: "Populære tjenester for bilpleie",
      message: "Basert på bransjen din anbefaler vi: Interiørvask, Eksteriørpolering, Keramisk belegg, og Lakkrensing.",
      relevance: 0.9,
    });
  } else if (industry === "hair_salon") {
    hints.push({
      type: "service",
      title: "Anbefalte frisørtjenester",
      message: "Vurder å tilby: Klipp, Farge, Styling, og Behandlinger som standard pakker.",
      relevance: 0.9,
    });
  } else if (industry) {
    hints.push({
      type: "service",
      title: "Standard tjenester",
      message: "Vi anbefaler å starte med 3-5 grunnleggende tjenester og utvide etter behov.",
      relevance: 0.7,
    });
  }

  // Pricing hints
  if (data.priceLevel === "budget") {
    hints.push({
      type: "pricing",
      title: "Budsjettvennlige priser",
      message: "Med budsjett-nivå bør du fokusere på høyt volum og effektive prosesser. Vurder pakketilbud for å øke gjennomsnittlig ordresum.",
      relevance: 0.8,
    });
  } else if (data.priceLevel === "premium") {
    hints.push({
      type: "pricing",
      title: "Premium-posisjonering",
      message: "Premium-kunder forventer høy kvalitet og ekstra service. Vurder å inkludere tilleggstjenester som standard.",
      relevance: 0.8,
    });
  }

  // Capacity hints
  if (data.capacityHeavyJobsPerDay && data.capacityHeavyJobsPerDay > 5) {
    hints.push({
      type: "capacity",
      title: "Høy kapasitet",
      message: "Med kapasitet for mange jobber per dag, sørg for god planlegging og nok personale. Vurder booking-system med automatisk kapasitetsstyring.",
      relevance: 0.7,
    });
  } else if (data.capacityHeavyJobsPerDay && data.capacityHeavyJobsPerDay <= 2) {
    hints.push({
      type: "capacity",
      title: "Fokusert kapasitet",
      message: "Lav kapasitet betyr du kan fokusere på kvalitet over kvantitet. Perfekt for premium-tjenester.",
      relevance: 0.7,
    });
  }

  // Location type hints
  if (data.locationType === "mobile") {
    hints.push({
      type: "general",
      title: "Mobil virksomhet",
      message: "Som mobil tjeneste er fleksibilitet viktig. Vurder å legge til reisekostnader basert på avstand.",
      relevance: 0.8,
    });
  } else if (data.locationType === "both") {
    hints.push({
      type: "general",
      title: "Hybrid modell",
      message: "Med både fast og mobil tjeneste kan du nå flere kunder. Vurder ulik prissetting for de to alternativene.",
      relevance: 0.8,
    });
  }

  // Opening hours hints
  const hasWeekendHours = data.openingHours?.saturday || data.openingHours?.sunday;
  if (hasWeekendHours) {
    hints.push({
      type: "hours",
      title: "Helgeåpent",
      message: "Åpent i helgene gir økt tilgjengelighet for kunder. Vurder helgetillegg eller spesialtilbud.",
      relevance: 0.6,
    });
  }

  // Sort by relevance
  return hints.sort((a, b) => b.relevance - a.relevance).slice(0, 4); // Max 4 hints
}
