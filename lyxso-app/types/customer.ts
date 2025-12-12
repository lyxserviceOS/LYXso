// lyxso-app/types/customer.ts

export interface Customer {
  id: string;
  org_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
