'use client';

import { useOrgPlan } from '@/components/OrgPlanContext';
import { AIModuleLayout } from '@/components/ai/AIModuleLayout';
import { MessageCircle } from 'lucide-react';

export default function AIChatPage() {
  const { org } = useOrgPlan();

  const QuickAction = (
    <div className="p-8 text-center">
      <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500">Funksjoner kommer snart</p>
    </div>
  );

  return (
    <AIModuleLayout
      module="chat"
      title="AI Chat Support"
      description="AI-drevet kundeservice og live chat"
      icon={MessageCircle}
      stats={[
        { label: 'Samtaler', value: '1.2k', icon: MessageCircle, color: 'text-cyan-600', subtitle: 'Denne måneden' },
        { label: 'Responstid', value: '< 2s', icon: Clock, color: 'text-green-600', subtitle: 'Gjennomsnitt' },
        { label: 'Løst av AI', value: '78%', icon: CheckCircle, color: 'text-blue-600', subtitle: 'Automatisk' },
        { label: 'Fornøydhet', value: '4.8', icon: Star, color: 'text-yellow-600', subtitle: 'Rating' }
      ]}
      chatContext="chat"
      chatWelcomeMessage="Hei! Jeg er din AI chat-assistent."
      chatPlaceholder="Spør om chat-hjelp..."
      quickAction={QuickAction}
      features={[
        '24/7 AI kundeservice',
        'Automatisk FAQ-respons',
        'Smart eskalering til menneske'
      ]}
      requiredPlan="professional"
      orgId={org?.id || ''}
      hasAccess={true}
    />
  );
}
