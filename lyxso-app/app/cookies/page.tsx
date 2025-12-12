'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Eye, Cookie, Home, Menu, X, Shield, FileText, Mail,
  CheckCircle, Settings, Info, Globe, Lock, BarChart
} from 'lucide-react';

export default function CookiesPage() {
  const [showTOC, setShowTOC] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    functional: true,
    analytics: false,
    marketing: false
  });

  const handleSavePreferences = () => {
    localStorage.setItem('lyxso_cookie_preferences', JSON.stringify(cookiePreferences));
    alert('✅ Cookie-innstillinger lagret!');
  };

  return (
    <main className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 min-h-screen">
      {/* Mobile Navigation */}
      <div className="lg:hidden sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-700">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white">
            <Home className="w-5 h-5" />
            <span className="text-sm font-medium">Hjem</span>
          </Link>
          <button
            onClick={() => setShowTOC(!showTOC)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 text-purple-400 rounded-lg border border-purple-500/30"
          >
            {showTOC ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            <span className="text-sm font-semibold">Innhold</span>
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-purple-600/30 to-purple-800/30 rounded-2xl mb-8 border-2 border-purple-500/30">
              <Cookie className="w-10 h-10 lg:w-12 lg:h-12 text-purple-400" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
              Cookie-policy
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8">
              Hvordan LYXso bruker informasjonskapsler (cookies) for å forbedre din brukeropplevelse
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/personvern" className="px-6 py-3 bg-green-600/20 text-green-400 rounded-lg border border-green-500/30 hover:bg-green-600/30">
                <Shield className="w-4 h-4 inline mr-2" />Personvern
              </Link>
              <Link href="/bruksvilkar" className="px-6 py-3 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30 hover:bg-blue-600/30">
                <FileText className="w-4 h-4 inline mr-2" />Bruksvilkår
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Manager */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-gradient-to-r from-purple-900/40 to-purple-800/40 border-2 border-purple-600/60 rounded-2xl p-6 lg:p-8">
          <h3 className="text-2xl font-bold text-purple-100 mb-6 flex items-center gap-3">
            <Settings className="w-8 h-8" />
            Cookie-innstillinger
          </h3>

          <div className="space-y-4">
            <div className="bg-slate-800/50 p-5 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="font-semibold">Nødvendige cookies</span>
                </div>
                <span className="px-3 py-1 bg-green-900/30 text-green-400 text-xs rounded-full">Alltid på</span>
              </div>
              <p className="text-sm text-slate-400">Essensielle for at siden skal fungere</p>
            </div>

            <div className="bg-slate-800/50 p-5 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-blue-400" />
                  <span className="font-semibold">Funksjonelle cookies</span>
                </div>
                <button
                  onClick={() => setCookiePreferences(p => ({ ...p, functional: !p.functional }))}
                  className={`w-14 h-7 rounded-full ${cookiePreferences.functional ? 'bg-blue-600' : 'bg-slate-600'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${cookiePreferences.functional ? 'translate-x-8' : 'translate-x-1'}`} />
                </button>
              </div>
              <p className="text-sm text-slate-400">Husker dine preferanser</p>
            </div>

            <div className="bg-slate-800/50 p-5 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <BarChart className="w-5 h-5 text-purple-400" />
                  <span className="font-semibold">Analyse cookies</span>
                </div>
                <button
                  onClick={() => setCookiePreferences(p => ({ ...p, analytics: !p.analytics }))}
                  className={`w-14 h-7 rounded-full ${cookiePreferences.analytics ? 'bg-purple-600' : 'bg-slate-600'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${cookiePreferences.analytics ? 'translate-x-8' : 'translate-x-1'}`} />
                </button>
              </div>
              <p className="text-sm text-slate-400">Hjelper oss forbedre tjenesten</p>
            </div>
          </div>

          <button
            onClick={handleSavePreferences}
            className="w-full mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg"
          >
            Lagre innstillinger
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-slate-900/70 rounded-2xl p-6 lg:p-10 space-y-10">
          
          <section>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Info className="w-8 h-8 text-purple-400" />
              Hva er cookies?
            </h2>
            <p className="text-slate-300 leading-relaxed">
              Cookies er små tekstfiler som lagres på din enhet når du besøker nettsteder. De brukes
              til å gjenkjenne deg ved senere besøk og forbedre brukeropplevelsen.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6">Cookies vi bruker</h2>
            <div className="bg-purple-900/20 p-6 rounded-xl border border-purple-700/30">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3">Cookie</th>
                    <th className="text-left py-3">Formål</th>
                    <th className="text-left py-3">Varighet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr>
                    <td className="py-3 font-mono text-xs">sb-access-token</td>
                    <td className="py-3">Autentisering</td>
                    <td className="py-3">1 time</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-mono text-xs">sb-refresh-token</td>
                    <td className="py-3">Fornye pålogging</td>
                    <td className="py-3">30 dager</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-mono text-xs">lyxso_preferences</td>
                    <td className="py-3">Brukervalg</td>
                    <td className="py-3">1 år</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6">Slik blokkerer du cookies</h2>
            <p className="text-slate-300 mb-4">
              Du kan når som helst blokkere cookies i nettleserinnstillingene dine:
            </p>
            <ul className="space-y-2 list-disc list-inside text-slate-300">
              <li><strong>Chrome:</strong> Innstillinger → Personvern og sikkerhet → Cookies</li>
              <li><strong>Firefox:</strong> Innstillinger → Personvern og sikkerhet → Cookies</li>
              <li><strong>Safari:</strong> Innstillinger → Personvern → Blokkér alle cookies</li>
              <li><strong>Edge:</strong> Innstillinger → Cookies og nettstedtillatelser</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6">Kontakt oss</h2>
            <p className="text-slate-300 mb-4">
              Har du spørsmål om vår bruk av cookies? Kontakt oss:
            </p>
            <div className="bg-slate-800/50 p-5 rounded-lg">
              <p className="flex items-center gap-2 mb-2">
                <Mail className="w-5 h-5 text-purple-400" />
                <a href="mailto:personvern@lyxso.no" className="text-purple-400 hover:text-purple-300">
                  personvern@lyxso.no
                </a>
              </p>
            </div>
          </section>

        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 border-t border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
          <Cookie className="w-20 h-20 text-purple-400 mx-auto mb-6" />
          <h3 className="text-4xl font-bold mb-4">Du har kontroll</h3>
          <p className="text-lg text-slate-300 mb-8">
            Administrer dine cookie-innstillinger når som helst
          </p>
          <button
            onClick={() => window.scrollTo({ top: 300, behavior: 'smooth' })}
            className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl"
          >
            Gå til innstillinger
          </button>
        </div>
      </div>
    </main>
  );
}
