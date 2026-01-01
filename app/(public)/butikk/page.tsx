import { Suspense } from "react";
import ButikkClient from "./ButikkClient";

export const metadata = {
  title: "Nettbutikk",
  description: "Handle produkter og tjenester",
};

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function ButikkPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Laster nettbutikk...</p>
      </div>
    </div>}>
      <ButikkClient />
    </Suspense>
  );
}
