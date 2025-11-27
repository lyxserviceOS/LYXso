// types/integration.ts
// Types for External Integrations module (Module 27)
// Accounting (Fiken/PowerOffice), Payment terminals (iZettle/SumUp), Communication (SMS/Email)

export type IntegrationType = 
  | "accounting"
  | "payment_terminal"
  | "payment_online"
  | "sms"
  | "email"
  | "calendar"
  | "crm";

export type IntegrationProvider = 
  // Accounting
  | "fiken"
  | "poweroffice"
  // Payment terminals
  | "izettle"
  | "sumup"
  | "nets"
  // Online payments
  | "vipps"
  | "stripe"
  // Communication
  | "twilio"
  | "sendgrid"
  | "mailjet"
  | "sveve"
  // Calendar
  | "google_calendar"
  | "outlook"
  // CRM
  | "hubspot"
  | "pipedrive";

export type IntegrationStatus = 
  | "not_connected"
  | "connecting"
  | "connected"
  | "error"
  | "disconnected";

export interface Integration {
  id: string;
  org_id: string;
  
  type: IntegrationType;
  provider: IntegrationProvider;
  
  status: IntegrationStatus;
  
  // OAuth / API credentials (encrypted in DB)
  credentials: Record<string, unknown> | null;
  
  // Provider-specific settings
  settings: IntegrationSettings;
  
  // Sync info
  last_sync_at: string | null;
  last_sync_status: "success" | "partial" | "failed" | null;
  last_sync_error: string | null;
  
  // Usage
  is_active: boolean;
  auto_sync_enabled: boolean;
  sync_interval_minutes: number | null;
  
  connected_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface IntegrationSettings {
  // Fiken settings
  fiken_company_slug?: string;
  fiken_default_account?: string;
  fiken_vat_type?: string;
  
  // PowerOffice settings
  poweroffice_client_key?: string;
  poweroffice_department_id?: string;
  
  // Payment terminal settings
  terminal_id?: string;
  terminal_location?: string;
  auto_reconcile?: boolean;
  
  // SMS settings
  sms_sender_name?: string;
  sms_country_code?: string;
  
  // Email settings
  email_from_address?: string;
  email_from_name?: string;
  email_reply_to?: string;
}

// Fiken-specific types
export interface FikenContact {
  contactId: number;
  name: string;
  email: string | null;
  phoneNumber: string | null;
  memberNumber: string | null;
  currency: string;
  language: string;
  inactive: boolean;
  createdDate: string;
  lastModifiedDate: string;
}

export interface FikenSale {
  saleId: number;
  saleNumber: string;
  date: string;
  kind: "cash_sale" | "invoice";
  totalPaid: number;
  totalPaidInCurrency: number;
  currency: string;
  customer: FikenContact | null;
  lines: FikenSaleLine[];
}

export interface FikenSaleLine {
  description: string;
  account: string;
  vatType: string;
  netPrice: number;
  vat: number;
  grossPrice: number;
  quantity: number;
}

// PowerOffice-specific types
export interface PowerOfficeCustomer {
  id: number;
  code: string;
  name: string;
  emailAddress: string | null;
  phoneNumber: string | null;
  organizationNumber: string | null;
  isActive: boolean;
  createdDate: string;
  changedDate: string;
}

export interface PowerOfficeVoucher {
  id: number;
  voucherDate: string;
  voucherType: string;
  description: string;
  amount: number;
  currency: string;
  departmentId: number | null;
  projectId: number | null;
}

// Payment terminal types
export interface TerminalTransaction {
  id: string;
  terminal_id: string;
  amount: number;
  currency: string;
  card_type: string | null;
  card_last_four: string | null;
  status: "approved" | "declined" | "error";
  reference: string;
  timestamp: string;
}

export interface DailyReconciliation {
  date: string;
  terminal_id: string;
  
  // Terminal totals
  terminal_gross: number;
  terminal_fees: number;
  terminal_net: number;
  transaction_count: number;
  
  // LYXso matched
  matched_bookings: number;
  unmatched_amount: number;
  
  // Status
  is_reconciled: boolean;
  reconciled_at: string | null;
  reconciled_by: string | null;
}

// Communication provider types
export interface SMSMessage {
  id: string;
  org_id: string;
  provider: IntegrationProvider;
  
  to: string;
  from: string;
  message: string;
  
  status: "pending" | "sent" | "delivered" | "failed";
  status_message: string | null;
  
  provider_message_id: string | null;
  
  sent_at: string | null;
  delivered_at: string | null;
  
  // Reference
  automation_event_id: string | null;
  booking_id: string | null;
  customer_id: string | null;
  
  created_at: string;
}

export interface EmailMessage {
  id: string;
  org_id: string;
  provider: IntegrationProvider;
  
  to: string;
  from: string;
  reply_to: string | null;
  
  subject: string;
  body_html: string;
  body_text: string | null;
  
  status: "pending" | "sent" | "delivered" | "opened" | "clicked" | "bounced" | "failed";
  status_message: string | null;
  
  provider_message_id: string | null;
  
  sent_at: string | null;
  delivered_at: string | null;
  opened_at: string | null;
  
  // Reference
  automation_event_id: string | null;
  booking_id: string | null;
  customer_id: string | null;
  
  created_at: string;
}

// Webhook event types for integration callbacks
export interface IntegrationWebhookEvent {
  id: string;
  integration_id: string;
  
  event_type: string;
  payload: Record<string, unknown>;
  
  processed: boolean;
  processed_at: string | null;
  error: string | null;
  
  created_at: string;
}
