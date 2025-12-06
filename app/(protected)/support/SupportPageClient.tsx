// app/(protected)/support/SupportPageClient.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

type SupportTicket = {
  id: string;
  ticket_number: string;
  name: string;
  email: string;
  company?: string;
  subject: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
};

const STATUS_COLORS = {
  open: "bg-blue-500/20 text-blue-400 border-blue-500/50",
  in_progress: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
  waiting: "bg-purple-500/20 text-purple-400 border-purple-500/50",
  resolved: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
  closed: "bg-slate-500/20 text-slate-400 border-slate-500/50",
};

const PRIORITY_COLORS = {
  low: "text-slate-400",
  medium: "text-blue-400",
  high: "text-yellow-400",
  urgent: "text-red-400",
};

const STATUS_LABELS: Record<string, string> = {
  open: "Åpen",
  in_progress: "Under behandling",
  waiting: "Venter",
  resolved: "Løst",
  closed: "Lukket",
};

const PRIORITY_LABELS: Record<string, string> = {
  low: "Lav",
  medium: "Medium",
  high: "Høy",
  urgent: "Kritisk",
};

const CATEGORY_LABELS: Record<string, string> = {
  general: "Generelt",
  technical: "Teknisk",
  billing: "Fakturering",
  partnership: "Partnerskap",
  demo: "Demo",
  feedback: "Tilbakemelding",
};

export default function SupportPageClient() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    category: "",
    search: "",
  });
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    in_progress: 0,
    resolved: 0,
  });

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.priority) params.append("priority", filters.priority);
      if (filters.category) params.append("category", filters.category);
      if (filters.search) params.append("search", filters.search);

      const response = await fetch(`/api/support/tickets?${params}`);
      const data = await response.json();

      if (response.ok) {
        setTickets(data.tickets || []);
        
        // Calculate stats
        const allTickets = data.tickets || [];
        setStats({
          total: allTickets.length,
          open: allTickets.filter((t: SupportTicket) => t.status === "open").length,
          in_progress: allTickets.filter((t: SupportTicket) => t.status === "in_progress").length,
          resolved: allTickets.filter((t: SupportTicket) => t.status === "resolved").length,
        });
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Akkurat nå";
    if (minutes < 60) return `${minutes} min siden`;
    if (hours < 24) return `${hours} timer siden`;
    if (days < 7) return `${days} dager siden`;
    return date.toLocaleDateString("no-NO");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-shellText">Support</h1>
          <p className="text-sm text-shellTextMuted">
            Administrer support-henvendelser og tickets
          </p>
        </div>
        <Link
          href="/support/ny"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          + Ny ticket
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-shellBorder bg-shellBg p-4">
          <p className="text-xs text-shellTextMuted">Totalt</p>
          <p className="text-2xl font-bold text-shellText">{stats.total}</p>
        </div>
        <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
          <p className="text-xs text-blue-400">Åpne</p>
          <p className="text-2xl font-bold text-blue-400">{stats.open}</p>
        </div>
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
          <p className="text-xs text-yellow-400">Under behandling</p>
          <p className="text-2xl font-bold text-yellow-400">{stats.in_progress}</p>
        </div>
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
          <p className="text-xs text-emerald-400">Løst</p>
          <p className="text-2xl font-bold text-emerald-400">{stats.resolved}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-shellBorder bg-shellBg p-4">
        <div className="grid gap-4 md:grid-cols-4">
          <input
            type="text"
            placeholder="Søk..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="rounded-md border border-shellBorder bg-shellBg px-3 py-2 text-sm text-shellText placeholder-shellTextMuted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="rounded-md border border-shellBorder bg-shellBg px-3 py-2 text-sm text-shellText focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Alle statuser</option>
            <option value="open">Åpen</option>
            <option value="in_progress">Under behandling</option>
            <option value="waiting">Venter</option>
            <option value="resolved">Løst</option>
            <option value="closed">Lukket</option>
          </select>
          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="rounded-md border border-shellBorder bg-shellBg px-3 py-2 text-sm text-shellText focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Alle prioriteter</option>
            <option value="low">Lav</option>
            <option value="medium">Medium</option>
            <option value="high">Høy</option>
            <option value="urgent">Kritisk</option>
          </select>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="rounded-md border border-shellBorder bg-shellBg px-3 py-2 text-sm text-shellText focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Alle kategorier</option>
            <option value="general">Generelt</option>
            <option value="technical">Teknisk</option>
            <option value="billing">Fakturering</option>
            <option value="partnership">Partnerskap</option>
            <option value="demo">Demo</option>
            <option value="feedback">Tilbakemelding</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="rounded-lg border border-shellBorder bg-shellBg">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-2 text-sm text-shellTextMuted">Laster tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-shellTextMuted">Ingen tickets funnet</p>
          </div>
        ) : (
          <div className="divide-y divide-shellBorder">
            {tickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/support/${ticket.id}`}
                className="block p-4 hover:bg-shellBorder/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-shellTextMuted">
                        {ticket.ticket_number}
                      </span>
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[ticket.status as keyof typeof STATUS_COLORS]}`}>
                        {STATUS_LABELS[ticket.status]}
                      </span>
                      <span className={`text-xs ${PRIORITY_COLORS[ticket.priority as keyof typeof PRIORITY_COLORS]}`}>
                        {PRIORITY_LABELS[ticket.priority]}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-shellText truncate">
                      {ticket.subject}
                    </h3>
                    <p className="text-xs text-shellTextMuted mt-1">
                      Fra {ticket.name} ({ticket.email})
                      {ticket.company && ` • ${ticket.company}`}
                    </p>
                    <p className="text-xs text-shellTextMuted mt-1">
                      {CATEGORY_LABELS[ticket.category]} • {formatDate(ticket.created_at)}
                    </p>
                  </div>
                  <svg className="h-5 w-5 text-shellTextMuted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
