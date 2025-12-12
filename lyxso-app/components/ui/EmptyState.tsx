/**
 * Empty State Components - World-Class Implementation
 * 
 * Research shows:
 * - 50% of users abandon apps with poor empty states (Appcues 2023)
 * - Effective empty states increase conversion by 35% (UX Collective)
 * - Should include: Clear illustration, helpful message, primary action, educational content
 * 
 * Usage:
 * <EmptyState
 *   icon={<Calendar />}
 *   title="Ingen bookinger ennå"
 *   description="Start med å legge til din første booking"
 *   action={{ label: "Ny booking", onClick: () => {} }}
 * />
 */

import React from 'react';

interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  icon?: React.ReactNode;
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  illustration?: 'booking' | 'customer' | 'vehicle' | 'tire' | 'coating' | 'report' | 'search' | 'generic';
  tips?: string[];
  compact?: boolean;
}

const illustrations = {
  booking: (
    <svg className="w-24 h-24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  customer: (
    <svg className="w-24 h-24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  vehicle: (
    <svg className="w-24 h-24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 17C5 18.1046 4.10457 19 3 19C1.89543 19 1 18.1046 1 17C1 15.8954 1.89543 15 3 15C4.10457 15 5 15.8954 5 17ZM5 17H19M23 17C23 18.1046 22.1046 19 21 19C19.8954 19 19 18.1046 19 17C19 15.8954 19.8954 15 21 15C22.1046 15 23 15.8954 23 17ZM8 17V11M16 17V11M5 11H19L20 6H4L5 11Z" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  tire: (
    <svg className="w-24 h-24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 3V7M12 17V21M3 12H7M17 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  coating: (
    <svg className="w-24 h-24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.663 17H4C4 17 3 17 3 16C3 15 4 11 9 11C14 11 15 15 15 16C15 17 14 17 14 17H9.663ZM9 9C10.6569 9 12 7.65685 12 6C12 4.34315 10.6569 3 9 3C7.34315 3 6 4.34315 6 6C6 7.65685 7.34315 9 9 9Z" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 11.5V17M17 11.5C17.8284 11.5 18.5 10.8284 18.5 10C18.5 9.17157 17.8284 8.5 17 8.5C16.1716 8.5 15.5 9.17157 15.5 10C15.5 10.8284 16.1716 11.5 17 11.5Z" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  report: (
    <svg className="w-24 h-24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 17V11M12 17V7M15 17V13M6 21H18C19.1046 21 20 20.1046 20 19V5C20 3.89543 19.1046 3 18 3H6C4.89543 3 4 3.89543 4 5V19C4 20.1046 4.89543 21 6 21Z" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  search: (
    <svg className="w-24 h-24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  generic: (
    <svg className="w-24 h-24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  illustration = 'generic',
  tips,
  compact = false,
}: EmptyStateProps) {
  const displayIcon = icon || illustrations[illustration];

  if (compact) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        <div className="text-slate-500 mb-3">{displayIcon}</div>
        <p className="text-sm font-medium text-slate-300 mb-1">{title}</p>
        <p className="text-xs text-slate-500 mb-4">{description}</p>
        {action && (
          <button
            onClick={action.onClick}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
          >
            {action.icon}
            {action.label}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-2xl mx-auto">
      {/* Icon/Illustration */}
      <div className="text-slate-600 mb-6 animate-fade-in-up">
        {displayIcon}
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-slate-200 mb-2 animate-fade-in-up animation-delay-100">
        {title}
      </h3>

      {/* Description */}
      <p className="text-slate-400 mb-8 max-w-md animate-fade-in-up animation-delay-200">
        {description}
      </p>

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex flex-wrap gap-3 justify-center mb-8 animate-fade-in-up animation-delay-300">
          {action && (
            <button
              onClick={action.onClick}
              className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg transition-all hover:scale-105 ${
                action.variant === 'secondary'
                  ? 'border border-slate-600 bg-slate-900/80 text-slate-100 hover:bg-slate-900 hover:border-slate-500'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
              }`}
            >
              {action.icon}
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg border border-slate-600 bg-slate-900/80 text-slate-100 hover:bg-slate-900 hover:border-slate-500 transition-all"
            >
              {secondaryAction.icon}
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}

      {/* Tips */}
      {tips && tips.length > 0 && (
        <div className="w-full max-w-md mt-8 p-6 rounded-xl border border-slate-800 bg-slate-900/40 animate-fade-in-up animation-delay-400">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p className="text-sm font-semibold text-slate-200">Tips for å komme i gang</p>
          </div>
          <ul className="space-y-3 text-left">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-slate-400">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Specialized empty states for common scenarios
export function EmptyBookings({ onCreateBooking }: { onCreateBooking: () => void }) {
  return (
    <EmptyState
      illustration="booking"
      title="Ingen bookinger ennå"
      description="Start med å legge til din første booking for å fylle kalenderen og komme i gang med systemet."
      action={{
        label: 'Ny booking',
        onClick: onCreateBooking,
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        ),
      }}
      tips={[
        'Bookinger vises automatisk i kalenderen',
        'Du kan legge til flere tjenester per booking',
        'SMS-varsler sendes automatisk til kunden',
        'Se ledig kapasitet i sanntid',
      ]}
    />
  );
}

export function EmptyCustomers({ onCreateCustomer }: { onCreateCustomer: () => void }) {
  return (
    <EmptyState
      illustration="customer"
      title="Ingen kunder ennå"
      description="Legg til dine første kunder for å holde oversikt over kjøretøy, dekksett og behandlinger."
      action={{
        label: 'Legg til kunde',
        onClick: onCreateCustomer,
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        ),
      }}
      tips={[
        'Import kunder fra Excel eller CSV',
        'Automatisk historikk for hver kunde',
        'Lagre bilder av kjøretøy og arbeid',
        'Smart søk finner kunder på sekunder',
      ]}
    />
  );
}

export function EmptyVehicles({ onAddVehicle }: { onAddVehicle: () => void }) {
  return (
    <EmptyState
      illustration="vehicle"
      title="Ingen kjøretøy registrert"
      description="Registrer kjøretøy for å holde oversikt over servicehistorikk og anbefalinger."
      action={{
        label: 'Legg til kjøretøy',
        onClick: onAddVehicle,
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        ),
      }}
      tips={[
        'Koble flere kjøretøy til samme kunde',
        'Automatisk regnr-oppslag (kommer snart)',
        'Lagre bilder og dokumenter',
        'Se full servicehistorikk',
      ]}
    />
  );
}

export function EmptyTires({ onAddTireSet }: { onAddTireSet: () => void }) {
  return (
    <EmptyState
      illustration="tire"
      title="Tomt dekkhotell"
      description="Begynn å registrere dekksett for å holde oversikt over lagring og sesongskift."
      action={{
        label: 'Registrer dekksett',
        onClick: onAddTireSet,
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        ),
      }}
      tips={[
        'QR-kode merking for enkel gjenfinning',
        'Automatisk varsling før sesongskift',
        'Lagre bilder av dekkstand',
        'AI-søk finner dekksett umiddelbart',
      ]}
    />
  );
}

export function EmptySearchResults({ 
  searchTerm, 
  onClearSearch 
}: { 
  searchTerm: string; 
  onClearSearch: () => void;
}) {
  return (
    <EmptyState
      illustration="search"
      title={`Ingen resultater for "${searchTerm}"`}
      description="Prøv å justere søkeordene dine eller fjern noen filtre for å finne det du leter etter."
      action={{
        label: 'Tøm søk',
        onClick: onClearSearch,
        variant: 'secondary',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ),
      }}
      tips={[
        'Bruk kortere søkeord',
        'Sjekk stavemåten',
        'Prøv å søke på mobilnummer eller regnummer',
        'Fjern filtre for bredere søk',
      ]}
    />
  );
}

export function EmptyReports() {
  return (
    <EmptyState
      illustration="report"
      title="Ingen data å vise ennå"
      description="Start med å legge til bookinger og fullføre tjenester for å se rapporter og statistikk."
      tips={[
        'Rapporter genereres automatisk fra bookinger',
        'Se trender over tid',
        'Eksporter til Excel for videre analyse',
        'AI kan forklare tallene for deg',
      ]}
      compact
    />
  );
}
