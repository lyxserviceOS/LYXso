// components/marketing/UpgradePrompt.tsx
'use client';

import React from 'react';
import { TrendingUp, Sparkles, Zap, Users, BarChart3, Calendar, CheckCircle, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UpgradePromptProps {
  context?: 'leads' | 'marketing' | 'automation' | 'analytics' | 'booking' | 'general';
  compact?: boolean;
  className?: string;
}

const contextConfig = {
  leads: {
    icon: Users,
    title: 'Få flere leads med AI-drevet markedsføring',
    benefits: [
      'Automatisk lead-tracking og oppfølging',
      'AI-optimaliserte annonser på Facebook/Google',
      'Smart lead-scoring og prioritering',
      'Integrasjon med CRM og booking'
    ],
    cta: 'Oppgrader for flere leads'
  },
  marketing: {
    icon: TrendingUp,
    title: 'Supercharge markedsføringen din med AI',
    benefits: [
      'AI-generert annonsering innhold',
      'Automatisk publisering til sosiale medier',
      'A/B-testing og optimalisering',
      'Avansert målgruppeanalyse'
    ],
    cta: 'Se markedsføringsplaner'
  },
  automation: {
    icon: Zap,
    title: 'Automatiser og spar tid med AI',
    benefits: [
      'Auto-publisering til Facebook, Instagram, Google',
      'AI-assistert kundeservice',
      'Automatisk fakturering og påminnelser',
      'Smart scheduling og optimalisering'
    ],
    cta: 'Start automatisering'
  },
  analytics: {
    icon: BarChart3,
    title: 'Få full oversikt med avansert analyse',
    benefits: [
      'Sanntids-dashboards og rapporter',
      'ROI-tracking for alle kampanjer',
      'Kundeadferd og segmentering',
      'Prediktiv analyse med AI'
    ],
    cta: 'Se analyseverktøy'
  },
  booking: {
    icon: Calendar,
    title: 'Profesjonell booking med eget domene',
    benefits: [
      'Din egen booking-side på www.[dittfirma].lyxso.no',
      'Ingen LYXso-branding (white label)',
      'Ubegrenset antall bookinger',
      'Integrasjon med betalingsløsninger'
    ],
    cta: 'Oppgrader booking'
  },
  general: {
    icon: Sparkles,
    title: 'Oppgrader til Premium',
    benefits: [
      'AI-drevet markedsføring og automatisering',
      'Ubegrenset antall bookinger og kunder',
      'Prioritert support 24/7',
      'Alle premium-funksjoner inkludert'
    ],
    cta: 'Se alle fordeler'
  }
};

export default function UpgradePrompt({ context = 'general', compact = false, className = '' }: UpgradePromptProps) {
  const router = useRouter();
  const config = contextConfig[context];
  const Icon = config.icon;

  if (compact) {
    return (
      <div className={`bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 rounded-full p-2">
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-slate-900">{config.title}</div>
              <div className="text-sm text-slate-600">Fra 299 kr/mnd</div>
            </div>
          </div>
          <button
            onClick={() => router.push('/priser')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
          >
            Oppgrader
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-200 rounded-xl p-6 ${className}`}>
      <div className="flex items-start gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-full p-4 flex-shrink-0">
          <Icon className="h-8 w-8 text-white" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {config.title}
          </h3>
          
          <div className="grid md:grid-cols-2 gap-3 mb-4">
            {config.benefits.map((benefit, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/priser')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              {config.cta}
              <ArrowRight className="h-5 w-5" />
            </button>
            
            <div className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">Fra 299 kr/mnd</span>
              <br />
              <span className="text-xs">Første 30 dager gratis</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Quick inline version for smaller spaces
export function UpgradeBadge({ onClick }: { onClick?: () => void }) {
  const router = useRouter();
  
  return (
    <button
      onClick={onClick || (() => router.push('/priser'))}
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-full transition-all shadow-md hover:shadow-lg"
    >
      <Sparkles className="h-4 w-4" />
      Oppgrader til Premium
    </button>
  );
}
