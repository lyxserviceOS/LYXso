// app/(protected)/kunder/[id]/CustomerAISummary.tsx
"use client";

import { useState } from "react";
import {
  generateCustomerSummary,
  generateMessageSuggestion,
  type CustomerAISummary as AISummaryType,
  type CustomerContext,
  type MessageSuggestion,
} from "@/repos/aiAssistantRepo";

type CustomerAISummaryProps = {
  context: CustomerContext;
};

export default function CustomerAISummary({ context }: CustomerAISummaryProps) {
  const [summary, setSummary] = useState<AISummaryType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [messageSuggestion, setMessageSuggestion] = useState<MessageSuggestion | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(false);

  async function handleGenerateSummary() {
    setLoading(true);
    setError(null);
    try {
      const result = await generateCustomerSummary(context);
      setSummary(result);
    } catch (err) {
      console.error("Error generating summary:", err);
      setError("Kunne ikke generere oppsummering. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateMessage(
    type: "sms" | "email",
    purpose: "followup" | "reminder" | "offer" | "thankyou"
  ) {
    setLoadingMessage(true);
    try {
      const result = await generateMessageSuggestion(context, type, purpose);
      setMessageSuggestion(result);
    } catch (err) {
      console.error("Error generating message:", err);
    } finally {
      setLoadingMessage(false);
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
              🤖
            </span>
            <h2 className="text-lg font-semibold text-slate-900">
              AI-innsikt
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-600">
            Automatisk analyse basert på kundehistorikk
          </p>
        </div>
        <button
          onClick={handleGenerateSummary}
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Analyserer..." : summary ? "Oppdater" : "Generer innsikt"}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {summary && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <h3 className="mb-2 text-sm font-semibold text-slate-800">
              Oppsummering
            </h3>
            <p className="text-sm text-slate-600">{summary.summary}</p>
          </div>

          {/* Recommendations */}
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <h3 className="mb-2 text-sm font-semibold text-slate-800">
              Anbefalinger
            </h3>
            <ul className="space-y-2">
              {summary.recommendations.map((rec, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-slate-600"
                >
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] text-indigo-700">
                    {idx + 1}
                  </span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          {/* Next Action */}
          {summary.suggestedNextAction && (
            <div className="rounded-lg bg-emerald-50 p-4">
              <h3 className="mb-1 text-sm font-semibold text-emerald-800">
                Neste steg
              </h3>
              <p className="text-sm text-emerald-700">
                {summary.suggestedNextAction}
              </p>
            </div>
          )}

          {/* Message Suggestions */}
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-slate-800">
              Foreslå melding
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleGenerateMessage("sms", "followup")}
                disabled={loadingMessage}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
              >
                📱 SMS: Oppfølging
              </button>
              <button
                onClick={() => handleGenerateMessage("sms", "reminder")}
                disabled={loadingMessage}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
              >
                📱 SMS: Påminnelse
              </button>
              <button
                onClick={() => handleGenerateMessage("sms", "offer")}
                disabled={loadingMessage}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
              >
                📱 SMS: Tilbud
              </button>
              <button
                onClick={() => handleGenerateMessage("email", "followup")}
                disabled={loadingMessage}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
              >
                ✉️ E-post: Oppfølging
              </button>
              <button
                onClick={() => handleGenerateMessage("email", "offer")}
                disabled={loadingMessage}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
              >
                ✉️ E-post: Tilbud
              </button>
            </div>

            {loadingMessage && (
              <p className="mt-3 text-xs text-slate-500">
                Genererer meldingsforslag...
              </p>
            )}

            {messageSuggestion && (
              <div className="mt-4 rounded-lg border border-indigo-200 bg-indigo-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-indigo-600">
                    {messageSuggestion.type === "sms" ? "SMS" : "E-post"}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        messageSuggestion.subject
                          ? `${messageSuggestion.subject}\n\n${messageSuggestion.body}`
                          : messageSuggestion.body
                      );
                    }}
                    className="text-xs text-indigo-600 hover:text-indigo-700"
                  >
                    Kopier
                  </button>
                </div>
                {messageSuggestion.subject && (
                  <p className="mb-2 text-sm font-medium text-slate-800">
                    Emne: {messageSuggestion.subject}
                  </p>
                )}
                <p className="whitespace-pre-wrap text-sm text-slate-700">
                  {messageSuggestion.body}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {!summary && !loading && (
        <div className="rounded-lg border border-dashed border-indigo-300 bg-white/50 p-8 text-center">
          <p className="text-sm text-slate-500">
            Klikk &quot;Generer innsikt&quot; for å få AI-drevet analyse av denne kunden.
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Analysen ser på bookinghistorikk, tjenester, og foreslår neste steg.
          </p>
        </div>
      )}
    </section>
  );
}
