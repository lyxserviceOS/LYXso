// app/(protected)/dekkhotell/DekkhotellPageClient.tsx
"use client";

import React, { useEffect, useState } from "react";
import type { TyreSet, TyreSeason, TyreCondition, TyreStatus } from "@/types/tyre";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID;

type FilterSeason = TyreSeason | "all";
type FilterCondition = TyreCondition | "all";
type FilterStatus = TyreStatus | "all";

export default function DekkhotellPageClient() {
  const [tyreSets, setTyreSets] = useState<TyreSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSeason, setFilterSeason] = useState<FilterSeason>("all");
  const [filterCondition, setFilterCondition] = useState<FilterCondition>("all");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  
  // Selected tyre set for detail view
  const [selectedSet, setSelectedSet] = useState<TyreSet | null>(null);
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    stored: 0,
    mounted: 0,
    summer: 0,
    winter: 0,
    needsReplacement: 0,
  });

  useEffect(() => {
    if (!API_BASE || !ORG_ID) {
      setError(
        "Mangler API-konfigurasjon (NEXT_PUBLIC_API_BASE / NEXT_PUBLIC_ORG_ID).",
      );
      setLoading(false);
      return;
    }

    async function load() {
      setError(null);
      setLoading(true);

      try {
        const res = await fetch(
          `${API_BASE}/api/orgs/${ORG_ID}/tyre-sets`,
          { method: "GET" },
        );

        if (!res.ok) {
          const text = await res.text();
          throw new Error(
            `Feil ved henting av dekksett: ${res.status} ${res.statusText} - ${text}`,
          );
        }

        const json = await res.json();
        const sets = (json.tyreSets ?? []) as TyreSet[];
        setTyreSets(sets);
        
        // Calculate stats
        setStats({
          total: sets.length,
          stored: sets.filter(s => s.status === "stored").length,
          mounted: sets.filter(s => s.status === "mounted").length,
          summer: sets.filter(s => s.season === "summer").length,
          winter: sets.filter(s => s.season === "winter").length,
          needsReplacement: sets.filter(s => s.condition === "replace" || s.condition === "bad").length,
        });
      } catch (err) {
        console.error(err);
        setError("Kunne ikke hente dekksett.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // Filter tyre sets
  const filteredSets = tyreSets.filter(set => {
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        (set.registration_number?.toLowerCase().includes(query)) ||
        (set.label?.toLowerCase().includes(query)) ||
        (set.location?.toLowerCase().includes(query)) ||
        (set.dimension?.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }
    
    // Season filter
    if (filterSeason !== "all" && set.season !== filterSeason) return false;
    
    // Condition filter
    if (filterCondition !== "all" && set.condition !== filterCondition) return false;
    
    // Status filter
    if (filterStatus !== "all" && set.status !== filterStatus) return false;
    
    return true;
  });

  const getSeasonLabel = (season: TyreSeason | null | undefined): string => {
    switch (season) {
      case "summer": return "Sommer";
      case "winter": return "Vinter";
      case "allseason": return "Helårs";
      default: return "Ukjent";
    }
  };

  const getConditionLabel = (condition: TyreCondition | null | undefined): string => {
    switch (condition) {
      case "good": return "God";
      case "worn": return "Slitt";
      case "bad": return "Dårlig";
      case "replace": return "Må byttes";
      default: return "Ukjent";
    }
  };

  const getConditionColor = (condition: TyreCondition | null | undefined): string => {
    switch (condition) {
      case "good": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "worn": return "bg-amber-100 text-amber-700 border-amber-200";
      case "bad": return "bg-orange-100 text-orange-700 border-orange-200";
      case "replace": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getStatusLabel = (status: TyreStatus | null | undefined): string => {
    switch (status) {
      case "stored": return "Lagret";
      case "mounted": return "Montert";
      case "out": return "Utlevert";
      default: return "Ukjent";
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-sm">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Dekkhotell PRO</h1>
          <p className="text-sm text-slate-500">
            Administrer dekksett, lagerplass og klargjør bookinger for dekkskift.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Nytt dekksett
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Totalt" value={stats.total} />
        <StatCard label="På lager" value={stats.stored} color="emerald" />
        <StatCard label="Montert" value={stats.mounted} color="blue" />
        <StatCard label="Sommerdekk" value={stats.summer} color="amber" />
        <StatCard label="Vinterdekk" value={stats.winter} color="sky" />
        <StatCard label="Må byttes" value={stats.needsReplacement} color="red" />
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Søk på regnr, kundenavn, plassering..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <select
            value={filterSeason}
            onChange={(e) => setFilterSeason(e.target.value as FilterSeason)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="all">Alle sesonger</option>
            <option value="summer">Sommer</option>
            <option value="winter">Vinter</option>
            <option value="allseason">Helårs</option>
          </select>
          
          <select
            value={filterCondition}
            onChange={(e) => setFilterCondition(e.target.value as FilterCondition)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="all">Alle tilstander</option>
            <option value="good">God</option>
            <option value="worn">Slitt</option>
            <option value="bad">Dårlig</option>
            <option value="replace">Må byttes</option>
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="all">Alle statuser</option>
            <option value="stored">På lager</option>
            <option value="mounted">Montert</option>
            <option value="out">Utlevert</option>
          </select>
        </div>
      </div>

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Tyre sets list */}
        <section className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-4 py-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Dekksett ({filteredSets.length})
            </h2>
          </div>

          {loading ? (
            <div className="px-4 py-8 text-center text-sm text-slate-500">
              Laster dekksett...
            </div>
          ) : filteredSets.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-slate-500">
              {tyreSets.length === 0 
                ? "Ingen dekksett registrert ennå."
                : "Ingen dekksett matcher filteret."}
            </div>
          ) : (
            <div className="max-h-[600px] overflow-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-slate-50">
                  <tr>
                    <th className="border-b border-slate-200 px-3 py-2 text-left font-medium text-slate-600">Regnr</th>
                    <th className="border-b border-slate-200 px-3 py-2 text-left font-medium text-slate-600">Dimensjon</th>
                    <th className="border-b border-slate-200 px-3 py-2 text-left font-medium text-slate-600">Sesong</th>
                    <th className="border-b border-slate-200 px-3 py-2 text-left font-medium text-slate-600">Tilstand</th>
                    <th className="border-b border-slate-200 px-3 py-2 text-left font-medium text-slate-600">Plassering</th>
                    <th className="border-b border-slate-200 px-3 py-2 text-left font-medium text-slate-600">Status</th>
                    <th className="border-b border-slate-200 px-3 py-2 text-left font-medium text-slate-600"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSets.map((set) => (
                    <tr
                      key={set.id}
                      className={`border-b border-slate-100 hover:bg-slate-50 cursor-pointer ${
                        selectedSet?.id === set.id ? "bg-blue-50" : ""
                      }`}
                      onClick={() => setSelectedSet(set)}
                    >
                      <td className="px-3 py-2 font-medium text-slate-900">
                        {set.registration_number || "—"}
                      </td>
                      <td className="px-3 py-2 text-slate-600">
                        {set.dimension || "—"}
                      </td>
                      <td className="px-3 py-2">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          set.season === "winter" 
                            ? "bg-sky-100 text-sky-700" 
                            : set.season === "summer"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-700"
                        }`}>
                          {getSeasonLabel(set.season)}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${getConditionColor(set.condition)}`}>
                          {getConditionLabel(set.condition)}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-slate-600">
                        {set.location || set.shelf || "—"}
                      </td>
                      <td className="px-3 py-2">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          set.status === "stored" 
                            ? "bg-emerald-100 text-emerald-700" 
                            : set.status === "mounted"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-700"
                        }`}>
                          {getStatusLabel(set.status)}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSet(set);
                          }}
                        >
                          Detaljer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Detail panel */}
        <section className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-4 py-3">
            <h2 className="text-sm font-semibold text-slate-900">
              {selectedSet ? "Detaljer" : "Velg et dekksett"}
            </h2>
          </div>
          
          {selectedSet ? (
            <div className="p-4 space-y-4">
              {/* Basic info */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Regnr</span>
                  <span className="text-xs font-medium text-slate-900">{selectedSet.registration_number || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Etikett</span>
                  <span className="text-xs font-medium text-slate-900">{selectedSet.label || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Dimensjon</span>
                  <span className="text-xs font-medium text-slate-900">{selectedSet.dimension || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Merke</span>
                  <span className="text-xs font-medium text-slate-900">{selectedSet.brand || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Mønsterdybde</span>
                  <span className="text-xs font-medium text-slate-900">
                    {selectedSet.tread_depth_mm ? `${selectedSet.tread_depth_mm} mm` : "—"}
                  </span>
                </div>
              </div>
              
              {/* Location info */}
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <p className="text-xs font-medium text-slate-700">Lagerplassering</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded-lg bg-slate-50 p-2 text-center">
                    <p className="text-slate-500">Hylle</p>
                    <p className="font-medium text-slate-900">{selectedSet.shelf || "—"}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2 text-center">
                    <p className="text-slate-500">Rad</p>
                    <p className="font-medium text-slate-900">{selectedSet.row || "—"}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2 text-center">
                    <p className="text-slate-500">Posisjon</p>
                    <p className="font-medium text-slate-900">{selectedSet.position || "—"}</p>
                  </div>
                </div>
              </div>
              
              {/* Notes */}
              {selectedSet.notes && (
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs font-medium text-slate-700 mb-1">Notater</p>
                  <p className="text-xs text-slate-600 bg-slate-50 rounded-lg p-2">
                    {selectedSet.notes}
                  </p>
                </div>
              )}
              
              {/* History placeholder */}
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-medium text-slate-700 mb-2">Historikk</p>
                <div className="space-y-2">
                  {selectedSet.stored_at && (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      <span>Lagret: {new Date(selectedSet.stored_at).toLocaleDateString("nb-NO")}</span>
                    </div>
                  )}
                  {selectedSet.last_mounted_at && (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      <span>Sist montert: {new Date(selectedSet.last_mounted_at).toLocaleDateString("nb-NO")}</span>
                    </div>
                  )}
                  {selectedSet.mileage_at_storage && (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                      <span>Km ved lagring: {selectedSet.mileage_at_storage.toLocaleString("nb-NO")}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Actions */}
              <div className="border-t border-slate-100 pt-4 flex gap-2">
                <button
                  type="button"
                  className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
                >
                  Klargjør dekkskift
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Rediger
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              Klikk på et dekksett i listen for å se detaljer, historikk og handlinger.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// Helper component for stat cards
function StatCard({ label, value, color = "slate" }: { label: string; value: number; color?: string }) {
  const colorClasses: Record<string, string> = {
    slate: "bg-slate-50 border-slate-200",
    emerald: "bg-emerald-50 border-emerald-200",
    blue: "bg-blue-50 border-blue-200",
    amber: "bg-amber-50 border-amber-200",
    sky: "bg-sky-50 border-sky-200",
    red: "bg-red-50 border-red-200",
  };
  
  return (
    <div className={`rounded-lg border p-3 ${colorClasses[color]}`}>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
