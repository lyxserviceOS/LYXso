// app/onboarding/OnboardingPageClient.tsx
"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Industry, ModuleCode } from "@/types/industry";
import { INDUSTRIES, ORG_MODULES, getRecommendedModules } from "@/types/industry";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID;

type Step = 1 | 2 | 3 | 4;

type FormState = {
  // Steg 1 – bedriftsinfo
  companyName: string;
  orgNumber: string;
  contactEmail: string;
  phone: string;
  website: string;
  addressLine1: string;
  postcode: string;
  city: string;
  // Tjenestetype (work mode)
  hasFixedLocation: boolean;
  isMobile: boolean;

  // Steg 2 – bransjevalg (flervalg)
  industries: Industry[];

  // Steg 3 – modulvalg
  enabledModules: ModuleCode[];
  wantsLandingPage: boolean;
  wantsWebshop: boolean;
  showBookingInMenu: boolean;

  // Steg 4 – landingsside
  heroTitle: string;
  heroSubtitle: string;
  primaryColor: string;
  ctaLabel: string;
  ctaSecondaryLabel: string;
};

type LoadingState =
  | { status: "idle" }
  | { status: "loading"; message?: string }
  | { status: "success"; message?: string }
  | { status: "error"; message: string };

// Default modules all orgs get
const DEFAULT_MODULES: ModuleCode[] = ["booking", "crm", "products", "employees", "leads"];

export default function OnboardingPageClient() {
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [existingLandingPage, setExistingLandingPage] = useState<Record<string, unknown> | null>(
    null
  );

  const [form, setForm] = useState<FormState>({
    companyName: "",
    orgNumber: "",
    contactEmail: "",
    phone: "",
    website: "",
    addressLine1: "",
    postcode: "",
    city: "",
    hasFixedLocation: true,
    isMobile: false,
    // Bransje
    industries: [],
    // Moduler
    enabledModules: [...DEFAULT_MODULES],
    wantsLandingPage: false,
    wantsWebshop: false,
    showBookingInMenu: true,
    // Landingsside
    heroTitle: "",
    heroSubtitle: "",
    primaryColor: "#2563eb",
    ctaLabel: "Book time",
    ctaSecondaryLabel: "Se tjenester",
  });

  const [loading, setLoading] = useState<LoadingState>({ status: "idle" });

  // Henter eksisterende landingsside-konfig ved første load
  useEffect(() => {
    if (!API_BASE || !ORG_ID) {
      console.error(
        "Mangler NEXT_PUBLIC_API_BASE eller NEXT_PUBLIC_ORG_ID i .env.local"
      );
      return;
    }

    async function fetchLandingPage() {
      try {
        setLoading({ status: "loading", message: "Laster eksisterende data..." });

        const res = await fetch(
          `${API_BASE}/api/orgs/${ORG_ID}/landing-page`
        );

        if (!res.ok) {
          console.warn("Klarte ikke å hente landingsside:", await res.text());
          setLoading({ status: "idle" });
          setInitialLoaded(true);
          return;
        }

        const data = await res.json();
        // Vi prøver å støtte både { landingPage: {...} } og direkte objekt
        const lp = data?.landingPage ?? data ?? null;

        setExistingLandingPage(lp ?? null);

        const config = (lp && (lp.config ?? lp)) || {};

        setForm((prev) => ({
          ...prev,
          companyName: config.companyName ?? prev.companyName,
          orgNumber: config.orgNumber ?? prev.orgNumber,
          contactEmail: config.contactEmail ?? prev.contactEmail,
          phone: config.phone ?? prev.phone,
          website: config.website ?? prev.website,
          addressLine1: config.addressLine1 ?? prev.addressLine1,
          postcode: config.postcode ?? prev.postcode,
          city: config.city ?? prev.city,
          hasFixedLocation: config.hasFixedLocation ?? prev.hasFixedLocation,
          isMobile: config.isMobile ?? prev.isMobile,
          // Industries
          industries: Array.isArray(config.industries) ? config.industries : prev.industries,
          // Modules
          enabledModules: Array.isArray(config.enabledModules) ? config.enabledModules : prev.enabledModules,
          wantsLandingPage: config.wantsLandingPage ?? config.landing_page_enabled ?? prev.wantsLandingPage,
          wantsWebshop: config.wantsWebshop ?? config.webshop_enabled ?? prev.wantsWebshop,
          showBookingInMenu: config.showBookingInMenu ?? config.show_booking_in_menu ?? prev.showBookingInMenu,
          // Landing page
          heroTitle:
            config.heroTitle ??
            prev.heroTitle ??
            "Bestill bilpleie og coating på nett",
          heroSubtitle:
            config.heroSubtitle ??
            prev.heroSubtitle ??
            "LYXso gir deg full kontroll på bookinger, kunder og inntekter.",
          primaryColor: config.primaryColor ?? prev.primaryColor ?? "#2563eb",
          ctaLabel: config.ctaLabel ?? prev.ctaLabel ?? "Book time",
          ctaSecondaryLabel:
            config.ctaSecondaryLabel ??
            prev.ctaSecondaryLabel ??
            "Se tjenester",
        }));

        setLoading({ status: "idle" });
      } catch (error: unknown) {
        console.error("Feil ved henting av landingsside:", error);
        setLoading({
          status: "error",
          message:
            "Klarte ikke å hente eksisterende oppsett. Du kan likevel fylle inn skjemaet og lagre.",
        });
      } finally {
        setInitialLoaded(true);
      }
    }

    if (!initialLoaded) {
      fetchLandingPage();
    }
  }, [initialLoaded]);

  function handleChange<K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleNextStep() {
    setLoading({ status: "idle" });
    
    // Step 1 validation: work mode
    if (step === 1) {
      if (!form.hasFixedLocation && !form.isMobile) {
        setLoading({
          status: "error",
          message: "Velg minst én tjenestetype (fast adresse eller mobil) før du fortsetter.",
        });
        return;
      }
      setStep(2);
      return;
    }
    
    // Step 2 validation: industries
    if (step === 2) {
      if (form.industries.length === 0) {
        setLoading({
          status: "error",
          message: "Velg minst én bransje før du fortsetter.",
        });
        return;
      }
      // Auto-suggest modules based on industries
      const recommended = getRecommendedModules(form.industries);
      setForm((prev) => ({
        ...prev,
        enabledModules: Array.from(new Set([...prev.enabledModules, ...recommended])),
      }));
      setStep(3);
      return;
    }
    
    // Step 3: modules - go to step 4 only if landing page is wanted
    if (step === 3) {
      if (form.wantsLandingPage) {
        setStep(4);
      }
      // If no landing page wanted, submit is available directly from step 3
      return;
    }
  }

  function handlePrevStep() {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
    else if (step === 4) setStep(3);
  }

  function toggleIndustry(industry: Industry) {
    setForm((prev) => {
      const exists = prev.industries.includes(industry);
      return {
        ...prev,
        industries: exists
          ? prev.industries.filter((i) => i !== industry)
          : [...prev.industries, industry],
      };
    });
  }

  function toggleModule(module: ModuleCode) {
    setForm((prev) => {
      const exists = prev.enabledModules.includes(module);
      // Don't allow disabling core modules
      if (DEFAULT_MODULES.includes(module) && exists) {
        return prev;
      }
      return {
        ...prev,
        enabledModules: exists
          ? prev.enabledModules.filter((m) => m !== module)
          : [...prev.enabledModules, module],
      };
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!API_BASE || !ORG_ID) {
      setLoading({
        status: "error",
        message:
          "Mangler API-konfigurasjon. Sjekk NEXT_PUBLIC_API_BASE og NEXT_PUBLIC_ORG_ID.",
      });
      return;
    }

    // Validate service type selection
    if (!form.hasFixedLocation && !form.isMobile) {
      setLoading({
        status: "error",
        message: "Velg minst én tjenestetype (fast adresse eller mobil).",
      });
      return;
    }

    try {
      setLoading({
        status: "loading",
        message: "Lagrer bedriftsprofil og landingsside...",
      });

      // Vi pakker alt inn i et config-objekt.
      // Compute work_mode from form checkboxes
      const workMode = form.hasFixedLocation && form.isMobile 
        ? "both" 
        : form.isMobile 
          ? "mobile" 
          : "fixed";

      const newConfig = {
        ...(typeof existingLandingPage?.config === 'object' ? existingLandingPage.config : {}),
        // Basic info
        companyName: form.companyName,
        orgNumber: form.orgNumber,
        contactEmail: form.contactEmail,
        phone: form.phone,
        website: form.website,
        addressLine1: form.addressLine1,
        postcode: form.postcode,
        city: form.city,
        // Work mode
        hasFixedLocation: form.hasFixedLocation,
        isMobile: form.isMobile,
        workMode,
        // Industries
        industries: form.industries,
        // Modules
        enabledModules: form.enabledModules,
        wantsLandingPage: form.wantsLandingPage,
        wantsWebshop: form.wantsWebshop,
        showBookingInMenu: form.showBookingInMenu,
        // Landing page settings
        heroTitle: form.heroTitle,
        heroSubtitle: form.heroSubtitle,
        primaryColor: form.primaryColor,
        ctaLabel: form.ctaLabel,
        ctaSecondaryLabel: form.ctaSecondaryLabel,
      };

      const payload = {
        ...(existingLandingPage ?? {}),
        config: newConfig,
      };

      const res = await fetch(
        `${API_BASE}/api/orgs/${ORG_ID}/landing-page`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Feil ved lagring av landing-page:", text);
        throw new Error(
          "Klarte ikke å lagre onboarding-data. Se konsollen for detaljer."
        );
      }

      setLoading({
        status: "success",
        message: "Onboarding lagret! Du sendes videre til kontrollpanelet.",
      });

      // Kort delay for å vise suksess, deretter til partner-kontrollpanel.
      setTimeout(() => {
        router.push("/kontrollpanel");
      }, 900);
    } catch (error: unknown) {
      console.error("Feil ved onboarding-lagring:", error);
      const errorMessage = error instanceof Error ? error.message : "Noe gikk galt ved lagring.";
      setLoading({
        status: "error",
        message: errorMessage,
      });
    }
  }

  const isSaving = loading.status === "loading";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-8 lg:py-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-blue-300/80">
            LYXso • Partner-onboarding
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Sett opp LYXso for bedriften din
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-2xl">
            Vi bruker denne informasjonen til å bygge bedriftsprofilen din,
            landingssiden og videre statistikk i kontrollpanelet. Du kan endre
            alt senere.
          </p>
        </header>

        {/* Stegindikator */}
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs">
          {[
            { num: 1, label: "Bedriftsinfo" },
            { num: 2, label: "Bransje" },
            { num: 3, label: "Moduler" },
            ...(form.wantsLandingPage ? [{ num: 4, label: "Landingsside" }] : []),
          ].map((s, idx, arr) => (
            <div key={s.num} className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${
                  step === s.num
                    ? "bg-blue-600 text-white"
                    : step > s.num
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-800 text-slate-200"
                }`}
              >
                {step > s.num ? "✓" : s.num}
              </span>
              <span
                className={
                  step === s.num ? "font-medium text-slate-100" : "text-slate-400"
                }
              >
                {s.label}
              </span>
              {idx < arr.length - 1 && (
                <div className="mx-2 h-px w-6 bg-slate-800 sm:w-12" />
              )}
            </div>
          ))}
        </div>

        {/* Status / meldinger */}
        {loading.status === "error" && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-950/40 px-3 py-2 text-xs text-red-100">
            {loading.message}
          </div>
        )}
        {loading.status === "success" && (
          <div className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-950/40 px-3 py-2 text-xs text-emerald-100">
            {loading.message ?? "Lagret!"}
          </div>
        )}
        {loading.status === "loading" && loading.message && (
          <div className="mb-4 rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs text-slate-200">
            {loading.message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-5 sm:px-6 sm:py-6 space-y-6"
        >
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-sm font-semibold text-slate-100">
                1. Bedriftsinformasjon
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300">
                    Bedriftsnavn
                  </label>
                  <input
                    type="text"
                    value={form.companyName}
                    onChange={(e) =>
                      handleChange("companyName", e.target.value)
                    }
                    className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500"
                    placeholder="F.eks. LYX Bilpleie Økern"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300">
                    Org.nr
                  </label>
                  <input
                    type="text"
                    value={form.orgNumber}
                    onChange={(e) =>
                      handleChange("orgNumber", e.target.value)
                    }
                    className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500"
                    placeholder="F.eks. 923 456 789"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500"
                    placeholder="+47 ..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300">
                    E-post
                  </label>
                  <input
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) =>
                      handleChange("contactEmail", e.target.value)
                    }
                    className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500"
                    placeholder="post@dinbedrift.no"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300">
                    Nettside
                  </label>
                  <input
                    type="text"
                    value={form.website}
                    onChange={(e) => handleChange("website", e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500"
                    placeholder="https://..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300">
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={form.addressLine1}
                    onChange={(e) =>
                      handleChange("addressLine1", e.target.value)
                    }
                    className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500"
                    placeholder="Gateadresse"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300">
                    Postnummer
                  </label>
                  <input
                    type="text"
                    value={form.postcode}
                    onChange={(e) => handleChange("postcode", e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500"
                    placeholder="F.eks. 0580"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300">
                    Sted
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500"
                    placeholder="Oslo"
                  />
                </div>
              </div>

              {/* Tjenestetype: Fast adresse, mobil, eller begge */}
              <div className="mt-4 border-t border-slate-800 pt-4">
                <p className="text-xs font-medium text-slate-300 mb-3">
                  Tjenestetype – hvordan tilbyr dere tjenestene?
                </p>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.hasFixedLocation}
                      onChange={(e) =>
                        handleChange("hasFixedLocation", e.target.checked)
                      }
                      className="mt-0.5 rounded border-slate-600 bg-slate-900"
                    />
                    <div>
                      <span className="text-sm text-slate-100">
                        Fast adresse / lokaler
                      </span>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Dere har et fast sted der kunder kommer for å få utført tjenester.
                      </p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isMobile}
                      onChange={(e) =>
                        handleChange("isMobile", e.target.checked)
                      }
                      className="mt-0.5 rounded border-slate-600 bg-slate-900"
                    />
                    <div>
                      <span className="text-sm text-slate-100">
                        Mobil tjeneste
                      </span>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Dere reiser ut til kunden for å utføre tjenester.
                      </p>
                    </div>
                  </label>
                </div>
                <p className="mt-2 text-[11px] text-slate-500">
                  Kryss av for begge hvis dere tilbyr både faste lokaler og mobil utrykning.
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-sm font-semibold text-slate-100">
                2. Hvilken bransje er du i?
              </h2>
              <p className="text-xs text-slate-400">
                Velg én eller flere bransjer som passer bedriften din. Dette hjelper oss å tilpasse moduler og funksjoner.
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {INDUSTRIES.map((industry) => {
                  const isSelected = form.industries.includes(industry.code);
                  return (
                    <label
                      key={industry.code}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition ${
                        isSelected
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-slate-700 hover:border-slate-600"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleIndustry(industry.code)}
                        className="mt-0.5 rounded border-slate-600 bg-slate-900"
                      />
                      <div>
                        <span className="text-sm font-medium text-slate-100">
                          {industry.label}
                        </span>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {industry.description}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>

              {form.industries.length > 0 && (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
                  <p className="text-xs text-emerald-200">
                    <strong>Valgt:</strong> {form.industries.map(i => 
                      INDUSTRIES.find(ind => ind.code === i)?.label
                    ).join(", ")}
                  </p>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-sm font-semibold text-slate-100">
                3. Hva vil du gjøre i LYXso?
              </h2>
              <p className="text-xs text-slate-400">
                Vi har valgt noen moduler basert på bransjen din. Du kan aktivere/deaktivere moduler her og i innstillinger senere.
              </p>

              {/* Core features - landing page and webshop */}
              <div className="border-t border-slate-800 pt-4">
                <p className="text-xs font-medium text-slate-300 mb-3">
                  Landingsside og nettbutikk
                </p>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-slate-700 hover:border-slate-600 transition">
                    <input
                      type="checkbox"
                      checked={form.wantsLandingPage}
                      onChange={(e) => handleChange("wantsLandingPage", e.target.checked)}
                      className="mt-0.5 rounded border-slate-600"
                    />
                    <div>
                      <span className="text-sm font-medium text-slate-100">
                        Egen landingsside
                      </span>
                      <p className="text-xs text-slate-400 mt-1">
                        Bygg en egen nettside for bedriften med booking, tjenester og kontaktinfo.
                      </p>
                    </div>
                  </label>

                  {form.wantsLandingPage && (
                    <>
                      <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-slate-700 hover:border-slate-600 transition ml-4">
                        <input
                          type="checkbox"
                          checked={form.showBookingInMenu}
                          onChange={(e) => handleChange("showBookingInMenu", e.target.checked)}
                          className="mt-0.5 rounded border-slate-600"
                        />
                        <div>
                          <span className="text-sm font-medium text-slate-100">
                            Vis booking i menyen
                          </span>
                          <p className="text-xs text-slate-400 mt-1">
                            La kundene booke direkte fra landingssiden.
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-slate-700 hover:border-slate-600 transition ml-4">
                        <input
                          type="checkbox"
                          checked={form.wantsWebshop}
                          onChange={(e) => handleChange("wantsWebshop", e.target.checked)}
                          className="mt-0.5 rounded border-slate-600"
                        />
                        <div>
                          <span className="text-sm font-medium text-slate-100">
                            Nettbutikk
                          </span>
                          <p className="text-xs text-slate-400 mt-1">
                            Selg produkter via landingssiden – fra partnere eller eget lager.
                          </p>
                        </div>
                      </label>
                    </>
                  )}
                </div>
              </div>

              {/* Module categories */}
              {["drift", "ai_marketing", "okonomi"].map((category) => {
                const categoryModules = ORG_MODULES.filter(m => m.category === category);
                const categoryLabel = {
                  drift: "Drift",
                  ai_marketing: "AI & markedsføring",
                  okonomi: "Økonomi",
                }[category];
                
                return (
                  <div key={category} className="border-t border-slate-800 pt-4">
                    <p className="text-xs font-medium text-slate-300 mb-3">
                      {categoryLabel}
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {categoryModules.map((module) => {
                        const isEnabled = form.enabledModules.includes(module.code);
                        const isCore = DEFAULT_MODULES.includes(module.code);
                        
                        return (
                          <label
                            key={module.code}
                            className={`flex items-start gap-3 cursor-pointer p-2 rounded-lg border transition ${
                              isEnabled
                                ? "border-blue-500/50 bg-blue-500/5"
                                : "border-slate-700/50 hover:border-slate-600"
                            } ${isCore ? "opacity-75" : ""}`}
                          >
                            <input
                              type="checkbox"
                              checked={isEnabled}
                              onChange={() => toggleModule(module.code)}
                              disabled={isCore}
                              className="mt-0.5 rounded border-slate-600"
                            />
                            <div>
                              <span className="text-xs font-medium text-slate-100">
                                {module.label}
                                {isCore && (
                                  <span className="ml-1 text-[10px] text-slate-500">(standard)</span>
                                )}
                              </span>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {module.description}
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-sm font-semibold text-slate-100">
                4. Landingsside & profil
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300">
                    Hovedoverskrift (hero)
                  </label>
                  <input
                    type="text"
                    value={form.heroTitle}
                    onChange={(e) => handleChange("heroTitle", e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500"
                    placeholder="Ett system for hele bil-driften."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300">
                    Undertekst
                  </label>
                  <textarea
                    value={form.heroSubtitle}
                    onChange={(e) =>
                      handleChange("heroSubtitle", e.target.value)
                    }
                    className="mt-1 min-h-[70px] w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500"
                    placeholder="Fortell kort hva dere tilbyr og hvorfor kunder bør velge dere."
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-[180px_minmax(0,1fr)]">
                  <div>
                    <label className="block text-xs font-medium text-slate-300">
                      Primærfarge
                    </label>
                    <input
                      type="color"
                      value={form.primaryColor}
                      onChange={(e) =>
                        handleChange("primaryColor", e.target.value)
                      }
                      className="mt-1 h-10 w-full rounded-md border border-slate-700 bg-slate-950"
                    />
                  </div>

                  <div className="space-y-3 text-xs text-slate-300">
                    <p>
                      Fargen brukes i knapper og markeringer på landingssiden
                      din.
                    </p>
                    <div className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                        Forhåndsvisning
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        {form.companyName || "Din bedrift"}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {form.heroSubtitle ||
                          "Slik vil teksten se ut i toppen av landingssiden."}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          style={{ backgroundColor: form.primaryColor }}
                          className="rounded-md px-3 py-1.5 text-xs font-medium text-white"
                        >
                          {form.ctaLabel || "Book time"}
                        </button>
                        <button
                          type="button"
                          className="rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-100"
                        >
                          {form.ctaSecondaryLabel || "Se tjenester"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-300">
                      Primær CTA-knapp
                    </label>
                    <input
                      type="text"
                      value={form.ctaLabel}
                      onChange={(e) => handleChange("ctaLabel", e.target.value)}
                      className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500"
                      placeholder="F.eks. Book time"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300">
                      Sekundær CTA-knapp
                    </label>
                    <input
                      type="text"
                      value={form.ctaSecondaryLabel}
                      onChange={(e) =>
                        handleChange("ctaSecondaryLabel", e.target.value)
                      }
                      className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500"
                      placeholder="F.eks. Se tjenester"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Knapper nederst */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-[11px] text-slate-500">
              Du kan endre dette senere fra innstillinger.
            </div>

            <div className="flex gap-2">
              {/* Back button - show on steps 2, 3, 4 */}
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-100 hover:border-slate-500"
                  disabled={isSaving}
                >
                  Tilbake
                </button>
              )}

              {/* Continue button - show on steps 1, 2, and 3 (if landing page selected) */}
              {(step === 1 || step === 2 || (step === 3 && form.wantsLandingPage)) && (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="rounded-md bg-blue-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-blue-500"
                >
                  Fortsett
                </button>
              )}

              {/* Submit button - show on step 3 (if no landing page) or step 4 */}
              {((step === 3 && !form.wantsLandingPage) || step === 4) && (
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-blue-500 disabled:opacity-60"
                  disabled={isSaving}
                >
                  {isSaving ? "Lagrer..." : "Fullfør onboarding"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
