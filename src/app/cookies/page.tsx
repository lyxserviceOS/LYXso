'use client';

import { useState } from 'react';

export default function CookiePolicyPage() {
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: true,
    analytics: true,
    marketing: true
  });

  const handleSavePreferences = () => {
    localStorage.setItem('cookie_preferences', JSON.stringify(preferences));
    alert('Cookie-preferanser lagret!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-green-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Cookie-policy
              </h1>
              <p className="text-green-300">Transparens om cookies og sporings teknologier • Versjon 1.0.0</p>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-600/20 rounded-lg border border-green-500/30">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span className="text-sm font-medium text-green-300">Full cookie-kontroll</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-green-500/20 shadow-2xl">
          
          {/* Cookie Manager */}
          <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border-l-4 border-green-500 p-6 m-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-4">Administrer dine cookie-preferanser</h3>
            <div className="space-y-4">
              
              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                <div className="flex-1">
                  <h4 className="text-white font-semibold mb-1">Nødvendige cookies</h4>
                  <p className="text-sm text-gray-400">Påkrevd for at nettstedet skal fungere. Kan ikke deaktiveres.</p>
                </div>
                <div className="ml-4">
                  <input type="checkbox" checked disabled className="w-6 h-6 rounded" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                <div className="flex-1">
                  <h4 className="text-white font-semibold mb-1">Funksjonelle cookies</h4>
                  <p className="text-sm text-gray-400">Forbedrer funksjonalitet og personalisering.</p>
                </div>
                <div className="ml-4">
                  <input 
                    type="checkbox" 
                    checked={preferences.functional}
                    onChange={(e) => setPreferences({...preferences, functional: e.target.checked})}
                    className="w-6 h-6 rounded" 
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                <div className="flex-1">
                  <h4 className="text-white font-semibold mb-1">Analyse-cookies</h4>
                  <p className="text-sm text-gray-400">Hjelper oss forstå hvordan besøkende bruker nettstedet.</p>
                </div>
                <div className="ml-4">
                  <input 
                    type="checkbox" 
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({...preferences, analytics: e.target.checked})}
                    className="w-6 h-6 rounded" 
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                <div className="flex-1">
                  <h4 className="text-white font-semibold mb-1">Markedsførings-cookies</h4>
                  <p className="text-sm text-gray-400">Brukes til å vise relevant reklame og målrettet markedsføring.</p>
                </div>
                <div className="ml-4">
                  <input 
                    type="checkbox" 
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({...preferences, marketing: e.target.checked})}
                    className="w-6 h-6 rounded" 
                  />
                </div>
              </div>

              <button 
                onClick={handleSavePreferences}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-blue-700 transition-all"
              >
                Lagre preferanser
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 sm:p-8 space-y-10">

            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-green-500/30">
                1. Hva er cookies?
              </h2>
              <div className="space-y-4 text-gray-300">
                <p className="text-base">
                  Cookies er små tekstfiler som lagres på din enhet (datamaskin, mobiltelefon, nettbrett) 
                  når du besøker et nettsted. De brukes til å gjenkjenne enheten din ved senere besøk og 
                  husker preferanser og innstillinger.
                </p>
                <div className="bg-slate-900/50 p-6 rounded-lg border border-green-500/20 space-y-4">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Typer cookies</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong className="text-white">Session cookies:</strong>
                        <p className="text-gray-400 mt-1">Midlertidige cookies som slettes når du lukker nettleseren.</p>
                      </div>
                      <div>
                        <strong className="text-white">Persistent cookies:</strong>
                        <p className="text-gray-400 mt-1">Forblir på enheten i en bestemt periode eller til de slettes manuelt.</p>
                      </div>
                      <div>
                        <strong className="text-white">Førsteparts cookies:</strong>
                        <p className="text-gray-400 mt-1">Satt av LYX.so direkte.</p>
                      </div>
                      <div>
                        <strong className="text-white">Tredjeparts cookies:</strong>
                        <p className="text-gray-400 mt-1">Satt av eksterne tjenester som Google Analytics, Facebook, etc.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-green-500/30">
                2. Hvorfor bruker vi cookies?
              </h2>
              <div className="space-y-4 text-gray-300">
                <p className="text-base">
                  Vi bruker cookies for å forbedre din brukeropplevelse, analysere trafikk, 
                  personalisere innhold og levere målrettet markedsføring.
                </p>
              </div>
            </section>

            {/* Section 3 - Detailed Cookie Categories */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-green-500/30">
                3. Kategorier av cookies vi bruker
              </h2>
              <div className="space-y-6 text-gray-300">

                {/* Necessary Cookies */}
                <div className="bg-slate-900/50 p-6 rounded-xl border border-green-500/20">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">Nødvendige cookies (Strictly Necessary)</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Disse cookies er essensielle for at nettstedet skal fungere. De kan ikke deaktiveres.
                      </p>
                      <div className="space-y-3">
                        <div className="bg-black/30 p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            <div>
                              <strong className="text-white">Cookie-navn:</strong>
                              <p className="text-gray-400">sb-access-token</p>
                            </div>
                            <div>
                              <strong className="text-white">Formål:</strong>
                              <p className="text-gray-400">Autentisering og pålogging</p>
                            </div>
                            <div>
                              <strong className="text-white">Varighet:</strong>
                              <p className="text-gray-400">Session / 7 dager</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-black/30 p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            <div>
                              <strong className="text-white">Cookie-navn:</strong>
                              <p className="text-gray-400">sb-refresh-token</p>
                            </div>
                            <div>
                              <strong className="text-white">Formål:</strong>
                              <p className="text-gray-400">Fornye autentisering</p>
                            </div>
                            <div>
                              <strong className="text-white">Varighet:</strong>
                              <p className="text-gray-400">30 dager</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-black/30 p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            <div>
                              <strong className="text-white">Cookie-navn:</strong>
                              <p className="text-gray-400">CSRF-token</p>
                            </div>
                            <div>
                              <strong className="text-white">Formål:</strong>
                              <p className="text-gray-400">Sikkerhet mot CSRF-angrep</p>
                            </div>
                            <div>
                              <strong className="text-white">Varighet:</strong>
                              <p className="text-gray-400">Session</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-black/30 p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            <div>
                              <strong className="text-white">Cookie-navn:</strong>
                              <p className="text-gray-400">cookie_consent</p>
                            </div>
                            <div>
                              <strong className="text-white">Formål:</strong>
                              <p className="text-gray-400">Lagrer dine cookie-preferanser</p>
                            </div>
                            <div>
                              <strong className="text-white">Varighet:</strong>
                              <p className="text-gray-400">1 år</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Functional Cookies */}
                <div className="bg-slate-900/50 p-6 rounded-xl border border-green-500/20">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">Funksjonelle cookies</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Forbedrer funksjonalitet og personalisering av tjenesten.
                      </p>
                      <div className="space-y-3">
                        <div className="bg-black/30 p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            <div>
                              <strong className="text-white">Cookie-navn:</strong>
                              <p className="text-gray-400">user_preferences</p>
                            </div>
                            <div>
                              <strong className="text-white">Formål:</strong>
                              <p className="text-gray-400">Lagrer språk, tema og innstillinger</p>
                            </div>
                            <div>
                              <strong className="text-white">Varighet:</strong>
                              <p className="text-gray-400">1 år</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-black/30 p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            <div>
                              <strong className="text-white">Cookie-navn:</strong>
                              <p className="text-gray-400">recent_searches</p>
                            </div>
                            <div>
                              <strong className="text-white">Formål:</strong>
                              <p className="text-gray-400">Husker nylige søk</p>
                            </div>
                            <div>
                              <strong className="text-white">Varighet:</strong>
                              <p className="text-gray-400">30 dager</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-black/30 p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            <div>
                              <strong className="text-white">Cookie-navn:</strong>
                              <p className="text-gray-400">viewed_items</p>
                            </div>
                            <div>
                              <strong className="text-white">Formål:</strong>
                              <p className="text-gray-400">Viser nylig viste elementer</p>
                            </div>
                            <div>
                              <strong className="text-white">Varighet:</strong>
                              <p className="text-gray-400">90 dager</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="bg-slate-900/50 p-6 rounded-xl border border-green-500/20">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">Analyse-cookies (Analytics)</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Hjelper oss forstå hvordan besøkende bruker nettstedet, hvilke sider som er populære, og hvordan vi kan forbedre tjenesten.
                      </p>
                      <div className="space-y-3">
                        <div className="bg-black/30 p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <strong className="text-white">Leverandør:</strong>
                              <p className="text-gray-400">Google Analytics</p>
                            </div>
                            <div>
                              <strong className="text-white">Cookie-navn:</strong>
                              <p className="text-gray-400">_ga, _gid, _gat</p>
                            </div>
                            <div>
                              <strong className="text-white">Formål:</strong>
                              <p className="text-gray-400">Webanalyse og statistikk</p>
                            </div>
                            <div>
                              <strong className="text-white">Varighet:</strong>
                              <p className="text-gray-400">2 år / 24 timer / 1 minutt</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-black/30 p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <strong className="text-white">Leverandør:</strong>
                              <p className="text-gray-400">Sentry</p>
                            </div>
                            <div>
                              <strong className="text-white">Cookie-navn:</strong>
                              <p className="text-gray-400">sentry-session</p>
                            </div>
                            <div>
                              <strong className="text-white">Formål:</strong>
                              <p className="text-gray-400">Feilrapportering og performance</p>
                            </div>
                            <div>
                              <strong className="text-white">Varighet:</strong>
                              <p className="text-gray-400">Session</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-black/30 p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <strong className="text-white">Leverandør:</strong>
                              <p className="text-gray-400">Hotjar (hvis brukt)</p>
                            </div>
                            <div>
                              <strong className="text-white">Cookie-navn:</strong>
                              <p className="text-gray-400">_hjid, _hjIncludedInSample</p>
                            </div>
                            <div>
                              <strong className="text-white">Formål:</strong>
                              <p className="text-gray-400">Heatmaps og brukeradferd</p>
                            </div>
                            <div>
                              <strong className="text-white">Varighet:</strong>
                              <p className="text-gray-400">1 år / Session</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="bg-slate-900/50 p-6 rounded-xl border border-green-500/20">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">Markedsførings-cookies (Marketing)</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Brukes til å vise relevant reklame basert på dine interesser og spore effektiviteten av kampanjer.
                      </p>
                      <div className="space-y-3">
                        <div className="bg-black/30 p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <strong className="text-white">Leverandør:</strong>
                              <p className="text-gray-400">Facebook Pixel</p>
                            </div>
                            <div>
                              <strong className="text-white">Cookie-navn:</strong>
                              <p className="text-gray-400">_fbp, fr</p>
                            </div>
                            <div>
                              <strong className="text-white">Formål:</strong>
                              <p className="text-gray-400">Målrettet annonsering på Facebook</p>
                            </div>
                            <div>
                              <strong className="text-white">Varighet:</strong>
                              <p className="text-gray-400">3 måneder / 90 dager</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-black/30 p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <strong className="text-white">Leverandør:</strong>
                              <p className="text-gray-400">Google Ads</p>
                            </div>
                            <div>
                              <strong className="text-white">Cookie-navn:</strong>
                              <p className="text-gray-400">_gcl_au, IDE</p>
                            </div>
                            <div>
                              <strong className="text-white">Formål:</strong>
                              <p className="text-gray-400">Google Ads konverteringssporing</p>
                            </div>
                            <div>
                              <strong className="text-white">Varighet:</strong>
                              <p className="text-gray-400">90 dager / 13 måneder</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-black/30 p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <strong className="text-white">Leverandør:</strong>
                              <p className="text-gray-400">LinkedIn Insight</p>
                            </div>
                            <div>
                              <strong className="text-white">Cookie-navn:</strong>
                              <p className="text-gray-400">li_sugr, UserMatchHistory</p>
                            </div>
                            <div>
                              <strong className="text-white">Formål:</strong>
                              <p className="text-gray-400">LinkedIn annonsering B2B</p>
                            </div>
                            <div>
                              <strong className="text-white">Varighet:</strong>
                              <p className="text-gray-400">90 dager / 30 dager</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-green-500/30">
                4. Andre sporingsteknologier
              </h2>
              <div className="space-y-4 text-gray-300">
                <p className="text-base">I tillegg til cookies bruker vi andre sporingsteknologier:</p>
                <div className="bg-slate-900/50 p-6 rounded-lg border border-green-500/20 space-y-4">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Web Beacons (Piksel-tags)</h4>
                    <p className="text-sm text-gray-400">
                      Små usynlige bilder innebygd i e-poster eller nettsider for å spore åpninger og klikk.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Local Storage</h4>
                    <p className="text-sm text-gray-400">
                      Lagring av data i nettleseren for å forbedre ytelse og brukeropplevelse.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Session Storage</h4>
                    <p className="text-sm text-gray-400">
                      Midlertidig lagring som slettes når nettleserfanen lukkes.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Fingerprinting</h4>
                    <p className="text-sm text-gray-400">
                      Samling av teknisk informasjon om enheten for å identifisere gjentatte besøk.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-green-500/30">
                5. Hvordan administrere og slette cookies
              </h2>
              <div className="space-y-4 text-gray-300">
                <div className="bg-slate-900/50 p-6 rounded-lg border border-green-500/20 space-y-4">
                  <div>
                    <h4 className="text-white font-semibold mb-3">Administrer via nettleserinnstillinger</h4>
                    <p className="text-sm text-gray-400 mb-3">Du kan kontrollere cookies via nettleserinnstillingene:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-black/30 p-4 rounded-lg">
                        <strong className="text-white">Google Chrome:</strong>
                        <p className="text-sm text-gray-400 mt-2">
                          Innstillinger → Personvern og sikkerhet → Cookies og andre nettstedsdata
                        </p>
                      </div>
                      <div className="bg-black/30 p-4 rounded-lg">
                        <strong className="text-white">Firefox:</strong>
                        <p className="text-sm text-gray-400 mt-2">
                          Innstillinger → Personvern og sikkerhet → Cookies og nettstedsdata
                        </p>
                      </div>
                      <div className="bg-black/30 p-4 rounded-lg">
                        <strong className="text-white">Safari:</strong>
                        <p className="text-sm text-gray-400 mt-2">
                          Innstillinger → Personvern → Administrer nettstedsdata
                        </p>
                      </div>
                      <div className="bg-black/30 p-4 rounded-lg">
                        <strong className="text-white">Edge:</strong>
                        <p className="text-sm text-gray-400 mt-2">
                          Innstillinger → Personvern, søk og tjenester → Cookies
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-3">Opt-out fra tredjepartsannonser</h4>
                    <div className="space-y-2 text-sm text-gray-400">
                      <div>• <strong className="text-white">Google Ads:</strong> <a href="https://adssettings.google.com" className="text-green-400 hover:underline">adssettings.google.com</a></div>
                      <div>• <strong className="text-white">Facebook:</strong> <a href="https://www.facebook.com/ads/preferences" className="text-green-400 hover:underline">facebook.com/ads/preferences</a></div>
                      <div>• <strong className="text-white">Your Online Choices:</strong> <a href="https://www.youronlinechoices.com" className="text-green-400 hover:underline">youronlinechoices.com</a></div>
                      <div>• <strong className="text-white">Network Advertising Initiative:</strong> <a href="https://optout.networkadvertising.org" className="text-green-400 hover:underline">optout.networkadvertising.org</a></div>
                    </div>
                  </div>

                  <div className="bg-yellow-900/20 p-4 rounded border border-yellow-500/30">
                    <h4 className="text-white font-semibold mb-2">Viktig å vite</h4>
                    <p className="text-sm text-yellow-100">
                      Hvis du blokkerer eller sletter cookies, kan visse funksjoner på nettstedet slutte å virke korrekt. 
                      Du vil kanskje måtte logge inn på nytt og miste lagrede preferanser.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-green-500/30">
                6. Do Not Track (DNT)
              </h2>
              <div className="space-y-4 text-gray-300">
                <p className="text-sm">
                  Noen nettlesere tilbyr en "Do Not Track" (DNT) funksjon som sender et signal til nettsteder om 
                  at du ikke ønsker å bli sporet. For øyeblikket finnes det ingen industristandard for hvordan 
                  nettsteder skal respondere på DNT-signaler. LYX.so responder ikke automatisk til DNT-signaler, 
                  men du kan administrere cookies manuelt som beskrevet ovenfor.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-green-500/30">
                7. Endringer i Cookie-policy
              </h2>
              <div className="space-y-4 text-gray-300">
                <p className="text-sm">
                  Vi kan oppdatere denne Cookie-policy fra tid til annen for å reflektere endringer i 
                  teknologi, lovgivning eller vår bruk av cookies. Vi oppfordrer deg til å regelmessig 
                  gjennomgå denne siden.
                </p>
                <p className="text-sm">
                  Sist oppdatert: 4. desember 2024
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-green-500/30">
                8. Kontakt
              </h2>
              <div className="space-y-4 text-gray-300">
                <p className="text-sm">
                  Hvis du har spørsmål om vår bruk av cookies, kontakt oss på:
                </p>
                <div className="bg-slate-900/50 p-6 rounded-lg border border-green-500/20 space-y-2 text-sm">
                  <div><strong className="text-white">E-post:</strong> privacy@lyx.so</div>
                  <div><strong className="text-white">Nettside:</strong> www.lyx.so</div>
                </div>
              </div>
            </section>

          </div>

          {/* Footer */}
          <div className="p-6 border-t border-green-500/20 bg-slate-900/50">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-green-300 font-medium">Transparent cookie-håndtering</span>
              </div>
              <p className="text-gray-400 text-sm">
                LYX.so respekterer ditt personvern og gir deg full kontroll over cookies
              </p>
            </div>
          </div>

        </div>

        {/* Related Links */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <a href="/vilkar" className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-green-500/20 hover:border-green-500/40 transition-all group">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400">Brukervilkår</h3>
            <p className="text-gray-400 text-sm">Les våre fullstendige brukervilkår og betingelser</p>
          </a>
          <a href="/personvern" className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-green-500/20 hover:border-green-500/40 transition-all group">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400">Personvernerklæring</h3>
            <p className="text-gray-400 text-sm">Forstå hvordan vi håndterer dine personopplysninger</p>
          </a>
        </div>
      </div>
    </div>
  );
}
