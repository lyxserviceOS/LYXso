import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

export default createMiddleware({
  // Supported locales
  locales,
  
  // Default locale
  defaultLocale,
  
  // Locale detection from browser
  localeDetection: true,
  
  // URL strategy - show locale prefix only when not default
  localePrefix: 'as-needed',
});

export const config = {
  // Matcher for all paths except API routes, _next, and static files
  matcher: ['/', '/(no|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
