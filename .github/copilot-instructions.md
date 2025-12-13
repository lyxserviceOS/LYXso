# LYXso - Copilot Instructions

This document provides instructions for GitHub Copilot to assist with development on the LYXso project.

## Project Overview

LYXso is a comprehensive booking and CRM system built with Next.js, featuring:
- Multi-tenant architecture with organization-based access control
- Supabase for authentication and database
- Stripe integration for payments
- AI-powered features for customer assistance
- Tire hotel management and booking system
- Analytics and monitoring with Sentry

## Technology Stack

### Core Framework
- **Next.js 16** (App Router with TypeScript)
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **TypeScript 5** with strict mode

### Key Libraries
- **Supabase** (`@supabase/supabase-js`, `@supabase/ssr`) - Authentication and database
- **Sentry** (`@sentry/nextjs`) - Error tracking and monitoring
- **Stripe** (`@stripe/stripe-js`) - Payment processing
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Chart.js** & **Recharts** - Data visualization
- **React Big Calendar** - Calendar views
- **Leaflet** - Map integration
- **React Hot Toast** & **Sonner** - Notifications

### Development Tools
- **ESLint** - Code linting (Next.js config)
- **PostCSS** - CSS processing
- **Vercel Analytics** - Performance monitoring

## Project Structure

```
/app                 - Next.js App Router pages and layouts
  /(dashboard)      - Protected dashboard routes
  /(protected)      - Other protected routes
  /(public)         - Public-facing pages
  /api              - API routes
  /admin            - Admin panel
  /auth             - Authentication pages
/components          - Reusable React components
  /ui               - UI primitives (buttons, inputs, etc.)
  /booking          - Booking-related components
  /customers        - Customer management components
  /ai               - AI assistant components
/lib                 - Utility functions and configuration
  /api              - API client utilities
  /supabase         - Supabase clients (client.ts, server.ts)
  /services         - Business logic services
  /utils            - Helper functions
/hooks              - Custom React hooks
/types              - TypeScript type definitions
/public             - Static assets
/supabase           - Supabase migrations and configuration
```

## Code Organization Guidelines

### File Naming
- Use **PascalCase** for React components: `BookingForm.tsx`
- Use **camelCase** for utilities and hooks: `apiConfig.ts`, `useOrgPlan.ts`
- Use **kebab-case** for route folders: `reset-password/`

### Import Paths
- Use `@/*` alias for imports from the project root
- Example: `import { createClient } from '@/lib/supabase/client'`

### Component Structure
- Keep components focused and single-responsibility
- Place shared UI components in `/components/ui`
- Place feature-specific components in feature folders (e.g., `/components/booking`)
- Use client components (`"use client"`) only when necessary (interactivity, hooks, browser APIs)

### API Configuration
- **Always use centralized API configuration** from `lib/apiConfig.ts`
- Use `getApiBaseUrl()` for base URL
- Use `buildApiUrl()` and `buildOrgApiUrl()` for constructing endpoints
- Environment variable: `NEXT_PUBLIC_API_BASE_URL`

Example:
```typescript
import { buildOrgApiUrl } from '@/lib/apiConfig';
const url = buildOrgApiUrl(orgId, 'bookings');
```

### Supabase Patterns
- **Client-side**: Use `@/lib/supabase/client` (for client components)
- **Server-side**: Use `@/lib/supabase/server` (for server components, API routes)
- Always handle auth state properly
- Use Row Level Security (RLS) for data access control

Example (client):
```typescript
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();
```

Example (server):
```typescript
import { createClient } from '@/lib/supabase/server';
const supabase = createClient();
```

### Organization Context
- The app is multi-tenant with organization-based access
- Use `getDefaultOrgId()` for development/testing
- In production, get org ID from user session/context
- Check user permissions with `lib/permissions.ts`

### Styling Guidelines
- Use Tailwind CSS utility classes
- Custom colors defined in `tailwind.config.ts`:
  - `shellBg`, `shellText` - Shell/background colors
  - `cardBg`, `cardElevatedBg` - Card backgrounds
  - `primary`, `accent`, `danger` - Brand colors
- Dark theme is the default (`#020617` background)
- Use Radix UI components for accessible primitives

### Error Handling
- Use Sentry for error tracking
- Use React Hot Toast or Sonner for user-facing notifications
- Always handle async errors with try-catch
- Provide meaningful error messages to users

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (port 3100)
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Lint code
npm run lint
```

## Environment Variables

Required environment variables (see README.md for complete list):
- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL
- `NEXT_PUBLIC_ORG_ID` - Default organization ID
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `NEXT_PUBLIC_ADMIN_EMAIL` - Admin email for access control

## Common Patterns

### Data Fetching
- Use React Server Components for data fetching when possible
- Use client-side fetching only when necessary (user interactions, real-time updates)
- Implement proper loading states with `LoadingStates.tsx` component

### Authentication
- Check auth state with Supabase client
- Protect routes with middleware or layout-level checks
- Use `(protected)` route group for authenticated pages

### Forms
- Use controlled components with React state
- Implement proper validation
- Show loading states during submission
- Display success/error feedback with toast notifications

### TypeScript
- Enable strict mode (already configured)
- Define proper types for API responses
- Use interfaces for component props
- Avoid `any` - use `unknown` if type is truly unknown

## Testing

- Currently no test suite configured
- Manual testing required for new features
- Test in development environment before deploying

## Deployment

- Deployed on Vercel
- Automatic deployments from main branch
- Environment variables configured in Vercel dashboard
- Supabase migrations deployed separately

## Best Practices

1. **Performance**
   - Use Next.js Image component for images
   - Implement code splitting with dynamic imports
   - Optimize bundle size (already configured in next.config.ts)

2. **Security**
   - Never commit secrets or API keys
   - Use environment variables for configuration
   - Implement proper RBAC with Supabase RLS
   - Validate user input on both client and server

3. **Accessibility**
   - Use semantic HTML
   - Use Radix UI for accessible components
   - Provide proper ARIA labels
   - Test keyboard navigation

4. **Code Quality**
   - Follow ESLint rules
   - Write clear, self-documenting code
   - Add comments only when logic is complex
   - Keep functions small and focused

## Norwegian Language

- The codebase uses Norwegian comments and variable names in some places
- Keep consistency with existing naming conventions
- User-facing text should be in Norwegian
- Technical documentation can be in English

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs/primitives)
