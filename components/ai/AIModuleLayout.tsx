'use client';

import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UpgradePrompt } from '@/components/UpgradePrompt';

export type AIModule = 
  | 'booking' 
  | 'marketing' 
  | 'accounting' 
  | 'capacity' 
  | 'coatvision' 
  | 'content' 
  | 'crm' 
  | 'inventory' 
  | 'pricing' 
  | 'upsell'
  | 'chat';

interface StatCard {
  label: string;
  value: string | number;
  icon: ReactNode;
  color: string;
  subtitle?: string;
}

interface AIModuleLayoutProps {
  module?: string;
  title: string;
  description: string;
  icon: ReactNode;
  stats?: StatCard[];
  chatContext: string;
  chatWelcomeMessage: string;
  chatPlaceholder?: string;
  quickAction?: ReactNode;
  features: string[];
  requiredPlan?: 'professional' | 'enterprise';
  orgId: string;
  hasAccess?: boolean;
  gradientFrom?: string;
  gradientTo?: string;
}

const moduleColors: Record<AIModule, { from: string; to: string }> = {
  booking: { from: 'from-blue-500', to: 'to-cyan-500' },
  marketing: { from: 'from-pink-500', to: 'to-purple-500' },
  accounting: { from: 'from-emerald-500', to: 'to-teal-500' },
  capacity: { from: 'from-indigo-500', to: 'to-blue-500' },
  coatvision: { from: 'from-green-500', to: 'to-emerald-500' },
  content: { from: 'from-orange-500', to: 'to-amber-500' },
  crm: { from: 'from-purple-500', to: 'to-pink-500' },
  inventory: { from: 'from-cyan-500', to: 'to-blue-500' },
  pricing: { from: 'from-yellow-500', to: 'to-orange-500' },
  upsell: { from: 'from-rose-500', to: 'to-pink-500' },
  chat: { from: 'from-slate-500', to: 'to-gray-500' },
};

export function AIModuleLayout({
  module,
  title,
  description,
  icon,
  stats = [],
  chatContext,
  chatWelcomeMessage,
  chatPlaceholder,
  quickAction,
  features,
  requiredPlan = 'professional',
  orgId,
  hasAccess = true,
  gradientFrom,
  gradientTo,
}: AIModuleLayoutProps) {
  const colors = module && moduleColors[module as AIModule] 
    ? moduleColors[module as AIModule] 
    : { from: 'from-blue-500', to: 'to-blue-500' };
  const gradient = `${gradientFrom || colors.from} ${gradientTo || colors.to}`;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-2 bg-gradient-to-br ${gradient} rounded-lg shadow-lg`}>
            {icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600 mt-1">{description}</p>
          </div>
        </div>
      </div>

      {/* Check access */}
      {!hasAccess && (
        <UpgradePrompt
          feature={title}
          description={description}
          requiredPlan={requiredPlan}
          className="mb-6"
        />
      )}

      {/* Stats Cards */}
      {hasAccess && stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  {stat.icon}
                  <span className="text-sm text-gray-600">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                {stat.subtitle && (
                  <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Main Content - Two Columns */}
      {hasAccess && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: AI Chat */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              {icon}
              Chat med AI
            </h2>
            {/* Placeholder for AIChatInterface - import if needed */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 italic">{chatWelcomeMessage}</p>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder={chatPlaceholder || "Skriv en melding..."}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500">Chat-funksjonalitet kommer snart</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Quick Action */}
          <div className="space-y-6">
            {quickAction && (
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {icon}
                    Hurtighandlinger
                  </CardTitle>
                  <CardDescription>
                    Utfør AI-drevne oppgaver raskt
                  </CardDescription>
                </CardHeader>
                <CardContent>{quickAction}</CardContent>
              </Card>
            )}

            {/* Features */}
            <Card className={`border-2 bg-gradient-to-br ${gradient} bg-opacity-5`}>
              <CardHeader>
                <CardTitle className="text-lg">Hva AI kan hjelpe med</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
