"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AIIntegrationPanel from "@/components/ai/AIIntegrationPanel";
import CrossNavigation, { navigationMaps } from "@/components/CrossNavigation";
import {
  fetchCustomers,
  createCustomer,
  updateCustomer,
  type Customer,
} from "@/repos/customersRepo";
import { fetchBookings } from "@/repos/bookingsRepo";
import type { Booking } from "@/types/booking";

type SortKey = "createdAt" | "name";

type NewCustomerForm = {
  name: string;
  email: string;
  phone: string;
  notes: string;
};

const EMPTY_NEW_CUSTOMER: NewCustomerForm = {
  name: "",
  email: "",
  phone: "",
  notes: "",
};

function formatNoDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "Ingen dato";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "Ugyldig dato";
  return d.toLocaleDateString("no-NO");
}

function formatNoDateTimeShort(dateStr: string | null | undefined): string {
  if (!dateStr) return "Ingen dato";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "Ugyldig dato";
  return d.toLocaleString("no-NO", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function sortBookingsByStartAsc(bookings: Booking[]): Booking[] {
  return [...bookings].sort((a, b) => {
    const ta = a.startTime ? new Date(a.startTime).getTime() : 0;
    const tb = b.startTime ? new Date(b.startTime).getTime() : 0;
    return ta - tb;
  });
}

function sortBookingsByStartDesc(bookings: Booking[]): Booking[] {
  return [...bookings].sort((a, b) => {
    const ta = a.startTime ? new Date(a.startTime).getTime() : 0;
    const tb = b.startTime ? new Date(b.startTime).getTime() : 0;
    return tb - ta;
  });
}

export default function CustomersPageClient() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [filterTireHotel, setFilterTireHotel] = useState(false);
  const [filterCoating, setFilterCoating] = useState(false);

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null,
  );

  // Ny kunde
  const [showNewModal, setShowNewModal] = useState(false);
  const [newForm, setNewForm] = useState<NewCustomerForm>(EMPTY_NEW_CUSTOMER);
  const [savingNew, setSavingNew] = useState(false);
  const [newError, setNewError] = useState<string | null>(null);

  // Redigering
  const [editNotes, setEditNotes] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // --------------------
  // Hent kunder + bookinger ved load eller når filter endres
  // --------------------
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [customersData, bookingsData] = await Promise.all([
          fetchCustomers({
            search: search.trim() || undefined,
            active: filterActive ?? undefined,
            hasTireHotel: filterTireHotel || undefined,
            hasCoating: filterCoating || undefined,
          }),
          fetchBookings(),
        ]);
        setCustomers(customersData);
        setBookings(bookingsData);
      } catch (err) {
        console.error("[CustomersPageClient] load error", err);
        setError("Kunne ikke hente kunder og bookinger.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [search, filterActive, filterTireHotel, filterCoating]);

  async function handleRefresh() {
    setRefreshing(true);
    setError(null);
    try {
      const [customersData, bookingsData] = await Promise.all([
        fetchCustomers({
          search: search.trim() || undefined,
          active: filterActive ?? undefined,
          hasTireHotel: filterTireHotel || undefined,
          hasCoating: filterCoating || undefined,
        }),
        fetchBookings(),
      ]);
      setCustomers(customersData);
      setBookings(bookingsData);
    } catch (err) {
      console.error("[CustomersPageClient] refresh error", err);
      setError("Kunne ikke oppdatere kunder og bookinger.");
    } finally {
      setRefreshing(false);
    }
  }

  const selectedCustomer = useMemo(
    () => customers.find((c) => c.id === selectedCustomerId) ?? null,
    [customers, selectedCustomerId],
  );

  // Oppdater editNotes når vi velger kunde
  useEffect(() => {
    if (selectedCustomer) {
      setEditNotes(selectedCustomer.notes ?? "");
      setEditError(null);
    }
  }, [selectedCustomer?.id]);

  // --------------------
  // Booking-statistikk for valgt kunde
  // --------------------
  const selectedCustomerBookings = useMemo(() => {
    if (!selectedCustomer) return [];
    return bookings.filter((b) => b.customerId === selectedCustomer.id);
  }, [bookings, selectedCustomer?.id]);

  const totalBookingsForSelected = selectedCustomerBookings.length;

  const latestBookingForSelected: Booking | null = useMemo(() => {
    if (!selectedCustomerBookings.length) return null;
    return sortBookingsByStartDesc(selectedCustomerBookings)[0] ?? null;
  }, [selectedCustomerBookings]);

  const nextBookingForSelected: Booking | null = useMemo(() => {
    if (!selectedCustomerBookings.length) return null;
    const now = Date.now();
    const upcoming = selectedCustomerBookings.filter((b) => {
      if (!b.startTime) return false;
      const t = new Date(b.startTime).getTime();
      return !Number.isNaN(t) && t >= now;
    });
    if (!upcoming.length) return null;
    return sortBookingsByStartAsc(upcoming)[0] ?? null;
  }, [selectedCustomerBookings]);

  // --------------------
  // Filtrering/sortering (kun sortering, filtrering gjøres i backend)
  // --------------------
  const filteredCustomers = useMemo(() => {
    let list = customers.slice();

    if (sortKey === "createdAt") {
      list.sort((a, b) => {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return db - da; // nyest først
      });
    } else if (sortKey === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name, "no-NO"));
    }

    return list;
  }, [customers, sortKey]);

  // --------------------
  // Ny kunde
  // --------------------
  function handleOpenNewCustomer() {
    setNewForm(EMPTY_NEW_CUSTOMER);
    setNewError(null);
    setShowNewModal(true);
  }

  function handleCloseNewCustomer() {
    if (savingNew) return;
    setShowNewModal(false);
  }

  async function handleSubmitNewCustomer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNewError(null);

    const trimmedName = newForm.name.trim();
    if (!trimmedName) {
      setNewError("Navn må fylles ut.");
      return;
    }

    setSavingNew(true);
    try {
      const payload = {
        name: trimmedName,
        email: newForm.email.trim() || null,
        phone: newForm.phone.trim() || null,
        notes: newForm.notes.trim() || null,
      };

      const created = await createCustomer(payload);

      setCustomers((prev) => [created, ...prev]);
      setShowNewModal(false);
    } catch (err) {
      console.error("[CustomersPageClient] createCustomer error", err);
      setNewError("Kunne ikke opprette kunde. Sjekk feltene og prøv igjen.");
    } finally {
      setSavingNew(false);
    }
  }

  // --------------------
  // Lagre notater på valgt kunde
  // --------------------
  async function handleSaveNotes() {
    if (!selectedCustomer) return;
    setSavingEdit(true);
    setEditError(null);
    try {
      const updated = await updateCustomer(selectedCustomer.id, {
        notes: editNotes.trim() || null,
      });

      setCustomers((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c)),
      );
    } catch (err) {
      console.error("[CustomersPageClient] updateCustomer error", err);
      setEditError("Kunne ikke lagre endringer på kunde.");
    } finally {
      setSavingEdit(false);
    }
  }

  // --------------------
  // Render
  // --------------------
  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-4 text-2xl font-semibold">Kunder</h1>
        <p className="text-sm text-slate-500">
          Laster kunde- og bookingoversikt …
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-8">
      {/* AI Integration Panel for CRM */}
      <div className="mb-6">
        <AIIntegrationPanel 
          module="crm" 
          userPlan="free" 
          isEnabled={false}
          onToggle={(enabled) => console.log('AI CRM toggled:', enabled)}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Kunder</h1>
          <p className="text-xs text-slate-500">
            Se hvem som har vært hos dere, hvilke forespørsler som ligger inne
            og hold kontaktinfo/notater oppdatert.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {error && (
            <span className="rounded bg-red-50 px-2 py-1 text-xs text-red-700">
              {error}
            </span>
          )}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {refreshing ? "Oppdaterer …" : "Oppdater liste"}
          </button>
          <button
            type="button"
            onClick={handleOpenNewCustomer}
            className="inline-flex items-center rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-50 hover:bg-slate-800"
          >
            Ny kunde
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[280px_minmax(0,1.4fr)_minmax(0,1fr)]">
        {/* VENSTRE: Filtre */}
        <aside className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 text-sm">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">
              Søk
            </label>
            <input
              type="text"
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Navn, e-post eller telefon …"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <p className="mt-1 text-xs text-slate-400">
              Søk oppdateres automatisk
            </p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">
              Sorter etter
            </label>
            <select
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
            >
              <option value="createdAt">Nyeste først</option>
              <option value="name">Navn (A–Å)</option>
            </select>
          </div>

          <div className="border-t border-slate-200 pt-3">
            <label className="mb-2 block text-xs font-medium text-slate-500">
              Filtrer kunder
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setFilterActive(filterActive === true ? null : true)
                  }
                  className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                    filterActive === true
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  ✓ Aktive
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFilterActive(filterActive === false ? null : false)
                  }
                  className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                    filterActive === false
                      ? "border-slate-500 bg-slate-100 text-slate-700"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Inaktive
                </button>
              </div>

              <button
                type="button"
                onClick={() => setFilterTireHotel(!filterTireHotel)}
                className={`w-full rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors ${
                  filterTireHotel
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                🛞 Har dekkhotell
              </button>

              <button
                type="button"
                onClick={() => setFilterCoating(!filterCoating)}
                className={`w-full rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors ${
                  filterCoating
                    ? "border-purple-500 bg-purple-50 text-purple-700"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                ✨ Har coating
              </button>
            </div>

            {(filterActive !== null ||
              filterTireHotel ||
              filterCoating ||
              search.trim()) && (
              <button
                type="button"
                onClick={() => {
                  setFilterActive(null);
                  setFilterTireHotel(false);
                  setFilterCoating(false);
                  setSearch("");
                }}
                className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
              >
                Nullstill alle filtre
              </button>
            )}
          </div>

          <div className="border-t border-slate-200 pt-3 text-xs text-slate-500">
            <p className="mb-1">
              Viser <strong className="text-slate-900">{filteredCustomers.length}</strong> kunder
            </p>
            {(filterActive !== null ||
              filterTireHotel ||
              filterCoating ||
              search.trim()) && (
              <div className="mt-2 flex flex-wrap gap-1">
                {search.trim() && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700">
                    Søk: {search.trim()}
                  </span>
                )}
                {filterActive === true && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] text-emerald-700">
                    Aktive
                  </span>
                )}
                {filterActive === false && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] text-slate-700">
                    Inaktive
                  </span>
                )}
                {filterTireHotel && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] text-blue-700">
                    Dekkhotell
                  </span>
                )}
                {filterCoating && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-[10px] text-purple-700">
                    Coating
                  </span>
                )}
              </div>
            )}
          </div>
        </aside>

        {/* MIDTEN: Kundeliste */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
          <h2 className="mb-3 text-sm font-medium">Kundeliste</h2>

          {filteredCustomers.length === 0 ? (
            <p className="text-xs text-slate-500">
              Ingen kunder funnet. Legg til første kunde for å komme i gang.
            </p>
          ) : (
            <div className="max-h-[520px] overflow-auto">
              <table className="min-w-full border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                    <th className="px-2 py-1 text-left">Navn</th>
                    <th className="px-2 py-1 text-left">Kontakt</th>
                    <th className="px-2 py-1 text-left">Status</th>
                    <th className="px-2 py-1 text-left">Opprettet</th>
                    <th className="px-2 py-1 text-left">Handling</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((c) => {
                    const isSelected = c.id === selectedCustomerId;
                    return (
                      <tr
                        key={c.id}
                        className={`cursor-pointer border-b border-slate-100 hover:bg-slate-50 ${
                          isSelected ? "bg-sky-50" : ""
                        }`}
                        onClick={() =>
                          setSelectedCustomerId(isSelected ? null : c.id)
                        }
                      >
                        <td className="px-2 py-2 align-top">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-900">
                              {c.name}
                            </span>
                            <div className="flex gap-1">
                              {c.hasTireHotel && (
                                <span
                                  className="inline-flex rounded-full bg-blue-100 px-1.5 py-0.5 text-[9px] font-medium text-blue-700"
                                  title="Har dekkhotell"
                                >
                                  🛞
                                </span>
                              )}
                              {c.hasCoating && (
                                <span
                                  className="inline-flex rounded-full bg-purple-100 px-1.5 py-0.5 text-[9px] font-medium text-purple-700"
                                  title="Har coating"
                                >
                                  ✨
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-2 align-top text-xs">
                          <div className="space-y-0.5">
                            {c.email && (
                              <div className="text-slate-600">{c.email}</div>
                            )}
                            {c.phone && (
                              <div className="text-slate-600">{c.phone}</div>
                            )}
                            {!c.email && !c.phone && (
                              <span className="text-slate-400">Ingen kontakt</span>
                            )}
                          </div>
                        </td>
                        <td className="px-2 py-2 align-top">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${
                              c.isActive === false
                                ? "bg-slate-100 text-slate-600"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {c.isActive === false ? "Inaktiv" : "Aktiv"}
                          </span>
                        </td>
                        <td className="px-2 py-2 align-top text-[11px] text-slate-500">
                          {formatNoDate(c.createdAt)}
                        </td>
                        <td className="px-2 py-2 align-top">
                          <Link
                            href={`/kunder/${c.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs font-medium text-blue-600 hover:text-blue-700"
                          >
                            Åpne →
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* HØYRE: Detaljer + CRM/bookingoversikt */}
        <aside className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
          <h2 className="mb-3 text-sm font-medium">Detaljer</h2>

          {!selectedCustomer ? (
            <p className="text-xs text-slate-500">
              Velg en kunde i tabellen for å se detaljer, notater og
              bookingstatus.
            </p>
          ) : (
            <div className="space-y-3 text-xs">
              <div>
                <div className="text-[11px] font-medium text-slate-500">
                  Navn
                </div>
                <div className="flex items-center gap-2">
                  <span>{selectedCustomer.name}</span>
                  <Link
                    href={`/kunder/${selectedCustomer.id}`}
                    className="rounded-full border border-slate-300 px-2 py-0.5 text-[10px] text-slate-600 hover:bg-slate-100"
                  >
                    Åpne kundekort
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[11px] font-medium text-slate-500">
                    E-post
                  </div>
                  <div>{selectedCustomer.email || "—"}</div>
                </div>
                <div>
                  <div className="text-[11px] font-medium text-slate-500">
                    Telefon
                  </div>
                  <div>{selectedCustomer.phone || "—"}</div>
                </div>
              </div>

              {/* Booking-oversikt for valgt kunde */}
              <div className="mt-1 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                    BOOKINGSTATUS
                  </p>
                  {totalBookingsForSelected > 0 && (
                    <span className="text-[11px] text-slate-500">
                      {totalBookingsForSelected} booking
                      {totalBookingsForSelected === 1 ? "" : "er"}
                    </span>
                  )}
                </div>

                {totalBookingsForSelected === 0 ? (
                  <p className="text-[11px] text-slate-500">
                    Ingen bookinger registrert på denne kunden enda.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="rounded-lg border border-slate-200 bg-white px-2 py-2">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                        SISTE BESØK
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-900">
                        {latestBookingForSelected
                          ? formatNoDate(latestBookingForSelected.startTime)
                          : "—"}
                      </p>
                      {latestBookingForSelected?.status && (
                        <p className="mt-0.5 text-[10px] capitalize text-slate-500">
                          Status: {latestBookingForSelected.status}
                        </p>
                      )}
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-white px-2 py-2">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                        NESTE BOOKING
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-900">
                        {nextBookingForSelected
                          ? formatNoDateTimeShort(nextBookingForSelected.startTime)
                          : "Ingen avtale"}
                      </p>
                      {nextBookingForSelected?.serviceName && (
                        <p className="mt-0.5 text-[10px] text-slate-500">
                          {nextBookingForSelected.serviceName}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Notater */}
              <div>
                <div className="text-[11px] font-medium text-slate-500">
                  Notater
                </div>
                <textarea
                  className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-xs"
                  rows={4}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                />
                {editError && (
                  <p className="mt-1 text-[11px] text-red-600">{editError}</p>
                )}
                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    disabled={savingEdit}
                    onClick={handleSaveNotes}
                    className="rounded bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-50 hover:bg-slate-800 disabled:opacity-50"
                  >
                    {savingEdit ? "Lagrer …" : "Lagre notater"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* MODAL: Ny kunde */}
      {showNewModal && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Ny kunde</h2>
              <button
                type="button"
                onClick={handleCloseNewCustomer}
                className="text-xs text-slate-500 hover:text-slate-700"
                disabled={savingNew}
              >
                Lukk
              </button>
            </div>

            {newError && (
              <p className="mb-2 rounded bg-red-50 px-2 py-1 text-xs text-red-700">
                {newError}
              </p>
            )}

            <form
              onSubmit={handleSubmitNewCustomer}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Navn
                </label>
                <input
                  type="text"
                  className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                  value={newForm.name}
               

                  onChange={(e) =>
                    setNewForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="F.eks. Ola Nordmann"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    E-post
                  </label>
                  <input
                    type="email"
                    className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                    value={newForm.email}
                    onChange={(e) =>
                      setNewForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="kunde@epost.no"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                    value={newForm.phone}
                    onChange={(e) =>
                      setNewForm((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    placeholder="Mobilnummer"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Notater (valgfritt)
                </label>
                <textarea
                  className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                  rows={3}
                  value={newForm.notes}
                  onChange={(e) =>
                    setNewForm((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseNewCustomer}
                  className="rounded border border-slate-300 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                  disabled={savingNew}
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  disabled={savingNew}
                  className="rounded bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-50 hover:bg-slate-800 disabled:opacity-50"
                >
                  {savingNew ? "Lagrer …" : "Lagre kunde"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cross Navigation */}
      <CrossNavigation 
        currentModule="Kunder"
        relatedModules={navigationMaps.kunder}
      />
    </div>
  );
}
