/**
 * INVENTORY MANAGER - UI Component
 * Manage stock with barcode scanning and auto-reorder
 */
'use client';

import { useState, useEffect } from 'react';
import { Package, Plus, Search, Filter, AlertTriangle, TrendingDown, Barcode, Camera } from 'lucide-react';
import { showToast } from '@/lib/toast';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  current_quantity: number;
  reorder_point: number;
  cost_price: number;
  selling_price: number;
  unit: string;
  location_name?: string;
}

interface Stats {
  total_items: number;
  total_value: number;
  low_stock_items: number;
}

export default function InventoryManager() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLowStock, setShowLowStock] = useState(false);

  useEffect(() => {
    loadItems();
  }, [showLowStock]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (showLowStock) params.append('low_stock', 'true');

      const res = await fetch(`/api/inventory?${params}`);
      const data = await res.json();

      if (data.success) {
        setItems(data.items);
        setStats(data.stats);
      }
    } catch (error) {
      showToast.error('Kunne ikke laste lager');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSkeleton rows={8} />;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Varelager</h1>
        <p className="text-slate-600">Administrer beholdning med strekkodeskanning og auto-bestilling</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Totalt antall varer</p>
                <p className="text-3xl font-bold text-slate-900">{stats.total_items}</p>
              </div>
              <Package className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Lagerverdi</p>
                <p className="text-3xl font-bold text-slate-900">kr {stats.total_value.toLocaleString('no-NO')}</p>
              </div>
              <TrendingDown className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Lavt lager</p>
                <p className="text-3xl font-bold text-orange-600">{stats.low_stock_items}</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Søk etter vare eller SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowLowStock(!showLowStock)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showLowStock
                  ? 'bg-orange-100 text-orange-900 border-2 border-orange-300'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <AlertTriangle className="w-5 h-5 inline mr-2" />
              Lavt lager
            </button>

            <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Skann
            </button>

            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Ny vare
            </button>
          </div>
        </div>
      </div>

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <EmptyState
          title="Ingen varer funnet"
          description="Legg til din første vare for å komme i gang"
          action={{
            label: "Legg til vare",
            onClick: () => showToast.info('Opprett-funksjon kommer snart')
          }}
        />
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Vare
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    SKU / Strekkode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Beholdning
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Kostpris
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Salgspris
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredItems.map((item) => {
                  const isLowStock = item.current_quantity <= item.reorder_point;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50 cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Package className="w-5 h-5 text-slate-400" />
                          <div>
                            <div className="font-medium text-slate-900">{item.name}</div>
                            {item.location_name && (
                              <div className="text-sm text-slate-600">{item.location_name}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Barcode className="w-4 h-4" />
                          {item.sku}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className={`font-semibold ${isLowStock ? 'text-orange-600' : 'text-slate-900'}`}>
                          {item.current_quantity} {item.unit}
                        </div>
                        <div className="text-sm text-slate-500">
                          Min: {item.reorder_point}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-slate-600">
                        kr {item.cost_price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-slate-900">
                        kr {item.selling_price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isLowStock ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Lavt lager
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✓ OK
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
