'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function BrukervilkarPage() {
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  const handleAccept = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_terms_acceptance')
        .insert({
          user_id: user.id,
          terms_version: '1.0.0',
          privacy_version: '1.0.0',
          cookie_version: '1.0.0',
          ip_address: 'N/A',
          user_agent: navigator.userAgent
        });

      if (!error) {
        router.push('/min-side');
      }
    } catch (err) {
      console.error('Feil ved aksept:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Brukervilkår for LYX.so
              </h1>
              <p className="text-blue-300">Versjon 1.0.0 • Sist oppdatert: 4. desember 2024</p>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center space-x-2 px-4 py-2 bg-blue-600/20 rounded-lg border border-blue-500/30">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm font-medium text-blue-300">Juridisk bindende dokument</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 shadow-2xl">
          
          {/* Important Notice */}
          <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 border-l-4 border-red-500 p-6 m-6 rounded-lg">
            <div className="flex items-start">
              <svg className="w-8 h-8 text-red-400 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="ml-4">
                <h3 className="text-xl font-bold text-white mb-2">VIKTIG JURIDISK INFORMASJON</h3>
                <p className="text-red-100 text-base leading-relaxed">
                  Ved å bruke LYX.so aksepterer du disse vilkårene i sin helhet. Les nøye gjennom. 
                  Disse vilkårene begrenser LYX.so sitt ansvar til det maksimale som loven tillater.
                </p>
              </div>
            </div>
          </div>

          {/* Sections - abbreviated for space, see full implementation */}
          <div className="p-6 sm:p-8 space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Definisjoner</h2>
              <p className="text-gray-300">Disse brukervilkårene regulerer bruken av LYX.so sine tjenester...</p>
            </section>

            {/* Section 5 - CRITICAL LIABILITY SECTION */}
            <section id="section-5" className="scroll-mt-8">
              <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-blue-500/30">
                5. Ansvarsbegrensninger - SVÆRT VIKTIG
              </h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <div className="bg-red-900/30 p-6 rounded-lg border-2 border-red-500/50">
                  <h3 className="text-xl font-bold text-white mb-3 uppercase">MAKSIMAL ANSVARSBEGRENSNING</h3>
                  <p className="text-red-100 font-semibold uppercase mb-4">
                    I DEN GRAD GJELDENDE LOV TILLATER, FRASKRIVER LYX.SO SEG ALT ANSVAR FOR:
                  </p>
                  <div className="space-y-2 text-sm">
                    <div>▪ Direkte, indirekte, tilfeldig, følge- eller straffeskader</div>
                    <div>▪ Tap av fortjeneste, inntekt, data eller goodwill</div>
                    <div>▪ Driftsavbrudd eller forretningsforstyrrelser</div>
                    <div>▪ Feil, bugs, virus eller andre skadelige komponenter</div>
                    <div>▪ Uautorisert tilgang til eller endring av data</div>
                    <div>▪ Feil i bookinger, priser eller tjenesteleveranse</div>
                    <div>▪ Tap eller skade på kjøretøy, dekk eller andre gjenstander</div>
                    <div>▪ Handlinger eller unnlatelser fra tredjeparts leverandører</div>
                  </div>
                  <div className="mt-6 p-4 bg-black/30 rounded border border-yellow-500/50">
                    <p className="text-yellow-200 font-bold uppercase text-center">
                      LYX.SO SITT TOTALE ANSVAR VIL ALDRI OVERSTIGE 500 NOK
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Accept Section */}
          {user && (
            <div className="p-6 border-t border-blue-500/20 bg-slate-900/50">
              <div className="max-w-2xl mx-auto">
                <div className="flex items-start space-x-4">
                  <input
                    type="checkbox"
                    id="accept"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    className="w-6 h-6 rounded border-blue-500/50 text-blue-600 mt-1"
                  />
                  <label htmlFor="accept" className="text-gray-300 text-sm flex-1 cursor-pointer">
                    Jeg bekrefter at jeg har lest, forstått og aksepterer disse Brukervilkårene.
                  </label>
                </div>
                <button
                  onClick={handleAccept}
                  disabled={!accepted || loading}
                  className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? 'Lagrer...' : 'Aksepter og fortsett'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
