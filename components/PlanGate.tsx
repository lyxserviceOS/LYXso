// components/PlanGate.tsx
"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import type { OrgPlan } from "@/types/org";
import {
  normalizeOrgPlan,
  getOrgPlanLabel,
  getOrgPlanShortInfo,
  getOrgPlanPriceInfo,
  isFeatureEnabled,
  type PlanFeatureKey,
} from "@/lib/orgPlan";
import { getApiBaseUrl, getDefaultOrgId } from "@/lib/apiConfig";

const API_BASE_URL = getApiBaseUrl();
const ORG_ID = getDefaultOrgId();

type OrgFromApi = {
  id: string;
  name: string | null;
  logoUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  isActive: boolean | null;
  plan: string | null;
};

type OrgSettingsResponse = {
  org: OrgFromApi | null;
};

type PlanGateProps = {
  /** Hvilken feature som kreves, f.eks. "aiMarketing" eller "lyxVision" */
  feature?: PlanFeatureKey;
  /** Alternativt: eksplisitt hvilke planer som har tilgang, f.eks. ["trial", "paid"] */
  allowedPlans?: OrgPlan[];
  /** Selve innholdet som bare skal vises hvis man har tilgang */
  children: ReactNode;
  /** Custom tittel når funksjonen er låst */
  title?: string;
  /** Custom tekst når funksjonen er låst */
  description?: string;
};

export function PlanGate(props: PlanGateProps) {
  const {
    feature,
    allowedPlans,
    children,
    title,
    description,
  } = props;

  const [org, setOrg] = useState<OrgFromApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadOrgSettings() {
      if (!ORG_ID) {
        setError("Mangler NEXT_PUBLIC_ORG_ID i miljøvariabler.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(
          `${API_BASE_URL}/api/orgs/${ORG_ID}/settings`,
        );

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(
            text || `Feil fra API (${res.status} ${res.statusText})`,
          );
        }

        const json = (await res.json()) as OrgSettingsResponse;

        if (!cancelled) {
          setOrg(json.org ?? null);
          setError(null);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(
            err?.message ??
              "Ukjent feil ved henting av organisasjons-innstillinger.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadOrgSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  const effectivePlan: OrgPlan = normalizeOrgPlan(org?.plan ?? null);
  const planLabel = getOrgPlanLabel(effectivePlan);
  const planInfo = getOrgPlanShortInfo(effectivePlan);

  let isAllowed = true;

  if (feature) {
    isAllowed = isFeatureEnabled(effectivePlan, feature);
  } else if (allowedPlans && allowedPlans.length > 0) {
    isAllowed = allowedPlans.includes(effectivePlan);
  }

  // Hvis noe er galt med config: vis feilmelding
  if (!ORG_ID) {
    return (
      <div className="rounded-xl border border-red-800 bg-red-950/40 px-4 py-3 text-xs text-red-200">
        <p className="font-semibold">Manglende oppsett</p>
        <p className="mt-1">
          NEXT_PUBLIC_ORG_ID mangler. Sett denne i <code>.env.local</code> for
          at plan-håndtering skal fungere.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-xs text-slate-300">
        Laster organisasjons-plan …
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-800 bg-red-950/40 px-4 py-3 text-xs text-red-200">
        <p className="font-semibold">Feil ved henting av plan</p>
        <p className="mt-1">{error}</p>
      </div>
    );
  }

  if (isAllowed) {
    return <>{children}</>;
  }

  const lockedTitle =
    title ??
    "Denne funksjonen er låst for nåværende LYXso-plan.";
  const lockedDescription =
    description ??
    "For å bruke denne modulen må dere oppgradere til prøve- eller betalt-plan. Gratisplanen gir enkel booking med reklame, men ikke AI-moduler.";

  return (
    <div className="rounded-2xl border border-amber-800/60 bg-amber-950/20 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-amber-900/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-200">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            Låst funksjon
          </p>

          <h2 className="mt-3 text-sm font-semibold text-amber-50">
            {lockedTitle}
          </h2>
          <p className="mt-1 text-xs text-amber-100/80">
            {lockedDescription}
          </p>

          <p className="mt-3 text-[11px] text-amber-100/80">
            Nåværende plan:{" "}
            <span className="font-semibold">{planLabel}</span>.{" "}
            {planInfo}
          </p>
          <p className="mt-1 text-[11px] text-amber-100/80">
            Betalt plan: {getOrgPlanPriceInfo("paid")}
          </p>

          {org?.name && (
            <p className="mt-1 text-[11px] text-amber-100/70">
              Organisasjon:{" "}
              <span className="font-medium">{org.name}</span>
            </p>
          )}
        </div>

        <div className="hidden sm:flex flex-col items-end gap-2">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            Be om oppgradering
          </button>
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-amber-500/40 bg-transparent px-3 py-1.5 text-[11px] font-medium text-amber-100 hover:bg-amber-900/40"
          >
            Se priser & vilkår
          </button>
        </div>
      </div>
    </div>
  );
}
