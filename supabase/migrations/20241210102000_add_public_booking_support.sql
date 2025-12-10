-- Migration: Add public booking support
-- Kjør denne i Supabase SQL Editor

-- 1. Legg til is_public kolonne i services (tillat public booking av tjeneste)
ALTER TABLE services ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;
ALTER TABLE services ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- 2. Legg til booking_settings i orgs (konfigurasjon for public booking)
ALTER TABLE orgs ADD COLUMN IF NOT EXISTS booking_settings JSONB DEFAULT '{
  "auto_confirm_public_bookings": false,
  "require_vehicle_reg": false,
  "allow_notes": true,
  "min_advance_hours": 2,
  "max_advance_days": 30,
  "slot_duration_minutes": 60
}'::jsonb;

-- 3. Legg til source kolonne i bookings (spor hvor booking kom fra)
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual';
-- Mulige verdier: 'manual', 'public_booking', 'api', 'recurring', 'waitlist'

-- 4. Legg til source kolonne i customers (spor hvor kunde kom fra)
ALTER TABLE customers ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual';
-- Mulige verdier: 'manual', 'public_booking', 'import', 'api'

-- 5. Oppdater eksisterende data
UPDATE services SET is_public = true WHERE is_public IS NULL;
UPDATE services SET display_order = 0 WHERE display_order IS NULL;
UPDATE bookings SET source = 'manual' WHERE source IS NULL;
UPDATE customers SET source = 'manual' WHERE source IS NULL;

-- 6. Indekser for raskere søk
CREATE INDEX IF NOT EXISTS idx_services_is_public ON services(org_id, is_public, is_active);
CREATE INDEX IF NOT EXISTS idx_bookings_source ON bookings(org_id, source);
CREATE INDEX IF NOT EXISTS idx_customers_source ON customers(org_id, source);
CREATE INDEX IF NOT EXISTS idx_bookings_time_range ON bookings(org_id, starts_at, ends_at) WHERE status IN ('pending', 'confirmed', 'in_progress');

COMMENT ON COLUMN services.is_public IS 'Om tjenesten skal vises i public booking flow';
COMMENT ON COLUMN services.display_order IS 'Sorteringsrekkefølge i public booking (lavere tall vises først)';
COMMENT ON COLUMN orgs.booking_settings IS 'Konfigurasjon for public booking (JSON)';
COMMENT ON COLUMN bookings.source IS 'Hvor bookingen kom fra (manual, public_booking, api, recurring, waitlist)';
COMMENT ON COLUMN customers.source IS 'Hvor kunden kom fra (manual, public_booking, import, api)';
