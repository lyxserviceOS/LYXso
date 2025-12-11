// components/coating/CoatingCertificateModal.tsx
"use client";

import React, { useState, useEffect } from 'react';
import type { CoatingCertificate } from '@/types/coating';
import {
  generateCoatingCertificate,
  getCoatingCertificate,
  downloadCertificatePDF,
  resendCertificateEmail,
  triggerPDFDownload,
} from '@/lib/api/coatingCertificates';

interface CoatingCertificateModalProps {
  orgId: string;
  jobId: string;
  jobNumber?: string;
  customerName: string;
  vehicleInfo: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CoatingCertificateModal({
  orgId,
  jobId,
  jobNumber,
  customerName,
  vehicleInfo,
  isOpen,
  onClose,
}: CoatingCertificateModalProps) {
  const [certificate, setCertificate] = useState<CoatingCertificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load certificate when modal opens
  useEffect(() => {
    if (isOpen) {
      loadCertificate();
    } else {
      // Reset state when modal closes
      setCertificate(null);
      setError(null);
      setSuccess(null);
    }
  }, [isOpen, jobId]);

  const loadCertificate = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getCoatingCertificate(orgId, jobId);
      setCertificate(response.certificate);
    } catch (err: any) {
      if (err.message === 'Certificate not found') {
        // Certificate doesn't exist yet - this is OK
        setCertificate(null);
      } else {
        setError(err.message || 'Kunne ikke laste sertifikat');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCertificate = async () => {
    setGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await generateCoatingCertificate(orgId, jobId);
      setCertificate(response.certificate);
      setSuccess(
        response.email_sent
          ? 'Sertifikat generert og sendt til kunde på e-post!'
          : 'Sertifikat generert!'
      );
    } catch (err: any) {
      setError(err.message || 'Kunne ikke generere sertifikat');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!certificate) return;

    setDownloading(true);
    setError(null);

    try {
      const blob = await downloadCertificatePDF(orgId, jobId);
      triggerPDFDownload(blob, `coating-certificate-${certificate.certificate_number}.pdf`);
      setSuccess('PDF lastet ned!');
    } catch (err: any) {
      setError(err.message || 'Kunne ikke laste ned PDF');
    } finally {
      setDownloading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!certificate) return;

    setResending(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await resendCertificateEmail(orgId, jobId);
      setSuccess(`Sertifikat sendt til ${response.sent_to}!`);
    } catch (err: any) {
      setError(err.message || 'Kunne ikke sende e-post');
    } finally {
      setResending(false);
    }
  };

  const copyPublicUrl = () => {
    if (!certificate?.public_url) return;
    
    navigator.clipboard.writeText(certificate.public_url);
    setSuccess('Lenke kopiert til utklippstavle!');
    setTimeout(() => setSuccess(null), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Coating Garantisertifikat</h2>
            <p className="text-sm text-slate-500 mt-1">
              {customerName} • {vehicleInfo}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Error message */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-red-800">Feil</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-emerald-700">{success}</p>
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-sm text-slate-600">Laster...</span>
            </div>
          )}

          {/* No certificate exists */}
          {!loading && !certificate && (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">Ingen sertifikat</h3>
              <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
                Dette coating-jobben har ikke et garantisertifikat ennå. 
                Generer et sertifikat for å sende til kunden.
              </p>
              <button
                type="button"
                onClick={handleGenerateCertificate}
                disabled={generating}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {generating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Genererer...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Generer sertifikat</span>
                  </>
                )}
              </button>
              <p className="text-xs text-slate-400 mt-3">
                Sertifikatet vil automatisk sendes til kundens e-postadresse
              </p>
            </div>
          )}

          {/* Certificate exists */}
          {!loading && certificate && (
            <div className="space-y-6">
              {/* Certificate info */}
              <div className="bg-slate-50 rounded-lg p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Sertifikatnummer</p>
                    <p className="text-lg font-mono font-semibold text-slate-900 mt-1">{certificate.certificate_number}</p>
                  </div>
                  {certificate.is_valid !== false ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Gyldig
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      Utløpt
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                  <div>
                    <p className="text-xs font-medium text-slate-500">Utstedt</p>
                    <p className="text-sm text-slate-900 mt-1">
                      {new Date(certificate.issued_at).toLocaleDateString('nb-NO', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Utløper</p>
                    <p className="text-sm text-slate-900 mt-1">
                      {new Date(certificate.expires_at).toLocaleDateString('nb-NO', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-medium text-slate-500">Garanti</p>
                    <p className="text-sm text-slate-900 mt-1">{certificate.warranty_years} år</p>
                  </div>
                </div>
              </div>

              {/* Public URL */}
              {certificate.public_url && (
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-700">Offentlig lenke</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={certificate.public_url}
                      readOnly
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono bg-slate-50"
                    />
                    <button
                      type="button"
                      onClick={copyPublicUrl}
                      className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-xs text-slate-500">
                    Denne lenken kan deles med kunden for å verifisere sertifikatet
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  disabled={downloading}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {downloading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Laster ned...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Last ned PDF</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResendEmail}
                  disabled={resending}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {resending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-700"></div>
                      <span>Sender...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>Send på e-post</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition"
          >
            Lukk
          </button>
        </div>
      </div>
    </div>
  );
}
