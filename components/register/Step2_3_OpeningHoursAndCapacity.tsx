// components/register/Step2_3_OpeningHoursAndCapacity.tsx
// Onboarding Step 2.3: Opening Hours and Capacity

import { WEEKDAYS } from "@/lib/constants/industries";
import type { OnboardingStepData, OpeningHours } from "@/types/ai-onboarding";
import { Step2_AiHintsPanel } from "./Step2_AiHintsPanel";

interface Step2_3Props {
  data: OnboardingStepData;
  onChange: (data: Partial<OnboardingStepData>) => void;
  onNext: () => void;
  onBack: () => void;
  orgId?: string | null;
  aiHintsEnabled?: boolean;
  onDisableAiHints?: () => void;
}

export function Step2_3_OpeningHoursAndCapacity({
  data,
  onChange,
  onNext,
  onBack,
  orgId = null,
  aiHintsEnabled = false,
  onDisableAiHints = () => {},
}: Step2_3Props) {
  const handleDayToggle = (day: string) => {
    const newHours: OpeningHours = { ...data.openingHours };
    if (newHours[day]) {
      newHours[day] = null;
    } else {
      newHours[day] = { open: "09:00", close: "17:00" };
    }
    onChange({ openingHours: newHours });
  };

  const handleTimeChange = (
    day: string,
    field: "open" | "close",
    value: string
  ) => {
    const newHours: OpeningHours = { ...data.openingHours };
    if (newHours[day]) {
      newHours[day] = { ...newHours[day]!, [field]: value };
      onChange({ openingHours: newHours });
    }
  };

  const handleCapacityChange = (value: number) => {
    onChange({ capacityHeavyJobsPerDay: Math.max(1, Math.min(20, value)) });
  };

  const hasAtLeastOneDay = Object.values(data.openingHours).some((hours) => hours !== null);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main content */}
      <div className="flex-1 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-50">
          Åpningstider og kapasitet
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Sett opp når du er tilgjengelig
        </p>
      </div>

      {/* Opening hours */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Åpningstider
        </label>
        <div className="space-y-2">
          {WEEKDAYS.map((weekday) => {
            const isOpen = !!data.openingHours[weekday.key];
            const hours = data.openingHours[weekday.key];

            return (
              <div key={weekday.key} className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleDayToggle(weekday.key)}
                  className={`w-24 px-3 py-2 rounded-md border text-sm font-medium transition-colors ${
                    isOpen
                      ? "border-blue-500 bg-blue-500/10 text-blue-400"
                      : "border-slate-700 bg-slate-900/50 text-slate-400"
                  }`}
                >
                  {weekday.label}
                </button>

                {isOpen && hours ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="time"
                      value={hours.open}
                      onChange={(e) =>
                        handleTimeChange(weekday.key, "open", e.target.value)
                      }
                      className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="text-slate-400">–</span>
                    <input
                      type="time"
                      value={hours.close}
                      onChange={(e) =>
                        handleTimeChange(weekday.key, "close", e.target.value)
                      }
                      className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                ) : (
                  <span className="text-sm text-slate-500">Stengt</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Capacity */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Kapasitet for tunge jobber per dag
        </label>
        <p className="text-xs text-slate-400 mb-3">
          Hvor mange større jobber (coating, detailing, større service) kan dere gjennomføre per dag?
        </p>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="1"
            max="20"
            value={data.capacityHeavyJobsPerDay}
            onChange={(e) => handleCapacityChange(Number(e.target.value))}
            className="flex-1"
          />
          <div className="w-16 text-center">
            <input
              type="number"
              min="1"
              max="20"
              value={data.capacityHeavyJobsPerDay}
              onChange={(e) => handleCapacityChange(Number(e.target.value))}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 text-center outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-md border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
        >
          Tilbake
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!hasAtLeastOneDay}
          className="flex-1 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Se AI-forslag
        </button>
      </div>
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
