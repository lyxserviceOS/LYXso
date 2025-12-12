"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Types
type DashboardMetrics = {
  totalOrgs: number;
  activeOrgs: number;
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  mrr: number;
  newOrgsThisMonth: number;
  churnRate: number;
  activeUsersToday: number;
  activeUsersWeek: number;
  activeUsersMonth: number;
};

type RecentOrg = {
  id: string;
  name: string;
  plan: string;
  created_at: string;
};

type SystemHealth = {
  apiStatus: "healthy" | "degraded" | "down";
  databaseStatus: "healthy" | "degraded" | "down";
  uptime: string;
  errorRate: number;
};

export default function AdminDashboardClient() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentOrgs, setRecentOrgs] = useState<RecentOrg[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  async function loadDashboardData() {
    try {
      setError(null);
      
      // Load metrics
      const metricsRes = await fetch("/api/admin/metrics");
      if (metricsRes.ok) {
        const data = await metricsRes.json();
        setMetrics(data.metrics);
      }

      // Load recent orgs
      const orgsRes = await fetch("/api/admin/orgs/recent");
      if (orgsRes.ok) {
        const data = await orgsRes.json();
        setRecentOrgs(data.orgs || []);
      }

      // Load system health
      const healthRes = await fetch("/api/admin/health");
      if (healthRes.ok) {
        const data = await healthRes.json();
        setSystemHealth(data.health);
      }
    } catch (err: any) {
      console.error("Error loading dashboard:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("nb-NO", {
      style: "currency",
      currency: "NOK",
      minimumFractionDigits: 0,
    }).format(amount);
  }

  function formatNumber(num: number) {
    return new Intl.NumberFormat("nb-NO").format(num);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Laster admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="mt-2 text-slate-600">
            Komplett oversikt over plattformen
          </p>
        </div>
        
        <button
          onClick={loadDashboardData}
          className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Oppdater
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {/* System Health */}
      {systemHealth && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Systemstatus</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${systemHealth.apiStatus === 'healthy' ? 'bg-green-500' : systemHealth.apiStatus === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
              <div>
                <div className="text-sm font-medium text-slate-900">API</div>
                <div className="text-xs text-slate-600 capitalize">{systemHealth.apiStatus}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${systemHealth.databaseStatus === 'healthy' ? 'bg-green-500' : systemHealth.databaseStatus === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
              <div>
                <div className="text-sm font-medium text-slate-900">Database</div>
                <div className="text-xs text-slate-600 capitalize">{systemHealth.databaseStatus}</div>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-slate-900">Uptime</div>
              <div className="text-xs text-slate-600">{systemHealth.uptime}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-slate-900">Error Rate</div>
              <div className="text-xs text-slate-600">{systemHealth.errorRate.toFixed(2)}%</div>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Organizations */}
          <MetricCard
            title="Organisasjoner"
            value={formatNumber(metrics.totalOrgs)}
            subtitle={`${metrics.activeOrgs} aktive`}
            icon="🏢"
            trend={metrics.newOrgsThisMonth > 0 ? `+${metrics.newOrgsThisMonth} denne mnd` : undefined}
            trendUp={metrics.newOrgsThisMonth > 0}
          />

          {/* Total Users */}
          <MetricCard
            title="Brukere"
            value={formatNumber(metrics.totalUsers)}
            subtitle={`${metrics.activeUsersToday} aktive i dag`}
            icon="👥"
            trend={`${metrics.activeUsersWeek} denne uken`}
          />

          {/* Total Bookings */}
          <MetricCard
            title="Bookinger"
            value={formatNumber(metrics.totalBookings)}
            subtitle="Totalt alle tider"
            icon="📅"
          />

          {/* Monthly Recurring Revenue */}
          <MetricCard
            title="MRR"
            value={formatCurrency(metrics.mrr)}
            subtitle="Monthly Recurring Revenue"
            icon="💰"
            trend={`Total: ${formatCurrency(metrics.totalRevenue)}`}
            trendUp={metrics.mrr > 0}
          />

          {/* Active Users Today */}
          <MetricCard
            title="Aktive i dag"
            value={formatNumber(metrics.activeUsersToday)}
            subtitle="Unike brukere"
            icon="🔥"
          />

          {/* Active Users Week */}
          <MetricCard
            title="Aktive denne uken"
            value={formatNumber(metrics.activeUsersWeek)}
            subtitle="Siste 7 dager"
            icon="📊"
          />

          {/* Active Users Month */}
          <MetricCard
            title="Aktive denne mnd"
            value={formatNumber(metrics.activeUsersMonth)}
            subtitle="Siste 30 dager"
            icon="📈"
          />

          {/* Churn Rate */}
          <MetricCard
            title="Churn Rate"
            value={`${metrics.churnRate.toFixed(1)}%`}
            subtitle="Månedlig"
            icon="📉"
            trend={metrics.churnRate < 5 ? "Lavt" : metrics.churnRate < 10 ? "Moderat" : "Høyt"}
            trendUp={metrics.churnRate < 5}
          />
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/orgs"
          className="bg-white rounded-lg border border-slate-200 p-6 hover:border-blue-300 transition-colors"
        >
          <div className="text-2xl mb-2">🏢</div>
          <div className="font-semibold text-slate-900">Organisasjoner</div>
          <div className="text-sm text-slate-600 mt-1">
            Administrer alle organisasjoner og planer
          </div>
        </Link>

        <Link
          href="/admin/users"
          className="bg-white rounded-lg border border-slate-200 p-6 hover:border-blue-300 transition-colors"
        >
          <div className="text-2xl mb-2">👥</div>
          <div className="font-semibold text-slate-900">Brukere</div>
          <div className="text-sm text-slate-600 mt-1">
            Se alle brukere og deres aktivitet
          </div>
        </Link>

        <Link
          href="/admin/system"
          className="bg-white rounded-lg border border-slate-200 p-6 hover:border-blue-300 transition-colors"
        >
          <div className="text-2xl mb-2">⚙️</div>
          <div className="font-semibold text-slate-900">System</div>
          <div className="text-sm text-slate-600 mt-1">
            Systeminnstillinger og monitoring
          </div>
        </Link>
      </div>

      {/* Recent Organizations */}
      {recentOrgs.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Nyeste organisasjoner
            </h2>
            <Link
              href="/admin/orgs"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Se alle →
            </Link>
          </div>

          <div className="space-y-3">
            {recentOrgs.slice(0, 5).map((org) => (
              <div
                key={org.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <div>
                  <div className="font-medium text-slate-900">{org.name}</div>
                  <div className="text-sm text-slate-600">
                    {new Date(org.created_at).toLocaleDateString("nb-NO")}
                  </div>
                </div>
                <div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {org.plan}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type MetricCardProps = {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  trend?: string;
  trendUp?: boolean;
};

function MetricCard({ title, value, subtitle, icon, trend, trendUp }: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-2">
        <div className="text-2xl">{icon}</div>
        {trend && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              trendUp
                ? "bg-green-100 text-green-800"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {trend}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-slate-900 mb-1">{value}</div>
      <div className="text-sm text-slate-600">{title}</div>
      <div className="text-xs text-slate-500 mt-1">{subtitle}</div>
    </div>
  );
}
