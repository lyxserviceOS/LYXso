-- =====================================================
-- LYXso Terms Acceptance Tracking
-- =====================================================
-- This schema tracks user acceptance of legal documents
-- for compliance and legal protection.
-- =====================================================

-- Drop existing table if you want to recreate (CAREFUL!)
-- DROP TABLE IF EXISTS public.user_terms_acceptance CASCADE;

-- Create the terms acceptance table
CREATE TABLE IF NOT EXISTS public.user_terms_acceptance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Version tracking
  terms_version VARCHAR(50) NOT NULL DEFAULT '1.0.0',
  privacy_version VARCHAR(50) NOT NULL DEFAULT '1.0.0',
  cookie_version VARCHAR(50) NOT NULL DEFAULT '1.0.0',
  
  -- Acceptance metadata
  accepted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  acceptance_method VARCHAR(20) CHECK (acceptance_method IN ('registration', 'login', 'manual', 'forced', 'update')) DEFAULT 'manual',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_terms_user_id 
  ON public.user_terms_acceptance(user_id);

CREATE INDEX IF NOT EXISTS idx_user_terms_accepted_at 
  ON public.user_terms_acceptance(accepted_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_terms_versions 
  ON public.user_terms_acceptance(terms_version, privacy_version, cookie_version);

-- Add comment to table
COMMENT ON TABLE public.user_terms_acceptance IS 
  'Tracks user acceptance of terms of service, privacy policy, and cookie policy for legal compliance';

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS
ALTER TABLE public.user_terms_acceptance ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own acceptance history
CREATE POLICY "Users can view own acceptances"
  ON public.user_terms_acceptance
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own acceptances
CREATE POLICY "Users can insert own acceptances"
  ON public.user_terms_acceptance
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Service role can view all (for admin purposes)
CREATE POLICY "Service role full access"
  ON public.user_terms_acceptance
  FOR ALL
  USING (auth.role() = 'service_role');

-- =====================================================
-- Helper Functions
-- =====================================================

-- Function: Check if user has accepted latest terms
CREATE OR REPLACE FUNCTION public.user_has_accepted_latest_terms(
  p_user_id UUID,
  p_terms_version VARCHAR(50) DEFAULT '1.0.0',
  p_privacy_version VARCHAR(50) DEFAULT '1.0.0',
  p_cookie_version VARCHAR(50) DEFAULT '1.0.0'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_terms_acceptance
    WHERE user_id = p_user_id
      AND terms_version = p_terms_version
      AND privacy_version = p_privacy_version
      AND cookie_version = p_cookie_version
    ORDER BY accepted_at DESC
    LIMIT 1
  );
END;
$$;

-- Function: Get user's latest acceptance
CREATE OR REPLACE FUNCTION public.get_user_latest_acceptance(
  p_user_id UUID
)
RETURNS TABLE (
  id UUID,
  terms_version VARCHAR(50),
  privacy_version VARCHAR(50),
  cookie_version VARCHAR(50),
  accepted_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    uta.id,
    uta.terms_version,
    uta.privacy_version,
    uta.cookie_version,
    uta.accepted_at
  FROM public.user_terms_acceptance uta
  WHERE uta.user_id = p_user_id
  ORDER BY uta.accepted_at DESC
  LIMIT 1;
END;
$$;

-- Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_terms_acceptance_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Trigger: Auto-update updated_at on row update
CREATE TRIGGER update_terms_acceptance_updated_at
  BEFORE UPDATE ON public.user_terms_acceptance
  FOR EACH ROW
  EXECUTE FUNCTION public.update_terms_acceptance_updated_at();

-- =====================================================
-- Grants (if needed)
-- =====================================================

-- Grant necessary permissions
GRANT SELECT, INSERT ON public.user_terms_acceptance TO authenticated;
GRANT ALL ON public.user_terms_acceptance TO service_role;

-- =====================================================
-- Sample Queries (for testing)
-- =====================================================

-- Check if current user has accepted latest terms
-- SELECT public.user_has_accepted_latest_terms(auth.uid(), '1.0.0', '1.0.0', '1.0.0');

-- Get current user's latest acceptance
-- SELECT * FROM public.get_user_latest_acceptance(auth.uid());

-- View all acceptances for current user
-- SELECT * FROM public.user_terms_acceptance WHERE user_id = auth.uid() ORDER BY accepted_at DESC;

-- =====================================================
-- Migration complete!
-- =====================================================
