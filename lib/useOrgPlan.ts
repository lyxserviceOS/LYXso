// lib/useOrgPlan.ts
"use client";

import { useEffect, useState } from "react";
import type { OrgPlan } from "@/types/org";
import {
  normalizeOrgPlan,
  planFeatureFlags,
  type PlanFeatureKey,
} from "./orgPlan";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

type OrgPlanHookState = {
  loading: boolean;
  error: string | null;
  plan: OrgPlan;
  features: (typeof planFeatureFlags)["free"];
  orgName: string | null;
  isActive: boolean | null;
};

export function useOrgPlan(): OrgPlanHookState {
  const [state, setState] = useState<OrgPlanHookState>({
    loading: true,
    error: null,
    // default hvis API ikke svarer / plan mangler
    plan: "trial",
    features: planFeatureFlags["trial"],
    orgName: null,
    isActive: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const orgId =
          process.env.NEXT_PUBLIC_DEFAULT_ORG_ID ??
          process.env.NEXT_PUBLIC_ORG_ID;

        if (!orgId) {
          throw new Error(
            "Mangler NEXT_PUBLIC_DEFAULT_ORG_ID (org-id) i .env.local.",
          );
        }

        const res = await fetch(
          `${API_BASE}/api/admin/orgs/${encodeURIComponent(orgId)}`,
          { cache: "no-store" },
        );

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(
            `Kunne ikke hente org-plan: ${res.status} ${text}`,
          );
        }

        const json = (await res.json()) as {
          org?: {
            plan?: string | null;
            name?: string | null;
            is_active?: boolean | null;
          };
        };

        const plan = normalizeOrgPlan(json.org?.plan);
        const orgName = json.org?.name ?? null;
        const isActive =
          typeof json.org?.is_active === "boolean"
            ? json.org.is_active
            : null;

        if (cancelled) return;

        setState({
          loading: false,
          error: null,
          plan,
          features: planFeatureFlags[plan],
          orgName,
          isActive,
        });
      } catch (err: unknown) {
        if (cancelled) return;

        const errorMessage = err instanceof Error ? err.message : "Ukjent feil ved henting av organisasjonsplan fra API.";
        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

export function useIsFeatureEnabled(feature: PlanFeatureKey): boolean {
  const { features } = useOrgPlan();
  return !!features[feature];
}
