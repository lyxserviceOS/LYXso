import type { Metadata } from "next";
import AdminDashboardClient from "./AdminDashboardClient";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "LYXso – Admin Dashboard",
  description: "Komplett oversikt over plattformen med metrics og system monitoring",
};

export default function AdminDashboardPage() {
  return <AdminDashboardClient />;
}
