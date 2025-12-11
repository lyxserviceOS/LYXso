// C:\Users\maser\OneDrive\Skrivebord\LYX selskaper\lyxso-app\app\(protected)\coating\page.tsx
import type { Metadata } from "next";
import CoatingPageClient from "./CoatingPageClient";

export const metadata: Metadata = {
  title: "LYXso – Coating & årskontroller",
  description:
    "Oversikt over coating-jobber og årskontroller i LYXso-partnerportalen.",
};

export default function CoatingPage() {
  return <CoatingPageClient />;
}
