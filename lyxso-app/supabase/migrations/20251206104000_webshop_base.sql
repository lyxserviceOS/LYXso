-- ============================================================================
-- LYXSO WEBSHOP - Complete Database Schema
-- ============================================================================

-- Webshop Products (Egne produkter)
CREATE TABLE IF NOT EXISTS webshop_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Basic info
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  
  -- Pricing
  price DECIMAL(12,2) NOT NULL,
  compare_at_price DECIMAL(12,2),
  cost_price DECIMAL(12,2),
  
  -- Inventory
  sku TEXT,
  barcode TEXT,
  track_inventory BOOLEAN DEFAULT true,
  quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  allow_backorder BOOLEAN DEFAULT false,
  
  -- Organization
  category TEXT,
  tags TEXT[],
  
  -- Media
  images JSONB DEFAULT '[]'::jsonb,
  
  -- Product details
  specifications JSONB,
  variants JSONB,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  
  -- Settings
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  requires_shipping BOOLEAN DEFAULT true,
  taxable BOOLEAN DEFAULT true,
  
  -- Stats
  views_count INTEGER DEFAULT 0,
  orders_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(org_id, slug)
);

-- Partner Products (Partnerprodukter)
CREATE TABLE IF NOT EXISTS webshop_partner_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  partner_id TEXT NOT NULL,
  partner_product_id TEXT NOT NULL,
  
  -- Synced from partner
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  partner_price DECIMAL(12,2) NOT NULL,
  availability TEXT DEFAULT 'in_stock',
  image_url TEXT,
  
  -- Your pricing
  your_price DECIMAL(12,2) NOT NULL,
  markup_percentage DECIMAL(5,2),
  
  -- Display
  is_active BOOLEAN DEFAULT true,
  display_partner_logo BOOLEAN DEFAULT true,
  
  -- Sync
  last_synced_at TIMESTAMPTZ,
  sync_data JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(org_id, partner_id, partner_product_id)
);

-- Product Categories
CREATE TABLE IF NOT EXISTS webshop_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES webshop_categories(id),
  
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(org_id, slug)
);

-- Webshop Orders
CREATE TABLE IF NOT EXISTS webshop_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Order info
  order_number TEXT NOT NULL,
  
  -- Customer
  customer_id UUID REFERENCES customers(id),
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  
  -- Billing address
  billing_address TEXT NOT NULL,
  billing_city TEXT NOT NULL,
  billing_postal_code TEXT NOT NULL,
  billing_country TEXT DEFAULT 'NO',
  
  -- Shipping address
  shipping_same_as_billing BOOLEAN DEFAULT true,
  shipping_address TEXT,
  shipping_city TEXT,
  shipping_postal_code TEXT,
  shipping_country TEXT,
  
  -- Items (JSON array)
  items JSONB NOT NULL,
  
  -- Pricing
  subtotal DECIMAL(12,2) NOT NULL,
  shipping_cost DECIMAL(12,2) DEFAULT 0,
  tax_amount DECIMAL(12,2) DEFAULT 0,
  discount_amount DECIMAL(12,2) DEFAULT 0,
  total DECIMAL(12,2) NOT NULL,
  
  -- Shipping
  shipping_method TEXT,
  shipping_tracking_number TEXT,
  
  -- Payment
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  
  -- Status
  status TEXT DEFAULT 'pending',
  fulfillment_status TEXT DEFAULT 'unfulfilled',
  
  -- Notes
  customer_note TEXT,
  internal_note TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  
  UNIQUE(org_id, order_number)
);

-- Webshop Settings
CREATE TABLE IF NOT EXISTS webshop_settings (
  org_id UUID PRIMARY KEY REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Display
  show_in_menu BOOLEAN DEFAULT true,
  show_partner_logos BOOLEAN DEFAULT false,
  featured_categories TEXT[],
  
  -- Pricing
  default_markup_percentage DECIMAL(5,2) DEFAULT 20,
  show_compare_prices BOOLEAN DEFAULT false,
  currency TEXT DEFAULT 'NOK',
  
  -- Shipping
  allow_pickup BOOLEAN DEFAULT true,
  allow_shipping BOOLEAN DEFAULT false,
  shipping_cost DECIMAL(12,2) DEFAULT 99,
  free_shipping_threshold DECIMAL(12,2) DEFAULT 500,
  
  -- Checkout
  require_account BOOLEAN DEFAULT false,
  allow_guest_checkout BOOLEAN DEFAULT true,
  
  -- Tax
  tax_percentage DECIMAL(5,2) DEFAULT 25,
  tax_included_in_price BOOLEAN DEFAULT true,
  
  -- Notifications
  notify_on_new_order BOOLEAN DEFAULT true,
  notification_email TEXT,
  
  -- Terms
  terms_url TEXT,
  privacy_url TEXT,
  
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Supplier/Partner API Keys (Admin kan legge til API-nøkler)
CREATE TABLE IF NOT EXISTS webshop_supplier_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  supplier_name TEXT NOT NULL, -- 'mekonomen', 'gs_bildeler', etc
  api_key TEXT NOT NULL,
  api_secret TEXT,
  api_endpoint TEXT,
  
  -- Configuration
  is_active BOOLEAN DEFAULT true,
  sync_enabled BOOLEAN DEFAULT true,
  sync_frequency TEXT DEFAULT 'daily', -- 'hourly', 'daily', 'weekly'
  last_sync_at TIMESTAMPTZ,
  last_sync_status TEXT,
  
  -- Product visibility settings (hvilke produkter skal synces)
  sync_categories TEXT[], -- Hvilke kategorier som skal synces
  min_price DECIMAL(12,2), -- Minimum pris for produkter
  max_price DECIMAL(12,2), -- Maximum pris for produkter
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(org_id, supplier_name)
);

-- Product Visibility Rules (Admin kontrollerer hva kunder ser)
CREATE TABLE IF NOT EXISTS webshop_visibility_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL, -- 'show_category', 'hide_category', 'show_supplier', 'hide_supplier', 'price_range'
  
  -- Rule configuration
  applies_to TEXT[], -- Categories, suppliers, eller product IDs
  condition_value JSONB, -- Flexible conditions
  
  -- Priority
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_webshop_products_org_id ON webshop_products(org_id);
CREATE INDEX IF NOT EXISTS idx_webshop_products_slug ON webshop_products(org_id, slug);
CREATE INDEX IF NOT EXISTS idx_webshop_products_category ON webshop_products(org_id, category);
CREATE INDEX IF NOT EXISTS idx_webshop_products_active ON webshop_products(org_id, is_active);

CREATE INDEX IF NOT EXISTS idx_webshop_partner_products_org_id ON webshop_partner_products(org_id);
CREATE INDEX IF NOT EXISTS idx_webshop_partner_products_partner ON webshop_partner_products(org_id, partner_id);
CREATE INDEX IF NOT EXISTS idx_webshop_partner_products_active ON webshop_partner_products(org_id, is_active);

CREATE INDEX IF NOT EXISTS idx_webshop_orders_org_id ON webshop_orders(org_id);
CREATE INDEX IF NOT EXISTS idx_webshop_orders_number ON webshop_orders(org_id, order_number);
CREATE INDEX IF NOT EXISTS idx_webshop_orders_status ON webshop_orders(org_id, status);
CREATE INDEX IF NOT EXISTS idx_webshop_orders_customer ON webshop_orders(org_id, customer_id);

CREATE INDEX IF NOT EXISTS idx_webshop_supplier_keys_org ON webshop_supplier_keys(org_id);
CREATE INDEX IF NOT EXISTS idx_webshop_supplier_keys_active ON webshop_supplier_keys(org_id, is_active);

-- RLS Policies
ALTER TABLE webshop_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE webshop_partner_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE webshop_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE webshop_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE webshop_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE webshop_supplier_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE webshop_visibility_rules ENABLE ROW LEVEL SECURITY;

-- Policies (users can only access their org's data)
CREATE POLICY webshop_products_policy ON webshop_products
  FOR ALL USING (org_id IN (SELECT id FROM organizations WHERE id = auth.jwt() ->> 'org_id'));

CREATE POLICY webshop_partner_products_policy ON webshop_partner_products
  FOR ALL USING (org_id IN (SELECT id FROM organizations WHERE id = auth.jwt() ->> 'org_id'));

CREATE POLICY webshop_categories_policy ON webshop_categories
  FOR ALL USING (org_id IN (SELECT id FROM organizations WHERE id = auth.jwt() ->> 'org_id'));

CREATE POLICY webshop_orders_policy ON webshop_orders
  FOR ALL USING (org_id IN (SELECT id FROM organizations WHERE id = auth.jwt() ->> 'org_id'));

CREATE POLICY webshop_settings_policy ON webshop_settings
  FOR ALL USING (org_id IN (SELECT id FROM organizations WHERE id = auth.jwt() ->> 'org_id'));

CREATE POLICY webshop_supplier_keys_policy ON webshop_supplier_keys
  FOR ALL USING (org_id IN (SELECT id FROM organizations WHERE id = auth.jwt() ->> 'org_id'));

CREATE POLICY webshop_visibility_rules_policy ON webshop_visibility_rules
  FOR ALL USING (org_id IN (SELECT id FROM organizations WHERE id = auth.jwt() ->> 'org_id'));
