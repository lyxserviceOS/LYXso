// app/(public)/register/confirm-email/page.tsx
// Email confirmation page after registration

"use client";

import Link from "next/link";
import { CheckCircle, Mail } from "lucide-react";

export default function ConfirmEmailPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-lg text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold tracking-tight mb-3">
          Kontoen din er opprettet!
        </h1>

        {/* Message */}
        <p className="text-slate-400 mb-6 leading-relaxed">
          Vi har sendt en bekreftelseslenke til e-posten din. 
          Vennligst sjekk innboksen din og klikk på lenken for å aktivere kontoen.
        </p>

        {/* Info Box */}
        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 mb-6 text-left">
          <h3 className="text-sm font-medium text-slate-300 mb-2">
            Neste steg:
          </h3>
          <ol className="text-sm text-slate-400 space-y-2">
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">1.</span>
              <span>Åpne e-posten fra LYXso</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">2.</span>
              <span>Klikk på bekreftelseslenken</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">3.</span>
              <span>Logg inn med dine nye kontoopplysninger</span>
            </li>
          </ol>
        </div>

        {/* Help Text */}
        <p className="text-xs text-slate-500 mb-6">
          Finner du ikke e-posten? Sjekk søppelpost-mappen din.
        </p>

        {/* Login Button */}
        <Link
          href="/login"
          className="block w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Gå til innlogging
        </Link>

        {/* Home Link */}
        <Link
          href="/"
          className="block mt-4 text-sm text-slate-400 hover:text-slate-300 transition-colors"
        >
          Tilbake til forsiden
        </Link>
      </div>
    </div>
  );
}
