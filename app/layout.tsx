import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LYXso – ServiceOS for bilbransjen",
  description:
    "LYXso samler booking, kalender, kundekort, markedsføring, regnskap og AI-oppfølging i én plattform – spesielt tilpasset bedrifter innen bilbransjen.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="nb"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-shellBg text-shellText antialiased selection:bg-primary/30 selection:text-white">
        {/* 
          Viktig:
          - Ingen header / navbar her.
          - Dette skal være en "ren" shell som både 
            markeds-sidene og partner-portalen bruker.
          - Offentlige sider (/, /kontakt osv.) har sin egen header i selve sidene.
          - Partner-sidene får sin layout via app/(protected)/layout.tsx.
        */}
        {children}
      </body>
    </html>
  );
}
