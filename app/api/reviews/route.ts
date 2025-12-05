/**
 * REVIEW REQUESTS - Google Review Engine
 */
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Ikke autentisert' }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
    if (!profile?.org_id) return NextResponse.json({ error: 'Ingen organisasjon' }, { status: 400 });

    const { booking_id, customer_id, sent_via, review_link } = await request.json();

    const { data: request_record } = await supabase
      .from('review_requests')
      .insert({ org_id: profile.org_id, booking_id, customer_id, sent_via, review_link })
      .select()
      .single();

    return NextResponse.json({ success: true, request: request_record, message: 'Review forespørsel sendt' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
