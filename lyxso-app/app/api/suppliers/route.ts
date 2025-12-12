/**
 * SUPPLIERS - Full CRUD + Norwegian Integrations
 */
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Ikke autentisert' }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
    if (!profile?.org_id) return NextResponse.json({ error: 'Ingen organisasjon' }, { status: 400 });

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let query = supabase
      .from('suppliers')
      .select('*')
      .or(`org_id.eq.${profile.org_id},org_id.is.null`)
      .eq('is_active', true)
      .order('is_favorite', { ascending: false })
      .order('name');

    if (type) query = query.eq('supplier_type', type);

    const { data: suppliers } = await query;
    return NextResponse.json({ success: true, suppliers: suppliers || [] });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Ikke autentisert' }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
    if (!profile?.org_id) return NextResponse.json({ error: 'Ingen organisasjon' }, { status: 400 });

    const body = await request.json();
    const { data: supplier } = await supabase
      .from('suppliers')
      .insert({ ...body, org_id: profile.org_id })
      .select()
      .single();

    return NextResponse.json({ success: true, supplier, message: 'Leverandør opprettet' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
