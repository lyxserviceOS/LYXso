"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  normalizeOrgPlan,
  planFeatureFlags,
} from "@/lib/orgPlan";
import type { OrgPlan, PlanFeatureKey } from "@/lib/orgPlan";

type OrgSettings = {
  id: string;
  name: string | null;
  logoUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  isActive: boolean | null;
  plan: OrgPlan;
};

type OrgPlanContextValue = {
  loading: boolean;
  error: string | null;
  org: OrgSettings | null;
  plan: OrgPlan;
  features: Record<PlanFeatureKey, boolean>;
};

const OrgPlanContext = createContext<OrgPlanContextValue | undefined>(
  undefined,
);

export function OrgPlanProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<OrgPlanContextValue>({
    loading: true,
    error: null,
    org: null,
    plan: "trial",
    features: planFeatureFlags.trial,
  });

  useEffect(() => {
    let cancelled = false;
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
    const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID;

    async function load() {
      if (!API_BASE || !ORG_ID) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            "Mangler NEXT_PUBLIC_API_BASE eller NEXT_PUBLIC_ORG_ID i miljøvariabler.",
        }));
        return;
      }

      try {
        setState((prev) => ({
          ...prev,
          loading: true,
          error: null,
        }));

        const base = API_BASE.replace(/\/$/, "");
        const res = await fetch(`${base}/api/orgs/${ORG_ID}/settings`);
        const json = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(
            json?.error ??
              `Feil ved henting av org settings (status ${res.status})`,
          );
        }

        const raw = json?.org;
        const planStr: string | null | undefined = raw?.plan ?? null;
        const plan = normalizeOrgPlan(planStr);

        const org: OrgSettings = {
          id: raw.id,
          name: raw.name ?? null,
          logoUrl: raw.logoUrl ?? null,
          primaryColor: raw.primaryColor ?? null,
          secondaryColor: raw.secondaryColor ?? null,
          isActive:
            typeof raw.isActive === "boolean" ? raw.isActive : null,
          plan,
        };

        if (!cancelled) {
          setState({
            loading: false,
            error: null,
            org,
            plan,
            features: planFeatureFlags[plan],
          });
        }
      } catch (err: any) {
        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error:
              err?.message ??
              "Ukjent feil ved henting av org settings.",
          }));
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <OrgPlanContext.Provider value={state}>
      {children}
    </OrgPlanContext.Provider>
  );
}

export function useOrgPlan(): OrgPlanContextValue {
  const ctx = useContext(OrgPlanContext);
  if (!ctx) {
    throw new Error("useOrgPlan må brukes inne i OrgPlanProvider.");
  }
  return ctx;
}
