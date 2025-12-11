"use client";

import React, { FormEvent, useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAiOnboarding } from "@/lib/hooks/useAiOnboarding";
import { useReCaptcha } from "@/hooks/useReCaptcha";
import ReCaptcha from "@/components/ReCaptcha";
import SlugInput from "@/components/SlugInput";
import { Step2_1_BasicInfo } from "@/components/register/Step2_1_BasicInfo";
import { Step2_2_ServicesAndPricing } from "@/components/register/Step2_2_ServicesAndPricing";
import { Step2_3_OpeningHoursAndCapacity } from "@/components/register/Step2_3_OpeningHoursAndCapacity";
import { Step2_4_AISuggestions } from "@/components/register/Step2_4_AISuggestions";
import Step3_AddressAndMap from "@/components/register/Step3_AddressAndMap";
import type { OnboardingStepData, OnboardingInput } from "@/types/ai-onboarding";
import { getApiBaseUrl } from "@/lib/apiConfig";

const API_BASE_URL = getApiBaseUrl();

const STORAGE_KEY = "lyxso_register_onboarding_data";

type Step1FormState = {
  fullName: string;
  email: string;
  password: string;
  companySlug: string;
  agreeToTerms: boolean;
  receiveMarketing: boolean;
  listInMarketplace: boolean;
};

type WizardStep = "step1" | "step2.1" | "step2.2" | "step2.3" | "step2.4" | "step3";

const initialOnboardingData: OnboardingStepData = {
  industries: [],
  locationType: null,
  orgDescription: "",
  selectedServices: [],
  customServices: [],
  priceLevel: null,
  openingHours: {
    monday: { open: "09:00", close: "17:00" },
    tuesday: { open: "09:00", close: "17:00" },
    wednesday: { open: "09:00", close: "17:00" },
    thursday: { open: "09:00", close: "17:00" },
    friday: { open: "09:00", close: "17:00" },
    saturday: null,
    sunday: null,
  },
  capacityHeavyJobsPerDay: 3,
};

type AddressData = {
  country: string;
  city: string;
  postalCode: string;
  streetAddress: string;
  lat: number | null;
  lng: number | null;
  markerMatchesAddress: boolean;
};

const initialAddressData: AddressData = {
  country: "NO",
  city: "",
  postalCode: "",
  streetAddress: "",
  lat: null,
  lng: null,
  markerMatchesAddress: false,
};

export default function RegisterPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-400">Laster...</p>
      </div>
    }>
      <RegisterPage />
    </Suspense>
  );


function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState<WizardStep>("step1");
  const [step1Form, setStep1Form] = useState<Step1FormState>({
    fullName: "",
    email: "",
    password: "",
    companySlug: "",
    agreeToTerms: false,
    receiveMarketing: false,
    listInMarketplace: false,
  });
  const [onboardingData, setOnboardingData] = useState<OnboardingStepData>(initialOnboardingData);
  const [addressData, setAddressData] = useState<AddressData>(initialAddressData);
  const [step1Loading, setStep1Loading] = useState(false);
  const [step1Error, setStep1Error] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string>("");
  const [lastOnboardingInput, setLastOnboardingInput] = useState<OnboardingInput | null>(null);
  
  // reCAPTCHA
  const { recaptchaRef, verify, reset: resetRecaptcha } = useReCaptcha();
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  
  // Slug validation
  const [slugError, setSlugError] = useState<string>("");
  
  // AI hints state for step 2
  const [aiHintsEnabledStep2, setAiHintsEnabledStep2] = useState(true);

  const {
    loading: aiLoading,
    error: aiError,
    session: aiSession,
    runOnboarding,
    applyOnboarding,
    retryRun,
  } = useAiOnboarding();

  // Check for OAuth callback parameters
  useEffect(() => {
    const step = searchParams.get("step");
    const orgIdParam = searchParams.get("orgId");
    
    if (step && orgIdParam) {
      console.log("[RegisterPage] OAuth callback detected:", { step, orgIdParam });
      // User came from OAuth callback, set step and orgId
      const validSteps: WizardStep[] = ["step1", "step2.1", "step2.2", "step2.3", "step2.4"];
      if (validSteps.includes(step as WizardStep)) {
        setCurrentStep(step as WizardStep);
        setOrgId(orgIdParam);
        console.log("[RegisterPage] Set currentStep to:", step, "and orgId to:", orgIdParam);
      } else {
        console.warn("[RegisterPage] Invalid step in URL:", step);
        setCurrentStep("step1");
      }
    }
  }, [searchParams]);

  // Load persisted data on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setOnboardingData(parsed);
      }
    } catch (err) {
      console.error("Failed to load persisted onboarding data:", err);
    }
  }, []);

  // Persist data on change (only for step2)
  useEffect(() => {
    if (currentStep !== "step1") {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(onboardingData));
      } catch (err) {
        console.error("Failed to persist onboarding data:", err);
      }
    }
  }, [onboardingData, currentStep]);

  // Step 1: User registration
  async function handleStep1Submit(e: FormEvent) {
    e.preventDefault();
    setStep1Error(null);
    setSlugError("");
    setStep1Loading(true);

    try {
      // 1) Validate terms agreement
      if (!step1Form.agreeToTerms) {
        setStep1Error("Du må godta vilkår og personvern for å fortsette");
        setStep1Loading(false);
        return;
      }

      // 2) Validate slug
      if (!step1Form.companySlug || step1Form.companySlug.length < 3) {
        setSlugError("Firma-URL må være minst 3 tegn");
        setStep1Loading(false);
        return;
      }

      // 3) Final slug check
      const slugRes = await fetch(`${API_BASE_URL}/api/orgs/validate-slug?slug=${step1Form.companySlug}`);
      const slugData = await slugRes.json();
      
      if (!slugData.available) {
        setSlugError(slugData.message || "Denne URL-adressen er ikke tilgjengelig");
        setStep1Loading(false);
        return;
      }

      // 4) Verify reCAPTCHA
      if (!recaptchaToken) {
        setStep1Error("Vennligst bekreft at du ikke er en robot");
        setStep1Loading(false);
        return;
      }

      const captchaValid = await verify(recaptchaToken);
      if (!captchaValid) {
        setStep1Error("reCAPTCHA-verifisering feilet. Vennligst prøv igjen.");
        resetRecaptcha();
        setRecaptchaToken(null);
        setStep1Loading(false);
        return;
      }

      // 5) Create user in Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: step1Form.email.trim(),
        password: step1Form.password,
        options: {
          data: {
            full_name: step1Form.fullName.trim() || null,
          },
        },
      });

      if (signUpError) {
        console.error("Supabase signUp error:", signUpError);
        
        // Check for rate limit error
        const errorMessage = signUpError.message?.toLowerCase() || "";
        const isRateLimit = 
          errorMessage.includes("email rate limit exceeded") ||
          errorMessage.includes("rate limit") ||
          (signUpError as any).status === 429;
        
        if (isRateLimit) {
          setStep1Error(
            "For mange registreringsforsøk på kort tid. Vent litt og prøv igjen, eller bruk en annen e-postadresse."
          );
        } else {
          setStep1Error("Kunne ikke opprette bruker. Sjekk e-post og passord.");
        }
        
        setStep1Loading(false);
        return;
      }

      const userId = data.user?.id;
      if (!userId) {
        console.error("Supabase signUp – mangler user.id", data);
        setStep1Error("Kunne ikke hente bruker-id fra Supabase.");
        setStep1Loading(false);
        return;
      }

      // 2) Create org + org_member via API
      const tempCompanyName = `${step1Form.fullName.trim() || "Bedrift"} AS`;
      setCompanyName(tempCompanyName);

      try {
        console.log("[Register] Calling create-org-from-signup with:", {
          userId,
          email: step1Form.email.trim(),
          fullName: step1Form.fullName.trim() || null,
          companyName: tempCompanyName,
          companySlug: step1Form.companySlug,
        });

        const res = await fetch(
          `${API_BASE_URL}/api/public/create-org-from-signup`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              email: step1Form.email.trim(),
              fullName: step1Form.fullName.trim() || null,
              companyName: tempCompanyName,
              companySlug: step1Form.companySlug,
              preferences: {
                receiveMarketing: step1Form.receiveMarketing,
                listInMarketplace: step1Form.listInMarketplace,
              },
            }),
          }
        );

        console.log("[Register] API response status:", res.status);

        if (!res.ok) {
          const body = await res.text().catch(() => "");
          console.error("[Register] create-org-from-signup error:", {
            status: res.status,
            statusText: res.statusText,
            body
          });
          
          // Try to parse error message from body
          let errorMessage = "Bruker ble opprettet, men kunne ikke opprette organisasjon.";
          try {
            const errorJson = JSON.parse(body);
            if (errorJson.error) {
              errorMessage += ` (${errorJson.error})`;
            }
            if (errorJson.details) {
              console.error("[Register] Error details:", errorJson.details);
            }
          } catch (e) {
            // Not JSON, log raw body
            console.error("[Register] Raw error body:", body);
          }
          
          setStep1Error(errorMessage);
          setStep1Loading(false);
          return;
        }

        const json = await res.json().catch(() => null);
        console.log("[Register] create-org-from-signup OK:", json);

        // Extract orgId from response
        if (json?.org?.id) {
          setOrgId(json.org.id);
        }
      } catch (orgErr) {
        console.error("Feil ved kall til create-org-from-signup:", orgErr);
        setStep1Error("Kunne ikke opprette organisasjon.");
        setStep1Loading(false);
        return;
      }

      // 3) Move to step 2 without auto-login
      // (Supabase requires email confirmation before sign-in)
      setCurrentStep("step2.1");
    } catch (err) {
      console.error("Uventet feil i step1:", err);
      setStep1Error("Uventet feil ved registrering.");
    } finally {
      setStep1Loading(false);
    }
  }

  function handleStep1Change(field: keyof Step1FormState, value: string | boolean) {
    setStep1Form((prev) => ({ ...prev, [field]: value }));
  }

  // Step 2: Onboarding data updates
  function handleOnboardingDataChange(data: Partial<OnboardingStepData>) {
    setOnboardingData((prev) => ({ ...prev, ...data }));
  }

  // Navigate to step 2.4 and run AI onboarding
  async function handleMoveToAISuggestions() {
    // Validate orgId
    if (!orgId || orgId.trim() === "") {
      setStep1Error("Mangler gyldig org ID. Kan ikke fortsette til AI-steget.");
      return;
    }

    // Validate required fields
    if (!onboardingData.industries || onboardingData.industries.length === 0) {
      setStep1Error("Vennligst velg minst én bransje før du fortsetter.");
      return;
    }

    if (!onboardingData.locationType) {
      setStep1Error("Vennligst velg lokasjonstype før du fortsetter.");
      return;
    }

    if (onboardingData.selectedServices.length === 0 && onboardingData.customServices.length === 0) {
      setStep1Error("Vennligst velg eller legg til minst én tjeneste før du fortsetter.");
      return;
    }

    setCurrentStep("step2.4");

    // Build onboarding input
    const input: OnboardingInput = {
      industry: onboardingData.industries[0] || null,
      locationType: onboardingData.locationType,
      basicServices: [
        ...onboardingData.selectedServices,
        ...onboardingData.customServices,
      ],
      priceLevel: onboardingData.priceLevel,
      openingHours: onboardingData.openingHours,
      orgDescription: onboardingData.orgDescription,
      capacityHeavyJobsPerDay: onboardingData.capacityHeavyJobsPerDay,
    };

    setLastOnboardingInput(input);

    // Call AI onboarding
    await runOnboarding(orgId, input);
  }

  // Apply AI suggestions
  async function handleApplyAISuggestions() {
    if (!orgId || orgId.trim() === "") {
      setStep1Error("Mangler gyldig org ID. Kan ikke aktivere forslag.");
      return;
    }
    
    if (!aiSession || !aiSession.id) {
      setStep1Error("Mangler AI-sesjon. Kan ikke aktivere forslag.");
      return;
    }

    const success = await applyOnboarding(orgId, aiSession.id);
    if (success) {
      // Move to Step 3 (Address & Map) instead of completing
      setCurrentStep("step3");
      // Clear persisted data on success
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch (err) {
        console.error("Failed to clear persisted data:", err);
      }
      // Log user in and redirect to dashboard
      await loginAndRedirect();
    }
  }

  // Retry AI onboarding
  async function handleRetryAIOnboarding() {
    if (!orgId || orgId.trim() === "") {
      setStep1Error("Mangler gyldig org ID. Kan ikke prøve igjen.");
      return;
    }
    
    if (!lastOnboardingInput) {
      setStep1Error("Mangler onboarding-data. Kan ikke prøve igjen.");
      return;
    }

    await retryRun(orgId, lastOnboardingInput);
  }

  // Skip AI suggestions
  function handleSkipAISuggestions() {
    // Move to Step 3 instead of completing
    setCurrentStep("step3");
  }

  // Handle Step 3 completion and save location
  async function handleStep3Complete() {
    if (!orgId) {
      setStep1Error("Mangler organisasjons-ID");
      return;
    }

    setStep1Loading(true);
    setStep1Error(null);

    try {
      // Save location data to backend
      const response = await fetch(
        `${API_BASE_URL}/api/orgs/${orgId}/complete-onboarding`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: addressData,
            openingHours: onboardingData.openingHours,
            capacity: {
              heavyJobsPerDay: onboardingData.capacityHeavyJobsPerDay,
            },
            companyName: companyName,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to complete onboarding:", errorText);
        setStep1Error("Kunne ikke fullføre registreringen. Prøv igjen.");
        setStep1Loading(false);
        return;
      }

      // Clear persisted data
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch (err) {
        console.error("Failed to clear persisted data:", err);
      }

      // Log user in and redirect to dashboard
      await loginAndRedirect();
    } catch (error) {
      console.error("Error completing registration:", error);
      setStep1Error("Noe gikk galt. Vennligst prøv igjen.");
    } finally {
      setStep1Loading(false);
    }
  }

  // Login and redirect to dashboard
  async function loginAndRedirect() {
    try {
      // Sign in with the credentials
      const { error } = await supabase.auth.signInWithPassword({
        email: step1Form.email.trim(),
        password: step1Form.password,
      });

      if (error) {
        console.error("Auto-login error:", error);
        // If login fails, redirect to login page
        router.push("/login?message=Konto opprettet. Vennligst logg inn.");
        return;
      }

      // Successful login - redirect to dashboard
      router.push("/min-side");
    } catch (err) {
      console.error("Unexpected error during auto-login:", err);
      router.push("/login?message=Konto opprettet. Vennligst logg inn.");
    }
  }

  // Handle Google OAuth registration
  async function handleGoogleRegister() {
    setStep1Error(null);
    setStep1Loading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?mode=register`,
        },
      });

      if (error) {
        console.error("Google OAuth error:", error);
        setStep1Error("Kunne ikke registrere med Google. Prøv igjen.");
        setStep1Loading(false);
      }
      // Browser will redirect to Google, so no need to handle success here
    } catch (err) {
      console.error("Uventet feil ved Google-registrering:", err);
      setStep1Error("Uventet feil ved Google-registrering.");
      setStep1Loading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
        {/* Step 1: User Registration */}
        {currentStep === "step1" && (
          <>
            <h1 className="text-xl font-semibold tracking-tight">
              Opprett LYXso-konto
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Steg 1 av 2: Grunnleggende informasjon
            </p>

            <form onSubmit={handleStep1Submit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300">
                  Ditt navn
                </label>
                <input
                  type="text"
                  value={step1Form.fullName}
                  onChange={(e) => handleStep1Change("fullName", e.target.value)}
                  required
                  className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Fornavn Etternavn"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300">
                  E-post
                </label>
                <input
                  type="email"
                  value={step1Form.email}
                  onChange={(e) => handleStep1Change("email", e.target.value)}
                  required
                  className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="deg@firma.no"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300">
                  Passord
                </label>
                <input
                  type="password"
                  value={step1Form.password}
                  onChange={(e) => handleStep1Change("password", e.target.value)}
                  required
                  minLength={8}
                  className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Minst 8 tegn"
                />
              </div>

              {/* Slug Input */}
              <div>
                <SlugInput
                  value={step1Form.companySlug}
                  onChange={(value) => handleStep1Change("companySlug", value)}
                  error={slugError}
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={step1Form.agreeToTerms}
                    onChange={(e) => setStep1Form(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                    required
                    className="mt-0.5 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
                  />
                  <span>
                    Jeg godtar{" "}
                    <a href="/vilkar" target="_blank" className="text-blue-400 hover:text-blue-300 underline">
                      vilkårene
                    </a>
                    {" "}og{" "}
                    <a href="/personvern" target="_blank" className="text-blue-400 hover:text-blue-300 underline">
                      personvernerklæringen
                    </a>
                  </span>
                </label>

                <label className="flex items-start gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={step1Form.receiveMarketing}
                    onChange={(e) => setStep1Form(prev => ({ ...prev, receiveMarketing: e.target.checked }))}
                    className="mt-0.5 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
                  />
                  <span>
                    Jeg ønsker å motta nyheter og markedsføring fra LYXso
                  </span>
                </label>

                <label className="flex items-start gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={step1Form.listInMarketplace}
                    onChange={(e) => setStep1Form(prev => ({ ...prev, listInMarketplace: e.target.checked }))}
                    className="mt-0.5 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
                  />
                  <span>
                    Legg bedriften min i LYXso-markedet/katalogen
                  </span>
                </label>
              </div>

              {/* reCAPTCHA */}
              <div className="flex justify-center">
                <ReCaptcha
                  ref={recaptchaRef}
                  onChange={setRecaptchaToken}
                  onExpired={() => setRecaptchaToken(null)}
                  onError={() => setRecaptchaToken(null)}
                />
              </div>

              {step1Error && (
                <p className="text-xs text-red-400 bg-red-950/40 border border-red-900/60 rounded-md px-3 py-2">
                  {step1Error}
                </p>
              )}

              <button
                type="submit"
                disabled={step1Loading}
                className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {step1Loading ? "Oppretter konto..." : "Neste: Bedriftsinformasjon"}
              </button>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-slate-900/70 px-2 text-slate-500">eller</span>
                </div>
              </div>

              {/* Google Register Button */}
              <button
                type="button"
                onClick={handleGoogleRegister}
                disabled={step1Loading}
                className="w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 hover:border-slate-600 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Fortsett med Google
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-slate-400">
              Har du allerede konto?{" "}
              <a href="/login" className="text-blue-400 hover:text-blue-300">
                Logg inn her
              </a>
            </p>
          </>
        )}

        {/* Step 2.1: Basic Info */}
        {currentStep === "step2.1" && (
          <>
            <div className="mb-4">
              <div className="text-sm text-slate-400">Steg 2 av 2: Bedriftsinformasjon (1 av 4)</div>
              <div className="mt-2 flex gap-1">
                <div className="flex-1 h-1 bg-blue-600 rounded"></div>
                <div className="flex-1 h-1 bg-slate-700 rounded"></div>
                <div className="flex-1 h-1 bg-slate-700 rounded"></div>
                <div className="flex-1 h-1 bg-slate-700 rounded"></div>
              </div>
            </div>
            <Step2_1_BasicInfo
              data={onboardingData}
              onChange={handleOnboardingDataChange}
              onNext={() => setCurrentStep("step2.2")}
              orgId={orgId}
              aiHintsEnabled={aiHintsEnabledStep2}
              onDisableAiHints={() => setAiHintsEnabledStep2(false)}
            />
          </>
        )}

        {/* Step 2.2: Services and Pricing */}
        {currentStep === "step2.2" && (
          <>
            <div className="mb-4">
              <div className="text-sm text-slate-400">Steg 2 av 2: Bedriftsinformasjon (2 av 4)</div>
              <div className="mt-2 flex gap-1">
                <div className="flex-1 h-1 bg-blue-600 rounded"></div>
                <div className="flex-1 h-1 bg-blue-600 rounded"></div>
                <div className="flex-1 h-1 bg-slate-700 rounded"></div>
                <div className="flex-1 h-1 bg-slate-700 rounded"></div>
              </div>
            </div>
            <Step2_2_ServicesAndPricing
              data={onboardingData}
              onChange={handleOnboardingDataChange}
              onNext={() => setCurrentStep("step2.3")}
              onBack={() => setCurrentStep("step2.1")}
              orgId={orgId}
              aiHintsEnabled={aiHintsEnabledStep2}
              onDisableAiHints={() => setAiHintsEnabledStep2(false)}
            />
          </>
        )}

        {/* Step 2.3: Opening Hours and Capacity */}
        {currentStep === "step2.3" && (
          <>
            <div className="mb-4">
              <div className="text-sm text-slate-400">Steg 2 av 2: Bedriftsinformasjon (3 av 4)</div>
              <div className="mt-2 flex gap-1">
                <div className="flex-1 h-1 bg-blue-600 rounded"></div>
                <div className="flex-1 h-1 bg-blue-600 rounded"></div>
                <div className="flex-1 h-1 bg-blue-600 rounded"></div>
                <div className="flex-1 h-1 bg-slate-700 rounded"></div>
              </div>
            </div>
            <Step2_3_OpeningHoursAndCapacity
              data={onboardingData}
              onChange={handleOnboardingDataChange}
              onNext={handleMoveToAISuggestions}
              onBack={() => setCurrentStep("step2.2")}
              orgId={orgId}
              aiHintsEnabled={aiHintsEnabledStep2}
              onDisableAiHints={() => setAiHintsEnabledStep2(false)}
            />
          </>
        )}

        {/* Step 2.4: AI Suggestions */}
        {currentStep === "step2.4" && orgId && (
          <>
            <div className="mb-4">
              <div className="text-sm text-slate-400">Steg 2 av 3: AI-forslag (4 av 5)</div>
              <div className="mt-2 flex gap-1">
                <div className="flex-1 h-1 bg-blue-600 rounded"></div>
                <div className="flex-1 h-1 bg-blue-600 rounded"></div>
                <div className="flex-1 h-1 bg-blue-600 rounded"></div>
                <div className="flex-1 h-1 bg-blue-600 rounded"></div>
                <div className="flex-1 h-1 bg-slate-700 rounded"></div>
              </div>
            </div>
            <Step2_4_AISuggestions
              data={onboardingData}
              session={aiSession}
              loading={aiLoading}
              error={aiError}
              orgId={orgId}
              onApply={handleApplyAISuggestions}
              onBack={() => setCurrentStep("step2.3")}
              onSkip={handleSkipAISuggestions}
              onRetry={handleRetryAIOnboarding}
            />
          </>
        )}

        {/* Step 3: Address and Map */}
        {currentStep === "step3" && (
          <>
            <div className="mb-4">
              <div className="text-sm text-slate-400">Steg 3 av 3: Adresse & Lokasjon (5 av 5)</div>
              <div className="mt-2 flex gap-1">
                <div className="flex-1 h-1 bg-blue-600 rounded"></div>
                <div className="flex-1 h-1 bg-blue-600 rounded"></div>
                <div className="flex-1 h-1 bg-blue-600 rounded"></div>
                <div className="flex-1 h-1 bg-blue-600 rounded"></div>
                <div className="flex-1 h-1 bg-blue-600 rounded"></div>
              </div>
            </div>
            <Step3_AddressAndMap
              data={addressData}
              onChange={setAddressData}
              onNext={handleStep3Complete}
              onBack={() => setCurrentStep("step2.4")}
            />
            {step1Error && (
              <p className="mt-4 text-xs text-red-400 bg-red-950/40 border border-red-900/60 rounded-md px-3 py-2">
                {step1Error}
              </p>
            )}
          </>
        )}

        {/* Fallback: If no step matches, show error */}
        {!["step1", "step2.1", "step2.2", "step2.3", "step2.4", "step3"].includes(currentStep) && (
          <div className="text-center py-8">
            <p className="text-sm text-red-400">Ugyldig steg: {currentStep}</p>
            <button
              onClick={() => setCurrentStep("step1")}
              className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Gå til start
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
