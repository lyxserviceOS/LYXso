"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AIIntegrationPanel from "@/components/ai/AIIntegrationPanel";
import CrossNavigation, { navigationMaps } from "@/components/CrossNavigation";
import {
  fetchBookingDashboardData,
  fetchBookings,
  createBooking,
  updateBooking,
} from "@/repos/bookingsRepo";
import type {
  Booking,
  BookingStatus,
  Employee,
  Service,
  BookingCustomerSummary,
} from "@/types/booking";
import type { Location, Resource, ResourceType } from "@/types/location";
import { WeekCalendar } from "./components/WeekCalendar";
import { BookingModal, type BookingFormData } from "@/components/booking/BookingModal";
import { BookingDetailPanel } from "@/components/booking/BookingDetailPanel";

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Venter",
  confirmed: "Bekreftet",
  in_progress: "Pågår",
  completed: "Fullført",
  cancelled: "Kansellert",
  no_show: "Ikke møtt",
};

type ViewMode = "list" | "day" | "week" | "resource";

// Mock locations and resources for demo
const MOCK_LOCATIONS: Location[] = [
  {
    id: "loc-1",
    org_id: "org-1",
    name: "Hovedverksted",
    address: "Industriveien 42",
    city: "Oslo",
    postal_code: "0484",
    country: "NO",
    phone: "+47 22 33 44 55",
    email: "verksted@lyxso.no",
    operating_hours: {
      monday: { open: "08:00", close: "17:00" },
      tuesday: { open: "08:00", close: "17:00" },
      wednesday: { open: "08:00", close: "17:00" },
      thursday: { open: "08:00", close: "17:00" },
      friday: { open: "08:00", close: "16:00" },
    },
    is_active: true,
    is_headquarters: true,
    timezone: "Europe/Oslo",
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "loc-2",
    org_id: "org-1",
    name: "Avdeling Sør",
    address: "Sørlandsgata 15",
    city: "Kristiansand",
    postal_code: "4608",
    country: "NO",
    phone: "+47 38 00 11 22",
    email: "sor@lyxso.no",
    operating_hours: {
      monday: { open: "09:00", close: "17:00" },
      tuesday: { open: "09:00", close: "17:00" },
      wednesday: { open: "09:00", close: "17:00" },
      thursday: { open: "09:00", close: "17:00" },
      friday: { open: "09:00", close: "15:00" },
    },
    is_active: true,
    is_headquarters: false,
    timezone: "Europe/Oslo",
    created_at: "2024-03-01",
    updated_at: "2024-03-01",
  },
];

const MOCK_RESOURCES: Resource[] = [
  {
    id: "res-1",
    org_id: "org-1",
    location_id: "loc-1",
    name: "Løftebukk 1",
    description: "Hovedløftebukk for større kjøretøy",
    type: "lift",
    max_concurrent_bookings: 1,
    is_active: true,
    color: "#3B82F6",
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "res-2",
    org_id: "org-1",
    location_id: "loc-1",
    name: "Løftebukk 2",
    description: "Sekundær løftebukk",
    type: "lift",
    max_concurrent_bookings: 1,
    is_active: true,
    color: "#10B981",
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "res-3",
    org_id: "org-1",
    location_id: "loc-1",
    name: "Poleringsbås",
    description: "Dedikert rom for polering og coating",
    type: "bay",
    max_concurrent_bookings: 1,
    is_active: true,
    color: "#F59E0B",
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "res-4",
    org_id: "org-1",
    location_id: "loc-1",
    name: "PPF-rom",
    description: "Spesialrom for PPF-installasjon",
    type: "room",
    max_concurrent_bookings: 1,
    is_active: true,
    color: "#8B5CF6",
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: "res-5",
    org_id: "org-1",
    location_id: "loc-2",
    name: "Løftebukk Sør",
    description: "Hovedløftebukk ved Avdeling Sør",
    type: "lift",
    max_concurrent_bookings: 1,
    is_active: true,
    color: "#EC4899",
    created_at: "2024-03-01",
    updated_at: "2024-03-01",
  },
];

const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  bay: "Bås",
  lift: "Løftebukk",
  room: "Rom",
  equipment: "Utstyr",
  other: "Annet",
};

function formatDateTime(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("no-NO", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTime(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleTimeString("no-NO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getDateKey(value: string | null): string {
  if (!value) return "ukjent";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "ukjent";
  // YYYY-MM-DD
  return d.toISOString().slice(0, 10);
}

function formatDateLabel(value: string | null): string {
  if (!value) return "Ukjent dato";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Ukjent dato";
  return d.toLocaleDateString("no-NO", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
}

// Skjema-state for ny booking
type NewBookingForm = {
  customerName: string;
  customerId: string; // "none" eller faktisk id
  serviceName: string;
  employeeId: string; // "none" eller faktisk id
  locationId: string; // "all" eller faktisk id
  resourceId: string; // "none" eller faktisk id
  startTime: string; // "2025-11-25T10:00"
  endTime: string;
  notes: string;
  status: BookingStatus;
};

const EMPTY_NEW_BOOKING: NewBookingForm = {
  customerName: "",
  customerId: "none",
  serviceName: "",
  employeeId: "none",
  locationId: "all",
  resourceId: "none",
  startTime: "",
  endTime: "",
  notes: "",
  status: "confirmed",
};

// Location Form Modal Component
function LocationFormModal({
  location,
  isOpen,
  onClose,
  onSave,
  saving,
}: {
  location: Location | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Location>) => void;
  saving: boolean;
}) {
  const [formData, setFormData] = useState({
    name: location?.name || '',
    code: location?.code || '',
    address: location?.address || '',
    postal_code: location?.postal_code || '',
    city: location?.city || '',
    country: location?.country || 'NO',
    phone: location?.phone || '',
    email: location?.email || '',
    timezone: location?.timezone || 'Europe/Oslo',
    is_active: location?.is_active ?? true,
    is_headquarters: location?.is_headquarters ?? false,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-auto rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {location ? 'Rediger lokasjon' : 'Ny lokasjon'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          onSave(formData);
        }} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Navn *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Kode
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="OSL-01"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Adresse
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Postnummer
              </label>
              <input
                type="text"
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                By
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Land
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Telefon
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                E-post
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Tidssone
            </label>
            <select
              value={formData.timezone}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="Europe/Oslo">Europe/Oslo</option>
              <option value="Europe/Stockholm">Europe/Stockholm</option>
              <option value="Europe/Copenhagen">Europe/Copenhagen</option>
            </select>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded border-slate-300"
              />
              <span className="text-sm text-slate-700">Aktiv</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_headquarters}
                onChange={(e) => setFormData({ ...formData, is_headquarters: e.target.checked })}
                className="rounded border-slate-300"
              />
              <span className="text-sm text-slate-700">Hovedlokasjon</span>
            </label>
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-300"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Lagrer...' : 'Lagre'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Resource Form Modal Component
function ResourceFormModal({
  resource,
  locationId,
  locations,
  isOpen,
  onClose,
  onSave,
  saving,
}: {
  resource: Resource | null;
  locationId: string | null;
  locations: Location[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Resource>) => void;
  saving: boolean;
}) {
  const [formData, setFormData] = useState({
    name: resource?.name || '',
    description: resource?.description || '',
    type: (resource?.type || 'bay') as ResourceType,
    location_id: resource?.location_id || locationId || '',
    max_concurrent_bookings: resource?.max_concurrent_bookings || 1,
    is_active: resource?.is_active ?? true,
    color: resource?.color || '#3B82F6',
  });

  if (!isOpen) return null;

  const resourceTypes: { value: ResourceType; label: string }[] = [
    { value: 'bay', label: 'Verkstedbukk' },
    { value: 'lift', label: 'Løftebukk' },
    { value: 'room', label: 'Rom' },
    { value: 'equipment', label: 'Utstyr' },
    { value: 'other', label: 'Annet' },
  ];

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-auto rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {resource ? 'Rediger ressurs' : 'Ny ressurs'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          onSave(formData);
        }} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Navn *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Beskrivelse
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Type *
            </label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as ResourceType })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              {resourceTypes.map(rt => (
                <option key={rt.value} value={rt.value}>{rt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Lokasjon *
            </label>
            <select
              required
              value={formData.location_id}
              onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">Velg lokasjon</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Maks samtidige bookinger
            </label>
            <input
              type="number"
              min="1"
              value={formData.max_concurrent_bookings}
              onChange={(e) => setFormData({ ...formData, max_concurrent_bookings: parseInt(e.target.value) })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Farge (for kalendervisning)
            </label>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full h-10 rounded-md border border-slate-300"
            />
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded border-slate-300"
              />
              <span className="text-sm text-slate-700">Aktiv</span>
            </label>
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-300"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Lagrer...' : 'Lagre'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function BookingPageClient() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [customers, setCustomers] = useState<BookingCustomerSummary[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  const [locations] = useState<Location[]>(MOCK_LOCATIONS);
  const [resources] = useState<Resource[]>(MOCK_RESOURCES);
  // Module 18: Locations and Resources
  const [locations, setLocations] = useState<Location[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | "all">(
    "all",
  );
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | "all">(
    "all",
  );
  const [selectedLocationId, setSelectedLocationId] = useState<string | "all">(
    "all",
  );
  const [selectedResourceId, setSelectedResourceId] = useState<string | "all">(
    "all",
  );
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );

  const [viewMode, setViewMode] = useState<ViewMode>("week");
  
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  
  
  // Location/Resource edit modals
  const [showEditLocationModal, setShowEditLocationModal] = useState(false);
  const [showNewLocationModal, setShowNewLocationModal] = useState(false);
  const [showEditResourceModal, setShowEditResourceModal] = useState(false);
  const [showNewResourceModal, setShowNewResourceModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [selectedLocationForResource, setSelectedLocationForResource] = useState<string | null>(null);
  const [savingLocation, setSavingLocation] = useState(false);
  const [savingResource, setSavingResource] = useState(false);

  // Ny booking-modal state
  const [showNewModal, setShowNewModal] = useState(false);
  const [newForm, setNewForm] = useState<NewBookingForm>(EMPTY_NEW_BOOKING);
  const [savingNew, setSavingNew] = useState(false);
  const [newError, setNewError] = useState<string | null>(null);

  // Status-oppdatering på valgt booking
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  const filteredResources = useMemo(() => {
    if (selectedLocationId === "all") return resources;
    return resources.filter(r => r.location_id === selectedLocationId && r.is_active);
  }, [resources, selectedLocationId]);

  // -----------------------------
  // Last inn data ved første render
  // -----------------------------
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchBookingDashboardData();
        setServices(data.services ?? []);
        setEmployees(data.employees ?? []);
        setCustomers(data.customers ?? []);
        setBookings(data.bookings ?? []);
      } catch (err) {
        console.error("[BookingPageClient] load error", err);
        setError("Kunne ikke hente booking-data.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // Load locations and resources
  useEffect(() => {
    async function loadLocationsAndResources() {
      setLocationsLoading(true);
      try {
        const [locationsRes, resourcesRes] = await Promise.all([
          fetch('/api/locations'),
          fetch('/api/resources')
        ]);

        if (locationsRes.ok) {
          const locData = await locationsRes.json();
          setLocations(locData.locations || []);
        }

        if (resourcesRes.ok) {
          const resData = await resourcesRes.json();
          setResources(resData.resources || []);
        }
      } catch (err) {
        console.error("[BookingPageClient] load locations/resources error", err);
      } finally {
        setLocationsLoading(false);
      }
    }

    loadLocationsAndResources();
  }, []);

  // Refresh locations and resources
  async function handleRefreshLocations() {
    setLocationsLoading(true);
    try {
      const [locationsRes, resourcesRes] = await Promise.all([
        fetch('/api/locations'),
        fetch('/api/resources')
      ]);

      if (locationsRes.ok) {
        const locData = await locationsRes.json();
        setLocations(locData.locations || []);
      }

      if (resourcesRes.ok) {
        const resData = await resourcesRes.json();
        setResources(resData.resources || []);
      }
    } catch (err) {
      console.error("[BookingPageClient] refresh locations/resources error", err);
    } finally {
      setLocationsLoading(false);
    }
  }

  // Delete location handler
  async function handleDeleteLocation(locationId: string) {
    if (!confirm('Er du sikker på at du vil slette denne lokasjonen?')) {
      return;
    }

    try {
      const res = await fetch(`/api/locations/${locationId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Kunne ikke slette lokasjon');
        return;
      }

      // Refresh locations list
      await handleRefreshLocations();
    } catch (err) {
      console.error('Delete location error:', err);
      alert('Feil ved sletting av lokasjon');
    }
  }

  // Delete resource handler
  async function handleDeleteResource(resourceId: string) {
    if (!confirm('Er du sikker på at du vil slette denne ressursen?')) {
      return;
    }

    try {
      const res = await fetch(`/api/resources/${resourceId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Kunne ikke slette ressurs');
        return;
      }

      // Refresh resources list
      await handleRefreshLocations();
    } catch (err) {
      console.error('Delete resource error:', err);
      alert('Feil ved sletting av ressurs');
    }
  }

  // Open edit location modal
  function handleEditLocation(location: Location) {
    setEditingLocation(location);
    setShowEditLocationModal(true);
  }

  // Open new location modal
  function handleOpenNewLocation() {
    setShowNewLocationModal(true);
  }

  // Open edit resource modal
  function handleEditResource(resource: Resource) {
    setEditingResource(resource);
    setShowEditResourceModal(true);
  }

  // Open new resource modal
  function handleOpenNewResource(locationId: string) {
    setSelectedLocationForResource(locationId);
    setShowNewResourceModal(true);
  }

  // Save location (create or update)
  async function handleSaveLocation(locationData: Partial<Location>) {
    setSavingLocation(true);
    try {
      const isEditing = !!editingLocation;
      const url = isEditing ? `/api/locations/${editingLocation.id}` : '/api/locations';
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(locationData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Kunne ikke lagre lokasjon');
        return;
      }

      // Close modal and refresh
      setShowEditLocationModal(false);
      setShowNewLocationModal(false);
      setEditingLocation(null);
      await handleRefreshLocations();
    } catch (err) {
      console.error('Save location error:', err);
      alert('Feil ved lagring av lokasjon');
    } finally {
      setSavingLocation(false);
    }
  }

  // Save resource (create or update)
  async function handleSaveResource(resourceData: Partial<Resource>) {
    setSavingResource(true);
    try {
      const isEditing = !!editingResource;
      const url = isEditing ? `/api/resources/${editingResource.id}` : '/api/resources';
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resourceData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Kunne ikke lagre ressurs');
        return;
      }

      // Close modal and refresh
      setShowEditResourceModal(false);
      setShowNewResourceModal(false);
      setEditingResource(null);
      setSelectedLocationForResource(null);
      await handleRefreshLocations();
    } catch (err) {
      console.error('Save resource error:', err);
      alert('Feil ved lagring av ressurs');
    } finally {
      setSavingResource(false);
    }
  }



  // Enkel “refresh” som kun henter bookinger på nytt
  async function handleRefreshBookings() {
    setRefreshing(true);
    setError(null);
    try {
      const fresh = await fetchBookings();
      setBookings(fresh ?? []);
    } catch (err) {
      console.error("[BookingPageClient] refresh error", err);
      setError("Kunne ikke oppdatere booking-listen.");
    } finally {
      setRefreshing(false);
    }
  }

  // Åpne modal for ny booking
  function handleOpenNewBooking() {
    setEditingBooking(null);
    setShowBookingModal(true);
  }
  
  // Åpne modal for å redigere booking
  function handleEditBooking(booking: Booking) {
    setEditingBooking(booking);
    setShowBookingModal(true);
  }

  // Lukke modal
  function handleCloseBookingModal() {
    setShowBookingModal(false);
    setEditingBooking(null);
  }

  // -----------------------------
  // Lagre booking (ny eller rediger)
  // -----------------------------
  async function handleSaveBooking(data: BookingFormData) {
    try {
      const payload: any = {
        customerName: data.customerName,
        serviceName: data.serviceName,
        startTime: data.startTime,
        endTime: data.endTime,
        status: data.status,
        notes: data.notes || "",
      };

      if (data.employeeId !== "none") {
        payload.employeeId = data.employeeId;
      }
      if (data.customerId !== "none" && data.customerId !== "new") {
        payload.customerId = data.customerId;
      }

      if (editingBooking) {
        // Update existing booking
        const { booking } = await updateBooking(editingBooking.id, payload);
        setBookings((prev) => prev.map((b) => (b.id === booking.id ? booking : b)));
        setSelectedBookingId(booking.id);
      } else {
        // Create new booking
        const { booking } = await createBooking(payload);
        setBookings((prev) => [...prev, booking]);
        setSelectedBookingId(booking.id);
      }
    } catch (err) {
      console.error("[BookingPageClient] saveBooking error", err);
      throw err; // Re-throw to let modal handle the error
    }
  }

  // -----------------------------
  // Oppdatere status på valgt booking
  // -----------------------------
  async function handleChangeStatus(newStatus: BookingStatus) {
    if (!selectedBookingId) return;
    setUpdatingStatus(true);
    setError(null);

    try {
      const { booking } = await updateBooking(selectedBookingId, {
        status: newStatus,
      });

      setBookings((prev) =>
        prev.map((b) => (b.id === booking.id ? booking : b)),
      );
    } catch (err) {
      console.error("[BookingPageClient] updateBooking error", err);
      setError("Kunne ikke oppdatere status på booking.");
    } finally {
      setUpdatingStatus(false);
    }
  }

  // -----------------------------
  // Drag & Drop - flytte booking til ny tid
  // -----------------------------
  async function handleBookingDrop(bookingId: string, newStartTime: string, newResourceId?: string) {
    setError(null);

    try {
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking || !booking.startTime || !booking.endTime) {
        throw new Error("Booking not found or missing time data");
      }

      // Calculate new end time based on original duration
      const originalStart = new Date(booking.startTime);
      const originalEnd = new Date(booking.endTime);
      const durationMs = originalEnd.getTime() - originalStart.getTime();
      
      const newStart = new Date(newStartTime);
      const newEnd = new Date(newStart.getTime() + durationMs);

      // Update booking via API
      const { booking: updatedBooking } = await updateBooking(bookingId, {
        startTime: newStart.toISOString(),
        endTime: newEnd.toISOString(),
        ...(newResourceId && { resourceId: newResourceId }),
      });

      // Update local state
      setBookings((prev) =>
        prev.map((b) => (b.id === updatedBooking.id ? updatedBooking : b)),
      );

      // Show success feedback (optional - could use toast notification)
      console.log("[BookingPageClient] Booking moved successfully", updatedBooking);
      
    } catch (err) {
      console.error("[BookingPageClient] handleBookingDrop error", err);
      setError("Kunne ikke flytte bookingen. Prøv igjen.");
      
      // Refresh bookings to ensure UI is in sync
      await handleRefreshBookings();
    }
  }

  // -----------------------------
  // Filtrering og sortering
  // -----------------------------
  const filteredBookings = useMemo(() => {
    let list = bookings.slice();

    if (selectedStatus !== "all") {
      list = list.filter((b) => b.status === selectedStatus);
    }
    if (selectedEmployeeId !== "all") {
      list = list.filter((b) => b.employeeId === selectedEmployeeId);
    }

    list.sort((a, b) => {
      const da = a.startTime ? new Date(a.startTime).getTime() : 0;
      const db = b.startTime ? new Date(b.startTime).getTime() : 0;
      return da - db;
    });

    return list;
  }, [bookings, selectedStatus, selectedEmployeeId]);

  const selectedBooking = useMemo(
    () => filteredBookings.find((b) => b.id === selectedBookingId) ?? null,
    [filteredBookings, selectedBookingId],
  );

  function getEmployeeName(employeeId: string | null): string {
    if (!employeeId) return "Uten tildelt ansatt";
    const emp = employees.find((e) => e.id === employeeId);
    return emp?.name ?? "Ukjent ansatt";
  }

  function getCustomerName(b: Booking): string {
    if (typeof b.customerName === "string" && b.customerName.trim()) {
      return b.customerName;
    }
    const c = customers.find((c) => c.id === b.customerId);
    return c?.name ?? "Ukjent kunde";
  }

  function getServiceName(b: Booking): string {
    if (typeof b.serviceName === "string" && b.serviceName.trim()) {
      return b.serviceName;
    }
    return "Tjeneste";
  }

  // -----------------------------
  // Dagvisning – gruppering på dato
  // -----------------------------
  const dayGroups = useMemo(() => {
    const groups: Record<
      string,
      { dateKey: string; firstStart: string | null; bookings: Booking[] }
    > = {};

    for (const b of filteredBookings) {
      const key = getDateKey(b.startTime);
      if (!groups[key]) {
        groups[key] = {
          dateKey: key,
          firstStart: b.startTime ?? null,
          bookings: [],
        };
      }
      groups[key].bookings.push(b);
      if (!groups[key].firstStart && b.startTime) {
        groups[key].firstStart = b.startTime;
      }
    }

    const arr = Object.values(groups);

    // Sorter gruppene på dato
    arr.sort((a, b) => {
      const da = a.firstStart
        ? new Date(a.firstStart).getTime()
        : Number.MAX_SAFE_INTEGER;
      const db = b.firstStart
        ? new Date(b.firstStart).getTime()
        : Number.MAX_SAFE_INTEGER;
      return da - db;
    });

    // Sorter bookinger i hver dag-gruppe på starttid
    for (const g of arr) {
      g.bookings.sort((a, b) => {
        const da = a.startTime ? new Date(a.startTime).getTime() : 0;
        const db = b.startTime ? new Date(b.startTime).getTime() : 0;
        return da - db;
      });
    }

    return arr;
  }, [filteredBookings]);

  // -----------------------------
  // RENDER
  // -----------------------------

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-4 text-2xl font-semibold">Booking</h1>
        <p className="text-sm text-slate-500">Laster booking-data …</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-8">
      {/* AI Integration Panel for Booking */}
      <div className="mb-6">
        <AIIntegrationPanel 
          module="booking" 
          userPlan="free" 
          isEnabled={false}
          onToggle={(enabled) => console.log('AI Booking toggled:', enabled)}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Booking</h1>
          <p className="text-xs text-slate-500">
            Administrer alle bookinger for verkstedet – liste eller dagvisning.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Visningsmodus */}
          <div className="inline-flex items-center rounded-full border border-slate-300 bg-slate-50 p-0.5 text-[11px]">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`rounded-full px-3 py-1 ${
                viewMode === "list"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Liste
            </button>
            <button
              type="button"
              onClick={() => setViewMode("day")}
              className={`rounded-full px-3 py-1 ${
                viewMode === "day"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Dagvisning
            </button>
            <button
              type="button"
              onClick={() => setViewMode("week")}
              className={`rounded-full px-3 py-1 ${
                viewMode === "week"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Uke
            </button>
            <button
              type="button"
              onClick={() => setViewMode("resource")}
              className={`rounded-full px-3 py-1 ${
                viewMode === "resource"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Ressurser
            </button>
          </div>

          {error && (
            <span className="rounded bg-red-50 px-2 py-1 text-xs text-red-700">
              {error}
            </span>
          )}
          <button
            type="button"
            onClick={handleRefreshBookings}
            disabled={refreshing}
            className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {refreshing ? "Oppdaterer …" : "Oppdater bookinger"}
          </button>
          <button
            type="button"
            onClick={handleOpenNewBooking}
            className="inline-flex items-center rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-50 hover:bg-slate-800"
          >
            Ny booking
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[260px_minmax(0,1.4fr)_minmax(0,1fr)]">
        {/* VENSTRE: Filtre */}
        <aside className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 text-sm">
          <div>
            <h2 className="mb-2 text-sm font-medium">Filtre</h2>

            <label className="mb-1 block text-xs font-medium text-slate-500">
              Status
            </label>
            <select
              className="mb-3 w-full rounded border border-slate-300 px-2 py-1 text-xs"
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(e.target.value as BookingStatus | "all")
              }
            >
              <option value="all">Alle</option>
              <option value="pending">Venter / tilgjengelig</option>
              <option value="confirmed">Bekreftet</option>
              <option value="completed">Fullført</option>
              <option value="cancelled">Kansellert</option>
            </select>

            <label className="mb-1 block text-xs font-medium text-slate-500">
              Ansatt
            </label>
            <select
              className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
              value={selectedEmployeeId}
              onChange={(e) =>
                setSelectedEmployeeId(
                  e.target.value === "all" ? "all" : e.target.value,
                )
              }
            >
              <option value="all">Alle</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Module 18: Location and Resource filters */}
          <div className="border-t border-slate-200 pt-3">
            <h3 className="mb-2 text-xs font-semibold text-slate-700">📍 Lokasjon & Ressurser</h3>
            
            <label className="mb-1 block text-xs font-medium text-slate-500">
              Lokasjon
            </label>
            <select
              className="mb-3 w-full rounded border border-slate-300 px-2 py-1 text-xs"
              value={selectedLocationId}
              onChange={(e) => {
                setSelectedLocationId(e.target.value);
                setSelectedResourceId("all"); // Reset resource when location changes
              }}
            >
              <option value="all">Alle lokasjoner</option>
              {locations.filter(l => l.is_active).map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} {loc.is_primary && "⭐"}
                </option>
              ))}
            </select>
            
            <label className="mb-1 block text-xs font-medium text-slate-500">
              Ressurs
            </label>
            <select
              className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
              value={selectedResourceId}
              onChange={(e) => setSelectedResourceId(e.target.value)}
            >
              <option value="all">Alle ressurser</option>
              {filteredResources.filter(r => r.is_active).map((res) => (
                <option key={res.id} value={res.id}>
                  {res.name} ({RESOURCE_TYPE_LABELS[res.type]})
                </option>
              ))}
            </select>
            
            <button
              type="button"
              onClick={() => setShowLocationModal(true)}
              className="mt-3 w-full rounded border border-slate-300 bg-slate-50 px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-100"
            >
              ⚙️ Administrer lokasjoner
            </button>
          </div>

          <div className="border-t border-slate-200 pt-3 text-xs text-slate-500">
            <p className="mb-1">
              Viser <strong>{filteredBookings.length}</strong> bookinger etter
              filtrering.
            </p>
            <p className="text-[11px]">
              I dagvisning grupperes alle bookinger etter dato, så du raskt ser
              belastning per dag.
            </p>
          </div>
        </aside>

        {/* MIDTEN: Liste eller dagvisning */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
          <h2 className="mb-3 text-sm font-medium">
            {viewMode === "list" ? "Bookinger" : viewMode === "day" ? "Dagvisning" : viewMode === "week" ? "Ukevisning" : "Ressursvisning"}
          </h2>

          {filteredBookings.length === 0 && viewMode !== "resource" && viewMode !== "week" ? (
            <p className="text-xs text-slate-500">
              Ingen bookinger funnet med valgte filtre.
            </p>
          ) : viewMode === "week" ? (
            // WEEK VIEW - Module 19
            <WeekCalendar
              bookings={filteredBookings}
              resources={filteredResources}
              onBookingClick={(id) => setSelectedBookingId(id)}
              onBookingDrop={handleBookingDrop}
              selectedBookingId={selectedBookingId}
              startDate={new Date()}
            />
          ) : viewMode === "resource" ? (
            // RESOURCE VIEW - Module 18
            <div className="max-h-[520px] overflow-auto">
              <div className="mb-4">
                <p className="text-xs text-slate-500 mb-3">
                  Ressurskalender viser tilgjengelighet og bookinger per ressurs.
                </p>
                
                {/* Resource columns */}
                <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${filteredResources.length || 1}, minmax(150px, 1fr))` }}>
                  {filteredResources.length === 0 ? (
                    <p className="text-xs text-slate-400">Ingen ressurser for valgt lokasjon.</p>
                  ) : (
                    filteredResources.map(resource => {
                      const location = locations.find(l => l.id === resource.location_id);
                      // Mock booking assignments to resources
                      const resourceBookings = filteredBookings.slice(0, 2).map((b, idx) => ({
                        ...b,
                        resourceId: idx === 0 ? resource.id : null
                      })).filter(b => b.resourceId === resource.id);
                      
                      return (
                        <div 
                          key={resource.id} 
                          className="rounded-lg border border-slate-200 bg-white overflow-hidden"
                        >
                          {/* Resource header */}
                          <div 
                            className="px-3 py-2 text-white text-xs font-medium"
                            style={{ backgroundColor: resource.color || '#6B7280' }}
                          >
                            <div className="font-semibold">{resource.name}</div>
                            <div className="text-[10px] opacity-80">
                              {RESOURCE_TYPE_LABELS[resource.type]} • {location?.name || 'Ukjent'}
                            </div>
                          </div>
                          
                          {/* Resource info */}
                          <div className="px-3 py-2 border-b border-slate-100 bg-slate-50">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-slate-500">Kapasitet:</span>
                              <span className="font-medium">{resource.max_concurrent_bookings} samtidige</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-slate-500">Status:</span>
                              <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-medium ${
                                resource.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {resource.is_active ? '✓ Aktiv' : '✗ Inaktiv'}
                              </span>
                            </div>
                          </div>
                          
                          {/* Bookings for this resource */}
                          <div className="p-2 space-y-1.5 min-h-[100px]">
                            {resourceBookings.length === 0 ? (
                              <p className="text-[10px] text-slate-400 text-center py-4">
                                Ingen bookinger
                              </p>
                            ) : (
                              resourceBookings.map(b => (
                                <button
                                  key={b.id}
                                  type="button"
                                  onClick={() => setSelectedBookingId(b.id)}
                                  className={`w-full text-left rounded px-2 py-1.5 text-[10px] border transition ${
                                    b.id === selectedBookingId 
                                      ? 'border-sky-400 bg-sky-50' 
                                      : 'border-slate-200 bg-slate-50 hover:border-sky-300'
                                  }`}
                                >
                                  <div className="font-medium truncate">{getCustomerName(b)}</div>
                                  <div className="text-slate-500">{formatTime(b.startTime)} - {formatTime(b.endTime)}</div>
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
              
              {/* Capacity summary */}
              <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-semibold mb-2">📊 Kapasitetsoversikt</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white rounded p-2 border border-slate-200">
                    <div className="text-lg font-bold text-slate-900">{locations.filter(l => l.is_active).length}</div>
                    <div className="text-[10px] text-slate-500">Aktive lokasjoner</div>
                  </div>
                  <div className="bg-white rounded p-2 border border-slate-200">
                    <div className="text-lg font-bold text-slate-900">{resources.filter(r => r.is_active).length}</div>
                    <div className="text-[10px] text-slate-500">Aktive ressurser</div>
                  </div>
                  <div className="bg-white rounded p-2 border border-slate-200">
                    <div className="text-lg font-bold text-blue-600">{resources.filter(r => r.type === 'lift').length}</div>
                    <div className="text-[10px] text-slate-500">Løftebukker</div>
                  </div>
                  <div className="bg-white rounded p-2 border border-slate-200">
                    <div className="text-lg font-bold text-purple-600">{resources.filter(r => r.type === 'bay' || r.type === 'room').length}</div>
                    <div className="text-[10px] text-slate-500">Båser/Rom</div>
                  </div>
                </div>
              </div>
            </div>
          ) : viewMode === "list" ? (
            // LISTEVISNING
            <div className="max-h-[520px] overflow-auto">
              <table className="min-w-full border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                    <th className="px-2 py-1 text-left">Tid</th>
                    <th className="px-2 py-1 text-left">Kunde</th>
                    <th className="px-2 py-1 text-left">Tjeneste</th>
                    <th className="px-2 py-1 text-left">Ansatt</th>
                    <th className="px-2 py-1 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b) => {
                    const isSelected = b.id === selectedBookingId;
                    return (
                      <tr
                        key={b.id}
                        className={`cursor-pointer border-b border-slate-100 hover:bg-slate-50 ${
                          isSelected ? "bg-sky-50" : ""
                        }`}
                        onClick={() =>
                          setSelectedBookingId(isSelected ? null : b.id)
                        }
                      >
                        <td className="px-2 py-1 align-top">
                          {formatDateTime(b.startTime)}
                        </td>
                        <td className="px-2 py-1 align-top">
                          {b.customerId ? (
                            <Link
                              href={`/kunder/${b.customerId}`}
                              className="text-sky-700 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {getCustomerName(b)}
                            </Link>
                          ) : (
                            getCustomerName(b)
                          )}
                        </td>
                        <td className="px-2 py-1 align-top">
                          {getServiceName(b)}
                        </td>
                        <td className="px-2 py-1 align-top">
                          {getEmployeeName(b.employeeId ?? null)}
                        </td>
                        <td className="px-2 py-1 align-top">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${
                              b.status === "confirmed"
                                ? "bg-emerald-50 text-emerald-700"
                                : b.status === "completed"
                                ? "bg-slate-900 text-slate-50"
                                : b.status === "cancelled"
                                ? "bg-red-50 text-red-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {STATUS_LABELS[b.status] ?? b.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            // DAGVISNING
            <div className="max-h-[520px] space-y-4 overflow-auto">
              {dayGroups.map((group) => {
                const firstStart =
                  group.bookings[0]?.startTime ?? group.firstStart;
                const label = formatDateLabel(firstStart ?? null);

                return (
                  <div
                    key={group.dateKey}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {label}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {group.bookings.length}{" "}
                        {group.bookings.length === 1
                          ? "booking"
                          : "bookinger"}
                      </div>
                    </div>

                    <div className="grid gap-2 md:grid-cols-2">
                      {group.bookings.map((b) => {
                        const isSelected = b.id === selectedBookingId;
                        return (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() =>
                              setSelectedBookingId(isSelected ? null : b.id)
                            }
                            className={`flex flex-col items-stretch rounded-md border px-3 py-2 text-left text-[11px] transition ${
                              isSelected
                                ? "border-sky-400 bg-white"
                                : "border-slate-200 bg-white hover:border-sky-300"
                            }`}
                          >
                            <div className="mb-1 flex items-center justify-between">
                              <span className="font-medium text-slate-900">
                                {b.customerId ? (
                                  <Link
                                    href={`/kunder/${b.customerId}`}
                                    className="text-sky-700 hover:underline"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {getCustomerName(b)}
                                  </Link>
                                ) : (
                                  getCustomerName(b)
                                )}
                              </span>
                              <span className="ml-2 text-[10px] text-slate-500">
                                {formatTime(b.startTime)}–
                                {formatTime(b.endTime)}
                              </span>
                            </div>
                            <div className="mb-1 text-[11px] text-slate-600">
                              {getServiceName(b)}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-slate-500">
                                {getEmployeeName(b.employeeId ?? null)}
                              </span>
                              <span
                                className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                  b.status === "confirmed"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : b.status === "completed"
                                    ? "bg-slate-900 text-slate-50"
                                    : b.status === "cancelled"
                                    ? "bg-red-50 text-red-700"
                                    : "bg-amber-50 text-amber-700"
                                }`}
                              >
                                {STATUS_LABELS[b.status] ?? b.status}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* HØYRE: Detaljer for valgt booking */}
        <aside>
          <BookingDetailPanel
            booking={selectedBooking}
            customer={selectedBooking ? customers.find(c => c.id === selectedBooking.customerId) : null}
            onStatusChange={async (bookingId, newStatus) => {
              setUpdatingStatus(true);
              try {
                await handleChangeStatus(newStatus);
              } finally {
                setUpdatingStatus(false);
              }
            }}
            onEdit={handleEditBooking}
            loading={updatingStatus}
          />
        </aside>
      </div>

      {/* MODAL: Booking (Ny eller Rediger) */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={handleCloseBookingModal}
        onSave={handleSaveBooking}
        booking={editingBooking}
        customers={customers}
        services={services}
        employees={employees}
        locations={locations}
        resources={resources}
      />
      
      {/* MODAL: Location Management - Module 18 */}
      {showLocationModal && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-auto rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">📍 Lokasjoner & Ressurser</h2>
              <button
                type="button"
                onClick={() => setShowLocationModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            
            {/* Locations list */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-slate-800">Lokasjoner</h3>
                <button
                  type="button"
                  onClick={handleOpenNewLocation}
                  className="rounded bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
                >
                  + Ny lokasjon
                </button>
              </div>
              
              <div className="space-y-3">
                {locations.map(loc => (
                  <div 
                    key={loc.id} 
                    className={`rounded-lg border p-3 ${loc.is_active ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50 opacity-60'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{loc.name}</span>
                          {loc.is_headquarters && (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                              ⭐ Hovedlokasjon
                            </span>
                          )}
                          {!loc.is_active && (
                            <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700">
                              Inaktiv
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {loc.address}, {loc.postal_code} {loc.city}
                        </div>
                        {loc.phone && (
                          <div className="text-xs text-slate-400 mt-0.5">
                            📞 {loc.phone} • ✉️ {loc.email}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditLocation(loc)} 
                          className="text-xs text-slate-500 hover:text-slate-700"
                        >
                          Rediger
                        </button>
                        <button 
                          onClick={() => handleDeleteLocation(loc.id)} 
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Slett
                        </button>
                      </div>
                    </div>
                    
                    {/* Resources for this location */}
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <div className="text-[11px] font-medium text-slate-600 mb-2">Ressurser ved denne lokasjonen:</div>
                      <div className="flex flex-wrap gap-2">
                        {resources.filter(r => r.location_id === loc.id).map(res => (
                          <div 
                            key={res.id}
                            className="inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] group relative"
                            style={{ borderColor: res.color || '#CBD5E1', backgroundColor: `${res.color}15` || '#F8FAFC' }}
                          >
                            <span 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: res.color || '#6B7280' }}
                            />
                            <span>{res.name}</span>
                            <span className="text-slate-400">({RESOURCE_TYPE_LABELS[res.type]})</span>
                            <button
                              onClick={() => handleEditResource(res)}
                              className="ml-1 text-blue-500 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Rediger ressurs"
                            >
                              ✎
                            </button>
                            <button
                              onClick={() => handleDeleteResource(res.id)}
                              className="ml-0.5 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Slett ressurs"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <button 
                          onClick={() => handleOpenNewResource(loc.id)}
                          className="inline-flex items-center rounded-full border border-dashed border-slate-300 px-2 py-1 text-[10px] text-slate-500 hover:border-slate-400 hover:text-slate-600"
                        >
                          + Legg til ressurs
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Capacity Rules Info */}
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
              <h4 className="font-medium text-blue-800 text-sm mb-1">💡 Kapasitetsregler</h4>
              <p className="text-xs text-blue-700">
                Hver ressurs kan ha maksimalt antall samtidige bookinger. Når en ressurs er fullt booket, 
                vil systemet automatisk foreslå alternative tidspunkter eller ressurser til kunden.
              </p>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowLocationModal(false)}
                className="rounded bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800"
              >
                Lukk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Edit/New Location */}
      {(showEditLocationModal || showNewLocationModal) && (
        <LocationFormModal
          location={editingLocation}
          isOpen={showEditLocationModal || showNewLocationModal}
          onClose={() => {
            setShowEditLocationModal(false);
            setShowNewLocationModal(false);
            setEditingLocation(null);
          }}
          onSave={handleSaveLocation}
          saving={savingLocation}
        />
      )}

      {/* MODAL: Edit/New Resource */}
      {(showEditResourceModal || showNewResourceModal) && (
        <ResourceFormModal
          resource={editingResource}
          locationId={selectedLocationForResource}
          locations={locations}
          isOpen={showEditResourceModal || showNewResourceModal}
          onClose={() => {
            setShowEditResourceModal(false);
            setShowNewResourceModal(false);
            setEditingResource(null);
            setSelectedLocationForResource(null);
          }}
          onSave={handleSaveResource}
          saving={savingResource}
        />
      )}

      {/* Cross Navigation */}
      <CrossNavigation 
        currentModule="Bookinger"
        relatedModules={navigationMaps.booking}
      />
    </div>
  );
}
