'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();
  
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMsg('Passordene matcher ikke.');
      return;
    }
    
    if (password.length < 8) {
      setMsg('Passordet må være minst 8 tegn langt.');
      return;
    }
    
    setBusy(true);
    setMsg(null);
    
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) {
        setMsg(error.message);
        return;
      }
      
      setMsg('Passord oppdatert! Videresender...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      setMsg('Noe gikk galt. Prøv igjen.');
    } finally {
      setBusy(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sett nytt passord
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Velg et sterkt passord med minst 8 tegn.
          </p>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Nytt passord
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Bekreft passord
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={busy}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy ? 'Oppdaterer...' : 'Oppdater passord'}
          </button>
          
          {msg && (
            <div className={`p-4 rounded-md ${msg.includes('oppdatert') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              <p className="text-sm">{msg}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
