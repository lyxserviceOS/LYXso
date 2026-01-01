// lib/hooks/useAiOnboardingHints.ts
// Hook for real-time AI hints during onboarding

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { OnboardingStepData } from "@/types/ai-onboarding";

export interface AiHint {
  id: string;
  type: "info" | "suggestion" | "warning" | "tip" | "service" | "pricing" | "capacity" | "hours";
  icon: "lightbulb" | "trending-up" | "clock" | "dollar-sign" | "sparkles";
  title: string;
  message: string;
  priority: number;
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

const DEFAULT_DEBOUNCE_MS = 2000;

export function useAiOnboardingHints(
  orgId: string | null,
  onboardingData: Partial<OnboardingStepData>,
  options: UseAiOnboardingHintsOptions = {}
): UseAiOnboardingHintsReturn {
  const { enabled = true, debounceMs = DEFAULT_DEBOUNCE_MS } = options;
  
  const [hints, setHints] = useState<AiHint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasHints, setHasHints] = useState(false);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchedDataRef = useRef<string>("");

  const fetchHints = useCallback(async () => {
    if (!enabled || !orgId) {
      setHints([]);
      setHasHints(false);
      return;
    }

    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Check if data has changed
    const dataHash = JSON.stringify(onboardingData);
    if (dataHash === lastFetchedDataRef.current) {
      return;
    }

    lastFetchedDataRef.current = dataHash;
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch(`/api/orgs/${orgId}/ai/onboarding/hints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(onboardingData),
        signal: controller.signal,
      });

      if (!response.ok) {
        // Gracefully handle 404 or 501 (not implemented)
        if (response.status === 404 || response.status === 501) {
          setHints([]);
          setHasHints(false);
          setLoading(false);
          return;
        }

        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const newHints = data.hints || [];
      
      setHints(newHints);
      setHasHints(newHints.length > 0);
    } catch (err) {
      // Ignore abort errors (expected when component unmounts or new request starts)
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }

      // Gracefully handle network errors
      if (err instanceof Error) {
        console.warn("[useAiOnboardingHints] Failed to fetch hints:", err.message);
        setError(err.message);
      }
      
      setHints([]);
      setHasHints(false);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [enabled, orgId, onboardingData]);

  useEffect(() => {
    if (!enabled) {
      setHints([]);
      setHasHints(false);
      return;
    }

    // Clear previous debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce the fetch
    debounceTimerRef.current = setTimeout(() => {
      fetchHints();
    }, debounceMs);

    return () => {
      // Cleanup on unmount
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchHints, enabled, debounceMs]);

  return {
    hints,
    loading,
    error,
    hasHints,
  };
}
