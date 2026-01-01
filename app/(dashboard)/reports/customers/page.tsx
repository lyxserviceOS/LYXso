// app/(dashboard)/reports/customers/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Download, RefreshCw, TrendingUp, Users } from "lucide-react";

// Disable static generation for this page
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  total_bookings: number;
  completed_bookings: number;
  total_spent: number;
  total_paid: number;
  avg_booking_value: number;
  last_booking: string | null;
}

interface CustomersData {
  stats: {
    total_customers: number;
    active_customers: number;
    avg_bookings_per_customer: number;
    avg_value_per_customer: number;
    total_customer_value: number;
  };
  top_customers: Customer[];
  new_customers_by_month: Array<{ month: string; count: number }>;
}

export default function CustomersReportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CustomersData | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchCustomersData = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        ...(startDate && { start_date: startDate }),
        ...(endDate && { end_date: endDate }),
      });

      const response = await fetch(`/api/reports/customers?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("Kunne ikke laste kundedata");
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
    fetchCustomersData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("nb-NO", {
      style: "currency",
      currency: "NOK",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Aldri";
    return new Date(dateString).toLocaleDateString("nb-NO");
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-gray-600">Laster kundeanalyse...</p>
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
            onClick={fetchCustomersData}
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
          <h1 className="text-3xl font-bold text-gray-900">Kundeanalyse</h1>
          <p className="text-gray-600 mt-1">
            Innsikt i kundeadferd og kundeverdi
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div className="flex items-end gap-2">
              <button
                onClick={fetchCustomersData}
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

        {/* Stats */}
        {data && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-600">Totale kunder</div>
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-2xl font-bold">
                  {data.stats.total_customers}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-600">Aktive kunder</div>
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {data.stats.active_customers}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="text-sm text-gray-600 mb-1">
                  Gj.snitt bookinger
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {data.stats.avg_bookings_per_customer.toFixed(1)}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="text-sm text-gray-600 mb-1">
                  Gj.snitt verdi per kunde
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  {formatCurrency(data.stats.avg_value_per_customer)}
                </div>
              </div>
            </div>

            {/* Total Customer Value */}
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-lg p-6 mb-6 text-white">
              <div className="text-sm mb-2 opacity-90">Total Kundeverdi</div>
              <div className="text-4xl font-bold">
                {formatCurrency(data.stats.total_customer_value)}
              </div>
            </div>

            {/* Top Customers Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Beste kunder</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Navn
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Kontakt
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Bookinger
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Total brukt
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Gj.snitt
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Siste booking
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.top_customers.map((customer, index) => (
                      <tr key={customer.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-semibold text-sm">
                              {index + 1}
                            </div>
                            <span className="font-medium">{customer.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm">
                            <div>{customer.email}</div>
                            <div className="text-gray-500">{customer.phone}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {customer.total_bookings}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-green-600">
                          {formatCurrency(customer.total_spent)}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-600">
                          {formatCurrency(customer.avg_booking_value)}
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-500">
                          {formatDate(customer.last_booking)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* New Customers Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Nye kunder per måned</h2>
              <div className="space-y-2">
                {data.new_customers_by_month.map((item) => {
                  const maxCount = Math.max(
                    ...data.new_customers_by_month.map((i) => i.count)
                  );
                  const percentage = (item.count / maxCount) * 100;

                  return (
                    <div key={item.month} className="flex items-center gap-4">
                      <div className="w-20 text-sm text-gray-600">{item.month}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-full flex items-center justify-end px-3 text-white text-sm font-medium transition-all"
                          style={{ width: `${percentage}%` }}
                        >
                          {item.count > 0 && item.count}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
