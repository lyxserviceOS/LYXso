-- =====================================================
-- DEKKHOTELL PRO AI-ANALYSE TABELLER
-- =====================================================

-- 1. TYRE_SETS - Dekksett (hovedtabell)
CREATE TABLE IF NOT EXISTS tyre_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  
  -- Grunnleggende info
  registration_number TEXT,
  label TEXT,  -- Kundenavn eller etikett
  dimension TEXT,  -- f.eks. 225/45R17
  brand TEXT,
  model TEXT,
  season TEXT CHECK (season IN ('summer', 'winter', 'allseason')),
  
  -- Tilstand og mønsterdybde
  condition TEXT CHECK (condition IN ('good', 'worn', 'bad', 'replace')),
  tread_depth_mm NUMERIC(4,1),
  production_year INT,
  production_week INT,
  
  -- Lagring
  storage_location_id UUID REFERENCES storage_locations(id) ON DELETE SET NULL,
  location TEXT,  -- Tekstlig beskrivelse
  shelf TEXT,
  row TEXT,
  position TEXT,
  status TEXT DEFAULT 'stored' CHECK (status IN ('stored', 'mounted', 'out')),
  
  -- Metadata
  notes TEXT,
  images JSONB,  -- Array av bilde-URLs
  ai_analysis JSONB,  -- Siste AI-analyse sammendrag
  stored_at TIMESTAMPTZ,
  last_mounted_at TIMESTAMPTZ,
  mileage_at_storage INT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. STORAGE_LOCATIONS - Lagerplasseringer
CREATE TABLE IF NOT EXISTS storage_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  
  label TEXT NOT NULL,
  row TEXT,
  shelf TEXT,
  position TEXT,
  capacity INT DEFAULT 1,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(org_id, label)
);

-- 3. TYRE_POSITIONS - Individuelle dekkposisjoner
CREATE TABLE IF NOT EXISTS tyre_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tyre_set_id UUID NOT NULL REFERENCES tyre_sets(id) ON DELETE CASCADE,
  
  position_label TEXT NOT NULL,  -- 'FL', 'FR', 'RL', 'RR'
  tread_depth_mm NUMERIC(4,1),
  wear_status TEXT CHECK (wear_status IN ('good', 'worn', 'bad', 'replace')),
  production_year INT,
  production_week INT,
  photo_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(tyre_set_id, position_label)
);

-- 4. TYRE_AI_ANALYSIS_JOBS - AI-analyse jobber
CREATE TABLE IF NOT EXISTS tyre_ai_analysis_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tyre_set_id UUID NOT NULL REFERENCES tyre_sets(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  raw_result_json JSONB,
  error_message TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- 5. TYRE_INSPECTIONS - Inspeksjoner (historikk)
CREATE TABLE IF NOT EXISTS tyre_inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tyre_set_id UUID NOT NULL REFERENCES tyre_sets(id) ON DELETE CASCADE,
  
  by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  by_ai BOOLEAN DEFAULT false,
  
  result_json JSONB,  -- Komplett AI-resultat eller manuelle målinger
  recommendation TEXT,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. TYRE_HISTORY - Hendelser og handlinger
CREATE TABLE IF NOT EXISTS tyre_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tyre_set_id UUID NOT NULL REFERENCES tyre_sets(id) ON DELETE CASCADE,
  
  action TEXT NOT NULL,  -- 'stored', 'mounted', 'inspected', 'note_added'
  date DATE,
  mileage INT,
  notes TEXT,
  created_by TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- INDEXER
-- =====================================================

CREATE INDEX idx_tyre_sets_org ON tyre_sets(org_id);
CREATE INDEX idx_tyre_sets_customer ON tyre_sets(customer_id);
CREATE INDEX idx_tyre_sets_vehicle ON tyre_sets(vehicle_id);
CREATE INDEX idx_tyre_sets_status ON tyre_sets(status);
CREATE INDEX idx_tyre_sets_season ON tyre_sets(season);
CREATE INDEX idx_tyre_sets_condition ON tyre_sets(condition);

CREATE INDEX idx_storage_locations_org ON storage_locations(org_id);
CREATE INDEX idx_tyre_positions_set ON tyre_positions(tyre_set_id);
CREATE INDEX idx_tyre_ai_jobs_set ON tyre_ai_analysis_jobs(tyre_set_id);
CREATE INDEX idx_tyre_ai_jobs_status ON tyre_ai_analysis_jobs(status);
CREATE INDEX idx_tyre_inspections_set ON tyre_inspections(tyre_set_id);
CREATE INDEX idx_tyre_history_set ON tyre_history(tyre_set_id);

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- TYRE_SETS
ALTER TABLE tyre_sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view tyre sets in their org"
  ON tyre_sets FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM org_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert tyre sets in their org"
  ON tyre_sets FOR INSERT
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM org_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update tyre sets in their org"
  ON tyre_sets FOR UPDATE
  USING (
    org_id IN (
      SELECT org_id FROM org_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete tyre sets in their org"
  ON tyre_sets FOR DELETE
  USING (
    org_id IN (
      SELECT org_id FROM org_members 
      WHERE user_id = auth.uid()
    )
  );

-- STORAGE_LOCATIONS
ALTER TABLE storage_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view storage locations in their org"
  ON storage_locations FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM org_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage storage locations in their org"
  ON storage_locations FOR ALL
  USING (
    org_id IN (
      SELECT org_id FROM org_members 
      WHERE user_id = auth.uid()
    )
  );

-- TYRE_POSITIONS
ALTER TABLE tyre_positions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view tyre positions via their org"
  ON tyre_positions FOR SELECT
  USING (
    tyre_set_id IN (
      SELECT id FROM tyre_sets 
      WHERE org_id IN (
        SELECT org_id FROM org_members 
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can manage tyre positions in their org"
  ON tyre_positions FOR ALL
  USING (
    tyre_set_id IN (
      SELECT id FROM tyre_sets 
      WHERE org_id IN (
        SELECT org_id FROM org_members 
        WHERE user_id = auth.uid()
      )
    )
  );

-- TYRE_AI_ANALYSIS_JOBS
ALTER TABLE tyre_ai_analysis_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view AI jobs in their org"
  ON tyre_ai_analysis_jobs FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM org_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create AI jobs in their org"
  ON tyre_ai_analysis_jobs FOR INSERT
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM org_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can update AI jobs"
  ON tyre_ai_analysis_jobs FOR UPDATE
  USING (true);

-- TYRE_INSPECTIONS
ALTER TABLE tyre_inspections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view inspections via their org"
  ON tyre_inspections FOR SELECT
  USING (
    tyre_set_id IN (
      SELECT id FROM tyre_sets 
      WHERE org_id IN (
        SELECT org_id FROM org_members 
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create inspections in their org"
  ON tyre_inspections FOR INSERT
  WITH CHECK (
    tyre_set_id IN (
      SELECT id FROM tyre_sets 
      WHERE org_id IN (
        SELECT org_id FROM org_members 
        WHERE user_id = auth.uid()
      )
    )
  );

-- TYRE_HISTORY
ALTER TABLE tyre_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view history via their org"
  ON tyre_history FOR SELECT
  USING (
    tyre_set_id IN (
      SELECT id FROM tyre_sets 
      WHERE org_id IN (
        SELECT org_id FROM org_members 
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can add history in their org"
  ON tyre_history FOR INSERT
  WITH CHECK (
    tyre_set_id IN (
      SELECT id FROM tyre_sets 
      WHERE org_id IN (
        SELECT org_id FROM org_members 
        WHERE user_id = auth.uid()
      )
    )
  );

-- =====================================================
-- API ENDPOINT FOR LISTING TYRE SETS
-- =====================================================

-- Denne funksjonen kan kalles fra API:
-- GET /api/orgs/:orgId/tyre-sets

-- =====================================================
-- FERDIG! Nå kan Dekkhotell PRO kjøres med AI
-- =====================================================
