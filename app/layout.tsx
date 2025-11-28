import type { Metadata } from "next";
import "./globals.css";
import PublicHeader from "@/components/PublicHeader";

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
      className="font-sans"
    >
      <body className="min-h-screen bg-shellBg text-shellText antialiased selection:bg-primary/30 selection:text-white">
        <PublicHeader />
        {children}
      </body>
    </html>
  );
}
