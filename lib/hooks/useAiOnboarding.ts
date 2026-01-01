// lib/hooks/useAiOnboarding.ts
// Hook for AI-powered onboarding functionality

"use client";

import { useState } from "react";
import type { OnboardingInput, AIOnboardingSession } from "@/types/ai-onboarding";

interface UseAiOnboardingReturn {
  loading: boolean;
  error: string | null;
  session: AIOnboardingSession | null;
  runOnboarding: (orgId: string, input: OnboardingInput) => Promise<AIOnboardingSession | null>;
  applyOnboarding: (orgId: string, sessionId: string) => Promise<boolean>;
  retryRun: (orgId: string, input: OnboardingInput) => Promise<AIOnboardingSession | null>;
}

const MAX_RETRIES = 2;
const TIMEOUT_MS = 30000; // 30 seconds

export function useAiOnboarding(): UseAiOnboardingReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<AIOnboardingSession | null>(null);

  const runOnboarding = async (
    orgId: string,
    input: OnboardingInput
  ): Promise<AIOnboardingSession | null> => {
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(`/api/orgs/${orgId}/ai/onboarding/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSession(data);
      return data;
    } catch (err) {
      clearTimeout(timeoutId);
      
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          setError("Request timed out. Please try again.");
        } else {
          setError(err.message);
        }
      } else {
        setError("An unknown error occurred");
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  const applyOnboarding = async (orgId: string, sessionId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/orgs/${orgId}/ai/onboarding/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const retryRun = async (
    orgId: string,
    input: OnboardingInput
  ): Promise<AIOnboardingSession | null> => {
    let lastError: string | null = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      if (attempt > 0) {
        // Exponential backoff: 1s, 2s, 4s
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt - 1) * 1000));
      }

      const result = await runOnboarding(orgId, input);
      if (result) {
        return result;
      }

      lastError = error;
    }

    setError(lastError || "Failed after multiple retries");
    return null;
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
