// app/(protected)/leads/[leadId]/page.tsx
import { Metadata } from "next";
import LeadDetailClient from "./LeadDetailClient";

export const metadata: Metadata = {
  title: "LYXso – Lead Detaljer",
  description: "Se og administrer lead-samtaler",
};

export default function LeadDetailPage({ params }: { params: { leadId: string } }) {
  return <LeadDetailClient leadId={params.leadId} />;
}
