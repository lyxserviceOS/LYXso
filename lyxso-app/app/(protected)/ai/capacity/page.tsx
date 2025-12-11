'use client';

import { useOrgPlan } from '@/components/OrgPlanContext';
import { AIModuleLayout } from '@/components/ai/AIModuleLayout';
import { BarChart3, Clock, Calendar, TrendingUp } from 'lucide-react';

export default function AICapacityPage() {
  const { org } = useOrgPlan();

  const QuickAction = (
    <div className="p-8 text-center">
      <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500">Funksjoner kommer snart</p>
    </div>
  );

  return (
    <AIModuleLayout
      module="capacity"
      title="AI Kapasitetsplanlegger"
      description="AI-drevet ressursplanlegging og kapasitetsoptimalisering"
      icon={<BarChart3 className="w-5 h-5" />}
      stats={[
        { label: 'Utnyttelse', value: '82%', icon: <BarChart3 className="w-5 h-5" />, color: 'text-purple-600', subtitle: 'Gjennomsnitt' },
        { label: 'Ledige timer', value: '24', icon: <Clock className="w-5 h-5" />, color: 'text-blue-600', subtitle: 'Neste uke' },
        { label: 'Bookbare', value: '156', icon: <Calendar className="w-5 h-5" />, color: 'text-green-600', subtitle: 'Slots' },
        { label: 'Optimalisering', value: '+18%', icon: <TrendingUp className="w-5 h-5" />, color: 'text-orange-600', subtitle: 'Forbedring' }
      ]}
      chatContext="capacity"
      chatWelcomeMessage="Hei! Jeg er din AI capacity-assistent."
      chatPlaceholder="Spør om capacity-hjelp..."
      quickAction={QuickAction}
      features={[
        'Optimaliser ressursallokering',
        'Prediker toppbelastning',
        'Balanser kapasitet automatisk'
      ]}
      requiredPlan="professional"
      orgId={org?.id || ''}
      hasAccess={true}
    />
  );
}
