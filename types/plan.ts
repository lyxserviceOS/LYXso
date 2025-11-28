// types/plan.ts
// Types for Plans, Addons & Billing module (Module 19)

/**
 * Plan limits for each subscription tier.
 * Used to enforce limits on locations, employees, bookings, etc.
 */
export interface PlanLimits {
  /** Maximum number of locations/arbeidsplasser */
  max_locations: number | null;
  /** Maximum number of employees/users */
  max_employees: number | null;
  /** Maximum bookings per month (null = unlimited) */
  max_bookings_per_month: number | null;
  /** Maximum customers in CRM (null = unlimited) */
  max_customers: number | null;
  /** Maximum products in inventory (null = unlimited) */
  max_products: number | null;
  /** Maximum storage in MB */
  max_storage_mb: number | null;
}

/**
 * Default plan limits by plan code.
 * "paid" is the standard paid plan with 1 location and 3 employees.
 */
export const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: {
    max_locations: 1,
    max_employees: 1,
    max_bookings_per_month: 50,
    max_customers: 100,
    max_products: 10,
    max_storage_mb: 100,
  },
  trial: {
    max_locations: 1,
    max_employees: 3,
    max_bookings_per_month: null, // Unlimited during trial
    max_customers: null,
    max_products: null,
    max_storage_mb: 500,
  },
  paid: {
    max_locations: 1,
    max_employees: 3,
    max_bookings_per_month: null,
    max_customers: null,
    max_products: null,
    max_storage_mb: 1000,
  },
  starter: {
    max_locations: 1,
    max_employees: 3,
    max_bookings_per_month: null,
    max_customers: null,
    max_products: null,
    max_storage_mb: 1000,
  },
  pro: {
    max_locations: 3,
    max_employees: 10,
    max_bookings_per_month: null,
    max_customers: null,
    max_products: null,
    max_storage_mb: 5000,
  },
  enterprise: {
    max_locations: null, // Unlimited
    max_employees: null,
    max_bookings_per_month: null,
    max_customers: null,
    max_products: null,
    max_storage_mb: null,
  },
};

/**
 * Get plan limits for a given plan code.
 * Defaults to free plan limits if plan code is not found.
 */
export function getPlanLimits(planCode: string | null | undefined): PlanLimits {
  if (!planCode) return PLAN_LIMITS.free;
  return PLAN_LIMITS[planCode] ?? PLAN_LIMITS.free;
}

/**
 * Check if a limit has been reached.
 * Returns true if the current count equals or exceeds the limit.
 * Returns false if limit is null (unlimited).
 */
export function isLimitReached(current: number, limit: number | null): boolean {
  if (limit === null) return false;
  return current >= limit;
}

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
