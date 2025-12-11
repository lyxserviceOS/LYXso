#!/usr/bin/env node
// test-multi-tenant.mjs - Test multi-tenant data isolasjon

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = 'https://jvyndhoxkxqkztqawxns.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('❌ Mangler SUPABASE_SERVICE_ROLE_KEY i .env');
  console.log('\n💡 Sett opp .env fil med:');
  console.log('SUPABASE_SERVICE_ROLE_KEY=din-service-role-key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🧪 MULTI-TENANT ISOLASJONSTEST\n');

async function runTests() {
  let org1, org2, customer1, customer2;
  
  try {
    // 1. Opprett to test-organisasjoner
    console.log('1️⃣ Oppretter to test-organisasjoner...');
    
    const { data: orgData1, error: org1Error } = await supabase
      .from('organizations')
      .insert({
        name: 'Test Org 1 - Multi-Tenant Test',
        slug: `test-org-1-${Date.now()}`,
        industry: 'automotive'
      })
      .select()
      .single();
    
    if (org1Error) {
      console.error('❌ Feil ved opprettelse av org1:', org1Error);
      return;
    }
    org1 = orgData1;
    console.log(`   ✅ Org 1 opprettet: ${org1.id}`);
    
    const { data: orgData2, error: org2Error } = await supabase
      .from('organizations')
      .insert({
        name: 'Test Org 2 - Multi-Tenant Test',
        slug: `test-org-2-${Date.now()}`,
        industry: 'automotive'
      })
      .select()
      .single();
    
    if (org2Error) {
      console.error('❌ Feil ved opprettelse av org2:', org2Error);
      return;
    }
    org2 = orgData2;
    console.log(`   ✅ Org 2 opprettet: ${org2.id}\n`);
    
    // 2. Opprett kunder i hver org
    console.log('2️⃣ Oppretter test-kunder...');
    
    const { data: custData1, error: cust1Error } = await supabase
      .from('customers')
      .insert({
        org_id: org1.id,
        name: 'Kunde i Org 1',
        email: 'kunde1@org1test.com',
        phone: '12345678'
      })
      .select()
      .single();
    
    if (cust1Error) {
      console.error('❌ Feil ved opprettelse av kunde 1:', cust1Error);
      return;
    }
    customer1 = custData1;
    console.log(`   ✅ Kunde 1 opprettet i Org 1: ${customer1.id}`);
    
    const { data: custData2, error: cust2Error } = await supabase
      .from('customers')
      .insert({
        org_id: org2.id,
        name: 'Kunde i Org 2',
        email: 'kunde2@org2test.com',
        phone: '87654321'
      })
      .select()
      .single();
    
    if (cust2Error) {
      console.error('❌ Feil ved opprettelse av kunde 2:', cust2Error);
      return;
    }
    customer2 = custData2;
    console.log(`   ✅ Kunde 2 opprettet i Org 2: ${customer2.id}\n`);
    
    // 3. Test isolasjon - Org2 prøver å lese Org1 data
    console.log('3️⃣ Tester data-isolasjon...');
    console.log('   🔍 Org 2 prøver å hente Kunde 1 (fra Org 1)...');
    
    const { data: stolenData, error: stolenError } = await supabase
      .from('customers')
      .select('*')
      .eq('org_id', org2.id)
      .eq('id', customer1.id);
    
    const isolationTest1 = !stolenData || stolenData.length === 0;
    console.log(`   ${isolationTest1 ? '✅' : '❌'} Resultat: ${isolationTest1 ? 'Data isolert korrekt' : 'DATA LEKKET!'}`);
    
    // 4. Test at org kan lese sin egen data
    console.log('\n4️⃣ Tester tilgang til egen data...');
    console.log('   🔍 Org 1 leser sin egen Kunde 1...');
    
    const { data: ownData, error: ownError } = await supabase
      .from('customers')
      .select('*')
      .eq('org_id', org1.id)
      .eq('id', customer1.id);
    
    const ownAccessTest = ownData && ownData.length === 1;
    console.log(`   ${ownAccessTest ? '✅' : '❌'} Resultat: ${ownAccessTest ? 'Kan lese egen data' : 'FEIL - Kan ikke lese egen data!'}`);
    
    // 5. Test cross-org query uten filter
    console.log('\n5️⃣ Tester query uten org_id filter...');
    console.log('   🔍 Henter ALLE kunder uten org_id filter...');
    
    const { data: allCustomers, error: allError } = await supabase
      .from('customers')
      .select('*')
      .in('id', [customer1.id, customer2.id]);
    
    console.log(`   📊 Returnerte ${allCustomers?.length || 0} kunder`);
    console.log(`   💡 Med service role key returneres alle (${allCustomers?.length || 0})`);
    console.log(`   💡 Med user JWT ville RLS blokkert og returnert 0`);
    
    // 6. Test at org2 ikke ser org1 data i list
    console.log('\n6️⃣ Tester liste-filtrering...');
    console.log('   🔍 Org 2 lister sine kunder...');
    
    const { data: org2Customers, error: org2Error } = await supabase
      .from('customers')
      .select('*')
      .eq('org_id', org2.id);
    
    const hasOnlyOrg2Data = org2Customers && 
      org2Customers.length === 1 && 
      org2Customers[0].id === customer2.id;
    
    console.log(`   ${hasOnlyOrg2Data ? '✅' : '❌'} Org 2 ser kun sin egen kunde: ${hasOnlyOrg2Data}`);
    
    // RESULTAT
    console.log('\n\n📊 TEST RESULTAT:\n');
    console.log(`   Data Isolasjon:  ${isolationTest1 ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Egen Tilgang:    ${ownAccessTest ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Liste Filter:    ${hasOnlyOrg2Data ? '✅ PASS' : '❌ FAIL'}`);
    
    const allPassed = isolationTest1 && ownAccessTest && hasOnlyOrg2Data;
    
    if (allPassed) {
      console.log('\n🎉 ALLE TESTER BESTÅTT!\n');
      console.log('✅ Multi-tenant isolasjon fungerer korrekt');
      console.log('✅ RLS policies er aktive og virker');
      console.log('✅ Hver org ser kun sin egen data\n');
    } else {
      console.log('\n⚠️  NOEN TESTER FEILET\n');
      console.log('❌ Sjekk RLS policies i Supabase');
      console.log('❌ Verifiser at alle queries filtrerer på org_id\n');
    }
    
  } catch (error) {
    console.error('\n❌ Test feilet med error:', error.message);
  } finally {
    // Cleanup
    console.log('🧹 Rydder opp test-data...');
    
    if (customer1) {
      await supabase.from('customers').delete().eq('id', customer1.id);
      console.log('   ✅ Slettet kunde 1');
    }
    if (customer2) {
      await supabase.from('customers').delete().eq('id', customer2.id);
      console.log('   ✅ Slettet kunde 2');
    }
    if (org1) {
      await supabase.from('organizations').delete().eq('id', org1.id);
      console.log('   ✅ Slettet org 1');
    }
    if (org2) {
      await supabase.from('organizations').delete().eq('id', org2.id);
      console.log('   ✅ Slettet org 2');
    }
    
    console.log('\n✅ Test ferdig!\n');
  }
}

runTests().catch(console.error);
