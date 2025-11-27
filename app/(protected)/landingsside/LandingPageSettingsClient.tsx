"use client";

import React, { useEffect, useState, FormEvent, useRef } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

type Service = {
  title: string;
  description: string;
  icon?: string;
  price?: string;
};

type OpeningHour = {
  day: string;
  open: string;
  close: string;
  closed: boolean;
};

type LandingPageSettings = {
  // Hero section
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string;
  hero_cta_text: string;
  hero_cta_link: string;

  // About section
  about_title: string;
  about_content: string;
  about_image_url: string;

  // Services section
  services_title: string;
  services_content: Service[];

  // Contact section
  show_contact: boolean;
  contact_title: string;
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  contact_map_url: string;

  // Social media
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;

  // Appearance
  primary_color: string;
  secondary_color: string;
  font_family: string;
  logo_url: string;

  // Opening hours (Module 21)
  opening_hours: OpeningHour[];

  // SEO
  meta_title: string;
  meta_description: string;
  meta_keywords: string;

  // Settings
  is_published: boolean;
  show_booking_widget: boolean;
  custom_css: string;
};

const DEFAULT_OPENING_HOURS: OpeningHour[] = [
  { day: 'Mandag', open: '08:00', close: '17:00', closed: false },
  { day: 'Tirsdag', open: '08:00', close: '17:00', closed: false },
  { day: 'Onsdag', open: '08:00', close: '17:00', closed: false },
  { day: 'Torsdag', open: '08:00', close: '17:00', closed: false },
  { day: 'Fredag', open: '08:00', close: '17:00', closed: false },
  { day: 'Lørdag', open: '10:00', close: '15:00', closed: false },
  { day: 'Søndag', open: '', close: '', closed: true },
];

const EMPTY_FORM: LandingPageSettings = {
  hero_title: "",
  hero_subtitle: "",
  hero_image_url: "",
  hero_cta_text: "Book time",
  hero_cta_link: "",
  about_title: "Om oss",
  about_content: "",
  about_image_url: "",
  services_title: "Våre tjenester",
  services_content: [],
  show_contact: true,
  contact_title: "Kontakt oss",
  contact_phone: "",
  contact_email: "",
  contact_address: "",
  contact_map_url: "",
  facebook_url: "",
  instagram_url: "",
  linkedin_url: "",
  primary_color: "#3B82F6",
  secondary_color: "#10B981",
  font_family: "Inter",
  logo_url: "",
  opening_hours: DEFAULT_OPENING_HOURS,
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
  is_published: false,
  show_booking_widget: true,
  custom_css: "",
};

export default function LandingPageSettingsClient() {
  const [form, setForm] = useState<LandingPageSettings>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'services' | 'contact' | 'hours' | 'appearance' | 'seo'>('hero');
  const [showPreview, setShowPreview] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // URL som vises til partneren
  const [publicUrl, setPublicUrl] = useState<string | null>(null);

  // Image upload states
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingAbout, setUploadingAbout] = useState(false);
  const heroFileRef = useRef<HTMLInputElement>(null);
  const aboutFileRef = useRef<HTMLInputElement>(null);

  // -----------------------------
  // IMAGE UPLOAD TO SUPABASE STORAGE
  // -----------------------------
  const uploadImage = async (file: File, bucket: string = 'landing-pages'): Promise<string> => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !ORG_ID) {
      throw new Error('Mangler Supabase-konfigurasjon');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${ORG_ID}/${Date.now()}.${fileExt}`;

    const formData = new FormData();
    formData.append('file', file);

    const uploadRes = await fetch(
      `${SUPABASE_URL}/storage/v1/object/${bucket}/${fileName}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: formData,
      }
    );

    if (!uploadRes.ok) {
      throw new Error('Opplasting feilet');
    }

    return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${fileName}`;
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingHero(true);
    setError(null);

    try {
      const url = await uploadImage(file);
      setForm(p => ({ ...p, hero_image_url: url }));
      setSuccess('Bilde lastet opp!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Kunne ikke laste opp bilde');
    } finally {
      setUploadingHero(false);
    }
  };

  const handleAboutImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAbout(true);
    setError(null);

    try {
      const url = await uploadImage(file);
      setForm(p => ({ ...p, about_image_url: url }));
      setSuccess('Bilde lastet opp!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Kunne ikke laste opp bilde');
    } finally {
      setUploadingAbout(false);
    }
  };

  // -----------------------------
  // Hent eksisterende innstillinger
  // -----------------------------
  useEffect(() => {
    if (!API_BASE || !ORG_ID) {
      setError(
        "Mangler API-konfigurasjon (NEXT_PUBLIC_API_BASE / NEXT_PUBLIC_ORG_ID)."
      );
      setLoading(false);
      return;
    }

    async function load() {
      setLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const res = await fetch(
          `${API_BASE}/api/orgs/${ORG_ID}/landing-page`
        );

        if (!res.ok) {
          const text = await res.text();
          throw new Error(
            `Feil ved henting: ${res.status} ${res.statusText} - ${text}`
          );
        }

        const json = await res.json();
        const lp = json.data || {};

        // Bygg public URL
        let computedUrl: string | null = null;

        if (typeof window !== "undefined") {
          const origin = window.location.origin;
          computedUrl = `${origin}/p/${ORG_ID}`;
        }

        setPublicUrl(computedUrl);

        // Sett inn i skjema
        setForm({
          hero_title: lp.hero_title || "",
          hero_subtitle: lp.hero_subtitle || "",
          hero_image_url: lp.hero_image_url || "",
          hero_cta_text: lp.hero_cta_text || "Book time",
          hero_cta_link: lp.hero_cta_link || "",
          about_title: lp.about_title || "Om oss",
          about_content: lp.about_content || "",
          about_image_url: lp.about_image_url || "",
          services_title: lp.services_title || "Våre tjenester",
          services_content: Array.isArray(lp.services_content) ? lp.services_content : [],
          show_contact: lp.show_contact !== false,
          contact_title: lp.contact_title || "Kontakt oss",
          contact_phone: lp.contact_phone || "",
          contact_email: lp.contact_email || "",
          contact_address: lp.contact_address || "",
          contact_map_url: lp.contact_map_url || "",
          facebook_url: lp.facebook_url || "",
          instagram_url: lp.instagram_url || "",
          linkedin_url: lp.linkedin_url || "",
          primary_color: lp.primary_color || "#3B82F6",
          secondary_color: lp.secondary_color || "#10B981",
          font_family: lp.font_family || "Inter",
          logo_url: lp.logo_url || "",
          opening_hours: Array.isArray(lp.opening_hours) && lp.opening_hours.length > 0 ? lp.opening_hours : DEFAULT_OPENING_HOURS,
          meta_title: lp.meta_title || "",
          meta_description: lp.meta_description || "",
          meta_keywords: lp.meta_keywords || "",
          is_published: lp.is_published === true,
          show_booking_widget: lp.show_booking_widget !== false,
          custom_css: lp.custom_css || "",
        });
      } catch (err) {
        console.error("Load error:", err);
        setError("Kunne ikke hente landingsside-innstillinger.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // -----------------------------
  // LAGRING
  // -----------------------------
  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!API_BASE || !ORG_ID) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(
        `${API_BASE}/api/orgs/${ORG_ID}/landing-page`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Feil ved lagring: ${text}`);
      }

      setSuccess("Landingsside-innstillinger lagret.");
    } catch (err) {
      console.error("Save error:", err);
      setError("Kunne ikke lagre landingsside-innstillinger.");
    } finally {
      setSaving(false);
    }
  }

  // Helper functions
  const addService = () => {
    setForm(p => ({
      ...p,
      services_content: [
        ...p.services_content,
        { title: "", description: "", icon: "", price: "" }
      ]
    }));
  };

  const updateService = (index: number, field: keyof Service, value: string) => {
    setForm(p => ({
      ...p,
      services_content: p.services_content.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      )
    }));
  };

  const removeService = (index: number) => {
    setForm(p => ({
      ...p,
      services_content: p.services_content.filter((_, i) => i !== index)
    }));
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-600">Laster...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Landingsside</h1>
          {publicUrl && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-600">Din landingsside:</span>
              <a
                href={publicUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                {publicUrl}
              </a>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 border rounded-lg hover:bg-slate-50 text-sm"
          >
            {showPreview ? "Skjul" : "Vis"} forhåndsvisning
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
          >
            {saving ? "Lagrer..." : "Lagre"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-6">
          {[
            { id: 'hero', label: 'Hero' },
            { id: 'about', label: 'Om oss' },
            { id: 'services', label: 'Tjenester' },
            { id: 'contact', label: 'Kontakt' },
            { id: 'hours', label: 'Åpningstider' },
            { id: 'appearance', label: 'Utseende' },
            { id: 'seo', label: 'SEO' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Hero Section */}
            {activeTab === 'hero' && (
              <div className="bg-white rounded-lg border p-6 space-y-4">
                <h2 className="text-xl font-semibold">Hero-seksjon</h2>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Tittel</label>
                  <input
                    type="text"
                    value={form.hero_title}
                    onChange={e => setForm(p => ({ ...p, hero_title: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Velkommen til vår tjeneste"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Undertittel</label>
                  <textarea
                    value={form.hero_subtitle}
                    onChange={e => setForm(p => ({ ...p, hero_subtitle: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="En kort beskrivelse av hva du tilbyr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bilde URL</label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={form.hero_image_url}
                        onChange={e => setForm(p => ({ ...p, hero_image_url: e.target.value }))}
                        className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://example.com/hero.jpg eller last opp"
                      />
                      <button
                        type="button"
                        onClick={() => heroFileRef.current?.click()}
                        disabled={uploadingHero}
                        className="px-4 py-2 border rounded-lg hover:bg-slate-50 disabled:opacity-50 flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        {uploadingHero ? 'Laster...' : 'Last opp'}
                      </button>
                    </div>
                    <input
                      ref={heroFileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleHeroImageUpload}
                      className="hidden"
                    />
                    {form.hero_image_url && (
                      <div className="relative group">
                        <img src={form.hero_image_url} alt="Hero" className="w-full h-48 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => setForm(p => ({ ...p, hero_image_url: '' }))}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">CTA-tekst</label>
                    <input
                      type="text"
                      value={form.hero_cta_text}
                      onChange={e => setForm(p => ({ ...p, hero_cta_text: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Book time"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CTA-lenke</label>
                    <input
                      type="text"
                      value={form.hero_cta_link}
                      onChange={e => setForm(p => ({ ...p, hero_cta_link: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="#booking"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* About Section */}
            {activeTab === 'about' && (
              <div className="bg-white rounded-lg border p-6 space-y-4">
                <h2 className="text-xl font-semibold">Om oss</h2>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Tittel</label>
                  <input
                    type="text"
                    value={form.about_title}
                    onChange={e => setForm(p => ({ ...p, about_title: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Om oss"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Innhold</label>
                  <textarea
                    value={form.about_content}
                    onChange={e => setForm(p => ({ ...p, about_content: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={6}
                    placeholder="Fortell om bedriften din..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bilde URL</label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={form.about_image_url}
                        onChange={e => setForm(p => ({ ...p, about_image_url: e.target.value }))}
                        className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://example.com/about.jpg eller last opp"
                      />
                      <button
                        type="button"
                        onClick={() => aboutFileRef.current?.click()}
                        disabled={uploadingAbout}
                        className="px-4 py-2 border rounded-lg hover:bg-slate-50 disabled:opacity-50 flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        {uploadingAbout ? 'Laster...' : 'Last opp'}
                      </button>
                    </div>
                    <input
                      ref={aboutFileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAboutImageUpload}
                      className="hidden"
                    />
                    {form.about_image_url && (
                      <div className="relative group">
                        <img src={form.about_image_url} alt="About" className="w-full h-48 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => setForm(p => ({ ...p, about_image_url: '' }))}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Services Section */}
            {activeTab === 'services' && (
              <div className="bg-white rounded-lg border p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Tjenester</h2>
                  <button
                    type="button"
                    onClick={addService}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    + Legg til tjeneste
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Seksjonstittel</label>
                  <input
                    type="text"
                    value={form.services_title}
                    onChange={e => setForm(p => ({ ...p, services_title: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Våre tjenester"
                  />
                </div>

                <div className="space-y-4">
                  {form.services_content.map((service, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3 bg-slate-50">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Tjeneste {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeService(index)}
                          className="text-red-600 text-sm hover:text-red-700"
                        >
                          Fjern
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={service.title}
                          onChange={e => updateService(index, 'title', e.target.value)}
                          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Tjenestenavn"
                        />
                        <input
                          type="text"
                          value={service.price || ''}
                          onChange={e => updateService(index, 'price', e.target.value)}
                          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Pris (valgfritt)"
                        />
                      </div>

                      <textarea
                        value={service.description}
                        onChange={e => updateService(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows={2}
                        placeholder="Beskrivelse"
                      />

                      <input
                        type="text"
                        value={service.icon || ''}
                        onChange={e => updateService(index, 'icon', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Ikon (emoji eller URL)"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Section */}
            {activeTab === 'contact' && (
              <div className="bg-white rounded-lg border p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Kontakt</h2>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.show_contact}
                      onChange={e => setForm(p => ({ ...p, show_contact: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Vis kontaktseksjon</span>
                  </label>
                </div>

                {form.show_contact && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Seksjonstittel</label>
                      <input
                        type="text"
                        value={form.contact_title}
                        onChange={e => setForm(p => ({ ...p, contact_title: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Kontakt oss"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Telefon</label>
                        <input
                          type="tel"
                          value={form.contact_phone}
                          onChange={e => setForm(p => ({ ...p, contact_phone: e.target.value }))}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="+47 123 45 678"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">E-post</label>
                        <input
                          type="email"
                          value={form.contact_email}
                          onChange={e => setForm(p => ({ ...p, contact_email: e.target.value }))}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="post@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Adresse</label>
                      <input
                        type="text"
                        value={form.contact_address}
                        onChange={e => setForm(p => ({ ...p, contact_address: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Gateadresse 1, 0123 Oslo"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Google Maps URL</label>
                      <input
                        type="text"
                        value={form.contact_map_url}
                        onChange={e => setForm(p => ({ ...p, contact_map_url: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="https://maps.google.com/..."
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-2">
                      <div>
                        <label className="block text-sm font-medium mb-2">Facebook</label>
                        <input
                          type="text"
                          value={form.facebook_url}
                          onChange={e => setForm(p => ({ ...p, facebook_url: e.target.value }))}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="facebook.com/..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Instagram</label>
                        <input
                          type="text"
                          value={form.instagram_url}
                          onChange={e => setForm(p => ({ ...p, instagram_url: e.target.value }))}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="instagram.com/..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">LinkedIn</label>
                        <input
                          type="text"
                          value={form.linkedin_url}
                          onChange={e => setForm(p => ({ ...p, linkedin_url: e.target.value }))}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="linkedin.com/..."
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Opening Hours Section */}
            {activeTab === 'hours' && (
              <div className="bg-white rounded-lg border p-6 space-y-4">
                <h2 className="text-xl font-semibold">Åpningstider</h2>
                <p className="text-sm text-slate-600">
                  Sett åpningstider som vises på landingssiden din
                </p>

                <div className="space-y-3">
                  {form.opening_hours.map((hour, index) => (
                    <div key={hour.day} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                      <div className="w-24 font-medium text-sm">{hour.day}</div>
                      
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!hour.closed}
                          onChange={e => {
                            const newHours = [...form.opening_hours];
                            newHours[index] = { ...newHours[index], closed: !e.target.checked };
                            setForm(p => ({ ...p, opening_hours: newHours }));
                          }}
                          className="rounded"
                        />
                        <span className="text-sm text-slate-600">Åpent</span>
                      </label>

                      {!hour.closed && (
                        <>
                          <input
                            type="time"
                            value={hour.open}
                            onChange={e => {
                              const newHours = [...form.opening_hours];
                              newHours[index] = { ...newHours[index], open: e.target.value };
                              setForm(p => ({ ...p, opening_hours: newHours }));
                            }}
                            className="px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-slate-400">–</span>
                          <input
                            type="time"
                            value={hour.close}
                            onChange={e => {
                              const newHours = [...form.opening_hours];
                              newHours[index] = { ...newHours[index], close: e.target.value };
                              setForm(p => ({ ...p, opening_hours: newHours }));
                            }}
                            className="px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </>
                      )}

                      {hour.closed && (
                        <span className="text-sm text-slate-500 italic">Stengt</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-slate-500">
                    Åpningstidene vises i kontaktseksjonen på landingssiden og i kundeportalen.
                  </p>
                </div>
              </div>
            )}

            {/* Appearance Section */}
            {activeTab === 'appearance' && (
              <div className="bg-white rounded-lg border p-6 space-y-4">
                <h2 className="text-xl font-semibold">Utseende</h2>

                {/* Logo */}
                <div>
                  <label className="block text-sm font-medium mb-2">Logo</label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={form.logo_url}
                      onChange={e => setForm(p => ({ ...p, logo_url: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com/logo.png"
                    />
                    {form.logo_url && (
                      <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                        <img src={form.logo_url} alt="Logo preview" className="h-12 w-auto" />
                        <button
                          type="button"
                          onClick={() => setForm(p => ({ ...p, logo_url: '' }))}
                          className="text-red-600 text-sm hover:text-red-700"
                        >
                          Fjern
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-slate-500">
                      Logoen vises i headeren på landingssiden og i kundeportalen
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Primærfarge</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={form.primary_color}
                        onChange={e => setForm(p => ({ ...p, primary_color: e.target.value }))}
                        className="h-10 w-20 border rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={form.primary_color}
                        onChange={e => setForm(p => ({ ...p, primary_color: e.target.value }))}
                        className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="#3B82F6"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Sekundærfarge</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={form.secondary_color}
                        onChange={e => setForm(p => ({ ...p, secondary_color: e.target.value }))}
                        className="h-10 w-20 border rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={form.secondary_color}
                        onChange={e => setForm(p => ({ ...p, secondary_color: e.target.value }))}
                        className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="#10B981"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Font</label>
                  <select
                    value={form.font_family}
                    onChange={e => setForm(p => ({ ...p, font_family: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Poppins">Poppins</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.show_booking_widget}
                      onChange={e => setForm(p => ({ ...p, show_booking_widget: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Vis bookingwidget</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tilpasset CSS (avansert)</label>
                  <textarea
                    value={form.custom_css}
                    onChange={e => setForm(p => ({ ...p, custom_css: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                    rows={8}
                    placeholder=".hero { background: gradient(...) }"
                  />
                </div>
              </div>
            )}

            {/* SEO Section */}
            {activeTab === 'seo' && (
              <div className="bg-white rounded-lg border p-6 space-y-4">
                <h2 className="text-xl font-semibold">SEO & Metadata</h2>

                <div>
                  <label className="block text-sm font-medium mb-2">Meta tittel</label>
                  <input
                    type="text"
                    value={form.meta_title}
                    onChange={e => setForm(p => ({ ...p, meta_title: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Bedriftsnavn - Tjenestebeskrivelse"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {form.meta_title.length}/60 tegn (anbefalt: 50-60)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Meta beskrivelse</label>
                  <textarea
                    value={form.meta_description}
                    onChange={e => setForm(p => ({ ...p, meta_description: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="En kort beskrivelse som vises i søkeresultater"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {form.meta_description.length}/160 tegn (anbefalt: 150-160)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Nøkkelord (kommaseparert)</label>
                  <input
                    type="text"
                    value={form.meta_keywords}
                    onChange={e => setForm(p => ({ ...p, meta_keywords: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="bilpleie, bilpolering, vask"
                  />
                </div>

                <div className="pt-4 border-t">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.is_published}
                      onChange={e => setForm(p => ({ ...p, is_published: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm font-medium">Publiser landingsside</span>
                  </label>
                  <p className="text-xs text-slate-500 mt-1">
                    Når publisert, vil siden være synlig på {publicUrl}
                  </p>
                </div>
              </div>
            )}

          </form>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="lg:col-span-1">
            <div className="sticky top-6 bg-white rounded-lg border p-4 space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto">
              <h3 className="font-semibold">Forhåndsvisning</h3>
              
              {/* Hero Preview */}
              <div className="border rounded-lg p-4 space-y-2" style={{ backgroundColor: form.primary_color + '10' }}>
                {form.hero_image_url && (
                  <img src={form.hero_image_url} alt="Hero" className="w-full h-32 object-cover rounded" />
                )}
                <h4 className="font-bold text-lg" style={{ color: form.primary_color }}>
                  {form.hero_title || 'Hero tittel'}
                </h4>
                <p className="text-sm text-slate-600">
                  {form.hero_subtitle || 'Hero undertittel'}
                </p>
                <button 
                  className="px-4 py-2 rounded text-white text-sm font-medium"
                  style={{ backgroundColor: form.primary_color }}
                >
                  {form.hero_cta_text}
                </button>
              </div>

              {/* Services Preview */}
              {form.services_content.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-semibold text-sm">{form.services_title}</h5>
                  {form.services_content.slice(0, 3).map((service, i) => (
                    <div key={i} className="border rounded p-2 text-xs">
                      <div className="font-medium">{service.icon} {service.title || 'Tjeneste'}</div>
                      {service.price && <div className="text-slate-600">{service.price}</div>}
                    </div>
                  ))}
                </div>
              )}

              {/* Contact Preview */}
              {form.show_contact && (
                <div className="border-t pt-4 space-y-1 text-xs">
                  <h5 className="font-semibold">{form.contact_title}</h5>
                  {form.contact_phone && <div>📞 {form.contact_phone}</div>}
                  {form.contact_email && <div>📧 {form.contact_email}</div>}
                  {form.contact_address && <div>📍 {form.contact_address}</div>}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Full-screen preview modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
              <div>
                <h3 className="text-xl font-bold">Forhåndsvisning av landingsside</h3>
                <p className="text-sm text-slate-600">Slik vil siden se ut for besøkende</p>
              </div>
              <div className="flex gap-3">
                {publicUrl && form.is_published && (
                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border rounded-lg hover:bg-slate-50 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Åpne live
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className="text-slate-400 hover:text-slate-600 p-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="bg-slate-50">
              {/* Hero Section Preview */}
              {form.hero_title && (
                <div className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
                  {form.hero_image_url ? (
                    <>
                      <img 
                        src={form.hero_image_url} 
                        alt="Hero background" 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40"></div>
                    </>
                  ) : (
                    <div 
                      className="absolute inset-0"
                      style={{ background: `linear-gradient(135deg, ${form.primary_color}22 0%, ${form.secondary_color}22 100%)` }}
                    ></div>
                  )}
                  
                  <div className="relative z-10 text-center px-8 max-w-4xl">
                    <h1 
                      className="text-5xl md:text-6xl font-bold mb-6"
                      style={{ color: form.hero_image_url ? 'white' : form.primary_color }}
                    >
                      {form.hero_title}
                    </h1>
                    {form.hero_subtitle && (
                      <p 
                        className="text-xl md:text-2xl mb-8"
                        style={{ color: form.hero_image_url ? 'rgba(255,255,255,0.9)' : '#475569' }}
                      >
                        {form.hero_subtitle}
                      </p>
                    )}
                    {form.hero_cta_text && (
                      <button 
                        className="px-8 py-4 rounded-lg text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
                        style={{ backgroundColor: form.primary_color }}
                      >
                        {form.hero_cta_text}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* About Section Preview */}
              {form.about_content && (
                <div className="bg-white py-16 px-8">
                  <div className="max-w-6xl mx-auto">
                    <h2 
                      className="text-4xl font-bold mb-8 text-center"
                      style={{ color: form.primary_color }}
                    >
                      {form.about_title}
                    </h2>
                    <div className={`grid gap-12 ${form.about_image_url ? 'md:grid-cols-2' : 'grid-cols-1 max-w-3xl mx-auto'} items-center`}>
                      <div className="prose prose-lg max-w-none">
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                          {form.about_content}
                        </p>
                      </div>
                      {form.about_image_url && (
                        <img 
                          src={form.about_image_url} 
                          alt="About" 
                          className="rounded-xl shadow-lg w-full h-80 object-cover"
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Services Section Preview */}
              {form.services_content.length > 0 && (
                <div className="bg-slate-50 py-16 px-8">
                  <div className="max-w-6xl mx-auto">
                    <h2 
                      className="text-4xl font-bold mb-12 text-center"
                      style={{ color: form.primary_color }}
                    >
                      {form.services_title}
                    </h2>
                    <div className={`grid gap-8 ${form.services_content.length === 1 ? 'max-w-md mx-auto' : form.services_content.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : 'md:grid-cols-3'}`}>
                      {form.services_content.map((svc, idx) => (
                        <div 
                          key={idx} 
                          className="bg-white border-2 border-slate-200 rounded-xl p-8 hover:shadow-xl hover:border-blue-300 transition-all group"
                        >
                          {svc.icon && (
                            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                              {svc.icon}
                            </div>
                          )}
                          <h3 className="text-2xl font-bold mb-3" style={{ color: form.primary_color }}>
                            {svc.title}
                          </h3>
                          <p className="text-slate-600 mb-4 leading-relaxed">
                            {svc.description}
                          </p>
                          {svc.price && (
                            <p className="text-2xl font-bold" style={{ color: form.secondary_color }}>
                              {svc.price}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Section Preview */}
              {form.show_contact && (
                <div className="bg-white py-16 px-8">
                  <div className="max-w-6xl mx-auto">
                    <h2 
                      className="text-4xl font-bold mb-12 text-center"
                      style={{ color: form.primary_color }}
                    >
                      {form.contact_title}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        {form.contact_phone && (
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: form.primary_color + '20' }}>
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-sm text-slate-600">Telefon</div>
                              <div className="text-lg font-semibold">{form.contact_phone}</div>
                            </div>
                          </div>
                        )}
                        {form.contact_email && (
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: form.primary_color + '20' }}>
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-sm text-slate-600">E-post</div>
                              <div className="text-lg font-semibold">{form.contact_email}</div>
                            </div>
                          </div>
                        )}
                        {form.contact_address && (
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: form.primary_color + '20' }}>
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-sm text-slate-600">Adresse</div>
                              <div className="text-lg font-semibold">{form.contact_address}</div>
                            </div>
                          </div>
                        )}
                        
                        {/* Social Media */}
                        {(form.facebook_url || form.instagram_url || form.linkedin_url) && (
                          <div className="pt-6 border-t">
                            <div className="text-sm text-slate-600 mb-3">Følg oss</div>
                            <div className="flex gap-3">
                              {form.facebook_url && (
                                <a 
                                  href={form.facebook_url}
                                  className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                                  style={{ backgroundColor: form.primary_color }}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <span className="text-white font-bold">f</span>
                                </a>
                              )}
                              {form.instagram_url && (
                                <a 
                                  href={form.instagram_url}
                                  className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                                  style={{ backgroundColor: form.primary_color }}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <span className="text-white font-bold">ig</span>
                                </a>
                              )}
                              {form.linkedin_url && (
                                <a 
                                  href={form.linkedin_url}
                                  className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                                  style={{ backgroundColor: form.primary_color }}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <span className="text-white font-bold">in</span>
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {form.contact_map_url && (
                        <div className="rounded-xl overflow-hidden shadow-lg h-80">
                          <iframe
                            src={form.contact_map_url}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          ></iframe>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Booking Widget Preview */}
              {form.show_booking_widget && (
                <div className="bg-slate-100 py-16 px-8">
                  <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
                    <h3 className="text-2xl font-bold mb-4" style={{ color: form.primary_color }}>
                      Book en time
                    </h3>
                    <p className="text-slate-600 mb-6">
                      Velg ønsket tjeneste og tidspunkt
                    </p>
                    <button 
                      className="px-8 py-3 rounded-lg text-white font-semibold"
                      style={{ backgroundColor: form.secondary_color }}
                    >
                      Se ledige timer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
