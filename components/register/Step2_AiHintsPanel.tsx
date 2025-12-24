// components/register/Step2_AiHintsPanel.tsx
// AI hints panel that appears during step 2 onboarding
// Note: This component is currently disabled as the AI onboarding hints hook is not implemented

"use client";

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
  // Component is disabled until the AI onboarding hints functionality is implemented
  return null;
}
