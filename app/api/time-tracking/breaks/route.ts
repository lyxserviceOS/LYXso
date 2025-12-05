/**
 * TIME TRACKING - Breaks API
 */
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Ikke autentisert' }, { status: 401 });

    const { action, checkin_id, break_id, break_type, notes } = await request.json();

    if (action === 'start') {
      const { data: checkin } = await supabase
        .from('time_tracking_checkins')
        .select('id')
        .eq('id', checkin_id)
        .eq('user_id', user.id)
        .eq('status', 'checked_in')
        .single();

      if (!checkin) return NextResponse.json({ error: 'Ingen aktiv session' }, { status: 404 });

      const { data: activeBreak } = await supabase
        .from('time_tracking_breaks')
        .select('id')
        .eq('checkin_id', checkin_id)
        .is('break_end', null)
        .single();

      if (activeBreak) return NextResponse.json({ error: 'Du er allerede på pause' }, { status: 400 });

      const { data: newBreak } = await supabase
        .from('time_tracking_breaks')
        .insert({ checkin_id, break_start: new Date().toISOString(), break_type: break_type || 'other', notes })
        .select()
        .single();

      await supabase
        .from('time_tracking_checkins')
        .update({ status: 'on_break' })
        .eq('id', checkin_id);

      return NextResponse.json({ success: true, break: newBreak, message: 'Pause startet' });
    }

    if (action === 'end') {
      const { data: breakRecord } = await supabase
        .from('time_tracking_breaks')
        .select('*')
        .eq('id', break_id)
        .is('break_end', null)
        .single();

      if (!breakRecord) return NextResponse.json({ error: 'Ingen aktiv pause' }, { status: 404 });

      const break_end = new Date().toISOString();
      const { data: updated } = await supabase
        .from('time_tracking_breaks')
        .update({ break_end })
        .eq('id', break_id)
        .select()
        .single();

      await supabase
        .from('time_tracking_checkins')
        .update({ status: 'checked_in' })
        .eq('id', breakRecord.checkin_id);

      const duration = Math.floor((new Date(break_end).getTime() - new Date(breakRecord.break_start).getTime()) / 60000);

      return NextResponse.json({ success: true, break: updated, duration_minutes: duration, message: `Pause avsluttet (${duration} min)` });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
