import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import TyreSetsList from '@/components/customer-portal/TyreSetsList';

async function getCustomerTyres() {
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

  const { data: tyreSets } = await supabase
    .from('tyre_sets')
    .select(`
      *,
      vehicles(registration_number, model),
      tyre_inspections(
        id,
        result_json,
        recommendation,
        created_at
      )
    `)
    .eq('customer_id', customer.id)
    .order('created_at', { ascending: false });

  return tyreSets || [];
}

export default async function DekkhotellPage() {
  const tyreSets = await getCustomerTyres();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Dekkhotell</h1>
        <p className="text-slate-600">
          Oversikt over dine dekksett og tilstandsrapporter
        </p>
      </div>

      <TyreSetsList tyreSets={tyreSets} />
    </div>
  );
}
