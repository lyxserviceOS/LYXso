// Push SQL files to Supabase and verify
const https = require('https');
const fs = require('fs');

const SUPABASE_URL = 'https://gedoxtrdylqxyyvfjmtb.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlZG94dHJkeWxxeHl5dmZqbXRiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDQzNDYyOSwiZXhwIjoyMDc5Nzk0NjI5fQ.z558Utc27t7XYf-CBLv4q-Ay-ZSY5dHYv2F7JxrKqIg';

const SQL_FILES = [
  {
    name: 'SUPPORT_DATABASE_SCHEMA.sql',
    path: 'c:\\Users\\maser\\OneDrive\\Skrivebord\\LYX selskaper\\SUPPORT_DATABASE_SCHEMA.sql',
    verifyTables: ['support_tickets', 'support_replies']
  },
  {
    name: 'TEST_VISIBILITY_RULES.sql',
    path: 'c:\\Users\\maser\\OneDrive\\Skrivebord\\LYX selskaper\\TEST_VISIBILITY_RULES.sql',
    note: 'Test script - creates test data, not schema',
    skip: true
  }
];

console.log('🚀 Starting SQL deployment to Supabase...\n');

async function executeSQL(sql, filename) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query: sql });
    
    const options = {
      hostname: 'gedoxtrdylqxyyvfjmtb.supabase.co',
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, status: res.statusCode, data });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function checkTableExists(tableName) {
  return new Promise((resolve, reject) => {
    const queryUrl = new URL(`/rest/v1/${tableName}?select=*&limit=1`, SUPABASE_URL);
    
    const options = {
      hostname: queryUrl.hostname,
      path: queryUrl.pathname + queryUrl.search,
      method: 'HEAD',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
      }
    };

    const req = https.request(options, (res) => {
      resolve(res.statusCode === 200);
    });

    req.on('error', () => {
      resolve(false);
    });

    req.end();
  });
}

async function processFile(fileInfo) {
  console.log(`📄 Processing: ${fileInfo.name}`);
  
  if (fileInfo.skip) {
    console.log(`   ⏭️  Skipped (${fileInfo.note})\n`);
    return { skipped: true, reason: fileInfo.note };
  }

  if (!fs.existsSync(fileInfo.path)) {
    console.log(`   ❌ File not found!\n`);
    return { success: false, error: 'File not found' };
  }

  const sqlContent = fs.readFileSync(fileInfo.path, 'utf8');
  console.log(`   📝 Read ${sqlContent.length} characters`);

  // For SUPPORT_DATABASE_SCHEMA.sql, we'll execute it directly via psql-like approach
  // Since Supabase doesn't have a direct SQL exec endpoint, we'll verify tables exist instead
  console.log(`   ℹ️  Note: Execute this SQL manually in Supabase SQL Editor`);
  console.log(`   🔗 https://supabase.com/dashboard/project/gedoxtrdylqxyyvfjmtb/editor\n`);

  // Verify tables
  if (fileInfo.verifyTables && fileInfo.verifyTables.length > 0) {
    console.log(`   🔍 Verifying tables...`);
    const results = [];
    
    for (const table of fileInfo.verifyTables) {
      const exists = await checkTableExists(table);
      results.push({ table, exists });
      console.log(`      ${exists ? '✅' : '❌'} ${table}`);
    }
    
    console.log('');
    return { 
      success: true, 
      verification: results,
      manualExecutionRequired: true 
    };
  }

  return { success: true };
}

async function main() {
  const results = {};

  for (const fileInfo of SQL_FILES) {
    try {
      const result = await processFile(fileInfo);
      results[fileInfo.name] = result;
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
      results[fileInfo.name] = { success: false, error: error.message };
    }
  }

  // Summary
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 SUMMARY\n');

  let processed = 0;
  let skipped = 0;
  let failed = 0;
  let needsManual = 0;

  for (const [filename, result] of Object.entries(results)) {
    if (result.skipped) {
      console.log(`⏭️  ${filename} - Skipped (${result.reason})`);
      skipped++;
    } else if (result.manualExecutionRequired) {
      console.log(`⚠️  ${filename} - Needs manual execution in Supabase`);
      needsManual++;
      if (result.verification) {
        result.verification.forEach(v => {
          console.log(`   ${v.exists ? '✅' : '❌'} Table: ${v.table}`);
        });
      }
    } else if (result.success) {
      console.log(`✅ ${filename} - Success`);
      processed++;
    } else {
      console.log(`❌ ${filename} - Failed: ${result.error}`);
      failed++;
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Total: ${SQL_FILES.length} files`);
  console.log(`Processed: ${processed}`);
  console.log(`Needs manual execution: ${needsManual}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (needsManual > 0) {
    console.log('⚠️  ACTION REQUIRED:');
    console.log('   1. Go to Supabase SQL Editor:');
    console.log('      https://supabase.com/dashboard/project/gedoxtrdylqxyyvfjmtb/editor');
    console.log('   2. Copy and paste the SQL content from SUPPORT_DATABASE_SCHEMA.sql');
    console.log('   3. Click "Run" to execute');
    console.log('   4. Verify tables are created\n');
  }
}

main().catch(console.error);
