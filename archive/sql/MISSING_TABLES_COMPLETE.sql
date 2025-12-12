-- ============================================================================
-- MANGLENDE TABELLER - KOMPLETT MIGRATION
-- ============================================================================
-- Dato: 10. desember 2024, kl. 03:40
-- Formål: Opprett ALLE manglende tabeller som kodebasen forventer
--
-- KJØR I SUPABASE SQL EDITOR:
-- https://supabase.com/dashboard/project/gedoxtrdylqxyyvfjmtb/sql
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. KJØRETØY REFERANSE-TABELLER (KRITISK)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.vehicle_makes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  country TEXT DEFAULT 'NO',
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.vehicle_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  make_id UUID NOT NULL REFERENCES public.vehicle_makes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  year_from INTEGER,
  year_to INTEGER,
  body_type TEXT,
  fuel_type TEXT,
  transmission TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(make_id, name, year_from)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_vehicle_models_make ON public.vehicle_models(make_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_models_year ON public.vehicle_models(year_from, year_to);

-- RLS
ALTER TABLE public.vehicle_makes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_models ENABLE ROW LEVEL SECURITY;

-- Public read access for vehicle reference data
CREATE POLICY "Anyone can view vehicle makes"
  ON public.vehicle_makes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view vehicle models"
  ON public.vehicle_models FOR SELECT
  USING (true);

-- ============================================================================
-- 2. CUSTOMER VEHICLES (KRITISK)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.customer_vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  
  -- Vehicle info (if not using vehicles table)
  make TEXT,
  model TEXT,
  year INTEGER,
  registration_number TEXT,
  vin TEXT,
  
  -- Additional info
  color TEXT,
  mileage INTEGER,
  notes TEXT,
  
  -- Metadata
  is_primary BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_vehicles_org ON public.customer_vehicles(org_id);
CREATE INDEX IF NOT EXISTS idx_customer_vehicles_customer ON public.customer_vehicles(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_vehicles_vehicle ON public.customer_vehicles(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_customer_vehicles_reg ON public.customer_vehicles(registration_number);

-- RLS
ALTER TABLE public.customer_vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "customer_vehicles_org_access"
  ON public.customer_vehicles FOR ALL
  USING (org_id IN (SELECT org_id FROM public.org_users WHERE user_id = auth.uid()));

-- ============================================================================
-- 3. LAGERSTYRING (INVENTORY) - KRITISK FOR WORKSHOPS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  
  -- Item details
  sku TEXT,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  
  -- Stock
  quantity INTEGER DEFAULT 0,
  min_quantity INTEGER DEFAULT 0,
  max_quantity INTEGER,
  unit TEXT DEFAULT 'stk',
  
  -- Location
  location TEXT,
  shelf TEXT,
  bin TEXT,
  
  -- Pricing
  cost_price DECIMAL(10,2),
  selling_price DECIMAL(10,2),
  
  -- Supplier
  supplier_id UUID,
  supplier_sku TEXT,
  
  -- Metadata
  barcode TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  last_restock_date TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_items_org ON public.inventory_items(org_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_sku ON public.inventory_items(sku);
CREATE INDEX IF NOT EXISTS idx_inventory_items_category ON public.inventory_items(category);
CREATE INDEX IF NOT EXISTS idx_inventory_items_supplier ON public.inventory_items(supplier_id);

-- RLS
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "inventory_items_org_access"
  ON public.inventory_items FOR ALL
  USING (org_id IN (SELECT org_id FROM public.org_users WHERE user_id = auth.uid()));

-- ============================================================================
-- 4. INVENTORY TRANSACTIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.inventory_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  item_id UUID NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
  
  -- Transaction details
  type TEXT NOT NULL, -- 'in', 'out', 'adjustment', 'return'
  quantity INTEGER NOT NULL,
  quantity_before INTEGER,
  quantity_after INTEGER,
  
  -- Reference
  reference_type TEXT, -- 'booking', 'sale', 'purchase_order', 'manual'
  reference_id UUID,
  
  -- Pricing
  unit_cost DECIMAL(10,2),
  total_cost DECIMAL(10,2),
  
  -- Details
  notes TEXT,
  performed_by UUID,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_trans_org ON public.inventory_transactions(org_id);
CREATE INDEX IF NOT EXISTS idx_inventory_trans_item ON public.inventory_transactions(item_id);
CREATE INDEX IF NOT EXISTS idx_inventory_trans_type ON public.inventory_transactions(type);
CREATE INDEX IF NOT EXISTS idx_inventory_trans_date ON public.inventory_transactions(created_at);

-- RLS
ALTER TABLE public.inventory_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "inventory_transactions_org_access"
  ON public.inventory_transactions FOR ALL
  USING (org_id IN (SELECT org_id FROM public.org_users WHERE user_id = auth.uid()));

-- ============================================================================
-- 5. SUPPLIERS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  
  -- Supplier info
  name TEXT NOT NULL,
  company_number TEXT,
  
  -- Contact
  email TEXT,
  phone TEXT,
  website TEXT,
  
  -- Address
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'NO',
  
  -- Contact person
  contact_person TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  
  -- Terms
  payment_terms TEXT,
  delivery_terms TEXT,
  
  -- Metadata
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_suppliers_org ON public.suppliers(org_id);

-- RLS
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "suppliers_org_access"
  ON public.suppliers FOR ALL
  USING (org_id IN (SELECT org_id FROM public.org_users WHERE user_id = auth.uid()));

-- ============================================================================
-- 6. PURCHASE ORDERS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  supplier_id UUID REFERENCES public.suppliers(id),
  
  -- Order info
  order_number TEXT UNIQUE,
  status TEXT DEFAULT 'draft', -- 'draft', 'sent', 'confirmed', 'delivered', 'cancelled'
  
  -- Dates
  order_date TIMESTAMPTZ DEFAULT NOW(),
  expected_delivery_date TIMESTAMPTZ,
  actual_delivery_date TIMESTAMPTZ,
  
  -- Items (stored as JSONB for flexibility)
  items JSONB DEFAULT '[]',
  
  -- Totals
  subtotal DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) DEFAULT 0,
  
  -- Payment
  payment_status TEXT DEFAULT 'pending',
  payment_method TEXT,
  
  -- Notes
  notes TEXT,
  internal_notes TEXT,
  
  -- Tracking
  created_by UUID,
  approved_by UUID,
  received_by UUID,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_purchase_orders_org ON public.purchase_orders(org_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_supplier ON public.purchase_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON public.purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_number ON public.purchase_orders(order_number);

-- RLS
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "purchase_orders_org_access"
  ON public.purchase_orders FOR ALL
  USING (org_id IN (SELECT org_id FROM public.org_users WHERE user_id = auth.uid()));

-- ============================================================================
-- 7. ANMELDELSER (REVIEWS)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  
  -- Review source
  source TEXT NOT NULL, -- 'google', 'facebook', 'trustpilot', 'manual'
  source_id TEXT,
  source_url TEXT,
  
  -- Customer
  customer_id UUID REFERENCES public.customers(id),
  customer_name TEXT,
  customer_email TEXT,
  
  -- Review content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  
  -- Response
  response TEXT,
  responded_at TIMESTAMPTZ,
  responded_by UUID,
  
  -- Dates
  review_date TIMESTAMPTZ DEFAULT NOW(),
  
  -- Metadata
  is_verified BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  
  -- Related booking
  booking_id UUID,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_org ON public.reviews(org_id);
CREATE INDEX IF NOT EXISTS idx_reviews_customer ON public.reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_source ON public.reviews(source);
CREATE INDEX IF NOT EXISTS idx_reviews_date ON public.reviews(review_date);

-- RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_org_access"
  ON public.reviews FOR ALL
  USING (org_id IN (SELECT org_id FROM public.org_users WHERE user_id = auth.uid()));

-- ============================================================================
-- 8. REVIEW REQUESTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.review_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  
  -- Customer
  customer_id UUID REFERENCES public.customers(id),
  booking_id UUID REFERENCES public.bookings(id),
  
  -- Request details
  email TEXT NOT NULL,
  phone TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'opened', 'completed', 'expired'
  
  -- Dates
  scheduled_send_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  
  -- Links
  google_review_link TEXT,
  facebook_review_link TEXT,
  custom_review_link TEXT,
  
  -- Tracking
  token TEXT UNIQUE,
  clicks INTEGER DEFAULT 0,
  
  -- Result
  review_id UUID REFERENCES public.reviews(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_review_requests_org ON public.review_requests(org_id);
CREATE INDEX IF NOT EXISTS idx_review_requests_customer ON public.review_requests(customer_id);
CREATE INDEX IF NOT EXISTS idx_review_requests_booking ON public.review_requests(booking_id);
CREATE INDEX IF NOT EXISTS idx_review_requests_status ON public.review_requests(status);
CREATE INDEX IF NOT EXISTS idx_review_requests_token ON public.review_requests(token);

-- RLS
ALTER TABLE public.review_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "review_requests_org_access"
  ON public.review_requests FOR ALL
  USING (org_id IN (SELECT org_id FROM public.org_users WHERE user_id = auth.uid()));

-- ============================================================================
-- 9. NETTBUTIKK PRODUKTER
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.webshop_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  
  -- Product info
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  
  -- Pricing
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  
  -- Stock
  sku TEXT,
  inventory_item_id UUID REFERENCES public.inventory_items(id),
  track_inventory BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  
  -- Categories
  category_id UUID,
  tags TEXT[] DEFAULT '{}',
  
  -- Media
  images TEXT[] DEFAULT '{}',
  featured_image TEXT,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  
  -- Status
  status TEXT DEFAULT 'draft', -- 'draft', 'active', 'archived'
  is_featured BOOLEAN DEFAULT false,
  
  -- Shipping
  weight DECIMAL(10,2),
  requires_shipping BOOLEAN DEFAULT true,
  
  -- Metadata
  product_type TEXT,
  vendor TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_webshop_products_org ON public.webshop_products(org_id);
CREATE INDEX IF NOT EXISTS idx_webshop_products_slug ON public.webshop_products(slug);
CREATE INDEX IF NOT EXISTS idx_webshop_products_category ON public.webshop_products(category_id);
CREATE INDEX IF NOT EXISTS idx_webshop_products_status ON public.webshop_products(status);

-- RLS
ALTER TABLE public.webshop_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "webshop_products_org_access"
  ON public.webshop_products FOR ALL
  USING (org_id IN (SELECT org_id FROM public.org_users WHERE user_id = auth.uid()));

-- ============================================================================
-- 10. NETTBUTIKK KATEGORIER
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.webshop_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  
  -- Category info
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  
  -- Hierarchy
  parent_id UUID REFERENCES public.webshop_categories(id),
  sort_order INTEGER DEFAULT 0,
  
  -- Media
  image_url TEXT,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  
  -- Status
  is_visible BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_webshop_categories_org ON public.webshop_categories(org_id);
CREATE INDEX IF NOT EXISTS idx_webshop_categories_slug ON public.webshop_categories(slug);
CREATE INDEX IF NOT EXISTS idx_webshop_categories_parent ON public.webshop_categories(parent_id);

-- RLS
ALTER TABLE public.webshop_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "webshop_categories_org_access"
  ON public.webshop_categories FOR ALL
  USING (org_id IN (SELECT org_id FROM public.org_users WHERE user_id = auth.uid()));

-- ============================================================================
-- 11. NETTBUTIKK INNSTILLINGER
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.webshop_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL UNIQUE,
  
  -- General
  shop_name TEXT,
  shop_description TEXT,
  
  -- Contact
  contact_email TEXT,
  contact_phone TEXT,
  
  -- Shipping
  shipping_methods JSONB DEFAULT '[]',
  free_shipping_threshold DECIMAL(10,2),
  
  -- Payment
  payment_methods JSONB DEFAULT '[]',
  currency TEXT DEFAULT 'NOK',
  
  -- Policies
  terms_url TEXT,
  privacy_url TEXT,
  return_policy TEXT,
  shipping_policy TEXT,
  
  -- Notifications
  order_notification_email TEXT,
  
  -- Design
  theme_color TEXT,
  logo_url TEXT,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  
  -- Features
  enable_reviews BOOLEAN DEFAULT true,
  enable_wishlist BOOLEAN DEFAULT true,
  enable_compare BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.webshop_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "webshop_settings_org_access"
  ON public.webshop_settings FOR ALL
  USING (org_id IN (SELECT org_id FROM public.org_users WHERE user_id = auth.uid()));

-- ============================================================================
-- 12. MINDRE KRITISKE TABELLER
-- ============================================================================

-- Booking Reminders
CREATE TABLE IF NOT EXISTS public.booking_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  
  -- Timing
  remind_at TIMESTAMPTZ NOT NULL,
  reminded_at TIMESTAMPTZ,
  
  -- Method
  method TEXT DEFAULT 'email', -- 'email', 'sms', 'both'
  
  -- Status
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  
  -- Content
  message TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_booking_reminders_org ON public.booking_reminders(org_id);
CREATE INDEX IF NOT EXISTS idx_booking_reminders_booking ON public.booking_reminders(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_reminders_time ON public.booking_reminders(remind_at);

ALTER TABLE public.booking_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "booking_reminders_org_access"
  ON public.booking_reminders FOR ALL
  USING (org_id IN (SELECT org_id FROM public.org_users WHERE user_id = auth.uid()));

-- Lead Sources
CREATE TABLE IF NOT EXISTS public.lead_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  name TEXT NOT NULL,
  type TEXT, -- 'website', 'social', 'referral', 'paid', 'other'
  cost_per_lead DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.lead_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lead_sources_org_access"
  ON public.lead_sources FOR ALL
  USING (org_id IN (SELECT org_id FROM public.org_users WHERE user_id = auth.uid()));

-- Lead Activities
CREATE TABLE IF NOT EXISTS public.lead_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'call', 'email', 'meeting', 'note', 'status_change'
  description TEXT,
  performed_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_activities_lead ON public.lead_activities(lead_id);

ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lead_activities_org_access"
  ON public.lead_activities FOR ALL
  USING (org_id IN (SELECT org_id FROM public.org_users WHERE user_id = auth.uid()));

-- Notification Settings
CREATE TABLE IF NOT EXISTS public.notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  
  -- Email notifications
  email_bookings BOOLEAN DEFAULT true,
  email_payments BOOLEAN DEFAULT true,
  email_customers BOOLEAN DEFAULT true,
  email_marketing BOOLEAN DEFAULT true,
  
  -- Push notifications
  push_bookings BOOLEAN DEFAULT true,
  push_payments BOOLEAN DEFAULT false,
  push_customers BOOLEAN DEFAULT false,
  
  -- SMS notifications
  sms_bookings BOOLEAN DEFAULT false,
  sms_payments BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notification_settings_own_access"
  ON public.notification_settings FOR ALL
  USING (user_id = auth.uid());

COMMIT;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '============================================';
  RAISE NOTICE '✅ ALLE MANGLENDE TABELLER OPPRETTET!';
  RAISE NOTICE '============================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Opprettet følgende tabeller:';
  RAISE NOTICE '  ✅ vehicle_makes';
  RAISE NOTICE '  ✅ vehicle_models';
  RAISE NOTICE '  ✅ customer_vehicles';
  RAISE NOTICE '  ✅ inventory_items';
  RAISE NOTICE '  ✅ inventory_transactions';
  RAISE NOTICE '  ✅ suppliers';
  RAISE NOTICE '  ✅ purchase_orders';
  RAISE NOTICE '  ✅ reviews';
  RAISE NOTICE '  ✅ review_requests';
  RAISE NOTICE '  ✅ webshop_products';
  RAISE NOTICE '  ✅ webshop_categories';
  RAISE NOTICE '  ✅ webshop_settings';
  RAISE NOTICE '  ✅ booking_reminders';
  RAISE NOTICE '  ✅ lead_sources';
  RAISE NOTICE '  ✅ lead_activities';
  RAISE NOTICE '  ✅ notification_settings';
  RAISE NOTICE '';
  RAISE NOTICE 'RLS aktivert på alle tabeller ✅';
  RAISE NOTICE '';
  RAISE NOTICE 'Kjør nå comprehensive-supabase-analysis.mjs';
  RAISE NOTICE 'for å verifisere at alt er på plass!';
  RAISE NOTICE '============================================';
END $$;
