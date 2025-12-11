import type { Metadata } from "next";
import DashboardPageClient from "./DashboardPageClient";

export const metadata: Metadata = {
  title: "LYXso – Kontrollpanel",
  description:
    "Oversikt over kunder, bookinger og kapasitet for LYXso-partnerportalen.",
};

export default function KontrollpanelPage() {
  return <DashboardPageClient />;
}
