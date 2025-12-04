'use client';

import type { Metadata } from 'next';
import { Shield, Lock, Eye, FileText, AlertTriangle } from 'lucide-react';

export default function PersonvernPage() {
  return (
    <main className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-600/20 rounded-full mb-6">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-green-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              Personvernerklæring
            </h1>
            <p className="text-base sm:text-lg text-slate-300 mb-6">
              Hvordan LYXso samler inn, bruker og beskytter dine personopplysninger
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-slate-400">
              <span>Sist oppdatert: {new Date().toLocaleDateString('nb-NO')}</span>
              <span className="hidden sm:inline">•</span>
              <span>GDPR-kompatibel</span>
              <span className="hidden sm:inline">•</span>
              <span>Versjon 1.0.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Summary */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-shrink-0">
              <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-semibold text-green-100 mb-2">
                Ditt personvern er viktig for oss
              </h3>
              <p className="text-sm sm:text-base text-green-200/90 leading-relaxed mb-3">
                LYXso AS respekterer ditt personvern og følger GDPR og personopplysningsloven. Vi samler kun inn
                informasjon som er nødvendig for å levere tjenesten, og deler ALDRI dine data med tredjeparter
                for markedsføring.
              </p>
              <div className="grid sm:grid-cols-3 gap-2 text-sm">
                <div className="bg-green-800/30 p-3 rounded">
                  <p className="font-semibold text-green-100">🔒 Kryptering</p>
                  <p className="text-green-200/80">TLS/SSL sikret</p>
                </div>
                <div className="bg-green-800/30 p-3 rounded">
                  <p className="font-semibold text-green-100">🇪🇺 EU-lagring</p>
                  <p className="text-green-200/80">Data i Europa</p>
                </div>
                <div className="bg-green-800/30 p-3 rounded">
                  <p className="font-semibold text-green-100">✅ Dine rettigheter</p>
                  <p className="text-green-200/80">Full kontroll</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar TOC */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-8 space-y-2">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Innhold
              </h2>
              <nav className="space-y-1">
                {[
                  '1. Introduksjon',
                  '2. Behandlingsansvarlig',
                  '3. Opplysninger vi samler',
                  '4. Hvordan vi bruker data',
                  '5. Rettslig grunnlag',
                  '6. Deling med tredjeparter',
                  '7. Datalagringstid',
                  '8. Sikkerhet',
                  '9. Dine rettigheter',
                  '10. Cookies',
                  '11. Barn',
                  '12. Endringer',
                  '13. Klagerett',
                  '14. Kontakt'
                ].map((item, idx) => (
                  <a
                    key={idx}
                    href={`#privacy-section-${idx + 1}`}
                    className="block text-sm text-slate-400 hover:text-slate-200 py-1 transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 sm:p-6 lg:p-8 space-y-8 sm:space-y-12">
        
        <div className="text-slate-300 space-y-8 text-sm sm:text-base">
          
          {/* Section 1 */}
          <section id="privacy-section-1">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-4 flex items-center gap-3">
              <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-green-600/20 rounded-lg flex items-center justify-center text-green-400 text-sm sm:text-base font-bold">
                1
              </span>
              Introduksjon
            </h2>
            <div className="space-y-3 leading-relaxed">
              <p>
                LYXso AS ("vi", "oss", "vår") respekterer ditt personvern og er forpliktet til å beskytte
                dine personopplysninger i henhold til EUs generelle personvernforordning (GDPR) og norsk
                personopplysningslov.
              </p>
              <p>
                Denne personvernerklæringen beskriver hvordan vi samler inn, bruker, deler, lagrer og
                beskytter informasjonen din når du bruker LYXso-plattformen og tilhørende tjenester.
              </p>
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <p className="font-semibold text-slate-200 mb-2">Viktig å vite:</p>
                <p className="text-slate-300">
                  Ved å bruke LYXso aksepterer du behandlingen av dine personopplysninger som beskrevet
                  i dette dokumentet. Hvis du ikke aksepterer vilkårene, kan du ikke bruke tjenesten.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section id="privacy-section-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-4 flex items-center gap-3">
              <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-green-600/20 rounded-lg flex items-center justify-center text-green-400 text-sm sm:text-base font-bold">
                2
              </span>
              Behandlingsansvarlig
            </h2>
            <div className="bg-slate-800/30 p-4 rounded-lg space-y-2">
              <p className="text-slate-200 font-semibold">LYXso AS</p>
              <p className="text-slate-300">Organisasjonsnummer: [ORG_NR]</p>
              <p className="text-slate-300">Adresse: [ADRESSE]</p>
              <p className="text-slate-300">
                E-post:{' '}
                <a href="mailto:personvern@lyxso.no" className="text-blue-400 hover:text-blue-300 underline">
                  personvern@lyxso.no
                </a>
              </p>
              <p className="text-slate-300">
                Kontaktperson: Databehandlingsansvarlig
              </p>
            </div>
            <p className="text-slate-400 text-sm mt-3">
              LYXso AS er behandlingsansvarlig for personopplysninger behandlet i forbindelse med
              levering av LYXso-plattformen.
            </p>
          </section>

          {/* Section 3 */}
          <section id="privacy-section-3">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-4 flex items-center gap-3">
              <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-green-600/20 rounded-lg flex items-center justify-center text-green-400 text-sm sm:text-base font-bold">
                3
              </span>
              Hvilke personopplysninger vi samler inn
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-3">
                  3.1 Informasjon du gir oss direkte
                </h3>
                <div className="bg-slate-800/30 p-4 rounded-lg space-y-3">
                  <div>
                    <p className="font-semibold text-slate-200 mb-2">Kontoregistrering:</p>
                    <p className="text-slate-300">
                      Navn, e-postadresse, telefonnummer, passord (kryptert), firmanavn, organisasjonsnummer,
                      adresse, faktureringsinfo, betalingsinformasjon
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200 mb-2">Profilinformasjon:</p>
                    <p className="text-slate-300">
                      Profilbilde, brukernavn, jobbroller, preferanser, språkvalg, tidssoneinnstillinger
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200 mb-2">Forretningsdata (Kundedata):</p>
                    <p className="text-slate-300">
                      Kundeinformasjon du registrerer (navn, kontaktdetaljer, adresse), kjøretøydata
                      (reg.nr, merke, modell), serviceopplysninger, bookinger, fakturaer, dokumenter,
                      bilder, notater
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200 mb-2">Kommunikasjon:</p>
                    <p className="text-slate-300">
                      E-poster, chat-meldinger, supporthenvendelser, tilbakemeldinger, undersøkelsessvar
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-3">
                  3.2 Informasjon vi samler automatisk
                </h3>
                <div className="bg-slate-800/30 p-4 rounded-lg space-y-3">
                  <div>
                    <p className="font-semibold text-slate-200 mb-2">Teknisk informasjon:</p>
                    <p className="text-slate-300">
                      IP-adresse, nettlesertype og -versjon, enhetstype, operativsystem, skjermoppløsning,
                      språkinnstillinger, referrer URL, geografisk plassering (land/by)
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200 mb-2">Bruksdata:</p>
                    <p className="text-slate-300">
                      Besøkte sider, klikkmønstre, funksjoner brukt, søkeord, tidspunkt for aktivitet,
                      session-varighet, interaksjonsmønstre
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200 mb-2">Logger og feilmeldinger:</p>
                    <p className="text-slate-300">
                      Systemlogger, feilrapporter, krasjrapporter, ytelsesmålinger, sikkerhetshendelser
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200 mb-2">Cookies og lignende teknologier:</p>
                    <p className="text-slate-300">
                      Session-cookies, autentiseringstokens, preferanse-cookies, analyse-cookies.
                      Se vår{' '}
                      <a href="/cookies" className="text-blue-400 hover:text-blue-300 underline">
                        Cookie-policy
                      </a>{' '}
                      for detaljer.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-3">
                  3.3 Informasjon fra tredjeparter
                </h3>
                <div className="bg-slate-800/30 p-4 rounded-lg">
                  <p className="text-slate-300">
                    Hvis du registrerer deg via Google OAuth eller andre Single Sign-On tjenester,
                    mottar vi grunnleggende profilinformasjon (navn, e-post, profilbilde) som du har
                    godkjent å dele. Vi mottar også betalingsbekreftelser fra betalingsleverandører.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section id="privacy-section-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-4 flex items-center gap-3">
              <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-green-600/20 rounded-lg flex items-center justify-center text-green-400 text-sm sm:text-base font-bold">
                4
              </span>
              Hvordan vi bruker personopplysningene
            </h2>
            
            <div className="space-y-4">
              <p className="leading-relaxed">
                Vi bruker innsamlede personopplysninger til følgende formål:
              </p>

              <div className="bg-slate-800/30 p-4 rounded-lg space-y-4">
                <div>
                  <p className="font-semibold text-slate-200 mb-2">📋 Levere og administrere tjenesten:</p>
                  <p className="text-slate-300">
                    Opprette og vedlikeholde kontoen din, gi tilgang til funksjonalitet, lagre og behandle
                    Kundedata, synkronisere data på tvers av enheter, tilby kundesupport
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-slate-200 mb-2">💳 Behandle betalinger:</p>
                  <p className="text-slate-300">
                    Fakturering, betalingsbehandling, kredittkontroll, regnskapsmessige forpliktelser,
                    håndtering av refusjoner
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-slate-200 mb-2">📧 Kommunikasjon:</p>
                  <p className="text-slate-300">
                    Sende transaksjonelle e-poster (kvitteringer, passord-reset), viktige serviceoppdateringer,
                    sikkerhetsvarsler, administrative meldinger, svar på support-henvendelser
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-slate-200 mb-2">🔧 Forbedre og utvikle tjenesten:</p>
                  <p className="text-slate-300">
                    Analysere bruksmønstre, identifisere feil og bugs, utvikle nye funksjoner, optimalisere
                    ytelse, gjennomføre A/B-testing, utvikle AI-funksjoner
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-slate-200 mb-2">🛡️ Sikkerhet og overholdelse:</p>
                  <p className="text-slate-300">
                    Beskytte mot svindel og misbruk, detektere sikkerhetsbrudd, håndheve bruksvilkår,
                    overholde juridiske forpliktelser, beskytte våre rettigheter og eiendom
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-slate-200 mb-2">📊 Analyse og rapportering:</p>
                  <p className="text-slate-300">
                    Generere anonymiserte og aggregerte statistikker, forstå brukeradferd, måle effektivitet,
                    markedsundersøkelser
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-slate-200 mb-2">📢 Markedsføring (med samtykke):</p>
                  <p className="text-slate-300">
                    Sende nyhetsbrev og produktoppdateringer, tilby spesielle kampanjer, informere om nye
                    funksjoner. Du kan når som helst trekke tilbake samtykke.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section id="privacy-section-5">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-4 flex items-center gap-3">
              <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-green-600/20 rounded-lg flex items-center justify-center text-green-400 text-sm sm:text-base font-bold">
                5
              </span>
              Rettslig grunnlag for behandling (GDPR Art. 6)
            </h2>
            
            <div className="space-y-4">
              <p className="leading-relaxed">
                Vi behandler personopplysninger kun når vi har et lovlig grunnlag:
              </p>

              <div className="space-y-3">
                <div className="bg-blue-900/20 border border-blue-700/50 p-4 rounded-lg">
                  <p className="font-semibold text-blue-100 mb-2">⚖️ Avtale (Art. 6(1)(b)):</p>
                  <p className="text-blue-200/90">
                    Behandling nødvendig for å oppfylle vår avtale med deg (levere tjenesten, fakturering,
                    kundesupport). Dette utgjør hoveddelen av vår behandling.
                  </p>
                </div>

                <div className="bg-green-900/20 border border-green-700/50 p-4 rounded-lg">
                  <p className="font-semibold text-green-100 mb-2">✅ Samtykke (Art. 6(1)(a)):</p>
                  <p className="text-green-200/90">
                    For markedsføring, ikke-nødvendige cookies og valgfrie funksjoner. Du kan når som helst
                    trekke tilbake samtykke uten at det påvirker lovligheten av behandlingen før tilbaketrekking.
                  </p>
                </div>

                <div className="bg-purple-900/20 border border-purple-700/50 p-4 rounded-lg">
                  <p className="font-semibold text-purple-100 mb-2">🎯 Legitime interesser (Art. 6(1)(f)):</p>
                  <p className="text-purple-200/90">
                    For sikkerhet, svindelforebygging, analyse, forbedring av tjenesten, beskyttelse av våre
                    rettigheter. Vi har vurdert at disse interessene ikke overstyrer dine rettigheter og friheter.
                  </p>
                </div>

                <div className="bg-orange-900/20 border border-orange-700/50 p-4 rounded-lg">
                  <p className="font-semibold text-orange-100 mb-2">⚖️ Rettslig forpliktelse (Art. 6(1)(c)):</p>
                  <p className="text-orange-200/90">
                    For overholdelse av bokføringsloven, skatteloven, hvitvaskingsloven og andre juridiske krav.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6 - Critical */}
          <section id="privacy-section-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-4 flex items-center gap-3">
              <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-green-600/20 rounded-lg flex items-center justify-center text-green-400 text-sm sm:text-base font-bold">
                6
              </span>
              Deling av personopplysninger med tredjeparter
            </h2>
            
            <div className="space-y-4">
              <div className="bg-green-900/20 border border-green-700/50 p-4 rounded-lg">
                <p className="font-semibold text-green-100 mb-2">✅ Vår hovedregel:</p>
                <p className="text-green-200/90">
                  Vi selger ALDRI dine personopplysninger til tredjeparter. Vi deler kun data når det er
                  nødvendig for å levere tjenesten, etter ditt samtykke, eller når vi er lovpålagt.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-200 mb-3">
                  6.1 Databehandlere (GDPR Art. 28)
                </h3>
                <p className="text-slate-300 mb-3">
                  Vi benytter følgende databehandlere for å levere tjenesten. Alle har signert databehandler
                  avtaler (DPA) og er GDPR-kompatible:
                </p>
                <div className="bg-slate-800/30 p-4 rounded-lg space-y-3">
                  <div>
                    <p className="font-semibold text-slate-200">Supabase (database og autentisering):</p>
                    <p className="text-slate-300 text-sm">
                      Lagring av all Kundedata. Data lagres i EU (Frankfurt). DPA tilgjengelig.
                      <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline ml-1">
                        Personvern →
                      </a>
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200">Vercel (hosting):</p>
                    <p className="text-slate-300 text-sm">
                      Hosting av applikasjon. Data i EU/USA. GDPR-kompatibel.
                      <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline ml-1">
                        Personvern →
                      </a>
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200">SendGrid (e-post):</p>
                    <p className="text-slate-300 text-sm">
                      Utsending av transaksjonelle e-poster. DPA tilgjengelig.
                      <a href="https://www.twilio.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline ml-1">
                        Personvern →
                      </a>
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200">Stripe/Vipps (betaling):</p>
                    <p className="text-slate-300 text-sm">
                      Behandling av betalinger. PCI-DSS sertifisert. Vi lagrer IKKE fullstendige
                      kortopplysninger.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-200 mb-3">
                  6.2 Juridiske krav
                </h3>
                <p className="text-slate-300">
                  Vi kan dele personopplysninger hvis vi er lovpålagt, for eksempel ved:
                </p>
                <div className="bg-slate-800/30 p-4 rounded-lg space-y-2 mt-2">
                  <p className="text-slate-300">• Rettskjennelser eller stevninger</p>
                  <p className="text-slate-300">• Krav fra offentlige myndigheter (politi, skattemyndigheter)</p>
                  <p className="text-slate-300">• Beskyttelse av våre juridiske rettigheter</p>
                  <p className="text-slate-300">• Forebygging av svindel eller kriminalitet</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-200 mb-3">
                  6.3 Bedriftsoverdragelse
                </h3>
                <p className="text-slate-300">
                  Ved fusjon, oppkjøp eller salg av virksomheten, kan personopplysninger overføres til
                  den nye eieren som en del av transaksjonen. Vi vil varsle deg og sikre at mottaker
                  respekterer denne personvernerklæringen.
                </p>
              </div>
            </div>
          </section>

          {/* Section 7-14 continue with similar detailed structure... */}
          <section id="privacy-section-7">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-4 flex items-center gap-3">
              <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-green-600/20 rounded-lg flex items-center justify-center text-green-400 text-sm sm:text-base font-bold">
                7
              </span>
              Hvor lenge lagrer vi personopplysninger
            </h2>
            
            <div className="space-y-4">
              <p className="text-slate-300 leading-relaxed">
                Vi lagrer personopplysninger kun så lenge det er nødvendig for formålene beskrevet i
                denne erklæringen, eller som lovpålagt:
              </p>

              <div className="bg-slate-800/30 p-4 rounded-lg space-y-3">
                <div>
                  <p className="font-semibold text-slate-200 mb-2">Kontodata:</p>
                  <p className="text-slate-300">
                    Så lenge kontoen er aktiv + 30 dager etter stenging (for gjenoppretting)
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-slate-200 mb-2">Kundedata:</p>
                  <p className="text-slate-300">
                    Så lenge du ønsker + 30 dager etter kontostenging
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-slate-200 mb-2">Fakturaer og regnskapsdata:</p>
                  <p className="text-slate-300">
                    Minimum 5 år (bokføringsloven)
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-slate-200 mb-2">Sikkerhetskopier:</p>
                  <p className="text-slate-300">
                    30 dager (rulerende)
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-slate-200 mb-2">Tekniske logger:</p>
                  <p className="text-slate-300">
                    90 dager
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-slate-200 mb-2">Markedsføringsamtykke:</p>
                  <p className="text-slate-300">
                    Til du trekker det tilbake eller kontoen stenges
                  </p>
                </div>
              </div>

              <div className="bg-amber-900/20 border border-amber-700/50 p-4 rounded-lg">
                <p className="font-semibold text-amber-100 mb-2">⚠️ Sletting ved kontostenging:</p>
                <p className="text-amber-200/90">
                  Når du stenger kontoen din, slettes alle personopplysninger permanent etter 30 dager,
                  med unntak av data vi er lovpålagt å beholde (fakturainformasjon). Denne slettingen er
                  UGJENKALLELIG.
                </p>
              </div>
            </div>
          </section>
          <section>
            <p className="text-sm text-slate-400 mb-8">
              Sist oppdatert: {new Date().toLocaleDateString('nb-NO')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">1. Introduksjon</h2>
            <p>
              LYXso AS ("vi", "oss", "vår") respekterer ditt personvern og er forpliktet til å beskytte
              dine personopplysninger. Denne personvernerklæringen beskriver hvordan vi samler inn,
              bruker og beskytter informasjonen din når du bruker LYXso-plattformen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">2. Behandlingsansvarlig</h2>
            <p className="mb-4">
              <strong>LYXso AS</strong><br />
              Organisasjonsnummer: [ORG_NR]<br />
              E-post: kontakt@lyxso.no<br />
              Adresse: [ADRESSE]
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">3. Hvilke opplysninger vi samler inn</h2>
            
            <h3 className="text-xl font-semibold text-slate-200 mb-3 mt-6">3.1 Informasjon du gir oss</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Kontaktinformasjon (navn, e-post, telefonnummer)</li>
              <li>Bedriftsinformasjon (firmanavn, organisasjonsnummer, adresse)</li>
              <li>Brukerinformasjon (brukernavn, passord, profilbilde)</li>
              <li>Kundeinformasjon du registrerer i systemet (navn, kontaktinfo, kjøretøydata)</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-200 mb-3 mt-6">3.2 Informasjon vi samler automatisk</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Teknisk informasjon (IP-adresse, nettlesertype, enhet)</li>
              <li>Bruksdata (sidevisninger, klikk, funksjonsbruk)</li>
              <li>Logger og feilmeldinger</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">4. Hvordan vi bruker informasjonen</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Levere og vedlikeholde LYXso-plattformen</li>
              <li>Administrere din konto og gi kundestøtte</li>
              <li>Forbedre våre tjenester og utvikle nye funksjoner</li>
              <li>Sende viktige varsler om tjenesten (tekniske oppdateringer, endringer i vilkår)</li>
              <li>Analysere bruk for å forbedre brukeropplevelsen</li>
              <li>Beskytte mot misbruk og sikre systemets sikkerhet</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">5. Rettslig grunnlag for behandling</h2>
            <p className="mb-4">Vi behandler personopplysninger basert på:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Avtale:</strong> For å levere tjenesten du har inngått avtale om</li>
              <li><strong>Samtykke:</strong> Når du har gitt oss eksplisitt samtykke</li>
              <li><strong>Legitime interesser:</strong> For å forbedre tjenesten og sikre systemets sikkerhet</li>
              <li><strong>Rettslig forpliktelse:</strong> For å overholde lovpålagte krav (regnskapsloven, skatteloven)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">6. Deling av informasjon</h2>
            <p className="mb-4">Vi deler ikke dine personopplysninger med tredjeparter, bortsett fra:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Tjenesteleverandører:</strong> Supabase (database), Vercel (hosting), e-postleverandører</li>
              <li><strong>Juridiske krav:</strong> Når vi er lovpålagt å dele informasjon med myndigheter</li>
              <li><strong>Bedriftsoverdragelse:</strong> Ved fusjon, oppkjøp eller salg av virksomheten</li>
            </ul>
            <p className="mt-4">
              <strong>Viktig:</strong> Vi selger aldri dine personopplysninger til tredjeparter.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">7. Lagring og sikkerhet</h2>
            <p className="mb-4">
              Vi bruker industristandarder for sikkerhet, inkludert kryptering, firewalls og
              tilgangskontroll. Data lagres i Supabase (Europa) og backups gjøres regelmessig.
            </p>
            <p className="mb-4">
              Vi beholder personopplysninger så lenge det er nødvendig for å levere tjenesten eller
              oppfylle juridiske krav. Når du avslutter kontoen din, slettes dine data innen 30 dager,
              med unntak av data vi må beholde av juridiske årsaker.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">8. Dine rettigheter</h2>
            <p className="mb-4">Du har følgende rettigheter i henhold til GDPR:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Innsyn:</strong> Be om kopi av dine personopplysninger</li>
              <li><strong>Retting:</strong> Få rettet feil eller utdatert informasjon</li>
              <li><strong>Sletting:</strong> Be om at vi sletter dine opplysninger ("retten til å bli glemt")</li>
              <li><strong>Begrensning:</strong> Begrense hvordan vi bruker dine opplysninger</li>
              <li><strong>Dataportabilitet:</strong> Få dine data i et maskinlesbart format</li>
              <li><strong>Motsette seg behandling:</strong> Motsette deg visse typer behandling</li>
              <li><strong>Trekke tilbake samtykke:</strong> Når behandling er basert på samtykke</li>
            </ul>
            <p className="mt-4">
              For å utøve disse rettighetene, kontakt oss på{' '}
              <a href="mailto:personvern@lyxso.no" className="text-blue-400 hover:underline">
                personvern@lyxso.no
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">9. Cookies og sporing</h2>
            <p className="mb-4">
              LYXso bruker cookies og lignende teknologier for å forbedre brukeropplevelsen.
              Les mer i vår{' '}
              <a href="/cookies" className="text-blue-400 hover:underline">
                cookie-policy
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">10. Barn og personvern</h2>
            <p>
              LYXso er ikke beregnet for barn under 18 år. Vi samler ikke bevisst inn informasjon
              fra barn. Hvis vi oppdager at vi har samlet inn data fra et barn, vil vi slette det umiddelbart.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">11. Endringer i personvernerklæringen</h2>
            <p>
              Vi kan oppdatere denne personvernerklæringen fra tid til annen. Vesentlige endringer vil
              bli varslet via e-post eller ved innlogging. Siste oppdateringsdato vises øverst på siden.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">12. Klagerett</h2>
            <p>
              Hvis du mener vi behandler dine personopplysninger i strid med personvernlovgivningen,
              har du rett til å klage til Datatilsynet:
            </p>
            <p className="mt-4">
              <strong>Datatilsynet</strong><br />
              Postboks 458 Sentrum, 0105 Oslo<br />
              Telefon: 22 39 69 00<br />
              E-post: postkasse@datatilsynet.no<br />
              Nettside:{' '}
              <a href="https://www.datatilsynet.no" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                www.datatilsynet.no
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">13. Kontakt oss</h2>
            <p>
              Har du spørsmål om denne personvernerklæringen eller hvordan vi behandler dine personopplysninger?
            </p>
            <p className="mt-4">
              <strong>E-post:</strong>{' '}
              <a href="mailto:personvern@lyxso.no" className="text-blue-400 hover:underline">
                personvern@lyxso.no
              </a><br />
              <strong>Post:</strong> LYXso AS, [ADRESSE]
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
