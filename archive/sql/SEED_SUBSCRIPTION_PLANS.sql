-- ============================================================================
-- SEED DEFAULT SUBSCRIPTION PLANS
-- Task #2: Insert default plans into Supabase
-- Date: 6. desember 2024
-- ============================================================================

-- Delete existing plans (optional - only if reseeding)
-- DELETE FROM subscription_plans;

-- Insert default subscription plans
INSERT INTO subscription_plans (
  id,
  name,
  slug,
  description,
  price_monthly,
  price_yearly,
  currency,
  features,
  limits,
  sort_order,
  is_active,
  is_public
) VALUES
-- ============================================================================
-- GRATIS PLAN
-- ============================================================================
(
  gen_random_uuid(),
  'Gratis',
  'gratis',
  'Perfekt for å teste systemet og komme i gang',
  0,
  0,
  'NOK',
  jsonb_build_object(
    'max_bookings', 10,
    'max_customers', 50,
    'max_users', 1,
    'booking_system', true,
    'customer_crm', true,
    'basic_reports', true,
    'email_support', true
  ),
  jsonb_build_object(
    'bookings_per_month', 10,
    'customers_total', 50,
    'team_members', 1,
    'storage_gb', 1,
    'ai_requests_per_month', 0
  ),
  1,
  true,
  true
),

-- ============================================================================
-- STARTUP PLAN → LYXSO LITE (599 kr/mnd)
-- ============================================================================
(
  gen_random_uuid(),
  'LYXso Lite',
  'lite',
  'For små bilpleiere, mobile detailere og enkeltmannsforetak',
  599,
  5990,
  'NOK',
  jsonb_build_object(
    'max_bookings', 100,
    'max_customers', 500,
    'max_users', 3,
    'booking_system', true,
    'customer_crm', true,
    'dekkhotell', false,
    'coating_jobs', false,
    'basic_reports', true,
    'advanced_reports', false,
    'ai_onboarding', false,
    'ai_chat', false,
    'email_support', true,
    'priority_support', false,
    'multi_location', false,
    'api_access', false,
    'payment_integration', true
  ),
  jsonb_build_object(
    'bookings_per_month', 100,
    'customers_total', 500,
    'team_members', 1,
    'storage_gb', 10,
    'ai_requests_per_month', 0,
    'email_campaigns_per_month', 0
  ),
  2,
  true,
  true
),

-- ============================================================================
-- BUSINESS PLAN → LYXSO PRO (1.499 kr/mnd)
-- ============================================================================
(
  gen_random_uuid(),
  'LYXso Pro',
  'pro',
  'Standard for 80% av markedet',
  1499,
  14990,
  'NOK',
  jsonb_build_object(
    'max_bookings', -1,
    'max_customers', -1,
    'max_users', -1,
    'booking_system', true,
    'customer_crm', true,
    'dekkhotell', true,
    'coating_jobs', true,
    'ppf_jobs', true,
    'basic_reports', true,
    'advanced_reports', true,
    'ai_onboarding', false,
    'ai_chat', false,
    'email_support', true,
    'priority_support', false,
    'multi_location', false,
    'api_access', false,
    'payment_integration', true,
    'review_generator', true,
    'invoicing', true
  ),
  jsonb_build_object(
    'bookings_per_month', -1,
    'customers_total', -1,
    'team_members', -1,
    'storage_gb', 50,
    'ai_requests_per_month', 0,
    'email_campaigns_per_month', 10
  ),
  3,
  true,
  true
),

-- ============================================================================
-- LYXSO POWER (2.490 kr/mnd)
-- ============================================================================
(
  gen_random_uuid(),
  'LYXso Power',
  'power',
  'For profesjonelle verksteder, store bilpleiesentre og skade/PPF',
  2490,
  24900,
  'NOK',
  jsonb_build_object(
    'max_bookings', -1,
    'max_customers', -1,
    'max_users', -1,
    'booking_system', true,
    'customer_crm', true,
    'dekkhotell', true,
    'coating_jobs', true,
    'ppf_jobs', true,
    'basic_reports', true,
    'advanced_reports', true,
    'inventory_management', true,
    'barcode_scanning', true,
    'supplier_hub', true,
    'material_tracking', true,
    'ai_onboarding', false,
    'ai_chat', false,
    'email_support', true,
    'priority_support', true,
    'multi_location', false,
    'api_access', true,
    'payment_integration', true,
    'review_generator', true,
    'invoicing', true
  ),
  jsonb_build_object(
    'bookings_per_month', -1,
    'customers_total', -1,
    'team_members', -1,
    'storage_gb', 100,
    'ai_requests_per_month', 0,
    'email_campaigns_per_month', 50
  ),
  4,
  true,
  true
),

-- ============================================================================
-- LYXSO AI SUITE (2.990 kr/mnd + bruk)
-- ============================================================================
(
  gen_random_uuid(),
  'LYXso AI Suite',
  'ai-suite',
  'Det ultimate AI-systemet for bilbedrifter',
  2990,
  29900,
  'NOK',
  jsonb_build_object(
    'max_bookings', -1,
    'max_customers', -1,
    'max_users', -1,
    'everything_in_power', true,
    'booking_system', true,
    'customer_crm', true,
    'dekkhotell', true,
    'coating_jobs', true,
    'ppf_jobs', true,
    'basic_reports', true,
    'advanced_reports', true,
    'inventory_management', true,
    'barcode_scanning', true,
    'supplier_hub', true,
    'material_tracking', true,
    'ai_booking_agent', true,
    'ai_upsell', true,
    'ai_pricing', true,
    'ai_damage_analysis', true,
    'ai_coating_analysis', true,
    'ai_campaign_generator', true,
    'ai_inventory', true,
    'ai_chat', true,
    'ai_review_generator', true,
    'email_support', true,
    'priority_support', true,
    'multi_location', false,
    'api_access', true,
    'payment_integration', true,
    'review_generator', true,
    'invoicing', true
  ),
  jsonb_build_object(
    'bookings_per_month', -1,
    'customers_total', -1,
    'team_members', -1,
    'storage_gb', 150,
    'ai_requests_per_month', 1000,
    'ai_cost_per_request', 0.49,
    'email_campaigns_per_month', 100
  ),
  5,
  true,
  true
),

-- ============================================================================
-- ENTERPRISE PLAN → LYXSO ENTERPRISE (fra 4.990 kr/mnd)
-- ============================================================================
(
  gen_random_uuid(),
  'LYXso Enterprise',
  'enterprise',
  'For kjeder, bilglass, store verksteder, bilforhandlere',
  4990,
  49900,
  'NOK',
  jsonb_build_object(
    'max_bookings', -1,
    'max_customers', -1,
    'max_users', -1,
    'everything', true,
    'everything_in_ai_suite', true,
    'booking_system', true,
    'customer_crm', true,
    'dekkhotell', true,
    'coating_jobs', true,
    'ppf_jobs', true,
    'basic_reports', true,
    'advanced_reports', true,
    'inventory_management', true,
    'barcode_scanning', true,
    'supplier_hub', true,
    'material_tracking', true,
    'ai_full_suite', true,
    'ai_booking_agent', true,
    'ai_upsell', true,
    'ai_pricing', true,
    'ai_damage_analysis', true,
    'ai_coating_analysis', true,
    'ai_campaign_generator', true,
    'ai_inventory', true,
    'ai_chat', true,
    'ai_review_generator', true,
    'ai_accounting', true,
    'multi_location', true,
    'unlimited_locations', true,
    'central_dashboard', true,
    'central_finance', true,
    'central_pricing', true,
    'central_inventory', true,
    'email_support', true,
    'priority_support', true,
    'dedicated_support', true,
    'api_access', true,
    'custom_domain', true,
    'white_label', true,
    'custom_integrations', true,
    'sla_guarantee', true,
    'payment_integration', true,
    'review_generator', true,
    'invoicing', true
  ),
  jsonb_build_object(
    'bookings_per_month', -1,
    'customers_total', -1,
    'team_members', -1,
    'locations', -1,
    'storage_gb', 500,
    'ai_requests_per_month', -1,
    'email_campaigns_per_month', -1,
    'sms_per_month', -1
  ),
  6,
  true,
  true
);

-- ============================================================================
-- INSERT DEFAULT ADDONS
-- ============================================================================

INSERT INTO addons_catalog (
  id,
  name,
  slug,
  description,
  price_monthly,
  currency,
  category,
  features,
  is_active
) VALUES
-- Extra lagringsplass
(
  gen_random_uuid(),
  'Ekstra lagring 50GB',
  'extra-storage-50gb',
  'Øk lagringskapasiteten med 50GB',
  99,
  'NOK',
  'storage',
  jsonb_build_object(
    'storage_gb', 50
  ),
  true
),

-- AI-pakke
(
  gen_random_uuid(),
  'AI Premium',
  'ai-premium',
  'Ubegrenset tilgang til alle AI-funksjoner',
  499,
  'NOK',
  'ai',
  jsonb_build_object(
    'ai_requests_per_month', -1,
    'ai_full_suite', true
  ),
  true
),

-- SMS-pakke
(
  gen_random_uuid(),
  'SMS 500 stk',
  'sms-500',
  '500 SMS-meldinger per måned',
  199,
  'NOK',
  'communication',
  jsonb_build_object(
    'sms_per_month', 500
  ),
  true
),

-- E-post markedsføring
(
  gen_random_uuid(),
  'E-post kampanjer',
  'email-campaigns',
  '100 e-postkampanjer per måned',
  299,
  'NOK',
  'marketing',
  jsonb_build_object(
    'email_campaigns_per_month', 100
  ),
  true
),

-- White Label
(
  gen_random_uuid(),
  'White Label',
  'white-label',
  'Fjern LYXso-branding og bruk eget domene',
  999,
  'NOK',
  'branding',
  jsonb_build_object(
    'white_label', true,
    'custom_domain', true,
    'remove_branding', true
  ),
  true
);

-- ============================================================================
-- VERIFY INSERTIONS
-- ============================================================================

-- Check plans
SELECT 
  name, 
  slug, 
  price_monthly, 
  price_yearly,
  sort_order
FROM subscription_plans 
ORDER BY sort_order;

-- Check addons
SELECT 
  name, 
  slug, 
  price_monthly,
  category
FROM addons_catalog 
ORDER BY category, name;

-- ============================================================================
-- DONE!
-- ============================================================================
-- Du har nå 6 planer (Gratis, LYXso Lite, LYXso Pro, LYXso Power, LYXso AI Suite, LYXso Enterprise)
-- og 5 addons (Storage, AI, SMS, Email, White Label)
-- ============================================================================
