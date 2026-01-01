// app/(dashboard)/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | LYXso",
  description: "LYXso Dashboard",
};

// Disable static optimization for all dashboard pages
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
