// components/register/Step2_4_AISuggestions.tsx
// Onboarding Step 2.4: AI Suggestions Review

import React from "react";
import { useRouter } from "next/navigation";
import type { AIOnboardingSession, OnboardingStepData } from "@/types/ai-onboarding";

interface Step2_4Props {
  data: OnboardingStepData;
  session: AIOnboardingSession | null;
  loading: boolean;
  error: string | null;
  orgId: string;
  onApply: () => Promise<void>;
  onBack: () => void;
  onSkip: () => void;
  onRetry: () => Promise<void>;
}

export function Step2_4_AISuggestions({
  data,
  session,
  loading,
  error,
  orgId,
  onApply,
  onBack,
  onSkip,
  onRetry,
}: Step2_4Props) {
  const router = useRouter();
  const [isRetrying, setIsRetrying] = React.useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  if (loading || isRetrying) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-slate-400">
          {isRetrying ? "Prøver på nytt..." : "AI genererer forslag til deg..."}
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Dette kan ta opptil 30 sekunder
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-red-900/60 bg-red-950/40 p-4">
          <h3 className="text-sm font-medium text-red-400">Feil ved generering av AI-forslag</h3>
          <p className="mt-1 text-xs text-red-400/70">{error}</p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleRetry}
            disabled={isRetrying}
            className="flex-1 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRetrying ? "Prøver på nytt..." : "Prøv igjen"}
          </button>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={isRetrying}
            className="flex-1 rounded-md border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-50 transition-colors"
          >
            Tilbake
          </button>
          <button
            type="button"
            onClick={onSkip}
            disabled={isRetrying}
            className="flex-1 rounded-md bg-slate-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-600 disabled:opacity-50 transition-colors"
          >
            Hopp over AI-forslag
          </button>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const suggestions = session.suggestions;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-50">
          AI har generert forslag til deg 🎉
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Basert på informasjonen din har vi satt opp:
        </p>
      </div>

      {/* Service categories */}
      {suggestions.categories && suggestions.categories.length > 0 && (
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <h3 className="text-sm font-medium text-slate-200 mb-3">
            Tjenestekategorier ({suggestions.categories.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {suggestions.categories.map((cat) => (
              <span
                key={cat.name}
                className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-sm text-blue-400"
              >
                {cat.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Services */}
      {suggestions.services && suggestions.services.length > 0 && (
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <h3 className="text-sm font-medium text-slate-200 mb-3">
            Tjenester ({suggestions.services.length})
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {suggestions.services.slice(0, 8).map((service, idx) => (
              <div
                key={idx}
                className="px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-sm text-slate-300"
              >
                {service.name}
              </div>
            ))}
            {suggestions.services.length > 8 && (
              <div className="px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-sm text-slate-400 flex items-center justify-center">
                +{suggestions.services.length - 8} flere
              </div>
            )}
          </div>
        </div>
      )}

      {/* Addons */}
      {suggestions.addons && suggestions.addons.length > 0 && (
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <h3 className="text-sm font-medium text-slate-200 mb-3">
            Tilleggsvalg ({suggestions.addons.length})
          </h3>
          <div className="space-y-2">
            {suggestions.addons.slice(0, 5).map((addon, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-sm"
              >
                <span className="text-slate-300">{addon.name}</span>
                {addon.price && (
                  <span className="text-slate-400">{addon.price} kr</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Landing page preview */}
      {suggestions.landingPage && (
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <h3 className="text-sm font-medium text-slate-200 mb-3">
            Forslag til landingsside
          </h3>
          <div className="space-y-3">
            <div>
              <div className="text-lg font-semibold text-slate-50">
                {suggestions.landingPage.hero.title}
              </div>
              <div className="text-sm text-slate-400 mt-1">
                {suggestions.landingPage.hero.subtitle}
              </div>
            </div>
            {suggestions.landingPage.sections && suggestions.landingPage.sections.length > 0 && (
              <div className="text-xs text-slate-500 pt-2 border-t border-slate-800">
                + {suggestions.landingPage.sections.length} seksjoner med innhold
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={onApply}
          disabled={loading}
          className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Aktiverer..." : "Godkjenn og aktiver"}
        </button>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 rounded-md border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Tilbake
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="flex-1 rounded-md border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Hopp over
          </button>
        </div>
      </div>
    </div>
  );
}
