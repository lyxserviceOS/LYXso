'use client';

import { useOrgPlan } from '@/components/OrgPlanContext';
import { AIModuleLayout } from '@/components/ai/AIModuleLayout';
import { TrendingUp } from 'lucide-react';

export default function AIUpsellPage() {
  const { org } = useOrgPlan();

  const QuickAction = (
    <div className="p-8 text-center">
      <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500">Funksjoner kommer snart</p>
    </div>
  );

  return (
    <AIModuleLayout
      module="upsell"
      title="AI Upsell Assistent"
      description="AI-drevet mersalg og produktanbefalinger"
      icon={TrendingUp}
      stats={[
        { label: 'Upsells', value: '234', icon: ShoppingCart, color: 'text-indigo-600', subtitle: 'Denne måneden' },
        { label: 'Rate', value: '42%', icon: Percent, color: 'text-green-600', subtitle: 'Accept' },
        { label: 'Ekstra omsetning', value: '125k', icon: DollarSign, color: 'text-emerald-600', subtitle: 'Fra AI' },
        { label: 'AOV', value: '+35%', icon: TrendingUp, color: 'text-purple-600', subtitle: 'Økning' }
      ]}
      chatContext="upsell"
      chatWelcomeMessage="Hei! Jeg er din AI upsell-assistent."
      chatPlaceholder="Spør om upsell-hjelp..."
      quickAction={QuickAction}
      features={[
        'Intelligent produktanbefaling',
        'Optimaliser bundling',
        'Identifiser upsell-muligheter'
      ]}
      requiredPlan="professional"
      orgId={org?.id || ''}
      hasAccess={true}
    />
  );
}
