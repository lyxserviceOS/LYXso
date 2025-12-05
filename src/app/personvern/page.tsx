'use client';

export default function PersonvernPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Personvernerklæring
              </h1>
              <p className="text-purple-300">GDPR-kompatibel • Versjon 1.0.0 • 4. desember 2024</p>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-purple-600/20 rounded-lg border border-purple-500/30">
              <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-sm font-medium text-purple-300">Beskyttet av GDPR</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-purple-500/20 shadow-2xl">
          
          {/* GDPR Badge */}
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-l-4 border-purple-500 p-6 m-6 rounded-lg">
            <div className="flex items-start">
              <svg className="w-8 h-8 text-purple-400 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div className="ml-4">
                <h3 className="text-xl font-bold text-white mb-2">Dine rettigheter i henhold til GDPR</h3>
                <p className="text-purple-100 text-sm leading-relaxed">
                  Vi tar personvern på alvor og følger EUs personvernforordning (GDPR). 
                  Dette dokumentet forklarer hvordan vi samler inn, bruker, lagrer og beskytter dine personopplysninger.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 sm:p-8 space-y-10">

            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-purple-500/30">
                1. Behandlingsansvarlig
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>LYX.so er behandlingsansvarlig for dine personopplysninger.</p>
                <div className="bg-slate-900/50 p-6 rounded-lg border border-purple-500/20 space-y-3 text-sm">
                  <div><strong className="text-white">Organisasjon:</strong> LYX.so</div>
                  <div><strong className="text-white">E-post:</strong> privacy@lyx.so</div>
                  <div><strong className="text-white">Adresse:</strong> [Adresse]</div>
                  <div><strong className="text-white">Org.nr:</strong> [Org.nr]</div>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-purple-500/30">
                2. Hvilke personopplysninger samler vi inn?
              </h2>
              <div className="space-y-6 text-gray-300">
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">2.1 Informasjon du oppgir direkte</h3>
                  <div className="bg-slate-900/50 p-6 rounded-lg border border-purple-500/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="text-white font-medium mb-2">Kontoinformasjon</h4>
                        <ul className="space-y-1 text-gray-400">
                          <li>• Navn (for- og etternavn)</li>
                          <li>• E-postadresse</li>
                          <li>• Telefonnummer</li>
                          <li>• Passord (kryptert)</li>
                          <li>• Profilbilde (valgfritt)</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-2">Kjøretøyinformasjon</h4>
                        <ul className="space-y-1 text-gray-400">
                          <li>• Registreringsnummer</li>
                          <li>• Merke og modell</li>
                          <li>• Årsmodell</li>
                          <li>• Dekkdimensjoner</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-2">Betalingsinformasjon</h4>
                        <ul className="space-y-1 text-gray-400">
                          <li>• Faktureringsadresse</li>
                          <li>• Betalingshistorikk</li>
                          <li>• Kortinformasjon (via Stripe)</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-2">Booking- og servicedata</h4>
                        <ul className="space-y-1 text-gray-400">
                          <li>• Bookinghistorikk</li>
                          <li>• Tjeneste preferences</li>
                          <li>• Kommunikasjon med support</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">2.2 Informasjon vi samler inn automatisk</h3>
                  <div className="bg-slate-900/50 p-6 rounded-lg border border-purple-500/20 space-y-3 text-sm">
                    <div><strong className="text-white">Teknisk informasjon:</strong> IP-adresse, nettlesertype og versjon, operativsystem, skjermoppløsning, språkpreferanser</div>
                    <div><strong className="text-white">Brukeradferd:</strong> Sider besøkt, klikk, tid på siden, navigasjonsmønstre, søkehistorikk</div>
                    <div><strong className="text-white">Enhetsdata:</strong> Enhetsinformasjon, unike enhetsidentifikatorer, mobilnettverk-informasjon</div>
                    <div><strong className="text-white">Lokasjon:</strong> Omtrentlig lokasjon basert på IP-adresse (ikke presis GPS)</div>
                    <div><strong className="text-white">Cookies og sporings teknologier:</strong> Se vår Cookie-policy for detaljer</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">2.3 Informasjon fra tredjeparter</h3>
                  <div className="bg-slate-900/50 p-6 rounded-lg border border-purple-500/20 space-y-3 text-sm">
                    <div><strong className="text-white">Autentiseringstjenester:</strong> Google, Facebook (hvis du logger inn via sosiale medier)</div>
                    <div><strong className="text-white">Betalingsleverandører:</strong> Stripe, Vipps (transaksjonsinformasjon)</div>
                    <div><strong className="text-white">Analyseverktøy:</strong> Google Analytics, Sentry (anonymisert brukerdata)</div>
                    <div><strong className="text-white">Kommunikasjonsplattformer:</strong> SendGrid, Twilio (e-post/SMS leveringsstatus)</div>
                  </div>
                </div>

              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-purple-500/30">
                3. Hvorfor samler vi inn personopplysninger?
              </h2>
              <div className="space-y-4 text-gray-300">
                <p className="text-sm">Vi behandler dine personopplysninger basert på følgende lovlige grunnlag:</p>
                <div className="bg-slate-900/50 p-6 rounded-lg border border-purple-500/20 space-y-4">
                  
                  <div>
                    <div className="flex items-start space-x-3 mb-2">
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Avtaleoppfyllelse</h4>
                        <p className="text-sm text-gray-400">
                          For å levere tjenester du har bestilt, behandle bookinger, håndtere betalinger, 
                          gi kundeservice og oppfylle våre forpliktelser overfor deg.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-start space-x-3 mb-2">
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Samtykke</h4>
                        <p className="text-sm text-gray-400">
                          For markedsføring, nyhetsbrev, personalisert innhold og ikke-essensiell analyse. 
                          Du kan når som helst trekke tilbake samtykke.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-start space-x-3 mb-2">
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Legitime interesser</h4>
                        <p className="text-sm text-gray-400">
                          For å forbedre tjenesten, forebygge svindel, sikre plattformens sikkerhet, 
                          analysere bruksmønstre og utvikle nye funksjoner.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-start space-x-3 mb-2">
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">4</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Juridiske forpliktelser</h4>
                        <p className="text-sm text-gray-400">
                          For å overholde bokføringsloven, skatteregler, håndtere rettskrav og 
                          følge andre juridiske krav.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-purple-500/30">
                4. Deling av personopplysninger
              </h2>
              <div className="space-y-4 text-gray-300">
                <p className="text-sm">Vi deler dine personopplysninger med følgende tredjeparter:</p>
                <div className="bg-slate-900/50 p-6 rounded-lg border border-purple-500/20 space-y-4 text-sm">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Tjenesteleverandører</h4>
                    <p className="text-gray-400 mb-2">Vi bruker følgende tredjepartstjenester:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-400">
                      <div>• <strong className="text-white">Supabase:</strong> Database og autentisering</div>
                      <div>• <strong className="text-white">Vercel:</strong> Web hosting</div>
                      <div>• <strong className="text-white">Stripe:</strong> Betalingsbehandling</div>
                      <div>• <strong className="text-white">SendGrid:</strong> E-postutsendelse</div>
                      <div>• <strong className="text-white">Twilio:</strong> SMS-varslinger</div>
                      <div>• <strong className="text-white">Google Analytics:</strong> Webanalyse</div>
                      <div>• <strong className="text-white">Sentry:</strong> Feilrapportering</div>
                      <div>• <strong className="text-white">OpenAI:</strong> AI-funksjoner</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-2">Forretningspartnere</h4>
                    <p className="text-gray-400">
                      Verksteder og servicepartnere som leverer tjenester du har bestilt. 
                      De får kun tilgang til nødvendig informasjon for å fullføre oppdraget.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-2">Juridiske krav</h4>
                    <p className="text-gray-400">
                      Vi kan dele informasjon hvis det kreves av lov, rettskjennelse, myndighetspålegg 
                      eller for å beskytte våre rettigheter og sikkerheten til brukere.
                    </p>
                  </div>

                  <div className="bg-yellow-900/20 p-4 rounded border border-yellow-500/30">
                    <p className="text-yellow-200 font-semibold mb-2">Viktig om dataoverføring</p>
                    <p className="text-sm">
                      Noen av våre tjenesteleverandører er lokalisert utenfor EØS (f.eks. USA). 
                      Vi sikrer at overføringene skjer i henhold til GDPR ved å bruke standard 
                      databehandleravtaler og andre sikkerhetstiltak.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-purple-500/30">
                5. Dine rettigheter i henhold til GDPR
              </h2>
              <div className="space-y-4 text-gray-300">
                <p className="text-sm">Du har følgende rettigheter i henhold til GDPR:</p>
                <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-6 rounded-lg border border-purple-500/20 space-y-4">
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Rett til innsyn</h4>
                      <p className="text-sm text-gray-400">
                        Du kan be om en kopi av alle personopplysninger vi har om deg.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Rett til retting</h4>
                      <p className="text-sm text-gray-400">
                        Du kan be oss rette feil eller utdatert informasjon om deg.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Rett til sletting ("Retten til å bli glemt")</h4>
                      <p className="text-sm text-gray-400">
                        Du kan be oss slette dine personopplysninger, med visse unntak for juridiske forpliktelser.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Rett til begrensning</h4>
                      <p className="text-sm text-gray-400">
                        Du kan be oss begrense behandlingen av dine data i visse situasjoner.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Rett til dataportabilitet</h4>
                      <p className="text-sm text-gray-400">
                        Du kan få dine data i et strukturert, maskinlesbart format for overføring til annen tjeneste.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Rett til å protestere</h4>
                      <p className="text-sm text-gray-400">
                        Du kan protestere mot behandling basert på legitime interesser eller for markedsføring.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Rett til å trekke tilbake samtykke</h4>
                      <p className="text-sm text-gray-400">
                        Du kan når som helst trekke tilbake samtykke uten at det påvirker lovligheten av behandlingen før tilbaketrekkingen.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Rett til å klage</h4>
                      <p className="text-sm text-gray-400">
                        Du kan klage til Datatilsynet hvis du mener vi behandler dine opplysninger ulovlig.
                      </p>
                    </div>
                  </div>

                </div>

                <div className="bg-blue-900/20 p-6 rounded-lg border border-blue-500/30">
                  <h4 className="text-white font-semibold mb-3">Slik utøver du dine rettigheter</h4>
                  <p className="text-sm mb-4">
                    For å utøve noen av dine rettigheter, kontakt oss på <a href="mailto:privacy@lyx.so" className="text-blue-400 hover:text-blue-300 underline">privacy@lyx.so</a> eller via innstillinger i din konto.
                  </p>
                  <p className="text-sm">
                    Vi vil svare på din henvendelse innen 30 dager. I komplekse tilfeller kan vi forlenge fristen med ytterligere 60 dager, og vi vil informere deg om dette.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-purple-500/30">
                6. Sikkerhet og oppbevaring
              </h2>
              <div className="space-y-4 text-gray-300">
                <div className="bg-slate-900/50 p-6 rounded-lg border border-purple-500/20 space-y-4">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Sikkerhetstiltak</h4>
                    <p className="text-sm mb-3">Vi implementerer tekniske og organisatoriske sikkerhetstiltak for å beskytte dine data:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-400">
                      <div>• Kryptering av data i transit (SSL/TLS)</div>
                      <div>• Kryptering av data ved lagring</div>
                      <div>• Regelmessige sikkerhetskopier</div>
                      <div>• Tilgangskontroll og autentisering</div>
                      <div>• Brannmurer og intrusion detection</div>
                      <div>• Regelmessige sikkerhetsrevisjoner</div>
                      <div>• Ansattes sikkerhetsopplæring</div>
                      <div>• Incident response planer</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-2">Lagringstid</h4>
                    <p className="text-sm mb-3">Vi lagrer dine personopplysninger så lenge som nødvendig for å:</p>
                    <div className="space-y-2 text-sm text-gray-400">
                      <div>• Levere tjenester du har bestilt</div>
                      <div>• Oppfylle juridiske forpliktelser (f.eks. bokføringsloven: 5 år)</div>
                      <div>• Løse tvister og håndheve avtaler</div>
                      <div>• Oppfylle legitime forretningsformål</div>
                    </div>
                    <p className="text-sm mt-3">
                      Når opplysningene ikke lenger er nødvendige, slettes eller anonymiseres de på en sikker måte.
                    </p>
                  </div>

                  <div className="bg-red-900/20 p-4 rounded border border-red-500/30">
                    <h4 className="text-white font-semibold mb-2">Viktig sikkerhetsinformasjon</h4>
                    <p className="text-sm text-red-100">
                      Ingen system er 100% sikkert. Vi kan ikke garantere absolutt sikkerhet mot 
                      uautorisert tilgang, hacking, datalekkasjer eller andre sikkerhetsbrudd. 
                      Du bruker tjenesten på egen risiko.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-purple-500/30">
                7. Cookies og sporings teknologier
              </h2>
              <div className="space-y-4 text-gray-300">
                <p className="text-sm">
                  Vi bruker cookies og lignende teknologier for å forbedre din brukeropplevelse. 
                  For fullstendig informasjon, se vår{' '}
                  <a href="/cookies" className="text-purple-400 hover:text-purple-300 underline">
                    Cookie-policy
                  </a>.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-purple-500/30">
                8. Barns personvern
              </h2>
              <div className="space-y-4 text-gray-300">
                <div className="bg-yellow-900/20 p-6 rounded-lg border border-yellow-500/30">
                  <p className="text-sm text-yellow-100">
                    <strong>Våre tjenester er ikke beregnet for barn under 16 år.</strong> Vi samler ikke 
                    bevisst inn personopplysninger fra barn. Hvis du er forelder og oppdager at ditt barn 
                    har oppgitt personopplysninger til oss, kontakt oss umiddelbart så vil vi slette informasjonen.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-purple-500/30">
                9. Endringer i personvernerklæringen
              </h2>
              <div className="space-y-4 text-gray-300">
                <p className="text-sm">
                  Vi kan oppdatere denne personvernerklæringen fra tid til annen. Vesentlige endringer 
                  vil bli varslet via e-post eller på plattformen. Vi oppfordrer deg til å regelmessig 
                  gjennomgå denne siden for å holde deg oppdatert.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-purple-500/30">
                10. Kontakt og klager
              </h2>
              <div className="space-y-4 text-gray-300">
                <div className="bg-slate-900/50 p-6 rounded-lg border border-purple-500/20 space-y-4">
                  <div>
                    <h4 className="text-white font-semibold mb-3">Kontakt oss</h4>
                    <p className="text-sm mb-3">For spørsmål om personvern eller for å utøve dine rettigheter:</p>
                    <div className="space-y-2 text-sm">
                      <div><strong className="text-white">E-post:</strong> privacy@lyx.so</div>
                      <div><strong className="text-white">Nettside:</strong> www.lyx.so</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-3">Klage til tilsynsmyndighet</h4>
                    <p className="text-sm mb-3">Du har rett til å klage til Datatilsynet hvis du mener vi ikke følger personvernlovgivningen:</p>
                    <div className="space-y-2 text-sm">
                      <div><strong className="text-white">Datatilsynet</strong></div>
                      <div>Postboks 458 Sentrum, 0105 Oslo</div>
                      <div>Telefon: 22 39 69 00</div>
                      <div>E-post: postkasse@datatilsynet.no</div>
                      <div>Nettside: www.datatilsynet.no</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* Footer */}
          <div className="p-6 border-t border-purple-500/20 bg-slate-900/50">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-4">
                Denne personvernerklæringen er sist oppdatert 4. desember 2024
              </p>
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-purple-300 font-medium">GDPR-kompatibel personvernerklæring</span>
              </div>
            </div>
          </div>

        </div>

        {/* Related Links */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <a href="/vilkar" className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all group">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400">Brukervilkår</h3>
            <p className="text-gray-400 text-sm">Les våre fullstendige brukervilkår og betingelser</p>
          </a>
          <a href="/cookies" className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all group">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400">Cookie-policy</h3>
            <p className="text-gray-400 text-sm">Forstå hvordan vi bruker cookies og sporings teknologier</p>
          </a>
        </div>
      </div>
    </div>
  );
}
