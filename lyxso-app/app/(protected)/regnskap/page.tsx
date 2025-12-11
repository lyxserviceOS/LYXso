// app/(protected)/regnskap/page.tsx
import type { Metadata } from "next";
import AccountingPageClient from "./AccountingPageClient";

export const metadata: Metadata = {
  title: "LYXso – Regnskap & betalinger",
  description:
    "Koble LYXso mot regnskapssystem og betalingsterminal, og få oversikt over omsetning og bilagsflyt.",
};

export default function AccountingPage() {
  return <AccountingPageClient />;
}
