/**
 * TIRE HOTEL - Full Management
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
    const season = searchParams.get('season');
    const customer_id = searchParams.get('customer_id');

    let query = supabase
      .from('tire_sets')
      .select('*, customers(full_name, phone), vehicles(reg_number)')
      .eq('org_id', profile.org_id)
      .eq('is_active', true)
      .order('stored_date', { ascending: false });

    if (season) query = query.eq('season', season);
    if (customer_id) query = query.eq('customer_id', customer_id);

    const { data: tires } = await query;

    return NextResponse.json({ success: true, tires: tires || [] });
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
    const qr_code = `TIRE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();

    const { data: tireSet } = await supabase
      .from('tire_sets')
      .insert({ ...body, org_id: profile.org_id, qr_code, stored_date: new Date().toISOString().split('T')[0] })
      .select()
      .single();

    return NextResponse.json({ success: true, tireSet, message: 'Dekksett lagret' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
