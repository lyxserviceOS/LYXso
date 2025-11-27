// C:\Users\maser\OneDrive\Skrivebord\LYX selskaper\lyxso-app\app\(protected)\dekkhotell\DekkhotellPageClient.tsx
"use client";

import React, { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID;

// Vi vet ikke eksakt skjema, så vi lager et fleksibelt typehint
type TyreSet = {
  id: string;
  org_id?: string;
  customer_id?: string | null;
  customer_name?: string | null;
  registration_number?: string | null;
  label?: string | null;
  location?: string | null;
  season?: string | null;
  dimension?: string | null;
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;

  // Tillat ekstra felter
  [key: string]: unknown;
};

export default function DekkhotellPageClient() {
  const [tyreSets, setTyreSets] = useState<TyreSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!API_BASE || !ORG_ID) {
      setError(
        "Mangler API-konfigurasjon (NEXT_PUBLIC_API_BASE / NEXT_PUBLIC_ORG_ID).",
      );
      setLoading(false);
      return;
    }

    async function load() {
      setError(null);
      setLoading(true);

      try {
        const res = await fetch(
          `${API_BASE}/api/orgs/${ORG_ID}/tyre-sets`,
          {
            method: "GET",
          },
        );

        if (!res.ok) {
          const text = await res.text();
          throw new Error(
            `Feil ved henting av dekksett: ${res.status} ${res.statusText} - ${text}`,
          );
        }

        const json = await res.json();
        setTyreSets((json.tyreSets ?? []) as TyreSet[]);
      } catch (err) {
        console.error(err);
        setError("Kunne ikke hente dekksett.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-sm">
      <h1 className="text-2xl font-semibold">Dekkhotell</h1>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <section className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
        <h2 className="text-lg font-medium">Oversikt</h2>

        {loading ? (
          <p className="text-sm text-slate-600">
            Laster dekksett …
          </p>
        ) : tyreSets.length === 0 ? (
          <p className="text-sm text-slate-500">
            Ingen dekksett registrert ennå.
          </p>
        ) : (
          <div className="max-h-[520px] overflow-auto">
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="border-b border-slate-200 px-2 py-1">
                    Kunde
                  </th>
                  <th className="border-b border-slate-200 px-2 py-1">
                    Regnr
                  </th>
                  <th className="border-b border-slate-200 px-2 py-1">
                    Etikett
                  </th>
                  <th className="border-b border-slate-200 px-2 py-1">
                    Dimensjon
                  </th>
                  <th className="border-b border-slate-200 px-2 py-1">
                    Sesong
                  </th>
                  <th className="border-b border-slate-200 px-2 py-1">
                    Plassering
                  </th>
                  <th className="border-b border-slate-200 px-2 py-1">
                    Notat
                  </th>
                  <th className="border-b border-slate-200 px-2 py-1">
                    Opprettet
                  </th>
                </tr>
              </thead>
              <tbody>
                {tyreSets.map((set) => {
                  const created =
                    set.created_at &&
                    new Date(set.created_at).toLocaleDateString(
                      "nb-NO",
                    );

                  const customerName =
                    (set.customer_name as string | undefined) ||
                    "";
                  const reg =
                    (set.registration_number as
                      | string
                      | undefined) || "";
                  const label =
                    (set.label as string | undefined) || "";
                  const dimension =
                    (set.dimension as string | undefined) || "";
                  const season =
                    (set.season as string | undefined) || "";
                  const location =
                    (set.location as string | undefined) || "";
                  const notes =
                    (set.notes as string | undefined) || "";

                  return (
                    <tr
                      key={set.id}
                      className="even:bg-slate-50/40 hover:bg-slate-100/60"
                    >
                      <td className="border-b border-slate-100 px-2 py-1">
                        {customerName || "—"}
                      </td>
                      <td className="border-b border-slate-100 px-2 py-1">
                        {reg || "—"}
                      </td>
                      <td className="border-b border-slate-100 px-2 py-1">
                        {label || "—"}
                      </td>
                      <td className="border-b border-slate-100 px-2 py-1">
                        {dimension || "—"}
                      </td>
                      <td className="border-b border-slate-100 px-2 py-1">
                        {season || "—"}
                      </td>
                      <td className="border-b border-slate-100 px-2 py-1">
                        {location || "—"}
                      </td>
                      <td className="border-b border-slate-100 px-2 py-1">
                        {notes || "—"}
                      </td>
                      <td className="border-b border-slate-100 px-2 py-1">
                        {created || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Debug / dev: vis rådata for ett sett */}
      {!loading && tyreSets.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-4 space-y-2 text-[11px]">
          <h2 className="text-xs font-medium">
            Rådata (første dekksett) – for å se faktisk feltnavn i
            tyre_sets
          </h2>
          <pre className="bg-slate-950 text-slate-100 rounded p-2 overflow-auto max-h-[260px]">
            {JSON.stringify(tyreSets[0], null, 2)}
          </pre>
        </section>
      )}
    </div>
  );
}
