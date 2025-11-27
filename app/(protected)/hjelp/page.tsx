import type { Metadata } from "next";
import HelpPageClient from "./HelpPageClient";

export const metadata: Metadata = {
  title: "LYXso – Hjelp & dokumentasjon",
  description: "Dokumentasjon, FAQ og support for LYXso-partnere.",
};

export default function HelpPage() {
  return <HelpPageClient />;
}
