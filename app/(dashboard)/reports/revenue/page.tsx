// app/(dashboard)/reports/revenue/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RevenueChart from "@/components/RevenueChart";
import { Download, RefreshCw, Calendar as CalendarIcon } from "lucide-react";

// Disable static generation for this page
export const dynamic = 'force-dynamic';

interface RevenueData {
  stats: {
    total_bookings: number;
    completed_bookings: number;
    cancelled_bookings: number;
    total_revenue: number;
    paid_revenue: number;
    unpaid_revenue: number;
    avg_booking_value: number;
  };
  grouped_data: Array<{
    period: string;
    bookings: number;
    revenue: number;
    paid: number;
  }>;
}

export default function RevenueReportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RevenueData | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [groupBy, setGroupBy] = useState("month");
  const [error, setError] = useState<string | null>(null);

  const fetchRevenueData = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        group_by: groupBy,
        ...(startDate && { start_date: startDate }),
        ...(endDate && { end_date: endDate }),
      });

      const response = await fetch(`/api/reports/revenue?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("Kunne ikke laste inntektsdata");
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
    fetchRevenueData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("nb-NO", {
      style: "currency",
      currency: "NOK",
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-gray-600">Laster inntektsrapport...</p>
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
            onClick={fetchRevenueData}
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
        <div className="mb-6">
          <button
            onClick={() => router.push("/reports")}
            className="text-blue-600 hover:text-blue-700 mb-2"
          >
            ← Tilbake til rapporter
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Inntektsrapport</h1>
          <p className="text-gray-600 mt-1">
            Detaljert oversikt over inntekter og betalinger
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fra dato
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Til dato
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grupper etter
              </label>
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="day">Dag</option>
                <option value="week">Uke</option>
                <option value="month">Måned</option>
                <option value="year">År</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={fetchRevenueData}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                Oppdater
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {data && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="text-sm text-gray-600 mb-1">Total Inntekt</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(data.stats.total_revenue)}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="text-sm text-gray-600 mb-1">Betalt</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(data.stats.paid_revenue)}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="text-sm text-gray-600 mb-1">Ubetalt</div>
                <div className="text-2xl font-bold text-orange-600">
                  {formatCurrency(data.stats.unpaid_revenue)}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="text-sm text-gray-600 mb-1">
                  Gj.snitt per booking
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(data.stats.avg_booking_value)}
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Inntektsutvikling</h2>
              <RevenueChart data={data.grouped_data} type="bar" />
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="text-sm text-gray-600 mb-1">
                  Totale Bookinger
                </div>
                <div className="text-xl font-bold">{data.stats.total_bookings}</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="text-sm text-gray-600 mb-1">
                  Fullførte Bookinger
                </div>
                <div className="text-xl font-bold text-green-600">
                  {data.stats.completed_bookings}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="text-sm text-gray-600 mb-1">
                  Kansellerte Bookinger
                </div>
                <div className="text-xl font-bold text-red-600">
                  {data.stats.cancelled_bookings}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
