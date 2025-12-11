'use client';

import Link from 'next/link';
import { LucideIcon, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AIModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  benefits: string[];
  isLocked?: boolean;
  requiredPlan?: 'professional' | 'enterprise';
  variant?: 'compact' | 'expanded';
  gradientFrom?: string;
  gradientTo?: string;
}

export function AIModuleCard({
  title,
  description,
  icon: Icon,
  href,
  benefits,
  isLocked = false,
  requiredPlan = 'professional',
  variant = 'compact',
  gradientFrom = 'from-blue-500',
  gradientTo = 'to-cyan-500',
}: AIModuleCardProps) {
  if (variant === 'compact') {
    return (
      <Card className={`group hover:shadow-lg transition-all duration-300 ${isLocked ? 'border-amber-200 bg-amber-50' : 'border-gray-200 hover:border-blue-300'}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className={`p-3 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-lg shadow-md ${isLocked ? 'opacity-50' : ''}`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            {isLocked && (
              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                <Lock className="w-3 h-3 mr-1" />
                {requiredPlan === 'professional' ? 'Professional' : 'Enterprise'}
              </Badge>
            )}
          </div>
          <CardTitle className="text-lg mt-4">{title}</CardTitle>
          <CardDescription className="text-sm">{description}</CardDescription>
        </CardHeader>
        <CardFooter>
          {isLocked ? (
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/abonnement">
                <Sparkles className="w-4 h-4 mr-2" />
                Oppgrader for tilgang
              </Link>
            </Button>
          ) : (
            <Button asChild variant="default" size="sm" className="w-full group-hover:bg-blue-600">
              <Link href={href}>
                Åpne
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  // Expanded variant
  return (
    <Card className={`${isLocked ? 'border-2 border-amber-200 bg-amber-50' : 'border-gray-200'}`}>
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className={`p-3 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-lg shadow-lg ${isLocked ? 'opacity-50' : ''}`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-xl">{title}</CardTitle>
              {isLocked && (
                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                  <Lock className="w-3 h-3 mr-1" />
                  {requiredPlan === 'professional' ? 'Professional' : 'Enterprise'}
                </Badge>
              )}
            </div>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="font-semibold text-sm text-gray-700">Fordeler:</p>
          <ul className="space-y-1.5">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        {isLocked ? (
          <>
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link href={href}>
                <span className="opacity-50">Se demo</span>
              </Link>
            </Button>
            <Button asChild variant="default" size="sm" className="flex-1">
              <Link href="/abonnement">
                <Sparkles className="w-4 h-4 mr-2" />
                Oppgrader nå
              </Link>
            </Button>
          </>
        ) : (
          <Button asChild variant="default" size="sm" className="w-full">
            <Link href={href}>
              Åpne {title}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
