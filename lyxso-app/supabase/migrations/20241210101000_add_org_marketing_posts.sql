-- Migration: Add org_marketing_posts table
-- Tracks published/scheduled posts to Meta, Google, etc.

CREATE TABLE IF NOT EXISTS org_marketing_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  
  -- Which channel (meta, google, tiktok)
  channel TEXT NOT NULL CHECK (channel IN ('meta', 'google', 'tiktok')),
  
  -- Platform-specific IDs
  platform_post_id TEXT, -- e.g. Facebook post ID
  page_id TEXT, -- e.g. Facebook Page ID
  
  -- Post content
  message TEXT NOT NULL,
  image_url TEXT,
  link_url TEXT,
  
  -- Scheduling
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
  error_message TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_org_marketing_posts_org_id ON org_marketing_posts(org_id);
CREATE INDEX IF NOT EXISTS idx_org_marketing_posts_channel ON org_marketing_posts(channel);
CREATE INDEX IF NOT EXISTS idx_org_marketing_posts_status ON org_marketing_posts(status);
CREATE INDEX IF NOT EXISTS idx_org_marketing_posts_scheduled_at ON org_marketing_posts(scheduled_at);

-- RLS Policies
ALTER TABLE org_marketing_posts ENABLE ROW LEVEL SECURITY;

-- Partners can manage their own posts
CREATE POLICY org_marketing_posts_select ON org_marketing_posts
  FOR SELECT USING (org_id = auth.uid() OR org_id IN (
    SELECT org_id FROM org_members WHERE user_id = auth.uid()
  ));

CREATE POLICY org_marketing_posts_insert ON org_marketing_posts
  FOR INSERT WITH CHECK (org_id = auth.uid() OR org_id IN (
    SELECT org_id FROM org_members WHERE user_id = auth.uid()
  ));

CREATE POLICY org_marketing_posts_update ON org_marketing_posts
  FOR UPDATE USING (org_id = auth.uid() OR org_id IN (
    SELECT org_id FROM org_members WHERE user_id = auth.uid()
  ));

CREATE POLICY org_marketing_posts_delete ON org_marketing_posts
  FOR DELETE USING (org_id = auth.uid() OR org_id IN (
    SELECT org_id FROM org_members WHERE user_id = auth.uid()
  ));

-- Comments
COMMENT ON TABLE org_marketing_posts IS 'Marketing posts published to social media platforms';
COMMENT ON COLUMN org_marketing_posts.channel IS 'Social media platform (meta/google/tiktok)';
COMMENT ON COLUMN org_marketing_posts.status IS 'Post status: draft, scheduled, published, or failed';
