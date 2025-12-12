// app/(protected)/admin/orgs/page.tsx
import type { Metadata } from "next";
import AdminOrgsPageClient from "./AdminOrgsPageClient";

export const metadata: Metadata = {
  title: "LYXso – Admin: Organisasjoner",
  description:
    "Administrasjon av alle organisasjoner/partnere i LYXso – planer, status og nøkkeltall.",
};

export default function AdminOrgsPage() {
  return <AdminOrgsPageClient />;
}
