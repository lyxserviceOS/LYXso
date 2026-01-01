// lib/hooks/useAiOnboarding.ts
// Custom hook for AI onboarding flow - manages full onboarding suggestions

import { useState, useCallback } from "react";
import type { OnboardingInput, AIOnboardingSession } from "@/types/ai-onboarding";
import { buildOrgApiUrl } from "@/lib/apiConfig";

const REQUEST_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 2; // 1 initial + 2 retries = 3 attempts total

interface UseAiOnboardingReturn {
  loading: boolean;
  error: string | null;
  session: AIOnboardingSession | null;
  runOnboarding: (orgId: string, input: OnboardingInput) => Promise<void>;
  applyOnboarding: (orgId: string, sessionId: string) => Promise<boolean>;
  retryRun: (orgId: string, input: OnboardingInput) => Promise<void>;
  clearError: () => void;
}

export function useAiOnboarding(): UseAiOnboardingReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<AIOnboardingSession | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const runOnboarding = useCallback(
    async (orgId: string, input: OnboardingInput, retryCount = 0): Promise<void> => {
      if (!orgId) {
        setError("Organization ID is required");
        return;
      }

      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      try {
        const url = buildOrgApiUrl(orgId, "ai/onboarding/run");
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Request failed with status ${response.status}`
          );
        }

        const data = await response.json();
        
        // Create session object from response
        const sessionData: AIOnboardingSession = {
          id: data.sessionId || data.id,
          orgId: orgId,
          status: data.status || "draft",
          input: input,
          suggestions: data.suggestions,
          createdAt: data.createdAt || new Date().toISOString(),
        };
        
        setSession(sessionData);
        setError(null);
      } catch (err: any) {
        clearTimeout(timeoutId);

        if (err.name === "AbortError") {
          setError("Request timed out. Please try again.");
        } else if (err.message?.includes("Failed to fetch") || err.message?.includes("NetworkError")) {
          // Network error - retry if we have retries left
          if (retryCount < MAX_RETRIES) {
            console.log(`Retry attempt ${retryCount + 1} of ${MAX_RETRIES}`);
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * (retryCount + 1))
            ); // Exponential backoff
            return runOnboarding(orgId, input, retryCount + 1);
          }
          setError("Network error. Please check your connection and try again.");
        } else {
          setError(err.message || "An error occurred while generating suggestions");
        }

        setSession(null);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const applyOnboarding = useCallback(
    async (orgId: string, sessionId: string): Promise<boolean> => {
      if (!orgId || !sessionId) {
        setError("Organization ID and Session ID are required");
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        const url = buildOrgApiUrl(orgId, "ai/onboarding/apply");
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Request failed with status ${response.status}`
          );
        }

        // Successfully applied - clear local state
        setSession(null);
        setError(null);
        return true;
      } catch (err: any) {
        setError(err.message || "An error occurred while applying suggestions");
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const retryRun = useCallback(
    async (orgId: string, input: OnboardingInput): Promise<void> => {
      return runOnboarding(orgId, input, 0);
    },
    [runOnboarding]
  );

  return {
    loading,
    error,
    session,
    runOnboarding,
    applyOnboarding,
    retryRun,
    clearError,
  };
}
