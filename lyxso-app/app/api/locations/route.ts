/**
 * LOCATIONS - Full CRUD
 */
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Ikke autentisert' }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
    if (!profile?.org_id) return NextResponse.json({ error: 'Ingen organisasjon' }, { status: 400 });

    const { data: locations } = await supabase
      .from('locations')
      .select('*')
      .eq('org_id', profile.org_id)
      .order('is_headquarters', { ascending: false })
      .order('name');

    return NextResponse.json({ success: true, locations: locations || [] });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Ikke autentisert' }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('org_id, role').eq('id', user.id).single();
    if (!profile?.org_id) return NextResponse.json({ error: 'Ingen organisasjon' }, { status: 400 });
    if (profile.role !== 'admin' && profile.role !== 'owner') {
      return NextResponse.json({ error: 'Kun admin kan opprette lokasjoner' }, { status: 403 });
    }

    const body = await request.json();
    const { data: location } = await supabase
      .from('locations')
      .insert({ ...body, org_id: profile.org_id })
      .select()
      .single();

    return NextResponse.json({ success: true, location, message: 'Lokasjon opprettet' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
