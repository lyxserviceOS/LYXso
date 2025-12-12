'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface SubdomainCheckerProps {
  onSubdomainChange?: (subdomain: string, isAvailable: boolean) => void;
  initialValue?: string;
}

export function SubdomainChecker({ onSubdomainChange, initialValue = '' }: SubdomainCheckerProps) {
  const [subdomain, setSubdomain] = useState(initialValue);
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<'idle' | 'available' | 'taken'>('idle');
  const [error, setError] = useState('');

  const checkSubdomain = async () => {
    if (!subdomain || subdomain.length < 3) {
      setError('Subdomenet må være minst 3 tegn');
      setStatus('idle');
      return;
    }

    // Validate subdomain format
    const subdomainRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
    if (!subdomainRegex.test(subdomain)) {
      setError('Kun små bokstaver, tall og bindestrek. Må starte og slutte med bokstav/tall.');
      setStatus('idle');
      return;
    }

    setChecking(true);
    setError('');

    try {
      const response = await fetch(`/api/check-subdomain?subdomain=${encodeURIComponent(subdomain)}`);
      const data = await response.json();

      if (data.available) {
        setStatus('available');
        onSubdomainChange?.(subdomain, true);
      } else {
        setStatus('taken');
        setError(data.message || 'Dette subdomenet er allerede i bruk');
        onSubdomainChange?.(subdomain, false);
      }
    } catch (err) {
      setError('Kunne ikke sjekke subdomen. Prøv igjen.');
      setStatus('idle');
    } finally {
      setChecking(false);
    }
  };

  const handleInputChange = (value: string) => {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSubdomain(cleaned);
    setStatus('idle');
    setError('');
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Velg ditt subdomen</label>
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 border rounded-lg px-3 py-2 bg-white">
          <Input
            type="text"
            value={subdomain}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="minbedrift"
            className="border-0 p-0 h-auto focus-visible:ring-0"
            onKeyDown={(e) => e.key === 'Enter' && checkSubdomain()}
          />
          <span className="text-sm text-gray-500">.lyxso.no</span>
        </div>
        <Button
          onClick={checkSubdomain}
          disabled={checking || subdomain.length < 3}
          variant="outline"
        >
          {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sjekk'}
        </Button>
      </div>

      {/* Status indicator */}
      {status === 'available' && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle2 className="h-4 w-4" />
          <span>Tilgjengelig! {subdomain}.lyxso.no er ledig</span>
        </div>
      )}

      {status === 'taken' && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <XCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {error && status === 'idle' && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <p className="text-xs text-gray-500">
        Dette blir din offentlige bookingside (krever betalt plan)
      </p>
    </div>
  );
}
