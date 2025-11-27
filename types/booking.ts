// types/booking.ts
// Felles typer for booking, tjenester, ansatte og kunder.

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

// Booking slik den kommer fra API-et (bookings-rutene)
export interface Booking {
  id: string;
  orgId: string;

  customerId: string | null;

  status: BookingStatus;
  title: string | null;
  notes: string | null;

  startTime: string | null;
  endTime: string | null;

  totalAmount: number | null;
  currency: string | null;

  createdAt: string | null;
  updatedAt: string | null;

  // Tilleggsfelter som kan komme direkte fra DB eller patches i repo:
  customerName?: string | null;
  serviceName?: string | null;
  source?: string | null;
  employeeId?: string | null;
}

// Tjeneste – mappet fra mapServiceRow i API-et
export interface Service {
  id: string;
  orgId: string;
  categoryId: string | null;
  name: string;
  description: string | null;
  durationMinutes: number | null;
  price: number | null;
  isActive: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

// Ansatt – mappet fra mapEmployeeRow i API-et
export interface Employee {
  id: string;
  orgId: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string | null;
  isActive: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

// Kunde slik booking-siden trenger den (liste/velger)
export interface BookingCustomerSummary {
  id: string;
  orgId: string;
  name: string;
  email: string | null;
  phone: string | null;
  notes?: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}
