import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();
    const {
      terms_version = '1.0.0',
      privacy_version = '1.0.0',
      cookie_version = '1.0.0',
      acceptance_method = 'manual'
    } = body;

    // Get client IP and user agent
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 
               request.headers.get('x-real-ip') || 
               'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Insert acceptance record
    const { data, error } = await supabase
      .from('user_terms_acceptance')
      .insert({
        user_id: user.id,
        terms_version,
        privacy_version,
        cookie_version,
        ip_address: ip,
        user_agent: userAgent,
        acceptance_method
      })
      .select()
      .single();

    if (error) {
      console.error('Error logging terms acceptance:', error);
      return NextResponse.json(
        { error: 'Failed to log acceptance', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      acceptance: data
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get user's acceptance history
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from('user_terms_acceptance')
      .select('*')
      .eq('user_id', user.id)
      .order('accepted_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch acceptance history' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      acceptances: data || []
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
