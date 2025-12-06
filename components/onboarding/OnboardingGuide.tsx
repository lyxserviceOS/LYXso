'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  CheckCircle2,
  Circle,
  ChevronRight,
  X,
  Sparkles,
  Calendar,
  Users,
  TrendingUp,
  Package,
  FileText,
  Settings,
  Zap,
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  link: string;
  isCompleted: boolean;
  isOptional: boolean;
  estimatedTime: string;
  category: 'essential' | 'recommended' | 'advanced';
}

interface OnboardingGuideProps {
  onDismiss?: () => void;
  autoSave?: boolean;
}

export default function OnboardingGuide({ onDismiss, autoSave = true }: OnboardingGuideProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'essential' | 'recommended' | 'advanced'>('all');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  // Load saved progress
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('onboarding-progress');
      if (saved) {
        try {
          setCompletedSteps(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to load onboarding progress', e);
        }
      }
    }
  }, []);

  // Auto-save progress
  useEffect(() => {
    if (autoSave && typeof window !== 'undefined') {
      localStorage.setItem('onboarding-progress', JSON.stringify(completedSteps));
    }
  }, [completedSteps, autoSave]);

  const steps: OnboardingStep[] = [
    // Essential steps
    {
      id: 'company-info',
      title: 'Bedriftsinformasjon',
      description: 'Legg til bedriftsnavn, logo og kontaktinformasjon',
      icon: Settings,
      link: '/org-settings/general',
      isCompleted: completedSteps.includes('company-info'),
      isOptional: false,
      estimatedTime: '5 min',
      category: 'essential'
    },
    {
      id: 'booking-setup',
      title: 'Sett opp booking',
      description: 'Konfigurer tjenester, priser og tilgjengelighet',
      icon: Calendar,
      link: '/booking/settings',
      isCompleted: completedSteps.includes('booking-setup'),
      isOptional: false,
      estimatedTime: '10 min',
      category: 'essential'
    },
    {
      id: 'staff-setup',
      title: 'Legg til ansatte',
      description: 'Inviter teammedlemmer og sett opp roller',
      icon: Users,
      link: '/ansatte',
      isCompleted: completedSteps.includes('staff-setup'),
      isOptional: false,
      estimatedTime: '5 min',
      category: 'essential'
    },
    
    // Recommended steps
    {
      id: 'ai-booking',
      title: 'Aktiver AI Booking Agent',
      description: 'La AI håndtere bookinger 24/7 automatisk',
      icon: Sparkles,
      link: '/ai/booking',
      isCompleted: completedSteps.includes('ai-booking'),
      isOptional: true,
      estimatedTime: '3 min',
      category: 'recommended'
    },
    {
      id: 'marketing-setup',
      title: 'Markedsføring',
      description: 'Koble til Google/Meta annonser og start kampanjer',
      icon: TrendingUp,
      link: '/markedsforing',
      isCompleted: completedSteps.includes('marketing-setup'),
      isOptional: true,
      estimatedTime: '15 min',
      category: 'recommended'
    },
    {
      id: 'crm-setup',
      title: 'CRM & Kunder',
      description: 'Importer eksisterende kunder og sett opp oppfølging',
      icon: Users,
      link: '/kunder',
      isCompleted: completedSteps.includes('crm-setup'),
      isOptional: true,
      estimatedTime: '10 min',
      category: 'recommended'
    },
    {
      id: 'inventory-setup',
      title: 'Lager & Produkter',
      description: 'Legg til produkter og aktiver smart lagerstyring',
      icon: Package,
      link: '/produkter',
      isCompleted: completedSteps.includes('inventory-setup'),
      isOptional: true,
      estimatedTime: '20 min',
      category: 'recommended'
    },

    // Advanced steps
    {
      id: 'accounting-setup',
      title: 'Regnskap & Fakturering',
      description: 'Koble til regnskapssystem og sett opp automatisk fakturering',
      icon: FileText,
      link: '/regnskap',
      isCompleted: completedSteps.includes('accounting-setup'),
      isOptional: true,
      estimatedTime: '15 min',
      category: 'advanced'
    },
    {
      id: 'integrations',
      title: 'Integrasjoner',
      description: 'Koble til eksterne systemer og APIer',
      icon: Zap,
      link: '/integrasjoner',
      isCompleted: completedSteps.includes('integrations'),
      isOptional: true,
      estimatedTime: '10 min',
      category: 'advanced'
    },
    {
      id: 'landing-page',
      title: 'Landingsside',
      description: 'Lag en profesjonell nettside for din bedrift',
      icon: TrendingUp,
      link: '/landingsside-builder',
      isCompleted: completedSteps.includes('landing-page'),
      isOptional: true,
      estimatedTime: '30 min',
      category: 'advanced'
    }
  ];

  const filteredSteps = activeCategory === 'all' 
    ? steps 
    : steps.filter(s => s.category === activeCategory);

  const essentialSteps = steps.filter(s => s.category === 'essential');
  const completedEssential = essentialSteps.filter(s => s.isCompleted).length;
  const totalEssential = essentialSteps.length;
  const overallProgress = (completedSteps.length / steps.length) * 100;
  const essentialProgress = (completedEssential / totalEssential) * 100;

  const toggleStep = (stepId: string) => {
    setCompletedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  if (isMinimized) {
    return (
      <Card className="border-2 border-purple-500/20 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Oppstartsguide
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {completedSteps.length} av {steps.length} fullført
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={overallProgress} className="w-32" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(false)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 p-3 text-white">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Velkommen til LYXso! 🎉
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                La oss sette opp din bedrift sammen. Hopp over det du vil - alt lagres automatisk.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
            >
              Minimer
            </Button>
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Progress overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-white/60 dark:bg-gray-800/60">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Essensielt</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {completedEssential}/{totalEssential}
                </p>
              </div>
            </div>
            <Progress value={essentialProgress} className="mt-2" />
          </Card>

          <Card className="p-4 bg-white/60 dark:bg-gray-800/60">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Totalt</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {completedSteps.length}/{steps.length}
                </p>
              </div>
            </div>
            <Progress value={overallProgress} className="mt-2" />
          </Card>

          <Card className="p-4 bg-white/60 dark:bg-gray-800/60">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {overallProgress === 100 ? 'Fullført! 🎉' : `${Math.round(overallProgress)}% ferdig`}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Button
            variant={activeCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory('all')}
          >
            Alle ({steps.length})
          </Button>
          <Button
            variant={activeCategory === 'essential' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory('essential')}
            className={activeCategory === 'essential' ? 'bg-orange-500 hover:bg-orange-600' : ''}
          >
            <AlertCircle className="w-4 h-4 mr-1" />
            Essensielt ({essentialSteps.length})
          </Button>
          <Button
            variant={activeCategory === 'recommended' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory('recommended')}
            className={activeCategory === 'recommended' ? 'bg-blue-500 hover:bg-blue-600' : ''}
          >
            Anbefalt ({steps.filter(s => s.category === 'recommended').length})
          </Button>
          <Button
            variant={activeCategory === 'advanced' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory('advanced')}
            className={activeCategory === 'advanced' ? 'bg-purple-500 hover:bg-purple-600' : ''}
          >
            Avansert ({steps.filter(s => s.category === 'advanced').length})
          </Button>
        </div>

        {/* Steps list */}
        <div className="space-y-3">
          {filteredSteps.map((step) => {
            const StepIcon = step.icon;
            return (
              <Card
                key={step.id}
                className={`p-4 transition-all ${
                  step.isCompleted
                    ? 'bg-green-50/50 dark:bg-green-950/20 border-green-500/30'
                    : 'bg-white/60 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleStep(step.id)}
                    className="mt-0.5"
                  >
                    {step.isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400" />
                    )}
                  </button>

                  {/* Icon */}
                  <div className={`rounded-lg p-2 ${
                    step.category === 'essential' ? 'bg-orange-100 dark:bg-orange-900/30' :
                    step.category === 'recommended' ? 'bg-blue-100 dark:bg-blue-900/30' :
                    'bg-purple-100 dark:bg-purple-900/30'
                  }`}>
                    <StepIcon className={`w-5 h-5 ${
                      step.category === 'essential' ? 'text-orange-600 dark:text-orange-400' :
                      step.category === 'recommended' ? 'text-blue-600 dark:text-blue-400' :
                      'text-purple-600 dark:text-purple-400'
                    }`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-semibold ${
                        step.isCompleted 
                          ? 'text-gray-500 dark:text-gray-400 line-through' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {step.title}
                      </h4>
                      {!step.isOptional && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                          Påkrevd
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {step.estimatedTime}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {step.description}
                    </p>
                    <Link href={step.link}>
                      <Button
                        size="sm"
                        variant={step.isCompleted ? 'outline' : 'default'}
                      >
                        {step.isCompleted ? 'Se innstillinger' : 'Start nå'}
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        {overallProgress === 100 && (
          <Card className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-500/30">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Gratulerer! Du har fullført oppsettet! 🎉
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Din bedrift er nå klar for å ta imot kunder. Utforsk alle funksjonene og se hvordan LYXso kan hjelpe deg.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Card>
  );
}
