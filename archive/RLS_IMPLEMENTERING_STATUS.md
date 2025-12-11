# 🎯 RLS & MULTI-TENANT - Implementeringsguide

## ✅ Gjennomført

### 1. Database Schema (100%)
- ✅ Alle multi-tenant tabeller har `org_id`
- ✅ RLS policies aktivert på alle tabeller
- ✅ Indexer på `org_id` kolonner
- ✅ Foreign key constraints til `organizations`

### 2. Dokumentasjon
- ✅ **SUPABASE_FASIT.md** - Komplett referanse
- ✅ **test-multi-tenant.mjs** - Testscript for isolasjon

---

## ⚠️ Må Gjøres (Estimat: 3-4 timer)

### 1. Generer TypeScript Types (5 min)

```bash
cd lyxso-app
npx supabase gen types typescript --project-id jvyndhoxkxqkztqawxns > src\types\supabase.ts
```

**Problemet du møtte:**
- Kommandoen hang/timeout
- Kan kjøres på nytt når Supabase API svarer bedre
- Ikke kritisk for backend, men viktig for type safety i frontend

---

### 2. Fiks API Queries (2-3 timer)

**Alle queries i `lyx-api/routes/` må legge til `.eq('org_id', orgId)`**

#### Steg 1: Lag auth helper
```javascript
// lyx-api/lib/auth-helpers.mjs
export async function getUserOrgId(request) {
  const token = request.headers.authorization?.replace('Bearer ', '');
  const { data: { user } } = await supabase.auth.getUser(token);
  const { data } = await supabase
    .from('users')
    .select('org_id, is_org_admin')
    .eq('id', user.id)
    .single();
  return { orgId: data.org_id, isAdmin: data.is_org_admin };
}
```

#### Steg 2: Fix queries fil-for-fil

**Filer å fikse (prioritert):**

1. **bookings.mjs** - Høyest prioritet
2. **customers.mjs / bookingsAndCustomers.mjs**
3. **services.mjs / servicesEmployeesProducts.mjs**
4. **tyreSets.mjs**
5. **leads.mjs**
6. **aiAgent.mjs, aiChat.mjs, aiOnboarding.mjs**
7. **accounting.mjs**
8. **marketing.mjs**

**Søkemønster:**
```bash
cd lyx-api\routes
# Søk etter queries som kan mangle org_id
findstr /S ".from(" *.mjs > queries-to-fix.txt
```

#### Eksempel-fix:

**FØR:**
```javascript
const { data } = await supabase
  .from('bookings')
  .select('*');
```

**ETTER:**
```javascript
const { orgId } = await getUserOrgId(request);
const { data } = await supabase
  .from('bookings')
  .select('*')
  .eq('org_id', orgId);
```

---

### 3. Test Multi-Tenant (30 min)

```bash
cd "c:\Users\maser\OneDrive\Skrivebord\LYX selskaper\lyx-api"
node ..\test-multi-tenant.mjs
```

**Verifiser:**
- Org 1 ser kun sin egen data
- Org 2 ser kun sin egen data
- Cross-org queries returnerer tomt
- RLS blokkerer uautoriserte queries

---

## 📋 Sjekkliste

### Database
- [x] organizations tabell
- [x] users tabell med org_id
- [x] bookings med org_id og RLS
- [x] customers med org_id og RLS
- [x] services med org_id og RLS
- [x] employees med org_id og RLS
- [x] tyre_sets med org_id og RLS
- [x] ai_agent_configs med org_id og RLS
- [x] ai_conversations med org_id og RLS
- [x] leads med org_id og RLS

### API Routes
- [ ] getUserOrgId() helper opprettet
- [ ] bookings.mjs fikset
- [ ] bookingsAndCustomers.mjs fikset
- [ ] customers queries fikset
- [ ] services queries fikset
- [ ] employees queries fikset
- [ ] tyreSets.mjs fikset
- [ ] leads.mjs fikset
- [ ] aiAgent.mjs fikset
- [ ] aiChat.mjs fikset
- [ ] aiOnboarding.mjs fikset
- [ ] accounting.mjs fikset
- [ ] marketing.mjs fikset

### Testing
- [ ] test-multi-tenant.mjs kjørt OK
- [ ] Manuell test med 2 orgs
- [ ] Verifisert at queries returnerer data
- [ ] Verifisert at RLS blokkerer cross-org

### Frontend
- [ ] TypeScript types generert
- [ ] Komponenter bruker types
- [ ] Error handling for RLS
- [ ] Loading states

---

## 🚦 Status

| Område | Status | Kommentar |
|--------|--------|-----------|
| Database | ✅ 100% | Komplett med RLS |
| Dokumentasjon | ✅ 100% | SUPABASE_FASIT.md |
| API Queries | ⚠️ 20% | Må fikses per route |
| Testing | ⏳ 0% | Script klart |
| Types | ⏳ 0% | Venter på API respons |

---

## 💡 Tips for Utvikler

### Når du får "ingen data" fra API:
1. Sjekk at query har `.eq('org_id', orgId)`
2. Verifiser at JWT token er gyldig
3. Sjekk at bruker er i riktig org
4. Se i Supabase logs for RLS-feil

### Performance:
- Alle org_id kolonner har index
- RLS bruker disse indexene
- Queries skal være raske

### Testing lokalt:
```bash
# Se på Supabase logs
# Verifiser at queries bruker org_id
# Test med flere samtidige requests
```

---

## 📞 Support

Hvis du møter problemer:
1. Sjekk SUPABASE_FASIT.md
2. Kjør test-multi-tenant.mjs
3. Se Supabase Dashboard → Logs
4. Sjekk at RLS policies er enable

---

**Neste steg:** Start med å fikse `bookings.mjs` som eksempel, deretter kopier mønsteret til andre routes.
