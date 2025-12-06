"use client";

import { useState } from "react";
import { Shield, Download, Trash2, AlertTriangle } from "lucide-react";
import * as Sentry from "@sentry/nextjs";

interface Props {
  customerId: string;
  customerEmail: string;
  consents: {
    marketing: boolean;
    data_processing: boolean;
    updated_at: string;
  };
  onConsentsUpdated: () => void;
}

export default function GDPRManagement({
  customerId,
  customerEmail,
  consents,
  onConsentsUpdated,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

  const handleUpdateConsent = async (type: "marketing" | "data_processing", value: boolean) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE}/api/customers/${customerId}/consents`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [type]: value }),
        }
      );

      if (!response.ok) {
        throw new Error("Kunne ikke oppdatere samtykke");
      }

      onConsentsUpdated();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Feil ved oppdatering";
      setError(errorMessage);
      Sentry.captureException(err, {
        extra: { customerId, type, value },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE}/api/customers/${customerId}/export`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Kunne ikke eksportere data");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `customer-data-${customerId}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      Sentry.addBreadcrumb({
        category: "gdpr",
        message: "Customer data exported",
        level: "info",
        data: { customerId },
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Feil ved eksport";
      setError(errorMessage);
      Sentry.captureException(err, {
        extra: { customerId },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteData = async () => {
    if (deleteConfirmText !== "SLETT") {
      setError('Skriv "SLETT" for å bekrefte');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE}/api/customers/${customerId}/gdpr-delete`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Kunne ikke slette data");
      }

      Sentry.addBreadcrumb({
        category: "gdpr",
        message: "Customer data deleted (GDPR)",
        level: "warning",
        data: { customerId },
      });

      // Redirect back to customer list
      window.location.href = "/kunder";
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Feil ved sletting";
      setError(errorMessage);
      Sentry.captureException(err, {
        extra: { customerId },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Consents Section */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <Shield className="h-5 w-5 text-blue-600" />
          <h3 className="font-medium text-slate-900">Samtykker (GDPR)</h3>
        </div>

        <div className="space-y-3">
          {/* Marketing Consent */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consents.marketing}
              onChange={(e) => handleUpdateConsent("marketing", e.target.checked)}
              disabled={loading}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
            />
            <div className="flex-1">
              <div className="font-medium text-slate-900">Markedsføring</div>
              <div className="text-sm text-slate-600">
                Kunden samtykker til å motta markedsføring via e-post og SMS
              </div>
            </div>
          </label>

          {/* Data Processing Consent */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consents.data_processing}
              onChange={(e) => handleUpdateConsent("data_processing", e.target.checked)}
              disabled={loading}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
            />
            <div className="flex-1">
              <div className="font-medium text-slate-900">Databehandling</div>
              <div className="text-sm text-slate-600">
                Kunden samtykker til at vi behandler personopplysninger i henhold til personvernregler
              </div>
            </div>
          </label>
        </div>

        {consents.updated_at && (
          <div className="pt-2 border-t border-slate-200 text-xs text-slate-500">
            Sist oppdatert: {new Date(consents.updated_at).toLocaleString("no-NO")}
          </div>
        )}
      </div>

      {/* Data Export */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Download className="h-5 w-5 text-slate-600" />
          <h3 className="font-medium text-slate-900">Eksporter kundedata</h3>
        </div>
        <p className="text-sm text-slate-600">
          Last ned all data vi har lagret om denne kunden i JSON-format.
          Dette inkluderer kontaktinfo, kjøretøy, bookinger, betalinger og notater.
        </p>
        <button
          onClick={handleExportData}
          disabled={loading}
          className="w-full rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Eksporterer..." : "Eksporter data (JSON)"}
        </button>
      </div>

      {/* Data Deletion */}
      <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <h3 className="font-medium text-red-900">Slett kundedata (GDPR)</h3>
        </div>
        <p className="text-sm text-red-800">
          <strong>ADVARSEL:</strong> Dette vil permanent slette all informasjon om kunden,
          inkludert kontaktinfo, kjøretøy, bookinger, dekkhotell, coating-jobber og historikk.
          Betalingsinformasjon for regnskapsformål beholdes (lovpålagt).
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            <div className="flex items-center justify-center gap-2">
              <Trash2 className="h-4 w-4" />
              Slett kundedata
            </div>
          </button>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-red-900 mb-1">
                Skriv "SLETT" for å bekrefte:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="SLETT"
                className="w-full rounded-md border-2 border-red-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDeleteData}
                disabled={loading || deleteConfirmText !== "SLETT"}
                className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sletter..." : "Bekreft sletting"}
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmText("");
                }}
                disabled={loading}
                className="flex-1 rounded-md bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-300"
              >
                Avbryt
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
