// app/p/[orgId]/page.tsx

import type { Metadata } from "next";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

type LandingPageSettings = {
  heroBadge?: string | null;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  primaryCtaLabel?: string | null;
  primaryCtaUrl?: string | null;
  secondaryCtaLabel?: string | null;
  secondaryCtaUrl?: string | null;
  feature1Title?: string | null;
  feature1Body?: string | null;
  feature2Title?: string | null;
  feature2Body?: string | null;
  feature3Title?: string | null;
  feature3Body?: string | null;
  isPublished?: boolean | null;
};

type PageProps = {
  // Next 16: params er en Promise i server components
  params: Promise<{
    orgId: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: PageProps,
): Promise<Metadata> {
  const { orgId } = await props.params;

  return {
    title: `Book time – LYXso partner ${orgId}`,
    description:
      "Online booking, kunder og drift samlet på ett sted. Denne siden er satt opp av din LYXso-partner.",
  };
}

export default async function PublicLandingPage(props: PageProps) {
  const { orgId } = await props.params;

  let landing: LandingPageSettings | null = null;
  let loadError: string | null = null;

  try {
    const res = await fetch(
      `${API_BASE}/api/orgs/${orgId}/landing-page`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) {
      loadError = `Feil ved henting av landing-page (public): ${res.status}`;
    } else {
      const json = await res.json();
      landing = (json?.landingPage as LandingPageSettings) ?? null;
    }
  } catch (err) {
    console.error("Feil ved henting av landing-page (public):", err);
    loadError = "Feil ved henting av landing-page (public).";
  }

  // Default-tekster hvis partner ikke har satt noe enda
  const heroBadge =
    landing?.heroBadge ?? "LYXso • Booking & drift";
  const heroTitle =
    landing?.heroTitle ?? "Book bilpleie og tjenester på nett.";
  const heroSubtitle =
    landing?.heroSubtitle ??
    "Enkel online booking, bekreftelser og påminnelser – satt opp av din lokale LYXso-partner.";

  const primaryCtaLabel =
    landing?.primaryCtaLabel ?? "Bestill time";
  const primaryCtaUrl =
    landing?.primaryCtaUrl ?? "#booking";

  const secondaryCtaLabel =
    landing?.secondaryCtaLabel ?? "Se tjenester";
  const secondaryCtaUrl =
    landing?.secondaryCtaUrl ?? "#tjenester";

  const feature1Title =
    landing?.feature1Title ?? "Online booking 24/7";
  const feature1Body =
    landing?.feature1Body ??
    "Kundene dine kan booke når det passer dem – du får full oversikt i LYXso.";

  const feature2Title =
    landing?.feature2Title ?? "Automatiske varsler";
  const feature2Body =
    landing?.feature2Body ??
    "Påminnelser, bekreftelser og oppfølging går automatisk til kunden.";

  const feature3Title =
    landing?.feature3Title ?? "Tilpasset din bedrift";
  const feature3Body =
    landing?.feature3Body ??
    "Tekst, farger og innhold er tilpasset hver enkelt partner.";

  const isPublished = landing?.isPublished ?? false;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8">
        {/* Topplinje / liten status */}
        <header className="mb-6 flex items-center justify-between text-xs text-slate-400">
          <span>LYXso – kundeside</span>
          <span className="font-mono text-[11px] text-slate-500">
            Org: {orgId}
          </span>
        </header>

        {/* HERO */}
        <section className="grid flex-1 items-center gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div>
            <div className="mb-2 inline-flex items-center rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-[11px] text-sky-200">
              {heroBadge}
            </div>
            <h1 className="mb-3 text-3xl font-semibold md:text-4xl">
              {heroTitle}
            </h1>
            <p className="mb-4 max-w-xl text-sm text-slate-200">
              {heroSubtitle}
            </p>

            {/* CTA-knapper */}
            <div className="mb-4 flex flex-wrap gap-2 text-xs">
              <a
                href={primaryCtaUrl}
                className="inline-flex items-center rounded-full bg-sky-500 px-4 py-2 font-medium text-slate-950 hover:bg-sky-400"
              >
                {primaryCtaLabel}
              </a>
              <a
                href={secondaryCtaUrl}
                className="inline-flex items-center rounded-full border border-slate-600 bg-slate-900 px-4 py-2 font-medium text-slate-50 hover:border-slate-400"
              >
                {secondaryCtaLabel}
              </a>
            </div>

            {/* Evt. feilmelding */}
            {loadError && (
              <p className="mt-2 text-[11px] text-red-400">
                {loadError}
              </p>
            )}

            {!isPublished && (
              <p className="mt-2 text-[11px] text-amber-300">
                Denne landingssiden er ikke merket som publisert
                enda. Innstillinger endres i LYXso-portalen.
              </p>
            )}
          </div>

          {/* Sidepanel med fordeler */}
          <aside className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-[11px]">
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-3">
              <div className="mb-1 font-semibold">
                {feature1Title}
              </div>
              <div className="text-slate-300">{feature1Body}</div>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-3">
              <div className="mb-1 font-semibold">
                {feature2Title}
              </div>
              <div className="text-slate-300">{feature2Body}</div>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-3">
              <div className="mb-1 font-semibold">
                {feature3Title}
              </div>
              <div className="text-slate-300">{feature3Body}</div>
            </div>
          </aside>
        </section>

        {/* Footer */}
        <footer className="mt-8 border-t border-slate-800 pt-4 text-[11px] text-slate-500">
          Driftes av LYXso – serviceOS for bilpleie og verksted.
        </footer>
      </div>
    </main>
  );
}
