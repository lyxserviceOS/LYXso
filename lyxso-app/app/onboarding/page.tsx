// app/onboarding/page.tsx
import type { Metadata } from "next";
import OnboardingPageClient from "./OnboardingPageClient";

export const metadata: Metadata = {
  title: "LYXso – Onboarding av partner",
  description:
    "Sett opp bedriftsprofil, landingsside og grunnleggende innstillinger for LYXso-partneren din.",
};

export default function OnboardingPage() {
  return <OnboardingPageClient />;
}
