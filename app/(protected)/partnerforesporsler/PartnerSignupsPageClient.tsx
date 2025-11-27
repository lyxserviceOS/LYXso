"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";
const ADMIN_EMAIL =
  (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").toLowerCase();

type PartnerSignup = {
  id: string;
  created_at: string | null;
  org_number: string | null;
  company_name: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  website_url: string | null;
  has_website: boolean | null;
  wants_landing_page: boolean | null;
  notes: string | null;
  status: string | null;
  org_id?: string | null;
};

type ListResponse = {
  signups: PartnerSignup[];
};

type ApproveRejectResponse = {
  message?: string;
  org?: {
    id: string;
    name: string | null;
    org_number: string | null;
    is_active: boolean | null;
    plan?: string | null;
  };
  signup: PartnerSignup;
};

type AuthState = "loading" | "admin" | "forbidden";

function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function formatDateTime(value: string | null): string {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("nb-NO", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function prettyStatus(status: string | null): string {
  if (!status) return "ukjent";
  switch (status) {
    case "pending":
      return "Ny";
    case "reviewing":
      return "Under vurdering";
    case "approved":
      return "Godkjent";
    case "rejected":
      return "Avslått";
    default:
      return status;
  }
}

function statusClasses(status: string | null): string {
  switch (status) {
    case "pending":
      return "bg-amber-900/40 text-amber-100 border border-amber-500/60";
    case "reviewing":
      return "bg-blue-900/40 text-blue-100 border border-blue-500/60";
    case "approved":
      return "bg-emerald-900/40 text-emerald-100 border border-emerald-500/60";
    case "rejected":
      return "bg-red-900/40 text-red-100 border border-red-500/60";
    default:
      return "bg-slate-800 text-slate-200 border border-slate-600/60";
  }
}

export default function PartnerSignupsPageClient() {
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [signups, setSignups] = useState<PartnerSignup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const [mutatingAction, setMutatingAction] = useState<
    "approve" | "reject" | null
  >(null);

  // --- Admin-sjekk (kun din e-post skal være admin) ---
  useEffect(() => {
    let cancelled = false;

    async function checkAdmin() {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (cancelled) return;

        if (error || !data?.user) {
          setAuthState("forbidden");
          return;
        }

        const email = (data.user.email || "").toLowerCase();

        if (ADMIN_EMAIL && email === ADMIN_EMAIL) {
          setAuthState("admin");
        } else {
          setAuthState("forbidden");
        }
      } catch (err) {
        console.error("Feil ved admin-sjekk:", err);
        if (!cancelled) {
          setAuthState("forbidden");
        }
      }
    }

    void checkAdmin();

    return () => {
      cancelled = true;
    };
  }, []);

  // Hent signups (kun når vi faktisk er admin)
  async function loadSignups() {
    if (authState !== "admin") return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/admin/partner-signups`, {
        method: "GET",
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(
          body?.error || "Kunne ikke hente partner-forespørsler fra API.",
        );
      }

      const json = (await res.json()) as ListResponse;
      setSignups(json.signups ?? []);
    } catch (err: unknown) {
      console.error("Feil ved henting av partner-signups:", err);
      const errorMessage = err instanceof Error ? err.message : "Uventet feil ved henting av partner-forespørsler.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authState === "admin") {
      void loadSignups();
    }
  }, [authState]);

  async function handleApprove(id: string) {
    if (authState !== "admin") return;

    setMutatingId(id);
    setMutatingAction("approve");
    setError(null);

    try {
      const res = await fetch(
        `${API_BASE}/api/admin/partner-signups/${id}/approve`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Kunne ikke godkjenne partner.");
      }

      const json = (await res.json()) as ApproveRejectResponse;
      const updated = json.signup;

      setSignups((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s)),
      );
    } catch (err: any) {
      console.error("Feil ved godkjenning:", err);
      setError(err?.message || "Uventet feil ved godkjenning av partner.");
    } finally {
      setMutatingId(null);
      setMutatingAction(null);
    }
  }

  async function handleReject(id: string) {
    if (authState !== "admin") return;

    setMutatingId(id);
    setMutatingAction("reject");
    setError(null);

    try {
      const res = await fetch(
        `${API_BASE}/api/admin/partner-signups/${id}/reject`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Kunne ikke avslå partner.");
      }

      const json = (await res.json()) as ApproveRejectResponse;
      const updated = json.signup;

      setSignups((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s)),
      );
    } catch (err: any) {
      console.error("Feil ved avslag:", err);
      setError(err?.message || "Uventet feil ved avslag av partner.");
    } finally {
      setMutatingId(null);
      setMutatingAction(null);
    }
  }

  const total = signups.length;
  const pending = signups.filter((s) => s.status === "pending").length;
  const reviewing = signups.filter((s) => s.status === "reviewing").length;
  const approved = signups.filter((s) => s.status === "approved").length;
  const rejected = signups.filter((s) => s.status === "rejected").length;
  const open = pending + reviewing;

  // --- Ulike visninger basert på authState ---

  if (authState === "loading") {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-xs text-slate-400">
          Sjekker tilgang til admin-panel ...
        </p>
      </div>
    );
  }

  if (authState === "forbidden") {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <div className="max-w-sm rounded-xl border border-red-500/40 bg-red-900/20 p-4 text-center">
          <p className="text-sm font-semibold text-red-100">
            Ingen tilgang til admin-panel
          </p>
          <p className="mt-2 text-xs text-red-100/80">
            Denne siden er kun tilgjengelig for LYXso-admin. Dersom du er
            partner skal du bruke Kontrollpanel og de vanlige menyvalgene.
          </p>
        </div>
      </div>
    );
  }

  // authState === "admin" → full UI
  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden p-4">
      {/* Topptekst */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">
            Partner-forespørsler
          </h1>
          <p className="text-xs text-slate-400">
            Forespørsler som kommer inn via &quot;Bli partner&quot; og andre
            skjema. Her godkjenner du og oppretter org, eller avslår.
          </p>
        </div>
        <div className="text-right text-xs text-slate-400">
          <button
            type="button"
            onClick={() => void loadSignups()}
            className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] font-medium text-slate-100 hover:border-blue-500 hover:bg-slate-900/80"
            disabled={loading}
          >
            {loading ? "Laster..." : "Oppdater liste"}
          </button>
          <p className="mt-1 text-[11px] text-slate-500">
            Endringer her påvirker hvem som får full partner-tilgang.
          </p>
        </div>
      </div>

      {/* Error-linje */}
      {error && (
        <div className="rounded-md border border-red-500/50 bg-red-900/20 px-3 py-2 text-xs text-red-100">
          {error}
        </div>
      )}

      {/* Små stats-kort */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Totalt
          </p>
          <p className="mt-1 text-2xl font-semibold text-slate-50">
            {total}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Alle partner-forespørsler i systemet.
          </p>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Åpne
          </p>
          <p className="mt-1 text-2xl font-semibold text-slate-50">
            {open}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Pending + under vurdering.
          </p>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Pending
          </p>
          <p className="mt-1 text-2xl font-semibold text-slate-50">
            {pending}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Nye forespørsler som ikke er behandlet.
          </p>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Godkjent
          </p>
          <p className="mt-1 text-2xl font-semibold text-emerald-300">
            {approved}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Har fått org og partner-tilgang.
          </p>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Avslått
          </p>
          <p className="mt-1 text-2xl font-semibold text-red-300">
            {rejected}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Forespørsler som er avslått.
          </p>
        </div>
      </div>

      {/* Tabell med forespørsler */}
      <div className="flex-1 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/70">
        <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Forespørsler
            </p>
            <p className="text-[11px] text-slate-400">
              Godkjenn for å opprette org og gi tilgang, eller avslå.
            </p>
          </div>
        </div>

        <div className="h-full overflow-auto">
          <table className="min-w-full border-separate border-spacing-y-1 text-left text-xs">
            <thead className="sticky top-0 z-10 bg-slate-950 text-[11px] text-slate-400">
              <tr>
                <th className="px-3 py-1 font-medium">Status</th>
                <th className="px-3 py-1 font-medium">Bedrift</th>
                <th className="px-3 py-1 font-medium">Kontakt</th>
                <th className="px-3 py-1 font-medium">Nettside</th>
                <th className="px-3 py-1 font-medium">Info</th>
                <th className="px-3 py-1 font-medium">Opprettet</th>
                <th className="px-3 py-1 font-medium">Handling</th>
              </tr>
            </thead>
            <tbody>
              {signups.map((s) => {
                const isApproved = s.status === "approved";
                const isRejected = s.status === "rejected";
                const isPending = s.status === "pending";
                const isReviewing = s.status === "reviewing";

                const isBusy = mutatingId === s.id;

                return (
                  <tr
                    key={s.id}
                    className="align-top hover:bg-slate-900/60"
                  >
                    <td className="px-3 py-1.5">
                      <span
                        className={classNames(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                          statusClasses(s.status),
                        )}
                      >
                        {prettyStatus(s.status)}
                      </span>
                      {s.org_id && (
                        <div className="mt-1 text-[10px] text-emerald-300">
                          Org opprettet
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-1.5 text-slate-100">
                      <div className="text-xs font-medium">
                        {s.company_name || "Uten navn"}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Org.nr: {s.org_number || "–"}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        ID: {s.id}
                      </div>
                    </td>
                    <td className="px-3 py-1.5 text-slate-100">
                      <div className="text-xs">
                        {s.contact_name || "Ukjent kontakt"}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {s.contact_email || "ingen e-post"}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {s.contact_phone || "ingen telefon"}
                      </div>
                    </td>
                    <td className="px-3 py-1.5 text-slate-100">
                      {s.website_url ? (
                        <a
                          href={
                            s.website_url.startsWith("http")
                              ? s.website_url
                              : `https://${s.website_url}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-blue-300 hover:underline"
                        >
                          {s.website_url}
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-500">
                          Ingen URL
                        </span>
                      )}
                      <div className="mt-1 text-[10px] text-slate-400">
                        {s.has_website
                          ? "Har nettside"
                          : "Ingen nettside registrert"}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {s.wants_landing_page
                          ? "Ønsker LYXso-landingsside"
                          : "Har ikke bedt om LYXso-side"}
                      </div>
                    </td>
                    <td className="px-3 py-1.5 text-[11px] text-slate-200">
                      {s.notes ? (
                        <p className="max-w-xs whitespace-pre-wrap text-[11px]">
                          {s.notes}
                        </p>
                      ) : (
                        <span className="text-slate-500">
                          Ingen notater.
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-1.5 text-slate-300">
                      {formatDateTime(s.created_at)}
                    </td>
                    <td className="px-3 py-1.5">
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={() => void handleApprove(s.id)}
                          disabled={
                            authState !== "admin" ||
                            isBusy ||
                            isApproved ||
                            isRejected
                          }
                          className={classNames(
                            "rounded-md border px-2 py-0.5 text-[11px]",
                            isApproved
                              ? "border-emerald-500 bg-emerald-700/60 text-emerald-50 cursor-default"
                              : "border-emerald-600 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/30",
                            isBusy && mutatingAction === "approve"
                              ? "opacity-70"
                              : "",
                          )}
                        >
                          {isApproved
                            ? "Allerede godkjent"
                            : mutatingId === s.id &&
                                mutatingAction === "approve"
                              ? "Godkjenner..."
                              : "Godkjenn & opprett org"}
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleReject(s.id)}
                          disabled={
                            authState !== "admin" ||
                            isBusy ||
                            isRejected
                          }
                          className={classNames(
                            "rounded-md border px-2 py-0.5 text-[11px]",
                            isRejected
                              ? "border-red-500 bg-red-800/60 text-red-50 cursor-default"
                              : "border-red-600 bg-red-900/40 text-red-100 hover:bg-red-800/70",
                            isBusy && mutatingAction === "reject"
                              ? "opacity-70"
                              : "",
                          )}
                        >
                          {isRejected
                            ? "Avslått"
                            : mutatingId === s.id &&
                                mutatingAction === "reject"
                              ? "Avslår..."
                              : "Avslå forespørsel"}
                        </button>
                        {(isPending || isReviewing) && (
                          <span className="mt-0.5 text-[10px] text-slate-500">
                            {isPending
                              ? "Ny forespørsel – ta stilling."
                              : "Under vurdering – bestem deg senere."}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {!loading && signups.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-3 text-slate-500"
                  >
                    Ingen partner-forespørsler ennå. Når noen fyller ut
                    &quot;Bli partner&quot; vil de dukke opp her.
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-3 text-slate-500"
                  >
                    Laster forespørsler...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
