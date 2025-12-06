// app/auth/callback/page.tsx
// OAuth callback handler for Google login/register

"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getApiBaseUrl } from "@/lib/apiConfig";

const API_BASE_URL = getApiBaseUrl();

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string>("Behandler innlogging...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    handleCallback();
  }, []);

  async function handleCallback() {
    try {
      // Get the session from Supabase
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Session error:", sessionError);
        setError("Kunne ikke hente session. Prøv igjen.");
        setTimeout(() => router.push("/login"), 2000);
        return;
      }

      if (!session || !session.user) {
        console.error("No session or user after OAuth callback");
        setError("Ingen aktiv session. Prøv igjen.");
        setTimeout(() => router.push("/login"), 2000);
        return;
      }

      const user = session.user;
      const mode = searchParams.get("mode"); // "register" or null (login)

      setStatus("Sjekker om du har en organisasjon...");

      // Check if user has an org
      const { data: orgMembers, error: orgError } = await supabase
        .from("org_members")
        .select("org_id")
        .eq("user_id", user.id)
        .limit(1);

      if (orgError) {
        console.error("Error checking org_members:", orgError);
        // Continue anyway, treat as no org
      }

      const hasOrg = orgMembers && orgMembers.length > 0;

      if (hasOrg) {
        // User has org, redirect to dashboard
        setStatus("Velkommen tilbake! Sender deg til dashboard...");
        setTimeout(() => router.push("/kontrollpanel"), 800);
        return;
      }

      // User doesn't have org - need to create one
      if (mode === "register") {
        // From register page - create org and redirect to onboarding
        setStatus("Oppretter din bedrift...");

        const fullName = user.user_metadata?.full_name || user.user_metadata?.name || "Bruker";
        const email = user.email || "";
        const companyName = `${fullName} AS`;

        try {
          const res = await fetch(
            `${API_BASE_URL}/api/public/create-org-from-signup`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: user.id,
                email: email,
                fullName: fullName,
                companyName: companyName,
              }),
            }
          );

          if (!res.ok) {
            const body = await res.text().catch(() => "");
            console.error("create-org-from-signup error:", res.status, body);
            setError("Kunne ikke opprette organisasjon. Vennligst kontakt support.");
            return;
          }

          const json = await res.json().catch(() => null);
          console.log("create-org-from-signup OK:", json);

          const orgId = json?.org?.id;
          if (!orgId) {
            setError("Mangler org ID i respons. Vennligst kontakt support.");
            return;
          }

          // Redirect to onboarding wizard with orgId
          setStatus("Sender deg til onboarding...");
          setTimeout(() => {
            router.push(`/register?step=2.1&orgId=${orgId}`);
          }, 800);
        } catch (orgErr) {
          console.error("Feil ved kall til create-org-from-signup:", orgErr);
          setError("Kunne ikke opprette organisasjon. Vennligst prøv igjen.");
        }
      } else {
        // From login page - user has no org, redirect to register
        setStatus("Du har ingen organisasjon ennå. Sender deg til registrering...");
        setTimeout(() => router.push("/register"), 1500);
      }
    } catch (err) {
      console.error("Callback error:", err);
      setError("Uventet feil. Vennligst prøv igjen.");
      setTimeout(() => router.push("/login"), 2000);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-lg text-center">
        {error ? (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold mb-2">Noe gikk galt</h1>
            <p className="text-sm text-slate-400">{error}</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/10 flex items-center justify-center">
              <svg className="animate-spin w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h1 className="text-xl font-semibold mb-2">Vennligst vent</h1>
            <p className="text-sm text-slate-400">{status}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/10 flex items-center justify-center">
            <svg className="animate-spin w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-sm text-slate-400">Laster...</p>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
