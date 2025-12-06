// components/Breadcrumbs.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

const routeLabels: Record<string, string> = {
  // Dashboard
  kontrollpanel: "Kontrollpanel",
  dashboard: "Dashboard",
  
  // Booking & Kunder
  booking: "Bookinger",
  kunder: "Kunder",
  tjenester: "Tjenester",
  ansatte: "Ansatte",
  
  // Drift
  dekkhotell: "Dekkhotell",
  coating: "Coating",
  ppf: "PPF",
  varelager: "Varelager",
  leverandorer: "Leverandører",
  
  // Markedsføring
  markedsforing: "Markedsføring",
  landingsside: "Landingsside",
  leads: "Leads",
  kampanjer: "Kampanjer",
  
  // Økonomi
  regnskap: "Regnskap",
  fakturering: "Fakturering",
  rapporter: "Rapporter",
  
  // Innstillinger
  innstillinger: "Innstillinger",
  org: "Organisasjon",
  profil: "Profil",
  "org-settings": "Organisasjonsinnstillinger",
  
  // AI
  ai: "AI Assistent",
  marketing: "Marketing AI",
  booking: "Booking AI",
  crm: "CRM AI",
  accounting: "Regnskap AI",
  capacity: "Kapasitet AI",
  content: "Innhold AI",
  lyxba: "LYXba Agent",
  coatvision: "CoatVision",
  "damage-analysis": "Skadeanalyse",
  pricing: "Prising AI",
  inventory: "Lager AI",
  
  // Admin
  admin: "Admin",
  ceo: "CEO Dashboard",
  partnere: "Partnere",
  "data-import": "Dataimport",
  "white-label": "White Label",
  
  // Offentlig
  "om-lyxso": "Om LYXso",
  priser: "Priser",
  funksjoner: "Funksjoner",
  kontakt: "Kontakt",
  "bli-partner": "Bli Partner",
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  // Skip breadcrumbs for home page
  if (pathname === "/" || pathname === "/kontrollpanel") {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);
  
  const breadcrumbs: BreadcrumbItem[] = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    
    return { label, href };
  });

  return (
    <nav className="flex items-center gap-2 text-sm text-slate-600 mb-4 py-2 px-1">
      <Link 
        href="/kontrollpanel" 
        className="flex items-center gap-1 hover:text-blue-600 transition-colors"
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">Hjem</span>
      </Link>
      
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        
        return (
          <div key={crumb.href} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-slate-400" />
            {isLast ? (
              <span className="font-medium text-slate-900">{crumb.label}</span>
            ) : (
              <Link 
                href={crumb.href}
                className="hover:text-blue-600 transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
