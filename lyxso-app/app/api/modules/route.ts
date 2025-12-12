/**
 * MODULE CONTROL - Get/Update Settings
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

    const { data: modules } = await supabase.from('organization_modules').select('*').eq('org_id', profile.org_id).single();

    if (!modules) {
      const { data: created } = await supabase.from('organization_modules').insert({ org_id: profile.org_id }).select().single();
      return NextResponse.json({ success: true, modules: created });
    }

    return NextResponse.json({ success: true, modules });
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
      return NextResponse.json({ error: 'Kun admin kan endre moduler' }, { status: 403 });
    }

    const updates = await request.json();
    const { data: updated } = await supabase
      .from('organization_modules')
      .upsert({ org_id: profile.org_id, ...updates }, { onConflict: 'org_id' })
      .select()
      .single();

    return NextResponse.json({ success: true, modules: updated, message: 'Modulinnstillinger oppdatert' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
