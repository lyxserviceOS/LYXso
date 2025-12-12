# 🛠️ GJENSTÅENDE OPPGAVER - FRONTEND & BACKEND

**Sist oppdatert:** 2. desember 2024, 01:40  
**For:** AI-assistenter og utviklere

> **OBS:** Dette er utviklingsoppgaver (bugs, features, kode).  
> Oppgaver for Nikolai (API-nøkler, testing) ligger i `NIKOLAI_SKAL_GJØRE_DETTE.md`

---

## 🚨 KRITISKE BUGS - FIKSET ✅

### 1. ✅ API starter ikke - duplisert route (FIKSET 1. DES)
**Problem:** API-serveren kræsjet ved oppstart.

**Løsning:** Fjernet duplisert `fetchDropboxImages` funksjon i `socialAutomationCloud.mjs`

**Status:** ✅ FIKSET - API starter nå uten feil

---

### 2. ✅ Frontend bygger ikke - React Server Component error (FIKSET 2. DES)
**Problem:** `/kunder/[id]` page kræsjet - event handlers ble sendt til Client Components fra Server Component.

**Løsning:** 
- Opprettet `ClientSections.tsx` med wrapper-komponenter for TagManagement og GDPRManagement
- Flyttet client-side logic (event handlers) inn i Client Components
- Beholdt Server Component for data fetching

**Filer endret:**
- ✅ `app/(protected)/kunder/[id]/ClientSections.tsx` (ny fil)
- ✅ `app/(protected)/kunder/[id]/page.tsx` (oppdatert)

**Status:** ✅ FIKSET - Frontend starter nå på port 3100 uten feil

---

## 🔨 HØYT PRIORITERT - FUNKSJONER SOM MANGLER

### 1. Plan & Addons System 💰
**Database:** ✅ Ferdig (`plans`, `org_plans`, `addons`, `org_addons`, `org_usage`)

**Backend (lyx-api):**
- [ ] `GET /api/plans` - List alle tilgjengelige planer
- [ ] `GET /api/plans/:planId` - Hent plan med features
- [ ] `POST /api/orgs/:orgId/subscription` - Opprett abonnement
- [ ] `PUT /api/orgs/:orgId/subscription` - Oppgrader/nedgrader
- [ ] `DELETE /api/orgs/:orgId/subscription` - Kanseler
- [ ] `POST /api/orgs/:orgId/addons` - Legg til addon
- [ ] `GET /api/orgs/:orgId/usage` - Hent usage metrics

**Frontend (lyxso-app):**
- [ ] `/plans` - Plan-valg side (public)
- [ ] `/dashboard/[slug]/settings/billing` - Fakturahistorikk
- [ ] `/dashboard/[slug]/settings/subscription` - Administrer abonnement
- [ ] Stripe Payment Element integration
- [ ] Usage meter display (hvor mye brukt av quota)

**Estimat:** 2-3 uker

---

### 2. Booking & Kalender (fullføre) 📅
**Database:** ✅ Ferdig

**Backend:**
- [ ] `POST /api/orgs/:orgId/bookings/recurring` - Opprett gjentakende booking
- [ ] `PUT /api/orgs/:orgId/bookings/:id/move` - Flytt booking (drag & drop)
- [ ] `GET /api/orgs/:orgId/bookings/availability` - Sjekk ledig kapasitet
- [ ] `POST /api/orgs/:orgId/bookings/waitlist` - Legg til venteliste
- [ ] `GET /public/orgs/:orgSlug/services` - Public booking (services)
- [ ] `POST /public/orgs/:orgSlug/bookings` - Public booking (create)

**Frontend:**
- [ ] Drag & drop for å flytte bookinger i kalender
- [ ] Farge-koding per status (pending/confirmed/cancelled)
- [ ] Filter på lokasjon/ressurs
- [ ] Venteliste-oversikt
- [ ] Public booking flow: `/bestill/[orgSlug]`
  - [ ] Velg tjeneste
  - [ ] Velg dato/tid
  - [ ] Fyll inn kunde-info
  - [ ] Bekreftelse (SMS/e-post)

**Estimat:** 2 uker

---

### 3. Dekkhotell AI-analyse 🔬
**Database:** ✅ Ferdig

**Backend:**
- [ ] `POST /api/orgs/:orgId/tyre-sets/:id/analyze` - Start AI-analyse
  - [ ] Integrer GPT-4 Vision
  - [ ] Parse response (mønsterdybde, DOT-kode, sesong, tilstand)
  - [ ] Lagre resultater i `tyre_ai_analysis_jobs`
- [ ] `GET /api/orgs/:orgId/tyre-sets/:id/analysis` - Hent analyse-resultater
- [ ] `POST /api/orgs/:orgId/tyre-sets/:id/report` - Generer PDF-rapport

**Frontend:**
- [ ] "Analyser med AI" knapp
- [ ] Loading state (progress indicator)
- [ ] Visning av analyse-resultater
- [ ] PDF-nedlasting av rapport

**Estimat:** 1-2 uker

---

### 4. Coating Garantisertifikat 🛡️
**Database:** ✅ Ferdig

**Backend:**
- [ ] `POST /api/orgs/:orgId/coating-jobs/:id/certificate` - Generer sertifikat
  - [ ] PDF-generering (med logo, QR-kode)
  - [ ] Generer unik QR-kode URL
  - [ ] Last opp til Supabase Storage
- [ ] `GET /public/certificates/:certId` - Public visning av sertifikat
- [ ] `POST /api/orgs/:orgId/coating-jobs/:id/followups` - Opprett oppfølging

**Frontend:**
- [ ] `/dashboard/[slug]/coating/:jobId/certificate` - Generer UI
- [ ] `/certificate/[certId]` - Public visning
- [ ] QR-kode scanner i app
- [ ] Oppfølging-kalender

**Estimat:** 1 uke

---

### 5. Meta Auto-Publishing 🤖
**Database:** ✅ Ferdig  
**Plan:** Se `AUTO_PUBLISHING_CLOUD_PLAN.md`

**Backend:**
- [ ] `POST /api/orgs/:orgId/marketing/autopublish/config` - Konfigurer frekvens
- [ ] `GET /api/orgs/:orgId/marketing/autopublish/queue` - Se planlagte innlegg
- [ ] Background job (cron): Generer & publiser innlegg automatisk

**Frontend:**
- [ ] `/dashboard/[slug]/markedsforing/autopublish` - Konfigurasjon UI
  - [ ] Velg frekvens (daglig/ukentlig)
  - [ ] Velg kanaler (Meta/Google/TikTok)
  - [ ] Aktiver/deaktiver
- [ ] Content calendar view
- [ ] Godkjennings-workflow (før auto-publisering)

**Estimat:** 1-2 uker

---

### 6. Regnskap-integrasjoner 💼
**Database:** ✅ Ferdig

**Backend:**
- [ ] **Tripletex:**
  - [ ] OAuth flow (`GET /api/integrations/tripletex/auth`)
  - [ ] Synkroniser kunder (`POST /api/orgs/:orgId/integrations/tripletex/sync-customers`)
  - [ ] Synkroniser fakturaer
  - [ ] Webhook for nye fakturaer
- [ ] **Fiken:**
  - [ ] OAuth flow
  - [ ] Synkroniser kunder
  - [ ] Synkroniser fakturaer
- [ ] `POST /api/orgs/:orgId/invoices/:id/export` - Eksporter til regnskap

**Frontend:**
- [ ] `/dashboard/[slug]/settings/integrations` - Integrasjoner-oversikt
  - [ ] Koble til Tripletex
  - [ ] Koble til Fiken
  - [ ] Status-indikatorer
- [ ] Automatisk kontering-regler

**Estimat:** 2-3 uker

---

## 🟡 MEDIUM PRIORITET

### 7. Kundeportal (min-side) 👤 - ✅ 100% FERDIG!
**Database:** ✅ Ferdig

**Backend:** ✅ 100% FERDIG
- ✅ `GET /api/customers/:customerId/dashboard` - Dashboard data
- ✅ `GET /api/customers/:customerId/bookings` - Mine bookinger  
- ✅ `PATCH /api/customers/:customerId/bookings/:bookingId/cancel` - Avbestill booking
- ✅ `GET /api/customers/:customerId/vehicles` - Mine kjøretøy
- ✅ `GET /api/customers/:customerId/tyres` - Mine dekksett (med AI-analyse)
- ✅ `POST /api/customers/:customerId/tyres/:tyreSetId/request-quote` - Be om tilbud
- ✅ `GET /api/customers/:customerId/coating` - Mine coating-jobber
- ✅ `GET /api/customers/:customerId/invoices` - Mine fakturaer
- ✅ `GET /api/customers/:customerId/profile` - Hent profil
- ✅ `PATCH /api/customers/:customerId/profile` - Oppdater profil

**Frontend:** ✅ 100% FERDIG
- ✅ `/min-side` - Dashboard (hovedside med oversikt)
- ✅ `/min-side/bookinger` - Booking-oversikt med avbestillingsfunksjon
- ✅ `/min-side/kjoretoy` - Kjøretøy-register
- ✅ `/min-side/dekkhotell` - Dekksett-oversikt med AI-analyse og tilbudsforespørsel
- ✅ `/min-side/coating` - Coating garantier og oppfølging
- ✅ `/min-side/betalinger` - Betalingsoversikt/fakturaer
- ✅ `/min-side/profil` - Rediger kontaktinfo

**Komponenter:** ✅ 100% FERDIG
- ✅ CustomerNav.tsx - Navigasjon
- ✅ BookingCard.tsx + BookingsList.tsx
- ✅ VehiclesList.tsx
- ✅ TyreSetCard.tsx + TyreSetsList.tsx  
- ✅ CoatingJobCard.tsx + CoatingJobsList.tsx
- ✅ InvoicesList.tsx

**Status:** ✅ 100% FULLFØRT (4. desember 2024, 15:35)

**Estimat:** Ferdig! (Tok 30 minutter å fullføre)

---

### 8. Multi-lokasjon & Ressursstyring 🏢
**Database:** ✅ Ferdig

**Backend:**
- [ ] `GET /api/orgs/:orgId/locations` - List lokasjoner
- [ ] `POST /api/orgs/:orgId/locations` - Opprett lokasjon
- [ ] `PUT /api/orgs/:orgId/locations/:id` - Oppdater åpningstider
- [ ] `GET /api/orgs/:orgId/resources` - List ressurser (løftebukk, vaskehall)
- [ ] `POST /api/orgs/:orgId/resources` - Opprett ressurs

**Frontend:**
- [ ] `/dashboard/[slug]/settings/locations` - Lokasjon-administrasjon
- [ ] `/dashboard/[slug]/settings/resources` - Ressurs-administrasjon
- [ ] Filter bookinger per lokasjon i kalender

**Estimat:** 1 uke

---

## 🔵 LAV PRIORITET - Nice-to-have

### 9. Notifikasjoner & Varslinger 🔔
- [ ] E-post ved ny booking
- [ ] SMS-påminnelser (24t før booking)
- [ ] Push-notifications (web)
- [ ] Webhook-support for tredjepartsintegrasser

### 10. Rapporter & Analytics 📊
- [ ] Inntektsrapport per periode
- [ ] Booking-statistikk
- [ ] Kundeanalyse (LTV, churn, retention)
- [ ] Markedsføringsrapport (ROI)

### 11. Team & Tilgangsstyring 👥
- [ ] Roller & permissions
- [ ] Inviter team-medlemmer
- [ ] Activity log (audit trail)

---

## 📋 KARTLEGGING & CLEANUP

### 12. Frontend Sitemap 📂
**Oppgave:** Kartlegg alle ruter i `lyxso-app\src\app\`

```bash
# Windows PowerShell
Get-ChildItem -Path src\app -Recurse -Filter "page.tsx" | Select-Object FullName
```

**Lag tabell:**
| Rute | Beskrivelse | Tilgang | Status |
|------|-------------|---------|--------|
| `/dashboard/[slug]/booking` | Kalender | Org-admin/ansatt | Delvis ferdig |
| `/dashboard/[slug]/dekkhotell` | Dekkhotell | Org-admin/ansatt | Delvis ferdig |
| ... | ... | ... | ... |

---

### 13. Orphan Pages 🔍
**Oppgave:** Finn sider som IKKE er linket noe sted

1. Noter alle sider fra sitemap (oppgave 12)
2. Sjekk `NavigationMenu.tsx` for lenker
3. Finn pages som mangler i menyen

**Resultat:**
- Legg til manglende lenker ELLER
- Slett unused pages

---

## ✅ FERDIGSJEKKLISTE

**Når du har fikset noe:**
1. Test at det fungerer
2. Commit endringer
3. Marker oppgave som ✅ i denne filen
4. Oppdater `NIKOLAI_SKAL_GJØRE_DETTE.md` hvis det påvirker hans oppgaver

---

## 🎯 ANBEFALT REKKEFØLGE FOR AI

1. Fix kritiske bugs (oppgave 1-2) ✅ **NÅ**
2. Plan & Addons (oppgave 1) - **Uke 1-3**
3. Booking fullføring (oppgave 2) - **Uke 4-5**
4. Dekkhotell AI (oppgave 3) - **Uke 6-7**
5. Coating sertifikat (oppgave 4) - **Uke 8**
6. Auto-publishing (oppgave 5) - **Uke 9-10**
7. Regnskap (oppgave 6) - **Uke 11-13**
8. Kundeportal (oppgave 7) - **Uke 14**
9. Multi-lokasjon (oppgave 8) - **Uke 15**

**Total estimat:** ~4 måneder for å fullføre alt

---

**Lykke til! 🚀**
