// app/api/public/check-subdomain/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createApiClient, isSupabaseConfigured } from '@/lib/supabase/api-client';

const supabase = isSupabaseConfigured() ? createApiClient() : null;

const RESERVED_SUBDOMAINS = [
  'www', 'api', 'admin', 'app', 'mail', 'ftp', 'localhost',
  'test', 'dev', 'staging', 'production', 'lyxso', 'lyx',
  'support', 'help', 'dashboard', 'login', 'register', 'auth'
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subdomain = searchParams.get('subdomain');

    if (!subdomain) {
      return NextResponse.json(
        { error: 'Subdomain parameter is required', available: false },
        { status: 400 }
      );
    }

    // Validate format
    if (subdomain.length < 3) {
      return NextResponse.json(
        { error: 'Subdomain must be at least 3 characters', available: false },
        { status: 400 }
      );
    }

    if (!/^[a-z0-9-]+$/.test(subdomain)) {
      return NextResponse.json(
        { error: 'Subdomain can only contain lowercase letters, numbers and hyphens', available: false },
        { status: 400 }
      );
    }

    // Check if reserved
    if (RESERVED_SUBDOMAINS.includes(subdomain.toLowerCase())) {
      return NextResponse.json(
        { available: false, error: 'This subdomain is reserved' },
        { status: 200 }
      );
    }

    // Check Supabase configuration
    if (!supabase) {
      console.warn('Supabase not configured, assuming subdomain is available');
      return NextResponse.json(
        { available: true, subdomain },
        { status: 200 }
      );
    }

    // Check if already taken in database
    const { data, error } = await supabase
      .from('orgs')
      .select('id')
      .eq('subdomain', subdomain)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Database error checking subdomain:', error);
      return NextResponse.json(
        { error: 'Database error', available: false },
        { status: 500 }
      );
    }

    const available = !data;

    return NextResponse.json(
      { available, subdomain },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error checking subdomain:', error);
    return NextResponse.json(
      { error: 'Internal server error', available: false },
      { status: 500 }
    );
  }
}
