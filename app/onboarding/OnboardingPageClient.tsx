// app/onboarding/OnboardingPageClient.tsx
"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID;

type Step = 1 | 2;

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
  // Tjenestetype
  hasFixedLocation: boolean;
  isMobile: boolean;

  // Steg 2 – landingsside
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

export default function OnboardingPageClient() {
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [existingLandingPage, setExistingLandingPage] = useState<any | null>(
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
      } catch (error: any) {
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
    // Validate at least one service type is selected before moving to step 2
    if (!form.hasFixedLocation && !form.isMobile) {
      setLoading({
        status: "error",
        message: "Velg minst én tjenestetype (fast adresse eller mobil) før du fortsetter.",
      });
      return;
    }
    setLoading({ status: "idle" });
    setStep((prev) => (prev === 1 ? 2 : prev));
  }

  function handlePrevStep() {
    setStep((prev) => (prev === 2 ? 1 : prev));
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
      const newConfig = {
        ...(existingLandingPage?.config ?? {}),
        companyName: form.companyName,
        orgNumber: form.orgNumber,
        contactEmail: form.contactEmail,
        phone: form.phone,
        website: form.website,
        addressLine1: form.addressLine1,
        postcode: form.postcode,
        city: form.city,
        hasFixedLocation: form.hasFixedLocation,
        isMobile: form.isMobile,
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
    } catch (error: any) {
      console.error("Feil ved onboarding-lagring:", error);
      setLoading({
        status: "error",
        message:
          error?.message ??
          "Noe gikk galt ved lagring. Prøv igjen om et øyeblikk.",
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
        <div className="mb-6 flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${
                step === 1
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-200"
              }`}
            >
              1
            </span>
            <span
              className={
                step === 1 ? "font-medium text-slate-100" : "text-slate-400"
              }
            >
              Bedriftsinformasjon
            </span>
          </div>
          <div className="h-px flex-1 bg-slate-800" />
          <div className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${
                step === 2
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-200"
              }`}
            >
              2
            </span>
            <span
              className={
                step === 2 ? "font-medium text-slate-100" : "text-slate-400"
              }
            >
              Landingsside & profil
            </span>
          </div>
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
                2. Landingsside & profil
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
              Du kan endre dette senere fra kontrollpanelet.
            </div>

            <div className="flex gap-2">
              {step === 2 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-100 hover:border-slate-500"
                  disabled={isSaving}
                >
                  Tilbake
                </button>
              )}

              {step === 1 && (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="rounded-md bg-blue-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-blue-500"
                >
                  Fortsett
                </button>
              )}

              {step === 2 && (
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
