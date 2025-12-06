"use client";

import { useState, useEffect } from "react";
import { useHelp } from "@/lib/HelpContext";

type TourStep = {
  target: string; // CSS selector
  title: string;
  content: string;
  placement?: "top" | "bottom" | "left" | "right";
  action?: () => void;
};

type GuidedTourProps = {
  tourId: string;
  steps: TourStep[];
  onComplete?: () => void;
  autoStart?: boolean;
};

export function GuidedTour({
  tourId,
  steps,
  onComplete,
  autoStart = false,
}: GuidedTourProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  // Check if tour has been completed before
  useEffect(() => {
    const completed = localStorage.getItem(`tour_completed_${tourId}`);
    if (!completed && autoStart) {
      setIsActive(true);
    }
  }, [tourId, autoStart]);

  // Find target element when step changes
  useEffect(() => {
    if (isActive && steps[currentStep]) {
      const element = document.querySelector(
        steps[currentStep].target
      ) as HTMLElement;
      setTargetElement(element);

      // Scroll to element
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        // Highlight element
        element.classList.add("ring-2", "ring-blue-500", "ring-offset-2");
      }
    }

    return () => {
      if (targetElement) {
        targetElement.classList.remove("ring-2", "ring-blue-500", "ring-offset-2");
      }
    };
  }, [isActive, currentStep, steps]);

  const handleNext = () => {
    if (steps[currentStep].action) {
      steps[currentStep].action!();
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(`tour_completed_${tourId}`, "true");
    setIsActive(false);
    setCurrentStep(0);
    if (onComplete) {
      onComplete();
    }
  };

  const handleSkip = () => {
    if (confirm("Er du sikker på at du vil hoppe over denne guiden?")) {
      handleComplete();
    }
  };

  if (!isActive || !steps[currentStep]) return null;

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />

      {/* Tour tooltip */}
      <div className="fixed inset-0 z-50 pointer-events-none">
        <div className="relative w-full h-full">
          {targetElement && (
            <div
              className="absolute pointer-events-auto"
              style={{
                top: targetElement.offsetTop + targetElement.offsetHeight + 10,
                left: targetElement.offsetLeft,
              }}
            >
              <div className="bg-white rounded-lg shadow-2xl border border-slate-200 p-6 max-w-md">
                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-600">
                      Steg {currentStep + 1} av {steps.length}
                    </span>
                    <button
                      onClick={handleSkip}
                      className="text-xs text-slate-500 hover:text-slate-700"
                    >
                      Hopp over
                    </button>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 mb-4">{step.content}</p>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Forrige
                  </button>

                  <button
                    onClick={handleNext}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                  >
                    {currentStep === steps.length - 1 ? "Fullfør" : "Neste"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Helper component to trigger tours
export function TourTrigger({
  tourId,
  label = "Start guide",
}: {
  tourId: string;
  label?: string;
}) {
  const [showTour, setShowTour] = useState(false);

  // Tour definitions
  const tours: Record<string, TourStep[]> = {
    bookings: [
      {
        target: "[data-tour='create-booking-btn']",
        title: "Opprett booking",
        content: "Klikk her for å opprette en ny booking for en kunde.",
      },
      {
        target: "[data-tour='customer-select']",
        title: "Velg kunde",
        content:
          "Søk etter eksisterende kunde eller opprett en ny. E-post er påkrevd for bekreftelser.",
      },
      {
        target: "[data-tour='service-select']",
        title: "Velg tjeneste",
        content: "Velg hvilken tjeneste kunden ønsker. Pris settes automatisk.",
      },
      {
        target: "[data-tour='datetime-picker']",
        title: "Velg tidspunkt",
        content: "Velg dato og tid. Kun ledige tider vises.",
      },
      {
        target: "[data-tour='submit-btn']",
        title: "Lagre booking",
        content: "Når alt er fylt ut, klikk her for å lagre og sende bekreftelse.",
      },
    ],
    dashboard: [
      {
        target: "[data-tour='bookings-card']",
        title: "Dagens bookinger",
        content: "Se alle bookinger for i dag. Klikk for å se detaljer.",
      },
      {
        target: "[data-tour='revenue-card']",
        title: "Ukentlig inntekt",
        content: "Se hvor mye du har tjent denne uken.",
      },
      {
        target: "[data-tour='quick-actions']",
        title: "Hurtighandlinger",
        content: "Opprett booking, legg til kunde eller se rapport raskt herfra.",
      },
    ],
  };

  const tourSteps = tours[tourId] || [];

  return (
    <>
      <button
        onClick={() => setShowTour(true)}
        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {label}
      </button>

      {showTour && (
        <GuidedTour
          tourId={tourId}
          steps={tourSteps}
          onComplete={() => setShowTour(false)}
        />
      )}
    </>
  );
}
