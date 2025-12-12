# 🚀 AI QUICK REFERENCE - LYXso

## 🟢 KAN TESTES NÅ (med ekte AI)

### 1. Markedsføring → AI-verktøy
**URL:** `http://localhost:3001/markedsforing/ai`

**Test 1 - Kampanjeidéer:**
- Klikk på "Kampanjeidéer"-fane
- Skriv mål: "Øke salg av dekkhotell før vintersesongen"
- Velg målgruppe: "Bilentusiaster og privatpersoner"
- Klikk "Generer idéer"
- ⏱️ Venter 5-10 sekunder
- ✅ Får 3-5 konkrete kampanjeidéer

**Test 2 - Annonsetekster:**
- Klikk på "Annonsetekst"-fane
- Skriv mål: "Selge ceramic coating til Tesla-eiere"
- Velg kanal: Meta
- Klikk "Generer annonser"
- ⏱️ Venter 5-10 sekunder
- ✅ Får 3 variasjoner av annonse

---

## 🟡 UI FERDIG, MEN VENTER PÅ BACKEND

### 2. LYXba - AI Booking Agent
**URL:** `http://localhost:3001/ai-agent`
- UI er klar
- Backend er delvis klar (60%)
- Ikke fullstendig funksjonell ennå

### 3. Kunde-AI
**URL:** `http://localhost:3001/kunder/[kunde-id]`
- AI-innsikt-panel finnes på kundedetaljsiden
- Bruker dummy-data (regler) foreløpig
- Skal kobles til ekte AI senere

---

## 🔴 BACKEND KLAR, VENTER PÅ UI

- 📊 Rapportforklaring (økonomi)
- 📝 Innholdsgenerator (CMS)
- 📦 Kapasitetsanalyse

---

## 📍 NAVIGASJON I APPEN

```
Hovedmeny
├── Markedsføring
│   └── AI-verktøy ✅ AKTIV
│       ├── Kampanjeidéer
│       └── Annonsetekster
├── Kunder
│   └── [Velg kunde] → AI-innsikt 🟡 DUMMY
└── LYXba
    └── AI Booking Agent 🟡 IKKE KLAR
```

---

## ⚙️ KONFIGURERT RIKTIG?

### Backend (.env):
```bash
AI_PROVIDER=openai ✅
AI_MODEL_DEFAULT=gpt-4o-mini ✅
OPENAI_API_KEY=sk-proj-... ✅ (din nøkkel)
```

### Frontend (.env.local):
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000 ✅
NEXT_PUBLIC_DEFAULT_ORG_ID=[din-org-id] ✅
```

### Test konfigurasjon:
```bash
cd lyx-api
node test-ai.mjs
```

**Forventet output:**
```
🧪 Tester AI-konfigurasjon...
✅ AI er konfigurert og klar!
   Provider: openai
   Modell: gpt-4o-mini
```

---

## 🚨 VANLIGE FEIL

| Feilmelding | Løsning |
|-------------|---------|
| "AI er ikke konfigurert" | Sjekk at `OPENAI_API_KEY` er i backend `.env` |
| "Route not found" | Backend kjører kanskje ikke - sjekk port 4000 |
| "Rate limit exceeded" | Vent 1 minutt (OpenAI free tier har kun 3 req/min) |
| Sakte (>30 sek) | Normal tid er 5-10 sek - sjekk nettforbindelse |

---

## 💡 TIPS FOR BESTE RESULTATER

### Kampanjeidéer:
✅ **Bra:** "Øke bookinger av lackbeskyttelse blant Tesla-eiere i Q1 2025"
❌ **Dårlig:** "Mer salg"

### Annonsetekster:
✅ **Bra:** "Selge keramisk coating med 20% rabatt til nye kunder"
❌ **Dårlig:** "Kampanje"

### Generelt:
- Jo mer spesifikk, jo bedre svar
- Test flere ganger - AI varierer
- Bruk som utgangspunkt, ikke ferdig produkt

---

## 📞 TRENGER HJELP?

1. Les [AI_AKTIVE_SIDER.md](./AI_AKTIVE_SIDER.md) for detaljert info
2. Kjør `node test-ai.mjs` i backend
3. Sjekk backend-logger for feilmeldinger
4. Send skjermbilde av feil + hva du prøvde

---

*Oppdatert: 2025-11-29*
