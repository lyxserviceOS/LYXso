"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

interface Employee {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  isActive: boolean;
  createdAt: string;
}

export default function EmployeeCardPage({ employeeId }: { employeeId: string }) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
  const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID || "";

  useEffect(() => {
    async function fetchEmployee() {
      if (!ORG_ID || !employeeId) {
        setError("Mangler organisasjons-ID eller ansatt-ID");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${API_BASE_URL}/api/orgs/${encodeURIComponent(ORG_ID)}/employees/${encodeURIComponent(employeeId)}`
        );

        if (!res.ok) {
          throw new Error(`Kunne ikke hente ansatt (${res.status})`);
        }

        const data = await res.json();
        setEmployee(data);
      } catch (err: any) {
        console.error("Feil ved henting av ansatt:", err);
        setError(err?.message ?? "Kunne ikke laste ansattkort");
      } finally {
        setLoading(false);
      }
    }

    fetchEmployee();
  }, [employeeId, API_BASE_URL, ORG_ID]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>
          <p className="text-slate-600">Laster ansattkort...</p>
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <p className="text-red-600">{error || "Ansatt ikke funnet"}</p>
        </div>
      </div>
    );
  }

  const cardUrl = typeof window !== "undefined" ? window.location.href : "";
  const startDate = new Date(employee.createdAt).toLocaleDateString("nb-NO");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 print:bg-white print:p-0">
      {/* Skriv ut knapp (skjules ved utskrift) */}
      <div className="mb-6 flex justify-center print:hidden">
        <button
          onClick={handlePrint}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
        >
          🖨️ Skriv ut kort
        </button>
      </div>

      {/* Ansattkort */}
      <div className="mx-auto max-w-2xl">
        {/* Forsiden av kortet */}
        <div className="mb-8 overflow-hidden rounded-2xl bg-white shadow-2xl print:break-after-page print:shadow-none">
          {/* Header med gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">LYXso</h1>
                <p className="text-blue-100">Ansattkort</p>
              </div>
              <div className="rounded-lg bg-white/20 px-4 py-2 backdrop-blur-sm">
                <p className="text-sm font-medium">ID: {employee.id.slice(0, 8)}</p>
              </div>
            </div>
          </div>

          {/* Ansatt-info */}
          <div className="p-8">
            <div className="mb-8 flex items-center gap-6">
              {/* Profilbilde placeholder */}
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-5xl font-bold text-white shadow-lg">
                {employee.name.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h2 className="mb-2 text-3xl font-bold text-slate-800">{employee.name}</h2>
                <p className="mb-1 text-lg text-slate-600">{employee.role || "Ansatt"}</p>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1">
                  <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                  <span className="text-sm font-medium text-emerald-700">
                    {employee.isActive ? "Aktiv" : "Inaktiv"}
                  </span>
                </div>
              </div>
            </div>

            {/* Kontaktinfo */}
            <div className="mb-8 space-y-4 rounded-xl bg-slate-50 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  📧
                </div>
                <div>
                  <p className="text-xs text-slate-500">E-post</p>
                  <p className="font-medium text-slate-800">{employee.email || "Ikke registrert"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                  📱
                </div>
                <div>
                  <p className="text-xs text-slate-500">Telefon</p>
                  <p className="font-medium text-slate-800">{employee.phone || "Ikke registrert"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  📅
                </div>
                <div>
                  <p className="text-xs text-slate-500">Ansatt siden</p>
                  <p className="font-medium text-slate-800">{startDate}</p>
                </div>
              </div>
            </div>

            {/* QR-kode */}
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white p-6">
              <p className="mb-4 text-sm font-medium text-slate-600">Skann for digital tilgang</p>
              <div className="rounded-lg bg-white p-4 shadow-lg">
                <QRCodeSVG
                  value={cardUrl}
                  size={180}
                  level="H"
                  includeMargin={true}
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>
              <p className="mt-4 text-xs text-slate-400">Ansattkort-URL</p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 bg-slate-50 px-8 py-4">
            <p className="text-center text-xs text-slate-500">
              Dette kortet er personlig og skal behandles konfidensielt
            </p>
          </div>
        </div>

        {/* Baksiden av kortet (valgfri, for fremtidig bruk) */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl print:shadow-none">
          <div className="bg-gradient-to-r from-slate-700 to-slate-900 p-6 text-white">
            <h2 className="text-xl font-bold">Informasjon</h2>
          </div>

          <div className="space-y-4 p-8">
            <div>
              <h3 className="mb-2 font-semibold text-slate-800">Ved tap eller tyveri</h3>
              <p className="text-sm text-slate-600">
                Kontakt din nærmeste leder eller HR-avdelingen umiddelbart.
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-slate-800">Tilgang</h3>
              <p className="text-sm text-slate-600">
                Dette kortet gir tilgang til de områder og systemer som er tildelt din rolle.
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-slate-800">Support</h3>
              <p className="text-sm text-slate-600">
                Ved tekniske problemer eller spørsmål, kontakt support@lyxso.no
              </p>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-slate-50 px-8 py-4">
            <p className="text-center text-xs text-slate-500">
              Utstedt av LYXso • {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>

      {/* Print styling */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          
          body {
            margin: 0;
            padding: 20mm;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:break-after-page {
            page-break-after: always;
          }
          
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          
          .print\\:bg-white {
            background: white !important;
          }
          
          .print\\:p-0 {
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
