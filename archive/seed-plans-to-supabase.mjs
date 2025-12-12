// seed-plans-to-supabase.mjs - Seed subscription plans direkte til Supabase
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

// Last environment variables
const envPath = './lyxso-app/.env.local';
const envContent = fs.readFileSync(envPath, 'utf8');
const parsed = dotenv.parse(envContent);

const supabaseUrl = parsed.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = parsed.SUPABASE_SERVICE_ROLE_KEY || parsed.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Mangler Supabase konfigurasjon');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🚀 Starter seeding av subscription plans...\n');

// Step 1: Backup existing plans
console.log('📦 Steg 1: Tar backup av eksisterende planer...');
const { data: existingPlans, error: backupError } = await supabase
  .from('subscription_plans')
  .select('*');

if (!backupError && existingPlans && existingPlans.length > 0) {
  console.log(`   ✅ Backup: ${existingPlans.length} planer`);
  fs.writeFileSync(
    './backup_plans_' + Date.now() + '.json',
    JSON.stringify(existingPlans, null, 2)
  );
  console.log('   💾 Backup lagret til fil\n');
}

// Step 2: Delete existing plans
console.log('🗑️  Steg 2: Sletter gamle planer...');
const { error: deleteError } = await supabase
  .from('subscription_plans')
  .delete()
  .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

if (deleteError) {
  console.log('   ⚠️  Feil ved sletting:', deleteError.message);
} else {
  console.log('   ✅ Gamle planer slettet\n');
}

// Step 3: Insert new plans
console.log('➕ Steg 3: Legger inn nye planer...\n');

const newPlans = [
  {
    name: 'Gratis',
    slug: 'gratis',
    description: 'Perfekt for å teste systemet og komme i gang',
    price_monthly: 0,
    price_yearly: 0,
    currency: 'NOK',
    features: {
      max_bookings: 10,
      max_customers: 50,
      max_users: 1,
      booking_system: true,
      customer_crm: true,
      basic_reports: true,
      email_support: true
    },
    limits: {
      bookings_per_month: 10,
      customers_total: 50,
      team_members: 1,
      storage_gb: 1,
      ai_requests_per_month: 0
    },
    sort_order: 1,
    is_active: true,
    is_public: true
  },
  {
    name: 'LYXso Lite',
    slug: 'lite',
    description: 'For små bilpleiere, mobile detailere og enkeltmannsforetak',
    price_monthly: 599,
    price_yearly: 5990,
    currency: 'NOK',
    features: {
      max_bookings: 100,
      max_customers: 500,
      max_users: 3,
      booking_system: true,
      customer_crm: true,
      dekkhotell: false,
      coating_jobs: false,
      basic_reports: true,
      advanced_reports: false,
      ai_onboarding: false,
      ai_chat: false,
      email_support: true,
      priority_support: false,
      multi_location: false,
      api_access: false,
      payment_integration: true
    },
    limits: {
      bookings_per_month: 100,
      customers_total: 500,
      team_members: 1,
      storage_gb: 10,
      ai_requests_per_month: 0,
      email_campaigns_per_month: 0
    },
    sort_order: 2,
    is_active: true,
    is_public: true
  },
  {
    name: 'LYXso Pro',
    slug: 'pro',
    description: 'Standard for 80% av markedet',
    price_monthly: 1499,
    price_yearly: 14990,
    currency: 'NOK',
    features: {
      max_bookings: -1,
      max_customers: -1,
      max_users: -1,
      booking_system: true,
      customer_crm: true,
      dekkhotell: true,
      coating_jobs: true,
      ppf_jobs: true,
      basic_reports: true,
      advanced_reports: true,
      ai_onboarding: false,
      ai_chat: false,
      email_support: true,
      priority_support: false,
      multi_location: false,
      api_access: false,
      payment_integration: true,
      review_generator: true,
      invoicing: true
    },
    limits: {
      bookings_per_month: -1,
      customers_total: -1,
      team_members: -1,
      storage_gb: 50,
      ai_requests_per_month: 0,
      email_campaigns_per_month: 10
    },
    sort_order: 3,
    is_active: true,
    is_public: true
  },
  {
    name: 'LYXso Power',
    slug: 'power',
    description: 'For profesjonelle verksteder, store bilpleiesentre og skade/PPF',
    price_monthly: 2490,
    price_yearly: 24900,
    currency: 'NOK',
    features: {
      max_bookings: -1,
      max_customers: -1,
      max_users: -1,
      booking_system: true,
      customer_crm: true,
      dekkhotell: true,
      coating_jobs: true,
      ppf_jobs: true,
      basic_reports: true,
      advanced_reports: true,
      inventory_management: true,
      barcode_scanning: true,
      supplier_hub: true,
      material_tracking: true,
      ai_onboarding: false,
      ai_chat: false,
      email_support: true,
      priority_support: true,
      multi_location: false,
      api_access: true,
      payment_integration: true,
      review_generator: true,
      invoicing: true
    },
    limits: {
      bookings_per_month: -1,
      customers_total: -1,
      team_members: -1,
      storage_gb: 100,
      ai_requests_per_month: 0,
      email_campaigns_per_month: 50
    },
    sort_order: 4,
    is_active: true,
    is_public: true
  },
  {
    name: 'LYXso AI Suite',
    slug: 'ai-suite',
    description: 'Det ultimate AI-systemet for bilbedrifter',
    price_monthly: 2990,
    price_yearly: 29900,
    currency: 'NOK',
    features: {
      max_bookings: -1,
      max_customers: -1,
      max_users: -1,
      everything_in_power: true,
      booking_system: true,
      customer_crm: true,
      dekkhotell: true,
      coating_jobs: true,
      ppf_jobs: true,
      basic_reports: true,
      advanced_reports: true,
      inventory_management: true,
      barcode_scanning: true,
      supplier_hub: true,
      material_tracking: true,
      ai_booking_agent: true,
      ai_upsell: true,
      ai_pricing: true,
      ai_damage_analysis: true,
      ai_coating_analysis: true,
      ai_campaign_generator: true,
      ai_inventory: true,
      ai_chat: true,
      ai_review_generator: true,
      email_support: true,
      priority_support: true,
      multi_location: false,
      api_access: true,
      payment_integration: true,
      review_generator: true,
      invoicing: true
    },
    limits: {
      bookings_per_month: -1,
      customers_total: -1,
      team_members: -1,
      storage_gb: 150,
      ai_requests_per_month: 1000,
      ai_cost_per_request: 0.49,
      email_campaigns_per_month: 100
    },
    sort_order: 5,
    is_active: true,
    is_public: true
  },
  {
    name: 'LYXso Enterprise',
    slug: 'enterprise',
    description: 'For kjeder, bilglass, store verksteder, bilforhandlere',
    price_monthly: 4990,
    price_yearly: 49900,
    currency: 'NOK',
    features: {
      max_bookings: -1,
      max_customers: -1,
      max_users: -1,
      everything: true,
      everything_in_ai_suite: true,
      booking_system: true,
      customer_crm: true,
      dekkhotell: true,
      coating_jobs: true,
      ppf_jobs: true,
      basic_reports: true,
      advanced_reports: true,
      inventory_management: true,
      barcode_scanning: true,
      supplier_hub: true,
      material_tracking: true,
      ai_full_suite: true,
      ai_booking_agent: true,
      ai_upsell: true,
      ai_pricing: true,
      ai_damage_analysis: true,
      ai_coating_analysis: true,
      ai_campaign_generator: true,
      ai_inventory: true,
      ai_chat: true,
      ai_review_generator: true,
      ai_accounting: true,
      multi_location: true,
      unlimited_locations: true,
      central_dashboard: true,
      central_finance: true,
      central_pricing: true,
      central_inventory: true,
      email_support: true,
      priority_support: true,
      dedicated_support: true,
      api_access: true,
      custom_domain: true,
      white_label: true,
      custom_integrations: true,
      sla_guarantee: true,
      payment_integration: true,
      review_generator: true,
      invoicing: true
    },
    limits: {
      bookings_per_month: -1,
      customers_total: -1,
      team_members: -1,
      locations: -1,
      storage_gb: 500,
      ai_requests_per_month: -1,
      email_campaigns_per_month: -1,
      sms_per_month: -1
    },
    sort_order: 6,
    is_active: true,
    is_public: true
  }
];

for (const plan of newPlans) {
  const { data, error } = await supabase
    .from('subscription_plans')
    .insert(plan)
    .select()
    .single();
  
  if (error) {
    console.log(`   ❌ Feil ved ${plan.name}:`, error.message);
  } else {
    console.log(`   ✅ ${plan.name} (${plan.slug}) - ${plan.price_monthly} kr/mnd`);
  }
}

// Step 4: Delete existing addons
console.log('\n🗑️  Steg 4: Sletter gamle addons...');
const { error: deleteAddonsError } = await supabase
  .from('addons_catalog')
  .delete()
  .neq('id', '00000000-0000-0000-0000-000000000000');

if (!deleteAddonsError) {
  console.log('   ✅ Gamle addons slettet\n');
}

// Step 5: Insert new addons
console.log('➕ Steg 5: Legger inn nye addons...\n');

const newAddons = [
  {
    name: 'Ekstra lagring 50GB',
    slug: 'extra-storage-50gb',
    description: 'Øk lagringskapasiteten med 50GB',
    price_monthly: 99,
    currency: 'NOK',
    category: 'storage',
    features: { storage_gb: 50 },
    is_active: true
  },
  {
    name: 'AI Premium',
    slug: 'ai-premium',
    description: 'Ubegrenset tilgang til alle AI-funksjoner',
    price_monthly: 499,
    currency: 'NOK',
    category: 'ai',
    features: { ai_requests_per_month: -1, ai_full_suite: true },
    is_active: true
  },
  {
    name: 'SMS 500 stk',
    slug: 'sms-500',
    description: '500 SMS-meldinger per måned',
    price_monthly: 199,
    currency: 'NOK',
    category: 'communication',
    features: { sms_per_month: 500 },
    is_active: true
  },
  {
    name: 'E-post kampanjer',
    slug: 'email-campaigns',
    description: '100 e-postkampanjer per måned',
    price_monthly: 299,
    currency: 'NOK',
    category: 'marketing',
    features: { email_campaigns_per_month: 100 },
    is_active: true
  },
  {
    name: 'White Label',
    slug: 'white-label',
    description: 'Fjern LYXso-branding og bruk eget domene',
    price_monthly: 999,
    currency: 'NOK',
    category: 'branding',
    features: { white_label: true, custom_domain: true, remove_branding: true },
    is_active: true
  }
];

for (const addon of newAddons) {
  const { data, error } = await supabase
    .from('addons_catalog')
    .insert(addon)
    .select()
    .single();
  
  if (error) {
    console.log(`   ❌ Feil ved ${addon.name}:`, error.message);
  } else {
    console.log(`   ✅ ${addon.name} (${addon.category}) - ${addon.price_monthly} kr/mnd`);
  }
}

// Step 6: Verify
console.log('\n✅ Steg 6: Verifiserer...\n');

const { data: finalPlans } = await supabase
  .from('subscription_plans')
  .select('name, slug, price_monthly, sort_order')
  .order('sort_order');

const { data: finalAddons } = await supabase
  .from('addons_catalog')
  .select('name, slug, price_monthly')
  .order('category, name');

console.log('📊 RESULTAT:\n');
console.log(`   Planer: ${finalPlans?.length || 0} / 6`);
console.log(`   Addons: ${finalAddons?.length || 0} / 5\n`);

if (finalPlans?.length === 6 && finalAddons?.length === 5) {
  console.log('🎉 SUKSESS! Alle planer og addons er seeded!\n');
} else {
  console.log('⚠️  Noe gikk galt. Sjekk Supabase manuelt.\n');
}
