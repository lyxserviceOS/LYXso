"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useOrgPlan } from "./OrgPlanContext";
import type { ModuleCode } from "@/types/industry";

type NavItem = {
  label: string;
  href: string;
  description?: string;
  /** Module code required to show this item. If undefined, always show. */
  requiresModule?: ModuleCode;
  /** Only show for admin users */
  adminOnly?: boolean;
  /** Badge text to show (e.g., "Ny") */
  badge?: string;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const sections: NavSection[] = [
  {
    title: "Drift",
    items: [
      {
        label: "Dashboard",
        href: "/kontrollpanel",
        description: "Oversikt over kunder, bookinger og kapasitet.",
      },
      {
        label: "Bookinger",
        href: "/booking",
        description: "Kalender og timebok for hele bedriften.",
        requiresModule: "booking",
      },
      {
        label: "Kunder & CRM",
        href: "/kunder",
        description: "Kundekort, historikk, kjøretøy og eiendeler.",
        requiresModule: "crm",
      },
      {
        label: "Tjenester",
        href: "/tjenester",
        description: "Hva dere tilbyr – priser, varighet og mer.",
      },
      {
        label: "Produkter",
        href: "/produkter",
        description: "Produkter brukt i tjenester og salg.",
        requiresModule: "products",
      },
      {
        label: "Dekkhotell",
        href: "/dekkhotell",
        description: "Oversikt over felg- og dekksett.",
        requiresModule: "dekkhotell",
      },
      {
        label: "Coating PRO",
        href: "/coating",
        description: "Coatingjobber og 5-års garantiløp.",
        requiresModule: "coating",
      },
      {
        label: "Ansatte",
        href: "/ansatte",
        description: "Rettigheter, kapasitet og roller.",
        requiresModule: "employees",
      },
    ],
  },
  {
    title: "AI & markedsføring",
    items: [
      {
        label: "Markedsføring",
        href: "/markedsforing",
        description: "Kampanjer, poster og kanalstatistikk.",
        requiresModule: "markedsforing",
      },
      {
        label: "AI Marketing",
        href: "/ai/marketing",
        description: "Kampanjeidéer, annonsetekster og målgruppeanalyse.",
        badge: "AI",
      },
      {
        label: "AI Innhold",
        href: "/ai/content",
        description: "Lag landingssider, blogginnhold og SMS-meldinger.",
        badge: "AI",
      },
      {
        label: "AI CRM",
        href: "/ai/crm",
        description: "Kundeinnsikt, segmentering og personalisering.",
        badge: "AI",
      },
      {
        label: "AI Booking",
        href: "/ai/booking",
        description: "Smarte bookingforslag og tidsluke-optimalisering.",
        badge: "AI",
      },
      {
        label: "AI Kapasitet",
        href: "/ai/capacity",
        description: "Analyser kapasitet og ressursbruk.",
        badge: "AI",
      },
      {
        label: "AI Regnskap",
        href: "/ai/accounting",
        description: "Forklaring av rapporter og økonomisk innsikt.",
        badge: "AI",
      },
      {
        label: "LYXba – Booking Agent",
        href: "/ai-agent",
        description: "AI som ringer, sender SMS og booker automagisk.",
        requiresModule: "ai_agent",
      },
      {
        label: "Landingsside",
        href: "/landingsside",
        description: "Bygg partnerens egen nettside for bookinger.",
        requiresModule: "landing_page",
      },
      {
        label: "Nettbutikk",
        href: "/nettbutikk",
        description: "Selg produkter via landingssiden din.",
        requiresModule: "webshop",
        badge: "Ny",
      },
      {
        label: "Leads",
        href: "/leads",
        description: "Alle henvendelser fra skjema, AI og kampanjer.",
        requiresModule: "leads",
      },
      {
        label: "Partnere",
        href: "/partnere",
        description: "Brukt av admin – oversikt over alle partnere.",
        adminOnly: true,
      },
      {
        label: "CEO Dashboard",
        href: "/ceo",
        description: "Aggregert oversikt over alle orgs og lokasjoner.",
        adminOnly: true,
      },
    ],
  },
  {
    title: "Økonomi",
    items: [
      {
        label: "Regnskap & betaling",
        href: "/regnskap",
        description: "Kobling mot terminal, Fiken m.m.",
        requiresModule: "regnskap",
      },
      {
        label: "Betaling",
        href: "/betaling",
        description: "Status på betalinger og transaksjoner.",
        requiresModule: "kortterminal",
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        label: "Abonnement & plan",
        href: "/plan",
        description:
          "Se hvilken LYXso-plan dere bruker og hvilke moduler som er åpne.",
      },
      {
        label: "Addons",
        href: "/addons",
        description: "Tilleggstjenester og pakker.",
      },
      {
        label: "Integrasjoner",
        href: "/integrasjoner",
        description: "Regnskap, betaling, SMS og e-post integrasjoner.",
      },
      {
        label: "Automatisering",
        href: "/automatisering",
        description: "Påminnelser, workflows og automatiske triggere.",
        requiresModule: "automatisering",
      },
      {
        label: "Dataimport",
        href: "/data-import",
        description: "Importer kunder, biler, dekk og historikk.",
      },
      {
        label: "Innstillinger",
        href: "/org-settings",
        description: "Moduler, tjenestetype og bedriftsinnstillinger.",
      },
      {
        label: "Hjelp & support",
        href: "/hjelp",
        description: "Dokumentasjon, FAQ og kontakt.",
      },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/kontrollpanel") {
    // Dashboard regnes som "hjem" for partner
    return pathname === "/kontrollpanel";
  }
  return pathname.startsWith(href);
}

export default function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isModuleEnabled, loading: planLoading, org } = useOrgPlan();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Hent brukerens e-post for å sjekke om det er LYX-testkonto
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
  }, []);

  // LYX-testkontoer har full tilgang (for testing/demo)
  const isLyxTestAccount = userEmail === "post@lyxbilpleie.no";

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Feil ved utlogging:", err);
    } finally {
      router.push("/login");
    }
  };

  // Filter nav items based on enabled modules and webshop settings
  const filteredSections = sections.map((section) => ({
    ...section,
    items: section.items.filter((item) => {
      // LYX testkonto ser ALT (unntatt admin-only)
      if (isLyxTestAccount && !item.adminOnly) return true;
      
      // Always show items without module requirement
      if (!item.requiresModule) return true;
      // While loading, show all items to avoid flicker
      if (planLoading) return true;
      
      // Special handling for webshop - check org settings
      if (item.requiresModule === "webshop") {
        return org?.webshopEnabled ?? false;
      }
      
      // Special handling for landing_page - check org settings
      if (item.requiresModule === "landing_page") {
        return org?.landingPageEnabled ?? isModuleEnabled(item.requiresModule);
      }
      
      // Check if module is enabled
      return isModuleEnabled(item.requiresModule);
    }).filter((item) => {
      // Hide admin-only items (these would require role check)
      // For now, keep them visible but they could be hidden based on user role
      return !item.adminOnly;
    }),
  })).filter((section) => section.items.length > 0); // Remove empty sections

  return (
    <nav className="flex h-full flex-col px-3 py-4 text-sm text-shellText">
      {/* Topp: partner-informasjon */}
      <div className="mb-6 px-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-shellTextMuted">
          LYXso-partner
        </p>
        <p className="text-xs text-shellTextMuted">
          Partnerportal for booking, CRM og drift.
        </p>
        {isLyxTestAccount && (
          <div className="mt-2 rounded-md bg-blue-50 px-2 py-1 text-[10px] text-blue-700">
            🧪 <strong>LYX Testkonto</strong> – Full AI-tilgang
          </div>
        )}
      </div>

      {/* Selve menyen */}
      <div className="flex-1 space-y-5 overflow-y-auto pr-1">
        {filteredSections.map((section) => (
          <div key={section.title} className="space-y-2">
            <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-shellTextMuted">
              {section.title}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(pathname, item.href);
                const baseClasses =
                  "block rounded-md px-2.5 py-1.5 transition-colors";
                const activeClasses =
                  "bg-primary text-white shadow-sm";
                const inactiveClasses =
                  "text-shellTextMuted hover:bg-shellBorder/70 hover:text-shellText";

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`${baseClasses} ${
                        active ? activeClasses : inactiveClasses
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">{item.label}</span>
                        {item.badge && (
                          <span className="rounded-full bg-blue-600 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <div className="text-[10px] text-shellTextMuted">
                          {item.description}
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Bunn: logg ut */}
      <div className="mt-4 border-t border-shellBorder pt-3">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-md border border-shellBorder bg-shellBg px-3 py-1.5 text-xs font-medium text-shellText hover:border-danger hover:bg-danger/10 hover:text-danger"
        >
          Logg ut
        </button>
        <p className="mt-1 px-1 text-[10px] text-shellTextMuted">
          I produksjon styres brukere og roller av LYXso-admin.
        </p>
      </div>
    </nav>
  );
}
