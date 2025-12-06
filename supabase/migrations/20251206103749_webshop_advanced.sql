-- ============================================================================
-- LYXSO WEBSHOP - Advanced Features Migration
-- Adds: Discounts, Enhanced Inventory Tracking
-- ============================================================================

-- Discount Codes Table
CREATE TABLE IF NOT EXISTS webshop_discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Code info
  code TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed', 'freeShipping')),
  value DECIMAL(10,2) DEFAULT 0,
  
  -- Conditions
  min_amount DECIMAL(12,2) DEFAULT 0,
  conditions TEXT[] DEFAULT '{}',
  categories TEXT[] DEFAULT '{}',
  products UUID[] DEFAULT '{}',
  customer_types TEXT[] DEFAULT '{}',
  
  -- Validity
  start_date DATE NOT NULL,
  end_date DATE,
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  
  -- Status
  active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(organization_id, code)
);

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_webshop_discounts_org 
  ON webshop_discounts(organization_id);
CREATE INDEX IF NOT EXISTS idx_webshop_discounts_code 
  ON webshop_discounts(organization_id, code);
CREATE INDEX IF NOT EXISTS idx_webshop_discounts_active 
  ON webshop_discounts(organization_id, active) WHERE active = true;

-- Add inventory tracking fields to products if not exists
DO $$ 
BEGIN
  -- Add location field if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'webshop_products' AND column_name = 'location'
  ) THEN
    ALTER TABLE webshop_products ADD COLUMN location TEXT;
  END IF;
  
  -- Add reorder_point if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'webshop_products' AND column_name = 'reorder_point'
  ) THEN
    ALTER TABLE webshop_products ADD COLUMN reorder_point INTEGER DEFAULT 10;
  END IF;
  
  -- Add reorder_quantity if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'webshop_products' AND column_name = 'reorder_quantity'
  ) THEN
    ALTER TABLE webshop_products ADD COLUMN reorder_quantity INTEGER DEFAULT 20;
  END IF;
  
  -- Add stock_quantity if not exists (alias for quantity)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'webshop_products' AND column_name = 'stock_quantity'
  ) THEN
    ALTER TABLE webshop_products ADD COLUMN stock_quantity INTEGER DEFAULT 0;
    -- Copy existing quantity values if they exist
    UPDATE webshop_products SET stock_quantity = quantity WHERE quantity IS NOT NULL;
  END IF;
END $$;

-- Discount Usage Log (for tracking individual uses)
CREATE TABLE IF NOT EXISTS webshop_discount_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discount_id UUID NOT NULL REFERENCES webshop_discounts(id) ON DELETE CASCADE,
  order_id UUID REFERENCES webshop_orders(id) ON DELETE SET NULL,
  customer_email TEXT,
  discount_amount DECIMAL(12,2) NOT NULL,
  used_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webshop_discount_usage_discount 
  ON webshop_discount_usage(discount_id);
CREATE INDEX IF NOT EXISTS idx_webshop_discount_usage_order 
  ON webshop_discount_usage(order_id);

-- Function to automatically update usage_count
CREATE OR REPLACE FUNCTION update_discount_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE webshop_discounts 
  SET usage_count = usage_count + 1,
      updated_at = NOW()
  WHERE id = NEW.discount_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for usage count
DROP TRIGGER IF EXISTS trg_update_discount_usage ON webshop_discount_usage;
CREATE TRIGGER trg_update_discount_usage
  AFTER INSERT ON webshop_discount_usage
  FOR EACH ROW
  EXECUTE FUNCTION update_discount_usage_count();

-- RLS Policies for discounts
ALTER TABLE webshop_discounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their org discounts" ON webshop_discounts;
CREATE POLICY "Users can view their org discounts"
  ON webshop_discounts FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can manage their org discounts" ON webshop_discounts;
CREATE POLICY "Users can manage their org discounts"
  ON webshop_discounts FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- RLS for discount usage
ALTER TABLE webshop_discount_usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their discount usage" ON webshop_discount_usage;
CREATE POLICY "Users can view their discount usage"
  ON webshop_discount_usage FOR SELECT
  USING (
    discount_id IN (
      SELECT id FROM webshop_discounts WHERE organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "System can insert discount usage" ON webshop_discount_usage;
CREATE POLICY "System can insert discount usage"
  ON webshop_discount_usage FOR INSERT
  WITH CHECK (true);

COMMENT ON TABLE webshop_discounts IS 'Discount codes and promotions for webshop';
COMMENT ON TABLE webshop_discount_usage IS 'Log of discount code usage';
