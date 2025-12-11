// app/(protected)/settings/subscription/page.tsx
import type { Metadata } from 'next';
import SubscriptionPageClient from './SubscriptionPageClient';

export const metadata: Metadata = {
  title: 'Abonnement - LYXso',
  description: 'Administrer ditt abonnement, addons og bruksdata',
};

export default function SubscriptionPage() {
  return <SubscriptionPageClient />;
}
