// app/(protected)/partnere/page.tsx
import type { Metadata } from "next";
import PartnerePageClient from "./PartnerePageClient";

export const metadata: Metadata = {
  title: "LYXso – Partnere",
  description:
    "Admin-oversikt over alle partnere/organisasjoner i LYXso (kun for LYXso-admin).",
};

export default function PartnerePage() {
  return <PartnerePageClient />;
}
