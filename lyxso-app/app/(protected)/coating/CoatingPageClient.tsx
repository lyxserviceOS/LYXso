// app/(protected)/coating/CoatingPageClient.tsx
"use client";

import React, { useState } from "react";
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
import CoatingCertificateModal from "@/components/coating/CoatingCertificateModal";

const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID ?? "";

// Extended job type with customer/vehicle info
type ExtendedCoatingJob = CoatingJob & { 
  customer_name: string; 
  customer_phone?: string;
  customer_email?: string;
  vehicle_info: string;
  vehicle_reg?: string;
};

// Mock data for demonstration
const MOCK_JOBS: ExtendedCoatingJob[] = [
  {
    id: "1",
    org_id: ORG_ID,
    customer_id: "c1",
    customer_name: "Ola Nordmann",
    customer_phone: "912 34 567",
    customer_email: "ola@example.com",
    vehicle_id: "v1",
    vehicle_info: "Tesla Model 3 - EL12345",
    vehicle_reg: "EL12345",
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
    customer_phone: "987 65 432",
    customer_email: "kari@example.com",
    vehicle_id: "v2",
    vehicle_info: "BMW X5 - AB98765",
    vehicle_reg: "AB98765",
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
  {
    id: "3",
    org_id: ORG_ID,
    customer_id: "c3",
    customer_name: "Erik Olsen",
    customer_phone: "456 78 901",
    customer_email: "erik@example.com",
    vehicle_id: "v3",
    vehicle_info: "Audi e-tron GT - EK33333",
    vehicle_reg: "EK33333",
    booking_id: null,
    product_name: "Ceramic Pro Light",
    product_brand: "Ceramic Pro",
    layers: 1,
    warranty_years: 2,
    warranty_expires_at: "2026-11-10",
    price: 8500,
    currency: "NOK",
    status: "completed",
    notes: "Kun frontparti og tak",
    performed_by: "Kari Detailer",
    performed_at: "2024-11-10",
    created_at: "2024-11-08",
    updated_at: "2024-11-10",
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

// Mock existing customers for autocomplete
const MOCK_CUSTOMERS = [
  { id: "c1", name: "Ola Nordmann", phone: "912 34 567", email: "ola@example.com" },
  { id: "c2", name: "Kari Hansen", phone: "987 65 432", email: "kari@example.com" },
  { id: "c3", name: "Erik Olsen", phone: "456 78 901", email: "erik@example.com" },
  { id: "c4", name: "Lisa Berg", phone: "321 98 765", email: "lisa@example.com" },
  { id: "c5", name: "Per Johansen", phone: "654 32 109", email: "per@example.com" },
  { id: "c6", name: "Anna Larsen", phone: "789 01 234", email: "anna@example.com" },
  { id: "c7", name: "Jonas Pedersen", phone: "234 56 789", email: "jonas@example.com" },
];

export default function CoatingPageClient() {
  const { loading, error, plan, features } = useOrgPlan();
  const hasLyxVision = features.lyxVision;
  
  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [followups, setFollowups] = useState(MOCK_FOLLOWUPS);
  const [selectedJob, setSelectedJob] = useState<ExtendedCoatingJob | null>(null);
  const [viewMode, setViewMode] = useState<"pipeline" | "list">("pipeline");
  
  // Modal states
  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const [showFollowupModal, setShowFollowupModal] = useState(false);
  const [showCustomerTimeline, setShowCustomerTimeline] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [followupToRegister, setFollowupToRegister] = useState<{ job: ExtendedCoatingJob; followupNum: number } | null>(null);
  
  // Customer autocomplete state
  const [customerSuggestions, setCustomerSuggestions] = useState<typeof MOCK_CUSTOMERS>([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  
  // New job form state
  const [newJob, setNewJob] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    vehicle_info: "",
    vehicle_reg: "",
    product_name: "",
    product_brand: "",
    layers: 1,
    warranty_years: 5,
    price: 0,
    notes: "",
    performed_by: "",
  });
  
  // Handle customer name input with autocomplete
  const handleCustomerNameChange = (value: string) => {
    setNewJob({ ...newJob, customer_name: value });
    
    if (value.length >= 2) {
      const matches = MOCK_CUSTOMERS.filter(c => 
        c.name.toLowerCase().includes(value.toLowerCase())
      );
      setCustomerSuggestions(matches);
      setShowCustomerDropdown(matches.length > 0);
    } else {
      setCustomerSuggestions([]);
      setShowCustomerDropdown(false);
    }
  };
  
  // Select customer from dropdown
  const handleSelectCustomer = (customer: typeof MOCK_CUSTOMERS[0]) => {
    setNewJob({
      ...newJob,
      customer_name: customer.name,
      customer_phone: customer.phone,
      customer_email: customer.email,
    });
    setShowCustomerDropdown(false);
    setCustomerSuggestions([]);
  };
  
  // Followup registration form state
  const [followupForm, setFollowupForm] = useState({
    condition_rating: 5,
    notes: "",
    inspector_name: "",
  });
  
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
  const getPipelineStage = (job: ExtendedCoatingJob): CoatingPipelineStage => {
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

  // Create new coating job
  const handleCreateJob = () => {
    const newId = `job-${Date.now()}`;
    const warrantyDate = new Date();
    warrantyDate.setFullYear(warrantyDate.getFullYear() + newJob.warranty_years);
    
    const job: ExtendedCoatingJob = {
      id: newId,
      org_id: ORG_ID,
      customer_id: `c-${Date.now()}`,
      customer_name: newJob.customer_name,
      customer_phone: newJob.customer_phone,
      customer_email: newJob.customer_email,
      vehicle_id: `v-${Date.now()}`,
      vehicle_info: `${newJob.vehicle_info} - ${newJob.vehicle_reg}`,
      vehicle_reg: newJob.vehicle_reg,
      booking_id: null,
      product_name: newJob.product_name,
      product_brand: newJob.product_brand || null,
      layers: newJob.layers,
      warranty_years: newJob.warranty_years,
      warranty_expires_at: warrantyDate.toISOString().split('T')[0],
      price: newJob.price,
      currency: "NOK",
      status: "completed",
      notes: newJob.notes || null,
      performed_by: newJob.performed_by || null,
      performed_at: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // Create scheduled followups for the warranty period
    const newFollowups: CoatingFollowup[] = [];
    for (let i = 1; i <= Math.min(newJob.warranty_years, 5); i++) {
      const scheduledDate = new Date();
      scheduledDate.setFullYear(scheduledDate.getFullYear() + i);
      
      newFollowups.push({
        id: `f-${newId}-${i}`,
        coating_job_id: newId,
        org_id: ORG_ID,
        followup_number: i,
        scheduled_at: scheduledDate.toISOString().split('T')[0],
        completed_at: null,
        status: "scheduled",
        inspector_id: null,
        inspector_name: null,
        condition_rating: null,
        notes: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
    
    setJobs([...jobs, job]);
    setFollowups([...followups, ...newFollowups]);
    setShowNewJobModal(false);
    setNewJob({
      customer_name: "",
      customer_phone: "",
      customer_email: "",
      vehicle_info: "",
      vehicle_reg: "",
      product_name: "",
      product_brand: "",
      layers: 1,
      warranty_years: 5,
      price: 0,
      notes: "",
      performed_by: "",
    });
  };

  // Register followup inspection
  const handleRegisterFollowup = () => {
    if (!followupToRegister) return;
    
    const { job, followupNum } = followupToRegister;
    const existingFollowup = followups.find(
      f => f.coating_job_id === job.id && f.followup_number === followupNum
    );
    
    if (existingFollowup) {
      // Update existing followup
      setFollowups(followups.map(f => 
        f.id === existingFollowup.id
          ? {
              ...f,
              status: "completed" as FollowupStatus,
              completed_at: new Date().toISOString().split('T')[0],
              condition_rating: followupForm.condition_rating,
              notes: followupForm.notes || null,
              inspector_name: followupForm.inspector_name || null,
              updated_at: new Date().toISOString(),
            }
          : f
      ));
    } else {
      // Create new followup record
      const newFollowup: CoatingFollowup = {
        id: `f-${job.id}-${followupNum}-${Date.now()}`,
        coating_job_id: job.id,
        org_id: ORG_ID,
        followup_number: followupNum,
        scheduled_at: new Date().toISOString().split('T')[0],
        completed_at: new Date().toISOString().split('T')[0],
        status: "completed",
        inspector_id: null,
        inspector_name: followupForm.inspector_name || null,
        condition_rating: followupForm.condition_rating,
        notes: followupForm.notes || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setFollowups([...followups, newFollowup]);
    }
    
    setShowFollowupModal(false);
    setFollowupToRegister(null);
    setFollowupForm({ condition_rating: 5, notes: "", inspector_name: "" });
  };

  // Open followup registration modal
  const openFollowupRegistration = (job: ExtendedCoatingJob, followupNum: number) => {
    setFollowupToRegister({ job, followupNum });
    setShowFollowupModal(true);
  };

  // Get customer coating history
  const getCustomerHistory = (customerId: string) => {
    return jobs.filter(j => j.customer_id === customerId);
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
              onClick={() => setShowNewJobModal(true)}
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
                            onClick={() => {
                              // Find the next followup number to register
                              const jobFollowups = followups.filter(f => f.coating_job_id === selectedJob.id);
                              const completedCount = jobFollowups.filter(f => f.status === "completed").length;
                              const nextFollowupNum = Math.min(completedCount + 1, 5);
                              openFollowupRegistration(selectedJob, nextFollowupNum);
                            }}
                            className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
                          >
                            Registrer kontroll
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowCertificateModal(true)}
                            className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-700"
                          >
                            📄 Sertifikat
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowCustomerTimeline(true)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            Kundehistorikk
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

      {/* NEW JOB MODAL */}
      {showNewJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-semibold">Ny coatingjobb</h2>
              <button
                type="button"
                onClick={() => setShowNewJobModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-3">Kundeinformasjon</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Kundenavn *</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={newJob.customer_name}
                        onChange={e => handleCustomerNameChange(e.target.value)}
                        onBlur={() => setTimeout(() => setShowCustomerDropdown(false), 200)}
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="Ola Nordmann"
                        autoComplete="off"
                      />
                      {/* Customer autocomplete dropdown */}
                      {showCustomerDropdown && customerSuggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {customerSuggestions.map(customer => (
                            <button
                              key={customer.id}
                              type="button"
                              onClick={() => handleSelectCustomer(customer)}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50 flex flex-col border-b border-slate-100 last:border-0"
                            >
                              <span className="font-medium text-slate-900">{customer.name}</span>
                              <span className="text-xs text-slate-500">{customer.phone} • {customer.email}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Skriv minst 2 tegn for å søke blant eksisterende kunder
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Telefon</label>
                    <input
                      type="tel"
                      value={newJob.customer_phone}
                      onChange={e => setNewJob({ ...newJob, customer_phone: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="912 34 567"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">E-post</label>
                    <input
                      type="email"
                      value={newJob.customer_email}
                      onChange={e => setNewJob({ ...newJob, customer_email: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="kunde@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Info */}
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-3">Kjøretøy</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Bilmerke og modell *</label>
                    <input
                      type="text"
                      value={newJob.vehicle_info}
                      onChange={e => setNewJob({ ...newJob, vehicle_info: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="Tesla Model 3"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Registreringsnummer *</label>
                    <input
                      type="text"
                      value={newJob.vehicle_reg}
                      onChange={e => setNewJob({ ...newJob, vehicle_reg: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 uppercase"
                      placeholder="EL12345"
                    />
                  </div>
                </div>
              </div>

              {/* Coating Details */}
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-3">Coating-detaljer</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Produktnavn *</label>
                    <input
                      type="text"
                      value={newJob.product_name}
                      onChange={e => setNewJob({ ...newJob, product_name: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="Ceramic Pro 9H"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Merke/produsent</label>
                    <input
                      type="text"
                      value={newJob.product_brand}
                      onChange={e => setNewJob({ ...newJob, product_brand: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="Ceramic Pro"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Antall lag</label>
                    <select
                      value={newJob.layers}
                      onChange={e => setNewJob({ ...newJob, layers: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 4, 5].map(n => (
                        <option key={n} value={n}>{n} lag</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Garantitid (år)</label>
                    <select
                      value={newJob.warranty_years}
                      onChange={e => setNewJob({ ...newJob, warranty_years: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 4, 5, 7, 9, 10].map(n => (
                        <option key={n} value={n}>{n} år</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Pris (NOK)</label>
                    <input
                      type="number"
                      value={newJob.price || ""}
                      onChange={e => setNewJob({ ...newJob, price: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="15000"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Utført av</label>
                    <input
                      type="text"
                      value={newJob.performed_by}
                      onChange={e => setNewJob({ ...newJob, performed_by: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="Anders Mekaniker"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Notater</label>
                <textarea
                  value={newJob.notes}
                  onChange={e => setNewJob({ ...newJob, notes: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Eventuelle notater om jobben..."
                />
              </div>

              {/* Info box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-700">
                  <strong>Automatisk planlegging:</strong> Når du oppretter jobben, vil systemet automatisk 
                  planlegge årlige kontroller for hele garantiperioden ({newJob.warranty_years} kontroller).
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
              <button
                type="button"
                onClick={() => setShowNewJobModal(false)}
                className="px-4 py-2 border rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Avbryt
              </button>
              <button
                type="button"
                onClick={handleCreateJob}
                disabled={!newJob.customer_name || !newJob.vehicle_info || !newJob.vehicle_reg || !newJob.product_name}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Opprett coatingjobb
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOLLOWUP REGISTRATION MODAL */}
      {showFollowupModal && followupToRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold">Registrer kontroll</h2>
                <p className="text-sm text-slate-500">
                  {followupToRegister.followupNum}. årskontroll for {followupToRegister.job.customer_name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowFollowupModal(false);
                  setFollowupToRegister(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Job summary */}
              <div className="bg-slate-50 rounded-lg p-3 text-xs space-y-1">
                <p><strong>Kjøretøy:</strong> {followupToRegister.job.vehicle_info}</p>
                <p><strong>Produkt:</strong> {followupToRegister.job.product_name}</p>
                <p><strong>Utført:</strong> {followupToRegister.job.performed_at ? new Date(followupToRegister.job.performed_at).toLocaleDateString("nb-NO") : "—"}</p>
              </div>

              {/* Condition rating */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tilstandsvurdering
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFollowupForm({ ...followupForm, condition_rating: rating })}
                      className={`flex-1 py-3 rounded-lg border-2 transition ${
                        followupForm.condition_rating === rating
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="text-lg font-semibold">{rating}</div>
                      <div className="text-[10px] text-slate-500">
                        {rating === 1 && "Dårlig"}
                        {rating === 2 && "Under snitt"}
                        {rating === 3 && "Akseptabel"}
                        {rating === 4 && "God"}
                        {rating === 5 && "Utmerket"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Inspector */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Kontrollør
                </label>
                <input
                  type="text"
                  value={followupForm.inspector_name}
                  onChange={e => setFollowupForm({ ...followupForm, inspector_name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="Navn på den som utførte kontrollen"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notater fra inspeksjon
                </label>
                <textarea
                  value={followupForm.notes}
                  onChange={e => setFollowupForm({ ...followupForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Observasjoner, anbefalinger, eventuelle skader..."
                />
              </div>

              {/* Image upload placeholder */}
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center">
                <svg className="mx-auto w-8 h-8 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xs text-slate-500">
                  Last opp bilder fra inspeksjonen (kommer snart)
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
              <button
                type="button"
                onClick={() => {
                  setShowFollowupModal(false);
                  setFollowupToRegister(null);
                }}
                className="px-4 py-2 border rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Avbryt
              </button>
              <button
                type="button"
                onClick={handleRegisterFollowup}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
              >
                Registrer kontroll
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOMER TIMELINE MODAL */}
      {showCustomerTimeline && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold">Kundehistorikk</h2>
                <p className="text-sm text-slate-500">{selectedJob.customer_name}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCustomerTimeline(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              {/* Customer info */}
              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500 text-xs">Telefon</p>
                    <p className="font-medium">{selectedJob.customer_phone || "—"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">E-post</p>
                    <p className="font-medium">{selectedJob.customer_email || "—"}</p>
                  </div>
                </div>
              </div>

              {/* Coating history */}
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Coatingjobber</h3>
              <div className="space-y-4">
                {getCustomerHistory(selectedJob.customer_id).map(job => {
                  const jobFollowups = followups.filter(f => f.coating_job_id === job.id);
                  const completedFollowups = jobFollowups.filter(f => f.status === "completed");
                  const nextScheduled = jobFollowups.find(f => f.status === "scheduled");
                  
                  return (
                    <div key={job.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium text-slate-900">{job.vehicle_info}</p>
                          <p className="text-xs text-slate-500">{job.product_name} • {job.layers} lag</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                          {job.status === "completed" ? "Fullført" : job.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 text-xs mb-3">
                        <div>
                          <p className="text-slate-500">Utført</p>
                          <p className="font-medium">
                            {job.performed_at ? new Date(job.performed_at).toLocaleDateString("nb-NO") : "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500">Garanti utløper</p>
                          <p className="font-medium">
                            {job.warranty_expires_at ? new Date(job.warranty_expires_at).toLocaleDateString("nb-NO") : "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500">Pris</p>
                          <p className="font-medium">{job.price?.toLocaleString("nb-NO")} NOK</p>
                        </div>
                      </div>
                      
                      {/* Followup progress */}
                      <div className="border-t pt-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-slate-600">Kontroller: {completedFollowups.length}/{job.warranty_years}</p>
                          {nextScheduled && (
                            <p className="text-xs text-blue-600">
                              Neste: {new Date(nextScheduled.scheduled_at).toLocaleDateString("nb-NO")}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {Array.from({ length: job.warranty_years }, (_, i) => i + 1).map(num => {
                            const fu = jobFollowups.find(f => f.followup_number === num);
                            return (
                              <div
                                key={num}
                                className={`flex-1 h-2 rounded ${
                                  fu?.status === "completed" 
                                    ? "bg-emerald-500" 
                                    : fu?.status === "scheduled"
                                    ? "bg-blue-200"
                                    : "bg-slate-200"
                                }`}
                                title={`${num}. kontroll: ${fu?.status || "ikke planlagt"}`}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Next recommended action */}
              {(() => {
                const customerJobs = getCustomerHistory(selectedJob.customer_id);
                const allFollowups = customerJobs.flatMap(job => 
                  followups.filter(f => f.coating_job_id === job.id)
                );
                const nextScheduled = allFollowups
                  .filter(f => f.status === "scheduled")
                  .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())[0];
                
                if (nextScheduled) {
                  const job = customerJobs.find(j => j.id === nextScheduled.coating_job_id);
                  return (
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-1">Neste anbefalte kontroll</h4>
                      <p className="text-sm text-blue-700">
                        {nextScheduled.followup_number}. årskontroll for {job?.vehicle_info} • {new Date(nextScheduled.scheduled_at).toLocaleDateString("nb-NO")}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCustomerTimeline(false);
                          if (job) {
                            setSelectedJob(job);
                            openFollowupRegistration(job, nextScheduled.followup_number);
                          }
                        }}
                        className="mt-2 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700"
                      >
                        Registrer denne kontrollen
                      </button>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </div>
        </div>
      )}
      
      {/* CERTIFICATE MODAL */}
      {selectedJob && (
        <CoatingCertificateModal
          orgId={ORG_ID}
          jobId={selectedJob.id}
          customerName={selectedJob.customer_name}
          vehicleInfo={selectedJob.vehicle_info}
          isOpen={showCertificateModal}
          onClose={() => setShowCertificateModal(false)}
        />
      )}
    </div>
  );
}
