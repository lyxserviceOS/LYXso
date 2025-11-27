// C:\Users\maser\OneDrive\Skrivebord\LYX selskaper\lyxso-app\app\(public)\org\[orgId]\page.tsx
import type { Metadata } from "next";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

type LandingPageSettings = {
  orgId: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  primaryCtaLabel: string;
  primaryCtaUrl: string;
  secondaryCtaLabel: string;
  secondaryCtaUrl: string;
  feature1Title: string;
  feature1Body: string;
  feature2Title: string;
  feature2Body: string;
  feature3Title: string;
  feature3Body: string;
  bookingMode: "internal" | "external";
  bookingExternalUrl: string;
  showBookingSection: boolean;
  showServicesGrid: boolean;
  highlightServiceIds: string[];
  isPublished: boolean;
};

type PageProps = {
  params: { orgId: string };
};

export const metadata: Metadata = {
  title: "Bestill time – LYXso-partner",
  description: "Kundelandingsside for LYXso-partner.",
};

async function fetchLandingPage(
  orgId: string,
): Promise<LandingPageSettings | null> {
  if (!API_BASE) {
    return null;
  }

  try {
    const res = await fetch(
      `${API_BASE}/api/orgs/${orgId}/landing-page`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      console.error(
        "Feil ved henting av landingsside:",
        res.status,
        res.statusText,
      );
      return null;
    }

    const json = await res.json();
    return json.landingPage as LandingPageSettings;
  } catch (err) {
    console.error("Uventet feil ved henting av landingsside:", err);
    return null;
  }
}

export default async function OrgLandingPage({ params }: PageProps) {
  const landingPage = await fetchLandingPage(params.orgId);

  if (!landingPage || !landingPage.isPublished) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-semibold">
            Landingssiden er ikke tilgjengelig
          </h1>
          <p className="text-sm text-gray-600">
            Kontakt bedriften direkte for å bestille time.
          </p>
        </div>
      </main>
    );
  }

  const primaryHref =
    landingPage.bookingMode === "external" &&
    landingPage.bookingExternalUrl
      ? landingPage.bookingExternalUrl
      : landingPage.primaryCtaUrl || "#booking";

  const secondaryHref = landingPage.secondaryCtaUrl || "#info";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 py-12 lg:py-20">
        <div className="space-y-4">
          {landingPage.heroBadge && (
            <div className="inline-flex items-center rounded-full border border-slate-700 px-3 py-1 text-xs uppercase tracking-wide text-slate-300">
              {landingPage.heroBadge}
            </div>
          )}

          <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
            {landingPage.heroTitle}
          </h1>

          {landingPage.heroSubtitle && (
            <p className="max-w-2xl text-base md:text-lg text-slate-300">
              {landingPage.heroSubtitle}
            </p>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            {landingPage.primaryCtaLabel && (
              <a
                href={primaryHref}
                className="inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium bg-sky-500 hover:bg-sky-400 text-slate-950"
              >
                {landingPage.primaryCtaLabel}
              </a>
            )}

            {landingPage.secondaryCtaLabel && (
              <a
                href={secondaryHref}
                className="inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium border border-slate-700 hover:bg-slate-900"
              >
                {landingPage.secondaryCtaLabel}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="info"
        className="max-w-5xl mx-auto px-4 pb-10 grid gap-6 md:grid-cols-3"
      >
        {[
          {
            title: landingPage.feature1Title,
            body: landingPage.feature1Body,
          },
          {
            title: landingPage.feature2Title,
            body: landingPage.feature2Body,
          },
          {
            title: landingPage.feature3Title,
            body: landingPage.feature3Body,
          },
        ]
          .filter((f) => f.title || f.body)
          .map((f, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-2"
            >
              {f.title && (
                <h3 className="text-sm font-semibold text-slate-50">
                  {f.title}
                </h3>
              )}
              {f.body && (
                <p className="text-sm text-slate-300 leading-relaxed">
                  {f.body}
                </p>
              )}
            </div>
          ))}
      </section>

      {/* Booking-seksjon */}
      {landingPage.showBookingSection && (
        <section
          id="booking"
          className="border-t border-slate-900 bg-slate-950/80"
        >
          <div className="max-w-5xl mx-auto px-4 py-10 space-y-4">
            <h2 className="text-xl font-semibold">Bestill time</h2>

            {landingPage.bookingMode === "internal" && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-300">
                Her kommer LYXso-bookingwidgeten for denne partneren.
              </div>
            )}

            {landingPage.bookingMode === "external" &&
              landingPage.bookingExternalUrl && (
                <div className="space-y-3">
                  <p className="text-sm text-slate-300">
                    Booking håndteres via partnerens eksterne bookingløsning.
                  </p>
                  <a
                    href={landingPage.bookingExternalUrl}
                    className="inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium bg-sky-500 hover:bg-sky-400 text-slate-950"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Gå til booking
                  </a>
                </div>
              )}

            {landingPage.bookingMode === "external" &&
              !landingPage.bookingExternalUrl && (
                <p className="text-sm text-red-400">
                  Ekstern booking er aktivert, men ingen URL er satt i
                  landingsside-innstillingene.
                </p>
              )}
          </div>
        </section>
      )}
    </main>
  );
}
