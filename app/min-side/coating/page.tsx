import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import CoatingJobsList from '@/components/customer-portal/CoatingJobsList';

async function getCustomerCoating() {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: customer } = await supabase
    .from('customers')
    .select('id')
    .eq('email', user.email)
    .single();

  if (!customer) return [];

  const { data: coatingJobs } = await supabase
    .from('coating_jobs')
    .select(`
      *,
      vehicles(registration_number, model),
      coating_certificates(*),
      coating_followups(
        id,
        scheduled_date,
        performed_date,
        status,
        notes
      )
    `)
    .eq('customer_id', customer.id)
    .order('start_date', { ascending: false });

  return coatingJobs || [];
}

export default async function CoatingPage() {
  const coatingJobs = await getCustomerCoating();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Coating & Garanti</h1>
        <p className="text-slate-600">
          Dine coating-behandlinger og garantisertifikater
        </p>
      </div>

      <CoatingJobsList coatingJobs={coatingJobs} />
    </div>
  );
}
