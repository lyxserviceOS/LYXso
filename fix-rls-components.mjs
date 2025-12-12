#!/usr/bin/env node
/**
 * Automatic RLS Component Fixer
 * Updates all Supabase queries to include org_id filtering
 */

import { readFile, writeFile, readdir } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const APP_DIR = join(__dirname, 'lyxso-app', 'src', 'app');
const COMPONENTS_DIR = join(__dirname, 'lyxso-app', 'src', 'components');

// Tables that should be filtered by org_id
const MULTI_TENANT_TABLES = [
  'bookings',
  'customers', 
  'vehicles',
  'tires',
  'tire_storage',
  'invoices',
  'booking_services',
  'addons',
  'subscription_addons'
];

// Tables that should NOT be filtered (global/shared data)
const GLOBAL_TABLES = [
  'users',
  'organizations',
  'subscription_plans',
  'org_members'
];

async function getAllFiles(dir, fileList = []) {
  const files = await readdir(dir, { withFileTypes: true });
  
  for (const file of files) {
    const filePath = join(dir, file.name);
    
    if (file.isDirectory()) {
      if (!file.name.startsWith('.') && file.name !== 'node_modules') {
        await getAllFiles(filePath, fileList);
      }
    } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

function needsOrgIdFilter(tableName) {
  return MULTI_TENANT_TABLES.includes(tableName);
}

function addOrgIdToQuery(content) {
  let modified = false;
  let newContent = content;
  
  // Pattern 1: Add .eq('org_id', org_id) after .from() for multi-tenant tables
  const fromPattern = /\.from\(['"](\w+)['"]\)/g;
  newContent = newContent.replace(fromPattern, (match, tableName) => {
    if (needsOrgIdFilter(tableName)) {
      // Check if org_id filter already exists nearby
      const matchIndex = newContent.indexOf(match);
      const contextStart = Math.max(0, matchIndex - 100);
      const contextEnd = Math.min(newContent.length, matchIndex + 200);
      const context = newContent.substring(contextStart, contextEnd);
      
      if (!context.includes(".eq('org_id'") && !context.includes('.eq("org_id"')) {
        modified = true;
        return `${match}.eq('org_id', org_id)`;
      }
    }
    return match;
  });
  
  return { content: newContent, modified };
}

async function fixFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf-8');
    
    // Skip if no Supabase queries
    if (!content.includes('supabase') && !content.includes('.from(')) {
      return { fixed: false, path: filePath };
    }
    
    // Add org_id filters
    const { content: newContent, modified } = addOrgIdToQuery(content);
    
    if (modified) {
      await writeFile(filePath, newContent, 'utf-8');
      return { fixed: true, path: filePath };
    }
    
    return { fixed: false, path: filePath };
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
    return { fixed: false, path: filePath, error: error.message };
  }
}

async function main() {
  console.log('🔍 Scanning for files with Supabase queries...\n');
  
  const appFiles = await getAllFiles(APP_DIR);
  const componentFiles = await getAllFiles(COMPONENTS_DIR);
  const allFiles = [...appFiles, ...componentFiles];
  
  console.log(`📁 Found ${allFiles.length} TypeScript/TSX files\n`);
  console.log('🔧 Fixing RLS queries...\n');
  
  const results = await Promise.all(allFiles.map(fixFile));
  
  const fixed = results.filter(r => r.fixed);
  const errors = results.filter(r => r.error);
  
  console.log('\n✅ RESULTS:');
  console.log(`   Fixed: ${fixed.length} files`);
  console.log(`   Errors: ${errors.length} files`);
  console.log(`   Unchanged: ${results.length - fixed.length - errors.length} files\n`);
  
  if (fixed.length > 0) {
    console.log('📝 Fixed files:');
    fixed.forEach(f => {
      const relativePath = f.path.replace(__dirname + '\\', '');
      console.log(`   ✓ ${relativePath}`);
    });
  }
  
  console.log('\n💡 NEXT: Run test-multi-tenant.mjs to verify\n');
}

main().catch(console.error);
