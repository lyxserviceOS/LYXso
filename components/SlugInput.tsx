// components/SlugInput.tsx - Slug input with real-time validation
"use client";

import { useState, useEffect, useCallback } from "react";
import { debounce } from "@/lib/utils";

interface Props {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

interface ValidationResult {
  available: boolean;
  message?: string;
  suggestions?: string[];
}

export default function SlugInput({ value, onChange, error }: Props) {
  const [checking, setChecking] = useState(false);
  const [validation, setValidation] = useState<ValidationResult | null>(null);

  const validateSlug = useCallback(
    debounce(async (slug: string) => {
      if (!slug || slug.length < 3) {
        setValidation(null);
        setChecking(false);
        return;
      }

      setChecking(true);

      try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4200';
        const res = await fetch(`${apiBase}/api/orgs/validate-slug?slug=${encodeURIComponent(slug)}`);
        const data = await res.json();

        setValidation(data);
      } catch (err) {
        console.error('Slug validation error:', err);
        setValidation({
          available: false,
          message: 'Kunne ikke validere slug'
        });
      } finally {
        setChecking(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    validateSlug(value);
  }, [value, validateSlug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value.toLowerCase();
    
    // Only allow lowercase letters, numbers, and hyphens
    newValue = newValue.replace(/[^a-z0-9-]/g, '');
    
    // No consecutive hyphens
    newValue = newValue.replace(/--+/g, '-');
    
    // No leading/trailing hyphens
    newValue = newValue.replace(/^-|-$/g, '');
    
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Firmaets URL-adresse
      </label>

      <div className="relative">
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
          <span className="px-3 text-gray-500 text-sm bg-gray-50 border-r border-gray-300">
            https://
          </span>
          <input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="ditt-firmanavn"
            className="flex-1 px-3 py-2 focus:outline-none"
            maxLength={50}
          />
          <span className="px-3 text-gray-500 text-sm bg-gray-50 border-l border-gray-300">
            .lyxso.no
          </span>
        </div>

        {checking && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {/* Preview URL */}
      {value && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-600 mb-1">Din booking-side vil være:</p>
          <p className="text-sm font-mono text-blue-900 break-all">
            https://{value}.lyxso.no
          </p>
          <p className="text-xs text-blue-600 mt-1">
            og også tilgjengelig på: https://lyxso.no/p/{value}
          </p>
        </div>
      )}

      {/* Validation message */}
      {validation && !checking && (
        <div>
          {validation.available ? (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>✓ {value}.lyxso.no er tilgjengelig!</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-red-600 text-sm">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>✗ {validation.message || 'Denne URL-adressen er allerede tatt'}</span>
              </div>

              {validation.suggestions && validation.suggestions.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-700 mb-2 font-medium">
                    Forslag til tilgjengelige alternativer:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {validation.suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => onChange(suggestion)}
                        className="text-xs px-3 py-1 bg-white border border-yellow-300 rounded hover:bg-yellow-50 text-yellow-900"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <p className="text-xs text-gray-500">
        Dette kan ikke endres senere, så velg nøye! Bruk kun små bokstaver, tall og bindestrek.
      </p>
    </div>
  );
}
