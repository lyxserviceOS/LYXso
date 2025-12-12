// app/(public)/glemt-passord/page.tsx
"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

type State = "idle" | "submitting" | "success" | "error";

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(initialEmail);
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialEmail && !email) {
      setEmail(initialEmail);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialEmail]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setState("submitting");
    setMessage(null);

    try {
      const redirectTo =
        process.env.NEXT_PUBLIC_SUPABASE_RESET_REDIRECT_URL ??
        "http://localhost:3000/login";

      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo,
        },
      );

      if (error) {
        console.error("resetPasswordForEmail error:", error);
        throw error;
      }

      setState("success");
      setMessage(
        "Hvis e-posten finnes i vårt system, har vi sendt en lenke for å sette nytt passord.",
      );
    } catch (err: unknown) {
      setState("error");
      const errorMessage = err instanceof Error ? err.message : "Noe gikk galt ved forsøk på å sende nullstillings-epost. Prøv igjen senere.";
      setMessage(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-10">
        <header className="space-y-2 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-xs font-semibold tracking-[0.2em]">
            L
          </div>
          <h1 className="text-xl font-semibold">Glemt passord</h1>
          <p className="text-xs text-slate-300">
            Skriv inn e-posten du bruker i LYXso-partnerportalen. Vi sender deg
            en lenke for å sette nytt passord.
          </p>
        </header>

        {state !== "idle" && message && (
          <div
            className={[
              "rounded-md border px-3 py-2 text-xs",
              state === "success"
                ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-100"
                : state === "error"
                ? "border-red-500/60 bg-red-500/10 text-red-100"
                : "border-slate-700 bg-slate-900 text-slate-100",
            ].join(" ")}
          >
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 px-5 py-6 text-sm"
        >
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block text-xs font-medium text-slate-200"
            >
              E-post
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500"
              placeholder="fornavn@bedrift.no"
            />
          </div>

          <button
            type="submit"
            disabled={state === "submitting"}
            className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {state === "submitting"
              ? "Sender lenke…"
              : "Send lenke for å nullstille passord"}
          </button>

          <p className="mt-2 text-[11px] text-slate-500">
            Av sikkerhetsgrunner får du samme tilbakemelding uansett om e-posten
            finnes eller ikke.
          </p>
        </form>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">Laster...</div>}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
