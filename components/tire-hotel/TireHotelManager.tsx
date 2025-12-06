/**
 * TIRE HOTEL MANAGER - Complete UI
 * QR codes, seasonal reminders, AI diagnostics
 */
'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, QrCode, Calendar, AlertCircle, Camera } from 'lucide-react';
import { showToast } from '@/lib/toast';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';

interface TireSet {
  id: string;
  customer_name: string;
  customer_phone: string;
  vehicle_reg: string;
  season: 'summer' | 'winter';
  tire_dimension: string;
  brand: string;
  tread_depth_fl: number;
  tread_depth_fr: number;
  tread_depth_rl: number;
  tread_depth_rr: number;
  stored_date: string;
  qr_code: string;
  storage_location: string;
  image_urls?: string[];
}

export default function TireHotelManager() {
  const [tires, setTires] = useState<TireSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [seasonFilter, setSeasonFilter] = useState<'all' | 'summer' | 'winter'>('all');

  useEffect(() => {
    loadTires();
  }, [seasonFilter]);

  const loadTires = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (seasonFilter !== 'all') params.append('season', seasonFilter);

      const res = await fetch(`/api/tire-hotel?${params}`);
      const data = await res.json();
      if (data.success) setTires(data.tires);
    } catch (error) {
      showToast.error('Kunne ikke laste dekk');
    } finally {
      setLoading(false);
    }
  };

  const filteredTires = tires.filter(tire =>
    tire.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tire.vehicle_reg.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tire.qr_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAverageTread = (tire: TireSet) => {
    return ((tire.tread_depth_fl + tire.tread_depth_fr + tire.tread_depth_rl + tire.tread_depth_rr) / 4).toFixed(1);
  };

  const getTreadStatus = (avg: number) => {
    if (avg >= 5) return { color: 'green', label: 'Bra', icon: '✓' };
    if (avg >= 3) return { color: 'orange', label: 'Middels', icon: '⚠' };
    return { color: 'red', label: 'Dårlig', icon: '✕' };
  };

  if (loading) return <LoadingSkeleton rows={6} />;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dekkhotell 3.0</h1>
        <p className="text-slate-600">Med QR-koder, AI-diagnose og automatiske påminnelser</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-sm text-slate-600 mb-1">Totalt dekksett</div>
          <div className="text-3xl font-bold text-slate-900">{tires.length}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-sm text-slate-600 mb-1">Sommerdekk</div>
          <div className="text-3xl font-bold text-orange-600">
            {tires.filter(t => t.season === 'summer').length}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-sm text-slate-600 mb-1">Vinterdekk</div>
          <div className="text-3xl font-bold text-blue-600">
            {tires.filter(t => t.season === 'winter').length}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-sm text-slate-600 mb-1">Trenger service</div>
          <div className="text-3xl font-bold text-red-600">
            {tires.filter(t => parseFloat(getAverageTread(t)) < 3).length}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Søk kunde, regnr eller QR-kode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={seasonFilter}
              onChange={(e) => setSeasonFilter(e.target.value as any)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Alle dekk</option>
              <option value="summer">Sommerdekk</option>
              <option value="winter">Vinterdekk</option>
            </select>

            <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              Skann QR
            </button>

            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Lagre dekk
            </button>
          </div>
        </div>
      </div>

      {/* Tire Sets */}
      {filteredTires.length === 0 ? (
        <EmptyState
          title="Ingen dekksett lagret"
          description="Registrer ditt første dekksett for å komme i gang"
          action={{
            label: "Lagre dekk",
            onClick: () => showToast.info('Opprett-funksjon kommer snart')
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTires.map((tire) => {
            const avgTread = parseFloat(getAverageTread(tire));
            const status = getTreadStatus(avgTread);

            return (
              <div key={tire.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Header */}
                <div className={`p-4 ${tire.season === 'summer' ? 'bg-orange-50' : 'bg-blue-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      tire.season === 'summer' 
                        ? 'bg-orange-200 text-orange-900' 
                        : 'bg-blue-200 text-blue-900'
                    }`}>
                      {tire.season === 'summer' ? '☀️ Sommer' : '❄️ Vinter'}
                    </span>
                    <QrCode className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="font-bold text-slate-900 text-lg">{tire.customer_name}</div>
                  <div className="text-sm text-slate-600">{tire.vehicle_reg}</div>
                </div>

                {/* Body */}
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Dimensjon</div>
                      <div className="font-medium text-slate-900">{tire.tire_dimension}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Merke</div>
                      <div className="font-medium text-slate-900">{tire.brand}</div>
                    </div>
                  </div>

                  {/* Tread Depths */}
                  <div className="bg-slate-50 rounded-lg p-3 mb-4">
                    <div className="text-xs text-slate-600 mb-2 font-medium">Mønsterdybde</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-600">FL:</span>
                        <span className="font-medium">{tire.tread_depth_fl} mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">FR:</span>
                        <span className="font-medium">{tire.tread_depth_fr} mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">RL:</span>
                        <span className="font-medium">{tire.tread_depth_rl} mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">RR:</span>
                        <span className="font-medium">{tire.tread_depth_rr} mm</span>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-xs text-slate-600">Snitt:</span>
                      <span className={`text-sm font-bold text-${status.color}-600`}>
                        {status.icon} {avgTread} mm - {status.label}
                      </span>
                    </div>
                  </div>

                  {/* Footer Info */}
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(tire.stored_date).toLocaleDateString('no-NO')}
                    </div>
                    <div className="font-mono">{tire.qr_code}</div>
                  </div>

                  {/* Warning */}
                  {avgTread < 3 && (
                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-800">
                      <AlertCircle className="w-4 h-4" />
                      <span>Anbefaler nytt dekksett</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="border-t border-slate-200 p-3 flex gap-2">
                  <button className="flex-1 text-sm text-blue-600 hover:bg-blue-50 py-2 rounded transition-colors">
                    Se detaljer
                  </button>
                  <button className="flex-1 text-sm text-slate-600 hover:bg-slate-50 py-2 rounded transition-colors flex items-center justify-center gap-1">
                    <Camera className="w-4 h-4" />
                    Bilder
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
