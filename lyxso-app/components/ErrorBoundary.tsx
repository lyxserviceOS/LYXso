// components/ErrorBoundary.tsx - Reusable error boundary component
"use client";

import React, { Component, ReactNode } from "react";
import * as Sentry from "@sentry/nextjs";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to Sentry
    Sentry.withScope((scope) => {
      scope.setContext("errorInfo", { componentStack: errorInfo.componentStack });
      Sentry.captureException(error);
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    console.error("ErrorBoundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-sm font-semibold text-red-900 mb-2">
            Noe gikk galt
          </h2>
          <p className="text-xs text-red-700 mb-3">
            {this.state.error?.message || "En uventet feil oppstod"}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="text-xs px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Prøv igjen
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
