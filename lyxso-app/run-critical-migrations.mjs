// run-critical-migrations.mjs - Execute SQL directly against Supabase
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';
import pg from 'pg';

const { Pool } = pg;

// Read environment variables
const envContent = fs.readFileSync('./.env.local', 'utf8');
const parsed = dotenv.parse(envContent);

const supabaseUrl = parsed.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = parsed.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

console.log('🚀 KJØRER KRITISKE MIGRATIONS MOT SUPABASE\n');
console.log('='.repeat(80));
console.log('URL:', supabaseUrl);
console.log('='.repeat(80));

// Read SQL file
const sql = fs.readFileSync('../CRITICAL_MIGRATIONS.sql', 'utf8');

// Use Supabase client instead of direct PostgreSQL connection
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  db: {
    schema: 'public'
  }
});

console.log('\n📡 Connecting to Supabase...\n');

// Split SQL into statements
const statements = sql
  .split(/;[\s\n]+(?=CREATE|ALTER|DROP|DO|COMMENT|--)/g)
  .map(s => s.trim())
  .filter(s => s && s.length > 20 && !s.startsWith('--============'));

console.log(`Found ${statements.length} statements to execute\n`);

let successCount = 0;
let failCount = 0;
const errors = [];

for (let i = 0; i < statements.length; i++) {
  const stmt = statements[i];
  
  // Skip comment-only statements
  if (stmt.trim().startsWith('--')) {
    continue;
  }
  
  try {
    // Execute via Supabase RPC (if available) or use pg directly
    const { error } = await supabase.rpc('exec_sql', { sql_query: stmt });
    
    if (error) {
      // If RPC doesn't exist, we need to use alternative method
      throw new Error(error.message);
    }
    
    successCount++;
    
    // Show progress for key statements
    if (stmt.includes('CREATE TABLE')) {
      const tableName = stmt.match(/CREATE TABLE.*?(\w+)\s*\(/i)?.[1];
      console.log(`✅ [${i+1}/${statements.length}] Created table: ${tableName}`);
    } else if (stmt.includes('ALTER TABLE') && stmt.includes('ENABLE ROW LEVEL SECURITY')) {
      const tableName = stmt.match(/ALTER TABLE.*?(\w+)\s+ENABLE/i)?.[1];
      console.log(`✅ [${i+1}/${statements.length}] Enabled RLS: ${tableName}`);
    } else if (stmt.includes('CREATE POLICY')) {
      const policyName = stmt.match(/CREATE POLICY "([^"]+)"/i)?.[1];
      console.log(`✅ [${i+1}/${statements.length}] Created policy: ${policyName}`);
    } else {
      console.log(`✅ [${i+1}/${statements.length}] Executed`);
    }
    
  } catch (err) {
    failCount++;
    const shortMsg = err.message.split('\n')[0];
    console.error(`❌ [${i+1}/${statements.length}] ${shortMsg.substring(0, 80)}`);
    errors.push({ statement: i+1, error: shortMsg, sql: stmt.substring(0, 100) + '...' });
    
    // Continue with next statement (don't stop on errors)
  }
}

console.log('\n' + '='.repeat(80));
console.log(`📊 MIGRATION SUMMARY`);
console.log('='.repeat(80));
console.log(`✅ Success: ${successCount}`);
console.log(`❌ Failed:  ${failCount}`);
console.log('='.repeat(80));

if (errors.length > 0) {
  console.log('\n⚠️  Some statements failed (this may be expected):');
  errors.slice(0, 5).forEach(e => {
    console.log(`\n   Statement ${e.statement}:`);
    console.log(`   Error: ${e.error}`);
    console.log(`   SQL: ${e.sql}`);
  });
  
  if (errors.length > 5) {
    console.log(`\n   ... and ${errors.length - 5} more errors`);
  }
  
  console.log('\n💡 Common reasons for failures:');
  console.log('   - Tables/policies already exist (safe to ignore)');
  console.log('   - exec_sql RPC function not available (use SQL Editor manually)');
}

console.log('\n✅ Migration attempt complete!\n');
