import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import ProfileForm from '@/components/customer-portal/ProfileForm';

async function getCustomerProfile() {
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

  if (!user) return null;

  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .eq('email', user.email)
    .single();

  return customer;
}

export default async function ProfilePage() {
  const customer = await getCustomerProfile();

  if (!customer) {
    return (
      <div className="card">
        <p className="text-slate-600">Kunne ikke laste profil</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Min profil</h1>
        <p className="text-slate-600">
          Administrer din personlige informasjon
        </p>
      </div>

      <ProfileForm customer={customer} />
    </div>
  );
}
