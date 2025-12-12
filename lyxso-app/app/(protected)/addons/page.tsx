import type { Metadata } from "next";
import AddonsPageClient from "./AddonsPageClient";

export const metadata: Metadata = {
  title: "LYXso – Tillegg og moduler",
  description:
    "Styr AI-markedsføring, LYXvision og andre tillegg for din LYXso-konto.",
};

export default function AddonsPage() {
  return <AddonsPageClient />;
}
