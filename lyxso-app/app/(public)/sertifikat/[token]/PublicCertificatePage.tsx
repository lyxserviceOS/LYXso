// app/(public)/sertifikat/[token]/PublicCertificatePage.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPublicCertificate } from '@/lib/api/coatingCertificates';

interface PublicCertificateData {
  certificate_number: string;
  issued_at: string;
  expires_at: string;
  is_valid: boolean;
  warranty_years: number;
  qr_code_url?: string;
  metadata?: Record<string, any>;
  org: {
    name: string;
    logo_url?: string;
    contact_email?: string;
    contact_phone?: string;
  };
  customer: {
    name: string;
  };
  vehicle: {
    registration_number: string;
    make?: string;
    model?: string;
    year?: number;
    color?: string;
  };
  job: {
    start_date?: string;
    product_name: string;
    layers?: number;
  };
}

export default function PublicCertificatePage({ token }: { token: string }) {
  const [certificate, setCertificate] = useState<PublicCertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCertificate();
  }, [token]);

  const loadCertificate = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getPublicCertificate(token);
      setCertificate(response.certificate as any);
    } catch (err: any) {
      setError(err.message || 'Kunne ikke laste sertifikat');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Verifiserer sertifikat...</p>
        </div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-slate-900 mb-2">Ugyldig sertifikat</h1>
          <p className="text-sm text-slate-600 mb-6">
            {error || 'Sertifikatet ble ikke funnet eller er ikke gyldig.'}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Tilbake til hovedsiden
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-4">
            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Coating Garantisertifikat
          </h1>
          <p className="text-slate-600">
            Verifisert og gyldig garantidokument
          </p>
        </div>

        {/* Main Certificate Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          {/* Status Banner */}
          {certificate.is_valid ? (
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-6 text-white">
              <div className="flex items-center justify-center gap-3">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-lg font-semibold">✓ Gyldig Garantisertifikat</p>
                  <p className="text-sm text-emerald-100">Dette sertifikatet er autentisk og aktivt</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-6 text-white">
              <div className="flex items-center justify-center gap-3">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-lg font-semibold">⚠ Garantien har utløpt</p>
                  <p className="text-sm text-red-100">Dette sertifikatet er ikke lenger aktivt</p>
                </div>
              </div>
            </div>
          )}

          <div className="p-8">
            {/* Certificate Number */}
            <div className="text-center mb-8 pb-8 border-b border-slate-200">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Sertifikatnummer</p>
              <p className="text-3xl font-mono font-bold text-slate-900">{certificate.certificate_number}</p>
            </div>

            {/* Organization Info */}
            <div className="mb-8 pb-8 border-b border-slate-200">
              <div className="flex items-center gap-4 mb-4">
                {certificate.org.logo_url && (
                  <img 
                    src={certificate.org.logo_url} 
                    alt={certificate.org.name}
                    className="w-16 h-16 rounded-lg object-contain bg-slate-50"
                  />
                )}
                <div>
                  <p className="text-sm font-medium text-slate-500">Utstedt av</p>
                  <p className="text-xl font-semibold text-slate-900">{certificate.org.name}</p>
                </div>
              </div>
              {(certificate.org.contact_email || certificate.org.contact_phone) && (
                <div className="flex gap-6 text-sm text-slate-600">
                  {certificate.org.contact_email && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{certificate.org.contact_email}</span>
                    </div>
                  )}
                  {certificate.org.contact_phone && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{certificate.org.contact_phone}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Certificate Details Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-4">Kjøretøy</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-500">Registreringsnummer</p>
                      <p className="text-base font-semibold text-slate-900">{certificate.vehicle.registration_number}</p>
                    </div>
                    {(certificate.vehicle.make || certificate.vehicle.model) && (
                      <div>
                        <p className="text-xs text-slate-500">Merke og modell</p>
                        <p className="text-base text-slate-900">
                          {[certificate.vehicle.make, certificate.vehicle.model].filter(Boolean).join(' ')}
                        </p>
                      </div>
                    )}
                    {certificate.vehicle.year && (
                      <div>
                        <p className="text-xs text-slate-500">Årsmodell</p>
                        <p className="text-base text-slate-900">{certificate.vehicle.year}</p>
                      </div>
                    )}
                    {certificate.vehicle.color && (
                      <div>
                        <p className="text-xs text-slate-500">Farge</p>
                        <p className="text-base text-slate-900">{certificate.vehicle.color}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-4">Coating-behandling</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-500">Produkt</p>
                      <p className="text-base font-medium text-slate-900">{certificate.job.product_name}</p>
                    </div>
                    {certificate.job.layers && (
                      <div>
                        <p className="text-xs text-slate-500">Antall lag</p>
                        <p className="text-base text-slate-900">{certificate.job.layers}</p>
                      </div>
                    )}
                    {certificate.job.start_date && (
                      <div>
                        <p className="text-xs text-slate-500">Utført dato</p>
                        <p className="text-base text-slate-900">
                          {new Date(certificate.job.start_date).toLocaleDateString('nb-NO', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-4">Garantiinformasjon</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-500">Garantiperiode</p>
                      <p className="text-base font-semibold text-slate-900">{certificate.warranty_years} år</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Utstedt dato</p>
                      <p className="text-base text-slate-900">
                        {new Date(certificate.issued_at).toLocaleDateString('nb-NO', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Gyldig til</p>
                      <p className="text-base text-slate-900">
                        {new Date(certificate.expires_at).toLocaleDateString('nb-NO', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-4">Eier</h3>
                  <div>
                    <p className="text-xs text-slate-500">Kundenavn</p>
                    <p className="text-base text-slate-900">{certificate.customer.name}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code */}
            {certificate.qr_code_url && (
              <div className="text-center pt-8 border-t border-slate-200">
                <img 
                  src={certificate.qr_code_url} 
                  alt="QR Code"
                  className="mx-auto w-32 h-32"
                />
                <p className="text-xs text-slate-500 mt-2">Skann QR-koden for å verifisere sertifikatet</p>
              </div>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex gap-4">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Om dette sertifikatet</h4>
              <p className="text-sm text-blue-800 mb-3">
                Dette er et offisielt garantisertifikat utstedt av {certificate.org.name}. 
                Sertifikatet bekrefter at coating-behandlingen er utført profesjonelt og 
                dekkes av garanti i {certificate.warranty_years} år fra utstedelsesdato.
              </p>
              <p className="text-sm text-blue-800">
                Ved spørsmål om garantien, ta kontakt med {certificate.org.name} på 
                kontaktinformasjonen oppgitt over.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Tilbake til hovedsiden
          </Link>
        </div>
      </div>
    </div>
  );
}
