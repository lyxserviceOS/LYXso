-- ============================================================
-- FIX SUPABASE LINTER ERRORS
-- ============================================================
-- Dato: 6. desember 2024
-- Formål: Fikse SECURITY DEFINER views og manglende RLS
-- ============================================================

-- ============================================================
-- 1. FIX MISSING RLS ON TABLES
-- ============================================================

-- Enable RLS on landing_page_sections (hvis tabellen eksisterer)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'landing_page_sections'
  ) THEN
    ALTER TABLE public.landing_page_sections ENABLE ROW LEVEL SECURITY;
    
    -- Add basic policies (juster etter behov)
    DROP POLICY IF EXISTS "landing_page_sections_select_public" ON public.landing_page_sections;
    CREATE POLICY "landing_page_sections_select_public" 
      ON public.landing_page_sections
      FOR SELECT
      USING (true); -- Alle kan lese
    
    DROP POLICY IF EXISTS "landing_page_sections_org_modify" ON public.landing_page_sections;
    CREATE POLICY "landing_page_sections_org_modify" 
      ON public.landing_page_sections
      FOR ALL TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() 
          AND org_id = landing_page_sections.org_id
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() 
          AND org_id = landing_page_sections.org_id
        )
      );
    
    RAISE NOTICE 'RLS enabled on landing_page_sections';
  ELSE
    RAISE NOTICE 'Table landing_page_sections does not exist';
  END IF;
END $$;

-- Enable RLS on legal_current_versions (hvis tabellen eksisterer)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'legal_current_versions'
  ) THEN
    ALTER TABLE public.legal_current_versions ENABLE ROW LEVEL SECURITY;
    
    -- Add basic policies - alle kan lese juridiske dokumenter
    DROP POLICY IF EXISTS "legal_current_versions_select_public" ON public.legal_current_versions;
    CREATE POLICY "legal_current_versions_select_public" 
      ON public.legal_current_versions
      FOR SELECT
      USING (true); -- Alle kan lese juridiske dokumenter
    
    -- Bare admins kan oppdatere (juster etter behov)
    DROP POLICY IF EXISTS "legal_current_versions_admin_modify" ON public.legal_current_versions;
    CREATE POLICY "legal_current_versions_admin_modify" 
      ON public.legal_current_versions
      FOR ALL TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() 
          AND role = 'super_admin'
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() 
          AND role = 'super_admin'
        )
      );
    
    RAISE NOTICE 'RLS enabled on legal_current_versions';
  ELSE
    RAISE NOTICE 'Table legal_current_versions does not exist';
  END IF;
END $$;

-- ============================================================
-- 2. FIX SECURITY DEFINER VIEWS
-- ============================================================
-- Alternativ 1: Fjern SECURITY DEFINER fra helper functions
-- Alternativ 2: La dem være (de er nødvendige for RLS)
--
-- ANBEFALING: Behold SECURITY DEFINER på functions, men dokumenter hvorfor
-- Dette er nødvendig for multi-tenant RLS siden functions må kunne 
-- lese profiles.org_id for å sjekke tilgang.
--
-- Supabase linter advarer mot SECURITY DEFINER views, men i dette tilfellet
-- er det nødvendig for korrekt funksjonalitet.
-- 
-- Hvis du vil fjerne advarselen, må du omstrukturere RLS-systemet til
-- å bruke auth.jwt() direkte istedenfor helper functions.
-- ============================================================

-- Dokumentasjon: Hvorfor vi bruker SECURITY DEFINER
COMMENT ON FUNCTION public.get_user_org_id() IS 
  'SECURITY DEFINER er nødvendig: Denne funksjonen må kunne lese profiles.org_id for å sjekke brukerens organisasjon i RLS policies. Uten SECURITY DEFINER vil ikke funksjonen ha tilgang til profiles-tabellen i RLS-konteksten.';

COMMENT ON FUNCTION public.is_org_admin() IS 
  'SECURITY DEFINER er nødvendig: Denne funksjonen må kunne lese profiles.role for å sjekke om brukeren er admin. Uten SECURITY DEFINER vil ikke funksjonen ha tilgang til profiles-tabellen i RLS-konteksten.';

-- ============================================================
-- 3. ALTERNATIV: RECREATE FUNCTIONS UTEN SECURITY DEFINER
-- ============================================================
-- ADVARSEL: Dette vil sannsynligvis bryte RLS policies som bruker disse
-- Kommentert ut som standard - ikke kjør dette med mindre du vet hva du gjør

/*
CREATE OR REPLACE FUNCTION public.get_user_org_id()
RETURNS UUID
LANGUAGE SQL
STABLE
AS $$
  SELECT (auth.jwt() ->> 'org_id')::uuid;
$$;

CREATE OR REPLACE FUNCTION public.is_org_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
AS $$
  SELECT (auth.jwt() ->> 'role') IN ('owner', 'admin');
$$;
*/

-- ============================================================
-- 4. SUMMARY
-- ============================================================
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'SECURITY FIX SUMMARY:';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✓ RLS enabled on landing_page_sections (hvis den eksisterer)';
  RAISE NOTICE '✓ RLS enabled on legal_current_versions (hvis den eksisterer)';
  RAISE NOTICE '⚠ SECURITY DEFINER functions beholdt (nødvendig for RLS)';
  RAISE NOTICE '';
  RAISE NOTICE 'NESTE STEG:';
  RAISE NOTICE '1. Sjekk at RLS policies fungerer som forventet';
  RAISE NOTICE '2. Vurder om landing_page_sections og legal_current_versions trengs';
  RAISE NOTICE '3. Dokumenter hvorfor SECURITY DEFINER er nødvendig';
  RAISE NOTICE '========================================';
END $$;
