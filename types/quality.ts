// types/quality.ts
// Types for Quality, Safety and Performance module (Module 29)
// Testing, observability, and environment management

export type Environment = "development" | "staging" | "production";

export type LogLevel = "debug" | "info" | "warn" | "error" | "critical";

export type HealthStatus = "healthy" | "degraded" | "unhealthy";

export interface SystemHealth {
  status: HealthStatus;
  timestamp: string;
  
  // Component health
  components: {
    database: ComponentHealth;
    cache: ComponentHealth;
    api: ComponentHealth;
    integrations: ComponentHealth;
    ai_agent: ComponentHealth;
  };
  
  // Performance metrics
  response_time_p50: number;
  response_time_p95: number;
  response_time_p99: number;
  
  error_rate: number;
  
  // Resource usage
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
}

export interface ComponentHealth {
  name: string;
  status: HealthStatus;
  message: string | null;
  last_check: string;
  response_time_ms: number | null;
}

export interface ErrorEvent {
  id: string;
  
  // Context
  environment: Environment;
  org_id: string | null;
  user_id: string | null;
  session_id: string | null;
  
  // Error info
  error_type: string;
  error_message: string;
  stack_trace: string | null;
  
  // Request context
  request_method: string | null;
  request_url: string | null;
  request_headers: Record<string, string> | null;
  
  // Metadata
  metadata: Record<string, unknown> | null;
  
  // Grouping
  fingerprint: string;
  
  // Status
  is_resolved: boolean;
  resolved_at: string | null;
  resolved_by: string | null;
  
  occurrence_count: number;
  first_seen: string;
  last_seen: string;
  
  created_at: string;
}

export interface PerformanceMetric {
  id: string;
  
  // Metric identification
  metric_name: string;
  metric_type: "counter" | "gauge" | "histogram" | "timer";
  
  // Context
  environment: Environment;
  org_id: string | null;
  
  // Value
  value: number;
  unit: string | null;
  
  // Dimensions
  dimensions: Record<string, string>;
  
  timestamp: string;
}

export interface AuditLog {
  id: string;
  
  // Who
  user_id: string | null;
  user_email: string | null;
  org_id: string | null;
  
  // What
  action: string;
  resource_type: string;
  resource_id: string | null;
  
  // Details
  changes: {
    field: string;
    old_value: unknown;
    new_value: unknown;
  }[] | null;
  
  // Context
  ip_address: string | null;
  user_agent: string | null;
  
  // Result
  success: boolean;
  error_message: string | null;
  
  timestamp: string;
}

// Critical flow test definitions
export interface CriticalFlow {
  id: string;
  name: string;
  description: string;
  
  // Steps
  steps: CriticalFlowStep[];
  
  // Test schedule
  schedule_cron: string | null;
  
  // Last run
  last_run_at: string | null;
  last_run_status: "passed" | "failed" | "skipped" | null;
  last_run_duration_ms: number | null;
  
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CriticalFlowStep {
  order: number;
  name: string;
  action: string;
  expected_result: string;
  timeout_ms: number;
}

export interface CriticalFlowRun {
  id: string;
  flow_id: string;
  
  status: "running" | "passed" | "failed";
  
  started_at: string;
  completed_at: string | null;
  duration_ms: number | null;
  
  // Results per step
  step_results: {
    step_order: number;
    status: "passed" | "failed" | "skipped";
    duration_ms: number;
    error_message: string | null;
  }[];
  
  error_message: string | null;
  
  environment: Environment;
  triggered_by: "schedule" | "manual" | "deploy";
  
  created_at: string;
}

// Performance optimization recommendations
export interface PerformanceOptimization {
  id: string;
  
  category: "database" | "api" | "frontend" | "caching" | "infrastructure";
  severity: "low" | "medium" | "high" | "critical";
  
  title: string;
  description: string;
  recommendation: string;
  
  // Affected areas
  affected_endpoints: string[] | null;
  affected_queries: string[] | null;
  
  // Impact
  current_performance: string;
  expected_improvement: string;
  
  // Status
  status: "identified" | "in_progress" | "resolved" | "wont_fix";
  resolved_at: string | null;
  
  created_at: string;
  updated_at: string;
}

// Slow query tracking
export interface SlowQuery {
  id: string;
  
  query_text: string;
  query_hash: string;
  
  // Execution stats
  execution_count: number;
  total_time_ms: number;
  avg_time_ms: number;
  max_time_ms: number;
  
  // Analysis
  explain_plan: string | null;
  recommendations: string[] | null;
  
  first_seen: string;
  last_seen: string;
  
  // Status
  is_optimized: boolean;
  optimized_at: string | null;
  
  created_at: string;
  updated_at: string;
}
