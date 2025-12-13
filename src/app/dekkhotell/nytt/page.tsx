'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { getApiBaseUrl } from '@/lib/apiConfig';

export default function NewTyreSetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [storageLocations, setStorageLocations] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    customer_id: '',
    vehicle_id: '',
    type: 'winter',
    dimension: '',
    dot_year: new Date().getFullYear(),
    status: 'stored_in',
    storage_location_id: '',
    notes: ''
  });

  const orgId = process.env.NEXT_PUBLIC_ORG_ID || 'demo-org';
  const API_URL = getApiBaseUrl();

  useEffect(() => {
    loadCustomers();
    loadStorageLocations();
  }, []);

  useEffect(() => {
    if (formData.customer_id) {
      loadVehicles(formData.customer_id);
    }
  }, [formData.customer_id]);

  async function loadCustomers() {
    try {
      const res = await fetch(`${API_URL}/api/orgs/${orgId}/customers`);
      const data = await res.json();
      setCustomers(data.customers || []);
    } catch (error) {
      console.error('Feil ved lasting av kunder:', error);
    }
  }

  async function loadVehicles(customerId: string) {
    try {
      const res = await fetch(`${API_URL}/api/orgs/${orgId}/vehicles?customer_id=${customerId}`);
      const data = await res.json();
      setVehicles(data.vehicles || []);
    } catch (error) {
      console.error('Feil ved lasting av kjøretøy:', error);
    }
  }

  async function loadStorageLocations() {
    try {
      const res = await fetch(`${API_URL}/api/orgs/${orgId}/storage-locations`);
      const data = await res.json();
      setStorageLocations(data.locations || []);
    } catch (error) {
      console.error('Feil ved lasting av lagringslokasjoner:', error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/orgs/${orgId}/tyre-sets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.tyreSet) {
        router.push(`/dekkhotell/${data.tyreSet.id}`);
      } else {
        throw new Error(data.error || 'Feil ved opprettelse');
      }
    } catch (error: any) {
      alert(error.message || 'Feil ved opprettelse av dekksett');
    } finally {
      setLoading(false);
    }
  }

  function updateFormData(field: string, value: any) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Tilbake
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Nytt dekksett</CardTitle>
          <CardDescription>
            Registrer et nytt dekksett i dekkhotellet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer */}
            <div className="space-y-2">
              <Label htmlFor="customer_id">Kunde *</Label>
              <Select
                value={formData.customer_id}
                onValueChange={(value) => updateFormData('customer_id', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Velg kunde" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Vehicle */}
            <div className="space-y-2">
              <Label htmlFor="vehicle_id">Kjøretøy *</Label>
              <Select
                value={formData.vehicle_id}
                onValueChange={(value) => updateFormData('vehicle_id', value)}
                required
                disabled={!formData.customer_id || vehicles.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Velg kjøretøy" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map(vehicle => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.registration_number} - {vehicle.make} {vehicle.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.customer_id && vehicles.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Ingen kjøretøy registrert for denne kunden
                </p>
              )}
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Dekktype *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => updateFormData('type', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summer">☀️ Sommerdekk</SelectItem>
                  <SelectItem value="winter">❄️ Vinterdekk</SelectItem>
                  <SelectItem value="pigg">⛸️ Piggdekk</SelectItem>
                  <SelectItem value="all_season">🌦️ Helårsdekk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dimension */}
            <div className="space-y-2">
              <Label htmlFor="dimension">Dimensjon *</Label>
              <Input
                id="dimension"
                placeholder="f.eks. 205/55R16"
                value={formData.dimension}
                onChange={(e) => updateFormData('dimension', e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                Format: bredde/høyde R felgdiameter (f.eks. 205/55R16)
              </p>
            </div>

            {/* DOT Year */}
            <div className="space-y-2">
              <Label htmlFor="dot_year">DOT-år</Label>
              <Input
                id="dot_year"
                type="number"
                min="2000"
                max={new Date().getFullYear()}
                value={formData.dot_year}
                onChange={(e) => updateFormData('dot_year', parseInt(e.target.value))}
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => updateFormData('status', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stored_in">Lagret inn</SelectItem>
                  <SelectItem value="stored_out">Hentet ut</SelectItem>
                  <SelectItem value="on_vehicle">På kjøretøy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Storage Location */}
            <div className="space-y-2">
              <Label htmlFor="storage_location_id">Lagringsplass</Label>
              <Select
                value={formData.storage_location_id}
                onValueChange={(value) => updateFormData('storage_location_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Velg lagringsplass" />
                </SelectTrigger>
                <SelectContent>
                  {storageLocations.map(location => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notater</Label>
              <Textarea
                id="notes"
                placeholder="Ekstra informasjon om dekksettet..."
                value={formData.notes}
                onChange={(e) => updateFormData('notes', e.target.value)}
                rows={4}
              />
            </div>

            {/* Submit */}
            <div className="flex gap-3">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Lagrer...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Opprett dekksett
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Avbryt
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
