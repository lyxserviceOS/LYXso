"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Car, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';

type Org = {
  id: string;
  name: string;
  slug: string;
  business_hours?: Record<string, { open: string; close: string }>;
  booking_settings?: {
    require_vehicle_reg?: boolean;
    allow_notes?: boolean;
    min_advance_hours?: number;
    max_advance_days?: number;
  };
};

type Service = {
  id: string;
  name: string;
  description?: string;
  duration_minutes: number;
  price?: number;
  category?: string;
};

type TimeSlot = {
  start: string;
  end: string;
  available: boolean;
  time: string;
};

type BookingFormData = {
  service_id: string;
  selected_date: string;
  selected_slot: TimeSlot | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  vehicle_reg: string;
  notes: string;
};

const STEPS = ['service', 'datetime', 'details', 'confirm'] as const;
type Step = typeof STEPS[number];

export default function PublicBookingWizard({ org }: { org: Org }) {
  const [currentStep, setCurrentStep] = useState<Step>('service');
  const [services, setServices] = useState<Service[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const [formData, setFormData] = useState<BookingFormData>({
    service_id: '',
    selected_date: '',
    selected_slot: null,
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    vehicle_reg: '',
    notes: ''
  });

  const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

  // Hent tjenester ved mount
  useEffect(() => {
    fetchServices();
  }, []);

  // Hent ledige tider når dato er valgt
  useEffect(() => {
    if (formData.selected_date && formData.service_id) {
      fetchAvailability();
    }
  }, [formData.selected_date, formData.service_id]);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiBase}/api/public/orgs/${org.slug}/services`);
      if (!response.ok) throw new Error('Kunne ikke hente tjenester');
      const data = await response.json();
      setServices(data.services || []);
    } catch (err) {
      setError('Kunne ikke laste tjenester. Vennligst prøv igjen.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailability = async () => {
    setLoading(true);
    setError(null);
    try {
      const service = services.find(s => s.id === formData.service_id);
      const duration = service?.duration_minutes || 60;
      
      const response = await fetch(
        `${apiBase}/api/public/orgs/${org.slug}/availability?date=${formData.selected_date}&duration_minutes=${duration}`
      );
      if (!response.ok) throw new Error('Kunne ikke sjekke tilgjengelighet');
      const data = await response.json();
      setAvailableSlots(data.slots || []);
    } catch (err) {
      setError('Kunne ikke laste tilgjengelige tider. Vennligst prøv igjen.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!recaptchaToken) {
      setError('Vennligst fullfør reCAPTCHA-verifiseringen');
      return;
    }

    if (!formData.selected_slot) {
      setError('Vennligst velg et tidspunkt');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const service = services.find(s => s.id === formData.service_id);
      const response = await fetch(`${apiBase}/api/public/orgs/${org.slug}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: formData.service_id,
          starts_at: formData.selected_slot.start,
          duration_minutes: service?.duration_minutes || 60,
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          customer_phone: formData.customer_phone,
          vehicle_reg: formData.vehicle_reg || null,
          notes: formData.notes || null,
          recaptcha_token: recaptchaToken
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Kunne ikke opprette booking');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Noe gikk galt. Vennligst prøv igjen.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    const currentIndex = STEPS.indexOf(currentStep);
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const currentIndex = STEPS.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1]);
    }
  };

  const canProceedFromService = () => {
    return formData.service_id !== '';
  };

  const canProceedFromDateTime = () => {
    return formData.selected_slot !== null;
  };

  const canProceedFromDetails = () => {
    return (
      formData.customer_name.trim() !== '' &&
      formData.customer_email.trim() !== '' &&
      formData.customer_phone.trim() !== ''
    );
  };

  if (success) {
    return (
      <div className="rounded-xl bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-green-100 p-4">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-slate-900">Booking mottatt!</h2>
          <p className="mb-4 text-slate-600">
            Takk for din booking. Vi har sendt en bekreftelse til{' '}
            <strong>{formData.customer_email}</strong>.
          </p>
          <p className="text-sm text-slate-500">
            Du vil motta en bekreftelse så snart {org.name} har godkjent bookingen din.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Book ny time
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const isActive = currentStep === step;
          const isCompleted = STEPS.indexOf(currentStep) > index;
          const stepLabels = {
            service: 'Tjeneste',
            datetime: 'Dato & Tid',
            details: 'Dine opplysninger',
            confirm: 'Bekreft'
          };

          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                    isCompleted
                      ? 'bg-green-600 text-white'
                      : isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isCompleted ? '✓' : index + 1}
                </div>
                <p className={`mt-2 text-xs ${isActive ? 'font-semibold text-slate-900' : 'text-slate-500'}`}>
                  {stepLabels[step]}
                </p>
              </div>
              {index < STEPS.length - 1 && (
                <div className={`h-1 flex-1 ${isCompleted ? 'bg-green-600' : 'bg-slate-200'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Step Content */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        {currentStep === 'service' && (
          <ServiceSelector
            services={services}
            selected={formData.service_id}
            onSelect={(id) => setFormData({ ...formData, service_id: id })}
            loading={loading}
          />
        )}

        {currentStep === 'datetime' && (
          <DateTimeSelector
            selectedDate={formData.selected_date}
            selectedSlot={formData.selected_slot}
            slots={availableSlots}
            onDateChange={(date) => setFormData({ ...formData, selected_date: date, selected_slot: null })}
            onSlotSelect={(slot) => setFormData({ ...formData, selected_slot: slot })}
            loading={loading}
            minAdvanceHours={org.booking_settings?.min_advance_hours || 2}
            maxAdvanceDays={org.booking_settings?.max_advance_days || 30}
          />
        )}

        {currentStep === 'details' && (
          <CustomerDetailsForm
            formData={formData}
            onChange={(updates) => setFormData({ ...formData, ...updates })}
            requireVehicleReg={org.booking_settings?.require_vehicle_reg || false}
            allowNotes={org.booking_settings?.allow_notes !== false}
          />
        )}

        {currentStep === 'confirm' && (
          <ConfirmationStep
            formData={formData}
            service={services.find(s => s.id === formData.service_id)}
            org={org}
            recaptchaSiteKey={recaptchaSiteKey}
            onRecaptchaChange={setRecaptchaToken}
            onSubmit={handleSubmit}
            loading={loading}
          />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 'service'}
          className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-5 w-5" />
          Tilbake
        </button>

        {currentStep !== 'confirm' ? (
          <button
            onClick={nextStep}
            disabled={
              (currentStep === 'service' && !canProceedFromService()) ||
              (currentStep === 'datetime' && !canProceedFromDateTime()) ||
              (currentStep === 'details' && !canProceedFromDetails())
            }
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Neste
            <ChevronRight className="h-5 w-5" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

// Service Selector Component
function ServiceSelector({
  services,
  selected,
  onSelect,
  loading
}: {
  services: Service[];
  selected: string;
  onSelect: (id: string) => void;
  loading: boolean;
}) {
  if (loading) {
    return <div className="text-center py-8">Laster tjenester...</div>;
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-8 text-slate-600">
        Ingen tjenester tilgjengelig for øyeblikket.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900">Velg tjeneste</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => onSelect(service.id)}
            className={`rounded-lg border-2 p-4 text-left transition-all ${
              selected === service.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-slate-200 hover:border-blue-300'
            }`}
          >
            <h3 className="font-semibold text-slate-900">{service.name}</h3>
            {service.description && (
              <p className="mt-1 text-sm text-slate-600">{service.description}</p>
            )}
            <div className="mt-2 flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {service.duration_minutes} min
              </span>
              {service.price && (
                <span className="font-semibold text-slate-900">
                  {service.price.toLocaleString('no-NO')} kr
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// DateTime Selector Component  
function DateTimeSelector({
  selectedDate,
  selectedSlot,
  slots,
  onDateChange,
  onSlotSelect,
  loading,
  minAdvanceHours,
  maxAdvanceDays
}: {
  selectedDate: string;
  selectedSlot: TimeSlot | null;
  slots: TimeSlot[];
  onDateChange: (date: string) => void;
  onSlotSelect: (slot: TimeSlot) => void;
  loading: boolean;
  minAdvanceHours: number;
  maxAdvanceDays: number;
}) {
  const minDate = new Date();
  minDate.setHours(minDate.getHours() + minAdvanceHours);
  const minDateStr = minDate.toISOString().split('T')[0];

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + maxAdvanceDays);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Velg dato og tid</h2>
        
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Velg dato
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          min={minDateStr}
          max={maxDateStr}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-lg"
        />
      </div>

      {selectedDate && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Velg tidspunkt
          </label>
          
          {loading ? (
            <div className="text-center py-8">Laster ledige tider...</div>
          ) : slots.length === 0 ? (
            <div className="text-center py-8 text-slate-600">
              Ingen ledige tider denne dagen. Prøv en annen dato.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {slots.map((slot, index) => (
                <button
                  key={index}
                  onClick={() => onSlotSelect(slot)}
                  disabled={!slot.available}
                  className={`rounded-lg border-2 py-3 px-2 text-sm font-medium transition-all ${
                    !slot.available
                      ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                      : selectedSlot?.time === slot.time
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-200 hover:border-blue-300 text-slate-700'
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Customer Details Form
function CustomerDetailsForm({
  formData,
  onChange,
  requireVehicleReg,
  allowNotes
}: {
  formData: BookingFormData;
  onChange: (updates: Partial<BookingFormData>) => void;
  requireVehicleReg: boolean;
  allowNotes: boolean;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900">Dine opplysninger</h2>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Fullt navn <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          value={formData.customer_name}
          onChange={(e) => onChange({ customer_name: e.target.value })}
          placeholder="Ola Nordmann"
          className="w-full rounded-lg border border-slate-300 px-4 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          E-post <span className="text-red-600">*</span>
        </label>
        <input
          type="email"
          value={formData.customer_email}
          onChange={(e) => onChange({ customer_email: e.target.value })}
          placeholder="ola@example.com"
          className="w-full rounded-lg border border-slate-300 px-4 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Telefon <span className="text-red-600">*</span>
        </label>
        <input
          type="tel"
          value={formData.customer_phone}
          onChange={(e) => onChange({ customer_phone: e.target.value })}
          placeholder="+47 123 45 678"
          className="w-full rounded-lg border border-slate-300 px-4 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Registreringsnummer {requireVehicleReg && <span className="text-red-600">*</span>}
        </label>
        <input
          type="text"
          value={formData.vehicle_reg}
          onChange={(e) => onChange({ vehicle_reg: e.target.value.toUpperCase() })}
          placeholder="AB12345"
          className="w-full rounded-lg border border-slate-300 px-4 py-2 uppercase"
          required={requireVehicleReg}
        />
      </div>

      {allowNotes && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Merknader (valgfritt)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
            placeholder="Spesielle ønsker eller informasjon..."
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-4 py-2"
          />
        </div>
      )}
    </div>
  );
}

// Confirmation Step
function ConfirmationStep({
  formData,
  service,
  org,
  recaptchaSiteKey,
  onRecaptchaChange,
  onSubmit,
  loading
}: {
  formData: BookingFormData;
  service?: Service;
  org: Org;
  recaptchaSiteKey: string;
  onRecaptchaChange: (token: string | null) => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900">Bekreft booking</h2>

      <div className="space-y-4 rounded-lg bg-slate-50 p-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Tjeneste</p>
          <p className="text-lg font-semibold text-slate-900">{service?.name}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-500">Dato og tid</p>
          <p className="text-lg font-semibold text-slate-900">
            {new Date(formData.selected_date).toLocaleDateString('no-NO', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
            {' kl. '}
            {formData.selected_slot?.time}
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-500">Varighet</p>
          <p className="text-lg font-semibold text-slate-900">{service?.duration_minutes} minutter</p>
        </div>

        <hr className="border-slate-200" />

        <div>
          <p className="text-sm font-medium text-slate-500">Kontaktinformasjon</p>
          <p className="text-slate-900">{formData.customer_name}</p>
          <p className="text-slate-900">{formData.customer_email}</p>
          <p className="text-slate-900">{formData.customer_phone}</p>
          {formData.vehicle_reg && (
            <p className="text-slate-900">Reg.nr: {formData.vehicle_reg}</p>
          )}
        </div>

        {formData.notes && (
          <div>
            <p className="text-sm font-medium text-slate-500">Merknader</p>
            <p className="text-slate-900">{formData.notes}</p>
          </div>
        )}
      </div>

      {recaptchaSiteKey && (
        <div className="flex justify-center">
          <ReCAPTCHA
            sitekey={recaptchaSiteKey}
            onChange={onRecaptchaChange}
          />
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={loading}
        className="w-full rounded-lg bg-green-600 py-4 text-lg font-semibold text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Sender booking...' : 'Bekreft og book time'}
      </button>

      <p className="text-center text-xs text-slate-500">
        Ved å bekrefte bookingen godtar du at {org.name} lagrer dine opplysninger i henhold til personvernreglene.
      </p>
    </div>
  );
}
