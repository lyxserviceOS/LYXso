import type { Metadata } from "next";
import { useOrgPlan } from "@/lib/useOrgPlan";
import {
  getOrgPlanLabel,
  getOrgPlanPriceInfo,
  getOrgPlanShortInfo,
} from "@/lib/orgPlan";

export const metadata: Metadata = {
  title: "LYXso – Abonnement & plan",
  description:
    "Se hvilken LYXso-plan dere bruker, hva som er inkludert og hva som kommer videre.",
};

export default function PlanPage() {
  return (
    <div className="h-full w-full bg-[#F8FAFC] px-6 py-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <Header />
        <Content />
      </div>
    </div>
  );
}

function Header() {
  const { plan, loading, error } = useOrgPlan();

  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#94A3B8]">
          SYSTEM • ABONNEMENT
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#0F172A]">
          Abonnement & plan
        </h1>
        <p className="mt-1 max-w-xl text-sm text-[#475569]">
          Her ser du hvilken LYXso-plan som er aktiv for partneren, hva som er
          inkludert, og hvilke moduler som er neste steg.
        </p>
      </div>

      <div className="rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 text-xs shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
          Aktiv plan
        </p>

        {loading && (
          <p className="mt-2 text-sm text-[#64748B]">Henter plan …</p>
        )}

        {error && (
          <p className="mt-2 text-sm text-[#EF4444]">
            Klarte ikke å hente plan. Prøv å laste siden på nytt.
          </p>
        )}

        {!loading && !error && (
          <>
            <p className="mt-2 text-sm font-semibold text-[#0F172A]">
              {getOrgPlanLabel(plan)}
            </p>
            <p className="text-[11px] text-[#64748B]">
              {getOrgPlanPriceInfo(plan)}
            </p>
            <p className="mt-1 text-[11px] text-[#94A3B8]">
              {getOrgPlanShortInfo(plan)}
            </p>
          </>
        )}
      </div>
    </header>
  );
}

function Content() {
  return (
    <section className="grid gap-6 lg:grid-cols-[2fr,1.2fr]">
      {/* Inkluderte moduler */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-[#0F172A]">
            Hva er inkludert i LYXso?
          </h2>
          <p className="mt-1 text-xs text-[#475569]">
            Basismodulene gir deg alt du trenger for å drive et moderne
            bilpleiesenter – resten kan låses opp etter hvert.
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <FeatureCard
              title="Booking & kalender"
              body="Timebok, dagsoversikt og kobling mot tjenester. Grunnmuren for planlegging."
            />
            <FeatureCard
              title="Kunder & CRM"
              body="Kundekort, historikk, kjøretøy og avtaler. Alt samlet per kunde."
            />
            <FeatureCard
              title="Tjenester & produkter"
              body="Strukturerte tjenester, varighet og pris, koblet til produkter."
            />
            <FeatureCard
              title="Markedsføring"
              body="Enkel oversikt over kampanjer, leads og AI-generert innhold."
            />
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-[#BFDBFE] bg-[#EFF6FF] p-4 text-xs text-[#1E293B]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
            Kommer i neste versjoner
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            <li>Full økonomimodul med Fiken/PowerOffice-kobling.</li>
            <li>Avansert AI-agent (LYXba) med tale, SMS og e-post.</li>
            <li>Dekkhotell-modul med posisjon, mønster og lagerstatus.</li>
          </ul>
        </div>
      </div>

      {/* Oppgradering / kontakt */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm text-xs text-[#475569]">
          <h2 className="text-sm font-semibold text-[#0F172A]">
            Tilpass planen til din bedrift
          </h2>
          <p className="mt-1">
            Når du er klar for mer, kan vi skru på AI-moduler, ekstra brukere
            eller skreddersydde integrasjoner.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-4">
            <li>Flere lokasjoner og avdelinger.</li>
            <li>Egne domener for landingssider.</li>
            <li>Tilpassede rapporter og dashboards.</li>
          </ul>

          <a
            href="mailto:nikolai@brisner.no?subject=LYXso%20plan"
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-[#2563EB] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#1D4ED8]"
          >
            Snakk med LYXso om plan
          </a>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 text-xs text-[#64748B]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
            Fakturering & lisens
          </p>
          <p className="mt-2">
            Selve faktureringen kan kjøres via Fiken/annet regnskapssystem. Her
            viser vi kun hvilke moduler som er aktive.
          </p>
        </div>
      </div>
    </section>
  );
}

type FeatureCardProps = {
  title: string;
  body: string;
};

function FeatureCard({ title, body }: FeatureCardProps) {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-xs text-[#475569]">
      <p className="text-[13px] font-semibold text-[#0F172A]">{title}</p>
      <p className="mt-1">{body}</p>
    </div>
  );
}
