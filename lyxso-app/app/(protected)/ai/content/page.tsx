'use client';

import { useState } from 'react';
import { useOrgPlan } from '@/components/OrgPlanContext';
import { buildOrgApiUrl } from '@/lib/apiConfig';
import { AIModuleLayout } from '@/components/ai/AIModuleLayout';
import { Button } from '@/components/ui/button';
import { FileText, Zap, Eye, Sparkles } from 'lucide-react';

export default function AIContentPage() {
  const { org } = useOrgPlan();
  const QuickAction = <div className="p-4"><p className="text-gray-500 text-sm">Content generation kommer snart</p></div>;

  return (
    <AIModuleLayout
      module="content"
      title="AI Content Generator"
      description="AI-drevet innholdsproduksjon"
      icon={<FileText className="w-5 h-5" />}
      stats={[
        {
          label: 'Generert',
          value: '234',
          icon: <FileText className="w-4 h-4" />,
          color: 'text-blue-600',
          subtitle: 'Dokumenter',
        },
        {
          label: 'Visninger',
          value: '18.5k',
          icon: <Eye className="w-4 h-4" />,
          color: 'text-purple-600',
          subtitle: 'Total reach',
        },
        {
          label: 'Hastighet',
          value: '< 30s',
          icon: <Zap className="w-4 h-4" />,
          color: 'text-orange-600',
          subtitle: 'Generering',
        },
        {
          label: 'Kvalitet',
          value: '94%',
          icon: <Sparkles className="w-4 h-4" />,
          color: 'text-green-600',
          subtitle: 'Godkjent',
        },
      ]}
      chatContext="content"
      chatWelcomeMessage="Hei! Jeg er din AI content-assistent."
      chatPlaceholder="Spør om innholdshjelp..."
      quickAction={QuickAction}
      features={['Generer landingssider', 'Skriv blogginnlegg', 'Lag SMS-kampanjer']}
      requiredPlan="professional"
      orgId={org?.id || ''}
      hasAccess={true}
    />
  );
}
