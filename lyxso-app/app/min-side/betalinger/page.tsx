import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import InvoicesList from '@/components/customer-portal/InvoicesList';

async function getCustomerInvoices() {
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

  const { data: invoices } = await supabase
    .from('invoices')
    .select('*')
    .eq('customer_id', customer.id)
    .order('invoice_date', { ascending: false });

  return invoices || [];
}

export default async function PaymentsPage() {
  const invoices = await getCustomerInvoices();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Betalinger</h1>
        <p className="text-slate-600">
          Fakturaer og betalingshistorikk
        </p>
      </div>

      <InvoicesList invoices={invoices} />
    </div>
  );
}
