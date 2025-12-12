import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import BookingsList from '@/components/customer-portal/BookingsList';

async function getCustomerBookings() {
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

  if (!user) return { upcoming: [], past: [] };

  // Hent customer
  const { data: customer } = await supabase
    .from('customers')
    .select('id')
    .eq('email', user.email)
    .single();

  if (!customer) return { upcoming: [], past: [] };

  const now = new Date().toISOString();

  // Hent kommende bookinger
  const { data: upcoming } = await supabase
    .from('bookings')
    .select(`
      *,
      services(name, duration_minutes),
      vehicles(registration_number, model),
      orgs(name, phone)
    `)
    .eq('customer_id', customer.id)
    .gte('starts_at', now)
    .order('starts_at', { ascending: true });

  // Hent tidligere bookinger
  const { data: past } = await supabase
    .from('bookings')
    .select(`
      *,
      services(name, duration_minutes),
      vehicles(registration_number, model),
      orgs(name, phone)
    `)
    .eq('customer_id', customer.id)
    .lt('starts_at', now)
    .order('starts_at', { ascending: false })
    .limit(20);

  return {
    upcoming: upcoming || [],
    past: past || [],
  };
}

export default async function BookingsPage() {
  const { upcoming, past } = await getCustomerBookings();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Mine bookinger</h1>
        <p className="text-slate-600">
          Oversikt over dine avtaler og tidligere besøk
        </p>
      </div>

      <BookingsList upcoming={upcoming} past={past} />
    </div>
  );
}
