// types/industry.ts
// Types for industry selection during onboarding

/**
 * Available industries/branches in LYXso.
 * Used during onboarding to customize the platform for each business.
 */
export type Industry =
  | "bilpleie"        // Bilpleie / detailing
  | "dekkhotell"      // Dekkhotell / dekkverksted
  | "verksted"        // Bilverksted (mekanisk)
  | "lakk_karosseri"  // Lakk & karosseri
  | "forhandler"      // Bilforhandler / kommisjonssalg
  | "bilvask"         // Bilvask / vaskehall
  | "utleie";         // Utleie (hengere, biler, bobil osv.)

export const INDUSTRIES: { code: Industry; label: string; description: string }[] = [
  {
    code: "bilpleie",
    label: "Bilpleie / detailing",
    description: "Polering, coating, innvendig og utvendig rengjøring.",
  },
  {
    code: "dekkhotell",
    label: "Dekkhotell / dekkverksted",
    description: "Dekklagring, dekkskift og sesongbytte.",
  },
  {
    code: "verksted",
    label: "Bilverksted (mekanisk)",
    description: "Service, reparasjoner og EU-kontroll.",
  },
  {
    code: "lakk_karosseri",
    label: "Lakk & karosseri",
    description: "Skadereparasjon, lakk og karosseriarbeid.",
  },
  {
    code: "forhandler",
    label: "Bilforhandler / kommisjonssalg",
    description: "Kjøp og salg av bruktbiler, kommisjon.",
  },
  {
    code: "bilvask",
    label: "Bilvask / vaskehall",
    description: "Automatisk eller manuell bilvask.",
  },
  {
    code: "utleie",
    label: "Utleie",
    description: "Utleie av hengere, biler, bobil og lignende.",
  },
];

/**
 * Work mode for the organization.
 * - fixed: Has a physical location where customers come
 * - mobile: Travels to customers
 * - both: Has both fixed location and mobile services
 */
export type WorkMode = "fixed" | "mobile" | "both";

export const WORK_MODES: { code: WorkMode; label: string; description: string }[] = [
  {
    code: "fixed",
    label: "Fast adresse / lokaler",
    description: "Dere har et fast sted der kunder kommer for å få utført tjenester.",
  },
  {
    code: "mobile",
    label: "Mobil tjeneste",
    description: "Dere reiser ut til kunden for å utføre tjenester.",
  },
  {
    code: "both",
    label: "Begge deler",
    description: "Dere tilbyr både faste lokaler og mobil utrykning.",
  },
];

/**
 * Available modules that can be enabled/disabled per organization.
 */
export type ModuleCode =
  | "booking"           // Online booking
  | "dekkhotell"        // Dekkhotell PRO
  | "landing_page"      // Own landing page
  | "webshop"           // Webshop with products
  | "regnskap"          // Accounting integration
  | "kortterminal"      // Payment terminal (iZettle/SumUp)
  | "markedsforing"     // Marketing (Meta/Google)
  | "ai_agent"          // AI agent for leads/booking
  | "coating"           // Coating PRO
  | "crm"               // Customer management
  | "employees"         // Employee management
  | "products"          // Product management
  | "leads"             // Lead management
  | "automatisering";   // Automation

export type OrgModule = {
  code: ModuleCode;
  label: string;
  description: string;
  category: "drift" | "ai_marketing" | "okonomi" | "system";
  defaultEnabled: boolean;
  requiredPlan?: "free" | "trial" | "paid";
};

export const ORG_MODULES: OrgModule[] = [
  // Drift
  {
    code: "booking",
    label: "Online booking",
    description: "La kunder booke tid online via kalender.",
    category: "drift",
    defaultEnabled: true,
  },
  {
    code: "crm",
    label: "Kunder & CRM",
    description: "Kundekort, historikk og kjøretøyoversikt.",
    category: "drift",
    defaultEnabled: true,
  },
  {
    code: "dekkhotell",
    label: "Dekkhotell PRO",
    description: "Posisjoner, bilder og sesong-flow for dekklagring.",
    category: "drift",
    defaultEnabled: false,
  },
  {
    code: "coating",
    label: "Coating PRO",
    description: "Coatingjobber, 5-års garantiløp og checklister.",
    category: "drift",
    defaultEnabled: false,
  },
  {
    code: "products",
    label: "Produkter",
    description: "Produkter brukt i tjenester og salg.",
    category: "drift",
    defaultEnabled: true,
  },
  {
    code: "employees",
    label: "Ansatte",
    description: "Rettigheter, kapasitet og roller.",
    category: "drift",
    defaultEnabled: true,
  },
  // AI & markedsføring
  {
    code: "landing_page",
    label: "Landingsside",
    description: "Bygg en egen nettside for bookinger og tjenester.",
    category: "ai_marketing",
    defaultEnabled: false,
  },
  {
    code: "webshop",
    label: "Nettbutikk",
    description: "Selg produkter via landingssiden din.",
    category: "ai_marketing",
    defaultEnabled: false,
  },
  {
    code: "markedsforing",
    label: "Markedsføring",
    description: "Kampanjer mot Meta/Google med AI-generert innhold.",
    category: "ai_marketing",
    defaultEnabled: false,
    requiredPlan: "paid",
  },
  {
    code: "ai_agent",
    label: "LYXba – Booking Agent",
    description: "AI som ringer, sender SMS og booker automagisk.",
    category: "ai_marketing",
    defaultEnabled: false,
    requiredPlan: "paid",
  },
  {
    code: "leads",
    label: "Leads",
    description: "Alle henvendelser fra skjema, AI og kampanjer.",
    category: "ai_marketing",
    defaultEnabled: true,
  },
  // Økonomi
  {
    code: "regnskap",
    label: "Regnskap & eksport",
    description: "Eksport til Fiken/PowerOffice og regnskapsflyt.",
    category: "okonomi",
    defaultEnabled: false,
  },
  {
    code: "kortterminal",
    label: "Kortterminal",
    description: "Integrasjon med iZettle/Zettle eller SumUp.",
    category: "okonomi",
    defaultEnabled: false,
  },
  // System
  {
    code: "automatisering",
    label: "Automatisering",
    description: "Påminnelser, workflows og automatiske triggere.",
    category: "system",
    defaultEnabled: false,
    requiredPlan: "paid",
  },
];

/**
 * Default modules that all organizations receive.
 */
export const DEFAULT_MODULES: ModuleCode[] = ["booking", "crm", "products", "employees", "leads"];

/**
 * Get recommended modules based on selected industries.
 */
export function getRecommendedModules(industries: Industry[]): ModuleCode[] {
  const modules: Set<ModuleCode> = new Set(DEFAULT_MODULES);

  for (const industry of industries) {
    switch (industry) {
      case "bilpleie":
        modules.add("coating");
        modules.add("landing_page");
        break;
      case "dekkhotell":
        modules.add("dekkhotell");
        break;
      case "verksted":
        modules.add("regnskap");
        break;
      case "lakk_karosseri":
        modules.add("regnskap");
        break;
      case "forhandler":
        modules.add("regnskap");
        modules.add("webshop");
        break;
      case "bilvask":
        modules.add("landing_page");
        break;
      case "utleie":
        modules.add("landing_page");
        break;
    }
  }

  return Array.from(modules);
}

/**
 * Organization settings stored in database.
 * This extends the basic org with onboarding data.
 */
export type OrgSettings = {
  id: string;
  name: string | null;
  org_number: string | null;
  
  // Contact
  contact_email: string | null;
  phone: string | null;
  website: string | null;
  
  // Address
  address_line1: string | null;
  postcode: string | null;
  city: string | null;
  
  // Work mode
  work_mode: WorkMode;
  
  // Industries (multi-select)
  industries: Industry[];
  
  // Enabled modules
  enabled_modules: ModuleCode[];
  
  // Plan & status
  plan: "free" | "trial" | "paid";
  is_active: boolean;
  
  // Branding
  logo_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  
  // Landing page settings
  landing_page_enabled: boolean;
  webshop_enabled: boolean;
  show_booking_in_menu: boolean;
  
  created_at: string;
  updated_at: string | null;
};
