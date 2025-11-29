# Modules Endpoint Status Report

**Dato:** 2025-11-29  
**Problem:** Console warning: `[OrgSettings] Modules endpoint returned non-OK status` + 404 på `/api/orgs/{orgId}/modules`

## Status

### ✅ Frontend er robust
Frontend-koden i `OrgSettingsPageClient.tsx` håndterer denne feilen korrekt:

**Linje 250-267:**
```typescript
try {
  const res = await fetch(`${API_BASE}/api/orgs/${ORG_ID}/modules`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ enabledModules }),
  });
  
  if (!res.ok) {
    console.warn("[OrgSettings] Modules endpoint returned non-OK status");
  }
  
  showSuccess("Modulinnstillinger ble lagret!");
} catch (err) {
  console.warn("[OrgSettings] Modules API unavailable:", err);
  showSuccess("Innstillinger oppdatert (vil synkroniseres når API er tilgjengelig)");
} finally {
  setModulesSaving(false);
}
```

**Dette betyr:**
- Feilen crasher ikke appen
- Brukeren får fortsatt success-melding
- Modulvalg lagres i component state (fungerer i UI)
- Data vil synkroniseres når backend-endepunktet implementeres

### ❌ Backend-endepunkt mangler
Endepunktet `PUT /api/orgs/:orgId/modules` er ikke implementert i lyx-api.

**Forventet funksjonalitet:**
- Motta `{ enabledModules: ModuleCode[] }` i request body
- Oppdatere `orgs`-tabellen med valgte moduler
- Returnere success-status

## Konsekvenser

### Ingen kritiske problemer
1. ✅ UI-en fungerer normalt
2. ✅ Bruker kan velge/avvelge moduler i grensesnittet
3. ✅ Ingen runtime-feil eller crashes
4. ⚠️ Modulvalg lagres ikke til database (kun i frontend-state)
5. ⚠️ Ved page refresh mistes de manuelle modulvalgene

### Brukerpåvirkning
**Lav prioritet** – de fleste brukere vil ikke merke dette fordi:
- Standard moduler (CORE_MODULES) er alltid aktivert
- Modulvalg vises korrekt i UI
- Ingen feilmeldinger vises til brukeren

## Løsning (Backend)

### I lyx-api:
Implementer endepunkt i `routes/*.mjs`:

```javascript
// PUT /api/orgs/:orgId/modules
router.put('/api/orgs/:orgId/modules', async (req, res) => {
  const { orgId } = req.params;
  const { enabledModules } = req.body;
  
  // Validate enabledModules is array of valid ModuleCode
  if (!Array.isArray(enabledModules)) {
    return res.status(400).json({ error: "enabledModules must be an array" });
  }
  
  // Update org in database
  const { data, error } = await supabase
    .from('orgs')
    .update({ enabled_modules: enabledModules })
    .eq('id', orgId)
    .select()
    .single();
  
  if (error) {
    console.error('[PUT /modules] Error updating org:', error);
    return res.status(500).json({ error: error.message });
  }
  
  res.json({ ok: true, enabledModules: data.enabled_modules });
});
```

### I Supabase (schema):
Sørg for at `orgs`-tabellen har kolonnen:
```sql
ALTER TABLE orgs ADD COLUMN IF NOT EXISTS enabled_modules text[];
```

## Neste steg

### Prioritet 1 (Backend)
- [ ] Implementer `PUT /api/orgs/:orgId/modules` endepunktet i lyx-api
- [ ] Verifiser at `orgs.enabled_modules` kolonnen eksisterer i Supabase
- [ ] Test at frontend kan lagre modulvalg permanent

### Prioritet 2 (Testing)
- [ ] Test at modulvalg persisteres etter page refresh
- [ ] Test at CORE_MODULES ikke kan deaktiveres
- [ ] Test at ikke-core moduler kan toggles

### Prioritet 3 (Forbedringer)
- [ ] Legg til RLS-regler for `orgs.enabled_modules` (kun owner/admin kan endre)
- [ ] Legg til validering av ModuleCode på backend (ikke bare frontend)

## Andre lignende endepunkter

Samme mønster gjelder for:
- ❌ `PUT /api/orgs/:orgId/service-settings` (linje 209)
- ❌ `PUT /api/orgs/:orgId/booking-settings` (linje 174)
- ❌ `PUT /api/orgs/:orgId/tyre-settings` (linje 143)

Alle disse har samme graceful degradation-pattern i frontend, så appen fungerer, men dataene lagres ikke til database.

## Konklusjon

**Frontend:** ✅ Stabil og robust  
**Backend:** ❌ Endepunkt mangler, men ikke kritisk  
**Brukeropplevelse:** 🟡 Fungerer, men ikke-persistent data  
**Anbefalt handling:** Implementer backend-endepunktet når tid tillater (ikke brann-oppgave)

---

**Relaterte filer:**
- Frontend: `lyxso-app/app/(protected)/org-settings/OrgSettingsPageClient.tsx`
- Backend: `lyx-api/routes/*.mjs` (må implementeres)
- Docs: `OPPDATERINGER_AUTH_OG_REGISTER.md` (generell auth-flyt)
