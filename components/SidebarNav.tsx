"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

type NavItem = {
  label: string;
  href: string;
  description?: string;
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
        label: "Kontrollpanel",
        href: "/kontrollpanel",
        description: "Oversikt over kunder, bookinger og kapasitet.",
      },
      {
        label: "Bookinger",
        href: "/booking",
        description: "Kalender og timebok for hele bedriften.",
      },
      {
        label: "Kunder & CRM",
        href: "/kunder",
        description: "Kundekort, historikk, kjøretøy og eiendeler.",
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
      },
      {
        label: "Dekkhotell",
        href: "/dekkhotell",
        description: "Oversikt over felg- og dekksett.",
      },
      {
        label: "Coating PRO",
        href: "/coating",
        description: "Coatingjobber og 5-års garantiløp.",
      },
      {
        label: "Ansatte",
        href: "/ansatte",
        description: "Rettigheter, kapasitet og roller.",
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
      },
      {
        label: "LYXba – Booking Agent",
        href: "/ai-agent",
        description: "AI som ringer, sender SMS og booker automagisk.",
      },
      {
        label: "Landingsside",
        href: "/landingsside",
        description: "Bygg partnerens egen nettside for bookinger.",
      },
      {
        label: "Leads",
        href: "/leads",
        description: "Alle henvendelser fra skjema, AI og kampanjer.",
      },
      {
        label: "Partnere",
        href: "/partnere",
        description: "Brukt av admin – oversikt over alle partnere.",
      },
      {
        label: "CEO Dashboard",
        href: "/ceo",
        description: "Aggregert oversikt over alle orgs og lokasjoner.",
      },
    ],
  },
  {
    title: "Økonomi",
    items: [
      {
        label: "Regnskap & betaling",
        href: "/regnskap",
        description: "Kobling mot terminal, Fiken m.m. (under arbeid).",
      },
      {
        label: "Betaling",
        href: "/betaling",
        description: "Status på betalinger og transaksjoner.",
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
      },
      {
        label: "Dataimport",
        href: "/data-import",
        description: "Importer kunder, biler, dekk og historikk.",
      },
      {
        label: "Onboarding & innstillinger",
        href: "/onboarding",
        description: "Grunnoppsett for partnerprofilen.",
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
    // Kontrollpanel regnes som "hjem" for partner
    return pathname === "/kontrollpanel";
  }
  return pathname.startsWith(href);
}

export default function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Feil ved utlogging:", err);
    } finally {
      router.push("/login");
    }
  };

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
      </div>

      {/* Selve menyen */}
      <div className="flex-1 space-y-5 overflow-y-auto pr-1">
        {sections.map((section) => (
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
                      <div className="text-xs font-medium">{item.label}</div>
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
