// components/QuickActionsPanel.tsx
"use client";

import Link from "next/link";
import { 
  Calendar, 
  Users, 
  Plus, 
  FileText, 
  MessageSquare, 
  Settings,
  Sparkles,
  TrendingUp
} from "lucide-react";

interface QuickAction {
  label: string;
  href: string;
  icon: React.ReactNode;
  description: string;
  badge?: string;
}

const quickActions: QuickAction[] = [
  {
    label: "Ny Booking",
    href: "/booking?action=new",
    icon: <Calendar className="h-5 w-5" />,
    description: "Opprett en ny booking",
  },
  {
    label: "Legg til Kunde",
    href: "/kunder?action=new",
    icon: <Users className="h-5 w-5" />,
    description: "Registrer ny kunde",
  },
  {
    label: "Ny Kampanje",
    href: "/markedsforing/kampanjer?action=new",
    icon: <MessageSquare className="h-5 w-5" />,
    description: "Start en markedsføringskampanje",
  },
  {
    label: "Generer Innhold",
    href: "/ai/content",
    icon: <Sparkles className="h-5 w-5" />,
    description: "Lag innhold med AI",
    badge: "AI",
  },
  {
    label: "Se Rapporter",
    href: "/rapporter",
    icon: <TrendingUp className="h-5 w-5" />,
    description: "Analyser dine tall",
  },
  {
    label: "Ny Tjeneste",
    href: "/tjenester?action=new",
    icon: <Plus className="h-5 w-5" />,
    description: "Legg til tjeneste",
  },
  {
    label: "Fakturaer",
    href: "/regnskap/fakturering",
    icon: <FileText className="h-5 w-5" />,
    description: "Håndter fakturaer",
  },
  {
    label: "Innstillinger",
    href: "/innstillinger",
    icon: <Settings className="h-5 w-5" />,
    description: "Endre innstillinger",
  },
];

interface QuickActionsPanelProps {
  title?: string;
  actions?: QuickAction[];
  columns?: 2 | 3 | 4;
}

export default function QuickActionsPanel({ 
  title = "⚡ Hurtigvalg",
  actions = quickActions,
  columns = 4
}: QuickActionsPanelProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3", 
    4: "grid-cols-4"
  }[columns];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">{title}</h2>
      
      <div className={`grid ${gridCols} gap-3`}>
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group relative flex flex-col items-start gap-2 p-4 rounded-lg border-2 border-slate-200 hover:border-blue-500 hover:shadow-md transition-all duration-200"
          >
            {action.badge && (
              <span className="absolute top-2 right-2 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {action.badge}
              </span>
            )}
            
            <div className="flex items-center gap-2">
              <div className="text-slate-600 group-hover:text-blue-600 transition-colors">
                {action.icon}
              </div>
              <span className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                {action.label}
              </span>
            </div>
            
            <p className="text-xs text-slate-500 group-hover:text-slate-700 transition-colors">
              {action.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Forhåndsdefinerte action sets for ulike kontekster
export const bookingActions: QuickAction[] = [
  {
    label: "Ny Booking",
    href: "/booking?action=new",
    icon: <Calendar className="h-5 w-5" />,
    description: "Opprett booking",
  },
  {
    label: "Se Kalender",
    href: "/booking/kalender",
    icon: <Calendar className="h-5 w-5" />,
    description: "Åpne kalender",
  },
  {
    label: "AI Forslag",
    href: "/ai/booking",
    icon: <Sparkles className="h-5 w-5" />,
    description: "Smart booking-forslag",
    badge: "AI",
  },
  {
    label: "Booking Innstillinger",
    href: "/innstillinger/booking",
    icon: <Settings className="h-5 w-5" />,
    description: "Konfigurer booking",
  },
];

export const marketingActions: QuickAction[] = [
  {
    label: "Ny Kampanje",
    href: "/markedsforing/kampanjer?action=new",
    icon: <MessageSquare className="h-5 w-5" />,
    description: "Start kampanje",
  },
  {
    label: "Generer Innhold",
    href: "/ai/content",
    icon: <Sparkles className="h-5 w-5" />,
    description: "AI innholdsproduksjon",
    badge: "AI",
  },
  {
    label: "Se Leads",
    href: "/leads",
    icon: <Users className="h-5 w-5" />,
    description: "Alle leads",
  },
  {
    label: "Kampanje-ideer",
    href: "/ai/marketing",
    icon: <Sparkles className="h-5 w-5" />,
    description: "AI kampanjeforslag",
    badge: "AI",
  },
];

export const accountingActions: QuickAction[] = [
  {
    label: "Ny Faktura",
    href: "/regnskap/fakturering?action=new",
    icon: <FileText className="h-5 w-5" />,
    description: "Opprett faktura",
  },
  {
    label: "Se Rapporter",
    href: "/rapporter",
    icon: <TrendingUp className="h-5 w-5" />,
    description: "Finansielle rapporter",
  },
  {
    label: "Forklar Tall",
    href: "/ai/accounting",
    icon: <Sparkles className="h-5 w-5" />,
    description: "AI regnskapsforklaring",
    badge: "AI",
  },
  {
    label: "Eksporter Data",
    href: "/regnskap/eksport",
    icon: <FileText className="h-5 w-5" />,
    description: "Last ned rapporter",
  },
];
