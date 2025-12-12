# 🤖 AI-funksjoner i LYXso - Hvor finner du dem?

**Sist oppdatert:** 2025-11-29

## ✅ AKTIVE AI-FUNKSJONER (produksjonsklare)

### 1. 📢 Markedsføring / AI-verktøy
**URL:** `/markedsforing/ai`

**Komponenter:**
- `AiCampaignGenerator.tsx` - Generer kampanjeidéer
- `AiAdCopyGenerator.tsx` - Generer annonsetekster

**Backend API:**
- `POST /api/orgs/:orgId/ai/marketing/campaign-ideas`
- `POST /api/orgs/:orgId/ai/marketing/ad-copy`

**Hva kan du gjøre:**
- ✨ Generere kampanjeidéer basert på mål og periode
- ✨ Lage annonsetekster for Meta, Google, e-post, SMS
- ✨ Få forslag til målgrupper, kanaler, budsjett
- ✨ Få flere variasjoner av samme annonse

**Hvordan bruke:**
1. Gå til "Markedsføring" i hovedmenyen
2. Velg "AI-verktøy" fra undermenyen
3. Fyll inn ditt mål (f.eks. "Selge flere coating-pakker i januar")
4. Velg kanal og målgruppe
5. Klikk "Generer" og vent 3-10 sekunder
6. Få 3-5 konkrete kampanjeidéer eller annonsetekster

---

### 2. 🤖 LYXba - AI Booking Agent
**URL:** `/ai-agent`

**Komponenter:**
- `AiAgentPageClient.tsx` - Hovedside for booking-agent
- `LyxbaAgentClient.tsx` - Konfigurasjon av agent

**Status:** 
⚠️ **UI ferdig, men backend-integrasjon ikke fullført ennå**

**Planlagt funksjonalitet:**
- Auto-svar på leads fra Facebook, Instagram, kontaktskjema
- Intelligent booking-forslag basert på ledig kapasitet
- Oppfølging av potensielle kunder
- Integrasjon med kalender og kapasitetsstyring

**Backend API (planlagt):**
- `POST /api/orgs/:orgId/ai/booking/suggest-slot`
- `POST /api/orgs/:orgId/ai/crm/customer-insight`

---

## 🚧 AI-MODULER I BACKEND (klar, men ikke UI ennå)

### 3. 📊 Rapporter og innsikt
**Backend:** `/api/orgs/:orgId/ai/accounting/explain-report`

**Hva den kan:**
- Forklare økonomiske rapporter på enkel norsk
- Gi innsikt i trender og mønstre
- Foreslå forbedringer

**Status:** Backend klar, venter på UI i rapportsiden

---

### 3. 👤 Kunde-AI (CRM-innsikt)
**URL:** `/kunder/[id]` (på kundedetaljside)

**Komponent:**
- `CustomerAISummary.tsx` - AI-innsikt om kunde

**Status:** 
⚠️ **UI ferdig, men bruker foreløpig dummy-data (ikke ekte AI)**

**Hva den viser:**
- Oppsummering av kundehistorikk
- Anbefalinger for oppfølging
- Forslag til neste handling
- Meldingsforslag (SMS/e-post)

**Backend API:**
- Repo: `aiAssistantRepo.ts` (bruker lokale regler, ikke OpenAI ennå)

**Kommende integrasjon:**
Denne vil kobles til `ai/crmService.mjs` for å gi ekte AI-baserte innsikter basert på:
- Kundehistorikk
- Kjøpsmønstre
- Tjenester kjøpt
- Tid siden siste besøk
- Potensielle mersalg

---

### 4. 📝 Innhold og tekster
**Backend:** `/api/orgs/:orgId/ai/content/*`

**Hva den kan:**
- Generere blogginnlegg om bilpleie
- Lage FAQ-svar
- Skrive produktbeskrivelser
- Generere sosiale medier-innlegg

**Status:** Backend klar, venter på CMS/innholdsside

---

### 5. 📦 Kapasitetsstyring
**Backend:** `/api/orgs/:orgId/ai/capacity/analyze`

**Hva den kan:**
- Analysere kapasitetsutnyttelse
- Foreslå optimalisering av ressurser
- Identifisere flaskehalser
- Foreslå prissetting basert på etterspørsel

**Status:** Backend klar, venter på integrasjon i kapasitetsvisning

---

## 🎯 HVOR SKAL DU TESTE AI NÅ?

### For testing av AI-funksjonalitet:

1. **Kampanjeidéer:**
   ```
   URL: http://localhost:3001/markedsforing/ai
   Test med: "Øke salg av dekkhotell før vinteren"
   Forventet resultat: 3-5 konkrete kampanjeidéer med budsjett og kanaler
   ```

2. **Annonsetekster:**
   ```
   URL: http://localhost:3001/markedsforing/ai
   Test med: "Selge ceramic coating til Tesla-eiere"
   Velg kanal: Meta
   Forventet resultat: 3 variasjoner av annonse med overskrift, tekst og CTA
   ```

3. **Kunde-AI (dummy-data foreløpig):**
   ```
   URL: http://localhost:3001/kunder/[velg-en-kunde-id]
   Klikk: "Generer innsikt"-knapp
   Forventet resultat: Oppsummering og anbefalinger (basert på regler, ikke AI ennå)
   ```

3. **Direkte API-test (Postman/curl):**
   ```bash
   # Test kampanjeidéer
   curl -X POST http://localhost:4000/api/orgs/DIN_ORG_ID/ai/marketing/campaign-ideas \
     -H "Content-Type: application/json" \
     -d '{
       "goal": "Øke bookinger av lackbeskyttelse",
       "period": "Q1 2025",
       "targetAudience": "Bilentusiaster med nye biler"
     }'
   ```

---

## 🔑 KRAV FOR AT AI SKAL FUNGERE

### Environment-variabler (backend .env):
```bash
AI_PROVIDER=openai
AI_MODEL_DEFAULT=gpt-4o-mini
OPENAI_API_KEY=sk-proj-...  # Din faktiske nøkkel
OPENAI_BASE_URL=https://api.openai.com/v1
```

### Frontend-variabler (.env.local):
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_DEFAULT_ORG_ID=din-org-id-her
```

---

## 📋 KOMMENDE AI-FUNKSJONER

### Kort sikt (1-2 måneder):
- ✅ Kampanjeidéer (FERDIG)
- ✅ Annonsetekster (FERDIG)
- 🚧 LYXba booking-agent (UI ferdig, backend 60%)
- 📝 Innholdsgenerator i CMS
- 📊 Rapportforklaring i økonomi-dashboard

### Mellomlang sikt (3-6 måneder):
- 🎨 Bildegenerering for kampanjer
- 📧 E-postsekvenser og oppfølging
- 📞 SMS-kampanjer med AI
- 🔍 Kundeanalyse og segmentering
- 💰 Dynamisk prissetting

### Lang sikt (6-12 måneder):
- 🤖 Fullstendig autonom booking-agent
- 🌐 Multi-language support
- 🔗 Integrasjoner (Google Ads, Meta Ads)
- 📱 AI-chatbot på nettside
- 🧠 Fine-tuned modeller for bilbransjen

---

## 🐛 FEILSØKING

### "AI er ikke konfigurert"-feil:
- ✅ Sjekk at `OPENAI_API_KEY` er satt i backend `.env`
- ✅ Restart backend-serveren etter å ha lagt til nøkkel
- ✅ Test med: `node test-ai.mjs` i backend-mappen

### "Route not found"-feil:
- ✅ Sjekk at backend kjører på port 4000
- ✅ Sjekk at `NEXT_PUBLIC_API_BASE_URL` peker til riktig URL
- ✅ Sjekk at du bruker riktig orgId i URL

### Rate limit-feil:
- OpenAI har grenser på antall requests per minutt
- Free tier: 3 requests/min
- Paid tier: 500-10,000 requests/min
- Løsning: Vent ett minutt eller oppgrader OpenAI-plan

### Sakte svar (>30 sekunder):
- Normal responstid: 3-10 sekunder
- Hvis saktere: Sjekk internettforbindelse
- Hvis timeout: Øk `AI_TIMEOUT` i backend env

---

## 📞 SUPPORT

Hvis AI-funksjonene ikke fungerer som forventet:
1. Sjekk denne guiden
2. Test med `test-ai.mjs` i backend
3. Sjekk backend-logger for feilmeldinger
4. Kontakt utvikler med:
   - Feilmelding (skjermbilde)
   - Hva du prøvde å gjøre
   - Hvilken side du var på
   - Om backend logger viser noe

---

## 🎓 TIPS FOR BESTE AI-RESULTATER

### For kampanjeidéer:
- ✅ Vær konkret: "Øke salg av keramisk coating" i stedet for "Mer omsetning"
- ✅ Legg til målgruppe: "Tesla-eiere", "Familier", "Firmaflåter"
- ✅ Angi periode: "Før sommeren", "Q1 2025", "Høstkampanje"

### For annonsetekster:
- ✅ Velg riktig kanal (Meta, Google, E-post, SMS)
- ✅ Beskriv det unike med tilbudet: "20% rabatt kun denne uken"
- ✅ Nevn målgruppe hvis relevant

### Generelt:
- 🎯 Jo mer kontekst du gir, jo bedre svar får du
- 💡 Test flere variasjoner - AI er kreativ hver gang
- 📝 Rediger resultatet - bruk AI som utgangspunkt, ikke som ferdig produkt
- ⚡ Første generering tar tid (5-10 sek), det er normalt

---

*Denne guiden oppdateres etter hvert som nye AI-funksjoner lanseres.*
