import type { Metadata } from "next";
import AnalyticsPageClient from "./AnalyticsPageClient";

export const metadata: Metadata = {
  title: "LYXso – Analytics & Rapporter",
  description: "Detaljert analyse av bookinger, inntekter og trender",
};

export default function AnalyticsPage() {
  return <AnalyticsPageClient />;
}
