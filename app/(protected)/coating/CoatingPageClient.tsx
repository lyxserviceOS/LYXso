// app/(protected)/coating/CoatingPageClient.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useOrgPlan } from "@/lib/useOrgPlan";
import {
  getOrgPlanLabel,
  getOrgPlanShortInfo,
  getOrgPlanPriceInfo,
} from "@/lib/orgPlan";
import type { 
  CoatingJob, 
  CoatingFollowup, 
  CoatingJobStatus,
  FollowupStatus,
  CoatingPipelineStage 
} from "@/types/coating";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";
const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID ?? "";

// Mock data for demonstration
const MOCK_JOBS: (CoatingJob & { customer_name: string; vehicle_info: string })[] = [
  {
    id: "1",
    org_id: ORG_ID,
    customer_id: "c1",
    customer_name: "Ola Nordmann",
    vehicle_id: "v1",
    vehicle_info: "Tesla Model 3 - EL12345",
    booking_id: null,
    product_name: "Ceramic Pro 9H",
    product_brand: "Ceramic Pro",
    layers: 2,
    warranty_years: 5,
    warranty_expires_at: "2029-03-15",
    price: 15000,
    currency: "NOK",
    status: "completed",
    notes: "Fullstendig coating på hele bilen",
    performed_by: "Anders Mekaniker",
    performed_at: "2024-03-15",
    created_at: "2024-03-10",
    updated_at: "2024-03-15",
  },
  {
    id: "2",
    org_id: ORG_ID,
    customer_id: "c2",
    customer_name: "Kari Hansen",
    vehicle_id: "v2",
    vehicle_info: "BMW X5 - AB98765",
    booking_id: null,
    product_name: "Gtechniq Crystal Serum Ultra",
    product_brand: "Gtechniq",
    layers: 1,
    warranty_years: 9,
    warranty_expires_at: "2033-01-20",
    price: 22000,
    currency: "NOK",
    status: "completed",
    notes: null,
    performed_by: "Anders Mekaniker",
    performed_at: "2024-01-20",
    created_at: "2024-01-15",
    updated_at: "2024-01-20",
  },
];

const MOCK_FOLLOWUPS: CoatingFollowup[] = [
  {
    id: "f1",
    coating_job_id: "1",
    org_id: ORG_ID,
    followup_number: 1,
    scheduled_at: "2025-03-15",
    completed_at: null,
    status: "scheduled",
    inspector_id: null,
    inspector_name: null,
    condition_rating: null,
    notes: null,
    created_at: "2024-03-15",
    updated_at: "2024-03-15",
  },
  {
    id: "f2",
    coating_job_id: "2",
    org_id: ORG_ID,
    followup_number: 1,
    scheduled_at: "2025-01-20",
    completed_at: "2025-01-18",
    status: "completed",
    inspector_id: "emp1",
    inspector_name: "Anders",
    condition_rating: 5,
    notes: "Alt ser perfekt ut. Coating holder seg godt.",
    created_at: "2024-01-20",
    updated_at: "2025-01-18",
  },
];

export default function CoatingPageClient() {
  const { loading, error, plan, features } = useOrgPlan();
  const hasLyxVision = features.lyxVision;
  
  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [followups, setFollowups] = useState(MOCK_FOLLOWUPS);
  const [selectedJob, setSelectedJob] = useState<typeof MOCK_JOBS[0] | null>(null);
  const [viewMode, setViewMode] = useState<"pipeline" | "list">("pipeline");
  
  // Stats
  const stats = {
    totalJobs: jobs.length,
    activeWarranties: jobs.filter(j => {
      if (!j.warranty_expires_at) return false;
      return new Date(j.warranty_expires_at) > new Date();
    }).length,
    upcomingFollowups: followups.filter(f => f.status === "scheduled").length,
    completedFollowups: followups.filter(f => f.status === "completed").length,
  };

  // Group jobs by pipeline stage
  const getPipelineStage = (job: typeof MOCK_JOBS[0]): CoatingPipelineStage => {
    const jobFollowups = followups.filter(f => f.coating_job_id === job.id);
    const completedCount = jobFollowups.filter(f => f.status === "completed").length;
    
    if (job.warranty_expires_at && new Date(job.warranty_expires_at) < new Date()) {
      return "warranty_expired";
    }
    
    if (completedCount === 0) return "new_job";
    if (completedCount === 1) return "followup_1";
    if (completedCount === 2) return "followup_2";
    if (completedCount === 3) return "followup_3";
    if (completedCount === 4) return "followup_4";
    return "followup_5";
  };

  const pipelineStages: { key: CoatingPipelineStage; label: string; color: string }[] = [
    { key: "new_job", label: "Ny jobb", color: "bg-blue-500" },
    { key: "followup_1", label: "1. kontroll", color: "bg-emerald-500" },
    { key: "followup_2", label: "2. kontroll", color: "bg-emerald-500" },
    { key: "followup_3", label: "3. kontroll", color: "bg-emerald-500" },
    { key: "followup_4", label: "4. kontroll", color: "bg-emerald-500" },
    { key: "followup_5", label: "5. kontroll", color: "bg-emerald-500" },
    { key: "warranty_expired", label: "Garanti utløpt", color: "bg-slate-400" },
  ];

  const getStatusColor = (status: CoatingJobStatus): string => {
    switch (status) {
      case "completed": return "bg-emerald-100 text-emerald-700";
      case "in_progress": return "bg-blue-100 text-blue-700";
      case "pending": return "bg-amber-100 text-amber-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getFollowupStatusColor = (status: FollowupStatus): string => {
    switch (status) {
      case "completed": return "bg-emerald-100 text-emerald-700";
      case "scheduled": return "bg-blue-100 text-blue-700";
      case "missed": return "bg-red-100 text-red-700";
      case "cancelled": return "bg-slate-100 text-slate-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto px-6 py-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* HEADER */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Coating PRO
            </h1>
            <p className="text-sm text-slate-500">
              Administrer coatingjobber, planlagte kontroller og 5-års garantiløp.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-slate-200 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("pipeline")}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  viewMode === "pipeline" 
                    ? "bg-blue-600 text-white" 
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Pipeline
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  viewMode === "list" 
                    ? "bg-blue-600 text-white" 
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Liste
              </button>
            </div>
            <button
              type="button"
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              + Ny coatingjobb
            </button>
          </div>
        </header>

        {/* PLAN-INFO / STATUS */}
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          {loading && (
            <p className="text-sm text-slate-500">
              Henter plan og funksjoner …
            </p>
          )}

          {error && (
            <p className="text-sm text-red-500">
              Klarte ikke å hente org-plan: {error}
            </p>
          )}

          {!loading && !error && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                  Din LYXso-plan
                </p>
                <p className="text-base font-semibold text-slate-900">
                  {getOrgPlanLabel(plan)}
                </p>
                <p className="text-xs text-slate-500">
                  {getOrgPlanShortInfo(plan)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                  Pris
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {getOrgPlanPriceInfo(plan)}
                </p>
                <Link
                  href="/plan"
                  className="mt-2 inline-flex items-center rounded-md border border-blue-500 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100"
                >
                  Se / endre plan
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500">Totalt jobber</p>
            <p className="text-2xl font-semibold text-slate-900">{stats.totalJobs}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500">Aktive garantier</p>
            <p className="text-2xl font-semibold text-emerald-600">{stats.activeWarranties}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500">Kommende kontroller</p>
            <p className="text-2xl font-semibold text-blue-600">{stats.upcomingFollowups}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500">Fullførte kontroller</p>
            <p className="text-2xl font-semibold text-slate-900">{stats.completedFollowups}</p>
          </div>
        </div>

        {/* INNHOLD */}
        {!loading && !error && (
          <>
            {hasLyxVision ? (
              <>
                {/* Pipeline view */}
                {viewMode === "pipeline" && (
                  <section className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                    <div className="border-b border-slate-200 px-4 py-3">
                      <h2 className="text-sm font-semibold text-slate-900">
                        Coating-løp (Pipeline)
                      </h2>
                      <p className="text-xs text-slate-500">
                        Se alle jobber gruppert etter hvor de er i 5-års garantiløpet.
                      </p>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <div className="min-w-[1000px] flex">
                        {pipelineStages.map(stage => {
                          const stageJobs = jobs.filter(j => getPipelineStage(j) === stage.key);
                          return (
                            <div key={stage.key} className="flex-1 min-w-[140px] border-r border-slate-100 last:border-r-0">
                              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border-b border-slate-100">
                                <span className={`h-2 w-2 rounded-full ${stage.color}`}></span>
                                <span className="text-xs font-medium text-slate-700">{stage.label}</span>
                                <span className="ml-auto text-xs text-slate-400">{stageJobs.length}</span>
                              </div>
                              <div className="p-2 space-y-2 min-h-[300px]">
                                {stageJobs.map(job => (
                                  <div
                                    key={job.id}
                                    onClick={() => setSelectedJob(job)}
                                    className={`rounded-lg border p-2 cursor-pointer transition hover:shadow-md ${
                                      selectedJob?.id === job.id 
                                        ? "border-blue-500 bg-blue-50" 
                                        : "border-slate-200 bg-white hover:border-slate-300"
                                    }`}
                                  >
                                    <p className="text-xs font-medium text-slate-900 truncate">
                                      {job.customer_name}
                                    </p>
                                    <p className="text-[10px] text-slate-500 truncate">
                                      {job.vehicle_info}
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-1">
                                      {job.product_name}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </section>
                )}

                {/* List view */}
                {viewMode === "list" && (
                  <section className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                    <div className="border-b border-slate-200 px-4 py-3">
                      <h2 className="text-sm font-semibold text-slate-900">
                        Alle coatingjobber
                      </h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="border-b border-slate-200 px-4 py-2 text-left font-medium text-slate-600">Kunde</th>
                            <th className="border-b border-slate-200 px-4 py-2 text-left font-medium text-slate-600">Kjøretøy</th>
                            <th className="border-b border-slate-200 px-4 py-2 text-left font-medium text-slate-600">Produkt</th>
                            <th className="border-b border-slate-200 px-4 py-2 text-left font-medium text-slate-600">Garanti utløper</th>
                            <th className="border-b border-slate-200 px-4 py-2 text-left font-medium text-slate-600">Neste kontroll</th>
                            <th className="border-b border-slate-200 px-4 py-2 text-left font-medium text-slate-600">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {jobs.map(job => {
                            const jobFollowups = followups.filter(f => f.coating_job_id === job.id);
                            const nextFollowup = jobFollowups.find(f => f.status === "scheduled");
                            return (
                              <tr
                                key={job.id}
                                onClick={() => setSelectedJob(job)}
                                className={`border-b border-slate-100 cursor-pointer hover:bg-slate-50 ${
                                  selectedJob?.id === job.id ? "bg-blue-50" : ""
                                }`}
                              >
                                <td className="px-4 py-3 font-medium text-slate-900">{job.customer_name}</td>
                                <td className="px-4 py-3 text-slate-600">{job.vehicle_info}</td>
                                <td className="px-4 py-3 text-slate-600">{job.product_name}</td>
                                <td className="px-4 py-3 text-slate-600">
                                  {job.warranty_expires_at 
                                    ? new Date(job.warranty_expires_at).toLocaleDateString("nb-NO")
                                    : "—"}
                                </td>
                                <td className="px-4 py-3 text-slate-600">
                                  {nextFollowup 
                                    ? new Date(nextFollowup.scheduled_at).toLocaleDateString("nb-NO")
                                    : "—"}
                                </td>
                                <td className="px-4 py-3">
                                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${getStatusColor(job.status)}`}>
                                    {job.status === "completed" ? "Fullført" : job.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}

                {/* Selected job detail */}
                {selectedJob && (
                  <section className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                    <div className="border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                      <h2 className="text-sm font-semibold text-slate-900">
                        Detaljer: {selectedJob.customer_name}
                      </h2>
                      <button
                        type="button"
                        onClick={() => setSelectedJob(null)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="p-4 grid gap-6 md:grid-cols-2">
                      {/* Job info */}
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-medium text-slate-700 mb-2">Jobb-informasjon</p>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Kjøretøy</span>
                              <span className="text-slate-900">{selectedJob.vehicle_info}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Produkt</span>
                              <span className="text-slate-900">{selectedJob.product_name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Lag</span>
                              <span className="text-slate-900">{selectedJob.layers}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Garanti</span>
                              <span className="text-slate-900">{selectedJob.warranty_years} år</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Utført</span>
                              <span className="text-slate-900">
                                {selectedJob.performed_at 
                                  ? new Date(selectedJob.performed_at).toLocaleDateString("nb-NO")
                                  : "—"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Pris</span>
                              <span className="text-slate-900">
                                {selectedJob.price?.toLocaleString("nb-NO")} {selectedJob.currency}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {selectedJob.notes && (
                          <div>
                            <p className="text-xs font-medium text-slate-700 mb-1">Notater</p>
                            <p className="text-xs text-slate-600 bg-slate-50 rounded-lg p-2">
                              {selectedJob.notes}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {/* Followups timeline */}
                      <div>
                        <p className="text-xs font-medium text-slate-700 mb-2">Kontroll-tidslinje</p>
                        <div className="space-y-2">
                          {[1, 2, 3, 4, 5].map(num => {
                            const followup = followups.find(
                              f => f.coating_job_id === selectedJob.id && f.followup_number === num
                            );
                            return (
                              <div 
                                key={num}
                                className="flex items-center gap-3 text-xs"
                              >
                                <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-medium ${
                                  followup?.status === "completed"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : followup?.status === "scheduled"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-slate-100 text-slate-400"
                                }`}>
                                  {num}
                                </span>
                                <div className="flex-1">
                                  <span className="text-slate-700">
                                    {num}. årskontroll
                                  </span>
                                </div>
                                {followup && (
                                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${getFollowupStatusColor(followup.status)}`}>
                                    {followup.status === "completed" && followup.completed_at
                                      ? `Fullført ${new Date(followup.completed_at).toLocaleDateString("nb-NO")}`
                                      : followup.status === "scheduled"
                                      ? `Planlagt ${new Date(followup.scheduled_at).toLocaleDateString("nb-NO")}`
                                      : followup.status}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        
                        <div className="mt-4 flex gap-2">
                          <button
                            type="button"
                            className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
                          >
                            Registrer kontroll
                          </button>
                          <button
                            type="button"
                            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            Se bilder
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* LYXvision info */}
                <section className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Coating-løp & sjekklister
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Sett opp standardiserte løp for forvask, polering,
                      wipedown og coating. Hver jobb kan få en digital
                      sjekkliste som lagres på kunden og kjøretøyet.
                    </p>
                    <p className="mt-3 text-[11px] text-slate-400">
                      Senere kobler vi dette direkte mot LYXvision-brillene
                      slik at du kan se hvilke steg som er gjennomført i sanntid.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Dokumentasjon til kunde
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Lag før/etter-bilder og en enkel rapport som kunden kan
                      få på e-post: hva som er gjort, hvilke produkter som er
                      brukt og når neste årskontroll anbefales.
                    </p>
                  </div>
                </section>
              </>
            ) : (
              <section className="space-y-4">
                <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
                  <h2 className="text-sm font-semibold text-purple-900">
                    Coating PRO er låst på din nåværende plan
                  </h2>
                  <p className="mt-1 text-xs text-purple-700">
                    Coating PRO er en tilleggsmodul der du får full oversikt over
                    coatingjobber, 5-års garantiløp og planlagte kontroller.
                  </p>

                  <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] text-purple-700">
                    <li>Pipeline-visning av alle jobber</li>
                    <li>Automatisk planlegging av årskontroller</li>
                    <li>Dokumentasjon og bilder per jobb</li>
                  </ul>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      href="/plan"
                      className="inline-flex items-center rounded-md bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-700"
                    >
                      Oppgrader plan
                    </Link>
                    <Link
                      href="/addons"
                      className="inline-flex items-center rounded-md border border-purple-300 px-3 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-100"
                    >
                      Se alle tillegg
                    </Link>
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
