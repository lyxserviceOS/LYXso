// app/(protected)/leads/page.tsx
import type { Metadata } from "next";
import LeadsPageClient from "./LeadsPageClient";

export const metadata: Metadata = {
  title: "LYXso – Leads",
  description:
    "Alle henvendelser fra skjema, AI-agenten og kampanjer samlet på ett sted.",
};

export default function LeadsPage() {
  return <LeadsPageClient />;
}
