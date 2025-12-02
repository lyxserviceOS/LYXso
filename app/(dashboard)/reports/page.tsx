// app/(dashboard)/reports/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardMetrics from "@/components/DashboardMetrics";
import RevenueChart from "@/components/RevenueChart";
import BookingsChart from "@/components/BookingsChart";
import {
  DollarSign,
  Calendar,
  Users,
  TrendingUp,
  Download,
  RefreshCw,
} from "lucide-react";

interface DashboardData {
  metrics: {
    bookings: {
      total: number;
      completed: number;
      pending: number;
      cancelled: number;
      growth: number;
    };
    revenue: {
      total: number;
      paid: number;
      unpaid: number;
      growth: number;
    };
    customers: {
      total: number;
      new: number;
      growth: number;
    };
  };
  trends: {
    bookings_by_day: Array<{ date: string; count: number }>;
    revenue_by_day: Array<{ date: string; revenue: number }>;
    customers_by_day: Array<{ date: string; count: number }>;
  };
}

export default function ReportsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [period, setPeriod] = useState("30d");
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/reports/dashboard?period=${period}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("Kunne ikke laste rapport-data");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "En feil oppstod");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("nb-NO", {
      style: "currency",
      currency: "NOK",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const metrics = data
    ? [
        {
          label: "Total Inntekt",
          value: formatCurrency(data.metrics.revenue.total),
          change: data.metrics.revenue.growth,
          trend:
            data.metrics.revenue.growth > 0
              ? "up"
              : data.metrics.revenue.growth < 0
              ? "down"
              : "neutral",
          icon: <DollarSign className="h-5 w-5" />,
          color: "text-green-600",
        },
        {
          label: "Totale Bookinger",
          value: data.metrics.bookings.total,
          change: data.metrics.bookings.growth,
          trend:
            data.metrics.bookings.growth > 0
              ? "up"
              : data.metrics.bookings.growth < 0
              ? "down"
              : "neutral",
          icon: <Calendar className="h-5 w-5" />,
          color: "text-blue-600",
        },
        {
          label: "Aktive Kunder",
          value: data.metrics.customers.total,
          change: data.metrics.customers.growth,
          trend:
            data.metrics.customers.growth > 0
              ? "up"
              : data.metrics.customers.growth < 0
              ? "down"
              : "neutral",
          icon: <Users className="h-5 w-5" />,
          color: "text-purple-600",
        },
        {
          label: "Fullførte Bookinger",
          value: data.metrics.bookings.completed,
          change: undefined,
          icon: <TrendingUp className="h-5 w-5" />,
          color: "text-emerald-600",
        },
      ]
    : [];

  const revenueChartData =
    data?.trends.revenue_by_day.map((item) => ({
      period: item.date,
      revenue: item.revenue,
      paid: item.revenue,
      bookings: 0,
    })) || [];

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-gray-600">Laster rapport-data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Prøv igjen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Rapporter & Analytics
            </h1>
            <p className="text-gray-600 mt-1">Oversikt over virksomheten din</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Siste 7 dager</option>
              <option value="30d">Siste 30 dager</option>
              <option value="90d">Siste 90 dager</option>
              <option value="year">Siste år</option>
            </select>
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Oppdater
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
              <Download className="h-4 w-4" />
              Eksporter
            </button>
          </div>
        </div>

        {/* Metrics */}
        {data && (
          <>
            <DashboardMetrics metrics={metrics} />

            {/* Charts */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Inntektsutvikling</h2>
                <RevenueChart data={revenueChartData} type="line" />
              </div>

              {/* Bookings by Status */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Bookinger etter status
                </h2>
                <BookingsChart
                  data={{ by_status: data.metrics.bookings }}
                  type="status"
                />
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => router.push("/reports/revenue")}
                className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
              >
                <div className="text-blue-600 mb-2">
                  <DollarSign className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-1">Inntektsrapport</h3>
                <p className="text-sm text-gray-600">
                  Detaljert oversikt over inntekter og betalinger
                </p>
              </button>

              <button
                onClick={() => router.push("/reports/bookings")}
                className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
              >
                <div className="text-green-600 mb-2">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-1">Bookingstatistikk</h3>
                <p className="text-sm text-gray-600">
                  Analyse av bookinger per lokasjon og service
                </p>
              </button>

              <button
                onClick={() => router.push("/reports/customers")}
                className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
              >
                <div className="text-purple-600 mb-2">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-1">Kundeanalyse</h3>
                <p className="text-sm text-gray-600">
                  Innsikt i kundeadferd og kundeverdi
                </p>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
