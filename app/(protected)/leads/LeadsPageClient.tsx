"use client";

import React, { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID;

type Lead = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  source: string | null;
  status: string;
  created_at: string;
};

export default function LeadsPageClient() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!API_BASE || !ORG_ID) {
        setError("Mangler NEXT_PUBLIC_API_BASE eller NEXT_PUBLIC_ORG_ID.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Merk: aiAgentRoutes bruker foreløpig /orgs/... (uten /api)
        const res = await fetch(`${API_BASE}/orgs/${ORG_ID}/leads`, {
          cache: "no-store",
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

    load();
  }, []);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-lg font-semibold text-slate-100">Leads</h1>
        <p className="text-sm text-slate-400">
          Henvendelser fra skjema, AI-agent og kampanjer.
        </p>
      </header>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {loading ? (
        <p className="text-sm text-slate-400">Laster leads …</p>
      ) : leads.length === 0 ? (
        <p className="text-sm text-slate-400">
          Ingen leads registrert ennå. Koble på skjema eller AI-agent for å
          begynne å samle inn.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/60">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400">
              <tr>
                <th className="px-3 py-2">Navn</th>
                <th className="px-3 py-2">Kontakt</th>
                <th className="px-3 py-2">Kilde</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Opprettet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-100">
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="px-3 py-2">{lead.name ?? "Ukjent"}</td>
                  <td className="px-3 py-2">
                    {lead.phone ?? lead.email ?? "–"}
                  </td>
                  <td className="px-3 py-2">{lead.source ?? "–"}</td>
                  <td className="px-3 py-2 capitalize">{lead.status}</td>
                  <td className="px-3 py-2">
                    {lead.created_at
                      ? new Date(lead.created_at).toLocaleString("nb-NO")
                      : "–"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
