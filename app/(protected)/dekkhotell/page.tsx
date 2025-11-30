import type { Metadata } from "next";
import DekkhotellPageClient from './DekkhotellPageClient';

export const metadata: Metadata = {
  title: "LYXso – Dekkhotell",
  description:
    "Full oversikt over felg- og dekksett, posisjon i lager og status på kunder.",
};

export default function DekkhotellPage() {
  return <DekkhotellPageClient />;
}
