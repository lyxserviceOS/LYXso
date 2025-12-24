// lib/hooks/useAiOnboardingHints.ts
// Stub implementation for AI onboarding hints hook

"use client";

import { useEffect } from "react";
import type { OnboardingStepData } from "@/types/ai-onboarding";

export interface AiHint {
  type: "service" | "pricing" | "capacity" | "hours" | "general";
  title: string;
  message: string;
}

interface UseAiOnboardingHintsOptions {
  enabled: boolean;
  debounceMs?: number;
}

interface UseAiOnboardingHintsReturn {
  hints: AiHint[];
  loading: boolean;
  error: string | null;
  hasHints: boolean;
}

/**
 * Hook for real-time AI hints during onboarding
 * This is a stub implementation - AI hints features are not yet implemented
 */
export function useAiOnboardingHints(
  orgId: string | null,
  onboardingData: Partial<OnboardingStepData>,
  options: UseAiOnboardingHintsOptions
): UseAiOnboardingHintsReturn {
  useEffect(() => {
    // Stub implementation - no actual API call
    // Don't show any hints in stub mode regardless of enabled state
    // Log for debugging
    if (options.enabled && orgId) {
      console.log("[useAiOnboardingHints] Called (stub):", {
        orgId,
        onboardingData,
        options,
      });
    }
  }, [orgId, onboardingData, options]);

  return {
    hints: [],
    loading: false,
    error: null,
    hasHints: false,
  };
}
