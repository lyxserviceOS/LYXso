# Database Migration Guide - Service & Tyre Settings

## Quick Start

Du har 3 alternativer for å kjøre migreringen:

---

## ✅ Alternativ 1: Supabase Dashboard (ANBEFALT)

1. Gå til [Supabase Dashboard](https://app.supabase.com)
2. Velg ditt prosjekt
3. Klikk på "SQL Editor" i venstre meny
4. Klikk "New Query"
5. Kopier innholdet fra `lyx-api/migrations/add_org_settings_columns.sql`
6. Lim inn i SQL-editoren
7. Klikk "Run" (eller Ctrl+Enter)
8. Verifiser at du får melding: "✅ Alle kolonner lagt til vellykket!"

**Dette er den tryggeste metoden** og krever ingen lokale verktøy.

---

## Alternativ 2: Supabase CLI

Hvis du har Supabase CLI installert:

```bash
cd lyx-api
supabase db push
```

Eller kjør migrering direkte:

```bash
supabase db execute migrations/add_org_settings_columns.sql
```

---

## Alternativ 3: psql (PostgreSQL CLI)

Hvis du har psql installert og DATABASE_URL:

```bash
cd lyx-api
psql $DATABASE_URL -f migrations/add_org_settings_columns.sql
```

---

## 🧪 Verifisering Etter Migrering

### Sjekk at kolonnene er lagt til:

```sql
-- Kjør i Supabase SQL Editor
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'orgs'
  AND column_name IN (
    'service_categories',
    'default_service_duration',
    'price_display_mode',
    'tyre_storage_enabled',
    'tyre_storage_capacity',
    'tyre_ai_enabled',
    'tyre_pricing'
  )
ORDER BY column_name;
```

Du skal se 7 kolonner returnert.

### Test endpoints:

```bash
# Erstatt YOUR_ORG_ID med faktisk org ID
ORG_ID="ae407558-7f44-40cb-8fe9-1d023212b926"

# Test service-settings
curl "http://localhost:4000/api/orgs/$ORG_ID/service-settings"

# Test tyre-settings
curl "http://localhost:4000/api/orgs/$ORG_ID/tyre-settings"
```

---

## 🚀 Deploy Backend

Etter vellykket migrering:

```bash
cd lyx-api

# 1. Test lokalt først
npm start

# 2. Test endpoints (se over)

# 3. Deploy til Fly.io
fly deploy

# 4. Verifiser i prod
curl "https://api.lyxso.no/api/orgs/$ORG_ID/service-settings"
```

---

## 🔍 Troubleshooting

### Problem: "column already exists"

Dette er OK - scriptet bruker `IF NOT EXISTS`, så det er safe å kjøre flere ganger.

### Problem: "permission denied"

Du må ha admin-tilgang til Supabase-prosjektet. Bruk Supabase Dashboard istedenfor CLI.

### Problem: Endpoints gir fortsatt 404

1. Sjekk at `orgSettings.mjs` er oppdatert
2. Restart backend: `npm start` (lokalt) eller `fly deploy` (prod)
3. Sjekk at orgId er riktig i URL

---

## 📝 Neste Steg Etter Migration

1. ✅ Test alle 4 nye endpoints
2. ✅ Oppdater frontend for å bruke service-settings og tyre-settings
3. 🔄 Implementer AI-persistens (neste oppgave)
4. 🔄 Legg til schema-validering med Zod

---

**Dato:** 2024-12-07  
**Status:** Migreringsscript klar for kjøring  
**Fil:** `lyx-api/migrations/add_org_settings_columns.sql`
