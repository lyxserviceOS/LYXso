/**
 * TIME TRACKING - Check Out API
 */
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Ikke autentisert' }, { status: 401 });

    const { checkin_id, latitude, longitude, wifi_ssid, ip_address, notes } = await request.json();

    const { data: checkin, error: checkinError } = await supabase
      .from('time_tracking_checkins')
      .select('*')
      .eq('id', checkin_id || '')
      .eq('user_id', user.id)
      .eq('status', 'checked_in')
      .is('check_out_time', null)
      .single();

    if (checkinError || !checkin) return NextResponse.json({ error: 'Ingen aktiv session' }, { status: 404 });

    const { data: breaks } = await supabase
      .from('time_tracking_breaks')
      .select('*')
      .eq('checkin_id', checkin.id)
      .not('break_end', 'is', null);

    let total_break_minutes = 0;
    if (breaks) breaks.forEach(b => {
      const mins = Math.floor((new Date(b.break_end!).getTime() - new Date(b.break_start).getTime()) / 60000);
      total_break_minutes += mins;
    });

    const check_out_time = new Date().toISOString();
    const { data: updated } = await supabase
      .from('time_tracking_checkins')
      .update({
        check_out_time, check_out_latitude: latitude, check_out_longitude: longitude,
        check_out_wifi_ssid: wifi_ssid, check_out_ip_address: ip_address,
        break_minutes: total_break_minutes, status: 'checked_out', notes: notes || checkin.notes
      })
      .eq('id', checkin.id)
      .select()
      .single();

    const total_minutes = Math.floor((new Date(check_out_time).getTime() - new Date(checkin.check_in_time).getTime()) / 60000);
    const work_minutes = total_minutes - total_break_minutes;
    const work_hours = (work_minutes / 60).toFixed(2);

    return NextResponse.json({
      success: true, checkin: updated,
      summary: { check_in_time: checkin.check_in_time, check_out_time, total_minutes, break_minutes: total_break_minutes, work_minutes, work_hours: parseFloat(work_hours) },
      message: `Utstemplet! Du jobbet ${work_hours} timer`
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
