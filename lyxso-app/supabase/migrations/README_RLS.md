# RLS (Row Level Security) Implementering for LYXso

## 📋 Oversikt

Dette dokumentet beskriver den komplette RLS-implementeringen for LYXso ServiceOS. RLS sikrer at hver organisasjon (tenant) kun kan se og endre sine egne data i Supabase-databasen.

---

## 🎯 Hva er RLS?

**Row Level Security (RLS)** er PostgreSQL sin innebygde sikkerhet på rad-nivå. I stedet for å implementere multi-tenant logikk i applikasjonskoden, håndhever databasen selv at:

- En bruker i organisasjon A **aldri** kan se data fra organisasjon B
- Selv hvis noen hacker seg inn i frontend eller API, kan de ikke lese andres data
- Service-role (backend) har fortsatt full tilgang for admin-operasjoner

---

## 🏗️ Arkitektur

### Multi-tenant strategi

```
┌─────────────────────────────────────────────────────────┐
│                   LYXso Multi-Tenant                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Org A (LYX Bil)          Org B (Dekkhotell AS)        │
│  ├─ Kunder                ├─ Kunder                    │
│  ├─ Bookinger             ├─ Bookinger                 │
│  ├─ Dekksett              ├─ Dekksett                  │
│  └─ Ansatte               └─ Ansatte                   │
│                                                         │
│  RLS sikrer at data ALDRI blandes                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Hvordan RLS fungerer i LYXso

1. **Hver bruker tilhører én organisasjon**
   - Lagret i `profiles.org_id`
   - Settes ved registrering/invitasjon

2. **Hver datarad har org_id**
   - Alle tabeller (customers, bookings, services, osv.) har `org_id`-kolonne
   - Foreign key til `orgs(id)`

3. **RLS-policies sjekker org_id automatisk**
   - Ved SELECT: `WHERE org_id = get_user_org_id()`
   - Ved INSERT: `WITH CHECK (org_id = get_user_org_id())`
   - Ved UPDATE/DELETE: samme logikk

4. **Rollehierarki**
   - `owner`: Full kontroll over org
   - `admin`: Kan administrere data og brukere
   - `member`: Standard tilgang til org-data
   - `readonly`: Kun lesetilgang

---

## 📁 Migrasjoner

### Migrasjon 001: Basis RLS
**Fil:** `migrations/001_enable_rls.sql`

- Aktiverer RLS på alle hovedtabeller
- Lager `get_user_org_id()` hjelpefunksjon
- Grunnleggende policies for core-tabeller

**Status:** ✅ Implementert, men ikke komplett

### Migrasjon 002: Komplett RLS
**Fil:** `migrations/002_complete_rls_policies.sql`

- Aktiverer RLS på **alle** tabeller inkl. AI-moduler
- Legger til manglende policies
- Legger til rollehierarki (owner, admin, member)
- Håndterer spesialtilfeller (public endpoints, anon-tilgang)
- Verifiseringsverktøy

**Status:** ✅ Nylig implementert (29. nov 2024)

---

## 🔧 Hjelpefunksjoner

### `get_user_org_id()`
Returnerer org_id for innlogget bruker.

```sql
SELECT org_id FROM public.profiles WHERE id = auth.uid();
```

**Bruk:**
```sql
-- I en policy
USING (org_id = public.get_user_org_id())
```

### `is_org_admin()`
Sjekker om bruker er admin eller owner i sin org.

```sql
SELECT EXISTS (
  SELECT 1 FROM public.profiles
  WHERE id = auth.uid() 
  AND org_id = public.get_user_org_id()
  AND role IN ('owner', 'admin')
);
```

**Bruk:**
```sql
-- Kun admins kan slette
USING (org_id = public.get_user_org_id() AND public.is_org_admin())
```

### `is_org_owner()`
Sjekker om bruker er owner (for kritiske operasjoner som å endre plan).

```sql
SELECT EXISTS (
  SELECT 1 FROM public.profiles
  WHERE id = auth.uid() 
  AND org_id = public.get_user_org_id()
  AND role = 'owner'
);
```

---

## 🔒 Policy-mønster

### Standard org-data (kunder, bookinger, tjenester)

```sql
-- SELECT: Alle i org kan lese
CREATE POLICY "table_select_org" ON public.table_name
  FOR SELECT TO authenticated
  USING (org_id = public.get_user_org_id());

-- INSERT: Alle i org kan opprette
CREATE POLICY "table_insert_org" ON public.table_name
  FOR INSERT TO authenticated
  WITH CHECK (org_id = public.get_user_org_id());

-- UPDATE: Alle i org kan oppdatere
CREATE POLICY "table_update_org" ON public.table_name
  FOR UPDATE TO authenticated
  USING (org_id = public.get_user_org_id());

-- DELETE: Kun admins kan slette
CREATE POLICY "table_delete_org_admin" ON public.table_name
  FOR DELETE TO authenticated
  USING (
    org_id = public.get_user_org_id() AND
    public.is_org_admin()
  );
```

### Personlige data (notifications, egne profiler)

```sql
-- Kun egne notifikasjoner
CREATE POLICY "notifications_select_own" ON public.notifications
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());
```

### Public data (landing pages, partner-søknader)

```sql
-- Anon kan opprette partner-søknader
CREATE POLICY "partner_signups_insert_anon" ON public.partner_signups
  FOR INSERT TO anon
  WITH CHECK (true);

-- Landing page assets er public (for visning)
CREATE POLICY "landing_page_assets_select_all" ON public.landing_page_assets
  FOR SELECT TO authenticated, anon
  USING (true);
```

---

## 📊 Tabeller med RLS

### ✅ Implementert (med policies)

#### Org & Users
- [x] `orgs`
- [x] `org_members`
- [x] `profiles`
- [x] `org_settings`
- [x] `org_modules`
- [x] `invitations`

#### Core Business
- [x] `customers`
- [x] `vehicles`
- [x] `bookings`
- [x] `booking_resources`
- [x] `services`
- [x] `products`
- [x] `employees`

#### Specialized Modules
- [x] `tyre_sets` / `tire_sets`
- [x] `coating_jobs`
- [x] `coating_followups`
- [x] `campaigns`
- [x] `leads`
- [x] `lead_events`

#### Finance
- [x] `invoices`
- [x] `payments`
- [x] `accounting_entries`
- [x] `accounting_integrations`

#### Communication
- [x] `notes`
- [x] `notifications`

#### AI Modules
- [x] `ai_agent_configs`
- [x] `ai_conversations`
- [x] `ai_messages`
- [x] `ai_onboarding_sessions`
- [x] `ai_capacity_suggestions`
- [x] `ai_marketing_jobs`
- [x] `ai_content_jobs`
- [x] `ai_crm_insights`

#### Partner System
- [x] `partner_landing_pages`
- [x] `landing_page_assets`
- [x] `partner_signups` (special: anon insert)

---

## 🚀 Installasjon

### Steg 1: Kjør migrasjonene

```bash
# Logg inn på Supabase Dashboard
# Gå til SQL Editor
# Kjør migrasjonsfilene i rekkefølge:
```

1. **001_enable_rls.sql** - Basis RLS (hvis ikke allerede kjørt)
2. **002_complete_rls_policies.sql** - Komplett implementering

### Steg 2: Verifiser

Etter at migrasjonene er kjørt, sjekk status:

```sql
SELECT * FROM public.verify_rls_status() 
WHERE rls_enabled = false OR policy_count = 0;
```

**Forventet resultat:** Ingen rader (alle tabeller har RLS + policies)

### Steg 3: Test

#### Test 1: Bruker kan kun se egen org

```sql
-- Som bruker i org A
SELECT * FROM customers; -- Får kun org A sine kunder
```

#### Test 2: Bruker kan ikke se andre org

```sql
-- Som bruker i org A
SELECT * FROM customers WHERE org_id = '<org-B-uuid>'; -- Får 0 rader
```

#### Test 3: Service role ser alt

```javascript
// I backend (lyx-api) med service role
const { data } = await supabaseAdmin
  .from('customers')
  .select('*');
// Får alle kunder fra alle orgs
```

---

## 🔍 Feilsøking

### Problem: "new row violates row-level security policy"

**Årsak:** Du prøver å sette inn en rad med feil org_id.

**Løsning:**
```javascript
// Feil
await supabase.from('customers').insert({
  name: 'Test',
  org_id: 'annen-org-uuid' // ❌ Feiler
});

// Riktig
await supabase.from('customers').insert({
  name: 'Test',
  org_id: currentUser.org_id // ✅ OK
});
```

### Problem: "permission denied for table X"

**Årsak:** RLS er aktivert, men policies mangler.

**Løsning:**
1. Sjekk at policies er opprettet:
```sql
SELECT * FROM pg_policies WHERE tablename = 'customers';
```

2. Hvis de mangler, kjør migrasjon 002 på nytt.

### Problem: Backend får ingen data

**Årsak:** Backend bruker authenticated client i stedet for service role.

**Løsning:**
```javascript
// Feil
import { supabase } from './supabaseClient.js'; // ❌ Authenticated

// Riktig
import { supabaseAdmin } from './supabaseAdmin.js'; // ✅ Service role
```

---

## 🎭 Roller og tilganger

| Rolle | SELECT | INSERT | UPDATE | DELETE | Special |
|-------|--------|--------|--------|--------|---------|
| `owner` | ✅ | ✅ | ✅ | ✅ | Kan endre org-plan |
| `admin` | ✅ | ✅ | ✅ | ✅ | Kan invitere brukere |
| `member` | ✅ | ✅ | ✅ | ❌ | Standard tilgang |
| `readonly` | ✅ | ❌ | ❌ | ❌ | Kun lesing |

**Merk:** Dette er logiske roller. RLS-implementeringen i migrasjon 002 håndterer `owner`, `admin` og standard authenticated. `readonly`-støtte må eventuelt legges til senere.

---

## 📝 Vedlikehold

### Når du legger til en ny tabell

1. **Legg til org_id-kolonne:**
```sql
ALTER TABLE public.new_table ADD COLUMN org_id UUID REFERENCES public.orgs(id);
CREATE INDEX new_table_org_id_idx ON public.new_table(org_id);
```

2. **Aktiver RLS:**
```sql
ALTER TABLE public.new_table ENABLE ROW LEVEL SECURITY;
```

3. **Legg til policies:**
```sql
CREATE POLICY "new_table_select_org" ON public.new_table
  FOR SELECT TO authenticated
  USING (org_id = public.get_user_org_id());

CREATE POLICY "new_table_insert_org" ON public.new_table
  FOR INSERT TO authenticated
  WITH CHECK (org_id = public.get_user_org_id());

-- osv.
```

### Testing av nye policies

```sql
-- Simuler bruker i org A
SET LOCAL role authenticated;
SET LOCAL request.jwt.claims TO '{"sub": "<user-a-uuid>", "role": "authenticated"}';

-- Test query
SELECT * FROM new_table;
```

---

## ⚠️ Viktige begrensninger

### 1. Service role bypasser RLS

Service role har `BYPASSRLS`-rettighet. Dette er nødvendig for:
- Backend-API som må lese/skrive på tvers av orgs
- Admin-operasjoner
- Integrasjoner

**Aldri** bruk service role i frontend!

### 2. JWT-claims vs. database-state

RLS bruker `auth.uid()` som henter fra JWT. Hvis en bruker:
- Bytter org (flyttes fra org A til org B)
- Får endret rolle
- Blir slettet

...må de logge ut og inn igjen for at JWT skal oppdateres.

**Løsning:** Implementer JWT-refresh eller tvungen re-auth ved kritiske endringer.

### 3. Performance

RLS legger til WHERE-clauser på alle queries. For store datasett:
- Sørg for indekser på org_id
- Optimaliser komplekse policies
- Overvåk query-ytelse i produksjon

---

## 🔐 Sikkerhet best practices

### ✅ DO

- Bruk RLS på **alle** multi-tenant tabeller
- Test policies grundig før produksjon
- Bruk service role kun i backend
- Log alle RLS-feil (indikerer mulig angrep)
- Overvåk uventede RLS-brudd

### ❌ DON'T

- Ikke hardkod org_id i frontend
- Ikke stol på client-side org_id-validering
- Ikke bruk service role i frontend
- Ikke deaktiver RLS "midlertidig" i prod
- Ikke glem policies på nye tabeller

---

## 📚 Ressurser

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Multi-tenancy with RLS](https://supabase.com/docs/guides/database/multi-tenancy)

---

## 📊 Status

| Område | Status | Kommentar |
|--------|--------|-----------|
| Core tables | ✅ Komplett | Alle har RLS + policies |
| AI modules | ✅ Komplett | Policies implementert |
| Public endpoints | ✅ Komplett | partner_signups, landing_page_assets |
| Testing | ⚠️ Manuell | Trenger automatiserte tester |
| Documentation | ✅ Komplett | Dette dokumentet |
| Production ready | ⚠️ Nesten | Trenger prod-testing og monitoring |

---

## ✅ Neste steg

1. **Test i staging**
   - Opprett test-orgs
   - Verifiser at data ikke lekker mellom orgs
   - Test alle CRUD-operasjoner

2. **Performance-testing**
   - Kjør load tests
   - Verifiser indeks-ytelse
   - Optimaliser treg queries

3. **Monitoring**
   - Sett opp alerts for RLS-feil
   - Logg uventede policy-brudd
   - Overvåk query-performance

4. **Documentation**
   - Oppdater API-docs med RLS-konsekvenser
   - Lag onboarding-guide for utviklere
   - Dokumenter testing-prosedyre

---

**Sist oppdatert:** 29. november 2024  
**Versjon:** 2.0  
**Ansvarlig:** Senior Fullstack Arkitekt
