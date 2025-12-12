'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function CustomerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Send magic link via Supabase
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/min-side`,
        },
      });

      if (error) throw error;

      setMessage(
        'Sjekk e-posten din! Vi har sendt deg en innloggingslenke.'
      );
    } catch (err: any) {
      setError(err.message || 'Noe gikk galt. Vennligst prøv igjen.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Kundeportal
          </h1>
          <p className="text-slate-600">
            Logg inn for å se dine bookinger, dekk, coating og mer
          </p>
        </div>

        {/* Login form */}
        <div className="card">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-900 mb-2"
              >
                E-postadresse
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="din@epost.no"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Vi sender deg en sikker innloggingslenke via e-post
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {message && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">{message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                'Sender...'
              ) : (
                <>
                  Send innloggingslenke
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-slate-600">
          <p>
            Første gang?{' '}
            <span className="text-slate-900 font-semibold">
              E-postadressen du brukte ved booking
            </span>{' '}
            gir deg automatisk tilgang.
          </p>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← Tilbake til forsiden
          </a>
        </div>
      </div>
    </div>
  );
}
