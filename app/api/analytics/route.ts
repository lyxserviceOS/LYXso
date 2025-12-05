/**
 * BUSINESS ANALYTICS - Metrics & Reports
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
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');

    let query = supabase.from('business_metrics').select('*').eq('org_id', profile.org_id).order('metric_date', { ascending: false });
    if (start_date) query = query.gte('metric_date', start_date);
    if (end_date) query = query.lte('metric_date', end_date);

    const { data: metrics } = await query;

    const totals = (metrics || []).reduce((acc, m) => ({
      revenue: acc.revenue + m.revenue,
      costs: acc.costs + m.costs,
      profit: acc.profit + m.profit,
      bookings: acc.bookings + m.bookings_completed
    }), { revenue: 0, costs: 0, profit: 0, bookings: 0 });

    return NextResponse.json({ success: true, metrics: metrics || [], totals });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
