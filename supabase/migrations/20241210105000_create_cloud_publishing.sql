-- Auto-publishing med sky-integrasjon (Dropbox/OneDrive)

-- Tabell for sky-tilkoblinger (Dropbox, OneDrive, Google Drive)
CREATE TABLE IF NOT EXISTS org_marketing_cloud_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('dropbox', 'onedrive', 'google_drive')),
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  folder_path TEXT, -- Valgt mappe for bilder
  folder_id TEXT, -- Provider-spesifikk mappe-ID
  account_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, provider)
);

-- Tabell for planlagte innlegg
CREATE TABLE IF NOT EXISTS org_marketing_scheduled_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  
  -- Bilde-info
  image_url TEXT NOT NULL,
  image_source TEXT, -- 'dropbox', 'onedrive', 'google_drive', 'upload'
  image_path TEXT, -- Original sti i sky-tjenesten
  
  -- AI-generert innhold
  ai_generated_text TEXT NOT NULL,
  hashtags TEXT[],
  ai_score NUMERIC(3,2), -- 1-10 score fra AI-analyse
  
  -- Publisering
  scheduled_for TIMESTAMPTZ NOT NULL,
  published_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'failed', 'cancelled')),
  
  -- Meta-info
  page_id TEXT, -- Facebook/Instagram page ID
  platform TEXT DEFAULT 'meta' CHECK (platform IN ('meta', 'instagram', 'linkedin')),
  platform_post_id TEXT, -- ID fra Facebook/Instagram
  
  -- Metadata
  metadata JSONB, -- AI-analyse, engagement-stats, osv
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabell for publiseringsplaner (daglig/månedlig)
CREATE TABLE IF NOT EXISTS org_marketing_publishing_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  
  -- Plantype
  schedule_type TEXT NOT NULL CHECK (schedule_type IN ('daily', 'weekly', 'monthly')),
  is_active BOOLEAN DEFAULT true,
  
  -- Timing
  time_of_day TIME NOT NULL DEFAULT '10:00', -- Når på dagen skal det publiseres
  timezone TEXT DEFAULT 'Europe/Oslo',
  start_date DATE NOT NULL,
  end_date DATE,
  
  -- Sky-tilkobling
  cloud_provider TEXT CHECK (cloud_provider IN ('dropbox', 'onedrive', 'google_drive')),
  folder_path TEXT,
  
  -- Publiseringsinnstillinger
  page_id TEXT NOT NULL,
  platform TEXT DEFAULT 'meta',
  auto_select_images BOOLEAN DEFAULT true, -- AI velger beste bilder
  max_posts_per_period INTEGER DEFAULT 1,
  
  -- AI-innstillinger
  tone TEXT DEFAULT 'professional', -- professional, casual, friendly, playful
  include_hashtags BOOLEAN DEFAULT true,
  min_ai_score NUMERIC(3,2) DEFAULT 7.0, -- Kun bilder med score > 7
  
  -- Stats
  total_posts_published INTEGER DEFAULT 0,
  last_published_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_cloud_connections_org ON org_marketing_cloud_connections(org_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_org ON org_marketing_scheduled_posts(org_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_pending ON org_marketing_scheduled_posts(status, scheduled_for) 
  WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_scheduled_for ON org_marketing_scheduled_posts(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_publishing_schedules_org ON org_marketing_publishing_schedules(org_id);
CREATE INDEX IF NOT EXISTS idx_publishing_schedules_active ON org_marketing_publishing_schedules(is_active, start_date)
  WHERE is_active = true;

-- Row Level Security (RLS)
ALTER TABLE org_marketing_cloud_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_marketing_scheduled_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_marketing_publishing_schedules ENABLE ROW LEVEL SECURITY;

-- RLS Policies (kun org members kan se sine egne data)
CREATE POLICY org_marketing_cloud_connections_policy ON org_marketing_cloud_connections
  FOR ALL USING (org_id IN (
    SELECT org_id FROM org_members WHERE user_id = auth.uid()
  ));

CREATE POLICY org_marketing_scheduled_posts_policy ON org_marketing_scheduled_posts
  FOR ALL USING (org_id IN (
    SELECT org_id FROM org_members WHERE user_id = auth.uid()
  ));

CREATE POLICY org_marketing_publishing_schedules_policy ON org_marketing_publishing_schedules
  FOR ALL USING (org_id IN (
    SELECT org_id FROM org_members WHERE user_id = auth.uid()
  ));

-- Kommentarer
COMMENT ON TABLE org_marketing_cloud_connections IS 'Sky-tilkoblinger (Dropbox, OneDrive, Google Drive) for automatisk publisering';
COMMENT ON TABLE org_marketing_scheduled_posts IS 'Planlagte innlegg med AI-generert tekst fra sky-bilder';
COMMENT ON TABLE org_marketing_publishing_schedules IS 'Automatiske publiseringsplaner (daglig/månedlig)';
