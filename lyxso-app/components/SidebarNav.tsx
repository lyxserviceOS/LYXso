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
  /** Icon emoji */
  icon?: string;
};

type NavSection = {
  title: string;
  icon?: string;
  items: NavItem[];
  /** If true, this section can be collapsed/expanded */
  collapsible?: boolean;
};

const sections: NavSection[] = [
  // OVERSIKT
  {
    title: "Oversikt",
    icon: "📊",
    items: [
      {
        label: "Dashboard",
        href: "/kontrollpanel",
        icon: "🏠",
      },
    ],
  },
  
  // DRIFT (mest brukt)
  {
    title: "Drift",
    icon: "⚙️",
    collapsible: true,
    items: [
      {
        label: "Bookinger",
        href: "/booking",
        icon: "📅",
        requiresModule: "booking",
      },
      {
        label: "Kunder",
        href: "/kunder",
        icon: "👥",
        requiresModule: "crm",
      },
      {
        label: "Ansatte",
        href: "/ansatte",
        icon: "👤",
        requiresModule: "employees",
      },
      {
        label: "Tjenester",
        href: "/tjenester",
        icon: "🛠️",
      },
      {
        label: "Produkter",
        href: "/produkter",
        icon: "📦",
        requiresModule: "products",
      },
      {
        label: "Dekkhotell",
        href: "/dekkhotell",
        icon: "🚗",
        requiresModule: "dekkhotell",
      },
      {
        label: "Coating PRO",
        href: "/coating",
        icon: "✨",
        requiresModule: "coating",
      },
    ],
  },

  // AI ASSISTENT (samlet alle AI-funksjoner) - ALLTID SYNLIG
  {
    title: "AI Assistent",
    icon: "🤖",
    collapsible: false, // Alltid åpen for synlighet
    items: [
      {
        label: "AI Oversikt",
        href: "/ai",
        icon: "🏠",
        badge: "Ny",
        description: "Se alle AI-moduler og muligheter",
      },
      {
        label: "Marketing AI",
        href: "/ai/marketing",
        icon: "📣",
        badge: "AI",
      },
      {
        label: "Innhold AI",
        href: "/ai/content",
        icon: "✍️",
        badge: "AI",
      },
      {
        label: "CRM AI",
        href: "/ai/crm",
        icon: "🎯",
        badge: "AI",
      },
      {
        label: "Booking AI",
        href: "/ai/booking",
        icon: "📆",
        badge: "AI",
      },
      {
        label: "Kapasitet AI",
        href: "/ai/capacity",
        icon: "📊",
        badge: "AI",
      },
      {
        label: "Regnskap AI",
        href: "/ai/accounting",
        icon: "💰",
        badge: "AI",
      },
      {
        label: "LYXba Agent",
        href: "/ai-agent",
        icon: "🤖",
        requiresModule: "ai_agent",
        badge: "LYXba",
      },
    ],
  },

  // MARKEDSFØRING
  {
    title: "Markedsføring",
    icon: "📣",
    collapsible: true,
    items: [
      {
        label: "Kampanjer",
        href: "/markedsforing",
        icon: "📢",
        requiresModule: "markedsforing",
      },
      {
        label: "Leads",
        href: "/leads",
        icon: "🎯",
        requiresModule: "leads",
      },
      {
        label: "Landingsside",
        href: "/landingsside",
        icon: "🌐",
        requiresModule: "landing_page",
      },
      {
        label: "Nettbutikk Admin",
        href: "/nettbutikk",
        icon: "🛒",
        requiresModule: "webshop",
        badge: "Admin",
      },
      {
        label: "Se Webshop",
        href: "/shop",
        icon: "🛍️",
        badge: "Offentlig",
      },
    ],
  },

  // ØKONOMI
  {
    title: "Økonomi",
    icon: "💰",
    collapsible: true,
    items: [
      {
        label: "Regnskap",
        href: "/regnskap",
        icon: "📊",
        requiresModule: "regnskap",
      },
      {
        label: "Betalinger",
        href: "/betaling",
        icon: "💳",
        requiresModule: "kortterminal",
      },
    ],
  },

  // INNSTILLINGER
  {
    title: "Innstillinger",
    icon: "⚙️",
    collapsible: true,
    items: [
      {
        label: "Organisasjon",
        href: "/org-settings",
        icon: "🏢",
      },
      {
        label: "Plan & Addons",
        href: "/plan",
        icon: "📋",
      },
      {
        label: "API-nøkler",
        href: "/api-nokler",
        icon: "🔐",
        badge: "Ny",
      },
      {
        label: "Notifikasjoner",
        href: "/notifikasjoner",
        icon: "🔔",
        badge: "Ny",
      },
      {
        label: "Support",
        href: "/support",
        icon: "💬",
        badge: "Ny",
      },
      {
        label: "Integrasjoner",
        href: "/integrasjoner",
        icon: "🔌",
      },
      {
        label: "Automatisering",
        href: "/automatisering",
        icon: "⚡",
        requiresModule: "automatisering",
      },
      {
        label: "Dataimport",
        href: "/data-import",
        icon: "📥",
      },
      {
        label: "Hjelp",
        href: "/hjelp",
        icon: "❓",
      },
    ],
  },

  // ADMIN (kun for admins) - FJERNET FRA SIDEBAR
  // Admin skal IKKE vises i partner-sidebar
  // Admins bruker /admin direkte med egen layout

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
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

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

  const toggleSection = (sectionTitle: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionTitle)) {
        newSet.delete(sectionTitle);
      } else {
        newSet.add(sectionTitle);
      }
      return newSet;
    });
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
      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {filteredSections.map((section) => {
          const isCollapsed = collapsedSections.has(section.title);
          const isCollapsible = section.collapsible ?? false;
          
          return (
            <div key={section.title} className="space-y-1">
              {/* Section header */}
              <button
                onClick={() => isCollapsible && toggleSection(section.title)}
                className={`flex w-full items-center justify-between px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-shellTextMuted ${
                  isCollapsible ? "hover:text-shellText cursor-pointer" : ""
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {section.icon && <span className="text-xs">{section.icon}</span>}
                  {section.title}
                </span>
                {isCollapsible && (
                  <span className="text-xs transition-transform" style={{ 
                    transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)" 
                  }}>
                    ▼
                  </span>
                )}
              </button>
              
              {/* Items */}
              {!isCollapsed && (
                <ul className="space-y-0.5">
                  {section.items.map((item) => {
                    const active = isActive(pathname, item.href);
                    const baseClasses =
                      "flex items-center gap-2 rounded-md px-2.5 py-1.5 transition-colors";
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
                          {item.icon && <span className="text-sm">{item.icon}</span>}
                          <span className="flex-1 text-xs font-medium">{item.label}</span>
                          {item.badge && (
                            <span className="rounded-full bg-blue-600 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
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
