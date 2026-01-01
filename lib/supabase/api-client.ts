// lib/supabase/api-client.ts
// Helper to create Supabase client for API routes
// Handles missing environment variables gracefully during build

import { createClient } from '@supabase/supabase-js';

export function createApiClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase environment variables are not configured for API routes');
    // Return a dummy client for build time
    return createClient(
      'https://placeholder.supabase.co',
      'placeholder-key'
    );
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

export function isSupabaseConfigured(): boolean {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return Boolean(supabaseUrl && supabaseServiceKey);
}
