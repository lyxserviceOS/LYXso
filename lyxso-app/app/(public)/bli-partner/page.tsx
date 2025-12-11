// app/(public)/bli-partner/page.tsx
import type { Metadata } from "next";
import BliPartnerPageClient from "./BliPartnerPageClient";

export const metadata: Metadata = {
  title: "LYXso – Bli partner",
  description:
    "Registrer bedriften din som LYXso-partner og få tilgang til plattformen for bilpleie, coating og dekkhotell.",
};

export default function BliPartnerPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <BliPartnerPageClient />
    </div>
  );
}
