'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Megaphone, 
  Calculator, 
  BarChart3, 
  Eye, 
  FileText, 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp,
  Sparkles,
  Bot,
  ArrowRight,
  Activity
} from 'lucide-react';
import { AIModuleCard } from '@/components/ai/AIModuleCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AIModule {
  id: string;
  title: string;
  description: string;
  icon: any;
  href: string;
  benefits: string[];
  isLocked: boolean;
  requiredPlan: 'professional' | 'enterprise';
  gradientFrom: string;
  gradientTo: string;
}

const aiModules: AIModule[] = [
  {
    id: 'booking',
    title: 'AI Booking Assistent',
    description: 'Optimaliser bookinger og kapasitet automatisk',
    icon: Calendar,
    href: '/ai/booking',
    benefits: [
      'Foreslår optimale booking-tider',
      'Automatiske påminnelser',
      'Kapasitetsplanlegging',
    ],
    isLocked: false,
    requiredPlan: 'professional',
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-cyan-500',
  },
  {
    id: 'marketing',
    title: 'AI Marketing',
    description: 'Generer kampanjer og annonsetekster',
    icon: Megaphone,
    href: '/ai/marketing',
    benefits: [
      'AI-genererte kampanjeidéer',
      'Overbevisende annonsetekster',
      'Målgruppeanalyse',
    ],
    isLocked: false,
    requiredPlan: 'professional',
    gradientFrom: 'from-pink-500',
    gradientTo: 'to-purple-500',
  },
  {
    id: 'accounting',
    title: 'AI Regnskap',
    description: 'Forklar finansielle rapporter enkelt',
    icon: Calculator,
    href: '/ai/accounting',
    benefits: [
      'Forklarer finansielle rapporter',
      'Identifiserer kostnadsbesparelser',
      'Trendanalyse',
    ],
    isLocked: false,
    requiredPlan: 'professional',
    gradientFrom: 'from-emerald-500',
    gradientTo: 'to-teal-500',
  },
  {
    id: 'capacity',
    title: 'AI Kapasitet',
    description: 'Analyser og optimaliser ressursbruk',
    icon: BarChart3,
    href: '/ai/capacity',
    benefits: [
      'Kapasitetsutnyttelse',
      'Identifiser flaskehalser',
      'Ressursoptimalisering',
    ],
    isLocked: false,
    requiredPlan: 'professional',
    gradientFrom: 'from-indigo-500',
    gradientTo: 'to-blue-500',
  },
  {
    id: 'coatvision',
    title: 'LYX Vision',
    description: 'Bildeprediktering og analyse',
    icon: Eye,
    href: '/ai/coatvision',
    benefits: [
      'Før/etter predikering',
      'Skadegjenkjenning',
      'Dekkmønster-analyse',
    ],
    isLocked: false,
    requiredPlan: 'professional',
    gradientFrom: 'from-green-500',
    gradientTo: 'to-emerald-500',
  },
  {
    id: 'content',
    title: 'AI Innhold',
    description: 'Generer markedsføringsinnhold',
    icon: FileText,
    href: '/ai/content',
    benefits: [
      'Blogginnlegg',
      'Sosiale medier-tekster',
      'Produktbeskrivelser',
    ],
    isLocked: false,
    requiredPlan: 'professional',
    gradientFrom: 'from-orange-500',
    gradientTo: 'to-amber-500',
  },
  {
    id: 'crm',
    title: 'AI CRM',
    description: 'Intelligent kunderelasjoner',
    icon: Users,
    href: '/ai/crm',
    benefits: [
      'Kundesegmentering',
      'Churn-predikering',
      'Personaliserte kampanjer',
    ],
    isLocked: false,
    requiredPlan: 'professional',
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-pink-500',
  },
  {
    id: 'inventory',
    title: 'AI Lager',
    description: 'Optimaliser lagerbeholdning',
    icon: Package,
    href: '/ai/inventory',
    benefits: [
      'Etterfyllingspredikering',
      'Etterspørselsanalyse',
      'Kostnadsoptimalisering',
    ],
    isLocked: false,
    requiredPlan: 'professional',
    gradientFrom: 'from-cyan-500',
    gradientTo: 'to-blue-500',
  },
  {
    id: 'pricing',
    title: 'AI Prissetting',
    description: 'Dynamisk prisoptimalisering',
    icon: DollarSign,
    href: '/ai/pricing',
    benefits: [
      'Optimal pricing',
      'Konkurranseanalyse',
      'Revenue optimization',
    ],
    isLocked: false,
    requiredPlan: 'professional',
    gradientFrom: 'from-yellow-500',
    gradientTo: 'to-orange-500',
  },
  {
    id: 'upsell',
    title: 'AI Mersalg',
    description: 'Intelligent produkt-anbefalinger',
    icon: TrendingUp,
    href: '/ai/upsell',
    benefits: [
      'Personaliserte anbefalinger',
      'Øk ordrevalue',
      'Cross-sell muligheter',
    ],
    isLocked: false,
    requiredPlan: 'professional',
    gradientFrom: 'from-rose-500',
    gradientTo: 'to-pink-500',
  },
];

export function AIHubClient() {
  const [stats, setStats] = useState({
    totalSaved: 0,
    bookingsHandled: 0,
    contentGenerated: 0,
    revenueOptimized: 0,
  });

  useEffect(() => {
    // Mock data - replace with real API call
    setStats({
      totalSaved: 45,
      bookingsHandled: 128,
      contentGenerated: 24,
      revenueOptimized: 12,
    });
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">AI Hub</h1>
            <p className="text-gray-600 mt-1">
              Intelligent automatisering på tvers av hele bedriften
            </p>
          </div>
        </div>

        {/* LYXba Quick Access */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 mb-6">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">LYXba - Booking Agent</h3>
                  <p className="text-sm text-gray-600">
                    AI-drevet kundeservice som håndterer samtaler automatisk
                  </p>
                </div>
              </div>
              <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Link href="/ai-agent">
                  Åpne LYXba
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-600" />
              Timer spart
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{stats.totalSaved}t</p>
            <p className="text-xs text-gray-500 mt-1">Denne måneden</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Bookinger
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{stats.bookingsHandled}</p>
            <p className="text-xs text-gray-500 mt-1">Fullført av LYXba</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-600" />
              Innhold
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{stats.contentGenerated}</p>
            <p className="text-xs text-gray-500 mt-1">AI-genererte innlegg</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              Revenue +
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">+{stats.revenueOptimized}%</p>
            <p className="text-xs text-gray-500 mt-1">Prisoptimalisering</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Modules Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">AI-moduler</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiModules.map((module) => (
            <AIModuleCard
              key={module.id}
              title={module.title}
              description={module.description}
              icon={module.icon}
              href={module.href}
              benefits={module.benefits}
              isLocked={module.isLocked}
              requiredPlan={module.requiredPlan}
              gradientFrom={module.gradientFrom}
              gradientTo={module.gradientTo}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
