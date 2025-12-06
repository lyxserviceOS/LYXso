-- =====================================================
-- OPPGAVE A3: Database-oppdateringer for Onboarding
-- OPPGAVE C4: Database-oppdateringer for AI-analyse
-- =====================================================

-- =====================================================
-- A3: ONBOARDING-FORBEDRINGER
-- =====================================================

-- Legg til nye kolonner i organizations
ALTER TABLE organizations 
  ADD COLUMN IF NOT EXISTS industry VARCHAR(100),
  ADD COLUMN IF NOT EXISTS location_type VARCHAR(50),
  ADD COLUMN IF NOT EXISTS capacity_type VARCHAR(50),
  ADD COLUMN IF NOT EXISTS pricing_tier VARCHAR(50),
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS weekly_hours JSONB;

COMMENT ON COLUMN organizations.industry IS 'Bransje: bilverksted, dekkhotell, coating, etc';
COMMENT ON COLUMN organizations.location_type IS 'Lokasjonstype: sentrum, industriområde, landlig';
COMMENT ON COLUMN organizations.capacity_type IS 'Kapasitet: liten, middels, stor';
COMMENT ON COLUMN organizations.pricing_tier IS 'Prisnivå: budsjett, standard, premium';
COMMENT ON COLUMN organizations.weekly_hours IS 'Åpningstider per ukedag: {"monday": {"open":"08:00","close":"17:00","closed":false}, ...}';

-- Legg til nye kolonner i org_modules for aktivering
ALTER TABLE org_modules
  ADD COLUMN IF NOT EXISTS activated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS activated_by UUID REFERENCES users(id);

-- Opprett service_templates tabell
CREATE TABLE IF NOT EXISTS service_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  industry VARCHAR(100),
  default_duration INTEGER DEFAULT 60, -- minutter
  default_price DECIMAL(10,2),
  icon VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE service_templates IS 'Forhåndsdefinerte tjeneste-maler for ulike bransjer';

-- Seed service_templates
INSERT INTO service_templates (name, description, industry, default_duration, default_price, icon) VALUES
  -- Bilverksted
  ('EU-kontroll', 'Periodisk kjøretøykontroll', 'bilverksted', 45, 450, 'clipboard-check'),
  ('Oljeskift', 'Bytte av motorolje og filter', 'bilverksted', 30, 500, 'oil-can'),
  ('Bremseskift', 'Skifte bremseklosser og -skiver', 'bilverksted', 120, 2500, 'brake'),
  ('AC-service', 'Service av klimaanlegg', 'bilverksted', 60, 800, 'snowflake'),
  ('Hjulskift', 'Bytte til sommer/vinterdekk', 'bilverksted', 30, 400, 'tire'),
  
  -- Dekkhotell
  ('Dekkskift vår', 'Montering av sommerdekk', 'dekkhotell', 30, 350, 'sun'),
  ('Dekkskift høst', 'Montering av vinterdekk', 'dekkhotell', 30, 350, 'snowflake'),
  ('Dekklagring sesong', 'Lagring av dekk i 6 måneder', 'dekkhotell', 10, 400, 'warehouse'),
  ('Hjulbalansering', 'Balansering av alle 4 hjul', 'dekkhotell', 45, 500, 'balance-scale'),
  
  -- Coating/Bilpleie
  ('Keramisk coating', 'Premium beskyttelse av lakk', 'coating', 480, 8000, 'shield'),
  ('Polering', 'Maskinpolering av lakk', 'coating', 240, 3500, 'sparkles'),
  ('Interiørvask', 'Grundig rengjøring innvendig', 'coating', 120, 1200, 'car-side'),
  ('Eksteriorvask', 'Håndvask og voks', 'coating', 60, 600, 'droplet')
ON CONFLICT DO NOTHING;

-- =====================================================
-- C4: AI-ANALYSE FORBEDRINGER
-- =====================================================

-- Legg til kolonner i tyre_ai_analysis_jobs for opprinnelse
ALTER TABLE tyre_ai_analysis_jobs 
  ADD COLUMN IF NOT EXISTS uploaded_by UUID REFERENCES users(id),
  ADD COLUMN IF NOT EXISTS upload_source VARCHAR(50) DEFAULT 'manual';

COMMENT ON COLUMN tyre_ai_analysis_jobs.uploaded_by IS 'Bruker som lastet opp bildene';
COMMENT ON COLUMN tyre_ai_analysis_jobs.upload_source IS 'Kilde: manual, customer_portal, onboarding';

-- Opprett tyre_ai_results tabell for strukturerte AI-resultater
CREATE TABLE IF NOT EXISTS tyre_ai_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_job_id UUID REFERENCES tyre_ai_analysis_jobs(id) ON DELETE CASCADE,
  tyre_set_id UUID REFERENCES tyre_sets(id) ON DELETE CASCADE,
  
  -- Detekterte verdier
  detected_type VARCHAR(50),
  detected_dimension VARCHAR(50),
  detected_dot VARCHAR(10),
  production_year INTEGER,
  
  -- Tilstandsvurdering
  condition_score INTEGER CHECK (condition_score >= 0 AND condition_score <= 100),
  condition_assessment VARCHAR(50),
  
  -- Mønsterdybde per hjul
  tread_depth_front_left DECIMAL(4,2),
  tread_depth_front_right DECIMAL(4,2),
  tread_depth_rear_left DECIMAL(4,2),
  tread_depth_rear_right DECIMAL(4,2),
  
  -- Skader og anbefalinger
  detected_damage TEXT[],
  recommendations TEXT[],
  
  -- AI-metadata
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  raw_ai_response JSONB,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE tyre_ai_results IS 'Strukturerte resultater fra AI-analyse av dekk';
COMMENT ON COLUMN tyre_ai_results.condition_assessment IS 'ok, bør_byttes, må_byttes';
COMMENT ON COLUMN tyre_ai_results.detected_damage IS 'Array av skader: bulker, kutt, ujevn_slitasje, etc';

-- Indekser for rask søkning
CREATE INDEX IF NOT EXISTS idx_tyre_ai_results_job_id ON tyre_ai_results(analysis_job_id);
CREATE INDEX IF NOT EXISTS idx_tyre_ai_results_set_id ON tyre_ai_results(tyre_set_id);
CREATE INDEX IF NOT EXISTS idx_service_templates_industry ON service_templates(industry);

-- Trigger for oppdatering av updated_at
CREATE OR REPLACE FUNCTION update_tyre_ai_results_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_tyre_ai_results_updated_at
  BEFORE UPDATE ON tyre_ai_results
  FOR EACH ROW
  EXECUTE FUNCTION update_tyre_ai_results_updated_at();

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- service_templates - alle kan lese, ingen kan endre (admin-only via API)
ALTER TABLE service_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_templates_select_all" ON service_templates
  FOR SELECT USING (true);

-- tyre_ai_results - samme tilgang som tyre_sets
ALTER TABLE tyre_ai_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tyre_ai_results_select_org" ON tyre_ai_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tyre_sets ts
      WHERE ts.id = tyre_ai_results.tyre_set_id
      AND ts.org_id IN (
        SELECT org_id FROM org_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "tyre_ai_results_insert_org" ON tyre_ai_results
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM tyre_sets ts
      WHERE ts.id = tyre_ai_results.tyre_set_id
      AND ts.org_id IN (
        SELECT org_id FROM org_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "tyre_ai_results_update_org" ON tyre_ai_results
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM tyre_sets ts
      WHERE ts.id = tyre_ai_results.tyre_set_id
      AND ts.org_id IN (
        SELECT org_id FROM org_members WHERE user_id = auth.uid()
      )
    )
  );

-- =====================================================
-- FERDIG!
-- =====================================================

COMMENT ON SCHEMA public IS 'Database oppdatert for Oppgave A3 (Onboarding) og C4 (AI-analyse)';
