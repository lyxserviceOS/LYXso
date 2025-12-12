-- ============================================================================
-- REMAINING TABLES - NICE-TO-HAVE FEATURES
-- ============================================================================
-- Dato: 10. desember 2024, kl. 04:24
-- Formål: Opprett de siste 11 tabellene for 100% completeness
--
-- KJØR I SUPABASE SQL EDITOR:
-- https://supabase.com/dashboard/project/gedoxtrdylqxyyvfjmtb/sql
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. USERS (Ekstra brukerdata utover Supabase Auth)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Profile info
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  
  -- Preferences
  language TEXT DEFAULT 'no',
  timezone TEXT DEFAULT 'Europe/Oslo',
  theme TEXT DEFAULT 'light',
  
  -- Metadata
  last_seen_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile"
      ON public.users FOR SELECT
      USING (id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON public.users FOR UPDATE
      USING (id = auth.uid());
  END IF;
END $$;

-- ============================================================================
-- 2. USER_PROFILES (Utvidede bruker-profiler)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Professional info
  job_title TEXT,
  department TEXT,
  bio TEXT,
  
  -- Social
  linkedin_url TEXT,
  twitter_handle TEXT,
  
  -- Settings
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  push_notifications BOOLEAN DEFAULT true,
  
  -- Onboarding
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_step INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile"
      ON public.user_profiles FOR ALL
      USING (user_id = auth.uid());
  END IF;
END $$;

-- ============================================================================
-- 3. SERVICE_PRICING (Dynamisk prising for tjenester)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.service_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  
  -- Pricing tiers
  tier_name TEXT, -- 'basic', 'premium', 'vip'
  base_price DECIMAL(10,2) NOT NULL,
  
  -- Time-based pricing
  weekday_multiplier DECIMAL(3,2) DEFAULT 1.0,
  weekend_multiplier DECIMAL(3,2) DEFAULT 1.2,
  evening_multiplier DECIMAL(3,2) DEFAULT 1.1,
  
  -- Volume discounts
  min_quantity INTEGER,
  max_quantity INTEGER,
  discount_percent DECIMAL(5,2),
  
  -- Seasonal pricing
  valid_from TIMESTAMPTZ,
  valid_to TIMESTAMPTZ,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_pricing_org ON public.service_pricing(org_id);
CREATE INDEX IF NOT EXISTS idx_service_pricing_service ON public.service_pricing(service_id);

-- RLS
ALTER TABLE public.service_pricing ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'service_pricing' AND policyname = 'service_pricing_org_access'
  ) THEN
    CREATE POLICY "service_pricing_org_access"
      ON public.service_pricing FOR ALL
      USING (org_id IN (SELECT org_id FROM public.org_users WHERE user_id = auth.uid()));
  END IF;
END $$;

-- ============================================================================
-- 4. EMPLOYEE_SCHEDULES (Turnusplanlegging)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.employee_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  
  -- Schedule info
  schedule_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  
  -- Break times
  break_start TIME,
  break_duration INTEGER, -- minutes
  
  -- Status
  status TEXT DEFAULT 'scheduled', -- 'scheduled', 'confirmed', 'cancelled', 'completed'
  
  -- Location
  location_id UUID REFERENCES public.locations(id),
  
  -- Notes
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, schedule_date, start_time)
);

CREATE INDEX IF NOT EXISTS idx_employee_schedules_org ON public.employee_schedules(org_id);
CREATE INDEX IF NOT EXISTS idx_employee_schedules_employee ON public.employee_schedules(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_schedules_date ON public.employee_schedules(schedule_date);

-- RLS
ALTER TABLE public.employee_schedules ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'employee_schedules' AND policyname = 'employee_schedules_org_access'
  ) THEN
    CREATE POLICY "employee_schedules_org_access"
      ON public.employee_schedules FOR ALL
      USING (org_id IN (SELECT org_id FROM public.org_users WHERE user_id = auth.uid()));
  END IF;
END $$;

-- ============================================================================
-- 5. TIME_TRACKING (Timeføring for ansatte)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.time_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  
  -- Time tracking
  clock_in TIMESTAMPTZ NOT NULL,
  clock_out TIMESTAMPTZ,
  
  -- Break time
  break_duration INTEGER DEFAULT 0, -- minutes
  
  -- Work details
  booking_id UUID REFERENCES public.bookings(id),
  task_type TEXT, -- 'booking', 'admin', 'training', 'break'
  description TEXT,
  
  -- Location tracking
  location_id UUID REFERENCES public.locations(id),
  clock_in_location JSONB, -- {lat, lng}
  clock_out_location JSONB,
  
  -- Calculated fields
  total_hours DECIMAL(5,2),
  billable_hours DECIMAL(5,2),
  
  -- Approval
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_time_tracking_org ON public.time_tracking(org_id);
CREATE INDEX IF NOT EXISTS idx_time_tracking_employee ON public.time_tracking(employee_id);
CREATE INDEX IF NOT EXISTS idx_time_tracking_date ON public.time_tracking(clock_in);

-- RLS
ALTER TABLE public.time_tracking ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'time_tracking' AND policyname = 'time_tracking_org_access'
  ) THEN
    CREATE POLICY "time_tracking_org_access"
      ON public.time_tracking FOR ALL
      USING (org_id IN (SELECT org_id FROM public.org_users WHERE user_id = auth.uid()));
  END IF;
END $$;

-- ============================================================================
-- 6. TYRE_IMAGES (Bilder av dekk)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.tyre_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  tyre_set_id UUID NOT NULL REFERENCES public.tyre_sets(id) ON DELETE CASCADE,
  
  -- Image info
  image_url TEXT NOT NULL,
  position TEXT, -- 'front_left', 'front_right', 'rear_left', 'rear_right'
  image_type TEXT, -- 'tread', 'sidewall', 'overall', 'damage'
  
  -- Analysis
  ai_analysis_id UUID,
  depth_measurement DECIMAL(4,2), -- mm
  
  -- Metadata
  taken_at TIMESTAMPTZ DEFAULT NOW(),
  taken_by UUID,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tyre_images_org ON public.tyre_images(org_id);
CREATE INDEX IF NOT EXISTS idx_tyre_images_tyre_set ON public.tyre_images(tyre_set_id);

-- RLS
ALTER TABLE public.tyre_images ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'tyre_images' AND policyname = 'tyre_images_org_access'
  ) THEN
    CREATE POLICY "tyre_images_org_access"
      ON public.tyre_images FOR ALL
      USING (org_id IN (SELECT org_id FROM public.org_users WHERE user_id = auth.uid()));
  END IF;
END $$;

-- ============================================================================
-- 7. TYRE_AI_ANALYSIS (AI analyse av dekk)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.tyre_ai_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  tyre_set_id UUID NOT NULL REFERENCES public.tyre_sets(id) ON DELETE CASCADE,
  image_id UUID REFERENCES public.tyre_images(id),
  
  -- AI results
  condition_score DECIMAL(3,2), -- 0-1
  tread_depth DECIMAL(4,2), -- mm
  wear_pattern TEXT,
  
  -- Detected issues
  issues JSONB DEFAULT '[]', -- [{type, severity, location}]
  damage_detected BOOLEAN DEFAULT false,
  
  -- Recommendations
  recommendation TEXT,
  urgency TEXT, -- 'low', 'medium', 'high', 'critical'
  
  -- AI metadata
  model_version TEXT,
  confidence_score DECIMAL(3,2),
  processing_time INTEGER, -- ms
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tyre_ai_analysis_org ON public.tyre_ai_analysis(org_id);
CREATE INDEX IF NOT EXISTS idx_tyre_ai_analysis_tyre_set ON public.tyre_ai_analysis(tyre_set_id);

-- RLS
ALTER TABLE public.tyre_ai_analysis ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'tyre_ai_analysis' AND policyname = 'tyre_ai_analysis_org_access'
  ) THEN
    CREATE POLICY "tyre_ai_analysis_org_access"
      ON public.tyre_ai_analysis FOR ALL
      USING (org_id IN (SELECT org_id FROM public.org_users WHERE user_id = auth.uid()));
  END IF;
END $$;

-- ============================================================================
-- 8. PPF_JOBS (Paint Protection Film jobber)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.ppf_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  
  -- Customer & Vehicle
  customer_id UUID REFERENCES public.customers(id),
  vehicle_id UUID REFERENCES public.vehicles(id),
  booking_id UUID REFERENCES public.bookings(id),
  
  -- Job details
  job_number TEXT UNIQUE,
  status TEXT DEFAULT 'quoted', -- 'quoted', 'scheduled', 'in_progress', 'completed', 'cancelled'
  
  -- Coverage areas
  coverage_areas JSONB DEFAULT '[]', -- ['full_front', 'hood', 'fenders', 'mirrors']
  
  -- Film details
  film_brand TEXT,
  film_type TEXT, -- 'matte', 'gloss', 'satin'
  film_thickness TEXT,
  
  -- Pricing
  quoted_price DECIMAL(10,2),
  final_price DECIMAL(10,2),
  
  -- Warranty
  warranty_years INTEGER,
  warranty_certificate_url TEXT,
  
  -- Dates
  quoted_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- Team
  installer_id UUID REFERENCES public.employees(id),
  
  -- Photos
  before_photos TEXT[] DEFAULT '{}',
  after_photos TEXT[] DEFAULT '{}',
  
  -- Notes
  notes TEXT,
  internal_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ppf_jobs_org ON public.ppf_jobs(org_id);
CREATE INDEX IF NOT EXISTS idx_ppf_jobs_customer ON public.ppf_jobs(customer_id);
CREATE INDEX IF NOT EXISTS idx_ppf_jobs_status ON public.ppf_jobs(status);

-- RLS
ALTER TABLE public.ppf_jobs ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ppf_jobs' AND policyname = 'ppf_jobs_org_access'
  ) THEN
    CREATE POLICY "ppf_jobs_org_access"
      ON public.ppf_jobs FOR ALL
      USING (org_id IN (SELECT org_id FROM public.org_users WHERE user_id = auth.uid()));
  END IF;
END $$;

-- ============================================================================
-- 9. PRODUCT_VARIANTS (Produkt varianter)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  
  -- Variant info
  name TEXT NOT NULL,
  sku TEXT,
  
  -- Options
  option1_name TEXT, -- 'Size', 'Color', etc
  option1_value TEXT,
  option2_name TEXT,
  option2_value TEXT,
  option3_name TEXT,
  option3_value TEXT,
  
  -- Pricing
  price_adjustment DECIMAL(10,2) DEFAULT 0,
  cost_adjustment DECIMAL(10,2) DEFAULT 0,
  
  -- Inventory
  stock_quantity INTEGER DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_variants_org ON public.product_variants(org_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON public.product_variants(product_id);

-- RLS
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'product_variants' AND policyname = 'product_variants_org_access'
  ) THEN
    CREATE POLICY "product_variants_org_access"
      ON public.product_variants FOR ALL
      USING (org_id IN (SELECT org_id FROM public.org_users WHERE user_id = auth.uid()));
  END IF;
END $$;

-- ============================================================================
-- 10. SOCIAL_AUTOMATION (Sosiale medier automatisering)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.social_automation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  
  -- Platform
  platform TEXT NOT NULL, -- 'facebook', 'instagram', 'linkedin'
  platform_account_id TEXT,
  
  -- Post content
  content TEXT NOT NULL,
  media_urls TEXT[] DEFAULT '{}',
  
  -- Scheduling
  scheduled_for TIMESTAMPTZ NOT NULL,
  posted_at TIMESTAMPTZ,
  
  -- Status
  status TEXT DEFAULT 'scheduled', -- 'scheduled', 'posted', 'failed', 'cancelled'
  
  -- Results
  post_id TEXT,
  post_url TEXT,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  
  -- Settings
  auto_boost BOOLEAN DEFAULT false,
  boost_budget DECIMAL(8,2),
  
  -- Error handling
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_social_automation_org ON public.social_automation(org_id);
CREATE INDEX IF NOT EXISTS idx_social_automation_scheduled ON public.social_automation(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_social_automation_status ON public.social_automation(status);

-- RLS
ALTER TABLE public.social_automation ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'social_automation' AND policyname = 'social_automation_org_access'
  ) THEN
    CREATE POLICY "social_automation_org_access"
      ON public.social_automation FOR ALL
      USING (org_id IN (SELECT org_id FROM public.org_users WHERE user_id = auth.uid()));
  END IF;
END $$;

-- ============================================================================
-- 11. REPORT_SCHEDULES (Automatisk rapport-generering)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.report_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  
  -- Report config
  report_type TEXT NOT NULL, -- 'sales', 'inventory', 'customer', 'performance'
  report_name TEXT NOT NULL,
  
  -- Schedule
  frequency TEXT NOT NULL, -- 'daily', 'weekly', 'monthly'
  day_of_week INTEGER, -- 0-6 for weekly
  day_of_month INTEGER, -- 1-31 for monthly
  time_of_day TIME DEFAULT '08:00',
  
  -- Recipients
  email_recipients TEXT[] DEFAULT '{}',
  
  -- Format
  format TEXT DEFAULT 'pdf', -- 'pdf', 'excel', 'csv'
  
  -- Filters
  filters JSONB DEFAULT '{}',
  date_range TEXT DEFAULT 'last_month', -- 'last_week', 'last_month', 'last_quarter'
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_report_schedules_org ON public.report_schedules(org_id);
CREATE INDEX IF NOT EXISTS idx_report_schedules_next_run ON public.report_schedules(next_run_at);

-- RLS
ALTER TABLE public.report_schedules ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'report_schedules' AND policyname = 'report_schedules_org_access'
  ) THEN
    CREATE POLICY "report_schedules_org_access"
      ON public.report_schedules FOR ALL
      USING (org_id IN (SELECT org_id FROM public.org_users WHERE user_id = auth.uid()));
  END IF;
END $$;

COMMIT;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '============================================';
  RAISE NOTICE 'ALLE 11 NICE-TO-HAVE TABELLER OPPRETTET!';
  RAISE NOTICE '============================================';
  RAISE NOTICE ' ';
  RAISE NOTICE 'Opprettet:';
  RAISE NOTICE '  users';
  RAISE NOTICE '  user_profiles';
  RAISE NOTICE '  service_pricing';
  RAISE NOTICE '  employee_schedules';
  RAISE NOTICE '  time_tracking';
  RAISE NOTICE '  tyre_images';
  RAISE NOTICE '  tyre_ai_analysis';
  RAISE NOTICE '  ppf_jobs';
  RAISE NOTICE '  product_variants';
  RAISE NOTICE '  social_automation';
  RAISE NOTICE '  report_schedules';
  RAISE NOTICE ' ';
  RAISE NOTICE 'DATABASE ER NAA 100 PROSENT KOMPLETT!';
  RAISE NOTICE ' ';
  RAISE NOTICE 'Kjoer analyse for aa verifisere:';
  RAISE NOTICE '  node comprehensive-supabase-analysis.mjs';
  RAISE NOTICE '============================================';
END $$;
