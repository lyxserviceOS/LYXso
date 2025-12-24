// lib/hooks/useAiOnboarding.ts
// Stub hook for AI onboarding functionality
// This hook is currently not implemented

import type { AIOnboardingSession, OnboardingInput } from "@/types/ai-onboarding";

export function useAiOnboarding() {
  return {
    loading: false,
    error: null,
    session: null as AIOnboardingSession | null,
    runOnboarding: async (_orgId: string, _input: OnboardingInput) => {
      // Stub implementation - does nothing
      if (process.env.NODE_ENV === "development") {
        console.warn("useAiOnboarding.runOnboarding is not implemented");
      }
    },
    applyOnboarding: async (_orgId: string, _sessionId: string) => {
      // Stub implementation - returns false
      if (process.env.NODE_ENV === "development") {
        console.warn("useAiOnboarding.applyOnboarding is not implemented");
      }
      return false;
    },
    retryRun: async (_orgId: string, _input: OnboardingInput) => {
      // Stub implementation - does nothing
      if (process.env.NODE_ENV === "development") {
        console.warn("useAiOnboarding.retryRun is not implemented");
      }
    },
  };
}
