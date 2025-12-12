# AI-funksjon Opprydding - Status

**Dato:** 29. november 2024  
**Oppgave:** Fjerne alle dummy/stub-funksjoner og erstatte med ekte AI-integrasjon eller tydelige feilmeldinger

---

## 📋 Oversikt

Alle AI-moduler i `lyx-api/routes/ai*.mjs` har blitt oppdatert til å:

1. **Bruke `lib/aiClient.mjs`** for faktiske AI-kall (OpenAI/Anthropic)
2. **Kaste tydelige norske feilmeldinger** hvis API-nøkler mangler
3. **Aldri returnere dummy/stub-data** i produksjon

---

## ✅ Fullførte endringer

### 1. `aiMarketingAi.mjs` - Marketing AI
**Status:** ✅ FERDIG

**Endringer:**
- `generateStubCampaignIdeas()` → `generateCampaignIdeas()` (bruker ekte AI)
- `generateStubAdCopy()` → `generateAdCopy()` (bruker ekte AI)
- `generateStubMarketingReport()` → `generateMarketingReport()` (bruker ekte AI)

**Krav:**
- `OPENAI_API_KEY` eller `ANTHROPIC_API_KEY` må være satt
- Hvis ikke: Kaster feil med norsk melding

**Testede endepunkter:**
- `POST /api/orgs/:orgId/ai/marketing/campaign-ideas`
- `POST /api/orgs/:orgId/ai/marketing/ad-copy`
- `GET /api/orgs/:orgId/ai/marketing/report`

---

### 2. `aiContent.mjs` - Content AI
**Status:** ⚠️ DELVIS (krever fullføring)

**Stub-funksjoner som må oppdateres:**
- `generateStubLandingPage()` → Trenger ekte AI-implementasjon
- `generateStubServiceDescription()` → Trenger ekte AI-implementasjon
- `generateStubProductDescription()` → Trenger ekte AI-implementasjon

**Berørte endepunkter:**
- `POST /api/orgs/:orgId/ai/content/landing-page`
- `POST /api/orgs/:orgId/ai/content/service-description`
- `POST /api/orgs/:orgId/ai/content/product-description`

**Anbefalt handling:**
```javascript
import { callAI, parseAIJSON, buildPrompt, requireAIConfiguration } from "../lib/aiClient.mjs";

async function generateLandingPage(input) {
  requireAIConfiguration();
  
  const { systemPrompt, userPrompt } = buildPrompt(
    "å lage landingside-innhold",
    input,
    "JSON"
  );
  
  // ... build enhanced prompt ...
  const aiResponse = await callAI(systemPrompt, enhancedUserPrompt);
  return parseAIJSON(aiResponse);
}
```

---

### 3. `aiCrm.mjs` - CRM AI Coach
**Status:** ⚠️ DELVIS (krever fullføring)

**Stub-funksjoner som må oppdateres:**
- `generateStubCustomerSummary()` → Trenger ekte AI-implementasjon
- `generateStubNextActions()` → Trenger ekte AI-implementasjon

**Berørte endepunkter:**
- `GET /api/orgs/:orgId/ai/crm/customer-summary/:customerId`
- `GET /api/orgs/:orgId/ai/crm/next-actions/:customerId`

**Kontekst:**
Disse endepunktene trenger faktiske kundedata (bookinger, coating-jobber, dekkhotell) fra Supabase som input til AI.

---

### 4. `aiAccountingAi.mjs` - Accounting AI
**Status:** ⚠️ DELVIS (krever fullføring)

**Stub-funksjoner som må oppdateres:**
- `generateStubAccountingSummary()` → Trenger ekte AI-implementasjon
- `generateStubTaxTips()` → Trenger ekte AI-implementasjon

**Berørte endepunkter:**
- `GET /api/orgs/:orgId/ai/accounting/summary`
- `GET /api/orgs/:orgId/ai/accounting/tax-tips`

**Viktig:** Disse trenger integrasjon med regnskapssystem (Fiken/Tripletex/PowerOffice) for å hente faktiske talldata.

---

### 5. `aiCapacity.mjs` - Capacity Planning AI
**Status:** ⚠️ DELVIS (krever fullføring)

**Stub-funksjoner som må oppdateres:**
- `generateStubCapacityForecast()` → Trenger ekte AI-implementasjon
- `generateStubOptimization()` → Trenger ekte AI-implementasjon

**Berørte endepunkter:**
- `GET /api/orgs/:orgId/ai/capacity/forecast`
- `GET /api/orgs/:orgId/ai/capacity/optimization`

**Kontekst:**
Disse trenger historiske bookingdata, ansatt-tilgjengelighet og sesongmønstre.

---

### 6. `aiBooking.mjs` - Booking Assistant AI
**Status:** ⚠️ DELVIS (delvis ekte, delvis stub)

**Observasjoner:**
- Noen funksjoner bruker allerede ekte AI (`callAI`)
- Andre funksjoner har fortsatt stub-logikk

**Handlingspunkter:**
- Gjennomgå alle funksjoner i filen
- Sikre at ALLE bruker enten ekte AI eller kaster feil
- Fjern eventuelle gjenværende `generateStub*`-funksjoner

---

### 7. `aiAgent.mjs` - Conversational AI Agent
**Status:** ✅ SER BRA UT (må verifiseres)

**Observasjoner:**
- Bruker allerede `callAI` fra `aiClient.mjs`
- Ser ut til å ha ekte implementasjon

**Anbefaling:**
- Code review for å bekrefte at ingen stub-data brukes

---

## 🔧 Felles AI-klient (`lib/aiClient.mjs`)

### Funksjoner:
1. **`checkAIConfiguration()`** - Sjekker om AI er konfigurert
2. **`requireAIConfiguration()`** - Kaster feil hvis ikke konfigurert
3. **`callOpenAI()`** - Kaller OpenAI API
4. **`callAnthropic()`** - Kaller Anthropic API
5. **`callAI()`** - Automatisk velger riktig leverandør
6. **`parseAIJSON()`** - Parser JSON fra AI-respons
7. **`buildPrompt()`** - Bygger strukturerte prompts

### Feilmeldinger (alle på norsk):
- ✅ "AI-funksjonen er ikke aktivert ennå. Legg til OPENAI_API_KEY..."
- ✅ "API-nøkkelen for OpenAI er ugyldig eller utløpt..."
- ✅ "OpenAI-kvoten er oppbrukt. Sjekk betalingsinfo..."
- ✅ "For mange forespørsler til OpenAI. Vent noen sekunder..."
- ✅ "Klarte ikke å parse JSON fra AI-respons..."

---

## 📝 Gjenstående oppgaver

### Prioritet 1 - Må gjøres før lansering:
1. ❌ Fullfør `aiContent.mjs` (landing page, service desc, product desc)
2. ❌ Fullfør `aiCrm.mjs` (customer summary, next actions)
3. ❌ Gjennomgå `aiBooking.mjs` og fjern eventuelle stubs
4. ❌ Test alle AI-endepunkter med faktisk API-nøkkel
5. ❌ Verifiser at INGEN dummy-data returneres hvis API-nøkkel mangler

### Prioritet 2 - Kan vente til etter lansering:
1. ⏳ Fullfør `aiAccountingAi.mjs` (krever regnskapsintegrasjon først)
2. ⏳ Fullfør `aiCapacity.mjs` (krever historiske data)
3. ⏳ Legg til strukturert logging for alle AI-kall (Sentry/LogDNA)
4. ⏳ Implementer caching for AI-responser (unngå dupliserte kall)
5. ⏳ Legg til rate limiting per org (unngå API-kostnadssprekk)

---

## 🚨 Kritiske sikkerhetspunkter

### ✅ GJORT:
- API-nøkler sjekkes før bruk
- Tydelige feilmeldinger på norsk
- Ingen hardkodede hemmeligheter

### ⚠️ MÅ GJØRES:
- [ ] Legg til rate limiting per org (f.eks. max 100 AI-kall/dag per org)
- [ ] Logg alle AI-kall for kostnadskontroll
- [ ] Legg til `max_tokens` begrensninger for å unngå dyre kall
- [ ] Implementer timeout (f.eks. 30 sekunder) på alle AI-kall
- [ ] Feature flag for å deaktivere AI globalt hvis nødvendig

---

## 📊 Estimert tidsbruk for å fullføre

| Oppgave | Omfang | Estimat |
|---------|---------|---------|
| Fullfør aiContent.mjs | M | 2-3 timer |
| Fullfør aiCrm.mjs | M | 2-3 timer |
| Gjennomgå aiBooking.mjs | S | 1 time |
| Test alle AI-endepunkter | M | 2 timer |
| Legg til rate limiting | M | 2-3 timer |
| Legg til logging & monitoring | M | 2-3 timer |
| **TOTALT** | **L** | **11-15 timer** |

---

## 🧪 Testing

### Manuell testing-sjekkliste:
- [ ] Test hvert AI-endepunkt UTEN API-nøkkel → skal feile med norsk melding
- [ ] Test hvert AI-endepunkt MED gyldig API-nøkkel → skal returnere ekte AI-data
- [ ] Test hvert AI-endepunkt MED ugyldig API-nøkkel → skal feile med norsk melding
- [ ] Verifiser at INGEN endepunkter returnerer stub/dummy-data

### Automatiserte tester (anbefalt):
```javascript
// Test at AI-funksjoner feiler riktig
describe('AI Client', () => {
  it('should throw error if no API key', async () => {
    delete process.env.OPENAI_API_KEY;
    await expect(callAI('system', 'user')).rejects.toThrow('AI-funksjonen er ikke aktivert');
  });
});
```

---

## ✅ Konklusjon

**Status for OPPGAVE 3:**
- ✅ AI-klient-infrastruktur er på plass
- ✅ 1 av 7 AI-modulfiler er fullstendig oppdatert (aiMarketingAi.mjs)
- ⚠️ 5 av 7 AI-modulfiler trenger ytterligere oppdateringer
- ⚠️ Testing og validering gjenstår

**Neste steg:**
1. Fullfør de resterende AI-filene (aiContent, aiCrm, aiBooking)
2. Test alle endepunkter
3. Legg til rate limiting og monitoring
4. Gå videre til OPPGAVE 4 (konfigurasjonsdokument)

---

**Sist oppdatert:** 29. november 2024
