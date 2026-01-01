# Quick Fix Guide - Critical Issues

This guide provides step-by-step instructions to fix the remaining critical issues blocking the build.

**Estimated Time:** 4-6 hours  
**Priority:** HIGH - These fixes are required for a successful build

---

## 🎯 Critical Fix #1: useSearchParams() Suspense Boundaries (30-60 min)

### Problem
Multiple pages use `useSearchParams()` without wrapping in a Suspense boundary, which is required in Next.js 13+.

### Files to Fix
1. `app/(protected)/rapporter/marketing-roi/page.tsx`
2. `app/(dashboard)/reports/bookings/page.tsx`
3. `app/(dashboard)/reports/customers/page.tsx`
4. `app/(dashboard)/reports/revenue/page.tsx`
5. `app/(dashboard)/reports/page.tsx`

### Solution Pattern

**Before:**
```tsx
"use client";
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  
  return <div>{/* content */}</div>;
}
```

**After:**
```tsx
"use client";
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  
  return <div>{/* content */}</div>;
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}
```

### Apply the Fix

For each file:
1. Open the file
2. Import `Suspense` from React
3. Create a new component (e.g., `PageContent`) that wraps existing content
4. Move `useSearchParams()` call into the new component
5. Wrap the new component in `<Suspense>` in the default export
6. Add appropriate loading fallback

### Testing
After fixing each file:
```bash
npm run build
```

Continue until all files are fixed and build succeeds.

---

## 🎯 Critical Fix #2: React Hooks Violations (1-2 hours)

### Problem: setState in useEffect

**Files to Fix:**
- `app/(protected)/[orgId]/innstillinger/lokasjoner/LocationModal.tsx:42`
- `app/(protected)/[orgId]/innstillinger/ressurser/ResourceModal.tsx:61`

**Current Code (LocationModal.tsx):**
```tsx
const [formData, setFormData] = useState(defaultFormData);

useEffect(() => {
  if (location) {
    setFormData(location); // ❌ BAD - setState in effect
  }
}, [location]);
```

**Fixed Code (Option 1 - State Initialization):**
```tsx
// Initialize state with the prop value
const [formData, setFormData] = useState(location || defaultFormData);

// Remove the useEffect entirely
```

**Fixed Code (Option 2 - Key-based Reset):**
```tsx
// Add key to component to force remount when location changes
export default function LocationModal({ location, ... }) {
  return <div key={location?.id}>{/* content */}</div>;
}
```

**Fixed Code (Option 3 - useMemo):**
```tsx
import { useMemo } from 'react';

const initialFormData = useMemo(() => {
  return location || defaultFormData;
}, [location]);

const [formData, setFormData] = useState(initialFormData);
```

### Recommended Approach
Use **Option 1** (state initialization) for simple cases, or **Option 3** (useMemo) for complex initialization logic.

### Apply the Fix

1. Open `app/(protected)/[orgId]/innstillinger/lokasjoner/LocationModal.tsx`
2. Replace the useEffect pattern with state initialization
3. Test the modal still works correctly
4. Repeat for `ResourceModal.tsx`

---

## 🎯 Critical Fix #3: Function Hoisting Issues (30 min)

### Problem
Functions are being called in useEffect before they're declared.

**Files to Fix:**
- `app/(protected)/[orgId]/innstillinger/lokasjoner/LocationsList.tsx:30`
- `app/(protected)/[orgId]/innstillinger/ressurser/ResourceModal.tsx:59`

**Current Code:**
```tsx
useEffect(() => {
  fetchLocations(); // ❌ Called before declaration
}, []);

async function fetchLocations() {
  // ...
}
```

**Fixed Code:**
```tsx
import { useCallback } from 'react';

const fetchLocations = useCallback(async () => {
  // ... same implementation
}, []); // Add dependencies if any

useEffect(() => {
  fetchLocations(); // ✅ Now properly defined
}, [fetchLocations]);
```

### Apply the Fix

1. Open each file
2. Import `useCallback` from React
3. Convert function declaration to `const` with `useCallback`
4. Add `fetchLocations` to useEffect dependencies
5. Verify no infinite loops (check callback dependencies)

---

## 🎯 Critical Fix #4: Missing useEffect Dependencies (30 min)

### Files to Fix
- `app/(dashboard)/reports/bookings/page.tsx:66`
- `app/(dashboard)/reports/customers/page.tsx:76`
- `app/(dashboard)/reports/page.tsx:83`
- `app/(dashboard)/reports/revenue/page.tsx:72`

**Current Code:**
```tsx
const fetchBookingsData = async () => {
  // ... fetch logic
};

useEffect(() => {
  fetchBookingsData(); // ⚠️ Missing dependency
}, []);
```

**Fixed Code:**
```tsx
import { useCallback } from 'react';

const fetchBookingsData = useCallback(async () => {
  // ... same fetch logic
}, []); // Add any external dependencies here

useEffect(() => {
  fetchBookingsData();
}, [fetchBookingsData]); // ✅ Dependency added
```

### Apply the Fix

For each file:
1. Wrap the fetch function in `useCallback`
2. Add the function to useEffect dependencies
3. Identify any external dependencies (props, state) used in the function
4. Add those to the `useCallback` dependency array

---

## 🎯 Environment Variables Setup (30 min)

### Vercel Dashboard

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add these **required** variables:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://lyxso-api.fly.dev

# Organization
NEXT_PUBLIC_ORG_ID=your-actual-org-id-here
NEXT_PUBLIC_DEFAULT_ORG_ID=your-actual-org-id-here

# Supabase (Client)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key

# Supabase (Server)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key

# Admin
NEXT_PUBLIC_ADMIN_EMAIL=admin@yourdomain.com
```

4. Add these **optional** variables if you use them:

```bash
# Sentry
SENTRY_DSN=your-sentry-dsn
SENTRY_ORG=your-org-name
SENTRY_PROJECT=your-project-name
SENTRY_AUTH_TOKEN=your-auth-token

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FB_PIXEL_ID=your-pixel-id

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_STRIPE_PRICE_ID_STARTER=price_...
NEXT_PUBLIC_STRIPE_PRICE_ID_GROWTH=price_...
NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE=price_...

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id

# ReCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-site-key
```

5. Save and redeploy

### GitHub Actions

1. Go to repository Settings → Secrets and variables → Actions
2. Add these secrets:

```
SUPABASE_ACCESS_TOKEN=your-access-token
SUPABASE_DB_PASSWORD=your-db-password
```

---

## 🧪 Testing After Fixes (1-2 hours)

### 1. Local Build Test
```bash
# Ensure you have .env.local with real values
npm run build
```

Expected: ✅ Build completes successfully

### 2. Local Runtime Test
```bash
npm run dev
```

Test these flows:
- [ ] Registration (email + password)
- [ ] Registration (Google OAuth)
- [ ] Login (email + password)
- [ ] Login (Google OAuth)
- [ ] Dashboard loads correctly
- [ ] Create a booking
- [ ] View customers list
- [ ] View reports
- [ ] Update settings
- [ ] Logout

### 3. Production Deployment Test
```bash
vercel --prod
```

Test same flows in production environment.

### 4. Monitor Errors
- Check Vercel deployment logs
- Check Sentry for runtime errors
- Check browser console for client errors

---

## 📊 Progress Tracking

Use this checklist to track your progress:

### Critical Fixes
- [ ] Fix useSearchParams in rapporter/marketing-roi
- [ ] Fix useSearchParams in reports/bookings
- [ ] Fix useSearchParams in reports/customers
- [ ] Fix useSearchParams in reports/revenue
- [ ] Fix useSearchParams in reports/page
- [ ] Fix setState in LocationModal
- [ ] Fix setState in ResourceModal
- [ ] Fix function hoisting in LocationsList
- [ ] Fix function hoisting in ResourceModal
- [ ] Fix useEffect deps in reports/bookings
- [ ] Fix useEffect deps in reports/customers
- [ ] Fix useEffect deps in reports/page
- [ ] Fix useEffect deps in reports/revenue

### Environment Setup
- [ ] Set Vercel environment variables
- [ ] Set GitHub Actions secrets
- [ ] Create local .env.local

### Testing
- [ ] Local build passes
- [ ] Local dev server runs
- [ ] Registration flow works
- [ ] Login flow works
- [ ] Dashboard loads
- [ ] Production deployment successful

---

## 🆘 Troubleshooting

### Build Still Fails
1. Check error message carefully
2. Search for the specific error in COMPREHENSIVE_ANALYSIS.md
3. Verify all fixes were applied correctly
4. Check for new errors introduced by fixes

### TypeScript Errors
```bash
# Type check without building
npx tsc --noEmit
```

### ESLint Errors
```bash
# Check specific file
npx eslint path/to/file.tsx

# Try auto-fix
npx eslint path/to/file.tsx --fix
```

### Environment Variable Issues
1. Verify variables are set in Vercel dashboard
2. Check variable names match exactly (case-sensitive)
3. Redeploy after changing variables
4. Check that .env.local exists locally

---

## ✅ Success Criteria

You're done when:
1. ✅ `npm run build` completes without errors
2. ✅ `npm run dev` starts successfully
3. ✅ All critical user flows work
4. ✅ Production deployment succeeds
5. ✅ No errors in Sentry for 24 hours

---

## 📞 Need Help?

If you get stuck:
1. Check COMPREHENSIVE_ANALYSIS.md for detailed explanations
2. Search existing GitHub issues
3. Create a new issue with:
   - Error message
   - File/line number
   - What you tried
   - Environment (local/prod)

---

**Last Updated:** 2026-01-01  
**Next Review:** After critical fixes complete  
**Estimated Time:** 4-6 hours total
