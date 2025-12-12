// app/(protected)/org-settings/page.tsx
import type { Metadata } from "next";
import OrgSettingsPageClient from "./OrgSettingsPageClient";

export const metadata: Metadata = {
  title: "LYXso – Organisasjonsinnstillinger",
  description:
    "Plan, status og profilinnstillinger for denne LYXso-organisasjonen.",
};

export default function OrgSettingsPage() {
  return <OrgSettingsPageClient />;
}
