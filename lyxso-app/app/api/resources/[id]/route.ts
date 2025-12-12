/**
 * RESOURCES [id] - Update & Delete individual resource
 */
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request, context: any) {
  try {
    const params = await context?.params;
    if (!params || !params.id) {
      return NextResponse.json(
        { error: "Missing id in route params" },
        { status: 400 }
      );
    }
    const { id } = params as { id: string };
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
      return NextResponse.json({ error: 'Kun admin kan redigere ressurser' }, { status: 403 });
    }

    const body = await request.json();
    
    // Verify resource belongs to user's org
    const { data: existing } = await supabase
      .from('resources')
      .select('id')
      .eq('id', id)
      .eq('org_id', profile.org_id)
      .single();
    
    if (!existing) {
      return NextResponse.json({ error: 'Ressurs ikke funnet' }, { status: 404 });
    }

    // If changing location, verify new location belongs to org
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

    const { data: resource, error: updateError } = await supabase
      .from('resources')
      .update(body)
      .eq('id', id)
      .eq('org_id', profile.org_id)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json({ error: 'Kunne ikke oppdatere ressurs' }, { status: 500 });
    }

    return NextResponse.json({ success: true, resource, message: 'Ressurs oppdatert' });
  } catch (error) {
    console.error('PATCH /api/resources/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    const params = await context?.params;
    if (!params || !params.id) {
      return NextResponse.json(
        { error: "Missing id in route params" },
        { status: 400 }
      );
    }
    const { id } = params as { id: string };
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
      return NextResponse.json({ error: 'Kun admin kan slette ressurser' }, { status: 403 });
    }

    // Verify resource belongs to user's org
    const { data: existing } = await supabase
      .from('resources')
      .select('id')
      .eq('id', id)
      .eq('org_id', profile.org_id)
      .single();
    
    if (!existing) {
      return NextResponse.json({ error: 'Ressurs ikke funnet' }, { status: 404 });
    }

    const { error: deleteError } = await supabase
      .from('resources')
      .delete()
      .eq('id', id)
      .eq('org_id', profile.org_id);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json({ error: 'Kunne ikke slette ressurs' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Ressurs slettet' });
  } catch (error) {
    console.error('DELETE /api/resources/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
