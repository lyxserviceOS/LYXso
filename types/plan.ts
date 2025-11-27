// types/plan.ts
// Types for Plans, Addons & Billing module (Module 19)

export interface Plan {
  id: string;
  name: string;
  code: "free" | "trial" | "starter" | "pro" | "enterprise";
  description: string | null;
  
  // Pricing
  price_monthly: number;
  price_yearly: number;
  currency: string;
  
  // Limits
  max_users: number | null;
  max_bookings_per_month: number | null;
  max_locations: number | null;
  max_customers: number | null;
  
  // Features (JSON array of feature codes)
  features: string[];
  
  is_active: boolean;
  sort_order: number;
  
  created_at: string;
  updated_at: string;
}

export interface PlanFeature {
  id: string;
  code: string;
  name: string;
  description: string | null;
  category: string;
}

export interface OrgPlanSubscription {
  id: string;
  org_id: string;
  plan_id: string;
  
  status: "active" | "cancelled" | "expired" | "trialing";
  
  started_at: string;
  ends_at: string | null;
  trial_ends_at: string | null;
  cancelled_at: string | null;
  
  // Billing
  billing_cycle: "monthly" | "yearly";
  next_billing_at: string | null;
  
  created_at: string;
  updated_at: string;
}

export interface OrgAddon {
  id: string;
  org_id: string;
  addon_code: string;
  
  is_active: boolean;
  activated_at: string;
  deactivated_at: string | null;
  
  // Pricing override (if any)
  custom_price: number | null;
  
  created_at: string;
  updated_at: string;
}

export interface OrgUsage {
  id: string;
  org_id: string;
  period: string; // YYYY-MM format
  
  // Usage metrics
  bookings_count: number;
  customers_count: number;
  users_count: number;
  locations_count: number;
  ai_requests_count: number;
  storage_mb: number;
  
  created_at: string;
  updated_at: string;
}

export interface UsageSummary {
  current_period: string;
  bookings: { used: number; limit: number | null };
  customers: { used: number; limit: number | null };
  users: { used: number; limit: number | null };
  locations: { used: number; limit: number | null };
}
