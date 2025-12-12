import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Calendar, Car, Package, Shield, FileText } from 'lucide-react';

async function getDashboardData() {
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

  // Hent customer
  const { data: customer } = await supabase
    .from('customers')
    .select('id')
    .eq('email', user.email)
    .single();

  if (!customer) return null;

  // Hent kommende bookinger (3 nærmeste)
  const { data: upcomingBookings } = await supabase
    .from('bookings')
    .select('*, services(name)')
    .eq('customer_id', customer.id)
    .gte('starts_at', new Date().toISOString())
    .order('starts_at', { ascending: true })
    .limit(3);

  // Hent dekksett med advarsler
  const { data: tyreSets } = await supabase
    .from('tyre_sets')
    .select(`
      id,
      type,
      tyre_inspections!inner(recommendation)
    `)
    .eq('customer_id', customer.id)
    .eq('status', 'stored')
    .in('tyre_inspections.recommendation', ['replace_soon', 'must_replace']);

  // Hent coating-jobber med kommende kontroller
  const { data: coatingJobs } = await supabase
    .from('coating_jobs')
    .select(`
      id,
      product_name,
      coating_followups!inner(scheduled_date, status)
    `)
    .eq('customer_id', customer.id)
    .eq('coating_followups.status', 'scheduled')
    .gte('coating_followups.scheduled_date', new Date().toISOString())
    .order('coating_followups.scheduled_date', { ascending: true })
    .limit(3);

  return {
    upcomingBookings: upcomingBookings || [],
    tyreAlerts: tyreSets?.length || 0,
    coatingReminders: coatingJobs?.length || 0,
  };
}

export default async function CustomerPortalPage() {
  const data = await getDashboardData();

  if (!data) {
    return <div>Kunne ikke laste dashboard</div>;
  }

  return (
    <div className="space-y-8">
      {/* Quick actions */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/min-side/bookinger"
          className="card hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Bookinger</p>
              <p className="text-xl font-bold text-slate-900">
                {data.upcomingBookings.length}
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/min-side/kjoretoy"
          className="card hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <Car className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Kjøretøy</p>
              <p className="text-xl font-bold text-slate-900">Se mine</p>
            </div>
          </div>
        </Link>

        <Link
          href="/min-side/dekkhotell"
          className="card hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-50 rounded-lg">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Dekkhotell</p>
              {data.tyreAlerts > 0 && (
                <p className="text-xl font-bold text-orange-600">
                  {data.tyreAlerts} varsel
                </p>
              )}
            </div>
          </div>
        </Link>

        <Link
          href="/min-side/coating"
          className="card hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Coating</p>
              <p className="text-xl font-bold text-slate-900">Garanti</p>
            </div>
          </div>
        </Link>
      </section>

      {/* Varsler */}
      {data.tyreAlerts > 0 && (
        <section className="card bg-orange-50 border-orange-200">
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-orange-900 mb-1">
                Dekk bør byttes
              </h3>
              <p className="text-sm text-orange-800 mb-3">
                Du har {data.tyreAlerts} dekksett som bør eller må byttes snart.
              </p>
              <Link
                href="/min-side/dekkhotell"
                className="text-sm font-semibold text-orange-600 hover:text-orange-700"
              >
                Se detaljer →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Kommende bookinger */}
      {data.upcomingBookings.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Kommende bookinger
          </h2>
          <div className="space-y-3">
            {data.upcomingBookings.map((booking: any) => (
              <div key={booking.id} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {booking.services?.name || 'Booking'}
                    </p>
                    <p className="text-sm text-slate-600">
                      {new Date(booking.starts_at).toLocaleDateString('nb-NO', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <Link
                    href={`/min-side/bookinger#${booking.id}`}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Detaljer →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quick links */}
      <section className="card bg-slate-50">
        <h3 className="font-semibold text-slate-900 mb-3">Trenger du hjelp?</h3>
        <div className="space-y-2">
          <a
            href="mailto:hjelp@lyxso.no"
            className="block text-sm text-blue-600 hover:text-blue-700"
          >
            Send e-post til kundeservice
          </a>
          <a
            href="tel:+4712345678"
            className="block text-sm text-blue-600 hover:text-blue-700"
          >
            Ring oss: +47 123 45 678
          </a>
        </div>
      </section>
    </div>
  );
}
