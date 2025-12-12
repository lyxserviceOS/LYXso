-- Migration: 005_ai_marketing_tables.sql
-- Add tables for AI Marketing module
-- Created: 2025-11-30

-- ============================================================================
-- AI Marketing Jobs Table
-- Stores AI-generated marketing campaigns, ad copies, and reports
-- ============================================================================

CREATE TABLE IF NOT EXISTS ai_marketing_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  
  -- Job metadata
  job_type TEXT NOT NULL CHECK (job_type IN ('campaign_ideas', 'ad_copy', 'marketing_report')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  
  -- Input/Output data (stored as JSONB for flexibility)
  input JSONB NOT NULL DEFAULT '{}',
  output JSONB DEFAULT NULL,
  
  -- Error tracking
  error_message TEXT DEFAULT NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ DEFAULT NULL,
  completed_at TIMESTAMPTZ DEFAULT NULL,
  
  -- Indexes for performance
  CONSTRAINT ai_marketing_jobs_org_id_fk FOREIGN KEY (org_id) REFERENCES orgs(id) ON DELETE CASCADE
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_ai_marketing_jobs_org_id ON ai_marketing_jobs(org_id);
CREATE INDEX IF NOT EXISTS idx_ai_marketing_jobs_job_type ON ai_marketing_jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_ai_marketing_jobs_status ON ai_marketing_jobs(status);
CREATE INDEX IF NOT EXISTS idx_ai_marketing_jobs_created_at ON ai_marketing_jobs(created_at DESC);

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================

ALTER TABLE ai_marketing_jobs ENABLE ROW LEVEL SECURITY;

-- Users can only see their own organization's marketing jobs
CREATE POLICY ai_marketing_jobs_select_org 
  ON ai_marketing_jobs 
  FOR SELECT 
  TO authenticated 
  USING (org_id = public.get_user_org_id());

-- Users can only insert marketing jobs for their own organization
CREATE POLICY ai_marketing_jobs_insert_org 
  ON ai_marketing_jobs 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (org_id = public.get_user_org_id());

-- Users can only update their own organization's marketing jobs
CREATE POLICY ai_marketing_jobs_update_org 
  ON ai_marketing_jobs 
  FOR UPDATE 
  TO authenticated 
  USING (org_id = public.get_user_org_id())
  WITH CHECK (org_id = public.get_user_org_id());

-- Users can only delete their own organization's marketing jobs
CREATE POLICY ai_marketing_jobs_delete_org 
  ON ai_marketing_jobs 
  FOR DELETE 
  TO authenticated 
  USING (org_id = public.get_user_org_id());

-- ============================================================================
-- Comments for documentation
-- ============================================================================

COMMENT ON TABLE ai_marketing_jobs IS 'Stores AI-generated marketing content including campaign ideas, ad copies, and marketing reports';
COMMENT ON COLUMN ai_marketing_jobs.job_type IS 'Type of marketing job: campaign_ideas, ad_copy, or marketing_report';
COMMENT ON COLUMN ai_marketing_jobs.status IS 'Job status: pending, processing, completed, or failed';
COMMENT ON COLUMN ai_marketing_jobs.input IS 'Input parameters for the AI job (stored as JSON)';
COMMENT ON COLUMN ai_marketing_jobs.output IS 'AI-generated output (stored as JSON)';
COMMENT ON COLUMN ai_marketing_jobs.error_message IS 'Error message if job failed';
