// lyxso-app/types/marketing.ts

export interface MarketingCampaign {
  id: string;
  org_id: string;
  name: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface MarketingPost {
  id: string;
  org_id: string;
  campaign_id: string | null;
  channel_id: string | null;
  title: string | null;
  body: string;
  media_url: string | null;
  status: string;
  scheduled_for: string | null;
  published_at: string | null;
  created_at: string;
  updated_at?: string;
}
