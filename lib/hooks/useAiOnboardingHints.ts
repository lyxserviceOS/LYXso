// lib/hooks/useAiOnboardingHints.ts
// Custom hook for real-time AI hints during onboarding

import { useState, useEffect, useRef, useCallback } from "react";
import type { OnboardingStepData } from "@/types/ai-onboarding";

export interface AiHint {
  type: "service" | "pricing" | "capacity" | "hours" | "general";
  title: string;
  message: string;
  relevance?: number;
}

interface UseAiOnboardingHintsOptions {
  enabled?: boolean;
  debounceMs?: number;
}

interface UseAiOnboardingHintsReturn {
  hints: AiHint[];
  loading: boolean;
  error: string | null;
  hasHints: boolean;
}

/**
 * Hook for generating AI hints during onboarding steps
 * 
 * TODO: Create dedicated /api/orgs/:orgId/ai/onboarding/hints endpoint in lyx-api
 * This should be a lightweight endpoint that returns quick suggestions
 * without the full AI onboarding flow complexity
 * 
 * For now, generates hints client-side based on onboarding data
 */
export function useAiOnboardingHints(
  orgId: string | null,
  onboardingData: Partial<OnboardingStepData>,
  options: UseAiOnboardingHintsOptions = {}
): UseAiOnboardingHintsReturn {
  const { enabled = true, debounceMs = 2000 } = options;

  const [hints, setHints] = useState<AiHint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastRequestRef = useRef<string>("");

  const generateClientSideHints = useCallback(
    (data: Partial<OnboardingStepData>): AiHint[] => {
      const generatedHints: AiHint[] = [];

      // Industry-based hints
      if (data.industries && data.industries.length > 0) {
        const industry = data.industries[0];

        if (industry === "car_detailing") {
          generatedHints.push({
            type: "service",
            title: "Populære tjenester for bilpleie",
            message:
              "Basert på bransjen din anbefaler vi: Interiørvask, Eksteriørpolering, Keramisk belegg, og Vindusvask. Disse tjenestene er ofte etterspurt av bilentusiaster.",
            relevance: 0.9,
          });
        } else if (industry === "hair_salon") {
          generatedHints.push({
            type: "service",
            title: "Populære tjenester for frisører",
            message:
              "Vi anbefaler: Klipp, Fargelegging, Styling, og Behandlinger. Vurder å tilby pakker som kombinerer flere tjenester.",
            relevance: 0.9,
          });
        } else if (industry === "tyre_hotel") {
          generatedHints.push({
            type: "service",
            title: "Dekkhotell-tjenester",
            message:
              "Tilby dekkskift, dekklagring, og balansering. Mange kunder verdsetter sesongbaserte pakker.",
            relevance: 0.9,
          });
        } else if (industry === "coating") {
          generatedHints.push({
            type: "service",
            title: "Coating-spesialisering",
            message:
              "Keramisk coating, PPF (Paint Protection Film), og vinylwrap er høyverdi-tjenester. Vurder å fremheve garantier og langsiktig beskyttelse.",
            relevance: 0.9,
          });
        }
      }

      // Price level hints
      if (data.priceLevel) {
        if (data.priceLevel === "budget") {
          generatedHints.push({
            type: "pricing",
            title: "Budsjett-posisjonering",
            message:
              "For budsjett-nivå: Fokuser på høyt volum, rask gjennomføring, og pakketilbud. Vurder lojalitetsprogrammer for å beholde kunder.",
            relevance: 0.8,
          });
        } else if (data.priceLevel === "premium") {
          generatedHints.push({
            type: "pricing",
            title: "Premium-posisjonering",
            message:
              "Premium-kunder forventer høy kvalitet, personlig service, og ekstra oppmerksomhet. Vurder å inkludere gratis tilleggstjenester.",
            relevance: 0.8,
          });
        } else if (data.priceLevel === "normal") {
          generatedHints.push({
            type: "pricing",
            title: "Standard prisnivå",
            message:
              "Balanser mellom kvalitet og pris. Tilby både enkle tjenester og premium-pakker for å tiltrekke et bredt kundegrunnlag.",
            relevance: 0.7,
          });
        }
      }

      // Capacity hints
      if (data.capacityHeavyJobsPerDay && data.capacityHeavyJobsPerDay > 8) {
        generatedHints.push({
          type: "capacity",
          title: "Høy kapasitet",
          message:
            "Med høy kapasitet bør du vurdere et robust booking-system og automatisering av kundehenvendelser. Dette vil spare tid og redusere administrative oppgaver.",
          relevance: 0.85,
        });
      }

      // Location type hints
      if (data.locationType === "mobile") {
        generatedHints.push({
          type: "general",
          title: "Mobil tjeneste",
          message:
            "For mobile tjenester: Husk å inkludere reisekostnader i prissettingen, og vurder geografiske soner for levering.",
          relevance: 0.75,
        });
      } else if (data.locationType === "both") {
        generatedHints.push({
          type: "general",
          title: "Hybrid-modell",
          message:
            "Ved å tilby både fast lokasjon og mobil tjeneste kan du nå flere kunder. Vurder å ha ulike priser for de to tilbudene.",
          relevance: 0.8,
        });
      }

      // Opening hours hints
      if (data.openingHours) {
        const weekendOpen =
          data.openingHours.saturday !== null || data.openingHours.sunday !== null;
        if (weekendOpen) {
          generatedHints.push({
            type: "hours",
            title: "Helgeåpent",
            message:
              "Helgeåpningstider kan tiltrekke kunder som jobber hverdager. Vurder å legge til et helgetillegg på 10-20% for å kompensere for helgearbeid.",
            relevance: 0.7,
          });
        }
      }

      // Services hints
      if (data.selectedServices && data.selectedServices.length > 10) {
        generatedHints.push({
          type: "service",
          title: "Stort tjeneste-utvalg",
          message:
            "Med mange tjenester bør du vurdere å gruppere dem i kategorier for bedre oversikt. Dette gjør det lettere for kunder å finne det de trenger.",
          relevance: 0.75,
        });
      }

      return generatedHints;
    },
    []
  );

  const fetchHints = useCallback(async () => {
    if (!enabled || !orgId) {
      setHints([]);
      return;
    }

    // Create a cache key from relevant data
    const cacheKey = JSON.stringify({
      industries: onboardingData.industries,
      locationType: onboardingData.locationType,
      priceLevel: onboardingData.priceLevel,
      selectedServicesLength: onboardingData.selectedServices?.length || 0,
      capacityHeavyJobsPerDay: onboardingData.capacityHeavyJobsPerDay,
      weekendOpen:
        onboardingData.openingHours?.saturday !== null ||
        onboardingData.openingHours?.sunday !== null,
    });

    // Skip if this is the same request as before
    if (cacheKey === lastRequestRef.current) {
      return;
    }

    lastRequestRef.current = cacheKey;

    // Cancel any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call when backend endpoint is ready
      // const url = buildOrgApiUrl(orgId, "ai/onboarding/hints");
      // const response = await fetch(url, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(onboardingData),
      //   signal: abortControllerRef.current.signal,
      // });
      // const data = await response.json();
      // setHints(data.hints);

      // Client-side hint generation (temporary solution)
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay
      const generatedHints = generateClientSideHints(onboardingData);
      setHints(generatedHints);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError("Could not load AI hints");
        setHints([]);
      }
    } finally {
      setLoading(false);
    }
  }, [enabled, orgId, onboardingData, generateClientSideHints]);

  // Debounced fetch
  useEffect(() => {
    if (!enabled) {
      setHints([]);
      setLoading(false);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchHints();
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [fetchHints, debounceMs, enabled]);

  // Cleanup
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
