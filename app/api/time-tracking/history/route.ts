/**
 * TIME TRACKING - History API
 */
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Ikke autentisert' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');
    const user_id = searchParams.get('user_id');

    let query = supabase
      .from('time_tracking_checkins')
      .select('*, profiles(full_name, email)')
      .order('check_in_time', { ascending: false });

    if (user_id) query = query.eq('user_id', user_id);
    else query = query.eq('user_id', user.id);

    if (start_date) query = query.gte('check_in_time', start_date);
    if (end_date) query = query.lte('check_in_time', end_date);

    const { data: checkins, error } = await query;
    if (error) throw error;

    const enriched = await Promise.all((checkins || []).map(async (checkin) => {
      const { data: breaks } = await supabase
        .from('time_tracking_breaks')
        .select('*')
        .eq('checkin_id', checkin.id);

      const total_minutes = checkin.check_out_time 
        ? Math.floor((new Date(checkin.check_out_time).getTime() - new Date(checkin.check_in_time).getTime()) / 60000)
        : Math.floor((Date.now() - new Date(checkin.check_in_time).getTime()) / 60000);

      const work_minutes = total_minutes - (checkin.break_minutes || 0);
      const work_hours = (work_minutes / 60).toFixed(2);

      return {
        ...checkin,
        breaks: breaks || [],
        calculated: {
          total_minutes,
          work_minutes,
          work_hours: parseFloat(work_hours),
          is_active: !checkin.check_out_time
        }
      };
    }));

    const total_work_hours = enriched.reduce((sum, c) => sum + (c.calculated.work_hours || 0), 0);
    const total_days = new Set(enriched.map(c => new Date(c.check_in_time).toDateString())).size;

    return NextResponse.json({
      success: true,
      checkins: enriched,
      summary: {
        total_entries: enriched.length,
        total_work_hours: parseFloat(total_work_hours.toFixed(2)),
        total_days,
        average_hours_per_day: total_days > 0 ? parseFloat((total_work_hours / total_days).toFixed(2)) : 0
      }
    });
  } catch (error) {
    console.error('History error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
