// app/error.tsx - Global error boundary
"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-50 mb-2">
            Noe gikk galt
          </h1>
          <p className="text-sm text-slate-400">
            Vi beklager, det oppstod en uventet feil. Feilen har blitt rapportert og vi jobber med å løse problemet.
          </p>
        </div>

        {error.digest && (
          <div className="mb-6 p-3 bg-slate-900/50 border border-slate-800 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">Feil-ID:</p>
            <code className="text-xs text-slate-400 font-mono">
              {error.digest}
            </code>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Prøv igjen
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Gå til forsiden
          </button>
        </div>
      </div>
    </div>
  );
}
