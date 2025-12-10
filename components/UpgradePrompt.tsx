'use client';

import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Lock } from 'lucide-react';

interface UpgradePromptProps {
  feature: string;
  description: string;
  requiredPlan: 'professional' | 'enterprise';
  className?: string;
}

export function UpgradePrompt({ 
  feature, 
  description, 
  requiredPlan,
  className 
}: UpgradePromptProps) {
  const planName = requiredPlan === 'enterprise' ? 'Enterprise' : 'Professional';

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              Oppgrader til {planName}
            </CardTitle>
            <CardDescription className="mt-1">
              {feature} krever {planName}-planen
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          {description}
        </p>
        <div className="flex gap-3">
          <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <Sparkles className="w-4 h-4 mr-2" />
            Oppgrader nå
          </Button>
          <Button size="sm" variant="outline">
            Se priser
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
