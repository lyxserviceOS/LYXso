# Oppdateringer 6. desember 2024

## 1. AI-Kampanjegenerator - Visuell Kalender ✓

### Endringer:
- **Fjernet**: Tekstfelt for "Periode" (Q1 2025)
- **Lagt til**: Visuell kalender med multi-date selection
- **Funksjonalitet**:
  - Klikk på datoer for å velge/avvelge
  - Viser antall valgte datoer
  - Chips under kalenderen viser valgte datoer
  - Kan fjerne enkeltdatoer med × knappen
  - "Nullstill" knapp for å tømme alle valg
  - Tidligere datoer er disabled/grået ut
  - Norsk formatering (Søn, Man, Tir, etc.)

### Filer endret:
- `lyxso-app/app/(protected)/markedsforing/ai/AiCampaignGenerator.tsx`

### Teknisk:
- Lagt til `DatePickerCalendar` komponent inni samme fil
- State: `selectedDates: Date[]` og `showCalendar: boolean`
- Kalender viser måned-navigasjon (← →)
- Valgte datoer markeres med purple background

---

## 2. Admin-panel - Utvidet Organisasjonsstyring ✓

### Nye sider:
- `/admin/orgs/[orgId]` - Detaljert organisasjonsside

### Funksjoner:
- **4 tabs**:
  1. **Oversikt**: Stats (brukere, bookinger, omsetning) + org-detaljer
  2. **Brukere**: Liste over alle brukere, fjern bruker-funksjon
  3. **Innstillinger**: Rediger org-info (navn, kontakt, adresse, etc.)
  4. **Farlig sone**: Aktiver/deaktiver org, slett permanent

- **Quick stats cards**:
  - Totalt brukere
  - Bookinger
  - Omsetning
  - Abonnement status

- **Org-detaljer**:
  - Navn, org.nr, plan, bransje
  - E-post, telefon, adresse
  - Nettside (klikkbar link)
  - Opprettet/oppdatert datoer

- **Brukere-tab**:
  - Vis alle brukere med rolle
  - Sist innlogget info
  - Fjern bruker-knapp (med bekreftelse)

- **Innstillinger-tab**:
  - Rediger-modus med form
  - Lagre/avbryt knapper
  - Oppdater: navn, kontakt, adresse, etc.

- **Farlig sone-tab**:
  - Toggle aktiv/inaktiv status
  - Slett org permanent (dobbel bekreftelse)
  - Advarsler og rød styling

### Frontend filer:
- `lyxso-app/app/(protected)/admin/orgs/[orgId]/page.tsx` (ny)
- `lyxso-app/app/(protected)/admin/orgs/[orgId]/AdminOrgDetailClient.tsx` (ny)
- `lyxso-app/app/(protected)/admin/orgs/AdminOrgsPageClient.tsx` (oppdatert - link til detail)

### Backend API endpoints (lyx-api/routes/adminOrgs.mjs):
```
✓ GET    /api/admin/orgs                         - List alle orgs
✓ GET    /api/admin/orgs/:orgId                  - Hent én org med detaljer
✓ GET    /api/admin/orgs/:orgId/users            - Hent org's brukere
✓ GET    /api/admin/orgs/:orgId/stats            - Hent org-statistikk
✓ PATCH  /api/admin/orgs/:orgId                  - Oppdater org-info
✓ PATCH  /api/admin/orgs/:orgId/plan             - Oppdater plan
✓ PATCH  /api/admin/orgs/:orgId/toggle-active    - Toggle aktiv/inaktiv
✓ DELETE /api/admin/orgs/:orgId                  - Slett org permanent
✓ DELETE /api/admin/orgs/:orgId/users/:userId    - Fjern bruker fra org
```

### Design:
- Tabs-navigasjon med ikoner
- Stats cards med fargekodet ikoner
- Status badges (aktiv/deaktivert)
- Responsive layout
- Loading states
- Error handling
- Confirmation dialogs for farlige handlinger

---

## 3. Supabase Sikkerhetsfeil - Løsning ✓

### Opprettet fil:
- `FIX_SUPABASE_SECURITY_ERRORS.sql`

### Fikser:
1. **RLS på manglende tabeller**:
   - `landing_page_sections` - enabled RLS + policies
   - `legal_current_versions` - enabled RLS + policies

2. **SECURITY DEFINER views**:
   - Dokumentert hvorfor de er nødvendige (RLS multi-tenant)
   - Lagt til COMMENT på functions
   - Alternativ kode for å fjerne (kommentert ut)

### Kjør i Supabase SQL Editor:
```bash
# Filen ligger i rot-mappen
FIX_SUPABASE_SECURITY_ERRORS.sql
```

---

## Testing

### AI-Kampanjegenerator:
1. Gå til `/markedsforing/ai`
2. Klikk på "Velg datoer for publisering"
3. Test:
   - Velg flere datoer
   - Avvelg datoer
   - Nullstill
   - Verifiser at tidligere datoer ikke kan velges

### Admin Org Detail:
1. Gå til `/admin/orgs`
2. Klikk på et organisasjonsnavn
3. Test alle 4 tabs:
   - **Oversikt**: Se stats og detaljer
   - **Brukere**: Se brukerliste
   - **Innstillinger**: Rediger org-info
   - **Farlig sone**: Test toggle active/inactive

### Backend:
```bash
# Test API endpoints
GET http://localhost:4000/api/admin/orgs/:orgId
GET http://localhost:4000/api/admin/orgs/:orgId/users
GET http://localhost:4000/api/admin/orgs/:orgId/stats
PATCH http://localhost:4000/api/admin/orgs/:orgId
```

---

## Neste steg (forslag)

### Admin-panel (fremtidige utvidelser):
1. **Bulk-operasjoner**: Velg flere orgs, endre plan samtidig
2. **Filtrering/søk**: Filtrer orgs på plan, status, dato
3. **Export**: Eksporter org-liste til CSV/Excel
4. **Aktivitetslogg**: Se endringer gjort på hver org
5. **Email til org**: Send epost direkte fra admin-panel
6. **Notifikasjoner**: Push-notifikasjoner til org-admins
7. **Fakturering**: Se fakturahistorikk, send faktura

### AI-Kampanjegenerator:
1. **Lagre kampanjeplaner**: Lagre valgte datoer og kampanjeidéer
2. **Automatisk publisering**: Schedule posts på valgte datoer
3. **Kampanje-templates**: Gjenbruk tidligere kampanjer
4. **A/B testing**: Test flere varianter
5. **Resultatrapport**: Se performance per kampanje

---

## Sikkerhet

### Admin-endepunkter:
- ⚠️ VIKTIG: Legg til autentisering/autorisering på alle `/api/admin/*` endpoints
- Sjekk at kun super_admin kan bruke disse endepunktene
- Logg alle admin-handlinger for audit trail

### Eksempel middleware (legg til i lyx-api):
```javascript
async function requireSuperAdmin(request, reply) {
  const user = request.user; // fra auth middleware
  if (!user || user.role !== 'super_admin') {
    return reply.code(403).send({ error: 'Forbidden' });
  }
}

// Bruk:
app.get("/api/admin/orgs", { preHandler: requireSuperAdmin }, async (request, reply) => {
  // ...
});
```
