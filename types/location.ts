// types/location.ts
// Types for Multi-location & Resources module (Module 18)

export interface Location {
  id: string;
  org_id: string;
  name: string;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string;
  
  // Contact
  phone: string | null;
  email: string | null;
  
  // Operating hours (JSON object with days and times)
  opening_hours: Record<string, { open: string; close: string }> | null;
  
  // Settings
  is_active: boolean;
  is_primary: boolean;
  timezone: string;
  
  created_at: string;
  updated_at: string;
}

export type ResourceType = "bay" | "lift" | "room" | "equipment" | "other";

export interface Resource {
  id: string;
  org_id: string;
  location_id: string;
  
  name: string;
  description: string | null;
  type: ResourceType;
  
  // Capacity
  max_concurrent_bookings: number;
  
  // Settings
  is_active: boolean;
  color: string | null; // For calendar display
  
  created_at: string;
  updated_at: string;
}

export interface ResourceAvailability {
  resource_id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  reason: string | null;
}

// Extended booking with location/resource
export interface BookingWithLocation {
  booking_id: string;
  location_id: string | null;
  location_name: string | null;
  resource_id: string | null;
  resource_name: string | null;
}
