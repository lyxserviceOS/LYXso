import type { Metadata } from "next";
import TjenesterPageClient from "./TjenesterPageClient";

export const metadata: Metadata = {
  title: "LYXso – Tjenester",
  description:
    "Administrer tjenester, varighet, pris og kategorier for LYXso-partneren.",
};

export default function TjenesterPage() {
  return <TjenesterPageClient />;
}
