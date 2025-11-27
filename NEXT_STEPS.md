# LYXso Roadmap – Modul 14–23

## ✅ FERDIGSTILT (Modul 1–13)

1. **Autentisering & org-struktur** – Supabase Auth + RLS  
2. **Booking-system** – Kalender, tidsbestilling, kunde-/bilregistrering  
3. **CRM grunnlag** – Kunder, biler, historikk, notater, tags  
4. **Tjenester & ansatte** – Tjenestekatalog, medarbeiderplanlegging  
5. **Produkter & lagerstyring** – Basis produkter (coating, PPF, dekk)  
6. **Dekkhotell MVP** – Lagring av dekksett (basis)  
7. **Coating MVP** – Opprett coating-jobb, lag, garanti  
8. **Dashboard & KPI-oversikt** – Enkel oversikt for partner  
9. **Betalinger & økonomi (basis)** – `payments`-tabell, enkelt fakturering  
10. **Markedsføring (basis)** – Kampanjer, lead tracking (MVP)  
11. **Planer & addons (basis)** – Org-planer, addon-flagg  
12. **Kundeportal & public booking** – Enkel portal + booking for sluttkunde  
13. **Partner landingssider** – White-label landingssider per org (✅ FERDIG!)

---

## 📋 KOMMENDE MODULER (14–23)

### Modul 14 – Full økonomi- og regnskapsmodul

**Mål:** LYXso skal forstå pengestrøm, ikke bare bookinger.

**DB:**
- `payments` ferdigstilles (kobles til bookings, customers, services, addons)
- `invoices` / `accounting_entries` (regnskapsklare linjer)
- Knytning mot Fiken/PowerOffice-id

**API:**
- Registrer betaling, marker som betalt, generer faktura

**UI:**
- `/regnskap` med omsetning per periode og eksport-status

---

### Modul 15 – Dekkhotell PRO

**Mål:** Dekkhotellmodulen skal føles som et eget produkt inni LYXso.

**DB:**
- `tyre_sets`, `tyre_positions`, `storage_locations` (org_id + RLS)

**API:**
- CRUD på dekksett, søk/filtrering på regnr/kunde/posisjon

**UI:**
- `/dekkhotell` med liste, filter, detaljkort og "klargjør booking"

---

### Modul 16 – Coating / kvalitetskontroll PRO

**Mål:** Coatingmodulen skal dekke hele 5-årsreisen.

**DB:**
- `coating_jobs`, `coating_followups`, `inspection_photos`

**API:**
- Opprette jobb, generere 5-års kontroller, logge status/bilder

**UI:**
- `/coating` med pipeline-view og tidslinje på kundekort

---

### Modul 17 – Markedsføring & kampanjer (Meta/Google/MVP)

**Mål:** Oversikt over markedsføring i LYXso.

**DB:**
- `marketing_channels`, `campaigns`, `campaign_metrics`

**API:**
- Integrasjoner med Meta/Google, normalisert output

**UI:**
- `/markedsforing` med månedsrapport og kampanjeliste

---

### Modul 18 – Multi-lokasjon og ressurser

**Mål:** LYXso skal tåle flere avdelinger/haller/ressurser.

**DB:**
- `locations`, `resources` (løftebukk, poleringsbås, etc.)

**API:**
- Bookinger knyttet til lokasjon + ressurs, kapasitetsregler

**UI:**
- `/booking` med filter på lokasjon/ressurs

---

### Modul 19 – Plan, addons & billinglogikk (ekte)

**Mål:** Planer og addons skal styre funksjonalitet og pris.

**DB:**
- `plans`, `plan_features`, `org_plans`, `org_usage`, `addons`, `org_addons`

**Logikk:**
- Sjekk mot maks-grenser, tracking av usage per måned

**UI:**
- `/plan` med oversikt og oppgraderingsforslag
- `/addons` med toggle og betalingsmerking

---

### Modul 20 – Partner-dashboard & rapporter (CEO-view light)

**Mål:** Partner skal ha en sjefsside for sin egen bedrift.

**KPIer:**
- Omsetning, bookinger, coating vs andre tjenester, dekkhotell

**Graf:**
- Linjegraf/bar-graf med daglig/ukentlig omsetning

**Eksport:**
- CSV/Excel per periode

**Health meter:**
- Score 0–100 basert på utnyttelse, rebooking-rate

---

### Modul 21 – Kundeportal white-label + landingpages

**Mål:** Sluttkunde ser partnerens brand.

**DB:**
- `org_settings` / `partner_landing_pages`

**Kundeportal:**
- `/min-side` + public booking med org-tema

**Landingpages:**
- Generert fra DB, senere med editor

---

### Modul 22 – Automatisering: triggere, påminnelser, workflows

**Mål:** LYXso skal gjøre kjedelige ting automatisk.

**DB:**
- `automation_rules`, `automation_events`, `notifications`

**Workflows:**
- SMS-påminnelse 24t før booking
- Coating-kontroll etter 12 mnd
- Flagg kunde etter no-show

**Implementasjon:**
- Cron/queue i API'et

**UI:**
- `/kontrollpanel` med av/på-regler og logg

---

### Modul 23 – Dokumentasjon, support og "klar for salg"

**Mål:** Onboarding uten å sitte ved siden av partnere.

**Dokumentasjon:**
- "Kom i gang på 10 min"
- Teknisk doc (mappestruktur, tabeller, RLS, API)

**Onboarding-flow:**
- `/bli-partner` → intro-wizard

**Support:**
- Hjelp-område med FAQ + kontakt

**Sjekkliste prod:**
- Backup, logging, error-tracking, monitoring, env-doc

---

## 🎯 PRIORITERING

**Kritiske moduler først:**
1. **Modul 14** – Økonomi (betalinger må fungere)
2. **Modul 15** – Dekkhotell PRO (stor differensiator)
3. **Modul 16** – Coating PRO (5-års garanti, kontroller)
4. **Modul 19** – Plan/billing (må kunne fakturere partnere)
5. **Modul 23** – Dokumentasjon (må kunne selge!)

**Nice-to-have (kan vente):**
- Modul 17 – Markedsføring (kan starte enkelt)
- Modul 18 – Multi-lokasjon (bare for større partnere)
- Modul 20 – CEO-view (rapport kan være enklere først)
- Modul 21 – White-label (landingssider ferdig, kundeportal senere)
- Modul 22 – Automatisering (start med manuell påminnelse)

---

## ✅ STATUS NÅ

**Ferdigstilt:**
- Partner landingssider med komplett redigering
- Supabase storage for bilder
- Gallery, testimonials, FAQ
- API-endepunkter for CRUD
- RLS-policyer

**Neste konkrete oppgave:**
1. ✅ Fikse duplikat-rute-feil (løst ved server restart)
2. ⏳ Teste PUT for lagring
3. ⏳ Validere publisering/avpublisering
4. ⏳ Forbedre settings-side med bildeupload + preview
5. → Deretter: Modul 14 (Økonomi) eller Modul 15 (Dekkhotell PRO)

---

## 🚀 KOMMENDE FOKUS

**Uke 1-2:** Fullføre landingsside-funksjoner (bildeupload, preview, galleriadministrasjon)

**Uke 3-4:** Modul 14 – Økonomi (betalinger, fakturaer, regnskapsintegrasjon)

**Uke 5-6:** Modul 15 – Dekkhotell PRO (lager, posisjonering, historikk)

**Uke 7-8:** Modul 16 – Coating PRO (5-års kontroller, inspeksjonsfotos)

**Uke 9-10:** Modul 19 – Plan/Billing (ekte betalingslogikk for partnere)

**Uke 11-12:** Modul 23 – Dokumentasjon + "klar for salg"

---

**Opprettet:** 2025-11-27  
**Sist oppdatert:** 2025-11-27  
**Status:** Landingssider ferdig, klar for Modul 14-23

