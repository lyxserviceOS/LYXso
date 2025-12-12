#!/usr/bin/env node
// fix-rls-queries.mjs - Analyserer og fikser RLS queries

import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL || 'https://jvyndhoxkxqkztqawxns.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY ikke funnet i .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 Analyserer API-ruter for RLS compliance...\n');

// Tabeller som KREVER org_id filter
const MULTI_TENANT_TABLES = [
  'bookings',
  'customers',
  'services',
  'employees',
  'products',
  'vehicles',
  'tyre_sets',
  'storage_locations',
  'customer_vehicles',
  'lead_forms',
  'leads',
  'marketing_campaigns',
  'ai_agent_configs',
  'ai_conversations',
  'ai_messages',
  'ai_onboarding_sessions',
  'ai_voice_sessions',
  'coating_projects',
  'coating_certificates',
  'accounting_transactions',
  'public_pages',
  'partner_landing_pages',
  'addons',
  'social_automation_posts',
  'recurring_bookings'
];

// Finn alle .mjs filer i routes katalogen
function findRouteFiles(dir) {
  const files = [];
  const items = readdirSync(dir);
  
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...findRouteFiles(fullPath));
    } else if (extname(item) === '.mjs' || extname(item) === '.js') {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Analyser en fil for Supabase queries
function analyzeFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const relativePath = filePath.replace(process.cwd(), '');
  
  const issues = [];
  
  // Finn alle .from() kall
  const fromRegex = /supabase\.from\(['"`](\w+)['"`]\)/g;
  let match;
  
  while ((match = fromRegex.exec(content)) !== null) {
    const table = match[1];
    const lineNumber = content.substring(0, match.index).split('\n').length;
    
    if (MULTI_TENANT_TABLES.includes(table)) {
      // Sjekk om det er .eq('org_id' nær kallet
      const contextStart = Math.max(0, match.index - 200);
      const contextEnd = Math.min(content.length, match.index + 500);
      const context = content.substring(contextStart, contextEnd);
      
      const hasOrgIdFilter = /\.eq\(['"`]org_id['"`]/.test(context);
      
      if (!hasOrgIdFilter) {
        issues.push({
          file: relativePath,
          line: lineNumber,
          table: table,
          issue: 'Mangler org_id filter',
          severity: 'HIGH',
          context: context.substring(0, 150).replace(/\n/g, ' ')
        });
      }
    }
  }
  
  return issues;
}

// Hovedanalyse
async function main() {
  const apiRoutesDir = join(process.cwd(), 'lyx-api', 'routes');
  const routeFiles = findRouteFiles(apiRoutesDir);
  
  console.log(`📁 Fant ${routeFiles.length} route-filer\n`);
  
  const allIssues = [];
  
  for (const file of routeFiles) {
    const issues = analyzeFile(file);
    allIssues.push(...issues);
  }
  
  // Grupper etter alvorlighetsgrad
  const highPriority = allIssues.filter(i => i.severity === 'HIGH');
  
  console.log('\n📊 RESULTAT:\n');
  console.log(`✅ Totalt ${routeFiles.length} filer analysert`);
  console.log(`⚠️  Fant ${allIssues.length} potensielle RLS-problemer\n`);
  
  if (highPriority.length > 0) {
    console.log('🚨 HØYPRIORITETS ISSUES (mangler org_id filter):\n');
    
    // Grupper etter fil
    const byFile = {};
    for (const issue of highPriority) {
      if (!byFile[issue.file]) byFile[issue.file] = [];
      byFile[issue.file].push(issue);
    }
    
    for (const [file, issues] of Object.entries(byFile)) {
      console.log(`\n📄 ${file}`);
      for (const issue of issues) {
        console.log(`  ⚠️  Linje ${issue.line}: ${issue.table} - ${issue.issue}`);
        console.log(`     ${issue.context.substring(0, 100)}...`);
      }
    }
  }
  
  // Generer rapport
  const report = {
    analyzed: routeFiles.length,
    issues: allIssues.length,
    high_priority: highPriority.length,
    details: allIssues,
    timestamp: new Date().toISOString()
  };
  
  writeFileSync('RLS_ANALYSE_RAPPORT.json', JSON.stringify(report, null, 2));
  console.log('\n✅ Rapport lagret til RLS_ANALYSE_RAPPORT.json');
  
  // Test database connection og RLS policies
  console.log('\n\n🔐 Tester RLS policies i Supabase...\n');
  
  for (const table of MULTI_TENANT_TABLES.slice(0, 5)) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('id, org_id')
        .limit(1);
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: RLS aktiv, returnerte ${data?.length || 0} rader`);
      }
    } catch (err) {
      console.log(`⚠️  ${table}: ${err.message}`);
    }
  }
  
  console.log('\n\n🎯 NESTE STEG:');
  console.log('\n1. Fiks queries som mangler org_id filter');
  console.log('2. Test med to forskjellige org_id verdier');
  console.log('3. Verifiser at data er isolert mellom orgs');
  console.log('\n💡 TIP: Bruk hjelpefunksjoner:');
  console.log('   - getUserOrgId(request) for å hente org_id fra JWT');
  console.log('   - .eq("org_id", org_id) på alle multi-tenant queries\n');
}

main().catch(console.error);
