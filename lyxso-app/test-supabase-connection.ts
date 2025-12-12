// Test script to verify Supabase connection
import { supabase } from './lib/supabaseClient';

async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('customers')
      .select('count(*)', { count: 'exact' })
      .limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    
    console.log('✅ Supabase connection successful!');
    console.log('Connection details:', {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      orgId: process.env.NEXT_PUBLIC_ORG_ID
    });
    
    return true;
  } catch (err) {
    console.error('Connection test failed:', err);
    return false;
  }
}

// Run the test
testSupabaseConnection();