import { Metadata } from "next";
import LandingPageBuilderClient from "./LandingPageBuilderClient";

export const metadata: Metadata = {
  title: "Landing Page Builder | LYXso",
  description: "Bygg din egen landing page med drag-and-drop",
};

export default function LandingPageBuilderPage() {
  return <LandingPageBuilderClient />;
}
