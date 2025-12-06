"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Phone, Mail, Calendar, Filter, Search, RefreshCw } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
import { getApiBaseUrl } from "@/lib/apiConfig";

const API_BASE = getApiBaseUrl();
const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID;

type Lead = {
  id: string;
  org_id: string;
  customer_id: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  source: string | null;
  source_campaign: string | null;
  status: string;
  notes: string | null;
  interested_services: string[] | null;
  last_contact_at: string | null;
  created_at: string;
  updated_at: string;
  customers?: {
    name: string;
    email: string;
    phone: string;
  };
};

export default function LeadsPageClient() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadLeads();
  }, [statusFilter, sourceFilter]);

  async function loadLeads() {
    if (!API_BASE || !ORG_ID) {
      setError("Mangler NEXT_PUBLIC_API_BASE eller NEXT_PUBLIC_ORG_ID.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let url = `${API_BASE}/api/orgs/${ORG_ID}/leads?limit=100`;
      
      if (statusFilter !== 'all') {
        url += `&status=${statusFilter}`;
      }
      
      if (sourceFilter !== 'all') {
        url += `&source=${sourceFilter}`;
      }

      const res = await fetch(url, {
        cache: "no-store",
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`Feil fra API (${res.status})`);
      }

      const json = await res.json();
      setLeads(json.leads ?? []);
    } catch (err: any) {
      setError(err?.message ?? "Ukjent feil ved henting av leads");
    } finally {
      setLoading(false);
    }
  }

  // Filter by search query
  const filteredLeads = leads.filter(lead => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      lead.name?.toLowerCase().includes(query) ||
      lead.email?.toLowerCase().includes(query) ||
      lead.phone?.toLowerCase().includes(query) ||
      lead.customers?.name?.toLowerCase().includes(query)
    );
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      new: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      contacted: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      interested: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      qualified: 'bg-green-500/20 text-green-300 border-green-500/30',
      converted: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      unqualified: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
      lost: 'bg-red-500/20 text-red-300 border-red-500/30',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles] || styles.new}`}>
        {status}
      </span>
    );
  };

  const getSourceIcon = (source: string | null) => {
    switch (source?.toLowerCase()) {
      case 'sms':
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case 'phone':
      case 'call':
        return <Phone className="w-4 h-4 text-green-400" />;
      case 'email':
        return <Mail className="w-4 h-4 text-purple-400" />;
      default:
        return <Calendar className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Leads</h1>
          <p className="text-sm text-slate-400">
            Henvendelser fra SMS, skjema, AI-agent og kampanjer.
          </p>
        </div>
        <button
          onClick={loadLeads}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Oppdater
        </button>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-blue-500"
          >
            <option value="all">Alle statuser</option>
            <option value="new">Nye</option>
            <option value="contacted">Kontaktet</option>
            <option value="interested">Interessert</option>
            <option value="qualified">Kvalifisert</option>
            <option value="converted">Konvertert</option>
            <option value="unqualified">Ukvalifisert</option>
            <option value="lost">Tapt</option>
          </select>
        </div>

        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-blue-500"
        >
          <option value="all">Alle kilder</option>
          <option value="sms">SMS</option>
          <option value="phone">Telefon</option>
          <option value="email">E-post</option>
          <option value="web">Web</option>
          <option value="facebook">Facebook</option>
          <option value="google">Google</option>
        </select>

        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Søk etter navn, telefon eller e-post..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="text-xs text-slate-400">
          {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-12 text-center">
          <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-sm text-slate-400">
            {searchQuery || statusFilter !== 'all' || sourceFilter !== 'all'
              ? "Ingen leads matcher dine filtre."
              : "Ingen leads registrert ennå. Koble på SMS, skjema eller AI-agent for å begynne å samle inn."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/60">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-900/80 text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 font-medium">Lead</th>
                <th className="px-4 py-3 font-medium">Kontakt</th>
                <th className="px-4 py-3 font-medium">Kilde</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Sist kontakt</th>
                <th className="px-4 py-3 font-medium">Opprettet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-100">
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => router.push(`/leads/${lead.id}`)}
                  className="cursor-pointer hover:bg-slate-900/40 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {(lead.name || lead.customers?.name || 'U')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-100">
                          {lead.name || lead.customers?.name || "Ukjent"}
                        </p>
                        {lead.interested_services && lead.interested_services.length > 0 && (
                          <p className="text-xs text-slate-500">
                            {lead.interested_services[0]}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      {(lead.phone || lead.customers?.phone) && (
                        <div className="flex items-center gap-2 text-xs text-slate-300">
                          <Phone className="w-3 h-3" />
                          {lead.phone || lead.customers?.phone}
                        </div>
                      )}
                      {(lead.email || lead.customers?.email) && (
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Mail className="w-3 h-3" />
                          {lead.email || lead.customers?.email}
                        </div>
                      )}
                      {!(lead.phone || lead.customers?.phone) && !(lead.email || lead.customers?.email) && (
                        <span className="text-xs text-slate-500">–</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getSourceIcon(lead.source)}
                      <span className="text-sm capitalize">{lead.source || "–"}</span>
                    </div>
                    {lead.source_campaign && (
                      <p className="text-xs text-slate-500 mt-1">{lead.source_campaign}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(lead.status)}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-400">
                    {lead.last_contact_at
                      ? new Date(lead.last_contact_at).toLocaleDateString("nb-NO", {
                          day: "2-digit",
                          month: "short",
                        })
                      : "–"}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-400">
                    {lead.created_at
                      ? new Date(lead.created_at).toLocaleDateString("nb-NO", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "–"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Stats */}
      {!loading && filteredLeads.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-4">
            <p className="text-xs text-slate-500 mb-1">Nye</p>
            <p className="text-2xl font-semibold text-blue-400">
              {leads.filter(l => l.status === 'new').length}
            </p>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-4">
            <p className="text-xs text-slate-500 mb-1">Kontaktet</p>
            <p className="text-2xl font-semibold text-yellow-400">
              {leads.filter(l => l.status === 'contacted').length}
            </p>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-4">
            <p className="text-xs text-slate-500 mb-1">Interessert</p>
            <p className="text-2xl font-semibold text-purple-400">
              {leads.filter(l => l.status === 'interested').length}
            </p>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-4">
            <p className="text-xs text-slate-500 mb-1">Konvertert</p>
            <p className="text-2xl font-semibold text-emerald-400">
              {leads.filter(l => l.status === 'converted').length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
