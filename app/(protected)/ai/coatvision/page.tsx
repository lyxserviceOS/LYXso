'use client';

import { useOrgPlan } from '@/components/OrgPlanContext';
import { AIModuleLayout } from '@/components/ai/AIModuleLayout';
import { Scan } from 'lucide-react';

export default function AICoatvisionPage() {
  const { org } = useOrgPlan();

  const QuickAction = (
    <div className="p-8 text-center">
      <Scan className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500">Funksjoner kommer snart</p>
    </div>
  );

  return (
    <AIModuleLayout
      module="coatvision"
      title="LYX Vision - AI Bilanalyse"
      description="AI-drevet bildeanalyse for skader og tilstandsvurdering"
      icon={Scan}
      stats={[
        { label: 'Analysert', value: '1.2k', icon: Image, color: 'text-emerald-600', subtitle: 'Bilder' },
        { label: 'Nøyaktighet', value: '96%', icon: Target, color: 'text-green-600', subtitle: 'Presisjon' },
        { label: 'Tid spart', value: '45min', icon: Clock, color: 'text-blue-600', subtitle: 'Per analyse' },
        { label: 'Skader funnet', value: '87', icon: AlertCircle, color: 'text-red-600', subtitle: 'Identifisert' }
      ]}
      chatContext="coatvision"
      chatWelcomeMessage="Hei! Jeg er din AI coatvision-assistent."
      chatPlaceholder="Spør om coatvision-hjelp..."
      quickAction={QuickAction}
      features={[
        'Identifiser skader automatisk',
        'Vurder lakkstand og kvalitet',
        'Generer tilstandsrapporter'
      ]}
      requiredPlan="professional"
      orgId={org?.id || ''}
      hasAccess={true}
    />
  );
}
