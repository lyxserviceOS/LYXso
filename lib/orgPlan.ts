// lib/orgPlan.ts
// Felles definisjoner for LYXso-planer og hvilke funksjoner de gir.

import type { OrgPlan } from "@/types/org";

export const ORG_PLANS: OrgPlan[] = ["free", "trial", "paid"];

export function normalizeOrgPlan(
  plan: string | null | undefined,
): OrgPlan {
  if (plan === "free" || plan === "trial" || plan === "paid") {
    return plan;
  }
  // Default for eldre orgs uten plan: behandle som trial (14 dagers delvis full tilgang)
  return "trial";
}

export function getOrgPlanLabel(plan: OrgPlan): string {
  switch (plan) {
    case "free":
      return "Gratis";
    case "trial":
      return "Prøveperiode";
    case "paid":
      return "Betalt";
  }
}

export function getOrgPlanShortInfo(plan: OrgPlan): string {
  switch (plan) {
    case "free":
      return "Enkel booking med reklame. Ingen AI-moduler.";
    case "trial":
      return "14 dager delvis full tilgang før dere velger gratis eller betalt.";
    case "paid":
      return "Full tilgang til booking + AI-moduler (LYXba / LYXvision).";
  }
}

export function getOrgPlanPriceInfo(plan: OrgPlan): string {
  switch (plan) {
    case "free":
      return "0,- / mnd (med reklame).";
    case "trial":
      return "0,- i 14 dager. Bytt til gratis eller betalt etterpå.";
    case "paid":
      return "Nå 990,- / mnd (førpris 1 495,-).";
  }
}

// Feature-flags per plan – kan brukes i hele appen
export const planFeatureFlags = {
  free: {
    basicBooking: true,
    ads: true,
    aiMarketing: false,
    lyxVision: false,
    aiTyreAnalysis: false,
    aiCoatingCertificate: false,
    aiLeadAgent: false,
    autoPublishing: false,
  },
  trial: {
    basicBooking: true,
    ads: false,
    aiMarketing: true,
    lyxVision: true,
    aiTyreAnalysis: true,
    aiCoatingCertificate: true,
    aiLeadAgent: false,
    autoPublishing: false,
  },
  paid: {
    basicBooking: true,
    ads: false,
    aiMarketing: true,
    lyxVision: true,
    aiTyreAnalysis: true,
    aiCoatingCertificate: true,
    aiLeadAgent: true,
    autoPublishing: true,
  },
} as const;

export type PlanFeatureKey = keyof typeof planFeatureFlags.free;

export function isFeatureEnabled(
  plan: OrgPlan,
  feature: PlanFeatureKey,
): boolean {
  return planFeatureFlags[plan][feature];
}
