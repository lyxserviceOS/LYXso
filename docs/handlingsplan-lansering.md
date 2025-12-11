# Handlingsplan til Lansering - LYXso

**Dato:** 29. november 2024  
**Tech Lead:** Senior Fullstack Arkitekt  
**Mål:** Gjøre LYXso klar for produksjonslansering

---

## 📋 Executive Summary

Denne handlingsplanen tar for seg alle oppgaver som må, bør og kan gjøres for å lansere LYXso som et produksjonsklart ServiceOS for bilbransjen. Planen er delt i tre prioritetsnivåer og dekker frontend, backend, infrastruktur, sikkerhet, integrasjoner og innhold.

**Arkitektur-valg:**
- **Frontend:** Next.js 16 deployes på **Vercel** (production + preview)
- **Backend:** Fastify API (lyx-api) deployes på **Fly.io** (Node.js-hosting nær brukere i Norden)
- **Database/Auth:** Supabase (managed Postgres + auth + storage)

**Begrunnelse for Fly.io:**
- Enkelt å deploye Node.js-apper
- Europeiske datasentre (GDPR-vennlig)
- Auto-scaling og god pris/ytelse-ratio
- Enkel secrets-håndtering via `fly secrets`
- Støtter WebSockets og lengre requests (viktig for AI)

---

## 🎯 Nivå 1: MÅ PÅ PLASS FØR LANSERING

### 1.1 Sikkerhet og secrets-håndtering
**Kategori:** Sikkerhet  
**Omfang:** M  
**Estimat:** 3-4 timer

**Berørte områder:**
- `lyx-api/.env`
- `lyxso-app/.env.local`
- `.gitignore`
- Vercel miljøvariabler
- Fly.io secrets

**Beskrivelse:**
Verifiser at INGEN hemmeligheter er committet til Git. Sjekk git-historikk for lekkede nøkler. Flytt alle sensitive verdier fra `.env`-filer til Vercel/Fly.io miljøvariabler. Roter alle nøkler før første deploy. Oppdater `.gitignore` til å ekskludere `.env*` (unntatt `.env.example`).

**Avhengigheter:** Må gjøres før deploy

**Sjekkliste:**
- [ ] Scan git-historikk for secrets (bruk `git log -p | grep -i "supabase_service"`)
- [ ] Roter alle Supabase-nøkler
- [ ] Roter OpenAI API-key
- [ ] Slett `.env`-filer fra Git (hvis committet)
- [ ] Legg til secrets i Vercel (frontend)
- [ ] Legg til secrets i Fly.io (backend)
- [ ] Test at appene starter uten lokale `.env`-filer

---

### 1.2 RLS-policies og database-sikkerhet
**Kategori:** Sikkerhet  
**Omfang:** M  
**Estimat:** 4-6 timer

**Berørte områder:**
- `lyx-api/*.sql` (alle migrasjoner)
- Supabase Dashboard → SQL Editor
- Alle tabeller med `org_id`

**Beskrivelse:**
Gjennomgå ALLE tabeller og sørg for at RLS (Row Level Security) er aktivert og at policies er korrekte. Verifiser at brukere kun kan se/redigere data for sin egen org. Test at ingen data lekker mellom orgs. Se RLS_SLUTTRAPPORT.md for detaljer.

**Avhengigheter:** Må gjøres før ekte kundedata legges inn

**Sjekkliste:**
- [ ] RLS enabled på ALLE tabeller (unntatt `public`-tabeller som `industries`)
- [ ] Test at bruker fra org A ikke kan se data fra org B
- [ ] Verifiser policies for `customers`, `vehicles`, `bookings`, `tyre_sets`, `coating_jobs`
- [ ] Verifiser policies for `ai_*`-tabeller
- [ ] Test at `SUPABASE_SERVICE_ROLE_KEY` kun brukes i backend (aldri frontend)

---

### 1.3 Fullfør AI-modul-opprydding ✅ FULLFØRT
**Kategori:** Backend / AI  
**Omfang:** L  
**Estimat:** 11-15 timer (FERDIG)

**Status:** ✅ **FULLFØRT 2025-11-30**

**Berørte områder:**
- ✅ `lyx-api/lib/ai/aiClient.mjs` - Felles AI-klient
- ✅ `lyx-api/lib/ai/marketingService.mjs` - Marketing AI
- ✅ `lyx-api/lib/ai/contentService.mjs` - Content AI
- ✅ `lyx-api/lib/ai/crmService.mjs` - CRM AI
- ✅ `lyx-api/lib/ai/accountingService.mjs` - Accounting AI
- ✅ `lyx-api/lib/ai/capacityService.mjs` - Capacity AI
- ✅ `lyx-api/lib/ai/bookingService.mjs` - Booking AI
- ✅ `lyx-api/lib/ai/aiUsageTracker.mjs` - Rate limiting & usage tracking
- ✅ `lyx-api/lib/ai/aiCache.mjs` - Caching system
- ✅ `lyx-api/lib/ai/aiRateLimiter.mjs` - Technical rate limiting
- ✅ Alle AI-routes refaktorert til å bruke domene-services
- ✅ Frontend-sider for AI Markedsføring, Innhold, CRM
- ✅ Global AI Chat Assistant

**Beskrivelse:**
✅ **FERDIG:** Komplett AI-system implementert med:
- Felles AI-klient med støtte for OpenAI (Anthropic klar)
- 6 domene-spesifikke services med skreddersydde prompts
- Rate limiting per org (10/50/200/ubegrenset kall/dag avhengig av plan)
- Caching for kostnadskontroll
- Usage tracking for fakturering
- 4 frontend-sider + global chat assistant
- Alle feilmeldinger på norsk
- Komplett dokumentasjon

**Avhengigheter:** ✅ Krever kun at `OPENAI_API_KEY` settes i `.env`

**Dokumentasjon:**
- ✅ `docs/AI_SYSTEM_BEKREFTELSE.md` - Komplett oversikt
- ✅ `docs/AI_QUICK_START.md` - Quick start guide
- ✅ `docs/AI_IMPLEMENTERING_FERDIG.md` - Teknisk guide
- ✅ `docs/AI_QUICK_REFERENCE.md` - API referanse
- ✅ `lyx-api/test-ai-komplett.mjs` - Test script

**Testing:**
```bash
cd lyx-api
node test-ai-komplett.mjs
# Resultat: ✅ Alle tester passerer
```

**Sjekkliste:**
- [ ] `aiContent.mjs` - Implementer ekte AI for landing page, service/product descriptions
- [ ] `aiCrm.mjs` - Implementer ekte AI for customer summary og next actions
- [ ] `aiBooking.mjs` - Verifiser at ingen stubs gjenstår
- [ ] `aiAccountingAi.mjs` - Deaktiver eller implementer (krever regnskapsintegrasjon)
- [ ] `aiCapacity.mjs` - Deaktiver eller implementer (krever historiske data)
- [ ] Legg til rate limiting middleware i Fastify
- [ ] Legg til logging av alle AI-kall (kostnad, tokens, org_id, timestamp)
- [ ] Test at AI-endepunkter feiler med norsk melding hvis `OPENAI_API_KEY` mangler

---

### 1.4 Deploy-oppsett for frontend (Vercel)
**Kategori:** DevOps  
**Omfang:** S  
**Estimat:** 1-2 timer

**Berørte områder:**
- `lyxso-app/`
- Vercel Dashboard
- GitHub repository

**Beskrivelse:**
Sett opp Vercel-prosjekt for `lyxso-app`. Koble til GitHub repo. Konfigurer miljøvariabler (Supabase, API URL, Sentry, GA). Sett opp preview-deployments for PR-er og prod-deployment for main-branch.

**Sjekkliste:**
- [ ] Opprett Vercel-prosjekt
- [ ] Koble til GitHub repo (auto-deploy på push til main)
- [ ] Konfigurer root directory: `lyxso-app`
- [ ] Legg til miljøvariabler i Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_API_URL` (peker til Fly.io backend)
  - `NEXT_PUBLIC_APP_URL` (https://lyxso.no eller custom domain)
  - `NEXT_PUBLIC_SENTRY_DSN`
  - `NEXT_PUBLIC_GA_TRACKING_ID`
- [ ] Konfigurer custom domain (lyxso.no)
- [ ] Test preview deployment
- [ ] Test prod deployment

---

### 1.5 Deploy-oppsett for backend (Fly.io)
**Kategori:** DevOps  
**Omfang:** M  
**Estimat:** 2-4 timer

**Berørte områder:**
- `lyx-api/`
- Fly.io Dashboard
- `fly.toml` (ny fil)
- `Dockerfile` (ny fil)

**Beskrivelse:**
Sett opp Fly.io-app for `lyx-api`. Lag Dockerfile for Node.js (Fastify). Konfigurer secrets via `fly secrets`. Sett opp auto-scaling og health checks. Konfigurer både staging og prod-miljø.

**Sjekkliste:**
- [ ] Installer Fly CLI: `fly auth login`
- [ ] Opprett Fly-app: `fly launch` i `lyx-api/`
- [ ] Lag Dockerfile (Node 20, port 4000, start med `node index.mjs`)
- [ ] Lag `fly.toml` med health check på `/health` eller `/`
- [ ] Legg til secrets via `fly secrets set`:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `OPENAI_API_KEY`
  - `SENDGRID_API_KEY`
  - `SENTRY_DSN`
  - Alle andre nøkler fra `docs/konfigurasjon-og-hemmeligheter.md`
- [ ] Deploy: `fly deploy`
- [ ] Test at API er tilgjengelig: `curl https://[app-name].fly.dev/health`
- [ ] Konfigurer custom domain (api.lyxso.no)
- [ ] Opprett staging-app: `fly launch --name lyxso-api-staging`

---

### 1.6 CI/CD-workflow (GitHub Actions)
**Kategori:** DevOps  
**Omfang:** M  
**Estimat:** 2-3 timer

**Berørte områder:**
- `.github/workflows/` (ny mappe)
- `frontend-ci.yml` (ny fil)
- `backend-ci.yml` (ny fil)

**Beskrivelse:**
Sett opp automatisert testing, linting og deployment via GitHub Actions. Frontend deployes til Vercel (automatisk), backend bygges og deployes til Fly.io. Kjør lint og type-check før deploy.

**Sjekkliste:**
- [ ] Lag `.github/workflows/frontend-ci.yml`:
  - Run on: push til `main`, PR til `main`
  - Steps: checkout, install, lint, type-check, build
  - Vercel deploy (automatisk via Vercel GitHub-integrasjon)
- [ ] Lag `.github/workflows/backend-ci.yml`:
  - Run on: push til `main`, PR til `main`
  - Steps: checkout, install, lint, build Docker image
  - Deploy til Fly.io på push til `main`
  - Legg til `FLY_API_TOKEN` som GitHub Secret
- [ ] Test workflows med dummy commit

---

### 1.7 Error tracking (Sentry)
**Kategori:** Monitoring  
**Omfang:** S  
**Estimat:** 1-2 timer

**Berørte områder:**
- `lyxso-app/app/layout.tsx` (eller ny `sentry.client.config.ts`)
- `lyx-api/index.mjs`
- Sentry Dashboard

**Beskrivelse:**
Sett opp Sentry for error tracking i både frontend og backend. Konfigurer source maps upload for bedre stack traces. Legg til breadcrumbs og kontekst (org_id, user_id) i error logs.

**Sjekkliste:**
- [ ] Opprett Sentry-prosjekt for frontend (`lyxso-frontend`)
- [ ] Opprett Sentry-prosjekt for backend (`lyx-api`)
- [ ] Installer `@sentry/nextjs` i `lyxso-app`
- [ ] Installer `@sentry/node` i `lyx-api`
- [ ] Konfigurer Sentry i `lyxso-app/app/layout.tsx` eller `sentry.client.config.ts`
- [ ] Konfigurer Sentry i `lyx-api/index.mjs` (Fastify plugin)
- [ ] Legg til `SENTRY_DSN` i miljøvariabler
- [ ] Test at errors blir fanget opp (kast en test-error)
- [ ] Konfigurer source maps upload i CI/CD

---

### 1.8 Health checks og readiness endpoints
**Kategori:** Monitoring  
**Omfang:** S  
**Estimat:** 1 time

**Berørte områder:**
- `lyx-api/index.mjs`
- Fly.io health checks

**Beskrivelse:**
Legg til `/health` og `/ready` endpoints i backend API. Health check skal returnere 200 OK hvis server kjører. Readiness check skal sjekke at Supabase-tilkobling fungerer.

**Sjekkliste:**
- [ ] Legg til `GET /health` i `lyx-api` (returnerer `{ status: "ok" }`)
- [ ] Legg til `GET /ready` i `lyx-api` (tester Supabase-tilkobling)
- [ ] Konfigurer Fly.io til å bruke `/health` som health check
- [ ] Test at Fly.io restarter app hvis health check feiler

---

### 1.9 GDPR og personvern-compliance
**Kategori:** Juridisk  
**Omfang:** M  
**Estimat:** 4-6 timer (inkl. juridisk review)

**Berørte områder:**
- Nye sider: `/personvern`, `/bruksvilkar`, `/cookies`
- `components/CookieConsentBanner.tsx`
- Supabase data retention policies

**Beskrivelse:**
Lag personvernerklæring og bruksvilkår basert på GDPR. Implementer cookie consent banner. Sett opp rutiner for sletting av kundedata (GDPR artikkel 17). Dokumenter databehandleravtale med Supabase.

**Sjekkliste:**
- [ ] Lag `/personvern` side med personvernerklæring (norsk)
- [ ] Lag `/bruksvilkar` side med bruksvilkår (norsk)
- [ ] Lag `/cookies` side med cookie-policy
- [ ] Implementer `CookieConsentBanner.tsx` (hvis ikke allerede på plass)
- [ ] Legg til "Slett min konto"-funksjon i partnerportal
- [ ] Dokumenter hvilke data som lagres og hvorfor
- [ ] Signer databehandleravtale med Supabase (hvis påkrevd)
- [ ] Juridisk review av alle tekster (anbefalt: advokat)

---

### 1.10 Oppdater om-lyxso, bli-partner og kontakt-sider
**Kategori:** Frontend / Innhold  
**Omfang:** M  
**Estimat:** 3-4 timer

**Berørte områder:**
- `lyxso-app/app/om-lyxso/page.tsx`
- `lyxso-app/app/bli-partner/page.tsx`
- `lyxso-app/app/kontakt/page.tsx`

**Beskrivelse:**
Sjekk om disse sidene eksisterer. Hvis ikke, opprett dem basert på malen fra forsiden. Bruk norsk innhold, semantisk HTML og konsistent design.

**Sjekkliste:**
- [ ] `/om-lyxso` - Om LYXso, visjon, historie, team, teknologi
- [ ] `/bli-partner` - Leadskjema for interesserte partnere (navn, e-post, firma, tlf, beskjed)
- [ ] `/kontakt` - Kontaktskjema og support-info
- [ ] Legg til metadata (SEO) for alle tre sider
- [ ] Test responsivitet (mobil, tablet, desktop)

---

### 1.11 SEO og metadata
**Kategori:** Frontend / SEO  
**Omfang:** S  
**Estimat:** 2 timer

**Berørte områder:**
- Alle `page.tsx`-filer i `lyxso-app/app/`
- `public/sitemap.xml` (ny fil)
- `public/robots.txt` (ny fil)

**Beskrivelse:**
Legg til metadata (title, description, OpenGraph) for alle public pages. Generer sitemap.xml. Konfigurer robots.txt. Legg til strukturert data (JSON-LD) for bedriftsinfo.

**Sjekkliste:**
- [ ] Legg til `metadata`-export i `app/page.tsx`
- [ ] Legg til `metadata`-export i `app/om-lyxso/page.tsx`
- [ ] Legg til `metadata`-export i `app/bli-partner/page.tsx`
- [ ] Legg til `metadata`-export i `app/kontakt/page.tsx`
- [ ] Generer `sitemap.xml` (eller bruk Next.js `generateSitemap()`)
- [ ] Lag `robots.txt` (allow all for prod, disallow for staging)
- [ ] Legg til JSON-LD for Organization på forsiden
- [ ] Test med Google Rich Results Test

---

### 1.12 Testing av kritiske flows
**Kategori:** QA  
**Omfang:** M  
**Estimat:** 4-6 timer

**Berørte områder:**
- Alle sider og funksjoner

**Beskrivelse:**
Manuell testing av kritiske brukerflows før lansering. Sjekk at registrering, login, org-opprettelse, booking og dekkhotell fungerer. Test på ulike enheter og nettlesere.

**Sjekkliste:**
- [ ] Registrer ny bruker → skal opprette org automatisk
- [ ] Logg inn → skal gå til partnerportal
- [ ] Opprett kunde → skal lagres med riktig org_id
- [ ] Opprett kjøretøy → skal knyttes til kunde
- [ ] Opprett booking → skal vises i kalender
- [ ] Opprett dekkhotell-sett → skal vises i dekkhotell-oversikt
- [ ] Test på Chrome, Firefox, Safari, Edge
- [ ] Test på iPhone, Android, iPad, desktop
- [ ] Test at RLS fungerer (logg inn som to ulike orgs)

---

## 🔄 Nivå 2: BØR PÅ PLASS SNART ETTER LANSERING

### 2.1 Automatiserte tester (Unit + Integration)
**Kategori:** Testing  
**Omfang:** L  
**Estimat:** 15-20 timer

**Berørte områder:**
- `lyx-api/__tests__/` (ny mappe)
- `lyxso-app/__tests__/` (ny mappe)
- `package.json` (legg til test-scripts)

**Beskrivelse:**
Skriv unit tests for backend-ruter (Jest/Vitest) og integration tests for kritiske flows. Legg til frontend component tests (React Testing Library). Kjør tests i CI/CD.

**Sjekkliste:**
- [ ] Velg testrammeverk (anbefalt: Vitest for begge prosjekter)
- [ ] Skriv tests for `lyx-api/routes/customers.mjs`
- [ ] Skriv tests for `lyx-api/routes/bookings.mjs`
- [ ] Skriv tests for `lyx-api/lib/aiClient.mjs`
- [ ] Skriv component tests for kritiske UI-komponenter
- [ ] Legg til test-script i `package.json`: `npm test`
- [ ] Kjør tests i CI/CD (GitHub Actions)
- [ ] Mål code coverage (mål: >70%)

---

### 2.2 Logging-infrastruktur
**Kategori:** Monitoring  
**Omfang:** M  
**Estimat:** 3-4 timer

**Berørte områder:**
- `lyx-api/index.mjs`
- Logging-tjeneste (f.eks. LogDNA, Datadog, eller Fly.io Logs)

**Beskrivelse:**
Sett opp strukturert logging for backend. Logg alle AI-kall (kostnad, tokens), alle API-requests (method, path, status, duration) og alle errors. Send logs til en sentral tjeneste for analyse.

**Sjekkliste:**
- [ ] Velg logging-tjeneste (f.eks. Fly.io Logs, eller LogDNA)
- [ ] Konfigurer Fastify logger til å bruke JSON-format
- [ ] Logg all AI-aktivitet (modul, action, tokens, cost estimate, org_id)
- [ ] Logg alle API requests (inkl. org_id og user_id hvis tilgjengelig)
- [ ] Sett opp log-aggregering og dashboards
- [ ] Sett opp alerts for kritiske errors (f.eks. Supabase down)

---

### 2.3 Rate limiting per org
**Kategori:** Backend / Sikkerhet  
**Omfang:** M  
**Estimat:** 3-4 timer

**Berørte områder:**
- `lyx-api/index.mjs` eller ny `middleware/rateLimiter.mjs`
- Supabase tabell: `rate_limits` (ny)

**Beskrivelse:**
Implementer rate limiting per org for AI-endepunkter og andre kostbare operasjoner. F.eks. maks 100 AI-kall per dag per org (eller avhengig av plan). Lagre telling i Supabase eller Redis.

**Sjekkliste:**
- [ ] Opprett tabell `rate_limits` (org_id, endpoint, count, window_start)
- [ ] Lag middleware som sjekker rate limit før AI-kall
- [ ] Returner 429 Too Many Requests med norsk melding hvis limit nådd
- [ ] Vis gjenstående kvote i partnerportal
- [ ] Juster limits basert på plan (Start: 50/dag, Pro: 200/dag, Max: ubegrenset)

---

### 2.4 Database backups og disaster recovery
**Kategori:** DevOps / Sikkerhet  
**Omfang:** S  
**Estimat:** 1-2 timer

**Berørte områder:**
- Supabase Dashboard
- Dokumentasjon for restore-prosedyre

**Beskrivelse:**
Sørg for at Supabase tar daglige backups. Test restore-prosedyre. Dokumenter hvordan man gjenoppretter fra backup i tilfelle datamaskinhavari.

**Sjekkliste:**
- [ ] Aktiver Point-in-Time Recovery (PITR) i Supabase (hvis tilgjengelig på plan)
- [ ] Verifiser at daily backups er aktivert
- [ ] Test restore av backup til staging-miljø
- [ ] Dokumenter restore-prosedyre i `docs/disaster-recovery.md`
- [ ] Sett opp alerts hvis backups feiler

---

### 2.5 Betalingsintegrasjon (Vipps)
**Kategori:** Integrasjoner  
**Omfang:** L  
**Estimat:** 10-15 timer

**Berørte områder:**
- `lyx-api/routes/payments.mjs` (ny fil)
- `lyx-api/services/vipps.mjs` (ny fil)
- Supabase tabell: `payments` (ny)
- Frontend: Betalingsflow i partnerportal

**Beskrivelse:**
Implementer Vipps-integrasjon for abonnementsbetaling (månedlig/årlig). Håndter webhooks for betalingsbekreftelse. Oppdater org-plan basert på betaling.

**Sjekkliste:**
- [ ] Registrer bedrift hos Vipps (test-miljø først)
- [ ] Få Vipps API-nøkler
- [ ] Implementer Vipps eCommerce API eller Recurring API
- [ ] Lag `payments`-tabell i Supabase
- [ ] Lag backend-endpoint for å initiere betaling
- [ ] Lag webhook-endpoint for betalingsbekreftelse
- [ ] Oppdater `orgs.plan` når betaling er bekreftet
- [ ] Lag UI i frontend for å velge plan og betale
- [ ] Test med Vipps test-miljø (MT)
- [ ] Test webhook-håndtering

---

### 2.6 E-post-funksjonalitet (SendGrid)
**Kategori:** Integrasjoner  
**Omfang:** M  
**Estimat:** 4-6 timer

**Berørte områder:**
- `lyx-api/services/email.mjs` (ny fil)
- Supabase Edge Functions (alternativ)
- E-post-templates (HTML)

**Beskrivelse:**
Implementer sending av transaksjonelle e-poster via SendGrid. Lag templates for velkomst-e-post, bookingbekreftelse, påminnelser og fakturaer.

**Sjekkliste:**
- [ ] Opprett SendGrid-konto og verifiser sender-domene (f.eks. lyxso.no)
- [ ] Lag e-post-templates i SendGrid (eller lokalt som HTML)
- [ ] Implementer `sendEmail()`-funksjon i backend
- [ ] Lag velkomst-e-post (sendes ved registrering)
- [ ] Lag bookingbekreftelse-e-post
- [ ] Lag dekkhotell-påminnelse (når dekk skal byttes)
- [ ] Test alle e-poster (sjekk spam-score)
- [ ] Legg til unsubscribe-link (GDPR-krav)

---

### 2.7 Regnskapsintegrasjon (Fiken/Tripletex) - fase 1
**Kategori:** Integrasjoner  
**Omfang:** L  
**Estimat:** 15-20 timer

**Berørte områder:**
- `lyx-api/routes/integrations/fiken.mjs` (ny fil)
- `lyx-api/services/fiken.mjs` (ny fil)
- Supabase tabell: `org_integrations` (ny)
- Frontend: Integrasjonsinnstillinger i partnerportal

**Beskrivelse:**
Implementer OAuth-flow for å koble LYXso til Fiken. Synkroniser kunder og fakturaer. Start med read-only (hente data), skriving kommer i fase 2.

**Sjekkliste:**
- [ ] Registrer app hos Fiken Developer Portal
- [ ] Implementer OAuth 2.0 flow (authorization_code)
- [ ] Lag backend-endepunkter for OAuth callback
- [ ] Lagre access_token og refresh_token i Supabase (kryptert)
- [ ] Implementer API-kall til Fiken for å hente kunder
- [ ] Implementer API-kall til Fiken for å hente fakturaer
- [ ] Lag UI i partnerportal for å aktivere Fiken-integrasjon
- [ ] Test OAuth-flow og token-refresh
- [ ] Dokumenter integrasjon i `docs/integrasjoner-fiken.md`

---

### 2.8 Performance optimization
**Kategori:** Frontend / Backend  
**Omfang:** M  
**Estimat:** 4-6 timer

**Berørte områder:**
- Alle sider i `lyxso-app`
- Backend queries i `lyx-api`

**Beskrivelse:**
Optimaliser ytelse for både frontend og backend. Reduser Time to First Byte (TTFB), Largest Contentful Paint (LCP) og Total Blocking Time (TBT). Optimaliser database-queries.

**Sjekkliste:**
- [ ] Kjør Lighthouse audit på alle public pages
- [ ] Optimaliser bilder med `next/image` (hvis ikke allerede gjort)
- [ ] Legg til lazy loading for AI-seksjoner
- [ ] Minifiser CSS og JS (Next.js gjør dette automatisk)
- [ ] Bruk `React.memo()` for dyre komponenter
- [ ] Optimaliser database-queries (legg til indexer på `org_id`, `customer_id`, osv.)
- [ ] Aktiver query caching i Supabase (hvis tilgjengelig)
- [ ] Test ytelse med Chrome DevTools

---

### 2.9 Analytics (Google Analytics / Plausible)
**Kategori:** Analytics  
**Omfang:** S  
**Estimat:** 1-2 timer

**Berørte områder:**
- `lyxso-app/app/layout.tsx`
- Google Analytics eller Plausible-script

**Beskrivelse:**
Sett opp web analytics for å spore besøkende, populære sider og konvertering (fra besøk til "Bli partner"-klikk).

**Sjekkliste:**
- [ ] Velg analytics-plattform (Google Analytics 4 eller Plausible)
- [ ] Opprett tracking-konto
- [ ] Legg til tracking-script i `app/layout.tsx`
- [ ] Konfigurer mål/events (f.eks. "Klikk på Bli partner")
- [ ] Test at tracking fungerer (bruk Google Analytics DebugView)
- [ ] Dokumenter i personvernerklæring

---

### 2.10 Status-side og uptime monitoring
**Kategori:** Monitoring  
**Omfang:** S  
**Estimat:** 2-3 timer

**Berørte områder:**
- Ny side: `https://status.lyxso.no` (kan bruke Statuspage.io eller lignende)
- Uptime monitoring-tjeneste (f.eks. UptimeRobot, Pingdom)

**Beskrivelse:**
Lag en public status-side som viser om LYXso er oppe eller nede. Sett opp uptime monitoring som pinger API og frontend hvert minutt.

**Sjekkliste:**
- [ ] Velg status-side-tjeneste (f.eks. Statuspage.io, eller bygg egen)
- [ ] Sett opp uptime monitoring (UptimeRobot eller lignende)
- [ ] Konfigurer alerts via e-post/SMS hvis tjenesten går ned
- [ ] Legg til link til status-side i footer på lyxso.no
- [ ] Test at alerts fungerer (simuler downtime)

---

### 2.11 Modul 14 – Full økonomi- og regnskapsmodul
**Kategori:** Backend / Frontend  
**Omfang:** L  
**Estimat:** 15-20 timer

**Berørte områder:**
- `lyx-api/routes/payments.mjs` (ferdigstill)
- `lyx-api/routes/invoices.mjs` (ny)
- `lyx-api/routes/accounting.mjs` (ferdigstill)
- Supabase tabeller: `payments`, `invoices`, `accounting_entries`
- Frontend: `/regnskap` med omsetning og eksport

**Beskrivelse:**
Ferdigstill payments-tabellen med kobling til bookings, customers, services og addons. Opprett invoices/accounting_entries for regnskapsklare linjer. Koble mot Fiken/PowerOffice-id for synkronisering.

**Sjekkliste:**
- [ ] Ferdigstill `payments`-tabellen (kolonner: booking_id, customer_id, amount, status, payment_method, etc.)
- [ ] Opprett `invoices`-tabell (invoice_number, org_id, customer_id, line_items, total, status)
- [ ] Opprett `accounting_entries`-tabell (for kobling til eksterne regnskapssystem)
- [ ] API: POST /api/payments (registrer betaling)
- [ ] API: PATCH /api/payments/:id (marker som betalt)
- [ ] API: POST /api/invoices (generer faktura)
- [ ] API: GET /api/accounting/summary (omsetning per periode)
- [ ] Frontend: Opprett `/regnskap`-side med omsetningsrapport og eksport-knapp
- [ ] Test betaling → faktura → regnskapsføring-flow

**Avhengigheter:** Krever at Fiken/Tripletex-integrasjon er startet (2.7)

---

### 2.12 Modul 15 – Dekkhotell PRO
**Kategori:** Backend / Frontend  
**Omfang:** L  
**Estimat:** 12-18 timer

**Berørte områder:**
- `lyx-api/routes/dekkhotell.mjs` (ferdigstill)
- Supabase tabeller: `tyre_sets`, `tyre_positions`, `storage_locations`
- Frontend: `/dekkhotell` med liste, filter og detaljkort

**Beskrivelse:**
Ferdigstill dekkhotellmodulen slik at den føles som et eget produkt inni LYXso. Full CRUD på dekksett, søk/filtrering på regnr/kunde/posisjon, og "klargjør booking"-funksjon.

**Sjekkliste:**
- [ ] Ferdigstill `tyre_sets`-tabell (org_id, customer_id, vehicle_id, position, brand, size, season, storage_date, condition, RLS)
- [ ] Opprett `tyre_positions`-tabell (lager-posisjoner: hylle, reol, nummer)
- [ ] Opprett `storage_locations`-tabell (hvis flere lagerlokaler)
- [ ] API: GET /api/dekkhotell (liste med filter på kunde, regnr, posisjon)
- [ ] API: POST /api/dekkhotell (opprett nytt dekksett)
- [ ] API: PATCH /api/dekkhotell/:id (oppdater dekksett)
- [ ] API: DELETE /api/dekkhotell/:id (slett dekksett)
- [ ] API: GET /api/dekkhotell/:id/history (historikk for dekksett)
- [ ] Frontend: `/dekkhotell` med liste, søk, filter og detaljkort
- [ ] Frontend: "Klargjør booking"-knapp som oppretter booking for hjulskift
- [ ] Test RLS (org A ser ikke dekk fra org B)

---

### 2.13 Modul 16 – Coating / kvalitetskontroll PRO
**Kategori:** Backend / Frontend  
**Omfang:** L  
**Estimat:** 15-20 timer

**Berørte områder:**
- `lyx-api/routes/coating.mjs` (ferdigstill)
- Supabase tabeller: `coating_jobs`, `coating_followups`, `inspection_photos`
- Frontend: `/coating` med pipeline-view og tidslinje

**Beskrivelse:**
Ferdigstill coatingmodulen med full 5-årsreise: opprett jobb, generer 5-års kontroller, logg status/bilder, påminnelser til kunde.

**Sjekkliste:**
- [ ] Ferdigstill `coating_jobs`-tabell (org_id, customer_id, vehicle_id, product, layers, warranty_years, application_date, RLS)
- [ ] Opprett `coating_followups`-tabell (coating_job_id, due_date, status, completed_date, notes, photos)
- [ ] Opprett `inspection_photos`-tabell (followup_id, photo_url, description)
- [ ] API: POST /api/coating (opprett ny coating-jobb med auto-generering av 5 follow-ups)
- [ ] API: GET /api/coating (liste over coating-jobber)
- [ ] API: PATCH /api/coating/:id/followup/:followupId (marker kontroll som utført, last opp bilder)
- [ ] API: GET /api/coating/upcoming (kommende kontroller neste 30 dager)
- [ ] Frontend: `/coating` med pipeline-view (planlagt → pågående → fullført)
- [ ] Frontend: Tidslinje på kundekort som viser coating-historikk og kommende kontroller
- [ ] Automatisering: Cron-jobb som sender påminnelse 14 dager før kontroll

**Avhengigheter:** Krever e-post/SMS-funksjonalitet (2.6) for påminnelser

---

## 🌟 Nivå 3: KAN KOMME SENERE

### 3.1 Modul 17 – Markedsføring & kampanjer (Meta/Google MVP)
**Kategori:** Integrasjoner / Analytics  
**Omfang:** L  
**Estimat:** 20-30 timer

**Berørte områder:**
- `lyx-api/routes/marketing.mjs` (utvid)
- `lyx-api/services/metaAds.mjs` (ny)
- `lyx-api/services/googleAds.mjs` (ny)
- Supabase tabeller: `marketing_channels`, `campaigns`, `campaign_metrics`
- Frontend: `/markedsforing` med månedsrapport og kampanjeliste

**Beskrivelse:**
Implementer integrasjoner med Meta Ads og Google Ads API. Hent kampanje-metrics og normaliser output. Vis oversikt over markedsføring i LYXso.

**Sjekkliste:**
- [ ] Opprett `marketing_channels`-tabell (org_id, channel_type: meta/google/email/sms, api_credentials_encrypted)
- [ ] Opprett `campaigns`-tabell (org_id, channel_id, campaign_name, start_date, end_date, budget, status)
- [ ] Opprett `campaign_metrics`-tabell (campaign_id, date, impressions, clicks, conversions, cost)
- [ ] Registrer app hos Meta for Developers
- [ ] Registrer app hos Google Ads API
- [ ] Implementer OAuth-flow for Meta Ads
- [ ] Implementer OAuth-flow for Google Ads
- [ ] API: GET /api/marketing/campaigns (liste over kampanjer)
- [ ] API: GET /api/marketing/metrics (aggregerte metrics per måned)
- [ ] Frontend: `/markedsforing` med månedsrapport og kampanjeliste
- [ ] Test integrasjoner med test-kontoer

---

### 3.2 Modul 18 – Multi-lokasjon og ressurser
**Kategori:** Backend / Frontend  
**Omfang:** M  
**Estimat:** 10-15 timer

**Berørte områder:**
- Supabase tabeller: `locations`, `resources`
- `lyx-api/routes/bookings.mjs` (utvid med locations/resources)
- Frontend: `/booking` med filter på lokasjon/ressurs

**Beskrivelse:**
LYXso skal tåle flere avdelinger/haller/ressurser. Bookinger kan knyttes til spesifikk lokasjon og ressurs (løftebukk, poleringsbås, etc.). Kapasitetsregler per ressurs.

**Sjekkliste:**
- [ ] Opprett `locations`-tabell (org_id, name, address, opening_hours, RLS)
- [ ] Opprett `resources`-tabell (org_id, location_id, resource_type, name, capacity, RLS)
- [ ] Utvid `bookings`-tabell med `location_id` og `resource_id`
- [ ] API: CRUD for locations og resources
- [ ] API: GET /api/bookings med filter på location_id og resource_id
- [ ] Frontend: `/innstillinger/lokasjoner` for å administrere lokasjoner
- [ ] Frontend: `/innstillinger/ressurser` for å administrere ressurser
- [ ] Frontend: `/booking` med dropdown for å velge lokasjon og ressurs
- [ ] Kapasitetssjekk: Hindre overbooking av ressurser

---

### 3.3 Modul 19 – Plan, addons & billinglogikk (ekte)
**Kategori:** Backend / Frontend / Billing  
**Omfang:** L  
**Estimat:** 15-25 timer

**Berørte områder:**
- Supabase tabeller: `plans`, `plan_features`, `org_plans`, `org_usage`, `addons`, `org_addons`
- `lyx-api/middleware/planChecker.mjs` (ny)
- Frontend: `/plan` og `/addons` i partnerportal

**Beskrivelse:**
Planer og addons skal styre funksjonalitet og pris. Sjekk mot maks-grenser (f.eks. maks 100 kunder på Start-plan), tracking av usage per måned (AI-kall, antall bookinger, osv.).

**Sjekkliste:**
- [ ] Opprett `plans`-tabell (name: Start/Pro/Max, price_monthly, price_yearly, max_customers, max_bookings_per_month, max_ai_calls_per_month)
- [ ] Opprett `plan_features`-tabell (plan_id, feature_key, enabled: true/false)
- [ ] Opprett `org_plans`-tabell (org_id, plan_id, billing_cycle, status, next_billing_date)
- [ ] Opprett `org_usage`-tabell (org_id, month, customer_count, booking_count, ai_call_count)
- [ ] Opprett `addons`-tabell (name, description, price_monthly)
- [ ] Opprett `org_addons`-tabell (org_id, addon_id, enabled, start_date)
- [ ] Lag middleware som sjekker plan-grenser før handlinger (f.eks. "kan ikke opprette flere kunder")
- [ ] API: GET /api/plan/current (hent nåværende plan og usage)
- [ ] API: POST /api/plan/upgrade (oppgrader plan)
- [ ] API: GET /api/addons (liste over tilgjengelige addons)
- [ ] API: POST /api/addons/:id/enable (aktiver addon)
- [ ] Frontend: `/plan` med oversikt og oppgraderingsforslag
- [ ] Frontend: `/addons` med toggle per addon og betalingsmerking

---

### 3.4 Modul 20 – Partner-dashboard & rapporter (CEO-view light)
**Kategori:** Frontend / Analytics  
**Omfang:** M  
**Estimat:** 10-15 timer

**Berørte områder:**
- Frontend: `/dashboard` eller `/rapporter` i partnerportal
- `lyx-api/routes/analytics.mjs` (ny)

**Beskrivelse:**
Partner skal ha en sjefsside for sin egen bedrift med KPI-er: omsetning, bookinger, coating vs andre tjenester, dekkhotell. Graf med daglig/ukentlig omsetning. Eksport til CSV/Excel. Health meter (score 0-100 basert på utnyttelse, rebooking-rate).

**Sjekkliste:**
- [ ] API: GET /api/analytics/kpis (omsetning, antall bookinger, gjennomsnittlig ordresum)
- [ ] API: GET /api/analytics/revenue (daglig/ukentlig omsetning for graf)
- [ ] API: GET /api/analytics/services (fordeling: coating vs bilpleie vs dekkhotell)
- [ ] API: GET /api/analytics/health (score 0-100)
- [ ] API: GET /api/analytics/export?format=csv (eksporter data)
- [ ] Frontend: `/dashboard` med KPI-kort og linjegraf
- [ ] Frontend: Health meter-indikator
- [ ] Frontend: Eksport-knapp (CSV/Excel)
- [ ] Test at data kun vises for egen org (RLS)

---

### 3.5 Modul 21 – Kundeportal white-label + landingpages
**Kategori:** Frontend / Multi-tenant  
**Omfang:** L  
**Estimat:** 20-30 timer

**Berørte områder:**
- Frontend: `/kundeportal` eller `/min-side` (ny)
- Frontend: Public booking-side per org (f.eks. `lyxso.no/p/:orgSlug`)
- Supabase: `org_settings`-tabell med tema/farger/logo
- `lyx-api/routes/partnerLandingPage.mjs` (allerede startet)

**Beskrivelse:**
Sluttkunde skal se partnerens brand. Kundeportal hvor de kan se egne bookinger, kjøretøy, dekksett og coating-jobber. Public booking-side med org-tema. Landingssider generert fra DB (editor kommer senere).

**Sjekkliste:**
- [ ] Utvid `org_settings` med theme (primary_color, logo_url, cover_image_url)
- [ ] API: GET /api/public/:orgSlug/theme (hent tema for org)
- [ ] API: GET /api/public/:orgSlug/services (hent tilgjengelige tjenester)
- [ ] Frontend: `/p/:orgSlug` med public booking-skjema
- [ ] Frontend: `/min-side` (kundeportal) med login for sluttkunder
- [ ] Frontend: Kundeportal viser bookinghistorikk, kjøretøy, dekksett
- [ ] Frontend: Dynamisk theming basert på org_settings (farger, logo)
- [ ] Test at kundeportal kun viser data for innlogget kunde
- [ ] Test at public booking-side matcher org-tema

---

### 3.6 Modul 22 – Automatisering: triggere, påminnelser, workflows
**Kategori:** Backend / Automation  
**Omfang:** L  
**Estimat:** 20-30 timer

**Berørte områder:**
- Supabase tabeller: `automation_rules`, `automation_events`, `notifications`
- `lyx-api/cron/` (ny mappe)
- `lyx-api/services/automationEngine.mjs` (ny)
- Frontend: `/kontrollpanel` med av/på-regler og logg

**Beskrivelse:**
LYXso skal gjøre kjedelige ting automatisk. SMS-påminnelse 24t før booking. Coating-kontroll etter 12 mnd. Flagg kunde etter no-show. Workflows defineres i DB og kjøres av cron/queue.

**Sjekkliste:**
- [ ] Opprett `automation_rules`-tabell (org_id, rule_type, trigger, action, enabled)
- [ ] Opprett `automation_events`-tabell (org_id, rule_id, trigger_data, executed_at, status)
- [ ] Opprett `notifications`-tabell (org_id, type: sms/email, recipient, message, status, sent_at)
- [ ] Implementer cron-jobb som kjører hvert 15. minutt (sjekker automation_rules)
- [ ] Regel 1: SMS-påminnelse 24t før booking
- [ ] Regel 2: Coating-kontroll-påminnelse 14 dager før due_date
- [ ] Regel 3: Flagg kunde som "no-show" hvis booking ikke fullført
- [ ] Regel 4: Automatisk oppfølging etter coating-behandling (send e-post etter 7 dager)
- [ ] API: GET /api/automations (liste over regler for org)
- [ ] API: PATCH /api/automations/:id (aktiver/deaktiver regel)
- [ ] API: GET /api/automations/events (logg over kjørte events)
- [ ] Frontend: `/kontrollpanel` med liste over regler og toggle-knapper
- [ ] Frontend: Logg over kjørte events med tidspunkt og status

**Avhengigheter:** Krever e-post/SMS-funksjonalitet (2.6)

---

### 3.7 Modul 23 – Dokumentasjon, support og "klar for salg"
**Kategori:** Dokumentasjon / Support  
**Omfang:** M  
**Estimat:** 10-15 timer

**Berørte områder:**
- `docs/` (ny mappe med bruker dokumentasjon)
- Frontend: `/hjelp` eller `/dokumentasjon` i partnerportal
- Frontend: `/bli-partner` → intro-wizard

**Beskrivelse:**
Onboarding uten å sitte ved siden av partnere. "Kom i gang på 10 min"-guide. Teknisk doc (mappestruktur, tabeller, RLS, API). Hjelp-område med FAQ + kontakt. Sjekkliste for produksjon.

**Sjekkliste:**
- [ ] Skriv "Kom i gang på 10 minutter"-guide (markdown)
- [ ] Skriv teknisk dokumentasjon (arkitektur, tabeller, RLS-policies, API-referanse)
- [ ] Lag `/hjelp`-side i partnerportal med FAQ
- [ ] Lag onboarding-wizard på `/bli-partner` (3-5 steg)
- [ ] Implementer support-kontaktskjema (går til support@lyxso.no)
- [ ] Sjekkliste for produksjon (backup, logging, error-tracking, monitoring, env-doc)
- [ ] Test at FAQ dekker de vanligste spørsmålene
- [ ] Gjennomgå hele onboarding-flowet fra registrering til første booking

---

### 3.8 E2E-tester (Playwright/Cypress)
**Kategori:** Testing  
**Omfang:** L  
**Estimat:** 20-30 timer

**Beskrivelse:**
Implementer end-to-end-tester som simulerer reelle brukerscenarier. Test hele flows fra registrering til booking.

---

### 3.9 Multi-språk support (i18n)
**Kategori:** Frontend  
**Omfang:** M  
**Estimat:** 8-12 timer

**Beskrivelse:**
Legg til støtte for engelsk i tillegg til norsk. Nyttig hvis LYXso skal ekspandere til Sverige/Danmark senere.

---

### 3.10 Mobilapp (React Native / Flutter)
**Kategori:** Frontend  
**Omfang:** XL  
**Estimat:** 200+ timer

**Beskrivelse:**
Utvikle dedikert mobilapp for iOS og Android. Mer brukervenlig enn responsive web for mobile bilpleiere.

---

### 3.11 Avanserte AI-funksjoner
**Kategori:** AI  
**Omfang:** L  
**Estimat:** 30-40 timer per funksjon

**Beskrivelse:**
- AI-drevet bildeanalyse (skader, dekkslitasje)
- AI-drevet prisforslag basert på markedsdata
- AI-drevet kapasitetsplanlegging med historiske trender

---

### 3.12 Webhook-system for tredjepartsintegrasjoner
**Kategori:** Backend  
**Omfang:** M  
**Estimat:** 8-12 timer

**Beskrivelse:**
La partnere abonnere på webhooks når nye bookinger, kunder eller coating-jobber opprettes. Nyttig for integrasjon med egne systemer.

---

### 3.13 Admin-panel for LYXso-team
**Kategori:** Backend / Frontend  
**Omfang:** L  
**Estimat:** 20-30 timer

**Beskrivelse:**
Lag et internt admin-panel for LYXso-teamet til å:
- Se alle orgs og deres status
- Endre planer manuelt
- Deaktivere orgs ved behov
- Se bruksstatistikk (AI-calls, antall kunder per org, osv.)

---

### 3.14 Kampanjeverktøy med A/B-testing
**Kategori:** Marketing  
**Omfang:** L  
**Estimat:** 20-30 timer

**Beskrivelse:**
Lag verktøy for å opprette, kjøre og analysere A/B-tester på kampanjer (f.eks. to ulike annonsetekster).

---

### 3.15 Customer loyalty program / gamification
**Kategori:** Frontend / Backend  
**Omfang:** L  
**Estimat:** 25-35 timer

**Beskrivelse:**
Implementer et lojalitetsprogram hvor kunder samler poeng for hver booking. Partnere kan tilby belønninger.

---

### 3.16 Voice assistant (Alexa/Google Home)
**Kategori:** Integrasjoner  
**Omfang:** L  
**Estimat:** 30-40 timer

**Beskrivelse:**
Lag en voice skill for Alexa/Google Home som lar partnere si "Alexa, book en ny kunde" eller "Alexa, hvor mange bookinger har jeg i dag?"

---

## 📊 Oppsummering og estimater

| Nivå | Antall oppgaver | Total estimert tid |
|------|-----------------|-------------------|
| **Nivå 1 (MÅ)** | 12 oppgaver | 45-65 timer |
| **Nivå 2 (BØR)** | 13 oppgaver | 150-215 timer |
| **Nivå 3 (KAN)** | 16 oppgaver | 600+ timer |

**Anbefalt tidsplan:**
- **Uke 1-2:** Fullfør Nivå 1 (sikkerhet, deploy, testing)
- **Uke 3:** Lansering i beta (begrenset antall partnere)
- **Uke 4-8:** Fullfør Nivå 2 prioriterte oppgaver:
  - Uke 4: Betaling (2.5) + E-post (2.6)
  - Uke 5: Modul 14 (Økonomi) + Modul 15 (Dekkhotell PRO)
  - Uke 6: Modul 16 (Coating PRO)
  - Uke 7: Regnskap fase 1 (2.7) + Modul 19 (Plan/billing)
  - Uke 8: Modul 23 (Dokumentasjon) + ytelse (2.8)
- **Uke 9-12:** Nivå 2 nice-to-have (Rate limiting, logging, analytics, status-side)
- **Uke 13+:** Nivå 3 basert på tilbakemeldinger fra partnere og prioritering

**Kritiske moduler først (etter Nivå 1):**
1. **Modul 14** (Økonomi) – betalinger må fungere ✅
2. **Modul 15** (Dekkhotell PRO) – stor differensiator ✅
3. **Modul 16** (Coating PRO) – 5-års garanti, kontroller ✅
4. **Modul 19** (Plan/billing) – må kunne fakturere partnere ✅
5. **Modul 23** (Dokumentasjon) – må kunne selge! ✅

**Nice-to-have (kan vente):**
- Modul 17 (Markedsføring) – kan starte enkelt senere
- Modul 18 (Multi-lokasjon) – bare for større partnere
- Modul 20 (CEO-view) – rapport kan være enklere først
- Modul 21 (White-label) – landingssider ferdig, kundeportal senere
- Modul 22 (Automatisering) – start med manuell påminnelse

---

## ✅ Launch Checklist (dag-for-lansering)

### Pre-flight:
- [ ] Alle Nivå 1-oppgaver er fullført
- [ ] Alle secrets er rotert og konfigurert i Vercel/Fly.io
- [ ] RLS er testet grundig (ingen datalekkasje mellom orgs)
- [ ] Health checks fungerer
- [ ] Sentry fanger errors
- [ ] Backup-rutiner er testet
- [ ] Personvernerklæring og bruksvilkår er publisert
- [ ] Custom domains er konfigurert (lyxso.no, api.lyxso.no)
- [ ] SSL-sertifikater er aktive

### Launch-dag:
- [ ] Deploy frontend til Vercel (prod)
- [ ] Deploy backend til Fly.io (prod)
- [ ] Test at alt fungerer i prod-miljø
- [ ] Overvåk Sentry for errors (første 2 timer)
- [ ] Overvåk uptime monitoring
- [ ] Test registrering og login i prod
- [ ] Send kunngjøring til early-access-liste (hvis relevant)

### Post-launch (første uke):
- [ ] Daglig sjekk av Sentry errors
- [ ] Daglig sjekk av database-ytelse
- [ ] Samle tilbakemeldinger fra første partnere
- [ ] Prioriter bugs og quick wins
- [ ] Start på Nivå 2-oppgaver

---

## 🔗 Relaterte dokumenter

- **Tilstandsrapport:** `TILSTANDSRAPPORT_KOMPLETT.md`
- **AI-opprydding:** `docs/ai-opprydding-status.md`
- **Konfigurasjon:** `docs/konfigurasjon-og-hemmeligheter.md`
- **Public pages:** `docs/public-pages-status.md`
- **RLS-rapport:** `RLS_SLUTTRAPPORT.md`

---

## ❓ Oppfølgingsspørsmål til eier

1. **Domenenavn:** Er `lyxso.no` allerede registrert? Skal vi bruke `lyxso.no` eller noe annet?
2. **Betalingsløsning:** Skal vi starte med Vipps, Stripe eller begge?
3. **Regnskapsintegrasjon:** Hvilken regnskapssystem prioriterer vi først? (Fiken, Tripletex, PowerOffice)
4. **Launch-dato:** Er det en målsatt dato for beta-lansering?
5. **Early access:** Finnes det allerede en liste med interesserte partnere som venter?
6. **Juridisk:** Trenger vi advokat til å gjennomgå personvernerklæring og bruksvilkår?
7. **Support:** Hvordan skal support håndteres? (E-post, chat, telefon?)
8. **Priser:** Hva skal de faktiske prisene være for Start/Pro/Max-planene?

---

**Sist oppdatert:** 29. november 2024  
**Neste revisjon:** Etter fullføring av Nivå 1-oppgaver
