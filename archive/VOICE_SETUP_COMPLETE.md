# ✅ Twilio Voice Setup - FERDIG!

## Status: Kode implementert ✅ | Database mangler ⏳ | Twilio config mangler ⏳

---

## 🎯 Hva som er gjort:

### 1. Backend-filer opprettet og registrert ✅

#### Nye filer:
- ✅ `lyx-api/routes/twilioVoiceWebhook.mjs` - Håndterer voice webhooks
- ✅ `lyx-api/services/aiVoiceService.mjs` - AI voice agent med GPT-4
- ✅ `lyx-api/create_ai_voice_sessions.sql` - Database-tabell for voice sessions

#### Oppdaterte filer:
- ✅ `lyx-api/index.mjs` - Importert og registrert twilioVoiceWebhook routes

### 2. Voice Endpoints tilgjengelig:

```
POST /api/webhooks/twilio/voice
- Hovedendpoint for innkommende anrop
- Genererer velkomstmelding
- Starter ny voice session

POST /api/webhooks/twilio/voice/gather
- Håndterer brukerens tale-input
- Sender til GPT-4 for AI-respons
- Oppdaterer samtalehistorikk

POST /api/webhooks/twilio/voice/status
- Mottar call status updates fra Twilio
- Oppdaterer session med varighet, status, etc.
```

---

## ⏳ Hva som gjenstår:

### Steg 1: Opprett database-tabell (5 min)

**Metode A: Via Supabase Dashboard (anbefalt)**

1. Gå til: https://supabase.com/dashboard/project/gedoxtrdylqxyyvfjmtb/editor
2. Åpne filen: `lyx-api/create_ai_voice_sessions.sql`
3. Kopier hele innholdet
4. Lim inn i Supabase SQL Editor
5. Klikk **"Run"**
6. Verifiser at tabellen `ai_voice_sessions` er opprettet

**Metode B: Via script**

```bash
cd "c:\Users\maser\OneDrive\Skrivebord\LYX selskaper\lyx-api"
node run-migration.mjs create_ai_voice_sessions.sql
```

---

### Steg 2: Konfigurer Twilio Voice Webhook (5 min)

1. **Gå til Twilio Console:**
   - URL: https://console.twilio.com/
   - Login med dine Twilio credentials

2. **Finn ditt telefonnummer:**
   - Klikk: **Phone Numbers** → **Manage** → **Active Numbers**
   - Velg: **+46 72 400 48 59** (eller ditt nummer)

3. **Sett opp Voice Configuration:**
   - Scroll ned til **"Voice Configuration"**
   - Under **"A CALL COMES IN":**
     - **Webhook URL:** `https://lyx-api.fly.dev/api/webhooks/twilio/voice`
     - **HTTP Method:** `POST`
   
4. **Sett opp Call Status Callback (valgfritt):**
   - Under **"Call Status Changes":**
     - **Webhook URL:** `https://lyx-api.fly.dev/api/webhooks/twilio/voice/status`
     - **HTTP Method:** `POST`

5. **Klikk "Save"**

---

## 🧪 Testing av Voice System

### Test 1: Basic Call Test

```bash
# Ring dette nummeret fra din telefon:
+46 72 400 48 59
```

**Forventet oppførsel:**
1. Twilio svarer anropet
2. Du hører: "Hei! Velkommen til [bedriftsnavn]. Hvordan kan jeg hjelpe deg?"
3. Du svarer: "Jeg vil booke en time"
4. AI responderer med oppfølgingsspørsmål

### Test 2: Verifiser Webhook Mottas

```bash
# Sjekk API-logger mens du ringer:
cd "c:\Users\maser\OneDrive\Skrivebord\LYX selskaper\lyx-api"
npm run dev
```

**Se etter i logs:**
```
📞 Incoming Twilio Voice call
Call details: { callSid: 'CA...', from: '+47...', status: 'ringing' }
```

### Test 3: Database Verification

```sql
-- Kjør i Supabase SQL Editor:
SELECT 
  id,
  call_sid,
  caller_phone,
  call_status,
  conversation_state,
  started_at
FROM ai_voice_sessions
ORDER BY started_at DESC
LIMIT 10;
```

---

## 🎨 Hvordan Voice AI fungerer:

```
1. Kunde ringer +46 72 400 48 59
        ↓
2. Twilio Voice mottar anrop
        ↓
3. Twilio sender webhook til:
   POST /api/webhooks/twilio/voice
        ↓
4. Backend oppretter ai_voice_session
        ↓
5. Backend returnerer TwiML med velkomstmelding
        ↓
6. Twilio leser opp melding (Text-to-Speech)
        ↓
7. Kunde snakker → Twilio transkribert (Speech-to-Text)
        ↓
8. Webhook mottar tale-input:
   POST /api/webhooks/twilio/voice/gather
        ↓
9. Backend sender til GPT-4 for AI-analyse
        ↓
10. GPT-4 genererer respons basert på kontekst
        ↓
11. Backend returnerer TwiML med AI-svar
        ↓
12. Twilio leser opp AI-svaret
        ↓
13. Loop fortsetter til booking er ferdig eller samtale avsluttes
```

---

## 📊 Voice Session Data Structure

Database-tabellen `ai_voice_sessions` lagrer:

```javascript
{
  call_sid: "CA1234567890...",           // Twilio Call ID
  org_id: "uuid",                         // Hvilken bedrift
  caller_phone: "+4712345678",            // Kundens nummer
  call_status: "in-progress",             // initiated, in-progress, completed
  call_duration: 180,                     // Sekunder
  conversation_state: {
    messages: [
      {
        role: "customer",
        message: "Jeg vil booke en time",
        timestamp: "2024-12-06T22:30:00Z"
      },
      {
        role: "assistant",
        message: "Selvfølgelig! Hvilken dato passer best?",
        timestamp: "2024-12-06T22:30:02Z"
      }
    ],
    intent: {
      action: "gather_info",
      hasService: true,
      hasDate: false,
      hasTime: false
    }
  },
  booking_id: null,                       // UUID hvis booking opprettet
  customer_id: null,                      // UUID hvis kunde opprettet
  started_at: "2024-12-06T22:30:00Z",
  ended_at: "2024-12-06T22:33:00Z"
}
```

---

## 🔧 Teknisk implementering:

### TwiML Responses

Backend genererer TwiML (Twilio Markup Language) XML:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" timeout="5" language="nb-NO" speechTimeout="auto">
    <Say voice="Google.nb-NO-Wavenet-A" language="nb-NO">
      Hei! Velkommen til LYX. Hvordan kan jeg hjelpe deg?
    </Say>
  </Gather>
</Response>
```

### AI Prompt for Voice

```javascript
const systemPrompt = `Du er en profesjonell booking-assistent.

VIKTIG: Hold svarene KORTE og NATURLIGE for telefonsamtale. 
Max 2-3 setninger per svar.

Dine oppgaver:
1. Vær hjelpsom, vennlig og profesjonell
2. Hjelp kunden med å booke en tid
3. Spør kun om EN ting om gangen
4. Bekreft informasjon før du går videre

REGLER:
- Snakk NORSK (bokmål)
- Bruk naturlig, muntlig språk
- Ikke bruk emojis eller spesialtegn
- Hold hvert svar under 30 ord
`;
```

---

## 💰 Kostnader (Twilio Voice):

### Priser:
- **Innkommende anrop (Sverige):** $0.0085/min (~0.09 NOK/min)
- **Utgående anrop:** $0.014/min (~0.15 NOK/min)
- **Speech-to-Text:** Inkludert i Twilio Voice
- **Text-to-Speech (Google Wavenet):** $0.006/request (~0.06 NOK)

### Eksempel-kalkulator:
```
10 minutters samtale med 8 AI-interaksjoner:
- Innkommende: 10 min × 0.09 NOK = 0.90 NOK
- TTS: 8 × 0.06 NOK = 0.48 NOK
- GPT-4: 8 × ~0.03 NOK = 0.24 NOK
TOTALT: ~1.62 NOK per 10 min samtale
```

**Med Twilio Trial:** 1000 minutter gratis! 🎉

---

## 🎯 Neste steg - Ekstra features:

### 1. Automatic Booking Creation ⏳
- Opprett booking automatisk når all info er samlet
- Send SMS-bekreftelse
- Oppdater calendar

### 2. Voicemail ⏳
- Hvis ingen svarer, ta opp melding
- Lagre i database
- Send notifikasjon til admin

### 3. Call Recording ⏳
```javascript
<Record 
  action="/api/webhooks/twilio/voice/recording" 
  maxLength="600"
  playBeep="true"
/>
```

### 4. Multi-language Support ⏳
- Detekter språk automatisk
- Bytt voice basert på språk
- Oppdater GPT-4 prompt

### 5. Call Transfer ⏳
- Hvis AI ikke kan hjelpe, send til ekte person
- `<Dial>` TwiML command

---

## 🔍 Debugging Tips:

### Problem: Ingen lyd når du ringer

**Løsning:**
1. Sjekk Twilio webhook er konfigurert riktig
2. Verifiser at API er oppe: `https://lyx-api.fly.dev/health`
3. Sjekk at voice endpoint responderer:
   ```bash
   curl -X POST https://lyx-api.fly.dev/api/webhooks/twilio/voice \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "CallSid=TEST123&From=%2B4712345678&To=%2B46724004859"
   ```

### Problem: AI svarer ikke naturlig

**Løsning:**
1. Juster GPT-4 temperature (0.7 = balansert)
2. Oppdater system prompt i `aiVoiceService.mjs`
3. Test med forskjellige input-fraser

### Problem: Database errors

**Løsning:**
1. Verifiser RLS policies er korrekte
2. Sjekk at `anon` role har INSERT/UPDATE tilgang
3. Test manuelt i Supabase SQL Editor

---

## 📞 Support:

Hvis du har problemer:
1. Sjekk API-logger
2. Se Twilio Console → Monitor → Logs
3. Verifiser database med SQL-query
4. Test hver komponent separat

---

## ✅ Sjekkliste:

- [ ] Database-tabell opprettet (`ai_voice_sessions`)
- [ ] Twilio Voice webhook konfigurert
- [ ] Test-anrop gjennomført
- [ ] Voice session lagret i database
- [ ] AI responderer naturlig på norsk
- [ ] Call status updates mottas

---

**Når alt er ferdig, er LYXba klar til å ta imot bookinger på telefon! 🎉**

**TEST_MODE er aktivert**, så alle anrop går til deg først. 
Når systemet er testet og fungerer, kan du skru av TEST_MODE.

---

_Opprettet: 6. desember 2024_
_Status: Kode ferdig, venter på database + Twilio config_
