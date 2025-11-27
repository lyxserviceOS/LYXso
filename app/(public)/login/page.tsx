"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type FormState = {
  email: string;
  password: string;
};

export default function LoginPage() {
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

          <p className="mt-3 text-[11px] text-slate-500">
            Har du ikke konto enda?{" "}
            <a
              href="/register"
              className="text-blue-400 hover:text-blue-300"
            >
              Opprett LYXso-konto
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
