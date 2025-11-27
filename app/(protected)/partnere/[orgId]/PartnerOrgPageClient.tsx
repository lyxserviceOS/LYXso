"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

type OrgDetail = {
  id: string;
  created_at: string | null;
  updated_at: string | null;
  name: string | null;
  org_number: string | null;
  logo_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  is_active: boolean | null;
  plan: string | null;
};

type GetResponse = {
  org: OrgDetail;
};

type PatchBody = {
  name?: string;
  org_number?: string;
  plan?: string | null;
  is_active?: boolean;
};

const PLAN_OPTIONS: { value: string; label: string; description: string }[] = [
  {
    value: "free",
    label: "Gratis med reklame",
    description: "Begrenset funksjonalitet, reklamevisning.",
  },
  {
    value: "trial",
    label: "Prøveperiode (14 dager)",
    description: "Delvis full tilgang i 14 dager.",
  },
  {
    value: "paid",
    label: "Betalt plan",
    description: "Full tilgang til plattformen (standardplan).",
  },
];

export default function PartnerOrgPageClient() {
  const params = useParams<{ orgId: string }>();
  const orgId = params.orgId;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [org, setOrg] = useState<OrgDetail | null>(null);
  const [name, setName] = useState("");
  const [orgNumber, setOrgNumber] = useState("");
  const [plan, setPlan] = useState<string>("free");
  const [isActive, setIsActive] = useState(true);

  // Hent org-data
  useEffect(() => {
    let cancelled = false;

    async function loadOrg() {
      try {
        setLoading(true);
        setError(null);

        const base = API_BASE || "";
        const res = await fetch(`${base}/api/admin/orgs/${orgId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(
            `Kunne ikke hente organisasjon (status ${res.status})`,
          );
        }

        const json = (await res.json()) as GetResponse;
        if (cancelled) return;

        const o = json.org;
        setOrg(o);
        setName(o.name ?? "");
        setOrgNumber(o.org_number ?? "");
        setPlan(o.plan ?? "free");
        setIsActive(o.is_active ?? true);
      } catch (err: any) {
        if (!cancelled) {
          setError(
            err?.message ||
              "Uventet feil ved henting av organisasjonsdetaljer.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (orgId) {
      void loadOrg();
    } else {
      setLoading(false);
      setError("Mangler orgId i URL.");
    }

    return () => {
      cancelled = true;
    };
  }, [orgId]);

  async function handleSave() {
    try {
      setSaving(true);
      setError(null);
      setSaveMessage(null);

      const body: PatchBody = {
        name,
        org_number: orgNumber,
        plan,
        is_active: isActive,
      };

      const base = API_BASE || "";
      const res = await fetch(`${base}/api/admin/orgs/${orgId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error(
          `Kunne ikke lagre endringer (status ${res.status})`,
        );
      }

      const json = (await res.json()) as GetResponse;
      setOrg(json.org);
      setSaveMessage("Endringer lagret.");
    } catch (err: any) {
      setError(
        err?.message ||
          "Uventet feil ved lagring av organisasjonsdetaljer.",
      );
    } finally {
      setSaving(false);
    }
  }

  const createdAt =
    org?.created_at != null
      ? new Date(org.created_at).toLocaleString("nb-NO")
      : null;
  const updatedAt =
    org?.updated_at != null
      ? new Date(org.updated_at).toLocaleString("nb-NO")
      : null;

  return (
    <div className="flex h-full flex-col gap-6">
      {/* Breadcrumb + header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-1 text-xs text-slate-500">
            <Link
              href="/partnere"
              className="text-blue-400 hover:text-blue-300"
            >
              ← Tilbake til partnere
            </Link>
          </div>
          <h1 className="text-lg font-semibold text-slate-50">
            {org?.name || "Partner uten navn"}
          </h1>
          <p className="text-sm text-slate-400">
            Admin-visning for én organisasjon. Her styrer du plan,
            status og grunnleggende info.
          </p>
        </div>
      </div>

      {/* Meldinger */}
      {loading && (
        <div className="rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-300">
          Laster organisasjonsdata …
        </div>
      )}

      {error && !loading && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-100">
          {error}
        </div>
      )}

      {saveMessage && !error && (
        <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
          {saveMessage}
        </div>
      )}

      {!loading && !error && (
        <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          {/* Venstre: Redigerbar info */}
          <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <h2 className="text-sm font-semibold text-slate-100">
              Grunninformasjon
            </h2>

            <div className="space-y-3 text-sm">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">
                  Navn på bedriften
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm text-slate-50 outline-none focus:border-blue-500"
                  placeholder="F.eks. LYX Bilpleie AS"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">
                  Org.nr
                </label>
                <input
                  type="text"
                  value={orgNumber}
                  onChange={(e) => setOrgNumber(e.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm text-slate-50 outline-none focus:border-blue-500"
                  placeholder="9 sifre"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">
                  Plan
                </label>
                <select
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm text-slate-50 outline-none focus:border-blue-500"
                >
                  {PLAN_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-slate-400">
                  {
                    PLAN_OPTIONS.find((opt) => opt.value === plan)
                      ?.description
                  }
                </p>
              </div>

              <div className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950 px-3 py-2">
                <div>
                  <p className="text-xs font-medium text-slate-200">
                    Status
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Styrer om partneren er aktiv i LYXso.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsActive((v) => !v)}
                  className={[
                    "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium transition-colors",
                    isActive
                      ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-100"
                      : "border-slate-600 bg-slate-900 text-slate-300",
                  ].join(" ")}
                >
                  {isActive ? "Aktiv" : "Deaktivert"}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Lagrer …" : "Lagre endringer"}
              </button>
            </div>
          </div>

          {/* Høyre: Metadata */}
          <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm">
            <h2 className="text-sm font-semibold text-slate-100">
              Systeminfo
            </h2>
            <div className="space-y-2 text-xs text-slate-400">
              <div>
                <span className="font-semibold text-slate-300">
                  Org-ID:
                </span>{" "}
                <span className="break-all text-slate-400">
                  {org?.id}
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-300">
                  Opprettet:
                </span>{" "}
                {createdAt || "—"}
              </div>
              <div>
                <span className="font-semibold text-slate-300">
                  Sist oppdatert:
                </span>{" "}
                {updatedAt || "—"}
              </div>
              <div>
                <span className="font-semibold text-slate-300">
                  Nåværende plan:
                </span>{" "}
                {org?.plan ?? "—"}
              </div>
              <div>
                <span className="font-semibold text-slate-300">
                  Aktiv:
                </span>{" "}
                {org?.is_active ? "Ja" : "Nei"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
