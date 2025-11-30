// lib/apiConfig.ts
// Global konfiguration for API-kall

/**
 * Henter base URL for API
 */
export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";
}

/**
 * Henter standard org ID (for testing/development)
 * I produksjon bør dette hentes fra brukerens sesjon/context
 */
export function getDefaultOrgId(): string {
  return (
    process.env.NEXT_PUBLIC_DEFAULT_ORG_ID ||
    process.env.NEXT_PUBLIC_ORG_ID ||
    ""
  );
}

/**
 * Bygger full API URL
 */
export function buildApiUrl(path: string): string {
  const base = getApiBaseUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

/**
 * Bygger org-spesifikk API URL
 */
export function buildOrgApiUrl(orgId: string, path: string): string {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return buildApiUrl(`/api/orgs/${orgId}/${cleanPath}`);
}
