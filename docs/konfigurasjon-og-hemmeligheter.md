# Konfigurasjon og Hemmeligheter - LYXso

**Dokumenttype:** Miljøvariabler og konfigurasjon  
**Målgruppe:** Utviklere og DevOps  
**Sist oppdatert:** 29. november 2024

---

## 📋 Oversikt

Dette dokumentet lister ALLE miljøvariabler og hemmeligheter som kreves for å kjøre LYXso i dev, staging og produksjon.

**VIKTIG:**
- ❌ ALDRI commit filer med ekte nøkler til Git (`.env`, `.env.local`, `.env.production`)
- ✅ Bruk `.env.example` som mal (uten ekte verdier)
- ✅ Lagre produksjonshemmeligheter i Vercel/Fly.io miljøvariabler eller secret manager
- ✅ Roter alle nøkler regelmessig (minst hvert kvartal)

---

## 🗂️ Miljøer

| Miljø | Beskrivelse | Deploy-plattform |
|-------|-------------|------------------|
| **local** | Lokal utvikling på utviklermaskin | N/A |
| **dev** | Felles dev-miljø for testing | Vercel (preview) + Fly.io (dev) |
| **staging** | Pre-prod miljø for QA | Vercel (preview) + Fly.io (staging) |
| **prod** | Produksjon (live) | Vercel (prod) + Fly.io (prod) |

---

## 🔐 Supabase

### `SUPABASE_URL`
- **Brukes av:** Backend (lyx-api), Frontend (lyxso-app)
- **Miljøer:** local, dev, staging, prod
- **Beskrivelse:** Basis-URL til Supabase-prosjektet
- **Format:** `https://xxxxx.supabase.co`
- **Hvor får man det:** Supabase Dashboard → Settings → API
- **Eksempel:** `https://abcdefghijklmnop.supabase.co`

### `SUPABASE_ANON_KEY`
- **Brukes av:** Frontend (lyxso-app) som `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Miljøer:** local, dev, staging, prod
- **Beskrivelse:** Public anon key for klient-side tilgang. Denne er TRYGG å eksponere i frontend da den er beskyttet av RLS.
- **Format:** `eyJhbGci...` (JWT token)
- **Hvor får man det:** Supabase Dashboard → Settings → API → anon public
- **Eksempel:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...`

### `SUPABASE_SERVICE_ROLE_KEY`
- **Brukes av:** Backend (lyx-api)
- **Miljøer:** local, dev, staging, prod
- **Beskrivelse:** Service role key med FULL tilgang til databasen. Bypasser RLS. MÅ ALDRI brukes i frontend eller committes til Git.
- **Format:** `eyJhbGci...` (JWT token)
- **Hvor får man det:** Supabase Dashboard → Settings → API → service_role
- **⚠️ KRITISK:** Denne nøkkelen gir full tilgang. Roter umiddelbart hvis den lekkes.
- **Eksempel:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...` (annen enn anon)

---

## 🔑 Autentisering & Autorisasjon

### `NEXTAUTH_SECRET`
- **Brukes av:** Frontend (lyxso-app) - hvis NextAuth brukes
- **Miljøer:** dev, staging, prod (ikke local)
- **Beskrivelse:** Secret for signering av JWT tokens i NextAuth
- **Format:** Random string, minst 32 tegn
- **Hvordan generere:** `openssl rand -base64 32` eller `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
- **Eksempel:** `X9f2Kp7mN3qR8sT1vW4yZ6bC9dE2gH5j`
- **📝 Notis:** Supabase Auth brukes nå, så NextAuth kan være unødvendig. Verifiser før produksjon.

### `NEXTAUTH_URL`
- **Brukes av:** Frontend (lyxso-app) - hvis NextAuth brukes
- **Miljøer:** dev, staging, prod
- **Beskrivelse:** Public URL til frontend-applikasjonen
- **Format:** `https://domain.com`
- **Eksempel lokal:** `http://localhost:3000`
- **Eksempel prod:** `https://lyxso.no`

### Google OAuth (hvis aktivert)
Supabase håndterer OAuth, men du må konfigurere i Supabase Dashboard:

**Supabase Dashboard → Authentication → Providers → Google:**
- Client ID fra Google Cloud Console
- Client Secret fra Google Cloud Console
- Redirect URL: `https://[YOUR_SUPABASE_PROJECT].supabase.co/auth/v1/callback`

---

## 🤖 AI-integrasjoner

### `OPENAI_API_KEY`
- **Brukes av:** Backend (lyx-api)
- **Miljøer:** dev (valgfri), staging, prod
- **Beskrivelse:** API-nøkkel for OpenAI (GPT-4, GPT-3.5, etc.)
- **Format:** `sk-...`
- **Hvor får man det:** https://platform.openai.com/api-keys
- **Kostnad:** Pay-as-you-go (ca. $0.01-0.10 per 1000 tokens avhengig av modell)
- **Eksempel:** `sk-proj-abc123def456ghi789jkl...`
- **⚠️ KRITISK:** Roter umiddelbart hvis lekket. Kan føre til store kostnader.

### `OPENAI_MODEL` (valgfri)
- **Brukes av:** Backend (lyx-api)
- **Miljøer:** local, dev, staging, prod
- **Beskrivelse:** Hvilken OpenAI-modell som skal brukes som standard
- **Standard:** `gpt-4-turbo-preview` (hvis ikke satt)
- **Alternativer:** `gpt-4o`, `gpt-4o-mini`, `gpt-3.5-turbo`
- **Eksempel:** `gpt-4o-mini` (billigere for testing)

### `OPENAI_ORGANIZATION` (valgfri)
- **Brukes av:** Backend (lyx-api)
- **Miljøer:** prod (hvis organisasjonskonto)
- **Beskrivelse:** OpenAI Organization ID for kostnadsstyring
- **Format:** `org-...`
- **Eksempel:** `org-abc123def456`

### `ANTHROPIC_API_KEY` (alternativ til OpenAI)
- **Brukes av:** Backend (lyx-api)
- **Miljøer:** dev (valgfri), staging, prod
- **Beskrivelse:** API-nøkkel for Anthropic Claude
- **Format:** `sk-ant-...`
- **Hvor får man det:** https://console.anthropic.com/
- **Eksempel:** `sk-ant-api03-abc123def456...`

### `ANTHROPIC_MODEL` (valgfri)
- **Standard:** `claude-3-opus-20240229`
- **Alternativer:** `claude-3-sonnet-20240229`, `claude-3-haiku-20240307`

---

## 💳 Betaling

### Vipps
**Status:** Planlagt integrasjon

### `VIPPS_CLIENT_ID`
- **Brukes av:** Backend (lyx-api)
- **Miljøer:** dev (test), staging (test), prod
- **Beskrivelse:** Client ID fra Vipps Portal
- **Hvor får man det:** https://portal.vipps.no/
- **Test vs Prod:** Separate nøkler for test (MT) og produksjon

### `VIPPS_CLIENT_SECRET`
- **Brukes av:** Backend (lyx-api)
- **Miljøer:** dev (test), staging (test), prod
- **Beskrivelse:** Client Secret fra Vipps Portal
- **⚠️ KRITISK:** Hold hemmelig

### `VIPPS_MERCHANT_SERIAL_NUMBER` (MSN)
- **Brukes av:** Backend (lyx-api)
- **Beskrivelse:** Unikt nummer per merchant
- **Eksempel:** `123456`

### `VIPPS_SUBSCRIPTION_KEY`
- **Brukes av:** Backend (lyx-api)
- **Beskrivelse:** Ocp-Apim-Subscription-Key
- **To nøkler:** Primary og Secondary (roter mellom disse)

### Stripe (alternativ/tillegg)
**Status:** Til vurdering

### `STRIPE_SECRET_KEY`
- **Brukes av:** Backend (lyx-api)
- **Miljøer:** dev (test), staging (test), prod
- **Format:** `sk_test_...` (test) eller `sk_live_...` (prod)
- **Hvor får man det:** https://dashboard.stripe.com/apikeys

### `STRIPE_PUBLISHABLE_KEY`
- **Brukes av:** Frontend (lyxso-app) som `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- **Format:** `pk_test_...` (test) eller `pk_live_...` (prod)
- **Trygg å eksponere:** Ja, denne er public

### `STRIPE_WEBHOOK_SECRET`
- **Brukes av:** Backend (lyx-api)
- **Beskrivelse:** For å verifisere webhooks fra Stripe
- **Format:** `whsec_...`

---

## 📊 Regnskap

### Fiken

### `FIKEN_CLIENT_ID`
- **Brukes av:** Backend (lyx-api)
- **Miljøer:** staging, prod
- **Hvor får man det:** https://fiken.no/developer

### `FIKEN_CLIENT_SECRET`
- **Brukes av:** Backend (lyx-api)
- **⚠️ KRITISK:** Hold hemmelig

### `FIKEN_REDIRECT_URI`
- **Brukes av:** Backend (lyx-api)
- **Format:** `https://api.lyxso.no/integrations/fiken/callback`

### Tripletex

### `TRIPLETEX_CLIENT_ID`
- **Brukes av:** Backend (lyx-api)
- **Hvor får man det:** https://tripletex.no/developer

### `TRIPLETEX_CLIENT_SECRET`
- **Brukes av:** Backend (lyx-api)

### PowerOffice

### `POWEROFFICE_CLIENT_ID`
- **Brukes av:** Backend (lyx-api)
- **Hvor får man det:** https://powerofficego.no/developer

### `POWEROFFICE_CLIENT_SECRET`
- **Brukes av:** Backend (lyx-api)

**📝 Notis:** Regnskapsintegrasjoner er OAuth-baserte. Tokens lagres i Supabase per org.

---

## 📧 E-post & SMS

### SendGrid (e-post)

### `SENDGRID_API_KEY`
- **Brukes av:** Backend (lyx-api), Frontend (lyxso-app for transaksjonelle e-poster)
- **Miljøer:** dev (optional), staging, prod
- **Hvor får man det:** https://app.sendgrid.com/settings/api_keys
- **Format:** `SG.xxxx...`
- **Eksempel:** `SG.abc123def456ghi789jkl...`

### `SENDGRID_FROM_EMAIL`
- **Brukes av:** Backend (lyx-api)
- **Format:** `no-reply@lyxso.no`
- **Må være verifisert:** Ja, i SendGrid Dashboard

### `SENDGRID_FROM_NAME`
- **Standard:** `LYXso`

### Twilio (SMS)

### `TWILIO_ACCOUNT_SID`
- **Brukes av:** Backend (lyx-api)
- **Hvor får man det:** https://console.twilio.com/

### `TWILIO_AUTH_TOKEN`
- **Brukes av:** Backend (lyx-api)
- **⚠️ KRITISK:** Hold hemmelig

### `TWILIO_PHONE_NUMBER`
- **Format:** `+4712345678`
- **Beskrivelse:** Norsk nummer kjøpt via Twilio for SMS-utsendelse

---

## 📱 Markedsføring & Annonser

### Meta (Facebook/Instagram)

### `META_APP_ID`
- **Brukes av:** Backend (lyx-api) for Marketing API
- **Miljøer:** dev, staging, prod
- **Hvor får man det:** https://developers.facebook.com/apps/

### `META_APP_SECRET`
- **Brukes av:** Backend (lyx-api)
- **⚠️ KRITISK:** Hold hemmelig

### `META_ACCESS_TOKEN`
- **Brukes av:** Backend (lyx-api)
- **Type:** System User Token (long-lived)
- **Hvordan få:** Business Manager → System Users → Generate Token
- **Scope:** `ads_management`, `ads_read`, `business_management`

### Google Ads

### `GOOGLE_ADS_DEVELOPER_TOKEN`
- **Brukes av:** Backend (lyx-api)
- **Hvor får man det:** https://ads.google.com/aw/apicenter

### `GOOGLE_ADS_CLIENT_ID`
- **Brukes av:** Backend (lyx-api)
- **OAuth:** Ja (bruker Google Cloud Console OAuth-app)

### `GOOGLE_ADS_CLIENT_SECRET`
- **Brukes av:** Backend (lyx-api)

### `GOOGLE_ADS_REFRESH_TOKEN`
- **Brukes av:** Backend (lyx-api)
- **Hvordan få:** Kjør OAuth-flow én gang, lagre refresh token

---

## 📈 Analytics & Feilhåndtering

### Sentry (Error tracking)

### `SENTRY_DSN`
- **Brukes av:** Backend (lyx-api), Frontend (lyxso-app) som `NEXT_PUBLIC_SENTRY_DSN`
- **Miljøer:** staging, prod (ikke local)
- **Hvor får man det:** https://sentry.io/ → Project Settings → Client Keys (DSN)
- **Format:** `https://xxxx@xxxx.ingest.sentry.io/xxxx`
- **Trygg å eksponere:** Ja, DSN er public

### `SENTRY_AUTH_TOKEN`
- **Brukes av:** CI/CD for source maps upload
- **Miljøer:** CI/CD (GitHub Actions)
- **⚠️ KRITISK:** Lagre som GitHub Secret, ikke i repo

### Google Analytics

### `NEXT_PUBLIC_GA_TRACKING_ID`
- **Brukes av:** Frontend (lyxso-app)
- **Format:** `G-XXXXXXXXXX` (GA4) eller `UA-XXXXXXXXX-X` (Universal)
- **Trygg å eksponere:** Ja

---

## 🖥️ Frontend (Next.js / lyxso-app)

### `NEXT_PUBLIC_API_URL`
- **Brukes av:** Frontend (lyxso-app)
- **Miljøer:** local, dev, staging, prod
- **Beskrivelse:** URL til backend API (lyx-api)
- **Eksempel lokal:** `http://localhost:4000`
- **Eksempel prod:** `https://api.lyxso.no`

### `NEXT_PUBLIC_SUPABASE_URL`
- **Verdi:** Samme som `SUPABASE_URL`
- **Trygg å eksponere:** Ja

### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Verdi:** Samme som `SUPABASE_ANON_KEY`
- **Trygg å eksponere:** Ja (beskyttet av RLS)

### `NEXT_PUBLIC_APP_URL`
- **Brukes av:** Frontend (lyxso-app)
- **Beskrivelse:** Public URL til frontend (for callbacks, redirects, osv.)
- **Eksempel lokal:** `http://localhost:3000`
- **Eksempel prod:** `https://lyxso.no`

### `NODE_ENV`
- **Verdier:** `development`, `production`, `test`
- **Settes automatisk:** Av Next.js build-prosess

---

## 🖥️ Backend (lyx-api)

### `PORT`
- **Standard:** `4000`
- **Beskrivelse:** Port som Fastify server lytter på

### `NODE_ENV`
- **Verdier:** `development`, `production`, `test`

### `CORS_ORIGIN`
- **Brukes av:** Backend (lyx-api) for CORS-konfigurasjon
- **Eksempel lokal:** `http://localhost:3000`
- **Eksempel prod:** `https://lyxso.no`
- **Format:** Kommaseparert liste: `https://lyxso.no,https://www.lyxso.no`

### `JWT_SECRET` (hvis egen JWT-håndtering)
- **Beskrivelse:** For signering av egne JWT tokens (utover Supabase)
- **Hvordan generere:** `openssl rand -base64 32`

---

## 🔧 Diverse / Fremtidige integrasjoner

### Brønnøysundregistrene

### `BRREG_API_URL`
- **Standard:** `https://data.brreg.no/enhetsregisteret/api/enheter/`
- **Beskrivelse:** Åpen API, krever ingen nøkkel

### OpenStreetMap / Kartdata

### `MAPBOX_ACCESS_TOKEN` (hvis Mapbox brukes)
- **Brukes av:** Frontend (lyxso-app) som `NEXT_PUBLIC_MAPBOX_TOKEN`
- **Hvor får man det:** https://account.mapbox.com/access-tokens/

### Azure Computer Vision (for bildeanalyse)

### `AZURE_COMPUTER_VISION_KEY`
- **Brukes av:** Backend (lyx-api)
- **Beskrivelse:** For automatisk analyse av opplastede bilder (skader, dekkslitasje, osv.)

### `AZURE_COMPUTER_VISION_ENDPOINT`
- **Format:** `https://[region].api.cognitive.microsoft.com/`

---

## 📂 Eksempel: `.env.example`-fil

```bash
# ==============================================
# SUPABASE
# ==============================================
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# ==============================================
# FRONTEND (Next.js)
# ==============================================
NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ==============================================
# BACKEND API
# ==============================================
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# ==============================================
# AI
# ==============================================
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o-mini
# ANTHROPIC_API_KEY=sk-ant-...

# ==============================================
# BETALING (valgfritt i lokal dev)
# ==============================================
# VIPPS_CLIENT_ID=
# VIPPS_CLIENT_SECRET=
# VIPPS_MERCHANT_SERIAL_NUMBER=
# VIPPS_SUBSCRIPTION_KEY=

# ==============================================
# REGNSKAP (valgfritt i lokal dev)
# ==============================================
# FIKEN_CLIENT_ID=
# FIKEN_CLIENT_SECRET=

# ==============================================
# E-POST & SMS (valgfritt i lokal dev)
# ==============================================
# SENDGRID_API_KEY=
# SENDGRID_FROM_EMAIL=no-reply@lyxso.no
# TWILIO_ACCOUNT_SID=
# TWILIO_AUTH_TOKEN=
# TWILIO_PHONE_NUMBER=+4712345678

# ==============================================
# MARKEDSFØRING (valgfritt i lokal dev)
# ==============================================
# META_APP_ID=
# META_APP_SECRET=
# META_ACCESS_TOKEN=

# ==============================================
# ANALYTICS & ERROR TRACKING (prod only)
# ==============================================
# NEXT_PUBLIC_GA_TRACKING_ID=
# NEXT_PUBLIC_SENTRY_DSN=
# SENTRY_AUTH_TOKEN=
```

---

## ✅ Sjekkliste før deploy

### Local / Dev:
- [ ] `SUPABASE_URL` og `SUPABASE_ANON_KEY` er satt
- [ ] `SUPABASE_SERVICE_ROLE_KEY` er satt (backend)
- [ ] `OPENAI_API_KEY` er satt (hvis du tester AI)
- [ ] `NEXT_PUBLIC_API_URL` peker til riktig backend

### Staging:
- [ ] Alle Supabase-nøkler er satt (staging-prosjekt)
- [ ] AI-nøkler er satt
- [ ] Test-nøkler for betaling (Vipps MT, Stripe test)
- [ ] SendGrid API key er satt
- [ ] Sentry DSN er satt

### Produksjon:
- [ ] ✅ Alle Supabase-nøkler er satt (prod-prosjekt)
- [ ] ✅ AI-nøkler er satt og har kreditt
- [ ] ✅ Prod-nøkler for betaling (Vipps, Stripe live)
- [ ] ✅ Regnskapssystem OAuth er konfigurert
- [ ] ✅ SendGrid og Twilio er konfigurert
- [ ] ✅ Meta og Google Ads API er konfigurert
- [ ] ✅ Sentry error tracking er aktivt
- [ ] ✅ Google Analytics er satt
- [ ] ✅ Alle hemmeligheter er lagret i Vercel/Fly.io (IKKE i Git)
- [ ] ✅ Service role key er ALDRI eksponert i frontend
- [ ] ✅ Alle nøkler har blitt rotert før første deploy

---

## 🔄 Rotasjon av hemmeligheter

**Anbefalt frekvens:**
- **Hvert kvartal:** Alle API-nøkler
- **Umiddelbart:** Hvis lekkasje mistenkes
- **Ved offboarding:** Når en ansatt slutter

**Prosess:**
1. Generer ny nøkkel i leverandørens portal
2. Oppdater miljøvariabel i deploy-plattform (Vercel/Fly.io)
3. Deploy på nytt
4. Verifiser at systemet fungerer
5. Slett gammel nøkkel i leverandørens portal
6. Logg rotasjonen i dokumentasjon

---

## 🚨 Hva gjør du hvis en hemmelighet lekkes?

1. **Roter nøkkelen UMIDDELBART** i leverandørens portal
2. Oppdater miljøvariabler i alle miljøer
3. Deploy på nytt til prod
4. Sjekk leverandørens usage logs for mistenkelig aktivitet
5. Varsle team og eventuelt kunder hvis nødvendig
6. Dokumenter hendelsen
7. Vurder om andre nøkler også må roteres

---

**Spørsmål?** Kontakt tech lead eller se intern dokumentasjon.

---

**Sist oppdatert:** 29. november 2024
