// types/tyre.ts
// Types for Dekkhotell PRO module (Module 15)

export type TyreSeason = "summer" | "winter" | "allseason";
export type TyreCondition = "good" | "worn" | "bad" | "replace";
export type TyreStatus = "stored" | "mounted" | "out";

export interface TyreSet {
  id: string;
  org_id: string;
  customer_id: string | null;
  vehicle_id: string | null;
  registration_number: string | null;
  label: string | null;
  
  // Tire details
  dimension: string | null; // e.g., "225/45R17"
  brand: string | null;
  model: string | null;
  season: TyreSeason;
  condition: TyreCondition;
  tread_depth_mm: number | null;
  production_year: number | null; // Year of manufacture (e.g., 2022)
  production_week: number | null; // Week of manufacture (1-52)
  
  // Storage
  storage_location_id: string | null;
  location: string | null; // Legacy field for location name
  shelf: string | null;
  row: string | null;
  position: string | null;
  
  status: TyreStatus;
  notes: string | null;
  
  // Image/AI analysis
  images: TyreImage[] | null;
  ai_analysis: TyreAIAnalysis | null;
  
  // Timestamps
  stored_at: string | null;
  last_mounted_at: string | null;
  mileage_at_storage: number | null;
  created_at: string;
  updated_at: string;
}

/** Image taken of a tyre set for AI analysis */
export interface TyreImage {
  id: string;
  tyre_set_id: string;
  position: "FL" | "FR" | "RL" | "RR" | "overview"; // Which tyre or overview
  image_url: string;
  thumbnail_url: string | null;
  captured_at: string;
  captured_by: string | null;
}

/** AI analysis results for tyre condition */
export interface TyreAIAnalysis {
  id: string;
  tyre_set_id: string;
  analyzed_at: string;
  
  // Per-position analysis
  positions: {
    position: "FL" | "FR" | "RL" | "RR";
    tread_depth_mm: number | null;
    condition: TyreCondition;
    production_year: number | null;
    production_week: number | null;
    wear_pattern: "even" | "center" | "edges" | "uneven" | null;
    damage_detected: boolean;
    damage_notes: string | null;
    confidence_score: number; // 0-100
  }[];
  
  // Overall summary
  overall_condition: TyreCondition;
  overall_tread_depth_mm: number | null; // Lowest value
  recommendation: "ok" | "monitor" | "replace_soon" | "replace_now";
  recommendation_notes: string | null;
  
  // Raw AI response
  raw_response: Record<string, unknown> | null;
}

/** Partner-configurable thresholds for tyre condition warnings */
export interface TyreThresholdSettings {
  org_id: string;
  
  // Minimum tread depth thresholds (in mm)
  summer_min_tread_mm: number; // Default: 3
  winter_min_tread_mm: number; // Default: 4
  allseason_min_tread_mm: number; // Default: 3
  
  // Warning thresholds (in mm) - when to show "monitor" recommendation
  summer_warning_tread_mm: number; // Default: 4
  winter_warning_tread_mm: number; // Default: 5
  allseason_warning_tread_mm: number; // Default: 4
  
  // Maximum tyre age (in years) before recommending replacement
  max_tyre_age_years: number; // Default: 6
  
  // Auto-notify customer when thresholds are reached
  notify_customer_on_low_tread: boolean;
  notify_customer_on_old_tyres: boolean;
  
  updated_at: string;
}

export interface TyrePosition {
  id: string;
  tyre_set_id: string;
  position: "FL" | "FR" | "RL" | "RR"; // Front Left, Front Right, Rear Left, Rear Right
  tread_depth_mm: number | null;
  condition: TyreCondition;
  notes: string | null;
}

export interface StorageLocation {
  id: string;
  org_id: string;
  name: string;
  description: string | null;
  capacity: number | null;
  current_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TyreHistory {
  id: string;
  tyre_set_id: string;
  action: "stored" | "mounted" | "inspected" | "note_added";
  date: string;
  mileage: number | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
}
