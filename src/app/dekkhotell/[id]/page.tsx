'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Sparkles,
  Calendar,
  MapPin,
  User,
  Car,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText
} from 'lucide-react';
import { getApiBaseUrl } from '@/lib/apiConfig';

export default function TyreSetDetailPage() {
  const params = useParams();
  const tyreSetId = params.id as string;
  const [tyreSet, setTyreSet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const orgId = process.env.NEXT_PUBLIC_ORG_ID || 'demo-org';
  const API_URL = getApiBaseUrl();

  useEffect(() => {
    if (tyreSetId) {
      loadTyreSet();
    }
  }, [tyreSetId]);

  async function loadTyreSet() {
    try {
      const res = await fetch(`${API_URL}/api/orgs/${orgId}/tyre-sets/${tyreSetId}`);
      const data = await res.json();
      
      if (data.tyreSet) {
        setTyreSet(data.tyreSet);
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

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="mt-4 text-muted-foreground">Laster dekksett...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!tyreSet) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Dekksett ikke funnet</p>
            <Button className="mt-4" onClick={() => window.location.href = '/dekkhotell'}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tilbake
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Button variant="ghost" onClick={() => window.location.href = '/dekkhotell'}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tilbake
          </Button>
          <h1 className="text-3xl font-bold mt-2">Dekksett detaljer</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Rediger
          </Button>
          <Button
            onClick={() => window.location.href = `/dekkhotell/${tyreSetId}/analyse`}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Analyse
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>Grunnleggende informasjon</CardTitle>
                {getConditionBadge(tyreSet.condition)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Type</label>
                  <p className="font-medium">{getTypeLabel(tyreSet.type)}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Dimensjon</label>
                  <p className="font-medium">{tyreSet.dimension}</p>
                </div>
                {tyreSet.dot_year && (
                  <div>
                    <label className="text-sm text-muted-foreground">DOT år</label>
                    <p className="font-medium">{tyreSet.dot_year}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm text-muted-foreground">Status</label>
                  <p className="font-medium capitalize">{tyreSet.status?.replace('_', ' ')}</p>
                </div>
              </div>

              {tyreSet.notes && (
                <div>
                  <label className="text-sm text-muted-foreground">Notater</label>
                  <p className="mt-1">{tyreSet.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tyre Positions */}
          {tyreSet.tyre_positions && tyreSet.tyre_positions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Dekkposisjoner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {tyreSet.tyre_positions.map((pos: any) => (
                    <Card key={pos.id} className="p-4">
                      <div className="space-y-2">
                        <div className="font-medium capitalize">{pos.position_label?.replace('_', ' ')}</div>
                        {pos.tread_depth_mm && (
                          <div className="text-sm">
                            Mønsterdybde: <span className="font-medium">{pos.tread_depth_mm} mm</span>
                          </div>
                        )}
                        {pos.wear_status && (
                          <Badge variant={pos.wear_status === 'ok' ? 'default' : 'destructive'}>
                            {pos.wear_status}
                          </Badge>
                        )}
                        {pos.photo_url && (
                          <img src={pos.photo_url} alt={pos.position_label} className="rounded-md w-full" />
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Inspections */}
          {tyreSet.tyre_inspections && tyreSet.tyre_inspections.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Inspeksjonshistorikk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tyreSet.tyre_inspections.map((inspection: any) => (
                    <Card key={inspection.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {inspection.by_ai ? (
                              <Badge className="bg-purple-500">
                                <Sparkles className="w-3 h-3 mr-1" />
                                AI-Analyse
                              </Badge>
                            ) : (
                              <Badge variant="outline">Manuell</Badge>
                            )}
                            <span className="text-sm text-muted-foreground">
                              {new Date(inspection.created_at).toLocaleDateString('nb-NO')}
                            </span>
                          </div>
                          {inspection.recommendation && (
                            <div className="text-sm font-medium">
                              Anbefaling: {inspection.recommendation}
                            </div>
                          )}
                          {inspection.notes && (
                            <p className="text-sm text-muted-foreground">{inspection.notes}</p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          {tyreSet.customers && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Kunde
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="font-medium">{tyreSet.customers.name}</div>
                {tyreSet.customers.email && (
                  <div className="text-sm text-muted-foreground">{tyreSet.customers.email}</div>
                )}
                {tyreSet.customers.phone && (
                  <div className="text-sm text-muted-foreground">{tyreSet.customers.phone}</div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Vehicle */}
          {tyreSet.vehicles && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  Kjøretøy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="font-medium">{tyreSet.vehicles.registration_number}</div>
                {tyreSet.vehicles.make && (
                  <div className="text-sm text-muted-foreground">
                    {tyreSet.vehicles.make} {tyreSet.vehicles.model}
                  </div>
                )}
                {tyreSet.vehicles.year && (
                  <div className="text-sm text-muted-foreground">Årsmodell: {tyreSet.vehicles.year}</div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Storage Location */}
          {tyreSet.storage_locations && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Lagringsplass
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-medium">{tyreSet.storage_locations.label}</div>
                {tyreSet.storage_locations.row && (
                  <div className="text-sm text-muted-foreground">
                    Rad {tyreSet.storage_locations.row}, Hylle {tyreSet.storage_locations.shelf}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Tidslinje
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <div className="text-muted-foreground">Opprettet</div>
                <div className="font-medium">
                  {new Date(tyreSet.created_at).toLocaleDateString('nb-NO')}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
