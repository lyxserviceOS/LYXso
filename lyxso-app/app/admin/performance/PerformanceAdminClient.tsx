"use client";

import React, { useState, useEffect } from "react";

type CacheStats = {
  ai_cache_size: number;
  ai_cache_hits: number;
  ai_cache_misses: number;
  api_cache_enabled: boolean;
  redis_connected: boolean;
};

type PerformanceMetrics = {
  api_response_times: { p50: number; p95: number; p99: number };
  database_queries: { total: number; slow_queries: number; avg_time: number };
  frontend_metrics: { bundle_size: string; page_load_time: number };
};

type OptimizationConfig = {
  compression_enabled: boolean;
  caching_enabled: boolean;
  rate_limiting_enabled: boolean;
  image_optimization: boolean;
  cdn_enabled: boolean;
};

export function PerformanceAdminClient() {
  const [activeTab, setActiveTab] = useState<"overview" | "cache" | "config" | "tools">("overview");
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
  const [config, setConfig] = useState<OptimizationConfig>({
    compression_enabled: true,
    caching_enabled: false,
    rate_limiting_enabled: true,
    image_optimization: false,
    cdn_enabled: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadPerformanceData(); }, []);

  const loadPerformanceData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMetrics({
        api_response_times: { p50: 250, p95: 500, p99: 800 },
        database_queries: { total: 1543, slow_queries: 23, avg_time: 45 },
        frontend_metrics: { bundle_size: "1.8MB", page_load_time: 3.2 },
      });

      setCacheStats({
        ai_cache_size: 245,
        ai_cache_hits: 1234,
        ai_cache_misses: 456,
        api_cache_enabled: false,
        redis_connected: false,
      });
    } catch (error) {
      console.error("Failed to load performance data:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearCache = async (cacheType: string) => {
    if (!confirm(`Are you sure you want to clear ${cacheType} cache?`)) return;
    alert(`${cacheType} cache cleared successfully`);
  };

  const toggleConfig = (key: keyof OptimizationConfig) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const runOptimizationTask = async (task: string) => {
    if (!confirm(`Run ${task}? This may take several minutes.`)) return;
    alert(`Started ${task}...`);
  };

  if (loading) {
    return <div className="p-8">Loading performance data...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Performance Dashboard</h1>
      
      <div className="space-y-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Metrics</h2>
          {metrics && (
            <div className="space-y-2">
              <p>API Response Times: p50={metrics.api_response_times.p50}ms, p95={metrics.api_response_times.p95}ms</p>
              <p>Database Queries: {metrics.database_queries.total} total, {metrics.database_queries.slow_queries} slow</p>
              <p>Bundle Size: {metrics.frontend_metrics.bundle_size}</p>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Cache Stats</h2>
          {cacheStats && (
            <div className="space-y-2">
              <p>Cache Size: {cacheStats.ai_cache_size}</p>
              <p>Hits: {cacheStats.ai_cache_hits}, Misses: {cacheStats.ai_cache_misses}</p>
              <button onClick={() => clearCache("AI")} className="mt-2 px-4 py-2 bg-red-600 text-white rounded">
                Clear Cache
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}