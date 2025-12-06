"use client";

import { useEffect, useState, FormEvent } from "react";
import { getApiBaseUrl } from "@/lib/apiConfig";

const API_BASE_URL = getApiBaseUrl();
const ORG_ID =
  process.env.NEXT_PUBLIC_ORG_ID ??
  "ae407558-7f44-40cb-8fe9-1d023212b926";

type Employee = {
  id: string;
  orgId: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string | null;
  isActive: boolean;
  deletedAt?: string | null;
};

type ApiError = string | null;

export default function AnsattePageClient() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [viewMode, setViewMode] = useState<'active' | 'inactive' | 'deleted'>('active');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [archivingId, setArchivingId] = useState<string | null>(null);

  useEffect(() => {
    if (!ORG_ID) {
      setError(
        "Mangler NEXT_PUBLIC_ORG_ID – sett denne i .env.local for å kunne hente ansatte.",
      );
      setLoading(false);
      return;
    }

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${API_BASE_URL}/api/orgs/${encodeURIComponent(
            ORG_ID,
          )}/employees`,
        );

        if (!res.ok) {
          const text = await res.text();
          throw new Error(
            `Feil ved henting av ansatte (${res.status}): ${text}`,
          );
        }

        const json = await res.json();
        setEmployees(json.employees ?? []);
      } catch (err: any) {
        console.error("Feil ved henting av ansatte:", err);
        setError(
          err?.message ?? "Uventet feil ved henting av ansatte.",
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function resetForm() {
    setEditingId(null);
    setName("");
    setEmail("");
    setPhone("");
    setRole("");
    setIsActive(true);
  }

  function startEdit(emp: Employee) {
    setEditingId(emp.id);
    setName(emp.name);
    setEmail(emp.email ?? "");
    setPhone(emp.phone ?? "");
    setRole(emp.role ?? "");
    setIsActive(emp.isActive);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!ORG_ID) return;

    const trimmedName = name.trim();
    if (!trimmedName) return;

    setSaving(true);
    setError(null);

    try {
      const body = {
        name: trimmedName,
        email: email.trim() || null,
        phone: phone.trim() || null,
        role: role.trim() || null,
        isActive,
      };

      const isEdit = !!editingId;

      const url = isEdit
        ? `${API_BASE_URL}/api/orgs/${encodeURIComponent(
            ORG_ID,
          )}/employees/${encodeURIComponent(editingId!)}`
        : `${API_BASE_URL}/api/orgs/${encodeURIComponent(
            ORG_ID,
          )}/employees`;

      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(
          `Klarte ikke å ${isEdit ? "oppdatere" : "opprette"} ansatt (${
            res.status
          }): ${text}`,
        );
      }

      const json = await res.json();
      const saved = json.employee as Employee;

      setEmployees((prev) => {
        if (isEdit) {
          return prev.map((e) => (e.id === saved.id ? saved : e));
        }
        return [...prev, saved].sort((a, b) =>
          a.name.localeCompare(b.name),
        );
      });

      resetForm();
    } catch (err: any) {
      console.error("Feil ved lagring av ansatt:", err);
      setError(err?.message ?? "Feil ved lagring av ansatt.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!ORG_ID) return;
    if (!window.confirm("Arkivere denne ansatte? (De vil flyttes til 'Inaktive' og kan gjenopprettes senere)")) return;

    try {
      setArchivingId(id);
      setError(null);

      const res = await fetch(
        `${API_BASE_URL}/api/orgs/${encodeURIComponent(
          ORG_ID,
        )}/employees/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok && res.status !== 204) {
        const text = await res.text();
        throw new Error(
          `Klarte ikke å arkivere ansatt (${res.status}): ${text}`,
        );
      }

      // Oppdater lokal state: marker som inaktiv
      setEmployees((prev) => 
        prev.map(e => e.id === id ? { ...e, isActive: false } : e)
      );
      
      if (editingId === id) {
        resetForm();
      }
    } catch (err: any) {
      console.error("Feil ved arkivering av ansatt:", err);
      setError(err?.message ?? "Feil ved arkivering av ansatt.");
    } finally {
      setArchivingId(null);
    }
  }

  async function handlePermanentDelete(id: string) {
    if (!ORG_ID) return;
    if (!window.confirm("⚠️ PERMANENT SLETTING\n\nVil du PERMANENT slette denne ansatte?\n\nDette kan IKKE angres, men historikk og bookinger beholdes.\n\nAnbefaling: Bruk 'Arkiver' i stedet.")) return;

    try {
      setDeletingId(id);
      setError(null);

      const res = await fetch(
        `${API_BASE_URL}/api/orgs/${encodeURIComponent(
          ORG_ID,
        )}/employees/${encodeURIComponent(id)}/permanent`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok && res.status !== 204) {
        const text = await res.text();
        throw new Error(
          `Klarte ikke å slette permanent (${res.status}): ${text}`,
        );
      }

      // Oppdater lokal state: sett deleted_at
      setEmployees((prev) => 
        prev.map(e => e.id === id ? { ...e, deletedAt: new Date().toISOString() } : e)
      );
      
      if (editingId === id) {
        resetForm();
      }
    } catch (err: any) {
      console.error("Feil ved permanent sletting:", err);
      setError(err?.message ?? "Feil ved permanent sletting.");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="h-full w-full overflow-y-auto bg-slate-50 px-6 py-6">
        <div className="mx-auto max-w-6xl text-sm text-slate-500">
          Laster ansatte …
        </div>
      </div>
    );
  }

  // Filter ansatte basert på viewMode (2 kategorier: active og inactive/archived)
  const filteredEmployees = employees.filter(e => {
    if (viewMode === 'active') return e.isActive;
    if (viewMode === 'inactive') return !e.isActive; // Inkluderer både inaktive og slettede
    if (viewMode === 'deleted') return !e.isActive && !!e.deletedAt;
    return false;
  });

  const activeCount = employees.filter(e => e.isActive).length;
  const inactiveCount = employees.filter(e => !e.isActive).length; // Alle inaktive (arkiverte)

  return (
    <div className="h-full w-full overflow-y-auto bg-slate-50 px-6 py-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              DRIFT · ANSATTE
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
              Ansatte & roller
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Denne listen brukes for kapasitet, kalender og senere
              tilgangsstyring.
            </p>
          </div>
          
          {/* Filter toggle buttons - 3 kategorier */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('active')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'active'
                  ? "bg-green-600 text-white shadow-sm"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              ✅ Aktive ({activeCount})
            </button>
            <button
              onClick={() => setViewMode('inactive')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'inactive'
                  ? "bg-orange-600 text-white shadow-sm"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              ⏸️ Inaktive ({inactiveCount})
            </button>
            <button
              onClick={() => setViewMode('deleted')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'deleted'
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              🗑️ Slettet ({deletedCount})
            </button>
          </div>
        </header>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.2fr,1.8fr]">
          {/* Skjema */}
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">
              {editingId ? "Rediger ansatt" : "Ny ansatt"}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Minst navn er påkrevd – e-post og telefon er anbefalt for varsler.
            </p>

            <form
              onSubmit={handleSave}
              className="mt-4 space-y-3 text-sm"
            >
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Navn
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="F.eks. Ola Nordmann"
                  required
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">
                    E-post
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="F.eks. ola@firma.no"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="F.eks. 900 00 000"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Rolle / tittel
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="F.eks. Detailer, daglig leder, lærling …"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="isActive"
                  className="text-xs text-slate-600"
                >
                  Aktiv i kalender og fordeling av jobber
                </label>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? editingId
                      ? "Lagrer endringer …"
                      : "Oppretter ansatt …"
                    : editingId
                    ? "Lagre endringer"
                    : "Legg til ansatt"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-xs font-medium text-slate-500 hover:text-slate-700"
                  >
                    Avbryt redigering
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* Liste */}
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">
              {viewMode === 'active' && "Aktive ansatte"}
              {viewMode === 'inactive' && "Inaktive ansatte"}
              {viewMode === 'deleted' && "Permanent slettede ansatte"}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {viewMode === 'active' && "Ansatte som er aktive i systemet."}
              {viewMode === 'inactive' && "Ansatte som er deaktivert, men kan reaktiveres."}
              {viewMode === 'deleted' && "Ansatte som er permanent slettet. Historikk og bookinger beholdes."}
            </p>

            {filteredEmployees.length === 0 ? (
              <div className="mt-3 rounded-md border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
                {viewMode === 'active' && "Ingen aktive ansatte registrert ennå."}
                {viewMode === 'inactive' && "Ingen inaktive ansatte."}
                {viewMode === 'deleted' && "Ingen permanent slettede ansatte."}
              </div>
            ) : (
              <div className="mt-3 overflow-hidden rounded-md border border-slate-200">
                <table className="min-w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-[11px] uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-3 py-2">Navn</th>
                      <th className="px-3 py-2">Kontakt</th>
                      <th className="px-3 py-2">Rolle</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2 text-right">Handlinger</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((emp) => (
                      <tr
                        key={emp.id}
                        className="border-t border-slate-200 bg-white hover:bg-slate-50"
                      >
                        <td className="px-3 py-2 align-top">
                          <div className="font-medium text-slate-900">
                            {emp.name}
                          </div>
                        </td>
                        <td className="px-3 py-2 align-top text-[11px] text-slate-600">
                          {emp.email && (
                            <div className="truncate">{emp.email}</div>
                          )}
                          {emp.phone && (
                            <div className="truncate">{emp.phone}</div>
                          )}
                          {!emp.email && !emp.phone && "–"}
                        </td>
                        <td className="px-3 py-2 align-top text-[11px] text-slate-600">
                          {emp.role ?? "–"}
                        </td>
                        <td className="px-3 py-2 align-top text-[11px]">
                          <span
                            className={
                              emp.isActive
                                ? "inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700"
                                : "inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                            }
                          >
                            {emp.isActive ? "Aktiv" : "Inaktiv"}
                          </span>
                        </td>
                        <td className="px-3 py-2 align-top text-right text-[11px]">
                          <button
                            type="button"
                            onClick={() => window.open(`/ansatte/${emp.id}`, '_blank')}
                            className="mr-2 text-indigo-600 hover:text-indigo-800"
                            title="Vis ansattkort"
                          >
                            🪪 Kort
                          </button>
                          <button
                            type="button"
                            onClick={() => startEdit(emp)}
                            className="mr-2 text-blue-600 hover:text-blue-800"
                          >
                            Rediger
                          </button>
                          
                          {/* Aktive: Kan arkiveres (bli inaktiv) */}
                          {viewMode === 'active' && (
                            <button
                              type="button"
                              onClick={() => handleDelete(emp.id)}
                              disabled={archivingId === emp.id}
                              className="text-orange-600 hover:text-orange-800 disabled:opacity-60"
                            >
                              {archivingId === emp.id
                                ? "Deaktiverer…"
                                : "Deaktiver"}
                            </button>
                          )}
                          
                          {/* Inaktive: Kan slettes permanent */}
                          {viewMode === 'inactive' && (
                            <button
                              type="button"
                              onClick={() => handlePermanentDelete(emp.id)}
                              disabled={deletingId === emp.id}
                              className="text-red-600 hover:text-red-800 disabled:opacity-60"
                              title="⚠️ Permanent sletting - kan ikke angres"
                            >
                              {deletingId === emp.id
                                ? "Sletter…"
                                : "🗑️ Slett permanent"}
                            </button>
                          )}
                          
                          {/* Slettet: Ingen handlinger */}
                          {viewMode === 'deleted' && (
                            <span className="text-slate-400 text-xs">
                              Permanent slettet
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
