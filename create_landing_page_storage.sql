-- Migration: Create storage bucket for partner landing page images
-- Allows partners to upload hero images, about images, gallery images, logos etc.

-- Create storage bucket for landing page assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'landing-pages',
  'landing-pages',
  true,
  10485760, -- 10MB max file size
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for landing-pages bucket

-- Anyone can view public landing page images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='storage' AND tablename='objects' AND policyname='landing_pages_public_select'
  ) THEN
    CREATE POLICY landing_pages_public_select ON storage.objects
      FOR SELECT
      USING (bucket_id = 'landing-pages');
  END IF;
END $$;

-- Authenticated org members can upload to their org folder
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='storage' AND tablename='objects' AND policyname='landing_pages_org_insert'
  ) THEN
    CREATE POLICY landing_pages_org_insert ON storage.objects
      FOR INSERT TO authenticated
      WITH CHECK (
        bucket_id = 'landing-pages' 
        AND (storage.foldername(name))[1] = (auth.jwt() ->> 'org_id')
      );
  END IF;
END $$;

-- Authenticated org members can update their org images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='storage' AND tablename='objects' AND policyname='landing_pages_org_update'
  ) THEN
    CREATE POLICY landing_pages_org_update ON storage.objects
      FOR UPDATE TO authenticated
      USING (
        bucket_id = 'landing-pages' 
        AND (storage.foldername(name))[1] = (auth.jwt() ->> 'org_id')
      )
      WITH CHECK (
        bucket_id = 'landing-pages' 
        AND (storage.foldername(name))[1] = (auth.jwt() ->> 'org_id')
      );
  END IF;
END $$;

-- Authenticated org members can delete their org images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='storage' AND tablename='objects' AND policyname='landing_pages_org_delete'
  ) THEN
    CREATE POLICY landing_pages_org_delete ON storage.objects
      FOR DELETE TO authenticated
      USING (
        bucket_id = 'landing-pages' 
        AND (storage.foldername(name))[1] = (auth.jwt() ->> 'org_id')
      );
  END IF;
END $$;

-- Add new columns to partner_landing_pages table for additional sections
ALTER TABLE public.partner_landing_pages 
  ADD COLUMN IF NOT EXISTS logo_url TEXT,
  ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS testimonials JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS faq_items JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS show_gallery BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS show_testimonials BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS show_faq BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS gallery_title TEXT DEFAULT 'Galleri',
  ADD COLUMN IF NOT EXISTS testimonials_title TEXT DEFAULT 'Hva kundene våre sier',
  ADD COLUMN IF NOT EXISTS faq_title TEXT DEFAULT 'Ofte stilte spørsmål';

-- Add constraints for JSON arrays
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'partner_landing_pages_gallery_images_array_chk'
  ) THEN
    ALTER TABLE public.partner_landing_pages 
      ADD CONSTRAINT partner_landing_pages_gallery_images_array_chk 
      CHECK (jsonb_typeof(gallery_images) = 'array');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'partner_landing_pages_testimonials_array_chk'
  ) THEN
    ALTER TABLE public.partner_landing_pages 
      ADD CONSTRAINT partner_landing_pages_testimonials_array_chk 
      CHECK (jsonb_typeof(testimonials) = 'array');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'partner_landing_pages_faq_items_array_chk'
  ) THEN
    ALTER TABLE public.partner_landing_pages 
      ADD CONSTRAINT partner_landing_pages_faq_items_array_chk 
      CHECK (jsonb_typeof(faq_items) = 'array');
  END IF;
END $$;

DO $$
BEGIN
  RAISE NOTICE 'Landing page storage bucket and additional columns created successfully';
  RAISE NOTICE 'Bucket path structure: landing-pages/{org_id}/{filename}';
  RAISE NOTICE 'Added columns: logo_url, gallery_images, testimonials, faq_items, show_* flags';
END $$;
