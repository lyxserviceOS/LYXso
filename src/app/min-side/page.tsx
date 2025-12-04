// Customer Portal Dashboard - Min Side
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import CustomerNav from '@/components/customer-portal/CustomerNav';
import { Card } from '@/components/ui/card';
import { Calendar, AlertTriangle, Shield } from 'lucide-react';
import Link from 'next/link';

export default async function MinSidePage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login?redirect=/min-side');
  }

  // Fetch customer ID from user metadata or customers table
  const { data: customer } = await supabase
    .from('customers')
    .select('id')
    .eq('email', user.email)
    .single();

  if (!customer) {
    return <div className="p-8">Kunde ikke funnet. Kontakt support.</div>;
  }

  // Fetch dashboard data from API
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/customers/${customer.id}/dashboard`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
      cache: 'no-store',
    }
  );

  const data = await response.json();

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Min Side</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Kommende bookinger */}
          <Link href="/min-side/bookinger">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="h-8 w-8 text-blue-600" />
                <span className="text-3xl font-bold">{data.upcomingBookings?.length || 0}</span>
              </div>
              <h3 className="font-semibold">Kommende avtaler</h3>
              <p className="text-sm text-gray-600">Neste 3 måneder</p>
            </Card>
          </Link>

          {/* Dekkhotell varsler */}
          <Link href="/min-side/dekkhotell">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
                <span className="text-3xl font-bold">{data.tyreAlerts || 0}</span>
              </div>
              <h3 className="font-semibold">Dekk-varsler</h3>
              <p className="text-sm text-gray-600">Bør sjekkes/skiftes</p>
            </Card>
          </Link>

          {/* Coating oppfølging */}
          <Link href="/min-side/coating">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <Shield className="h-8 w-8 text-green-600" />
                <span className="text-3xl font-bold">{data.coatingReminders || 0}</span>
              </div>
              <h3 className="font-semibold">Coating-kontroller</h3>
              <p className="text-sm text-gray-600">Planlagte kontroller</p>
            </Card>
          </Link>
        </div>

        {/* Quick actions */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Snarveier</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/min-side/bookinger"
              className="p-4 text-center border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <span className="text-sm font-medium">Mine bookinger</span>
            </Link>
            <Link
              href="/min-side/kjoretoy"
              className="p-4 text-center border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="h-6 w-6 mx-auto mb-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">Mine kjøretøy</span>
            </Link>
            <Link
              href="/min-side/betalinger"
              className="p-4 text-center border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="h-6 w-6 mx-auto mb-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span className="text-sm font-medium">Betalinger</span>
            </Link>
            <Link
              href="/min-side/profil"
              className="p-4 text-center border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="h-6 w-6 mx-auto mb-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm font-medium">Min profil</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
