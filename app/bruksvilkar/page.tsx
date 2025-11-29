import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bruksvilkår | LYXso',
  description: 'Bruksvilkår for LYXso - ServiceOS for bilbransjen',
};

export default function BruksvilkarPage() {
  return (
    <main className="bg-slate-950 text-slate-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-6">Bruksvilkår</h1>
        
        <div className="text-slate-300 space-y-8">
          <section>
            <p className="text-sm text-slate-400 mb-8">
              Sist oppdatert: {new Date().toLocaleDateString('nb-NO')}
            </p>
            <p>
              Velkommen til LYXso. Ved å registrere deg, få tilgang til eller bruke LYXso-plattformen
              ("Tjenesten") aksepterer du å være bundet av disse bruksvilkårene. Les dem nøye.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">1. Definisjoner</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>"LYXso"</strong> eller <strong>"vi"</strong>: LYXso AS, organisasjonsnummer [ORG_NR]</li>
              <li><strong>"Tjenesten"</strong>: LYXso-plattformen inkludert alle moduler, funksjoner og integrasjoner</li>
              <li><strong>"Kunde"</strong> eller <strong>"du"</strong>: Bedriften eller personen som registrerer seg og bruker Tjenesten</li>
              <li><strong>"Sluttbruker"</strong>: Dine ansatte eller personer du gir tilgang til Tjenesten</li>
              <li><strong>"Kundedata"</strong>: All informasjon du laster opp, registrerer eller genererer i Tjenesten</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">2. Aksept av vilkår</h2>
            <p className="mb-4">
              Ved å bruke LYXso aksepterer du:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Å følge disse bruksvilkårene</li>
              <li>Vår <a href="/personvern" className="text-blue-400 hover:underline">personvernerklæring</a></li>
              <li>Vår <a href="/cookies" className="text-blue-400 hover:underline">cookie-policy</a></li>
              <li>At du er myndig (minimum 18 år) og har rett til å inngå bindende avtaler</li>
              <li>At du representerer en bedrift med lovlig rett til å drive virksomhet</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">3. Registrering og konto</h2>
            
            <h3 className="text-xl font-semibold text-slate-200 mb-3 mt-6">3.1 Kontoopprettelse</h3>
            <p className="mb-4">
              For å bruke LYXso må du opprette en konto. Du garanterer at:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>All informasjon du oppgir er korrekt og oppdatert</li>
              <li>Du vil holde informasjonen oppdatert</li>
              <li>Du er autorisert til å representere bedriften du registrerer</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-200 mb-3 mt-6">3.2 Kontosikkerhet</h3>
            <p className="mb-4">Du er ansvarlig for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Å holde påloggingsinformasjonen konfidensiell</li>
              <li>All aktivitet som skjer under din konto</li>
              <li>Å varsle oss umiddelbart ved mistenkt uautorisert bruk</li>
              <li>Å bruke sterke passord og aktivere to-faktor-autentisering når tilgjengelig</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">4. Abonnement og betaling</h2>
            
            <h3 className="text-xl font-semibold text-slate-200 mb-3 mt-6">4.1 Abonnementsplaner</h3>
            <p className="mb-4">
              LYXso tilbyr ulike abonnementsplaner (Start, Pro, Max) med forskjellige funksjoner og priser.
              Aktuelle priser finnes på vår nettside.
            </p>

            <h3 className="text-xl font-semibold text-slate-200 mb-3 mt-6">4.2 Betaling</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Betaling skjer månedlig eller årlig, avhengig av valgt plan</li>
              <li>Alle priser er oppgitt eksklusiv MVA (25%)</li>
              <li>Betaling trekkes automatisk på forfallsdato</li>
              <li>Ved manglende betaling forbeholder vi oss retten til å suspendere tilgangen</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-200 mb-3 mt-6">4.3 Oppgradering og nedgradering</h3>
            <p>
              Du kan når som helst oppgradere eller nedgradere din plan. Endringer trer i kraft ved neste
              faktureringsperiode. Ved oppgradering faktureres differansen umiddelbart.
            </p>

            <h3 className="text-xl font-semibold text-slate-200 mb-3 mt-6">4.4 Refusjon</h3>
            <p>
              Vi tilbyr 14 dagers tilfredsgaranti. Hvis du ikke er fornøyd, kan du be om full refusjon
              innen 14 dager etter første betaling. Etter dette gis ingen refusjon for allerede betalte perioder.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">5. Bruk av Tjenesten</h2>
            
            <h3 className="text-xl font-semibold text-slate-200 mb-3 mt-6">5.1 Tillatt bruk</h3>
            <p className="mb-4">Du kan bruke LYXso til:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Administrere booking og kunder for din bedrift</li>
              <li>Lagre kjøretøy- og behandlingsinformasjon</li>
              <li>Markedsføre dine tjenester</li>
              <li>Generere rapporter og analyser</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-200 mb-3 mt-6">5.2 Forbudt bruk</h3>
            <p className="mb-4">Du forplikter deg til IKKE å:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Bruke Tjenesten til ulovlige formål</li>
              <li>Forsøke å hacke, ødelegge eller forstyrre Tjenesten</li>
              <li>Laste opp skadelig kode, virus eller malware</li>
              <li>Kopiere, modifisere eller reverse-engineere Tjenesten</li>
              <li>Videresende eller videreselge Tjenesten uten skriftlig tillatelse</li>
              <li>Bruke Tjenesten på vegne av tredjeparter (med mindre avtalt)</li>
              <li>Lagre personsensitive data uten lovlig grunnlag</li>
              <li>Overbelaste systemet med automated requests eller scraping</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">6. Kundedata og eierskap</h2>
            
            <h3 className="text-xl font-semibold text-slate-200 mb-3 mt-6">6.1 Ditt eierskap</h3>
            <p>
              Du beholder alle rettigheter til Kundedata du laster opp eller genererer i LYXso.
              Vi hevder ingen eierskap eller rettigheter til ditt innhold.
            </p>

            <h3 className="text-xl font-semibold text-slate-200 mb-3 mt-6">6.2 Vårt eierskap</h3>
            <p>
              LYXso og all underliggende teknologi, design, kode og dokumentasjon eies av LYXso AS
              og er beskyttet av opphavsrett og immaterielle rettigheter.
            </p>

            <h3 className="text-xl font-semibold text-slate-200 mb-3 mt-6">6.3 Lisens til oss</h3>
            <p>
              Ved å bruke Tjenesten gir du oss en begrenset lisens til å:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Lagre og behandle Kundedata for å levere Tjenesten</li>
              <li>Bruke anonymiserte og aggregerte data til forbedring av Tjenesten</li>
              <li>Vise ditt firmanavn og logo som referansekunde (med ditt samtykke)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">7. Datatap og backup</h2>
            <p className="mb-4">
              Vi tar regelmessige sikkerhetskopier av alle data. Likevel:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Vi anbefaler at du tar egne backups av kritiske data</li>
              <li>Vi er ikke ansvarlige for datatap forårsaket av tredjepart, force majeure eller din egen bruk</li>
              <li>Ved stenging av konto slettes data etter 30 dager</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">8. Oppetid og tjenesteavbrudd</h2>
            <p className="mb-4">
              Vi streber etter høy oppetid (99%+), men kan ikke garantere at Tjenesten alltid er tilgjengelig.
              Tjenesten kan være utilgjengelig på grunn av:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Planlagt vedlikehold (varsles i forkant)</li>
              <li>Akutte sikkerhetshendelser</li>
              <li>Problemer hos underleverandører (Supabase, Vercel, etc.)</li>
              <li>Force majeure (naturkatastrofer, krig, etc.)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">9. Ansvarsbegrensning</h2>
            <p className="mb-4">
              LYXso leveres "som den er" uten garantier. I den grad loven tillater:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Vi er ikke ansvarlige for indirekte tap, tapte inntekter eller tapt data</li>
              <li>Vårt totale ansvar er begrenset til beløpet du har betalt siste 12 måneder</li>
              <li>Vi garanterer ikke at Tjenesten er feilfri eller oppfyller alle dine behov</li>
            </ul>
            <p className="mt-4">
              <strong>Viktig:</strong> Denne ansvarsbegrensningen gjelder ikke ved grove feil, forsett eller
              brudd på obligatoriske lovkrav.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">10. Oppsigelse</h2>
            
            <h3 className="text-xl font-semibold text-slate-200 mb-3 mt-6">10.1 Din oppsigelse</h3>
            <p>
              Du kan når som helst si opp abonnementet ditt. Oppsigelse skjer fra innstillinger i din
              konto eller ved å kontakte support. Oppgjør forfaller for inneværende periode.
            </p>

            <h3 className="text-xl font-semibold text-slate-200 mb-3 mt-6">10.2 Vår oppsigelse</h3>
            <p className="mb-4">
              Vi kan suspendere eller avslutte din konto hvis:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Du bryter disse vilkårene</li>
              <li>Betaling ikke mottas innen 30 dager etter forfall</li>
              <li>Vi må avslutte Tjenesten (minimum 90 dagers varsel)</li>
              <li>Din bruk truer sikkerheten eller stabiliteten til Tjenesten</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">11. Endringer i vilkårene</h2>
            <p>
              Vi kan oppdatere disse vilkårene fra tid til annen. Vesentlige endringer varsles via
              e-post minimum 30 dager før de trer i kraft. Fortsatt bruk etter ikrafttredelse
              innebærer aksept av nye vilkår.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">12. Tredjeparts-tjenester</h2>
            <p>
              LYXso integrerer med tredjeparts-tjenester (betalingsleverandører, regnskapssystemer, etc.).
              Din bruk av disse er underlagt deres egne vilkår. Vi er ikke ansvarlige for
              tredjepartstjenester eller deres feil.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">13. Lovvalg og tvisteløsning</h2>
            <p className="mb-4">
              Disse vilkårene er underlagt norsk lov. Eventuelle tvister skal løses ved norske domstoler,
              med Oslo tingrett som verneting.
            </p>
            <p>
              Vi oppfordrer til å kontakte oss først ved uenigheter, slik at vi kan forsøke å finne
              en løsning i minnelighet.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">14. Kontaktinformasjon</h2>
            <p>
              For spørsmål om disse bruksvilkårene, kontakt oss:
            </p>
            <p className="mt-4">
              <strong>LYXso AS</strong><br />
              Organisasjonsnummer: [ORG_NR]<br />
              E-post: <a href="mailto:kontakt@lyxso.no" className="text-blue-400 hover:underline">kontakt@lyxso.no</a><br />
              Adresse: [ADRESSE]
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
