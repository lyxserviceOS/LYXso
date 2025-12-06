"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import SidebarNav from "@/components/SidebarNav";
import AIAssistant from "@/components/AIAssistant";
import { supabase } from "@/lib/supabaseClient";
import { OrgPlanProvider, useOrgPlan } from "@/components/OrgPlanContext";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OrgPlanProvider>
      <ProtectedShell>{children}</ProtectedShell>
    </OrgPlanProvider>
  );
}

function ProtectedShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { org, plan, loading: planLoading, error: planError } = useOrgPlan();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Feil ved auth-sjekk:", error);
          if (!isMounted) return;
          setAuthError("Kunne ikke verifisere innlogging.");
          setCheckingAuth(false);
          return;
        }

        const session = data.session;

        if (!session) {
          // Ikke innlogget – send til login
          if (!isMounted) return;
          router.replace("/login");
          return;
        }

        if (isMounted) {
          setCheckingAuth(false);
        }
      } catch (err) {
        console.error("Uventet feil ved auth-sjekk:", err);
        if (isMounted) {
          setAuthError("Uventet feil ved auth-sjekk.");
          setCheckingAuth(false);
        }
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [router]);

  // Mens vi sjekker auth → enkel loader
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
        <p className="text-sm text-slate-400">
          Sjekker innlogging …
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-50">
      {/* VENSTRE: sidebar (desktop only) */}
      <aside className="hidden w-64 border-r border-slate-900 bg-[#020617] md:block">
        <div className="flex h-full flex-col">
          {/* Org-topp i sidebar */}
          <div className="flex items-center gap-2 border-b border-slate-900 px-3 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold">
              L
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-50">
                {org?.name || "LYXso-partner"}
              </span>
              <span className="text-[11px] text-slate-400">
                {planLoading
                  ? "Laster …"
                  : planError
                  ? "Feil ved plan"
                  : org?.id || "Ingen org-id"}
              </span>
            </div>
          </div>

          {/* Meny */}
          <SidebarNav />
        </div>
      </aside>

      {/* MOBIL: Hamburger meny overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu panel */}
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[#020617] border-r border-slate-900 animate-slide-in">
            <div className="flex h-full flex-col">
              {/* Header med close button */}
              <div className="flex items-center justify-between border-b border-slate-900 px-3 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold">
                    L
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-50">
                      {org?.name || "LYXso-partner"}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {plan || "loading..."}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  aria-label="Lukk meny"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Meny */}
              <div onClick={() => setMobileMenuOpen(false)}>
                <SidebarNav />
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* HØYRE: innhold */}
      <div className="flex min-h-screen flex-1 flex-col bg-[#F8FAFC] text-slate-900">
        {/* MOBIL: Top bar med hamburger */}
        <div className="md:hidden sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col gap-1 p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Åpne meny"
          >
            <span className="block h-0.5 w-6 bg-slate-700" />
            <span className="block h-0.5 w-6 bg-slate-700" />
            <span className="block h-0.5 w-6 bg-slate-700" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-[10px] font-bold text-white">
              L
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-900">
                {org?.name || "LYXso"}
              </span>
              <span className="text-[10px] text-slate-500">
                {plan || "loading..."}
              </span>
            </div>
          </div>
          
          <div className="w-10" /> {/* Spacer for balance */}
        </div>

        {/* Plan-banner øverst (desktop) */}
        <div className="hidden md:block border-b border-[#E2E8F0] bg-white/90 px-4 py-2 text-xs text-slate-700">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="rounded-full bg-[#DBEAFE] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#1D4ED8]">
                Plan: {plan ?? "ukjent"}
              </span>

              {!planLoading && !planError && (
                <span className="text-[11px] text-slate-500">
                  Partnerportal aktivert · booking + CRM + tjenester
                </span>
              )}

              {planLoading && (
                <span className="text-[11px] text-slate-500">
                  Henter plan …
                </span>
              )}

              {planError && (
                <span className="text-[11px] text-red-500">
                  Feil ved henting av plan
                </span>
              )}
            </div>

            {/* Gratis-versjon: highlight reklame/oppgradering */}
            {plan === "free" && !planLoading && !planError && (
              <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500 sm:mt-0">
                <span className="rounded border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                  Gratisversjon med reklame
                </span>
                <span>
                  Oppgrader for å fjerne reklame og låse opp AI-moduler.
                </span>
              </div>
            )}

            {authError && (
              <span className="mt-1 text-[11px] text-red-500 sm:mt-0">
                {authError}
              </span>
            )}
          </div>
        </div>

        {/* Selve siden */}
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-4 sm:px-6 lg:px-8">
          {children}
        </main>

        {/* AI Assistent - alltid tilgjengelig */}
        <AIAssistant />
      </div>
    </div>
  );
}
