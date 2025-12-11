// types/coating.ts
// Types for Coating PRO module (Module 16)

export type CoatingJobStatus = "pending" | "in_progress" | "completed" | "cancelled";
export type FollowupStatus = "scheduled" | "completed" | "missed" | "cancelled";

export interface CoatingJob {
  id: string;
  org_id: string;
  customer_id: string;
  vehicle_id: string | null;
  booking_id: string | null;
  
  // Coating details
  product_name: string;
  product_brand: string | null;
  layers: number;
  warranty_years: number;
  warranty_expires_at: string | null;
  
  // Pricing
  price: number | null;
  currency: string;
  
  status: CoatingJobStatus;
  notes: string | null;
  
  // Job execution
  performed_by: string | null;
  performed_at: string | null;
  
  created_at: string;
  updated_at: string;
}

export interface CoatingFollowup {
  id: string;
  coating_job_id: string;
  org_id: string;
  
  followup_number: number; // 1, 2, 3, 4, 5 for the 5 annual checkups
  scheduled_at: string;
  completed_at: string | null;
  
  status: FollowupStatus;
  
  // Inspection details
  inspector_id: string | null;
  inspector_name: string | null;
  condition_rating: number | null; // 1-5
  notes: string | null;
  
  created_at: string;
  updated_at: string;
}

export interface CoatingInspectionPhoto {
  id: string;
  followup_id: string;
  url: string;
  caption: string | null;
  taken_at: string | null;
  created_at: string;
}

// Pipeline view types
export interface CoatingPipelineItem {
  job: CoatingJob;
  customer_name: string;
  vehicle_info: string | null;
  next_followup: CoatingFollowup | null;
  completed_followups: number;
  total_followups: number;
}

export type CoatingPipelineStage = 
  | "new_job"
  | "followup_1"
  | "followup_2"
  | "followup_3"
  | "followup_4"
  | "followup_5"
  | "warranty_expired";

// Certificate types
export interface CoatingCertificate {
  id: string;
  coating_job_id: string;
  certificate_number: string;
  public_token: string;
  public_url?: string;
  qr_code_url?: string;
  pdf_url?: string;
  issued_at: string;
  expires_at: string;
  warranty_years: number;
  is_valid?: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}
