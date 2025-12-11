import type { Service } from "@/types/service";
import { getApiBaseUrl } from "@/lib/apiConfig";

const API_BASE_URL = getApiBaseUrl();

const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID;

if (!ORG_ID) {
  // Dette vil kun logges i konsollen ved bygg / kjøring
  // og hjelper oss å fange feil konfigurasjon tidlig.
  console.warn(
    "[publicBookingRepo] NEXT_PUBLIC_ORG_ID er ikke satt. API-kall vil feile."
  );
}

export type PublicBookingPayload = {
  startTime: string;
  endTime: string;
  status?: "pending" | "confirmed" | "completed" | "cancelled";
  customerId?: string | null;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  serviceId?: string;
  serviceName?: string;
  notes?: string;
};

/**
 * Hent liste over tjenester som kan bookes.
 * Bruker samme /api/orgs/:orgId/services-endepunkt som internt.
 */
export async function fetchPublicServices(): Promise<Service[]> {
  if (!ORG_ID) {
    throw new Error("Manglende orgId (NEXT_PUBLIC_ORG_ID).");
  }

  const res = await fetch(
    `${API_BASE_URL}/api/orgs/${encodeURIComponent(ORG_ID)}/services`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("[fetchPublicServices] error body:", text);
    throw new Error("Feil ved henting av tjenester fra API.");
  }

  const json = await res.json().catch(() => null);

  // Vi forsøker å være robuste mot forskjellige svar-strukturer
  if (json && Array.isArray(json.services)) return json.services;
  if (json && Array.isArray(json.data)) return json.data;
  if (Array.isArray(json)) return json;

  return [];
}

/**
 * Opprett en offentlig bookingforespørsel.
 * Ruter til: POST /api/public/orgs/:orgId/bookings
 * Backenden håndterer:
 *  - opprettelse / oppdatering av kunde (customerName/customerEmail/phone)
 *  - innsending av booking med status (default "pending")
 */
export async function createPublicBooking(payload: PublicBookingPayload) {
  if (!ORG_ID) {
    throw new Error("Manglende orgId (NEXT_PUBLIC_ORG_ID).");
  }

  const res = await fetch(
    `${API_BASE_URL}/api/public/orgs/${encodeURIComponent(ORG_ID)}/bookings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    let errorMessage = "Kunne ikke opprette booking.";

    try {
      const err = await res.json();
      if (typeof err?.error === "string") {
        errorMessage = err.error;
      }
    } catch {
      // Ignorer JSON-feil – vi har allerede en fallback-melding
    }

    throw new Error(errorMessage);
  }

  // Vanligvis ikke kritisk hva som returneres her – men vi sender det videre
  // i tilfelle du vil bruke det senere (f.eks. tracking).
  return res.json().catch(() => null);
}
