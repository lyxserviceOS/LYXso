// find-duplicates.js - Finn duplicate route-registreringer
const fs = require('fs');
const path = require('path');

const coatingFile = path.join(__dirname, 'routes', 'coatingAndOrg.mjs');
const content = fs.readFileSync(coatingFile, 'utf8');
const lines = content.split('\n');

console.log('\n=== Searching for landing-page routes in coatingAndOrg.mjs ===\n');

let found = false;
lines.forEach((line, index) => {
  if (line.includes('landing-page') || line.includes('landing_page')) {
    console.log(`Line ${index + 1}: ${line.trim()}`);
    found = true;
  }
  if (line.match(/\.(get|post|put|patch|delete)\s*\(\s*['"]\/api\/orgs\/.*landing/i)) {
    console.log(`>>> ROUTE REGISTRATION at line ${index + 1}: ${line.trim()}`);
    found = true;
  }
});

if (!found) {
  console.log('✓ No landing-page routes found in coatingAndOrg.mjs');
  console.log('  This is CORRECT - all landing routes should be in partnerLandingPage.mjs');
} else {
  console.log('\n✗ Found landing-page references in coatingAndOrg.mjs');
  console.log('  These should be removed - partnerLandingPage.mjs handles all landing routes');
}

console.log('\n');
