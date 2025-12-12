'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  Bot,
  Sparkles,
  ChevronRight,
  Settings,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';

interface AIIntegrationPanelProps {
  module: 'booking' | 'crm' | 'marketing' | 'inventory' | 'accounting' | 'content' | 'capacity';
  userPlan?: 'free' | 'professional' | 'business' | 'enterprise';
  isEnabled?: boolean;
  onToggle?: (enabled: boolean) => void;
}

const moduleConfig = {
  booking: {
    title: 'AI Booking Agent',
    description: 'Automatiser booking-samtaler og oppfølging med AI',
    icon: Bot,
    features: [
      'Automatisk svar på bookingforespørsler 24/7',
      'Intelligent tidspunkt-forslag basert på kapasitet',
      'Automatisk SMS og e-post oppfølging',
      'Kundepreferanser og historikk-analyse'
    ],
    benefits: {
      free: 'Test AI med 3 forhåndsdefinerte svar',
      professional: 'Ubegrenset AI-samtaler + læring',
      business: '+ Prioritert support og avanserte regler',
      enterprise: '+ Dedikert AI-modell tilpasset din bedrift'
    },
    link: '/ai/booking',
    settingsLink: '/booking/settings/ai'
  },
  crm: {
    title: 'AI CRM Assistent',
    description: 'Smart kundeoppfølging og lead-nurturing',
    icon: Sparkles,
    features: [
      'Automatisk lead-scoring og prioritering',
      'Personaliserte oppfølgingsmeldinger',
      'Prediktiv analyse av kundeoppførsel',
      'Automatisk datakvalitetsjekk'
    ],
    benefits: {
      free: 'Grunnleggende lead-scoring (demo)',
      professional: 'Full AI-analyse av alle leads',
      business: '+ Avansert segmentering og automations',
      enterprise: '+ Custom AI-modeller for ditt marked'
    },
    link: '/ai/crm',
    settingsLink: '/kunder/settings/ai'
  },
  marketing: {
    title: 'AI Markedsføring',
    description: 'Intelligent kampanjehåndtering og content-generering',
    icon: TrendingUp,
    features: [
      'Auto-generering av annonsetekster',
      'Optimal timing for kampanjer',
      'A/B-testing automatisering',
      'ROI-prediksjon og budsjett-optimalisering'
    ],
    benefits: {
      free: 'Generer 5 annonsetekster per måned',
      professional: 'Ubegrenset content + kampanje-AI',
      business: '+ Multi-kanal optimalisering',
      enterprise: '+ Dedikert marketing strategist-AI'
    },
    link: '/ai/marketing',
    settingsLink: '/markedsforing/settings/ai'
  },
  inventory: {
    title: 'AI Lager & Bestilling',
    description: 'Smart lagerstyring og automatisk bestilling',
    icon: Zap,
    features: [
      'Prediktiv etterfylling av lager',
      'Automatisk bestillingsforslag',
      'Sesonganalyse og trendprediksjon',
      'Leverandør-optimalisering'
    ],
    benefits: {
      free: 'Grunnleggende lagervarslinger',
      professional: 'Full AI-styrt lagerhåndtering',
      business: '+ Multi-lokasjon optimalisering',
      enterprise: '+ Integrert supply chain AI'
    },
    link: '/ai/inventory',
    settingsLink: '/produkter/settings/ai'
  },
  accounting: {
    title: 'AI Regnskap',
    description: 'Automatisk bokføring og økonomisk analyse',
    icon: CheckCircle2,
    features: [
      'Automatisk kategorisering av transaksjoner',
      'Smart bilagsgjenkjenning (OCR)',
      'Økonomiske prognoser og cashflow-analyse',
      'Automatisk avstemming og varsler'
    ],
    benefits: {
      free: 'Grunnleggende kategorisering (50 trans/mnd)',
      professional: 'Ubegrenset AI-bokføring',
      business: '+ Avansert analyse og prognoser',
      enterprise: '+ Dedikert CFO-AI assistent'
    },
    link: '/ai/accounting',
    settingsLink: '/regnskap/settings/ai'
  },
  content: {
    title: 'AI Innholdsproduksjon',
    description: 'Generer markedsføringsmateriell og sosiale medier innlegg',
    icon: Sparkles,
    features: [
      'Automatisk blogginnhold og artikler',
      'Sosiale medier-planlegging og posting',
      'Bildetekster og hashtag-forslag',
      'SEO-optimalisering'
    ],
    benefits: {
      free: '5 innlegg per måned',
      professional: '100 innlegg + avansert redigering',
      business: '+ Multi-plattform publisering',
      enterprise: '+ Custom brand voice training'
    },
    link: '/ai/content',
    settingsLink: '/markedsforing/content/ai'
  },
  capacity: {
    title: 'AI Kapasitet & Planning',
    description: 'Intelligent ressursplanlegging og optimalisering',
    icon: Clock,
    features: [
      'Automatisk kapasitetsberegning',
      'Optimal arbeidstildeling',
      'Prediktiv vedlikeholdsplanlegging',
      'Real-time belastningsanalyse'
    ],
    benefits: {
      free: 'Grunnleggende kapasitetsoversikt',
      professional: 'Full AI-optimalisering',
      business: '+ Multi-lokasjon koordinering',
      enterprise: '+ Prediktiv vedlikehold AI'
    },
    link: '/ai/capacity',
    settingsLink: '/booking/settings/capacity'
  }
};

export default function AIIntegrationPanel({
  module,
  userPlan = 'free',
  isEnabled = false,
  onToggle
}: AIIntegrationPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const config = moduleConfig[module];
  const Icon = config.icon;

  const handleToggle = async () => {
    if (userPlan === 'free') {
      // Redirect to upgrade
      return;
    }
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      onToggle?.(!isEnabled);
    } finally {
      setIsLoading(false);
    }
  };

  const isPremiumFeature = userPlan === 'free';

  return (
    <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 p-3 text-white">
              <Icon className="w-6 h-6" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {config.title}
                </h3>
                {isPremiumFeature && (
                  <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                    Premium
                  </Badge>
                )}
                {isEnabled && !isPremiumFeature && (
                  <Badge variant="default" className="bg-green-500 text-white">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Aktivert
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                {config.description}
              </p>

              {/* Benefits for current plan */}
              <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 mb-3">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  {userPlan === 'free' ? 'Free Plan' : `${userPlan} Plan`}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  {config.benefits[userPlan]}
                </p>
              </div>

              {/* Expandable features */}
              {isExpanded && (
                <div className="space-y-2 mb-4">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Funksjoner
                  </p>
                  {config.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-purple-600 hover:text-purple-700 dark:text-purple-400"
                >
                  {isExpanded ? (
                    <>
                      <X className="w-4 h-4 mr-1" />
                      Skjul detaljer
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-1" />
                      Se alle funksjoner
                    </>
                  )}
                </Button>

                {!isPremiumFeature && (
                  <>
                    <Link href={config.link}>
                      <Button variant="outline" size="sm">
                        <Bot className="w-4 h-4 mr-1" />
                        Åpne AI-hub
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                    
                    <Link href={config.settingsLink}>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4 mr-1" />
                        Innstillinger
                      </Button>
                    </Link>
                  </>
                )}

                {isPremiumFeature && (
                  <Link href="/plan">
                    <Button 
                      size="sm"
                      className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
                    >
                      <Sparkles className="w-4 h-4 mr-1" />
                      Oppgrader for full tilgang
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Toggle switch (only for non-free users) */}
          {!isPremiumFeature && onToggle && (
            <div className="flex flex-col items-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggle}
                disabled={isLoading}
                className={`
                  relative w-14 h-8 rounded-full transition-colors
                  ${isEnabled 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500'
                  }
                `}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <div
                    className={`
                      absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform
                      ${isEnabled ? 'translate-x-6' : 'translate-x-1'}
                    `}
                  />
                )}
              </Button>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {isEnabled ? 'På' : 'Av'}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
