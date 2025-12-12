// components/RecurrenceModal.tsx
"use client";

import { useState } from "react";

export type RecurrenceType = "daily" | "weekly" | "monthly";
export type EndType = "date" | "occurrences";

export interface RecurrenceConfig {
  type: RecurrenceType;
  interval: number;
  endType: EndType;
  endDate?: string;
  occurrences?: number;
  daysOfWeek?: number[]; // 0 = Sunday, 1 = Monday, etc.
}

interface RecurrenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: RecurrenceConfig) => void;
  defaultStartDate?: Date;
}

const WEEKDAYS = [
  { value: 1, label: "Man" },
  { value: 2, label: "Tir" },
  { value: 3, label: "Ons" },
  { value: 4, label: "Tor" },
  { value: 5, label: "Fre" },
  { value: 6, label: "Lør" },
  { value: 0, label: "Søn" },
];

export function RecurrenceModal({
  isOpen,
  onClose,
  onSave,
  defaultStartDate = new Date(),
}: RecurrenceModalProps) {
  const [config, setConfig] = useState<RecurrenceConfig>({
    type: "weekly",
    interval: 1,
    endType: "occurrences",
    occurrences: 10,
    daysOfWeek: [defaultStartDate.getDay()],
  });

  if (!isOpen) return null;

  function handleSave() {
    // Validate
    if (config.endType === "date" && !config.endDate) {
      alert("Vennligst velg en sluttdato");
      return;
    }
    
    if (config.endType === "occurrences" && (!config.occurrences || config.occurrences < 1)) {
      alert("Vennligst velg antall gjentagelser (minst 1)");
      return;
    }
    
    if (config.type === "weekly" && (!config.daysOfWeek || config.daysOfWeek.length === 0)) {
      alert("Vennligst velg minst én ukedag");
      return;
    }

    onSave(config);
    onClose();
  }

  function toggleWeekday(day: number) {
    const current = config.daysOfWeek || [];
    const updated = current.includes(day)
      ? current.filter(d => d !== day)
      : [...current, day].sort((a, b) => a - b);
    
    setConfig(prev => ({ ...prev, daysOfWeek: updated }));
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-slate-900">
            Gjentakende booking
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-5">
          {/* Frequency Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Gjenta hver:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "daily", label: "Dag" },
                { value: "weekly", label: "Uke" },
                { value: "monthly", label: "Måned" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setConfig(prev => ({ ...prev, type: option.value as RecurrenceType }))}
                  className={`py-2 px-3 rounded-lg border-2 text-sm font-medium transition ${
                    config.type === option.value
                      ? "border-sky-500 bg-sky-50 text-sky-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interval */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Intervall:
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Hver</span>
              <input
                type="number"
                min="1"
                max="30"
                value={config.interval}
                onChange={(e) => setConfig(prev => ({ ...prev, interval: parseInt(e.target.value) || 1 }))}
                className="w-20 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
              <span className="text-sm text-slate-600">
                {config.type === "daily" && (config.interval === 1 ? "dag" : "dager")}
                {config.type === "weekly" && (config.interval === 1 ? "uke" : "uker")}
                {config.type === "monthly" && (config.interval === 1 ? "måned" : "måneder")}
              </span>
            </div>
          </div>

          {/* Weekdays (only for weekly) */}
          {config.type === "weekly" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Hvilke dager:
              </label>
              <div className="flex gap-2">
                {WEEKDAYS.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleWeekday(day.value)}
                    className={`w-10 h-10 rounded-full border-2 text-xs font-medium transition ${
                      config.daysOfWeek?.includes(day.value)
                        ? "border-sky-500 bg-sky-500 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* End Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Avslutt:
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  checked={config.endType === "occurrences"}
                  onChange={() => setConfig(prev => ({ ...prev, endType: "occurrences" }))}
                  className="w-4 h-4 text-sky-500 focus:ring-sky-500"
                />
                <span className="text-sm text-slate-700">Etter</span>
                <input
                  type="number"
                  min="1"
                  max="100"
                  disabled={config.endType !== "occurrences"}
                  value={config.occurrences || ""}
                  onChange={(e) => setConfig(prev => ({ ...prev, occurrences: parseInt(e.target.value) || undefined }))}
                  className="w-20 px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 disabled:bg-slate-50 disabled:text-slate-400"
                />
                <span className="text-sm text-slate-700">ganger</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  checked={config.endType === "date"}
                  onChange={() => setConfig(prev => ({ ...prev, endType: "date" }))}
                  className="w-4 h-4 text-sky-500 focus:ring-sky-500"
                />
                <span className="text-sm text-slate-700">På dato:</span>
                <input
                  type="date"
                  disabled={config.endType !== "date"}
                  value={config.endDate || ""}
                  onChange={(e) => setConfig(prev => ({ ...prev, endDate: e.target.value }))}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 disabled:bg-slate-50 disabled:text-slate-400"
                  min={new Date().toISOString().split("T")[0]}
                />
              </label>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-sm font-medium text-slate-700 mb-1">Oppsummering:</p>
            <p className="text-sm text-slate-600">
              {config.type === "daily" && `Hver ${config.interval > 1 ? config.interval + ". " : ""}dag`}
              {config.type === "weekly" && `Hver ${config.interval > 1 ? config.interval + ". " : ""}uke ${config.daysOfWeek && config.daysOfWeek.length > 0 ? "på " + config.daysOfWeek.map(d => WEEKDAYS.find(w => w.value === d)?.label).join(", ") : ""}`}
              {config.type === "monthly" && `Hver ${config.interval > 1 ? config.interval + ". " : ""}måned`}
              {", "}
              {config.endType === "occurrences" 
                ? `${config.occurrences || 0} ganger`
                : `til ${config.endDate ? new Date(config.endDate).toLocaleDateString("no-NO") : "?"}`
              }
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            Avbryt
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition"
          >
            Opprett serie
          </button>
        </div>
      </div>
    </div>
  );
}
