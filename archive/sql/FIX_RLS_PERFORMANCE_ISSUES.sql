-- =====================================================
-- FIX RLS PERFORMANCE ISSUES
-- =====================================================
-- This migration fixes two main performance issues:
-- 1. Auth RLS InitPlan - wraps auth functions in subqueries
-- 2. Duplicate indexes - removes redundant indexes
-- 
-- Run this script in your Supabase SQL Editor
-- =====================================================

BEGIN;

-- =====================================================
-- PART 1: FIX AUTH RLS INITPLAN ISSUES
-- =====================================================
-- Replace auth.uid() with (select auth.uid()) in all RLS policies
-- This prevents unnecessary re-evaluation for each row

-- Drop and recreate policies for seo_pages
DROP POLICY IF EXISTS seo_pages_delete_org ON public.seo_pages;
DROP POLICY IF EXISTS seo_pages_select_org ON public.seo_pages;
DROP POLICY IF EXISTS seo_pages_update_org ON public.seo_pages;
DROP POLICY IF EXISTS seo_pages_write_org ON public.seo_pages;

CREATE POLICY seo_pages_delete_org ON public.seo_pages FOR DELETE USING (
  org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid()))
);

CREATE POLICY seo_pages_select_org ON public.seo_pages FOR SELECT USING (
  org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid()))
);

CREATE POLICY seo_pages_update_org ON public.seo_pages FOR UPDATE USING (
  org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid()))
);

CREATE POLICY seo_pages_write_org ON public.seo_pages FOR INSERT WITH CHECK (
  org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid()))
);

-- Drop and recreate policies for partner_landing_pages
DROP POLICY IF EXISTS partner_landing_pages_delete_org ON public.partner_landing_pages;
DROP POLICY IF EXISTS partner_landing_pages_insert_org ON public.partner_landing_pages;
DROP POLICY IF EXISTS partner_landing_pages_select_org ON public.partner_landing_pages;
DROP POLICY IF EXISTS partner_landing_pages_update_org ON public.partner_landing_pages;

CREATE POLICY partner_landing_pages_delete_org ON public.partner_landing_pages FOR DELETE USING (
  org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid()))
);

CREATE POLICY partner_landing_pages_insert_org ON public.partner_landing_pages FOR INSERT WITH CHECK (
  org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid()))
);

CREATE POLICY partner_landing_pages_select_org ON public.partner_landing_pages FOR SELECT USING (
  org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid()))
);

CREATE POLICY partner_landing_pages_update_org ON public.partner_landing_pages FOR UPDATE USING (
  org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid()))
);

-- Drop and recreate policies for seo_page_metrics
DROP POLICY IF EXISTS seo_page_metrics_delete_org ON public.seo_page_metrics;
DROP POLICY IF EXISTS seo_page_metrics_insert_org ON public.seo_page_metrics;
DROP POLICY IF EXISTS seo_page_metrics_select_org ON public.seo_page_metrics;
DROP POLICY IF EXISTS seo_page_metrics_update_org ON public.seo_page_metrics;

CREATE POLICY seo_page_metrics_delete_org ON public.seo_page_metrics FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.seo_pages sp WHERE sp.id = seo_page_metrics.page_id 
    AND sp.org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid())))
);

CREATE POLICY seo_page_metrics_insert_org ON public.seo_page_metrics FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.seo_pages sp WHERE sp.id = seo_page_metrics.page_id 
    AND sp.org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid())))
);

CREATE POLICY seo_page_metrics_select_org ON public.seo_page_metrics FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.seo_pages sp WHERE sp.id = seo_page_metrics.page_id 
    AND sp.org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid())))
);

CREATE POLICY seo_page_metrics_update_org ON public.seo_page_metrics FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.seo_pages sp WHERE sp.id = seo_page_metrics.page_id 
    AND sp.org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid())))
);

-- Fix bookings policies
DROP POLICY IF EXISTS "admin can update bookings in org" ON public.bookings;
DROP POLICY IF EXISTS "org members can read bookings" ON public.bookings;
DROP POLICY IF EXISTS p_bookings_delete ON public.bookings;
DROP POLICY IF EXISTS p_bookings_insert ON public.bookings;
DROP POLICY IF EXISTS p_bookings_update ON public.bookings;

CREATE POLICY "admin can update bookings in org" ON public.bookings FOR UPDATE USING (
  org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid()) AND role IN ('admin', 'owner'))
);

CREATE POLICY "org members can read bookings" ON public.bookings FOR SELECT USING (
  org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid()))
);

CREATE POLICY p_bookings_delete ON public.bookings FOR DELETE USING (
  org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid()))
);

CREATE POLICY p_bookings_insert ON public.bookings FOR INSERT WITH CHECK (
  org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid()))
);

CREATE POLICY p_bookings_update ON public.bookings FOR UPDATE USING (
  org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid()))
);

-- Fix leads policies
DROP POLICY IF EXISTS "org members can read leads" ON public.leads;
DROP POLICY IF EXISTS p_leads_delete ON public.leads;
DROP POLICY IF EXISTS p_leads_insert ON public.leads;
DROP POLICY IF EXISTS p_leads_update ON public.leads;

CREATE POLICY "org members can read leads" ON public.leads FOR SELECT USING (
  org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid()))
);

CREATE POLICY p_leads_delete ON public.leads FOR DELETE USING (
  org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid()))
);

CREATE POLICY p_leads_insert ON public.leads FOR INSERT WITH CHECK (
  org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid()))
);

CREATE POLICY p_leads_update ON public.leads FOR UPDATE USING (
  org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid()))
);

-- Fix campaigns policies
DROP POLICY IF EXISTS "admins manage campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "org members read campaigns" ON public.campaigns;

CREATE POLICY "admins manage campaigns" ON public.campaigns 
  USING (org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid()) AND role IN ('admin', 'owner')));

CREATE POLICY "org members read campaigns" ON public.campaigns FOR SELECT 
  USING (org_id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid())));

-- Fix other commonly affected policies
DROP POLICY IF EXISTS calendar_event_links_self ON public.calendar_event_links;
CREATE POLICY calendar_event_links_self ON public.calendar_event_links 
  USING (partner_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS partner_calendars_self ON public.partner_calendars;
CREATE POLICY partner_calendars_self ON public.partner_calendars 
  USING (partner_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS partner_google_self ON public.partner_google;
CREATE POLICY partner_google_self ON public.partner_google 
  USING (partner_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS partners_self ON public.partners;
CREATE POLICY partners_self ON public.partners 
  USING (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS oauth_tokens_self ON public.oauth_tokens;
CREATE POLICY oauth_tokens_self ON public.oauth_tokens 
  USING (user_id = (SELECT auth.uid()));

-- Fix orgs policies
DROP POLICY IF EXISTS orgs_select_by_members ON public.orgs;
DROP POLICY IF EXISTS orgs_update_by_members ON public.orgs;

CREATE POLICY orgs_select_by_members ON public.orgs FOR SELECT 
  USING (id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid())));

CREATE POLICY orgs_update_by_members ON public.orgs FOR UPDATE 
  USING (id IN (SELECT org_id FROM public.org_members WHERE user_id = (SELECT auth.uid()) AND role IN ('admin', 'owner')));

-- Fix profiles policies
DROP POLICY IF EXISTS profiles_ins ON public.profiles;
DROP POLICY IF EXISTS profiles_select ON public.profiles;
DROP POLICY IF EXISTS profiles_upd ON public.profiles;

CREATE POLICY profiles_ins ON public.profiles FOR INSERT WITH CHECK (id = (SELECT auth.uid()));
CREATE POLICY profiles_select ON public.profiles FOR SELECT USING (id = (SELECT auth.uid()));
CREATE POLICY profiles_upd ON public.profiles FOR UPDATE USING (id = (SELECT auth.uid()));

-- =====================================================
-- PART 2: DROP DUPLICATE INDEXES
-- =====================================================

-- ai_marketing_jobs duplicates
DROP INDEX IF EXISTS public.idx_ai_marketing_jobs_org_id;

-- bookings duplicates
DROP INDEX IF EXISTS public.idx_bookings_lead;
DROP INDEX IF EXISTS public.idx_bookings_org;

-- campaigns duplicates
DROP INDEX IF EXISTS public.idx_campaigns_org;

-- coating_followups duplicates
DROP INDEX IF EXISTS public.idx_coating_followups_coating_job_id;
DROP INDEX IF EXISTS public.idx_coating_followups_org;

-- coating_jobs duplicates
DROP INDEX IF EXISTS public.idx_coating_jobs_booking;
DROP INDEX IF EXISTS public.idx_coating_jobs_customer;
DROP INDEX IF EXISTS public.coating_jobs_customer_id_idx;
DROP INDEX IF EXISTS public.idx_coating_jobs_job_date2;
DROP INDEX IF EXISTS public.idx_coating_jobs_org;
DROP INDEX IF EXISTS public.coating_jobs_org_id_idx;
DROP INDEX IF EXISTS public.idx_coating_jobs_status2;

-- customer_notes duplicates
DROP INDEX IF EXISTS public.idx_customer_notes_customer;
DROP INDEX IF EXISTS public.idx_customer_notes_org;

-- customers duplicates
DROP INDEX IF EXISTS public.idx_customers_org;

-- events duplicates
DROP INDEX IF EXISTS public.idx_events_org_created;

-- inspection_photos duplicates
DROP INDEX IF EXISTS public.idx_inspection_photos_followup;

-- leads duplicates
DROP INDEX IF EXISTS public.idx_leads_created_at_desc;
DROP INDEX IF EXISTS public.idx_leads_created_org;
DROP INDEX IF EXISTS public.idx_leads_org_created;

-- org_marketing_campaigns duplicates
DROP INDEX IF EXISTS public.idx_org_marketing_campaigns_org;

-- org_marketing_posts duplicates
DROP INDEX IF EXISTS public.idx_org_marketing_posts_org_id;

-- payments duplicates
DROP INDEX IF EXISTS public.payments_booking_idx;
DROP INDEX IF EXISTS public.payments_org_idx;
DROP INDEX IF EXISTS public.payments_paid_at_idx;

-- service_products duplicates
DROP INDEX IF EXISTS public.idx_service_products_org;
DROP INDEX IF EXISTS public.idx_service_products_product;
DROP INDEX IF EXISTS public.idx_service_products_service;

-- tire_storage duplicates
DROP INDEX IF EXISTS public.idx_tire_storage_customer;
DROP INDEX IF EXISTS public.idx_tire_storage_org;

COMMIT;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify the fixes:

-- Check for remaining duplicate indexes:
-- SELECT 
--   schemaname,
--   tablename,
--   array_agg(indexname) as duplicate_indexes
-- FROM pg_indexes
-- WHERE schemaname = 'public'
-- GROUP BY schemaname, tablename, indexdef
-- HAVING count(*) > 1;

-- Check RLS policies for auth.uid() without select wrapper:
-- SELECT 
--   schemaname,
--   tablename,
--   policyname,
--   pg_get_expr(polqual, polrelid) as policy_definition
-- FROM pg_policy
-- JOIN pg_class ON pg_policy.polrelid = pg_class.oid
-- JOIN pg_namespace ON pg_class.relnamespace = pg_namespace.oid
-- WHERE schemaname = 'public'
--   AND pg_get_expr(polqual, polrelid) LIKE '%auth.uid()%'
--   AND pg_get_expr(polqual, polrelid) NOT LIKE '%(select auth.uid())%';
