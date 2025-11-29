'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type CookieConsent = {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
};

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true, // Alltid på
    functional: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Sjekk om bruker allerede har gitt samtykke
    const savedConsent = localStorage.getItem('lyxso_cookie_consent');
    if (!savedConsent) {
      // Vent 1 sekund før vi viser banner (bedre UX)
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const saveConsent = (newConsent: CookieConsent) => {
    localStorage.setItem('lyxso_cookie_consent', JSON.stringify(newConsent));
    localStorage.setItem('lyxso_cookie_consent_date', new Date().toISOString());
    
    // Sett faktiske cookies basert på samtykke
    if (newConsent.analytics) {
      // Aktiver Google Analytics / Plausible
      window.gtag?.('consent', 'update', {
        analytics_storage: 'granted',
      });
    }
    
    if (newConsent.marketing) {
      // Aktiver Meta Pixel / Google Ads
      window.gtag?.('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
      });
    }

    setShowBanner(false);
    setShowSettings(false);
  };

  const acceptAll = () => {
    const allConsent = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    saveConsent(allConsent);
  };

  const acceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    saveConsent(necessaryOnly);
  };

  const acceptCustom = () => {
    saveConsent(consent);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!showSettings ? (
          // Standard banner
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-100 mb-2">
                Vi bruker informasjonskapsler
              </h3>
              <p className="text-sm text-slate-300">
                LYXso bruker cookies for å gi deg best mulig opplevelse. Noen cookies er nødvendige
                for at nettstedet skal fungere, mens andre hjelper oss å forbedre tjenesten og vise
                relevant innhold.{' '}
                <Link href="/cookies" className="text-blue-400 hover:underline">
                  Les mer om cookies
                </Link>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <button
                onClick={() => setShowSettings(true)}
                className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg transition-colors text-sm font-medium"
              >
                Innstillinger
              </button>
              <button
                onClick={acceptNecessary}
                className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg transition-colors text-sm font-medium"
              >
                Kun nødvendige
              </button>
              <button
                onClick={acceptAll}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Godta alle
              </button>
            </div>
          </div>
        ) : (
          // Innstillinger
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-4">
              Cookie-innstillinger
            </h3>
            
            <div className="space-y-4 mb-6">
              {/* Nødvendige cookies */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <label className="flex items-center gap-2 font-medium text-slate-100">
                    <input
                      type="checkbox"
                      checked={consent.necessary}
                      disabled
                      className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-600"
                    />
                    Strengt nødvendige
                  </label>
                  <p className="text-sm text-slate-400 mt-1 ml-6">
                    Disse cookiesene er nødvendige for at nettstedet skal fungere og kan ikke slås av.
                    Inkluderer autentisering og sesjonshåndtering.
                  </p>
                </div>
              </div>

              {/* Funksjonelle cookies */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <label className="flex items-center gap-2 font-medium text-slate-100">
                    <input
                      type="checkbox"
                      checked={consent.functional}
                      onChange={(e) => setConsent({ ...consent, functional: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-600"
                    />
                    Funksjonelle
                  </label>
                  <p className="text-sm text-slate-400 mt-1 ml-6">
                    Lar oss huske dine valg og preferanser (f.eks. tema, språk) for en bedre brukeropplevelse.
                  </p>
                </div>
              </div>

              {/* Analyse cookies */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <label className="flex items-center gap-2 font-medium text-slate-100">
                    <input
                      type="checkbox"
                      checked={consent.analytics}
                      onChange={(e) => setConsent({ ...consent, analytics: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-600"
                    />
                    Ytelse og analyse
                  </label>
                  <p className="text-sm text-slate-400 mt-1 ml-6">
                    Hjelper oss å forstå hvordan du bruker nettstedet, slik at vi kan forbedre det.
                    Inkluderer Google Analytics og Plausible.
                  </p>
                </div>
              </div>

              {/* Markedsføring cookies */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <label className="flex items-center gap-2 font-medium text-slate-100">
                    <input
                      type="checkbox"
                      checked={consent.marketing}
                      onChange={(e) => setConsent({ ...consent, marketing: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-600"
                    />
                    Markedsføring
                  </label>
                  <p className="text-sm text-slate-400 mt-1 ml-6">
                    Brukes til å vise relevant markedsføring og måle effekten av kampanjer.
                    Inkluderer Meta Pixel og Google Ads.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowSettings(false)}
                className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg transition-colors text-sm font-medium"
              >
                Tilbake
              </button>
              <button
                onClick={acceptNecessary}
                className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg transition-colors text-sm font-medium"
              >
                Kun nødvendige
              </button>
              <button
                onClick={acceptCustom}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium flex-1 sm:flex-none"
              >
                Lagre innstillinger
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
