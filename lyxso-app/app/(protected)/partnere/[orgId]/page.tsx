// app/(protected)/partnere/[orgId]/page.tsx
import type { Metadata } from "next";
import PartnerOrgPageClient from "./PartnerOrgPageClient";

export const metadata: Metadata = {
  title: "LYXso – Partnerdetaljer",
  description:
    "Detaljvisning for én partner / organisasjon i LYXso (admin).",
};

export default function PartnerOrgPage() {
  return <PartnerOrgPageClient />;
}
