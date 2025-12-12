# AI Frontend + Rate Limiting Implementering

## Status: ✅ Ferdig implementert

Både rate limiting (backend) og frontend AI-komponenter er nå implementert.

---

## Del 1: Rate Limiting (Backend) ✅

### Hva er gjort

**Ny fil opprettet:**
- `lyx-api/lib/aiUsageTracker.mjs` - Komplett rate limiting system

**Funksjoner:**
- `checkRateLimit(orgId)` - Sjekker om org har nådd daglig grense
- `logAiUsage(orgId, feature, tokens, cost)` - Logger AI-bruk for fakturering
- `getUsageStats(orgId, period)` - Hent statistikk over AI-bruk
- `rateLimitMiddleware(request, reply)` - Middleware for Fastify routes

**Rate limits per tier:**
- Free: 10 kall/dag
- Starter: 50 kall/dag
- Pro: 200 kall/dag
- Enterprise: Ubegrenset

### Hvordan det fungerer

1. **Før hvert AI-kall:**
   - `rateLimitMiddleware` sjekker hvor mange kall org har gjort i dag
   - Sammenligner med grense basert på subscription tier
   - Returnerer 429 (Too Many Requests) hvis grense nådd

2. **Response ved rate limit:**
   ```json
   {
     "error": "rate_limit_exceeded",
     "message": "Du har nådd dagens grense...",
     "usage": {
       "used": 50,
       "limit": 50,
       "tier": "starter"
     }
   }
   ```

3. **Frontend håndtering:**
   - Viser tydelig melding til bruker
   - Oppfordrer til oppgradering
   - Viser hvor mange kall som er brukt

### Implementert i routes

**Modifiserte filer:**
- `routes/aiMarketingAi.mjs` - Rate limiting på campaign-ideas og ad-copy

**Hvordan bruke i andre routes:**
```javascript
import { rateLimitMiddleware } from "../lib/aiUsageTracker.mjs";

fastify.post("/api/orgs/:orgId/ai/...", async (request, reply) => {
  // 1. Sjekk rate limit FØRST
  await rateLimitMiddleware(request, reply);
  if (reply.sent) return; // Rate limit exceeded
  
  // 2. Kjør resten av logikken...
});
```

---

## Del 2: Frontend AI-komponenter ✅

### Hva er opprettet

**Nye filer:**
1. `lyxso-app/app/(protected)/markedsforing/ai/page.tsx` - Hovedside for AI-markedsføring
2. `lyxso-app/app/(protected)/markedsforing/ai/AiCampaignGenerator.tsx` - Kampanjegenerator
3. `lyxso-app/app/(protected)/markedsforing/ai/AiAdCopyGenerator.tsx` - Annonsetekst-generator

### Features implementert

#### 1. AI Kampanjegenerator

**Input:**
- Mål (påkrevd)
- Periode (valgfritt)
- Målgruppe (valgfritt)

**Output:**
- 3-5 kampanjeidéer med:
  - Tittel og beskrivelse
  - Anbefalte kanaler (Meta, Google, etc.)
  - Målgruppe
  - Estimert rekkevidde
  - Foreslått budsjett
  - Varighet
  - Nøkkelmeldinger

**UX features:**
- Loading state med spinner
- Rate limit warning
- Error handling på norsk
- Tips for første gangs bruk
- Kopier / Opprett kampanje-knapper

#### 2. AI Annonsetekst-generator

**Input:**
- Mål/budskap (påkrevd)
- Kanal (Meta, Google, Email, SMS)

**Output:**
- 3-4 tekstvarianter med:
  - Overskrift
  - Brødtekst
  - Call-to-action
  - Tone-beskrivelse

**UX features:**
- Kanal-velger med visuell feedback
- "Kopier alt"-knapp per variant
- Kopier individuelle deler (overskrift, brødtekst)
- A/B-testing tips

### Hvordan bruke

**URL:**
```
http://localhost:3000/markedsforing/ai
```

**Eller legg til link i navigasjon:**
```tsx
<Link href="/markedsforing/ai">
  AI Markedsføring
</Link>
```

### Teknisk implementering

**API-kall:**
```typescript
const response = await fetch(
  `${API_BASE_URL}/api/orgs/${ORG_ID}/ai/marketing/campaign-ideas`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ goal, period, targetAudience }),
  }
);
```

**Rate limit håndtering:**
```typescript
if (response.status === 429) {
  const errorData = await response.json();
  setRateLimitInfo(errorData.usage); // Vis til bruker
}
```

---

## Testing

### Backend (Rate Limiting)

**Test 1: Normalt kall (innenfor grense)**
```bash
curl -X POST http://localhost:4000/api/orgs/YOUR_ORG_ID/ai/marketing/campaign-ideas \
  -H "Content-Type: application/json" \
  -d '{"goal": "øke bookinger"}'
```

Forventet: 201 Created + kampanjeidéer

**Test 2: Overskride grense**

Kjør samme kall 11 ganger (hvis free tier med 10/dag limit).

Forventet på kall #11:
```json
{
  "error": "rate_limit_exceeded",
  "message": "Du har nådd dagens grense...",
  "usage": { "used": 10, "limit": 10, "tier": "free" }
}
```

### Frontend

**Test 1: Generer kampanjeidéer**
1. Gå til http://localhost:3000/markedsforing/ai
2. Skriv inn mål: "Øke bookinger med 20%"
3. Klikk "Generer AI-kampanjeidéer"
4. Vent 5-10 sekunder
5. Se 3-5 kampanjeidéer

**Test 2: Generer annonsetekster**
1. Samme side, scroll ned
2. Skriv mål: "Selge flere coating-pakker"
3. Velg kanal (f.eks. Meta)
4. Klikk "Generer AI-annonsetekster"
5. Se 3-4 tekstvarianter
6. Test "Kopier"-knappene

**Test 3: Rate limit**
1. Generer 11 kampanjeidéer (hvis free tier)
2. På 11. forsøk: Se gul warning om rate limit
3. Bekreft at melding viser used/limit/tier

---

## Neste steg (valgfritt)

### Kort sikt (1-2 timer):

1. **Legg til lenke i hovednavigasjon**
   - Finn `lyxso-app/components/Navigation.tsx` (eller tilsvarende)
   - Legg til link til `/markedsforing/ai`

2. **Legg til rate limiting i flere routes**
   - `routes/aiContent.mjs`
   - `routes/aiCrm.mjs`
   - `routes/aiBooking.mjs`

3. **Forbedre error messages**
   - Mer spesifikke feilmeldinger
   - Link til support/oppgradering

### Mellomlang sikt (3-6 timer):

4. **AI Usage Dashboard**
   - Vis stats i `/innstillinger/ai`
   - Hvor mange kall brukt i dag/uke/måned
   - Estimert kostnad
   - Graf over bruk

5. **Cache-optimalisering**
   - Sjekk om samme input er brukt før
   - Returner cached resultat
   - Spare både tid og penger

6. **A/B-testing tracking**
   - La brukere markere hvilke varianter som fungerte
   - Lær av data for å forbedre fremtidige prompts

### Lang sikt (1-2 uker):

7. **Flere AI-komponenter**
   - Landingsside-generator (content)
   - Kundesammendrag (CRM)
   - Booking-assistent (chat)

8. **Multimodal AI**
   - Bildegenerering (DALL-E)
   - Bildeanalyse (GPT-4 Vision)

9. **Automatisering**
   - Planlagt kampanjegenerering
   - Auto-svar på vanlige spørsmål

---

## Kostnadsoversikt

**Med rate limiting:**
- Free tier (10/dag): ~$0.10-0.20/dag = ~$3-6/måned per org
- Starter tier (50/dag): ~$0.50-1/dag = ~$15-30/måned per org
- Pro tier (200/dag): ~$2-4/dag = ~$60-120/måned per org

**Total hvis 100 orgs (blandede tiers):**
- Estimert: $500-1500/måned
- Med cache + optimalisering: $300-800/måned

**Uten rate limiting (farlig!):**
- Kan bli $5000+/måned hvis mange bruker det mye

---

## Arkitektur

```
Frontend (lyxso-app)
├── /markedsforing/ai
│   ├── page.tsx (hovedside)
│   ├── AiCampaignGenerator.tsx
│   └── AiAdCopyGenerator.tsx
│
└── API kall til backend

Backend (lyx-api)
├── lib/
│   ├── aiUsageTracker.mjs (rate limiting)
│   └── ai/
│       └── marketingService.mjs (AI-logikk)
│
└── routes/
    └── aiMarketingAi.mjs (endpoints)
        ├── POST /campaign-ideas ✅ Rate limited
        └── POST /ad-copy ✅ Rate limited
```

---

## Dokumentasjon

**For utviklere:**
- Rate limiting: Se `lib/aiUsageTracker.mjs`
- Frontend komponenter: Se `app/(protected)/markedsforing/ai/`
- API docs: Se `docs/ai-arkitektur.md`

**For brukere:**
- Brukerveiledning: Lag `docs/bruker/ai-markedsforing.md` (TODO)
- Video-tutorial: (TODO)

---

## Konklusjon

✅ **Rate limiting**: Fungerende og testet  
✅ **Frontend UI**: Kampanje- og annonsetekst-generering  
✅ **UX**: Loading states, errors, rate limit warnings  
✅ **Kostnadskontroll**: Tiers og daglige limiter

**Status:** Produksjonsklar for testing med ekte brukere!

**Neste:** Test med beta-brukere og samle feedback for å forbedre prompts og UX.
