-- ============================================================================
-- OPPDATER EKSISTERENDE SUBSCRIPTION PLANS TIL NYE PRISER
-- Kjør denne i Supabase SQL Editor for å bypasse RLS
-- ============================================================================

-- Først: Backup eksisterende data
CREATE TEMP TABLE backup_plans AS SELECT * FROM subscription_plans;

-- Slett gamle planer
DELETE FROM subscription_plans;

-- Sett inn 6 nye planer med riktig struktur
INSERT INTO subscription_plans (
  name,
  slug,
  description,
  tagline,
  price_monthly,
  price_yearly,
  features,
  included_modules,
  max_users,
  max_customers,
  max_bookings_per_month,
  max_storage_gb,
  max_locations,
  max_ai_requests_per_month,
  is_active,
  is_featured,
  sort_order,
  color
) VALUES
-- 1. GRATIS
(
  'Gratis',
  'gratis',
  'Perfekt for å teste systemet og komme i gang',
  'Test gratis',
  0,
  0,
  '{"booking_system": true, "customer_crm": true, "basic_reports": true, "email_support": true}'::jsonb,
  ARRAY['booking', 'customers']::text[],
  1,
  50,
  10,
  1,
  1,
  0,
  true,
  false,
  1,
  'gray'
),

-- 2. LYXSO LITE (599 kr/mnd)
(
  'LYXso Lite',
  'lite',
  'For små bilpleiere, mobile detailere og enkeltmannsforetak',
  'Kom i gang',
  599,
  5990,
  '{"booking_system": true, "customer_crm": true, "payment_integration": true, "basic_reports": true, "email_support": true}'::jsonb,
  ARRAY['booking', 'customers', 'payments']::text[],
  3,
  500,
  100,
  10,
  1,
  0,
  true,
  false,
  2,
  'blue'
),

-- 3. LYXSO PRO (1.499 kr/mnd)
(
  'LYXso Pro',
  'pro',
  'Standard for 80% av markedet',
  'Mest populær',
  1499,
  14990,
  '{"booking_system": true, "customer_crm": true, "dekkhotell": true, "coating_jobs": true, "ppf_jobs": true, "advanced_reports": true, "invoicing": true, "review_generator": true, "email_support": true}'::jsonb,
  ARRAY['booking', 'customers', 'tire_hotel', 'coating', 'reports', 'invoicing']::text[],
  -1,
  -1,
  -1,
  50,
  1,
  0,
  true,
  true,
  3,
  'indigo'
),

-- 4. LYXSO POWER (2.490 kr/mnd)
(
  'LYXso Power',
  'power',
  'For profesjonelle verksteder, store bilpleiesentre og skade/PPF',
  'Full kraft',
  2490,
  24900,
  '{"everything_in_pro": true, "inventory_management": true, "barcode_scanning": true, "supplier_hub": true, "material_tracking": true, "priority_support": true, "api_access": true, "email_support": true}'::jsonb,
  ARRAY['booking', 'customers', 'tire_hotel', 'coating', 'inventory', 'reports', 'api']::text[],
  -1,
  -1,
  -1,
  100,
  1,
  0,
  true,
  false,
  4,
  'purple'
),

-- 5. LYXSO AI SUITE (2.990 kr/mnd)
(
  'LYXso AI Suite',
  'ai-suite',
  'Det ultimate AI-systemet for bilbedrifter',
  'AI-drevet',
  2990,
  29900,
  '{"everything_in_power": true, "ai_booking_agent": true, "ai_upsell": true, "ai_pricing": true, "ai_damage_analysis": true, "ai_coating_analysis": true, "ai_campaign_generator": true, "ai_inventory": true, "ai_chat": true, "ai_review_generator": true, "priority_support": true, "api_access": true}'::jsonb,
  ARRAY['booking', 'customers', 'tire_hotel', 'coating', 'inventory', 'reports', 'api', 'ai_suite']::text[],
  -1,
  -1,
  -1,
  150,
  1,
  1000,
  true,
  false,
  5,
  'pink'
),

-- 6. LYXSO ENTERPRISE (4.990 kr/mnd)
(
  'LYXso Enterprise',
  'enterprise',
  'For kjeder, bilglass, store verksteder, bilforhandlere',
  'Ubegrenset',
  4990,
  49900,
  '{"everything": true, "everything_in_ai_suite": true, "multi_location": true, "unlimited_locations": true, "central_dashboard": true, "central_finance": true, "central_pricing": true, "central_inventory": true, "white_label": true, "custom_domain": true, "dedicated_support": true, "sla_guarantee": true, "custom_integrations": true, "api_access": true}'::jsonb,
  ARRAY['all']::text[],
  -1,
  -1,
  -1,
  500,
  -1,
  -1,
  true,
  false,
  6,
  'amber'
);

-- ============================================================================
-- OPPRETT ADDONS (valgfritt - kan hoppes over hvis category constraint feiler)
-- ============================================================================

-- Kommentert ut siden category har constraints vi ikke kjenner til
-- Kjør dette separat hvis ønskelig:

/*
DELETE FROM addons_catalog;

INSERT INTO addons_catalog (
  name,
  slug,
  description,
  tagline,
  price_monthly,
  category,
  features,
  is_active,
  sort_order
) VALUES
(
  'Ekstra lagring 50GB',
  'extra-storage-50gb',
  'Øk lagringskapasiteten med 50GB',
  '50GB ekstra',
  99,
  'storage',  -- Sjekk at dette er en gyldig category
  '{"storage_gb": 50}'::jsonb,
  true,
  1
),
(
  'AI Premium',
  'ai-premium',
  'Ubegrenset tilgang til alle AI-funksjoner',
  'Ubegrenset AI',
  499,
  'ai',
  '{"ai_requests_per_month": -1, "ai_full_suite": true}'::jsonb,
  true,
  2
),
(
  'SMS-pakke',
  'sms-500',
  '500 SMS-meldinger per måned',
  '500 SMS/mnd',
  199,
  'messaging',  -- Prøv 'messaging' i stedet for 'communication'
  '{"sms_per_month": 500}'::jsonb,
  true,
  3
),
(
  'E-post kampanjer',
  'email-campaigns',
  '100 e-postkampanjer per måned',
  '100 kampanjer',
  299,
  'marketing',
  '{"email_campaigns_per_month": 100}'::jsonb,
  true,
  4
),
(
  'White Label',
  'white-label',
  'Fjern LYXso-branding og bruk eget domene',
  'Ditt merke',
  999,
  'branding',
  '{"white_label": true, "custom_domain": true, "remove_branding": true}'::jsonb,
  true,
  5
);
*/

-- ============================================================================
-- VERIFISER
-- ============================================================================

SELECT 
  name, 
  slug, 
  price_monthly, 
  price_yearly,
  sort_order,
  is_active
FROM subscription_plans 
ORDER BY sort_order;

-- ============================================================================
-- SUKSESS!
-- ============================================================================
-- Du har nå 6 moderne planer med oppdaterte priser:
-- 1. Gratis (0 kr)
-- 2. LYXso Lite (599 kr/mnd)
-- 3. LYXso Pro (1499 kr/mnd) - Mest populær
-- 4. LYXso Power (2490 kr/mnd)
-- 5. LYXso AI Suite (2990 kr/mnd)
-- 6. LYXso Enterprise (4990 kr/mnd)
-- ============================================================================
