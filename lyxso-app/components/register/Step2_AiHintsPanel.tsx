// components/register/Step2_AiHintsPanel.tsx
// AI hints panel that appears during step 2 onboarding

"use client";

import { useState, useEffect } from "react";
import { Sparkles, X, Lightbulb, TrendingUp, Clock, DollarSign } from "lucide-react";
import { useAiOnboardingHints, type AiHint } from "@/lib/hooks/useAiOnboardingHints";
import type { OnboardingStepData } from "@/types/ai-onboarding";

interface Step2_AiHintsPanelProps {
  orgId: string | null;
  onboardingData: Partial<OnboardingStepData>;
  enabled: boolean;
  onDisable: () => void;
}

export function Step2_AiHintsPanel({
  orgId,
  onboardingData,
  enabled,
  onDisable,
}: Step2_AiHintsPanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { hints, loading, error, hasHints } = useAiOnboardingHints(
    orgId,
    onboardingData,
    { enabled, debounceMs: 2000 }
  );

  // Show panel with animation when we have hints
  useEffect(() => {
    if (enabled && hasHints) {
      // Small delay before showing to make it feel more natural
      const timer = setTimeout(() => setIsVisible(true), 300);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [enabled, hasHints]);

  if (!enabled || (!hasHints && !loading)) {
    return null;
  }

  const handleDisable = () => {
    setIsVisible(false);
    setTimeout(() => onDisable(), 300); // Wait for slide-out animation
  };

  const getIconForType = (type: AiHint["type"]) => {
    switch (type) {
      case "service":
        return <Lightbulb className="w-4 h-4" />;
      case "pricing":
        return <DollarSign className="w-4 h-4" />;
      case "capacity":
        return <TrendingUp className="w-4 h-4" />;
      case "hours":
        return <Clock className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isVisible && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={handleDisable}
        />
      )}

      {/* Hints Panel */}
      <div
        className={`
          fixed lg:sticky top-0 right-0 lg:right-auto
          w-full lg:w-80 xl:w-96
          h-full lg:h-auto lg:max-h-[600px]
          bg-gradient-to-br from-blue-950/95 to-purple-950/95 backdrop-blur-md
          border-l lg:border border-blue-800/50
          shadow-2xl shadow-blue-900/50
          z-50 lg:z-auto
          transition-transform duration-300 ease-out
          ${isVisible ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
          overflow-y-auto
        `}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80 backdrop-blur-sm border-b border-blue-700/50 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/30">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  AI-hjelp for å sette opp bedriften din
                </h3>
                <p className="text-xs text-blue-200/80 mt-0.5">
                  Vi foreslår tjenester og oppsett basert på det du fyller inn
                </p>
              </div>
            </div>
            <button
              onClick={handleDisable}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-blue-200 hover:text-white"
              aria-label="Lukk AI-hjelp"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {loading && (
            <div className="flex items-center gap-2 text-sm text-blue-200/70">
              <svg
                className="animate-spin w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Genererer forslag...</span>
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          {hints.length > 0 && !loading && (
            <>
              {hints.map((hint, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-white/5 border border-white/10 p-3 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 text-blue-400">
                      {getIconForType(hint.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white mb-1">
                        {hint.title}
                      </h4>
                      <p className="text-xs text-blue-100/80 leading-relaxed">
                        {hint.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {!loading && hints.length === 0 && !error && (
            <div className="text-center py-6 text-blue-200/60 text-sm">
              Fyll ut mer informasjon for å få AI-forslag
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gradient-to-t from-blue-950/95 to-transparent p-4 pt-6">
          <button
            onClick={handleDisable}
            className="w-full px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-sm font-medium text-white transition-colors"
          >
            Skru av AI-hjelp for dette steget
          </button>
          <p className="text-[10px] text-center text-blue-200/50 mt-2">
            Du kan alltid skru det på igjen senere
          </p>
        </div>
      </div>
    </>
  );
}
