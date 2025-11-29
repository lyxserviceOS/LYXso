// components/register/Step2_2_ServicesAndPricing.tsx
// Onboarding Step 2.2: Services and Price Level

import { useState } from "react";
import { SERVICES_BY_INDUSTRY, PRICE_LEVELS } from "@/lib/constants/industries";
import type { OnboardingStepData, PriceLevel } from "@/types/ai-onboarding";

interface Step2_2Props {
  data: OnboardingStepData;
  onChange: (data: Partial<OnboardingStepData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step2_2_ServicesAndPricing({
  data,
  onChange,
  onNext,
  onBack,
}: Step2_2Props) {
  const [customService, setCustomService] = useState("");

  // Get all services for selected industries
  const availableServices = data.industries.flatMap(
    (industry) => SERVICES_BY_INDUSTRY[industry] || []
  );

  const handleServiceToggle = (service: string) => {
    const newServices = data.selectedServices.includes(service)
      ? data.selectedServices.filter((s) => s !== service)
      : [...data.selectedServices, service];
    onChange({ selectedServices: newServices });
  };

  const handleAddCustomService = () => {
    if (customService.trim() && !data.customServices.includes(customService.trim())) {
      onChange({ customServices: [...data.customServices, customService.trim()] });
      setCustomService("");
    }
  };

  const handleRemoveCustomService = (service: string) => {
    onChange({ customServices: data.customServices.filter((s) => s !== service) });
  };

  const handlePriceLevelChange = (level: PriceLevel) => {
    onChange({ priceLevel: level });
  };

  const canProceed = (data.selectedServices.length > 0 || data.customServices.length > 0) && data.priceLevel;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-50">
          Tjenester og prisnivå
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Velg tjenester du tilbyr og ditt prisnivå
        </p>
      </div>

      {/* Services selection */}
      {availableServices.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Tilbyr du dette? (velg alle som passer)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {availableServices.map((service) => {
              const isSelected = data.selectedServices.includes(service);
              return (
                <button
                  key={service}
                  type="button"
                  onClick={() => handleServiceToggle(service)}
                  className={`px-3 py-2 rounded-md border text-sm transition-colors text-left ${
                    isSelected
                      ? "border-blue-500 bg-blue-500/10 text-blue-400"
                      : "border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600"
                  }`}
                >
                  {service}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom services */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Egendefinerte tjenester
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customService}
            onChange={(e) => setCustomService(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddCustomService();
              }
            }}
            placeholder="Legg til egen tjeneste..."
            className="flex-1 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleAddCustomService}
            className="px-4 py-2 rounded-md bg-slate-800 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
          >
            Legg til
          </button>
        </div>
        {data.customServices.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {data.customServices.map((service) => (
              <span
                key={service}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-sm text-blue-400"
              >
                {service}
                <button
                  type="button"
                  onClick={() => handleRemoveCustomService(service)}
                  className="ml-1 hover:text-blue-300"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Price level */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Prisnivå
        </label>
        <div className="space-y-2">
          {PRICE_LEVELS.map((level) => {
            const isSelected = data.priceLevel === level.value;
            return (
              <button
                key={level.value}
                type="button"
                onClick={() => handlePriceLevelChange(level.value)}
                className={`w-full px-4 py-3 rounded-lg border text-left transition-colors ${
                  isSelected
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-slate-700 bg-slate-900/50 hover:border-slate-600"
                }`}
              >
                <div className={`font-medium ${isSelected ? "text-blue-400" : "text-slate-200"}`}>
                  {level.label}
                </div>
                <div className={`text-xs mt-1 ${isSelected ? "text-blue-400/70" : "text-slate-400"}`}>
                  {level.description}
                </div>
              </button>
            );
          })}
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
          disabled={!canProceed}
          className="flex-1 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Neste: Åpningstider
        </button>
      </div>
    </div>
  );
}
