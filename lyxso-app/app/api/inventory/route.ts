/**
 * INVENTORY - Full Management
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
    const category = searchParams.get('category');
    const low_stock = searchParams.get('low_stock') === 'true';

    let query = supabase.from('inventory_items').select('*').eq('org_id', profile.org_id).eq('is_active', true).order('name');
    if (category) query = query.eq('category', category);

    const { data: items } = await query;
    let filtered = items || [];
    if (low_stock) filtered = filtered.filter(item => item.current_quantity <= item.reorder_point);

    const stats = {
      total_items: filtered.length,
      total_value: filtered.reduce((sum, item) => sum + (item.current_quantity * item.cost_price), 0),
      low_stock_items: filtered.filter(item => item.current_quantity <= item.reorder_point).length
    };

    return NextResponse.json({ success: true, items: filtered, stats });
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
    const { data: item } = await supabase.from('inventory_items').insert({ ...body, org_id: profile.org_id }).select().single();

    return NextResponse.json({ success: true, item, message: 'Vare opprettet' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
