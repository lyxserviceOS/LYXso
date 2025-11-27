// app/(protected)/white-label/WhiteLabelClient.tsx
"use client";

import React, { useState } from "react";
import type { WhiteLabelConfig } from "@/types/whitelabel";

const DEFAULT_CONFIG: WhiteLabelConfig = {
  id: "wl-1",
  org_id: "demo",
  
  custom_domain: null,
  domain_verified: false,
  domain_ssl_enabled: false,
  
  logo_url: null,
  logo_dark_url: null,
  favicon_url: null,
  
  primary_color: "#2563eb",
  secondary_color: "#1e40af",
  accent_color: "#3b82f6",
  background_color: "#ffffff",
  text_color: "#1e293b",
  
  font_family: "Inter",
  heading_font_family: "Inter",
  
  email_logo_url: null,
  email_from_name: "LYX Bil",
  email_from_address: "booking@lyxbil.no",
  email_footer_text: "LYX Bil AS | Org.nr: 123456789",
  
  sms_sender_name: "LYXBil",
  
  social_links: {
    facebook: "https://facebook.com/lyxbil",
    instagram: "https://instagram.com/lyxbil",
  },
  
  footer_company_name: "LYX Bil AS",
  footer_address: "Industrigata 1, 0181 Oslo",
  footer_links: [
    { label: "Personvern", url: "/personvern" },
    { label: "Vilkår", url: "/vilkar" },
  ],
  
  privacy_policy_url: "/personvern",
  terms_url: "/vilkar",
  
  is_active: true,
  created_at: "2024-01-01",
  updated_at: "2024-11-27",
};

export default function WhiteLabelClient() {
  const [config, setConfig] = useState<WhiteLabelConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<"branding" | "domain" | "email" | "legal">("branding");
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
    }, 1000);
  };

  const handleColorChange = (field: keyof WhiteLabelConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">White-label konfigurasjon</h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Tilpass utseendet på LYXso for din bedrift. Legg til egen logo, farger, domene og 
          merkevarebygging på alle kundeberøringspunkter.
        </p>
      </header>

      {/* Preview Banner */}
      <section className="rounded-xl overflow-hidden" style={{ backgroundColor: config.primary_color }}>
        <div className="flex items-center justify-between px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            {config.logo_url ? (
              <img src={config.logo_url} alt="Logo" className="h-8" />
            ) : (
              <div className="h-8 w-8 rounded bg-white/20 flex items-center justify-center text-sm font-bold">
                {config.email_from_name?.charAt(0) || "L"}
              </div>
            )}
            <span className="font-semibold">{config.email_from_name || "Din bedrift"}</span>
          </div>
          <span className="text-xs opacity-75">Forhåndsvisning av merkevare</span>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-slate-200 p-1">
        {[
          { key: "branding", label: "Farger & logo" },
          { key: "domain", label: "Domene" },
          { key: "email", label: "E-post & SMS" },
          { key: "legal", label: "Juridisk" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
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

      {/* Branding Tab */}
      {activeTab === "branding" && (
        <div className="space-y-6">
          {/* Logo Upload */}
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Logo</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Hovedlogo (lys bakgrunn)
                </label>
                <div className="rounded-lg border-2 border-dashed border-slate-300 p-6 text-center">
                  {config.logo_url ? (
                    <img src={config.logo_url} alt="Logo" className="max-h-16 mx-auto" />
                  ) : (
                    <>
                      <div className="text-3xl mb-2">🖼️</div>
                      <p className="text-sm text-slate-500">Klikk for å laste opp</p>
                      <p className="text-xs text-slate-400">PNG, SVG (maks 2MB)</p>
                    </>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Logo for mørk bakgrunn
                </label>
                <div className="rounded-lg border-2 border-dashed border-slate-300 p-6 text-center bg-slate-900">
                  {config.logo_dark_url ? (
                    <img src={config.logo_dark_url} alt="Logo (dark)" className="max-h-16 mx-auto" />
                  ) : (
                    <>
                      <div className="text-3xl mb-2">🖼️</div>
                      <p className="text-sm text-slate-400">Klikk for å laste opp</p>
                      <p className="text-xs text-slate-500">PNG, SVG (maks 2MB)</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Colors */}
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Farger</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <ColorPicker
                label="Primærfarge"
                value={config.primary_color}
                onChange={(v) => handleColorChange("primary_color", v)}
              />
              <ColorPicker
                label="Sekundærfarge"
                value={config.secondary_color}
                onChange={(v) => handleColorChange("secondary_color", v)}
              />
              <ColorPicker
                label="Aksentfarge"
                value={config.accent_color}
                onChange={(v) => handleColorChange("accent_color", v)}
              />
              <ColorPicker
                label="Bakgrunnsfarge"
                value={config.background_color}
                onChange={(v) => handleColorChange("background_color", v)}
              />
              <ColorPicker
                label="Tekstfarge"
                value={config.text_color}
                onChange={(v) => handleColorChange("text_color", v)}
              />
            </div>
          </section>

          {/* Typography */}
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Typografi</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Brødtekst
                </label>
                <select
                  value={config.font_family || "Inter"}
                  onChange={(e) => setConfig(prev => ({ ...prev, font_family: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Lato">Lato</option>
                  <option value="Poppins">Poppins</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Overskrifter
                </label>
                <select
                  value={config.heading_font_family || "Inter"}
                  onChange={(e) => setConfig(prev => ({ ...prev, heading_font_family: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Playfair Display">Playfair Display</option>
                  <option value="Poppins">Poppins</option>
                </select>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Domain Tab */}
      {activeTab === "domain" && (
        <div className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Eget domene</h2>
            <p className="text-sm text-slate-500 mb-4">
              Bruk ditt eget domene for bookingsiden, f.eks. booking.dinbedrift.no
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Domene
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={config.custom_domain || ""}
                    onChange={(e) => setConfig(prev => ({ ...prev, custom_domain: e.target.value }))}
                    placeholder="booking.dinbedrift.no"
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Verifiser
                  </button>
                </div>
              </div>

              {config.custom_domain && (
                <div className="rounded-lg bg-slate-50 p-4 space-y-3">
                  <p className="text-sm font-medium text-slate-700">DNS-oppsett</p>
                  <p className="text-xs text-slate-500">
                    Legg til følgende CNAME-post hos din DNS-leverandør:
                  </p>
                  <div className="rounded bg-slate-100 p-3 font-mono text-xs">
                    <p>Type: CNAME</p>
                    <p>Navn: {config.custom_domain?.split(".")[0] || "booking"}</p>
                    <p>Verdi: partners.lyxso.no</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${config.domain_verified ? "bg-emerald-500" : "bg-amber-500"}`} />
                    <span className="text-xs text-slate-600">
                      {config.domain_verified ? "Domene verifisert" : "Venter på verifisering"}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${config.domain_ssl_enabled ? "bg-emerald-500" : "bg-slate-300"}`} />
                    <span className="text-xs text-slate-600">
                      {config.domain_ssl_enabled ? "SSL aktivert" : "SSL aktiveres automatisk etter verifisering"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <h3 className="font-medium text-blue-900 mb-2">Standard URL</h3>
            <p className="text-sm text-blue-700">
              Uten eget domene brukes: <code className="bg-blue-100 px-1 rounded">lyxso.no/p/din-org</code>
            </p>
          </section>
        </div>
      )}

      {/* Email & SMS Tab */}
      {activeTab === "email" && (
        <div className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">E-post</h2>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Avsendernavn
                  </label>
                  <input
                    type="text"
                    value={config.email_from_name || ""}
                    onChange={(e) => setConfig(prev => ({ ...prev, email_from_name: e.target.value }))}
                    placeholder="Din Bedrift"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Avsenderadresse
                  </label>
                  <input
                    type="email"
                    value={config.email_from_address || ""}
                    onChange={(e) => setConfig(prev => ({ ...prev, email_from_address: e.target.value }))}
                    placeholder="booking@dinbedrift.no"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Bunntekst i e-poster
                </label>
                <input
                  type="text"
                  value={config.email_footer_text || ""}
                  onChange={(e) => setConfig(prev => ({ ...prev, email_footer_text: e.target.value }))}
                  placeholder="Bedrift AS | Org.nr: 123456789"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">SMS</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Avsendernavn (maks 11 tegn)
              </label>
              <input
                type="text"
                value={config.sms_sender_name || ""}
                onChange={(e) => setConfig(prev => ({ ...prev, sms_sender_name: e.target.value.slice(0, 11) }))}
                placeholder="DinBedrift"
                maxLength={11}
                className="w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <p className="text-xs text-slate-500 mt-1">
                {(config.sms_sender_name?.length || 0)}/11 tegn
              </p>
            </div>
          </section>
        </div>
      )}

      {/* Legal Tab */}
      {activeTab === "legal" && (
        <div className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Juridisk informasjon</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Firmanavn i bunn
                </label>
                <input
                  type="text"
                  value={config.footer_company_name || ""}
                  onChange={(e) => setConfig(prev => ({ ...prev, footer_company_name: e.target.value }))}
                  placeholder="Din Bedrift AS"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Adresse
                </label>
                <input
                  type="text"
                  value={config.footer_address || ""}
                  onChange={(e) => setConfig(prev => ({ ...prev, footer_address: e.target.value }))}
                  placeholder="Gateadressen 1, 0000 By"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Link til personvernerklæring
                  </label>
                  <input
                    type="url"
                    value={config.privacy_policy_url || ""}
                    onChange={(e) => setConfig(prev => ({ ...prev, privacy_policy_url: e.target.value }))}
                    placeholder="https://dinbedrift.no/personvern"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Link til vilkår
                  </label>
                  <input
                    type="url"
                    value={config.terms_url || ""}
                    onChange={(e) => setConfig(prev => ({ ...prev, terms_url: e.target.value }))}
                    placeholder="https://dinbedrift.no/vilkar"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Sosiale medier</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Facebook
                </label>
                <input
                  type="url"
                  value={config.social_links?.facebook || ""}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    social_links: { ...prev.social_links, facebook: e.target.value } 
                  }))}
                  placeholder="https://facebook.com/dinbedrift"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Instagram
                </label>
                <input
                  type="url"
                  value={config.social_links?.instagram || ""}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    social_links: { ...prev.social_links, instagram: e.target.value } 
                  }))}
                  placeholder="https://instagram.com/dinbedrift"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Lagrer..." : "Lagre endringer"}
        </button>
      </div>
    </div>
  );
}

function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-10 rounded border border-slate-300 cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono"
        />
      </div>
    </div>
  );
}
