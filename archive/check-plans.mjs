// check-plans.mjs - Sjekk subscription plans i Supabase
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

// Last .env.local fra lyxso-app
const envPath = join(process.cwd(), 'lyxso-app', '.env.local');
try {
  const envConfig = dotenv.parse(readFileSync(envPath));
  for (const key in envConfig) {
    process.env[key] = envConfig[key];
  }
  console.log('✅ Lastet .env.local fra lyxso-app\n');
} catch (err) {
  console.log('⚠️  Kunne ikke laste .env.local:', err.message);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Mangler Supabase konfigurasjon i .env.local');
  console.log('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '✅' : '❌');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 Sjekker subscription_plans i Supabase...\n');

const { data, error } = await supabase
  .from('subscription_plans')
  .select('id, name, slug, price_monthly, price_yearly, sort_order, is_active')
  .order('sort_order');

if (error) {
  console.log('❌ Feil ved henting av planer:', error.message);
  console.log('\n💡 Mulige årsaker:');
  console.log('   - Tabellen subscription_plans eksisterer ikke');
  console.log('   - RLS policies blokkerer tilgang');
  console.log('   - Feil i Supabase nøkkel');
  process.exit(1);
}

if (!data || data.length === 0) {
  console.log('❌ Ingen planer funnet i databasen!\n');
  console.log('📝 KONKLUSJON: SEED_SUBSCRIPTION_PLANS.sql må kjøres.\n');
  console.log('👉 Kjør følgende SQL i Supabase SQL Editor:');
  console.log('   https://supabase.com/dashboard/project/gedoxtrdylqxyyvfjmtb/sql\n');
} else {
  console.log(`✅ Fant ${data.length} planer i databasen:\n`);
  data.forEach(plan => {
    console.log(`   ${plan.sort_order}. ${plan.name} (${plan.slug})`);
    console.log(`      Måned: ${plan.price_monthly} kr | År: ${plan.price_yearly} kr`);
    console.log(`      Aktiv: ${plan.is_active ? '✅' : '❌'}\n`);
  });
  
  console.log('✅ KONKLUSJON: Planer er allerede seeded!\n');
  console.log('📝 SEED_SUBSCRIPTION_PLANS.sql trenger IKKE kjøres.\n');
}

// Sjekk også addons
const { data: addons, error: addonsError } = await supabase
  .from('addons_catalog')
  .select('id, name, slug, price_monthly, category, is_active')
  .order('category, name');

if (!addonsError && addons && addons.length > 0) {
  console.log(`✅ Fant ${addons.length} addons:\n`);
  addons.forEach(addon => {
    console.log(`   - ${addon.name} (${addon.slug}): ${addon.price_monthly} kr/mnd`);
  });
} else if (!addonsError) {
  console.log('⚠️  Ingen addons funnet (kan være OK)');
}
