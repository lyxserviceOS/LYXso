// app/(protected)/vehicles/VehiclesPageClient.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getApiBaseUrl } from '@/lib/apiConfig';

const API_BASE = getApiBaseUrl();
const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID;

type Vehicle = {
  id: string;
  registration_number: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  vin?: string;
  customer_id: string;
  customer?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  mileage?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export default function VehiclesPageClient() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMake, setFilterMake] = useState('all');

  useEffect(() => {
    fetchVehicles();
  }, []);

  async function fetchVehicles() {
    try {
      const res = await fetch(`${API_BASE}/api/orgs/${ORG_ID}/vehicles`, {
        cache: 'no-store'
      });

      if (!res.ok) {
        throw new Error('Kunne ikke hente kjøretøy');
      }

      const data = await res.json();
      setVehicles(data.vehicles || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Filtrer kjøretøy
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.registration_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMake = filterMake === 'all' || vehicle.make === filterMake;

    return matchesSearch && matchesMake;
  });

  // Hent unike merker for filter
  const uniqueMakes = Array.from(new Set(vehicles.map(v => v.make))).sort();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Laster kjøretøy...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Kjøretøy</h1>
          <p className="text-slate-600">Administrer alle kjøretøy med servicehistorikk</p>
        </div>
        <button
          onClick={() => router.push('/vehicles/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Nytt kjøretøy
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Totalt kjøretøy</p>
          <p className="text-2xl font-bold text-slate-900">{vehicles.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Unike merker</p>
          <p className="text-2xl font-bold text-slate-900">{uniqueMakes.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Service trengs</p>
          <p className="text-2xl font-bold text-amber-600">0</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Nye denne uken</p>
          <p className="text-2xl font-bold text-emerald-600">
            {vehicles.filter(v => {
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return new Date(v.created_at) > weekAgo;
            }).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Søk på regnr, merke, modell, kunde..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterMake}
            onChange={(e) => setFilterMake(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Alle merker</option>
            {uniqueMakes.map(make => (
              <option key={make} value={make}>{make}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Vehicles List */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        {filteredVehicles.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            {vehicles.length === 0 
              ? 'Ingen kjøretøy registrert ennå.'
              : 'Ingen kjøretøy matcher filteret.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Regnr
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Kjøretøy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Kunde
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Km-stand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Registrert
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Handlinger
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredVehicles.map((vehicle) => (
                  <tr 
                    key={vehicle.id}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/vehicles/${vehicle.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-mono font-semibold bg-blue-100 text-blue-800">
                        {vehicle.registration_number}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-slate-900">
                          {vehicle.make} {vehicle.model}
                        </p>
                        <p className="text-sm text-slate-500">
                          {vehicle.year} {vehicle.color && `• ${vehicle.color}`}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {vehicle.customer ? (
                        <div>
                          <p className="font-medium text-slate-900">{vehicle.customer.name}</p>
                          {vehicle.customer.phone && (
                            <p className="text-sm text-slate-500">{vehicle.customer.phone}</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400">Ingen kunde</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-900">
                      {vehicle.mileage ? `${vehicle.mileage.toLocaleString('no-NO')} km` : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(vehicle.created_at).toLocaleDateString('nb-NO')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/vehicles/${vehicle.id}`);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Se detaljer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
