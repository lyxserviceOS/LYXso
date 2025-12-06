/**
 * LOCATIONS [id] - Update & Delete individual location
 */
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
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
      return NextResponse.json({ error: 'Kun admin kan redigere lokasjoner' }, { status: 403 });
    }

    const body = await request.json();
    
    // Verify location belongs to user's org
    const { data: existing } = await supabase
      .from('locations')
      .select('id')
      .eq('id', params.id)
      .eq('org_id', profile.org_id)
      .single();
    
    if (!existing) {
      return NextResponse.json({ error: 'Lokasjon ikke funnet' }, { status: 404 });
    }

    const { data: location, error: updateError } = await supabase
      .from('locations')
      .update(body)
      .eq('id', params.id)
      .eq('org_id', profile.org_id)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json({ error: 'Kunne ikke oppdatere lokasjon' }, { status: 500 });
    }

    return NextResponse.json({ success: true, location, message: 'Lokasjon oppdatert' });
  } catch (error) {
    console.error('PATCH /api/locations/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
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
      return NextResponse.json({ error: 'Kun admin kan slette lokasjoner' }, { status: 403 });
    }

    // Verify location belongs to user's org
    const { data: existing } = await supabase
      .from('locations')
      .select('id')
      .eq('id', params.id)
      .eq('org_id', profile.org_id)
      .single();
    
    if (!existing) {
      return NextResponse.json({ error: 'Lokasjon ikke funnet' }, { status: 404 });
    }

    // Check if location has associated resources
    const { data: resources } = await supabase
      .from('resources')
      .select('id')
      .eq('location_id', params.id)
      .limit(1);
    
    if (resources && resources.length > 0) {
      return NextResponse.json({ 
        error: 'Kan ikke slette lokasjon med tilknyttede ressurser. Slett ressursene først.' 
      }, { status: 400 });
    }

    const { error: deleteError } = await supabase
      .from('locations')
      .delete()
      .eq('id', params.id)
      .eq('org_id', profile.org_id);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json({ error: 'Kunne ikke slette lokasjon' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Lokasjon slettet' });
  } catch (error) {
    console.error('DELETE /api/locations/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
