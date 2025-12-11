'use client';

import { useOrgPlan } from '@/components/OrgPlanContext';
import { AIModuleLayout } from '@/components/ai/AIModuleLayout';
import { Package, DollarSign, TrendingDown, Brain } from 'lucide-react';

export default function AIInventoryPage() {
  const { org } = useOrgPlan();

  const QuickAction = (
    <div className="p-8 text-center">
      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500">Funksjoner kommer snart</p>
    </div>
  );

  return (
    <AIModuleLayout
      module="inventory"
      title="AI Lager Assistent"
      description="AI-drevet lagerstyring og etterfylling"
      icon={<Package className="w-5 h-5" />}
      stats={[
        {
          label: 'Produkter',
          value: '342',
          icon: <Package className="w-4 h-4" />,
          color: 'text-amber-600',
          subtitle: 'På lager',
        },
        {
          label: 'Verdi',
          value: '285k',
          icon: <DollarSign className="w-4 h-4" />,
          color: 'text-green-600',
          subtitle: 'Lagerverdi',
        },
        {
          label: 'Etterfylling',
          value: '12',
          icon: <TrendingDown className="w-4 h-4" />,
          color: 'text-red-600',
          subtitle: 'Trengs',
        },
        {
          label: 'Predikert',
          value: '94%',
          icon: <Brain className="w-4 h-4" />,
          color: 'text-purple-600',
          subtitle: 'Nøyaktighet',
        },
      ]}
      chatContext="inventory"
      chatWelcomeMessage="Hei! Jeg er din AI inventory-assistent."
      chatPlaceholder="Spør om inventory-hjelp..."
      quickAction={QuickAction}
      features={[
        'Prediker lagerbehov',
        'Optimaliser bestillinger',
        'Identifiser langsomgående varer'
      ]}
      requiredPlan="professional"
      orgId={org?.id || ''}
      hasAccess={true}
    />
  );
}
