import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Personvernerklæring | LYXso',
  description: 'Personvernerklæring for LYXso - ServiceOS for bilbransjen',
};

export default function PersonvernPage() {
  return (
    <main className="bg-slate-950 text-slate-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-6">Personvernerklæring</h1>
        
        <div className="text-slate-300 space-y-8">
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
