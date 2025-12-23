# LYXso - Full Deployment Analysis & TODO List

**Analysis Date:** December 23, 2025  
**Repository:** lyxserviceOS/LYXso  
**Current Branch:** copilot/analyze-vercel-flyio-errors

---

## Executive Summary

This document provides a comprehensive analysis of the LYXso application deployment status on Vercel and Fly.io, identifies all errors and issues, and provides a complete TODO list to achieve a perfectly working website.

### Overall Status: 🔴 CRITICAL ISSUES FOUND

- **Build Status:** ❌ FAILING (2 critical errors)
- **Security:** ⚠️ 1 high severity vulnerability
- **Dependencies:** ⚠️ Deprecated packages detected
- **Deployment Readiness:** ❌ NOT READY (build must succeed first)

---

## 1. Vercel Deployment Analysis

### Configuration Status

#### ✅ Vercel Configuration Present
- **File:** `vercel.json` exists and is properly configured
- **Framework:** Next.js 16.0.7
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Max Function Duration:** 30 seconds for API routes

#### ⚠️ GitHub Actions Workflow
- **File:** `.github/workflows/nextjs.yml`
- **Target:** GitHub Pages (NOT Vercel)
- **Issue:** This workflow deploys to GitHub Pages, not Vercel
- **Impact:** May cause confusion about deployment targets

### Current Vercel Deployment Issues

#### 1. Build Failures (CRITICAL)
**Status:** 🔴 BLOCKING DEPLOYMENT

The build currently fails with 2 critical module resolution errors:

```
Module not found: Can't resolve '@/lib/hooks/useAiOnboarding'
Module not found: Can't resolve '@/lib/hooks/useAiOnboardingHints'
```

**Root Cause:** Recent commit `fb98f25` removed these modules but dependent files were not updated.

**Affected Files:**
- `app/(public)/register/page.tsx` (line 6)
- `components/register/Step2_AiHintsPanel.tsx` (line 8)
- `components/register/Step2_3_OpeningHoursAndCapacity.tsx` (imports Step2_AiHintsPanel)

#### 2. Deprecated Sentry Configuration (WARNING)
**Status:** ⚠️ NON-BLOCKING but needs attention

```
[@sentry/nextjs] DEPRECATION WARNING: disableLogger is deprecated
[@sentry/nextjs] DEPRECATION WARNING: automaticVercelMonitors is deprecated
[@sentry/nextjs] DEPRECATION WARNING: reactComponentAnnotation is deprecated
```

**File:** `next.config.ts` (lines 133, 139, 122)
**Impact:** These will be removed in future Sentry versions

#### 3. Missing Build Cache
**Status:** ⚠️ PERFORMANCE ISSUE

```
⚠ No build cache found. Please configure build caching
```

**Impact:** Slower build times on Vercel

#### 4. Environment Variables
**Required Variables (from README.md):**
```env
NEXT_PUBLIC_API_BASE_URL
NEXT_PUBLIC_ORG_ID (or NEXT_PUBLIC_DEFAULT_ORG_ID)
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_ADMIN_EMAIL
```

**Sentry Variables (from config files):**
```env
SENTRY_ORG
SENTRY_PROJECT
NEXT_PUBLIC_SENTRY_DSN (implied)
```

**Stripe Variables (from lib/stripe.ts likely):**
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (implied)
```

**Status:** ❓ Cannot verify if these are set in Vercel dashboard without access

---

## 2. Fly.io Deployment Analysis

### Configuration Status

#### ❌ No Fly.io Configuration Found
- **Expected Files:** `fly.toml`, `Dockerfile`, `.dockerignore`
- **Found:** NONE
- **Status:** 🔴 Fly.io deployment not configured

### Backend API Reference
According to documentation:
- **Backend API URL:** `https://lyxso-api.fly.dev`
- **Environment Variable:** `NEXT_PUBLIC_API_BASE_URL`
- **Status:** This suggests the backend API is hosted on Fly.io, but no configuration exists in this repository

**Conclusion:** The Fly.io setup is likely in a separate repository (possibly `lyx-api` mentioned in `LAUNCH_CHECKLIST.md`)

---

## 3. Security Issues

### NPM Audit Findings

#### 🔴 High Severity Vulnerability
**Count:** 1 high severity issue
**Command to fix:** `npm audit fix --force`
**Status:** SHOULD BE ADDRESSED BEFORE DEPLOYMENT

**Recommendation:** Review the specific vulnerability with `npm audit` and apply appropriate fixes

### Next.js Security Vulnerability
**Issue:** Next.js 16.0.7 has a known security vulnerability
**Announcement:** https://nextjs.org/blog/security-update-2025-12-11
**Action Required:** Upgrade to patched version

### Deprecated Packages
1. **@supabase/auth-helpers-nextjs@0.15.0**
   - Status: No longer supported
   - Used in: Authentication flows
   - Migration needed to: `@supabase/ssr` (already installed)

---

## 4. Code Quality Issues

### TypeScript Configuration
**File:** `tsconfig.json`
**Status:** ✅ Properly configured with strict mode

### Missing Dependencies

Based on import statements and code analysis, these hooks need to be recreated:

1. **useAiOnboarding** (Missing)
   - Location: Should be at `lib/hooks/useAiOnboarding.ts`
   - Used by: `app/(public)/register/page.tsx`
   - Functions needed:
     - `runOnboarding(orgId, input)`
     - `applyOnboarding(orgId, sessionId)`
     - `retryRun(orgId, input)`

2. **useAiOnboardingHints** (Missing)
   - Location: Should be at `lib/hooks/useAiOnboardingHints.ts`
   - Used by: `components/register/Step2_AiHintsPanel.tsx`
   - Functions needed:
     - Real-time AI hints based on user input
     - Debouncing mechanism
     - Caching support

### Route Conflicts (From LAUNCH_CHECKLIST.md)

#### ⚠️ Duplicate Booking Pages
**Issue:** Two `/booking` routes exist:
- `app/(protected)/booking` - Internal booking calendar
- `app/(public)/booking` - Should be deleted (use `/bestill` instead)

**Action:** Delete `app/(public)/booking` directory

---

## 5. Backend API Issues

### API Endpoint Status (From Documentation)

#### ✅ Working Endpoints
- Customer management (CRUD)
- Booking management
- Coating jobs
- Tire storage
- Organization settings
- Services & Employees
- Partner onboarding
- AI chat

#### ⚠️ Missing/Not Implemented Endpoints
These endpoints return 404 but are called by the frontend:

1. `/api/orgs/:orgId/modules` - Module settings
2. `/api/orgs/:orgId/service-settings` - Service settings
3. `/api/orgs/:orgId/booking-settings` - Booking settings
4. `/api/orgs/:orgId/tyre-settings` - Tire settings
5. `/api/orgs/:orgId/ai/onboarding/run` - AI onboarding (has RLS issues)
6. `/api/orgs/:orgId/ai/onboarding/apply` - Apply AI suggestions

**Impact:** Frontend handles these gracefully with warnings, but features don't persist

---

## 6. Database Issues

### Required Schema Updates (From LAUNCH_CHECKLIST.md)

#### Customer Table - New Columns
The `customers` table needs these columns:

```sql
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS has_tire_hotel BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_coating BOOLEAN DEFAULT false;
```

**Status:** ❓ Unknown if these migrations have been applied

### RLS Policy Issues
**Problem:** AI onboarding endpoints fail with `ai_onboarding_fetch_org` error
**Cause:** Row Level Security policies may be blocking organization data reads
**Impact:** AI features don't work reliably

---

## 7. Performance Issues

### Bundle Optimization
**Current Configuration:** `next.config.ts` has extensive optimizations
- ✅ Tree shaking enabled
- ✅ Code splitting configured
- ✅ Image optimization configured
- ✅ CSS optimization enabled
- ✅ Package import optimization for Supabase and Lucide

**Issue:** Production source maps disabled
- **Setting:** `productionBrowserSourceMaps: false`
- **Impact:** Harder to debug production errors
- **Recommendation:** Enable for better Sentry integration

### Build Cache
No build cache configuration for Vercel, leading to slower deployments

---

## 8. Comparison: Vercel vs Fly.io

| Aspect | Vercel | Fly.io |
|--------|--------|--------|
| **Configuration** | ✅ Present (`vercel.json`) | ❌ Missing (no `fly.toml`) |
| **Framework Support** | ✅ Native Next.js support | ❓ Requires Docker setup |
| **Deployment** | ⚠️ Blocked by build errors | ❌ Not configured |
| **Environment** | Frontend hosting | Backend API hosting |
| **Auto-deployment** | ✅ Configured via GitHub | ❓ Unknown |
| **Build Status** | 🔴 FAILING | N/A (not set up) |
| **Best Use Case** | Frontend (Next.js) | Backend API (Node.js) |

### Recommendation
- **Vercel:** Should host the Next.js frontend (this repository)
- **Fly.io:** Should host the backend API (separate repository)
- **Current State:** Vercel deployment blocked by build errors

---

## 9. Complete TODO List (Prioritized)

### 🔴 CRITICAL - Must Fix Before Deployment

#### 1. Fix Build Errors (HIGHEST PRIORITY)
- [ ] **Option A:** Recreate missing hooks
  - [ ] Create `lib/hooks/useAiOnboarding.ts`
  - [ ] Create `lib/hooks/useAiOnboardingHints.ts`
  - [ ] Implement required functions based on `CURRENT_STATE_REPORT.md`
  
- [ ] **Option B:** Remove AI features temporarily
  - [ ] Remove imports from `app/(public)/register/page.tsx`
  - [ ] Remove imports from `components/register/Step2_AiHintsPanel.tsx`
  - [ ] Comment out AI-related functionality
  - [ ] Add feature flag for future re-enablement

**Estimated Time:** 2-4 hours (Option A) or 30 minutes (Option B)

#### 2. Fix Security Vulnerabilities
- [ ] Run `npm audit` to identify specific vulnerability
- [ ] Review the vulnerability impact
- [ ] Apply `npm audit fix` or manual fix
- [ ] Test application after fixes
- [ ] Document any breaking changes

**Estimated Time:** 30-60 minutes

#### 3. Upgrade Next.js
- [ ] Review Next.js security advisory
- [ ] Test upgrade in development: `npm install next@latest`
- [ ] Fix any breaking changes
- [ ] Update documentation if needed
- [ ] Commit and test build

**Estimated Time:** 1-2 hours

### 🟡 HIGH PRIORITY - Should Fix Before Launch

#### 4. Delete Duplicate Booking Route
- [ ] Remove `app/(public)/booking` directory
- [ ] Verify `/bestill` route works for public booking
- [ ] Update any internal links
- [ ] Test booking flow

**Estimated Time:** 15 minutes

#### 5. Update Sentry Configuration
- [ ] Update `next.config.ts` to use new Sentry config format:
  ```typescript
  webpack: {
    treeshake: {
      removeDebugLogging: true
    },
    automaticVercelMonitors: true,
    reactComponentAnnotation: {
      enabled: true
    }
  }
  ```
- [ ] Remove deprecated top-level options
- [ ] Test Sentry integration still works

**Estimated Time:** 30 minutes

#### 6. Migrate from auth-helpers-nextjs to @supabase/ssr
- [ ] Find all uses of `@supabase/auth-helpers-nextjs`
- [ ] Replace with `@supabase/ssr` (already installed)
- [ ] Update authentication flows
- [ ] Test login/logout/registration
- [ ] Remove deprecated package: `npm uninstall @supabase/auth-helpers-nextjs`

**Estimated Time:** 2-3 hours

#### 7. Verify Environment Variables
- [ ] Access Vercel dashboard
- [ ] Verify all required env vars are set:
  - [ ] `NEXT_PUBLIC_API_BASE_URL`
  - [ ] `NEXT_PUBLIC_ORG_ID` or `NEXT_PUBLIC_DEFAULT_ORG_ID`
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `NEXT_PUBLIC_ADMIN_EMAIL`
  - [ ] `SENTRY_ORG`
  - [ ] `SENTRY_PROJECT`
  - [ ] `NEXT_PUBLIC_SENTRY_DSN`
  - [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] Add any missing variables
- [ ] Trigger new deployment to apply changes

**Estimated Time:** 15-30 minutes

### 🟢 MEDIUM PRIORITY - Improve Stability

#### 8. Configure Fly.io (if needed)
- [ ] Determine if frontend should also deploy to Fly.io
- [ ] If yes, create `fly.toml` configuration
- [ ] Create `Dockerfile` for Next.js
- [ ] Create `.dockerignore` file
- [ ] Test Docker build locally
- [ ] Deploy to Fly.io staging environment

**Estimated Time:** 3-4 hours (if needed)

#### 9. Fix Backend API Endpoints
These should be implemented in the backend API repository:
- [ ] Implement `/api/orgs/:orgId/modules` endpoint
- [ ] Implement `/api/orgs/:orgId/service-settings` endpoint
- [ ] Implement `/api/orgs/:orgId/booking-settings` endpoint
- [ ] Implement `/api/orgs/:orgId/tyre-settings` endpoint
- [ ] Fix RLS policies for AI onboarding endpoints
- [ ] Test all endpoints return proper responses

**Estimated Time:** 4-6 hours (backend work)

#### 10. Apply Database Migrations
- [ ] Connect to Supabase database
- [ ] Run SQL to add new columns to `customers` table:
  ```sql
  ALTER TABLE customers 
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS has_tire_hotel BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS has_coating BOOLEAN DEFAULT false;
  ```
- [ ] Verify columns exist
- [ ] Test customer management features
- [ ] Update existing customer records if needed

**Estimated Time:** 30 minutes

#### 11. Fix GitHub Actions Workflow
- [ ] Decide on deployment target (GitHub Pages or Vercel)
- [ ] If Vercel: Remove or disable `.github/workflows/nextjs.yml`
- [ ] If GitHub Pages: Update workflow and understand it won't have backend API access
- [ ] Document deployment strategy

**Estimated Time:** 30 minutes

### 🔵 LOW PRIORITY - Nice to Have

#### 12. Enable Production Source Maps
- [ ] Update `next.config.ts`: Set `productionBrowserSourceMaps: true`
- [ ] Configure Sentry to use source maps
- [ ] Test error reporting includes source maps
- [ ] Monitor bundle size impact

**Estimated Time:** 30 minutes

#### 13. Configure Build Caching
- [ ] Research Vercel build cache configuration
- [ ] Add cache configuration to `vercel.json` or build settings
- [ ] Test deployment speed improvement
- [ ] Document configuration

**Estimated Time:** 1 hour

#### 14. Update Customer Management UI
From LAUNCH_CHECKLIST.md, these features need frontend updates:
- [ ] Update customer detail page to use new CRM endpoints
- [ ] Add search functionality to customer list
- [ ] Add filters (Active, Tire Hotel, Coating)
- [ ] Test customer statistics display
- [ ] Test customer notes functionality

**Estimated Time:** 4-6 hours

#### 15. Add Monitoring and Alerts
- [ ] Configure Vercel Analytics
- [ ] Set up Sentry alerts for critical errors
- [ ] Add custom error boundaries
- [ ] Configure uptime monitoring
- [ ] Set up Slack/email notifications

**Estimated Time:** 2-3 hours

#### 16. Add E2E Tests
- [ ] Set up Playwright or Cypress
- [ ] Write tests for critical flows:
  - [ ] User registration
  - [ ] User login
  - [ ] Booking creation
  - [ ] Customer management
- [ ] Integrate with CI/CD
- [ ] Document test strategy

**Estimated Time:** 8-12 hours

---

## 10. Deployment Checklist

### Pre-Deployment
- [ ] All critical TODOs completed (items 1-3)
- [ ] All high priority TODOs completed (items 4-7)
- [ ] Local build succeeds: `npm run build`
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] No linting errors: `npm run lint`
- [ ] All environment variables configured
- [ ] Security vulnerabilities addressed

### Vercel Deployment
- [ ] Connect repository to Vercel
- [ ] Configure environment variables in Vercel dashboard
- [ ] Set framework preset to "Next.js"
- [ ] Set Node.js version to 20.x
- [ ] Configure build command: `npm run build`
- [ ] Configure install command: `npm install`
- [ ] Enable automatic deployments from main branch
- [ ] Deploy to preview environment first
- [ ] Test preview deployment thoroughly
- [ ] Promote to production

### Post-Deployment
- [ ] Verify frontend loads correctly
- [ ] Test all critical user flows
- [ ] Check Sentry for errors
- [ ] Monitor performance metrics
- [ ] Test API connectivity
- [ ] Verify database connections work
- [ ] Check authentication flows
- [ ] Test payment integration (if applicable)

### Rollback Plan
- [ ] Document how to rollback to previous deployment
- [ ] Keep previous deployment available
- [ ] Have database backup ready
- [ ] Test rollback procedure in staging

---

## 11. Risk Assessment

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| Build fails in production | 🔴 High | High (currently failing) | Fix build errors before deploying |
| Missing environment variables | 🔴 High | Medium | Verify all vars in dashboard |
| Security vulnerability exploited | 🔴 High | Low | Apply security updates immediately |
| API endpoints return 404 | 🟡 Medium | High (known issue) | Graceful error handling exists |
| Database migration fails | 🟡 Medium | Low | Test in staging first |
| Authentication breaks | 🔴 High | Medium | Thorough testing after Supabase migration |
| Performance degradation | 🟡 Medium | Low | Monitoring in place |
| Rollback needed | 🟡 Medium | Low | Document rollback procedure |

---

## 12. Timeline Estimate

### Minimum Viable Deployment (Critical Only)
**Estimated Time:** 4-8 hours
- Fix build errors
- Fix security issues
- Upgrade Next.js
- Verify deployment

### Complete Production-Ready Deployment
**Estimated Time:** 20-30 hours
- All critical items
- All high priority items
- Most medium priority items
- Basic monitoring and tests

### Full Feature Complete
**Estimated Time:** 40-60 hours
- All TODO items
- Comprehensive testing
- Full monitoring setup
- Documentation complete

---

## 13. Recommended Immediate Actions

### Next 1 Hour:
1. **Fix build errors** - Choose Option A or B from TODO #1
2. **Test build locally** - Verify `npm run build` succeeds
3. **Commit and push** - Get code ready for deployment

### Next 4 Hours:
4. **Fix security issues** - Address npm audit findings
5. **Upgrade Next.js** - Apply security patch
6. **Delete duplicate booking route** - Clean up conflicts
7. **Test thoroughly** - Verify app works end-to-end

### Next 8 Hours:
8. **Update Sentry config** - Remove deprecation warnings
9. **Migrate Supabase auth** - Remove deprecated package
10. **Verify environment variables** - Ensure all are set in Vercel
11. **Deploy to Vercel preview** - Test in production-like environment

---

## 14. Success Criteria

Deployment is considered successful when:

- [x] ✅ Build completes without errors
- [x] ✅ No high/critical security vulnerabilities
- [x] ✅ Application loads in browser
- [x] ✅ User can register new account
- [x] ✅ User can log in
- [x] ✅ Dashboard displays correctly
- [x] ✅ API calls succeed (or fail gracefully)
- [x] ✅ No console errors (except known 404s)
- [x] ✅ Sentry receives error reports
- [x] ✅ Performance metrics are acceptable
- [x] ✅ Mobile responsive design works
- [x] ✅ All critical user flows functional

---

## 15. Conclusion

The LYXso application is **not currently ready for deployment** due to critical build errors. However, with focused effort on the critical TODOs, the application can be deployment-ready within 4-8 hours.

### Summary of Findings:

**Vercel (Frontend):**
- ❌ Build failing (2 module resolution errors)
- ⚠️ Security vulnerabilities present
- ⚠️ Deprecated packages need migration
- ✅ Configuration files present and mostly correct
- ✅ Framework and optimization setup is good

**Fly.io (Backend):**
- ❌ No configuration in this repository
- ⚠️ Backend API has missing endpoints (404s)
- ⚠️ Database RLS policies need fixing
- ❓ Likely configured in separate repository

**Priority Action:**
Fix the build errors immediately. Without a successful build, nothing else matters.

---

## 16. Additional Resources

### Documentation References:
- `LAUNCH_CHECKLIST.md` - Comprehensive pre-launch checklist
- `CURRENT_STATE_REPORT.md` - Current state of frontend auth
- `README.md` - Environment variables and setup
- `MODULES_ENDPOINT_STATUS.md` - Missing endpoint details

### External Resources:
- [Vercel Deployment Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Fly.io Docs](https://fly.io/docs/)
- [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side-rendering)

---

**Report Generated:** December 23, 2025  
**Author:** GitHub Copilot  
**Version:** 1.0  
**Status:** READY FOR ACTION
