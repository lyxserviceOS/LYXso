"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_LYXSO_API_URL ??
  process.env.NEXT_PUBLIC_API_BASE ??
  "http://localhost:4000";

type FormState = {
  companyName: string;
  fullName: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    companyName: "",
    fullName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      // 1) Opprett bruker i Supabase Auth (med e-postbekreftelse)
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          emailRedirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/login`
              : undefined,
          data: {
            full_name: form.fullName.trim() || null,
          },
        },
      });

      if (signUpError) {
        console.error("Supabase signUp error:", signUpError);
        setError("Kunne ikke opprette bruker. Sjekk e-post og passord.");
        setLoading(false);
        return;
      }

      const userId = data.user?.id;
      if (!userId) {
        console.error("Supabase signUp – mangler user.id i responsen", data);
        setError("Kunne ikke hente bruker-id fra Supabase.");
        setLoading(false);
        return;
      }

      // 2) Kall API for å opprette org + org_member
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/public/create-org-from-signup`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              email: form.email.trim(),
              fullName: form.fullName.trim() || null,
              companyName: form.companyName.trim(),
            }),
          }
        );

        if (!res.ok) {
          const body = await res.text().catch(() => "");
          console.error(
            "create-org-from-signup svarer ikke ok:",
            res.status,
            body
          );
          setError(
            "Bruker ble opprettet, men det oppstod en feil ved opprettelse av organisasjon. Ta kontakt med LYXso-support."
          );
          setLoading(false);
          return;
        }

        const json = await res.json().catch(() => null);
        console.log("create-org-from-signup OK:", json);
      } catch (orgErr) {
        console.error("Feil ved kall til create-org-from-signup:", orgErr);
        setError(
          "Bruker ble opprettet, men API-et for organisasjon svarte ikke. Ta kontakt med LYXso-support."
        );
        setLoading(false);
        return;
      }

      setInfo(
        "Konto opprettet! Sjekk e-posten din og bekreft adressen før du logger inn."
      );

      // Liten pause før redirect til /login
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      console.error("Uventet feil i register-flow:", err);
      setError("Uventet feil ved registrering.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
        <h1 className="text-xl font-semibold tracking-tight">
          Opprett LYXso-konto
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Registrer firmaet ditt og få tilgang til partnerportalen.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300">
              Firmanavn
            </label>
            <input
              type="text"
              value={form.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Eks: LYX Bilpleie AS"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300">
              Ditt navn
            </label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Fornavn Etternavn"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300">
              E-post
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
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
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              required
              minLength={8}
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Minst 8 tegn"
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
            {loading ? "Oppretter konto ..." : "Opprett konto"}
          </button>

          <p className="mt-3 text-[11px] text-slate-500">
            Har du allerede en konto?{" "}
            <a
              href="/login"
              className="text-blue-400 hover:text-blue-300"
            >
              Logg inn her
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
