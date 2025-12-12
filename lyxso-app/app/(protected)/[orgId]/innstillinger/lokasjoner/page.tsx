// app/(protected)/[orgId]/innstillinger/lokasjoner/page.tsx
import { Metadata } from 'next';
import LocationsList from './LocationsList';

export const metadata: Metadata = {
  title: 'Lokasjoner | LYXso',
  description: 'Administrer dine lokasjoner og verksteder',
};

export default function LocationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lokasjoner</h1>
          <p className="text-slate-600 mt-1">
            Administrer verksteder, avdelinger og lokasjoner
          </p>
        </div>
      </div>

      <LocationsList />
    </div>
  );
}
