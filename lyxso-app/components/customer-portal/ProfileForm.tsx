'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Phone, MapPin, Mail, Save } from 'lucide-react';

interface Customer {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  notes: string | null;
}

export default function ProfileForm({ customer }: { customer: Customer }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    first_name: customer.first_name || '',
    last_name: customer.last_name || '',
    phone: customer.phone || '',
    address: customer.address || '',
    city: customer.city || '',
    postal_code: customer.postal_code || '',
    notes: customer.notes || '',
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/customers/${customer.id}/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profil oppdatert!' });
      } else {
        throw new Error('Kunne ikke oppdatere profil');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Noe gikk galt. Vennligst prøv igjen.' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Message */}
      {message && (
        <div
          className={`card ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <p className="text-sm font-semibold">{message.text}</p>
        </div>
      )}

      {/* Personal info */}
      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Personlig informasjon</h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Fullt navn
            </label>
            <input
              type="text"
              value={`${formData.first_name} ${formData.last_name}`}
              onChange={(e) => {
                const parts = e.target.value.split(' ');
                const first = parts[0] || '';
                const last = parts.slice(1).join(' ') || '';
                setFormData({ ...formData, first_name: first, last_name: last });
              }}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            <Mail className="w-4 h-4 inline mr-1" />
            E-post
          </label>
          <input
            type="email"
            value={customer.email}
            disabled
            className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
          />
          <p className="text-xs text-slate-500 mt-1">
            E-post kan ikke endres. Kontakt oss hvis du trenger hjelp.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            <Phone className="w-4 h-4 inline mr-1" />
            Telefon
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="+47 123 45 678"
          />
        </div>
      </div>

      {/* Address */}
      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">
          <MapPin className="w-5 h-5 inline mr-1" />
          Adresse
        </h2>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Gateadresse
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Eksempel vei 42"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Postnummer
            </label>
            <input
              type="text"
              name="postal_code"
              value={formData.postal_code}
              onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              By
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Oslo"
            />
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <Save className="h-5 w-5" />
          {isLoading ? 'Lagrer...' : 'Lagre endringer'}
        </button>
      </div>
    </form>
  );
}
