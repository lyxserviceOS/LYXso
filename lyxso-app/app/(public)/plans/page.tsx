// app/(public)/plans/page.tsx
import type { Metadata } from 'next';
import PlansPageClient from './PlansPageClient';

export const metadata: Metadata = {
  title: 'Planer & Priser - LYXso',
  description: 'Velg den perfekte planen for din bedrift. Fra gratis til enterprise.',
};

export default function PlansPage() {
  return <PlansPageClient />;
}
