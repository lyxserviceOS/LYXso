// app/(protected)/admin/orgs/[orgId]/page.tsx
import { Suspense } from "react";
import AdminOrgDetailClient from "./AdminOrgDetailClient";

export default function AdminOrgDetailPage({ params }: { params: { orgId: string } }) {
  return (
    <Suspense fallback={<div className="p-8">Laster organisasjonsdetaljer...</div>}>
      <AdminOrgDetailClient orgId={params.orgId} />
    </Suspense>
  );
}
