// components/register/Step2_1_BasicInfo.tsx
// Onboarding Step 2.1: Basic Info (Industries, Location Type, Description)

import { INDUSTRIES } from "@/lib/constants/industries";
import type { LocationType, OnboardingStepData } from "@/types/ai-onboarding";
import { Step2_AiHintsPanel } from "./Step2_AiHintsPanel";

interface Step2_1Props {
  data: OnboardingStepData;
  onChange: (data: Partial<OnboardingStepData>) => void;
  onNext: () => void;
  orgId?: string | null;
  aiHintsEnabled?: boolean;
  onDisableAiHints?: () => void;
}

export function Step2_1_BasicInfo({ 
  data, 
  onChange, 
  onNext,
  orgId = null,
  aiHintsEnabled = false,
  onDisableAiHints = () => {},
}: Step2_1Props) {
  const handleIndustryToggle = (industry: string) => {
    const newIndustries = data.industries.includes(industry)
      ? data.industries.filter((i) => i !== industry)
      : [...data.industries, industry];
    onChange({ industries: newIndustries });
  };

  const handleLocationTypeChange = (type: LocationType) => {
    onChange({ locationType: type });
  };

  const canProceed = data.industries.length > 0 && data.locationType;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main content */}
      <div className="flex-1 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-50">
          Fortell oss om bedriften din
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Velg bransjer og lokaliseringstype
        </p>
      </div>

      {/* Industries selection */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Hvilke bransjer er du i? (velg alle som passer)
        </label>
        <div className="grid grid-cols-2 gap-3">
          {INDUSTRIES.map((industry) => {
            const isSelected = data.industries.includes(industry.value);
            return (
              <button
                key={industry.value}
                type="button"
                onClick={() => handleIndustryToggle(industry.value)}
                className={`px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                  isSelected
                    ? "border-blue-500 bg-blue-500/10 text-blue-400"
                    : "border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600"
                }`}
              >
                {industry.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Location type */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Lokasjonstype
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "fixed" as const, label: "Fast lokasjon", desc: "Verksted/butikk" },
            { value: "mobile" as const, label: "Mobil", desc: "Kjører til kunden" },
            { value: "both" as const, label: "Begge deler", desc: "Hybrid" },
          ].map((option) => {
            const isSelected = data.locationType === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleLocationTypeChange(option.value)}
                className={`px-4 py-3 rounded-lg border text-sm transition-colors ${
                  isSelected
                    ? "border-blue-500 bg-blue-500/10 text-blue-400"
                    : "border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600"
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-xs opacity-70 mt-1">{option.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Kort beskrivelse av bedriften (valgfritt)
        </label>
        <textarea
          value={data.orgDescription}
          onChange={(e) => onChange({ orgDescription: e.target.value })}
          placeholder="F.eks: Vi spesialiserer oss på premium bilpleie med fokus på keramisk coating og PPF..."
          rows={3}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Next button */}
      <button
        type="button"
        onClick={onNext}
        disabled={!canProceed}
        className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Neste: Tjenester og priser
      </button>
      </div>

      {/* AI Hints Panel */}
      {aiHintsEnabled && (
        <Step2_AiHintsPanel
          orgId={orgId}
          onboardingData={data}
          enabled={aiHintsEnabled}
          onDisable={onDisableAiHints}
        />
      )}
    </div>
  );
}
