'use client';

import { useState } from 'react';
import { Shield, FileText, Calendar } from 'lucide-react';
import CoatingJobCard from './CoatingJobCard';

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
  coatingJobs: CoatingJob[];
};

export default function CoatingJobsList({ coatingJobs }: Props) {
  if (coatingJobs.length === 0) {
    return (
      <div className="card text-center py-12">
        <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-600">Du har ingen coating-behandlinger registrert</p>
      </div>
    );
  }

  // Grupper etter status
  const active = coatingJobs.filter((job) => {
    const expiresAt = new Date(job.warranty_expires_at);
    return expiresAt > new Date();
  });

  const expired = coatingJobs.filter((job) => {
    const expiresAt = new Date(job.warranty_expires_at);
    return expiresAt <= new Date();
  });

  // Finn jobber med kommende kontroller
  const upcomingInspections = active.filter((job) => {
    return job.coating_followups.some(
      (followup) => followup.status === 'scheduled' && !followup.performed_date
    );
  });

  return (
    <div className="space-y-6">
      {/* Påminnelse om kommende kontroller */}
      {upcomingInspections.length > 0 && (
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">
                Kommende coating-kontroller
              </h3>
              <p className="text-sm text-blue-800">
                Du har {upcomingInspections.length} coating-jobb(er) med kommende kontroller.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Aktive coating-jobber */}
      {active.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Aktive garantier</h2>
          {active.map((job) => (
            <CoatingJobCard key={job.id} coatingJob={job} />
          ))}
        </div>
      )}

      {/* Utgåtte coating-jobber */}
      {expired.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Utgåtte garantier</h2>
          {expired.map((job) => (
            <CoatingJobCard key={job.id} coatingJob={job} expired />
          ))}
        </div>
      )}
    </div>
  );
}
