// lyxso-app/types/payments.ts
// Betalingsmodul: Payment (rå transaksjon), AccountingEntry (rapportlinje), Invoice (faktura)

export type PaymentStatus = "pending" | "paid" | "refunded" | "failed";

export interface Payment {
  id: string;
  org_id: string;
  booking_id?: string | null;
  customer_id?: string | null;
  service_id?: string | null;
  addon_id?: string | null;
  amount: number;
  currency: string;
  payment_provider?: string | null;
  status: PaymentStatus;
  fee?: number | null;
  reference?: string | null;
  receipt_url?: string | null;
  meta?: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface AccountingEntry {
  id: string;
  org_id: string;
  payment_id?: string | null;
  invoice_id?: string | null;
  entry_type: "income" | "fee" | "vat" | "correction" | string;
  description?: string | null;
  amount: number;
  currency: string;
  customer_id?: string | null;
  service_id?: string | null;
  booking_id?: string | null;
  provider_reference?: string | null;
  exported_at?: string | null;
  fiken_id?: string | null;
  poweroffice_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  org_id: string;
  customer_id?: string | null;
  booking_id?: string | null;
  number: string;
  issue_date?: string | null;
  due_date?: string | null;
  status: "open" | "sent" | "paid" | "void" | string;
  total_amount: number;
  currency: string;
  fiken_id?: string | null;
  poweroffice_id?: string | null;
  pdf_url?: string | null;
  created_at: string;
  updated_at: string;
}