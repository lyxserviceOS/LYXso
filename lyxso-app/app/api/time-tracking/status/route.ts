/**
 * TIME TRACKING - Status API
 */
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Ikke autentisert' }, { status: 401 });

    const { data: checkin } = await supabase
      .from('time_tracking_checkins')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'checked_in')
      .is('check_out_time', null)
      .order('check_in_time', { ascending: false })
      .limit(1)
      .single();

    if (!checkin) return NextResponse.json({ checked_in: false, message: 'Ikke innstemplet' });

    const minutes_worked = Math.floor((Date.now() - new Date(checkin.check_in_time).getTime()) / 60000);
    const hours_worked = (minutes_worked / 60).toFixed(2);

    const { data: breaks } = await supabase
      .from('time_tracking_breaks')
      .select('*')
      .eq('checkin_id', checkin.id)
      .order('break_start', { ascending: false });

    return NextResponse.json({
      checked_in: true, checkin,
      current_work_time: { minutes: minutes_worked, hours: parseFloat(hours_worked), formatted: `${Math.floor(minutes_worked / 60)}t ${minutes_worked % 60}min` },
      breaks: breaks || [],
      message: `Innstemplet kl ${new Date(checkin.check_in_time).toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })}`
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
