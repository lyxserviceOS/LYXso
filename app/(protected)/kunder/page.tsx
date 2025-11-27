// app/(protected)/kunder/page.tsx
import type { Metadata } from "next";
import CustomersPageClient from "./CustomersPageClient";

export const metadata: Metadata = {
  title: "LYXso – Kunder",
  description:
    "Kundeoversikt for bedriften. Se kunder, rediger kontaktinfo og legg til nye.",
};

export default function CustomersPage() {
  return <CustomersPageClient />;
}
