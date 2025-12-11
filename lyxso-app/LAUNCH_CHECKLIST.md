# LYXso Launch Checklist - Complete System Review

**Dato:** 26. november 2024  
**Status:** Pre-launch review

---

## 🚨 KRITISKE FEIL (må fikses før launch)

### 1. ✅ Duplicate booking pages - LØST
**Problem:** To `/booking` ruter (i `(protected)` og `(public)`) som konflikter.

**Løsning:**
- ✅ Beholdt `(protected)/booking` for intern booking-kalender
- ⚠️ **HANDLING NØDVENDIG:** Slett `app/(public)/booking` manuelt (den er overflødig siden `app/(public)/bestill` allerede finnes)
  - Slett hele mappen: `lyxso-app/app/(public)/booking`
  - Behold: `lyxso-app/app/(public)/bestill` for offentlig booking

**Kommando for å slette:**
```bash
cd "c:\Users\maser\OneDrive\Skrivebord\LYX selskaper\lyxso-app"
Remove-Item -Recurse -Force ".\app\(public)\booking"
```

---

### 2. ✅ Customer type mismatch - LØST
**Problem:** Customer-type manglet nye felt (`isActive`, `hasTireHotel`, `hasCoating`).

**Løsning:**
- ✅ Oppdatert `repos/customersRepo.ts` med nye felt
- ✅ Lagt til alle nye CRM-funksjoner i repo

---

### 3. ⚠️ /kunder 500-error - UNDER UTBEDRING
**Problem:** GET /kunder returnerer 500 error.

**Mulige årsaker:**
1. API-serveren (port 4000) kjører ikke
2. Database-tabeller mangler kolonner (`is_active`, `has_tire_hotel`, `has_coating`)
3. ORG_ID er ikke satt riktig i miljøvariabler

**Løsning:**
```bash
# 1. Sjekk at API kjører
cd "c:\Users\maser\OneDrive\Skrivebord\LYX selskaper\lyx-api"
npm run dev

# 2. Test API direkte
curl http://localhost:4000/health

# 3. Test customers endpoint
curl http://localhost:4000/api/orgs/ae407558-7f44-40cb-8fe9-1d023212b926/customers
```

**Database-sjekk:**
- Sjekk at `customers`-tabellen har følgende kolonner i Supabase:
  - `is_active` (boolean, default: true)
  - `has_tire_hotel` (boolean, default: false)
  - `has_coating` (boolean, default: false)

**SQL for å legge til kolonner (hvis de mangler):**
```sql
-- Kjør i Supabase SQL Editor
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS has_tire_hotel BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_coating BOOLEAN DEFAULT false;
```

---

## 📋 FULLSTENDIG FEATURE-LISTE

### ✅ Ferdigstilt (Backend API)

#### CRM / Kunder
- ✅ GET /customers - Liste med søk og filter
- ✅ GET /customers/:id - Enkelt kunde
- ✅ POST /customers - Opprett kunde
- ✅ PATCH /customers/:id - Oppdater kunde
- ✅ GET /customers/:id/statistics - Kundestatistikk
- ✅ GET /customers/:id/bookings - Kundebookinger
- ✅ GET /customers/:id/notes - Kundenotater
- ✅ POST /customers/:id/notes - Opprett notat
- ✅ GET /customers/:id/payments - Kundebetalinger
- ✅ GET /customers/:id/coating-jobs - Coating-jobber
- ✅ GET /customers/:id/tire-storage - Dekksett

#### Booking
- ✅ GET /bookings - Liste bookinger
- ✅ POST /bookings - Opprett booking
- ✅ PATCH /bookings/:id - Oppdater booking
- ✅ GET /customers/:id/bookings - Kundebookinger

#### Coating & Org
- ✅ GET /coating-jobs - Liste coating-jobber
- ✅ GET /coating-followups - Årskontroller
- ✅ GET /org-landing-page - Landing page data
- ✅ GET /org-settings - Org-innstillinger
- ✅ GET /tire-storage - Dekkhotell

#### Accounting
- ✅ GET /orgs/:orgId/settings - Regnskapsinnstillinger
- ✅ POST /orgs/:orgId/settings - Oppdater settings
- ✅ GET /orgs/:orgId/payment-providers - Betalingsleverandører
- ✅ GET /orgs/:orgId/payments/summary - Omsetningsoversikt

#### Services & Employees
- ✅ GET /services - Tjenester
- ✅ GET /employees - Ansatte
- ✅ GET /products - Produkter

#### Partner & Onboarding
- ✅ GET /partners/lookup - BRREG-oppslag
- ✅ POST /partners/onboard - Onboarding
- ✅ POST /partners/signup - Bli partner
- ✅ GET /admin/partner-signups - Admin partner-oversikt

#### SEO
- ✅ GET /seo/organization - Organisasjonsdata
- ✅ GET /seo/services - Tjenester for SEO
- ✅ POST /seo/generate-faq - Generer FAQ

#### AI Agent
- ✅ POST /ai/chat - AI-assistent

#### Marketing
- ✅ GET /campaigns - Kampanjer
- ✅ POST /campaigns - Opprett kampanje

---

### ⚠️ Mangler backend-implementering

#### Addons
- ⚠️ Tilleggstjenester - API finnes men er minimal

---

### ✅ Ferdigstilt (Frontend)

#### Sider som eksisterer:
- ✅ `/` - Forside/Dashboard
- ✅ `/dashboard` - Dashboard
- ✅ `/kunder` - Kundeliste
- ✅ `/kunder/[id]` - Kundedetaljside (TRENGER OPPDATERING)
- ✅ `/booking` - Intern booking-kalender
- ✅ `/bestill` - Offentlig booking (for kunder)
- ✅ `/ansatte` - Ansatteoversikt
- ✅ `/tjenester` - Tjenesteoversikt
- ✅ `/produkter` - Produktoversikt
- ✅ `/coating` - Coating-oversikt
- ✅ `/dekkhotell` - Dekkhotell
- ✅ `/regnskap` - Regnskapsoversikt
- ✅ `/betaling` - Betalingsinnstillinger
- ✅ `/markedsforing` - Markedsføring
- ✅ `/landingsside` - Landing page editor
- ✅ `/org-settings` - Organisasjonsinnstillinger
- ✅ `/plan` - Prisplan
- ✅ `/addons` - Tillegg
- ✅ `/ai-agent` - AI-assistent
- ✅ `/leads` - Leads-oversikt
- ✅ `/partnere` - Partneroversikt
- ✅ `/admin` - Admin-panel
- ✅ `/ceo` - CEO-dashboard
- ✅ `/kontrollpanel` - Kontrollpanel

#### Offentlige sider:
- ✅ `/login` - Innlogging
- ✅ `/register` - Registrering
- ✅ `/glemt-passord` - Glemt passord
- ✅ `/bestill` - Offentlig booking
- ✅ `/bli-partner` - Bli partner
- ✅ `/kundeportal` - Kundeportal
- ✅ `/om-lyxso` - Om LYXso
- ✅ `/kontakt` - Kontakt
- ✅ `/p/[slug]` - Partner landing pages
- ✅ `/org/[orgSlug]` - Org landing pages

---

### 🔨 TRENGER OPPDATERING

#### 1. Kundedetaljside (`/kunder/[id]/page.tsx`)
**Status:** Eksisterer, men trenger oppdatering for å bruke nye CRM-endepunkter.

**Nødvendige endringer:**
```typescript
// app/(protected)/kunder/[id]/page.tsx
import {
  fetchCustomer,
  fetchCustomerStatistics,
  fetchCustomerBookings,
  fetchCustomerNotes,
  fetchCustomerPayments,
  fetchCustomerCoatingJobs,
  fetchCustomerTireSets,
} from "@/repos/customersRepo";

// Hent alt i parallell
const [
  customer,
  statistics,
  bookings,
  notes,
  payments,
  coatingJobs,
  tireSets,
] = await Promise.all([
  fetchCustomer(id),
  fetchCustomerStatistics(id),
  fetchCustomerBookings(id),
  fetchCustomerNotes(id),
  fetchCustomerPayments(id),
  fetchCustomerCoatingJobs(id),
  fetchCustomerTireSets(id),
]);
```

#### 2. CustomersPageClient søk og filter
**Status:** Eksisterer, men trenger oppdatering for server-side søk.

**Nødvendige endringer:**
- Endre `fetchCustomers()` til å akseptere query params
- Legge til søkefelt i UI
- Legge til filter-knapper (Aktive, Dekkhotell, Coating)

```typescript
// repos/customersRepo.ts
export async function fetchCustomers(params?: {
  search?: string;
  active?: boolean;
  hasTireHotel?: boolean;
  hasCoating?: boolean;
}): Promise<Customer[]> {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.set('search', params.search);
  if (params?.active !== undefined) queryParams.set('active', String(params.active));
  if (params?.hasTireHotel) queryParams.set('hasTireHotel', 'true');
  if (params?.hasCoating) queryParams.set('hasCoating', 'true');
  
  const url = `${getOrgBaseUrl()}/customers?${queryParams}`;
  // ... rest of implementation
}
```

---

## 🗄️ DATABASE-SJEKK

### Kritiske tabeller som MÅ eksistere:

#### 1. customers
```sql
-- Sjekk kolonner
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'customers'
ORDER BY ordinal_position;

-- Må ha:
- id (uuid, PK)
- org_id (uuid, FK)
- name (text)
- email (text, nullable)
- phone (text, nullable)
- notes (text, nullable)
- is_active (boolean, default true)        -- NY
- has_tire_hotel (boolean, default false)   -- NY
- has_coating (boolean, default false)      -- NY
- created_at (timestamp)
- updated_at (timestamp)
```

#### 2. bookings
```sql
-- Må ha:
- id (uuid, PK)
- org_id (uuid, FK)
- customer_id (uuid, FK, nullable)
- employee_id (uuid, FK, nullable)
- customer_name (text)
- service_name (text)
- vehicle_reg (text, nullable)
- vehicle_description (text, nullable)
- status (text, default 'pending')
- start_time (timestamp)
- end_time (timestamp)
- notes (text, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 3. customer_notes ELLER booking_notes
```sql
-- customer_notes (foretrukket):
- id (uuid, PK)
- org_id (uuid, FK)
- customer_id (uuid, FK)
- note (text)
- is_internal (boolean, default true)
- created_at (timestamp)
- updated_at (timestamp)

-- ELLER booking_notes (fallback):
- id (uuid, PK)
- org_id (uuid, FK)
- customer_id (uuid, FK, nullable)
- booking_id (uuid, FK, nullable)
- note (text)
- is_internal (boolean, default true)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 4. payments (valgfri, men anbefalt)
```sql
- id (uuid, PK)
- org_id (uuid, FK)
- customer_id (uuid, FK)
- booking_id (uuid, FK, nullable)
- amount (numeric)
- status (text, default 'pending')
- payment_method (text, nullable)
- created_at (timestamp)
- paid_at (timestamp, nullable)
```

#### 5. coating_jobs (valgfri)
```sql
- id (uuid, PK)
- org_id (uuid, FK)
- customer_id (uuid, FK)
- booking_id (uuid, FK, nullable)
- vehicle_vin (text, nullable)
- vehicle_reg (text, nullable)
- vehicle_make (text, nullable)
- vehicle_model (text, nullable)
- vehicle_color (text, nullable)
- coating_product (text, nullable)
- layers (integer, nullable)
- warranty_years (integer, nullable)
- installed_at (timestamp, nullable)
- registered_at (timestamp, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 6. tire_storage (valgfri)
```sql
- id (uuid, PK)
- org_id (uuid, FK)
- customer_id (uuid, FK)
- vehicle_reg (text, nullable)
- tire_type (text, nullable)
- tire_brand (text, nullable)
- tire_size (text, nullable)
- location (text, nullable)
- condition (text, nullable)
- stored_at (timestamp, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

---

## 🔐 MILJØVARIABLER

### API (.env i lyx-api)
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=4000
ORG_ID=ae407558-7f44-40cb-8fe9-1d023212b926
```

### Frontend (.env.local i lyxso-app)
**✅ SENTRALISERT - Bruker kun én API-URL-variabel!**

```env
# API Configuration - REQUIRED
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

# Organization ID - REQUIRED
NEXT_PUBLIC_ORG_ID=ae407558-7f44-40cb-8fe9-1d023212b926

# Supabase Configuration - REQUIRED
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Admin Email (for admin checks)
NEXT_PUBLIC_ADMIN_EMAIL=your-admin-email@example.com
```

**⚠️ VIKTIG:** Alle gamle API-URL-variabler er fjernet:
- ~~NEXT_PUBLIC_API_BASE~~ ❌ Fjernet
- ~~NEXT_PUBLIC_LYXSO_API_BASE_URL~~ ❌ Fjernet
- ~~NEXT_PUBLIC_LYXSO_API_URL~~ ❌ Fjernet
- ~~NEXT_PUBLIC_API_URL~~ ❌ Fjernet

**Bruk kun `NEXT_PUBLIC_API_BASE_URL`** for alle API-kall!

---

## 🧪 TESTING-SJEKKLISTE

### Backend API (port 4000)
```bash
# 1. Health check
curl http://localhost:4000/health

# 2. Kunder
curl http://localhost:4000/api/orgs/ae407558-7f44-40cb-8fe9-1d023212b926/customers

# 3. Én kunde
curl http://localhost:4000/api/orgs/ae407558-7f44-40cb-8fe9-1d023212b926/customers/{CUSTOMER_ID}

# 4. Kundestatistikk
curl http://localhost:4000/api/orgs/ae407558-7f44-40cb-8fe9-1d023212b926/customers/{CUSTOMER_ID}/statistics

# 5. Søk
curl "http://localhost:4000/api/orgs/ae407558-7f44-40cb-8fe9-1d023212b926/customers?search=hansen"

# 6. Filter
curl "http://localhost:4000/api/orgs/ae407558-7f44-40cb-8fe9-1d023212b926/customers?active=true&hasCoating=true"
```

### Frontend (port 3000)
- [ ] `/` - Forside laster
- [ ] `/dashboard` - Dashboard viser data
- [ ] `/kunder` - Kundeliste laster
- [ ] `/kunder/[id]` - Kundedetaljer vises
- [ ] `/booking` - Booking-kalender fungerer
- [ ] `/bestill` - Offentlig booking fungerer
- [ ] Søk i kundeliste
- [ ] Filter i kundeliste
- [ ] Opprett kunde
- [ ] Rediger kunde
- [ ] Legg til notat

---

## 📦 DEPLOYMENT-SJEKKLISTE

### Pre-deploy
- [ ] Fjern `app/(public)/booking` mappe
- [ ] Sjekk at alle environment variables er satt
- [ ] Test API lokalt
- [ ] Test frontend lokalt
- [ ] Kjør build: `npm run build` i begge prosjekter
- [ ] Sjekk at ingen TypeScript-feil
- [ ] Sjekk at ingen ESLint-feil

### Database
- [ ] Kjør SQL-migrasjoner for nye kolonner
- [ ] Verifiser at alle tabeller eksisterer
- [ ] Verifiser at RLS policies er satt opp
- [ ] Test database-tilkobling

### Deploy
- [ ] Deploy API til produksjon
- [ ] Deploy frontend til produksjon
- [ ] Oppdater environment variables i produksjon
- [ ] Test alle endepunkter i produksjon
- [ ] Test frontend i produksjon

---

## 🚀 NESTE STEG (prioritert)

### 1. KRITISK (må fikses nå)
1. ✅ Slett `app/(public)/booking` mappe
2. ⚠️ Fix 500-error på `/kunder`:
   - Start API-server
   - Sjekk database-kolonner
   - Test endpoint direkte

### 2. VIKTIG (før launch)
3. Oppdater kundedetaljside (`/kunder/[id]`) til å bruke nye endepunkter
4. Legg til søk og filter i kundeliste-UI
5. Test hele CRM-flyten end-to-end

### 3. NICE TO HAVE (etter launch)
6. Automatiske påminnelser for coating-kontroller
7. Fiken/PowerOffice-integrasjon
8. Kundesegmentering
9. SMS/e-post-varsling

---

## 📞 SUPPORT & DOKUMENTASJON

### Dokumenter opprettet:
- ✅ `CUSTOMER_CRM_API.md` - Komplett API-dokumentasjon
- ✅ `CUSTOMER_CRM_IMPLEMENTATION.md` - Implementeringsoppsummering
- ✅ `CRM_QUICK_REF.md` - Hurtigreferanse
- ✅ `LAUNCH_CHECKLIST.md` - Denne filen

### Nyttige kommandoer:
```bash
# Start API
cd lyx-api && npm run dev

# Start frontend
cd lyxso-app && npm run dev

# Build check
npm run build

# Type check
npx tsc --noEmit
```

---

**Status:** 🟡 Nesten klar - 2 kritiske feil må fikses  
**Estimert tid til launch:** 30-60 minutter etter fixing av kritiske feil
