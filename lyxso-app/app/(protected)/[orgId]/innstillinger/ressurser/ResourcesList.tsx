'use client';

import { useState, useEffect } from 'react';
import { Plus, Box, Edit2, Trash2, MapPin, Circle } from 'lucide-react';
import ResourceModal from './ResourceModal';

type Resource = {
  id: string;
  location_id: string;
  name: string;
  description?: string;
  type: 'bay' | 'lift' | 'room' | 'equipment' | 'other';
  max_concurrent_bookings: number;
  color: string;
  is_active: boolean;
  location: {
    id: string;
    name: string;
  };
};

const typeLabels: Record<string, string> = {
  bay: 'Bås',
  lift: 'Løftebukk',
  room: 'Rom',
  equipment: 'Utstyr',
  other: 'Annet',
};

export default function ResourcesList() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  useEffect(() => {
    fetchResources();
  }, []);

  async function fetchResources() {
    setLoading(true);
    try {
      const response = await fetch('/api/org/resources');
      if (response.ok) {
        const data = await response.json();
        setResources(data.resources || []);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
    setLoading(false);
  }

  async function handleDelete(resourceId: string) {
    if (!confirm('Er du sikker på at du vil deaktivere denne ressursen?')) {
      return;
    }

    try {
      const response = await fetch(`/api/org/resources/${resourceId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchResources();
      } else {
        const error = await response.json();
        alert(error.error || 'Kunne ikke slette ressurs');
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
      alert('Noe gikk galt');
    }
  }

  function handleEdit(resource: Resource) {
    setEditingResource(resource);
    setShowModal(true);
  }

  function handleNew() {
    setEditingResource(null);
    setShowModal(true);
  }

  function handleModalClose() {
    setShowModal(false);
    setEditingResource(null);
    fetchResources();
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
          Ny ressurs
        </button>

        {/* Resources Grid */}
        {resources.length === 0 ? (
          <div className="card text-center py-12">
            <Box className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 mb-4">Ingen ressurser lagt til ennå</p>
            <button
              onClick={handleNew}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              Legg til første ressurs
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className={`card relative ${!resource.is_active ? 'opacity-60' : ''}`}
              >
                {/* Color Indicator */}
                <div
                  className="absolute top-0 left-0 w-1 h-full rounded-l-lg"
                  style={{ backgroundColor: resource.color }}
                />

                {/* Content */}
                <div className="space-y-3 pl-4">
                  <div>
                    <h3 className="font-semibold text-lg text-slate-900">
                      {resource.name}
                    </h3>
                    {!resource.is_active && (
                      <span className="text-xs text-red-600 font-medium">
                        (Deaktivert)
                      </span>
                    )}
                  </div>

                  {resource.description && (
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {resource.description}
                    </p>
                  )}

                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Box className="w-4 h-4 flex-shrink-0" />
                      <span className="font-medium">
                        {typeLabels[resource.type]}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span>{resource.location.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Circle className="w-4 h-4 flex-shrink-0" />
                      <span>
                        Kapasitet: {resource.max_concurrent_bookings} samtidig
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-slate-200">
                    <button
                      onClick={() => handleEdit(resource)}
                      className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Rediger
                    </button>
                    <button
                      onClick={() => handleDelete(resource.id)}
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
        <ResourceModal
          resource={editingResource}
          onClose={handleModalClose}
        />
      )}
    </>
  );
}
