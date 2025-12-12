# DATABASE-MIGRASJONER

Denne mappen inneholder SQL-scripts for database-endringer i Supabase.

## Hvordan kjøre migrasjoner

### 1. Logg inn på Supabase Dashboard
- Gå til [https://supabase.com](https://supabase.com)
- Velg ditt prosjekt

### 2. Åpne SQL Editor
- Klikk på "SQL Editor" i venstre meny
- Klikk "+ New query"

### 3. Kjør migreringsscriptet
- Åpne filen `001_enable_rls.sql`
- Kopier HELE innholdet
- Lim inn i SQL Editor
- Klikk "Run" (eller Ctrl/Cmd + Enter)

### 4. Verifiser at det fungerte
Kjør denne testen i SQL Editor:

```sql
-- Test 1: Sjekk at RLS er aktivert
SELECT 
  schemaname,
  tablename,
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = false;

-- Skal returnere 0 rows (alle tabeller skal ha RLS aktivert)
```

```sql
-- Test 2: Sjekk at policies eksisterer
SELECT 
  COUNT(*) as total_policies,
  COUNT(DISTINCT tablename) as tables_with_policies
FROM pg_policies 
WHERE schemaname = 'public';

-- Skal vise mange policies (minst 50+)
```

## Migrasjoner

### 001_enable_rls.sql ✅
**Status:** KRITISK - må kjøres før produksjon  
**Dato:** 29. november 2024  
**Formål:** Aktiverer Row Level Security på alle tabeller

**Hva den gjør:**
- Aktiverer RLS på 30+ tabeller
- Oppretter policies for multi-tenant (org-basert tilgangskontroll)
- Sørger for at brukere kun ser data fra sin egen organisasjon
- Service role (backend) beholder full tilgang

**Testing etter kjøring:**
1. Logg inn som en test-bruker i frontend
2. Prøv å hente data fra en annen org → skal ikke fungere
3. Test at alle eksisterende funksjoner fortsatt virker
4. Sjekk at backend (med service_role key) fortsatt kan operere på tvers av orgs

## Rollback

Hvis noe går galt, kan du disable RLS midlertidig:

```sql
-- MIDLERTIDIG ROLLBACK (kun for testing!)
ALTER TABLE public.customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
-- osv...

-- Eller disable ALL policies:
DROP POLICY IF EXISTS "Users can view customers in their org" ON public.customers;
-- osv...
```

**VIKTIG:** RLS bør alltid være aktivert i produksjon!

## Fremtidige migrasjoner

Nye migrasjoner legges til som:
- `002_add_feature_x.sql`
- `003_update_schema_y.sql`
- osv.

Bruk alltid nummerering og beskrivende navn.
