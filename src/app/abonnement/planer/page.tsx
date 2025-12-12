'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { CheckCircle2, Sparkles, TrendingUp, Crown, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string;
  tagline: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  is_featured: boolean;
  color: string;
  max_users: number | null;
  max_customers: number | null;
  max_locations: number | null;
}

export default function PlanerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [yearlyBilling, setYearlyBilling] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [subscribing, setSubscribing] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
    fetchCurrentPlan();
  }, []);

  async function fetchPlans() {
    try {
      const response = await fetch('http://localhost:4000/api/public/plans');
      if (response.ok) {
        const data = await response.json();
        setPlans(data.plans);
      }
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCurrentPlan() {
    try {
      const orgId = localStorage.getItem('currentOrgId');
      const token = localStorage.getItem('token');
      
      if (!orgId || !token) return;

      const response = await fetch(`http://localhost:4000/api/orgs/${orgId}/subscription`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.subscription) {
          setCurrentPlan(data.subscription.plan.slug);
        }
      }
    } catch (error) {
      console.error('Failed to fetch current plan:', error);
    }
  }

  async function subscribeToPlan(planSlug: string) {
    const orgId = localStorage.getItem('currentOrgId');
    const token = localStorage.getItem('token');

    if (!orgId || !token) {
      alert('Du må være logget inn');
      return;
    }

    setSubscribing(planSlug);

    try {
      const response = await fetch(`http://localhost:4000/api/orgs/${orgId}/subscription`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          plan_slug: planSlug,
          billing_period: yearlyBilling ? 'yearly' : 'monthly'
        })
      });

      if (response.ok) {
        alert('Abonnement oppdatert!');
        router.push('/abonnement');
      } else {
        const error = await response.json();
        alert(`Feil: ${error.error}`);
      }
    } catch (error) {
      console.error('Failed to subscribe:', error);
      alert('Kunne ikke oppdatere abonnement');
    } finally {
      setSubscribing(null);
    }
  }

  function getPlanIcon(planName: string) {
    switch(planName.toLowerCase()) {
      case 'gratis':
        return null;
      case 'startup':
        return <TrendingUp className="w-5 h-5" />;
      case 'business':
        return <Sparkles className="w-5 h-5" />;
      case 'enterprise':
        return <Crown className="w-5 h-5" />;
      default:
        return null;
    }
  }

  function getButtonText(planSlug: string) {
    if (currentPlan === planSlug) {
      return 'Nåværende plan';
    }
    if (planSlug === 'free') {
      return 'Velg Gratis';
    }
    if (planSlug === 'enterprise') {
      return 'Kontakt oss';
    }
    if (!currentPlan) {
      return 'Velg plan';
    }

    // Determine if upgrade or downgrade
    const planOrder = ['free', 'startup', 'business', 'enterprise'];
    const currentIndex = planOrder.indexOf(currentPlan);
    const targetIndex = planOrder.indexOf(planSlug);

    if (targetIndex > currentIndex) {
      return 'Oppgrader';
    } else {
      return 'Nedgrader';
    }
  }

  function calculateYearlySavings(monthlyPrice: number, yearlyPrice: number) {
    if (!yearlyPrice || yearlyPrice === 0) return 0;
    const yearlyCostMonthly = (monthlyPrice * 12);
    const savings = yearlyCostMonthly - yearlyPrice;
    return Math.round(savings);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Laster planer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Velg riktig plan for deg</h1>
        <p className="text-xl text-gray-600 mb-8">
          Start med gratis plan og oppgrader når du er klar
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-3 bg-gray-100 p-2 rounded-lg">
          <span className={!yearlyBilling ? 'font-semibold' : 'text-gray-600'}>
            Månedlig
          </span>
          <Switch
            checked={yearlyBilling}
            onCheckedChange={setYearlyBilling}
          />
          <span className={yearlyBilling ? 'font-semibold' : 'text-gray-600'}>
            Årlig
          </span>
          {yearlyBilling && (
            <Badge variant="default" className="ml-2">
              Spar opptil 17%
            </Badge>
          )}
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {plans.map((plan) => {
          const isCurrentPlan = currentPlan === plan.slug;
          const price = yearlyBilling ? plan.price_yearly : plan.price_monthly;
          const savings = yearlyBilling ? calculateYearlySavings(plan.price_monthly, plan.price_yearly) : 0;

          return (
            <Card 
              key={plan.id}
              className={`relative ${plan.is_featured ? 'border-2 border-blue-600 shadow-lg' : ''} ${isCurrentPlan ? 'bg-blue-50' : ''}`}
            >
              {plan.is_featured && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1">
                    Mest populær
                  </Badge>
                </div>
              )}

              <CardHeader>
                <div className="flex items-center gap-2 mb-2" style={{ color: plan.color }}>
                  {getPlanIcon(plan.name)}
                  <CardTitle>{plan.name}</CardTitle>
                </div>
                <CardDescription>{plan.tagline}</CardDescription>
                
                {/* Price */}
                <div className="mt-4">
                  {price > 0 ? (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold">{price} kr</span>
                        <span className="text-gray-500">
                          / {yearlyBilling ? 'år' : 'måned'}
                        </span>
                      </div>
                      {yearlyBilling && savings > 0 && (
                        <div className="text-sm text-green-600 mt-1">
                          Spar {savings} kr per år
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-4xl font-bold text-gray-900">Gratis</div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{plan.description}</p>

                {/* Features */}
                <div className="space-y-2 pt-4 border-t">
                  {plan.features.slice(0, 6).map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  {plan.features.length > 6 && (
                    <div className="text-sm text-gray-500 pt-2">
                      + {plan.features.length - 6} flere funksjoner
                    </div>
                  )}
                </div>

                {/* Limits */}
                {(plan.max_users || plan.max_customers || plan.max_locations) && (
                  <div className="space-y-1 pt-4 border-t text-sm text-gray-600">
                    {plan.max_users && (
                      <div>Opptil {plan.max_users} brukere</div>
                    )}
                    {plan.max_customers && (
                      <div>Opptil {plan.max_customers.toLocaleString()} kunder</div>
                    )}
                    {plan.max_locations && (
                      <div>Opptil {plan.max_locations} lokasjoner</div>
                    )}
                  </div>
                )}
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.is_featured ? 'default' : 'outline'}
                  disabled={isCurrentPlan || subscribing === plan.slug}
                  onClick={() => {
                    if (plan.slug === 'enterprise') {
                      window.location.href = 'mailto:kontakt@lyxso.no?subject=Enterprise Plan';
                    } else {
                      subscribeToPlan(plan.slug);
                    }
                  }}
                >
                  {subscribing === plan.slug ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Oppdaterer...
                    </>
                  ) : (
                    getButtonText(plan.slug)
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* FAQ or Additional Info */}
      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Ofte stilte spørsmål</h2>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Kan jeg bytte plan senere?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Ja! Du kan oppgradere eller nedgradere når som helst. Oppgraderinger trer i kraft umiddelbart, 
                mens nedgraderinger trer i kraft ved neste faktureringsperiode.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hva skjer etter prøveperioden?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Du får 14 dager gratis prøveperiode. Etter det må du velge en betalt plan for å fortsette. 
                Vi varsler deg 3 dager før prøveperioden utløper.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Kan jeg kansellere når som helst?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Ja, du kan kansellere abonnementet når som helst uten bindingstid. 
                Du beholder tilgang til slutten av faktureringsperioden du har betalt for.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
