// app/(public)/bli-partner/BliPartnerPageClient.tsx
"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

type OrgSuggestion = {
  id: string;
  name: string;
  orgNumber: string;
  addressLine: string | null;
  postalCode: string | null;
  city: string | null;
};

type FormState = {
  orgNumber: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  websiteUrl: string;
  hasWebsite: boolean;
  wantsLandingPage: boolean;
  notes: string;

  addressLine: string;
  postalCode: string;
  city: string;
};

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export default function BliPartnerPageClient() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<OrgSuggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    orgNumber: "",
    companyName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    websiteUrl: "",
    hasWebsite: false,
    wantsLandingPage: true,
    notes: "",
    addressLine: "",
    postalCode: "",
    city: "",
  });

  const [submitState, setSubmitState] = useState<SubmitState>({
    status: "idle",
  });

  // --- BRREG autosøk via /api/orgs/lookup ---
  useEffect(() => {
    if (!API_BASE) {
      console.error("Mangler NEXT_PUBLIC_API_BASE for /bli-partner");
      return;
    }

    const q = search.trim();
    if (!q || q.length < 3) {
      setSuggestions([]);
      setSearchError(null);
      return;
    }

    let cancelled = false;
    const timeout = setTimeout(async () => {
      try {
        setSearching(true);
        setSearchError(null);

        const res = await fetch(
          `${API_BASE}/api/orgs/lookup?query=${encodeURIComponent(q)}`,
        );

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(
            `Feil fra /api/orgs/lookup (${res.status}) – ${txt}`,
          );
        }

        const data = await res.json();
        const results = Array.isArray(data?.results)
          ? (data.results as OrgSuggestion[])
          : [];

        if (!cancelled) {
          setSuggestions(results);
        }
      } catch (err: any) {
        console.error("Feil ved bedriftsøk:", err);
        if (!cancelled) {
          setSearchError(
            "Klarte ikke å hente bedrifter fra Enhetsregisteret. Prøv igjen om litt.",
          );
          setSuggestions([]);
        }
      } finally {
        if (!cancelled) {
          setSearching(false);
        }
      }
    }, 350); // enkel debounce

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [search]);

  function handleSelectSuggestion(s: OrgSuggestion) {
    setForm((prev) => ({
      ...prev,
      orgNumber: s.orgNumber || prev.orgNumber,
      companyName: s.name || prev.companyName,
      addressLine: s.addressLine || prev.addressLine,
      postalCode: s.postalCode || prev.postalCode,
      city: s.city || prev.city,
    }));

    // Lukk forslag-listen og sett søkefeltet til noe meningsfullt
    setSearch(s.name || s.orgNumber);
    setSuggestions([]);
  }

  function updateForm<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleWebsiteChange(value: string) {
    // Skriver inn URL => vi antar at de har eget nettsted og skrur av wantsLandingPage
    setForm((prev) => ({
      ...prev,
      websiteUrl: value,
      hasWebsite: value.trim().length > 0,
      wantsLandingPage: value.trim().length > 0 ? false : prev.wantsLandingPage,
    }));
  }

  function handleToggleWantsLandingPage(checked: boolean) {
    setForm((prev) => ({
      ...prev,
      wantsLandingPage: checked,
      // Hvis de velger LYXso-landingsside, nuller vi ut "har eget nettsted" og URL
      ...(checked
        ? {
            hasWebsite: false,
            websiteUrl: "",
          }
        : {}),
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!API_BASE) {
      setSubmitState({
        status: "error",
        message:
          "Mangler API-konfigurasjon. Sjekk NEXT_PUBLIC_API_BASE i .env.local.",
      });
      return;
    }

    if (!form.orgNumber.trim() || !form.companyName.trim()) {
      setSubmitState({
        status: "error",
        message:
          "Du må velge en bedrift fra listen, eller fylle inn org.nr og bedriftsnavn.",
      });
      return;
    }

    if (!form.contactEmail.trim()) {
      setSubmitState({
        status: "error",
        message: "Kontakt-e-post må fylles ut.",
      });
      return;
    }

    setSubmitState({
      status: "submitting",
    });

    try {
      const payload = {
        orgNumber: form.orgNumber.trim(),
        companyName: form.companyName.trim(),
        contactName: form.contactName.trim() || null,
        contactEmail: form.contactEmail.trim(),
        contactPhone: form.contactPhone.trim() || null,
        websiteUrl: form.websiteUrl.trim() || null,
        hasWebsite: form.hasWebsite,
        wantsLandingPage: form.wantsLandingPage,
        notes: form.notes.trim() || null,

        // NYTT: sendes til raw_payload i API-et
        addressLine: form.addressLine.trim() || null,
        postalCode: form.postalCode.trim() || null,
        city: form.city.trim() || null,
      };

      const res = await fetch(
        `${API_BASE}/api/public/registrer-partner`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const text = await res.text();
        console.error(
          "Feil fra /api/public/registrer-partner:",
          res.status,
          text,
        );
        throw new Error(
          `Klarte ikke å registrere partner (status ${res.status}).`,
        );
      }

      await res.json();

      setSubmitState({
        status: "success",
        message:
          "Takk! Partner-forespørselen er registrert. Vi tar kontakt når vi har sett over informasjonen.",
      });

      // Frivillig: send videre til login etter noen sekunder
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      console.error("Uventet feil ved innsending:", err);
      setSubmitState({
        status: "error",
        message:
          err?.message ??
          "Noe gikk galt ved innsending. Prøv igjen om et øyeblikk.",
      });
    }
  }

  const isSubmitting = submitState.status === "submitting";

  return (
    <div className="w-full max-w-3xl">
      {/* Topptekst */}
      <header className="mb-6 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-blue-300/80">
          LYXso • Bli partner
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          Bli LYXso-partner
        </h1>
        <p className="mt-2 text-sm text-slate-300 max-w-xl mx-auto">
          Fyll inn informasjon om bedriften din. Vi bruker dette til å sjekke
          org-data mot Enhetsregisteret og sette opp riktig konto og plan.
        </p>
      </header>

      {/* Statusmeldinger */}
      {submitState.status === "error" && (
        <div className="mb-4 rounded-lg border border-red-500/40 bg-red-950/40 px-3 py-2 text-xs text-red-100">
          {submitState.message}
        </div>
      )}

      {submitState.status === "success" && (
        <div className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-950/40 px-3 py-2 text-xs text-emerald-100">
          {submitState.message} Du sendes nå til innlogging.
        </div>
      )}

      {/* Skjema-kort */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-5 sm:px-6 sm:py-6 space-y-6"
      >
        {/* Bedrift / BRREG-søk */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-100">
            1. Finn bedriften din
          </h2>
          <p className="text-xs text-slate-400">
            Søk på bedriftsnavn eller organisasjonsnummer. Velg riktig treff,
            så fyller vi inn org.nr og adresse automatisk.
          </p>

          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500"
              placeholder="F.eks. LYX Bilpleie, 923 456 789 …"
            />
            {searching && (
              <span className="absolute right-3 top-2.5 text-[11px] text-slate-400">
                Søker…
              </span>
            )}
          </div>

          {searchError && (
            <p className="text-[11px] text-red-300">{searchError}</p>
          )}

          {suggestions.length > 0 && (
            <div className="max-h-60 overflow-y-auto rounded-md border border-slate-700 bg-slate-950 text-xs">
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSelectSuggestion(s)}
                  className="flex w-full flex-col items-start border-b border-slate-800 px-3 py-2 text-left hover:bg-slate-800/70"
                >
                  <span className="font-medium text-slate-50">
                    {s.name}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Org.nr: {s.orgNumber}
                  </span>
                  {s.addressLine && (
                    <span className="text-[11px] text-slate-500">
                      {s.addressLine}
                      {s.postalCode && s.city
                        ? `, ${s.postalCode} ${s.city}`
                        : ""}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 pt-2 text-xs">
            <div>
              <label className="block text-[11px] font-medium text-slate-300">
                Org.nr
              </label>
              <input
                type="text"
                value={form.orgNumber}
                onChange={(e) => updateForm("orgNumber", e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500"
                placeholder="923456789"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300">
                Bedriftsnavn
              </label>
              <input
                type="text"
                value={form.companyName}
                onChange={(e) => updateForm("companyName", e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500"
                placeholder="LYX Bilpleie Økern"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 text-xs">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-medium text-slate-300">
                Adresse
              </label>
              <input
                type="text"
                value={form.addressLine}
                onChange={(e) => updateForm("addressLine", e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500"
                placeholder="Gateadresse"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300">
                Postnr / sted
              </label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  value={form.postalCode}
                  onChange={(e) => updateForm("postalCode", e.target.value)}
                  className="w-20 rounded-md border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-slate-50 outline-none focus:border-blue-500"
                  placeholder="0580"
                />
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => updateForm("city", e.target.value)}
                  className="flex-1 rounded-md border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-slate-50 outline-none focus:border-blue-500"
                  placeholder="Oslo"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Kontaktperson */}
        <section className="space-y-3 pt-2">
          <h2 className="text-sm font-semibold text-slate-100">
            2. Kontaktperson
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 text-xs">
            <div>
              <label className="block text-[11px] font-medium text-slate-300">
                Kontaktperson
              </label>
              <input
                type="text"
                value={form.contactName}
                onChange={(e) => updateForm("contactName", e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500"
                placeholder="Navn på kontaktperson"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300">
                Telefon
              </label>
              <input
                type="tel"
                value={form.contactPhone}
                onChange={(e) => updateForm("contactPhone", e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500"
                placeholder="+47 ..."
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-[11px] font-medium text-slate-300">
              Kontakt-e-post
            </label>
            <input
              type="email"
              value={form.contactEmail}
              onChange={(e) => updateForm("contactEmail", e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500"
              placeholder="fornavn@bedrift.no"
              required
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Vi bruker denne e-posten til dialog om avtale og innlogging.
            </p>
          </div>
        </section>

        {/* Nettside / landingsside */}
        <section className="space-y-3 pt-2 text-xs">
          <h2 className="text-sm font-semibold text-slate-100">
            3. Nettside & LYXso-landingsside
          </h2>

          <div className="space-y-2">
            <label className="block text-[11px] font-medium text-slate-300">
              Nettside (hvis dere allerede har)
            </label>
            <input
              type="text"
              value={form.websiteUrl}
              onChange={(e) => handleWebsiteChange(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500"
              placeholder="https://…"
              disabled={form.wantsLandingPage}
            />
            <p className="text-[11px] text-slate-500">
              Hvis du velger LYXso-landingsside under, deaktiveres dette feltet.
              Eget domene kan kobles på senere på betalt plan.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="inline-flex items-center gap-2 text-[11px] text-slate-200">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={form.wantsLandingPage}
                onChange={(e) =>
                  handleToggleWantsLandingPage(e.target.checked)
                }
              />
              <span>
                Vi ønsker LYXso-landingsside med online booking.
              </span>
            </label>
            <p className="text-[11px] text-slate-500">
              Da setter vi opp en egen side for dere på LYXso-domenet. Eget
              domene kan kobles til senere som del av betalt avtale.
            </p>
          </div>
        </section>

        {/* Notater */}
        <section className="space-y-2 pt-2 text-xs">
          <h2 className="text-sm font-semibold text-slate-100">
            4. Eventuelle notater
          </h2>
          <textarea
            value={form.notes}
            onChange={(e) => updateForm("notes", e.target.value)}
            className="mt-1 min-h-[70px] w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-blue-500"
            placeholder="Skriv kort om tjenester, antall ansatte eller spesielle ønsker."
          />
        </section>

        {/* Footer / actions */}
        <div className="flex items-center justify-between pt-2 text-[11px]">
          <p className="text-slate-500 max-w-xs">
            Når du sender inn skjemaet, vil vi gå gjennom infoen og kontakte
            deg for å avtale oppsett, priser og plan.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
          >
            {isSubmitting ? "Sender inn…" : "Send partnerforespørsel"}
          </button>
        </div>
      </form>
    </div>
  );
}
