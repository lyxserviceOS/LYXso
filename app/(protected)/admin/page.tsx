// app/(protected)/admin/page.tsx
import type { Metadata } from "next";
import AdminPageClient from "./AdminPageClient";

export const metadata: Metadata = {
  title: "LYXso – Adminpanel",
  description:
    "Adminpanel for LYXso – styr planer og organisasjoner.",
};

export default function AdminPage() {
  return <AdminPageClient />;
}
