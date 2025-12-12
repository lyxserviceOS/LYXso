// comprehensive-supabase-analysis.mjs
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

const envContent = fs.readFileSync('.env.local', 'utf8');
const parsed = dotenv.parse(envContent);

const supabase = createClient(
  parsed.NEXT_PUBLIC_SUPABASE_URL,
  parsed.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

console.log('🔍 COMPREHENSIVE SUPABASE DATABASE ANALYSIS\n');
console.log('='.repeat(80));

// All tables we expect based on codebase
const expectedTables = {
  core: ['organizations', 'users', 'user_profiles', 'org_users'],
  customers: ['customers', 'customer_vehicles', 'customer_notes'],
  booking: ['bookings', 'booking_services', 'recurring_bookings', 'booking_reminders'],
  services: ['services', 'service_categories', 'service_pricing'],
  employees: ['employees', 'employee_schedules', 'employee_services', 'time_tracking'],
  subscription: ['subscription_plans', 'subscriptions', 'org_addons', 'addons_catalog'],
  payments: ['payments', 'invoices', 'payment_methods', 'payment_providers'],
  vehicles: ['vehicles', 'vehicle_makes', 'vehicle_models'],
  tire_hotel: ['tyre_sets', 'tyre_images', 'tyre_ai_analysis'],
  coating: ['coating_jobs', 'coating_certificates', 'ppf_jobs'],
  inventory: ['inventory_items', 'inventory_transactions', 'suppliers', 'purchase_orders'],
  products: ['products', 'product_categories', 'product_variants'],
  marketing: ['marketing_campaigns', 'marketing_posts', 'social_automation', 'landing_pages'],
  leads: ['leads', 'lead_sources', 'lead_activities'],
  reviews: ['reviews', 'review_requests'],
  locations: ['locations', 'org_settings'],
  ai: ['ai_conversations', 'ai_messages', 'ai_onboarding_sessions', 'ai_voice_sessions', 'ai_agent_config'],
  webshop: ['webshop_products', 'webshop_categories', 'webshop_orders', 'webshop_settings'],
  partners: ['partner_signups', 'partner_landing_pages'],
  notifications: ['notifications', 'notification_settings'],
  reports: ['reports', 'report_schedules']
};

const results = {
  found: [],
  missing: [],
  details: {}
};

console.log('\n📊 Checking tables...\n');

for (const [category, tables] of Object.entries(expectedTables)) {
  console.log(`\n${category.toUpperCase()}:`);
  
  for (const tableName of tables) {
    const { data, error } = await supabase.from(tableName).select('*').limit(0);
    
    if (!error) {
      results.found.push(tableName);
      console.log(`  ✅ ${tableName}`);
      
      // Get column info
      const { data: sample } = await supabase.from(tableName).select('*').limit(1);
      if (sample && sample[0]) {
        results.details[tableName] = {
          columns: Object.keys(sample[0]),
          count: (await supabase.from(tableName).select('id', { count: 'exact', head: true })).count || 0
        };
      }
    } else {
      results.missing.push(tableName);
      console.log(`  ❌ ${tableName} - ${error.message}`);
    }
  }
}

console.log('\n' + '='.repeat(80));
console.log('\n📈 SUMMARY:\n');
console.log(`✅ Found: ${results.found.length} tables`);
console.log(`❌ Missing: ${results.missing.length} tables`);
console.log(`📊 Total expected: ${Object.values(expectedTables).flat().length} tables`);

console.log('\n📋 MISSING TABLES:\n');
results.missing.forEach(t => console.log(`  - ${t}`));

// Save detailed results
fs.writeFileSync('./supabase_analysis_complete.json', JSON.stringify(results, null, 2));
console.log('\n💾 Full analysis saved to: supabase_analysis_complete.json\n');

// Check RLS status
console.log('🔒 Checking RLS status on found tables...\n');
for (const tableName of results.found.slice(0, 10)) {
  // Try to query without auth to see if RLS blocks
  const anonSupabase = createClient(
    parsed.NEXT_PUBLIC_SUPABASE_URL,
    parsed.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  const { error } = await anonSupabase.from(tableName).select('id').limit(1);
  const rlsStatus = error && error.message.includes('row-level security') ? '✅ RLS Active' : '⚠️  RLS Off?';
  console.log(`  ${tableName}: ${rlsStatus}`);
}

console.log('\n='.repeat(80));
console.log('✅ Analysis complete!\n');
