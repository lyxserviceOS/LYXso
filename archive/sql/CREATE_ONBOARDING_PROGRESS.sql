-- Onboarding progress tracking
CREATE TABLE IF NOT EXISTS onboarding_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  completed_steps TEXT[] DEFAULT '{}',
  dismissed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_onboarding_progress_org_id ON onboarding_progress(org_id);

-- RLS policies
ALTER TABLE onboarding_progress ENABLE ROW LEVEL SECURITY;

-- Users can view and update their own org's progress
CREATE POLICY "Users can view own org onboarding progress"
  ON onboarding_progress
  FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM org_memberships WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own org onboarding progress"
  ON onboarding_progress
  FOR ALL
  USING (
    org_id IN (
      SELECT org_id FROM org_memberships WHERE user_id = auth.uid()
    )
  );

-- Auto-update timestamp
CREATE OR REPLACE FUNCTION update_onboarding_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER onboarding_progress_updated_at
  BEFORE UPDATE ON onboarding_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_onboarding_progress_updated_at();

-- Seed initial progress for existing orgs
INSERT INTO onboarding_progress (org_id, completed_steps, dismissed)
SELECT id, '{}', FALSE
FROM organizations
WHERE NOT EXISTS (
  SELECT 1 FROM onboarding_progress WHERE org_id = organizations.id
)
ON CONFLICT (org_id) DO NOTHING;
