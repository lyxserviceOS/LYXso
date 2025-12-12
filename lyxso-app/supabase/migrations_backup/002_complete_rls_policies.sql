-- ============================================================
-- MIGRASJON 002: KOMPLETT RLS IMPLEMENTERING
-- ============================================================
-- Dato: 29. november 2024
-- Formål: Fullstendig RLS-sikring av alle tabeller i LYXso
-- Status: KRITISK - må kjøres før produksjon
--
-- Dette scriptet:
-- 1. Aktiverer RLS på ALLE tabeller som mangler det
-- 2. Legger til manglende policies
-- 3. Sikrer konsistent multi-tenant sikkerhet
-- 4. Håndterer spesialtilfeller (public-endepunkter, service-role)
--
-- VIKTIG: Kjør dette i Supabase SQL Editor
-- ============================================================

-- ============================================================
-- 1. HJELPEFUNKSJONER
-- ============================================================

-- Funksjon for å hente brukerens org_id (rask og sikker)
CREATE OR REPLACE FUNCTION public.get_user_org_id()
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT org_id 
  FROM public.profiles 
  WHERE id = auth.uid()
  LIMIT 1;
$$;

-- Funksjon for å sjekke om bruker er admin i sin org
CREATE OR REPLACE FUNCTION public.is_org_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() 
    AND org_id = public.get_user_org_id()
    AND role IN ('owner', 'admin')
  );
$$;

-- Funksjon for å sjekke om bruker er owner i sin org
CREATE OR REPLACE FUNCTION public.is_org_owner()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() 
    AND org_id = public.get_user_org_id()
    AND role = 'owner'
  );
$$;

-- ============================================================
-- 2. AKTIVER RLS PÅ ALLE TABELLER (hvis ikke allerede aktivert)
-- ============================================================

-- Organisasjoner og brukere
ALTER TABLE IF EXISTS public.orgs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.org_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.org_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.org_modules ENABLE ROW LEVEL SECURITY;

-- Kunder og kjøretøy
ALTER TABLE IF EXISTS public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.vehicles ENABLE ROW LEVEL SECURITY;

-- Booking-system
ALTER TABLE IF EXISTS public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.booking_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.booking_settings ENABLE ROW LEVEL SECURITY;

-- Dekkhotell
ALTER TABLE IF EXISTS public.tyre_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tire_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tyre_storage_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tire_storage ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tyre_settings ENABLE ROW LEVEL SECURITY;

-- Coating
ALTER TABLE IF EXISTS public.coating_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.coating_layers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.coating_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.coating_followups ENABLE ROW LEVEL SECURITY;

-- Markedsføring
ALTER TABLE IF EXISTS public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.lead_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.lead_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.partner_landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.landing_page_assets ENABLE ROW LEVEL SECURITY;

-- Tjenester og produkter
ALTER TABLE IF EXISTS public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.service_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.product_categories ENABLE ROW LEVEL SECURITY;

-- Ansatte og ressurser
ALTER TABLE IF EXISTS public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.resources ENABLE ROW LEVEL SECURITY;

-- Betaling og fakturering
ALTER TABLE IF EXISTS public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.payment_methods ENABLE ROW LEVEL SECURITY;

-- Regnskap
ALTER TABLE IF EXISTS public.accounting_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.accounting_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.accounting_settings ENABLE ROW LEVEL SECURITY;

-- Notater og kommunikasjon
ALTER TABLE IF EXISTS public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.messages ENABLE ROW LEVEL SECURITY;

-- Rapporter og analytics
ALTER TABLE IF EXISTS public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.analytics_events ENABLE ROW LEVEL SECURITY;

-- AI-moduler
ALTER TABLE IF EXISTS public.ai_agent_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ai_onboarding_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ai_booking_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ai_capacity_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ai_marketing_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ai_content_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ai_crm_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ai_accounting_suggestions ENABLE ROW LEVEL SECURITY;

-- Partner-system
ALTER TABLE IF EXISTS public.partner_signups ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 3. DROP EKSISTERENDE POLICIES (for å unngå konflikter)
-- ============================================================
-- Denne seksjonen dropper kun policies som vi kommer til å gjenopprette med bedre implementasjon

DROP POLICY IF EXISTS "Users can view their own org" ON public.orgs;
DROP POLICY IF EXISTS "Org admins can update org" ON public.orgs;
DROP POLICY IF EXISTS "Users can view profiles in their org" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- ============================================================
-- 4. ORG_MEMBERS & PROFILES (Grunnleggende tilgangskontroll)
-- ============================================================

-- org_members: Medlemskap i organisasjoner
CREATE POLICY "org_members_select_own_org" ON public.org_members
  FOR SELECT
  TO authenticated
  USING (org_id = public.get_user_org_id());

CREATE POLICY "org_members_insert_own_org_admin" ON public.org_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    org_id = public.get_user_org_id() AND
    public.is_org_admin()
  );

CREATE POLICY "org_members_update_own_org_admin" ON public.org_members
  FOR UPDATE
  TO authenticated
  USING (
    org_id = public.get_user_org_id() AND
    public.is_org_admin()
  );

CREATE POLICY "org_members_delete_own_org_admin" ON public.org_members
  FOR DELETE
  TO authenticated
  USING (
    org_id = public.get_user_org_id() AND
    public.is_org_admin() AND
    user_id != auth.uid() -- Kan ikke slette seg selv
  );

-- profiles: Brukerprofiler
CREATE POLICY "profiles_select_own_org" ON public.profiles
  FOR SELECT
  TO authenticated
  USING (org_id = public.get_user_org_id());

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- ============================================================
-- 5. ORGS (Organisasjoner)
-- ============================================================

CREATE POLICY "orgs_select_own" ON public.orgs
  FOR SELECT
  TO authenticated
  USING (id = public.get_user_org_id());

CREATE POLICY "orgs_update_admin" ON public.orgs
  FOR UPDATE
  TO authenticated
  USING (
    id = public.get_user_org_id() AND
    public.is_org_admin()
  );

-- ============================================================
-- 6. CUSTOMERS (Kunder)
-- ============================================================

CREATE POLICY "customers_select_org" ON public.customers
  FOR SELECT
  TO authenticated
  USING (org_id = public.get_user_org_id());

CREATE POLICY "customers_insert_org" ON public.customers
  FOR INSERT
  TO authenticated
  WITH CHECK (org_id = public.get_user_org_id());

CREATE POLICY "customers_update_org" ON public.customers
  FOR UPDATE
  TO authenticated
  USING (org_id = public.get_user_org_id());

CREATE POLICY "customers_delete_org_admin" ON public.customers
  FOR DELETE
  TO authenticated
  USING (
    org_id = public.get_user_org_id() AND
    public.is_org_admin()
  );

-- ============================================================
-- 7. VEHICLES (Kjøretøy)
-- ============================================================

CREATE POLICY "vehicles_select_org" ON public.vehicles
  FOR SELECT
  TO authenticated
  USING (org_id = public.get_user_org_id());

CREATE POLICY "vehicles_insert_org" ON public.vehicles
  FOR INSERT
  TO authenticated
  WITH CHECK (org_id = public.get_user_org_id());

CREATE POLICY "vehicles_update_org" ON public.vehicles
  FOR UPDATE
  TO authenticated
  USING (org_id = public.get_user_org_id());

CREATE POLICY "vehicles_delete_org" ON public.vehicles
  FOR DELETE
  TO authenticated
  USING (org_id = public.get_user_org_id());

-- ============================================================
-- 8. BOOKINGS (Bookinger)
-- ============================================================

CREATE POLICY "bookings_select_org" ON public.bookings
  FOR SELECT
  TO authenticated
  USING (org_id = public.get_user_org_id());

CREATE POLICY "bookings_insert_org" ON public.bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (org_id = public.get_user_org_id());

CREATE POLICY "bookings_update_org" ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (org_id = public.get_user_org_id());

CREATE POLICY "bookings_delete_org" ON public.bookings
  FOR DELETE
  TO authenticated
  USING (org_id = public.get_user_org_id());

-- ============================================================
-- 9. TYRE_SETS / TIRE_SETS (Dekksett)
-- ============================================================

-- Støtter både tyre_sets og tire_sets (avhengig av schema)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'tyre_sets') THEN
    EXECUTE 'CREATE POLICY "tyre_sets_select_org" ON public.tyre_sets FOR SELECT TO authenticated USING (org_id = public.get_user_org_id())';
    EXECUTE 'CREATE POLICY "tyre_sets_insert_org" ON public.tyre_sets FOR INSERT TO authenticated WITH CHECK (org_id = public.get_user_org_id())';
    EXECUTE 'CREATE POLICY "tyre_sets_update_org" ON public.tyre_sets FOR UPDATE TO authenticated USING (org_id = public.get_user_org_id())';
    EXECUTE 'CREATE POLICY "tyre_sets_delete_org" ON public.tyre_sets FOR DELETE TO authenticated USING (org_id = public.get_user_org_id())';
  END IF;

  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'tire_sets') THEN
    EXECUTE 'CREATE POLICY "tire_sets_select_org" ON public.tire_sets FOR SELECT TO authenticated USING (org_id = public.get_user_org_id())';
    EXECUTE 'CREATE POLICY "tire_sets_insert_org" ON public.tire_sets FOR INSERT TO authenticated WITH CHECK (org_id = public.get_user_org_id())';
    EXECUTE 'CREATE POLICY "tire_sets_update_org" ON public.tire_sets FOR UPDATE TO authenticated USING (org_id = public.get_user_org_id())';
    EXECUTE 'CREATE POLICY "tire_sets_delete_org" ON public.tire_sets FOR DELETE TO authenticated USING (org_id = public.get_user_org_id())';
  END IF;
END$$;

-- ============================================================
-- 10. COATING_JOBS (Coating-jobber)
-- ============================================================

CREATE POLICY "coating_jobs_select_org" ON public.coating_jobs
  FOR SELECT
  TO authenticated
  USING (org_id = public.get_user_org_id());

CREATE POLICY "coating_jobs_insert_org" ON public.coating_jobs
  FOR INSERT
  TO authenticated
  WITH CHECK (org_id = public.get_user_org_id());

CREATE POLICY "coating_jobs_update_org" ON public.coating_jobs
  FOR UPDATE
  TO authenticated
  USING (org_id = public.get_user_org_id());

CREATE POLICY "coating_jobs_delete_org" ON public.coating_jobs
  FOR DELETE
  TO authenticated
  USING (org_id = public.get_user_org_id());

-- Coating follow-ups
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'coating_followups') THEN
    EXECUTE 'CREATE POLICY "coating_followups_select_org" ON public.coating_followups FOR SELECT TO authenticated USING (org_id = public.get_user_org_id())';
    EXECUTE 'CREATE POLICY "coating_followups_insert_org" ON public.coating_followups FOR INSERT TO authenticated WITH CHECK (org_id = public.get_user_org_id())';
    EXECUTE 'CREATE POLICY "coating_followups_update_org" ON public.coating_followups FOR UPDATE TO authenticated USING (org_id = public.get_user_org_id())';
    EXECUTE 'CREATE POLICY "coating_followups_delete_org" ON public.coating_followups FOR DELETE TO authenticated USING (org_id = public.get_user_org_id())';
  END IF;
END$$;

-- ============================================================
-- 11. CAMPAIGNS & LEADS (Markedsføring)
-- ============================================================

CREATE POLICY "campaigns_select_org" ON public.campaigns
  FOR SELECT
  TO authenticated
  USING (org_id = public.get_user_org_id());

CREATE POLICY "campaigns_insert_org" ON public.campaigns
  FOR INSERT
  TO authenticated
  WITH CHECK (org_id = public.get_user_org_id());

CREATE POLICY "campaigns_update_org" ON public.campaigns
  FOR UPDATE
  TO authenticated
  USING (org_id = public.get_user_org_id());

CREATE POLICY "campaigns_delete_org_admin" ON public.campaigns
  FOR DELETE
  TO authenticated
  USING (
    org_id = public.get_user_org_id() AND
    public.is_org_admin()
  );

CREATE POLICY "leads_select_org" ON public.leads
  FOR SELECT
  TO authenticated
  USING (org_id = public.get_user_org_id());

CREATE POLICY "leads_insert_org" ON public.leads
  FOR INSERT
  TO authenticated
  WITH CHECK (org_id = public.get_user_org_id());

CREATE POLICY "leads_update_org" ON public.leads
  FOR UPDATE
  TO authenticated
  USING (org_id = public.get_user_org_id());

CREATE POLICY "leads_delete_org" ON public.leads
  FOR DELETE
  TO authenticated
  USING (org_id = public.get_user_org_id());

-- Lead events
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'lead_events') THEN
    EXECUTE 'CREATE POLICY "lead_events_select_org" ON public.lead_events FOR SELECT TO authenticated USING (org_id = public.get_user_org_id())';
    EXECUTE 'CREATE POLICY "lead_events_insert_org" ON public.lead_events FOR INSERT TO authenticated WITH CHECK (org_id = public.get_user_org_id())';
  END IF;
END$$;

-- ============================================================
-- 12. SERVICES & PRODUCTS (Tjenester og produkter)
-- ============================================================

CREATE POLICY "services_select_org" ON public.services
  FOR SELECT
  TO authenticated
  USING (org_id = public.get_user_org_id());

CREATE POLICY "services_insert_org" ON public.services
  FOR INSERT
  TO authenticated
  WITH CHECK (org_id = public.get_user_org_id());

CREATE POLICY "services_update_org" ON public.services
  FOR UPDATE
  TO authenticated
  USING (org_id = public.get_user_org_id());

CREATE POLICY "services_delete_org_admin" ON public.services
  FOR DELETE
  TO authenticated
  USING (
    org_id = public.get_user_org_id() AND
    public.is_org_admin()
  );

CREATE POLICY "products_select_org" ON public.products
  FOR SELECT
  TO authenticated
  USING (org_id = public.get_user_org_id());

CREATE POLICY "products_insert_org" ON public.products
  FOR INSERT
  TO authenticated
  WITH CHECK (org_id = public.get_user_org_id());

CREATE POLICY "products_update_org" ON public.products
  FOR UPDATE
  TO authenticated
  USING (org_id = public.get_user_org_id());

CREATE POLICY "products_delete_org_admin" ON public.products
  FOR DELETE
  TO authenticated
  USING (
    org_id = public.get_user_org_id() AND
    public.is_org_admin()
  );

-- ============================================================
-- 13. EMPLOYEES (Ansatte)
-- ============================================================

CREATE POLICY "employees_select_org" ON public.employees
  FOR SELECT
  TO authenticated
  USING (org_id = public.get_user_org_id());

CREATE POLICY "employees_insert_org_admin" ON public.employees
  FOR INSERT
  TO authenticated
  WITH CHECK (
    org_id = public.get_user_org_id() AND
    public.is_org_admin()
  );

CREATE POLICY "employees_update_org_admin" ON public.employees
  FOR UPDATE
  TO authenticated
  USING (
    org_id = public.get_user_org_id() AND
    public.is_org_admin()
  );

CREATE POLICY "employees_delete_org_admin" ON public.employees
  FOR DELETE
  TO authenticated
  USING (
    org_id = public.get_user_org_id() AND
    public.is_org_admin()
  );

-- ============================================================
-- 14. INVOICES & PAYMENTS (Faktura og betaling)
-- ============================================================

CREATE POLICY "invoices_select_org" ON public.invoices
  FOR SELECT
  TO authenticated
  USING (org_id = public.get_user_org_id());

CREATE POLICY "invoices_insert_org" ON public.invoices
  FOR INSERT
  TO authenticated
  WITH CHECK (org_id = public.get_user_org_id());

CREATE POLICY "invoices_update_org" ON public.invoices
  FOR UPDATE
  TO authenticated
  USING (org_id = public.get_user_org_id());

CREATE POLICY "payments_select_org" ON public.payments
  FOR SELECT
  TO authenticated
  USING (org_id = public.get_user_org_id());

CREATE POLICY "payments_insert_org" ON public.payments
  FOR INSERT
  TO authenticated
  WITH CHECK (org_id = public.get_user_org_id());

-- ============================================================
-- 15. ACCOUNTING (Regnskap)
-- ============================================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'accounting_entries') THEN
    EXECUTE 'CREATE POLICY "accounting_entries_select_org" ON public.accounting_entries FOR SELECT TO authenticated USING (org_id = public.get_user_org_id())';
    EXECUTE 'CREATE POLICY "accounting_entries_insert_org" ON public.accounting_entries FOR INSERT TO authenticated WITH CHECK (org_id = public.get_user_org_id())';
    EXECUTE 'CREATE POLICY "accounting_entries_update_org_admin" ON public.accounting_entries FOR UPDATE TO authenticated USING (org_id = public.get_user_org_id() AND public.is_org_admin())';
  END IF;

  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'accounting_integrations') THEN
    EXECUTE 'CREATE POLICY "accounting_integrations_select_org" ON public.accounting_integrations FOR SELECT TO authenticated USING (org_id = public.get_user_org_id())';
    EXECUTE 'CREATE POLICY "accounting_integrations_update_org_admin" ON public.accounting_integrations FOR UPDATE TO authenticated USING (org_id = public.get_user_org_id() AND public.is_org_admin())';
  END IF;
END$$;

-- ============================================================
-- 16. NOTES & NOTIFICATIONS (Notater og varsler)
-- ============================================================

CREATE POLICY "notes_select_org" ON public.notes
  FOR SELECT
  TO authenticated
  USING (org_id = public.get_user_org_id());

CREATE POLICY "notes_insert_org" ON public.notes
  FOR INSERT
  TO authenticated
  WITH CHECK (org_id = public.get_user_org_id());

CREATE POLICY "notes_update_own" ON public.notes
  FOR UPDATE
  TO authenticated
  USING (
    org_id = public.get_user_org_id() AND
    created_by = auth.uid()
  );

CREATE POLICY "notes_delete_own_or_admin" ON public.notes
  FOR DELETE
  TO authenticated
  USING (
    org_id = public.get_user_org_id() AND
    (created_by = auth.uid() OR public.is_org_admin())
  );

-- Notifications (brukerbasert, ikke org-basert)
CREATE POLICY "notifications_select_own" ON public.notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "notifications_update_own" ON public.notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "notifications_delete_own" ON public.notifications
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- 17. AI MODULES (AI-moduler)
-- ============================================================

-- ai_agent_configs
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ai_agent_configs') THEN
    EXECUTE 'CREATE POLICY "ai_agent_configs_select_org" ON public.ai_agent_configs FOR SELECT TO authenticated USING (org_id = public.get_user_org_id())';
    EXECUTE 'CREATE POLICY "ai_agent_configs_update_org_admin" ON public.ai_agent_configs FOR UPDATE TO authenticated USING (org_id = public.get_user_org_id() AND public.is_org_admin())';
  END IF;
END$$;

-- ai_conversations
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ai_conversations') THEN
    EXECUTE 'CREATE POLICY "ai_conversations_select_org" ON public.ai_conversations FOR SELECT TO authenticated USING (org_id = public.get_user_org_id())';
    EXECUTE 'CREATE POLICY "ai_conversations_insert_org" ON public.ai_conversations FOR INSERT TO authenticated WITH CHECK (org_id = public.get_user_org_id())';
  END IF;
END$$;

-- ai_messages
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ai_messages') THEN
    EXECUTE 'CREATE POLICY "ai_messages_select_org" ON public.ai_messages FOR SELECT TO authenticated USING (org_id = public.get_user_org_id())';
    EXECUTE 'CREATE POLICY "ai_messages_insert_org" ON public.ai_messages FOR INSERT TO authenticated WITH CHECK (org_id = public.get_user_org_id())';
  END IF;
END$$;

-- ai_onboarding_sessions (allerede har policies fra tidligere migrasjon, men vi sikrer)
-- Disse er allerede definert i create_ai_onboarding_sessions.sql

-- ai_capacity_suggestions
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ai_capacity_suggestions') THEN
    EXECUTE 'CREATE POLICY "ai_capacity_suggestions_select_org" ON public.ai_capacity_suggestions FOR SELECT TO authenticated USING (org_id = public.get_user_org_id())';
    EXECUTE 'CREATE POLICY "ai_capacity_suggestions_insert_org" ON public.ai_capacity_suggestions FOR INSERT TO authenticated WITH CHECK (org_id = public.get_user_org_id())';
    EXECUTE 'CREATE POLICY "ai_capacity_suggestions_update_org" ON public.ai_capacity_suggestions FOR UPDATE TO authenticated USING (org_id = public.get_user_org_id())';
  END IF;
END$$;

-- ai_marketing_jobs
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ai_marketing_jobs') THEN
    EXECUTE 'CREATE POLICY "ai_marketing_jobs_select_org" ON public.ai_marketing_jobs FOR SELECT TO authenticated USING (org_id = public.get_user_org_id())';
    EXECUTE 'CREATE POLICY "ai_marketing_jobs_insert_org" ON public.ai_marketing_jobs FOR INSERT TO authenticated WITH CHECK (org_id = public.get_user_org_id())';
  END IF;
END$$;

-- ai_content_jobs
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ai_content_jobs') THEN
    EXECUTE 'CREATE POLICY "ai_content_jobs_select_org" ON public.ai_content_jobs FOR SELECT TO authenticated USING (org_id = public.get_user_org_id())';
    EXECUTE 'CREATE POLICY "ai_content_jobs_insert_org" ON public.ai_content_jobs FOR INSERT TO authenticated WITH CHECK (org_id = public.get_user_org_id())';
  END IF;
END$$;

-- ai_crm_insights
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ai_crm_insights') THEN
    EXECUTE 'CREATE POLICY "ai_crm_insights_select_org" ON public.ai_crm_insights FOR SELECT TO authenticated USING (org_id = public.get_user_org_id())';
    EXECUTE 'CREATE POLICY "ai_crm_insights_insert_org" ON public.ai_crm_insights FOR INSERT TO authenticated WITH CHECK (org_id = public.get_user_org_id())';
  END IF;
END$$;

-- ============================================================
-- 18. PARTNER LANDING PAGES (Partner-landingssider)
-- ============================================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'partner_landing_pages') THEN
    EXECUTE 'CREATE POLICY "partner_landing_pages_select_org" ON public.partner_landing_pages FOR SELECT TO authenticated USING (org_id = public.get_user_org_id())';
    EXECUTE 'CREATE POLICY "partner_landing_pages_insert_org" ON public.partner_landing_pages FOR INSERT TO authenticated WITH CHECK (org_id = public.get_user_org_id())';
    EXECUTE 'CREATE POLICY "partner_landing_pages_update_org" ON public.partner_landing_pages FOR UPDATE TO authenticated USING (org_id = public.get_user_org_id())';
    EXECUTE 'CREATE POLICY "partner_landing_pages_delete_org_admin" ON public.partner_landing_pages FOR DELETE TO authenticated USING (org_id = public.get_user_org_id() AND public.is_org_admin())';
  END IF;

  -- Landing page assets (kan være public for visning, men kun org kan endre)
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'landing_page_assets') THEN
    EXECUTE 'CREATE POLICY "landing_page_assets_select_all" ON public.landing_page_assets FOR SELECT TO authenticated, anon USING (true)';
    EXECUTE 'CREATE POLICY "landing_page_assets_insert_org" ON public.landing_page_assets FOR INSERT TO authenticated WITH CHECK (org_id = public.get_user_org_id())';
    EXECUTE 'CREATE POLICY "landing_page_assets_update_org" ON public.landing_page_assets FOR UPDATE TO authenticated USING (org_id = public.get_user_org_id())';
    EXECUTE 'CREATE POLICY "landing_page_assets_delete_org" ON public.landing_page_assets FOR DELETE TO authenticated USING (org_id = public.get_user_org_id())';
  END IF;
END$$;

-- ============================================================
-- 19. ORG_SETTINGS & ORG_MODULES (Org-innstillinger)
-- ============================================================

CREATE POLICY "org_settings_select_org" ON public.org_settings
  FOR SELECT
  TO authenticated
  USING (org_id = public.get_user_org_id());

CREATE POLICY "org_settings_update_org_admin" ON public.org_settings
  FOR UPDATE
  TO authenticated
  USING (
    org_id = public.get_user_org_id() AND
    public.is_org_admin()
  );

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'org_modules') THEN
    EXECUTE 'CREATE POLICY "org_modules_select_org" ON public.org_modules FOR SELECT TO authenticated USING (org_id = public.get_user_org_id())';
    EXECUTE 'CREATE POLICY "org_modules_update_org_owner" ON public.org_modules FOR UPDATE TO authenticated USING (org_id = public.get_user_org_id() AND public.is_org_owner())';
  END IF;
END$$;

-- ============================================================
-- 20. INVITATIONS (Invitasjoner)
-- ============================================================

CREATE POLICY "invitations_select_org_or_email" ON public.invitations
  FOR SELECT
  TO authenticated
  USING (
    org_id = public.get_user_org_id() OR
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

CREATE POLICY "invitations_insert_org_admin" ON public.invitations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    org_id = public.get_user_org_id() AND
    public.is_org_admin()
  );

CREATE POLICY "invitations_update_org_admin" ON public.invitations
  FOR UPDATE
  TO authenticated
  USING (
    org_id = public.get_user_org_id() AND
    public.is_org_admin()
  );

CREATE POLICY "invitations_delete_org_admin" ON public.invitations
  FOR DELETE
  TO authenticated
  USING (
    org_id = public.get_user_org_id() AND
    public.is_org_admin()
  );

-- ============================================================
-- 21. PARTNER_SIGNUPS (Partner-søknader - SPESIALTILFELLE)
-- ============================================================
-- Disse må være tilgjengelige for service-role og anon (public endpoint)
-- men beskyttet slik at brukere ikke kan se andres søknader

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'partner_signups') THEN
    -- Anon (uinnlogget) kan opprette søknader
    EXECUTE 'CREATE POLICY "partner_signups_insert_anon" ON public.partner_signups FOR INSERT TO anon WITH CHECK (true)';
    
    -- Admins kan se alle søknader
    EXECUTE 'CREATE POLICY "partner_signups_select_admin" ON public.partner_signups FOR SELECT TO authenticated USING (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = ''superadmin''
      )
    )';
  END IF;
END$$;

-- ============================================================
-- 22. GRANT PERMISSIONS
-- ============================================================

GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT INSERT ON public.partner_signups TO anon;
GRANT SELECT ON public.landing_page_assets TO anon;

-- ============================================================
-- 23. VERIFISER RLS-STATUS
-- ============================================================

-- Lag en hjelpefunksjon for å sjekke RLS-status
CREATE OR REPLACE FUNCTION public.verify_rls_status()
RETURNS TABLE(table_name TEXT, rls_enabled BOOLEAN, policy_count BIGINT)
LANGUAGE SQL
AS $$
  SELECT 
    t.tablename::TEXT,
    t.rowsecurity,
    COUNT(p.policyname)
  FROM pg_tables t
  LEFT JOIN pg_policies p ON t.tablename = p.tablename AND t.schemaname = p.schemaname
  WHERE t.schemaname = 'public'
  GROUP BY t.tablename, t.rowsecurity
  ORDER BY t.tablename;
$$;

-- ============================================================
-- FERDIG! Kjør verify_rls_status() for å sjekke status
-- ============================================================
-- Eksempel:
-- SELECT * FROM public.verify_rls_status() WHERE rls_enabled = false OR policy_count = 0;
