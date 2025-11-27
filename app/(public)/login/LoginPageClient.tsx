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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error("Login error:", error);

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
        // Riktig innlogging -> til partner-kontrollpanel
        router.push("/kontrollpanel");
      }
    } catch (err: any) {
      console.error("Uventet login-feil:", err);
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
