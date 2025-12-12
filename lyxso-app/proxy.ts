import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Proxy function for Next.js 16+
// Renamed from middleware.ts - no i18n for now
export default function proxy(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  // Matcher for all paths except API routes, _next, and static files
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
