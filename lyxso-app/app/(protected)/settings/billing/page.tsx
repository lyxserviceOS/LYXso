// app/(protected)/settings/billing/page.tsx
import type { Metadata } from 'next';
import BillingPageClient from './BillingPageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Fakturering - LYXso',
  description: 'Fakturahistorikk og betalingsinformasjon',
};

export default function BillingPage() {
  return <BillingPageClient />;
}
