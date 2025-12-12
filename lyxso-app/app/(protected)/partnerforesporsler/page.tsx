import type { Metadata } from "next";
import PartnerSignupsPageClient from "./PartnerSignupsPageClient";

export const metadata: Metadata = {
  title: "LYXso – Partnerforespørsler",
  description:
    "Oversikt over bedrifter som har sendt inn 'Bli partner'-skjemaet.",
};

export default function PartnerRequestsPage() {
  return <PartnerSignupsPageClient />;
}
