-- SQL for å opprette Supabase Storage bucket for dekkbilder
-- Kjør dette i Supabase SQL Editor

-- 1. Opprett bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('tyre-images', 'tyre-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Sett opp RLS policies for bucket
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'tyre-images');

CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'tyre-images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow service role all access"
ON storage.objects FOR ALL
USING (bucket_id = 'tyre-images' AND auth.role() = 'service_role');

-- 3. Sett opp CORS (hvis nødvendig)
-- Dette gjøres vanligvis i Supabase Dashboard under Storage settings
