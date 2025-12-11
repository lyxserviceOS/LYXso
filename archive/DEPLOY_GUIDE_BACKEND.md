# DEPLOY GUIDE - Backend Endpoints

## 📋 Steg-for-steg Instruksjoner

### ✅ STEG 1: Database Migrering (5 minutter)

**1.1 Åpne Supabase Dashboard**
- Gå til https://app.supabase.com
- Logg inn
- Velg ditt LYXso-prosjekt

**1.2 Åpne SQL Editor**
- Klikk på "SQL Editor" i venstre sidemeny
- Klikk på "New Query" knappen

**1.3 Kopier SQL**
- Åpne filen: `lyx-api/migrations/add_org_settings_columns.sql`
- Kopier HELE innholdet (144 linjer)
- Lim inn i SQL Editor

**1.4 Kjør Migrering**
- Klikk "Run" knappen (eller trykk Ctrl+Enter)
- Vent på respons (tar ~2-5 sekunder)
- Du skal se: **"✅ Alle kolonner lagt til vellykket!"**

**1.5 Verifiser (Valgfritt)**
```sql
-- Kjør denne SQL for å verifisere:
SELECT column_name, data_type 
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

Du skal se **7 rader** returnert.

---

### ✅ STEG 2: Test Lokalt (Valgfritt, 10 minutter)

**2.1 Start Backend Lokalt**
```bash
cd lyx-api
npm start
```

Vent til du ser: `Server listening at http://0.0.0.0:4000`

**2.2A Test med Node Script (Anbefalt)**

Åpne **ny terminal**:
```bash
cd lyx-api
node test-org-settings.mjs
```

Du skal se output for alle 6 tests. Forventet resultat:
- ✅ GET /modules - Success
- ✅ GET /service-settings - Success
- ✅ GET /tyre-settings - Success
- ✅ GET /booking-settings - Success
- ✅ PUT /service-settings - Success
- ✅ PUT /tyre-settings - Success

**2.2B Eller test med curl:**

```bash
# Test service-settings GET
curl "http://localhost:4000/api/orgs/ae407558-7f44-40cb-8fe9-1d023212b926/service-settings"

# Test tyre-settings GET
curl "http://localhost:4000/api/orgs/ae407558-7f44-40cb-8fe9-1d023212b926/tyre-settings"

# Test service-settings PUT
curl -X PUT "http://localhost:4000/api/orgs/ae407558-7f44-40cb-8fe9-1d023212b926/service-settings" \
  -H "Content-Type: application/json" \
  -d '{"serviceCategories":["Bilpleie","PPF"],"defaultServiceDuration":90,"priceDisplayMode":"always"}'

# Test tyre-settings PUT
curl -X PUT "http://localhost:4000/api/orgs/ae407558-7f44-40cb-8fe9-1d023212b926/tyre-settings" \
  -H "Content-Type: application/json" \
  -d '{"storageEnabled":true,"storageCapacity":200,"aiEnabled":true,"pricing":{"summer":500,"winter":600,"allseason":550}}'
```

**2.3 Stop Lokal Server**
- Trykk Ctrl+C i terminalen hvor backend kjører

---

### ✅ STEG 3: Deploy til Produksjon (5 minutter)

**3.1 Sjekk at du er logget inn**
```bash
fly auth whoami
```

Hvis ikke logget inn:
```bash
fly auth login
```

**3.2 Deploy Backend**
```bash
cd lyx-api
fly deploy
```

Dette tar ca. **2-5 minutter**. Du vil se:
```
==> Building image
==> Pushing image to fly
==> Deploying
==> Monitoring deployment
```

Vent til du ser: **✅ Deployment successful!**

**3.3 Sjekk Logs (Valgfritt)**
```bash
fly logs
```

Se etter:
- `Server listening at ...`
- Ingen error-meldinger

**3.4 Test i Produksjon**

Erstatt `YOUR_ORG_ID` med faktisk org ID:

```bash
# Test service-settings
curl "https://api.lyxso.no/api/orgs/YOUR_ORG_ID/service-settings"

# Test tyre-settings
curl "https://api.lyxso.no/api/orgs/YOUR_ORG_ID/tyre-settings"
```

Forventet respons:
```json
{
  "serviceSettings": {
    "serviceCategories": [],
    "defaultServiceDuration": 60,
    "priceDisplayMode": "always",
    "activeServices": []
  }
}
```

---

## ✅ Verifisering - Alt Fungerer

### Frontend skal nå kunne:

1. **Hente modules:**
   ```typescript
   GET /api/orgs/:orgId/modules
   ```
   Status: 200 (ikke 404)

2. **Hente service-settings:**
   ```typescript
   GET /api/orgs/:orgId/service-settings
   ```
   Status: 200 (ikke 404)

3. **Hente tyre-settings:**
   ```typescript
   GET /api/orgs/:orgId/tyre-settings
   ```
   Status: 200 (ikke 404)

4. **Hente booking-settings:**
   ```typescript
   GET /api/orgs/:orgId/booking-settings
   ```
   Status: 200 (ikke 404)

### Test i Frontend

Åpne lyxso-app og sjekk:
- Ingen 404-errors i browser console
- Settings-sider laster uten feil
- Data vises korrekt

---

## 🔍 Troubleshooting

### Problem: "column already exists" i Supabase

**Løsning:** Dette er OK! Scriptet bruker `IF NOT EXISTS`, så det er safe.

### Problem: Endpoints gir fortsatt 404

**Sjekk:**
1. Er backend deployet? `fly status`
2. Er riktig URL brukt? `https://api.lyxso.no` (ikke localhost)
3. Er orgId korrekt?

### Problem: "permission denied" i Supabase

**Løsning:** Du må ha admin-tilgang til Supabase-prosjektet.

### Problem: Deploy feiler

**Sjekk:**
1. Er du logget inn på Fly? `fly auth whoami`
2. Er du i riktig mappe? `cd lyx-api`
3. Har du internett-tilgang?

---

## 📊 Oppsummering

Etter å ha fulgt alle 3 steg, har du:

✅ **Database:** 7 nye kolonner i `orgs` tabell  
✅ **Backend:** 4 nye endpoints live i produksjon  
✅ **Testing:** Verifisert at alt fungerer  
✅ **Frontend:** Ingen 404-errors lenger  

---

## 🎯 Neste Oppgaver

1. **Frontend Integration** - Oppdater frontend for å bruke nye endpoints
2. **AI Persistens** - Implementer lagring av AI-resultater
3. **Schema Validering** - Legg til Zod validering av AI-output
4. **Dokumentasjon** - Oppdater API-docs

---

**Estimert tid:** 20 minutter totalt  
**Dato:** 2024-12-07  
**Status:** Klar for deployment
