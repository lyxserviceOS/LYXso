// lib/repos/adminOrgsRepo.ts
// Repo-lag for admin-oversikt over organisasjoner (orgs-tabellen).
// Snakker med Fastify-API-et på port 4000 via /api/admin/orgs- endepunktene.

import { getApiBaseUrl } from "@/lib/apiConfig";

export type AdminOrg = {
  id: string;
  createdAt: string | null;
  name: string;
  orgNumber: string | null;
  logoUrl: string | null;
  isActive: boolean;
  plan: "free" | "trial" | "paid" | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  trialStartedAt: string | null;
  trialEndsAt: string | null;
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Hjelper for å pakke ut JSON og kaste pene feil.
 */
async function parseJsonResponse<T>(res: Response, context: string): Promise<T> {
  let json: any = null;
  let jsonParseError: Error | null = null;

  try {
    json = await res.json();
  } catch (err) {
    jsonParseError = err instanceof Error ? err : new Error(String(err));
  }

  if (!res.ok) {
    // If response is not OK, try to extract error message
    const message =
      (json && (json.error || json.message || json.details)) ||
      `Uventet feil i ${context} (status ${res.status})`;

    throw new Error(message);
  }

  // If response was OK but JSON parsing failed, throw explicit error
  if (!json && jsonParseError) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `${context}: Kunne ikke parse JSON-respons. ${jsonParseError.message}. Body: ${text.substring(0, 200)}`
    );
  }

  // If response was OK but json is still null (empty response)
  if (!json) {
    throw new Error(`${context}: Tom respons fra server`);
  }

  return json as T;
}

/**
 * Hent alle organisasjoner for admin.
 * Kaller GET /api/admin/orgs
 */
export async function fetchAdminOrgs(): Promise<AdminOrg[]> {
  const res = await fetch(`${API_BASE_URL}/api/admin/orgs`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // Viktig for Next.js app-router: sørg for at vi alltid fetcher fra server
    // når vi er på klienten (ikke cache gamle data).
    cache: "no-store",
  });

  const json = await parseJsonResponse<{ orgs: any[] }>(
    res,
    "fetchAdminOrgs",
  );

  return (json.orgs ?? []).map((row) => ({
    id: String(row.id),
    createdAt: row.created_at ?? null,
    name: row.name ?? "Uten navn",
    orgNumber: row.org_number ?? null,
    logoUrl: row.logo_url ?? null,
    isActive: Boolean(row.is_active),
    plan: (row.plan as AdminOrg["plan"]) ?? null,
    primaryColor: row.primary_color ?? null,
    secondaryColor: row.secondary_color ?? null,
    trialStartedAt: row.trial_started_at ?? null,
    trialEndsAt: row.trial_ends_at ?? null,
  }));
}

/**
 * Oppdater kun plan for en org.
 * Kaller PATCH /api/admin/orgs/:orgId/plan
 */
export async function updateOrgPlan(
  orgId: string,
  plan: AdminOrg["plan"],
): Promise<AdminOrg> {
  if (!orgId) {
    throw new Error("Mangler orgId i updateOrgPlan");
  }

  const res = await fetch(
    `${API_BASE_URL}/api/admin/orgs/${encodeURIComponent(orgId)}/plan`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ plan }),
    },
  );

  const json = await parseJsonResponse<{ org: any }>(
    res,
    "updateOrgPlan",
  );

  const row = json.org;

  return {
    id: String(row.id),
    createdAt: row.created_at ?? null,
    name: row.name ?? "Uten navn",
    orgNumber: row.org_number ?? null,
    logoUrl: row.logo_url ?? null,
    isActive: Boolean(row.is_active),
    plan: (row.plan as AdminOrg["plan"]) ?? null,
    primaryColor: row.primary_color ?? null,
    secondaryColor: row.secondary_color ?? null,
    trialStartedAt: row.trial_started_at ?? null,
    trialEndsAt: row.trial_ends_at ?? null,
  };
}

/**
 * Oppdater aktiv/inaktiv + evt. navn senere.
 * Kaller PATCH /api/admin/orgs/:orgId
 */
export async function updateOrgActiveStatus(
  orgId: string,
  isActive: boolean,
): Promise<AdminOrg> {
  if (!orgId) {
    throw new Error("Mangler orgId i updateOrgActiveStatus");
  }

  const res = await fetch(
    `${API_BASE_URL}/api/admin/orgs/${encodeURIComponent(orgId)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      // NB: backend forventer snake_case (is_active).
      body: JSON.stringify({ is_active: isActive }),
    },
  );

  const json = await parseJsonResponse<{ org: any }>(
    res,
    "updateOrgActiveStatus",
  );

  const row = json.org;

  return {
    id: String(row.id),
    createdAt: row.created_at ?? null,
    name: row.name ?? "Uten navn",
    orgNumber: row.org_number ?? null,
    logoUrl: row.logo_url ?? null,
    isActive: Boolean(row.is_active),
    plan: (row.plan as AdminOrg["plan"]) ?? null,
    primaryColor: row.primary_color ?? null,
    secondaryColor: row.secondary_color ?? null,
    trialStartedAt: row.trial_started_at ?? null,
    trialEndsAt: row.trial_ends_at ?? null,
  };
}
