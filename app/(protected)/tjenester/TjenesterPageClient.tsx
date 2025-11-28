"use client";

import { useEffect, useState, FormEvent, useMemo } from "react";
import type { Service, ServiceCategory } from "@/types/service";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000";
const ORG_ID =
  process.env.NEXT_PUBLIC_ORG_ID ?? "ae407558-7f44-40cb-8fe9-1d023212b926";

// Extended service type for the form
type ServiceFormData = {
  id: string | null;
  name: string;
  description: string;
  categoryId: string;
  durationMinutes: string;
  costPrice: string;
  price: string;
  offerPrice: string;
  isOnOffer: boolean;
  offerValidFrom: string;
  offerValidTo: string;
  allowOnlineBooking: boolean;
  requireDeposit: boolean;
  depositAmount: string;
  minBookingLeadHours: string;
  maxConcurrentBookings: string;
  displayOrder: string;
  showInPublicBooking: boolean;
  isActive: boolean;
};

const EMPTY_FORM: ServiceFormData = {
  id: null,
  name: "",
  description: "",
  categoryId: "",
  durationMinutes: "60",
  costPrice: "",
  price: "",
  offerPrice: "",
  isOnOffer: false,
  offerValidFrom: "",
  offerValidTo: "",
  allowOnlineBooking: true,
  requireDeposit: false,
  depositAmount: "",
  minBookingLeadHours: "24",
  maxConcurrentBookings: "1",
  displayOrder: "0",
  showInPublicBooking: true,
  isActive: true,
};

// Mock categories for demo
const MOCK_CATEGORIES: ServiceCategory[] = [
  { id: "cat-1", orgId: ORG_ID, name: "Coating & Polering", description: "Beskyttende coating og polering", position: 1, isActive: true },
  { id: "cat-2", orgId: ORG_ID, name: "Innvendig", description: "Innvendig rengjøring og vedlikehold", position: 2, isActive: true },
  { id: "cat-3", orgId: ORG_ID, name: "Utvendig", description: "Utvendig vask og behandling", position: 3, isActive: true },
  { id: "cat-4", orgId: ORG_ID, name: "Dekk & Felg", description: "Dekkhotell og felgservice", position: 4, isActive: true },
];

// Mock services for demo
const MOCK_SERVICES: Service[] = [
  {
    id: "svc-1",
    orgId: ORG_ID,
    categoryId: "cat-1",
    name: "Keramisk Coating - Full Bil",
    description: "Komplett keramisk coating med 5 års garanti",
    durationMinutes: 480,
    costPrice: 2500,
    price: 12995,
    offerPrice: 9995,
    isOnOffer: true,
    offerValidFrom: "2024-01-01",
    offerValidTo: "2024-12-31",
    allowOnlineBooking: true,
    requireDeposit: true,
    depositAmount: 2000,
    minBookingLeadHours: 48,
    maxConcurrentBookings: 1,
    displayOrder: 1,
    showInPublicBooking: true,
    isActive: true,
  },
  {
    id: "svc-2",
    orgId: ORG_ID,
    categoryId: "cat-1",
    name: "Polering - 1-stegs",
    description: "Enkel polering for å fjerne mindre riper",
    durationMinutes: 180,
    costPrice: 300,
    price: 2995,
    offerPrice: null,
    isOnOffer: false,
    offerValidFrom: null,
    offerValidTo: null,
    allowOnlineBooking: true,
    requireDeposit: false,
    depositAmount: null,
    minBookingLeadHours: 24,
    maxConcurrentBookings: 2,
    displayOrder: 2,
    showInPublicBooking: true,
    isActive: true,
  },
  {
    id: "svc-3",
    orgId: ORG_ID,
    categoryId: "cat-2",
    name: "Innvendig Fullrens",
    description: "Komplett rengjøring av interiør inkl. støvsuging og dampvask",
    durationMinutes: 120,
    costPrice: 200,
    price: 1495,
    offerPrice: 1195,
    isOnOffer: true,
    offerValidFrom: null,
    offerValidTo: null,
    allowOnlineBooking: true,
    requireDeposit: false,
    depositAmount: null,
    minBookingLeadHours: 12,
    maxConcurrentBookings: 3,
    displayOrder: 1,
    showInPublicBooking: true,
    isActive: true,
  },
  {
    id: "svc-4",
    orgId: ORG_ID,
    categoryId: "cat-3",
    name: "Håndvask Premium",
    description: "Skånsom håndvask med premium produkter",
    durationMinutes: 60,
    costPrice: 50,
    price: 599,
    offerPrice: null,
    isOnOffer: false,
    offerValidFrom: null,
    offerValidTo: null,
    allowOnlineBooking: true,
    requireDeposit: false,
    depositAmount: null,
    minBookingLeadHours: 2,
    maxConcurrentBookings: 5,
    displayOrder: 1,
    showInPublicBooking: true,
    isActive: true,
  },
  {
    id: "svc-5",
    orgId: ORG_ID,
    categoryId: "cat-4",
    name: "Dekkhotell - Sesong",
    description: "Oppbevaring av 4 dekk/hjul gjennom sesongen",
    durationMinutes: 30,
    costPrice: 100,
    price: 1495,
    offerPrice: null,
    isOnOffer: false,
    offerValidFrom: null,
    offerValidTo: null,
    allowOnlineBooking: true,
    requireDeposit: false,
    depositAmount: null,
    minBookingLeadHours: 24,
    maxConcurrentBookings: 10,
    displayOrder: 1,
    showInPublicBooking: true,
    isActive: true,
  },
];

type ActiveTab = "services" | "categories" | "settings";

export default function TjenesterPageClient() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("services");

  // Data
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);

  // Form state
  const [formData, setFormData] = useState<ServiceFormData>(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filters
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Category form
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "", position: "" });
  const [savingCategory, setSavingCategory] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        // In production, fetch from API
        // For now, use mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        setCategories(MOCK_CATEGORIES);
        setServices(MOCK_SERVICES);
      } catch (err) {
        console.error("Feil ved lasting:", err);
        setError("Kunne ikke laste tjenester og kategorier.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Filter services
  const filteredServices = useMemo(() => {
    let result = services;
    
    if (filterCategory !== "all") {
      result = result.filter(s => s.categoryId === filterCategory);
    }
    
    if (filterStatus === "active") {
      result = result.filter(s => s.isActive);
    } else if (filterStatus === "inactive") {
      result = result.filter(s => !s.isActive);
    } else if (filterStatus === "offer") {
      result = result.filter(s => s.isOnOffer);
    }
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(q) || 
        (s.description?.toLowerCase().includes(q))
      );
    }
    
    return result.sort((a, b) => a.displayOrder - b.displayOrder);
  }, [services, filterCategory, filterStatus, searchQuery]);

  function resetForm() {
    setFormData(EMPTY_FORM);
    setShowForm(false);
  }

  function editService(service: Service) {
    setFormData({
      id: service.id,
      name: service.name,
      description: service.description ?? "",
      categoryId: service.categoryId ?? "",
      durationMinutes: String(service.durationMinutes ?? 60),
      costPrice: service.costPrice != null ? String(service.costPrice) : "",
      price: service.price != null ? String(service.price) : "",
      offerPrice: service.offerPrice != null ? String(service.offerPrice) : "",
      isOnOffer: service.isOnOffer ?? false,
      offerValidFrom: service.offerValidFrom ?? "",
      offerValidTo: service.offerValidTo ?? "",
      allowOnlineBooking: service.allowOnlineBooking ?? true,
      requireDeposit: service.requireDeposit ?? false,
      depositAmount: service.depositAmount != null ? String(service.depositAmount) : "",
      minBookingLeadHours: String(service.minBookingLeadHours ?? 24),
      maxConcurrentBookings: String(service.maxConcurrentBookings ?? 1),
      displayOrder: String(service.displayOrder ?? 0),
      showInPublicBooking: service.showInPublicBooking ?? true,
      isActive: service.isActive ?? true,
    });
    setShowForm(true);
  }

  async function handleSaveService(e: FormEvent) {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const serviceData: Service = {
        id: formData.id ?? `svc-${Date.now()}`,
        orgId: ORG_ID,
        categoryId: formData.categoryId || null,
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        durationMinutes: parseInt(formData.durationMinutes) || 60,
        costPrice: formData.costPrice ? parseFloat(formData.costPrice) : null,
        price: formData.price ? parseFloat(formData.price) : null,
        offerPrice: formData.offerPrice ? parseFloat(formData.offerPrice) : null,
        isOnOffer: formData.isOnOffer,
        offerValidFrom: formData.offerValidFrom || null,
        offerValidTo: formData.offerValidTo || null,
        allowOnlineBooking: formData.allowOnlineBooking,
        requireDeposit: formData.requireDeposit,
        depositAmount: formData.depositAmount ? parseFloat(formData.depositAmount) : null,
        minBookingLeadHours: parseInt(formData.minBookingLeadHours) || 24,
        maxConcurrentBookings: parseInt(formData.maxConcurrentBookings) || 1,
        displayOrder: parseInt(formData.displayOrder) || 0,
        showInPublicBooking: formData.showInPublicBooking,
        isActive: formData.isActive,
      };

      // Simulate API save
      await new Promise(resolve => setTimeout(resolve, 500));

      if (formData.id) {
        setServices(prev => prev.map(s => s.id === serviceData.id ? serviceData : s));
        setSuccessMessage(`Tjenesten "${serviceData.name}" ble oppdatert.`);
      } else {
        setServices(prev => [...prev, serviceData]);
        setSuccessMessage(`Tjenesten "${serviceData.name}" ble opprettet.`);
      }

      resetForm();
    } catch (err) {
      console.error("Feil ved lagring:", err);
      setError("Kunne ikke lagre tjenesten. Prøv igjen.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteService(serviceId: string) {
    if (!window.confirm("Er du sikker på at du vil slette denne tjenesten?")) return;

    setDeletingId(serviceId);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setServices(prev => prev.filter(s => s.id !== serviceId));
      setSuccessMessage("Tjenesten ble slettet.");
    } catch (err) {
      console.error("Feil ved sletting:", err);
      setError("Kunne ikke slette tjenesten.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSaveCategory(e: FormEvent) {
    e.preventDefault();
    if (!categoryForm.name.trim()) return;

    setSavingCategory(true);
    setError(null);

    try {
      const newCategory: ServiceCategory = {
        id: `cat-${Date.now()}`,
        orgId: ORG_ID,
        name: categoryForm.name.trim(),
        description: categoryForm.description.trim() || null,
        position: parseInt(categoryForm.position) || categories.length + 1,
        isActive: true,
      };

      await new Promise(resolve => setTimeout(resolve, 300));
      setCategories(prev => [...prev, newCategory].sort((a, b) => a.position - b.position));
      setCategoryForm({ name: "", description: "", position: "" });
      setSuccessMessage(`Kategorien "${newCategory.name}" ble opprettet.`);
    } catch (err) {
      console.error("Feil ved lagring av kategori:", err);
      setError("Kunne ikke lagre kategorien.");
    } finally {
      setSavingCategory(false);
    }
  }

  function getCategoryName(categoryId: string | null): string {
    if (!categoryId) return "Ingen kategori";
    return categories.find(c => c.id === categoryId)?.name ?? "Ukjent";
  }

  function formatPrice(price: number | null): string {
    if (price === null) return "–";
    return `${price.toLocaleString("nb-NO")} kr`;
  }

  function calculateMargin(cost: number | null, price: number | null): string {
    if (cost === null || price === null || cost === 0 || price === 0) return "–";
    const margin = ((price - cost) / price) * 100;
    return `${margin.toFixed(1)}%`;
  }

  if (loading) {
    return (
      <div className="h-full w-full overflow-y-auto bg-slate-50 px-6 py-6">
        <div className="mx-auto max-w-7xl text-sm text-slate-500">
          Laster tjenester og kategorier …
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto bg-slate-50 px-6 py-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              DRIFT · TJENESTER
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
              Tjenester & Prissetting
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Administrer tjenester med kostpris, utsalgspris, tilbud og online booking-innstillinger.
            </p>
          </div>
          <button
            type="button"
            onClick={() => { resetForm(); setShowForm(true); }}
            className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            + Ny tjeneste
          </button>
        </header>

        {/* Messages */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 rounded-lg bg-slate-200 p-1">
          {[
            { key: "services", label: "Tjenester" },
            { key: "categories", label: "Kategorier" },
            { key: "settings", label: "Innstillinger" },
          ].map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as ActiveTab)}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
                activeTab === tab.key
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Services Tab */}
        {activeTab === "services" && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Søk etter tjeneste..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="all">Alle kategorier</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="all">Alle statuser</option>
                <option value="active">Aktive</option>
                <option value="inactive">Inaktive</option>
                <option value="offer">På tilbud</option>
              </select>
            </div>

            {/* Services Grid */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredServices.map(service => {
                const isOnValidOffer = service.isOnOffer && service.offerPrice !== null;
                const displayPrice = isOnValidOffer ? service.offerPrice : service.price;
                
                return (
                  <div
                    key={service.id}
                    className={`relative rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md ${
                      !service.isActive ? "opacity-60" : ""
                    } ${isOnValidOffer ? "border-amber-300" : "border-slate-200"}`}
                  >
                    {/* Offer badge */}
                    {isOnValidOffer && (
                      <div className="absolute -top-2 -right-2 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">
                        TILBUD
                      </div>
                    )}
                    
                    {/* Category tag */}
                    <div className="mb-2">
                      <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                        {getCategoryName(service.categoryId)}
                      </span>
                    </div>
                    
                    {/* Service name & description */}
                    <h3 className="font-semibold text-slate-900">{service.name}</h3>
                    {service.description && (
                      <p className="mt-1 text-xs text-slate-500 line-clamp-2">{service.description}</p>
                    )}
                    
                    {/* Pricing */}
                    <div className="mt-3 flex items-end gap-2">
                      <span className="text-xl font-bold text-slate-900">
                        {formatPrice(displayPrice)}
                      </span>
                      {isOnValidOffer && service.price !== null && (
                        <span className="text-sm text-slate-400 line-through">
                          {formatPrice(service.price)}
                        </span>
                      )}
                    </div>
                    
                    {/* Meta info */}
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        ⏱ {service.durationMinutes} min
                      </span>
                      {service.costPrice !== null && (
                        <span className="flex items-center gap-1">
                          💰 Margin: {calculateMargin(service.costPrice, displayPrice)}
                        </span>
                      )}
                      {service.allowOnlineBooking && (
                        <span className="flex items-center gap-1 text-emerald-600">
                          🌐 Online
                        </span>
                      )}
                    </div>
                    
                    {/* Status badges */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        service.isActive 
                          ? "bg-emerald-100 text-emerald-700" 
                          : "bg-slate-100 text-slate-500"
                      }`}>
                        {service.isActive ? "Aktiv" : "Inaktiv"}
                      </span>
                      {service.showInPublicBooking && (
                        <span className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                          Offentlig
                        </span>
                      )}
                      {service.requireDeposit && (
                        <span className="inline-flex rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-medium text-purple-700">
                          Depositum
                        </span>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                      <button
                        type="button"
                        onClick={() => editService(service)}
                        className="flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Rediger
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteService(service.id)}
                        disabled={deletingId === service.id}
                        className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        {deletingId === service.id ? "..." : "Slett"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredServices.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <p className="text-sm text-slate-500">
                  {services.length === 0 
                    ? "Ingen tjenester er opprettet ennå. Klikk «Ny tjeneste» for å komme i gang." 
                    : "Ingen tjenester matcher filteret ditt."}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div className="grid gap-6 lg:grid-cols-[1fr,380px]">
            {/* Category list */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h2 className="mb-4 font-semibold text-slate-900">Eksisterende kategorier</h2>
              {categories.length === 0 ? (
                <p className="text-sm text-slate-500">Ingen kategorier opprettet.</p>
              ) : (
                <div className="space-y-2">
                  {categories.map(cat => {
                    const serviceCount = services.filter(s => s.categoryId === cat.id).length;
                    return (
                      <div
                        key={cat.id}
                        className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
                      >
                        <div>
                          <div className="font-medium text-slate-900">{cat.name}</div>
                          <div className="text-xs text-slate-500">
                            {cat.description} • {serviceCount} tjenester • Posisjon: {cat.position}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="text-xs text-red-600 hover:text-red-800"
                          onClick={() => {
                            if (window.confirm("Slette kategori?")) {
                              setCategories(prev => prev.filter(c => c.id !== cat.id));
                            }
                          }}
                        >
                          Slett
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* New category form */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h2 className="mb-4 font-semibold text-slate-900">Ny kategori</h2>
              <form onSubmit={handleSaveCategory} className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">Navn</label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={e => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">Beskrivelse</label>
                  <input
                    type="text"
                    value={categoryForm.description}
                    onChange={e => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">Posisjon</label>
                  <input
                    type="number"
                    value={categoryForm.position}
                    onChange={e => setCategoryForm(prev => ({ ...prev, position: e.target.value }))}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    placeholder="Lavere = høyere opp"
                  />
                </div>
                <button
                  type="submit"
                  disabled={savingCategory}
                  className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  {savingCategory ? "Lagrer..." : "Legg til kategori"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 font-semibold text-slate-900">Globale tjeneste-innstillinger</h2>
            <p className="mb-6 text-sm text-slate-500">
              Disse innstillingene gjelder som standard for alle nye tjenester. Hver tjeneste kan overstyre disse.
            </p>
            
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Standard varighet (minutter)
                  </label>
                  <input
                    type="number"
                    defaultValue={60}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Minimum bestillingstid (timer)
                  </label>
                  <input
                    type="number"
                    defaultValue={24}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
              
              <div className="space-y-3 border-t border-slate-200 pt-4">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300" />
                  <span className="text-sm text-slate-700">Tillat online booking som standard</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="rounded border-slate-300" />
                  <span className="text-sm text-slate-700">Krev depositum som standard</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300" />
                  <span className="text-sm text-slate-700">Vis i offentlig booking som standard</span>
                </label>
              </div>
              
              <div className="border-t border-slate-200 pt-4">
                <button
                  type="button"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Lagre innstillinger
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Service Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  {formData.id ? "Rediger tjeneste" : "Ny tjeneste"}
                </h2>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveService} className="space-y-6">
                {/* Basic info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-700 border-b border-slate-200 pb-2">
                    Grunnleggende informasjon
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700">Navn *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700">Kategori</label>
                      <select
                        value={formData.categoryId}
                        onChange={e => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                      >
                        <option value="">Ingen kategori</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">Beskrivelse</label>
                    <textarea
                      value={formData.description}
                      onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={2}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700">Varighet (minutter)</label>
                      <input
                        type="number"
                        value={formData.durationMinutes}
                        onChange={e => setFormData(prev => ({ ...prev, durationMinutes: e.target.value }))}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700">Sortering</label>
                      <input
                        type="number"
                        value={formData.displayOrder}
                        onChange={e => setFormData(prev => ({ ...prev, displayOrder: e.target.value }))}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-700 border-b border-slate-200 pb-2">
                    💰 Prissetting
                  </h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700">Kostpris (kr)</label>
                      <input
                        type="number"
                        value={formData.costPrice}
                        onChange={e => setFormData(prev => ({ ...prev, costPrice: e.target.value }))}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                        placeholder="Innkjøp/kost"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700">Utsalgspris (kr) *</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                        placeholder="Normal pris"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700">Tilbudspris (kr)</label>
                      <input
                        type="number"
                        value={formData.offerPrice}
                        onChange={e => setFormData(prev => ({ ...prev, offerPrice: e.target.value }))}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                        placeholder="Rabattert pris"
                        disabled={!formData.isOnOffer}
                      />
                    </div>
                  </div>
                  
                  {/* Offer toggle */}
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.isOnOffer}
                        onChange={e => setFormData(prev => ({ ...prev, isOnOffer: e.target.checked }))}
                        className="rounded border-slate-300"
                      />
                      <span className="text-sm font-medium text-amber-800">🏷️ Sett på tilbud</span>
                    </label>
                    
                    {formData.isOnOffer && (
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-amber-700">Gyldig fra</label>
                          <input
                            type="date"
                            value={formData.offerValidFrom}
                            onChange={e => setFormData(prev => ({ ...prev, offerValidFrom: e.target.value }))}
                            className="w-full rounded-md border border-amber-300 bg-white px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-amber-700">Gyldig til</label>
                          <input
                            type="date"
                            value={formData.offerValidTo}
                            onChange={e => setFormData(prev => ({ ...prev, offerValidTo: e.target.value }))}
                            className="w-full rounded-md border border-amber-300 bg-white px-3 py-2 text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Margin display */}
                  {formData.costPrice && formData.price && (
                    <div className="rounded-lg bg-slate-100 p-3 text-sm">
                      <strong>Margin:</strong>{" "}
                      {calculateMargin(
                        parseFloat(formData.costPrice),
                        formData.isOnOffer && formData.offerPrice 
                          ? parseFloat(formData.offerPrice) 
                          : parseFloat(formData.price)
                      )}
                    </div>
                  )}
                </div>

                {/* Online booking settings */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-700 border-b border-slate-200 pb-2">
                    🌐 Online booking
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.allowOnlineBooking}
                        onChange={e => setFormData(prev => ({ ...prev, allowOnlineBooking: e.target.checked }))}
                        className="rounded border-slate-300"
                      />
                      <span className="text-sm text-slate-700">Tillat online booking</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.showInPublicBooking}
                        onChange={e => setFormData(prev => ({ ...prev, showInPublicBooking: e.target.checked }))}
                        className="rounded border-slate-300"
                      />
                      <span className="text-sm text-slate-700">Vis i offentlig bookingside</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.requireDeposit}
                        onChange={e => setFormData(prev => ({ ...prev, requireDeposit: e.target.checked }))}
                        className="rounded border-slate-300"
                      />
                      <span className="text-sm text-slate-700">Krev depositum ved booking</span>
                    </label>
                  </div>
                  
                  {formData.requireDeposit && (
                    <div className="max-w-xs">
                      <label className="mb-1 block text-xs font-medium text-slate-700">Depositumsbeløp (kr)</label>
                      <input
                        type="number"
                        value={formData.depositAmount}
                        onChange={e => setFormData(prev => ({ ...prev, depositAmount: e.target.value }))}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                  )}
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700">
                        Min. bestillingstid (timer)
                      </label>
                      <input
                        type="number"
                        value={formData.minBookingLeadHours}
                        onChange={e => setFormData(prev => ({ ...prev, minBookingLeadHours: e.target.value }))}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700">
                        Maks samtidige bookinger
                      </label>
                      <input
                        type="number"
                        value={formData.maxConcurrentBookings}
                        onChange={e => setFormData(prev => ({ ...prev, maxConcurrentBookings: e.target.value }))}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-700 border-b border-slate-200 pb-2">
                    Status
                  </h3>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={e => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="rounded border-slate-300"
                    />
                    <span className="text-sm text-slate-700">Tjenesten er aktiv</span>
                  </label>
                </div>

                {/* Actions */}
                <div className="flex gap-3 border-t border-slate-200 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Avbryt
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                  >
                    {saving ? "Lagrer..." : formData.id ? "Oppdater tjeneste" : "Opprett tjeneste"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
