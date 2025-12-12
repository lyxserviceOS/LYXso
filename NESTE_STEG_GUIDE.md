# 🚀 STEG-FOR-STEG: Multi-Tenant Implementering

**Tid:** ~2-3 timer  
**Vanskelighetsgrad:** Middels  
**Status:** Database ✅ | App-kode ⚠️

---

## ✅ ALLEREDE FERDIG

- ✅ Database struktur med org_id på alle tabeller
- ✅ RLS policies aktivert og testet
- ✅ API routes filtrerer på org_id (modules, booking, etc.)
- ✅ `useOrgId()` hook er opprettet i `lyxso-app/hooks/useOrgId.ts`

---

## 🔧 STEG 1: Oppdater Client Komponenter (30 min)

### Automatisk Fix

Jeg kan oppdatere disse filene automatisk. Si "oppdater komponenter" så fikser jeg:

```
✅ VehiclesPageClient.tsx
✅ CustomersPageClient.tsx
✅ BookingCalendar komponenter
✅ CoatingPageClient.tsx
✅ PPFPageClient.tsx
✅ TireStoragePageClient.tsx
✅ InventoryPageClient.tsx
```

### Manuell Fix (hvis du vil gjøre det selv)

1. Åpne filen, f.eks. `lyxso-app/app/(protected)/vehicles/VehiclesPageClient.tsx`

2. Erstatt:
```typescript
const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID;
```

Med:
```typescript
import { useOrgId } from '@/hooks/useOrgId';
// ...
const { orgId, loading, error } = useOrgId();

if (loading) return <div>Laster...</div>;
if (error || !orgId) return <div>Feil: {error}</div>;
```

3. Oppdater API-kall:
```typescript
// Før:
fetch(`${API_BASE}/api/orgs/${ORG_ID}/vehicles`)

// Etter:
fetch(`${API_BASE}/api/orgs/${orgId}/vehicles`)
```

---

## 🧪 STEG 2: Test Lokalt (10 min)

### Start dev server
```bash
cd lyxso-app
npm run dev
```

### Test følgende:
1. ✅ Logg inn med din bruker
2. ✅ Sjekk at du ser data (kunder, kjøretøy, bookinger)
3. ✅ Opprett en test-kunde
4. ✅ Sjekk at den vises i listen
5. ✅ Åpne konsollen - ingen RLS errors?

---

## 🔍 STEG 3: Verifiser Multi-Tenant (30 min)

### Opprett testorganisasjon i Supabase

1. Gå til Supabase Dashboard → SQL Editor
2. Kjør:

```sql
-- Opprett test-org
INSERT INTO organizations (name, slug, created_at)
VALUES ('Test Verksted 2', 'test-2', NOW())
RETURNING id;

-- Noter ID'en du får tilbake
```

3. Opprett testbruker:
```sql
-- Bruk Supabase Dashboard → Authentication → Add User
-- Email: test2@example.com
-- Send invitasjon

-- Deretter koble til org:
INSERT INTO profiles (id, org_id, email, full_name, role)
VALUES (
  '<user-uuid-fra-auth>', 
  '<org-id-fra-over>', 
  'test2@example.com', 
  'Test Bruker 2', 
  'owner'
);
```

### Test isolasjon
1. Logg inn som din vanlige bruker → Se dine kunder
2. Logg ut
3. Logg inn som test2@example.com → Se INGEN kunder
4. Opprett kunde som test2 → Logg inn som deg selv → Skal IKKE se test2's kunde

✅ Hvis dette fungerer: Multi-tenant er 100% operativt!

---

## 📦 STEG 4: Deploy til Produksjon (30 min)

### Forbered deploy
```bash
cd lyxso-app
npm run build
```

### Hvis build feiler:
- Rett opp TypeScript feil
- Sjekk at alle komponenter er oppdatert

### Deploy til Vercel
```bash
# Hvis du bruker Vercel CLI:
vercel --prod

# Eller:
git push origin main
# (hvis du har GitHub + Vercel integrert)
```

### Etter deploy:
1. Test produksjons-URL
2. Logg inn
3. Verifiser at data vises
4. Sjekk Vercel logs for errors

---

## 🐛 FEILSØKING

### Problem: "No data / Tom liste"

**Årsak:** Query mangler `org_id` filter ELLER bruker har ikke `org_id` i profile.

**Løsning:**
```sql
-- Sjekk brukerens profil
SELECT id, email, org_id FROM profiles WHERE email = 'din@email.com';

-- Hvis org_id er NULL, sett det:
UPDATE profiles 
SET org_id = '<din-org-id>' 
WHERE email = 'din@email.com';
```

### Problem: "RLS policy violation"

**Årsak:** Query prøver å INSERT/UPDATE uten `org_id`.

**Løsning:** Alle INSERT/UPDATE må inkludere `org_id`:
```typescript
await supabase
  .from('customers')
  .insert({ 
    org_id: orgId,  // ← VIKTIG!
    name: 'Test Kunde',
    ...
  });
```

### Problem: "useOrgId hook returnerer null"

**Årsak:** Bruker er ikke autentisert ELLER mangler profile.

**Løsning:**
```typescript
// Sjekk om bruker er logget inn
const { data: { user } } = await supabase.auth.getUser();
console.log('User:', user);

// Sjekk profil
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single();
console.log('Profile:', profile);
```

---

## 📊 STEG 5: Monitoring (Pågående)

### Overvåk Supabase Logs
1. Gå til Supabase Dashboard → Logs
2. Filtrer på "RLS" errors
3. Hvis du ser feil: Fiks query som mangler `org_id` filter

### Overvåk Vercel Logs
```bash
vercel logs --follow
```

### Sjekk ytelse
- Database queries burde være raske (<100ms)
- Hvis treg: Sjekk indexes på `org_id` kolonner

---

## 🎯 OPPSUMMERING

**Hva er ferdig:**
- ✅ Database er 100% multi-tenant klar
- ✅ RLS beskytter all data
- ✅ API routes filtrerer korrekt
- ✅ `useOrgId` hook er klar

**Hva må gjøres:**
- ⚠️ Oppdater client-komponenter til å bruke `useOrgId()` 
- ⚠️ Fjern hardkodet `NEXT_PUBLIC_ORG_ID`
- ⚠️ Test med minst 2 organisasjoner

**Estimert tid:** 2-3 timer totalt.

**Neste kommando:**
Si "oppdater komponenter" så fikser jeg alle client-komponenter automatisk!

---

## 📞 TRENGER DU HJELP?

**Automatisk fix tilgjengelig:**
- ✅ Oppdater alle client komponenter
- ✅ Generer TypeScript types fra Supabase
- ✅ Test multi-tenant isolasjon

**Si bare:**
- "oppdater komponenter" 
- "generer types"
- "test multi-tenant"

Og jeg fikser det for deg! 🚀
