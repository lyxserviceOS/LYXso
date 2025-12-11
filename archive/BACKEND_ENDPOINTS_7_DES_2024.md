# Backend Endpoints - Implementert 7. desember 2024

## Oppsummering

Alle manglende org-spesifikke endpoints er nå implementert i `lyx-api/routes/orgSettings.mjs`.

---

## ✅ Implementerte Endpoints

### 1. Modules Endpoint (Eksisterte allerede)

**GET /api/orgs/:orgId/modules**
- Hent aktiverte moduler for organisasjonen
- Response: `{ modules: string[] }`

**PATCH /api/orgs/:orgId/modules**  
- Oppdater aktiverte moduler
- Body: `{ enabledModules: string[] }`

---

### 2. Booking Settings (Eksisterte allerede)

**GET /api/orgs/:orgId/booking-settings**
- Hent booking-innstillinger
- Response: Booking-konfigurasjon

**PUT /api/orgs/:orgId/booking-settings**
- Oppdater booking-innstillinger
- Body: Booking-konfigurasjon

---

### 3. Service Settings (✨ NY)

**GET /api/orgs/:orgId/service-settings**
- Hent service-innstillinger
- Response:
```json
{
  "serviceSettings": {
    "serviceCategories": ["Bilpleie", "PPF", "Coating"],
    "defaultServiceDuration": 60,
    "priceDisplayMode": "always",
    "activeServices": [...]
  }
}
```

**PUT /api/orgs/:orgId/service-settings**
- Oppdater service-innstillinger
- Body:
```json
{
  "serviceCategories": ["Bilpleie", "PPF"],
  "defaultServiceDuration": 90,
  "priceDisplayMode": "on_request"
}
```

**Validering:**
- `serviceCategories`: Array (required)
- `defaultServiceDuration`: 15-480 minutter
- `priceDisplayMode`: "always" | "on_request" | "hidden"

---

### 4. Tyre Settings (✨ NY)

**GET /api/orgs/:orgId/tyre-settings**
- Hent dekkhotell-innstillinger
- Response:
```json
{
  "tyreSettings": {
    "storageEnabled": true,
    "storageCapacity": 200,
    "aiEnabled": true,
    "pricing": {
      "summer": 500,
      "winter": 600,
      "allseason": 550
    }
  }
}
```

**PUT /api/orgs/:orgId/tyre-settings**
- Oppdater dekkhotell-innstillinger
- Body:
```json
{
  "storageEnabled": true,
  "storageCapacity": 300,
  "aiEnabled": true,
  "pricing": {
    "summer": 600,
    "winter": 700,
    "allseason": 650
  }
}
```

**Validering:**
- `storageEnabled`: boolean
- `storageCapacity`: positive integer
- `aiEnabled`: boolean
- `pricing`: object med summer/winter/allseason priser

---

## 📊 Database Fields

### Nye felt lagt til i `orgs` tabell (må sjekkes):

```sql
-- Service settings
service_categories JSONB DEFAULT '[]'::jsonb,
default_service_duration INTEGER DEFAULT 60,
price_display_mode TEXT DEFAULT 'always',

-- Tyre (dekkhotell) settings
tyre_storage_enabled BOOLEAN DEFAULT false,
tyre_storage_capacity INTEGER DEFAULT 0,
tyre_ai_enabled BOOLEAN DEFAULT false,
tyre_pricing JSONB DEFAULT '{"summer": 0, "winter": 0, "allseason": 0}'::jsonb
```

**Merk:** Disse feltene må legges til i database hvis de ikke eksisterer.

---

## 🔄 Migreringer Nødvendig

### SQL for å legge til manglende kolonner:

```sql
-- Service settings kolonner
ALTER TABLE orgs 
  ADD COLUMN IF NOT EXISTS service_categories JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS default_service_duration INTEGER DEFAULT 60,
  ADD COLUMN IF NOT EXISTS price_display_mode TEXT DEFAULT 'always';

-- Tyre settings kolonner
ALTER TABLE orgs
  ADD COLUMN IF NOT EXISTS tyre_storage_enabled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS tyre_storage_capacity INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tyre_ai_enabled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS tyre_pricing JSONB DEFAULT '{"summer": 0, "winter": 0, "allseason": 0}'::jsonb;

-- Kommenter på kolonnene
COMMENT ON COLUMN orgs.service_categories IS 'Array av service-kategorier som bilpleie, PPF, coating';
COMMENT ON COLUMN orgs.default_service_duration IS 'Standard varighet for tjenester i minutter';
COMMENT ON COLUMN orgs.price_display_mode IS 'Hvordan priser vises: always, on_request, hidden';
COMMENT ON COLUMN orgs.tyre_storage_enabled IS 'Om dekkhotell-modul er aktivert';
COMMENT ON COLUMN orgs.tyre_storage_capacity IS 'Maks antall dekksett som kan lagres';
COMMENT ON COLUMN orgs.tyre_ai_enabled IS 'Om AI-analyse for dekk er aktivert';
COMMENT ON COLUMN orgs.tyre_pricing IS 'Priser for dekklagring (summer, winter, allseason)';
```

---

## 🧪 Testing

### Manuell testing med curl:

```bash
# 1. Test GET service-settings
curl -X GET "http://localhost:4000/api/orgs/YOUR_ORG_ID/service-settings"

# 2. Test PUT service-settings
curl -X PUT "http://localhost:4000/api/orgs/YOUR_ORG_ID/service-settings" \
  -H "Content-Type: application/json" \
  -d '{
    "serviceCategories": ["Bilpleie", "PPF"],
    "defaultServiceDuration": 90,
    "priceDisplayMode": "always"
  }'

# 3. Test GET tyre-settings
curl -X GET "http://localhost:4000/api/orgs/YOUR_ORG_ID/tyre-settings"

# 4. Test PUT tyre-settings
curl -X PUT "http://localhost:4000/api/orgs/YOUR_ORG_ID/tyre-settings" \
  -H "Content-Type: application/json" \
  -d '{
    "storageEnabled": true,
    "storageCapacity": 200,
    "aiEnabled": true,
    "pricing": {
      "summer": 500,
      "winter": 600,
      "allseason": 550
    }
  }'
```

---

## 🔒 Sikkerhet

### Autentisering
Alle endpoints krever:
- Valid org ID
- Bruker må være medlem av organisasjonen (sjekkes via `getOrgId()`)

### Validering
- Alle input valideres før database-operasjoner
- Type-sjekker på alle felter
- Range-validering (f.eks. duration må være 15-480 min)
- Enum-validering (f.eks. priceDisplayMode må være valid verdi)

---

## 📝 Frontend Integrasjon

### Eksempel på hvordan frontend kan bruke disse:

```typescript
// Service Settings
const serviceSettings = await fetch(
  `${API_BASE}/api/orgs/${orgId}/service-settings`
).then(res => res.json());

await fetch(`${API_BASE}/api/orgs/${orgId}/service-settings`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    serviceCategories: ['Bilpleie', 'PPF'],
    defaultServiceDuration: 90,
    priceDisplayMode: 'always'
  })
});

// Tyre Settings
const tyreSettings = await fetch(
  `${API_BASE}/api/orgs/${orgId}/tyre-settings`
).then(res => res.json());

await fetch(`${API_BASE}/api/orgs/${orgId}/tyre-settings`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    storageEnabled: true,
    storageCapacity: 200,
    aiEnabled: true,
    pricing: { summer: 500, winter: 600, allseason: 550 }
  })
});
```

---

## 🚀 Deployment

### Pre-deployment checklist:
- [ ] Run migrations (add missing columns to orgs table)
- [ ] Test alle 4 nye/oppdaterte endpoints
- [ ] Verifiser at ingen 404s returneres fra frontend
- [ ] Check Sentry for errors etter deploy

### Deployment steps:
1. **Database Migration:**
   ```bash
   # Kjør SQL-migrering i Supabase
   psql $DATABASE_URL < migrations/add_org_settings_columns.sql
   ```

2. **Deploy Backend:**
   ```bash
   cd lyx-api
   fly deploy
   ```

3. **Verifiser:**
   ```bash
   curl https://api.lyxso.no/api/orgs/YOUR_ORG_ID/service-settings
   curl https://api.lyxso.no/api/orgs/YOUR_ORG_ID/tyre-settings
   ```

---

## 📊 Endpoints Oversikt

| Endpoint | Method | Status | Beskrivelse |
|----------|--------|--------|-------------|
| `/api/orgs/:orgId/modules` | GET | ✅ Eksisterte | Hent moduler |
| `/api/orgs/:orgId/modules` | PATCH | ✅ Eksisterte | Oppdater moduler |
| `/api/orgs/:orgId/booking-settings` | GET | ✅ Eksisterte | Hent booking-settings |
| `/api/orgs/:orgId/booking-settings` | PUT | ✅ Eksisterte | Oppdater booking-settings |
| `/api/orgs/:orgId/service-settings` | GET | ✨ NY | Hent service-settings |
| `/api/orgs/:orgId/service-settings` | PUT | ✨ NY | Oppdater service-settings |
| `/api/orgs/:orgId/tyre-settings` | GET | ✨ NY | Hent tyre-settings |
| `/api/orgs/:orgId/tyre-settings` | PUT | ✨ NY | Oppdater tyre-settings |

---

## 🎯 Neste Steg

1. **Database Migration** - Kjør SQL-script for å legge til nye kolonner
2. **Testing** - Test alle endpoints med Postman/curl
3. **Frontend Integration** - Oppdater frontend for å bruke nye endpoints
4. **AI Persistens** - Implementer lagring av AI-resultater (neste oppgave)
5. **Schema Validering** - Legg til Zod/AJV validering av AI-output

---

**Dato:** 2024-12-07  
**Status:** ✅ Backend endpoints implementert  
**Fil endret:** `lyx-api/routes/orgSettings.mjs`  
**Nye linjer:** ~280 linjer kode lagt til  
**Testing:** Mangler database-migrering og manual testing
