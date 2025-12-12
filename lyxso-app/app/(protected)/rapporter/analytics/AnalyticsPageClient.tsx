"use client";

import { useEffect, useState } from "react";
import { useOrgPlan } from "@/lib/useOrgPlan";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

type AnalyticsData = {
  bookings: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
    byStatus: { status: string; count: number }[];
    byService: { service: string; count: number }[];
    byMonth: { month: string; count: number }[];
  };
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
    byMonth: { month: string; amount: number }[];
    byService: { service: string; amount: number }[];
  };
  customers: {
    total: number;
    new: number;
    returning: number;
    retention: number;
  };
  services: {
    mostPopular: { service: string; count: number }[];
    leastPopular: { service: string; count: number }[];
  };
};

export default function AnalyticsPageClient() {
  const { org } = useOrgPlan();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter" | "year">("month");

  useEffect(() => {
    if (org?.id) {
      loadAnalytics();
    }
  }, [org?.id, timeRange]);

  async function loadAnalytics() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/org/analytics?orgId=${org?.id}&range=${timeRange}`);
      
      if (!response.ok) {
        throw new Error("Kunne ikke laste analytics");
      }

      const data = await response.json();
      setAnalytics(data.analytics);
    } catch (err: any) {
      console.error("Error loading analytics:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function exportData(format: "csv" | "excel") {
    try {
      const response = await fetch(`/api/org/analytics/export?orgId=${org?.id}&format=${format}&range=${timeRange}`);
      
      if (!response.ok) {
        throw new Error("Kunne ikke eksportere data");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `analytics-${timeRange}-${Date.now()}.${format === "csv" ? "csv" : "xlsx"}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      alert(`Feil ved eksport: ${err.message}`);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Laster analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error || "Kunne ikke laste analytics"}
        </div>
      </div>
    );
  }

  // Chart data
  const bookingsByMonthData = {
    labels: analytics.bookings.byMonth.map((m) => m.month),
    datasets: [
      {
        label: "Bookinger",
        data: analytics.bookings.byMonth.map((m) => m.count),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
      },
    ],
  };

  const revenueByMonthData = {
    labels: analytics.revenue.byMonth.map((m) => m.month),
    datasets: [
      {
        label: "Inntekt (NOK)",
        data: analytics.revenue.byMonth.map((m) => m.amount),
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.5)",
      },
    ],
  };

  const serviceDistributionData = {
    labels: analytics.bookings.byService.map((s) => s.service),
    datasets: [
      {
        data: analytics.bookings.byService.map((s) => s.count),
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)",
          "rgba(34, 197, 94, 0.7)",
          "rgba(251, 191, 36, 0.7)",
          "rgba(239, 68, 68, 0.7)",
          "rgba(168, 85, 247, 0.7)",
        ],
      },
    ],
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analytics & Rapporter</h1>
          <p className="mt-2 text-slate-600">
            Detaljert oversikt over bookinger, inntekter og trender
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
          >
            <option value="week">Siste uke</option>
            <option value="month">Siste måned</option>
            <option value="quarter">Siste kvartal</option>
            <option value="year">Siste år</option>
          </select>

          <button
            onClick={() => exportData("csv")}
            className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            Eksporter CSV
          </button>

          <button
            onClick={() => exportData("excel")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Eksporter Excel
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Totalt bookinger"
          value={analytics.bookings.total.toString()}
          subtitle={`${analytics.bookings.thisMonth} denne måneden`}
          trend={analytics.bookings.growth}
          icon="📅"
        />

        <KPICard
          title="Total inntekt"
          value={`${analytics.revenue.total.toLocaleString("nb-NO")} kr`}
          subtitle={`${analytics.revenue.thisMonth.toLocaleString("nb-NO")} kr denne mnd`}
          trend={analytics.revenue.growth}
          icon="💰"
        />

        <KPICard
          title="Totalt kunder"
          value={analytics.customers.total.toString()}
          subtitle={`${analytics.customers.new} nye kunder`}
          trend={analytics.customers.retention}
          icon="👥"
        />

        <KPICard
          title="Retention Rate"
          value={`${analytics.customers.retention.toFixed(1)}%`}
          subtitle={`${analytics.customers.returning} returnerende`}
          icon="🔄"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings Over Time */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Bookinger over tid
          </h2>
          <Line
            data={bookingsByMonthData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top" as const,
                },
              },
            }}
          />
        </div>

        {/* Revenue Over Time */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Inntekt over tid
          </h2>
          <Line
            data={revenueByMonthData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top" as const,
                },
              },
            }}
          />
        </div>

        {/* Service Distribution */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Tjenester fordeling
          </h2>
          <Pie
            data={serviceDistributionData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "right" as const,
                },
              },
            }}
          />
        </div>

        {/* Most Popular Services */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Mest populære tjenester
          </h2>
          <div className="space-y-3">
            {analytics.services.mostPopular.map((service, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-slate-700">{service.service}</span>
                <span className="text-sm font-semibold text-slate-900">
                  {service.count} bookinger
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Service */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Inntekt per tjeneste
          </h2>
          <table className="w-full">
            <thead className="border-b border-slate-200">
              <tr>
                <th className="text-left py-2 text-sm font-semibold text-slate-700">
                  Tjeneste
                </th>
                <th className="text-right py-2 text-sm font-semibold text-slate-700">
                  Inntekt
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {analytics.revenue.byService.map((service, index) => (
                <tr key={index}>
                  <td className="py-2 text-sm text-slate-700">{service.service}</td>
                  <td className="py-2 text-sm text-slate-900 text-right font-medium">
                    {service.amount.toLocaleString("nb-NO")} kr
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Booking Status */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Booking status
          </h2>
          <table className="w-full">
            <thead className="border-b border-slate-200">
              <tr>
                <th className="text-left py-2 text-sm font-semibold text-slate-700">
                  Status
                </th>
                <th className="text-right py-2 text-sm font-semibold text-slate-700">
                  Antall
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {analytics.bookings.byStatus.map((status, index) => (
                <tr key={index}>
                  <td className="py-2 text-sm text-slate-700">{status.status}</td>
                  <td className="py-2 text-sm text-slate-900 text-right font-medium">
                    {status.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

type KPICardProps = {
  title: string;
  value: string;
  subtitle: string;
  trend?: number;
  icon: string;
};

function KPICard({ title, value, subtitle, trend, icon }: KPICardProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-2">
        <div className="text-2xl">{icon}</div>
        {trend !== undefined && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              trend >= 0
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {trend >= 0 ? "+" : ""}{trend.toFixed(1)}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-slate-900 mb-1">{value}</div>
      <div className="text-sm text-slate-600">{title}</div>
      <div className="text-xs text-slate-500 mt-1">{subtitle}</div>
    </div>
  );
}
