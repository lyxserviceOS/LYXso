"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type HelpItem = {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  docsUrl?: string;
  category?: string;
};

type HelpContextType = {
  isHelpMode: boolean;
  toggleHelpMode: () => void;
  showHelp: (itemId: string) => void;
  hideHelp: () => void;
  currentHelp: HelpItem | null;
  getHelpItem: (itemId: string) => HelpItem | null;
};

const HelpContext = createContext<HelpContextType | null>(null);

// Help database - all help items in the system
const HELP_ITEMS: Record<string, HelpItem> = {
  // Dashboard
  "dashboard.overview": {
    id: "dashboard.overview",
    title: "Dashboard Oversikt",
    content: "Dashboard gir deg en rask oversikt over din virksomhet. Her ser du dagens bookinger, ukentlige inntekter, og viktige metrics.",
    category: "dashboard",
  },
  "dashboard.bookings": {
    id: "dashboard.bookings",
    title: "Dagens Bookinger",
    content: "Viser alle bookinger for i dag. Klikk på en booking for å se detaljer, endre status eller kontakte kunden.",
    category: "dashboard",
  },

  // Bookings
  "bookings.create": {
    id: "bookings.create",
    title: "Opprett Ny Booking",
    content: "Fyll ut kundeinfo, velg tjeneste og tidspunkt. Systemet validerer automatisk tilgjengelighet og sender bekreftelse til kunden.",
    videoUrl: "/help/videos/create-booking.mp4",
    docsUrl: "/docs/bookings/create",
    category: "bookings",
  },
  "bookings.customer": {
    id: "bookings.customer",
    title: "Kundeinformasjon",
    content: "Søk etter eksisterende kunde eller opprett ny. E-post er påkrevd for å sende bekreftelser. Telefonnummer brukes for SMS-påminnelser.",
    category: "bookings",
  },
  "bookings.service": {
    id: "bookings.service",
    title: "Velg Tjeneste",
    content: "Velg hvilken tjeneste kunden ønsker. Pris og varighet hentes automatisk. Du kan legge til flere tjenester i samme booking.",
    category: "bookings",
  },
  "bookings.datetime": {
    id: "bookings.datetime",
    title: "Dato og Tidspunkt",
    content: "Velg ønsket dato og klokkeslett. Systemet viser kun ledige tider basert på åpningstider og eksisterende bookinger.",
    category: "bookings",
  },

  // Customers
  "customers.create": {
    id: "customers.create",
    title: "Legg til Kunde",
    content: "Registrer nye kunder med kontaktinfo. E-post brukes til booking-bekreftelser. Telefon brukes til SMS-påminnelser.",
    category: "customers",
  },
  "customers.search": {
    id: "customers.search",
    title: "Søk i Kunder",
    content: "Søk etter kunder ved navn, e-post, telefon eller registreringsnummer. Bruk filtre for å finne spesifikke kundegrupper.",
    category: "customers",
  },

  // Team
  "team.invite": {
    id: "team.invite",
    title: "Inviter Teammedlem",
    content: "Send invitasjon via e-post. Velg rolle basert på hvilke tilganger personen skal ha. Invitasjonen utløper etter 7 dager.",
    category: "team",
  },
  "team.roles": {
    id: "team.roles",
    title: "Roller og Tilganger",
    content: "Owner: Full tilgang. Admin: Kan administrere alt utenom billing. Manager: Kan administrere bookinger og kunder. User: Kun lese-tilgang.",
    category: "team",
  },

  // Analytics
  "analytics.kpis": {
    id: "analytics.kpis",
    title: "KPI Cards",
    content: "Key Performance Indicators viser de viktigste metrics for din virksomhet. Grønne piler betyr vekst, røde betyr nedgang.",
    category: "analytics",
  },
  "analytics.export": {
    id: "analytics.export",
    title: "Eksporter Data",
    content: "Last ned data som CSV eller Excel. Velg tidsperiode først. Filen inneholder alle bookinger med kundeinfo og priser.",
    category: "analytics",
  },

  // Settings
  "settings.profile": {
    id: "settings.profile",
    title: "Profilinnstillinger",
    content: "Oppdater ditt navn, e-post og profilbilde. Endringer synkroniseres automatisk på tvers av alle enheter.",
    category: "settings",
  },
  "settings.notifications": {
    id: "settings.notifications",
    title: "Notifikasjoner",
    content: "Velg hvordan du vil motta varsler. E-post for viktige hendelser, SMS for akutte saker, push for sanntidsoppdateringer.",
    category: "settings",
  },

  // Admin
  "admin.metrics": {
    id: "admin.metrics",
    title: "Platform Metrics",
    content: "Se totale metrics på tvers av alle organisasjoner. MRR = Monthly Recurring Revenue. Churn = Andel kunder som avslutter.",
    category: "admin",
  },
  "admin.users": {
    id: "admin.users",
    title: "Brukeroversikt",
    content: "Administrer alle brukere på plattformen. Søk, filtrer og se hvilke organisasjoner hver bruker tilhører.",
    category: "admin",
  },
};

export function HelpProvider({ children }: { children: ReactNode }) {
  const [isHelpMode, setIsHelpMode] = useState(false);
  const [currentHelp, setCurrentHelp] = useState<HelpItem | null>(null);

  const toggleHelpMode = () => {
    setIsHelpMode((prev) => !prev);
    if (isHelpMode) {
      setCurrentHelp(null);
    }
  };

  const showHelp = (itemId: string) => {
    const item = HELP_ITEMS[itemId];
    if (item) {
      setCurrentHelp(item);
    }
  };

  const hideHelp = () => {
    setCurrentHelp(null);
  };

  const getHelpItem = (itemId: string): HelpItem | null => {
    return HELP_ITEMS[itemId] || null;
  };

  return (
    <HelpContext.Provider
      value={{
        isHelpMode,
        toggleHelpMode,
        showHelp,
        hideHelp,
        currentHelp,
        getHelpItem,
      }}
    >
      {children}
    </HelpContext.Provider>
  );
}

export function useHelp() {
  const context = useContext(HelpContext);
  if (!context) {
    throw new Error("useHelp must be used within HelpProvider");
  }
  return context;
}
