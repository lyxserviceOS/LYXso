import type { Metadata } from "next";
import ProdukterPageClient from "./ProdukterPageClient";

export const metadata: Metadata = {
  title: "LYXso – Produkter",
  description:
    "Administrer produkter, enheter og kategorier som hører til tjenestene.",
};

export default function ProdukterPage() {
  return <ProdukterPageClient />;
}
