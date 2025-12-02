'use client';

import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

type Resource = {
  id?: string;
  location_id: string;
  name: string;
  description?: string;
  type: 'bay' | 'lift' | 'room' | 'equipment' | 'other';
  max_concurrent_bookings: number;
  color: string;
};

type Location = {
  id: string;
  name: string;
};

type Props = {
  resource: Resource | null;
  onClose: () => void;
};

const resourceTypes = [
  { value: 'bay', label: 'Bås', description: 'Vaskehall, poleringsbås osv.' },
  { value: 'lift', label: 'Løftebukk', description: 'For å løfte kjøretøy' },
  { value: 'room', label: 'Rom', description: 'PPF-rom, coating-rom osv.' },
  { value: 'equipment', label: 'Utstyr', description: 'Spesialutstyr som kan reserveres' },
  { value: 'other', label: 'Annet', description: 'Andre typer ressurser' },
];

const colorOptions = [
  { value: '#3b82f6', label: 'Blå' },
  { value: '#10b981', label: 'Grønn' },
  { value: '#f59e0b', label: 'Oransje' },
  { value: '#ef4444', label: 'Rød' },
  { value: '#8b5cf6', label: 'Lilla' },
  { value: '#ec4899', label: 'Rosa' },
  { value: '#06b6d4', label: 'Cyan' },
  { value: '#6b7280', label: 'Grå' },
];

export default function ResourceModal({ resource, onClose }: Props) {
  const [formData, setFormData] = useState<Resource>({
    location_id: '',
    name: '',
    description: '',
    type: 'bay',
    max_concurrent_bookings: 1,
    color: '#6b7280',
  });
  const [locations, setLocations] = useState<Location[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLocations();
    if (resource) {
      setFormData(resource);
    }
  }, [resource]);

  async function fetchLocations() {
    try {
      const response = await fetch('/api/org/locations');
      if (response.ok) {
        const data = await response.json();
        setLocations(data.locations || []);
        
        // Set first location as default if creating new
        if (!resource && data.locations.length > 0) {
          setFormData(prev => ({ ...prev, location_id: data.locations[0].id }));
        } else if (!resource && data.locations.length === 0) {
          setError('Du må opprette minst én lokasjon før du kan legge til ressurser.');
        }
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      setError('Kunne ikke hente lokasjoner');
    }
  }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const url = resource
        ? `/api/org/resources/${resource.id}`
        : '/api/org/resources';

      const method = resource ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onClose();
      } else {
        const data = await response.json();
        setError(data.error || 'Noe gikk galt');
      }
    } catch (err) {
      setError('Kunne ikke lagre ressurs');
    }
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {resource ? 'Rediger ressurs' : 'Ny ressurs'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900">Grunnleggende informasjon</h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Navn <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Løftebukk 1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Beskrivelse
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Beskrivelse av ressursen..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Lokasjon <span className="text-red-500">*</span>
              </label>
              {locations.length === 0 ? (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
                  <p className="text-yellow-800 font-medium mb-2">Ingen lokasjoner funnet</p>
                  <p className="text-yellow-700">
                    Du må først opprette en lokasjon før du kan legge til ressurser.
                  </p>
                </div>
              ) : (
                <select
                  value={formData.location_id}
                  onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Velg lokasjon</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Type */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900">Type</h3>

            <div className="grid grid-cols-1 gap-3">
              {resourceTypes.map((type) => (
                <label
                  key={type.value}
                  className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.type === type.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={type.value}
                    checked={formData.type === type.value}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-slate-900">{type.label}</div>
                    <div className="text-sm text-slate-600">{type.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Capacity & Color */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900">Innstillinger</h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Maksimalt antall samtidige bookinger <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.max_concurrent_bookings}
                onChange={(e) => setFormData({ ...formData, max_concurrent_bookings: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                Hvor mange bookinger kan bruke denne ressursen samtidig?
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Farge
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    className={`w-12 h-12 rounded-lg border-2 transition-all ${
                      formData.color === color.value
                        ? 'border-slate-900 scale-110'
                        : 'border-slate-200 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.label}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={saving || locations.length === 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Lagrer...' : 'Lagre'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
