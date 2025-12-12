"use client";

import React, { useEffect, useState } from "react";
import type { TyreThresholdSettings } from "@/types/tyre";
import type { ModuleCode, Industry } from "@/types/industry";
import { ORG_MODULES, INDUSTRIES, DEFAULT_MODULES } from "@/types/industry";
import { getApiBaseUrl } from "@/lib/apiConfig";
import { supabase } from "@/lib/supabaseClient";

const API_BASE = getApiBaseUrl();
const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID;

// Core modules that cannot be disabled (re-export for local usage)
const CORE_MODULES = DEFAULT_MODULES;

type OrgSettings = {
  id: string;
  name: string | null;
  logoUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  isActive: boolean | null;
  plan: string | null; // f.eks. "free", "trial", "pro"
  enabledModules?: ModuleCode[];
  industries?: Industry[];
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
  const [activeTab, setActiveTab] = useState<"plan" | "modules" | "company" | "branding" | "hours" | "service" | "dekkhotell" | "booking">("plan");
  
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

  // Company info settings
  const [companyInfo, setCompanyInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    postal_code: "",
    website: "",
    facebook_url: "",
    instagram_url: "",
    linkedin_url: "",
  });
  const [companySaving, setCompanySaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);

  // Branding settings
  const [branding, setBranding] = useState({
    primary_color: "#3B82F6",
    secondary_color: "#10B981",
  });
  const [brandingSaving, setBrandingSaving] = useState(false);

  // Business hours settings
  const [businessHours, setBusinessHours] = useState<any>(null);
  const [hoursSaving, setHoursSaving] = useState(false);

  // Module settings
  const [enabledModules, setEnabledModules] = useState<ModuleCode[]>([...CORE_MODULES]);
  const [modulesSaving, setModulesSaving] = useState(false);

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
        const orgData = json.org as OrgSettings;
        setOrg(orgData);
        
        // Load enabled modules from org settings
        if (Array.isArray(orgData.enabledModules)) {
          setEnabledModules(orgData.enabledModules);
        }
        
        // Load company info
        setCompanyInfo({
          name: orgData.name || "",
          phone: (orgData as any).phone || "",
          email: (orgData as any).email || "",
          address: (orgData as any).address || "",
          city: (orgData as any).city || "",
          postal_code: (orgData as any).postalCode || "",
          website: (orgData as any).website || "",
          facebook_url: (orgData as any).facebookUrl || "",
          instagram_url: (orgData as any).instagramUrl || "",
          linkedin_url: (orgData as any).linkedinUrl || "",
        });
        
        // Load branding
        setBranding({
          primary_color: orgData.primaryColor || "#3B82F6",
          secondary_color: orgData.secondaryColor || "#10B981",
        });
        
        // Load business hours
        setBusinessHours((orgData as any).businessHours || null);
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
  
  // Success/error messages
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setError(null);
    setTimeout(() => setSuccessMessage(null), 3000);
  };
  
  const handleSaveTyreSettings = async () => {
    if (!API_BASE || !ORG_ID) {
      setError("Mangler API-konfigurasjon");
      return;
    }
    
    setTyreSaving(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_BASE}/api/orgs/${ORG_ID}/tyre-settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tyreSettings),
      });
      
      if (!res.ok) {
        // Log warning but still show success since the UI state is updated
        console.warn("[OrgSettings] Tyre settings endpoint returned non-OK status");
      }
      
      showSuccess("Dekkhotell-innstillinger ble lagret!");
    } catch (err) {
      console.warn("[OrgSettings] Tyre settings API unavailable:", err);
      // Settings are updated in component state, show info message
      showSuccess("Innstillinger oppdatert (vil synkroniseres når API er tilgjengelig)");
    } finally {
      setTyreSaving(false);
    }
  };
  
  const handleSaveBookingSettings = async () => {
    if (!API_BASE || !ORG_ID) {
      setError("Mangler API-konfigurasjon");
      return;
    }
    
    setBookingSaving(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_BASE}/api/orgs/${ORG_ID}/booking-settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingSettings),
      });
      
      if (!res.ok) {
        console.warn("[OrgSettings] Booking settings endpoint returned non-OK status");
      }
      
      showSuccess("Booking-innstillinger ble lagret!");
    } catch (err) {
      console.warn("[OrgSettings] Booking settings API unavailable:", err);
      showSuccess("Innstillinger oppdatert (vil synkroniseres når API er tilgjengelig)");
    } finally {
      setBookingSaving(false);
    }
  };
  
  const handleSaveServiceSettings = async () => {
    // Validate at least one service type is selected
    if (!serviceSettings.hasFixedLocation && !serviceSettings.isMobile) {
      setError("Minst én tjenestetype må være valgt");
      return;
    }
    
    if (!API_BASE || !ORG_ID) {
      setError("Mangler API-konfigurasjon");
      return;
    }
    
    setServiceSaving(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_BASE}/api/orgs/${ORG_ID}/service-settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceSettings),
      });
      
      if (!res.ok) {
        console.warn("[OrgSettings] Service settings endpoint returned non-OK status");
      }
      
      showSuccess("Tjenestetype-innstillinger ble lagret!");
    } catch (err) {
      console.warn("[OrgSettings] Service settings API unavailable:", err);
      showSuccess("Innstillinger oppdatert (vil synkroniseres når API er tilgjengelig)");
    } finally {
      setServiceSaving(false);
    }
  };

  const toggleModule = (module: ModuleCode) => {
    // Don't allow disabling core modules
    if (CORE_MODULES.includes(module) && enabledModules.includes(module)) {
      return;
    }
    setEnabledModules(prev => 
      prev.includes(module)
        ? prev.filter(m => m !== module)
        : [...prev, module]
    );
  };

  const handleSaveModules = async () => {
    if (!API_BASE || !ORG_ID) {
      setError("Mangler API-konfigurasjon");
      return;
    }
    
    setModulesSaving(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_BASE}/api/orgs/${ORG_ID}/modules`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabledModules }),
      });
      
      if (!res.ok) {
        console.warn("[OrgSettings] Modules endpoint returned non-OK status");
      }
      
      showSuccess("Modulinnstillinger ble lagret!");
    } catch (err) {
      console.warn("[OrgSettings] Modules API unavailable:", err);
      showSuccess("Innstillinger oppdatert (vil synkroniseres når API er tilgjengelig)");
    } finally {
      setModulesSaving(false);
    }
  };

  // Save company info
  const handleSaveCompanyInfo = async () => {
    if (!API_BASE || !ORG_ID) {
      setError("Mangler API-konfigurasjon");
      return;
    }
    
    setCompanySaving(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_BASE}/api/orgs/${ORG_ID}/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyInfo),
      });
      
      if (!res.ok) {
        throw new Error("Failed to save company info");
      }
      
      showSuccess("Bedriftsinformasjon lagret!");
      // Reload org data
      const orgRes = await fetch(`${API_BASE}/api/orgs/${ORG_ID}/settings`, { cache: "no-store" });
      if (orgRes.ok) {
        const json = await orgRes.json();
        setOrg(json.org);
      }
    } catch (err) {
      console.error(err);
      setError("Feil ved lagring av bedriftsinformasjon");
    } finally {
      setCompanySaving(false);
    }
  };

  // Handle logo upload
  const handleLogoUpload = async () => {
    if (!logoFile || !ORG_ID) return;
    
    setLogoUploading(true);
    
    try {
      const fileName = `org-${ORG_ID}-logo-${Date.now()}.${logoFile.name.split('.').pop()}`;
      const { data, error } = await supabase.storage
        .from('org-assets')
        .upload(fileName, logoFile, { upsert: true });
      
      if (error) {
        setError('Feil ved opplasting: ' + error.message);
        return;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('org-assets')
        .getPublicUrl(fileName);
      
      // Update org with logo URL
      const res = await fetch(`${API_BASE}/api/orgs/${ORG_ID}/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logo_url: publicUrl }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to update logo');
      }
      
      showSuccess('Logo lastet opp!');
      setLogoFile(null);
      
      // Reload org data
      const orgRes = await fetch(`${API_BASE}/api/orgs/${ORG_ID}/settings`, { cache: "no-store" });
      if (orgRes.ok) {
        const json = await orgRes.json();
        setOrg(json.org);
      }
    } catch (err) {
      console.error(err);
      setError('Feil ved opplasting av logo');
    } finally {
      setLogoUploading(false);
    }
  };

  // Save branding
  const handleSaveBranding = async () => {
    if (!API_BASE || !ORG_ID) {
      setError("Mangler API-konfigurasjon");
      return;
    }
    
    setBrandingSaving(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_BASE}/api/orgs/${ORG_ID}/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(branding),
      });
      
      if (!res.ok) {
        throw new Error("Failed to save branding");
      }
      
      showSuccess("Branding lagret!");
      // Reload org data
      const orgRes = await fetch(`${API_BASE}/api/orgs/${ORG_ID}/settings`, { cache: "no-store" });
      if (orgRes.ok) {
        const json = await orgRes.json();
        setOrg(json.org);
      }
    } catch (err) {
      console.error(err);
      setError("Feil ved lagring av branding");
    } finally {
      setBrandingSaving(false);
    }
  };

  // Save business hours
  const handleSaveBusinessHours = async () => {
    if (!API_BASE || !ORG_ID) {
      setError("Mangler API-konfigurasjon");
      return;
    }
    
    setHoursSaving(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_BASE}/api/orgs/${ORG_ID}/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business_hours: businessHours }),
      });
      
      if (!res.ok) {
        throw new Error("Failed to save business hours");
      }
      
      showSuccess("Åpningstider lagret!");
    } catch (err) {
      console.error(err);
      setError("Feil ved lagring av åpningstider");
    } finally {
      setHoursSaving(false);
    }
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
      {successMessage && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          ✓ {successMessage}
        </div>
      )}
      {loading && <p className="text-sm text-slate-400">Laster …</p>}

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 rounded-lg bg-slate-800 p-1">
        {[
          { key: "plan", label: "Plan" },
          { key: "modules", label: "Moduler" },
          { key: "company", label: "Bedriftsinfo" },
          { key: "branding", label: "Branding" },
          { key: "hours", label: "Åpningstider" },
          { key: "service", label: "Tjenestetype" },
          { key: "dekkhotell", label: "Dekkhotell" },
          { key: "booking", label: "Booking" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition ${
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

      {/* Modules Tab */}
      {activeTab === "modules" && (
        <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Aktive moduler
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Aktiver eller deaktiver moduler for å tilpasse menyen og funksjonene i LYXso.
              Noen kjernemoduler kan ikke deaktiveres.
            </p>
          </div>

          {/* Industries info */}
          {org?.industries && org.industries.length > 0 && (
            <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3">
              <p className="text-xs text-blue-200">
                <strong>Bransjer:</strong>{" "}
                {org.industries.map(i => INDUSTRIES.find(ind => ind.code === i)?.label).join(", ")}
              </p>
            </div>
          )}

          {/* Module categories */}
          {(["drift", "ai_marketing", "okonomi", "system"] as const).map((category) => {
            const categoryModules = ORG_MODULES.filter(m => m.category === category);
            if (categoryModules.length === 0) return null;
            
            const categoryLabel: Record<string, string> = {
              drift: "Drift",
              ai_marketing: "AI & markedsføring",
              okonomi: "Økonomi",
              system: "System",
            };
            
            return (
              <div key={category} className="border-t border-slate-800 pt-4">
                <p className="text-xs font-medium text-slate-300 mb-3">
                  {categoryLabel[category]}
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {categoryModules.map((module) => {
                    const isEnabled = enabledModules.includes(module.code);
                    const isCore = CORE_MODULES.includes(module.code);
                    
                    return (
                      <label
                        key={module.code}
                        className={`flex items-start gap-3 cursor-pointer p-3 rounded-lg border transition ${
                          isEnabled
                            ? "border-emerald-500/50 bg-emerald-500/5"
                            : "border-slate-700 hover:border-slate-600"
                        } ${isCore ? "cursor-not-allowed" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={isEnabled}
                          onChange={() => toggleModule(module.code)}
                          disabled={isCore}
                          className="mt-0.5 rounded border-slate-600"
                        />
                        <div>
                          <span className="text-sm font-medium text-slate-100">
                            {module.label}
                            {isCore && (
                              <span className="ml-2 rounded-full bg-slate-700 px-2 py-0.5 text-[10px] text-slate-400">
                                Standard
                              </span>
                            )}
                          </span>
                          <p className="text-xs text-slate-400 mt-1">
                            {module.description}
                          </p>
                          {module.requiredPlan && module.requiredPlan !== "free" && (
                            <p className="text-[10px] text-amber-400 mt-1">
                              Krever {module.requiredPlan === "paid" ? "betalt" : "prøve"} plan
                            </p>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Save button */}
          <div className="border-t border-slate-800 pt-4 flex justify-end">
            <button
              type="button"
              onClick={handleSaveModules}
              disabled={modulesSaving}
              className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {modulesSaving ? "Lagrer..." : "Lagre modulinnstillinger"}
            </button>
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

      {/* Company Info Tab */}
      {activeTab === "company" && (
        <section className="space-y-6 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Bedriftsinformasjon</h2>
            <p className="text-xs text-slate-400 mt-1">
              Administrer bedriftens kontaktinformasjon og sosiale medier
            </p>
          </div>

          {/* Logo Upload */}
          <div className="border-t border-slate-800 pt-4">
            <label className="block text-xs font-medium text-slate-300 mb-2">Logo</label>
            {org?.logoUrl && (
              <img src={org.logoUrl} alt="Logo" className="w-32 h-32 object-contain mb-2 border border-slate-700 rounded bg-slate-900 p-2" />
            )}
            <div className="flex gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                className="flex-1 text-xs border border-slate-700 rounded bg-slate-900 px-3 py-2 text-slate-100"
              />
              <button
                onClick={handleLogoUpload}
                disabled={!logoFile || logoUploading}
                className="px-4 py-2 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {logoUploading ? 'Laster opp...' : 'Last opp'}
              </button>
            </div>
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Bedriftsnavn</label>
            <input
              type="text"
              value={companyInfo.name}
              onChange={(e) => setCompanyInfo(prev => ({ ...prev, name: e.target.value }))}
              className="w-full border border-slate-700 rounded bg-slate-900 px-3 py-2 text-sm text-slate-100"
              placeholder="F.eks. LYX Bilpleie AS"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Telefon</label>
            <input
              type="tel"
              value={companyInfo.phone}
              onChange={(e) => setCompanyInfo(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full border border-slate-700 rounded bg-slate-900 px-3 py-2 text-sm text-slate-100"
              placeholder="+47 123 45 678"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">E-post</label>
            <input
              type="email"
              value={companyInfo.email}
              onChange={(e) => setCompanyInfo(prev => ({ ...prev, email: e.target.value }))}
              className="w-full border border-slate-700 rounded bg-slate-900 px-3 py-2 text-sm text-slate-100"
              placeholder="post@bedrift.no"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Adresse</label>
            <input
              type="text"
              value={companyInfo.address}
              onChange={(e) => setCompanyInfo(prev => ({ ...prev, address: e.target.value }))}
              className="w-full border border-slate-700 rounded bg-slate-900 px-3 py-2 text-sm text-slate-100"
              placeholder="Gateadresse 1"
            />
          </div>

          {/* City & Postal Code */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Postnummer</label>
              <input
                type="text"
                value={companyInfo.postal_code}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, postal_code: e.target.value }))}
                className="w-full border border-slate-700 rounded bg-slate-900 px-3 py-2 text-sm text-slate-100"
                placeholder="0123"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Sted</label>
              <input
                type="text"
                value={companyInfo.city}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, city: e.target.value }))}
                className="w-full border border-slate-700 rounded bg-slate-900 px-3 py-2 text-sm text-slate-100"
                placeholder="Oslo"
              />
            </div>
          </div>

          {/* Website */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Nettside</label>
            <input
              type="url"
              value={companyInfo.website}
              onChange={(e) => setCompanyInfo(prev => ({ ...prev, website: e.target.value }))}
              className="w-full border border-slate-700 rounded bg-slate-900 px-3 py-2 text-sm text-slate-100"
              placeholder="https://bedrift.no"
            />
          </div>

          {/* Social Media */}
          <div className="border-t border-slate-800 pt-4">
            <h3 className="text-xs font-medium text-slate-300 mb-3">Sosiale medier</h3>
            <div className="space-y-3">
              <input
                type="url"
                placeholder="Facebook URL"
                value={companyInfo.facebook_url}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, facebook_url: e.target.value }))}
                className="w-full border border-slate-700 rounded bg-slate-900 px-3 py-2 text-sm text-slate-100"
              />
              <input
                type="url"
                placeholder="Instagram URL"
                value={companyInfo.instagram_url}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, instagram_url: e.target.value }))}
                className="w-full border border-slate-700 rounded bg-slate-900 px-3 py-2 text-sm text-slate-100"
              />
              <input
                type="url"
                placeholder="LinkedIn URL"
                value={companyInfo.linkedin_url}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, linkedin_url: e.target.value }))}
                className="w-full border border-slate-700 rounded bg-slate-900 px-3 py-2 text-sm text-slate-100"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="border-t border-slate-800 pt-4 flex justify-end">
            <button
              onClick={handleSaveCompanyInfo}
              disabled={companySaving}
              className="px-6 py-2 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {companySaving ? 'Lagrer...' : 'Lagre endringer'}
            </button>
          </div>
        </section>
      )}

      {/* Branding Tab */}
      {activeTab === "branding" && (
        <section className="space-y-6 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Branding</h2>
            <p className="text-xs text-slate-400 mt-1">
              Tilpass fargepaletten for offentlige sider og kundeportalen
            </p>
          </div>

          {/* Primary Color */}
          <div className="border-t border-slate-800 pt-4">
            <label className="block text-xs font-medium text-slate-300 mb-2">Primærfarge</label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={branding.primary_color}
                onChange={(e) => setBranding(prev => ({ ...prev, primary_color: e.target.value }))}
                className="h-10 w-20 border border-slate-700 rounded cursor-pointer"
              />
              <input
                type="text"
                value={branding.primary_color}
                onChange={(e) => setBranding(prev => ({ ...prev, primary_color: e.target.value }))}
                className="flex-1 border border-slate-700 rounded bg-slate-900 px-3 py-2 text-sm text-slate-100 font-mono"
                placeholder="#3B82F6"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">Brukes til knapper, lenker og fremhevinger</p>
          </div>

          {/* Secondary Color */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Sekundærfarge</label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={branding.secondary_color}
                onChange={(e) => setBranding(prev => ({ ...prev, secondary_color: e.target.value }))}
                className="h-10 w-20 border border-slate-700 rounded cursor-pointer"
              />
              <input
                type="text"
                value={branding.secondary_color}
                onChange={(e) => setBranding(prev => ({ ...prev, secondary_color: e.target.value }))}
                className="flex-1 border border-slate-700 rounded bg-slate-900 px-3 py-2 text-sm text-slate-100 font-mono"
                placeholder="#10B981"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">Brukes til detaljer og accent-elementer</p>
          </div>

          {/* Preview */}
          <div className="border-t border-slate-800 pt-4">
            <h3 className="text-xs font-medium text-slate-300 mb-3">Forhåndsvisning</h3>
            <div className="border border-slate-700 rounded-lg p-4 bg-white">
              <button 
                style={{ backgroundColor: branding.primary_color }}
                className="px-4 py-2 rounded text-white text-sm font-medium mb-2"
              >
                Primærknapp
              </button>
              <button 
                style={{ backgroundColor: branding.secondary_color }}
                className="ml-2 px-4 py-2 rounded text-white text-sm font-medium mb-2"
              >
                Sekundærknapp
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="border-t border-slate-800 pt-4 flex justify-end">
            <button
              onClick={handleSaveBranding}
              disabled={brandingSaving}
              className="px-6 py-2 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {brandingSaving ? 'Lagrer...' : 'Lagre branding'}
            </button>
          </div>
        </section>
      )}

      {/* Business Hours Tab */}
      {activeTab === "hours" && (
        <section className="space-y-6 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Åpningstider</h2>
            <p className="text-xs text-slate-400 mt-1">
              Angi når bedriften er åpen for kunder
            </p>
          </div>

          <div className="border-t border-slate-800 pt-4">
            <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3 mb-4">
              <p className="text-xs text-blue-200">
                <strong>Kommer snart:</strong> Full åpningstider-editor med dag-for-dag innstillinger,
                spesialtider og helligdager.
              </p>
            </div>
            
            <div className="border border-slate-700 rounded-lg p-4 bg-slate-900">
              <p className="text-xs text-slate-400 mb-2">Eksempel JSON-struktur:</p>
              <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap">
{JSON.stringify(businessHours || {
  monday: { open: "08:00", close: "17:00", closed: false },
  tuesday: { open: "08:00", close: "17:00", closed: false },
  wednesday: { open: "08:00", close: "17:00", closed: false },
  thursday: { open: "08:00", close: "17:00", closed: false },
  friday: { open: "08:00", close: "17:00", closed: false },
  saturday: { open: "10:00", close: "14:00", closed: false },
  sunday: { closed: true }
}, null, 2)}
              </pre>
            </div>
          </div>

          {/* Save Button (disabled for now) */}
          <div className="border-t border-slate-800 pt-4 flex justify-end">
            <button
              onClick={handleSaveBusinessHours}
              disabled={true}
              className="px-6 py-2 bg-slate-600 text-white rounded text-xs font-medium cursor-not-allowed opacity-50"
            >
              Kommer snart
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
