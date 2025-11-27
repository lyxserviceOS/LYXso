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
  
  // Storage
  storage_location_id: string | null;
  location: string | null; // Legacy field for location name
  shelf: string | null;
  row: string | null;
  position: string | null;
  
  status: TyreStatus;
  notes: string | null;
  
  // Timestamps
  stored_at: string | null;
  last_mounted_at: string | null;
  mileage_at_storage: number | null;
  created_at: string;
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
