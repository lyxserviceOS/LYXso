# 🔧 Twilio Voice Feilsøking - "Det ringer ikke"

## Problem: Ingen svar når du ringer +46 72 400 48 59

---

## ✅ Sjekkliste - Gå gjennom i rekkefølge:

### 1️⃣ Er API-en deployed og kjører? (VIKTIG!)

**Sjekk status:**
```bash
# Sjekk om API er oppe:
curl https://lyx-api.fly.dev/health

# Eller i nettleser:
https://lyx-api.fly.dev/health
```

**Forventet svar:**
```json
{"status": "ok", "timestamp": "2024-12-06T23:30:00.000Z"}
```

**Hvis ikke:**
```bash
cd "c:\Users\maser\OneDrive\Skrivebord\LYX selskaper\lyx-api"

# Deploy API til fly.io:
fly deploy

# Eller bruk deploy script:
cd ..
.\deploy-fly.ps1
```

---

### 2️⃣ Er voice webhook konfigurert i Twilio Console?

**Gå til Twilio Console:**
1. Logg inn: https://console.twilio.com/
2. Gå til: **Phone Numbers** → **Manage** → **Active Numbers**
3. Klikk på: **+46 72 400 48 59**
4. Scroll ned til **"Voice Configuration"**

**Sjekk at dette er satt:**
```
A CALL COMES IN:
  Webhook: https://lyx-api.fly.dev/api/webhooks/twilio/voice
  Method: HTTP POST

CALL STATUS CHANGES (valgfritt):
  Webhook: https://lyx-api.fly.dev/api/webhooks/twilio/voice/status
  Method: HTTP POST
```

**Hvis ikke satt:**
- Lim inn webhook URL
- Velg "HTTP POST"
- Klikk **"Save"**

---

### 3️⃣ Test webhook URL direkte

**Test at endepunktet svarer:**
```bash
curl -X POST https://lyx-api.fly.dev/api/webhooks/twilio/voice ^
  -H "Content-Type: application/x-www-form-urlencoded" ^
  -d "CallSid=TEST123&From=%2B4712345678&To=%2B46724004859&CallStatus=ringing"
```

**Forventet svar (TwiML XML):**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" timeout="5" language="nb-NO">
    <Say voice="Google.nb-NO-Wavenet-A" language="nb-NO">
      Hei! Velkommen til [bedrift]. Hvordan kan jeg hjelpe deg?
    </Say>
  </Gather>
  ...
</Response>
```

**Hvis du får 404 eller error:**
- API-en er ikke deployed med siste kode
- Kjør `fly deploy` på nytt

---

### 4️⃣ Sjekk Twilio-kreditter og status

**Logg inn på Twilio:**
1. Gå til: https://console.twilio.com/
2. Sjekk **"Console Home"** - se at du har kreditter
3. Gå til **"Monitor"** → **"Logs"** → **"Calls"**
4. Ring nummeret mens du ser på logs
5. Se om det kommer inn et anrop

**Mulige problemer:**
- ❌ **Ingen kreditter** → Legg til betalingskort eller bruk trial credits
- ❌ **Nummer ikke aktivert** → Aktiver nummeret i Twilio Console
- ❌ **Geographic restrictions** → Sjekk at nummeret kan motta anrop fra Norge

---

### 5️⃣ Er database-tabellen opprettet?

**Sjekk i Supabase:**
```sql
-- Gå til: https://supabase.com/dashboard/project/gedoxtrdylqxyyvfjmtb/editor
-- Kjør denne:
SELECT * FROM ai_voice_sessions LIMIT 1;
```

**Hvis tabellen ikke finnes:**
- Gå til Supabase SQL Editor
- Åpne `lyx-api/create_ai_voice_sessions.sql`
- Kopier innholdet
- Lim inn i SQL Editor
- Klikk **"Run"**

---

### 6️⃣ Sjekk at Twilio credentials er korrekte

**I `.env` filen:**
```bash
cd "c:\Users\maser\OneDrive\Skrivebord\LYX selskaper\lyx-api"
cat .env | findstr TWILIO
```

**Må inneholde:**
```
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+46724004859
```

**Hvis mangler eller feil:**
- Oppdater `.env` med korrekte verdier
- Redeploy API: `fly deploy`

---

## 🔍 Avansert feilsøking:

### Sjekk Twilio Debugger

1. Gå til: https://console.twilio.com/debugger
2. Ring nummeret
3. Se hva som skjer i real-time
4. Sjekk feilmeldinger

**Vanlige feilmeldinger:**

**"Unable to reach webhook URL"**
```
→ API-en er ikke oppe eller URL er feil
→ Fix: Deploy API eller rett webhook URL
```

**"Webhook returned invalid TwiML"**
```
→ API returnerer feil format
→ Fix: Sjekk API-logger for errors
```

**"No response from webhook"**
```
→ API svarer ikke innen 15 sekunder
→ Fix: Sjekk at database-tilkobling fungerer
```

---

### Test API lokalt først

```bash
cd "c:\Users\maser\OneDrive\Skrivebord\LYX selskaper\lyx-api"

# Start API lokalt:
npm run dev

# I annen terminal, test webhook:
curl -X POST http://localhost:8080/api/webhooks/twilio/voice ^
  -H "Content-Type: application/x-www-form-urlencoded" ^
  -d "CallSid=TEST123&From=%2B4712345678&To=%2B46724004859&CallStatus=ringing"
```

**Hvis lokalt fungerer men ikke på fly.io:**
- Redeploy: `fly deploy`
- Sjekk fly logs: `fly logs`

---

### Sjekk API logs på fly.io

```bash
cd "c:\Users\maser\OneDrive\Skrivebord\LYX selskaper\lyx-api"

# Se live logs:
fly logs

# Eller filtrer for voice webhook:
fly logs | findstr "voice"
```

**Ring nummeret mens logs kjører** - se etter:
```
📞 Incoming Twilio Voice call
Call details: { callSid: 'CA...', from: '+47...', ... }
```

---

## 🎯 Quick Fix Guide:

### Scenario 1: "Nummeret er ikke i bruk"
```
Problem: Twilio-nummeret er ikke aktivt
Fix: 
  1. Gå til Twilio Console
  2. Phone Numbers → Active Numbers
  3. Sjekk at +46 72 400 48 59 vises
  4. Klikk på det og verifiser at det er aktivt
```

### Scenario 2: "Webhook URL virker ikke"
```
Problem: API ikke deployed eller feil URL
Fix:
  1. cd "c:\Users\maser\OneDrive\Skrivebord\LYX selskaper\lyx-api"
  2. fly deploy
  3. Vent på deployment
  4. Test: curl https://lyx-api.fly.dev/health
```

### Scenario 3: "Database error"
```
Problem: ai_voice_sessions tabell mangler
Fix:
  1. Gå til Supabase SQL Editor
  2. Åpne create_ai_voice_sessions.sql
  3. Kopier og kjør SQL
  4. Verifiser: SELECT * FROM ai_voice_sessions;
```

### Scenario 4: "Ingen ting skjer"
```
Problem: Voice webhook ikke konfigurert i Twilio
Fix:
  1. Twilio Console → Phone Numbers
  2. Velg +46 72 400 48 59
  3. Voice Configuration → A CALL COMES IN
  4. Webhook: https://lyx-api.fly.dev/api/webhooks/twilio/voice
  5. Method: POST
  6. Save
```

---

## ✅ Komplett sjekkliste før du ringer:

- [ ] API deployed til fly.io (`fly deploy`)
- [ ] API svarer på health check (`curl https://lyx-api.fly.dev/health`)
- [ ] Voice webhook endpoint svarer (`curl https://lyx-api.fly.dev/api/webhooks/twilio/voice`)
- [ ] Twilio webhook konfigurert i Console (Voice Configuration)
- [ ] Twilio-nummeret er aktivt (+46 72 400 48 59)
- [ ] Database-tabell `ai_voice_sessions` eksisterer
- [ ] Twilio credentials i `.env` er korrekte
- [ ] Du har Twilio-kreditter (sjekk Console Home)

---

## 🚀 Steg-for-steg fra scratch:

**Hvis ingenting fungerer, start her:**

```bash
# 1. Deploy API
cd "c:\Users\maser\OneDrive\Skrivebord\LYX selskaper\lyx-api"
fly deploy

# 2. Vent på deployment (30-60 sekunder)
fly status

# 3. Test at API er oppe
curl https://lyx-api.fly.dev/health

# 4. Test voice endpoint
curl -X POST https://lyx-api.fly.dev/api/webhooks/twilio/voice ^
  -H "Content-Type: application/x-www-form-urlencoded" ^
  -d "CallSid=TEST&From=%2B47&To=%2B46724004859"

# 5. Gå til Twilio Console og konfigurer webhook
# URL: https://lyx-api.fly.dev/api/webhooks/twilio/voice
# Method: POST

# 6. Ring nummeret: +46 72 400 48 59

# 7. Sjekk logs hvis det ikke fungerer
fly logs
```

---

## 📞 Hva forventet når det fungerer:

```
Du ringer: +46 72 400 48 59
  ↓
Tuuuut... tuuuut... (ringer 2-3 ganger)
  ↓
🤖 "Hei! Velkommen til [bedriftsnavn]. Hvordan kan jeg hjelpe deg?"
  ↓
Du snakker → AI svarer
```

**Hvis du hører:**
- ❌ **"Nummeret er ikke i bruk"** → Nummeret ikke aktivt i Twilio
- ❌ **Ingenting (bare stille)** → Webhook ikke konfigurert
- ❌ **"An application error has occurred"** → API error, sjekk logs
- ✅ **AI stemme som snakker** → **DET FUNGERER!** 🎉

---

## 💡 Tips:

**Hvis du fortsatt har problemer:**

1. **Start med å teste webhook URL direkte i nettleser:**
   ```
   https://lyx-api.fly.dev/api/webhooks/twilio/voice
   ```
   Skal gi TwiML XML eller error message

2. **Sjekk Twilio Debugger real-time:**
   https://console.twilio.com/debugger
   
3. **Se fly.io logs mens du ringer:**
   ```bash
   fly logs --tail
   # Ring nummeret i annen vindu
   ```

4. **Test SMS webhook først (hvis det fungerer):**
   ```bash
   # SMS webhook fungerer sikkert allerede
   # Send SMS til +46 72 400 48 59
   # Hvis SMS fungerer men ikke voice → voice webhook ikke konfigurert
   ```

---

**Lykke til! Ring meg (metaforisk) hvis du fortsatt har problemer.** 😊
