// types/vision.ts
// Types for Dream features module (Module 30)
// CoatVision, 3D printing, AR, and other advanced features

export type InspectionType = 
  | "pre_coating"
  | "post_coating"
  | "followup_1"
  | "followup_2"
  | "followup_3"
  | "followup_4"
  | "followup_5"
  | "damage_report"
  | "general";

export type ImageTag = 
  | "scratch"
  | "swirl"
  | "dent"
  | "chip"
  | "oxidation"
  | "water_spot"
  | "contamination"
  | "clean"
  | "coated"
  | "polished"
  | "before"
  | "after";

export interface InspectionImage {
  id: string;
  org_id: string;
  
  // Related entities
  coating_job_id: string | null;
  customer_id: string | null;
  vehicle_id: string | null;
  
  inspection_type: InspectionType;
  
  // Image data
  image_url: string;
  thumbnail_url: string | null;
  
  // Position on vehicle
  vehicle_section: VehicleSection | null;
  position_x: number | null; // 0-100 percentage
  position_y: number | null;
  
  // AI analysis
  ai_tags: ImageTag[];
  ai_confidence: number | null;
  ai_analysis: string | null;
  
  // Manual notes
  notes: string | null;
  severity: "minor" | "moderate" | "severe" | null;
  
  // Metadata
  captured_at: string;
  captured_by: string | null;
  device_info: string | null;
  
  created_at: string;
  updated_at: string;
}

export type VehicleSection = 
  | "hood"
  | "roof"
  | "trunk"
  | "front_bumper"
  | "rear_bumper"
  | "front_left_fender"
  | "front_right_fender"
  | "rear_left_fender"
  | "rear_right_fender"
  | "front_left_door"
  | "front_right_door"
  | "rear_left_door"
  | "rear_right_door"
  | "left_mirror"
  | "right_mirror"
  | "front_windshield"
  | "rear_windshield"
  | "left_side"
  | "right_side"
  | "interior"
  | "wheels"
  | "other";

export interface VehicleDiagram {
  vehicle_type: "sedan" | "suv" | "hatchback" | "wagon" | "coupe" | "van" | "truck";
  sections: {
    section: VehicleSection;
    path: string; // SVG path
    center_x: number;
    center_y: number;
  }[];
}

export interface InspectionReport {
  id: string;
  org_id: string;
  
  // Related entities
  coating_job_id: string | null;
  customer_id: string;
  vehicle_id: string | null;
  
  inspection_type: InspectionType;
  
  // Report details
  title: string;
  summary: string | null;
  
  // Images in this report
  image_ids: string[];
  
  // Findings
  findings: InspectionFinding[];
  
  // Overall assessment
  overall_condition: "excellent" | "good" | "fair" | "poor";
  recommended_actions: string[];
  
  // Generated report
  pdf_url: string | null;
  
  // Inspector
  inspector_id: string | null;
  inspector_name: string | null;
  
  inspected_at: string;
  created_at: string;
  updated_at: string;
}

export interface InspectionFinding {
  section: VehicleSection;
  finding_type: ImageTag;
  severity: "minor" | "moderate" | "severe";
  description: string;
  image_id: string | null;
  recommended_action: string | null;
}

// CoatVision device integration
export interface CoatVisionDevice {
  id: string;
  org_id: string;
  
  device_serial: string;
  device_name: string;
  device_type: "handheld" | "glasses" | "camera";
  
  // Status
  is_active: boolean;
  last_seen_at: string | null;
  battery_level: number | null;
  firmware_version: string | null;
  
  // Configuration
  auto_upload: boolean;
  upload_quality: "low" | "medium" | "high";
  
  created_at: string;
  updated_at: string;
}

// 3D Services module
export interface Print3DService {
  id: string;
  org_id: string;
  
  name: string;
  description: string | null;
  
  // Material info
  material: string;
  color_options: string[];
  
  // Pricing
  base_price: number;
  price_per_cm3: number;
  currency: string;
  
  // Timing
  estimated_hours: number;
  
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Print3DOrder {
  id: string;
  org_id: string;
  customer_id: string;
  
  // Order details
  service_id: string;
  
  // File
  model_file_url: string;
  model_preview_url: string | null;
  
  // Specifications
  material: string;
  color: string;
  quantity: number;
  volume_cm3: number | null;
  
  // Pricing
  price: number;
  currency: string;
  
  // Status
  status: "pending" | "printing" | "completed" | "shipped" | "cancelled";
  
  // Timing
  estimated_completion: string | null;
  completed_at: string | null;
  shipped_at: string | null;
  
  // Notes
  notes: string | null;
  
  created_at: string;
  updated_at: string;
}

// AR visualization
export interface ARVisualization {
  id: string;
  org_id: string;
  
  name: string;
  description: string | null;
  
  // Type
  visualization_type: "coating_preview" | "color_change" | "damage_highlight" | "product_demo";
  
  // Assets
  model_url: string | null;
  texture_urls: string[];
  
  // Configuration
  settings: Record<string, unknown>;
  
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
