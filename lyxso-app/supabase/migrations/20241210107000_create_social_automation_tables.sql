-- Tabell for sky-tilkoblinger (Dropbox, Google Drive, etc)
CREATE TABLE IF NOT EXISTS cloud_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL,
  provider TEXT NOT NULL, -- 'dropbox', 'google_drive', 'onedrive'
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(org_id, provider)
);

-- Tabell for AI-analyser av bilder
CREATE TABLE IF NOT EXISTS image_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  cloud_path TEXT,
  analysis JSONB NOT NULL, -- {description, keywords[], score}
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabell for generert innhold
CREATE TABLE IF NOT EXISTS generated_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  image_analysis_id UUID REFERENCES image_analyses(id),
  generated_message TEXT NOT NULL,
  hashtags TEXT[] DEFAULT '{}',
  platform TEXT NOT NULL, -- 'facebook', 'instagram', 'both'
  status TEXT DEFAULT 'draft', -- 'draft', 'scheduled', 'published', 'failed'
  scheduled_for TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  meta_post_id TEXT,
  engagement_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabell for publiseringsregler (automatisering)
CREATE TABLE IF NOT EXISTS automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  frequency TEXT NOT NULL, -- 'daily', 'weekly', 'custom'
  time_of_day TIME NOT NULL DEFAULT '09:00',
  days_of_week INTEGER[] DEFAULT '{1,2,3,4,5}', -- 1=Monday, 7=Sunday
  max_posts_per_day INTEGER DEFAULT 1,
  platforms TEXT[] DEFAULT '{facebook,instagram}',
  image_source_folder TEXT, -- Path in cloud storage
  ai_tone TEXT DEFAULT 'professional', -- 'professional', 'casual', 'friendly'
  include_hashtags BOOLEAN DEFAULT true,
  auto_analyze_performance BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indekser for ytelse
CREATE INDEX IF NOT EXISTS idx_cloud_connections_org ON cloud_connections(org_id);
CREATE INDEX IF NOT EXISTS idx_image_analyses_org ON image_analyses(org_id);
CREATE INDEX IF NOT EXISTS idx_generated_posts_org ON generated_posts(org_id);
CREATE INDEX IF NOT EXISTS idx_generated_posts_scheduled ON generated_posts(scheduled_for) WHERE status = 'scheduled';
CREATE INDEX IF NOT EXISTS idx_automation_rules_org ON automation_rules(org_id);

-- RLS policies
ALTER TABLE cloud_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;

-- Policies (tilpass til din auth)
CREATE POLICY "Users can view their own cloud connections" ON cloud_connections
  FOR SELECT USING (true);
  
CREATE POLICY "Users can manage their own cloud connections" ON cloud_connections
  FOR ALL USING (true);

CREATE POLICY "Users can view their own image analyses" ON image_analyses
  FOR SELECT USING (true);
  
CREATE POLICY "Users can create image analyses" ON image_analyses
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own generated posts" ON generated_posts
  FOR SELECT USING (true);
  
CREATE POLICY "Users can manage their own generated posts" ON generated_posts
  FOR ALL USING (true);

CREATE POLICY "Users can view their own automation rules" ON automation_rules
  FOR SELECT USING (true);
  
CREATE POLICY "Users can manage their own automation rules" ON automation_rules
  FOR ALL USING (true);
