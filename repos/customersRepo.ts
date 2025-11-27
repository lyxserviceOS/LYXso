// repos/customersRepo.ts
// Repo for kunder i LYXso – bruker Fastify-API på port 4000

import type { Booking } from "@/types/booking";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_LYXSO_API_BASE_URL ??
  "http://localhost:4000";

const DEFAULT_ORG_ID = "ae407558-7f44-40cb-8fe9-1d023212b926";
const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID ?? DEFAULT_ORG_ID;

if (!ORG_ID) {
  // Denne sjekken gjør at du får klar feilmelding i konsollen
  // hvis NEXT_PUBLIC_ORG_ID mangler.
  console.warn(
    "[customersRepo] NEXT_PUBLIC_ORG_ID mangler – kundekall vil feile."
  );
}

function getOrgBaseUrl() {
  if (!ORG_ID) {
    throw new Error(
      "[customersRepo] NEXT_PUBLIC_ORG_ID er ikke satt. Konfigurer miljøvariabelen."
    );
  }
  return `${API_BASE_URL.replace(/\/+$/, "")}/api/orgs/${ORG_ID}`;
}

export type Customer = {
  id: string;
  orgId: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  isActive?: boolean;
  hasTireHotel?: boolean;
  hasCoating?: boolean;
  createdAt: string | null;
  updatedAt: string | null;
};

type CustomersResponse = {
  customers: Customer[];
};

type CustomerResponse = {
  customer: Customer;
};

type CustomerBookingsResponse = {
  bookings: Booking[];
};

// Hent alle kunder (internt)
export async function fetchCustomers(params?: {
  search?: string;
  active?: boolean;
  hasTireHotel?: boolean;
  hasCoating?: boolean;
}): Promise<Customer[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.search) {
    queryParams.set('search', params.search);
  }
  if (params?.active !== undefined) {
    queryParams.set('active', String(params.active));
  }
  if (params?.hasTireHotel) {
    queryParams.set('hasTireHotel', 'true');
  }
  if (params?.hasCoating) {
    queryParams.set('hasCoating', 'true');
  }

  const queryString = queryParams.toString();
  const url = `${getOrgBaseUrl()}/customers${queryString ? `?${queryString}` : ''}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error(
      "[customersRepo] fetchCustomers error",
      res.status,
      await res.text()
    );
    throw new Error("Kunne ikke hente kunder.");
  }

  const data = (await res.json()) as CustomersResponse;
  return data.customers ?? [];
}

export type CreateCustomerPayload = {
  name: string;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
};

// Opprett kunde
export async function createCustomer(
  payload: CreateCustomerPayload
): Promise<Customer> {
  const url = `${getOrgBaseUrl()}/customers`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.error(
      "[customersRepo] createCustomer error",
      res.status,
      await res.text()
    );
    throw new Error("Kunne ikke opprette kunde.");
  }

  const data = (await res.json()) as CustomerResponse;
  return data.customer;
}

export type UpdateCustomerPayload = {
  name?: string;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
};

// Oppdater kunde
export async function updateCustomer(
  customerId: string,
  payload: UpdateCustomerPayload
): Promise<Customer> {
  const url = `${getOrgBaseUrl()}/customers/${customerId}`;

  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.error(
      "[customersRepo] updateCustomer error",
      res.status,
      await res.text()
    );
    throw new Error("Kunne ikke oppdatere kunde.");
  }

  const data = (await res.json()) as CustomerResponse;
  return data.customer;
}

// Hent alle bookinger for én kunde (via Fastify: GET /api/orgs/:orgId/customers/:customerId/bookings)
export async function fetchCustomerBookings(
  customerId: string
): Promise<Booking[]> {
  const url = `${getOrgBaseUrl()}/customers/${encodeURIComponent(
    customerId
  )}/bookings`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error(
      "[customersRepo] fetchCustomerBookings error",
      res.status,
      await res.text()
    );
    throw new Error("Kunne ikke hente bookinger for kunde.");
  }

  const data = (await res.json()) as CustomerBookingsResponse;
  return data.bookings ?? [];
}

// Hent én kunde
export async function fetchCustomer(customerId: string): Promise<Customer> {
  const url = `${getOrgBaseUrl()}/customers/${encodeURIComponent(customerId)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error(
      "[customersRepo] fetchCustomer error",
      res.status,
      await res.text()
    );
    throw new Error("Kunne ikke hente kunde.");
  }

  const data = (await res.json()) as CustomerResponse;
  return data.customer;
}

// Typer for kundestatistikk
export type CustomerStatistics = {
  totalBookings: number;
  completedBookings: number;
  totalRevenue: number;
  openAmount: number;
  lastVisit: string | null;
  nextRecommendedAction: string | null;
  hasCoating: boolean;
  coatingJobsCount: number;
};

type CustomerStatisticsResponse = {
  statistics: CustomerStatistics;
};

// Hent kundestatistikk
export async function fetchCustomerStatistics(
  customerId: string
): Promise<CustomerStatistics> {
  const url = `${getOrgBaseUrl()}/customers/${encodeURIComponent(
    customerId
  )}/statistics`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error(
      "[customersRepo] fetchCustomerStatistics error",
      res.status,
      await res.text()
    );
    throw new Error("Kunne ikke hente kundestatistikk.");
  }

  const data = (await res.json()) as CustomerStatisticsResponse;
  return data.statistics;
}

// Typer for notater
export type CustomerNote = {
  id: string;
  orgId: string;
  customerId: string;
  note: string;
  isInternal: boolean;
  createdAt: string;
  updatedAt: string;
};

type CustomerNotesResponse = {
  notes: CustomerNote[];
};

type CustomerNoteResponse = {
  note: CustomerNote;
};

// Hent kundenotater
export async function fetchCustomerNotes(
  customerId: string
): Promise<CustomerNote[]> {
  const url = `${getOrgBaseUrl()}/customers/${encodeURIComponent(
    customerId
  )}/notes`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error(
      "[customersRepo] fetchCustomerNotes error",
      res.status,
      await res.text()
    );
    throw new Error("Kunne ikke hente kundenotater.");
  }

  const data = (await res.json()) as CustomerNotesResponse;
  return data.notes ?? [];
}

export type CreateNotePayload = {
  note: string;
  isInternal?: boolean;
};

// Opprett kundenotat
export async function createCustomerNote(
  customerId: string,
  payload: CreateNotePayload
): Promise<CustomerNote> {
  const url = `${getOrgBaseUrl()}/customers/${encodeURIComponent(
    customerId
  )}/notes`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.error(
      "[customersRepo] createCustomerNote error",
      res.status,
      await res.text()
    );
    throw new Error("Kunne ikke opprette kundenotat.");
  }

  const data = (await res.json()) as CustomerNoteResponse;
  return data.note;
}

// Typer for betalinger
export type CustomerPayment = {
  id: string;
  orgId: string;
  customerId: string;
  bookingId?: string;
  amount: number;
  status: string;
  paymentMethod?: string;
  createdAt: string;
  paidAt?: string;
};

export type PaymentSummary = {
  totalPaid: number;
  totalPending: number;
  totalAmount: number;
};

type CustomerPaymentsResponse = {
  payments: CustomerPayment[];
  summary: PaymentSummary;
};

// Hent kundebetalinger
export async function fetchCustomerPayments(
  customerId: string
): Promise<{ payments: CustomerPayment[]; summary: PaymentSummary }> {
  const url = `${getOrgBaseUrl()}/customers/${encodeURIComponent(
    customerId
  )}/payments`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error(
      "[customersRepo] fetchCustomerPayments error",
      res.status,
      await res.text()
    );
    throw new Error("Kunne ikke hente kundebetalinger.");
  }

  const data = (await res.json()) as CustomerPaymentsResponse;
  return {
    payments: data.payments ?? [],
    summary: data.summary ?? { totalPaid: 0, totalPending: 0, totalAmount: 0 },
  };
}

// Typer for coating-jobber
export type CoatingJob = {
  id: string;
  orgId: string;
  bookingId?: string;
  customerId: string;
  vehicleVin?: string;
  vehicleReg?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleColor?: string;
  coatingProduct?: string;
  layers?: number;
  warrantyYears?: number;
  installedAt?: string;
  registeredAt?: string;
  createdAt: string;
  updatedAt: string;
};

type CoatingJobsResponse = {
  coatingJobs: CoatingJob[];
};

// Hent coating-jobber for kunde
export async function fetchCustomerCoatingJobs(
  customerId: string
): Promise<CoatingJob[]> {
  const url = `${getOrgBaseUrl()}/customers/${encodeURIComponent(
    customerId
  )}/coating-jobs`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error(
      "[customersRepo] fetchCustomerCoatingJobs error",
      res.status,
      await res.text()
    );
    throw new Error("Kunne ikke hente coating-jobber.");
  }

  const data = (await res.json()) as CoatingJobsResponse;
  return data.coatingJobs ?? [];
}

// Typer for dekksett
export type TireSet = {
  id: string;
  orgId: string;
  customerId: string;
  vehicleReg?: string;
  tireType?: string;
  tireBrand?: string;
  tireSize?: string;
  location?: string;
  condition?: string;
  storedAt?: string;
  createdAt: string;
  updatedAt: string;
};

type TireSetsResponse = {
  tireSets: TireSet[];
};

// Hent dekksett for kunde
export async function fetchCustomerTireSets(
  customerId: string
): Promise<TireSet[]> {
  const url = `${getOrgBaseUrl()}/customers/${encodeURIComponent(
    customerId
  )}/tire-storage`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error(
      "[customersRepo] fetchCustomerTireSets error",
      res.status,
      await res.text()
    );
    throw new Error("Kunne ikke hente dekksett.");
  }

  const data = (await res.json()) as TireSetsResponse;
  return data.tireSets ?? [];
}

