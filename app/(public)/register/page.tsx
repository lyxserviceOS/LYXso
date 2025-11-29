"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAiOnboarding } from "@/lib/hooks/useAiOnboarding";
import { Step2_1_BasicInfo } from "@/components/register/Step2_1_BasicInfo";
import { Step2_2_ServicesAndPricing } from "@/components/register/Step2_2_ServicesAndPricing";
import { Step2_3_OpeningHoursAndCapacity } from "@/components/register/Step2_3_OpeningHoursAndCapacity";
import { Step2_4_AISuggestions } from "@/components/register/Step2_4_AISuggestions";
import type { OnboardingStepData, OnboardingInput } from "@/types/ai-onboarding";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_LYXSO_API_URL ??
  process.env.NEXT_PUBLIC_API_BASE ??
  "http://localhost:4000";

const STORAGE_KEY = "lyxso_register_onboarding_data";

type Step1FormState = {
  fullName: string;
  email: string;
  password: string;
};

type WizardStep = "step1" | "step2.1" | "step2.2" | "step2.3" | "step2.4";

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

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<WizardStep>("step1");
  const [step1Form, setStep1Form] = useState<Step1FormState>({
    fullName: "",
    email: "",
    password: "",
  });
  const [onboardingData, setOnboardingData] = useState<OnboardingStepData>(initialOnboardingData);
  const [step1Loading, setStep1Loading] = useState(false);
  const [step1Error, setStep1Error] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string>("");
  const [lastOnboardingInput, setLastOnboardingInput] = useState<OnboardingInput | null>(null);

  const {
    loading: aiLoading,
    error: aiError,
    session: aiSession,
    runOnboarding,
    applyOnboarding,
    retryRun,
  } = useAiOnboarding();

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
    setStep1Loading(true);

    try {
      // 1) Create user in Supabase Auth
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
        setStep1Error("Kunne ikke opprette bruker. Sjekk e-post og passord.");
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
            }),
          }
        );

        if (!res.ok) {
          const body = await res.text().catch(() => "");
          console.error("create-org-from-signup error:", res.status, body);
          setStep1Error(
            "Bruker ble opprettet, men kunne ikke opprette organisasjon."
          );
          setStep1Loading(false);
          return;
        }

        const json = await res.json().catch(() => null);
        console.log("create-org-from-signup OK:", json);

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

      // 3) Sign in the user automatically
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: step1Form.email.trim(),
        password: step1Form.password,
      });

      if (signInError) {
        console.error("Auto sign-in error:", signInError);
        // Not critical, continue to step 2
      }

      // Move to step 2
      setCurrentStep("step2.1");
    } catch (err) {
      console.error("Uventet feil i step1:", err);
      setStep1Error("Uventet feil ved registrering.");
    } finally {
      setStep1Loading(false);
    }
  }

  function handleStep1Change(field: keyof Step1FormState, value: string) {
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
      // Clear persisted data on success
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch (err) {
        console.error("Failed to clear persisted data:", err);
      }
      // Redirect to dashboard
      router.push("/");
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
    // Clear persisted data on skip
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error("Failed to clear persisted data:", err);
    }
    // Just redirect to dashboard
    router.push("/");
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
            />
          </>
        )}

        {/* Step 2.4: AI Suggestions */}
        {currentStep === "step2.4" && orgId && (
          <>
            <div className="mb-4">
              <div className="text-sm text-slate-400">Steg 2 av 2: AI-forslag (4 av 4)</div>
              <div className="mt-2 flex gap-1">
                <div className="flex-1 h-1 bg-blue-600 rounded"></div>
                <div className="flex-1 h-1 bg-blue-600 rounded"></div>
                <div className="flex-1 h-1 bg-blue-600 rounded"></div>
                <div className="flex-1 h-1 bg-blue-600 rounded"></div>
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
      </div>
    </div>
  );
}
