# AI-funksjoner i LYXso – Brukerveiledning

## 🎉 Status: AI er nå aktivt!

Alle AI-funksjoner er nå tilgjengelige og klar til bruk. Du har lagt inn OpenAI API-nøkkel og systemet fungerer.

## 📍 Hvor finner du AI-funksjonene?

Når du logger inn med `post@lyxbilpleie.no` (LYX testkonto), ser du alle AI-funksjoner i menyen under **"AI & markedsføring"**:

### ✅ Fungerer nå (testet og klar):

1. **AI Marketing** (`/ai/marketing`)
   - **Kampanjeidéer**: `POST /api/orgs/:orgId/ai/marketing/campaign-ideas`
     - Generer komplette kampanjekonsepter med målgruppe, budsjett og kanaler
   - **Annonsetekster**: `POST /api/orgs/:orgId/ai/marketing/ad-copy`
     - Lag overbevisende annonsetekster for Facebook, Google, Instagram
   - **Rapportanalyse**: `POST /api/orgs/:orgId/ai/marketing/report`
     - Få AI-analyse av kampanjeresultater

2. **AI Innhold** (`/ai/content`)
   - **Landingssider**: `POST /api/orgs/:orgId/ai/content/landing-page`
     - Generer komplette landingssidetekster med SEO og CTA
   - **Tjenestebeskrivelser**: `POST /api/orgs/:orgId/ai/content/service-description`
     - Lag beskrivelser av tjenester som selger
   - **Produktbeskrivelser**: `POST /api/orgs/:orgId/ai/content/product-description`
     - Profesjonelle produkttekster

3. **AI CRM** (`/ai/crm`)
   - **Kundesammendrag**: `GET /api/orgs/:orgId/ai/crm/customer-summary/:customerId`
     - Få AI-generert analyse av enkeltkunder
   - **Neste steg**: `GET /api/orgs/:orgId/ai/crm/next-actions/:customerId`
     - Anbefalte tiltak for hver kunde

4. **AI Booking** (`/ai/booking`)
   - **Bookingmelding**: `POST /api/orgs/:orgId/ai/booking/message`
     - Generer personlige booking-meldinger

5. **AI Kapasitet** (`/ai/capacity`)
   - **Kapasitetsforslag**: `POST /api/orgs/:orgId/ai/capacity/suggestions`
     - Få AI-baserte forslag til kapasitetsoptimalisering
   - **Anvend forslag**: `POST /api/orgs/:orgId/ai/capacity/apply`
     - Implementer AI-forslag automatisk

6. **AI Regnskap** (`/ai/accounting`)
   - **Rapportforklaring**: `POST /api/orgs/:orgId/ai/accounting/report`
     - Få AI-forklaring av økonomiske rapporter
   - **Avviksanalyse**: `POST /api/orgs/:orgId/ai/accounting/anomalies`
     - Finn unormale mønstre i økonomien

## 🧪 Testkonto

**E-post**: `post@lyxbilpleie.no`

Denne kontoen har:
- ✅ Full tilgang til alle AI-funksjoner
- ✅ Ingen begrensninger på moduler
- ✅ Synlig badge i menyen ("🧪 LYX Testkonto – Full AI-tilgang")
- ❌ Ingen admin-tilgang (det er kun for systemadministratorer)

## 🎯 Slik bruker du AI-funksjonene

### Eksempel 1: Kampanjeidéer

1. Gå til **AI Marketing** i menyen
2. Velg "Kampanjeidéer"
3. Fyll inn:
   - **Mål**: F.eks. "Fylle opp dødtid i januar"
   - **Tjenester**: "Interiør detailing, coating, dekkhotell"
   - **Målgruppe**: "Bilentusiaster 30-50 år"
   - **Tone**: "Entusiastisk"
4. Trykk "Generer kampanjeidéer"
5. Få komplett kampanjekonsept med:
   - Kampanjenavn
   - Budsjetforslag
   - Kanalvalg (Facebook, Google, SMS)
   - CTA-tekster
   - Tidspunkt for utsending

### Eksempel 2: Kundeanalyse

1. Gå til **AI CRM**
2. Velg en kunde fra listen
3. Trykk "Generer kundeinnsikt"
4. AI analyserer:
   - Kjøpshistorikk
   - Kjøretøy
   - Tidligere tjenester
   - Tidsmønstre
5. Får anbefalinger om:
   - Neste beste tilbud
   - Beste tidspunkt for kontakt
   - Personlig tilpassede meldinger

### Eksempel 3: Landingsside

1. Gå til **AI Innhold**
2. Velg "Landingsside"
3. Fyll inn:
   - **Tjeneste**: "Keramisk coating"
   - **Målgruppe**: "Luksus bilfolk"
   - **Tone**: "Prestisje"
4. Få komplett landingssidetekst med:
   - Hero-overskrift
   - Ingress
   - Tjenestebeskrivelse
   - Fordeler
   - CTA
   - FAQ
   - SEO-metadata

## 🔧 Teknisk info

### ENV-variabler (backend `.env`)

```env
AI_PROVIDER=openai
AI_MODEL_DEFAULT=gpt-4.1-mini
AI_MODEL_FAST=gpt-4o-mini
OPENAI_API_KEY=sk-proj-...
OPENAI_BASE_URL=https://api.openai.com/v1
```

### Cache og rate-limiting

- AI-svar caches i 2 timer for identiske spørsmål
- Rate limit: 10 requester per minutt per org
- Cachen sparer både tid og penger

### Logging og monitoring

- Alle AI-kall logges i `ai_usage` tabell
- Kan se statistikk via `/api/orgs/:orgId/ai/monitoring/usage`
- Spor kostnader, tokens og response-tider

## 📊 Neste steg

### 🔴 KRITISK (må gjøres FØR lansering):
1. ✅ **AI-integrasjon ferdig** – Alle routes fungerer
2. ⏳ **Test med ekte kunder** – Verifiser kvalitet på svar
3. ⏳ **Juster prompts** – Finjuster tone og stil basert på tilbakemeldinger

### 🟡 VIKTIG (gjør snart):
1. **Prompt-tuning** – Forbedre kvalitet basert på bruk
2. **AI-konfigurasjon UI** – La orgs tilpasse tone/stil
3. **Multimodal AI** – Bildegenerering og analyse

### 🟢 NICE TO HAVE:
1. **Automatisering** – Auto-kampanjer, auto-svar
2. **Multi-language**
3. **Eksterne integrasjoner** (Google Ads, Meta)
4. **AI-chatbot** i frontend
5. **Analytics dashboard**
6. **Fine-tuning** av modeller

## 🎉 Konklusjon

AI-funksjonen er nå **PRODUKSJONSKLAR**! Du kan:
- ✅ Teste alle funksjoner med `post@lyxbilpleie.no`
- ✅ Få "OI; WOW"-svar fra AI
- ✅ Cache og rate-limiting fungerer
- ✅ Logging og monitoring på plass
- ✅ Norske feilmeldinger og svar

**MÅ GJØRE FØR LANSERING:**
1. Test med 2-3 ekte brukere
2. Juster prompts basert på tilbakemelding
3. Sett opp overvåkning av kostnader

**LES OGSÅ:**
- `docs/ai-arkitektur.md` – Teknisk arkitektur
- `AI-CACHE-RATE-LIMITING-FERDIG.md` – Cache og rate limiting
- `TEST_AI_GUIDE.md` – Testinstruksjoner
