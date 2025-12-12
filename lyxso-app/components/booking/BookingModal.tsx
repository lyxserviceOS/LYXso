"use client";

import React, { useState, useEffect, useMemo } from "react";
import type { Booking, BookingStatus, Employee, Service, BookingCustomerSummary } from "@/types/booking";
import type { Location, Resource } from "@/types/location";

type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BookingFormData) => Promise<void>;
  booking?: Booking | null;
  customers: BookingCustomerSummary[];
  services: Service[];
  employees: Employee[];
  locations: Location[];
  resources: Resource[];
};

export type BookingFormData = {
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  serviceName: string;
  serviceId?: string;
  employeeId: string;
  locationId: string;
  resourceId: string;
  vehicleId?: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  notes: string;
  status: BookingStatus;
  sendConfirmation: boolean;
};

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Venter",
  confirmed: "Bekreftet",
  in_progress: "Pågår",
  completed: "Fullført",
  cancelled: "Kansellert",
  no_show: "Ikke møtt",
};

export function BookingModal({
  isOpen,
  onClose,
  onSave,
  booking,
  customers,
  services,
  employees,
  locations,
  resources,
}: BookingModalProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<BookingFormData>({
    customerId: "none",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    serviceName: "",
    serviceId: "",
    employeeId: "none",
    locationId: "all",
    resourceId: "none",
    vehicleId: "",
    startTime: "",
    endTime: "",
    duration: 60,
    notes: "",
    status: "confirmed",
    sendConfirmation: true,
  });

  // Filter resources based on selected location
  const filteredResources = useMemo(() => {
    if (form.locationId === "all") return resources;
    return resources.filter(r => r.location_id === form.locationId && r.is_active);
  }, [resources, form.locationId]);

  // Get selected service details
  const selectedService = useMemo(() => {
    return services.find(s => s.id === form.serviceId);
  }, [services, form.serviceId]);

  // Auto-calculate end time based on duration
  useEffect(() => {
    if (form.startTime && form.duration > 0) {
      const start = new Date(form.startTime);
      const end = new Date(start.getTime() + form.duration * 60000);
      const endTimeString = end.toISOString().slice(0, 16);
      setForm(prev => ({ ...prev, endTime: endTimeString }));
    }
  }, [form.startTime, form.duration]);

  // Update duration when service is selected
  useEffect(() => {
    if (selectedService && 'duration' in selectedService && typeof selectedService.duration === 'number') {
      setForm(prev => ({ ...prev, duration: selectedService.duration as number }));
    }
  }, [selectedService]);

  // Reset form when booking changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (booking) {
        // Edit mode
        setForm({
          customerId: booking.customerId || "none",
          customerName: booking.customerName || "",
          serviceName: booking.serviceName || "",
          employeeId: booking.employeeId || "none",
          locationId: "all", // TODO: get from booking
          resourceId: "none", // TODO: get from booking
          startTime: booking.startTime ? new Date(booking.startTime).toISOString().slice(0, 16) : "",
          endTime: booking.endTime ? new Date(booking.endTime).toISOString().slice(0, 16) : "",
          duration: 60,
          notes: booking.notes || "",
          status: booking.status,
          sendConfirmation: false,
        });
      } else {
        // Create mode - set default date to today at 9:00
        const now = new Date();
        const defaultStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0);
        setForm({
          customerId: "none",
          customerName: "",
          customerEmail: "",
          customerPhone: "",
          serviceName: "",
          serviceId: "",
          employeeId: "none",
          locationId: locations.find(l => l.is_primary)?.id || "all",
          resourceId: "none",
          vehicleId: "",
          startTime: defaultStart.toISOString().slice(0, 16),
          endTime: "",
          duration: 60,
          notes: "",
          status: "confirmed",
          sendConfirmation: true,
        });
      }
      setError(null);
    }
  }, [isOpen, booking, locations]);

  function handleCustomerChange(customerId: string) {
    if (customerId === "none" || customerId === "new") {
      setForm(prev => ({ ...prev, customerId, customerName: "", customerEmail: "", customerPhone: "" }));
      return;
    }
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      setForm(prev => ({
        ...prev,
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email || "",
        customerPhone: customer.phone || "",
      }));
    }
  }

  function handleServiceChange(serviceId: string) {
    if (!serviceId) {
      setForm(prev => ({ ...prev, serviceId: "", serviceName: "" }));
      return;
    }
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setForm(prev => ({
        ...prev,
        serviceId: service.id,
        serviceName: service.name,
        duration: ('duration' in service && typeof service.duration === 'number') ? service.duration : 60,
      }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validation
    if (!form.customerName.trim()) {
      setError("Kundenavn er påkrevd");
      return;
    }
    if (!form.serviceName.trim()) {
      setError("Tjeneste er påkrevd");
      return;
    }
    if (!form.startTime) {
      setError("Starttid er påkrevd");
      return;
    }
    if (!form.endTime) {
      setError("Sluttid er påkrevd");
      return;
    }

    // Validate time range
    if (new Date(form.endTime) <= new Date(form.startTime)) {
      setError("Sluttid må være etter starttid");
      return;
    }

    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      console.error("[BookingModal] Save error:", err);
      setError("Kunne ikke lagre booking. Prøv igjen.");
    } finally {
      setSaving(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-auto rounded-xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            {booking ? "Rediger booking" : "Ny booking"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Customer Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              👤 Kunde
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Velg kunde *
                </label>
                <select
                  className="w-full rounded-lg border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm"
                  value={form.customerId}
                  onChange={(e) => handleCustomerChange(e.target.value)}
                >
                  <option value="none">Ingen valgt (walk-in)</option>
                  <option value="new">➕ Ny kunde...</option>
                  <optgroup label="Eksisterende kunder">
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.email ? `(${c.email})` : ""}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Kundenavn *
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm"
                  value={form.customerName}
                  onChange={(e) => setForm(prev => ({ ...prev, customerName: e.target.value }))}
                  placeholder="F.eks. Ola Nordmann"
                  required
                />
              </div>
            </div>

            {(form.customerId === "new" || form.customerId === "none") && (
              <div className="grid md:grid-cols-2 gap-4 pl-4 border-l-2 border-sky-300 bg-sky-50/30 p-3 rounded">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    E-post
                  </label>
                  <input
                    type="email"
                    className="w-full rounded-lg border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm"
                    value={form.customerEmail}
                    onChange={(e) => setForm(prev => ({ ...prev, customerEmail: e.target.value }))}
                    placeholder="kunde@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    className="w-full rounded-lg border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm"
                    value={form.customerPhone}
                    onChange={(e) => setForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                    placeholder="+47 xxx xx xxx"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Service Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              🔧 Tjeneste
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Velg tjeneste *
                </label>
                <select
                  className="w-full rounded-lg border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm"
                  value={form.serviceId}
                  onChange={(e) => handleServiceChange(e.target.value)}
                >
                  <option value="">Velg...</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} {('duration' in s && s.duration) ? `(${s.duration} min)` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Varighet (minutter) *
                </label>
                <input
                  type="number"
                  className="w-full rounded-lg border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm"
                  value={form.duration}
                  onChange={(e) => setForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                  min="15"
                  step="15"
                  required
                />
                <p className="mt-1 text-xs text-slate-500">
                  Sluttid beregnes automatisk
                </p>
              </div>
            </div>
          </div>

          {/* Location & Resource Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              📍 Lokasjon & Ressurs
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Lokasjon
                </label>
                <select
                  className="w-full rounded-lg border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm"
                  value={form.locationId}
                  onChange={(e) => setForm(prev => ({ ...prev, locationId: e.target.value, resourceId: "none" }))}
                >
                  <option value="all">Ikke spesifisert</option>
                  {locations.filter(l => l.is_active).map(loc => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} {loc.is_primary && "⭐"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Ressurs
                </label>
                <select
                  className="w-full rounded-lg border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm"
                  value={form.resourceId}
                  onChange={(e) => setForm(prev => ({ ...prev, resourceId: e.target.value }))}
                  disabled={filteredResources.length === 0}
                >
                  <option value="none">Ingen tildelt</option>
                  {filteredResources.map(res => (
                    <option key={res.id} value={res.id}>
                      {res.name} ({res.type})
                    </option>
                  ))}
                </select>
                {filteredResources.length === 0 && form.locationId !== "all" && (
                  <p className="mt-1 text-xs text-amber-600">
                    Ingen aktive ressurser for valgt lokasjon
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Time Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              ⏰ Tidspunkt
            </h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Starttid *
                </label>
                <input
                  type="datetime-local"
                  className="w-full rounded-lg border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm"
                  value={form.startTime}
                  onChange={(e) => setForm(prev => ({ ...prev, startTime: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Sluttid *
                </label>
                <input
                  type="datetime-local"
                  className="w-full rounded-lg border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm"
                  value={form.endTime}
                  onChange={(e) => setForm(prev => ({ ...prev, endTime: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Ansatt
                </label>
                <select
                  className="w-full rounded-lg border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm"
                  value={form.employeeId}
                  onChange={(e) => setForm(prev => ({ ...prev, employeeId: e.target.value }))}
                >
                  <option value="none">Ikke tildelt</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              📝 Detaljer
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full rounded-lg border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm"
                  value={form.status}
                  onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value as BookingStatus }))}
                >
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    checked={form.sendConfirmation}
                    onChange={(e) => setForm(prev => ({ ...prev, sendConfirmation: e.target.checked }))}
                  />
                  <span className="text-sm text-slate-700">
                    Send bekreftelse til kunde
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Notater / Instruksjoner
              </label>
              <textarea
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 text-sm"
                rows={3}
                value={form.notes}
                onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Spesielle instruksjoner, merknader, etc..."
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition disabled:opacity-50 text-sm font-medium"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition disabled:opacity-50 text-sm font-medium shadow-sm"
            >
              {saving ? "Lagrer..." : booking ? "Lagre endringer" : "Opprett booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
