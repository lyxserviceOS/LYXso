// components/Analytics/index.tsx
'use client';

import GoogleAnalytics from './GoogleAnalytics';
import FacebookPixel from './FacebookPixel';
import LinkedInInsightTag from './LinkedInInsightTag';

export default function Analytics() {
  return (
    <>
      <GoogleAnalytics />
      <FacebookPixel />
      <LinkedInInsightTag />
    </>
  );
}
