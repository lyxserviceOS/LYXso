'use client';

import { useOrgPlan } from '@/components/OrgPlanContext';
import { AIModuleLayout } from '@/components/ai/AIModuleLayout';
import { DollarSign } from 'lucide-react';

export default function AIPricingPage() {
  const { org } = useOrgPlan();

  const QuickAction = (
    <div className="p-8 text-center">
      <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500">Funksjoner kommer snart</p>
    </div>
  );

  return (
    <AIModuleLayout
      module="pricing"
      title="AI Prissetting"
      description="AI-drevet dynamisk prissetting og konkurranseanalyse"
      icon={DollarSign}
      stats={[
        { label: 'Margin', value: '68%', icon: Percent, color: 'text-green-600', subtitle: 'Gjennomsnitt' },
        { label: 'Konkurrenter', value: '24', icon: Users, color: 'text-blue-600', subtitle: 'Overvåket' },
        { label: 'Prisjusteringer', value: '156', icon: TrendingUp, color: 'text-purple-600', subtitle: 'Automatiske' },
        { label: 'Revenue', value: '+12%', icon: DollarSign, color: 'text-emerald-600', subtitle: 'Økning' }
      ]}
      chatContext="pricing"
      chatWelcomeMessage="Hei! Jeg er din AI pricing-assistent."
      chatPlaceholder="Spør om pricing-hjelp..."
      quickAction={QuickAction}
      features={[
        'Dynamisk prissetting basert på etterspørsel',
        'Konkurranseovervåking',
        'Optimaliser marginer automatisk'
      ]}
      requiredPlan="professional"
      orgId={org?.id || ''}
      hasAccess={true}
    />
  );
}
