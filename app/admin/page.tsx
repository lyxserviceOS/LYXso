"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type AdminStats = {
  totalOrgs: number;
  activeOrgs: number;
  totalUsers: number;
  totalRevenue: number;
  mrr: number;
  newOrgsThisMonth: number;
  activeAIModules: number;
  pendingRequests: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminStats();
  }, []);

  const loadAdminStats = async () => {
    try {
      // Hent statistikk fra database
      const [
        { count: totalOrgs },
        { count: totalUsers },
        { count: newOrgs },
      ] = await Promise.all([
        supabase.from("organizations").select("*", { count: "exact", head: true }),
        supabase.from("org_memberships").select("*", { count: "exact", head: true }),
        supabase
          .from("organizations")
          .select("*", { count: "exact", head: true })
          .gte("created_at", new Date(new Date().setDate(1)).toISOString()),
      ]);

      // TODO: Hent ekte data fra database
      setStats({
        totalOrgs: totalOrgs || 0,
        activeOrgs: Math.floor((totalOrgs || 0) * 0.8),
        totalUsers: totalUsers || 0,
        totalRevenue: 0, // Beregn fra transaksjoner
        mrr: 0, // Monthly Recurring Revenue
        newOrgsThisMonth: newOrgs || 0,
        activeAIModules: 0,
        pendingRequests: 0,
      });
    } catch (error) {
      console.error("Feil ved lasting av admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-slate-800" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Totalt Organisasjoner",
      value: stats?.totalOrgs || 0,
      icon: "🏢",
      color: "from-blue-500 to-cyan-500",
      href: "/admin/partnere",
    },
    {
      label: "Aktive Organisasjoner",
      value: stats?.activeOrgs || 0,
      icon: "✅",
      color: "from-green-500 to-emerald-500",
      href: "/admin/partnere?filter=active",
    },
    {
      label: "Totalt Brukere",
      value: stats?.totalUsers || 0,
      icon: "👥",
      color: "from-purple-500 to-pink-500",
      href: "/admin/kunder",
    },
    {
      label: "Nye denne måneden",
      value: stats?.newOrgsThisMonth || 0,
      icon: "🆕",
      color: "from-orange-500 to-red-500",
      href: "/admin/partnere?filter=new",
    },
    {
      label: "MRR (Monthly Recurring)",
      value: `${stats?.mrr || 0} kr`,
      icon: "💰",
      color: "from-yellow-500 to-amber-500",
      href: "/admin/okonomi",
    },
    {
      label: "Total Revenue",
      value: `${stats?.totalRevenue || 0} kr`,
      icon: "📊",
      color: "from-indigo-500 to-blue-500",
      href: "/admin/transaksjoner",
    },
    {
      label: "Aktive AI-Moduler",
      value: stats?.activeAIModules || 0,
      icon: "🤖",
      color: "from-cyan-500 to-teal-500",
      href: "/admin/ai-config",
    },
    {
      label: "Ventende Forespørsler",
      value: stats?.pendingRequests || 0,
      icon: "📨",
      color: "from-rose-500 to-pink-500",
      href: "/admin/partnerforesporsler",
    },
  ];

  const quickActions = [
    {
      label: "Opprett Ny Partner",
      icon: "➕",
      href: "/admin/partnere/ny",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      label: "Se AI Live Samtaler",
      icon: "💬",
      href: "/admin/ai-conversations",
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      label: "Administrer Planer",
      icon: "📋",
      href: "/admin/planer",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      label: "System Logger",
      icon: "📋",
      href: "/admin/logger",
      color: "bg-slate-600 hover:bg-slate-700",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-slate-400">
          Oversikt over hele LYXso-plattformen og alle partnere
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => (
          <Link
            key={index}
            href={card.href}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br p-6 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            style={{
              backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
            }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-90`} />
            <div className="relative">
              <div className="mb-4 text-4xl">{card.icon}</div>
              <div className="text-3xl font-bold">{card.value}</div>
              <div className="mt-2 text-sm opacity-90">{card.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-white">Hurtighandlinger</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className={`flex items-center gap-3 rounded-lg p-4 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl ${action.color}`}
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="font-semibold">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-4 text-xl font-bold text-white">Nylig Aktivitet</h2>
        <div className="space-y-3">
          {/* TODO: Hent ekte aktivitetsdata */}
          <div className="flex items-center gap-3 rounded-lg bg-slate-800 p-3 text-sm text-slate-300">
            <span className="text-lg">🆕</span>
            <span>Ny partner registrert: <strong>ABC Bilservice</strong></span>
            <span className="ml-auto text-xs text-slate-500">2 timer siden</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-slate-800 p-3 text-sm text-slate-300">
            <span className="text-lg">💰</span>
            <span>Ny transaksjon: <strong>Pro Plan - 1990 kr</strong></span>
            <span className="ml-auto text-xs text-slate-500">5 timer siden</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-slate-800 p-3 text-sm text-slate-300">
            <span className="text-lg">🤖</span>
            <span>AI-modul aktivert: <strong>LYXba for XYZ Dekk</strong></span>
            <span className="ml-auto text-xs text-slate-500">1 dag siden</span>
          </div>
        </div>
      </div>
    </div>
  );
}
