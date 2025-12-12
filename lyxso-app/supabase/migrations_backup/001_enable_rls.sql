-- ============================================================
-- MIGRASJON 001: AKTIVER ROW LEVEL SECURITY (RLS)
-- ============================================================
-- Dato: 29. november 2024
-- Formål: Implementer sikkerhet på database-nivå for multi-tenant
-- Status: KRITISK - må kjøres før produksjon
--
-- VIKTIG: Kjør dette scriptet i Supabase SQL Editor
-- ============================================================

-- ============================================================
-- 1. AKTIVER RLS PÅ ALLE TABELLER
-- ============================================================

-- Organisasjoner og brukere
ALTER TABLE public.orgs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Kunder og kjøretøy
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Booking
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_resources ENABLE ROW LEVEL SECURITY;

-- Dekkhotell
ALTER TABLE public.tyre_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tyre_storage_locations ENABLE ROW LEVEL SECURITY;

-- Coating
ALTER TABLE public.coating_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coating_layers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coating_inspections ENABLE ROW LEVEL SECURITY;

-- Markedsføring
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_sources ENABLE ROW LEVEL SECURITY;

-- Tjenester og produkter
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Ansatte og ressurser
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Betaling og fakturering
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Notater og kommunikasjon
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Rapporter og analytics
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Innstillinger
ALTER TABLE public.org_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tyre_settings ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 2. HJELPEFUNKSJON: HENT BRUKERENS ORG
-- ============================================================

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

-- ============================================================
-- 3. POLICIES FOR ORGS (Organisasjoner)
-- ============================================================

CREATE POLICY "Users can view their own org"
ON public.orgs
FOR SELECT
USING (
  id = public.get_user_org_id()
);

CREATE POLICY "Org admins can update org"
ON public.orgs
FOR UPDATE
USING (
  id = public.get_user_org_id() AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() 
    AND org_id = orgs.id
    AND role IN ('owner', 'admin')
  )
);

-- ============================================================
-- 4. POLICIES FOR PROFILES (Brukerprofiler)
-- ============================================================

CREATE POLICY "Users can view profiles in their org"
ON public.profiles
FOR SELECT
USING (
  org_id = public.get_user_org_id()
);

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (
  id = auth.uid()
);

-- ============================================================
-- 5. POLICIES FOR CUSTOMERS (Kunder)
-- ============================================================

CREATE POLICY "Users can view customers in their org"
ON public.customers
FOR SELECT
USING (
  org_id = public.get_user_org_id()
);

CREATE POLICY "Users can insert customers in their org"
ON public.customers
FOR INSERT
WITH CHECK (
  org_id = public.get_user_org_id()
);

CREATE POLICY "Users can update customers in their org"
ON public.customers
FOR UPDATE
USING (
  org_id = public.get_user_org_id()
);

CREATE POLICY "Users can delete customers in their org"
ON public.customers
FOR DELETE
USING (
  org_id = public.get_user_org_id()
);

-- ============================================================
-- 6. POLICIES FOR VEHICLES (Kjøretøy)
-- ============================================================

CREATE POLICY "Users can view vehicles in their org"
ON public.vehicles
FOR SELECT
USING (
  org_id = public.get_user_org_id()
);

CREATE POLICY "Users can insert vehicles in their org"
ON public.vehicles
FOR INSERT
WITH CHECK (
  org_id = public.get_user_org_id()
);

CREATE POLICY "Users can update vehicles in their org"
ON public.vehicles
FOR UPDATE
USING (
  org_id = public.get_user_org_id()
);

CREATE POLICY "Users can delete vehicles in their org"
ON public.vehicles
FOR DELETE
USING (
  org_id = public.get_user_org_id()
);

-- ============================================================
-- 7. POLICIES FOR BOOKINGS (Bookinger)
-- ============================================================

CREATE POLICY "Users can view bookings in their org"
ON public.bookings
FOR SELECT
USING (
  org_id = public.get_user_org_id()
);

CREATE POLICY "Users can insert bookings in their org"
ON public.bookings
FOR INSERT
WITH CHECK (
  org_id = public.get_user_org_id()
);

CREATE POLICY "Users can update bookings in their org"
ON public.bookings
FOR UPDATE
USING (
  org_id = public.get_user_org_id()
);

CREATE POLICY "Users can delete bookings in their org"
ON public.bookings
FOR DELETE
USING (
  org_id = public.get_user_org_id()
);

-- ============================================================
-- 8. POLICIES FOR TYRE_SETS (Dekksett)
-- ============================================================

CREATE POLICY "Users can view tyre sets in their org"
ON public.tyre_sets
FOR SELECT
USING (
  org_id = public.get_user_org_id()
);

CREATE POLICY "Users can insert tyre sets in their org"
ON public.tyre_sets
FOR INSERT
WITH CHECK (
  org_id = public.get_user_org_id()
);

CREATE POLICY "Users can update tyre sets in their org"
ON public.tyre_sets
FOR UPDATE
USING (
  org_id = public.get_user_org_id()
);

CREATE POLICY "Users can delete tyre sets in their org"
ON public.tyre_sets
FOR DELETE
USING (
  org_id = public.get_user_org_id()
);

-- ============================================================
-- 9. POLICIES FOR COATING_JOBS (Coating-jobber)
-- ============================================================

CREATE POLICY "Users can view coating jobs in their org"
ON public.coating_jobs
FOR SELECT
USING (
  org_id = public.get_user_org_id()
);

CREATE POLICY "Users can insert coating jobs in their org"
ON public.coating_jobs
FOR INSERT
WITH CHECK (
  org_id = public.get_user_org_id()
);

CREATE POLICY "Users can update coating jobs in their org"
ON public.coating_jobs
FOR UPDATE
USING (
  org_id = public.get_user_org_id()
);

CREATE POLICY "Users can delete coating jobs in their org"
ON public.coating_jobs
FOR DELETE
USING (
  org_id = public.get_user_org_id()
);

-- ============================================================
-- 10. POLICIES FOR CAMPAIGNS (Kampanjer)
-- ============================================================

CREATE POLICY "Users can view campaigns in their org"
ON public.campaigns
FOR SELECT
USING (
  org_id = public.get_user_org_id()
);

CREATE POLICY "Users can insert campaigns in their org"
ON public.campaigns
FOR INSERT
WITH CHECK (
  org_id = public.get_user_org_id()
);

CREATE POLICY "Users can update campaigns in their org"
ON public.campaigns
FOR UPDATE
USING (
  org_id = public.get_user_org_id()
);

CREATE POLICY "Users can delete campaigns in their org"
ON public.campaigns
FOR DELETE
USING (
  org_id = public.get_user_org_id()
);

-- ============================================================
-- 11. POLICIES FOR LEADS (Leads)
-- ============================================================

CREATE POLICY "Users can view leads in their org"
ON public.leads
FOR SELECT
USING (
  org_id = public.get_user_org_id()
);

CREATE POLICY "Users can insert leads in their org"
ON public.leads
FOR INSERT
WITH CHECK (
  org_id = public.get_user_org_id()
);

CREATE POLICY "Users can update leads in their org"
ON public.leads
FOR UPDATE
USING (
  org_id = public.get_user_org_id()
);

CREATE POLICY "Users can delete leads in their org"
ON public.leads
FOR DELETE
USING (
  org_id = public.get_user_org_id()
);

-- ============================================================
-- 12. POLICIES FOR SERVICES (Tjenester)
-- ============================================================

CREATE POLICY "Users can view services in their org"
ON public.services
FOR SELECT
USING (
  org_id = public.get_user_org_id()
);

CREATE POLICY "Users can insert services in their org"
ON public.services
FOR INSERT
WITH CHECK (
  org_id = public.get_user_org_id()
);

CREATE POLICY "Users can update services in their org"
ON public.services
FOR UPDATE
USING (
  org_id = public.get_user_org_id()
);

CREATE POLICY "Users can delete services in their org"
ON public.services
FOR DELETE
USING (
  org_id = public.get_user_org_id()
);

-- ============================================================
-- 13. POLICIES FOR EMPLOYEES (Ansatte)
-- ============================================================

CREATE POLICY "Users can view employees in their org"
ON public.employees
FOR SELECT
USING (
  org_id = public.get_user_org_id()
);

CREATE POLICY "Users can insert employees in their org"
ON public.employees
FOR INSERT
WITH CHECK (
  org_id = public.get_user_org_id()
);

CREATE POLICY "Users can update employees in their org"
ON public.employees
FOR UPDATE
USING (
  org_id = public.get_user_org_id()
);

CREATE POLICY "Users can delete employees in their org"
ON public.employees
FOR DELETE
USING (
  org_id = public.get_user_org_id()
);

-- ============================================================
-- 14. POLICIES FOR INVOICES (Fakturaer)
-- ============================================================

CREATE POLICY "Users can view invoices in their org"
ON public.invoices
FOR SELECT
USING (
  org_id = public.get_user_org_id()
);

CREATE POLICY "Users can insert invoices in their org"
ON public.invoices
FOR INSERT
WITH CHECK (
  org_id = public.get_user_org_id()
);

CREATE POLICY "Users can update invoices in their org"
ON public.invoices
FOR UPDATE
USING (
  org_id = public.get_user_org_id()
);

-- ============================================================
-- 15. POLICIES FOR NOTES (Notater)
-- ============================================================

CREATE POLICY "Users can view notes in their org"
ON public.notes
FOR SELECT
USING (
  org_id = public.get_user_org_id()
);

CREATE POLICY "Users can insert notes in their org"
ON public.notes
FOR INSERT
WITH CHECK (
  org_id = public.get_user_org_id()
);

CREATE POLICY "Users can update notes in their org"
ON public.notes
FOR UPDATE
USING (
  org_id = public.get_user_org_id()
);

CREATE POLICY "Users can delete notes in their org"
ON public.notes
FOR DELETE
USING (
  org_id = public.get_user_org_id()
);

-- ============================================================
-- 16. POLICIES FOR ORG_SETTINGS (Org-innstillinger)
-- ============================================================

CREATE POLICY "Users can view their org settings"
ON public.org_settings
FOR SELECT
USING (
  org_id = public.get_user_org_id()
);

CREATE POLICY "Admins can update org settings"
ON public.org_settings
FOR UPDATE
USING (
  org_id = public.get_user_org_id() AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() 
    AND org_id = org_settings.org_id
    AND role IN ('owner', 'admin')
  )
);

-- ============================================================
-- 17. POLICIES FOR NOTIFICATIONS (Varsler)
-- ============================================================

CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT
USING (
  user_id = auth.uid()
);

CREATE POLICY "Users can update their own notifications"
ON public.notifications
FOR UPDATE
USING (
  user_id = auth.uid()
);

CREATE POLICY "Users can delete their own notifications"
ON public.notifications
FOR DELETE
USING (
  user_id = auth.uid()
);

-- ============================================================
-- 18. POLICIES FOR INVITATIONS (Invitasjoner)
-- ============================================================

CREATE POLICY "Users can view invitations to their org"
ON public.invitations
FOR SELECT
USING (
  org_id = public.get_user_org_id() OR
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

CREATE POLICY "Admins can create invitations"
ON public.invitations
FOR INSERT
WITH CHECK (
  org_id = public.get_user_org_id() AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() 
    AND org_id = invitations.org_id
    AND role IN ('owner', 'admin')
  )
);

-- ============================================================
-- 19. GRANT PERMISSIONS
-- ============================================================

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- ============================================================
-- FERDIG! Se README for testinstruksjoner
-- ============================================================
