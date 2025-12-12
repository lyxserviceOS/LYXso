// app/(protected)/booking/page.tsx
import type { Metadata } from "next";
import BookingPageClient from "./BookingPageClient";

export const metadata: Metadata = {
  title: "LYXso – Booking",
  description:
    "Kalender og timebok for hele bedriften. Administrer bookinger, status og kapasitet.",
};

export default function BookingPage() {
  return <BookingPageClient />;
}
