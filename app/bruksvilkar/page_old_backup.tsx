'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, FileText, Shield, AlertTriangle, Home, ArrowLeft, Menu, X, ExternalLink, Scale, Lock, AlertCircle, CheckCircle } from 'lucide-react';

export default function BruksvilkarPage() {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTOC, setShowTOC] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const sections = [
    { id: 1, title: 'Definisjoner og tolkninger', icon: FileText },
    { id: 2, title: 'Aksept av vilkår', icon: CheckCircle },
    { id: 3, title: 'Registrering og kontoadministrasjon', icon: Lock },
    { id: 4, title: 'Abonnement, betaling og fakturering', icon: ExternalLink },
    { id: 5, title: 'Tillatt bruk av tjenesten', icon: CheckCircle },
    { id: 6, title: 'Kundedata og databehandling', icon: Shield },
    { id: 7, title: 'FULLSTENDIG ANSVARSBEGRENSNING', icon: AlertTriangle },
    { id: 8, title: 'GARANTIFRASKRIVELSE', icon: AlertCircle },
    { id: 9, title: 'HOLD HARMLESS OG SKADESLØSHOLDELSE', icon: Scale },
    { id: 10, title: 'Force Majeure', icon: AlertTriangle },
    { id: 11, title: 'Datatap, backup og gjenoppretting', icon: AlertCircle },
    { id: 12, title: 'Oppetid, tilgjengelighet og ytelse', icon: ExternalLink },
    { id: 13, title: 'Sikkerhetstiltak og kryptering', icon: Lock },
    { id: 14, title: 'Tredjepartstjenester og integrasjoner', icon: ExternalLink },
    { id: 15, title: 'Immaterielle rettigheter', icon: Scale },
    { id: 16, title: 'Compliance, lovlighet og regulatoriske krav', icon: CheckCircle },
    { id: 17, title: 'Oppsigelse og suspensjon', icon: AlertCircle },
    { id: 18, title: 'Endringer i vilkår', icon: FileText },
    { id: 19, title: 'Tvisteløsning og jurisdiksjon', icon: Scale },
    { id: 20, title: 'Diverse bestemmelser', icon: FileText },
    { id: 21, title: 'Kontaktinformasjon og kundeservice', icon: ExternalLink }
  ];

  return (
    <main className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 min-h-screen">
      {/* Mobile Navigation */}
      <div className="lg:hidden sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
            <Home className="w-5 h-5" />
            <span className="text-sm font-medium">Hjem</span>
          </Link>
          <button
            onClick={() => setShowTOC(!showTOC)}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors"
          >
            {showTOC ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            <span className="text-sm font-medium">Innhold</span>
          </button>
        </div>
        
        {/* Mobile TOC Dropdown */}
        {showTOC && (
          <div className="border-t border-slate-700 bg-slate-900 max-h-[70vh] overflow-y-auto">
            <nav className="p-4 space-y-1">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#section-${section.id}`}
                  onClick={() => setShowTOC(false)}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <section.icon className="w-4 h-4 flex-shrink-0" />
                  <span>{section.id}. {section.title}</span>
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-blue-600/20 rounded-full mb-6 sm:mb-8 border border-blue-500/30">
              <FileText className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 bg-clip-text text-transparent">
              Bruksvilkår for LYXso
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 mb-6 sm:mb-8 leading-relaxed">
              Komplette juridiske vilkår og betingelser for bruk av LYXso-plattformen
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-sm sm:text-base text-slate-400">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Sist oppdatert: {new Date().toLocaleDateString('nb-NO')}
              </span>
              <span className="hidden sm:inline">•</span>
              <span>Versjon 1.0.0</span>
              <span className="hidden sm:inline">•</span>
              <span>LYXso AS - Org.nr: 999999999</span>
            </div>
            
            {/* Quick Links */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <Link href="/personvern" className="px-4 py-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-colors text-sm font-medium">
                Personvernerklæring
              </Link>
              <Link href="/cookies" className="px-4 py-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors text-sm font-medium">
                Cookie-policy
              </Link>
              <Link href="/kontakt" className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors text-sm font-medium">
                Kontakt oss
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-gradient-to-r from-amber-900/30 via-red-900/30 to-amber-900/30 border-2 border-amber-600/50 rounded-xl p-4 sm:p-6 lg:p-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-amber-400 animate-pulse" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-100 mb-3 sm:mb-4">
                🔴 KRITISK JURIDISK INFORMASJON - LES NØYE
              </h3>
              <div className="space-y-3 text-sm sm:text-base text-amber-200/90 leading-relaxed">
                <p className="font-semibold">
                  Ved å registrere deg, få tilgang til, eller bruke LYXso-plattformen på noen måte aksepterer du å være
                  JURIDISK BUNDET av disse bruksvilkårene i sin helhet, uten forbehold.
                </p>
                <div className="bg-amber-950/50 p-4 rounded-lg space-y-2">
                  <p className="font-semibold text-amber-100">⚠️ Viktige punkter:</p>
                  <ul className="list-disc list-inside space-y-1 text-amber-200/80">
                    <li>Tjenesten leveres "SOM DEN ER" uten garantier av noen art</li>
                    <li>LYXso AS og ansatte har INGEN ansvar for tap, skade eller driftsavbrudd</li>
                    <li>Du er SELV ANSVARLIG for backup og sikring av dine data</li>
                    <li>Ved uenighet er du forpliktet til å holde LYXso skadesløs</li>
                    <li>Norsk rett gjelder - tvister løses i norske domstoler</li>
                  </ul>
                </div>
                <p className="font-semibold text-amber-100">
                  ⛔ HVIS DU IKKE AKSEPTERER DISSE VILKÅRENE, HAR DU IKKE LOV TIL Å BRUKE TJENESTEN.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Desktop Sticky Sidebar TOC */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-8 space-y-2 bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Menu className="w-4 h-4" />
                Innholdsfortegnelse
              </h2>
              <nav className="space-y-1 max-h-[calc(100vh-12rem)] overflow-y-auto">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#section-${section.id}`}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 hover:bg-slate-800/50 py-2 px-3 rounded-lg transition-all group"
                  >
                    <section.icon className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="flex-1">{section.id}. {section.title}</span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 sm:p-6 lg:p-8 space-y-8 sm:space-y-12">
              
              {/* Section 1 */}
              <section id="section-1">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-4 sm:mb-6 flex items-center gap-3">
              <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400 text-sm sm:text-base font-bold">
                1
              </span>
              Definisjoner
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
              <div className="bg-slate-800/50 p-3 sm:p-4 rounded-lg">
                <p className="font-semibold text-slate-200 mb-2">"LYXso", "vi", "oss", "vår", "Leverandør":</p>
                <p className="text-slate-300">
                  LYXso AS, organisasjonsnummer [ORG_NR], hjemmehørende i Norge, samt alle datterselskaper,
                  tilknyttede selskaper, direktører, ansatte, agenter, underleverandører og representanter.
                </p>
              </div>
              
              <div className="bg-slate-800/50 p-3 sm:p-4 rounded-lg">
                <p className="font-semibold text-slate-200 mb-2">"Tjenesten", "Plattformen", "LYXso-plattformen":</p>
                <p className="text-slate-300">
                  Alle software-as-a-service (SaaS) produkter, tjenester, funksjoner, moduler, applikasjoner,
                  API-er, integrasjoner, dokumentasjon, support og tilhørende tjenester levert av LYXso AS,
                  inkludert men ikke begrenset til: booking-system, kundeadministrasjon, fakturering, rapportering,
                  AI-assistanse, og alle fremtidige funksjoner.
                </p>
              </div>

              <div className="bg-slate-800/50 p-3 sm:p-4 rounded-lg">
                <p className="font-semibold text-slate-200 mb-2">"Kunde", "du", "din", "Abonnent":</p>
                <p className="text-slate-300">
                  Den juridiske enheten (bedrift, organisasjon) eller fysiske personen som registrerer seg,
                  inngår avtale om eller bruker Tjenesten. Ved bedriftsbruk aksepterer du at du har fullmakt
                  til å binde bedriften til disse vilkårene.
                </p>
              </div>

              <div className="bg-slate-800/50 p-3 sm:p-4 rounded-lg">
                <p className="font-semibold text-slate-200 mb-2">"Sluttbruker", "Bruker":</p>
                <p className="text-slate-300">
                  Kundens ansatte, kontraktører eller andre personer som Kunden gir tilgang til Tjenesten.
                  Kunden er fullt ansvarlig for alle Sluttbrukeres handlinger.
                </p>
              </div>

              <div className="bg-slate-800/50 p-3 sm:p-4 rounded-lg">
                <p className="font-semibold text-slate-200 mb-2">"Kundedata", "Ditt innhold":</p>
                <p className="text-slate-300">
                  All data, informasjon, filer, dokumenter, bilder, personopplysninger og annet innhold som
                  du eller dine Sluttbrukere laster opp, registrerer, genererer eller på annen måte gjør
                  tilgjengelig via Tjenesten. Du er fullt ansvarlig for Kundedata, inkludert lovlighet,
                  kvalitet og nøyaktighet.
                </p>
              </div>

              <div className="bg-slate-800/50 p-3 sm:p-4 rounded-lg">
                <p className="font-semibold text-slate-200 mb-2">"Dokumentasjon":</p>
                <p className="text-slate-300">
                  All brukerdokumentasjon, guider, manualer, API-dokumentasjon og annet materiale som gjøres
                  tilgjengelig av LYXso for å beskrive eller forklare Tjenesten.
                </p>
              </div>

              <div className="bg-slate-800/50 p-3 sm:p-4 rounded-lg">
                <p className="font-semibold text-slate-200 mb-2">"Abonnementsperiode":</p>
                <p className="text-slate-300">
                  Den perioden du har betalt for, typisk månedlig eller årlig, hvor du har rett til å bruke
                  Tjenesten under disse vilkårene.
                </p>
              </div>

              <div className="bg-slate-800/50 p-3 sm:p-4 rounded-lg">
                <p className="font-semibold text-slate-200 mb-2">"Tredjepartstjenester":</p>
                <p className="text-slate-300">
                  Eksterne tjenester, produkter, API-er eller integrasjoner fra tredjeparter som LYXso kan
                  integrere med eller tilby tilgang til, inkludert men ikke begrenset til: betalingsleverandører,
                  e-posttjenester, regnskapssystemer, SMS-leverandører.
                </p>
              </div>
            </div>
          </section>

              {/* Section 2 */}
              <section id="section-2">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-4 sm:mb-6 flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400 text-sm sm:text-base font-bold">
                    2
                  </span>
                  Aksept av vilkår
                </h2>
                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-slate-300">
                  <p className="leading-relaxed">
                    Ved å akseptere disse vilkårene elektronisk, opprette en konto, få tilgang til,
                    laste ned, installere, eller på annen måte bruke enhver del av Tjenesten, bekrefter
                    og garanterer du følgende:
                  </p>
                  <div className="bg-slate-800/50 p-3 sm:p-4 rounded-lg space-y-3">
                    <div className="flex gap-3">
                      <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-slate-200 mb-2">Juridisk kapasitet:</p>
                        <p>Du er minimum 18 år gammel og har rettslig handleevne til å inngå bindende
                        avtaler i henhold til norsk lov. Hvis du opptrer på vegne av en bedrift,
                        garanterer du at du har fullmakt og myndighet til å binde bedriften juridisk
                        til disse vilkårene.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-slate-200 mb-2">Aksept av relaterte vilkår:</p>
                        <p>Du aksepterer også vår{' '}
                        <a href="/personvern" className="text-blue-400 hover:text-blue-300 underline">
                          Personvernerklæring
                        </a>
                        {' '}og{' '}
                        <a href="/cookies" className="text-blue-400 hover:text-blue-300 underline">
                          Cookie-policy
                        </a>
                        , som er integrert i og utgjør en del av disse vilkårene.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-slate-200 mb-2">Fullstendig forståelse:</p>
                        <p>Du bekrefter at du har lest, forstått og aksepterer å være bundet av alle
                        vilkår og betingelser i dette dokumentet. Hvis du ikke aksepterer noen del av
                        disse vilkårene, har du IKKE tillatelse til å bruke Tjenesten og må umiddelbart
                        avslutte all bruk.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 3 - Not duplicated anymore */}
              <section id="section-3">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-4 sm:mb-6 flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400 text-sm sm:text-base font-bold">
                    3
                  </span>
                  Registrering og konto
                </h2>
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-3">3.1 Kontoopprettelse</h3>
                    <p className="text-sm sm:text-base text-slate-300 mb-3 leading-relaxed">
                      For å bruke Tjenesten må du opprette og vedlikeholde en aktiv brukerkonto. Du garanterer og
                      forplikter deg til følgende:
                    </p>
                    <div className="bg-slate-800/30 p-3 sm:p-4 rounded-lg space-y-2 text-sm sm:text-base">
                      <p className="text-slate-300">• All informasjon du oppgir under registrering er sannferdig,
                      nøyaktig, fullstendig og oppdatert</p>
                      <p className="text-slate-300">• Du vil umiddelbart oppdatere registreringsinformasjon for
                      å holde den nøyaktig og oppdatert</p>
                      <p className="text-slate-300">• Du er juridisk autorisert til å representere og binde den
                      bedriften eller organisasjonen du registrerer</p>
                      <p className="text-slate-300">• Du har ikke tidligere blitt utestengt fra Tjenesten</p>
                      <p className="text-slate-300">• Din bruk ikke vil bryte gjeldende lover eller forskrifter</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-3">3.2 Kontosikkerhet og ansvar</h3>
                    <p className="text-sm sm:text-base text-slate-300 mb-3 leading-relaxed">
                      Du har FULLT OG ENESTE ansvar for:
                    </p>
                    <div className="bg-red-900/10 border border-red-700/30 p-3 sm:p-4 rounded-lg space-y-2 text-sm sm:text-base">
                      <p className="text-slate-300">• Å holde påloggingsinformasjon, passord og API-nøkler
                      strengt konfidensielle</p>
                      <p className="text-slate-300">• All aktivitet som skjer under din konto, uansett om den
                      er autorisert av deg eller ikke</p>
                      <p className="text-slate-300">• Å varsle oss UMIDDELBART ved mistanke om uautorisert bruk
                      eller sikkerhetsbrudd</p>
                      <p className="text-slate-300">• Å bruke sterke, unike passord og aktivere to-faktor
                      autentisering når tilgjengelig</p>
                      <p className="text-slate-300 font-semibold">• Alle økonomiske forpliktelser og juridiske
                      konsekvenser av aktiviteter utført via din konto</p>
                    </div>
                    <p className="text-sm text-slate-400 mt-3">
                      Vi er IKKE ansvarlige for noe tap eller skade som følge av ditt brudd på disse
                      sikkerhetsforpliktelsene.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-3">3.3 Bedriftskontoer</h3>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      Hvis du oppretter konto på vegne av en bedrift eller organisasjon, representerer og
                      garanterer du at du har all nødvendig fullmakt til å forplikte bedriften til disse
                      vilkårene. Bedriften vil være juridisk ansvarlig for alle handlinger utført under kontoen.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 4 */}
              <section id="section-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-4 sm:mb-6 flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400 text-sm sm:text-base font-bold">
                    4
                  </span>
                  Abonnement og betaling
                </h2>
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-3">4.1 Abonnementsplaner og priser</h3>
                    <p className="text-sm sm:text-base text-slate-300 mb-3 leading-relaxed">
                      LYXso tilbyr ulike abonnementsplaner med forskjellige funksjoner og prismodeller. Alle priser:
                    </p>
                    <div className="bg-slate-800/30 p-3 sm:p-4 rounded-lg space-y-2 text-sm sm:text-base">
                      <p className="text-slate-300">• Er oppgitt eksklusiv merverdiavgift (25%)</p>
                      <p className="text-slate-300">• Kan endres med minimum 30 dagers skriftlig varsel</p>
                      <p className="text-slate-300">• Er bindende for inneværende faktureringsperiode</p>
                      <p className="text-slate-300">• Gjelder i norske kroner (NOK) med mindre annet er avtalt</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-3">4.2 Betalingsbetingelser</h3>
                    <div className="space-y-3 text-sm sm:text-base text-slate-300">
                      <p className="leading-relaxed">
                        Betaling forfaller på datoen spesifisert i fakturaen. Ved abonnementsbetaling trekkes
                        beløpet automatisk på forfallsdato fra den registrerte betalingsmetoden.
                      </p>
                      <div className="bg-amber-900/20 border border-amber-700/50 p-3 sm:p-4 rounded-lg">
                        <p className="font-semibold text-amber-100 mb-2">Ved forsinket betaling:</p>
                        <p className="text-amber-200/90">• Tilgangen kan suspenderes uten ytterligere varsel etter
                        7 dagers forsinkelse</p>
                        <p className="text-amber-200/90">• Forsinkelsesrenter beregnes i henhold til forsinkelsesrenteloven</p>
                        <p className="text-amber-200/90">• Konto kan stenges permanent etter 30 dagers forsinkelse</p>
                        <p className="text-amber-200/90">• Du er ansvarlig for alle inkassokostnader og juridiske gebyrer</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-3">4.3 Oppgradering og nedgradering</h3>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      Du kan endre abonnementsplan når som helst. Oppgraderinger trer i kraft umiddelbart med
                      pro-rata justering. Nedgraderinger trer i kraft ved neste faktureringsperiode. Ved nedgradering
                      kan funksjoner og data bli utilgjengelig eller slettet.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-3">4.4 Refusjonspolicy</h3>
                    <div className="bg-slate-800/50 p-3 sm:p-4 rounded-lg space-y-3 text-sm sm:text-base">
                      <p className="text-slate-200 font-semibold">14-dagers tilfredsgaranti:</p>
                      <p className="text-slate-300">
                        Nye kunder kan be om FULL refusjon innen 14 dager etter første betaling, uten begrunnelse.
                        Send refusjonsforespørsel til kontakt@lyxso.no.
                      </p>
                      <p className="text-slate-200 font-semibold mt-4">Etter 14-dagers perioden:</p>
                      <p className="text-slate-300">
                        INGEN refusjon gis for allerede betalte perioder. Oppsigelse stopper fremtidige betalinger,
                        men refunderer ikke allerede fakturerte beløp. Dette gjelder også ved tekniske problemer,
                        endret behov eller utilfredshet med Tjenesten.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 5 */}
              <section id="section-5">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-4 sm:mb-6 flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400 text-sm sm:text-base font-bold">
                    5
                  </span>
                  Bruk av Tjenesten
                </h2>
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-3">5.1 Lisensiert bruk</h3>
                    <p className="text-sm sm:text-base text-slate-300 mb-3 leading-relaxed">
                      Under overholdelse av disse vilkårene gir vi deg en begrenset, ikke-eksklusiv,
                      ikke-overførbar, gjenkallelig lisens til å bruke Tjenesten for dine interne
                      forretningsformål.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-3">5.2 STRENGT FORBUDTE aktiviteter</h3>
                    <div className="bg-red-900/20 border border-red-700/50 p-3 sm:p-4 rounded-lg space-y-2 text-sm sm:text-base">
                      <p className="text-red-100 font-semibold mb-2">Du forplikter deg IKKE å:</p>
                      <p className="text-red-200/90">• Bruke Tjenesten til ulovlige, svindel eller ondsinnede formål</p>
                      <p className="text-red-200/90">• Forsøke å få uautorisert tilgang til systemer, nettverk eller data</p>
                      <p className="text-red-200/90">• Laste opp virus, malware, trojanere eller annen skadelig kode</p>
                      <p className="text-red-200/90">• Reverse-engineere, dekompilere eller demontere Tjenesten</p>
                      <p className="text-red-200/90">• Fjerne, endre eller skjule opphavsrettigheter eller merker</p>
                      <p className="text-red-200/90">• Videresende, lease, sublisensiere eller videreselge Tjenesten</p>
                      <p className="text-red-200/90">• Kopiere, modifisere eller lage avledede verk av Tjenesten</p>
                      <p className="text-red-200/90">• Bruke automatiserte systemer (bots, spiders, scrapers) uten tillatelse</p>
                      <p className="text-red-200/90">• Overbelaste eller forstyrre servere eller nettverk</p>
                      <p className="text-red-200/90">• Omgå sikkerhetsfunksjoner eller tilgangsbegrensninger</p>
                      <p className="text-red-200/90">• Utgi deg for å være noen andre eller falskt representere tilknytning</p>
                      <p className="text-red-200/90">• Lagre ulovlig, krenkende, ærekrenkende eller diskriminerende innhold</p>
                      <p className="text-red-200/90">• Krenke andres immaterielle rettigheter eller personvern</p>
                      <p className="text-red-200/90">• Bruke Tjenesten til å sende spam, phishing eller uønsket markedsføring</p>
                    </div>
                    <p className="text-sm text-amber-200 mt-3">
                      ⚠️ Brudd på disse forbudene kan medføre umiddelbar kontostenging, juridiske skritt
                      og krav om erstatning for skader.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-3">5.3 Compliance og lovlighet</h3>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      Du er ENESTE ansvarlig for å sikre at din bruk av Tjenesten overholder alle gjeldende lover,
                      forskrifter og bransjestandarder, inkludert men ikke begrenset til: GDPR, personopplysningsloven,
                      markedsføringsloven, og andre relevante reguleringer.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 6 */}
              <section id="section-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-4 sm:mb-6 flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400 text-sm sm:text-base font-bold">
                    6
                  </span>
                  Kundedata og eierskap
                </h2>
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-3">6.1 Ditt eierskap til Kundedata</h3>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      Du beholder alle rettigheter, eierskap og interesser i Kundedata. Vi hevder ikke noe eierskap
                      til ditt innhold. Du er imidlertid ENESTE ansvarlig for lovligheten, påliteligheten, integriteten,
                      nøyaktigheten og kvaliteten på all Kundedata.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-3">6.2 Lisens til oss</h3>
                    <p className="text-sm sm:text-base text-slate-300 mb-3 leading-relaxed">
                      Ved å bruke Tjenesten gir du oss en verdensomspennende, royalty-fri, ikke-eksklusiv lisens til å:
                    </p>
                    <div className="bg-slate-800/30 p-3 sm:p-4 rounded-lg space-y-2 text-sm sm:text-base">
                      <p className="text-slate-300">• Lagre, behandle, overføre og vise Kundedata for å levere Tjenesten</p>
                      <p className="text-slate-300">• Lage sikkerhetskopier for gjenoppretting og forretningskontinuitet</p>
                      <p className="text-slate-300">• Bruke anonymiserte og aggregerte data til analyse og forbedring</p>
                      <p className="text-slate-300">• Dele med underleverandører som bistår med tjenesteleveranse</p>
                    </div>
                    <p className="text-sm text-slate-400 mt-3">
                      Denne lisensen opphører når du sletter Kundedata eller stenger kontoen (med forbehold for
                      backup-oppbevaringsperioder).
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-3">6.3 Vårt eierskap til Tjenesten</h3>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      LYXso-plattformen, inkludert all kildekode, databaser, funksjonalitet, programvare, design,
                      teknologi, brukergrensesnitt, grafiske elementer, logoer, varemerker, dokumentasjon og tilhørende
                      immaterielle rettigheter, eies og kontrolleres utelukkende av LYXso AS. Disse er beskyttet av
                      norsk og internasjonal opphavsrett, varemerkelov og andre immaterielle rettigheter.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-3">6.4 Tilbakemelding</h3>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      Hvis du gir oss forslag, ideer eller tilbakemeldinger om Tjenesten, gir du oss en ubegrenset,
                      evig, ugjenkallelig, royalty-fri rett til å bruke, implementere, modifisere og kommersialisere
                      denne tilbakemeldingen uten kompensasjon eller attribusjon til deg.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 7 - CRITICAL DISCLAIMER */}
              <section id="section-7" className="border-2 border-red-700/50 rounded-lg p-4 sm:p-6 bg-red-900/10">
                <h2 className="text-xl sm:text-2xl font-semibold text-red-100 mb-4 sm:mb-6 flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-red-600/30 rounded-lg flex items-center justify-center text-red-300 text-sm sm:text-base font-bold">
                    7
                  </span>
                  ANSVARSBEGRENSNING (LIMITATION OF LIABILITY)
                </h2>
                <div className="space-y-4 text-sm sm:text-base">
                  <div className="bg-red-900/30 border border-red-700/50 p-4 rounded-lg">
                    <p className="text-red-100 font-bold uppercase mb-3">LES DETTE NØYE - KRITISK JURIDISK KLAUSUL</p>
                    <p className="text-red-200/90 leading-relaxed mb-3">
                      I DEN MAKSIMALE GRAD TILLATT AV GJELDENDE LOV, SKAL LYXSO AS, DETS DATTERSELSKAPER,
                      TILKNYTTEDE SELSKAPER, DIREKTØRER, ANSATTE, AGENTER, LEVERANDØRER ELLER LISENSGIVERE
                      UNDER INGEN OMSTENDIGHETER VÆRE ANSVARLIGE FOR:
                    </p>
                    <div className="space-y-2 ml-4">
                      <p className="text-red-200/90">• INDIREKTE, SPESIELLE, TILFELDIGE ELLER FØLGESKADER</p>
                      <p className="text-red-200/90">• TAPT FORTJENESTE, INNTEKT, DATA ELLER FORRETNINGS MULIGHETER</p>
                      <p className="text-red-200/90">• DRIFTSSTANS ELLER FORRETNINGSAVBRUDD</p>
                      <p className="text-red-200/90">• SKADER PÅ OMDØMME ELLER GOODWILL</p>
                      <p className="text-red-200/90">• KOSTNADER VED ANSKAFFELSE AV ERSTATNINGSVARER/-TJENESTER</p>
                      <p className="text-red-200/90">• DATATAP, KORRUPSJON ELLER SLETTING</p>
                      <p className="text-red-200/90">• FEIL, MANGLER ELLER FORSINKELSER I TJENESTEN</p>
                      <p className="text-red-200/90">• HANDLINGER ELLER UNNLATELSER FRA TREDJEPARTER</p>
                      <p className="text-red-200/90">• FORCE MAJEURE HENDELSER</p>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="text-slate-200 font-semibold mb-2">MAKSIMALT ANSVAR:</p>
                    <p className="text-slate-300 leading-relaxed">
                      I ALLE TILFELLER ER VÅRT TOTALE KUMULATIVE ANSVAR BEGRENSET TIL DET LAVESTE AV:
                      (A) BELØPET DU HAR BETALT OSS I DE SISTE 12 MÅNEDENE, ELLER (B) NOK 10,000.
                    </p>
                    <p className="text-slate-400 text-sm mt-2">
                      Dette gjelder uavhengig av årsak, teori eller grunnlag for kravet (kontrakt, erstatningsansvar,
                      garanti, uaktsomhet eller annet), selv om vi har blitt informert om muligheten for slike skader.
                    </p>
                  </div>

                  <div className="bg-amber-900/20 border border-amber-700/50 p-4 rounded-lg">
                    <p className="text-amber-100 font-semibold mb-2">UNNTAK FRA ANSVARSBEGRENSNING:</p>
                    <p className="text-amber-200/90">
                      Ansvarsbegrensningen gjelder ikke for skader forårsaket av grov uaktsomhet, forsett,
                      personskade eller død, eller brudd på ufravikelige lovbestemmelser som ikke kan fraskri ves
                      kontraktsmessig i henhold til norsk lov.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 8 - WARRANTY DISCLAIMER */}
              <section id="section-8" className="border-2 border-amber-700/50 rounded-lg p-4 sm:p-6 bg-amber-900/10">
                <h2 className="text-xl sm:text-2xl font-semibold text-amber-100 mb-4 sm:mb-6 flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-amber-600/30 rounded-lg flex items-center justify-center text-amber-300 text-sm sm:text-base font-bold">
                    8
                  </span>
                  GARANTIFRASKRIVELSE (WARRANTY DISCLAIMER)
                </h2>
                <div className="space-y-4 text-sm sm:text-base">
                  <div className="bg-amber-900/30 border border-amber-700/50 p-4 rounded-lg">
                    <p className="text-amber-100 font-bold uppercase mb-3">"AS-IS" OG "AS-AVAILABLE" LEVERING</p>
                    <p className="text-amber-200/90 leading-relaxed">
                      TJENESTEN LEVERES "SOM DEN ER" OG "SOM TILGJENGELIG", UTEN GARANTIER AV NOEN ART,
                      VERKEN UTTRYKKELIGE ELLER UNDERFORSTÅTTE. VI FRASKRIVER OSS UTTRYKKELIG ALLE GARANTIER,
                      INKLUDERT MEN IKKE BEGRENSET TIL:
                    </p>
                    <div className="space-y-2 ml-4 mt-3">
                      <p className="text-amber-200/90">• GARANTIER FOR SALGBARHET</p>
                      <p className="text-amber-200/90">• EGNETHET FOR ET BESTEMT FORMÅL</p>
                      <p className="text-amber-200/90">• IKKE-KRENKELSE AV TREDJEPARTSRETTIGHETER</p>
                      <p className="text-amber-200/90">• NØYAKTIGHET, PÅLITELIGHET ELLER FULLSTENDIGHET</p>
                      <p className="text-amber-200/90">• UAVBRUTT, SIKKER ELLER FEILFRI DRIFT</p>
                      <p className="text-amber-200/90">• AT FEIL ELLER MANGLER VIL BLI RETTET</p>
                      <p className="text-amber-200/90">• AT TJENESTEN ER FRI FOR VIRUS ELLER SKADELIG KODE</p>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="text-slate-200 font-semibold mb-2">DIN BRUK ER PÅ EGEN RISIKO:</p>
                    <p className="text-slate-300 leading-relaxed">
                      Du erkjenner og aksepterer at all bruk av Tjenesten er PÅ DIN EGEN OG ENESTE RISIKO.
                      Du er ansvarlig for å evaluere nøyaktigheten, fullstendigheten og nytten av all informasjon,
                      råd, tjenester eller annet innhold tilgjengelig via Tjenesten.
                    </p>
                  </div>

                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="text-slate-200 font-semibold mb-2">INGEN RÅDGIVNING:</p>
                    <p className="text-slate-300 leading-relaxed">
                      Ingenting i Tjenesten utgjør juridisk, regnskapsmessig, skattemessig eller annen profesjonell
                      rådgivning. Du må konsultere egne profesjonelle rådgivere for slike spørsmål.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 9 - INDEMNIFICATION */}
              <section id="section-9" className="border-2 border-orange-700/50 rounded-lg p-4 sm:p-6 bg-orange-900/10">
                <h2 className="text-xl sm:text-2xl font-semibold text-orange-100 mb-4 sm:mb-6 flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-orange-600/30 rounded-lg flex items-center justify-center text-orange-300 text-sm sm:text-base font-bold">
                    9
                  </span>
                  HOLD HARMLESS OG SKADESLØSHOLDELSE (INDEMNIFICATION)
                </h2>
                <div className="space-y-4 text-sm sm:text-base">
                  <div className="bg-orange-900/30 border border-orange-700/50 p-4 rounded-lg">
                    <p className="text-orange-100 font-bold mb-3">DU FORPLIKTER DEG TIL Å HOLDE LYXSO SKADESLØS</p>
                    <p className="text-orange-200/90 leading-relaxed mb-3">
                      Du samtykker i å forsvare, holde skadesløs og beskytte LYXso AS, dets datterselskaper,
                      tilknyttede selskaper, partnere, direktører, ansatte, agenter, lisensgivere og leverandører
                      mot ethvert krav, ansvar, skade, tap, kostnad, utgift eller gebyr (inkludert rimelige
                      advokathonorarer og rettskostnader) som oppstår fra eller er relatert til:
                    </p>
                    <div className="space-y-2 ml-4">
                      <p className="text-orange-200/90">• Din bruk eller misbruk av Tjenesten</p>
                      <p className="text-orange-200/90">• Brudd på disse vilkårene</p>
                      <p className="text-orange-200/90">• Krenkelse av tredjepartss rettigheter (IPR, personvern, osv.)</p>
                      <p className="text-orange-200/90">• Kundedata du laster opp eller behandler</p>
                      <p className="text-orange-200/90">• Handlinger av dine Sluttbrukere</p>
                      <p className="text-orange-200/90">• Ulovlig eller uautorisert bruk av Tjenesten</p>
                      <p className="text-orange-200/90">• Falsk, villedende eller ufullstendig informasjon</p>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="text-slate-200 font-semibold mb-2">VÅRE RETTIGHETER VED KRAV:</p>
                    <p className="text-slate-300 leading-relaxed">
                      Vi forbeholder oss retten til, på egen bekostning, å overta eksklusiv forsvar og kontroll
                      over enhver sak som du er forpliktet til å holde oss skadesløs for. Du vil samarbeide
                      fullt ut med oss i forsvaret av slike krav.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 10 - Force Majeure */}
              <section id="section-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-4 sm:mb-6 flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400 text-sm sm:text-base font-bold">
                    10
                  </span>
                  Force Majeure
                </h2>
                <div className="space-y-4 text-sm sm:text-base">
                  <p className="text-slate-300 leading-relaxed">
                    Vi er IKKE ansvarlige for manglende oppfyllelse eller forsinket oppfyllelse av våre forpliktelser
                    under disse vilkårene dersom dette skyldes omstendigheter utenfor vår rimelige kontroll, inkludert:
                  </p>
                  <div className="bg-slate-800/30 p-4 rounded-lg space-y-2">
                    <p className="text-slate-300">• Naturkatastrofer (jordskjelv, flom, storm, brann)</p>
                    <p className="text-slate-300">• Krig, terrorisme, opprør, embargoes</p>
                    <p className="text-slate-300">• Pandemier, epidemier eller smittsomme sykdommer</p>
                    <p className="text-slate-300">• Strømbrudd, telekommunikasjonsbrudd</p>
                    <p className="text-slate-300">• Cyberangrep, DDoS-angrep, hacking</p>
                    <p className="text-slate-300">• Feil hos underleverandører (cloud-leverandører, ISP-er)</p>
                    <p className="text-slate-300">• Offentlige påbud, lover eller forskrifter</p>
                    <p className="text-slate-300">• Streik, lockout eller andre arbeidskonflikter</p>
                  </div>
                  <p className="text-slate-400 text-sm">
                    Ved slike hendelser vil våre forpliktelser suspenderes så lenge force majeure varer, og vi
                    vil ikke være ansvarlige for forsinkelser eller manglende ytelse.
                  </p>
                </div>
              </section>

              {/* Sections 11-20 continue... */}
              <section id="section-11">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-4 sm:mb-6 flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400 text-sm sm:text-base font-bold">
                    11
                  </span>
                  Datatap, backup og gjenoppretting
                </h2>
                <div className="space-y-4 text-sm sm:text-base">
                  <p className="text-slate-300 leading-relaxed">
                    Vi implementerer bransjestan dard backup-prosedyrer for å beskytte Kundedata. Likevel:
                  </p>
                  <div className="bg-amber-900/20 border border-amber-700/50 p-4 rounded-lg space-y-3">
                    <p className="text-amber-200/90"><strong>VIKTIG:</strong> Vi ANBEFALER STERKT at du tar egne,
                    uavhengige sikkerhetskopier av alle kritiske data. Vi er IKKE ansvarlige for datatap som skyldes:</p>
                    <div className="ml-4 space-y-1">
                      <p className="text-amber-200/90">• Sletting utført av deg eller dine Sluttbrukere</p>
                      <p className="text-amber-200/90">• Konto-suspensjon eller -oppsigelse</p>
                      <p className="text-amber-200/90">• Cyberangrep, hacking eller ondsinnet aktivitet</p>
                      <p className="text-amber-200/90">• Feil hos underleverandører eller cloud-infrastruktur</p>
                      <p className="text-amber-200/90">• Force majeure hendelser</p>
                      <p className="text-amber-200/90">• Tekniske feil, bugs eller programvarefeil</p>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="text-slate-200 font-semibold mb-2">Backup-oppbevaring:</p>
                    <p className="text-slate-300">
                      Backups oppbevares i minimum 30 dager. Ved kontostenging slettes alle data permanent etter
                      30 dager, med mindre lovkrav krever lengre oppbevaring.
                    </p>
                  </div>
                </div>
              </section>

              <section id="section-12">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-4 sm:mb-6 flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400 text-sm sm:text-base font-bold">
                    12
                  </span>
                  Oppetid, tilgjengelighet og vedlikehold
                </h2>
                <div className="space-y-4 text-sm sm:text-base">
                  <p className="text-slate-300 leading-relaxed">
                    Vi streber etter høy oppetid, men kan IKKE garantere at Tjenesten vil være tilgjengelig
                    24/7/365 uten avbrudd.
                  </p>
                  <div className="bg-slate-800/30 p-4 rounded-lg">
                    <p className="text-slate-200 font-semibold mb-2">Planlagt vedlikehold:</p>
                    <p className="text-slate-300 mb-2">
                      Vi forbeholder oss retten til å utføre planlagt vedlikehold, oppgraderinger og
                      systemforbedringer som kan resultere i midlertidig utilgjengelighet. Vi vil:
                    </p>
                    <div className="ml-4 space-y-1">
                      <p className="text-slate-300">• Varsle minimum 48 timer i forv eien (normalt 7 dager)</p>
                      <p className="text-slate-300">• Utføre vedlikehold i lavtrafikk-perioder når mulig</p>
                      <p className="text-slate-300">• Minimere nedetid og informere om forventet varighet</p>
                    </div>
                  </div>
                  <div className="bg-slate-800/30 p-4 rounded-lg">
                    <p className="text-slate-200 font-semibold mb-2">Akutt vedlikehold:</p>
                    <p className="text-slate-300">
                      Ved kritiske sikkerhetshendelser, alvorlige feil eller nødvendige akuttfikser kan vi
                      suspendere Tjenesten UTEN forvarsel. Vi vil informere så snart som mulig.
                    </p>
                  </div>
                  <div className="bg-red-900/20 border border-red-700/50 p-4 rounded-lg">
                    <p className="text-red-200 font-semibold mb-2">INGEN SLA-GARANTI:</p>
                    <p className="text-red-200/90">
                      Med mindre spesifikt avtalt skriftlig i en separat Enterprise-avtale, tilbyr vi INGEN
                      Service Level Agreement (SLA) eller garantier for oppetid, ytelse eller responstid.
                    </p>
                  </div>
                </div>
              </section>

              <section id="section-13">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-4 sm:mb-6 flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400 text-sm sm:text-base font-bold">
                    13
                  </span>
                  Sikkerhet og databeskyttelse
                </h2>
                <div className="space-y-4 text-sm sm:text-base">
                  <p className="text-slate-300 leading-relaxed">
                    Vi implementerer kommersielt rimelige tekniske og organisatoriske sikkerhetstiltak for å
                    beskytte Tjenesten og Kundedata, inkludert:
                  </p>
                  <div className="bg-slate-800/30 p-4 rounded-lg space-y-2">
                    <p className="text-slate-300">• Kryptering av data under overføring (TLS/SSL)</p>
                    <p className="text-slate-300">• Kryptering av sensitive data ved lagring</p>
                    <p className="text-slate-300">• Tilgangskontroll og autentisering</p>
                    <p className="text-slate-300">• Regelmessige sikkerhetskopier</p>
                    <p className="text-slate-300">• Logging og overvåking av sikkerhetsrelaterte hendelser</p>
                    <p className="text-slate-300">• Sårbarhetsvurderinger og penetrasjonstesting</p>
                  </div>
                  <div className="bg-amber-900/20 border border-amber-700/50 p-4 rounded-lg">
                    <p className="text-amber-100 font-semibold mb-2">INGEN ABSOLUTT SIKKERHET:</p>
                    <p className="text-amber-200/90">
                      Selv med disse tiltakene kan vi IKKE garantere absolutt sikkerhet. Ingen internett-basert
                      overføring eller elektronisk lagring er 100% sikker. Du erkjenner og aksepterer risikoen
                      forbundet med elektronisk kommunikasjon og lagring.
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="text-slate-200 font-semibold mb-2">Rapportering av sikkerhetshendelser:</p>
                    <p className="text-slate-300">
                      Hvis du oppdager sikkerhetssårbarheter eller mistenkelig aktivitet, må du umiddelbart varsle
                      oss på <a href="mailto:security@lyxso.no" className="text-blue-400 hover:text-blue-300 underline">
                        security@lyxso.no
                      </a>. IKKE utnytt sårbarheten eller diskuter den offentlig før vi har fått mulighet til å
                      adressere den.
                    </p>
                  </div>
                </div>
              </section>

              <section id="section-14">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-4 sm:mb-6 flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400 text-sm sm:text-base font-bold">
                    14
                  </span>
                  Tredjepartstjenester og integrasjoner
                </h2>
                <div className="space-y-4 text-sm sm:text-base">
                  <p className="text-slate-300 leading-relaxed">
                    Tjenesten kan integrere med eller gi tilgang til tredjepartstjenester, inkludert:
                  </p>
                  <div className="bg-slate-800/30 p-4 rounded-lg grid sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-slate-200 font-semibold mb-2">Infrastruktur:</p>
                      <p className="text-slate-300 text-sm">• Supabase (database)</p>
                      <p className="text-slate-300 text-sm">• Vercel (hosting)</p>
                      <p className="text-slate-300 text-sm">• Cloudflare (CDN/sikkerhet)</p>
                    </div>
                    <div>
                      <p className="text-slate-200 font-semibold mb-2">Tjenester:</p>
                      <p className="text-slate-300 text-sm">• Betalingsleverandører</p>
                      <p className="text-slate-300 text-sm">• E-posttjenester</p>
                      <p className="text-slate-300 text-sm">• SMS-leverandører</p>
                    </div>
                  </div>
                  <div className="bg-red-900/20 border border-red-700/50 p-4 rounded-lg">
                    <p className="text-red-200 font-semibold mb-2">FRASKRIVELSE AV ANSVAR:</p>
                    <p className="text-red-200/90">
                      Vi er IKKE ansvarlige for tredjepartstjenester, deres tilgjengelighet, ytelse, pålitelighet,
                      sikkerhet eller innhold. Din bruk av tredjepartstjenester er underlagt deres egne vilkår og
                      personvernregler. Vi gir INGEN garantier for integrasjoner med tredjepartstjenester.
                    </p>
                  </div>
                  <p className="text-slate-400 text-sm">
                    Ved endringer, oppsigelser eller tekniske problemer hos tredjeparter som påvirker Tjenesten,
                    vil vi gjøre vårt beste for å finne alternativer, men er ikke ansvarlige for eventuelle avbrudd
                    eller tap.
                  </p>
                </div>
              </section>

              <section id="section-15">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-4 sm:mb-6 flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400 text-sm sm:text-base font-bold">
                    15
                  </span>
                  Immaterielle rettigheter
                </h2>
                <div className="space-y-4 text-sm sm:text-base">
                  <p className="text-slate-300 leading-relaxed">
                    Alle immaterielle rettigheter i Tjenesten, inkludert (men ikke begrenset til) opphavsrett,
                    varemerker, design, patenter, forretningshemmeligheter, know-how, algoritmer, kildekode,
                    databaser, brukergrensesnitt, dokumentasjon og annet materiale, eies eksklusivt av LYXso AS
                    eller våre lisensgivere.
                  </p>
                  <div className="bg-slate-800/30 p-4 rounded-lg">
                    <p className="text-slate-200 font-semibold mb-2">Beskyttet materiale:</p>
                    <div className="space-y-2">
                      <p className="text-slate-300">• LYXso®-merket og logo</p>
                      <p className="text-slate-300">• Programvare, kildekode og API-er</p>
                      <p className="text-slate-300">• Dokumentasjon og brukermanualer</p>
                      <p className="text-slate-300">• Design, layout og grafiske elementer</p>
                      <p className="text-slate-300">• Algoritmer og forretningslogikk</p>
                      <p className="text-slate-300">• Markedsføringsmateriell og kampanjer</p>
                    </div>
                  </div>
                  <div className="bg-red-900/20 border border-red-700/50 p-4 rounded-lg">
                    <p className="text-red-200 font-semibold mb-2">FORBUDT:</p>
                    <p className="text-red-200/90">
                      Du må IKKE kopiere, modifisere, distribuere, selge, lease, reverse-engineere, dekompilere,
                      demontere eller på annen måte forsøke å utlede kildekode fra Tjenesten. Brudd på disse
                      rettighetene kan medføre sivile og strafferettslige sanksjoner.
                    </p>
                  </div>
                </div>
              </section>

              <section id="section-16">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-4 sm:mb-6 flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400 text-sm sm:text-base font-bold">
                    16
                  </span>
                  Compliance, eksport og sanksjoner
                </h2>
                <div className="space-y-4 text-sm sm:text-base">
                  <p className="text-slate-300 leading-relaxed">
                    Du garanterer at din bruk av Tjenesten overholder alle gjeldende lover, inkludert:
                  </p>
                  <div className="bg-slate-800/30 p-4 rounded-lg space-y-2">
                    <p className="text-slate-300">• GDPR og personopplysningsloven</p>
                    <p className="text-slate-300">• Markedsføringsloven og e-handelsloven</p>
                    <p className="text-slate-300">• Regnskapsloven og skatteloven</p>
                    <p className="text-slate-300">• Anti-korrupsjonslovgivning</p>
                    <p className="text-slate-300">• Anti-hvitvasking (AML) og Know-Your-Customer (KYC)</p>
                    <p className="text-slate-300">• Eksportkontroll og sanksjonslovgivning</p>
                  </div>
                  <div className="bg-amber-900/20 border border-amber-700/50 p-4 rounded-lg">
                    <p className="text-amber-100 font-semibold mb-2">Sanksjoner og embargoes:</p>
                    <p className="text-amber-200/90">
                      Du kan IKKE bruke Tjenesten hvis du er underlagt sanksjoner eller eksportrestriksjoner fra
                      Norge, EU, USA eller andre jurisdiksjoner. Du garanterer at du ikke er på noen sanksjons-
                      eller svartelisteliste.
                    </p>
                  </div>
                </div>
              </section>

              <section id="section-17">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-4 sm:mb-6 flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400 text-sm sm:text-base font-bold">
                    17
                  </span>
                  Oppsigelse og konsekvenser
                </h2>
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-3">17.1 Din oppsigelse</h3>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      Du kan når som helst si opp abonnementet via kontoinnstillinger eller ved å kontakte support.
                      Oppsigelse trer i kraft ved slutten av inneværende betalingsperiode. INGEN refusjon gis for
                      ubrukt tid (utenom 14-dagers garanti).
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-3">17.2 Vår oppsigelse</h3>
                    <p className="text-sm sm:text-base text-slate-300 mb-3 leading-relaxed">
                      Vi kan suspendere eller avslutte din konto UMIDDELBART og uten forvarsel hvis:
                    </p>
                    <div className="bg-red-900/20 border border-red-700/50 p-3 sm:p-4 rounded-lg space-y-2 text-sm sm:text-base">
                      <p className="text-red-200/90">• Du bryter disse vilkårene</p>
                      <p className="text-red-200/90">• Betaling ikke mottas innen 7 dager etter forfall</p>
                      <p className="text-red-200/90">• Din bruk truer sikkerheten eller stabiliteten til Tjenesten</p>
                      <p className="text-red-200/90">• Du engasjerer deg i ulovlig eller svindel-aktivitet</p>
                      <p className="text-red-200/90">• Vi pålegges å gjøre det av myndigheter</p>
                      <p className="text-red-200/90">• Vi bestemmer oss for å avslutte Tjenesten (90 dagers varsel)</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-3">17.3 Konsekvenser ved oppsigelse</h3>
                    <div className="bg-amber-900/20 border border-amber-700/50 p-3 sm:p-4 rounded-lg space-y-3 text-sm sm:text-base">
                      <p className="text-amber-200/90">Ved oppsigelse eller kontostenging:</p>
                      <div className="ml-4 space-y-2">
                        <p className="text-amber-200/90">• Mister du umiddelbart tilgang til Tjenesten</p>
                        <p className="text-amber-200/90">• Alle lisenser opphører øyeblikkelig</p>
                        <p className="text-amber-200/90">• Kundedata beholdes i 30 dager for gjenoppretting</p>
                        <p className="text-amber-200/90">• Etter 30 dager slettes ALL data permanent og ugjenkallelig</p>
                        <p className="text-amber-200/90">• Utestående betalinger forfaller umiddelbart</p>
                        <p className="text-amber-200/90">• Seksjoner 6-9, 15-19 overlever oppsigelsen</p>
                      </div>
                      <p className="text-amber-100 font-semibold mt-3">
                        VIKTIG: Eksporter dine data FØR oppsigelse. Vi er IKKE ansvarlige for tap av data etter
                        kontostenging.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section id="section-18">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-4 sm:mb-6 flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400 text-sm sm:text-base font-bold">
                    18
                  </span>
                  Endringer i vilkårene
                </h2>
                <div className="space-y-4 text-sm sm:text-base">
                  <p className="text-slate-300 leading-relaxed">
                    Vi forbeholder oss retten til å endre, modifisere eller erstatte disse vilkårene når som helst.
                    Ved vesentlige endringer vil vi:
                  </p>
                  <div className="bg-slate-800/30 p-4 rounded-lg space-y-2">
                    <p className="text-slate-300">• Varsle deg via e-post til registrert adresse</p>
                    <p className="text-slate-300">• Publisere varsel på nettstedet</p>
                    <p className="text-slate-300">• Gi minimum 30 dagers varsel før ikrafttredelse</p>
                  </div>
                  <div className="bg-amber-900/20 border border-amber-700/50 p-4 rounded-lg">
                    <p className="text-amber-100 font-semibold mb-2">Din aksept:</p>
                    <p className="text-amber-200/90">
                      Fortsatt bruk av Tjenesten etter at endringene trer i kraft innebærer at du aksepterer de
                      nye vilkårene. Hvis du ikke aksepterer endringene, må du avslutte bruken og si opp abonnementet.
                    </p>
                  </div>
                  <p className="text-slate-400 text-sm">
                    Det er ditt ansvar å regelmessig gjennomgå disse vilkårene. Siste oppdateringsdato vises
                    øverst på siden.
                  </p>
                </div>
              </section>

              <section id="section-19">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-4 sm:mb-6 flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400 text-sm sm:text-base font-bold">
                    19
                  </span>
                  Lovvalg, jurisdiksjon og tvisteløsning
                </h2>
                <div className="space-y-4 text-sm sm:text-base">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-3">19.1 Lovvalg</h3>
                    <p className="text-slate-300 leading-relaxed">
                      Disse vilkårene skal tolkes og håndheves i henhold til norsk lov, uten hensyn til
                      lovvalgsprinsipper. FNs konvensjon om kontrakter for internasjonale løsørekjøp (CISG)
                      skal IKKE gjelde.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-3">19.2 Verneting og jurisdiksjon</h3>
                    <p className="text-slate-300 leading-relaxed mb-3">
                      Enhver tvist, kontrovers eller krav som oppstår fra eller i forbindelse med disse vilkårene
                      skal løses ved norske domstoler.
                    </p>
                    <div className="bg-slate-800/50 p-4 rounded-lg">
                      <p className="text-slate-200 font-semibold mb-2">Eksklusivt verneting:</p>
                      <p className="text-slate-300">
                        <strong>Oslo tingrett</strong> skal være eksklusivt verneting for tvister som ikke kan løses
                        i minnelighet. Du aksepterer uttrykkelig jurisdiksjonen til disse domstolene.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-3">19.3 Minnelig løsning</h3>
                    <p className="text-slate-300 leading-relaxed">
                      Før rettslige skritt innledes, oppfordrer vi begge parter til å forsøke å løse tvister
                      i minnelighet gjennom direkte forhandlinger. Kontakt oss på{' '}
                      <a href="mailto:legal@lyxso.no" className="text-blue-400 hover:text-blue-300 underline">
                        legal@lyxso.no
                      </a>{' '}
                      for å diskutere tvisten.
                    </p>
                  </div>

                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="text-slate-200 font-semibold mb-2">Foreldelse:</p>
                    <p className="text-slate-300">
                      Ethvert krav må fremsettes innen 1 år fra den datoen årsaken til kravet oppstod, ellers
                      er det foreldet og kan ikke håndheves.
                    </p>
                  </div>
                </div>
              </section>

              <section id="section-20">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-4 sm:mb-6 flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400 text-sm sm:text-base font-bold">
                    20
                  </span>
                  Diverse bestemmelser
                </h2>
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-3">20.1 Hele avtalen</h3>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      Disse vilkårene, sammen med Personvernerklæringen og Cookie-policyen, utgjør hele avtalen
                      mellom deg og LYXso angående bruk av Tjenesten. Den erstatter alle tidligere avtaler,
                      forståelser og kommunikasjon.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-3">20.2 Delbarhet</h3>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      Hvis noen bestemmelse i disse vilkårene finnes ugyldig eller ugjennomførbar, skal de øvrige
                      bestemmelsene forbli i full kraft. Den ugyldige bestemmelsen skal erstattes med en gyldig
                      bestemmelse som best oppnår intensjonen.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-3">20.3 Overdragelse</h3>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      Du kan IKKE overdra eller overføre dine rettigheter eller forpliktelser uten vårt forutgående
                      skriftlige samtykke. Vi kan fritt overdra disse vilkårene ved fusjon, oppkjøp eller salg av
                      virksomheten.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-3">20.4 Fraskrivelse av rettigheter</h3>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      Vår manglende håndhevelse av en rett eller bestemmelse utgjør ikke en fraskrivelse av den
                      rettigheten eller bestemmelsen. En fraskrivelse er kun gyldig hvis den er skriftlig og signert.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-3">20.5 Tredjepartsrettigheter</h3>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      Disse vilkårene gir ikke tredjeparter noen rettigheter eller fordeler.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-3">20.6 Overskrifter</h3>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      Seksjonsoverskrifter er kun for referanse og påvirker ikke tolkningen.
                    </p>
                  </div>

                  <div className="bg-blue-900/20 border border-blue-700/50 p-4 sm:p-6 rounded-lg mt-8">
                    <h3 className="text-lg sm:text-xl font-semibold text-blue-100 mb-3">Kontaktinformasjon</h3>
                    <div className="space-y-2 text-sm sm:text-base text-blue-200/90">
                      <p><strong>LYXso AS</strong></p>
                      <p>Organisasjonsnummer: [ORG_NR]</p>
                      <p>Adresse: [ADRESSE]</p>
                      <p>
                        E-post:{' '}
                        <a href="mailto:kontakt@lyxso.no" className="text-blue-400 hover:text-blue-300 underline">
                          kontakt@lyxso.no
                        </a>
                      </p>
                      <p>
                        Juridiske spørsmål:{' '}
                        <a href="mailto:legal@lyxso.no" className="text-blue-400 hover:text-blue-300 underline">
                          legal@lyxso.no
                        </a>
                      </p>
                      <p>
                        Personvern:{' '}
                        <a href="mailto:personvern@lyxso.no" className="text-blue-400 hover:text-blue-300 underline">
                          personvern@lyxso.no
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </section>
        </div>
      </div>
    </main>
  );
}
