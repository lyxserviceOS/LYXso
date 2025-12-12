// app/(protected)/vehicles/page.tsx
import type { Metadata } from 'next';
import VehiclesPageClient from './VehiclesPageClient';

export const metadata: Metadata = {
  title: 'Kjøretøy - LYXso',
  description: 'Administrer alle kjøretøy i systemet med servicehistorikk og oppfølging',
};

export default function VehiclesPage() {
  return <VehiclesPageClient />;
}
