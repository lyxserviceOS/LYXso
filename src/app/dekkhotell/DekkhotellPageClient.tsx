'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Search, 
  Plus, 
  Eye, 
  Trash2, 
  Camera, 
  Sparkles, 
  AlertCircle,
  CheckCircle,
  Clock,
  Car,
  User
} from 'lucide-react';
import { getApiBaseUrl } from '@/lib/apiConfig';

interface TyreSet {
  id: string;
  customer_id: string;
  vehicle_id: string;
  type: 'summer' | 'winter' | 'pigg' | 'all_season';
  dimension: string;
  dot_year?: number;
  status: 'stored_in' | 'stored_out' | 'on_vehicle';
  condition: 'ok' | 'bør_byttes_snart' | 'må_byttes' | 'ukjent';
  storage_location_id?: string;
  notes?: string;
  created_at: string;
  customers?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  vehicles?: {
    id: string;
    registration_number: string;
    make?: string;
    model?: string;
  };
  storage_locations?: {
    id: string;
    label: string;
  };
}

export default function DekkhotellPageClient() {
  const [tyreSets, setTyreSets] = useState<TyreSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCondition, setFilterCondition] = useState<string>('all');
  const [selectedTyreSet, setSelectedTyreSet] = useState<TyreSet | null>(null);

  const orgId = process.env.NEXT_PUBLIC_ORG_ID || 'demo-org';
  const API_URL = getApiBaseUrl();

  useEffect(() => {
    loadTyreSets();
  }, [filterStatus, filterCondition]);

  async function loadTyreSets() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterCondition !== 'all') params.append('condition', filterCondition);

      const res = await fetch(`${API_URL}/api/orgs/${orgId}/tyre-sets?${params}`);
      const data = await res.json();
      
      if (data.tyreSets) {
        setTyreSets(data.tyreSets);
      }
    } catch (error) {
      console.error('Feil ved lasting av dekksett:', error);
    } finally {
      setLoading(false);
    }
  }

  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case 'ok':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />God</Badge>;
      case 'bør_byttes_snart':
        return <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" />Byttes snart</Badge>;
      case 'må_byttes':
        return <Badge className="bg-red-500"><AlertCircle className="w-3 h-3 mr-1" />Må byttes</Badge>;
      default:
        return <Badge variant="outline">Ukjent</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      summer: '☀️ Sommer',
      winter: '❄️ Vinter',
      pigg: '⛸️ Piggdekk',
      all_season: '🌦️ Helår'
    };
    return labels[type] || type;
  };

  const filteredTyreSets = tyreSets.filter(ts => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      ts.customers?.name?.toLowerCase().includes(query) ||
      ts.vehicles?.registration_number?.toLowerCase().includes(query) ||
      ts.dimension?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">🏨 Dekkhotell</h1>
          <p className="text-muted-foreground">Administrer lagrede dekk med AI-analyse</p>
        </div>
        <Button onClick={() => window.location.href = '/dekkhotell/nytt'}>
          <Plus className="w-4 h-4 mr-2" />
          Nytt dekksett
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Totalt lagret</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tyreSets.filter(ts => ts.status === 'stored_in').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Må byttes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {tyreSets.filter(ts => ts.condition === 'må_byttes').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Byttes snart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {tyreSets.filter(ts => ts.condition === 'bør_byttes_snart').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">God tilstand</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {tyreSets.filter(ts => ts.condition === 'ok').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Søk på kunde, regnr eller dimensjon..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">Alle status</option>
                <option value="stored_in">Lagret</option>
                <option value="stored_out">Hentet ut</option>
                <option value="on_vehicle">På kjøretøy</option>
              </select>
              <select
                value={filterCondition}
                onChange={(e) => setFilterCondition(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">Alle tilstander</option>
                <option value="ok">God</option>
                <option value="bør_byttes_snart">Byttes snart</option>
                <option value="må_byttes">Må byttes</option>
                <option value="ukjent">Ukjent</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tyre Sets List */}
      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="mt-4 text-muted-foreground">Laster dekksett...</p>
          </CardContent>
        </Card>
      ) : filteredTyreSets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Ingen dekksett funnet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTyreSets.map((tyreSet) => (
            <Card key={tyreSet.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {tyreSet.customers?.name || 'Ukjent kunde'}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Car className="w-3 h-3" />
                      {tyreSet.vehicles?.registration_number || 'Ukjent'}
                    </CardDescription>
                  </div>
                  {getConditionBadge(tyreSet.condition)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{getTypeLabel(tyreSet.type)}</span>
                  <Badge variant="outline">{tyreSet.dimension}</Badge>
                </div>
                
                {tyreSet.dot_year && (
                  <div className="text-sm text-muted-foreground">
                    DOT: {tyreSet.dot_year}
                  </div>
                )}
                
                {tyreSet.storage_locations && (
                  <div className="text-sm text-muted-foreground">
                    📍 {tyreSet.storage_locations.label}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => window.location.href = `/dekkhotell/${tyreSet.id}`}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Detaljer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = `/dekkhotell/${tyreSet.id}/analyse`}
                  >
                    <Sparkles className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
