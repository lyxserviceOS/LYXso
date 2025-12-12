// components/DashboardMetrics.tsx
"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Metric {
  label: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  color?: string;
}

interface Props {
  metrics: Metric[];
}

export default function DashboardMetrics({ metrics }: Props) {
  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case "neutral":
        return <Minus className="h-4 w-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const formatChange = (change?: number) => {
    if (change === undefined) return null;
    const sign = change >= 0 ? "+" : "";
    return `${sign}${change.toFixed(1)}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              {metric.label}
            </span>
            {metric.icon && (
              <div className={`${metric.color || "text-gray-400"}`}>
                {metric.icon}
              </div>
            )}
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {metric.value}
              </div>
              {metric.change !== undefined && (
                <div
                  className={`flex items-center gap-1 mt-1 text-sm ${getTrendColor(metric.trend)}`}
                >
                  {getTrendIcon(metric.trend)}
                  <span>{formatChange(metric.change)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
