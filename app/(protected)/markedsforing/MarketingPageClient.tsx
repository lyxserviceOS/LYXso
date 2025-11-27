// app/(protected)/markedsforing/MarketingPageClient.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useOrgPlan } from "@/lib/useOrgPlan";
import {
  getOrgPlanLabel,
  getOrgPlanPriceInfo,
  getOrgPlanShortInfo,
} from "@/lib/orgPlan";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

const ORG_ID =
  process.env.NEXT_PUBLIC_DEFAULT_ORG_ID ??
  process.env.NEXT_PUBLIC_ORG_ID ??
  "";

type ChannelKey = "meta" | "google" | "tiktok";

type ChannelState = {
  channel: ChannelKey;
  isConnected: boolean;
};

type ChannelsResponse = {
  channels: ChannelState[];
};

type StatsRow = {
  id: string;
  channel: ChannelKey;
  date: string;
  impressions: number | null;
  clicks: number | null;
  leads: number | null;
  bookings: number | null;
  spend: number | null;
  currency: string | null;
};

type StatsResponse = {
  stats: StatsRow[];
};

const CHANNEL_CONFIG: Record<
  ChannelKey,
  { label: string; description: string; comingSoon?: boolean }
> = {
  meta: {
    label: "Meta (Facebook / Instagram)",
    description:
      "Koble til Meta Business / Ads Manager for å hente kampanjer og statistikk.",
  },
  google: {
    label: "Google Ads",
    description:
      "Fremtidig integrasjon mot Google Ads for søk, Performance Max og Display.",
    comingSoon: true,
  },
  tiktok: {
    label: "TikTok Ads",
    description:
      "Planlagt støtte for TikTok-kampanjer og målgruppeanalyse.",
    comingSoon: true,
  },
};

export default function MarketingPageClient() {
  const searchParams = useSearchParams();
  const {
    loading: planLoading,
    error: planError,
    plan,
    features,
  } = useOrgPlan();

  const [channels, setChannels] = useState<ChannelState[]>([]);
  const [channelsLoading, setChannelsLoading] = useState(false);
  const [channelsError, setChannelsError] = useState<string | null>(null);

  const [stats, setStats] = useState<StatsRow[]>([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const metaJustConnected = searchParams?.get("meta") === "connected";
  const hasAiMarketingFeature = !!features.aiMarketing;

  // --------------------------------------------------------
  // Laste kanalstatus og stats
  // --------------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    async function loadChannels() {
      if (!ORG_ID) {
        setChannelsError(
          "Mangler org-id i frontend (.env NEXT_PUBLIC_DEFAULT_ORG_ID / NEXT_PUBLIC_ORG_ID).",
        );
        return;
      }

      try {
        setChannelsLoading(true);
        setChannelsError(null);

        const res = await fetch(
          `${API_BASE_URL}/api/orgs/${encodeURIComponent(
            ORG_ID,
          )}/marketing/channels`,
          { cache: "no-store" },
        );

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(
            text || `Feil fra API (${res.status} ${res.statusText})`,
          );
        }

        const json = (await res.json()) as ChannelsResponse;
        if (!cancelled) {
          setChannels(json.channels ?? []);
        }
      } catch (err: any) {
        if (!cancelled) {
          setChannelsError(
            err?.message ??
              "Ukjent feil ved henting av markedsføringskanaler.",
          );
        }
      } finally {
        if (!cancelled) {
          setChannelsLoading(false);
        }
      }
    }

    async function loadStats() {
      if (!ORG_ID) {
        setStatsError(
          "Mangler org-id i frontend (.env NEXT_PUBLIC_DEFAULT_ORG_ID / NEXT_PUBLIC_ORG_ID).",
        );
        return;
      }

      try {
        setStatsLoading(true);
        setStatsError(null);

        const res = await fetch(
          `${API_BASE_URL}/api/orgs/${encodeURIComponent(
            ORG_ID,
          )}/marketing/stats`,
          { cache: "no-store" },
        );

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(
            text || `Feil fra API (${res.status} ${res.statusText})`,
          );
        }

        const json = (await res.json()) as StatsResponse;
        if (!cancelled) {
          setStats(json.stats ?? []);
        }
      } catch (err: any) {
        if (!cancelled) {
          setStatsError(
            err?.message ??
              "Ukjent feil ved henting av kampanjestatistikk.",
          );
        }
      } finally {
        if (!cancelled) {
          setStatsLoading(false);
        }
      }
    }

    loadChannels();
    loadStats();

    return () => {
      cancelled = true;
    };
  }, []);

  // --------------------------------------------------------
  // Håndtering av kanaler
  // --------------------------------------------------------

  async function handleToggleChannel(channel: ChannelKey, next: boolean) {
    if (!ORG_ID) {
      alert(
        "Mangler org-id i frontend (.env NEXT_PUBLIC_DEFAULT_ORG_ID / NEXT_PUBLIC_ORG_ID).",
      );
      return;
    }

    try {
      setActionMessage(null);
      setChannelsError(null);

      const res = await fetch(
        `${API_BASE_URL}/api/orgs/${encodeURIComponent(
          ORG_ID,
        )}/marketing/channels`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ channel, isConnected: next }),
        },
      );

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(
          text || `Feil fra API (${res.status} ${res.statusText})`,
        );
      }

      const json = (await res.json()) as ChannelsResponse;
      setChannels(json.channels ?? []);

      setActionMessage(
        next
          ? `Kanal "${CHANNEL_CONFIG[channel].label}" er aktivert.`
          : `Kanal "${CHANNEL_CONFIG[channel].label}" er deaktivert.`,
      );
    } catch (err: any) {
      setChannelsError(
        err?.message ?? "Klarte ikke å oppdatere kanalstatus.",
      );
    }
  }

  function handleConnectMeta() {
    if (!ORG_ID) {
      alert(
        "Mangler org-id i frontend (.env NEXT_PUBLIC_DEFAULT_ORG_ID / NEXT_PUBLIC_ORG_ID).",
      );
      return;
    }

    if (!hasAiMarketingFeature) {
      alert(
        "AI-markedsføring og Meta-integrasjon er ikke aktivert på din nåværende plan. Gå til /plan for å oppgradere.",
      );
      return;
    }

    // Vi lar backend lage state + redirect til Meta
    window.location.href = `${API_BASE_URL}/api/orgs/${encodeURIComponent(
      ORG_ID,
    )}/marketing/meta/connect`;
  }

  async function handleDisconnectMeta() {
    await handleToggleChannel("meta", false);
  }

  // --------------------------------------------------------
  // Aggregert Meta-statistikk
  // --------------------------------------------------------

  const metaStats = stats.filter((s) => s.channel === "meta");

  const metaTotals = metaStats.reduce(
    (acc, row) => {
      acc.impressions += row.impressions ?? 0;
      acc.clicks += row.clicks ?? 0;
      acc.leads += row.leads ?? 0;
      acc.bookings += row.bookings ?? 0;
      acc.spend += row.spend ?? 0;
      return acc;
    },
    {
      impressions: 0,
      clicks: 0,
      leads: 0,
      bookings: 0,
      spend: 0,
    },
  );

  const metaCTR =
    metaTotals.impressions > 0
      ? (metaTotals.clicks / metaTotals.impressions) * 100
      : null;

  const metaCPL =
    metaTotals.leads > 0 ? metaTotals.spend / metaTotals.leads : null;
  const metaCPB =
    metaTotals.bookings > 0 ? metaTotals.spend / metaTotals.bookings : null;

  const metaCurrency =
    metaStats.find((s) => s.currency)?.currency ?? "NOK";

  // Hjelper for å slå opp status for en kanal
  function getChannelState(key: ChannelKey): ChannelState {
    const found = channels.find((c) => c.channel === key);
    return { channel: key, isConnected: found?.isConnected ?? false };
  }

  const metaChannelState = getChannelState("meta");

  // --------------------------------------------------------
  // RENDER
  // --------------------------------------------------------

  return (
    <div className="h-full w-full overflow-y-auto px-6 py-6">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* HEADER */}
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
            Markedsføring & kampanjer
          </h1>
          <p className="text-sm text-slate-400">
            Koble LYXso til markedsføringskanaler som Meta for å få
            kampanjestatistikk, forslag og senere fullautomatisert
            LYXba-markedsføring.
          </p>
        </header>

        {/* PLAN-STATUS */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          {planLoading && (
            <p className="text-sm text-slate-300">
              Henter organisasjonsplan …
            </p>
          )}

          {planError && (
            <p className="text-sm text-red-400">
              Klarte ikke å hente plan: {planError}
            </p>
          )}

          {!planLoading && !planError && (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Din LYXso-plan
                </p>
                <p className="text-lg font-semibold text-slate-50">
                  {getOrgPlanLabel(plan)}
                </p>
                <p className="text-xs text-slate-400">
                  {getOrgPlanShortInfo(plan)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Pris
                </p>
                <p className="text-sm font-semibold text-slate-50">
                  {getOrgPlanPriceInfo(plan)}
                </p>
                <Link
                  href="/plan"
                  className="mt-2 inline-flex items-center rounded-md border border-blue-500/60 bg-blue-600/10 px-3 py-1.5 text-xs font-medium text-blue-200 hover:bg-blue-600/20"
                >
                  Se / endre plan
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* INFO OM GATING */}
        {!planLoading && !planError && !hasAiMarketingFeature && (
          <section className="rounded-xl border border-yellow-500/40 bg-yellow-500/10 p-4 text-xs text-yellow-50">
            <p className="font-semibold">
              AI-markedsføring og annonseintegrasjoner er begrenset på din
              nåværende plan.
            </p>
            <p className="mt-1">
              For full Meta-integrasjon, automatiske kampanjer og LYXba
              Booking Agent må du ha{" "}
              <span className="font-semibold">Prøveperiode</span> eller{" "}
              <span className="font-semibold">Betalt</span> plan.
            </p>
          </section>
        )}

        {/* STATUSMELDINGER */}
        {metaJustConnected && (
          <div className="rounded-xl border border-emerald-600/60 bg-emerald-900/40 px-4 py-3 text-xs text-emerald-100">
            Meta-konto er nå koblet til LYXso. Vi bruker tokenet til å hente
            kampanjedata (og senere LYXba-automatisering).
          </div>
        )}

        {actionMessage && (
          <div className="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-xs text-slate-200">
            {actionMessage}
          </div>
        )}

        {channelsError && (
          <div className="rounded-xl border border-red-700 bg-red-950/60 px-4 py-3 text-xs text-red-200">
            {channelsError}
          </div>
        )}

        {statsError && (
          <div className="rounded-xl border border-red-700 bg-red-950/60 px-4 py-3 text-xs text-red-200">
            {statsError}
          </div>
        )}

        {/* KANALER */}
        <section className="space-y-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                Kanaler & tilkoblinger
              </h2>
              <p className="text-xs text-slate-400">
                Start med Meta. Google Ads og TikTok kommer i neste versjon.
              </p>
            </div>
            {channelsLoading && (
              <p className="text-[11px] text-slate-500">
                Laster kanalstatus …
              </p>
            )}
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {/* META-KANAL */}
            <ChannelCard
              label={CHANNEL_CONFIG.meta.label}
              description={CHANNEL_CONFIG.meta.description}
              isConnected={metaChannelState.isConnected}
              primaryActionLabel={
                metaChannelState.isConnected
                  ? "Koble fra Meta"
                  : "Koble til Meta"
              }
              onPrimaryAction={
                metaChannelState.isConnected
                  ? handleDisconnectMeta
                  : handleConnectMeta
              }
              badge={
                metaChannelState.isConnected ? "Tilkoblet" : "Ikke tilkoblet"
              }
              badgeVariant={
                metaChannelState.isConnected ? "success" : "default"
              }
              disabledPrimary={!hasAiMarketingFeature}
              extra={
                metaChannelState.isConnected ? (
                  <p className="mt-2 text-[11px] text-slate-400">
                    Vi lagrer en sikker access token i Supabase for din org.
                    Senere kan du aktivere full LYXba-automatisering på denne
                    kontoen.
                  </p>
                ) : (
                  <p className="mt-2 text-[11px] text-slate-500">
                    Når du kobler til, sendes du til Meta for å gi LYXso
                    tilgang til kampanjedata. Du kan når som helst koble fra
                    igjen.
                  </p>
                )
              }
            />

            {/* GOOGLE */}
            <ChannelCard
              label={CHANNEL_CONFIG.google.label}
              description={CHANNEL_CONFIG.google.description}
              isConnected={false}
              primaryActionLabel="Kommer snart"
              onPrimaryAction={undefined}
              disabledPrimary={true}
              badge="Snart"
              badgeVariant="muted"
            />

            {/* TIKTOK */}
            <ChannelCard
              label={CHANNEL_CONFIG.tiktok.label}
              description={CHANNEL_CONFIG.tiktok.description}
              isConnected={false}
              primaryActionLabel="Kommer snart"
              onPrimaryAction={undefined}
              disabledPrimary={true}
              badge="Snart"
              badgeVariant="muted"
            />
          </div>
        </section>

        {/* META-STATS */}
        <section className="space-y-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                Meta – oversikt (intern demo)
              </h2>
              <p className="text-xs text-slate-400">
                Vi viser her en enkel sammenstilling av det som ligger i
                tabellen{" "}
                <code className="font-mono text-[11px]">
                  org_marketing_stats
                </code>{" "}
                for kanalen <code className="font-mono text-[11px]">meta</code>
                . I neste steg kan vi koble dette mot ekte Meta-innsikt.
              </p>
            </div>
            {statsLoading && (
              <p className="text-[11px] text-slate-500">
                Laster kampanjestatistikk …
              </p>
            )}
          </div>

          {metaStats.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-xs text-slate-400">
              Ingen statistikk registrert for Meta ennå. Du kan fylle inn
              testdata via APIet{" "}
              <code className="font-mono text-[11px]">
                POST /api/orgs/:orgId/marketing/stats
              </code>{" "}
              eller senere via automatisk synk fra Meta.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              <MetricCard
                label="Visninger (Meta)"
                value={metaTotals.impressions.toLocaleString("nb-NO")}
              />
              <MetricCard
                label="Klikk (Meta)"
                value={metaTotals.clicks.toLocaleString("nb-NO")}
              />
              <MetricCard
                label="Leads (Meta)"
                value={metaTotals.leads.toLocaleString("nb-NO")}
              />
              <MetricCard
                label="Bookinger (Meta)"
                value={metaTotals.bookings.toLocaleString("nb-NO")}
              />
              <MetricCard
                label={`Forbruk (${metaCurrency})`}
                value={metaTotals.spend.toLocaleString("nb-NO", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              />
              <MetricCard
                label="CTR (Meta)"
                value={
                  metaCTR !== null
                    ? `${metaCTR.toFixed(1)} %`
                    : "CTR ikke tilgjengelig"
                }
              />
              <MetricCard
                label={`Kost per lead (${metaCurrency})`}
                value={
                  metaCPL !== null
                    ? metaCPL.toFixed(2)
                    : "Ingen leads registrert"
                }
              />
              <MetricCard
                label={`Kost per booking (${metaCurrency})`}
                value={
                  metaCPB !== null
                    ? metaCPB.toFixed(2)
                    : "Ingen bookinger registrert"
                }
              />
            </div>
          )}
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-[11px] text-slate-500">
          <p>
            Merk: Dette er første versjon av markedsføringsmodulen. Ekte
            Meta-synk (per kampanje / adset) og full LYXba-styring av
            kampanjer bygges oppå denne strukturen.
          </p>
        </section>
      </div>
    </div>
  );
}

// --------------------------------------------------------
// UI-komponenter
// --------------------------------------------------------

type ChannelCardProps = {
  label: string;
  description: string;
  isConnected: boolean;
  primaryActionLabel: string;
  onPrimaryAction?: () => void;
  disabledPrimary?: boolean;
  badge?: string;
  badgeVariant?: "success" | "default" | "muted";
  extra?: React.ReactNode;
};

function ChannelCard({
  label,
  description,
  isConnected,
  primaryActionLabel,
  onPrimaryAction,
  disabledPrimary,
  badge,
  badgeVariant = "default",
  extra,
}: ChannelCardProps) {
  const badgeClasses =
    badgeVariant === "success"
      ? "bg-emerald-500/10 text-emerald-200 border-emerald-500/40"
      : badgeVariant === "muted"
      ? "bg-slate-800 text-slate-400 border-slate-700"
      : "bg-slate-900 text-slate-300 border-slate-700";

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-4">
      <div>
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-100">{label}</h3>
          {badge && (
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${badgeClasses}`}
            >
              {badge}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-slate-400">{description}</p>
        {extra}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-[11px] text-slate-500">
          Status:{" "}
          <span className="font-semibold text-slate-200">
            {isConnected ? "Tilkoblet" : "Ikke tilkoblet"}
          </span>
        </p>
        <button
          type="button"
          onClick={onPrimaryAction}
          disabled={disabledPrimary || !onPrimaryAction}
          className={[
            "inline-flex items-center rounded-md px-3 py-1.5 text-[11px] font-medium",
            disabledPrimary || !onPrimaryAction
              ? "cursor-not-allowed border border-slate-700 bg-slate-900 text-slate-500"
              : "border border-blue-500/60 bg-blue-600/10 text-blue-100 hover:bg-blue-600/20",
          ].join(" ")}
        >
          {primaryActionLabel}
        </button>
      </div>
    </div>
  );
}

type MetricCardProps = {
  label: string;
  value: string;
};

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-3">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-100">{value}</p>
    </div>
  );
}
