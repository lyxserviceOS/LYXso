# 🧑‍💻 Copilot Instructions for LYX Selskaper

## Big Picture Architecture
- **Multi-tenant SaaS platform** for booking, customer management, and AI modules.
- **Backend:** Node.js + Express (`lyx-api/`)
  - 75+ API routes in `routes/`
  - Business logic in `services/`
  - Database migrations in `migrations/`
- **Frontend:** Next.js (`lyxso-app/`)
  - 100+ pages in `app/`
  - Shared React components in `components/`
- **Database:** Supabase Postgres
  - 137+ tables, all with Row Level Security (RLS) enabled
  - Multi-tenant: all business data tables have `org_id`
  - See `SUPABASE_FASIT.md` for schema and RLS details

## Critical Developer Workflows
- **Build:** Use `msbuild` for Windows builds (see VS Code build task)
- **Deploy:** Use `deploy-fly.ps1` for production deployment
- **Database:** Seed plans with `SEED_SUBSCRIPTION_PLANS.sql` and push changes using `push-sql-to-supabase.js`
- **Testing:**
  - Test all AI modules with real API keys
  - Test public booking flow end-to-end
  - Test customer portal with real users
- **Stripe:** Webhooks setup required for plan/addon management

## Project-Specific Conventions
- **All business tables** must include `org_id` for multi-tenancy
- **RLS policies** are enforced on all tables (see `SUPABASE_FASIT.md`)
- **Documentation:**
  - Start with `FAKTISK_KODE_ANALYSE_6_DES_2024.md` for true system status
  - Use `NIKOLAI_SKAL_GJØRE_DETTE.md` for manual task lists
  - `GJENSTÅENDE_OPPGAVER_FRONTEND_BACKEND.md` for remaining dev work
- **Scripts:**
  - JS scripts for DB and integration tasks in root and `archive/`
  - PowerShell scripts for deployment

## Integration Points & External Dependencies
- **Supabase:** Main DB, RLS, migrations
- **Stripe:** Payments, webhooks
- **Twilio, SendGrid:** Messaging integrations
- **AI modules:** 11+ modules, all production-ready

## Examples & Key Files
- `lyx-api/routes/` — API endpoints
- `lyxso-app/app/` — Next.js pages
- `SUPABASE_FASIT.md` — DB schema, RLS, multi-tenancy
- `deploy-fly.ps1` — Production deployment
- `SEED_SUBSCRIPTION_PLANS.sql` — DB seeding
- `push-sql-to-supabase.js` — DB migration push

---
**For new agents:**
- Always check the latest status in `FAKTISK_KODE_ANALYSE_6_DES_2024.md`
- Follow the manual task list in `NIKOLAI_SKAL_GJØRE_DETTE.md`
- Reference `SUPABASE_FASIT.md` for any DB work
- Use project scripts for DB and deployment tasks
- Ask for clarification if any workflow or convention is unclear
