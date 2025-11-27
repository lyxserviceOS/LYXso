import type { Metadata } from "next";
import AutomationPageClient from "./AutomationPageClient";

export const metadata: Metadata = {
  title: "LYXso – Automatisering",
  description: "Sett opp automatiske påminnelser, workflows og triggere.",
};

export default function AutomationPage() {
  return <AutomationPageClient />;
}
