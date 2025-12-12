'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Users, 
  Headphones, 
  Receipt, 
  Zap,
  CheckCircle2,
  X
} from 'lucide-react';

interface Addon {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price_monthly: number;
  features: string[];
  is_featured: boolean;
  icon: string;
  color: string;
}

interface ActiveAddon {
  id: string;
  addon_id: string;
  status: string;
  quantity: number;
  addon: Addon;
}

export default function AddonsPage() {
  const [loading, setLoading] = useState(true);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [activeAddons, setActiveAddons] = useState<ActiveAddon[]>([]);
  const [processingAddon, setProcessingAddon] = useState<string | null>(null);

  useEffect(() => {
    fetchAddons();
    fetchActiveAddons();
  }, []);

  async function fetchAddons() {
    try {
      const response = await fetch('http://localhost:4000/api/public/addons');
      if (response.ok) {
        const data = await response.json();
        setAddons(data.addons);
      }
    } catch (error) {
      console.error('Failed to fetch addons:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchActiveAddons() {
    try {
      const orgId = localStorage.getItem('currentOrgId');
      const token = localStorage.getItem('token');
      
      if (!orgId || !token) return;

      const response = await fetch(`http://localhost:4000/api/orgs/${orgId}/subscription/addons`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setActiveAddons(data.addons);
      }
    } catch (error) {
      console.error('Failed to fetch active addons:', error);
    }
  }

  function isAddonActive(addonId: string) {
    return activeAddons.some(active => active.addon_id === addonId && active.status === 'active');
  }

  async function toggleAddon(addonId: string, isActive: boolean) {
    const orgId = localStorage.getItem('currentOrgId');
    const token = localStorage.getItem('token');

    if (!orgId || !token) {
      alert('Du må være logget inn');
      return;
    }

    setProcessingAddon(addonId);

    try {
      const endpoint = isActive ? 'deactivate' : 'activate';
      const response = await fetch(`http://localhost:4000/api/orgs/${orgId}/subscription/addons/${addonId}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: 1 })
      });

      if (response.ok) {
        alert(isActive ? 'Addon deaktivert' : 'Addon aktivert');
        fetchActiveAddons();
      } else {
        const error = await response.json();
        alert(`Feil: ${error.error}`);
      }
    } catch (error) {
      console.error('Failed to toggle addon:', error);
      alert('Kunne ikke oppdatere addon');
    } finally {
      setProcessingAddon(null);
    }
  }

  function getAddonIcon(iconName: string) {
    switch(iconName) {
      case 'database':
        return <Database className="w-8 h-8" />;
      case 'users':
        return <Users className="w-8 h-8" />;
      case 'headphones':
        return <Headphones className="w-8 h-8" />;
      case 'receipt':
        return <Receipt className="w-8 h-8" />;
      default:
        return <Zap className="w-8 h-8" />;
    }
  }

  function getCategoryBadge(category: string) {
    const categoryConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      storage: { label: 'Lagring', variant: 'default' },
      users: { label: 'Brukere', variant: 'secondary' },
      features: { label: 'Funksjoner', variant: 'default' },
      integrations: { label: 'Integrasjoner', variant: 'default' },
      ai: { label: 'AI', variant: 'default' },
      other: { label: 'Annet', variant: 'secondary' }
    };

    const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.other;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Laster addons...</p>
        </div>
      </div>
    );
  }

  const featuredAddons = addons.filter(addon => addon.is_featured);
  const regularAddons = addons.filter(addon => !addon.is_featured);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Addons</h1>
        <p className="text-gray-600">
          Utvid funksjonaliteten til LYXso med tilleggsmoduler
        </p>
      </div>

      {/* Active Addons Summary */}
      {activeAddons.length > 0 && (
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle>Aktive addons ({activeAddons.length})</CardTitle>
            <CardDescription>
              Totalt: {activeAddons.reduce((sum, addon) => sum + addon.addon.price_monthly, 0)} kr/måned
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeAddons.map((activeAddon) => (
                <div 
                  key={activeAddon.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div style={{ color: activeAddon.addon.color }}>
                      {getAddonIcon(activeAddon.addon.icon)}
                    </div>
                    <div>
                      <div className="font-semibold">{activeAddon.addon.name}</div>
                      <div className="text-sm text-gray-600">
                        {activeAddon.addon.price_monthly} kr/måned
                      </div>
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Featured Addons */}
      {featuredAddons.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-6 h-6 text-yellow-600" />
            <h2 className="text-2xl font-bold">Anbefalte addons</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredAddons.map((addon) => {
              const isActive = isAddonActive(addon.id);
              const isProcessing = processingAddon === addon.id;

              return (
                <Card 
                  key={addon.id}
                  className={`relative ${isActive ? 'border-green-500 bg-green-50' : 'border-2 border-yellow-300'}`}
                >
                  {isActive && (
                    <div className="absolute -top-3 -right-3">
                      <Badge className="bg-green-600 text-white">
                        Aktiv
                      </Badge>
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div style={{ color: addon.color }}>
                        {getAddonIcon(addon.icon)}
                      </div>
                      {getCategoryBadge(addon.category)}
                    </div>
                    <CardTitle>{addon.name}</CardTitle>
                    <CardDescription>{addon.description}</CardDescription>
                    
                    <div className="mt-4">
                      <div className="text-3xl font-bold">
                        {addon.price_monthly} kr
                      </div>
                      <div className="text-sm text-gray-500">per måned</div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {addon.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button
                      className="w-full"
                      variant={isActive ? 'outline' : 'default'}
                      disabled={isProcessing}
                      onClick={() => toggleAddon(addon.id, isActive)}
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Behandler...
                        </>
                      ) : isActive ? (
                        <>
                          <X className="w-4 h-4 mr-2" />
                          Deaktiver
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Aktiver
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Regular Addons */}
      {regularAddons.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Alle addons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularAddons.map((addon) => {
              const isActive = isAddonActive(addon.id);
              const isProcessing = processingAddon === addon.id;

              return (
                <Card 
                  key={addon.id}
                  className={`relative ${isActive ? 'border-green-500 bg-green-50' : ''}`}
                >
                  {isActive && (
                    <div className="absolute -top-3 -right-3">
                      <Badge className="bg-green-600 text-white">
                        Aktiv
                      </Badge>
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div style={{ color: addon.color }}>
                        {getAddonIcon(addon.icon)}
                      </div>
                      {getCategoryBadge(addon.category)}
                    </div>
                    <CardTitle>{addon.name}</CardTitle>
                    <CardDescription>{addon.description}</CardDescription>
                    
                    <div className="mt-4">
                      <div className="text-3xl font-bold">
                        {addon.price_monthly} kr
                      </div>
                      <div className="text-sm text-gray-500">per måned</div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {addon.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button
                      className="w-full"
                      variant={isActive ? 'outline' : 'default'}
                      disabled={isProcessing}
                      onClick={() => toggleAddon(addon.id, isActive)}
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Behandler...
                        </>
                      ) : isActive ? (
                        <>
                          <X className="w-4 h-4 mr-2" />
                          Deaktiver
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Aktiver
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {addons.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600">Ingen addons tilgjengelig for øyeblikket</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
