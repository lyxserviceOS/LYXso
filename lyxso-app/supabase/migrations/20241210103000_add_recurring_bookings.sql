-- Migration: Recurring Bookings (Gjentakende bookinger)
-- Kjør denne i Supabase SQL Editor

-- 1. Opprett tabell for gjentakende booking-regler
CREATE TABLE IF NOT EXISTS recurring_booking_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  
  -- Tidspunkt for første booking
  start_time TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  
  -- Gjentakelse
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly')),
  interval_count INTEGER DEFAULT 1 CHECK (interval_count > 0), -- Hver N dag/uke/måned
  days_of_week INTEGER[] CHECK (
    days_of_week IS NULL OR 
    (array_length(days_of_week, 1) > 0 AND 
     (SELECT bool_and(d >= 0 AND d <= 6) FROM unnest(days_of_week) AS d))
  ), -- [0=søndag, 1=mandag, ..., 6=lørdag]
  
  -- Slutt-betingelse (EN av disse må være satt)
  end_date TIMESTAMPTZ, -- Avslutt etter dato
  max_occurrences INTEGER, -- Eller etter N ganger
  
  -- Status og metadata
  is_active BOOLEAN DEFAULT true,
  created_bookings INTEGER DEFAULT 0, -- Teller hvor mange bookinger som er opprettet
  last_generated_at TIMESTAMPTZ, -- Siste gang cronjob genererte bookinger
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  
  -- Minst én slutt-betingelse må være satt
  CONSTRAINT check_end_condition CHECK (end_date IS NOT NULL OR max_occurrences IS NOT NULL)
);

-- 2. Legg til recurring_rule_id i bookings
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS recurring_rule_id UUID REFERENCES recurring_booking_rules(id) ON DELETE SET NULL;

-- 3. Indekser
CREATE INDEX IF NOT EXISTS idx_recurring_rules_org ON recurring_booking_rules(org_id, is_active);
CREATE INDEX IF NOT EXISTS idx_recurring_rules_customer ON recurring_booking_rules(customer_id);
CREATE INDEX IF NOT EXISTS idx_recurring_rules_next_gen ON recurring_booking_rules(org_id, is_active, last_generated_at);
CREATE INDEX IF NOT EXISTS idx_bookings_recurring_rule ON bookings(recurring_rule_id) WHERE recurring_rule_id IS NOT NULL;

-- 4. RLS Policies
ALTER TABLE recurring_booking_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view recurring rules for their org" 
ON recurring_booking_rules FOR SELECT
USING (
  org_id IN (
    SELECT org_id FROM org_users WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create recurring rules for their org" 
ON recurring_booking_rules FOR INSERT
WITH CHECK (
  org_id IN (
    SELECT org_id FROM org_users WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update recurring rules for their org" 
ON recurring_booking_rules FOR UPDATE
USING (
  org_id IN (
    SELECT org_id FROM org_users WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete recurring rules for their org" 
ON recurring_booking_rules FOR DELETE
USING (
  org_id IN (
    SELECT org_id FROM org_users WHERE user_id = auth.uid()
  )
);

-- 5. Funksjon for å oppdatere updated_at
CREATE OR REPLACE FUNCTION update_recurring_rule_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_recurring_rule_timestamp
BEFORE UPDATE ON recurring_booking_rules
FOR EACH ROW
EXECUTE FUNCTION update_recurring_rule_updated_at();

-- 6. Kommentarer
COMMENT ON TABLE recurring_booking_rules IS 'Regler for gjentakende bookinger (f.eks. hver mandag kl 10)';
COMMENT ON COLUMN recurring_booking_rules.frequency IS 'Frekvens: daily, weekly, biweekly, monthly';
COMMENT ON COLUMN recurring_booking_rules.interval_count IS 'Hver N dag/uke/måned';
COMMENT ON COLUMN recurring_booking_rules.days_of_week IS 'Array med ukedager [0=søndag, 1=mandag, ..., 6=lørdag]';
COMMENT ON COLUMN recurring_booking_rules.created_bookings IS 'Antall bookinger som er opprettet fra denne regelen';
COMMENT ON COLUMN recurring_booking_rules.last_generated_at IS 'Siste gang cronjob genererte bookinger fra denne regelen';
