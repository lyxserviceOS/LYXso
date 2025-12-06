"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type SetupStep = {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  estimatedTime: string;
  isOptional?: boolean;
  requiredFor?: string[];
};

const setupSteps: SetupStep[] = [
  {
    id: "org_info",
    title: "Organisasjonsinformasjon",
    description: "Fyll inn grunnleggende bedriftsinfo, logo og kontaktdetaljer",
    icon: "🏢",
    href: "/org-settings",
    estimatedTime: "3 min",
    requiredFor: ["booking", "crm", "marketing"],
  },
  {
    id: "services",
    title: "Tjenester",
    description: "Legg til tjenester du tilbyr (f.eks. dekkskift, polering)",
    icon: "🛠️",
    href: "/tjenester",
    estimatedTime: "5 min",
    requiredFor: ["booking"],
  },
  {
    id: "employees",
    title: "Ansatte",
    description: "Registrer ansatte og deres tilgjengelighet",
    icon: "👤",
    href: "/ansatte",
    estimatedTime: "3 min",
    isOptional: true,
    requiredFor: ["booking"],
  },
  {
    id: "booking_settings",
    title: "Bookinginnstillinger",
    description: "Sett åpningstider, bookingvindu og betalingsregler",
    icon: "📅",
    href: "/booking/innstillinger",
    estimatedTime: "5 min",
    requiredFor: ["booking", "ai_booking"],
  },
  {
    id: "payment",
    title: "Betalingsintegrasjon",
    description: "Koble til Stripe eller Vipps for online betaling",
    icon: "💳",
    href: "/betaling/oppsett",
    estimatedTime: "10 min",
    isOptional: true,
    requiredFor: ["booking", "webshop"],
  },
  {
    id: "landing_page",
    title: "Landingsside",
    description: "Tilpass din bookingside med farger og innhold",
    icon: "🌐",
    href: "/landingsside",
    estimatedTime: "5 min",
    isOptional: true,
    requiredFor: ["marketing"],
  },
  {
    id: "marketing_integrations",
    title: "Markedsføringsintegrasjoner",
    description: "Koble til Google Ads, Meta Ads for AI-kampanjer",
    icon: "📣",
    href: "/integrasjoner",
    estimatedTime: "15 min",
    isOptional: true,
    requiredFor: ["ai_marketing"],
  },
  {
    id: "ai_setup",
    title: "AI-moduler",
    description: "Aktiver og konfigurer AI-assistenter for din bedrift",
    icon: "🤖",
    href: "/ai",
    estimatedTime: "10 min",
    isOptional: true,
    requiredFor: [],
  },
  {
    id: "lyxba_training",
    title: "LYXba Opplæring",
    description: "Tren booking-agenten med dine svar og prosedyrer",
    icon: "🎓",
    href: "/ai-agent/opplaering",
    estimatedTime: "20 min",
    isOptional: true,
    requiredFor: ["ai_agent"],
  },
];

export default function OnboardingGuide() {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [collapsedSteps, setCollapsedSteps] = useState<Set<string>>(new Set());
  const [showGuide, setShowGuide] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Hent org_id
      const { data: membership } = await supabase
        .from("org_memberships")
        .select("org_id")
        .eq("user_id", user.id)
        .single();

      if (!membership) return;

      // Hent onboarding progress
      const { data: progress } = await supabase
        .from("onboarding_progress")
        .select("completed_steps, dismissed")
        .eq("org_id", membership.org_id)
        .single();

      if (progress) {
        setCompletedSteps(new Set(progress.completed_steps || []));
        setShowGuide(!progress.dismissed);
      }
    } catch (error) {
      console.error("Feil ved lasting av onboarding progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const markStepComplete = async (stepId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: membership } = await supabase
        .from("org_memberships")
        .select("org_id")
        .eq("user_id", user.id)
        .single();

      if (!membership) return;

      const newCompleted = new Set(completedSteps);
      newCompleted.add(stepId);
      setCompletedSteps(newCompleted);

      await supabase
        .from("onboarding_progress")
        .upsert({
          org_id: membership.org_id,
          completed_steps: Array.from(newCompleted),
          updated_at: new Date().toISOString(),
        });
    } catch (error) {
      console.error("Feil ved markering av steg:", error);
    }
  };

  const dismissGuide = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: membership } = await supabase
        .from("org_memberships")
        .select("org_id")
        .eq("user_id", user.id)
        .single();

      if (!membership) return;

      await supabase
        .from("onboarding_progress")
        .upsert({
          org_id: membership.org_id,
          dismissed: true,
          updated_at: new Date().toISOString(),
        });

      setShowGuide(false);
    } catch (error) {
      console.error("Feil ved dismissing av guide:", error);
    }
  };

  const toggleStep = (stepId: string) => {
    setCollapsedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
      } else {
        newSet.add(stepId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 rounded bg-slate-200" />
          <div className="h-4 w-full rounded bg-slate-200" />
          <div className="h-4 w-3/4 rounded bg-slate-200" />
        </div>
      </div>
    );
  }

  if (!showGuide) {
    return (
      <button
        onClick={() => setShowGuide(true)}
        className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
      >
        <span>📋</span>
        <span>Vis oppsettveiledning</span>
      </button>
    );
  }

  const completedCount = completedSteps.size;
  const totalCount = setupSteps.length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 p-6 shadow-lg">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex-1">
          <h2 className="mb-2 flex items-center gap-2 text-xl font-bold text-slate-900">
            <span className="text-2xl">🚀</span>
            Velkommen til LYXso!
          </h2>
          <p className="text-sm text-slate-600">
            Følg denne guiden for å komme raskt i gang. Du kan hoppe over steg og komme tilbake senere.
          </p>
        </div>
        <button
          onClick={dismissGuide}
          className="text-slate-400 transition-colors hover:text-slate-600"
          aria-label="Lukk guide"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700">
            Fremdrift: {completedCount} av {totalCount} steg
          </span>
          <span className="font-bold text-blue-600">{progressPercentage}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {setupSteps.map((step, index) => {
          const isCompleted = completedSteps.has(step.id);
          const isCollapsed = collapsedSteps.has(step.id);

          return (
            <div
              key={step.id}
              className={`rounded-lg border-2 transition-all ${
                isCompleted
                  ? "border-green-300 bg-green-50"
                  : "border-slate-200 bg-white hover:border-blue-300"
              }`}
            >
              {/* Step Header */}
              <button
                onClick={() => toggleStep(step.id)}
                className="flex w-full items-center gap-3 p-4 text-left"
              >
                {/* Icon/Status */}
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xl ${
                    isCompleted ? "bg-green-500 text-white" : "bg-slate-100"
                  }`}
                >
                  {isCompleted ? "✓" : step.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-slate-900">
                      {index + 1}. {step.title}
                    </h3>
                    {step.isOptional && (
                      <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
                        Valgfritt
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-600">{step.description}</p>
                </div>

                {/* Toggle Icon */}
                <div
                  className="text-slate-400 transition-transform"
                  style={{ transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)" }}
                >
                  ▼
                </div>
              </button>

              {/* Expanded Content */}
              {!isCollapsed && !isCompleted && (
                <div className="border-t border-slate-200 px-4 py-3">
                  <div className="mb-3 flex items-center gap-4 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <span>⏱️</span>
                      <span>Ca. {step.estimatedTime}</span>
                    </span>
                    {step.requiredFor && step.requiredFor.length > 0 && (
                      <span className="flex items-center gap-1">
                        <span>🔗</span>
                        <span>Kreves for: {step.requiredFor.join(", ")}</span>
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={step.href}
                      className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                      Start oppsettet
                    </Link>
                    <button
                      onClick={() => markStepComplete(step.id)}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      Hopp over
                    </button>
                  </div>
                </div>
              )}

              {/* Completed Badge */}
              {!isCollapsed && isCompleted && (
                <div className="border-t border-green-200 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-700">✓ Fullført</span>
                    <Link
                      href={step.href}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Rediger →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {progressPercentage === 100 && (
        <div className="mt-6 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 p-4 text-white">
          <h3 className="mb-2 flex items-center gap-2 font-bold">
            <span className="text-xl">🎉</span>
            Gratulerer! Du er klar!
          </h3>
          <p className="mb-3 text-sm">
            Du har fullført alle oppsettsstegene. Nå kan du begynne å ta imot bookinger og bruke alle funksjoner.
          </p>
          <button
            onClick={dismissGuide}
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-green-600 transition-colors hover:bg-green-50"
          >
            Lukk guiden
          </button>
        </div>
      )}
    </div>
  );
}
