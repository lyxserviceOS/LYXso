// app/(protected)/markedsforing/autopublish/page.tsx
import type { Metadata } from 'next';
import AutoPublishPageClient from './AutoPublishPageClient';

export const metadata: Metadata = {
  title: 'Auto-Publishing - LYXso',
  description: 'Automatisk publisering til sosiale medier med AI',
};

export default function AutoPublishPage() {
  return <AutoPublishPageClient />;
}
