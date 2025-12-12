/**
 * LYXso ServiceOS - Complete TypeScript Types
 * All 15 Modules + Time Tracking
 */

// ============================================================================
// MODULE 1: TIME TRACKING
// ============================================================================

export interface TimeTrackingCheckin {
  id: string;
  user_id: string;
  org_id: string;
  location_id?: string;
  
  check_in_time: string;
  check_out_time?: string;
  
  check_in_latitude?: number;
  check_in_longitude?: number;
  check_in_wifi_ssid?: string;
  check_in_wifi_mac?: string;
  check_in_ip_address?: string;
  
  check_out_latitude?: number;
  check_out_longitude?: number;
  check_out_wifi_ssid?: string;
  check_out_ip_address?: string;
  
  location_validated: boolean;
  wifi_validated: boolean;
  validation_method: 'wifi' | 'gps' | 'ip' | 'manual';
  
  work_type: 'regular' | 'overtime' | 'weekend' | 'holiday';
  break_minutes: number;
  notes?: string;
  
  status: 'checked_in' | 'on_break' | 'checked_out';
  
  created_at: string;
  updated_at: string;
}

export interface TimeTrackingBreak {
  id: string;
  checkin_id: string;
  break_start: string;
  break_end?: string;
  break_type: 'lunch' | 'coffee' | 'personal' | 'other';
  notes?: string;
  created_at: string;
}

export interface WorkLocation {
  id: string;
  org_id: string;
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  wifi_networks: Array<{ ssid: string; mac: string }>;
  ip_ranges: string[];
  geofence_radius: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// MODULE 2: MODULE CONTROL
// ============================================================================

export interface OrganizationModules {
  id: string;
  org_id: string;
  
  // General
  booking_enabled: boolean;
  calendar_enabled: boolean;
  customer_register_enabled: boolean;
  queue_system_enabled: boolean;
  staff_scheduling_enabled: boolean;
  
  // Inventory
  inventory_enabled: boolean;
  barcode_qr_enabled: boolean;
  supplier_price_comparison_enabled: boolean;
  auto_ordering_enabled: boolean;
  parts_accessories_enabled: boolean;
  
  // Vehicle
  tire_hotel_enabled: boolean;
  coating_enabled: boolean;
  paint_damage_enabled: boolean;
  ppf_enabled: boolean;
  wrapping_enabled: boolean;
  car_rental_enabled: boolean;
  trailer_rental_enabled: boolean;
  
  // Finance
  invoicing_enabled: boolean;
  accounting_integration_enabled: boolean;
  payments_enabled: boolean;
  
  // AI
  ai_booking_agent_enabled: boolean;
  ai_inventory_assistant_enabled: boolean;
  ai_upsell_engine_enabled: boolean;
  ai_campaign_generator_enabled: boolean;
  ai_dvi_damage_analysis_enabled: boolean;
  
  // Marketing
  campaign_center_enabled: boolean;
  google_review_engine_enabled: boolean;
  auto_sms_flows_enabled: boolean;
  customer_journey_enabled: boolean;
  
  // Chain
  multi_location_enabled: boolean;
  central_reporting_enabled: boolean;
  admin_roles_enabled: boolean;
  
  // Time tracking
  time_tracking_enabled: boolean;
  wifi_validation_required: boolean;
  
  created_at: string;
  updated_at: string;
}

// ============================================================================
// MODULE 3: MULTI-LOCATION
// ============================================================================

export interface Location {
  id: string;
  org_id: string;
  name: string;
  code?: string;
  
  address?: string;
  postal_code?: string;
  city?: string;
  country: string;
  
  phone?: string;
  email?: string;
  
  latitude?: number;
  longitude?: number;
  
  wifi_ssid?: string;
  wifi_mac_address?: string;
  
  operating_hours?: Record<string, { open: string; close: string }>;
  
  timezone: string;
  currency: string;
  language: string;
  
  is_active: boolean;
  is_headquarters: boolean;
  
  created_at: string;
  updated_at: string;
}

export interface UserLocationAccess {
  id: string;
  user_id: string;
  location_id: string;
  role: 'admin' | 'manager' | 'employee' | 'viewer';
  created_at: string;
}

// ============================================================================
// MODULE 4: SUPPLIER HUB
// ============================================================================

export interface Supplier {
  id: string;
  org_id?: string;
  name: string;
  supplier_type: 'mekonomen' | 'gs_bildeler' | 'bildeler_no' | 'bilxtra' | 'biltema' | 'oem' | 'aftermarket' | 'custom';
  
  contact_name?: string;
  email?: string;
  phone?: string;
  website?: string;
  
  api_enabled: boolean;
  api_key?: string;
  api_endpoint?: string;
  api_config?: Record<string, any>;
  
  default_margin_percentage: number;
  payment_terms: number;
  
  average_delivery_days?: number;
  min_order_amount?: number;
  shipping_cost?: number;
  
  is_favorite: boolean;
  is_active: boolean;
  
  total_orders: number;
  total_spent: number;
  average_rating?: number;
  
  created_at: string;
  updated_at: string;
}

export interface SupplierProduct {
  id: string;
  supplier_id: string;
  
  sku: string;
  name: string;
  description?: string;
  category?: string;
  
  cost_price: number;
  retail_price?: number;
  currency: string;
  
  in_stock: boolean;
  stock_quantity?: number;
  estimated_delivery_days?: number;
  
  compatible_vehicles?: string[];
  oem_numbers?: string[];
  
  last_price_update?: string;
  created_at: string;
  updated_at: string;
}

export interface SupplierOrder {
  id: string;
  org_id: string;
  supplier_id: string;
  location_id?: string;
  ordered_by?: string;
  
  order_number: string;
  
  items: Array<{
    product_id: string;
    qty: number;
    price: number;
    name: string;
  }>;
  
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  
  status: 'pending' | 'ordered' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  
  ordered_at: string;
  estimated_delivery?: string;
  delivered_at?: string;
  
  notes?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// MODULE 5: INVENTORY
// ============================================================================

export interface InventoryItem {
  id: string;
  org_id: string;
  location_id?: string;
  supplier_product_id?: string;
  
  sku: string;
  barcode?: string;
  name: string;
  description?: string;
  category: 'parts' | 'chemicals' | 'tools' | 'consumables' | 'coating' | 'ppf' | 'tires' | 'accessories' | 'other';
  
  cost_price: number;
  retail_price: number;
  
  current_quantity: number;
  min_quantity: number;
  max_quantity: number;
  reorder_point: number;
  
  auto_reorder_enabled: boolean;
  preferred_supplier_id?: string;
  
  storage_location?: string;
  shelf_number?: string;
  bin_number?: string;
  
  total_used: number;
  avg_monthly_usage?: number;
  last_ordered_at?: string;
  last_counted_at?: string;
  
  image_url?: string;
  notes?: string;
  is_active: boolean;
  
  created_at: string;
  updated_at: string;
}

export interface InventoryTransaction {
  id: string;
  item_id: string;
  user_id?: string;
  
  transaction_type: 'purchase' | 'sale' | 'adjustment' | 'reservation' | 'return' | 'loss' | 'transfer' | 'count';
  
  quantity: number;
  quantity_before: number;
  quantity_after: number;
  
  booking_id?: string;
  supplier_order_id?: string;
  
  cost_price?: number;
  notes?: string;
  
  created_at: string;
}

// ============================================================================
// MODULE 6: PRICING
// ============================================================================

export interface PricingRule {
  id: string;
  org_id: string;
  
  name: string;
  description?: string;
  
  rule_type: 'service' | 'product' | 'category' | 'customer_segment' | 'time_based' | 'demand_based' | 'competitor_based';
  
  conditions?: Record<string, any>;
  
  adjustment_type: 'percentage' | 'fixed_amount' | 'multiply' | 'override';
  adjustment_value: number;
  
  priority: number;
  
  valid_from?: string;
  valid_to?: string;
  
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// MODULE 7: VEHICLE INTELLIGENCE
// ============================================================================

export interface VehicleDataCache {
  id: string;
  reg_number: string;
  
  make?: string;
  model?: string;
  year?: number;
  vin?: string;
  
  engine_power?: number;
  engine_size?: number;
  fuel_type?: string;
  transmission?: string;
  drive_type?: string;
  
  tire_dimension_front?: string;
  tire_dimension_rear?: string;
  rim_size_front?: string;
  rim_size_rear?: string;
  
  next_eu_control?: string;
  last_service_date?: string;
  service_interval_km?: number;
  current_mileage?: number;
  
  common_issues?: Array<{ issue: string; severity: string }>;
  recall_notices?: Array<{ title: string; date: string }>;
  
  estimated_value?: number;
  value_currency: string;
  
  data_source?: string;
  last_updated: string;
  created_at: string;
}

// ============================================================================
// MODULE 8: TIRE HOTEL 3.0
// ============================================================================

export interface TireSet {
  id: string;
  org_id: string;
  customer_id: string;
  vehicle_id?: string;
  location_id?: string;
  
  set_name?: string;
  season: 'summer' | 'winter' | 'all_season';
  
  dimension: string;
  brand?: string;
  model?: string;
  dot_code?: string;
  
  quantity: number;
  
  storage_location: string;
  shelf_number?: string;
  position?: string;
  qr_code?: string;
  barcode?: string;
  
  condition_front_left?: {
    tread_depth: number;
    damage: string[];
    image_url?: string;
  };
  condition_front_right?: {
    tread_depth: number;
    damage: string[];
    image_url?: string;
  };
  condition_rear_left?: {
    tread_depth: number;
    damage: string[];
    image_url?: string;
  };
  condition_rear_right?: {
    tread_depth: number;
    damage: string[];
    image_url?: string;
  };
  
  ai_condition_score?: number;
  ai_recommended_action?: 'safe' | 'monitor' | 'replace_soon' | 'replace_now' | 'sell';
  estimated_remaining_seasons?: number;
  
  stored_date: string;
  last_inspection_date?: string;
  next_inspection_date?: string;
  
  reminder_sent: boolean;
  reminder_sent_at?: string;
  
  images?: string[];
  
  storage_price_per_season?: number;
  
  notes?: string;
  is_active: boolean;
  
  created_at: string;
  updated_at: string;
}

// ============================================================================
// MODULE 9: COATING & PAINT
// ============================================================================

export interface CoatingJob {
  id: string;
  org_id: string;
  booking_id?: string;
  vehicle_id: string;
  customer_id: string;
  
  job_type: 'ceramic' | 'polymer' | 'wax' | 'ppf' | 'detail';
  coating_product?: string;
  
  paint_thickness_measurements?: Record<string, number>;
  
  paint_condition_score?: number;
  swirl_marks_severity?: 'none' | 'light' | 'moderate' | 'severe';
  scratches?: Array<{ location: string; severity: string; image?: string }>;
  oxidation_level?: 'none' | 'light' | 'moderate' | 'severe';
  
  ai_analysis?: {
    areas_needing_attention: string[];
    recommended_products: string[];
    estimated_hours: number;
  };
  
  stages_completed?: string[];
  products_used?: Array<{ product: string; ml_used: number }>;
  
  before_images?: string[];
  during_images?: string[];
  after_images?: string[];
  
  coating_warranty_months?: number;
  next_maintenance_date?: string;
  maintenance_reminders_enabled: boolean;
  
  status: 'scheduled' | 'in_progress' | 'quality_check' | 'completed' | 'delivered';
  
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// MODULE 10: PPF WORKFLOW
// ============================================================================

export interface PPFJob {
  id: string;
  org_id: string;
  booking_id?: string;
  vehicle_id: string;
  customer_id: string;
  
  coverage_type: 'full' | 'front' | 'partial' | 'custom';
  panels_covered: string[];
  
  film_brand?: string;
  film_product?: string;
  film_thickness?: string;
  film_warranty_years?: number;
  
  stage: 'preparation' | 'masking' | 'cutting' | 'installation' | 'baking' | 'quality_control' | 'completed';
  
  preparation_completed_at?: string;
  masking_completed_at?: string;
  cutting_completed_at?: string;
  cutting_method?: 'plotter' | 'hand' | 'bulk';
  installation_completed_at?: string;
  baking_completed_at?: string;
  baking_temp_celsius?: number;
  baking_duration_minutes?: number;
  quality_check_completed_at?: string;
  
  film_used_sqm?: number;
  materials_cost?: number;
  
  installer_id?: string;
  quality_checker_id?: string;
  
  before_images?: string[];
  during_images?: string[];
  after_images?: string[];
  
  issues?: Array<{ issue: string; location: string; resolved: boolean }>;
  
  status: 'scheduled' | 'in_progress' | 'quality_check' | 'completed' | 'delivered';
  
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// MODULE 11: PAYMENTS
// ============================================================================

export interface Payment {
  id: string;
  org_id: string;
  booking_id?: string;
  customer_id?: string;
  
  amount: number;
  currency: string;
  
  payment_method: 'card' | 'vipps' | 'klarna' | 'invoice' | 'cash' | 'bank_transfer';
  provider?: string;
  
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  
  external_payment_id?: string;
  payment_link?: string;
  
  paid_at?: string;
  refunded_at?: string;
  
  metadata?: Record<string, any>;
  notes?: string;
  
  created_at: string;
  updated_at: string;
}

// ============================================================================
// MODULE 12: CUSTOMER PORTAL
// ============================================================================

export interface CustomerPortalAccess {
  id: string;
  customer_id: string;
  user_id?: string;
  
  access_token: string;
  email: string;
  email_verified: boolean;
  phone?: string;
  phone_verified: boolean;
  
  password_hash?: string;
  
  notifications_enabled: boolean;
  sms_enabled: boolean;
  email_enabled: boolean;
  
  is_active: boolean;
  last_login?: string;
  
  created_at: string;
  updated_at: string;
}

// ============================================================================
// MODULE 13: REVIEW ENGINE
// ============================================================================

export interface ReviewRequest {
  id: string;
  org_id: string;
  booking_id?: string;
  customer_id: string;
  
  sent_via: 'email' | 'sms' | 'both';
  review_link: string;
  
  ai_suggested_review_text?: string;
  ai_highlighted_points?: string[];
  
  sent_at: string;
  opened_at?: string;
  clicked_at?: string;
  review_submitted: boolean;
  review_submitted_at?: string;
  
  incentive_offered?: string;
  incentive_claimed: boolean;
  
  created_at: string;
}

// ============================================================================
// MODULE 14: MARKETING
// ============================================================================

export interface MarketingCampaign {
  id: string;
  org_id: string;
  
  name: string;
  campaign_type: 'email' | 'sms' | 'both' | 'push';
  
  trigger_type: 'manual' | 'scheduled' | 'event' | 'automated';
  trigger_event?: string;
  
  subject?: string;
  message: string;
  
  ai_generated: boolean;
  ai_personalization_enabled: boolean;
  
  target_segment?: Record<string, any>;
  
  scheduled_at?: string;
  sent_at?: string;
  
  recipients_count: number;
  sent_count: number;
  delivered_count: number;
  opened_count: number;
  clicked_count: number;
  converted_count: number;
  
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'completed' | 'cancelled';
  
  created_at: string;
  updated_at: string;
}

// ============================================================================
// MODULE 15: BUSINESS INTELLIGENCE
// ============================================================================

export interface BusinessMetric {
  id: string;
  org_id: string;
  location_id?: string;
  
  metric_date: string;
  metric_type: string;
  
  revenue: number;
  costs: number;
  profit: number;
  
  new_customers: number;
  returning_customers: number;
  lost_customers: number;
  
  bookings_completed: number;
  bookings_cancelled: number;
  average_job_duration_minutes?: number;
  
  staff_hours_worked: number;
  staff_overtime_hours: number;
  
  parts_ordered: number;
  inventory_value: number;
  
  created_at: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type ModuleKey = keyof Omit<OrganizationModules, 'id' | 'org_id' | 'created_at' | 'updated_at'>;

export interface CheckInRequest {
  latitude?: number;
  longitude?: number;
  wifi_ssid?: string;
  wifi_mac?: string;
  ip_address?: string;
}

export interface CheckOutRequest {
  checkin_id: string;
  latitude?: number;
  longitude?: number;
  wifi_ssid?: string;
  ip_address?: string;
  notes?: string;
}
