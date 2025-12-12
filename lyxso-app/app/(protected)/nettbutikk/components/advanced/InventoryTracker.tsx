"use client";

import React, { useState, useEffect } from "react";

type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  stock: number;
  reserved: number;
  reorderPoint: number;
  reorderQuantity: number;
  location?: string;
  lastUpdated: string;
};

export default function InventoryTracker() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchInventory();
  }, [filter]);

  const fetchInventory = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.append("filter", filter);
      
      const response = await fetch(`/api/webshop/inventory?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setItems(data.items || []);
      }
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (itemId: string, newStock: number) => {
    try {
      const response = await fetch("/api/webshop/inventory/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, stock: newStock }),
      });

      if (response.ok) {
        await fetchInventory();
      }
    } catch (error) {
      console.error("Failed to update stock:", error);
    }
  };

  const generateReorderReport = async () => {
    try {
      const response = await fetch("/api/webshop/inventory/reorder-report");
      const data = await response.json();
      
      if (response.ok) {
        const blob = new Blob([JSON.stringify(data.items, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `reorder-report-${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Failed to generate report:", error);
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: items.length,
    low: items.filter((i) => i.stock <= i.reorderPoint && i.stock > 0).length,
    out: items.filter((i) => i.stock === 0).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">
            Lagerstyring
          </h2>
          <p className="text-sm text-slate-400">
            Administrer beholdning og bestillingspunkter
          </p>
        </div>
        <button
          onClick={generateReorderReport}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800"
        >
          📊 Bestillingsrapport
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <p className="text-xs text-slate-400">Totalt produkter</p>
          <p className="mt-1 text-2xl font-semibold text-slate-100">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
          <p className="text-xs text-yellow-200">Lav beholdning</p>
          <p className="mt-1 text-2xl font-semibold text-yellow-400">{stats.low}</p>
        </div>
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-xs text-red-200">Utsolgt</p>
          <p className="mt-1 text-2xl font-semibold text-red-400">{stats.out}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-2">
          {[
            { value: "all", label: "Alle" },
            { value: "low", label: "Lav beholdning" },
            { value: "out", label: "Utsolgt" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value as typeof filter)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                filter === opt.value
                  ? "bg-blue-600 text-white"
                  : "border border-slate-700 text-slate-300 hover:bg-slate-800"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Søk produkt eller SKU..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white"
        />
      </div>

      {/* Inventory List */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-800">
              <tr className="text-left text-xs text-slate-400">
                <th className="p-4 font-medium">Produkt</th>
                <th className="p-4 font-medium">SKU</th>
                <th className="p-4 font-medium">Beholdning</th>
                <th className="p-4 font-medium">Reservert</th>
                <th className="p-4 font-medium">Tilgjengelig</th>
                <th className="p-4 font-medium">Bestillingspunkt</th>
                <th className="p-4 font-medium">Lokasjon</th>
                <th className="p-4 font-medium">Handlinger</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-sm text-slate-400">
                    Laster...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-sm text-slate-400">
                    Ingen produkter funnet
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const available = item.stock - item.reserved;
                  const needsReorder = item.stock <= item.reorderPoint;
                  
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-slate-800 hover:bg-slate-900/50"
                    >
                      <td className="p-4">
                        <div>
                          <p className="text-sm text-slate-100">{item.name}</p>
                          <p className="text-xs text-slate-500">
                            Oppdatert: {new Date(item.lastUpdated).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <code className="text-xs text-slate-300">{item.sku}</code>
                      </td>
                      <td className="p-4">
                        <span className={`text-sm font-medium ${
                          item.stock === 0
                            ? "text-red-400"
                            : needsReorder
                            ? "text-yellow-400"
                            : "text-slate-100"
                        }`}>
                          {item.stock}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-slate-400">{item.reserved}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-medium text-slate-100">
                          {available}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-xs text-slate-500">
                          {item.reorderPoint} ({item.reorderQuantity} stk)
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-xs text-slate-400">
                          {item.location || "—"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const newStock = prompt("Ny beholdning:", item.stock.toString());
                              if (newStock) {
                                updateStock(item.id, parseInt(newStock));
                              }
                            }}
                            className="text-xs text-blue-400 hover:text-blue-300"
                          >
                            Endre
                          </button>
                          {needsReorder && (
                            <span className="text-xs text-yellow-400">⚠ Bestill</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Help */}
      <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
        <h4 className="text-sm font-semibold text-blue-200 mb-2">
          Om lagerstyring
        </h4>
        <ul className="space-y-1 text-xs text-blue-200/80">
          <li>• <strong>Beholdning:</strong> Total lagerbeholdning</li>
          <li>• <strong>Reservert:</strong> Antall i aktive ordrer</li>
          <li>• <strong>Tilgjengelig:</strong> Beholdning - Reservert</li>
          <li>• <strong>Bestillingspunkt:</strong> Når det er på tide å bestille mer</li>
          <li>• Produkter merkes automatisk når beholdningen er lav</li>
        </ul>
      </div>
    </div>
  );
}
