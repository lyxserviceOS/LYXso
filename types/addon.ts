// lyxso-app/types/addon.ts

export interface Addon {
  id: string;
  org_id: string;
  name: string;
  description: string | null;
  extra_price: number;
  extra_duration_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceAddon {
  id: string;
  org_id: string;
  service_id: string;
  addon_id: string;
}
