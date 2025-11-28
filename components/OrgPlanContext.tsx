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
import type { OrgPlan } from "@/types/org";
import type { PlanFeatureKey } from "@/lib/orgPlan";
import type { ModuleCode, Industry, WorkMode } from "@/types/industry";
import { DEFAULT_MODULES } from "@/types/industry";

type OrgSettings = {
  id: string;
  name: string | null;
  logoUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  isActive: boolean | null;
  plan: OrgPlan;
  // Extended settings for module/industry management
  enabledModules: ModuleCode[];
  industries: Industry[];
  workMode: WorkMode;
};

type OrgPlanContextValue = {
  loading: boolean;
  error: string | null;
  org: OrgSettings | null;
  plan: OrgPlan;
  features: Record<PlanFeatureKey, boolean>;
  enabledModules: ModuleCode[];
  isModuleEnabled: (module: ModuleCode) => boolean;
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
    enabledModules: DEFAULT_MODULES,
    isModuleEnabled: (module: ModuleCode) => DEFAULT_MODULES.includes(module),
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

        // Parse enabled modules from API response (fallback to defaults)
        const rawModules = raw?.enabledModules ?? raw?.enabled_modules ?? null;
        const enabledModules: ModuleCode[] = Array.isArray(rawModules) 
          ? rawModules 
          : DEFAULT_MODULES;

        // Parse industries from API response
        const rawIndustries = raw?.industries ?? null;
        const industries: Industry[] = Array.isArray(rawIndustries) ? rawIndustries : [];

        // Parse work mode from API response
        const workMode: WorkMode = raw?.workMode ?? raw?.work_mode ?? "fixed";

        const org: OrgSettings = {
          id: raw.id,
          name: raw.name ?? null,
          logoUrl: raw.logoUrl ?? null,
          primaryColor: raw.primaryColor ?? null,
          secondaryColor: raw.secondaryColor ?? null,
          isActive:
            typeof raw.isActive === "boolean" ? raw.isActive : null,
          plan,
          enabledModules,
          industries,
          workMode,
        };

        if (!cancelled) {
          setState({
            loading: false,
            error: null,
            org,
            plan,
            features: planFeatureFlags[plan],
            enabledModules,
            isModuleEnabled: (module: ModuleCode) => enabledModules.includes(module),
          });
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const errorMessage = err instanceof Error ? err.message : "Ukjent feil ved henting av org settings.";
          setState((prev) => ({
            ...prev,
            loading: false,
            error: errorMessage,
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
