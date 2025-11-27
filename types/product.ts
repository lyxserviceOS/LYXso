import type { Metadata } from "next";
import ServicesPageClient from "./ServicesPageClient";

export const metadata: Metadata = {
  title: "LYXso – Tjenester",
  description:
    "Administrer tjenester, varighet og priser for partneren i LYXso.",
};

export default function ServicesPage() {
  return <ServicesPageClient />;
}
