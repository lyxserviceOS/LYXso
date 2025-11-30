// lib/hooks/useAiOnboarding.ts
// Hook for AI onboarding API calls with timeout and retry support

import { useState } from "react";
import type {
  OnboardingInput,
  AIOnboardingSession,
} from "@/types/ai-onboarding";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_LYXSO_API_URL ??
  process.env.NEXT_PUBLIC_API_BASE ??
  "http://localhost:4000";

const REQUEST_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 2; // Total attempts will be 1 initial + 2 retries = 3

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
  retryRun: (orgId: string, input: OnboardingInput) => Promise<AIOnboardingSession | null>;
  retryApply: (orgId: string, sessionId: string) => Promise<boolean>;
}

export function useAiOnboarding(): UseAiOnboardingReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<AIOnboardingSession | null>(null);

  const clearError = () => setError(null);

  const runOnboarding = async (
    orgId: string,
    input: OnboardingInput,
    retryCount = 0
  ): Promise<AIOnboardingSession | null> => {
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/orgs/${orgId}/ai/onboarding/run`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

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
      clearTimeout(timeoutId);
      
      let errorMessage = "Ukjent feil";
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          errorMessage = "Forespørselen tok for lang tid (timeout etter 30 sekunder)";
        } else {
          errorMessage = err.message;
        }
      }
      
      // Retry logic for network errors and timeouts
      if (retryCount < MAX_RETRIES) {
        console.log(`Retry attempt ${retryCount + 1} of ${MAX_RETRIES} for /run`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
        return runOnboarding(orgId, input, retryCount + 1);
      }
      
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const applyOnboarding = async (
    orgId: string,
    sessionId: string,
    retryCount = 0
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/orgs/${orgId}/ai/onboarding/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || "Kunne ikke aktivere AI-forslagene"
        );
      }

      return true;
    } catch (err) {
      clearTimeout(timeoutId);
      
      let errorMessage = "Ukjent feil";
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          errorMessage = "Forespørselen tok for lang tid (timeout etter 30 sekunder)";
        } else {
          errorMessage = err.message;
        }
      }
      
      // Retry logic for network errors and timeouts
      if (retryCount < MAX_RETRIES) {
        console.log(`Retry attempt ${retryCount + 1} of ${MAX_RETRIES} for /apply`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
        return applyOnboarding(orgId, sessionId, retryCount + 1);
      }
      
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Retry functions that clear error and retry the operation
  const retryRun = async (
    orgId: string,
    input: OnboardingInput
  ): Promise<AIOnboardingSession | null> => {
    clearError();
    return runOnboarding(orgId, input);
  };

  const retryApply = async (
    orgId: string,
    sessionId: string
  ): Promise<boolean> => {
    clearError();
    return applyOnboarding(orgId, sessionId);
  };

  return {
    loading,
    error,
    session,
    runOnboarding,
    applyOnboarding,
    clearError,
    retryRun,
    retryApply,
  };
}
