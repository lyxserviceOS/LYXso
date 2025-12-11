# 🚀 AI System - Quick Start

**For:** Produkteier / Eier av LYXso  
**Mål:** Komme i gang med AI-funksjonalitet på 5 minutter

---

## ⚡ 3 Steg til Fungerende AI

### STEG 1: Legg inn API-nøkkel (1 min)

1. Åpne: `lyx-api/.env`
2. Finn linjen: `OPENAI_API_KEY=`
3. Lim inn din nøkkel:
   ```bash
   OPENAI_API_KEY=sk-proj-din-ekte-nøkkel-her
   ```
4. Lagre filen

**✅ Ferdig!** Det er alt du trenger å gjøre.

---

### STEG 2: Test at det fungerer (2 min)

```bash
# I lyx-api mappen:
cd lyx-api
node test-ai-komplett.mjs
```

**Forventet resultat:**
```
✅ AI er konfigurert og klar!
✅ Marketing Service: OK
✅ Content Service: OK
✅ CRM Service: OK
...
🎉 ALLE TESTER FULLFØRT!
```

**❌ Hvis noe feiler:**
- Sjekk at OPENAI_API_KEY starter med `sk-proj-` eller `sk-`
- Sjekk at det ikke er mellomrom før/etter nøkkelen
- Sjekk at nøkkelen er aktiv på OpenAI.com

---

### STEG 3: Start og test i nettleseren (2 min)

**Terminal 1 - Backend:**
```bash
cd lyx-api
npm run dev
```

Vent til du ser: `Server listening at http://localhost:4000`

**Terminal 2 - Frontend:**
```bash
cd lyxso-app
npm run dev
```

Vent til du ser: `Local: http://localhost:3000`

**Test i nettleser:**
1. Gå til: http://localhost:3000
2. Logg inn som: `post@lyxbilpleie.no`
3. Klikk på **"AI Markedsføring"** i menyen
4. Prøv å generere kampanjeidéer

**✅ Hvis du får resultater:** Alt fungerer!  
**❌ Hvis du får feilmelding:** Se feilsøking under.

---

## 🎯 Hvor finner jeg AI-funksjonene?

Når du er innlogget, finn disse i menyen:

1. **AI Markedsføring** (`/markedsforing/ai`)
   - Kampanjeidéer
   - Annonsetekster (Meta, Google, Email, SMS)

2. **AI Innhold** (`/innhold/ai`)
   - Landingssider
   - Sosiale medier innlegg
   - Nyhetsbrev

3. **AI CRM** (`/crm/ai`)
   - Kundeinnsikt
   - Oppfølgingsforslag
   - Segmenteringsanalyse

4. **AI Chat** (nederst til høyre på alle sider)
   - Popup etter 5 sekunder
   - Følger deg mellom sider
   - Kontekstuell hjelp

---

## 🔧 Feilsøking

### "AI er ikke konfigurert"

**Løsning:**
- Sjekk at `OPENAI_API_KEY` er satt i `lyx-api/.env`
- Restart backend-serveren

### "Rate limit exceeded"

**Forklaring:**
- Du har brukt opp dagens grense (10 kall for free-plan)

**Løsning:**
- Vent til i morgen, ELLER
- Oppgrader til Starter/Pro plan i innstillinger

### "Unexpected token '<'"

**Forklaring:**
- Frontend får HTML i stedet for JSON (backend er nede?)

**Løsning:**
1. Sjekk at backend kjører på http://localhost:4000
2. Sjekk at OPENAI_API_KEY er satt
3. Restart begge servere

### API returnerer 404

**Forklaring:**
- Route finnes ikke

**Løsning:**
- Sjekk at du har latest kode
- Sjekk at orgId er riktig i URL
- Sjekk backend-logger for mer info

---

## 📊 Oversikt: Hva er implementert?

| Modul | Status | Funksjoner |
|-------|--------|------------|
| **Marketing AI** | ✅ Produksjon | Kampanjer, annonser, rapporter |
| **Content AI** | ✅ Produksjon | Landingssider, sosiale medier, nyhetsbrev |
| **CRM AI** | ✅ Produksjon | Innsikt, oppfølging, segmentering |
| **Accounting AI** | ✅ Produksjon | Finansrapporter, budsjett, analyse |
| **Capacity AI** | ✅ Produksjon | Kapasitetsanalyse, optimalisering |
| **Booking AI** | ✅ Produksjon | Booking-forslag, no-show prediksjon |
| **Chat Assistant** | ✅ Produksjon | Kontekstuell hjelp, global chat |

---

## 💰 Kostnadskontroll

**Automatisk rate limiting:**
- Free: 10 AI-kall per dag
- Starter: 50 AI-kall per dag
- Pro: 200 AI-kall per dag
- Enterprise: Ubegrenset

**Estimert kostnad per måned:**
- 100 orgs med blandede planer: ~$150-300/mnd (med caching)

**Beskyttelse:**
- Alle kall er rate-limitert
- Caching sparer penger og tid
- Usage tracking for fakturering

---

## 📚 Mer Dokumentasjon

**For deg (eier):**
- `docs/AI_SYSTEM_BEKREFTELSE.md` - Full oversikt
- `docs/AI_AKTIVE_SIDER.md` - Hvor finne AI-funksjoner
- `docs/konfigurasjon-og-hemmeligheter.md` - ENV setup

**For utviklere:**
- `docs/AI_QUICK_REFERENCE.md` - API referanse
- `docs/AI_IMPLEMENTERING_FERDIG.md` - Teknisk guide
- `lyx-api/TEST_AI_GUIDE.md` - Testing guide

---

## ✅ Sjekkliste

- [ ] OPENAI_API_KEY lagt inn i `lyx-api/.env`
- [ ] Test kjørt: `node test-ai-komplett.mjs`
- [ ] Backend starter uten feil
- [ ] Frontend starter uten feil
- [ ] Kan logge inn som `post@lyxbilpleie.no`
- [ ] Kan se AI-sider i menyen
- [ ] Kan generere kampanjeidéer
- [ ] Chat-assistant popper opp etter 5 sek

**Hvis alle er ✅:** Du er klar! 🎉

---

## 🆘 Trenger Hjelp?

1. Sjekk feilmeldingen i browser console (F12)
2. Sjekk backend-logger i terminal
3. Kjør `node test-ai-komplett.mjs` for diagnostikk
4. Se `docs/AI_SYSTEM_BEKREFTELSE.md` for full dokumentasjon

---

**Laget:** 2025-11-30  
**Status:** ✅ Produksjonsklar
