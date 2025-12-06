'use client';

import { useState } from 'react';
import { useOrgPlan } from '@/components/OrgPlanContext';
import { buildOrgApiUrl } from '@/lib/apiConfig';
import { AIModuleLayout } from '@/components/ai/AIModuleLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Calculator,
  DollarSign,
  TrendingUp,
  PieChart,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function AIAccountingPage() {
  const { org } = useOrgPlan();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [metrics, setMetrics] = useState('');
  const [period, setPeriod] = useState('');

  const handleExplainReport = async () => {
    if (!org?.id) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const endpoint = buildOrgApiUrl(org.id, 'ai/accounting/explain-report');
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics, period }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Kunne ikke forklare rapport');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Noe gikk galt');
    } finally {
      setLoading(false);
    }
  };

  const QuickAction = (
    <div className="space-y-4">
      <div>
        <Label htmlFor="period">Periode</Label>
        <Input
          id="period"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          placeholder="F.eks. 'Q1 2024'"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="metrics">Nøkkeltall og metrics</Label>
        <Textarea
          id="metrics"
          value={metrics}
          onChange={(e) => setMetrics(e.target.value)}
          placeholder="F.eks. 'Omsetning: 450.000 kr, Lønnskostnader: 180.000 kr...'"
          rows={5}
          className="mt-1"
        />
      </div>

      <Button
        onClick={handleExplainReport}
        disabled={loading || !metrics || !period || !org?.id}
        className="w-full"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Analyserer...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            Forklar Rapport
          </>
        )}
      </Button>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {result && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <div className="flex items-start gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-emerald-900 mb-2">AI-forklaring</h3>
              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                {result.explanation || JSON.stringify(result, null, 2)}
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && !result && !error && (
        <div className="text-center py-8">
          <Calculator className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            Fyll ut nøkkeltall over og få AI-drevet forklaring
          </p>
        </div>
      )}
    </div>
  );

  return (
    <AIModuleLayout
      module="accounting"
      title="AI Regnskap Assistent"
      description="AI-drevet finansiell analyse og økonomisk innsikt"
      icon={Calculator}
      stats={[
        {
          label: 'Omsetning',
          value: '485k',
          icon: DollarSign,
          color: 'text-emerald-600',
          subtitle: 'Denne måneden',
        },
        {
          label: 'Margin',
          value: '68%',
          icon: TrendingUp,
          color: 'text-green-600',
          subtitle: 'Dekningsgrad',
        },
        {
          label: 'Kostnader',
          value: '155k',
          icon: PieChart,
          color: 'text-blue-600',
          subtitle: 'Driftskostnader',
        },
        {
          label: 'Innsikt',
          value: '87',
          icon: Sparkles,
          color: 'text-teal-600',
          subtitle: 'AI-analyser',
        },
      ]}
      chatContext="accounting"
      chatWelcomeMessage="Hei! Jeg er din AI regnskaps-assistent. Jeg kan hjelpe deg med å forklare finansielle rapporter, analysere trender, identifisere kostnadsbesparelser og gi økonomisk rådgivning. Hva lurer du på?"
      chatPlaceholder="Spør om regnskapshjelp..."
      quickAction={QuickAction}
      features={[
        'Forklare finansielle rapporter enkelt',
        'Identifisere kostnadsbesparelser',
        'Analysere økonomiske trender',
        'Foreslå budsjettoptimalisering',
        'Beregne nøkkeltall automatisk',
      ]}
      requiredPlan="professional"
      orgId={org?.id || ''}
      hasAccess={true}
    />
  );
}
