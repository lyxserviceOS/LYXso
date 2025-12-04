// Min Side - Bookinger
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CustomerNav } from '@/components/customer-portal/CustomerNav';
import { BookingsList } from '@/components/customer-portal/BookingsList';

export default async function BookingerPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login?redirect=/min-side/bookinger');
  }

  const { data: customer } = await supabase
    .from('customers')
    .select('id')
    .eq('email', user.email)
    .single();

  if (!customer) {
    return <div className="p-8">Kunde ikke funnet.</div>;
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/customers/${customer.id}/bookings`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
      cache: 'no-store',
    }
  );

  const { bookings } = await response.json();

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Mine Bookinger</h1>
        <BookingsList bookings={bookings} customerId={customer.id} />
      </div>
    </div>
  );
}
