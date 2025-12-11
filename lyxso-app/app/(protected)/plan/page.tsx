import type { Metadata } from "next";
import PlanPageClient from "./PlanPageClient";

export const metadata: Metadata = {
  title: "LYXso – Abonnement & plan",
  description:
    "Se hvilken LYXso-plan dere bruker, hva som er inkludert og hva som kommer videre.",
};

export default function PlanPage() {
  return <PlanPageClient />;
}
