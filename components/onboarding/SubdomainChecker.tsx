// components/onboarding/SubdomainChecker.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Check, X, Loader2, Globe } from 'lucide-react';

interface SubdomainCheckerProps {
  value: string;
  onChange: (value: string) => void;
  onValidChange?: (isValid: boolean) => void;
}

export default function SubdomainChecker({ value, onChange, onValidChange }: SubdomainCheckerProps) {
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Debounce checking
  useEffect(() => {
    if (!value || value.length < 3) {
      setAvailable(null);
      setError(null);
      onValidChange?.(false);
      return;
    }

    // Validate format
    const validFormat = /^[a-z0-9-]+$/.test(value);
    if (!validFormat) {
      setError('Kun små bokstaver, tall og bindestrek');
      setAvailable(false);
      onValidChange?.(false);
      return;
    }

    const timer = setTimeout(() => {
      checkAvailability(value);
    }, 500);

    return () => clearTimeout(timer);
  }, [value]);

  async function checkAvailability(subdomain: string) {
    setChecking(true);
    setError(null);
    
    try {
      const res = await fetch(`/api/public/check-subdomain?subdomain=${encodeURIComponent(subdomain)}`);
      const data = await res.json();
      
      if (res.ok) {
        setAvailable(data.available);
        onValidChange?.(data.available);
        if (!data.available) {
          setError('Dette navnet er allerede tatt');
        }
      } else {
        setError(data.error || 'Kunne ikke sjekke tilgjengelighet');
        setAvailable(false);
        onValidChange?.(false);
      }
    } catch (err) {
      console.error('Error checking subdomain:', err);
      setError('Nettverksfeil');
      setAvailable(false);
      onValidChange?.(false);
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-900">
        Din booking-adresse
      </label>
      
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              placeholder="dittfirma"
              className={`
                w-full pl-10 pr-10 py-3 border-2 rounded-lg font-mono
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                ${error ? 'border-red-300 bg-red-50' : 
                  available ? 'border-green-300 bg-green-50' : 
                  'border-slate-300'}
              `}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {checking && <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />}
              {!checking && available === true && <Check className="h-5 w-5 text-green-600" />}
              {!checking && available === false && <X className="h-5 w-5 text-red-600" />}
            </div>
          </div>
          <span className="text-slate-600 font-mono">.lyxso.no</span>
        </div>
      </div>

      {/* Preview URL */}
      {value && (
        <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="text-xs text-slate-600 mb-1">Din booking-side vil være tilgjengelig på:</div>
          <div className="font-mono text-sm text-blue-600">
            https://www.{value}.lyxso.no
          </div>
        </div>
      )}

      {/* Status messages */}
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <X className="h-4 w-4" />
          {error}
        </p>
      )}
      {available && !error && (
        <p className="text-sm text-green-600 flex items-center gap-1">
          <Check className="h-4 w-4" />
          Dette navnet er ledig!
        </p>
      )}

      <p className="text-xs text-slate-500">
        Minimum 3 tegn. Kun små bokstaver, tall og bindestrek.
      </p>
    </div>
  );
}
