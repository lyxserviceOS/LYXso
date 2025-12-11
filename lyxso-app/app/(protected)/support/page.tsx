// app/(protected)/support/page.tsx
import type { Metadata } from "next";
import SupportPageClient from "./SupportPageClient";

export const metadata: Metadata = {
  title: "Support | LYXso",
  description: "Administrer support-henvendelser",
};

export default function SupportPage() {
  return <SupportPageClient />;
}
