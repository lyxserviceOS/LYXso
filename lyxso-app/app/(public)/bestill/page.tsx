import type { Metadata } from "next";
import { BestillPageClient } from "./BestillPageClient";

export const metadata: Metadata = {
  title: "Bestill time – LYXso",
  description:
    "Kunder kan sende inn bookingforespørsel direkte til verkstedet via LYXso.",
};

export default function BestillPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10">
        <header className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-sky-400">
            LYXso • Online booking
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Bestill time hos verkstedet
          </h1>
          <p className="max-w-2xl text-sm text-slate-300">
            Velg tjeneste, fyll inn kontaktinfo og ønsket tidspunkt. Forespørselen
            går direkte til systemet – partneren kan bekrefte, flytte eller avvise
            bookingen i LYXso-portalen.
          </p>
        </header>

        <BestillPageClient />
      </div>
    </div>
  );
}
