"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import AdminNav from "@/components/AdminNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        router.replace("/login");
        return;
      }

      // Sjekk om brukeren er admin (post@lyxbilpleie.no eller andre admin-eposer)
      const adminEmails = [
        "post@lyxbilpleie.no",
        "admin@lyxso.no",
        // Legg til flere admin-eposer her
      ];

      if (!adminEmails.includes(user.email || "")) {
        router.replace("/kontrollpanel");
        return;
      }

      setIsAdmin(true);
    } catch (err) {
      console.error("Feil ved admin-sjekk:", err);
      router.replace("/kontrollpanel");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto" />
          <p className="text-sm text-slate-400">Sjekker admin-tilgang...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900">
        <AdminNav />
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Bar */}
        <header className="border-b border-slate-800 bg-slate-900 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span>Superadministrator</span>
              <button
                onClick={() => router.push("/kontrollpanel")}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-slate-300 transition-colors hover:bg-slate-700"
              >
                ← Tilbake til Portal
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
