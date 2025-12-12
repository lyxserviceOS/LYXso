// app/(protected)/landingsside/page.tsx
import type { Metadata } from "next";
import LandingPageSettingsClient from "./LandingPageSettingsClient";

export const metadata: Metadata = {
  title: "LYXso – Landingsside",
  description: "Innstillinger for partnerens kundevendte landingsside.",
};

export default function LandingPageSettingsPage() {
  return <LandingPageSettingsClient />;
}
