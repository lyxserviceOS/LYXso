// components/RevenueChart.tsx
"use client";

import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface RevenueData {
  period: string;
  revenue: number;
  paid: number;
  bookings: number;
}

interface Props {
  data: RevenueData[];
  type?: "line" | "bar";
}

export default function RevenueChart({ data, type = "bar" }: Props) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("nb-NO", {
      style: "currency",
      currency: "NOK",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatPeriod = (period: string) => {
    if (period.includes("-W")) {
      return `Uke ${period.split("-W")[1]}`;
    }
    if (period.match(/^\d{4}-\d{2}$/)) {
      const [year, month] = period.split("-");
      return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString(
        "nb-NO",
        { year: "numeric", month: "short" }
      );
    }
    if (period.match(/^\d{4}$/)) {
      return period;
    }
    return period;
  };

  const chartData = data.map((item) => ({
    ...item,
    period: formatPeriod(item.period),
  }));

  if (type === "line") {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis tickFormatter={formatCurrency} />
          <Tooltip formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : 'N/A'} />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            name="Inntekt"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="paid"
            stroke="#10b981"
            name="Betalt"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="period" />
        <YAxis tickFormatter={formatCurrency} />
        <Tooltip formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : 'N/A'} />
        <Legend />
        <Bar dataKey="revenue" fill="#3b82f6" name="Inntekt" />
        <Bar dataKey="paid" fill="#10b981" name="Betalt" />
      </BarChart>
    </ResponsiveContainer>
  );
}
