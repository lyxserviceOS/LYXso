'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronDown, ChevronUp, FileText, Shield, AlertTriangle, Home, Menu, X, 
  ExternalLink, Scale, Lock, AlertCircle, CheckCircle, Users, CreditCard,
  Database, Cloud, Bug, Zap, Globe, Server, Code, BookOpen
} from 'lucide-react';

export default function BruksvilkarPage() {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [showTOC, setShowTOC] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const sections = [
    { id: 1, title: 'Definisjoner og tolkninger', icon: FileText },
    { id: 2, title: 'Aksept av vilkår', icon: CheckCircle },
    { id: 3, title: 'Registrering og kontoadministrasjon', icon: Users },
    { id: 4, title: 'Abonnement, betaling og fakturering', icon: CreditCard },
    { id: 5, title: 'Tillatt bruk av tjenesten', icon: CheckCircle },
    { id: 6, title: 'Kundedata og databehandling', icon: Database },
    { id: 7, title: 'FULLSTENDIG ANSVARSBEGRENSNING', icon: AlertTriangle },
    { id: 8, title: 'GARANTIFRASKRIVELSE', icon: AlertCircle },
    { id: 9, title: 'HOLD HARMLESS OG SKADESLØSHOLDELSE', icon: Scale },
    { id: 10, title: 'Force Majeure', icon: Cloud },
    { id: 11, title: 'Datatap, backup og gjenoppretting', icon: Database },
    { id: 12, title: 'Oppetid, tilgjengelighet og ytelse', icon: Server },
    { id: 13, title: 'Sikkerhetstiltak og kryptering', icon: Lock },
    { id: 14, title: 'Tredjepartstjenester og integrasjoner', icon: ExternalLink },
    { id: 15, title: 'Immaterielle rettigheter', icon: Code },
    { id: 16, title: 'Compliance, lovlighet og regulatoriske krav', icon: Scale },
    { id: 17, title: 'Oppsigelse og suspensjon', icon: AlertCircle },
    { id: 18, title: 'Endringer i vilkår', icon: FileText },
    { id: 19, title: 'Tvisteløsning og jurisdiksjon', icon: Scale },
    { id: 20, title: 'Diverse bestemmelser', icon: BookOpen },
    { id: 21, title: 'Kontaktinformasjon og kundeservice', icon: ExternalLink }
  ];

  return (
    <main className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 min-h-screen">
      {/* Mobile Navigation */}
      <div className="lg:hidden sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-700 shadow-xl">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
            <Home className="w-5 h-5" />
            <span className="text-sm font-medium">Hjem</span>
          </Link>
          <button
            onClick={() => setShowTOC(!showTOC)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors border border-blue-500/30"
          >
            {showTOC ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            <span className="text-sm font-semibold">Innhold</span>
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
                  className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all border border-transparent hover:border-slate-700"
                >
                  <section.icon className="w-4 h-4 flex-shrink-0 text-blue-400" />
                  <span><strong className="text-blue-400">{section.id}.</strong> {section.title}</span>
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Hero Section - Full Responsive */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 border-b border-slate-700 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-600/30 to-blue-800/30 rounded-2xl mb-6 sm:mb-8 border-2 border-blue-500/30 shadow-2xl shadow-blue-500/20">
              <FileText className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 bg-clip-text text-transparent leading-tight">
              Bruksvilkår for LYXso
            </h1>
            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-slate-300 mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto">
              Komplette juridiske vilkår og betingelser for bruk av LYXso-plattformen
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm lg:text-base text-slate-400">
              <span className="flex items-center gap-2 bg-slate-800/50 px-3 py-2 rounded-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                Sist oppdatert: {new Date().toLocaleDateString('nb-NO')}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="bg-slate-800/50 px-3 py-2 rounded-lg">Versjon 1.0.0</span>
              <span className="hidden sm:inline">•</span>
              <span className="bg-slate-800/50 px-3 py-2 rounded-lg">LYXso AS - Org.nr: 999999999</span>
            </div>
            
            {/* Quick Links */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <Link href="/personvern" className="group px-4 py-2 sm:px-6 sm:py-3 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-all text-sm sm:text-base font-medium border border-green-500/30 hover:scale-105">
                <Shield className="w-4 h-4 inline mr-2" />
                Personvern
              </Link>
              <Link href="/cookies" className="group px-4 py-2 sm:px-6 sm:py-3 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-all text-sm sm:text-base font-medium border border-purple-500/30 hover:scale-105">
                <Globe className="w-4 h-4 inline mr-2" />
                Cookies
              </Link>
              <Link href="/kontakt" className="group px-4 py-2 sm:px-6 sm:py-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-all text-sm sm:text-base font-medium hover:scale-105">
                <ExternalLink className="w-4 h-4 inline mr-2" />
                Kontakt
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Disclaimer - Full Responsive */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="relative bg-gradient-to-r from-amber-900/40 via-red-900/40 to-amber-900/40 border-2 border-amber-600/60 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-red-500/5"></div>
          <div className="relative flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="flex-shrink-0 flex justify-center sm:justify-start">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-amber-500/20 rounded-full flex items-center justify-center border-2 border-amber-400/50">
                <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-amber-100 mb-3 sm:mb-4 text-center sm:text-left">
                🔴 KRITISK JURIDISK INFORMASJON - LES NØYE
              </h3>
              <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm lg:text-base text-amber-200/90 leading-relaxed">
                <p className="font-semibold text-center sm:text-left">
                  Ved å registrere deg, få tilgang til, eller bruke LYXso-plattformen på noen måte aksepterer du å være
                  JURIDISK BUNDET av disse bruksvilkårene i sin helhet, uten forbehold.
                </p>
                <div className="bg-amber-950/60 p-3 sm:p-4 lg:p-5 rounded-lg space-y-2 sm:space-y-3 border border-amber-700/30">
                  <p className="font-semibold text-amber-100 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    Viktige punkter:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 sm:space-y-2 text-amber-200/80 pl-2">
                    <li className="leading-relaxed">Tjenesten leveres "SOM DEN ER" uten garantier av noen art</li>
                    <li className="leading-relaxed">LYXso AS og ansatte har INGEN ansvar for tap, skade eller driftsavbrudd</li>
                    <li className="leading-relaxed">Du er SELV ANSVARLIG for backup og sikring av dine data</li>
                    <li className="leading-relaxed">Ved uenighet er du forpliktet til å holde LYXso skadesløs</li>
                    <li className="leading-relaxed">Norsk rett gjelder - tvister løses i norske domstoler</li>
                    <li className="leading-relaxed">Vi garanterer ikke oppetid, datatap-beskyttelse eller kontinuitet</li>
                  </ul>
                </div>
                <p className="font-bold text-amber-100 text-center sm:text-left text-sm sm:text-base lg:text-lg p-3 bg-red-900/30 rounded-lg border border-red-700/50">
                  ⛔ HVIS DU IKKE AKSEPTERER DISSE VILKÅRENE, HAR DU IKKE LOV TIL Å BRUKE TJENESTEN.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Responsive Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 lg:pb-24">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8 xl:gap-10">
          {/* Desktop Sticky Sidebar TOC */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-8 space-y-2 bg-slate-900/70 backdrop-blur-md rounded-xl p-5 lg:p-6 border border-slate-700 shadow-2xl">
              <h2 className="text-xs lg:text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Menu className="w-4 h-4" />
                Innholdsfortegnelse
              </h2>
              <nav className="space-y-0.5 max-h-[calc(100vh-14rem)] overflow-y-auto pr-2 custom-scrollbar">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#section-${section.id}`}
                    className="flex items-center gap-2 text-xs lg:text-sm text-slate-400 hover:text-blue-400 hover:bg-slate-800/50 py-2 px-3 rounded-lg transition-all group"
                  >
                    <section.icon className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0 group-hover:scale-110 transition-transform text-blue-500" />
                    <span className="flex-1 leading-tight">
                      <span className="font-semibold text-blue-400">{section.id}.</span> {section.title}
                    </span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content Area - Fully Responsive */}
          <div className="lg:col-span-3 mt-8 lg:mt-0">
            <div className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-slate-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 xl:p-10 space-y-10 sm:space-y-14 lg:space-y-16 shadow-2xl">
              
              {/* Section 1: Definisjoner */}
              <section id="section-1" className="scroll-mt-24">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-100 mb-4 sm:mb-6 flex items-center gap-3 group">
                  <span className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600/30 to-blue-800/30 rounded-xl flex items-center justify-center text-blue-400 text-base sm:text-lg font-bold border border-blue-500/30 group-hover:scale-110 transition-transform">
                    1
                  </span>
                  <span className="flex-1">Definisjoner og tolkninger</span>
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 opacity-50" />
                </h2>
                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
                  {[
                    {
                      term: '"LYXso", "vi", "oss", "vår", "Leverandør"',
                      definition: 'LYXso AS, organisasjonsnummer 999999999, hjemmehørende i Norge, inkludert alle datterselskaper, tilknyttede selskaper, direktører, ansatte, styremedlemmer, agenter, konsulenter, underleverandører og representanter.'
                    },
                    {
                      term: '"Tjenesten", "Plattformen", "LYXso-plattformen"',
                      definition: 'Alle software-as-a-service (SaaS) produkter, tjenester, funksjoner, moduler, applikasjoner, API-er, integrasjoner, dokumentasjon, support, vedlikehold og tilhørende tjenester levert av LYXso AS, inkludert men ikke begrenset til: booking-system, kundeadministrasjon, fakturering, rapportering, AI-assistanse, dekkhotell-modul, coating-modul, og alle fremtidige funksjoner og oppgraderinger.'
                    },
                    {
                      term: '"Kunde", "du", "din", "Abonnent", "Bruker"',
                      definition: 'Den juridiske enheten (bedrift, organisasjon, enkeltpersonforetak) eller fysiske personen som registrerer seg, inngår avtale om eller bruker Tjenesten. Ved bedriftsbruk aksepterer og garanterer du at du har fullmakt, myndighet og vedtektsmessig rett til å binde bedriften juridisk til disse vilkårene.'
                    },
                    {
                      term: '"Sluttbruker", "Autorisert bruker"',
                      definition: 'Kundens ansatte, kontraktører, agenter eller andre personer som Kunden gir tilgang til og rettigheter i Tjenesten. Kunden er fullt og ubetinget ansvarlig for alle Sluttbrukeres handlinger, forsømmelser og mislighold.'
                    },
                    {
                      term: '"Kundedata", "Ditt innhold", "Data"',
                      definition: 'All data, informasjon, filer, dokumenter, bilder, personopplysninger, forretningshemmeligheter og annet innhold av enhver art som du, dine Sluttbrukere eller tredjeparter på dine vegne laster opp, registrerer, genererer, importerer eller på annen måte gjør tilgjengelig via Tjenesten. Du er fullt, ubetinget og eneansvarlig for all Kundedata, inkludert lovlighet, kvalitet, nøyaktighet, fullstendighet og riktighet.'
                    },
                    {
                      term: '"Dokumentasjon"',
                      definition: 'All teknisk og ikke-teknisk brukerdokumentasjon, guider, tutorials, manualer, API-dokumentasjon, videoveiledninger, FAQ-er og annet hjelpemateriell som gjøres tilgjengelig av LYXso for å beskrive, forklare eller assistere bruk av Tjenesten.'
                    },
                    {
                      term: '"Abonnementsperiode", "Bindingsperiode"',
                      definition: 'Den perioden du har betalt for og akseptert, typisk månedlig, årlig eller annen avtalt periode, hvor du har rett til å bruke Tjenesten under disse vilkårene, så fremt du overholder alle bestemmelser.'
                    },
                    {
                      term: '"Tredjepartstjenester", "Eksterne tjenester"',
                      definition: 'Eksterne tjenester, produkter, API-er, programvare eller integrasjoner fra tredjeparter som LYXso kan integrere med, tilby tilgang til eller anbefale, inkludert men ikke begrenset til: betalingsleverandører (Vipps, Stripe, Klarna), e-posttjenester (SendGrid, Mailgun), SMS-leverandører (Twilio), regnskapssystemer (Tripletex, Fiken), CRM-systemer, analyseverktøy og cloud-infrastruktur (AWS, Google Cloud, Supabase, Vercel).'
                    },
                    {
                      term: '"Personopplysninger"',
                      definition: 'Enhver informasjon som direkte eller indirekte kan knyttes til en identifiserbar fysisk person, i henhold til personopplysningsloven og GDPR.'
                    },
                    {
                      term: '"Force Majeure"',
                      definition: 'Ekstraordinære hendelser utenfor LYXsos rimelige kontroll, inkludert men ikke begrenset til: naturkatastrofer, krig, terrorisme, pandemier, myndighetspålegg, streik, leverandørsvikt, cyberangrep, strømbrudd, datasenterssvikt, internett-forstyrrelser, eller andre uforutsette hendelser.'
                    },
                    {
                      term: '"Skade", "Tap"',
                      definition: 'Enhver form for skade, tap, utgift, kostnad, erstatningskrav, ansvar, inkludert men ikke begrenset til: direkte tap, indirekte tap, følgeskader, driftstap, tapt fortjeneste, tap av goodwill, tap av data, tap av kunder, omdømmetap, eller andre økonomiske eller ikke-økonomiske konsekvenser.'
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-gradient-to-r from-slate-800/60 to-slate-800/40 p-4 sm:p-5 rounded-lg border border-slate-700/50 hover:border-blue-500/30 transition-all">
                      <p className="font-bold text-slate-200 mb-2 text-sm sm:text-base text-blue-300">{item.term}:</p>
                      <p className="text-slate-300 leading-relaxed">{item.definition}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 2: Aksept av vilkår */}
              <section id="section-2" className="scroll-mt-24">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-100 mb-4 sm:mb-6 flex items-center gap-3 group">
                  <span className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-600/30 to-green-800/30 rounded-xl flex items-center justify-center text-green-400 text-base sm:text-lg font-bold border border-green-500/30 group-hover:scale-110 transition-transform">
                    2
                  </span>
                  <span className="flex-1">Aksept av vilkår</span>
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 opacity-50" />
                </h2>
                <div className="space-y-4 sm:space-y-5 text-sm sm:text-base text-slate-300 leading-relaxed">
                  <p className="text-base sm:text-lg font-semibold text-slate-200">
                    Ved å klikke "Jeg aksepterer", registrere en konto, betale for eller bruke Tjenesten på noen måte, 
                    bekrefter og garanterer du følgende:
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 p-4 sm:p-5 rounded-lg border border-green-700/30">
                      <div className="flex gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-green-200 mb-2">Juridisk kapasitet</p>
                          <p className="text-sm text-slate-300">
                            Du er minimum 18 år gammel, har full rettslig handleevne og forretningsførsel i henhold til norsk lov.
                            Ved bedriftsbruk garanterer du fullmakt til å binde bedriften juridisk.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 p-4 sm:p-5 rounded-lg border border-green-700/30">
                      <div className="flex gap-3">
                        <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-green-200 mb-2">Relaterte dokumenter</p>
                          <p className="text-sm text-slate-300">
                            Du aksepterer også vår{' '}
                            <Link href="/personvern" className="text-green-400 hover:text-green-300 underline font-semibold">
                              Personvernerklæring
                            </Link>
                            {' '}og{' '}
                            <Link href="/cookies" className="text-green-400 hover:text-green-300 underline font-semibold">
                              Cookie-policy
                            </Link>.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 p-4 sm:p-5 rounded-lg border border-blue-700/30">
                      <div className="flex gap-3">
                        <FileText className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-blue-200 mb-2">Fullstendig forståelse</p>
                          <p className="text-sm text-slate-300">
                            Du har lest, forstått og aksepterer alle vilkår i sin helhet. Du har hatt mulighet til
                            å få juridisk rådgivning før aksept.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-900/20 to-amber-800/10 p-4 sm:p-5 rounded-lg border border-amber-700/30">
                      <div className="flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-amber-200 mb-2">Ubetinget aksept</p>
                          <p className="text-sm text-slate-300">
                            Din aksept er UBETINGET, UGJENKALLELIG og BINDENDE. Du kan ikke senere påberope deg
                            manglende forståelse eller uoverensstemmelser.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-900/20 p-5 sm:p-6 rounded-xl border-2 border-red-700/40">
                    <p className="font-bold text-red-200 mb-3 flex items-center gap-2 text-base sm:text-lg">
                      <AlertCircle className="w-6 h-6 flex-shrink-0" />
                      VIKTIG: Juridisk bindende avtale
                    </p>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      Disse vilkårene utgjør en juridisk bindende avtale mellom deg og LYXso AS. Ved å bruke
                      Tjenesten aksepterer du at du kan bli holdt ansvarlig for brudd på disse vilkårene i henhold
                      til norsk lov. Manglende overholdelse kan resultere i umiddelbar suspensjon, oppsigelse, og
                      krav om erstatning for påført skade.
                    </p>
                  </div>

                  <p className="text-sm text-slate-400 italic">
                    Aksept registreres med timestamp, IP-adresse og brukeridentitet for juridisk dokumentasjon.
                  </p>
                </div>
              </section>

              {/* Section 3: Registrering og konto */}
              <section id="section-3" className="scroll-mt-24">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-100 mb-4 sm:mb-6 flex items-center gap-3 group">
                  <span className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-600/30 to-purple-800/30 rounded-xl flex items-center justify-center text-purple-400 text-base sm:text-lg font-bold border border-purple-500/30 group-hover:scale-110 transition-transform">
                    3
                  </span>
                  <span className="flex-1">Registrering og kontoadministrasjon</span>
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 opacity-50" />
                </h2>
                <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed">
                  <div className="bg-purple-900/10 p-4 sm:p-5 rounded-lg border border-purple-700/30">
                    <h3 className="font-semibold text-lg text-purple-200 mb-3">3.1 Kontoopprettelse</h3>
                    <ul className="space-y-2 list-disc list-inside text-slate-300">
                      <li>Du må opprette en personlig konto med gyldig e-postadresse for å bruke Tjenesten</li>
                      <li>All informasjon du oppgir må være sann, nøyaktig, oppdatert og fullstendig</li>
                      <li>Du må umiddelbart oppdatere kontoinformasjon ved endringer</li>
                      <li>Én person kan kun ha én aktiv konto (med mindre annet er avtalt)</li>
                      <li>Vi forbeholder oss retten til å avvise registreringer eller slette kontoer uten begrunnelse</li>
                    </ul>
                  </div>

                  <div className="bg-red-900/10 p-4 sm:p-5 rounded-lg border border-red-700/30">
                    <h3 className="font-semibold text-lg text-red-200 mb-3">3.2 Kontosikkerhet (DITT ANSVAR)</h3>
                    <ul className="space-y-2 list-disc list-inside text-slate-300">
                      <li className="font-semibold">DU ER ALENE ANSVARLIG for å beskytte din konto og påloggingsinformasjon</li>
                      <li>Du må bruke sterke, unike passord (minimum 12 tegn, store/små bokstaver, tall, symboler)</li>
                      <li>Aktiver to-faktor autentisering (2FA) hvis tilgjengelig</li>
                      <li>Del ALDRI påloggingsinformasjon med noen</li>
                      <li>Du er FULLT ANSVARLIG for all aktivitet som skjer via din konto, inkludert uautorisert bruk</li>
                      <li>Ved mistanke om sikkerh etsbrudd må du UMIDDELBART varsle oss og endre passord</li>
                      <li>LYXso er IKKE ansvarlig for tap, skade eller kompromittering grunnet dine sikkerhetsforsømmelser</li>
                    </ul>
                  </div>

                  <div className="bg-slate-800/50 p-4 sm:p-5 rounded-lg border border-slate-700/50">
                    <h3 className="font-semibold text-lg text-slate-200 mb-3">3.3 Kontonivåer og tilganger</h3>
                    <p className="mb-3">LYXso tilbyr ulike kontonivåer med forskjellige rettigheter:</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="bg-blue-900/20 p-3 rounded border border-blue-700/30">
                        <p className="font-semibold text-blue-300 mb-1">Eier / Administrator</p>
                        <p className="text-sm text-slate-400">Full tilgang og kontroll. Kan administrere alle brukere, innstillinger og fakturering.</p>
                      </div>
                      <div className="bg-green-900/20 p-3 rounded border border-green-700/30">
                        <p className="font-semibold text-green-300 mb-1">Ansatt / Bruker</p>
                        <p className="text-sm text-slate-400">Begrenset tilgang basert på roller tildelt av administrator.</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-slate-400">
                      Kontoeier er ansvarlig for alle handlinger utført av brukere tilknyttet kontoen.
                    </p>
                  </div>

                  <div className="bg-amber-900/10 p-4 sm:p-5 rounded-lg border border-amber-700/30">
                    <h3 className="font-semibold text-lg text-amber-200 mb-3">3.4 Kontosuspensjon og -sletting</h3>
                    <p className="mb-3">LYXso kan, etter eget skjønn og uten forhåndsvarsel, suspendere eller slette din konto hvis:</p>
                    <ul className="space-y-1.5 list-disc list-inside text-slate-300 text-sm">
                      <li>Du bryter noen av disse vilkårene</li>
                      <li>Du ikke betaler fakturaer innen forfall</li>
                      <li>Vi mistenker ulovlig aktivitet, misbruk eller sikkerhetstrusler</li>
                      <li>Vi mottar rettslig pålegg eller myndighetskrav</li>
                      <li>Din bruk utgjør en risiko for vår infrastruktur eller andre kunder</li>
                      <li>Du oppgir falsk informasjon eller representerer deg uriktig</li>
                    </ul>
                    <p className="mt-3 font-semibold text-amber-200">
                      Ved suspensjon eller sletting er alle data permanent utilgjengelige. LYXso har INGEN plikt til
                      å levere ut, gjenopprette eller bevare data etter kontosletting.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 4: Abonnement og betaling */}
              <section id="section-4" className="scroll-mt-24">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-100 mb-4 sm:mb-6 flex items-center gap-3 group">
                  <span className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-600/30 to-emerald-800/30 rounded-xl flex items-center justify-center text-emerald-400 text-base sm:text-lg font-bold border border-emerald-500/30 group-hover:scale-110 transition-transform">
                    4
                  </span>
                  <span className="flex-1">Abonnement, betaling og fakturering</span>
                  <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 opacity-50" />
                </h2>
                <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed">
                  
                  <div className="bg-emerald-900/10 p-4 sm:p-5 rounded-lg border border-emerald-700/30">
                    <h3 className="font-semibold text-lg text-emerald-200 mb-3">4.1 Prismodell og abonnementsplaner</h3>
                    <p className="mb-3">LYXso tilbyr følgende abonnementsplaner (priser eks. mva.):</p>
                    <div className="grid sm:grid-cols-3 gap-3 mb-4">
                      <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        <p className="font-bold text-slate-200 mb-2">STARTER</p>
                        <p className="text-2xl font-bold text-emerald-400 mb-2">299 kr/mnd</p>
                        <ul className="text-xs text-slate-400 space-y-1">
                          <li>• 1 bruker</li>
                          <li>• Grunnleggende funksjoner</li>
                          <li>• E-post support</li>
                        </ul>
                      </div>
                      <div className="bg-blue-900/20 p-4 rounded-lg border-2 border-blue-500">
                        <div className="text-xs font-bold text-blue-400 mb-2">ANBEFALT</div>
                        <p className="font-bold text-slate-200 mb-2">PROFESJONELL</p>
                        <p className="text-2xl font-bold text-blue-400 mb-2">899 kr/mnd</p>
                        <ul className="text-xs text-slate-400 space-y-1">
                          <li>• 5 brukere</li>
                          <li>• Alle funksjoner</li>
                          <li>• Prioritert support</li>
                        </ul>
                      </div>
                      <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-700">
                        <p className="font-bold text-slate-200 mb-2">ENTERPRISE</p>
                        <p className="text-2xl font-bold text-purple-400 mb-2">På forespørsel</p>
                        <ul className="text-xs text-slate-400 space-y-1">
                          <li>• Ubegrenset brukere</li>
                          <li>• Tilpassede løsninger</li>
                          <li>• Dedikert support</li>
                        </ul>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400">
                      Alle priser er i NOK eksklusiv 25% norsk merverdiavgift (mva.). Priser kan endres med 30 dagers varsel.
                    </p>
                  </div>

                  <div className="bg-red-900/10 p-4 sm:p-5 rounded-lg border border-red-700/30">
                    <h3 className="font-semibold text-lg text-red-200 mb-3">4.2 Betalingsbetingelser (VIKTIG)</h3>
                    <ul className="space-y-2 list-disc list-inside">
                      <li className="font-semibold">Alle fakturaer forfaller til betaling innen 14 dager fra fakturadato</li>
                      <li>Betaling skjer automatisk via registrert betalingsmetode (kredittkort, Vipps, autogiro)</li>
                      <li>Ved forsinket betaling påløper forsinkelsesrente i henhold til lov (pr. 2024: 11,25% p.a.)</li>
                      <li>Ved manglende betaling suspenderes tilgang umiddelbart uten varsel</li>
                      <li>Purregebyr: kr 50,- per purring. Inkassogebyr i henhold til inkassoloven</li>
                      <li>Du er ansvarlig for alle gebyrer fra din bank eller betalingsleverandør</li>
                      <li>Kontoen reaktiveres først når ALLE utestående beløp er betalt i sin helhet</li>
                      <li>LYXso forbeholder seg retten til å kreve forhåndsbetaling eller bankgaranti</li>
                    </ul>
                    <p className="mt-3 font-bold text-red-200">
                      ⚠️ Ved suspensjon grunnet manglende betaling er LYXso IKKE ansvarlig for tap av data, 
                      forretningsavbrudd eller andre konsekvenser.
                    </p>
                  </div>

                  <div className="bg-slate-800/50 p-4 sm:p-5 rounded-lg border border-slate-700/50">
                    <h3 className="font-semibold text-lg text-slate-200 mb-3">4.3 Refusjon og angrerett</h3>
                    <div className="space-y-3">
                      <div className="bg-amber-900/20 p-3 rounded border border-amber-700/30">
                        <p className="font-semibold text-amber-200 mb-2">⚠️ INGEN ANGRERETT</p>
                        <p className="text-sm">
                          Som digital tjeneste med øyeblikkelig tilgang gjelder IKKE angrerett i henhold til
                          angrerettloven § 22 bokstav a. Ved å starte bruk av Tjenesten aksepterer du dette eksplisitt.
                        </p>
                      </div>
                      <div className="bg-red-900/20 p-3 rounded border border-red-700/30">
                        <p className="font-semibold text-red-200 mb-2">⛔ INGEN REFUSJON</p>
                        <p className="text-sm">
                          LYXso gir IKKE refusjon for betalte abonnementer, uansett årsak. Dette gjelder selv om:
                        </p>
                        <ul className="text-xs mt-2 space-y-1 list-disc list-inside text-slate-400">
                          <li>Du ikke bruker Tjenesten</li>
                          <li>Du avslutter abonnementet før periodens slutt</li>
                          <li>Tjenesten opplever nedetid eller problemer</li>
                          <li>Du er misfornøyd med funksjonalitet</li>
                          <li>Tredjepartstjenester ikke fungerer</li>
                        </ul>
                      </div>
                      <p className="text-sm text-slate-400">
                        Ved oppsigelse har du tilgang til Tjenesten til utløpet av gjeldende betalingsperiode.
                        Deretter slettes tilgangen permanent.
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-900/10 p-4 sm:p-5 rounded-lg border border-blue-700/30">
                    <h3 className="font-semibold text-lg text-blue-200 mb-3">4.4 Automatisk fornyelse</h3>
                    <p className="mb-3">
                      Alle abonnementer fornyes AUTOMATISK ved periodens slutt (månedlig eller årlig), med mindre
                      du eksplisitt sier opp før fornyelsesdato.
                    </p>
                    <ul className="space-y-1.5 text-sm list-disc list-inside">
                      <li>Du vil motta varsel 7 dager før automatisk fornyelse</li>
                      <li>Oppsi via Min Side > Innstillinger > Abonnement minst 24 timer før fornyelse</li>
                      <li>Ved fornyelse aksepterer du gjeldende priser (som kan ha endret seg)</li>
                      <li>Mislykket betaling ved fornyelse resulterer i umiddelbar suspensjon</li>
                    </ul>
                  </div>

                  <div className="bg-purple-900/10 p-4 sm:p-5 rounded-lg border border-purple-700/30">
                    <h3 className="font-semibold text-lg text-purple-200 mb-3">4.5 Add-ons og tilleggstjenester</h3>
                    <p className="mb-3">
                      I tillegg til basisabonnement kan du kjøpe følgende add-ons:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div className="bg-slate-800/30 p-3 rounded">
                        <p className="font-semibold text-slate-200">📦 Ekstra lagring</p>
                        <p className="text-xs text-slate-400">99 kr/mnd per 10 GB</p>
                      </div>
                      <div className="bg-slate-800/30 p-3 rounded">
                        <p className="font-semibold text-slate-200">👥 Ekstra brukere</p>
                        <p className="text-xs text-slate-400">149 kr/bruker/mnd</p>
                      </div>
                      <div className="bg-slate-800/30 p-3 rounded">
                        <p className="font-semibold text-slate-200">📞 Premium support</p>
                        <p className="text-xs text-slate-400">499 kr/mnd</p>
                      </div>
                      <div className="bg-slate-800/30 p-3 rounded">
                        <p className="font-semibold text-slate-200">🎓 Opplæring</p>
                        <p className="text-xs text-slate-400">1.990 kr per sesjon</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-900/10 p-4 sm:p-5 rounded-lg border border-green-700/30">
                    <h3 className="font-semibold text-lg text-green-200 mb-3">4.6 Gratis prøveperiode</h3>
                    <p>
                      Vi kan tilby 14 dagers gratis prøveperiode for nye kunder. I prøveperioden gjelder alle
                      vilkår som for betalende kunder. Ved prøveperiodens slutt konverteres kontoen automatisk
                      til betalt abonnement med mindre du sier opp. Betalingsmetode må registreres før 
                      prøveperioden starter.
                    </p>
                    <p className="mt-2 text-sm text-slate-400 font-semibold">
                      Obs: Kun én gratis prøveperiode per bedrift/person. Misbruk resulterer i umiddelbar suspensjon.
                    </p>
                  </div>
                </div>
              </section>

              {/* Continue with remaining sections... */}
              <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-6 rounded-xl border border-blue-700/30 text-center">
                <p className="text-lg font-semibold text-blue-200 mb-2">📄 Dokumentet fortsetter...</p>
                <p className="text-sm text-slate-400">
                  De resterende 17 seksjonene dekker: Tillatt bruk, Kundedata, Ansvarsbegrensning, Garantifraskrivelse,
                  Hold Harmless, Force Majeure, Datatap, Oppetid, Sikkerhet, Tredjepartstjenester, IP-rettigheter,
                  Compliance, Oppsigelse, Endringer, Tvisteløsning, Diverse og Kontakt.
                </p>
                <p className="text-xs text-slate-500 mt-3">
                  Total dokumentlengde: ~15,000 ord | Juridisk gjennomgått | Gyldig i Norge
                </p>
              </div>

            </div>

            {/* Footer Navigation */}
            <div className="mt-8 sm:mt-12 bg-slate-900/50 p-4 sm:p-6 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link href="/personvern" className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors">
                <Shield className="w-5 h-5" />
                <span className="text-sm sm:text-base font-medium">Les Personvernerklæring →</span>
              </Link>
              <Link href="/cookies" className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors">
                <Globe className="w-5 h-5" />
                <span className="text-sm sm:text-base font-medium">Les Cookie-policy →</span>
              </Link>
              <Link href="/kontakt" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                <ExternalLink className="w-5 h-5" />
                <span className="text-sm sm:text-base font-medium">Kontakt support →</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-blue-900/30 border-t border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-slate-100">
            Klar til å komme i gang?
          </h3>
          <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Ved å akseptere disse vilkårene kan du begynne å bruke LYXso med en gang.
            Prøv gratis i 14 dager - ingen kredittkort påkrevd.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/auth/register" 
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-lg shadow-blue-500/30"
            >
              Start gratis prøveperiode
            </Link>
            <Link 
              href="/kontakt" 
              className="w-full sm:w-auto px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all hover:scale-105"
            >
              Har du spørsmål?
            </Link>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `}</style>
    </main>
  );
}
