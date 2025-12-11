// types/booking.ts
// Felles typer for booking, tjenester, ansatte og kunder.

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";

export type BookingSource =
  | "online"
  | "phone"
  | "walk_in"
  | "ai_agent"
  | "api"
  | "recurring"
  | "manual";

export type PaymentStatus =
  | "not_required"
  | "pending"
  | "deposit_paid"
  | "paid"
  | "refunded"
  | "failed";

// Booking slik den kommer fra API-et (bookings-rutene)
export interface Booking {
  id: string;
  orgId: string;

  customerId: string | null;
  serviceId: string | null;
  employeeId: string | null;
  locationId: string | null;
  resourceId: string | null;

  status: BookingStatus;
  title: string | null;
  notes: string | null;
  internalNotes: string | null;

  startTime: string | null;
  endTime: string | null;

  // Pricing
  totalAmount: number | null;
  depositAmount: number | null;
  discountAmount: number | null;
  currency: string | null;
  paymentStatus: PaymentStatus;

  // Source tracking
  source: BookingSource;
  referralCode: string | null;
  campaignId: string | null;

  // Recurrence
  isRecurring: boolean;
  recurrenceRule: string | null;
  parentBookingId: string | null;
  seriesId: string | null;
  seriesIndex: number | null;

  // Timestamps
  createdAt: string | null;
  updatedAt: string | null;
  confirmedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;

  // Denormalized fields from joins (for display purposes)
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  serviceName?: string | null;
  servicePrice?: number | null;
  employeeName?: string | null;
  locationName?: string | null;
  resourceName?: string | null;
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
  costPrice: number | null;
  offerPrice: number | null;
  isOnOffer: boolean;
  allowOnlineBooking: boolean;
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

// Booking settings for org
export interface BookingSettings {
  id: string;
  orgId: string;
  
  // Online booking
  allowOnlineBooking: boolean;
  requireApproval: boolean;
  showAvailableSlots: boolean;
  
  // Time constraints
  minBookingLeadHours: number;
  maxBookingLeadDays: number;
  defaultSlotDurationMinutes: number;
  
  // Buffer time
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  
  // Cancellation policy
  allowCancellation: boolean;
  cancellationDeadlineHours: number;
  
  // Deposit/Payment
  requireDeposit: boolean;
  depositPercentage: number;
  acceptOnlinePayment: boolean;
  
  // Notifications
  sendConfirmationEmail: boolean;
  sendConfirmationSms: boolean;
  sendReminderEmail: boolean;
  sendReminderSms: boolean;
  reminderHoursBefore: number;
  
  // Working hours by day of week
  workingHours: Record<
    'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday',
    { open: string; close: string } | null
  >;
  
  // Holidays/closures (ISO date strings)
  holidays: string[];
  
  createdAt: string | null;
  updatedAt: string | null;
}
