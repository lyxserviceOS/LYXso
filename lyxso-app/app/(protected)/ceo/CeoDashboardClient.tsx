// app/(protected)/ceo/CeoDashboardClient.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { 
  CEODashboardData, 
  OrgSummary, 
  ModuleRevenue, 
  LocationMetrics, 
  MarketingMetrics, 
  CEOAlert 
} from "@/types/ceo";

// Mock data for demonstration
const MOCK_DATA: CEODashboardData = {
  total_orgs: 12,
  active_orgs: 10,
  total_revenue: 2450000,
  revenue_this_month: 285000,
  revenue_growth: 12.5,
  
  total_bookings: 3420,
  bookings_this_month: 342,
  bookings_growth: 8.3,
  
  total_customers: 1850,
  customers_this_month: 145,
  
  org_summaries: [
    {
      id: "org-1",
      name: "LYX Bilpleie Oslo",
      org_number: "123456789",
      plan: "paid",
      is_active: true,
      created_at: "2024-01-15",
      total_revenue: 850000,
      revenue_this_month: 98000,
      revenue_last_month: 87000,
      bookings_count: 1200,
      bookings_this_month: 120,
      customers_count: 650,
      customers_this_month: 55,
      coating_jobs_count: 180,
      tyre_sets_count: 420,
    },
    {
      id: "org-2",
      name: "LYX Bilpleie Bergen",
      org_number: "987654321",
      plan: "paid",
      is_active: true,
      created_at: "2024-03-01",
      total_revenue: 620000,
      revenue_this_month: 72000,
      revenue_last_month: 68000,
      bookings_count: 890,
      bookings_this_month: 85,
      customers_count: 480,
      customers_this_month: 38,
      coating_jobs_count: 95,
      tyre_sets_count: 310,
    },
    {
      id: "org-3",
      name: "Premium Bilpleie Trondheim",
      org_number: "555666777",
      plan: "trial",
      is_active: true,
      created_at: "2024-10-01",
      total_revenue: 45000,
      revenue_this_month: 28000,
      revenue_last_month: 17000,
      bookings_count: 85,
      bookings_this_month: 52,
      customers_count: 65,
      customers_this_month: 32,
      coating_jobs_count: 12,
      tyre_sets_count: 45,
    },
    {
      id: "org-4",
      name: "Dekk & Service Stavanger",
      org_number: "111222333",
      plan: "paid",
      is_active: true,
      created_at: "2024-05-15",
      total_revenue: 380000,
      revenue_this_month: 42000,
      revenue_last_month: 45000,
      bookings_count: 520,
      bookings_this_month: 48,
      customers_count: 290,
      customers_this_month: 12,
      coating_jobs_count: 25,
      tyre_sets_count: 580,
    },
  ],
  
  module_revenues: [
    { module: "coating", module_label: "Coating", total_revenue: 980000, revenue_this_month: 115000, growth_percentage: 15.2 },
    { module: "tyre_hotel", module_label: "Dekkhotell", total_revenue: 720000, revenue_this_month: 82000, growth_percentage: 8.5 },
    { module: "booking", module_label: "Booking/Annet", total_revenue: 750000, revenue_this_month: 88000, growth_percentage: 10.1 },
  ],
  
  location_metrics: [
    {
      location_id: "loc-1",
      location_name: "Hovedlokalet Oslo",
      org_id: "org-1",
      org_name: "LYX Bilpleie Oslo",
      booking_slots_available: 40,
      booking_slots_used: 35,
      utilization_percentage: 87.5,
      tyre_storage_capacity: 500,
      tyre_storage_used: 420,
      tyre_utilization_percentage: 84,
      staff_count: 5,
    },
    {
      location_id: "loc-2",
      location_name: "Bergen Sentrum",
      org_id: "org-2",
      org_name: "LYX Bilpleie Bergen",
      booking_slots_available: 32,
      booking_slots_used: 24,
      utilization_percentage: 75,
      tyre_storage_capacity: 400,
      tyre_storage_used: 310,
      tyre_utilization_percentage: 77.5,
      staff_count: 4,
    },
  ],
  
  marketing_metrics: [
    {
      org_id: "org-1",
      org_name: "LYX Bilpleie Oslo",
      total_spend: 45000,
      spend_this_month: 8500,
      leads_count: 320,
      leads_this_month: 58,
      bookings_from_leads: 185,
      conversion_rate: 57.8,
      cost_per_lead: 140.63,
      cost_per_booking: 243.24,
    },
    {
      org_id: "org-2",
      org_name: "LYX Bilpleie Bergen",
      total_spend: 32000,
      spend_this_month: 6200,
      leads_count: 210,
      leads_this_month: 42,
      bookings_from_leads: 105,
      conversion_rate: 50,
      cost_per_lead: 152.38,
      cost_per_booking: 304.76,
    },
  ],
  
  alerts: [
    {
      id: "alert-1",
      type: "warning",
      category: "capacity",
      title: "Dekkhotell nesten fullt",
      message: "Dekkhotellet på LYX Bilpleie Oslo er 84% fullt. Vurder å utvide kapasiteten eller kontakte kunder med gamle dekk.",
      org_id: "org-1",
      org_name: "LYX Bilpleie Oslo",
      location_id: "loc-1",
      location_name: "Hovedlokalet Oslo",
      value: 84,
      threshold: 80,
      created_at: "2024-11-26T10:00:00Z",
      is_read: false,
      action_url: "/partnere/org-1",
    },
    {
      id: "alert-2",
      type: "warning",
      category: "rebooking",
      title: "Lav rebooking-rate",
      message: "Dekk & Service Stavanger har kun 22% rebooking-rate denne måneden, ned fra 35% forrige måned.",
      org_id: "org-4",
      org_name: "Dekk & Service Stavanger",
      location_id: null,
      location_name: null,
      value: 22,
      threshold: 30,
      created_at: "2024-11-25T14:30:00Z",
      is_read: false,
      action_url: "/partnere/org-4",
    },
    {
      id: "alert-3",
      type: "info",
      category: "revenue",
      title: "God vekst",
      message: "Premium Bilpleie Trondheim har 65% vekst fra forrige måned - beste nye partner!",
      org_id: "org-3",
      org_name: "Premium Bilpleie Trondheim",
      location_id: null,
      location_name: null,
      value: 65,
      threshold: null,
      created_at: "2024-11-24T09:00:00Z",
      is_read: true,
      action_url: "/partnere/org-3",
    },
  ],
};

function formatCurrency(amount: number | null | undefined, compact = false): string {
  if (amount == null || isNaN(amount)) return "—";
  if (amount === 0) return "0";
  
  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";
  
  if (compact) {
    if (absAmount >= 1000000) return `${sign}${(absAmount / 1000000).toFixed(1)}M`;
    if (absAmount >= 1000) return `${sign}${(absAmount / 1000).toFixed(0)}k`;
  }
  return amount.toLocaleString("nb-NO");
}

function formatPercentage(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

export default function CeoDashboardClient() {
  const [data] = useState<CEODashboardData>(MOCK_DATA);
  const [selectedTimeRange, setSelectedTimeRange] = useState<"week" | "month" | "quarter" | "year">("month");
  const [selectedView, setSelectedView] = useState<"overview" | "orgs" | "locations" | "marketing">("overview");

  const getAlertColor = (type: CEOAlert["type"]) => {
    switch (type) {
      case "critical": return "bg-red-50 border-red-200 text-red-800";
      case "warning": return "bg-amber-50 border-amber-200 text-amber-800";
      case "info": return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  const getAlertIcon = (type: CEOAlert["type"]) => {
    switch (type) {
      case "critical": return "🚨";
      case "warning": return "⚠️";
      case "info": return "ℹ️";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">CEO Dashboard</h1>
            <p className="text-sm text-slate-500">
              Aggregert oversikt over alle LYXso-partnere og lokasjoner
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as typeof selectedTimeRange)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="week">Denne uken</option>
              <option value="month">Denne måneden</option>
              <option value="quarter">Dette kvartalet</option>
              <option value="year">Dette året</option>
            </select>
          </div>
        </header>

        {/* View Tabs */}
        <div className="flex gap-1 rounded-lg bg-slate-200 p-1">
          {[
            { key: "overview", label: "Oversikt" },
            { key: "orgs", label: "Organisasjoner" },
            { key: "locations", label: "Lokasjoner" },
            { key: "marketing", label: "Markedsføring" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedView(tab.key as typeof selectedView)}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
                selectedView === tab.key
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview View */}
        {selectedView === "overview" && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <MetricCard
                label="Total omsetning"
                value={`${formatCurrency(data.total_revenue, true)} NOK`}
                subValue={`${formatCurrency(data.revenue_this_month)} denne mnd`}
                trend={data.revenue_growth}
              />
              <MetricCard
                label="Aktive partnere"
                value={`${data.active_orgs} / ${data.total_orgs}`}
                subValue={`${data.total_orgs - data.active_orgs} inaktive`}
              />
              <MetricCard
                label="Totalt bookinger"
                value={formatCurrency(data.total_bookings)}
                subValue={`${data.bookings_this_month} denne mnd`}
                trend={data.bookings_growth}
              />
              <MetricCard
                label="Totalt kunder"
                value={formatCurrency(data.total_customers)}
                subValue={`${data.customers_this_month} nye denne mnd`}
              />
            </div>

            {/* Module Revenue Breakdown */}
            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Omsetning per modul</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {data.module_revenues.map((module) => (
                  <div key={module.module} className="rounded-lg border border-slate-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">{module.module_label}</span>
                      <span className={`text-xs font-medium ${module.growth_percentage >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                        {formatPercentage(module.growth_percentage)}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">
                      {formatCurrency(module.revenue_this_month)} NOK
                    </p>
                    <p className="text-xs text-slate-500">
                      Totalt: {formatCurrency(module.total_revenue, true)} NOK
                    </p>
                    {/* Progress bar */}
                    <div className="mt-3 h-2 rounded-full bg-slate-100">
                      <div
                        className={`h-2 rounded-full ${
                          module.module === "coating" ? "bg-purple-500" :
                          module.module === "tyre_hotel" ? "bg-blue-500" :
                          "bg-emerald-500"
                        }`}
                        style={{ width: `${(module.total_revenue / data.total_revenue) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Alerts Section */}
            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Varsler</h2>
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                  {data.alerts.filter(a => !a.is_read).length} uleste
                </span>
              </div>
              <div className="space-y-3">
                {data.alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`rounded-lg border p-4 ${getAlertColor(alert.type)} ${!alert.is_read ? "ring-2 ring-offset-2" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg">{getAlertIcon(alert.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{alert.title}</p>
                          {alert.org_name && (
                            <span className="text-xs opacity-75">• {alert.org_name}</span>
                          )}
                        </div>
                        <p className="text-sm mt-1 opacity-90">{alert.message}</p>
                        {alert.action_url && (
                          <Link
                            href={alert.action_url}
                            className="inline-flex items-center gap-1 mt-2 text-xs font-medium hover:underline"
                          >
                            Se detaljer →
                          </Link>
                        )}
                      </div>
                      <span className="text-xs opacity-60 whitespace-nowrap">
                        {new Date(alert.created_at).toLocaleDateString("nb-NO")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Top Organizations */}
            <section className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <div className="border-b border-slate-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-slate-900">Topp partnere</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left font-medium text-slate-600">Partner</th>
                      <th className="px-6 py-3 text-left font-medium text-slate-600">Plan</th>
                      <th className="px-6 py-3 text-right font-medium text-slate-600">Denne mnd</th>
                      <th className="px-6 py-3 text-right font-medium text-slate-600">Vekst</th>
                      <th className="px-6 py-3 text-right font-medium text-slate-600">Bookinger</th>
                      <th className="px-6 py-3 text-left font-medium text-slate-600"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.org_summaries
                      .sort((a, b) => b.revenue_this_month - a.revenue_this_month)
                      .map((org) => {
                        const growth = org.revenue_last_month > 0
                          ? ((org.revenue_this_month - org.revenue_last_month) / org.revenue_last_month) * 100
                          : 0;
                        return (
                          <tr key={org.id} className="border-t border-slate-100 hover:bg-slate-50">
                            <td className="px-6 py-4">
                              <p className="font-medium text-slate-900">{org.name}</p>
                              <p className="text-xs text-slate-500">{org.org_number}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                org.plan === "paid" ? "bg-emerald-100 text-emerald-700" :
                                org.plan === "trial" ? "bg-amber-100 text-amber-700" :
                                "bg-slate-100 text-slate-700"
                              }`}>
                                {org.plan === "paid" ? "Betalt" : org.plan === "trial" ? "Prøve" : "Gratis"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right font-medium text-slate-900">
                              {formatCurrency(org.revenue_this_month)} NOK
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className={`font-medium ${growth >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                                {formatPercentage(growth)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right text-slate-600">
                              {org.bookings_this_month}
                            </td>
                            <td className="px-6 py-4">
                              <Link
                                href={`/partnere/${org.id}`}
                                className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                              >
                                Se detaljer →
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {/* Organizations View */}
        {selectedView === "orgs" && (
          <section className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.org_summaries.map((org) => (
                <div key={org.id} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-900">{org.name}</h3>
                      <p className="text-xs text-slate-500">{org.org_number}</p>
                    </div>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      org.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"
                    }`}>
                      {org.is_active ? "Aktiv" : "Inaktiv"}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-slate-500">Omsetning denne mnd</p>
                      <p className="font-semibold text-slate-900">{formatCurrency(org.revenue_this_month)} NOK</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Bookinger</p>
                      <p className="font-semibold text-slate-900">{org.bookings_this_month}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Coating-jobber</p>
                      <p className="font-semibold text-slate-900">{org.coating_jobs_count}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Dekksett</p>
                      <p className="font-semibold text-slate-900">{org.tyre_sets_count}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Kunder</p>
                      <p className="font-semibold text-slate-900">{org.customers_count}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Plan</p>
                      <p className="font-semibold text-slate-900 capitalize">{org.plan}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <Link
                      href={`/partnere/${org.id}`}
                      className="block w-full text-center rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                    >
                      Åpne partner-dashboard →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Locations View */}
        {selectedView === "locations" && (
          <section className="space-y-4">
            {data.location_metrics.map((location) => (
              <div key={location.location_id} className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-slate-900">{location.location_name}</h3>
                    <p className="text-sm text-slate-500">{location.org_name}</p>
                  </div>
                  <span className="text-sm text-slate-500">{location.staff_count} ansatte</span>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Booking Utilization */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Booking-utnyttelse</span>
                      <span className={`text-sm font-medium ${
                        location.utilization_percentage >= 80 ? "text-emerald-600" :
                        location.utilization_percentage >= 50 ? "text-amber-600" :
                        "text-red-600"
                      }`}>
                        {location.utilization_percentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-100">
                      <div
                        className={`h-3 rounded-full ${
                          location.utilization_percentage >= 80 ? "bg-emerald-500" :
                          location.utilization_percentage >= 50 ? "bg-amber-500" :
                          "bg-red-500"
                        }`}
                        style={{ width: `${location.utilization_percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {location.booking_slots_used} av {location.booking_slots_available} slots brukt
                    </p>
                  </div>
                  
                  {/* Tyre Storage Utilization */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Dekkhotell-kapasitet</span>
                      <span className={`text-sm font-medium ${
                        location.tyre_utilization_percentage >= 90 ? "text-red-600" :
                        location.tyre_utilization_percentage >= 70 ? "text-amber-600" :
                        "text-emerald-600"
                      }`}>
                        {location.tyre_utilization_percentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-100">
                      <div
                        className={`h-3 rounded-full ${
                          location.tyre_utilization_percentage >= 90 ? "bg-red-500" :
                          location.tyre_utilization_percentage >= 70 ? "bg-amber-500" :
                          "bg-emerald-500"
                        }`}
                        style={{ width: `${location.tyre_utilization_percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {location.tyre_storage_used} av {location.tyre_storage_capacity} plasser brukt
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Marketing View */}
        {selectedView === "marketing" && (
          <section className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <div className="border-b border-slate-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-slate-900">Markedsføringsresultater per partner</h2>
                <p className="text-sm text-slate-500">Spend → Leads → Bookinger</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left font-medium text-slate-600">Partner</th>
                      <th className="px-6 py-3 text-right font-medium text-slate-600">Spend denne mnd</th>
                      <th className="px-6 py-3 text-right font-medium text-slate-600">Leads</th>
                      <th className="px-6 py-3 text-right font-medium text-slate-600">Bookinger</th>
                      <th className="px-6 py-3 text-right font-medium text-slate-600">Konv. rate</th>
                      <th className="px-6 py-3 text-right font-medium text-slate-600">Kost/lead</th>
                      <th className="px-6 py-3 text-right font-medium text-slate-600">Kost/booking</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.marketing_metrics.map((metrics) => (
                      <tr key={metrics.org_id} className="border-t border-slate-100 hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">{metrics.org_name}</td>
                        <td className="px-6 py-4 text-right text-slate-600">
                          {formatCurrency(metrics.spend_this_month)} NOK
                        </td>
                        <td className="px-6 py-4 text-right text-slate-600">
                          {metrics.leads_this_month}
                        </td>
                        <td className="px-6 py-4 text-right text-slate-600">
                          {metrics.bookings_from_leads}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`font-medium ${
                            metrics.conversion_rate >= 50 ? "text-emerald-600" :
                            metrics.conversion_rate >= 30 ? "text-amber-600" :
                            "text-red-600"
                          }`}>
                            {metrics.conversion_rate.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-slate-600">
                          {metrics.cost_per_lead.toFixed(0)} NOK
                        </td>
                        <td className="px-6 py-4 text-right text-slate-600">
                          {metrics.cost_per_booking.toFixed(0)} NOK
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Marketing Summary */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-500">Total markedsføringsspend</p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(data.marketing_metrics.reduce((sum, m) => sum + m.spend_this_month, 0))} NOK
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-500">Totale leads denne mnd</p>
                <p className="text-2xl font-bold text-slate-900">
                  {data.marketing_metrics.reduce((sum, m) => sum + m.leads_this_month, 0)}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-500">Gj.snitt konverteringsrate</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {(data.marketing_metrics.reduce((sum, m) => sum + m.conversion_rate, 0) / data.marketing_metrics.length).toFixed(1)}%
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// Helper component for metric cards
function MetricCard({
  label,
  value,
  subValue,
  trend,
}: {
  label: string;
  value: string;
  subValue?: string;
  trend?: number;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <div className="flex items-end justify-between mt-1">
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        {trend !== undefined && (
          <span className={`text-sm font-medium ${trend >= 0 ? "text-emerald-600" : "text-red-600"}`}>
            {trend >= 0 ? "+" : ""}{trend.toFixed(1)}%
          </span>
        )}
      </div>
      {subValue && <p className="text-xs text-slate-500 mt-1">{subValue}</p>}
    </div>
  );
}
