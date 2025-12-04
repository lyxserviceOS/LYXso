"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type FormState = {
  email: string;
  password: string;
};

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const nextPath = searchParams.get("next") || "/kontrollpanel";

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: form.email.trim(),
          password: form.password,
        });

      if (signInError) {
        console.error("Supabase signIn error:", signInError);

        // Liten mer menneskelig feilmelding
        if (
          signInError.message
            ?.toLowerCase()
            .includes("invalid login credentials")
        ) {
          setError("Feil e-post eller passord.");
        } else if (
          signInError.message?.toLowerCase().includes("email not confirmed")
        ) {
          setError(
            "E-postadressen er ikke bekreftet enda. Sjekk innboksen din og klikk på bekreftelseslenken."
          );
        } else {
          setError("Kunne ikke logge inn. Prøv igjen.");
        }

        setLoading(false);
        return;
      }

      if (!data.session) {
        setError("Innlogging mislyktes – ingen aktiv session.");
        setLoading(false);
        return;
      }

      setInfo("Innlogging vellykket – sender deg videre …");

      // Liten delay før redirect
      setTimeout(() => {
        router.push(nextPath);
      }, 800);
    } catch (err) {
      console.error("Uventet feil ved innlogging:", err);
      setError("Uventet feil ved innlogging.");
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error("Google OAuth error:", error);
        setError("Kunne ikke logge inn med Google. Prøv igjen.");
        setLoading(false);
      }
      // Browser will redirect to Google, so no need to handle success here
    } catch (err) {
      console.error("Uventet feil ved Google-innlogging:", err);
      setError("Uventet feil ved Google-innlogging.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
        <h1 className="text-xl font-semibold tracking-tight">
          Logg inn i LYXso
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Partnerportal for booking, CRM og drift.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300">
              E-post
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="deg@firma.no"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300">
              Passord
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="••••••••"
              minLength={8}
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-950/40 border border-red-900/60 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          {info && (
            <p className="text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-900/60 rounded-md px-3 py-2">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Logger inn …" : "Logg inn"}
          </button>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-slate-900/70 px-2 text-slate-500">eller</span>
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

          <p className="mt-3 text-[11px] text-slate-500">
            Ny hos oss?{" "}
            <a
              href="/bli-partner"
              className="text-blue-400 hover:text-blue-300"
            >
              Søk om partnertilgang
            </a>
            <span className="mx-1">•</span>
            <a
              href="/register"
              className="text-blue-400 hover:text-blue-300"
            >
              Rask start (self-service)
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">Laster...</div>}>
      <LoginContent />
    </Suspense>
  );
}
