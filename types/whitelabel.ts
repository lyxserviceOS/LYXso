// types/whitelabel.ts
// Types for White-label & Multi-tenant module (Module 28)
// Partner onboarding, billing, and white-label configuration

export interface PartnerOnboarding {
  id: string;
  
  // Basic info from signup
  company_name: string;
  org_number: string | null;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  
  // Business type
  business_type: "bilpleie" | "dekkhotell" | "coating" | "verksted" | "annet";
  
  // Onboarding progress
  step: OnboardingStep;
  
  // Created org (after approval/completion)
  org_id: string | null;
  
  // Status
  status: "pending" | "approved" | "rejected" | "completed";
  approved_at: string | null;
  approved_by: string | null;
  rejection_reason: string | null;
  
  // Notes
  notes: string | null;
  
  created_at: string;
  updated_at: string;
}

export type OnboardingStep = 
  | "signup"
  | "verification"
  | "plan_selection"
  | "basic_setup"
  | "services_setup"
  | "integrations"
  | "go_live"
  | "completed";

export interface OnboardingWizardState {
  current_step: OnboardingStep;
  
  // Step completion status
  steps_completed: {
    signup: boolean;
    verification: boolean;
    plan_selection: boolean;
    basic_setup: boolean;
    services_setup: boolean;
    integrations: boolean;
    go_live: boolean;
  };
  
  // Data collected during onboarding
  selected_plan: string | null;
  selected_addons: string[];
  
  company_info: {
    name: string;
    address: string;
    city: string;
    postal_code: string;
    phone: string;
    email: string;
    website: string | null;
  } | null;
  
  services_added: number;
  employees_added: number;
  
  integrations_connected: string[];
}

// White-label configuration
export interface WhiteLabelConfig {
  id: string;
  org_id: string;
  
  // Custom domain
  custom_domain: string | null;
  domain_verified: boolean;
  domain_ssl_enabled: boolean;
  
  // Branding
  logo_url: string | null;
  logo_dark_url: string | null;
  favicon_url: string | null;
  
  // Colors
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  text_color: string;
  
  // Typography
  font_family: string | null;
  heading_font_family: string | null;
  
  // Email branding
  email_logo_url: string | null;
  email_from_name: string | null;
  email_from_address: string | null;
  email_footer_text: string | null;
  
  // SMS branding
  sms_sender_name: string | null;
  
  // Social links
  social_links: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  } | null;
  
  // Footer
  footer_company_name: string | null;
  footer_address: string | null;
  footer_links: { label: string; url: string }[] | null;
  
  // Legal
  privacy_policy_url: string | null;
  terms_url: string | null;
  
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Billing types
export interface BillingPeriod {
  id: string;
  org_id: string;
  
  period_start: string;
  period_end: string;
  
  // Plan charges
  plan_id: string;
  plan_name: string;
  plan_amount: number;
  
  // Addon charges
  addon_charges: BillingAddonCharge[];
  addon_total: number;
  
  // Usage charges
  usage_charges: BillingUsageCharge[];
  usage_total: number;
  
  // Totals
  subtotal: number;
  vat_amount: number;
  vat_rate: number;
  total: number;
  currency: string;
  
  // Status
  status: "draft" | "invoiced" | "paid" | "overdue";
  invoice_id: string | null;
  invoice_number: string | null;
  
  invoiced_at: string | null;
  paid_at: string | null;
  due_date: string | null;
  
  created_at: string;
  updated_at: string;
}

export interface BillingAddonCharge {
  addon_id: string;
  addon_name: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface BillingUsageCharge {
  metric: string;
  metric_label: string;
  quantity: number;
  unit_price: number;
  total: number;
  included_in_plan: number;
  overage: number;
}

export interface BillingSettings {
  id: string;
  org_id: string;
  
  // Billing info
  billing_email: string;
  billing_name: string | null;
  billing_address: string | null;
  billing_city: string | null;
  billing_postal_code: string | null;
  billing_country: string;
  
  // VAT
  vat_number: string | null;
  vat_exempt: boolean;
  
  // Payment method
  payment_method: "invoice" | "card" | "direct_debit";
  card_last_four: string | null;
  card_expiry: string | null;
  
  // Billing cycle
  billing_cycle: "monthly" | "yearly";
  next_billing_date: string | null;
  
  // Auto-pay
  auto_pay_enabled: boolean;
  
  created_at: string;
  updated_at: string;
}

// Addon definitions
export interface AddonDefinition {
  id: string;
  code: string;
  name: string;
  description: string;
  
  // Pricing
  price_monthly: number;
  price_yearly: number;
  
  // Or usage-based
  is_usage_based: boolean;
  usage_unit: string | null;
  usage_price_per_unit: number | null;
  usage_included: number | null;
  
  // Features this addon unlocks
  features: string[];
  
  // Requirements
  required_plan_codes: string[];
  
  is_active: boolean;
  sort_order: number;
  
  created_at: string;
  updated_at: string;
}
