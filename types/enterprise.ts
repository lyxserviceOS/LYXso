// ============================================================================
// LYXso Enterprise TypeScript Types
// Complete type definitions for all enterprise features
// ============================================================================

// ============================================================================
// TIME TRACKING TYPES
// ============================================================================

export interface TimeTrackingSettings {
  id: string;
  company_id: string;
  wifi_ssid: string[];
  wifi_enforcement: boolean;
  geofence_enabled: boolean;
  geofence_latitude?: number;
  geofence_longitude?: number;
  geofence_radius_meters: number;
  require_checkin_for_work: boolean;
  break_rules: {
    max_break_duration: number;
    auto_end_break: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface TimeEntry {
  id: string;
  employee_id: string;
  company_id: string;
  check_in: string;
  check_out?: string;
  break_start?: string;
  break_end?: string;
  total_break_minutes: number;
  check_in_wifi_ssid?: string;
  check_in_location?: GeoPoint;
  check_out_wifi_ssid?: string;
  check_out_location?: GeoPoint;
  check_in_device_info?: DeviceInfo;
  check_out_device_info?: DeviceInfo;
  notes?: string;
  status: 'active' | 'on_break' | 'completed' | 'manual_adjustment';
  manual_adjustment: boolean;
  adjusted_by?: string;
  adjustment_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface DeviceInfo {
  userAgent: string;
  platform: string;
  language: string;
  screenResolution: string;
  timestamp: string;
}

// ============================================================================
// MODULE SYSTEM TYPES
// ============================================================================

export interface ModuleCategory {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  icon?: string;
  sort_order: number;
  created_at: string;
}

export interface AvailableModule {
  id: string;
  category_id: string;
  module_key: string;
  display_name: string;
  description?: string;
  icon?: string;
  is_premium: boolean;
  requires_modules?: string[];
  pricing_tier: 'free' | 'basic' | 'professional' | 'enterprise';
  monthly_price: number;
  setup_required: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CompanyModule {
  id: string;
  company_id: string;
  module_id: string;
  is_enabled: boolean;
  enabled_at: string;
  disabled_at?: string;
  configuration: Record<string, string | number | boolean>;
  usage_stats: {
    activations: number;
    last_used?: string;
  };
  created_at: string;
  updated_at: string;
  module?: AvailableModule; // Populated via join
}

// ============================================================================
// INDUSTRY TYPES
// ============================================================================

export interface IndustryType {
  id: string;
  industry_key: string;
  display_name: string;
  description?: string;
  icon?: string;
  default_modules: string[];
  workflow_template?: Record<string, string | number | boolean>;
  service_categories?: Record<string, string[]>;
  created_at: string;
}

export interface CompanyIndustry {
  id: string;
  company_id: string;
  industry_id: string;
  is_primary: boolean;
  created_at: string;
  industry?: IndustryType; // Populated via join
}

// ============================================================================
// SUPPLIER INTEGRATION TYPES
// ============================================================================

export interface Supplier {
  id: string;
  supplier_key: string;
  display_name: string;
  country_code: string;
  api_endpoint?: string;
  requires_api_key: boolean;
  supports_direct_order: boolean;
  supports_price_lookup: boolean;
  supports_stock_check: boolean;
  logo_url?: string;
  is_active: boolean;
  integration_type: 'api' | 'scraping' | 'manual';
  created_at: string;
  updated_at: string;
}

export interface CompanySupplierConfig {
  id: string;
  company_id: string;
  supplier_id: string;
  is_enabled: boolean;
  api_credentials?: Record<string, string>;
  is_favorite: boolean;
  auto_order_enabled: boolean;
  discount_percentage: number;
  credit_limit?: number;
  payment_terms_days: number;
  delivery_address?: Address;
  notes?: string;
  created_at: string;
  updated_at: string;
  supplier?: Supplier; // Populated via join
}

export interface SupplierPriceCache {
  id: string;
  supplier_id: string;
  part_number: string;
  vehicle_reg_number?: string;
  description?: string;
  price: number;
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'on_order' | 'unknown';
  stock_quantity?: number;
  estimated_delivery_days?: number;
  cached_at: string;
  expires_at: string;
  raw_response?: Record<string, unknown>;
  created_at: string;
}

export interface SupplierQuote {
  supplier: Supplier;
  part_number: string;
  description: string;
  price: number;
  stock_status: string;
  estimated_delivery_days?: number;
  is_cheapest: boolean;
}

// ============================================================================
// INVENTORY TYPES
// ============================================================================

export interface InventoryItem {
  id: string;
  company_id: string;
  item_type: 'part' | 'consumable' | 'tool' | 'chemical' | 'coating' | 'ppf_material';
  name: string;
  description?: string;
  sku?: string;
  barcode?: string;
  part_number?: string;
  category?: string;
  brand?: string;
  unit: string;
  unit_cost?: number;
  selling_price?: number;
  current_stock: number;
  min_stock_level: number;
  max_stock_level?: number;
  reorder_point?: number;
  reorder_quantity?: number;
  storage_location?: string;
  supplier_id?: string;
  supplier_part_number?: string;
  image_url?: string;
  compatible_vehicles?: string[];
  usage_rate?: number;
  last_restock_date?: string;
  last_usage_date?: string;
  auto_reorder_enabled: boolean;
  tags?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
  supplier?: Supplier; // Populated via join
}

export interface InventoryTransaction {
  id: string;
  company_id: string;
  item_id: string;
  transaction_type: 'in' | 'out' | 'adjustment' | 'reservation' | 'return' | 'transfer';
  quantity: number;
  unit_cost?: number;
  reference_type?: string;
  reference_id?: string;
  performed_by?: string;
  notes?: string;
  before_quantity: number;
  after_quantity: number;
  created_at: string;
  item?: InventoryItem; // Populated via join
}

export interface InventoryReservation {
  id: string;
  company_id: string;
  item_id: string;
  booking_id?: string;
  quantity: number;
  reserved_at: string;
  expires_at?: string;
  status: 'active' | 'consumed' | 'cancelled' | 'expired';
  created_at: string;
  updated_at: string;
}

// ============================================================================
// PRICING ENGINE TYPES
// ============================================================================

export interface PricingStrategy {
  id: string;
  company_id: string;
  strategy_name: string;
  service_category?: string;
  base_price: number;
  cost_price: number;
  target_margin_percentage: number;
  price_sensitivity: 'high' | 'medium' | 'low';
  competitor_pricing?: Record<string, number>;
  demand_multiplier: number;
  seasonal_adjustments?: Record<string, number>;
  dynamic_pricing_enabled: boolean;
  min_price: number;
  max_price: number;
  created_at: string;
  updated_at: string;
}

export interface PricingRule {
  id: string;
  company_id: string;
  rule_name: string;
  rule_type: 'geography' | 'time_based' | 'volume' | 'customer_segment' | 'demand';
  conditions: Record<string, string | number | boolean>;
  adjustment_type: 'percentage' | 'fixed_amount' | 'multiply';
  adjustment_value: number;
  priority: number;
  is_active: boolean;
  valid_from?: string;
  valid_until?: string;
  created_at: string;
  updated_at: string;
}

export interface PriceCalculation {
  base_price: number;
  adjustments: Array<{
    rule_name: string;
    type: string;
    value: number;
    applied_amount: number;
  }>;
  final_price: number;
  margin_percentage: number;
  profit: number;
}

// ============================================================================
// VEHICLE INTELLIGENCE TYPES
// ============================================================================

export interface VehicleData {
  id: string;
  reg_number: string;
  vin?: string;
  make?: string;
  model?: string;
  variant?: string;
  year?: number;
  engine_power_hp?: number;
  engine_power_kw?: number;
  fuel_type?: string;
  transmission?: string;
  drive_type?: string;
  body_type?: string;
  color?: string;
  tire_dimension_front?: string;
  tire_dimension_rear?: string;
  eu_control_due_date?: string;
  first_registration_date?: string;
  estimated_value?: number;
  common_issues?: Array<{
    issue: string;
    severity: 'low' | 'medium' | 'high';
    frequency: number;
  }>;
  service_intervals?: Record<string, number>;
  compatible_parts?: Record<string, string[]>;
  fetched_from_api: boolean;
  last_api_check?: string;
  created_at: string;
  updated_at: string;
}

export interface VehicleServiceHistory {
  id: string;
  vehicle_reg: string;
  company_id: string;
  service_type: string;
  service_date: string;
  mileage?: number;
  description?: string;
  parts_used?: Array<{
    part_name: string;
    quantity: number;
    cost: number;
  }>;
  cost: number;
  performed_by?: string;
  notes?: string;
  next_service_due_date?: string;
  next_service_due_mileage?: number;
  created_at: string;
}

// ============================================================================
// TIRE HOTEL TYPES
// ============================================================================

export interface TireStorage {
  id: string;
  company_id: string;
  customer_id?: string;
  vehicle_reg?: string;
  storage_location: string;
  storage_position?: string;
  qr_code: string;
  barcode?: string;
  tire_set_type: 'summer' | 'winter' | 'all_season';
  quantity: number;
  brand?: string;
  dimension?: string;
  dot_code?: string;
  manufacture_year?: number;
  tread_depth_mm?: Record<string, number>;
  condition_rating?: number;
  condition_notes?: string;
  images?: string[];
  ai_condition_analysis?: {
    overall_score: number;
    wear_pattern: string;
    estimated_remaining_life: number;
    recommendations: string[];
  };
  stored_date: string;
  season_reminder_sent: boolean;
  last_reminder_date?: string;
  estimated_lifespan_years?: number;
  ready_for_sale: boolean;
  sale_price?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// COATING & PPF TYPES
// ============================================================================

export interface CoatingApplication {
  id: string;
  company_id: string;
  customer_id?: string;
  vehicle_reg?: string;
  coating_type: 'ceramic' | 'graphene' | 'polymer' | 'wax' | 'ppf';
  coating_product: string;
  application_date: string;
  application_areas?: Record<string, boolean>;
  layers_applied: number;
  warranty_years?: number;
  warranty_expiry_date?: string;
  paint_thickness_readings?: Record<string, number>;
  before_images?: string[];
  after_images?: string[];
  ai_coverage_analysis?: {
    coverage_percentage: number;
    missed_areas: string[];
    quality_score: number;
  };
  cost: number;
  follow_up_schedule?: Record<string, string>;
  maintenance_reminders_sent?: Record<string, boolean>;
  performed_by?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PPFWorkflowTemplate {
  id: string;
  company_id: string;
  template_name: string;
  stages: Array<{
    name: string;
    duration_hours: number;
    checklist: string[];
    required_materials?: string[];
  }>;
  created_at: string;
}

export interface PPFJob {
  id: string;
  company_id: string;
  booking_id?: string;
  customer_id?: string;
  vehicle_reg?: string;
  template_id?: string;
  current_stage: number;
  stage_progress?: Array<{
    stage: number;
    status: 'pending' | 'in_progress' | 'completed';
    started_at?: string;
    completed_at?: string;
    notes?: string;
  }>;
  assigned_to?: string[];
  film_brand?: string;
  film_type?: string;
  coverage_area: 'full_front' | 'full_wrap' | 'custom' | 'hood' | 'bumper';
  coverage_details?: Record<string, string | number>;
  estimated_completion?: string;
  actual_completion?: string;
  quality_check_passed?: boolean;
  quality_notes?: string;
  images?: string[];
  created_at: string;
  updated_at: string;
  template?: PPFWorkflowTemplate; // Populated via join
}

// ============================================================================
// PAYMENT TYPES
// ============================================================================

export interface PaymentSettings {
  id: string;
  company_id: string;
  stripe_enabled: boolean;
  stripe_account_id?: string;
  stripe_publishable_key?: string;
  vipps_enabled: boolean;
  vipps_merchant_serial_number?: string;
  klarna_enabled: boolean;
  klarna_username?: string;
  accept_deposits: boolean;
  default_deposit_percentage: number;
  auto_invoice: boolean;
  payment_terms_days: number;
  late_payment_fee?: number;
  created_at: string;
  updated_at: string;
}

export interface PaymentTransaction {
  id: string;
  company_id: string;
  booking_id?: string;
  invoice_id?: string;
  customer_id?: string;
  amount: number;
  currency: string;
  payment_method: 'stripe' | 'vipps' | 'klarna' | 'invoice' | 'cash' | 'card';
  payment_type: 'full' | 'deposit' | 'partial' | 'refund';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  external_transaction_id?: string;
  payment_link?: string;
  paid_at?: string;
  refunded_at?: string;
  refund_amount?: number;
  metadata?: Record<string, string | number | boolean>;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// CUSTOMER PORTAL TYPES
// ============================================================================

export interface CustomerPortalSettings {
  id: string;
  customer_id: string;
  receive_email_notifications: boolean;
  receive_sms_notifications: boolean;
  auto_review_reminders: boolean;
  language_preference: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerVehicle {
  id: string;
  customer_id: string;
  reg_number: string;
  nickname?: string;
  is_primary: boolean;
  created_at: string;
  vehicle_data?: VehicleData; // Populated via join
}

export interface CustomerRecommendation {
  id: string;
  customer_id: string;
  vehicle_reg?: string;
  recommendation_type: 'service' | 'maintenance' | 'coating' | 'tire_change' | 'inspection';
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimated_cost?: number;
  due_date?: string;
  status: 'open' | 'scheduled' | 'completed' | 'dismissed';
  created_by?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// REVIEW SYSTEM TYPES
// ============================================================================

export interface ReviewRequest {
  id: string;
  company_id: string;
  customer_id?: string;
  booking_id?: string;
  request_sent_at: string;
  reminder_sent_at?: string;
  review_submitted_at?: string;
  google_review_link?: string;
  ai_suggested_review?: string;
  status: 'sent' | 'reminded' | 'completed' | 'expired';
  created_at: string;
}

// ============================================================================
// MARKET TYPES
// ============================================================================

export interface MarketCategory {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  icon?: string;
  parent_category_id?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface MarketProduct {
  id: string;
  seller_id: string;
  category_id?: string;
  product_type: 'service' | 'product' | 'coating' | 'tire' | 'equipment' | 'ppf_material';
  title: string;
  description?: string;
  price: number;
  currency: string;
  images?: string[];
  specifications?: Record<string, string | number>;
  stock_quantity?: number;
  is_available: boolean;
  shipping_available: boolean;
  shipping_cost?: number;
  location?: Address;
  tags?: string[];
  rating_average: number;
  rating_count: number;
  view_count: number;
  featured: boolean;
  verified_seller: boolean;
  created_at: string;
  updated_at: string;
  seller?: any; // Profile data
  category?: MarketCategory;
}

// ============================================================================
// ENTERPRISE TYPES
// ============================================================================

export interface CompanyLocation {
  id: string;
  parent_company_id: string;
  location_name: string;
  address?: Address;
  phone?: string;
  email?: string;
  manager_id?: string;
  is_headquarter: boolean;
  timezone: string;
  business_hours?: Record<string, { open: string; close: string }>;
  location_code?: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  manager?: { id: string; email: string; full_name?: string }; // Profile data
}

export interface LocationEmployee {
  id: string;
  location_id: string;
  employee_id: string;
  role?: string;
  is_primary_location: boolean;
  access_level: 'full' | 'limited' | 'view_only';
  created_at: string;
  employee?: any; // Profile data
  location?: CompanyLocation;
}

export interface LocationPerformance {
  id: string;
  location_id: string;
  period_start: string;
  period_end: string;
  total_revenue: number;
  total_bookings: number;
  avg_booking_value: number;
  customer_satisfaction_score?: number;
  employee_count: number;
  top_services?: Record<string, number>;
  created_at: string;
  location?: CompanyLocation;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface Address {
  street?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// ============================================================================
// REQUEST/RESPONSE TYPES
// ============================================================================

export interface CheckInRequest {
  wifi_ssid?: string;
  location?: GeoPoint;
  device_info?: DeviceInfo;
  notes?: string;
}

export interface CheckOutRequest {
  wifi_ssid?: string;
  location?: GeoPoint;
  device_info?: DeviceInfo;
  notes?: string;
}

export interface InventoryAdjustmentRequest {
  item_id: string;
  quantity: number;
  reason: string;
  notes?: string;
}

export interface SupplierQuoteRequest {
  part_number: string;
  vehicle_reg_number?: string;
  supplier_ids?: string[];
}

export interface VehicleLookupRequest {
  reg_number: string;
  force_refresh?: boolean;
}

export interface PriceCalculationRequest {
  service_category: string;
  base_price: number;
  customer_segment?: string;
  booking_date?: string;
  location?: string;
}

// ============================================================================
// WEBSOCKET EVENT TYPES
// ============================================================================

export interface WebSocketEvent {
  type: string;
  payload: any;
  timestamp: string;
}

export interface TimeTrackingEvent extends WebSocketEvent {
  type: 'time_tracking.checkin' | 'time_tracking.checkout' | 'time_tracking.break_start' | 'time_tracking.break_end';
  payload: {
    employee_id: string;
    time_entry_id: string;
    timestamp: string;
  };
}

export interface InventoryEvent extends WebSocketEvent {
  type: 'inventory.low_stock' | 'inventory.reorder' | 'inventory.transaction';
  payload: {
    item_id: string;
    current_stock: number;
    min_stock_level: number;
  };
}

// ============================================================================
// EXPORT ALL
// ============================================================================

// All types are already exported above with 'export interface' or 'export type'
// No need for additional export block

