import type { Metadata } from "next";
import AdminUsersClient from "./AdminUsersClient";

export const metadata: Metadata = {
  title: "LYXso – Brukere (Admin)",
  description: "Administrer alle brukere på plattformen",
};

export default function AdminUsersPage() {
  return <AdminUsersClient />;
}
