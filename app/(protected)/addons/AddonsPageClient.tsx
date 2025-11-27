// app/(protected)/addons/AddonsPageClient.tsx
"use client";

import Link from "next/link";
import { useOrgPlan } from "@/lib/useOrgPlan";
import {
  getOrgPlanLabel,
  getOrgPlanShortInfo,
} from "@/lib/orgPlan";

export default function AddonsPageClient() {
  const { loading, error, plan, features } = useOrgPlan();

  // Her sier vi at addons krever at du har minst én av de «avanserte» modulene
  const canUseAddons = features.aiMarketing || features.lyxVision;

  return (
    <div className="h-full w-full overflow-y-auto px-6 py-6">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Tilleggspakker & moduler
          </h1>
          <p className="text-sm text-slate-400">
            Her samler vi ekstra moduler som LYXba, LYXvision og andre
            tillegg som kan kobles på LYXso-plattformen.
          </p>
        </header>

        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          {loading && (
            <p className="text-sm text-slate-300">
              Henter plan og funksjoner …
            </p>
          )}

          {error && (
            <p className="text-sm text-red-400">
              Klarte ikke å hente org-plan: {error}
            </p>
          )}

          {!loading && !error && (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Din LYXso-plan
                </p>
                <p className="text-base font-semibold text-slate-50">
                  {getOrgPlanLabel(plan)}
                </p>
                <p className="text-xs text-slate-400">
                  {getOrgPlanShortInfo(plan)}
                </p>
              </div>
            </div>
          )}
        </section>

        {!loading && !error && (
          <>
            {canUseAddons ? (
              <section className="space-y-4">
                <h2 className="text-sm font-semibold text-slate-100">
                  Tilgjengelige moduler
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                  <AddonCard
                    title="LYXba – Booking Agent"
                    badge="AI-markedsføring"
                    description="AI-drevet agent som håndterer leads, meldinger og bookinger på autopilot."
                    href="/ai-agent"
                  />
                  <AddonCard
                    title="LYXvision"
                    badge="Visuell analyse"
                    description="Visuell kontroll av coating, lakk og interiør med AR/AI-moduler."
                    href="/coating"
                  />
                  {/* Flere moduler kan legges til her senere */}
                </div>

                <p className="text-xs text-slate-500">
                  Dette er en første versjon av addons-siden. Etter hvert
                  vil partnere kunne aktivere/deaktivere moduler direkte her.
                </p>
              </section>
            ) : (
              <section className="space-y-4">
                <div className="rounded-xl border border-blue-500/40 bg-blue-500/10 p-4">
                  <h2 className="text-sm font-semibold text-blue-100">
                    Tilleggspakker krever prøve- eller betalt plan
                  </h2>
                  <p className="mt-1 text-xs text-blue-50/90">
                    For å aktivere moduler som LYXba og LYXvision trenger
                    dere en plan som inkluderer disse funksjonene.
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-blue-50/90">
                    <li>AI-drevet booking og lead-oppfølging</li>
                    <li>Visuell kontroll og analyser med LYXvision</li>
                    <li>Strammere arbeidsflyt og mer automatikk</li>
                  </ul>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      href="/plan"
                      className="inline-flex items-center rounded-md bg-blue-400 px-3 py-1.5 text-xs font-semibold text-slate-900 hover:bg-blue-300"
                    >
                      Oppgrader plan
                    </Link>
                    <Link
                      href="/kontrollpanel"
                      className="inline-flex items-center rounded-md border border-blue-500/60 px-3 py-1.5 text-xs font-medium text-blue-100 hover:bg-blue-500/10"
                    >
                      Tilbake til kontrollpanel
                    </Link>
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

type AddonCardProps = {
  title: string;
  badge: string;
  description: string;
  href: string;
};

function AddonCard({ title, badge, description, href }: AddonCardProps) {
  return (
    <Link
      href={href}
      className="block rounded-lg border border-slate-800 bg-slate-950/70 p-4 hover:border-blue-500/60 hover:bg-slate-900/80"
    >
      <div className="mb-2 inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300">
        {badge}
      </div>
      <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
      <p className="mt-1 text-xs text-slate-400">{description}</p>
    </Link>
  );
}
