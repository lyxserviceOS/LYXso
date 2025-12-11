// types/ceo.ts
// Types for CEO Dashboard module (Module 25)
// Aggregated view across all organizations for Nox/LYXso admins

export interface OrgSummary {
  id: string;
  name: string;
  org_number: string | null;
  plan: string | null;
  is_active: boolean;
  created_at: string;
  
  // Aggregated metrics
  total_revenue: number;
  revenue_this_month: number;
  revenue_last_month: number;
  
  bookings_count: number;
  bookings_this_month: number;
  
  customers_count: number;
  customers_this_month: number;
  
  coating_jobs_count: number;
  tyre_sets_count: number;
}

export interface ModuleRevenue {
  module: "coating" | "tyre_hotel" | "booking" | "other";
  module_label: string;
  total_revenue: number;
  revenue_this_month: number;
  growth_percentage: number;
}

export interface LocationMetrics {
  location_id: string;
  location_name: string;
  org_id: string;
  org_name: string;
  
  // Utilization
  booking_slots_available: number;
  booking_slots_used: number;
  utilization_percentage: number;
  
  // Capacity
  tyre_storage_capacity: number;
  tyre_storage_used: number;
  tyre_utilization_percentage: number;
  
  // Staff
  staff_count: number;
}

export interface MarketingMetrics {
  org_id: string;
  org_name: string;
  
  // Spend
  total_spend: number;
  spend_this_month: number;
  
  // Leads
  leads_count: number;
  leads_this_month: number;
  
  // Conversions
  bookings_from_leads: number;
  conversion_rate: number;
  
  // Cost per acquisition
  cost_per_lead: number;
  cost_per_booking: number;
}

export interface CEOAlert {
  id: string;
  type: "warning" | "critical" | "info";
  category: "rebooking" | "capacity" | "revenue" | "churn" | "performance";
  title: string;
  message: string;
  org_id: string | null;
  org_name: string | null;
  location_id: string | null;
  location_name: string | null;
  value: number | null;
  threshold: number | null;
  created_at: string;
  is_read: boolean;
  action_url: string | null;
}

export interface CEODashboardData {
  // Summary totals
  total_orgs: number;
  active_orgs: number;
  total_revenue: number;
  revenue_this_month: number;
  revenue_growth: number;
  
  total_bookings: number;
  bookings_this_month: number;
  bookings_growth: number;
  
  total_customers: number;
  customers_this_month: number;
  
  // Per-org summaries
  org_summaries: OrgSummary[];
  
  // Module breakdown
  module_revenues: ModuleRevenue[];
  
  // Location metrics
  location_metrics: LocationMetrics[];
  
  // Marketing overview
  marketing_metrics: MarketingMetrics[];
  
  // Alerts
  alerts: CEOAlert[];
}

export interface RevenueTimeSeries {
  date: string;
  total: number;
  coating: number;
  tyre_hotel: number;
  booking: number;
  other: number;
}

export interface BookingTimeSeries {
  date: string;
  count: number;
  completed: number;
  cancelled: number;
}
