// app/(protected)/dekkhotell/DekkhotellPageClient.tsx
"use client";

import React, { useEffect, useState } from "react";
import type { TyreSet, TyreSeason, TyreCondition, TyreStatus, TyrePosition, TyreHistory } from "@/types/tyre";
import { getApiBaseUrl } from "@/lib/apiConfig";

const API_BASE = getApiBaseUrl();
const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID;

type FilterSeason = TyreSeason | "all";
type FilterCondition = TyreCondition | "all";
type FilterStatus = TyreStatus | "all";

// Mock history data for demonstration
const MOCK_HISTORY: TyreHistory[] = [
  { id: "h1", tyre_set_id: "", action: "stored", date: "2024-10-15", mileage: 45000, notes: "Vinterdekk inn for lagring", created_by: "Anders", created_at: "2024-10-15" },
  { id: "h2", tyre_set_id: "", action: "inspected", date: "2024-10-15", mileage: null, notes: "Mønsterdybde sjekket, alle over 5mm", created_by: "Anders", created_at: "2024-10-15" },
  { id: "h3", tyre_set_id: "", action: "mounted", date: "2024-04-01", mileage: 38000, notes: "Sommerdekk montert", created_by: "Kari", created_at: "2024-04-01" },
];

// New tyre set form type
type NewTyreSetForm = {
  registration_number: string;
  customer_name: string;
  dimension: string;
  brand: string;
  model: string;
  season: TyreSeason;
  condition: TyreCondition;
  tread_depth_mm: string;
  shelf: string;
  row: string;
  position: string;
  notes: string;
};

const EMPTY_FORM: NewTyreSetForm = {
  registration_number: "",
  customer_name: "",
  dimension: "",
  brand: "",
  model: "",
  season: "summer",
  condition: "good",
  tread_depth_mm: "",
  shelf: "",
  row: "",
  position: "",
  notes: "",
};

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
  
  // Modal states
  const [showNewModal, setShowNewModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showTyrePositionsModal, setShowTyrePositionsModal] = useState(false);
  const [showImageCaptureModal, setShowImageCaptureModal] = useState(false);
  const [showAIAnalysisModal, setShowAIAnalysisModal] = useState(false);
  const [newForm, setNewForm] = useState<NewTyreSetForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<Record<string, File>>({});
  
  // AI Analysis state
  const [aiAnalysisResult, setAiAnalysisResult] = useState<{
    positions: {
      position: string;
      tread_depth_mm: number;
      condition: TyreCondition;
      production_year: number;
      production_week: number;
    }[];
    overall_condition: TyreCondition;
    overall_tread_depth_mm: number;
    recommendation: string;
  } | null>(null);
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    stored: 0,
    mounted: 0,
    summer: 0,
    winter: 0,
    needsReplacement: 0,
  });

  // Mock data for demonstration when API is not configured
  const MOCK_TYRE_SETS: TyreSet[] = [
    {
      id: "demo-1",
      org_id: "demo",
      customer_id: null,
      vehicle_id: null,
      registration_number: "AB12345",
      label: "Ole Hansen",
      dimension: "225/45R17",
      brand: "Continental",
      model: "WinterContact TS 870",
      season: "winter",
      condition: "good",
      tread_depth_mm: 6.5,
      production_year: 2022,
      production_week: 34,
      storage_location_id: null,
      location: "Hovedlager",
      shelf: "A",
      row: "3",
      position: "12",
      status: "stored",
      notes: "Kunde ønsker dekkskift i oktober",
      images: null,
      ai_analysis: null,
      stored_at: "2024-10-15T10:00:00Z",
      last_mounted_at: "2024-04-01T09:00:00Z",
      mileage_at_storage: 45000,
      created_at: "2024-03-01T08:00:00Z",
      updated_at: "2024-10-15T10:00:00Z",
    },
    {
      id: "demo-2",
      org_id: "demo",
      customer_id: null,
      vehicle_id: null,
      registration_number: "CD67890",
      label: "Kari Nordmann",
      dimension: "205/55R16",
      brand: "Michelin",
      model: "Pilot Sport 5",
      season: "summer",
      condition: "worn",
      tread_depth_mm: 3.2,
      production_year: 2021,
      production_week: 15,
      storage_location_id: null,
      location: "Hovedlager",
      shelf: "B",
      row: "1",
      position: "5",
      status: "stored",
      notes: "Anbefaler nye dekk til neste sesong",
      images: null,
      ai_analysis: null,
      stored_at: "2024-11-01T14:00:00Z",
      last_mounted_at: "2024-05-15T11:00:00Z",
      mileage_at_storage: 78000,
      created_at: "2022-05-01T08:00:00Z",
      updated_at: "2024-11-01T14:00:00Z",
    },
    {
      id: "demo-3",
      org_id: "demo",
      customer_id: null,
      vehicle_id: null,
      registration_number: "EF11111",
      label: "Per Olsen",
      dimension: "235/40R18",
      brand: "Pirelli",
      model: "P Zero",
      season: "summer",
      condition: "good",
      tread_depth_mm: 5.8,
      production_year: 2023,
      production_week: 20,
      storage_location_id: null,
      location: "Hovedlager",
      shelf: "C",
      row: "2",
      position: "8",
      status: "stored",
      notes: null,
      images: null,
      ai_analysis: null,
      stored_at: "2024-10-20T09:30:00Z",
      last_mounted_at: "2024-04-15T10:00:00Z",
      mileage_at_storage: 32000,
      created_at: "2023-04-01T08:00:00Z",
      updated_at: "2024-10-20T09:30:00Z",
    },
    {
      id: "demo-4",
      org_id: "demo",
      customer_id: null,
      vehicle_id: null,
      registration_number: "GH22222",
      label: "Anna Berg",
      dimension: "215/60R17",
      brand: "Nokian",
      model: "Hakkapeliitta R5",
      season: "winter",
      condition: "replace",
      tread_depth_mm: 2.1,
      production_year: 2019,
      production_week: 42,
      storage_location_id: null,
      location: "Hovedlager",
      shelf: "A",
      row: "5",
      position: "3",
      status: "stored",
      notes: "MÅ BYTTES - for lav mønsterdybde",
      images: null,
      ai_analysis: null,
      stored_at: "2024-04-10T08:00:00Z",
      last_mounted_at: "2023-11-01T10:00:00Z",
      mileage_at_storage: 95000,
      created_at: "2020-10-01T08:00:00Z",
      updated_at: "2024-04-10T08:00:00Z",
    },
    {
      id: "demo-5",
      org_id: "demo",
      customer_id: null,
      vehicle_id: null,
      registration_number: "IJ33333",
      label: "Erik Strand",
      dimension: "225/50R17",
      brand: "Goodyear",
      model: "Vector 4Seasons Gen-3",
      season: "allseason",
      condition: "good",
      tread_depth_mm: 7.2,
      production_year: 2024,
      production_week: 8,
      storage_location_id: null,
      location: "Hovedlager",
      shelf: "D",
      row: "1",
      position: "1",
      status: "mounted",
      notes: "Helårsdekk - alltid montert",
      images: null,
      ai_analysis: null,
      stored_at: null,
      last_mounted_at: "2024-09-01T11:00:00Z",
      mileage_at_storage: null,
      created_at: "2024-02-01T08:00:00Z",
      updated_at: "2024-09-01T11:00:00Z",
    },
  ];

  useEffect(() => {
    if (!API_BASE || !ORG_ID) {
      // Load mock data for demonstration
      setTyreSets(MOCK_TYRE_SETS);
      setStats({
        total: MOCK_TYRE_SETS.length,
        stored: MOCK_TYRE_SETS.filter(s => s.status === "stored").length,
        mounted: MOCK_TYRE_SETS.filter(s => s.status === "mounted").length,
        summer: MOCK_TYRE_SETS.filter(s => s.season === "summer").length,
        winter: MOCK_TYRE_SETS.filter(s => s.season === "winter").length,
        needsReplacement: MOCK_TYRE_SETS.filter(s => s.condition === "replace" || s.condition === "bad").length,
      });
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

  const getActionLabel = (action: string): string => {
    switch (action) {
      case "stored": return "Lagt inn på lager";
      case "mounted": return "Montert på bil";
      case "inspected": return "Inspeksjon utført";
      case "note_added": return "Notat lagt til";
      default: return action;
    }
  };

  const handleNewFormChange = (field: keyof NewTyreSetForm, value: string) => {
    setNewForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveNewTyreSet = async () => {
    setSaving(true);
    // In a real app, this would POST to the API
    // For now, we'll add it to the local state as a demo
    const newSet: TyreSet = {
      id: `demo-${Date.now()}`,
      org_id: ORG_ID || "",
      customer_id: null,
      vehicle_id: null,
      registration_number: newForm.registration_number || null,
      label: newForm.customer_name || null,
      dimension: newForm.dimension || null,
      brand: newForm.brand || null,
      model: newForm.model || null,
      season: newForm.season,
      condition: newForm.condition,
      tread_depth_mm: newForm.tread_depth_mm ? parseFloat(newForm.tread_depth_mm) : null,
      production_year: null,
      production_week: null,
      storage_location_id: null,
      location: null,
      shelf: newForm.shelf || null,
      row: newForm.row || null,
      position: newForm.position || null,
      status: "stored",
      notes: newForm.notes || null,
      images: null,
      ai_analysis: null,
      stored_at: new Date().toISOString(),
      last_mounted_at: null,
      mileage_at_storage: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setTyreSets(prev => [newSet, ...prev]);
    setStats(prev => ({
      ...prev,
      total: prev.total + 1,
      stored: prev.stored + 1,
      [newForm.season]: (prev as Record<string, number>)[newForm.season] + 1,
    }));
    
    setNewForm(EMPTY_FORM);
    setShowNewModal(false);
    setSaving(false);
  };

  const handlePrintLabel = () => {
    if (!selectedSet) return;
    // Create a printable label
    const labelContent = `
      <html>
        <head>
          <title>Dekketikett - ${selectedSet.registration_number}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .label { border: 2px solid black; padding: 15px; max-width: 300px; }
            .reg { font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 10px; }
            .info { font-size: 12px; margin: 5px 0; }
            .location { font-size: 18px; font-weight: bold; text-align: center; margin-top: 10px; padding: 10px; background: #f0f0f0; }
          </style>
        </head>
        <body>
          <div class="label">
            <div class="reg">${selectedSet.registration_number || "—"}</div>
            <div class="info"><strong>Sesong:</strong> ${getSeasonLabel(selectedSet.season)}</div>
            <div class="info"><strong>Dimensjon:</strong> ${selectedSet.dimension || "—"}</div>
            <div class="info"><strong>Merke:</strong> ${selectedSet.brand || "—"}</div>
            <div class="info"><strong>Tilstand:</strong> ${getConditionLabel(selectedSet.condition)}</div>
            <div class="info"><strong>Inn-dato:</strong> ${selectedSet.stored_at ? new Date(selectedSet.stored_at).toLocaleDateString("nb-NO") : "—"}</div>
            <div class="location">
              ${selectedSet.shelf || "—"} / ${selectedSet.row || "—"} / ${selectedSet.position || "—"}
            </div>
          </div>
        </body>
      </html>
    `;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(labelContent);
      printWindow.document.close();
      printWindow.print();
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
          onClick={() => setShowNewModal(true)}
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
                <button
                  type="button"
                  onClick={() => setShowHistoryModal(true)}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-700"
                >
                  Se full historikk →
                </button>
              </div>
              
              {/* Tyre positions */}
              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-slate-700">Dekkposisjoner</p>
                  <button
                    type="button"
                    onClick={() => setShowTyrePositionsModal(true)}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Inspiser →
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-slate-50 p-2 text-center text-xs">
                    <p className="text-slate-500">Foran venstre</p>
                    <p className="font-medium text-slate-900">{selectedSet.tread_depth_mm || "—"} mm</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2 text-center text-xs">
                    <p className="text-slate-500">Foran høyre</p>
                    <p className="font-medium text-slate-900">{selectedSet.tread_depth_mm || "—"} mm</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2 text-center text-xs">
                    <p className="text-slate-500">Bak venstre</p>
                    <p className="font-medium text-slate-900">{selectedSet.tread_depth_mm || "—"} mm</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2 text-center text-xs">
                    <p className="text-slate-500">Bak høyre</p>
                    <p className="font-medium text-slate-900">{selectedSet.tread_depth_mm || "—"} mm</p>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="border-t border-slate-100 pt-4 space-y-2">
                {/* AI Image Analysis Button */}
                <button
                  type="button"
                  onClick={() => setShowImageCaptureModal(true)}
                  className="w-full rounded-lg bg-purple-600 px-3 py-2 text-xs font-medium text-white hover:bg-purple-700 flex items-center justify-center gap-2"
                >
                  📷 Ta bilde for AI-analyse
                </button>
                <button
                  type="button"
                  className="w-full rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
                >
                  🚗 Klargjør dekkskift
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handlePrintLabel}
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    🏷️ Skriv ut etikett
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    ✏️ Rediger
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              Klikk på et dekksett i listen for å se detaljer, historikk og handlinger.
            </div>
          )}
        </section>
      </div>

      {/* Image Capture Modal for AI Analysis */}
      {showImageCaptureModal && selectedSet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                AI Dekkanalyse – {selectedSet.registration_number}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setShowImageCaptureModal(false);
                  setUploadedImages({});
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p className="text-xs text-purple-800">
                  <strong>AI-analyse:</strong> Last opp eller ta bilde av alle fire dekk for automatisk 
                  analyse av mønsterdybde, produksjonsår og slitasjemønster.
                </p>
              </div>
              
              {/* Image upload grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "FL", label: "Foran venstre" },
                  { id: "FR", label: "Foran høyre" },
                  { id: "RL", label: "Bak venstre" },
                  { id: "RR", label: "Bak høyre" },
                ].map((pos) => (
                  <div key={pos.id} className="relative">
                    <label
                      htmlFor={`upload-${pos.id}`}
                      className={`block border-2 border-dashed ${
                        uploadedImages[pos.id] ? "border-green-400 bg-green-50" : "border-slate-300 bg-slate-50"
                      } rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors`}
                    >
                      {uploadedImages[pos.id] ? (
                        <div className="relative">
                          <img 
                            src={URL.createObjectURL(uploadedImages[pos.id])} 
                            alt={pos.label}
                            className="w-full h-32 object-cover rounded-md mb-2"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const newImages = { ...uploadedImages };
                              delete newImages[pos.id];
                              setUploadedImages(newImages);
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ✕
                          </button>
                          <p className="text-xs font-medium text-green-700">✓ {pos.label}</p>
                        </div>
                      ) : (
                        <>
                          <div className="text-3xl mb-2">📷</div>
                          <p className="text-xs font-medium text-slate-700 mb-1">{pos.label}</p>
                          <p className="text-xs text-slate-500">Klikk for å laste opp</p>
                        </>
                      )}
                    </label>
                    <input
                      id={`upload-${pos.id}`}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploadedImages(prev => ({ ...prev, [pos.id]: file }));
                        }
                      }}
                      className="hidden"
                    />
                  </div>
                ))}
              </div>
              
              {/* Progress indicator */}
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-slate-700">
                    Bilder lastet opp: {Object.keys(uploadedImages).length} / 4
                  </p>
                  <span className="text-xs text-slate-500">
                    {Object.keys(uploadedImages).length === 4 ? "✓ Alle dekk fotografert" : "Legg til flere bilder"}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(Object.keys(uploadedImages).length / 4) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowImageCaptureModal(false);
                  setUploadedImages({});
                }}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Avbryt
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!selectedSet || !API_BASE || !ORG_ID) return;
                  
                  // Validate that we have all 4 images
                  if (Object.keys(uploadedImages).length !== 4) {
                    alert("Vennligst last opp bilder av alle fire dekk før analyse.");
                    return;
                  }
                  
                  setAnalyzing(true);
                  
                  try {
                    // First, upload images to get URLs
                    const formData = new FormData();
                    Object.entries(uploadedImages).forEach(([position, file]) => {
                      formData.append(position, file);
                    });
                    
                    // Upload images
                    const uploadRes = await fetch(
                      `${API_BASE}/api/orgs/${ORG_ID}/tyres/${selectedSet.id}/upload-photos`,
                      {
                        method: "POST",
                        body: formData
                      }
                    );
                    
                    if (!uploadRes.ok) {
                      throw new Error("Bildeopplasting feilet");
                    }
                    
                    const uploadData = await uploadRes.json();
                    const photoUrls = uploadData.photos; // { FL: "url", FR: "url", RL: "url", RR: "url" }
                    
                    // Now run AI analysis
                    const res = await fetch(
                      `${API_BASE}/api/orgs/${ORG_ID}/tyres/${selectedSet.id}/analyze`,
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ photos: Object.values(photoUrls) })
                      }
                    );
                    
                    if (!res.ok) {
                      throw new Error("AI-analyse feilet");
                    }
                    
                    const data = await res.json();
                    
                    // Convert AI result to frontend format
                    setAiAnalysisResult({
                      positions: data.result.positions.map((p: any) => ({
                        position: p.position,
                        tread_depth_mm: p.tread_depth_mm,
                        condition: p.wear_status === "ok" ? "good" : p.wear_status === "warn" ? "worn" : "replace",
                        production_year: data.result.dot_year || 2022,
                        production_week: 34
                      })),
                      overall_condition: data.result.overall_recommendation === "ok" ? "good" : 
                                        data.result.overall_recommendation === "bør_byttes_snart" ? "worn" : "replace",
                      overall_tread_depth_mm: Math.min(...data.result.positions.map((p: any) => p.tread_depth_mm)),
                      recommendation: data.result.reasoning || "Ingen spesielle merknader"
                    });
                    
                    setShowImageCaptureModal(false);
                    setShowAIAnalysisModal(true);
                    setUploadedImages({});
                    
                  } catch (err) {
                    console.error("AI-analyse feil:", err);
                    alert("Kunne ikke kjøre AI-analyse. Prøv igjen senere.");
                  } finally {
                    setAnalyzing(false);
                  }
                }}
                disabled={analyzing || Object.keys(uploadedImages).length !== 4}
                className="flex-1 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
              >
                {analyzing ? "Analyserer..." : "Start AI-analyse"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Analysis Results Modal */}
      {showAIAnalysisModal && aiAnalysisResult && selectedSet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                AI-analyse resultat
              </h2>
              <button
                type="button"
                onClick={() => setShowAIAnalysisModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Overall summary */}
              <div className={`rounded-lg p-4 ${
                aiAnalysisResult.overall_condition === "good" 
                  ? "bg-emerald-50 border border-emerald-200"
                  : aiAnalysisResult.overall_condition === "worn"
                  ? "bg-amber-50 border border-amber-200"
                  : "bg-red-50 border border-red-200"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-700">Samlet tilstand</span>
                  <span className={`text-sm font-bold ${
                    aiAnalysisResult.overall_condition === "good" ? "text-emerald-700" :
                    aiAnalysisResult.overall_condition === "worn" ? "text-amber-700" : "text-red-700"
                  }`}>
                    {aiAnalysisResult.overall_condition === "good" ? "God" :
                     aiAnalysisResult.overall_condition === "worn" ? "Slitt" : "Må byttes"}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Minste mønsterdybde: <strong>{aiAnalysisResult.overall_tread_depth_mm} mm</strong>
                </p>
                {aiAnalysisResult.recommendation && (
                  <p className="text-xs text-slate-600 mt-2">
                    💡 {aiAnalysisResult.recommendation}
                  </p>
                )}
              </div>
              
              {/* Per-position results */}
              <div>
                <p className="text-xs font-medium text-slate-700 mb-2">Dekkposisjoner</p>
                <div className="grid grid-cols-2 gap-2">
                  {aiAnalysisResult.positions.map((pos) => (
                    <div 
                      key={pos.position}
                      className={`rounded-lg border p-3 ${
                        pos.condition === "good" ? "border-emerald-200 bg-emerald-50" :
                        pos.condition === "worn" ? "border-amber-200 bg-amber-50" :
                        "border-red-200 bg-red-50"
                      }`}
                    >
                      <p className="text-xs font-medium text-slate-700">
                        {pos.position === "FL" ? "Foran venstre" :
                         pos.position === "FR" ? "Foran høyre" :
                         pos.position === "RL" ? "Bak venstre" : "Bak høyre"}
                      </p>
                      <p className="text-lg font-bold text-slate-900">{pos.tread_depth_mm} mm</p>
                      <p className="text-[10px] text-slate-500">
                        Prod: {pos.production_week}/{pos.production_year}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Production info */}
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-medium text-slate-700 mb-2">Produksjonsinformasjon</p>
                <div className="bg-slate-50 rounded-lg p-3 text-xs">
                  <p className="text-slate-600">
                    Alle dekk er produsert i <strong>uke {aiAnalysisResult.positions[0].production_week}, {aiAnalysisResult.positions[0].production_year}</strong>
                  </p>
                  <p className="text-slate-500 mt-1">
                    Alder: {new Date().getFullYear() - aiAnalysisResult.positions[0].production_year} år
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowAIAnalysisModal(false)}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Lukk
              </button>
              <button
                type="button"
                onClick={() => {
                  // Update the selected set with AI analysis results
                  if (selectedSet && aiAnalysisResult) {
                    const updatedSet = {
                      ...selectedSet,
                      tread_depth_mm: aiAnalysisResult.overall_tread_depth_mm,
                      condition: aiAnalysisResult.overall_condition,
                      production_year: aiAnalysisResult.positions[0].production_year,
                      production_week: aiAnalysisResult.positions[0].production_week,
                    };
                    setTyreSets(prev => prev.map(s => s.id === selectedSet.id ? updatedSet : s));
                    setSelectedSet(updatedSet);
                  }
                  setShowAIAnalysisModal(false);
                }}
                className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Lagre resultater
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Tyre Set Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Nytt dekksett</h2>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Customer/Vehicle section */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Regnr *</label>
                  <input
                    type="text"
                    value={newForm.registration_number}
                    onChange={(e) => handleNewFormChange("registration_number", e.target.value.toUpperCase())}
                    placeholder="AB12345"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Kundenavn</label>
                  <input
                    type="text"
                    value={newForm.customer_name}
                    onChange={(e) => handleNewFormChange("customer_name", e.target.value)}
                    placeholder="Ola Nordmann"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Tyre details */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Dimensjon</label>
                  <input
                    type="text"
                    value={newForm.dimension}
                    onChange={(e) => handleNewFormChange("dimension", e.target.value)}
                    placeholder="225/45R17"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Merke</label>
                  <input
                    type="text"
                    value={newForm.brand}
                    onChange={(e) => handleNewFormChange("brand", e.target.value)}
                    placeholder="Continental"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Modell</label>
                  <input
                    type="text"
                    value={newForm.model}
                    onChange={(e) => handleNewFormChange("model", e.target.value)}
                    placeholder="WinterContact"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Season & Condition */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Sesong</label>
                  <select
                    value={newForm.season}
                    onChange={(e) => handleNewFormChange("season", e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="summer">Sommer</option>
                    <option value="winter">Vinter</option>
                    <option value="allseason">Helårs</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Tilstand</label>
                  <select
                    value={newForm.condition}
                    onChange={(e) => handleNewFormChange("condition", e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="good">God</option>
                    <option value="worn">Slitt</option>
                    <option value="bad">Dårlig</option>
                    <option value="replace">Må byttes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Mønsterdybde</label>
                  <input
                    type="number"
                    value={newForm.tread_depth_mm}
                    onChange={(e) => handleNewFormChange("tread_depth_mm", e.target.value)}
                    placeholder="6.5"
                    step="0.1"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Storage location */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Hylle</label>
                  <input
                    type="text"
                    value={newForm.shelf}
                    onChange={(e) => handleNewFormChange("shelf", e.target.value)}
                    placeholder="A"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Rad</label>
                  <input
                    type="text"
                    value={newForm.row}
                    onChange={(e) => handleNewFormChange("row", e.target.value)}
                    placeholder="3"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Posisjon</label>
                  <input
                    type="text"
                    value={newForm.position}
                    onChange={(e) => handleNewFormChange("position", e.target.value)}
                    placeholder="12"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Notater</label>
                <textarea
                  value={newForm.notes}
                  onChange={(e) => handleNewFormChange("notes", e.target.value)}
                  rows={2}
                  placeholder="Eventuelle notater..."
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Avbryt
              </button>
              <button
                type="button"
                onClick={handleSaveNewTyreSet}
                disabled={saving || !newForm.registration_number}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Lagrer..." : "Lagre dekksett"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && selectedSet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Historikk – {selectedSet.registration_number}
              </h2>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {MOCK_HISTORY.map(entry => (
                <div key={entry.id} className="flex gap-3 p-3 rounded-lg bg-slate-50">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-xs ${
                    entry.action === "stored" ? "bg-emerald-500" :
                    entry.action === "mounted" ? "bg-blue-500" :
                    entry.action === "inspected" ? "bg-amber-500" :
                    "bg-slate-400"
                  }`}>
                    {entry.action === "stored" ? "📥" :
                     entry.action === "mounted" ? "🔧" :
                     entry.action === "inspected" ? "🔍" : "📝"}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{getActionLabel(entry.action)}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(entry.date).toLocaleDateString("nb-NO")}
                      {entry.mileage && ` • ${entry.mileage.toLocaleString("nb-NO")} km`}
                      {entry.created_by && ` • ${entry.created_by}`}
                    </p>
                    {entry.notes && (
                      <p className="text-xs text-slate-600 mt-1">{entry.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Lukk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tyre Positions Modal */}
      {showTyrePositionsModal && selectedSet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Dekkposisjoner – {selectedSet.registration_number}
              </h2>
              <button
                type="button"
                onClick={() => setShowTyrePositionsModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            
            {/* Visual tyre diagram */}
            <div className="relative bg-slate-50 rounded-lg p-8 mb-4">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-slate-400">FRONT</div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-slate-400">BAK</div>
              
              <div className="grid grid-cols-2 gap-x-16 gap-y-8">
                {/* Front Left */}
                <div className="rounded-lg border-2 border-slate-300 bg-white p-3 text-center">
                  <p className="text-[10px] text-slate-500 uppercase">Foran venstre</p>
                  <p className="text-lg font-bold text-slate-900">{selectedSet.tread_depth_mm || "—"}</p>
                  <p className="text-[10px] text-slate-500">mm</p>
                  <span className={`inline-flex mt-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${getConditionColor(selectedSet.condition)}`}>
                    {getConditionLabel(selectedSet.condition)}
                  </span>
                </div>
                
                {/* Front Right */}
                <div className="rounded-lg border-2 border-slate-300 bg-white p-3 text-center">
                  <p className="text-[10px] text-slate-500 uppercase">Foran høyre</p>
                  <p className="text-lg font-bold text-slate-900">{selectedSet.tread_depth_mm || "—"}</p>
                  <p className="text-[10px] text-slate-500">mm</p>
                  <span className={`inline-flex mt-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${getConditionColor(selectedSet.condition)}`}>
                    {getConditionLabel(selectedSet.condition)}
                  </span>
                </div>
                
                {/* Rear Left */}
                <div className="rounded-lg border-2 border-slate-300 bg-white p-3 text-center">
                  <p className="text-[10px] text-slate-500 uppercase">Bak venstre</p>
                  <p className="text-lg font-bold text-slate-900">{selectedSet.tread_depth_mm || "—"}</p>
                  <p className="text-[10px] text-slate-500">mm</p>
                  <span className={`inline-flex mt-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${getConditionColor(selectedSet.condition)}`}>
                    {getConditionLabel(selectedSet.condition)}
                  </span>
                </div>
                
                {/* Rear Right */}
                <div className="rounded-lg border-2 border-slate-300 bg-white p-3 text-center">
                  <p className="text-[10px] text-slate-500 uppercase">Bak høyre</p>
                  <p className="text-lg font-bold text-slate-900">{selectedSet.tread_depth_mm || "—"}</p>
                  <p className="text-[10px] text-slate-500">mm</p>
                  <span className={`inline-flex mt-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${getConditionColor(selectedSet.condition)}`}>
                    {getConditionLabel(selectedSet.condition)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-slate-500 mb-4">
              <p><strong>Anbefalt mønsterdybde:</strong></p>
              <p>• Sommerdekk: min 3 mm</p>
              <p>• Vinterdekk: min 4 mm</p>
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowTyrePositionsModal(false)}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Lukk
              </button>
              <button
                type="button"
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Oppdater målinger
              </button>
            </div>
          </div>
        </div>
      )}
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
