// run-critical-migrations.mjs - Execute SQL directly against Supabase
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

// Read environment variables
const envContent = fs.readFileSync('./lyxso-app/.env.local', 'utf8');
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
console.log('Key:', serviceRoleKey.substring(0, 20) + '...');
console.log('='.repeat(80));

// Read SQL file
const sql = fs.readFileSync('./CRITICAL_MIGRATIONS.sql', 'utf8');

// Split into individual statements
const statements = sql
  .split(/;\s*(?=--|\n|$)/)
  .map(s => s.trim())
  .filter(s => s && !s.startsWith('--') && s.length > 10);

console.log(`\n📋 Found ${statements.length} SQL statements\n`);

// Execute using fetch API directly to Supabase REST API
async function executeSql(sqlQuery) {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({ query: sqlQuery })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

// Try alternative: Use Supabase connection to PostgreSQL directly
const { Pool } = await import('pg').catch(() => null);

if (!Pool) {
  console.log('⚠️  pg module not installed, attempting alternative method...\n');
  console.log('Installing pg module...');
  
  const { execSync } = await import('child_process');
  execSync('npm install pg', { stdio: 'inherit', cwd: './lyxso-app' });
  
  console.log('✅ pg installed, please run this script again.');
  process.exit(0);
}

// Connection string
const connectionString = `postgresql://postgres.gedoxtrdylqxyyvfjmtb:${serviceRoleKey}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`;

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

console.log('📡 Connecting to Supabase PostgreSQL...\n');

try {
  const client = await pool.connect();
  console.log('✅ Connected!\n');
  
  console.log('🔄 Executing migration...\n');
  
  // Execute the entire SQL file as one transaction
  await client.query('BEGIN');
  
  try {
    const result = await client.query(sql);
    await client.query('COMMIT');
    
    console.log('✅ MIGRATION SUCCESSFUL!\n');
    console.log('='.repeat(80));
    console.log('✅ Created:');
    console.log('   - organizations table');
    console.log('   - subscriptions table');
    console.log('   - RLS policies on all tables');
    console.log('='.repeat(80));
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error.message);
    console.error('\nError details:', error);
    
    // Try without transaction for better error reporting
    console.log('\n🔄 Retrying without transaction for detailed errors...\n');
    
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      if (stmt.startsWith('--') || stmt.trim() === '') continue;
      
      try {
        await client.query(stmt);
        successCount++;
        console.log(`✅ Statement ${i+1}/${statements.length} executed`);
      } catch (err) {
        failCount++;
        console.error(`❌ Statement ${i+1} failed:`, err.message);
        // Continue with next statement
      }
    }
    
    console.log('\n' + '='.repeat(80));
    console.log(`📊 Results: ${successCount} succeeded, ${failCount} failed`);
    console.log('='.repeat(80));
  }
  
  client.release();
  
} catch (error) {
  console.error('❌ Connection error:', error.message);
  process.exit(1);
} finally {
  await pool.end();
}

console.log('\n✅ Done!\n');
