// app/(protected)/[orgId]/innstillinger/ressurser/page.tsx
import { Metadata } from 'next';
import ResourcesList from './ResourcesList';

export const metadata: Metadata = {
  title: 'Ressurser | LYXso',
  description: 'Administrer dine ressurser som løftebukk, bås og utstyr',
};

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ressurser</h1>
          <p className="text-slate-600 mt-1">
            Administrer løftebukker, bås, utstyr og andre ressurser
          </p>
        </div>
      </div>

      <ResourcesList />
    </div>
  );
}
