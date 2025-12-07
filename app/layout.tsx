import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { ToastProvider } from "@/lib/toast";
import AnalyticsTracking from "@/components/Analytics";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.lyxso.no'),
  title: {
    default: "LYXso – ServiceOS for bilbransjen | Booking, Kalender & AI for Verksteder",
    template: "%s | LYXso"
  },
  description:
    "LYXso samler booking, kalender, kundekort, markedsføring, regnskap og AI-oppfølging i én plattform – spesielt tilpasset bedrifter innen bilbransjen. Norges moderne system for bilpleie, dekkhotell, PPF og verksteder.",
  keywords: [
    "bilbooking",
    "verkstedsystem",
    "dekkhotell system",
    "bilpleie software",
    "PPF booking",
    "coating oppfølging",
    "bilverksted kalender",
    "kundestyring bil",
    "norsk bilsystem",
    "bilbransje programvare"
  ],
  authors: [{ name: "LYXso AS" }],
  creator: "LYXso AS",
  publisher: "LYXso AS",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "https://www.lyxso.no",
    siteName: "LYXso",
    title: "LYXso – ServiceOS for bilbransjen",
    description:
      "Moderne system for booking, kalender, kundekort og AI-oppfølging. Bygget spesielt for bilpleie, dekkhotell, PPF og verksteder i Norge.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LYXso - ServiceOS for bilbransjen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LYXso – ServiceOS for bilbransjen",
    description:
      "Moderne system for booking, kalender og AI-oppfølging. Bygget for bilpleie, dekkhotell, PPF og verksteder.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="nb"
      className="font-sans"
    >
      <head>
        {GA_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased selection:bg-blue-600/30 selection:text-white flex flex-col">
        <PublicHeader />
        <div className="flex-1">
          {children}
        </div>
        <PublicFooter />
        <CookieConsentBanner />
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
        <SpeedInsights />
        <ToastProvider />
        <SpeedInsights />
        <Analytics />
        <AnalyticsTracking />
      </body>
    </html>
  );
}
