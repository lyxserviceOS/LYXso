"use client";

import type { Metadata } from "next";
import Link from "next/link";
import { AIIntegrationPanel } from "@/components/AIIntegrationButtons";
import CrossNavigation, { navigationMaps } from "@/components/CrossNavigation";

export default function MarketingPage() {
  return (
    <div className="h-full w-full bg-[#F8FAFC] px-6 py-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#94A3B8]">
              AI & MARKEDSFØRING • KAMPANJER
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#0F172A]">
              Markedsføring & leads
            </h1>
            <p className="mt-1 text-sm text-[#475569]">
              Ett sted å styre kampanjer, kanaler og leads – tett koblet til
              booking og LYXba.
            </p>
          </div>

          <div className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-xs text-[#64748B] shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
              Status
            </p>
            <p className="mt-1 text-sm text-[#0F172A]">
              ✅ AI-funksjoner aktive
            </p>
            <p className="text-[11px]">
              Kampanjegenerator og annonsetekster klar til bruk
            </p>
          </div>
        </header>

        {/* AI-verktøy seksjon */}
        <section className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#0F172A]">
                AI Markedsføringsverktøy
              </h2>
              <p className="text-sm text-[#475569]">
                La AI hjelpe deg med kampanjer og tekster
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mt-4">
            <Link
              href="/markedsforing/ai"
              className="block p-4 bg-white rounded-xl border border-purple-200 hover:border-purple-400 hover:shadow-md transition-all group"
            >
              <h3 className="text-base font-semibold text-[#0F172A] mb-2 group-hover:text-purple-600">
                🎯 AI Kampanjegenerator
              </h3>
              <p className="text-sm text-[#475569] mb-3">
                Få AI-genererte kampanjeidéer med målgruppe, budsjett og kanaler
              </p>
              <span className="inline-flex items-center text-sm font-medium text-purple-600 group-hover:gap-2 transition-all">
                Åpne verktøy
                <svg className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>

            <Link
              href="/markedsforing/ai"
              className="block p-4 bg-white rounded-xl border border-purple-200 hover:border-purple-400 hover:shadow-md transition-all group"
            >
              <h3 className="text-base font-semibold text-[#0F172A] mb-2 group-hover:text-purple-600">
                ✍️ AI Annonsetekster
              </h3>
              <p className="text-sm text-[#475569] mb-3">
                Generer overbevisende annonsetekster for Facebook, Google og mer
              </p>
              <span className="inline-flex items-center text-sm font-medium text-purple-600 group-hover:gap-2 transition-all">
                Åpne verktøy
                <svg className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>

            <Link
              href="/markedsforing/autopublish"
              className="block p-4 bg-white rounded-xl border border-purple-200 hover:border-purple-400 hover:shadow-md transition-all group"
            >
              <h3 className="text-base font-semibold text-[#0F172A] mb-2 group-hover:text-purple-600">
                📅 Auto-publisering
              </h3>
              <p className="text-sm text-[#475569] mb-3">
                Automatisk publisering til sosiale medier med AI-generert innhold
              </p>
              <span className="inline-flex items-center text-sm font-medium text-purple-600 group-hover:gap-2 transition-all">
                Åpne verktøy
                <svg className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[2fr,1.1fr]">
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-[#0F172A]">
              Kanaloversikt (kommer snart)
            </h2>
            <p className="mt-1 text-xs text-[#64748B]">
              Her kommer en enkel graf med fordeling mellom Meta-annonser,
              Google-annonser og organiske leads.
            </p>

            <div className="mt-4 h-64 rounded-xl border border-dashed border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-center text-xs text-[#94A3B8]">
              Graf / dashboard for kampanjer
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 text-xs text-[#475569] shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                Typiske KPI-er
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-4">
                <li>Antall leads per kanal.</li>
                <li>Bookingrate fra kampanjer.</li>
                <li>Gjennomsnittlig ordreverdi per kampanje.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-dashed border-[#BFDBFE] bg-[#EFF6FF] p-4 text-xs text-[#1E293B]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
                Kobling mot LYXba
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-4">
                <li>AI som kontakter leads automatisk.</li>
                <li>Rapport på hva som faktisk ble booket.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* AI Integration Panel */}
        <AIIntegrationPanel context="marketing" title="🤖 AI-assistanse for markedsføring" />

        {/* Cross Navigation */}
        <CrossNavigation 
          currentModule="Markedsføring"
          relatedModules={navigationMaps.markedsforing}
        />
      </div>
    </div>
  );
}
