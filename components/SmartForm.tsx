"use client";

import { useState, useEffect } from "react";
import { HelpButton, Tooltip } from "./HelpButton";

type SmartInputProps = {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  helpId?: string;
  suggestions?: string[];
  validate?: (value: string) => string | null; // Returns error message or null
  placeholder?: string;
  required?: boolean;
  autoComplete?: boolean;
};

export function SmartInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  helpId,
  suggestions = [],
  validate,
  placeholder,
  required = false,
  autoComplete = true,
}: SmartInputProps) {
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  // Filter suggestions based on input
  useEffect(() => {
    if (value && autoComplete && suggestions.length > 0) {
      const filtered = suggestions.filter((s) =>
        s.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [value, suggestions, autoComplete]);

  // Validate on blur
  const handleBlur = () => {
    setTouched(true);
    if (validate) {
      const err = validate(value);
      setError(err);
    }
  };

  // Real-time validation
  useEffect(() => {
    if (touched && validate) {
      const err = validate(value);
      setError(err);
    }
  }, [value, touched, validate]);

  return (
    <div className="space-y-1">
      {/* Label with help button */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {helpId && <HelpButton helpId={helpId} position="right" />}
      </div>

      {/* Input field */}
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            error && touched
              ? "border-red-500 focus:ring-red-500"
              : "border-slate-300"
          }`}
        />

        {/* Validation icon */}
        {touched && !error && value && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg
              className="w-5 h-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}

        {/* Suggestions dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-auto">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  onChange(suggestion);
                  setShowSuggestions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && touched && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

// Smart Select with search
type SmartSelectProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  helpId?: string;
  required?: boolean;
  searchable?: boolean;
};

export function SmartSelect({
  label,
  name,
  value,
  onChange,
  options,
  helpId,
  required = false,
  searchable = false,
}: SmartSelectProps) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || "Velg...";

  return (
    <div className="space-y-1">
      {/* Label */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {helpId && <HelpButton helpId={helpId} position="right" />}
      </div>

      {/* Select */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg text-left flex items-center justify-between hover:border-slate-400 transition-colors"
        >
          <span className={value ? "text-slate-900" : "text-slate-500"}>
            {selectedLabel}
          </span>
          <svg
            className={`w-5 h-5 text-slate-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-64 overflow-auto">
            {searchable && (
              <div className="p-2 border-b border-slate-200">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Søk..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            )}

            <div className="py-1">
              {filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors ${
                    value === option.value
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-slate-900"
                  }`}
                >
                  {option.label}
                </button>
              ))}

              {filteredOptions.length === 0 && (
                <div className="px-4 py-3 text-sm text-slate-500 text-center">
                  Ingen resultater
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Form wizard helper
type FormWizardProps = {
  steps: {
    id: string;
    title: string;
    description?: string;
    component: React.ReactNode;
  }[];
  onComplete: () => void;
};

export function FormWizard({ steps, onComplete }: FormWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">
            Steg {currentStep + 1} av {steps.length}
          </span>
          <span className="text-sm text-slate-500">{step.title}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          {step.title}
        </h2>
        {step.description && (
          <p className="text-sm text-slate-600 mb-6">{step.description}</p>
        )}

        {step.component}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="px-6 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Forrige
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          {currentStep === steps.length - 1 ? "Fullfør" : "Neste →"}
        </button>
      </div>
    </div>
  );
}
