// app/(public)/demo-markedsforing/page.tsx
import { Suspense } from 'react';
import MarketingPageClient from '@/app/(protected)/markedsforing/MarketingPageClient';

export default function DemoMarketingPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Demo banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3">
        <p className="text-center text-sm text-white">
          <strong>Demo-modus:</strong> Dette er en forhåndsvisning av Markedsføringsmodulen med eksempeldata.
        </p>
      </div>
      
      <Suspense fallback={<div className="p-8 text-slate-400">Laster markedsføringsmodul...</div>}>
        <MarketingPageClient />
      </Suspense>
    </div>
  );
}
