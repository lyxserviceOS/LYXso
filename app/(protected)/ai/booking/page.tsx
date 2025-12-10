'use client';

import { useState } from 'react';
import { useOrgPlan } from '@/components/OrgPlanContext';
import { buildOrgApiUrl } from '@/lib/apiConfig';
import { AIModuleLayout } from '@/components/ai/AIModuleLayout';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  Users,
  TrendingUp,
  CalendarDays,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export default function AIBookingPage() {
  const { org } = useOrgPlan();
  const [analyzing, setAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const analyzeBookingPatterns = async () => {
    if (!org?.id) return;

    setAnalyzing(true);
    setError(null);
    try {
      const endpoint = buildOrgApiUrl(org.id, 'ai/booking/analyze');
      const response = await fetch(endpoint, { method: 'POST' });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Analyse feilet');
      }

      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (err: any) {
      setError(err.message || 'Kunne ikke analysere booking-mønstre');
      console.error('Booking analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const QuickAction = (
    <div className="space-y-4">
      <Button
        onClick={analyzeBookingPatterns}
        disabled={analyzing || !org?.id}
        className="w-full"
        size="lg"
      >
        {analyzing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Analyserer...
          </>
        ) : (
          <>
            <CalendarDays className="w-5 h-5 mr-2" />
            Analyser Booking-mønstre
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

      {suggestions.length > 0 && (
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">
                    {suggestion.title || 'Forslag'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {suggestion.description || suggestion.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!analyzing && suggestions.length === 0 && !error && (
        <div className="text-center py-8">
          <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            Klikk knappen over for å få AI-drevne forslag
          </p>
        </div>
      )}
    </div>
  );

  return (
    <AIModuleLayout
      module="booking"
      title="AI Booking Assistent"
      description="AI-drevet booking-optimalisering og automatisk tidsplanlegging"
      icon={<Calendar className="w-5 h-5" />}
      stats={[
        {
          label: 'I dag',
          value: '12',
          icon: <Calendar className="w-5 h-5" />,
          color: 'text-blue-600',
          subtitle: 'Bookinger',
        },
        {
          label: 'Kapasitet',
          value: '78%',
          icon: <Clock className="w-5 h-5" />,
          color: 'text-green-600',
          subtitle: 'Utnyttelse',
        },
        {
          label: 'Aktive',
          value: '45',
          icon: <Users className="w-5 h-5" />,
          color: 'text-purple-600',
          subtitle: 'Kunder',
        },
        {
          label: 'Vekst',
          value: '+15%',
          icon: <TrendingUp className="w-5 h-5" />,
          color: 'text-orange-600',
          subtitle: 'Forrige uke',
        },
      ]}
      chatContext="booking"
      chatWelcomeMessage="Hei! Jeg er din AI booking-assistent. Jeg kan hjelpe deg med å optimalisere bookinger, foreslå beste tider, og automatisere påminnelser. Hva kan jeg hjelpe deg med?"
      chatPlaceholder="Spør om booking-hjelp..."
      quickAction={QuickAction}
      features={[
        'Foreslå optimale booking-tider',
        'Automatisk påminnelser og oppfølging',
        'Kapasitetsplanlegging',
        'Identifiser booking-flaskehalser',
        'Smart ressursallokering',
      ]}
      requiredPlan="professional"
      orgId={org?.id || ''}
      hasAccess={true}
    />
  );
}
