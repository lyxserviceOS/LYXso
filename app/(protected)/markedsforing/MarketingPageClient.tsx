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

// Campaign types for Module 17
type CampaignStatus = 'active' | 'paused' | 'completed' | 'draft';

type Campaign = {
  id: string;
  name: string;
  channel: ChannelKey;
  status: CampaignStatus;
  startDate: string;
  endDate?: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  leads: number;
  bookings: number;
  revenue: number;
  currency: string;
};

// Mock campaigns for demo
const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-1',
    name: 'Sommerdekkskift 2024',
    channel: 'meta',
    status: 'active',
    startDate: '2024-03-01',
    endDate: '2024-05-31',
    budget: 15000,
    spent: 8420,
    impressions: 45000,
    clicks: 1250,
    leads: 85,
    bookings: 42,
    revenue: 84000,
    currency: 'NOK'
  },
  {
    id: 'camp-2',
    name: 'Coating tilbud Q2',
    channel: 'meta',
    status: 'active',
    startDate: '2024-04-01',
    endDate: '2024-06-30',
    budget: 25000,
    spent: 12300,
    impressions: 68000,
    clicks: 1890,
    leads: 120,
    bookings: 28,
    revenue: 140000,
    currency: 'NOK'
  },
  {
    id: 'camp-3',
    name: 'Vårrengjøring kampanje',
    channel: 'meta',
    status: 'paused',
    startDate: '2024-02-15',
    endDate: '2024-04-15',
    budget: 8000,
    spent: 8000,
    impressions: 32000,
    clicks: 890,
    leads: 45,
    bookings: 18,
    revenue: 27000,
    currency: 'NOK'
  },
  {
    id: 'camp-4',
    name: 'Google Ads - Lokalsøk',
    channel: 'google',
    status: 'draft',
    startDate: '2024-05-01',
    budget: 10000,
    spent: 0,
    impressions: 0,
    clicks: 0,
    leads: 0,
    bookings: 0,
    revenue: 0,
    currency: 'NOK'
  },
  {
    id: 'camp-5',
    name: 'Vinterdekkhotell 2023',
    channel: 'meta',
    status: 'completed',
    startDate: '2023-09-01',
    endDate: '2023-11-30',
    budget: 12000,
    spent: 11800,
    impressions: 52000,
    clicks: 1450,
    leads: 95,
    bookings: 56,
    revenue: 67200,
    currency: 'NOK'
  }
];

// Recent bookings with campaign attribution
type BookingAttribution = {
  id: string;
  customerName: string;
  service: string;
  date: string;
  amount: number;
  campaign?: string;
  source: 'meta' | 'google' | 'organic' | 'referral' | 'direct';
};

const MOCK_ATTRIBUTED_BOOKINGS: BookingAttribution[] = [
  { id: 'b1', customerName: 'Ole Hansen', service: 'Dekkskift', date: '2024-10-15', amount: 1200, campaign: 'Sommerdekkskift 2024', source: 'meta' },
  { id: 'b2', customerName: 'Kari Nordmann', service: 'Coating Premium', date: '2024-10-14', amount: 5000, campaign: 'Coating tilbud Q2', source: 'meta' },
  { id: 'b3', customerName: 'Erik Larsen', service: 'Polering', date: '2024-10-14', amount: 2500, source: 'organic' },
  { id: 'b4', customerName: 'Anna Berg', service: 'Dekkhotell', date: '2024-10-13', amount: 800, campaign: 'Sommerdekkskift 2024', source: 'meta' },
  { id: 'b5', customerName: 'Per Olsen', service: 'Coating Basic', date: '2024-10-13', amount: 3500, source: 'referral' },
  { id: 'b6', customerName: 'Lisa Johansen', service: 'Innvendig vask', date: '2024-10-12', amount: 1500, source: 'direct' },
  { id: 'b7', customerName: 'Martin Svendsen', service: 'Dekkskift + lagring', date: '2024-10-12', amount: 1800, campaign: 'Sommerdekkskift 2024', source: 'meta' },
];

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

  // Module 17: Campaign and attribution state
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [attributedBookings] = useState<BookingAttribution[]>(MOCK_ATTRIBUTED_BOOKINGS);
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'attribution'>('overview');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [campaignFilter, setCampaignFilter] = useState<CampaignStatus | 'all'>('all');

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
  // Module 17: Campaign calculations
  // --------------------------------------------------------

  // Filter campaigns by status
  const filteredCampaigns = campaignFilter === 'all' 
    ? campaigns 
    : campaigns.filter(c => c.status === campaignFilter);

  // This month's summary from active campaigns
  const thisMonthSummary = campaigns
    .filter(c => c.status === 'active')
    .reduce(
      (acc, c) => {
        acc.spend += c.spent;
        acc.leads += c.leads;
        acc.bookings += c.bookings;
        acc.revenue += c.revenue;
        return acc;
      },
      { spend: 0, leads: 0, bookings: 0, revenue: 0 }
    );

  const costPerBooking = thisMonthSummary.bookings > 0 
    ? thisMonthSummary.spend / thisMonthSummary.bookings 
    : 0;
  
  const overallROI = thisMonthSummary.spend > 0 
    ? ((thisMonthSummary.revenue - thisMonthSummary.spend) / thisMonthSummary.spend) * 100 
    : 0;

  // Calculate ROI for a campaign
  function calculateROI(campaign: Campaign): number {
    if (campaign.spent === 0) return 0;
    return ((campaign.revenue - campaign.spent) / campaign.spent) * 100;
  }

  // Attribution summary
  const attributionSummary = {
    meta: attributedBookings.filter(b => b.source === 'meta').length,
    google: attributedBookings.filter(b => b.source === 'google').length,
    organic: attributedBookings.filter(b => b.source === 'organic').length,
    referral: attributedBookings.filter(b => b.source === 'referral').length,
    direct: attributedBookings.filter(b => b.source === 'direct').length,
  };

  const totalAttributed = Object.values(attributionSummary).reduce((a, b) => a + b, 0);

  // Toggle campaign status
  function toggleCampaignStatus(campaignId: string) {
    setCampaigns(prev => prev.map(c => {
      if (c.id === campaignId) {
        return {
          ...c,
          status: c.status === 'active' ? 'paused' : c.status === 'paused' ? 'active' : c.status
        };
      }
      return c;
    }));
  }

  // --------------------------------------------------------
  // RENDER
  // --------------------------------------------------------

  return (
    <div className="h-full w-full overflow-y-auto px-6 py-6">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* HEADER */}
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
            Markedsføring & kampanjer
          </h1>
          <p className="text-sm text-slate-400">
            Koble LYXso til markedsføringskanaler som Meta for å få
            kampanjestatistikk, ROI-analyse og attribusjon av bookinger.
          </p>
        </header>

        {/* THIS MONTH SUMMARY - Module 17 requirement */}
        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-gradient-to-br from-blue-950/50 to-slate-950 p-4">
            <p className="text-xs text-slate-400">Ad-spend denne måneden</p>
            <p className="text-2xl font-bold text-slate-50">
              {thisMonthSummary.spend.toLocaleString('nb-NO')} <span className="text-sm font-normal text-slate-400">NOK</span>
            </p>
            <p className="mt-1 text-[11px] text-slate-500">Fra aktive kampanjer</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-gradient-to-br from-purple-950/50 to-slate-950 p-4">
            <p className="text-xs text-slate-400">Leads</p>
            <p className="text-2xl font-bold text-slate-50">{thisMonthSummary.leads}</p>
            <p className="mt-1 text-[11px] text-slate-500">
              {thisMonthSummary.leads > 0 && thisMonthSummary.spend > 0 
                ? `${(thisMonthSummary.spend / thisMonthSummary.leads).toFixed(0)} kr/lead`
                : '-'}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-gradient-to-br from-emerald-950/50 to-slate-950 p-4">
            <p className="text-xs text-slate-400">Bookinger</p>
            <p className="text-2xl font-bold text-slate-50">{thisMonthSummary.bookings}</p>
            <p className="mt-1 text-[11px] text-slate-500">
              {costPerBooking > 0 ? `${costPerBooking.toFixed(0)} kr/booking` : '-'}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-gradient-to-br from-amber-950/50 to-slate-950 p-4">
            <p className="text-xs text-slate-400">Total ROI</p>
            <p className={`text-2xl font-bold ${overallROI >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {overallROI >= 0 ? '+' : ''}{overallROI.toFixed(0)}%
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              {thisMonthSummary.revenue.toLocaleString('nb-NO')} kr omsetning
            </p>
          </div>
        </section>

        {/* TABS */}
        <div className="flex gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
              activeTab === 'overview' 
                ? 'bg-slate-800 text-slate-100' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Oversikt
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
              activeTab === 'campaigns' 
                ? 'bg-slate-800 text-slate-100' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Kampanjer ({campaigns.length})
          </button>
          <button
            onClick={() => setActiveTab('attribution')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
              activeTab === 'attribution' 
                ? 'bg-slate-800 text-slate-100' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Attribusjon
          </button>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <>
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
          </>
        )}

        {/* CAMPAIGNS TAB - Module 17 requirement */}
        {activeTab === 'campaigns' && (
          <section className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-100">
                  Kampanjer
                </h2>
                <p className="text-xs text-slate-400">
                  Oversikt over alle kampanjer med status, kanal og ROI-indikator.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={campaignFilter}
                  onChange={(e) => setCampaignFilter(e.target.value as CampaignStatus | 'all')}
                  className="rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200"
                >
                  <option value="all">Alle statuser</option>
                  <option value="active">Aktive</option>
                  <option value="paused">Pausert</option>
                  <option value="completed">Fullført</option>
                  <option value="draft">Utkast</option>
                </select>
                <button className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700">
                  + Ny kampanje
                </button>
              </div>
            </div>

            {/* Campaign list */}
            <div className="overflow-hidden rounded-xl border border-slate-800">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-800 bg-slate-900/60">
                  <tr>
                    <th className="px-4 py-3 text-xs font-medium text-slate-400">Kampanje</th>
                    <th className="px-4 py-3 text-xs font-medium text-slate-400">Kanal</th>
                    <th className="px-4 py-3 text-xs font-medium text-slate-400">Status</th>
                    <th className="px-4 py-3 text-xs font-medium text-slate-400 text-right">Forbruk</th>
                    <th className="px-4 py-3 text-xs font-medium text-slate-400 text-right">Leads</th>
                    <th className="px-4 py-3 text-xs font-medium text-slate-400 text-right">Bookinger</th>
                    <th className="px-4 py-3 text-xs font-medium text-slate-400 text-right">ROI</th>
                    <th className="px-4 py-3 text-xs font-medium text-slate-400">Handling</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredCampaigns.map((campaign) => {
                    const roi = calculateROI(campaign);
                    return (
                      <tr 
                        key={campaign.id} 
                        className="bg-slate-950/50 hover:bg-slate-900/50 cursor-pointer"
                        onClick={() => setSelectedCampaign(campaign)}
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-100">{campaign.name}</p>
                          <p className="text-[11px] text-slate-500">
                            {campaign.startDate} {campaign.endDate ? `→ ${campaign.endDate}` : '→ pågår'}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            campaign.channel === 'meta' 
                              ? 'bg-blue-500/20 text-blue-300' 
                              : campaign.channel === 'google'
                              ? 'bg-red-500/20 text-red-300'
                              : 'bg-slate-700 text-slate-300'
                          }`}>
                            {campaign.channel === 'meta' ? 'Meta' : campaign.channel === 'google' ? 'Google' : 'TikTok'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            campaign.status === 'active' 
                              ? 'bg-emerald-500/20 text-emerald-300' 
                              : campaign.status === 'paused'
                              ? 'bg-yellow-500/20 text-yellow-300'
                              : campaign.status === 'completed'
                              ? 'bg-slate-600/20 text-slate-300'
                              : 'bg-slate-700/20 text-slate-400'
                          }`}>
                            {campaign.status === 'active' ? '● Aktiv' 
                              : campaign.status === 'paused' ? '⏸ Pausert' 
                              : campaign.status === 'completed' ? '✓ Fullført'
                              : '○ Utkast'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-slate-200">
                          {campaign.spent.toLocaleString('nb-NO')} kr
                          <span className="block text-[10px] text-slate-500">
                            av {campaign.budget.toLocaleString('nb-NO')} kr
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-slate-200">{campaign.leads}</td>
                        <td className="px-4 py-3 text-right text-slate-200">{campaign.bookings}</td>
                        <td className="px-4 py-3 text-right">
                          <ROIIndicator roi={roi} />
                        </td>
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          {(campaign.status === 'active' || campaign.status === 'paused') && (
                            <button
                              onClick={() => toggleCampaignStatus(campaign.id)}
                              className={`rounded px-2 py-1 text-[10px] font-medium ${
                                campaign.status === 'active'
                                  ? 'bg-yellow-600/20 text-yellow-300 hover:bg-yellow-600/30'
                                  : 'bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30'
                              }`}
                            >
                              {campaign.status === 'active' ? 'Pause' : 'Start'}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Campaign detail modal */}
            {selectedCampaign && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                <div className="w-full max-w-2xl rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-100">{selectedCampaign.name}</h3>
                      <p className="text-sm text-slate-400">
                        {CHANNEL_CONFIG[selectedCampaign.channel].label}
                      </p>
                    </div>
                    <button 
                      onClick={() => setSelectedCampaign(null)}
                      className="text-slate-400 hover:text-slate-200"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="rounded-lg bg-slate-800/50 p-3">
                      <p className="text-[11px] text-slate-400">Budget</p>
                      <p className="text-lg font-semibold text-slate-100">
                        {selectedCampaign.budget.toLocaleString('nb-NO')} kr
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-800/50 p-3">
                      <p className="text-[11px] text-slate-400">Brukt</p>
                      <p className="text-lg font-semibold text-slate-100">
                        {selectedCampaign.spent.toLocaleString('nb-NO')} kr
                      </p>
                      <div className="mt-1 h-1.5 rounded-full bg-slate-700">
                        <div 
                          className="h-full rounded-full bg-blue-500"
                          style={{ width: `${Math.min(100, (selectedCampaign.spent / selectedCampaign.budget) * 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="rounded-lg bg-slate-800/50 p-3">
                      <p className="text-[11px] text-slate-400">Omsetning</p>
                      <p className="text-lg font-semibold text-emerald-400">
                        {selectedCampaign.revenue.toLocaleString('nb-NO')} kr
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-800/50 p-3">
                      <p className="text-[11px] text-slate-400">ROI</p>
                      <p className={`text-lg font-semibold ${calculateROI(selectedCampaign) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {calculateROI(selectedCampaign) >= 0 ? '+' : ''}{calculateROI(selectedCampaign).toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-4 gap-4">
                    <div className="rounded-lg bg-slate-800/30 p-3 text-center">
                      <p className="text-2xl font-bold text-slate-100">{selectedCampaign.impressions.toLocaleString('nb-NO')}</p>
                      <p className="text-[11px] text-slate-400">Visninger</p>
                    </div>
                    <div className="rounded-lg bg-slate-800/30 p-3 text-center">
                      <p className="text-2xl font-bold text-slate-100">{selectedCampaign.clicks.toLocaleString('nb-NO')}</p>
                      <p className="text-[11px] text-slate-400">Klikk</p>
                    </div>
                    <div className="rounded-lg bg-slate-800/30 p-3 text-center">
                      <p className="text-2xl font-bold text-slate-100">{selectedCampaign.leads}</p>
                      <p className="text-[11px] text-slate-400">Leads</p>
                    </div>
                    <div className="rounded-lg bg-slate-800/30 p-3 text-center">
                      <p className="text-2xl font-bold text-slate-100">{selectedCampaign.bookings}</p>
                      <p className="text-[11px] text-slate-400">Bookinger</p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-2">
                    <button 
                      onClick={() => setSelectedCampaign(null)}
                      className="rounded-md border border-slate-600 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
                    >
                      Lukk
                    </button>
                    <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                      Rediger kampanje
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ATTRIBUTION TAB - Module 17 requirement */}
        {activeTab === 'attribution' && (
          <section className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                Booking-attribusjon
              </h2>
              <p className="text-xs text-slate-400">
                Se hvilke kampanjer som genererer bookinger og hvor kundene kommer fra.
              </p>
            </div>

            {/* Attribution summary */}
            <div className="grid gap-4 md:grid-cols-5">
              <div className="rounded-xl border border-blue-500/30 bg-blue-950/30 p-4 text-center">
                <p className="text-2xl font-bold text-blue-300">{attributionSummary.meta}</p>
                <p className="text-xs text-slate-400">Meta</p>
                <p className="text-[10px] text-slate-500">
                  {totalAttributed > 0 ? `${((attributionSummary.meta / totalAttributed) * 100).toFixed(0)}%` : '0%'}
                </p>
              </div>
              <div className="rounded-xl border border-red-500/30 bg-red-950/30 p-4 text-center">
                <p className="text-2xl font-bold text-red-300">{attributionSummary.google}</p>
                <p className="text-xs text-slate-400">Google</p>
                <p className="text-[10px] text-slate-500">
                  {totalAttributed > 0 ? `${((attributionSummary.google / totalAttributed) * 100).toFixed(0)}%` : '0%'}
                </p>
              </div>
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-4 text-center">
                <p className="text-2xl font-bold text-emerald-300">{attributionSummary.organic}</p>
                <p className="text-xs text-slate-400">Organisk</p>
                <p className="text-[10px] text-slate-500">
                  {totalAttributed > 0 ? `${((attributionSummary.organic / totalAttributed) * 100).toFixed(0)}%` : '0%'}
                </p>
              </div>
              <div className="rounded-xl border border-purple-500/30 bg-purple-950/30 p-4 text-center">
                <p className="text-2xl font-bold text-purple-300">{attributionSummary.referral}</p>
                <p className="text-xs text-slate-400">Referanse</p>
                <p className="text-[10px] text-slate-500">
                  {totalAttributed > 0 ? `${((attributionSummary.referral / totalAttributed) * 100).toFixed(0)}%` : '0%'}
                </p>
              </div>
              <div className="rounded-xl border border-slate-500/30 bg-slate-800/30 p-4 text-center">
                <p className="text-2xl font-bold text-slate-300">{attributionSummary.direct}</p>
                <p className="text-xs text-slate-400">Direkte</p>
                <p className="text-[10px] text-slate-500">
                  {totalAttributed > 0 ? `${((attributionSummary.direct / totalAttributed) * 100).toFixed(0)}%` : '0%'}
                </p>
              </div>
            </div>

            {/* Recent attributed bookings */}
            <div className="rounded-xl border border-slate-800 overflow-hidden">
              <div className="border-b border-slate-800 bg-slate-900/60 px-4 py-3">
                <h3 className="text-sm font-medium text-slate-200">Siste bookinger med attribusjon</h3>
              </div>
              <div className="divide-y divide-slate-800">
                {attributedBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between px-4 py-3 bg-slate-950/50 hover:bg-slate-900/50">
                    <div className="flex items-center gap-4">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium ${
                        booking.source === 'meta' ? 'bg-blue-500/20 text-blue-300' :
                        booking.source === 'google' ? 'bg-red-500/20 text-red-300' :
                        booking.source === 'organic' ? 'bg-emerald-500/20 text-emerald-300' :
                        booking.source === 'referral' ? 'bg-purple-500/20 text-purple-300' :
                        'bg-slate-600/20 text-slate-300'
                      }`}>
                        {booking.source === 'meta' ? 'M' :
                         booking.source === 'google' ? 'G' :
                         booking.source === 'organic' ? 'O' :
                         booking.source === 'referral' ? 'R' : 'D'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-100">{booking.customerName}</p>
                        <p className="text-[11px] text-slate-400">{booking.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-200">{booking.amount.toLocaleString('nb-NO')} kr</p>
                      <p className="text-[11px] text-slate-500">{booking.date}</p>
                    </div>
                    <div className="text-right min-w-[140px]">
                      {booking.campaign ? (
                        <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-300">
                          📣 {booking.campaign}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500">Ingen kampanje</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

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

// ROI Indicator component for Module 17
type ROIIndicatorProps = {
  roi: number;
};

function ROIIndicator({ roi }: ROIIndicatorProps) {
  let bgClass = 'bg-slate-700/50';
  let textClass = 'text-slate-400';
  let label = '—';

  if (roi > 100) {
    bgClass = 'bg-emerald-500/20';
    textClass = 'text-emerald-300';
    label = `+${roi.toFixed(0)}%`;
  } else if (roi > 0) {
    bgClass = 'bg-green-500/20';
    textClass = 'text-green-300';
    label = `+${roi.toFixed(0)}%`;
  } else if (roi === 0) {
    bgClass = 'bg-yellow-500/20';
    textClass = 'text-yellow-300';
    label = '0%';
  } else {
    bgClass = 'bg-red-500/20';
    textClass = 'text-red-300';
    label = `${roi.toFixed(0)}%`;
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${bgClass} ${textClass}`}>
      {roi > 100 && '🔥'}
      {roi > 0 && roi <= 100 && '📈'}
      {roi <= 0 && roi > -50 && '📉'}
      {roi <= -50 && '⚠️'}
      {label}
    </span>
  );
}
