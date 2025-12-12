#!/usr/bin/env node
/**
 * BATCH GENERATOR - Creates all remaining modules
 */

const { execSync } = require('child_process');

const MODULES = [
  'vehicle-lookup',
  'damage-inspection',
  'service-packages',
  'warranty-tracking',
  'work-orders',
  'scheduling',
  'parts-catalog'
];

console.log('🔥 BATCH GENERATING ALL MODULES\n');

MODULES.forEach((module, i) => {
  console.log(`[${i+1}/${MODULES.length}] ${module}...`);
  try {
    execSync(`node scripts/generate-module.js ${module}`, { stdio: 'inherit' });
  } catch (e) {
    console.error(`Failed: ${module}`);
  }
});

console.log('\n🎉 DONE! All modules created!');
