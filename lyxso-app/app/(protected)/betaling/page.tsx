// C:\Users\maser\OneDrive\Skrivebord\LYX selskaper\lyxso-app\app\(protected)\betaling\page.tsx
import type { Metadata } from "next";
import BetalingPageClient from "./BetalingPageClient";

export const metadata: Metadata = {
  title: "LYXso – Betaling",
  description:
    "Oversikt over betalingsløsninger og integrasjoner (iZettle, SumUp m.m.).",
};

export default function BetalingPage() {
  return <BetalingPageClient />;
}
