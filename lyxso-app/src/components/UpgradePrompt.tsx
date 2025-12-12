'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, Lock, Zap } from 'lucide-react';
import Link from 'next/link';

interface UpgradePromptProps {
  feature: string;
  description?: string;
  requiredPlan?: 'professional' | 'enterprise';
  compact?: boolean;
  className?: string;
}

const planFeatures = {
  professional: [
    'Offentlig bookingside',
    'Automatisk publisering til sosiale medier',
    'Ubegrenset AI-generering',
    'Prioritert support',
    'Custom subdomain',
  ],
  enterprise: [
    'Alt i Professional',
    'Dedikert account manager',
    'Custom integrasjoner',
    'SLA-garantier',
    'On-premise deployment',
  ],
};

export function UpgradePrompt({
  feature,
  description,
  requiredPlan = 'professional',
  compact = false,
  className = '',
}: UpgradePromptProps) {
  if (compact) {
    return (
      <div className={`border border-amber-200 bg-amber-50 rounded-lg p-4 ${className}`}>
        <div className="flex items-start gap-3">
          <Lock className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-amber-900">{feature}</h4>
            {description && <p className="text-sm text-amber-700 mt-1">{description}</p>}
            <Button asChild size="sm" className="mt-3" variant="default">
              <Link href="/abonnement">
                <Sparkles className="h-4 w-4 mr-2" />
                Oppgrader til {requiredPlan === 'professional' ? 'Professional' : 'Enterprise'}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className={`border-2 border-amber-200 ${className}`}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-600" />
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">
            {requiredPlan === 'professional' ? 'Professional' : 'Enterprise'} Plan
          </Badge>
        </div>
        <CardTitle className="text-xl">{feature}</CardTitle>
        {description && <CardDescription className="text-base">{description}</CardDescription>}
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <p className="font-semibold text-sm">Inkludert i planen:</p>
          <ul className="space-y-2">
            {planFeatures[requiredPlan].map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        <Button asChild className="w-full" size="lg">
          <Link href="/abonnement">
            <Zap className="h-4 w-4 mr-2" />
            Oppgrader nå
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="w-full">
          <Link href="/abonnement">Se alle planer og priser</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
