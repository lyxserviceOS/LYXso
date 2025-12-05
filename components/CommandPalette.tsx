"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type CommandItem = {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  action: () => void;
  keywords: string[];
  category: string;
};

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Commands database
  const commands: CommandItem[] = [
    // Navigation
    {
      id: "nav-dashboard",
      title: "Gå til Dashboard",
      icon: "📊",
      action: () => router.push("/"),
      keywords: ["dashboard", "hjem", "oversikt"],
      category: "Navigasjon",
    },
    {
      id: "nav-bookings",
      title: "Se Bookinger",
      icon: "📅",
      action: () => router.push("/bookinger"),
      keywords: ["bookinger", "avtaler", "appointments"],
      category: "Navigasjon",
    },
    {
      id: "nav-customers",
      title: "Se Kunder",
      icon: "👥",
      action: () => router.push("/kunder"),
      keywords: ["kunder", "customers"],
      category: "Navigasjon",
    },
    {
      id: "nav-team",
      title: "Administrer Team",
      icon: "👤",
      action: () => router.push("/ansatte"),
      keywords: ["team", "ansatte", "medlemmer"],
      category: "Navigasjon",
    },
    {
      id: "nav-analytics",
      title: "Se Analytics",
      icon: "📈",
      action: () => router.push("/rapporter/analytics"),
      keywords: ["analytics", "rapporter", "statistikk"],
      category: "Navigasjon",
    },

    // Actions
    {
      id: "action-new-booking",
      title: "Opprett Ny Booking",
      description: "Lag en ny booking for en kunde",
      icon: "➕",
      action: () => router.push("/bookinger/ny"),
      keywords: ["ny", "opprett", "booking", "avtale"],
      category: "Handlinger",
    },
    {
      id: "action-new-customer",
      title: "Legg til Kunde",
      description: "Registrer en ny kunde",
      icon: "➕",
      action: () => router.push("/kunder/ny"),
      keywords: ["ny", "kunde", "customer", "legg til"],
      category: "Handlinger",
    },
    {
      id: "action-export",
      title: "Eksporter Data",
      description: "Last ned data som CSV eller Excel",
      icon: "💾",
      action: () => router.push("/rapporter/analytics?export=true"),
      keywords: ["eksporter", "csv", "excel", "last ned"],
      category: "Handlinger",
    },

    // Settings
    {
      id: "settings-profile",
      title: "Profilinnstillinger",
      icon: "⚙️",
      action: () => router.push("/innstillinger/profil"),
      keywords: ["innstillinger", "profil", "settings"],
      category: "Innstillinger",
    },
    {
      id: "settings-notifications",
      title: "Notifikasjonsinnstillinger",
      icon: "🔔",
      action: () => router.push("/innstillinger/notifikasjoner"),
      keywords: ["notifikasjoner", "varsler", "notifications"],
      category: "Innstillinger",
    },

    // Help
    {
      id: "help-docs",
      title: "Åpne Dokumentasjon",
      icon: "📚",
      action: () => window.open("/docs", "_blank"),
      keywords: ["hjelp", "docs", "dokumentasjon", "guide"],
      category: "Hjelp",
    },
    {
      id: "help-support",
      title: "Kontakt Support",
      icon: "💬",
      action: () => window.open("mailto:support@lyxso.no", "_blank"),
      keywords: ["support", "hjelp", "kontakt"],
      category: "Hjelp",
    },
  ];

  // Filter commands based on search
  const filteredCommands = search
    ? commands.filter(
        (cmd) =>
          cmd.title.toLowerCase().includes(search.toLowerCase()) ||
          cmd.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase())) ||
          cmd.description?.toLowerCase().includes(search.toLowerCase())
      )
    : commands;

  // Group by category
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) {
      acc[cmd.category] = [];
    }
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // CMD+K or CTRL+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }

      // ESC to close
      if (e.key === "Escape") {
        setIsOpen(false);
        setSearch("");
        setSelectedIndex(0);
      }

      if (!isOpen) return;

      // Arrow navigation
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          Math.min(prev + 1, filteredCommands.length - 1)
        );
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      }

      // Enter to execute
      if (e.key === "Enter" && filteredCommands[selectedIndex]) {
        e.preventDefault();
        executeCommand(filteredCommands[selectedIndex]);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  function executeCommand(command: CommandItem) {
    command.action();
    setIsOpen(false);
    setSearch("");
    setSelectedIndex(0);
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={() => setIsOpen(false)}
      />

      {/* Command palette */}
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50">
        <div className="bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden">
          {/* Search input */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Søk etter handlinger, sider, innstillinger..."
                className="flex-1 text-lg text-slate-900 placeholder-slate-400 focus:outline-none"
              />
              <kbd className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                ESC
              </kbd>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-auto">
            {Object.keys(groupedCommands).length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <p className="text-sm">Ingen resultater funnet</p>
              </div>
            ) : (
              Object.entries(groupedCommands).map(([category, items]) => (
                <div key={category}>
                  <div className="px-4 py-2 bg-slate-50 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    {category}
                  </div>
                  {items.map((item, index) => {
                    const globalIndex = filteredCommands.indexOf(item);
                    return (
                      <button
                        key={item.id}
                        onClick={() => executeCommand(item)}
                        className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors ${
                          selectedIndex === globalIndex ? "bg-blue-50" : ""
                        }`}
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium text-slate-900">
                            {item.title}
                          </div>
                          {item.description && (
                            <div className="text-xs text-slate-500">
                              {item.description}
                            </div>
                          )}
                        </div>
                        {selectedIndex === globalIndex && (
                          <kbd className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                            ↵
                          </kbd>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded">
                  ↑↓
                </kbd>
                Naviger
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded">
                  ↵
                </kbd>
                Utfør
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded">
                  ESC
                </kbd>
                Lukk
              </span>
            </div>
            <span className="text-slate-500">
              Trykk{" "}
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded">
                ⌘K
              </kbd>{" "}
              for å åpne
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

// Trigger button component
export function CommandPaletteTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:border-slate-400 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <span>Søk</span>
        <kbd className="ml-auto px-1.5 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
          ⌘K
        </kbd>
      </button>

      {isOpen && <CommandPalette />}
    </>
  );
}
