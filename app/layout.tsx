import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  title: "LYXso – ServiceOS for bilbransjen",
  description:
    "LYXso samler booking, kalender, kundekort, markedsføring, regnskap og AI-oppfølging i én plattform – spesielt tilpasset bedrifter innen bilbransjen.",
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
      </body>
    </html>
  );
}
