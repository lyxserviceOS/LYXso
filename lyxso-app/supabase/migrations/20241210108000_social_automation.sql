-- Social Automation Database Schema
-- Automatisk Facebook posting med AI og sky-integrasjon

-- 1) Sky-lagring tilkoblinger (Dropbox, Google Drive)
CREATE TABLE IF NOT EXISTS org_cloud_storage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('dropbox', 'google_drive')),
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  is_connected BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, provider)
);

CREATE INDEX idx_org_cloud_storage_org_id ON org_cloud_storage(org_id);
CREATE INDEX idx_org_cloud_storage_provider ON org_cloud_storage(provider);

-- 2) Bildeanalyser fra AI
CREATE TABLE IF NOT EXISTS org_social_image_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  analysis JSONB NOT NULL, -- AI-analyse av bildet
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_org_social_image_analysis_org_id ON org_social_image_analysis(org_id);

-- 3) Automatiseringsplaner
CREATE TABLE IF NOT EXISTS org_social_automation (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  page_id TEXT NOT NULL, -- Facebook page ID
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'custom')),
  time_of_day TIME NOT NULL, -- '09:00', '14:00', etc
  duration_days INTEGER DEFAULT 30,
  cloud_provider TEXT, -- 'dropbox' or 'google_drive'
  tone TEXT,
  call_to_action TEXT,
  is_active BOOLEAN DEFAULT true,
  last_posted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_org_social_automation_org_id ON org_social_automation(org_id);
CREATE INDEX idx_org_social_automation_is_active ON org_social_automation(is_active);

-- 4) Publiserte innlegg
CREATE TABLE IF NOT EXISTS org_marketing_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  automation_id UUID REFERENCES org_social_automation(id) ON DELETE SET NULL,
  channel TEXT NOT NULL DEFAULT 'meta', -- 'meta', 'instagram', etc
  platform_post_id TEXT, -- ID fra Facebook/Instagram
  page_id TEXT,
  message TEXT NOT NULL,
  image_url TEXT,
  hashtags TEXT[], -- Array of hashtags
  published_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_org_marketing_posts_org_id ON org_marketing_posts(org_id);
CREATE INDEX idx_org_marketing_posts_channel ON org_marketing_posts(channel);
CREATE INDEX idx_org_marketing_posts_published_at ON org_marketing_posts(published_at);
CREATE INDEX idx_org_marketing_posts_status ON org_marketing_posts(status);

-- 5) Row Level Security (RLS)
ALTER TABLE org_cloud_storage ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_social_image_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_social_automation ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_marketing_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for org_cloud_storage
CREATE POLICY org_cloud_storage_select_policy ON org_cloud_storage
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM user_org_roles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY org_cloud_storage_insert_policy ON org_cloud_storage
  FOR INSERT WITH CHECK (
    org_id IN (
      SELECT org_id FROM user_org_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY org_cloud_storage_update_policy ON org_cloud_storage
  FOR UPDATE USING (
    org_id IN (
      SELECT org_id FROM user_org_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY org_cloud_storage_delete_policy ON org_cloud_storage
  FOR DELETE USING (
    org_id IN (
      SELECT org_id FROM user_org_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

-- RLS Policies for org_social_image_analysis
CREATE POLICY org_social_image_analysis_select_policy ON org_social_image_analysis
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM user_org_roles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY org_social_image_analysis_insert_policy ON org_social_image_analysis
  FOR INSERT WITH CHECK (
    org_id IN (
      SELECT org_id FROM user_org_roles WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for org_social_automation
CREATE POLICY org_social_automation_select_policy ON org_social_automation
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM user_org_roles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY org_social_automation_insert_policy ON org_social_automation
  FOR INSERT WITH CHECK (
    org_id IN (
      SELECT org_id FROM user_org_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY org_social_automation_update_policy ON org_social_automation
  FOR UPDATE USING (
    org_id IN (
      SELECT org_id FROM user_org_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY org_social_automation_delete_policy ON org_social_automation
  FOR DELETE USING (
    org_id IN (
      SELECT org_id FROM user_org_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

-- RLS Policies for org_marketing_posts
CREATE POLICY org_marketing_posts_select_policy ON org_marketing_posts
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM user_org_roles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY org_marketing_posts_insert_policy ON org_marketing_posts
  FOR INSERT WITH CHECK (
    org_id IN (
      SELECT org_id FROM user_org_roles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY org_marketing_posts_update_policy ON org_marketing_posts
  FOR UPDATE USING (
    org_id IN (
      SELECT org_id FROM user_org_roles WHERE user_id = auth.uid()
    )
  );

-- Grant permissions to service_role (for API to bypass RLS)
GRANT ALL ON org_cloud_storage TO service_role;
GRANT ALL ON org_social_image_analysis TO service_role;
GRANT ALL ON org_social_automation TO service_role;
GRANT ALL ON org_marketing_posts TO service_role;

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON org_cloud_storage TO authenticated;
GRANT SELECT, INSERT ON org_social_image_analysis TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON org_social_automation TO authenticated;
GRANT SELECT, INSERT, UPDATE ON org_marketing_posts TO authenticated;
