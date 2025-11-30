import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie-policy | LYXso',
  description: 'Informasjonskapsler (cookies) hos LYXso',
};

export default function CookiesPage() {
  return (
    <main className="bg-slate-950 text-slate-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-6">Cookie-policy</h1>
        
        <div className="text-slate-300 space-y-8">
          <section>
            <p className="text-sm text-slate-400 mb-8">
              Sist oppdatert: {new Date().toLocaleDateString('nb-NO')}
            </p>
            <p>
              Denne cookie-policyen forklarer hva cookies er, hvordan LYXso bruker dem, og hvordan
              du kan administrere dine preferanser.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">1. Hva er cookies?</h2>
            <p>
              Cookies (informasjonskapsler) er små tekstfiler som lagres på din enhet (datamaskin,
              mobil, nettbrett) når du besøker en nettside. De brukes til å gjenkjenne deg ved senere
              besøk og forbedre din brukeropplevelse.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">2. Hvilke cookies bruker vi?</h2>
            
            <h3 className="text-xl font-semibold text-slate-200 mb-3 mt-6">2.1 Strengt nødvendige cookies</h3>
            <p className="mb-4">
              Disse cookiesene er nødvendige for at nettstedet skal fungere og kan ikke slås av.
            </p>
            <div className="bg-slate-900 p-4 rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-2">Cookie-navn</th>
                    <th className="text-left py-2">Formål</th>
                    <th className="text-left py-2">Varighet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr>
                    <td className="py-3 font-mono text-xs">sb-access-token</td>
                    <td className="py-3">Autentisering (Supabase)</td>
                    <td className="py-3">1 time</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-mono text-xs">sb-refresh-token</td>
                    <td className="py-3">Fornye pålogging</td>
                    <td className="py-3">30 dager</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-mono text-xs">__Secure-next-auth.session-token</td>
                    <td className="py-3">Sesjonshåndtering</td>
                    <td className="py-3">Sesjon</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold text-slate-200 mb-3 mt-6">2.2 Funksjonelle cookies</h3>
            <p className="mb-4">
              Disse cookiesene lar oss huske dine valg og preferanser.
            </p>
            <div className="bg-slate-900 p-4 rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-2">Cookie-navn</th>
                    <th className="text-left py-2">Formål</th>
                    <th className="text-left py-2">Varighet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr>
                    <td className="py-3 font-mono text-xs">lyxso_preferences</td>
                    <td className="py-3">Brukerpreferanser (tema, språk)</td>
                    <td className="py-3">1 år</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-mono text-xs">lyxso_cookie_consent</td>
                    <td className="py-3">Lagrer ditt samtykke</td>
                    <td className="py-3">1 år</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold text-slate-200 mb-3 mt-6">2.3 Ytelse og analyse-cookies (valgfri)</h3>
            <p className="mb-4">
              Disse cookiesene hjelper oss å forstå hvordan du bruker nettstedet, slik at vi kan forbedre det.
              <strong> Du kan velge å ikke godta disse.</strong>
            </p>
            <div className="bg-slate-900 p-4 rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-2">Leverandør</th>
                    <th className="text-left py-2">Formål</th>
                    <th className="text-left py-2">Varighet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr>
                    <td className="py-3">Google Analytics</td>
                    <td className="py-3">Bruksstatistikk og analyser</td>
                    <td className="py-3">2 år</td>
                  </tr>
                  <tr>
                    <td className="py-3">Plausible Analytics</td>
                    <td className="py-3">Personvernvennlig analyse (ingen persondata)</td>
                    <td className="py-3">Sesjon</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold text-slate-200 mb-3 mt-6">2.4 Markedsføring og sporing (valgfri)</h3>
            <p className="mb-4">
              Disse cookiesene brukes til å vise relevant markedsføring og måle effekten av kampanjer.
              <strong> Du kan velge å ikke godta disse.</strong>
            </p>
            <div className="bg-slate-900 p-4 rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-2">Leverandør</th>
                    <th className="text-left py-2">Formål</th>
                    <th className="text-left py-2">Varighet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr>
                    <td className="py-3">Meta Pixel</td>
                    <td className="py-3">Sporing av annonsekonverteringer</td>
                    <td className="py-3">90 dager</td>
                  </tr>
                  <tr>
                    <td className="py-3">Google Ads</td>
                    <td className="py-3">Remarketing og konverteringssporing</td>
                    <td className="py-3">90 dager</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">3. Hvorfor bruker vi cookies?</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Sikkerhet:</strong> Holde deg pålogget og beskytte kontoen din</li>
              <li><strong>Funksjonalitet:</strong> Huske dine preferanser og innstillinger</li>
              <li><strong>Ytelse:</strong> Forstå hvordan nettstedet brukes og forbedre hastighet</li>
              <li><strong>Analyse:</strong> Måle trafikk og bruksmønstre for å forbedre tjenesten</li>
              <li><strong>Markedsføring:</strong> Vise relevant innhold og måle kampanjeeffektivitet</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">4. Førstepartscookies vs. tredjepartscookies</h2>
            
            <h3 className="text-xl font-semibold text-slate-200 mb-3 mt-6">Førstepartscookies</h3>
            <p>
              Satt av LYXso.no direkte. Brukes til autentisering, preferanser og grunnleggende funksjonalitet.
            </p>

            <h3 className="text-xl font-semibold text-slate-200 mb-3 mt-6">Tredjepartscookies</h3>
            <p>
              Satt av eksterne tjenester (Google Analytics, Meta Pixel, etc.). Brukes til analyse og
              markedsføring. Du kan velge å blokkere disse uten at grunnleggende funksjonalitet påvirkes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">5. Hvordan administrere cookies</h2>
            
            <h3 className="text-xl font-semibold text-slate-200 mb-3 mt-6">5.1 Via cookie-banner</h3>
            <p>
              Første gang du besøker LYXso.no får du opp en cookie-banner hvor du kan:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Godta alle cookies</li>
              <li>Godta kun nødvendige cookies</li>
              <li>Tilpasse preferanser (velg hvilke kategorier du vil godta)</li>
            </ul>
            <p className="mt-4">
              Du kan når som helst endre dine preferanser via innstillinger i din konto eller ved å
              klikke på "Cookie-innstillinger" i footer.
            </p>

            <h3 className="text-xl font-semibold text-slate-200 mb-3 mt-6">5.2 Via nettleseren</h3>
            <p className="mb-4">
              De fleste nettlesere lar deg kontrollere cookies via innstillingene:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Chrome:</strong> Innstillinger → Personvern og sikkerhet → Cookies</li>
              <li><strong>Firefox:</strong> Innstillinger → Personvern og sikkerhet → Informasjonskapsler</li>
              <li><strong>Safari:</strong> Innstillinger → Personvern → Cookies</li>
              <li><strong>Edge:</strong> Innstillinger → Personvern → Cookies</li>
            </ul>
            <p className="mt-4">
              <strong>Merk:</strong> Hvis du blokkerer alle cookies, kan noen deler av LYXso slutte å fungere.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">6. Do Not Track (DNT)</h2>
            <p>
              LYXso respekterer Do Not Track-signaler. Hvis du har aktivert DNT i nettleseren din,
              vil vi ikke sette analyse- eller markedsføringscookies (kun strengt nødvendige cookies).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">7. Endringer i cookie-policy</h2>
            <p>
              Vi kan oppdatere denne cookie-policyen fra tid til annen. Siste oppdateringsdato vises
              øverst på siden. Ved vesentlige endringer vil du få beskjed via e-post eller banner på nettstedet.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">8. Kontakt oss</h2>
            <p>
              Har du spørsmål om vår bruk av cookies?
            </p>
            <p className="mt-4">
              <strong>E-post:</strong>{' '}
              <a href="mailto:personvern@lyxso.no" className="text-blue-400 hover:underline">
                personvern@lyxso.no
              </a><br />
              <strong>Les også:</strong>{' '}
              <a href="/personvern" className="text-blue-400 hover:underline">
                Personvernerklæring
              </a>{' '}
              |{' '}
              <a href="/bruksvilkar" className="text-blue-400 hover:underline">
                Bruksvilkår
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
