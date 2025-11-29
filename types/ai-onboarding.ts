// types/ai-onboarding.ts
// Type definitions for AI onboarding flow

export type LocationType = "fixed" | "mobile" | "both";
export type PriceLevel = "budget" | "normal" | "premium";

export interface OpeningHours {
  [day: string]: {
    open: string;
    close: string;
  } | null;
}

export interface OnboardingInput {
  industry: string | null;
  locationType: LocationType | null;
  basicServices: string[];
  priceLevel: PriceLevel | null;
  openingHours: OpeningHours;
  orgDescription?: string;
  capacityHeavyJobsPerDay?: number;
}

export interface ServiceCategory {
  name: string;
  services: string[];
}

export interface AIOnboardingSuggestion {
  categories: ServiceCategory[];
  services: Array<{
    name: string;
    category: string;
    basePrice?: number;
    durationMinutes?: number;
  }>;
  addons: Array<{
    name: string;
    price?: number;
  }>;
  landingPage: {
    hero: {
      title: string;
      subtitle: string;
    };
    sections: Array<{
      title: string;
      content: string;
    }>;
  };
}

export interface AIOnboardingSession {
  id: string;
  orgId: string;
  status: "draft" | "applied" | "discarded";
  input: OnboardingInput;
  suggestions: AIOnboardingSuggestion;
  createdAt: string;
  appliedAt?: string;
}

export interface OnboardingStepData {
  // Step 2.1: Basic info
  industries: string[];
  locationType: LocationType | null;
  orgDescription: string;

  // Step 2.2: Services and pricing
  selectedServices: string[];
  customServices: string[];
  priceLevel: PriceLevel | null;

  // Step 2.3: Opening hours and capacity
  openingHours: OpeningHours;
  capacityHeavyJobsPerDay: number;
}
