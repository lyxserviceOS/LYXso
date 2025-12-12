'use client';

import Link from 'next/link';
import { LucideIcon, Lock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AIModuleCardProps {
  module?: string;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  benefits: string[];
  isLocked: boolean;
  requiredPlan?: 'professional' | 'enterprise';
  gradientFrom: string;
  gradientTo: string;
  gradient?: string;
  stats?: {
    label: string;
    value: string;
    color?: string;
  } | {
    label: string;
    value: string;
    color?: string;
  }[];
}

export function AIModuleCard({
  module,
  title,
  description,
  icon: Icon,
  href,
  benefits,
  isLocked,
  requiredPlan,
  gradientFrom,
  gradientTo,
  gradient,
  stats,
}: AIModuleCardProps) {
  return (
    <Card className={`relative overflow-hidden transition-all hover:shadow-lg ${isLocked ? 'opacity-75' : ''}`}>
      {/* Gradient Background */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-3xl"
        style={{ background: `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})` }}
      />
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className={`p-3 rounded-lg bg-gradient-to-br ${gradientFrom} ${gradientTo}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          {isLocked && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
              <Lock className="h-3 w-3" />
              <span className="capitalize">{requiredPlan}</span>
            </div>
          )}
        </div>
        <CardTitle className="mt-4">{title}</CardTitle>
        <p className="text-sm text-slate-600 mt-2">{description}</p>
      </CardHeader>
      
      <CardContent>
        <ul className="space-y-2 mb-4">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
              <span className="text-green-500 mt-0.5">✓</span>
              {benefit}
            </li>
          ))}
        </ul>
        
        {isLocked ? (
          <Link href="/plan">
            <Button variant="outline" className="w-full group">
              Oppgrader til {requiredPlan}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        ) : (
          <Link href={href}>
            <Button className="w-full group">
              Åpne modul
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
