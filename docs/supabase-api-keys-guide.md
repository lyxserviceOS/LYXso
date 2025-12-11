# Supabase API-nøkler – Forklaring og Sikkerhet

## Hva du ser nå i Supabase Dashboard

### 1. **Publishable and secret API keys** (Ny arkitektur - RLS v2)
Dette er Supabase sin **nye** autentiseringsmetode som bruker Edge-nøkler.

**Status:** "Ikke opprettet keys" + tilbud om å opprette

**ANBEFALING:** **IKKE opprett** disse ennå. Dette er en nyere funksjon som krever migrasjon. Vi skal fortsette å bruke Legacy-nøklene.

---

### 2. **Legacy anon, service_role API keys** (Nåværende arkitektur)
Dette er de **tradisjonelle** JWT-baserte nøklene som LYXso bruker i dag.

Du ser to nøkler her:

#### **anon (public)** 
- ✅ **Trygg å bruke i frontend**
- Brukes i `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Respekterer RLS-policies (Row Level Security)
- Kan committes til git (men best practice er å holde den i .env)

#### **service_role (secret)**
- ⚠️ **MÅ ALDRI EKSPONERES**
- Full admin-tilgang, ignorerer RLS
- Brukes kun i backend (`lyx-api`)
- MÅ være i `.env` og ALDRI committes til git

---

## Hva skal du gjøre NÅ?

### ✅ RIKTIG FREMGANGSMÅTE:

**IKKE trykk på "Disable JWT-based API keys"** – det vil ødelegge all eksisterende funksjonalitet.

**GJØR DETTE i stedet:**

1. **Se på service_role-nøkkelen:**
   - Er det en knapp med "Reveal" eller "Show"?
   - Trykk på den og **kopier** den nye service_role-nøkkelen

2. **Oppdater lokale .env-filer:**
   - `lyxso-app/.env.local` → `NEXT_PUBLIC_SUPABASE_ANON_KEY` (anon-key)
   - `lyx-api/.env` → `SUPABASE_SERVICE_ROLE_KEY` (service_role-key)

3. **Sjekk at gammel nøkkel IKKE finnes i git:**
   - Kjør kommandoen jeg ga deg tidligere
   - Hvis den finnes: invalidér den ved å rotere nøkler

---

## Hvordan ROTERE nøkler (hvis gammel nøkkel er lekket)

**I Supabase Dashboard → Settings → API:**

1. Under "Legacy anon, service_role API keys"
2. Finn "service_role" secret key
3. Se etter en knapp: **"Rotate"** eller **"Generate new"**
4. Trykk på den → nye nøkler genereres
5. **Gamle nøkler blir ugyldig**
6. Kopier de nye nøklene og legg inn i `.env`-filene dine

---

## Er Supabase-prosjektet mitt trygt NÅ?

### ✅ **JA – hvis:**
- service_role-nøkkelen **IKKE** er committet til git
- service_role-nøkkelen **IKKE** brukes i frontend (kun i lyx-api backend)
- RLS-policies er aktivert på alle tabeller
- anon-nøkkelen brukes i frontend (respekterer RLS)

### ⚠️ **NEI – hvis:**
- service_role-nøkkelen ligger i git-historikk
- service_role-nøkkelen brukes i frontend (`NEXT_PUBLIC_` miljøvariabel)
- RLS er slått av på kritiske tabeller

---

## Neste steg

1. **Bekreft:** Se om det finnes en "Rotate"-knapp ved service_role-nøkkelen
2. **Roter:** Generer nye nøkler hvis gammel kan være lekket
3. **Oppdater:** Legg inn nye nøkler i `.env`-filer (IKKE commit til git)
4. **Test:** Start opp både frontend og backend med nye nøkler

---

## Spørsmål til deg

**Se på Supabase Dashboard nå:**

1. Er det en **"Rotate"**-knapp ved service_role-nøkkelen?
2. Eller en **"Regenerate"**-knapp?
3. Eller bare **"Reveal/Show"** for å se nøkkelen?

**Fortell meg hva du ser, så guider jeg deg videre.**
