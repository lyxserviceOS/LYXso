// lib/hooks/useAiOnboarding.ts
// Stub implementation for AI onboarding hook

"use client";

import { useState } from "react";
import type { OnboardingInput, AIOnboardingSession } from "@/types/ai-onboarding";

interface UseAiOnboardingReturn {
  loading: boolean;
  error: string | null;
  session: AIOnboardingSession | null;
  runOnboarding: (orgId: string, input: OnboardingInput) => Promise<void>;
  applyOnboarding: (orgId: string, sessionId: string) => Promise<boolean>;
  retryRun: (orgId: string, input: OnboardingInput) => Promise<void>;
}

/**
 * Hook for AI onboarding functionality
 * This is a stub implementation - AI onboarding features are not yet implemented
 */
export function useAiOnboarding(): UseAiOnboardingReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<AIOnboardingSession | null>(null);

  const runOnboarding = async (orgId: string, input: OnboardingInput) => {
    setLoading(true);
    setError(null);
    
    try {
      // Stub implementation - no actual API call
      console.log("[useAiOnboarding] runOnboarding called (stub):", { orgId, input });
      
      // Simulate a minimal session response
      setSession(null);
      setError("AI onboarding er ikke tilgjengelig for øyeblikket.");
    } catch (err) {
      console.error("[useAiOnboarding] Error:", err);
      setError("Kunne ikke kjøre AI-onboarding");
    } finally {
      setLoading(false);
    }
  };

  const applyOnboarding = async (orgId: string, sessionId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Stub implementation - no actual API call
      console.log("[useAiOnboarding] applyOnboarding called (stub):", { orgId, sessionId });
      return false;
    } catch (err) {
      console.error("[useAiOnboarding] Error:", err);
      setError("Kunne ikke aktivere forslag");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const retryRun = async (orgId: string, input: OnboardingInput) => {
    await runOnboarding(orgId, input);
  };

  return {
    loading,
    error,
    session,
    runOnboarding,
    applyOnboarding,
    retryRun,
  };
}
