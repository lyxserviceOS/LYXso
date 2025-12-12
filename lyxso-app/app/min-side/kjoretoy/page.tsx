import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import VehiclesList from '@/components/customer-portal/VehiclesList';

async function getCustomerVehicles() {
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

  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('*')
    .eq('customer_id', customer.id)
    .order('created_at', { ascending: false });

  return vehicles || [];
}

export default async function VehiclesPage() {
  const vehicles = await getCustomerVehicles();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Mine kjøretøy</h1>
        <p className="text-slate-600">
          Oversikt over dine registrerte kjøretøy
        </p>
      </div>

      <VehiclesList vehicles={vehicles} />
    </div>
  );
}
