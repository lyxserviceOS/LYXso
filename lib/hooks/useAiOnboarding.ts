// lib/hooks/useAiOnboarding.ts
// Hook for AI onboarding API calls

import { useState } from "react";
import type {
  OnboardingInput,
  AIOnboardingSession,
} from "@/types/ai-onboarding";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_LYXSO_API_URL ??
  process.env.NEXT_PUBLIC_API_BASE ??
  "http://localhost:4000";

interface UseAiOnboardingReturn {
  loading: boolean;
  error: string | null;
  session: AIOnboardingSession | null;
  runOnboarding: (
    orgId: string,
    input: OnboardingInput
  ) => Promise<AIOnboardingSession | null>;
  applyOnboarding: (
    orgId: string,
    sessionId: string
  ) => Promise<boolean>;
  clearError: () => void;
}

export function useAiOnboarding(): UseAiOnboardingReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<AIOnboardingSession | null>(null);

  const clearError = () => setError(null);

  const runOnboarding = async (
    orgId: string,
    input: OnboardingInput
  ): Promise<AIOnboardingSession | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/orgs/${orgId}/ai/onboarding/run`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || "Kunne ikke generere AI-forslag"
        );
      }

      const data = await response.json();
      setSession(data.session);
      return data.session;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Ukjent feil";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const applyOnboarding = async (
    orgId: string,
    sessionId: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/orgs/${orgId}/ai/onboarding/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || "Kunne ikke aktivere AI-forslagene"
        );
      }

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Ukjent feil";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    session,
    runOnboarding,
    applyOnboarding,
    clearError,
  };
}
