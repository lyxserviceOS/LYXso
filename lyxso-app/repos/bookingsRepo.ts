// repos/bookingsRepo.ts
// Repo-lag for booking-siden. Snakker med Fastify-API-et på port 4000.

import type {
  Booking,
  BookingStatus,
  Employee,
  Service,
  BookingCustomerSummary,
} from "@/types/booking";
import { getApiBaseUrl } from "@/lib/apiConfig";

const API_BASE_URL = getApiBaseUrl();

/**
 * ⚠️ IMPORTANT: Organization ID Configuration
 * 
 * This repo uses NEXT_PUBLIC_ORG_ID from environment variables.
 * The DEFAULT_ORG_ID below is a fallback for development/testing only.
 * 
 * Production deployments MUST set NEXT_PUBLIC_ORG_ID in their environment.
 * Without it, the app will use the default org (LYX Bil test org).
 * 
 * To set for your organization:
 * 1. Add NEXT_PUBLIC_ORG_ID=your-org-id-here to .env.local
 * 2. Restart your dev server
 */
const DEFAULT_ORG_ID = "ae407558-7f44-40cb-8fe9-1d023212b926"; // LYX Bil (test org)
const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID ?? DEFAULT_ORG_ID;

if (!ORG_ID) {
  // Dette skal i praksis aldri skje, men fint å feilsikre.
  // Sørg for at NEXT_PUBLIC_ORG_ID er satt i .env.local.
  // eslint-disable-next-line no-console
  console.error(
    "[bookingsRepo] Mangler NEXT_PUBLIC_ORG_ID – sett denne i .env.local",
  );
}

// ---------------------------
// Hjelpere
// ---------------------------

function getApiUrl(path: string): string {
  const base = API_BASE_URL.replace(/\/+$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

async function handleJsonResponse<T>(
  res: Response,
  context: string,
): Promise<T> {
  if (!res.ok) {
    let errorDetails = "";
    try {
      const json = await res.json();
      errorDetails = json.error || json.details || JSON.stringify(json);
    } catch {
      errorDetails = await res.text().catch(() => "");
    }
    
    // eslint-disable-next-line no-console
    console.error(`[bookingsRepo] ${context} feilet`, {
      status: res.status,
      statusText: res.statusText,
      body: errorDetails,
    });
    throw new Error(`Feil i ${context}: ${res.status} - ${errorDetails || res.statusText}`);
  }

  return (await res.json()) as T;
}

// ---------------------------
// Typer for repo-responser
// ---------------------------

export type BookingDashboardData = {
  services: Service[];
  employees: Employee[];
  customers: BookingCustomerSummary[];
  bookings: Booking[];
};

type ListBookingsResponse = {
  bookings: Booking[];
};

// Payload når vi oppretter booking fra UI
export type CreateBookingPayload = {
  customerName: string;
  serviceName: string;
  startTime: string; // ISO string: 2025-11-25T10:00
  endTime: string;
  status: BookingStatus;
  employeeId?: string;
  customerId?: string;
  notes?: string;
};

export type UpdateBookingPayload = Partial<{
  status: BookingStatus;
  startTime: string;
  endTime: string;
  employeeId: string;
  notes: string;
}>;

// ---------------------------
// Offentlige funksjoner
// ---------------------------

/**
 * Henter alt booking-relatert til dashboardet:
 * - tjenester
 * - ansatte
 * - kunder (forenklet BookingCustomerSummary)
 * - bookinger
 */
export async function fetchBookingDashboardData(): Promise<BookingDashboardData> {
  if (!ORG_ID) {
    throw new Error(
      "[bookingsRepo] ORG_ID mangler – sjekk NEXT_PUBLIC_ORG_ID",
    );
  }

  const orgPath = `/api/orgs/${ORG_ID}`;

  const [servicesRes, employeesRes, customersRes, bookingsRes] =
    await Promise.all([
      fetch(getApiUrl(`${orgPath}/services`), {
        method: "GET",
      }),
      fetch(getApiUrl(`${orgPath}/employees`), {
        method: "GET",
      }),
      fetch(getApiUrl(`${orgPath}/customers`), {
        method: "GET",
      }),
      fetch(getApiUrl(`${orgPath}/bookings`), {
        method: "GET",
      }),
    ]);

  const servicesJson = await handleJsonResponse<{ services: Service[] }>(
    servicesRes,
    "list_services",
  );
  const employeesJson = await handleJsonResponse<{ employees: Employee[] }>(
    employeesRes,
    "list_employees",
  );
  const customersJson =
    await handleJsonResponse<{ customers: BookingCustomerSummary[] }>(
      customersRes,
      "list_customers",
    );
  const bookingsJson = await handleJsonResponse<ListBookingsResponse>(
    bookingsRes,
    "list_bookings",
  );

  return {
    services: servicesJson.services ?? [],
    employees: employeesJson.employees ?? [],
    customers: customersJson.customers ?? [],
    bookings: bookingsJson.bookings ?? [],
  };
}

/**
 * Henter kun bookinger på nytt (brukes til "Oppdater bookinger"-knappen).
 */
export async function fetchBookings(): Promise<Booking[]> {
  if (!ORG_ID) {
    throw new Error(
      "[bookingsRepo] ORG_ID mangler – sjekk NEXT_PUBLIC_ORG_ID",
    );
  }

  const res = await fetch(getApiUrl(`/api/orgs/${ORG_ID}/bookings`), {
    method: "GET",
  });

  const json = await handleJsonResponse<ListBookingsResponse>(
    res,
    "list_bookings",
  );

  return json.bookings ?? [];
}

/**
 * Henter alle bookinger for én kunde (brukes i kundeprofil / timeline).
 */
export async function fetchBookingsForCustomer(
  customerId: string,
): Promise<Booking[]> {
  if (!ORG_ID) {
    throw new Error(
      "[bookingsRepo] ORG_ID mangler – sjekk NEXT_PUBLIC_ORG_ID",
    );
  }

  if (!customerId) {
    throw new Error("[bookingsRepo] customerId er påkrevd");
  }

  const res = await fetch(
    getApiUrl(`/api/orgs/${ORG_ID}/customers/${customerId}/bookings`),
    {
      method: "GET",
    },
  );

  const json = await handleJsonResponse<ListBookingsResponse>(
    res,
    "list_customer_bookings",
  );

  return json.bookings ?? [];
}

/**
 * Oppretter ny booking via API-et.
 * BookingPageClient forventer retur: { booking }
 */
export async function createBooking(payload: CreateBookingPayload): Promise<{
  booking: Booking;
}> {
  if (!ORG_ID) {
    throw new Error(
      "[bookingsRepo] ORG_ID mangler – sjekk NEXT_PUBLIC_ORG_ID",
    );
  }

  const res = await fetch(getApiUrl(`/api/orgs/${ORG_ID}/bookings`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await handleJsonResponse<{ booking: Booking }>(
    res,
    "create_booking",
  );

  // API-et returnerer i dag ikke alltid customerName/serviceName,
  // men UI-en bruker disse, så vi "patcher" inn det vi vet fra payload.
  const patched: Booking = {
    ...json.booking,
    customerName: payload.customerName || json.booking.customerName,
    serviceName: payload.serviceName || json.booking.serviceName,
    employeeId: payload.employeeId ?? json.booking.employeeId,
  };

  return { booking: patched };
}

/**
 * Oppdaterer eksisterende booking (status, tid, notater, ansatt).
 */
export async function updateBooking(
  bookingId: string,
  updates: UpdateBookingPayload,
): Promise<{ booking: Booking }> {
  if (!ORG_ID) {
    throw new Error(
      "[bookingsRepo] ORG_ID mangler – sjekk NEXT_PUBLIC_ORG_ID",
    );
  }

  if (!bookingId) {
    throw new Error("[bookingsRepo] bookingId er påkrevd");
  }

  const res = await fetch(
    getApiUrl(`/api/orgs/${ORG_ID}/bookings/${bookingId}`),
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    },
  );

  const json = await handleJsonResponse<{ booking: Booking }>(
    res,
    "update_booking",
  );

  const patched: Booking = {
    ...json.booking,
    employeeId: updates.employeeId ?? json.booking.employeeId,
    notes: updates.notes ?? json.booking.notes,
  };

  return { booking: patched };
}
