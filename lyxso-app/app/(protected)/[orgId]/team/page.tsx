// app/(protected)/[orgId]/team/page.tsx
import { Metadata } from 'next';
import TeamManagement from './TeamManagement';

export const metadata: Metadata = {
  title: 'Team & Tilgang | LYXso',
  description: 'Administrer team members, roller og tilganger',
};

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Team & Tilgang</h1>
        <p className="text-slate-600 mt-1">
          Administrer team members, inviter nye og håndter roller
        </p>
      </div>

      <TeamManagement />
    </div>
  );
}
