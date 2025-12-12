/**
 * COATING JOBS - Full Workflow
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

    const { data: jobs } = await supabase
      .from('coating_jobs')
      .select('*, customers(full_name), vehicles(reg_number, make, model)')
      .eq('org_id', profile.org_id)
      .order('created_at', { ascending: false });

    return NextResponse.json({ success: true, jobs: jobs || [] });
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
    const { data: job } = await supabase.from('coating_jobs').insert({ ...body, org_id: profile.org_id }).select().single();

    return NextResponse.json({ success: true, job, message: 'Coating jobb opprettet' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
