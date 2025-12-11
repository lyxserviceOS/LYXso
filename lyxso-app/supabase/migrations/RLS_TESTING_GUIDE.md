# RLS Testing Guide - LYXso

## 🧪 Hvordan teste RLS-implementeringen

Dette dokumentet beskriver hvordan du verifiserer at RLS fungerer som forventet.

---

## ✅ Pre-flight sjekkliste

Før du starter testing, sørg for at:

- [ ] Migrasjon 001_enable_rls.sql er kjørt
- [ ] Migrasjon 002_complete_rls_policies.sql er kjørt
- [ ] Du har minst 2 test-organisasjoner i databasen
- [ ] Du har test-brukere i hver org
- [ ] Backend (lyx-api) kjører med riktig Supabase service role key

---

## 🔍 Test 1: Verifiser RLS er aktivert

### I Supabase SQL Editor:

```sql
-- Sjekk at alle tabeller har RLS aktivert
SELECT * FROM public.verify_rls_status() 
WHERE rls_enabled = false;
```

**Forventet resultat:** Ingen rader (tom tabell)

**Hvis du får rader:**
- Disse tabellene mangler RLS
- Kjør migrasjon 002 på nytt

---

## 🔍 Test 2: Verifiser policies eksisterer

```sql
-- Liste alle policies (bør være mange)
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

**Forventet resultat:** 60+ policies

**Viktige policies å se etter:**
- `customers_select_org`
- `bookings_select_org`
- `services_select_org`
- `ai_onboarding_sessions_select_org`
- `partner_signups_insert_anon`

---

## 🔍 Test 3: Multi-tenant isolasjon

### Setup test-data

```sql
-- Opprett test-org A
INSERT INTO public.orgs (id, name, slug, email) VALUES 
('11111111-1111-1111-1111-111111111111', 'Test Org A', 'test-org-a', 'orga@test.com');

-- Opprett test-org B
INSERT INTO public.orgs (id, name, slug, email) VALUES 
('22222222-2222-2222-2222-222222222222', 'Test Org B', 'test-org-b', 'orgb@test.com');

-- Opprett test-bruker i org A
INSERT INTO auth.users (id, email) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'usera@test.com');

INSERT INTO public.profiles (id, org_id, email, role) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'usera@test.com', 'member');

-- Opprett test-bruker i org B
INSERT INTO auth.users (id, email) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'userb@test.com');

INSERT INTO public.profiles (id, org_id, email, role) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'userb@test.com', 'member');

-- Legg inn test-kunder
INSERT INTO public.customers (id, org_id, name, email) VALUES
('cust-a-1', '11111111-1111-1111-1111-111111111111', 'Customer A1', 'a1@test.com');

INSERT INTO public.customers (id, org_id, name, email) VALUES
('cust-b-1', '22222222-2222-2222-2222-222222222222', 'Customer B1', 'b1@test.com');
```

### Test som bruker A (org A)

```sql
-- Simuler bruker A
SET LOCAL role authenticated;
SET LOCAL request.jwt.claims TO '{"sub": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "role": "authenticated"}';

-- Test SELECT
SELECT * FROM public.customers;
-- FORVENTER: Kun Customer A1

-- Test INSERT i egen org (skal fungere)
INSERT INTO public.customers (org_id, name, email) VALUES
('11111111-1111-1111-1111-111111111111', 'Customer A2', 'a2@test.com');
-- FORVENTER: Success

-- Test INSERT i annen org (skal feile)
INSERT INTO public.customers (org_id, name, email) VALUES
('22222222-2222-2222-2222-222222222222', 'Hacker Customer', 'hack@test.com');
-- FORVENTER: "new row violates row-level security policy"
```

### Test som bruker B (org B)

```sql
-- Simuler bruker B
SET LOCAL role authenticated;
SET LOCAL request.jwt.claims TO '{"sub": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", "role": "authenticated"}';

-- Test SELECT
SELECT * FROM public.customers;
-- FORVENTER: Kun Customer B1

-- Prøv å lese org A sine data
SELECT * FROM public.customers WHERE org_id = '11111111-1111-1111-1111-111111111111';
-- FORVENTER: 0 rader (ikke feilmelding, bare filtrert bort)
```

---

## 🔍 Test 4: Admin-rettigheter

### Setup admin-bruker

```sql
-- Opprett admin i org A
INSERT INTO auth.users (id, email) VALUES
('admin-aaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'admin@test.com');

INSERT INTO public.profiles (id, org_id, email, role) VALUES
('admin-aaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'admin@test.com', 'admin');
```

### Test admin-policies

```sql
-- Simuler admin
SET LOCAL role authenticated;
SET LOCAL request.jwt.claims TO '{"sub": "admin-aaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "role": "authenticated"}';

-- Admin skal kunne slette
DELETE FROM public.customers WHERE id = 'cust-a-1';
-- FORVENTER: Success

-- Simuler vanlig member
SET LOCAL role authenticated;
SET LOCAL request.jwt.claims TO '{"sub": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "role": "authenticated"}';

-- Member skal IKKE kunne slette
DELETE FROM public.customers WHERE id = 'cust-a-2';
-- FORVENTER: Feil (avhengig av policy)
```

---

## 🔍 Test 5: Public endpoints (anon access)

### Test partner-søknader

```sql
-- Simuler anonym bruker
SET LOCAL role anon;

-- Anon skal kunne opprette partner-søknad
INSERT INTO public.partner_signups (email, company_name, phone) VALUES
('partner@test.com', 'Test Company', '+4712345678');
-- FORVENTER: Success

-- Anon skal IKKE kunne lese søknader
SELECT * FROM public.partner_signups;
-- FORVENTER: 0 rader eller feil
```

---

## 🔍 Test 6: Service role bypass

### I backend (Node.js / lyx-api)

```javascript
// Test med service role (skal se ALT)
import { supabaseAdmin } from './lib/supabaseAdmin.js';

const { data: allCustomers, error } = await supabaseAdmin
  .from('customers')
  .select('*');

console.log('Service role ser', allCustomers.length, 'kunder fra alle orgs');
// FORVENTER: Alle kunder fra alle orgs

// Test med authenticated client (skal kun se egen org)
import { createClient } from '@supabase/supabase-js';

const userSupabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false
    },
    global: {
      headers: {
        Authorization: `Bearer ${userJwtToken}` // Fra innlogget bruker
      }
    }
  }
);

const { data: orgCustomers } = await userSupabase
  .from('customers')
  .select('*');

console.log('User ser', orgCustomers.length, 'kunder fra sin org');
// FORVENTER: Kun kunder fra brukerens org
```

---

## 🔍 Test 7: Frontend-integrasjon

### I LYXso (Next.js)

1. **Logg inn som bruker i org A**
2. **Gå til /kunder**
3. **Verifiser:**
   - Du ser kun org A sine kunder
   - Du kan opprette ny kunde
   - Du kan redigere eksisterende kunde
   - Du kan IKKE se org B sine kunder (selv om du kjenner deres ID)

4. **Åpne browser console**
5. **Kjør:**

```javascript
// Prøv å lese annen org sine data
const { data } = await supabase
  .from('customers')
  .select('*')
  .eq('org_id', '<org-B-uuid>');

console.log('Resultat:', data);
// FORVENTER: [] (tom array)
```

6. **Prøv å sette inn i annen org:**

```javascript
const { error } = await supabase
  .from('customers')
  .insert({
    org_id: '<org-B-uuid>',
    name: 'Hacker',
    email: 'hack@evil.com'
  });

console.log('Feil:', error);
// FORVENTER: "new row violates row-level security policy"
```

---

## 🔍 Test 8: AI-moduler

### Test AI onboarding sessions

```sql
-- Opprett test-session
INSERT INTO public.ai_onboarding_sessions (org_id, input, suggestions) VALUES
('11111111-1111-1111-1111-111111111111', '{"test": true}', '{"test": true}');

-- Simuler bruker fra org A
SET LOCAL role authenticated;
SET LOCAL request.jwt.claims TO '{"sub": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "role": "authenticated"}';

SELECT * FROM public.ai_onboarding_sessions;
-- FORVENTER: Kun sessions fra org A

-- Simuler bruker fra org B
SET LOCAL role authenticated;
SET LOCAL request.jwt.claims TO '{"sub": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", "role": "authenticated"}';

SELECT * FROM public.ai_onboarding_sessions;
-- FORVENTER: 0 rader
```

---

## 🐛 Feilsøking

### Feil: "permission denied for table X"

**Løsning:**
1. Sjekk at RLS er aktivert: `SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'X';`
2. Sjekk at policies eksisterer: `SELECT * FROM pg_policies WHERE tablename = 'X';`
3. Kjør migrasjon 002 på nytt

### Feil: "new row violates row-level security policy"

**Dette er forventet atferd!** Det betyr RLS fungerer.

**Hvis du får denne ved legitim bruk:**
- Sjekk at org_id matcher brukerens org
- Sjekk at `get_user_org_id()` returnerer riktig verdi

### Feil: "function get_user_org_id() does not exist"

**Løsning:**
Kjør hjelpefunksjonene fra migrasjon 002:

```sql
CREATE OR REPLACE FUNCTION public.get_user_org_id()
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT org_id 
  FROM public.profiles 
  WHERE id = auth.uid()
  LIMIT 1;
$$;
```

---

## ✅ Test-sjekkliste

Før produksjon, sørg for at alle disse testene er bestått:

- [ ] RLS er aktivert på alle tabeller
- [ ] Policies eksisterer for alle tabeller
- [ ] Bruker kan kun se egen org sine data
- [ ] Bruker kan ikke lese/skrive til annen org
- [ ] Admin kan slette, member kan ikke
- [ ] Anon kan opprette partner-søknader
- [ ] Service role kan se alle data
- [ ] Frontend RLS fungerer (console-test)
- [ ] AI-moduler har RLS
- [ ] Ingen RLS-relaterte feil i prod-lignende miljø

---

## 📊 Performance-testing

### Test query-performance med mange orgs

```sql
-- Opprett 100 test-orgs med 100 kunder hver
DO $$
BEGIN
  FOR i IN 1..100 LOOP
    INSERT INTO public.orgs (id, name, slug) VALUES
    (gen_random_uuid(), 'Org ' || i, 'org-' || i);
    
    FOR j IN 1..100 LOOP
      INSERT INTO public.customers (org_id, name, email) VALUES
      ((SELECT id FROM public.orgs WHERE name = 'Org ' || i), 'Customer ' || j, 'c' || j || '@org' || i || '.com');
    END LOOP;
  END LOOP;
END$$;

-- Test query-tid
EXPLAIN ANALYZE
SELECT * FROM public.customers
WHERE org_id = '11111111-1111-1111-1111-111111111111';
```

**Forventet:**
- Index scan på `customers_org_id_idx`
- Execution time < 10ms

**Hvis tregt:**
- Sjekk at indekser eksisterer: `\d+ customers`
- Vurder VACUUM ANALYZE

---

## 🎓 Oppsummering

RLS er **kritisk** for multi-tenant sikkerhet. Disse testene sikrer at:

1. **Data-isolasjon fungerer** - Ingen lekkasje mellom orgs
2. **Rollehierarki fungerer** - Admin/owner har riktige rettigheter
3. **Public endpoints fungerer** - Anon kan gjøre det de skal
4. **Performance er akseptabel** - Queries er raske nok
5. **Frontend er sikret** - Client-side kan ikke omgå RLS

**Neste steg:**
- Sett opp automatiserte tester (Jest/Vitest)
- Implementer monitoring av RLS-brudd
- Dokumenter for utviklerteamet

---

**Sist oppdatert:** 29. november 2024  
**Versjon:** 1.0
