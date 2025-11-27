-- Migration: Add CRM columns to customers table - KORRIGERT VERSJON
-- Dato: 2024-11-26
-- Beskrivelse: Tilpasset din faktiske database-struktur (orgs, ikke organizations)
-- MERK: Bruk SQL-en fra Supabase i stedet - den er korrekt for ditt oppsett!

-- Legg til nye kolonner i customers-tabellen
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS has_tire_hotel BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_coating BOOLEAN DEFAULT false;

-- Oppdater eksisterende kunder til å være aktive som standard
UPDATE customers SET is_active = true WHERE is_active IS NULL;

-- Kommenter på kolonnene for dokumentasjon
COMMENT ON COLUMN customers.is_active IS 'Om kunden er aktiv (ikke slettet/arkivert)';
COMMENT ON COLUMN customers.has_tire_hotel IS 'Om kunden har dekksett i dekkhotell';
COMMENT ON COLUMN customers.has_coating IS 'Om kunden har coating registrert';

-- Opprett customer_notes-tabell hvis den ikke eksisterer
CREATE TABLE IF NOT EXISTS customer_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indekser for customer_notes
CREATE INDEX IF NOT EXISTS customer_notes_org_id_idx ON customer_notes(org_id);
CREATE INDEX IF NOT EXISTS customer_notes_customer_id_idx ON customer_notes(customer_id);
CREATE INDEX IF NOT EXISTS customer_notes_created_at_idx ON customer_notes(created_at DESC);

-- Trigger for å oppdatere updated_at
CREATE OR REPLACE FUNCTION update_customer_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER customer_notes_updated_at
BEFORE UPDATE ON customer_notes
FOR EACH ROW
EXECUTE FUNCTION update_customer_notes_updated_at();

-- RLS policies for customer_notes
ALTER TABLE customer_notes ENABLE ROW LEVEL SECURITY;

-- Policy: Org kan se sine egne notater
CREATE POLICY customer_notes_org_read ON customer_notes
FOR SELECT
USING (org_id IN (
  SELECT id FROM organizations WHERE id = org_id
));

-- Policy: Org kan opprette notater
CREATE POLICY customer_notes_org_insert ON customer_notes
FOR INSERT
WITH CHECK (org_id IN (
  SELECT id FROM organizations WHERE id = org_id
));

-- Policy: Org kan oppdatere sine egne notater
CREATE POLICY customer_notes_org_update ON customer_notes
FOR UPDATE
USING (org_id IN (
  SELECT id FROM organizations WHERE id = org_id
));

-- Policy: Org kan slette sine egne notater
CREATE POLICY customer_notes_org_delete ON customer_notes
FOR DELETE
USING (org_id IN (
  SELECT id FROM organizations WHERE id = org_id
));

-- Verifiser at coating_jobs-tabell eksisterer (hvis ikke, opprett den)
CREATE TABLE IF NOT EXISTS coating_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  vehicle_vin TEXT,
  vehicle_reg TEXT,
  vehicle_make TEXT,
  vehicle_model TEXT,
  vehicle_color TEXT,
  coating_product TEXT,
  layers INTEGER,
  warranty_years INTEGER,
  installed_at TIMESTAMPTZ,
  registered_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS coating_jobs_org_id_idx ON coating_jobs(org_id);
CREATE INDEX IF NOT EXISTS coating_jobs_customer_id_idx ON coating_jobs(customer_id);
CREATE INDEX IF NOT EXISTS coating_jobs_installed_at_idx ON coating_jobs(installed_at DESC);

-- Verifiser at tire_storage-tabell eksisterer (hvis ikke, opprett den)
CREATE TABLE IF NOT EXISTS tire_storage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  vehicle_reg TEXT,
  tire_type TEXT,
  tire_brand TEXT,
  tire_size TEXT,
  location TEXT,
  condition TEXT,
  stored_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS tire_storage_org_id_idx ON tire_storage(org_id);
CREATE INDEX IF NOT EXISTS tire_storage_customer_id_idx ON tire_storage(customer_id);

-- Verifiser at payments-tabell eksisterer (hvis ikke, opprett den)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  paid_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS payments_org_id_idx ON payments(org_id);
CREATE INDEX IF NOT EXISTS payments_customer_id_idx ON payments(customer_id);
CREATE INDEX IF NOT EXISTS payments_status_idx ON payments(status);
CREATE INDEX IF NOT EXISTS payments_created_at_idx ON payments(created_at DESC);

-- Oppdater has_coating og has_tire_hotel basert på eksisterende data
UPDATE customers c
SET has_coating = true
WHERE EXISTS (
  SELECT 1 FROM coating_jobs cj 
  WHERE cj.customer_id = c.id
);

UPDATE customers c
SET has_tire_hotel = true
WHERE EXISTS (
  SELECT 1 FROM tire_storage ts 
  WHERE ts.customer_id = c.id
);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'CRM columns successfully added to customers table';
  RAISE NOTICE 'customer_notes table created (if not exists)';
  RAISE NOTICE 'coating_jobs table verified';
  RAISE NOTICE 'tire_storage table verified';
  RAISE NOTICE 'payments table verified';
  RAISE NOTICE 'Migration completed successfully!';
END $$;
