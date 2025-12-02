// components/BookingsChart.tsx
"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface BookingsData {
  by_status?: {
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  by_location?: Record<string, number>;
  by_service?: Record<string, number>;
  by_weekday?: number[];
  by_hour?: number[];
}

interface Props {
  data: BookingsData;
  type?: "status" | "location" | "service" | "weekday" | "hour";
}

const STATUS_COLORS = {
  pending: "#f59e0b",
  confirmed: "#3b82f6",
  completed: "#10b981",
  cancelled: "#ef4444",
};

const STATUS_LABELS = {
  pending: "Venter",
  confirmed: "Bekreftet",
  completed: "Fullført",
  cancelled: "Kansellert",
};

const WEEKDAY_LABELS = ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"];

export default function BookingsChart({ data, type = "status" }: Props) {
  if (type === "status" && data.by_status) {
    const chartData = Object.entries(data.by_status).map(([key, value]) => ({
      name: STATUS_LABELS[key as keyof typeof STATUS_LABELS],
      value,
      color: STATUS_COLORS[key as keyof typeof STATUS_COLORS],
    }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (type === "location" && data.by_location) {
    const chartData = Object.entries(data.by_location).map(([name, value]) => ({
      name,
      bookings: value,
    }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="bookings" fill="#3b82f6" name="Bookinger" />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (type === "service" && data.by_service) {
    const chartData = Object.entries(data.by_service)
      .map(([name, value]) => ({
        name,
        bookings: value,
      }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 10);

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={150} />
          <Tooltip />
          <Legend />
          <Bar dataKey="bookings" fill="#10b981" name="Bookinger" />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (type === "weekday" && data.by_weekday) {
    const chartData = data.by_weekday.map((count, index) => ({
      day: WEEKDAY_LABELS[index],
      bookings: count,
    }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="bookings" fill="#8b5cf6" name="Bookinger" />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (type === "hour" && data.by_hour) {
    const chartData = data.by_hour.map((count, hour) => ({
      hour: `${hour}:00`,
      bookings: count,
    }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="bookings" fill="#f59e0b" name="Bookinger" />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return <div className="text-gray-500 text-center py-8">Ingen data</div>;
}
