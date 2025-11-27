-- Migration: Create partner_landing_pages table
-- Allows each org to customize their public landing page at /p/{org_id}

CREATE TABLE IF NOT EXISTS public.partner_landing_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL UNIQUE REFERENCES public.orgs(id) ON DELETE CASCADE,
  
  -- Hero section
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_image_url TEXT,
  hero_cta_text TEXT DEFAULT 'Book time',
  hero_cta_link TEXT,
  
  -- About section
  about_title TEXT DEFAULT 'Om oss',
  about_content TEXT,
  about_image_url TEXT,
  
  -- Services section
  services_title TEXT DEFAULT 'Våre tjenester',
  services_content JSONB DEFAULT '[]'::jsonb, -- Array of {title, description, icon, price}
  
  -- Contact section
  show_contact BOOLEAN DEFAULT true,
  contact_title TEXT DEFAULT 'Kontakt oss',
  contact_phone TEXT,
  contact_email TEXT,
  contact_address TEXT,
  contact_map_url TEXT,
  
  -- Social media
  facebook_url TEXT,
  instagram_url TEXT,
  linkedin_url TEXT,
  
  -- Appearance
  primary_color TEXT DEFAULT '#3B82F6',
  secondary_color TEXT DEFAULT '#10B981',
  font_family TEXT DEFAULT 'Inter',
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  
  -- Settings
  is_published BOOLEAN DEFAULT false,
  show_booking_widget BOOLEAN DEFAULT true,
  custom_css TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Optional: basic JSON shape check (array)
  CONSTRAINT partner_landing_pages_services_content_array_chk CHECK (
    jsonb_typeof(services_content) = 'array'
  )
);

-- Indexes
CREATE INDEX IF NOT EXISTS partner_landing_pages_org_id_idx ON public.partner_landing_pages(org_id);
CREATE INDEX IF NOT EXISTS partner_landing_pages_published_idx ON public.partner_landing_pages(is_published) WHERE is_published = true;

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_partner_landing_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS partner_landing_pages_updated_at ON public.partner_landing_pages;
CREATE TRIGGER partner_landing_pages_updated_at
BEFORE UPDATE ON public.partner_landing_pages
FOR EACH ROW
EXECUTE FUNCTION public.update_partner_landing_pages_updated_at();

-- RLS policies
ALTER TABLE public.partner_landing_pages ENABLE ROW LEVEL SECURITY;

-- Anyone can read published landing pages
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='partner_landing_pages' AND policyname='partner_landing_pages_select_public'
  ) THEN
    CREATE POLICY partner_landing_pages_select_public ON public.partner_landing_pages
      FOR SELECT
      USING (is_published = true);
  END IF;
END $$;

-- Org members can read their own landing page (published or not)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='partner_landing_pages' AND policyname='partner_landing_pages_select_org'
  ) THEN
    CREATE POLICY partner_landing_pages_select_org ON public.partner_landing_pages
      FOR SELECT TO authenticated
      USING (org_id = (auth.jwt() ->> 'org_id')::uuid);
  END IF;
END $$;

-- Org members can insert their own landing page
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='partner_landing_pages' AND policyname='partner_landing_pages_insert_org'
  ) THEN
    CREATE POLICY partner_landing_pages_insert_org ON public.partner_landing_pages
      FOR INSERT TO authenticated
      WITH CHECK (org_id = (auth.jwt() ->> 'org_id')::uuid);
  END IF;
END $$;

-- Org members can update their own landing page
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='partner_landing_pages' AND policyname='partner_landing_pages_update_org'
  ) THEN
    CREATE POLICY partner_landing_pages_update_org ON public.partner_landing_pages
      FOR UPDATE TO authenticated
      USING (org_id = (auth.jwt() ->> 'org_id')::uuid)
      WITH CHECK (org_id = (auth.jwt() ->> 'org_id')::uuid);
  END IF;
END $$;

-- Org members can delete their own landing page
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='partner_landing_pages' AND policyname='partner_landing_pages_delete_org'
  ) THEN
    CREATE POLICY partner_landing_pages_delete_org ON public.partner_landing_pages
      FOR DELETE TO authenticated
      USING (org_id = (auth.jwt() ->> 'org_id')::uuid);
  END IF;
END $$;

-- Seed: Create default landing page for existing orgs, skip if already present
INSERT INTO public.partner_landing_pages (org_id, hero_title, is_published)
SELECT 
  o.id, 
  o.name || ' - Din profesjonelle bilpleie-partner',
  false
FROM public.orgs o
ON CONFLICT (org_id) DO NOTHING;

DO $$
BEGIN
  RAISE NOTICE 'Partner landing pages table created/verified successfully';
END $$;
