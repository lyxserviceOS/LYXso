// Min Side - Profil
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CustomerNav } from '@/components/customer-portal/CustomerNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';

export default function ProfilPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [customer, setCustomer] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/login?redirect=/min-side/profil');
      return;
    }

    const { data: customerData } = await supabase
      .from('customers')
      .select('*')
      .eq('email', user.email)
      .single();

    if (customerData) {
      setCustomer(customerData);
      setFormData({
        name: customerData.name || '',
        phone: customerData.phone || '',
        address: customerData.address || '',
        city: customerData.city || '',
        postal_code: customerData.postal_code || '',
      });
    }
    
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/customers/${customer.id}/profile`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert('Profil oppdatert!');
        loadProfile();
      } else {
        alert('Feil ved oppdatering');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Noe gikk galt');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-8">Laster...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNav />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Min Profil</h1>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Navn</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postal_code">Postnummer</Label>
                <Input
                  id="postal_code"
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="city">Poststed</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={saving}>
                {saving ? 'Lagrer...' : 'Lagre endringer'}
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t">
            <h3 className="font-semibold mb-2">E-post</h3>
            <p className="text-gray-600">{customer?.email}</p>
            <p className="text-sm text-gray-500 mt-1">
              Kontakt support for å endre e-postadresse
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
