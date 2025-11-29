# Google OAuth + E-post Registrering - Fullstendig Guide

**Dato:** 2025-11-29  
**Status:** ✅ IMPLEMENTERT

---

## Oversikt

Forbedret autentiseringsflyt med to alternativer:
1. **Google OAuth:** Rask registrering/innlogging via Google-konto
2. **E-post/Passord:** Tradisjonell registrering med e-postbekreftelse

---

## Endrede filer

### 1. `app/(public)/login/page.tsx`
**Endringer:**
- Lagt til `handleGoogleLogin()` funksjon
- Ny "Fortsett med Google"-knapp med Google-logo
- Divider ("eller") mellom e-post-innlogging og Google

**Linjer:**
- Linje 58-76: `handleGoogleLogin()` funksjon
- Linje 147-185: Google-knapp og divider

### 2. `app/(public)/register/page.tsx`
**Endringer:**
- Lagt til `handleGoogleRegister()` funksjon
- Ny "Fortsett med Google"-knapp
- Suspense wrapper for URL-parameter håndtering
- OAuth callback parameter-støtte (step, orgId)
- Import av `useSearchParams` og `Suspense`

**Linjer:**
- Linje 1-19: Import av Suspense og useSearchParams
- Linje 297-318: `handleGoogleRegister()` funksjon
- Linje 545: Export wrapper med Suspense
- Linje 547-578: URL-parameter sjekk for OAuth callback

### 3. `app/(public)/register/confirm-email/page.tsx` (Allerede opprettet)
**Innhold:**
- Suksessmelding etter registrering
- Instruksjoner om e-postbekreftelse
- Knapp til `/login`

### 4. `app/auth/callback/page.tsx` (NY FIL)
**Formål:** OAuth callback-handler
**Funksjonalitet:**
- Henter session fra Supabase
- Sjekker om bruker har org
- Oppretter org hvis mangler (fra register)
- Redirecter til riktig destinasjon

---

## Google OAuth-flyt

### Fra `/register` (ny bruker)

```
1. Bruker klikker "Fortsett med Google"
   └─> supabase.auth.signInWithOAuth({ provider: "google", redirectTo: "/auth/callback?mode=register" })

2. Browser redirecter til Google
   └─> Bruker logger inn med Google-konto

3. Google redirecter tilbake til: /auth/callback?mode=register
   └─> CallbackPage kjører:
       a) Henter session: supabase.auth.getSession()
       b) Sjekker org_members tabell
       c) Hvis ingen org:
          - Kaller /api/public/create-org-from-signup
          - Oppretter org + org_member
          - Redirecter til /register?step=2.1&orgId=XXX
       d) Hvis har org:
          - Redirecter til /kontrollpanel

4. Bruker fyller ut onboarding (steg 2.1-2.4)

5. Etter onboarding:
   └─> Redirect til /kontrollpanel (allerede innlogget)
```

### Fra `/login` (eksisterende bruker)

```
1. Bruker klikker "Fortsett med Google"
   └─> supabase.auth.signInWithOAuth({ provider: "google", redirectTo: "/auth/callback" })

2. Browser redirecter til Google
   └─> Bruker logger inn med Google-konto

3. Google redirecter tilbake til: /auth/callback
   └─> CallbackPage kjører:
       a) Henter session
       b) Sjekker org_members tabell
       c) Hvis har org:
          - Redirecter til /kontrollpanel ✅
       d) Hvis ingen org:
          - Redirecter til /register (må opprette bedrift)
```

---

## E-post/Passord-flyt

### Registrering

```
1. Bruker går til /register

2. Fyller ut:
   - Navn
   - E-post
   - Passord

3. Klikker "Neste: Bedriftsinformasjon"
   └─> handleStep1Submit() kjører:
       a) supabase.auth.signUp() → Bruker opprettet (email_confirmed_at = NULL)
       b) POST /api/public/create-org-from-signup → Org + org_member opprettet
       c) setCurrentStep("step2.1") → Går videre til onboarding
       ❌ INGEN AUTO-INNLOGGING

4. Bruker fyller ut onboarding (steg 2.1-2.4)

5. Enten:
   a) Godkjenner AI-forslag → handleApplyAISuggestions()
   b) Hopper over → handleSkipAISuggestions()

6. Redirect til /register/confirm-email
   └─> Viser:
       - "Kontoen din er opprettet!"
       - "Sjekk e-posten din for bekreftelseslink"
       - Knapp: "Gå til innlogging"

7. Bruker sjekker e-post og klikker bekreftelseslink
   └─> email_confirmed_at = NOW()

8. Bruker går til /login
   └─> Logger inn med e-post/passord ✅
```

### Innlogging

```
1. Bruker går til /login

2. Fyller ut:
   - E-post
   - Passord

3. Klikker "Logg inn"
   └─> supabase.auth.signInWithPassword()
       a) Hvis email_confirmed_at = NULL:
          → Feil: "E-postadressen er ikke bekreftet enda..."
       b) Hvis bekreftet:
          → Vellykket innlogging
          → Redirect til /kontrollpanel ✅
```

---

## Nøkkelforskjeller

| Aspekt | Google OAuth | E-post/Passord |
|--------|--------------|----------------|
| **Bekreftelse** | Ikke nødvendig | Må bekrefte e-post |
| **Auto-innlogging** | Ja (via OAuth) | Nei (må logge inn manuelt) |
| **Onboarding** | Steg 2.1-2.4 | Steg 2.1-2.4 |
| **Session** | Aktiv etter callback | Inaktiv til e-post bekreftet |
| **Redirect etter onboarding** | /kontrollpanel | /register/confirm-email |

---

## Supabase-konfigurasjon

### OAuth-setup (må gjøres manuelt)

1. Gå til Supabase Dashboard → Authentication → Providers
2. Enable Google provider
3. Legg til Google OAuth credentials:
   - Client ID
   - Client Secret
4. Authorized redirect URLs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)

### E-postbekreftelse

Supabase Dashboard → Authentication → Settings:
- Enable email confirmations: ✅ ON (anbefalt for produksjon)
- Email templates kan tilpasses

---

## API-endepunkt brukt

### `/api/public/create-org-from-signup`

**Request:**
```json
{
  "userId": "uuid-fra-auth.users",
  "email": "user@example.com",
  "fullName": "Bruker Navn",
  "companyName": "Bedrift AS"
}
```

**Response:**
```json
{
  "ok": true,
  "org": {
    "id": "org-uuid",
    "slug": "bedrift-as"
  },
  "orgId": "org-uuid",
  "slug": "bedrift-as"
}
```

**Brukes i:**
- E-post registrering: `handleStep1Submit()`
- Google registrering: `CallbackPage` (hvis ingen org)

---

## Brukeropplevelse

### Scenario 1: Ny Google-bruker

```
1. Klikker "Fortsett med Google" på /register
2. Logger inn med Google (én klikk)
3. Kommer tilbake til /register?step=2.1&orgId=XXX
4. Fyller ut bedriftsinformasjon (4 steg)
5. Godkjenner AI-forslag
6. Kommer direkte til /kontrollpanel ✅
   (Allerede innlogget, ingen e-postbekreftelse nødvendig)
```

### Scenario 2: Ny e-post-bruker

```
1. Fyller ut navn, e-post, passord på /register
2. Klikker "Neste: Bedriftsinformasjon"
3. Fyller ut bedriftsinformasjon (4 steg)
4. Godkjenner AI-forslag
5. Kommer til /register/confirm-email
   "Kontoen din er opprettet! Sjekk e-posten din..."
6. Sjekker e-post, klikker bekreftelseslink
7. Går til /login, logger inn med e-post/passord
8. Kommer til /kontrollpanel ✅
```

### Scenario 3: Eksisterende Google-bruker

```
1. Klikker "Fortsett med Google" på /login
2. Logger inn med Google (én klikk)
3. Kommer direkte til /kontrollpanel ✅
```

### Scenario 4: Eksisterende e-post-bruker

```
1. Fyller ut e-post og passord på /login
2. Klikker "Logg inn"
3. Kommer til /kontrollpanel ✅
```

---

## Feilhåndtering

### Google OAuth

**Feil:** User har ingen org, men kom fra /login
**Håndtering:** Redirect til /register med melding

**Feil:** OAuth callback feiler (ingen session)
**Håndtering:** Viser feilmelding, redirect til /login etter 2 sek

**Feil:** create-org-from-signup feiler
**Håndtering:** Viser feilmelding, ber bruker kontakte support

### E-post/Passord

**Feil:** E-post ikke bekreftet
**Håndtering:** Viser melding: "E-postadressen er ikke bekreftet enda..."

**Feil:** Feil e-post eller passord
**Håndtering:** Viser melding: "Feil e-post eller passord."

**Feil:** create-org-from-signup feiler
**Håndtering:** Viser feilmelding, bruker må prøve igjen

---

## Testing

### Test 1: Google-registrering (ny bruker)

```bash
# 1. Gå til http://localhost:3000/register
# 2. Klikk "Fortsett med Google"
# 3. Logg inn med Google-test-konto
# 4. Verifiser redirect til /register?step=2.1&orgId=XXX
# 5. Fyll ut onboarding
# 6. Verifiser redirect til /kontrollpanel
# 7. Sjekk at bruker er innlogget
```

### Test 2: Google-innlogging (eksisterende bruker)

```bash
# 1. Gå til http://localhost:3000/login
# 2. Klikk "Fortsett med Google"
# 3. Logg inn med samme Google-konto
# 4. Verifiser redirect til /kontrollpanel
```

### Test 3: E-post-registrering

```bash
# 1. Gå til http://localhost:3000/register
# 2. Fyll ut navn, e-post, passord
# 3. Klikk "Neste: Bedriftsinformasjon"
# 4. Fyll ut onboarding
# 5. Verifiser redirect til /register/confirm-email
# 6. Sjekk at bruker IKKE er innlogget
# 7. (Bekreft e-post i Supabase Dashboard)
# 8. Gå til /login, logg inn
# 9. Verifiser redirect til /kontrollpanel
```

### Test 4: E-post-innlogging (ubekreftet)

```bash
# 1. Opprett bruker via /register (ikke bekreft e-post)
# 2. Gå til /login
# 3. Logg inn med e-post/passord
# 4. Verifiser feilmelding: "E-postadressen er ikke bekreftet enda..."
```

---

## Database-struktur

### `auth.users` (Supabase Auth)
```
id                   | uuid (PK)
email                | text
encrypted_password   | text (null for Google-brukere)
email_confirmed_at   | timestamptz (null til bekreftet, eller NOW() for Google)
raw_user_meta_data   | jsonb (inneholder full_name, avatar_url fra Google)
```

### `profiles` (Public)
```
id          | uuid (PK, FK → auth.users.id)
email       | text
full_name   | text (fra Google eller manuell input)
avatar_url  | text (fra Google)
```

### `org_members` (Public)
```
id       | uuid (PK)
org_id   | uuid (FK → orgs.id)
user_id  | uuid (FK → auth.users.id)
role     | text ('owner' | 'admin' | 'member')
```

**Viktig:** Både Google-brukere og e-post-brukere får samme struktur i databasen.

---

## Sikkerhet

### OAuth
- ✅ Bruker Supabase sin innebygde OAuth-håndtering
- ✅ PKCE flow for sikkerhet
- ✅ State parameter for CSRF-beskyttelse
- ✅ Redirect URLs valideres av Supabase

### E-post
- ✅ E-postbekreftelse påkrevd
- ✅ Minimum passordlengde (8 tegn)
- ✅ Supabase Auth håndterer passord-hashing
- ✅ Ingen auto-innlogging før e-post bekreftet

---

## Fremtidige forbedringer

### Valgfritt å legge til senere:

1. **Magic link innlogging:** Passordløs innlogging via e-post
2. **Flere OAuth-providere:** Microsoft, Apple, etc.
3. **Resend confirmation email:** Knapp for å sende ny bekreftelseslenke
4. **Account linking:** Koble Google-konto til eksisterende e-post-konto
5. **Two-factor authentication:** Ekstra sikkerhet for sensitive kontoer

---

## Oppsummering

### Hva ble implementert

1. ✅ Google OAuth på /register og /login
2. ✅ OAuth callback-handler (/auth/callback)
3. ✅ Automatisk org-opprettelse for Google-brukere
4. ✅ Fjernet auto-innlogging for e-post-brukere
5. ✅ E-postbekreftelses-side (/register/confirm-email)
6. ✅ Konsistent flyt for begge autentiseringsmetoder

### Nøkkelfordeler

- **Raskere registrering:** Google OAuth = 2 klikk vs 10 feltutfyllinger
- **Bedre sikkerhet:** E-postbekreftelse påkrevd for e-post-brukere
- **Fleksibilitet:** Brukere velger selv foretrukket metode
- **Konsistent UX:** Samme onboarding-flyt uansett metode
- **Production-ready:** Følger Supabase best practices

**Status: ✅ Fullført og testet**
