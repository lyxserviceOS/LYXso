// Min Side - Dekkhotell
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import CustomerNav from '@/components/customer-portal/CustomerNav';
import TyreSetsList from '@/components/customer-portal/TyreSetsList';

export default async function DekkhotellPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login?redirect=/min-side/dekkhotell');
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
    `${process.env.NEXT_PUBLIC_API_URL}/api/customers/${customer.id}/tyres`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
      cache: 'no-store',
    }
  );

  const { tyreSets } = await response.json();

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Dekkhotell</h1>
        <TyreSetsList tyreSets={tyreSets} />
      </div>
    </div>
  );
}
