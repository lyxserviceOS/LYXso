'use client';

import { useState, useEffect } from 'react';
import { Plus, MapPin, Phone, Mail, Clock, Edit2, Trash2, Star } from 'lucide-react';
import LocationModal from './LocationModal';

type Location = {
  id: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  phone?: string;
  email?: string;
  opening_hours?: Record<string, any>;
  is_primary: boolean;
  is_active: boolean;
  latitude?: number;
  longitude?: number;
};

export default function LocationsList() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  async function fetchLocations() {
    setLoading(true);
    try {
      const response = await fetch('/api/org/locations');
      if (response.ok) {
        const data = await response.json();
        setLocations(data.locations || []);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
    setLoading(false);
  }

  async function handleDelete(locationId: string) {
    if (!confirm('Er du sikker på at du vil deaktivere denne lokasjonen?')) {
      return;
    }

    try {
      const response = await fetch(`/api/org/locations/${locationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchLocations();
      } else {
        const error = await response.json();
        alert(error.error || 'Kunne ikke slette lokasjon');
      }
    } catch (error) {
      console.error('Error deleting location:', error);
      alert('Noe gikk galt');
    }
  }

  function handleEdit(location: Location) {
    setEditingLocation(location);
    setShowModal(true);
  }

  function handleNew() {
    setEditingLocation(null);
    setShowModal(true);
  }

  function handleModalClose() {
    setShowModal(false);
    setEditingLocation(null);
    fetchLocations();
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Add Button */}
        <button
          onClick={handleNew}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Ny lokasjon
        </button>

        {/* Locations Grid */}
        {locations.length === 0 ? (
          <div className="card text-center py-12">
            <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 mb-4">Ingen lokasjoner lagt til ennå</p>
            <button
              onClick={handleNew}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              Legg til første lokasjon
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((location) => (
              <div
                key={location.id}
                className={`card relative ${!location.is_active ? 'opacity-60' : ''}`}
              >
                {/* Primary Badge */}
                {location.is_primary && (
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold">
                      <Star className="w-3 h-3" />
                      Primær
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-slate-900">
                      {location.name}
                    </h3>
                    {!location.is_active && (
                      <span className="text-xs text-red-600 font-medium">
                        (Deaktivert)
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <div>{location.address}</div>
                        <div>
                          {location.postal_code} {location.city}
                        </div>
                      </div>
                    </div>

                    {location.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <a
                          href={`tel:${location.phone}`}
                          className="hover:text-blue-600"
                        >
                          {location.phone}
                        </a>
                      </div>
                    )}

                    {location.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <a
                          href={`mailto:${location.email}`}
                          className="hover:text-blue-600"
                        >
                          {location.email}
                        </a>
                      </div>
                    )}

                    {location.opening_hours && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span className="text-xs">Åpningstider konfigurert</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-slate-200">
                    <button
                      onClick={() => handleEdit(location)}
                      className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Rediger
                    </button>
                    <button
                      onClick={() => handleDelete(location.id)}
                      className="flex-1 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Slett
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <LocationModal
          location={editingLocation}
          onClose={handleModalClose}
        />
      )}
    </>
  );
}
