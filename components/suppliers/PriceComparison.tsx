/**
 * SUPPLIER PRICE COMPARISON - UI Component
 * Compare prices from Norwegian suppliers
 */
'use client';

import { useState } from 'react';
import { Search, TrendingDown, Package, Truck, MapPin, ExternalLink } from 'lucide-react';
import { showToast } from '@/lib/toast';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

interface SupplierProduct {
  id: string;
  name: string;
  part_number: string;
  cost_price: number;
  final_price: number;
  total_cost: number;
  in_stock: boolean;
  estimated_delivery_days: number;
  supplier: string;
  supplier_type: string;
}

export default function SupplierPriceComparison() {
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicleReg, setVehicleReg] = useState('');
  const [results, setResults] = useState<SupplierProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      showToast.error('Skriv inn et søkeord');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/suppliers/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ search_term: searchTerm, vehicle_reg: vehicleReg })
      });

      const data = await res.json();

      if (!res.ok) {
        showToast.error(data.error || 'Kunne ikke søke');
        return;
      }

      setResults(data.sorted_products || []);

      if (data.sorted_products.length === 0) {
        showToast.info('Ingen produkter funnet');
      } else {
        showToast.success(`Fant ${data.sorted_products.length} produkter`, {
          description: data.cheapest ? `Billigste: ${data.cheapest.supplier} (kr ${data.cheapest.total_cost.toFixed(2)})` : undefined
        });
      }
    } catch (error) {
      showToast.error('Noe gikk galt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Prisjakt - Norske Leverandører</h1>
        <p className="text-slate-600">Sammenlign priser fra Mekonomen, GS Bildeler, Bildeler.no og flere</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Søk etter deler
            </label>
            <input
              type="text"
              placeholder="F.eks. 'bremseskiver', 'oljefilter', 'pollen filter'"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Regnr (valgfritt)
            </label>
            <input
              type="text"
              placeholder="AB12345"
              value={vehicleReg}
              onChange={(e) => setVehicleReg(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          <Search className="w-5 h-5" />
          {loading ? 'Søker...' : 'Søk i alle leverandører'}
        </button>
      </div>

      {/* Results */}
      {loading ? (
        <LoadingSkeleton rows={5} />
      ) : results.length > 0 ? (
        <div className="space-y-4">
          {/* Best Deal Banner */}
          {results[0] && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <TrendingDown className="w-8 h-8 text-green-600" />
                <div>
                  <h2 className="text-xl font-bold text-green-900">Beste tilbud</h2>
                  <p className="text-green-700">Billigste leverandør funnet</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-green-700 mb-1">Produkt</div>
                  <div className="font-semibold text-green-900">{results[0].name}</div>
                  <div className="text-sm text-green-700">Varenr: {results[0].part_number}</div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-green-700 mb-1">Totalpris inkl. frakt</div>
                  <div className="text-4xl font-bold text-green-900">
                    kr {results[0].total_cost.toFixed(2)}
                  </div>
                  <div className="text-sm text-green-700 mt-1">
                    Fra {results[0].supplier}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* All Results */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">Alle resultater ({results.length})</h3>
            </div>

            <div className="divide-y divide-slate-200">
              {results.map((product, index) => (
                <div key={`${product.supplier}-${product.id}-${index}`} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Package className="w-5 h-5 text-blue-600" />
                        <h4 className="font-semibold text-slate-900">{product.name}</h4>
                        {index === 0 && (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                            Billigst
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-slate-600">Leverandør</div>
                          <div className="font-medium text-slate-900">{product.supplier}</div>
                        </div>

                        <div>
                          <div className="text-slate-600">Varenummer</div>
                          <div className="font-medium text-slate-900">{product.part_number}</div>
                        </div>

                        <div>
                          <div className="text-slate-600">Leveringstid</div>
                          <div className="font-medium text-slate-900 flex items-center gap-1">
                            <Truck className="w-4 h-4" />
                            {product.estimated_delivery_days || 1-2} dager
                          </div>
                        </div>

                        <div>
                          <div className="text-slate-600">Status</div>
                          <div className={`font-medium ${product.in_stock ? 'text-green-600' : 'text-orange-600'}`}>
                            {product.in_stock ? '✓ På lager' : 'Må bestilles'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-900">
                        kr {product.total_cost.toFixed(2)}
                      </div>
                      <div className="text-sm text-slate-600">
                        Vare: kr {product.cost_price.toFixed(2)}
                      </div>
                      <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                        Bestill
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Difference */}
          {results.length > 1 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-900">
                <TrendingDown className="w-5 h-5" />
                <span className="font-semibold">
                  Du sparer kr {(results[results.length - 1].total_cost - results[0].total_cost).toFixed(2)} ved å velge billigste leverandør!
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Søk etter deler</h3>
          <p className="text-slate-600">
            Skriv inn hva du leter etter, så sammenligner vi priser fra alle norske leverandører
          </p>
        </div>
      )}
    </div>
  );
}
