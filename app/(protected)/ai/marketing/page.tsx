'use client';

import { useState } from 'react';
import { useOrgPlan } from '@/components/OrgPlanContext';
import { buildOrgApiUrl } from '@/lib/apiConfig';
import { AIModuleLayout } from '@/components/ai/AIModuleLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Megaphone,
  TrendingUp,
  Users,
  Target,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function AIMarketingPage() {
  const { org } = useOrgPlan();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [goal, setGoal] = useState('');
  const [services, setServices] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [tone, setTone] = useState('profesjonell');

  const handleGenerateCampaignIdeas = async () => {
    if (!org?.id) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const endpoint = buildOrgApiUrl(org.id, 'ai/marketing/campaign-ideas');
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, services, targetAudience, tone }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Kunne ikke generere kampanjeidéer');
      }

      const data = await response.json();
      setResult(data.output || data);
    } catch (err: any) {
      setError(err.message || 'Noe gikk galt');
    } finally {
      setLoading(false);
    }
  };

  const QuickAction = (
    <div className="space-y-4">
      <div>
        <Label htmlFor="goal">Kampanjemål</Label>
        <Input
          id="goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="F.eks. 'Øke bookinger i januar'"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="services">Tjenester</Label>
        <Input
          id="services"
          value={services}
          onChange={(e) => setServices(e.target.value)}
          placeholder="F.eks. 'coating, detailing'"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="audience">Målgruppe</Label>
        <Input
          id="audience"
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
          placeholder="F.eks. 'bilentusiaster 25-45 år'"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="tone">Tone</Label>
        <Select value={tone} onValueChange={setTone}>
          <SelectTrigger id="tone" className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="profesjonell">Profesjonell</SelectItem>
            <SelectItem value="entusiastisk">Entusiastisk</SelectItem>
            <SelectItem value="avslappet">Avslappet</SelectItem>
            <SelectItem value="prestisje">Prestisje/luksus</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={handleGenerateCampaignIdeas}
        disabled={loading || !goal || !org?.id}
        className="w-full"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Genererer...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            Generer Kampanjeidéer
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

      {result && result.ideas && (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {result.ideas.map((idea: any, idx: number) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-white">
              <h4 className="font-semibold text-gray-900 mb-2">{idea.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{idea.description}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Budget: {idea.suggestedBudget} kr</span>
                <span>•</span>
                <span>Rekkevidde: {idea.estimatedReach?.toLocaleString()} personer</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !result && !error && (
        <div className="text-center py-8">
          <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            Fyll ut feltene og få AI-drevne kampanjeidéer
          </p>
        </div>
      )}
    </div>
  );

  return (
    <AIModuleLayout
      module="marketing"
      title="AI Marketing Assistent"
      description="AI-drevet kampanjegenerering og markedsføringsoptimalisering"
      icon={<Megaphone className="w-5 h-5" />}
      stats={[
        {
          label: 'Aktive kampanjer',
          value: '8',
          icon: <Target className="w-4 h-4" />,
          color: 'text-pink-600',
          subtitle: 'Kjører nå',
        },
        {
          label: 'Rekkevidde',
          value: '2.4k',
          icon: <Users className="w-4 h-4" />,
          color: 'text-purple-600',
          subtitle: 'Denne måneden',
        },
        {
          label: 'Konvertering',
          value: '4.2%',
          icon: <TrendingUp className="w-4 h-4" />,
          color: 'text-green-600',
          subtitle: 'ROI: 320%',
        },
        {
          label: 'AI-generert',
          value: '142',
          icon: <Sparkles className="w-4 h-4" />,
          color: 'text-orange-600',
          subtitle: 'Kampanjer',
        },
      ]}
      chatContext="marketing"
      chatWelcomeMessage="Hei! Jeg er din AI marketing-assistent. Jeg kan hjelpe deg med å lage kampanjer, skrive annonsetekster, analysere målgrupper og optimalisere budsjetter. Hva ønsker du å markedsføre?"
      chatPlaceholder="Spør om markedsføringshjelp..."
      quickAction={QuickAction}
      features={[
        'Generere kampanjeidéer og strategier',
        'Skrive overbevisende annonsetekster',
        'Analysere målgrupper og segmentering',
        'Optimalisere budsjetter og ROI',
        'Foreslå kanaler og timing',
      ]}
      requiredPlan="professional"
      orgId={org?.id || ''}
      hasAccess={true}
    />
  );
}
