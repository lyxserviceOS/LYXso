'use client';

import { useState } from 'react';
import { Shield, ChevronDown, ChevronUp, FileText, Calendar, CheckCircle, Clock } from 'lucide-react';

type CoatingJob = {
  id: string;
  product_name: string;
  start_date: string;
  warranty_years: number;
  warranty_expires_at: string;
  vehicles: { registration_number: string; model: string } | null;
  coating_certificates: Array<{
    id: string;
    certificate_number: string;
    public_token: string;
  }> | null;
  coating_followups: Array<{
    id: string;
    scheduled_date: string;
    performed_date: string | null;
    status: string;
    notes: string | null;
  }>;
};

type Props = {
  coatingJob: CoatingJob;
  expired?: boolean;
};

export default function CoatingJobCard({ coatingJob, expired = false }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const certificate = coatingJob.coating_certificates?.[0];
  const startDate = new Date(coatingJob.start_date);
  const expiresAt = new Date(coatingJob.warranty_expires_at);

  // Finn neste planlagte kontroll
  const nextInspection = coatingJob.coating_followups.find(
    (followup) => followup.status === 'scheduled' && !followup.performed_date
  );

  return (
    <div className={`card ${expired ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className={`p-2 rounded-lg ${expired ? 'bg-slate-100' : 'bg-purple-50'}`}>
            <Shield className={`w-5 h-5 ${expired ? 'text-slate-400' : 'text-purple-600'}`} />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 mb-1">
              {coatingJob.product_name}
            </h3>

            {coatingJob.vehicles && (
              <p className="text-sm text-slate-600 mb-2">
                {coatingJob.vehicles.registration_number} - {coatingJob.vehicles.model}
              </p>
            )}

            <div className="text-sm space-y-1">
              <p className="text-slate-600">
                Påført: {startDate.toLocaleDateString('nb-NO')}
              </p>
              <p className={expired ? 'text-red-600' : 'text-slate-600'}>
                Garanti til: {expiresAt.toLocaleDateString('nb-NO')}
                {expired && ' (utgått)'}
              </p>

              {nextInspection && !expired && (
                <p className="text-blue-600 font-semibold flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Neste kontroll: {new Date(nextInspection.scheduled_date).toLocaleDateString('nb-NO')}
                </p>
              )}
            </div>

            {certificate && !expired && (
              <button
                onClick={() => setShowCertificate(true)}
                className="mt-3 px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Åpne garantisertifikat
              </button>
            )}
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-slate-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-600" />
          )}
        </button>
      </div>

      {/* Expanded - Kontroll-historikk */}
      {expanded && coatingJob.coating_followups.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <h4 className="font-semibold text-slate-900 text-sm mb-3">Kontroll-historikk</h4>
          <div className="space-y-2">
            {coatingJob.coating_followups.map((followup) => (
              <div key={followup.id} className="flex items-start gap-3 text-sm">
                {followup.performed_date ? (
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                ) : (
                  <Clock className="w-4 h-4 text-blue-600 mt-0.5" />
                )}
                <div>
                  <p className="text-slate-900">
                    {followup.performed_date ? (
                      <>
                        Utført {new Date(followup.performed_date).toLocaleDateString('nb-NO')}
                      </>
                    ) : (
                      <>
                        Planlagt {new Date(followup.scheduled_date).toLocaleDateString('nb-NO')}
                      </>
                    )}
                  </p>
                  {followup.notes && (
                    <p className="text-slate-600 mt-1">{followup.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {showCertificate && certificate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  Garantisertifikat
                </h2>
                <button
                  onClick={() => setShowCertificate(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              {/* Certificate content */}
              <div className="space-y-6 border border-slate-200 rounded-lg p-6">
                <div className="text-center border-b border-slate-200 pb-6">
                  <Shield className="w-16 h-16 text-purple-600 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {coatingJob.product_name}
                  </h3>
                  <p className="text-slate-600">
                    Sertifikatnummer: {certificate.certificate_number}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600 mb-1">Kjøretøy:</p>
                    <p className="font-semibold text-slate-900">
                      {coatingJob.vehicles?.registration_number} - {coatingJob.vehicles?.model}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600 mb-1">Påført dato:</p>
                    <p className="font-semibold text-slate-900">
                      {startDate.toLocaleDateString('nb-NO')}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600 mb-1">Garantiperiode:</p>
                    <p className="font-semibold text-slate-900">
                      {coatingJob.warranty_years} år
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600 mb-1">Gyldig til:</p>
                    <p className="font-semibold text-slate-900">
                      {expiresAt.toLocaleDateString('nb-NO')}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h4 className="font-semibold text-slate-900 mb-2">Garantibetingelser:</h4>
                  <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                    <li>Bilen må vaskes regelmessig (anbefalt hver 2. uke)</li>
                    <li>Unngå aggressiv kjøring første 48 timer</li>
                    <li>Møt til planlagte kontroller</li>
                    <li>Kontakt oss ved skader eller problemer</li>
                  </ul>
                </div>

                <div className="text-center pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-500">
                    Dette sertifikatet er digitalt signert og verifisert av LYXso
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3 justify-end">
                <button
                  onClick={() => setShowCertificate(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
                >
                  Lukk
                </button>
                <button
                  onClick={() => {
                    window.open(`/sertifikat/${certificate.public_token}`, '_blank');
                  }}
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Åpne i ny fane
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
