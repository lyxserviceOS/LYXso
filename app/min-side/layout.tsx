import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import CustomerNav from '@/components/customer-portal/CustomerNav';

export const metadata = {
  title: 'Min side - LYXso',
  description: 'Din kundeportal hos LYXso',
};

async function getCustomer() {
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

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/kunde-login');
  }

  // Hent customer info
  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .eq('email', user.email)
    .single();

  return { user, customer };
}

export default async function CustomerPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, customer } = await getCustomer();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-900">
                Hei, {customer?.first_name || 'Kunde'} 👋
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">{user.email}</span>
              <form action="/api/auth/logout" method="post">
                <button
                  type="submit"
                  className="text-sm text-slate-600 hover:text-slate-900"
                >
                  Logg ut
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <CustomerNav />

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
