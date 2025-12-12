// app/(public)/embed/bestill/page.tsx
"use client";
import dynamic from "next/dynamic";
const PublicBookingPageClient = dynamic(
  () => import("../../bestill/PublicBookingPageClient"),
  { ssr: false }
);

export default function EmbedBookingPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <PublicBookingPageClient />
    </div>
  );
}
