'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

const EMAIL_COOLDOWN_MS = 60_000;
const RATE_LIMIT_COOLDOWN_MS = 5 * 60_000;

export default function RecoverForm() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const nextAllowedAt = useRef<number>(0);
  const [cooldownLeft, setCooldownLeft] = useState<number>(0);
  
  useEffect(() => {
    const id = setInterval(() => {
      const left = Math.max(0, nextAllowedAt.current - Date.now());
      setCooldownLeft(Math.ceil(left / 1000));
    }, 500);
    return () => clearInterval(id);
  }, []);
  
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    
    if (Date.now() < nextAllowedAt.current) {
      setMsg(`Vent ${cooldownLeft}s før du prøver igjen.`);
      return;
    }
    
    setBusy(true);
    setMsg(null);
    
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${location.origin}/auth/callback?next=/reset-password`,
      });
      
      if (error) {
        const isRate = /rate limit/i.test(error.message);
        nextAllowedAt.current = Date.now() + (isRate ? RATE_LIMIT_COOLDOWN_MS : EMAIL_COOLDOWN_MS);
        setMsg(isRate ? 'For mange forsøk. Prøv igjen om noen minutter.' : error.message);
        return;
      }
      
      nextAllowedAt.current = Date.now() + EMAIL_COOLDOWN_MS;
      setMsg('E-post sendt hvis adressen finnes.');
    } finally {
      setBusy(false);
    }
  };
  
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          E-postadresse
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="din@epost.no"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>
      
      <button 
        type="submit" 
        disabled={busy || Date.now() < nextAllowedAt.current}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {busy ? 'Sender...' : cooldownLeft > 0 ? `Vent ${cooldownLeft}s` : 'Send tilbakestillingslenke'}
      </button>
      
      {msg && (
        <div className={`p-4 rounded-md ${msg.includes('sendt') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          <p className="text-sm">{msg}</p>
        </div>
      )}
    </form>
  );
}
