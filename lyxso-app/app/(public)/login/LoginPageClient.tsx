// app/(public)/login/LoginPageClient.tsx
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

type LoginErrorType = "invalid" | "generic";

export default function LoginPageClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorType, setErrorType] = useState<LoginErrorType>("invalid");

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("[Login] Attempting login for:", email.trim());
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error("[Login] Login error:", {
          message: error.message,
          status: error.status,
          name: error.name
        });

        if (
          typeof error.message === "string" &&
          error.message.toLowerCase().includes("invalid login")
        ) {
          setErrorType("invalid");
        } else {
          setErrorType("generic");
        }

        setShowErrorModal(true);
        return;
      }

      if (data?.user) {
        console.log("[Login] Login successful, user:", data.user.id);
        // Riktig innlogging -> til partner-kontrollpanel
        router.push("/kontrollpanel");
      }
    } catch (err: any) {
      console.error("[Login] Uventet login-feil:", err);
      setErrorType("generic");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToResetPassword = () => {
    setShowErrorModal(false);
    const query = email ? `?email=${encodeURIComponent(email.trim())}` : "";
    router.push(`/glemt-passord${query}`);
  };

  const handleGoToRegister = () => {
    setShowErrorModal(false);
    // Bruk eksisterende onboarding-skjema
    router.push("/bli-partner");
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setShowErrorModal(false);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error("Google OAuth error:", error);
        setErrorType("generic");
        setShowErrorModal(true);
        setLoading(false);
      }
      // Browser will redirect to Google, so no need to handle success here
    } catch (err) {
      console.error("Uventet feil ved Google-innlogging:", err);
      setErrorType("generic");
      setShowErrorModal(true);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-md">
        {/* Logo / topptekst */}
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-xs font-semibold tracking-[0.2em]">
            L
          </div>
          <div className="text-center leading-tight">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">
              LYXso
            </p>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Partnerportal
            </p>
          </div>
        </div>

        {/* Kortet */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-6 py-7 shadow-xl">
          <h1 className="text-xl font-semibold text-slate-50 text-center">
            Logg inn som partner
          </h1>
          <p className="mt-2 text-xs text-slate-400 text-center">
            Bruk e-posten og passordet du har fått til LYXso-partnerportalen.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="space-y-1 text-sm">
              <label
                htmlFor="email"
                className="block text-xs font-medium text-slate-200"
              >
                E-post
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500"
                placeholder="fornavn@bedrift.no"
              />
            </div>

            <div className="space-y-1 text-sm">
              <label
                htmlFor="password"
                className="block text-xs font-medium text-slate-200"
              >
                Passord
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Logger inn…" : "Logg inn"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-slate-900/80 px-2 text-slate-500">eller</span>
            </div>
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 hover:border-slate-600 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Fortsett med Google
          </button>

          <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
            <button
              type="button"
              onClick={handleGoToRegister}
              className="hover:text-slate-200"
            >
              Har du ikke bruker? Opprett ny.
            </button>
            <button
              type="button"
              onClick={handleGoToResetPassword}
              className="hover:text-slate-200"
            >
              Glemt passord?
            </button>
          </div>

          <p className="mt-4 text-[10px] text-slate-500 text-center">
            I produksjon kan opprettelse av brukere styres av LYXso-admin og
            partneravtaler.
          </p>
        </div>
      </div>

      {/* Feilmodal ved ugyldig innlogging */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 px-5 py-4 shadow-2xl">
            <h2 className="text-sm font-semibold text-slate-50">
              Innlogging feilet
            </h2>
            <p className="mt-2 text-xs font-medium text-red-200">
              Feil e-post eller passord.
            </p>
            <p className="mt-1 text-[11px] text-slate-300">
              Hvis e-post eller passord ikke stemmer, kan du enten nullstille
              passordet ditt, eller opprette en ny bruker (forutsatt at det er
              riktig for din bedrift).
            </p>

            {errorType === "generic" && (
              <p className="mt-2 text-[11px] text-amber-200/80">
                Hvis du er sikker på at brukernavn og passord er riktige, kan
                det være et midlertidig problem med innloggingen. Prøv igjen
                senere eller kontakt LYXso-support.
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleGoToResetPassword}
                className="inline-flex flex-1 items-center justify-center rounded-md bg-blue-600 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-blue-500"
              >
                Nullstill passord
              </button>
              <button
                type="button"
                onClick={handleGoToRegister}
                className="inline-flex flex-1 items-center justify-center rounded-md border border-slate-600 px-3 py-1.5 text-[11px] font-medium text-slate-100 hover:border-slate-400"
              >
                Opprett ny bruker
              </button>
              <button
                type="button"
                onClick={() => setShowErrorModal(false)}
                className="ml-auto text-[11px] text-slate-400 hover:text-slate-100"
              >
                Lukk
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
