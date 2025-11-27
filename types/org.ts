// types/org.ts

export type OrgPlan = "free" | "trial" | "paid";

export type Org = {
  id: string;
  name: string;
  org_number: string | null;
  is_active: boolean;
  plan: OrgPlan | null;
  created_at: string;
  updated_at?: string | null;
  logo_url?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
};
