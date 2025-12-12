/**
 * RESOURCES - Full CRUD
 */
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Ikke autentisert' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('org_id')
      .eq('id', user.id)
      .single();
    
    if (!profile?.org_id) {
      return NextResponse.json({ error: 'Ingen organisasjon' }, { status: 400 });
    }

    const { data: resources } = await supabase
      .from('resources')
      .select('*')
      .eq('org_id', profile.org_id)
      .order('name');

    return NextResponse.json({ success: true, resources: resources || [] });
  } catch (error) {
    console.error('GET /api/resources error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Ikke autentisert' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('org_id, role')
      .eq('id', user.id)
      .single();
    
    if (!profile?.org_id) {
      return NextResponse.json({ error: 'Ingen organisasjon' }, { status: 400 });
    }
    
    if (profile.role !== 'admin' && profile.role !== 'owner') {
      return NextResponse.json({ error: 'Kun admin kan opprette ressurser' }, { status: 403 });
    }

    const body = await request.json();
    
    // Verify location belongs to user's org
    if (body.location_id) {
      const { data: location } = await supabase
        .from('locations')
        .select('id')
        .eq('id', body.location_id)
        .eq('org_id', profile.org_id)
        .single();
      
      if (!location) {
        return NextResponse.json({ error: 'Ugyldig lokasjon' }, { status: 400 });
      }
    }

    const { data: resource, error: insertError } = await supabase
      .from('resources')
      .insert({ ...body, org_id: profile.org_id })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json({ error: 'Kunne ikke opprette ressurs' }, { status: 500 });
    }

    return NextResponse.json({ success: true, resource, message: 'Ressurs opprettet' });
  } catch (error) {
    console.error('POST /api/resources error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
