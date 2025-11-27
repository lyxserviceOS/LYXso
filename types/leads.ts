// lyxso-app/types/leads.ts

export interface AiAgentConfig {
  id: string;
  org_id: string;
  enabled: boolean;
  channels: string[];
  opening_hours: Record<string, unknown>;
  max_contact_attempts: number;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  org_id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  source: string | null;
  status: string;
  notes: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
