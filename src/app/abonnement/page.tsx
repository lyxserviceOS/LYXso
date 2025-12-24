'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, 
  Package, 
  TrendingUp, 
  Users, 
  Database, 
  MapPin,
  Zap,
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { getApiBaseUrl, getDefaultOrgId } from '@/lib/apiConfig';

type Plan = {
  name: string;
  description?: string;
  color?: string;
  price_monthly?: number;
  features?: string[];
};

type Subscription = {
  plan: string | Plan;
  status: string;
  trial_ends_at?: string;
  next_billing_date?: string;
  current_period_end?: string;
  amount?: number;
  currency?: string;
  billing_period?: string;
};

type UsageItem = {
  current: number;
  limit?: number;
  percentage?: number;
};

type Usage = {
  storage_used?: number;
  storage_limit?: number;
  users_count?: number;
  users_limit?: number;
  users?: UsageItem;
  customers?: UsageItem;
  locations?: UsageItem;
  ai_requests?: UsageItem;
};

export default function AbonnementPage() {
  const API_BASE = getApiBaseUrl();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);

  useEffect(() => {
    // Get orgId from localStorage or context
    const storedOrgId = localStorage.getItem('currentOrgId');
    if (storedOrgId) {
      setOrgId(storedOrgId);
      fetchSubscription(storedOrgId);
      fetchUsage(storedOrgId);
    }
  }, []);

  async function fetchSubscription(orgId: string) {
    try {
      const response = await fetch(`${API_BASE}/api/orgs/${orgId}/subscription`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSubscription(data.subscription);
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchUsage(orgId: string) {
    try {
      const response = await fetch(`${API_BASE}/api/orgs/${orgId}/usage`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsage(data.usage);
      }
    } catch (error) {
      console.error('Failed to fetch usage:', error);
    }
  }

  function getStatusBadge(status: string) {
    type BadgeVariant = "default" | "secondary" | "destructive" | "outline";
    type StatusConfig = {
      label: string;
      variant: BadgeVariant;
      icon: React.ComponentType<{ className?: string }>;
    };
    const statusConfig: Record<string, StatusConfig> = {
      trial: { label: 'Prøveperiode', variant: 'default', icon: Clock },
      active: { label: 'Aktiv', variant: 'default', icon: CheckCircle2 },
      past_due: { label: 'Forfalt', variant: 'destructive', icon: AlertCircle },
      cancelled: { label: 'Kansellert', variant: 'secondary', icon: AlertCircle },
      paused: { label: 'Pauset', variant: 'secondary', icon: AlertCircle }
    };

    const config = statusConfig[status] || statusConfig.active;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('nb-NO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function getDaysUntil(dateString: string) {
    const diff = new Date(dateString).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Laster abonnement...</p>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Ingen aktivt abonnement</CardTitle>
            <CardDescription>
              Du har ikke et aktivt abonnement. Velg en plan for å komme i gang.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/abonnement/planer">
              <Button>
                <Package className="w-4 h-4 mr-2" />
                Se tilgjengelige planer
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const planData = typeof subscription.plan === 'string' 
    ? { name: subscription.plan, description: '', price_monthly: 0, features: [] } 
    : subscription.plan;
  const trialDaysLeft = subscription.trial_ends_at ? getDaysUntil(subscription.trial_ends_at) : 0;
  const isTrialActive = subscription.status === 'trial' && trialDaysLeft > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Abonnement</h1>
        <p className="text-gray-600">Administrer din plan, addons og bruksstatistikk</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Oversikt</TabsTrigger>
          <TabsTrigger value="usage">Bruk & Statistikk</TabsTrigger>
          <TabsTrigger value="addons">Addons</TabsTrigger>
          <TabsTrigger value="history">Historikk</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          {/* Trial Warning */}
          {isTrialActive && (
            <Card className="border-yellow-500 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-yellow-600 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-yellow-900 mb-1">
                      Prøveperiode aktiv
                    </h3>
                    <p className="text-yellow-800 mb-3">
                      Du har {trialDaysLeft} {trialDaysLeft === 1 ? 'dag' : 'dager'} igjen av prøveperioden. 
                      {subscription.trial_ends_at && `Oppgrader til en betalt plan for å fortsette etter ${formatDate(subscription.trial_ends_at)}.`}
                    </p>
                    <Link href="/abonnement/planer">
                      <Button variant="outline" size="sm">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Oppgrader nå
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Current Plan */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {planData.name}
                    {getStatusBadge(subscription.status)}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {planData.description}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold" style={{ color: planData.color }}>
                    {(planData.price_monthly || 0) > 0 ? `${planData.price_monthly} kr` : 'Gratis'}
                  </div>
                  <div className="text-sm text-gray-500">
                    per {subscription.billing_period === 'yearly' ? 'år' : 'måned'}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Features */}
              <div>
                <h4 className="font-semibold mb-2">Inkluderte funksjoner:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {planData.features && planData.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Billing Info */}
              <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Faktureringsperiode</div>
                  <div className="font-medium">
                    {subscription.billing_period === 'yearly' ? 'Årlig' : 'Månedlig'}
                  </div>
                </div>
                {subscription.current_period_end && (
                  <div>
                    <div className="text-sm text-gray-500">Neste fornyelse</div>
                    <div className="font-medium">
                      {formatDate(subscription.current_period_end)}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="border-t pt-4 flex gap-3">
                <Link href="/abonnement/planer">
                  <Button variant="default">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Bytt plan
                  </Button>
                </Link>
                <Link href="/abonnement/addons">
                  <Button variant="outline">
                    <Package className="w-4 h-4 mr-2" />
                    Administrer addons
                  </Button>
                </Link>
                {subscription.status !== 'cancelled' && (
                  <Button variant="ghost" className="text-red-600 hover:text-red-700">
                    Kanseller abonnement
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Usage Summary */}
          {usage && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Users */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="w-8 h-8 text-blue-600" />
                    <Badge variant="outline">
                      {usage.users?.current} / {usage.users?.limit || '∞'}
                    </Badge>
                  </div>
                  <h3 className="font-semibold mb-2">Brukere</h3>
                  {usage.users?.limit && (
                    <Progress value={usage.users?.percentage} className="mb-2" />
                  )}
                  <p className="text-sm text-gray-600">
                    {usage.users?.limit ? `${usage.users?.percentage}% brukt` : 'Ubegrenset'}
                  </p>
                </CardContent>
              </Card>

              {/* Customers */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="w-8 h-8 text-green-600" />
                    <Badge variant="outline">
                      {usage.customers?.current} / {usage.customers?.limit || '∞'}
                    </Badge>
                  </div>
                  <h3 className="font-semibold mb-2">Kunder</h3>
                  {usage.customers?.limit && (
                    <Progress value={usage.customers?.percentage} className="mb-2" />
                  )}
                  <p className="text-sm text-gray-600">
                    {usage.customers?.limit ? `${usage.customers?.percentage}% brukt` : 'Ubegrenset'}
                  </p>
                </CardContent>
              </Card>

              {/* Locations */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <MapPin className="w-8 h-8 text-purple-600" />
                    <Badge variant="outline">
                      {usage.locations?.current} / {usage.locations?.limit || '∞'}
                    </Badge>
                  </div>
                  <h3 className="font-semibold mb-2">Lokasjoner</h3>
                  {usage.locations?.limit && (
                    <Progress value={usage.locations?.percentage} className="mb-2" />
                  )}
                  <p className="text-sm text-gray-600">
                    {usage.locations?.limit ? `${usage.locations?.percentage}% brukt` : 'Ubegrenset'}
                  </p>
                </CardContent>
              </Card>

              {/* AI Requests */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <Zap className="w-8 h-8 text-yellow-600" />
                    <Badge variant="outline">
                      {usage.ai_requests?.current} / {usage.ai_requests?.limit || '∞'}
                    </Badge>
                  </div>
                  <h3 className="font-semibold mb-2">AI Forespørsler</h3>
                  {usage.ai_requests?.limit && (
                    <Progress value={usage.ai_requests?.percentage} className="mb-2" />
                  )}
                  <p className="text-sm text-gray-600">
                    {usage.ai_requests?.limit ? `${usage.ai_requests?.percentage}% brukt` : 'Ubegrenset'}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* USAGE TAB */}
        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle>Detaljert bruksstatistikk</CardTitle>
              <CardDescription>
                Se din månedlige bruk og sammenlign med plan-grenser
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Kommer snart: Detaljerte grafer og historikk</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ADDONS TAB */}
        <TabsContent value="addons">
          <Card>
            <CardHeader>
              <CardTitle>Addons</CardTitle>
              <CardDescription>
                Utvid funksjonaliteten med tilleggsmoduler
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/abonnement/addons">
                <Button>
                  <Package className="w-4 h-4 mr-2" />
                  Se tilgjengelige addons
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        {/* HISTORY TAB */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Historikk</CardTitle>
              <CardDescription>
                Se endringer i abonnement og fakturaer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Kommer snart: Abonnementshistorikk og fakturaer</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
