"use client";

import React, { useEffect, useState } from "react";
import type { TyreThresholdSettings } from "@/types/tyre";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID;

type OrgSettings = {
  id: string;
  name: string | null;
  logoUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  isActive: boolean | null;
  plan: string | null; // f.eks. "free", "trial", "pro"
};

type BookingSettings = {
  allow_auto_booking: boolean; // Allow customers to auto-book available slots
  require_approval: boolean; // Require partner approval for new bookings
  min_booking_lead_hours: number; // Minimum hours before appointment
  max_booking_lead_days: number; // Maximum days in advance
  booking_slot_duration_minutes: number; // Default slot duration
  show_available_slots: boolean; // Show available slots to customers
};

const DEFAULT_TYRE_THRESHOLDS: TyreThresholdSettings = {
  org_id: ORG_ID || "",
  summer_min_tread_mm: 3,
  winter_min_tread_mm: 4,
  allseason_min_tread_mm: 3,
  summer_warning_tread_mm: 4,
  winter_warning_tread_mm: 5,
  allseason_warning_tread_mm: 4,
  max_tyre_age_years: 6,
  notify_customer_on_low_tread: true,
  notify_customer_on_old_tyres: true,
  updated_at: new Date().toISOString(),
};

const DEFAULT_BOOKING_SETTINGS: BookingSettings = {
  allow_auto_booking: false,
  require_approval: true,
  min_booking_lead_hours: 24,
  max_booking_lead_days: 60,
  booking_slot_duration_minutes: 60,
  show_available_slots: true,
};

export default function OrgSettingsPageClient() {
  const [org, setOrg] = useState<OrgSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"plan" | "service" | "dekkhotell" | "booking">("plan");
  
  // Tyre threshold settings
  const [tyreSettings, setTyreSettings] = useState<TyreThresholdSettings>(DEFAULT_TYRE_THRESHOLDS);
  const [tyreSaving, setTyreSaving] = useState(false);
  
  // Booking settings
  const [bookingSettings, setBookingSettings] = useState<BookingSettings>(DEFAULT_BOOKING_SETTINGS);
  const [bookingSaving, setBookingSaving] = useState(false);
  
  // Service type settings
  const [serviceSettings, setServiceSettings] = useState({
    hasFixedLocation: true,
    isMobile: false,
  });
  const [serviceSaving, setServiceSaving] = useState(false);

  useEffect(() => {
    async function load() {
      if (!API_BASE || !ORG_ID) {
        setError("Mangler NEXT_PUBLIC_API_BASE eller NEXT_PUBLIC_ORG_ID.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${API_BASE}/api/orgs/${ORG_ID}/settings`,
          { cache: "no-store" },
        );

        if (!res.ok) {
          throw new Error(`Feil fra API (${res.status})`);
        }

        const json = await res.json();
        setOrg(json.org as OrgSettings);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Ukjent feil ved henting av org-settings";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const currentPlan = org?.plan ?? "free";
  
  const handleSaveTyreSettings = () => {
    setTyreSaving(true);
    // Simulate API save
    setTimeout(() => {
      setTyreSaving(false);
    }, 1000);
  };
  
  const handleSaveBookingSettings = () => {
    setBookingSaving(true);
    // Simulate API save
    setTimeout(() => {
      setBookingSaving(false);
    }, 1000);
  };
  
  const handleSaveServiceSettings = () => {
    // Validate at least one service type is selected
    if (!serviceSettings.hasFixedLocation && !serviceSettings.isMobile) {
      return; // Validation shown in UI, prevent save
    }
    setServiceSaving(true);
    // Simulate API save - will be connected to backend when available
    setTimeout(() => {
      setServiceSaving(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-lg font-semibold text-slate-100">
          Organisasjonsinnstillinger
        </h1>
        <p className="text-sm text-slate-400">
          Administrer plan, tjenestetype, dekkhotell-grenser og bookinginnstillinger for din bedrift.
        </p>
      </header>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {loading && <p className="text-sm text-slate-400">Laster …</p>}

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-slate-800 p-1">
        {[
          { key: "plan", label: "Plan & moduler" },
          { key: "service", label: "Tjenestetype" },
          { key: "dekkhotell", label: "Dekkhotell-grenser" },
          { key: "booking", label: "Booking-innstillinger" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`flex-1 rounded-md px-4 py-2 text-xs font-medium transition ${
              activeTab === tab.key
                ? "bg-slate-700 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Plan Tab */}
      {activeTab === "plan" && org && (
        <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Bedrift
              </p>
              <p className="text-sm font-medium text-slate-100">
                {org.name ?? "Uten navn"}
              </p>
              <p className="text-xs text-slate-500">
                Status: {org.isActive ? "Aktiv" : "Deaktivert"}
              </p>
            </div>
            {org.logoUrl && (
              <img
                src={org.logoUrl}
                alt="Logo"
                className="h-10 w-10 rounded-md border border-slate-800 object-contain bg-slate-900"
              />
            )}
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {/* Gratis plan */}
            <div
              className={[
                "rounded-lg border p-3 text-xs",
                currentPlan === "free"
                  ? "border-blue-600 bg-slate-900/80"
                  : "border-slate-800 bg-slate-950/40",
              ].join(" ")}
            >
              <p className="font-semibold text-slate-100">Free</p>
              <p className="text-[11px] text-slate-400">
                Enkelt bookingsystem med reklame. Ingen kostnad.
              </p>
              <ul className="mt-2 space-y-1 text-[11px] text-slate-300">
                <li>• Online booking</li>
                <li>• En bruker</li>
                <li>• Enkel kundeliste</li>
              </ul>
            </div>

            {/* Prøveperiode */}
            <div
              className={[
                "rounded-lg border p-3 text-xs",
                currentPlan === "trial"
                  ? "border-emerald-500 bg-slate-900/80"
                  : "border-slate-800 bg-slate-950/40",
              ].join(" ")}
            >
              <p className="font-semibold text-slate-100">14 dagers prøve</p>
              <p className="text-[11px] text-slate-400">
                Delvis full tilgang i 14 dager før dere går over til Free eller
                Betalt.
              </p>
              <ul className="mt-2 space-y-1 text-[11px] text-slate-300">
                <li>• Det meste av partner-modulene aktivert</li>
                <li>• God måte å teste LYXso i drift</li>
              </ul>
            </div>

            {/* Betalt plan */}
            <div
              className={[
                "rounded-lg border p-3 text-xs",
                currentPlan === "pro"
                  ? "border-amber-500 bg-slate-900/80"
                  : "border-slate-800 bg-slate-950/40",
              ].join(" ")}
            >
              <p className="font-semibold text-slate-100">
                LYXso Partner (betalt)
              </p>
              <p className="text-[11px] text-slate-400">
                Full plattform med AI, regnskap og tilleggsmoduler.
              </p>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-[11px] text-slate-500 line-through">
                  1&nbsp;495,-
                </span>
                <span className="text-sm font-semibold text-emerald-400">
                  990,- / måned
                </span>
                <span className="text-[10px] text-slate-500">introkampanje</span>
              </div>

              <ul className="mt-2 space-y-1 text-[11px] text-slate-300">
                <li>• Full partner-portal</li>
                <li>• Regnskapsflyt via Fiken/PowerOffice</li>
                <li>• Mulighet for AI-markedsføring og LYXvision-modul</li>
                <li>• Flere brukere og tilleggsmoduler mot ekstra månedspris</li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Service Type Tab */}
      {activeTab === "service" && (
        <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Tjenestetype
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Velg hvordan bedriften tilbyr tjenester til kundene. Dette påvirker 
              hvordan bookingssiden og kundeopplevelsen fungerer.
            </p>
          </div>
          
          {/* Service type options */}
          <div className="border-t border-slate-800 pt-4">
            <p className="text-xs font-medium text-slate-300 mb-3">
              Hvordan tilbyr dere tjenestene?
            </p>
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-slate-700 hover:border-slate-600 transition">
                <input
                  type="checkbox"
                  checked={serviceSettings.hasFixedLocation}
                  onChange={(e) => setServiceSettings(prev => ({
                    ...prev,
                    hasFixedLocation: e.target.checked
                  }))}
                  className="mt-0.5 rounded border-slate-600"
                />
                <div>
                  <span className="text-sm font-medium text-slate-100">
                    Fast adresse / lokaler
                  </span>
                  <p className="text-xs text-slate-400 mt-1">
                    Dere har et fast sted (verksted, bilpleiesenter, osv.) der kunder 
                    kommer for å få utført tjenester. Adressen vises på bookingsiden.
                  </p>
                </div>
              </label>
              
              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-slate-700 hover:border-slate-600 transition">
                <input
                  type="checkbox"
                  checked={serviceSettings.isMobile}
                  onChange={(e) => setServiceSettings(prev => ({
                    ...prev,
                    isMobile: e.target.checked
                  }))}
                  className="mt-0.5 rounded border-slate-600"
                />
                <div>
                  <span className="text-sm font-medium text-slate-100">
                    Mobil tjeneste
                  </span>
                  <p className="text-xs text-slate-400 mt-1">
                    Dere reiser ut til kunden for å utføre tjenester (hjemme hos kunden, 
                    på arbeidsplassen, etc.). Kunden velger adresse ved booking.
                  </p>
                </div>
              </label>
            </div>
            
            <div className="mt-4 rounded-lg border border-blue-500/30 bg-blue-500/10 p-3">
              <p className="text-xs text-blue-200">
                <strong>Tips:</strong> Kryss av for begge hvis dere tilbyr både 
                faste lokaler og mobil utrykning. Kunden kan da velge hva som passer best.
              </p>
            </div>
            
            {!serviceSettings.hasFixedLocation && !serviceSettings.isMobile && (
              <div className="mt-4 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3">
                <p className="text-xs text-amber-200">
                  ⚠️ Minst én tjenestetype må være valgt for at booking skal fungere.
                </p>
              </div>
            )}
          </div>
          
          {/* Save button */}
          <div className="border-t border-slate-800 pt-4 flex justify-end">
            <button
              type="button"
              onClick={handleSaveServiceSettings}
              disabled={serviceSaving}
              className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {serviceSaving ? "Lagrer..." : "Lagre tjenestetype"}
            </button>
          </div>
        </section>
      )}

      {/* Dekkhotell Thresholds Tab */}
      {activeTab === "dekkhotell" && (
        <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Dekkhotell – Mønsterdybde-grenser
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Definer egne grenser for når dekk skal markeres som «slitte» eller «må byttes».
              AI-analysen bruker disse verdiene til å gi korrekte anbefalinger.
            </p>
          </div>
          
          {/* Minimum tread depth */}
          <div className="border-t border-slate-800 pt-4">
            <p className="text-xs font-medium text-slate-300 mb-3">
              Minimum lovlig mønsterdybde (mm)
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Sommerdekk
                </label>
                <input
                  type="number"
                  value={tyreSettings.summer_min_tread_mm}
                  onChange={(e) => setTyreSettings(prev => ({
                    ...prev,
                    summer_min_tread_mm: parseFloat(e.target.value) || 0
                  }))}
                  step="0.5"
                  min="0"
                  max="10"
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                />
                <p className="text-[10px] text-slate-500 mt-1">Lovkrav: 1.6 mm</p>
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Vinterdekk
                </label>
                <input
                  type="number"
                  value={tyreSettings.winter_min_tread_mm}
                  onChange={(e) => setTyreSettings(prev => ({
                    ...prev,
                    winter_min_tread_mm: parseFloat(e.target.value) || 0
                  }))}
                  step="0.5"
                  min="0"
                  max="10"
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                />
                <p className="text-[10px] text-slate-500 mt-1">Lovkrav: 3.0 mm</p>
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Helårsdekk
                </label>
                <input
                  type="number"
                  value={tyreSettings.allseason_min_tread_mm}
                  onChange={(e) => setTyreSettings(prev => ({
                    ...prev,
                    allseason_min_tread_mm: parseFloat(e.target.value) || 0
                  }))}
                  step="0.5"
                  min="0"
                  max="10"
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                />
                <p className="text-[10px] text-slate-500 mt-1">Lovkrav: 3.0 mm (vinter)</p>
              </div>
            </div>
          </div>
          
          {/* Warning thresholds */}
          <div className="border-t border-slate-800 pt-4">
            <p className="text-xs font-medium text-slate-300 mb-3">
              Varslingsgrense – «Slitt» (mm)
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Sommerdekk
                </label>
                <input
                  type="number"
                  value={tyreSettings.summer_warning_tread_mm}
                  onChange={(e) => setTyreSettings(prev => ({
                    ...prev,
                    summer_warning_tread_mm: parseFloat(e.target.value) || 0
                  }))}
                  step="0.5"
                  min="0"
                  max="10"
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Vinterdekk
                </label>
                <input
                  type="number"
                  value={tyreSettings.winter_warning_tread_mm}
                  onChange={(e) => setTyreSettings(prev => ({
                    ...prev,
                    winter_warning_tread_mm: parseFloat(e.target.value) || 0
                  }))}
                  step="0.5"
                  min="0"
                  max="10"
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Helårsdekk
                </label>
                <input
                  type="number"
                  value={tyreSettings.allseason_warning_tread_mm}
                  onChange={(e) => setTyreSettings(prev => ({
                    ...prev,
                    allseason_warning_tread_mm: parseFloat(e.target.value) || 0
                  }))}
                  step="0.5"
                  min="0"
                  max="10"
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                />
              </div>
            </div>
          </div>
          
          {/* Age threshold */}
          <div className="border-t border-slate-800 pt-4">
            <p className="text-xs font-medium text-slate-300 mb-3">
              Aldersgrense
            </p>
            <div className="max-w-xs">
              <label className="block text-[11px] text-slate-400 mb-1">
                Maks alder før anbefalt bytte (år)
              </label>
              <input
                type="number"
                value={tyreSettings.max_tyre_age_years}
                onChange={(e) => setTyreSettings(prev => ({
                  ...prev,
                  max_tyre_age_years: parseInt(e.target.value) || 6
                }))}
                min="1"
                max="15"
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Dekk eldre enn dette merkes som «må byttes» uansett mønsterdybde
              </p>
            </div>
          </div>
          
          {/* Notifications */}
          <div className="border-t border-slate-800 pt-4">
            <p className="text-xs font-medium text-slate-300 mb-3">
              Automatiske varsler
            </p>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={tyreSettings.notify_customer_on_low_tread}
                  onChange={(e) => setTyreSettings(prev => ({
                    ...prev,
                    notify_customer_on_low_tread: e.target.checked
                  }))}
                  className="rounded border-slate-600"
                />
                <span className="text-xs text-slate-300">
                  Varsle kunde når mønsterdybde er under varslingsgrense
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={tyreSettings.notify_customer_on_old_tyres}
                  onChange={(e) => setTyreSettings(prev => ({
                    ...prev,
                    notify_customer_on_old_tyres: e.target.checked
                  }))}
                  className="rounded border-slate-600"
                />
                <span className="text-xs text-slate-300">
                  Varsle kunde når dekk er eldre enn aldersgrensen
                </span>
              </label>
            </div>
          </div>
          
          {/* Save button */}
          <div className="border-t border-slate-800 pt-4 flex justify-end">
            <button
              type="button"
              onClick={handleSaveTyreSettings}
              disabled={tyreSaving}
              className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {tyreSaving ? "Lagrer..." : "Lagre dekkhotell-innstillinger"}
            </button>
          </div>
        </section>
      )}

      {/* Booking Settings Tab */}
      {activeTab === "booking" && (
        <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Booking-innstillinger
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Kontroller hvordan kunder kan booke timer gjennom den offentlige bookingsiden.
            </p>
          </div>
          
          {/* Auto booking */}
          <div className="border-t border-slate-800 pt-4">
            <p className="text-xs font-medium text-slate-300 mb-3">
              Automatisk booking
            </p>
            <div className="space-y-3">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={bookingSettings.allow_auto_booking}
                  onChange={(e) => setBookingSettings(prev => ({
                    ...prev,
                    allow_auto_booking: e.target.checked
                  }))}
                  className="rounded border-slate-600 mt-0.5"
                />
                <div>
                  <span className="text-xs text-slate-300">
                    Tillat kunder å booke direkte i ledige tidsluker
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Når aktivert, kan kunder velge fra tilgjengelige tider og få booking bekreftet automatisk.
                    Når deaktivert, må alle bookinger godkjennes manuelt av dere.
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={bookingSettings.show_available_slots}
                  onChange={(e) => setBookingSettings(prev => ({
                    ...prev,
                    show_available_slots: e.target.checked
                  }))}
                  className="rounded border-slate-600 mt-0.5"
                />
                <div>
                  <span className="text-xs text-slate-300">
                    Vis tilgjengelige tidsluker i kalender
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Viser en kalendervisning med ledige tider til kundene
                  </p>
                </div>
              </label>
            </div>
          </div>
          
          {/* Time constraints */}
          <div className="border-t border-slate-800 pt-4">
            <p className="text-xs font-medium text-slate-300 mb-3">
              Tidsbegrensninger
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Minimum tid før booking (timer)
                </label>
                <input
                  type="number"
                  value={bookingSettings.min_booking_lead_hours}
                  onChange={(e) => setBookingSettings(prev => ({
                    ...prev,
                    min_booking_lead_hours: parseInt(e.target.value) || 0
                  }))}
                  min="0"
                  max="168"
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Kunder kan ikke booke nærmere enn dette antall timer frem i tid
                </p>
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Maks dager frem for booking
                </label>
                <input
                  type="number"
                  value={bookingSettings.max_booking_lead_days}
                  onChange={(e) => setBookingSettings(prev => ({
                    ...prev,
                    max_booking_lead_days: parseInt(e.target.value) || 30
                  }))}
                  min="1"
                  max="365"
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Begrenser hvor langt frem kunder kan se/booke
                </p>
              </div>
            </div>
          </div>
          
          {/* Slot duration */}
          <div className="border-t border-slate-800 pt-4">
            <p className="text-xs font-medium text-slate-300 mb-3">
              Standard varighet
            </p>
            <div className="max-w-xs">
              <label className="block text-[11px] text-slate-400 mb-1">
                Standard tidsluke-varighet (minutter)
              </label>
              <select
                value={bookingSettings.booking_slot_duration_minutes}
                onChange={(e) => setBookingSettings(prev => ({
                  ...prev,
                  booking_slot_duration_minutes: parseInt(e.target.value)
                }))}
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
              >
                <option value={15}>15 minutter</option>
                <option value={30}>30 minutter</option>
                <option value={45}>45 minutter</option>
                <option value={60}>1 time</option>
                <option value={90}>1,5 timer</option>
                <option value={120}>2 timer</option>
              </select>
            </div>
          </div>
          
          {/* Save button */}
          <div className="border-t border-slate-800 pt-4 flex justify-end">
            <button
              type="button"
              onClick={handleSaveBookingSettings}
              disabled={bookingSaving}
              className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {bookingSaving ? "Lagrer..." : "Lagre booking-innstillinger"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
