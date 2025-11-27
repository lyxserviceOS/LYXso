import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LYXso – Markedsføring",
  description:
    "Kampanjer, leads og kanalstatistikk. Kobling mot AI-generert innhold og annonser.",
};

export default function MarketingPage() {
  return (
    <div className="h-full w-full bg-[#F8FAFC] px-6 py-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#94A3B8]">
              AI & MARKEDSFØRING • KAMPANJER
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#0F172A]">
              Markedsføring & leads
            </h1>
            <p className="mt-1 text-sm text-[#475569]">
              Ett sted å styre kampanjer, kanaler og leads – tett koblet til
              booking og LYXba.
            </p>
          </div>

          <div className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-xs text-[#64748B] shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
              Status
            </p>
            <p className="mt-1 text-sm text-[#0F172A]">
              Klar for demo – uten live data
            </p>
            <p className="text-[11px]">
              Vi kobler inn ekte data fra Meta, Google og TikTok senere.
            </p>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[2fr,1.1fr]">
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-[#0F172A]">
              Kanaloversikt (placeholder)
            </h2>
            <p className="mt-1 text-xs text-[#64748B]">
              Her kommer en enkel graf med fordeling mellom Meta-annonser,
              Google-annonser og organiske leads.
            </p>

            <div className="mt-4 h-64 rounded-xl border border-dashed border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-center text-xs text-[#94A3B8]">
              Graf / dashboard for kampanjer
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 text-xs text-[#475569] shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                Typiske KPI-er
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-4">
                <li>Antall leads per kanal.</li>
                <li>Bookingrate fra kampanjer.</li>
                <li>Gjennomsnittlig ordreverdi per kampanje.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-dashed border-[#BFDBFE] bg-[#EFF6FF] p-4 text-xs text-[#1E293B]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
                Kobling mot LYXba
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-4">
                <li>AI som kontakter leads automatisk.</li>
                <li>Rapport på hva som faktisk ble booket.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
