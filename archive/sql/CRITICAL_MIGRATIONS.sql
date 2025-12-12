-- ============================================================================
-- KRITISK: SAMLET MIGRATION FOR MANGLENDE TABELLER OG RLS
-- ============================================================================
-- Dato: 10. desember 2024
-- Formål: Opprett manglende tabeller og aktiver RLS
-- 
-- KJØR DETTE I SUPABASE SQL EDITOR:
-- https://supabase.com/dashboard/project/gedoxtrdylqxyyvfjmtb/sql
-- ============================================================================



-- ============================================================================
-- 1. OPPRETT ORGANIZATIONS TABELL (KRITISK!)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  
  -- Subscription
  subscription_plan_id UUID REFERENCES public.subscription_plans(id),
  subscription_status TEXT DEFAULT 'trial',
  trial_ends_at TIMESTAMPTZ,
  subscription_ends_at TIMESTAMPTZ,
  
  -- Settings
  settings JSONB DEFAULT '{}',
  branding JSONB DEFAULT '{}',
  
  -- Contact
  email TEXT,
  phone TEXT,
  website TEXT,
  
  -- Address
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'NO',
  
  -- Metadata
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_step INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their organization"
  ON public.organizations FOR SELECT
  USING (
    id IN (
      SELECT org_id FROM public.org_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Org admins can update their organization"
  ON public.organizations FOR UPDATE
  USING (
    id IN (
      SELECT org_id FROM public.org_users 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON public.organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_subscription ON public.organizations(subscription_plan_id);



-- ============================================================================
-- 2. OPPRETT SUBSCRIPTIONS TABELL
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.subscription_plans(id),
  
  -- Status
  status TEXT NOT NULL DEFAULT 'active',
  
  -- Dates
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  
  -- Payment
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  
  -- Addons
  active_addons UUID[] DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their org subscriptions"
  ON public.subscriptions FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM public.org_users 
      WHERE user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_subscriptions_org ON public.subscriptions(org_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe ON public.subscriptions(stripe_subscription_id);



-- ============================================================================
-- 3. AKTIVER RLS PÅ EKSISTERENDE TABELLER
-- ============================================================================

DO $$ 
BEGIN
  -- Customers
  ALTER TABLE IF EXISTS public.customers ENABLE ROW LEVEL SECURITY;
  DROP POLICY IF EXISTS "customers_org_access" ON public.customers;
  CREATE POLICY "customers_org_access" ON public.customers
    FOR ALL USING (
      org_id IN (SELECT org_id FROM public.org_users WHERE user_id = auth.uid())
    );
  
  -- Bookings
  ALTER TABLE IF EXISTS public.bookings ENABLE ROW LEVEL SECURITY;
  DROP POLICY IF EXISTS "bookings_org_access" ON public.bookings;
  CREATE POLICY "bookings_org_access" ON public.bookings
    FOR ALL USING (
      org_id IN (SELECT org_id FROM public.org_users WHERE user_id = auth.uid())
    );
  
  -- Services
  ALTER TABLE IF EXISTS public.services ENABLE ROW LEVEL SECURITY;
  DROP POLICY IF EXISTS "services_org_access" ON public.services;
  CREATE POLICY "services_org_access" ON public.services
    FOR ALL USING (
      org_id IN (SELECT org_id FROM public.org_users WHERE user_id = auth.uid())
    );
  
  -- Employees
  ALTER TABLE IF EXISTS public.employees ENABLE ROW LEVEL SECURITY;
  DROP POLICY IF EXISTS "employees_org_access" ON public.employees;
  CREATE POLICY "employees_org_access" ON public.employees
    FOR ALL USING (
      org_id IN (SELECT org_id FROM public.org_users WHERE user_id = auth.uid())
    );
  
  -- Payments
  ALTER TABLE IF EXISTS public.payments ENABLE ROW LEVEL SECURITY;
  DROP POLICY IF EXISTS "payments_org_access" ON public.payments;
  CREATE POLICY "payments_org_access" ON public.payments
    FOR ALL USING (
      org_id IN (SELECT org_id FROM public.org_users WHERE user_id = auth.uid())
    );
  
  -- Invoices
  ALTER TABLE IF EXISTS public.invoices ENABLE ROW LEVEL SECURITY;
  DROP POLICY IF EXISTS "invoices_org_access" ON public.invoices;
  CREATE POLICY "invoices_org_access" ON public.invoices
    FOR ALL USING (
      org_id IN (SELECT org_id FROM public.org_users WHERE user_id = auth.uid())
    );
  
  RAISE NOTICE 'RLS enabled on existing tables';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Some tables may not exist yet: %', SQLERRM;
END $$;

