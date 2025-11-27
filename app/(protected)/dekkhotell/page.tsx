import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LYXso – Dekkhotell",
  description:
    "Full oversikt over felg- og dekksett, posisjon i lager og status på kunder.",
};

export default function DekkhotellPage() {
  return (
    <div className="h-full w-full bg-[#F8FAFC] px-6 py-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#94A3B8]">
              DRIFT • DEKKHOTELL
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#0F172A]">
              Dekkhotell
            </h1>
            <p className="mt-1 text-sm text-[#475569]">
              Hold styr på hvilke sett som står hvor, mønsterdybde og hvilke
              kunder som må varsles før sesong.
            </p>
          </div>

          <div className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-xs text-[#64748B] shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
              Status
            </p>
            <p className="mt-1 text-sm text-[#0F172A]">
              Struktur & design for V1
            </p>
            <p className="text-[11px]">
              Kobling til faktiske sett og posisjoner kommer sammen med
              bookingmotoren.
            </p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <StatCard title="Registrerte sett" value="0" subtitle="Totalt i lager" />
          <StatCard
            title="Kunder med dekkhotell"
            value="0"
            subtitle="Kunder koblet til ett eller flere sett"
          />
          <StatCard
            title="Sesongvarsler"
            value="0"
            subtitle="Planlagte påminnelser før sesong"
          />
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-[2fr,1fr]">
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-[#0F172A]">
              Lageroversikt (kommer)
            </h2>
            <p className="mt-1 text-xs text-[#64748B]">
              Visualisering av reoler, rader og hyller. Her kan du se hvor hvert
              sett står og status på inn/utlevering.
            </p>

            <div className="mt-4 h-64 rounded-xl border border-dashed border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-center text-xs text-[#94A3B8]">
              Skisse / kart over lager – placeholder
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 text-xs text-[#475569] shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                Typiske felter per sett
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-4">
                <li>Type (sommer / vinter).</li>
                <li>Dimensjon og felgtype.</li>
                <li>Mønsterdybde og tilstand.</li>
                <li>Posisjon (reol, rad, hylle, posisjon).</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-dashed border-[#BFDBFE] bg-[#EFF6FF] p-4 text-xs text-[#1E293B]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
                Integrasjoner
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-4">
                <li>Sesongbaserte SMS- og e-postpåminnelser.</li>
                <li>Kobling til booking (automatisk forslag om dekkskift).</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

type StatCardProps = {
  title: string;
  value: string;
  subtitle: string;
};

function StatCard({ title, value, subtitle }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
      <p className="text-xs font-medium text-[#64748B]">{title}</p>
      <p className="mt-1 text-2xl font-semibold text-[#0F172A]">{value}</p>
      <p className="mt-1 text-[11px] text-[#94A3B8]">{subtitle}</p>
    </div>
  );
}
