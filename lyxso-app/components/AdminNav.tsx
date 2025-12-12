"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type AdminNavItem = {
  label: string;
  href: string;
  icon: string;
  badge?: string;
  description?: string;
};

type AdminNavSection = {
  title: string;
  items: AdminNavItem[];
  collapsible?: boolean;
};

const adminSections: AdminNavSection[] = [
  {
    title: "Oversikt",
    items: [
      {
        label: "Admin Dashboard",
        href: "/admin",
        icon: "👑",
        description: "Hovedoversikt for administratorer",
      },
      {
        label: "CEO Dashboard",
        href: "/admin/ceo",
        icon: "📈",
        description: "Omfattende statistikk og innsikt",
      },
    ],
  },
  {
    title: "Partnere & Kunder",
    collapsible: true,
    items: [
      {
        label: "Alle Partnere",
        href: "/admin/partnere",
        icon: "🤝",
        description: "Oversikt over alle partnerorganisasjoner",
      },
      {
        label: "Partnerforespørsler",
        href: "/admin/partnerforesporsler",
        icon: "📨",
        badge: "Ny",
        description: "Behandle nye partnerregistreringer",
      },
      {
        label: "Kundeoversikt",
        href: "/admin/kunder",
        icon: "👥",
        description: "Alle sluttbrukere på tvers av partnere",
      },
    ],
  },
  {
    title: "AI Moduler & System",
    collapsible: true,
    items: [
      {
        label: "AI Konfigurasjon",
        href: "/admin/ai-config",
        icon: "⚙️",
        badge: "AI",
        description: "Konfigurer AI-modeller og botter",
      },
      {
        label: "LYXba Backend",
        href: "/admin/lyxba",
        icon: "🤖",
        badge: "LYXba",
        description: "Administrer booking-agenten",
      },
      {
        label: "AI Trenings-data",
        href: "/admin/ai-training",
        icon: "🧠",
        badge: "AI",
        description: "Se og administrer treningsdata",
      },
      {
        label: "AI Live Samtaler",
        href: "/admin/ai-conversations",
        icon: "💬",
        badge: "Live",
        description: "Overvåk live AI-samtaler",
      },
      {
        label: "AI Feedback & Læring",
        href: "/admin/ai-feedback",
        icon: "📊",
        badge: "AI",
        description: "Analyser AI-feedback og forbedringer",
      },
    ],
  },
  {
    title: "Planer & Økonomi",
    collapsible: true,
    items: [
      {
        label: "Abonnementsplaner",
        href: "/admin/planer",
        icon: "💳",
        description: "Administrer priser og funksjoner",
      },
      {
        label: "Transaksjoner",
        href: "/admin/transaksjoner",
        icon: "💰",
        description: "Alle betalinger og fakturaer",
      },
      {
        label: "Økonomioversikt",
        href: "/admin/okonomi",
        icon: "📊",
        description: "MRR, ARR, churn og finansiell innsikt",
      },
    ],
  },
  {
    title: "System & Teknisk",
    collapsible: true,
    items: [
      {
        label: "Logger & Events",
        href: "/admin/logger",
        icon: "📋",
        description: "Systemlogger og hendelser",
      },
      {
        label: "API-bruk",
        href: "/admin/api-usage",
        icon: "🔌",
        description: "Overvåk API-kall og ytelse",
      },
      {
        label: "Database Admin",
        href: "/admin/database",
        icon: "🗄️",
        description: "Direkte database-tilgang (forsiktig!)",
      },
      {
        label: "Feature Flags",
        href: "/admin/features",
        icon: "🚩",
        badge: "Beta",
        description: "Kontroller funksjoner i produksjon",
      },
    ],
  },
  {
    title: "Innhold & Support",
    collapsible: true,
    items: [
      {
        label: "Support Tickets",
        href: "/admin/support",
        icon: "🎫",
        description: "Alle support-henvendelser",
      },
      {
        label: "Dokumentasjon",
        href: "/admin/docs",
        icon: "📚",
        description: "Administrer hjelpedokumentasjon",
      },
      {
        label: "Varsler & Meldinger",
        href: "/admin/notifikasjoner",
        icon: "🔔",
        description: "Send varsler til brukere",
      },
    ],
  },
];

export default function AdminNav() {
  const pathname = usePathname();
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  const toggleSection = (title: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <nav className="flex h-full flex-col bg-slate-900 text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-800 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
            <span className="text-lg font-bold">L</span>
          </div>
          <div>
            <h2 className="text-sm font-bold">LYXso Admin</h2>
            <p className="text-xs text-slate-400">Superadministrator</p>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {adminSections.map((section) => {
          const isCollapsed = collapsedSections.has(section.title);
          const isCollapsible = section.collapsible ?? false;

          return (
            <div key={section.title} className="mb-4">
              {/* Section Header */}
              <button
                onClick={() => isCollapsible && toggleSection(section.title)}
                className={`mb-2 flex w-full items-center justify-between px-2 text-xs font-semibold uppercase tracking-wider text-slate-400 ${
                  isCollapsible ? "cursor-pointer hover:text-slate-200" : ""
                }`}
              >
                <span>{section.title}</span>
                {isCollapsible && (
                  <span
                    className="transition-transform"
                    style={{ transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)" }}
                  >
                    ▼
                  </span>
                )}
              </button>

              {/* Items */}
              {!isCollapsed && (
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`group flex items-start gap-3 rounded-lg px-3 py-2 transition-all ${
                          active
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`}
                        title={item.description}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{item.label}</span>
                            {item.badge && (
                              <span className="rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-bold text-white">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="mt-0.5 text-xs text-slate-400 group-hover:text-slate-300">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800 p-4">
        <Link
          href="/kontrollpanel"
          className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-700 hover:text-white"
        >
          <span>←</span>
          <span>Tilbake til Partner-portal</span>
        </Link>
      </div>
    </nav>
  );
}
