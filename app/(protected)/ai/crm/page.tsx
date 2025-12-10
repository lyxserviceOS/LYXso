'use client';

import { useOrgPlan } from '@/components/OrgPlanContext';
import { AIModuleLayout } from '@/components/ai/AIModuleLayout';
import { Users, Star, Heart, TrendingUp } from 'lucide-react';

export default function AICrmPage() {
  const { org } = useOrgPlan();

  const QuickAction = (
    <div className="p-8 text-center">
      <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500">Funksjoner kommer snart</p>
    </div>
  );

  return (
    <AIModuleLayout
      module="crm"
      title="AI CRM Assistent"
      description="AI-drevet kundebehandling og relasjonsledelse"
      icon={<Users className="w-5 h-5" />}
      stats={[
        {
          label: 'Kunder',
          value: '287',
          icon: <Users className="w-4 h-4" />,
          color: 'text-blue-600',
          subtitle: 'Aktive',
        },
        {
          label: 'Lojalitet',
          value: '8.4',
          icon: <Star className="w-4 h-4" />,
          color: 'text-yellow-600',
          subtitle: 'Gj.snitt',
        },
        {
          label: 'Engagement',
          value: '76%',
          icon: <Heart className="w-4 h-4" />,
          color: 'text-pink-600',
          subtitle: 'Respons',
        },
        {
          label: 'Vekst',
          value: '+23%',
          icon: <TrendingUp className="w-4 h-4" />,
          color: 'text-green-600',
          subtitle: 'Retention',
        },
      ]}
      chatContext="crm"
      chatWelcomeMessage="Hei! Jeg er din AI crm-assistent."
      chatPlaceholder="Spør om crm-hjelp..."
      quickAction={QuickAction}
      features={[
        'Personaliser meldinger basert på kundehistorikk',
        'Identifiser churn-risiko tidlig',
        'Foreslå beste tidspunkt for oppfølging'
      ]}
      requiredPlan="professional"
      orgId={org?.id || ''}
      hasAccess={true}
    />
  );
}
