"use client";

import React, { useEffect, useState } from "react";
import type { Service } from "@/types/service";
import {
  createPublicBooking,
  fetchPublicServices,
  type PublicBookingPayload,
} from "@/lib/repos/publicBookingRepo";

type Step = 1 | 2 | 3;

type BookingForm = {
  serviceId: string;
  startTime: string;
  endTime: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string;
};

const EMPTY_FORM: BookingForm = {
  serviceId: "",
  startTime: "",
  endTime: "",
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  notes: "",
};

export function BestillPageClient() {
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [servicesError, setServicesError] = useState<string | null>(null);

  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<BookingForm>(EMPTY_FORM);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Hent tjenester fra API ved første innlasting
  useEffect(() => {
    async function loadServices() {
      setLoadingServices(true);
      setServicesError(null);
      try {
        const data = await fetchPublicServices();
        setServices(data ?? []);
      } catch (err) {
        console.error("[BestillPageClient] fetchPublicServices error", err);
        setServicesError(
          "Kunne ikke hente liste over tjenester. Prøv å laste siden på nytt.",
        );
      } finally {
        setLoadingServices(false);
      }
    }

    loadServices();
  }, []);

  const selectedService = services.find((s) => s.id === form.serviceId) ?? null;

  function handleChange<K extends keyof BookingForm>(key: K, value: BookingForm[K]) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function validateStep1(): string | null {
    if (!form.serviceId) {
      return "Velg en tjeneste du ønsker å bestille.";
    }
    return null;
  }

  function validateStep2(): string | null {
    if (!form.customerName.trim()) {
      return "Skriv inn navnet ditt.";
    }
    if (!form.customerEmail.trim() && !form.customerPhone.trim()) {
      return "Vi trenger minst én kontaktmåte (e-post eller telefon).";
    }
    return null;
  }

  function validateStep3(): string | null {
    if (!form.startTime) {
      return "Velg ønsket starttid.";
    }
    if (!form.endTime) {
      return "Velg ønsket sluttid.";
    }
    const start = new Date(form.startTime);
    const end = new Date(form.endTime);
    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
      if (end <= start) {
        return "Sluttid må være etter starttid.";
      }
    }
    return null;
  }

  function handleNextStep() {
    setSubmitError(null);
    if (step === 1) {
      const err = validateStep1();
      if (err) {
        setSubmitError(err);
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const err = validateStep2();
      if (err) {
        setSubmitError(err);
        return;
      }
      setStep(3);
    }
  }

  function handlePrevStep() {
    setSubmitError(null);
    setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    const errorStep3 = validateStep3();
    if (errorStep3) {
      setSubmitError(errorStep3);
      return;
    }

    if (!selectedService) {
      setSubmitError("Velg en tjeneste før du sender inn.");
      return;
    }

    const payload: PublicBookingPayload = {
      startTime: form.startTime,
      endTime: form.endTime,
      status: "pending",
      customerName: form.customerName.trim(),
      customerEmail: form.customerEmail.trim() || undefined,
      customerPhone: form.customerPhone.trim() || undefined,
      serviceName: selectedService.name,
      notes: form.notes.trim() || undefined,
    };

    setSubmitting(true);
    try {
      await createPublicBooking(payload);
      setSubmitSuccess(
        "Takk! Bookingforespørselen er sendt. Du får bekreftelse på e-post eller SMS når verkstedet har behandlet den.",
      );
      setForm(EMPTY_FORM);
      setStep(1);
    } catch (err: any) {
      console.error("[BestillPageClient] createPublicBooking error", err);
      const msg =
        typeof err?.message === "string"
          ? err.message
          : "Det oppstod en feil ved sending av booking. Prøv igjen.";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      {/* VENSTRE – Skjema */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-slate-900/40 backdrop-blur">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Stegindikator */}
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full border text-[11px] ${
                  step === 1
                    ? "border-sky-400 bg-sky-500/20 text-sky-100"
                    : "border-slate-600 bg-slate-800 text-slate-300"
                }`}
              >
                1
              </span>
              <span>Tjeneste</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-700/60 via-sky-500/50 to-slate-700/60" />
            <div className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full border text-[11px] ${
                  step === 2
                    ? "border-sky-400 bg-sky-500/20 text-sky-100"
                    : "border-slate-600 bg-slate-800 text-slate-300"
                }`}
              >
                2
              </span>
              <span>Kontaktinfo</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-700/60 via-sky-500/50 to-slate-700/60" />
            <div className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full border text-[11px] ${
                  step === 3
                    ? "border-sky-400 bg-sky-500/20 text-sky-100"
                    : "border-slate-600 bg-slate-800 text-slate-300"
                }`}
              >
                3
              </span>
              <span>Tid & notater</span>
            </div>
          </div>

          {/* Steg 1 – Velg tjeneste */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-200">
                  Hvilken tjeneste ønsker du?
                </label>
                {loadingServices ? (
                  <p className="text-xs text-slate-400">
                    Laster tilgjengelige tjenester …
                  </p>
                ) : servicesError ? (
                  <p className="text-xs text-red-400">{servicesError}</p>
                ) : services.length === 0 ? (
                  <p className="text-xs text-slate-400">
                    Ingen tjenester er tilgjengelige for online booking enda.
                  </p>
                ) : (
                  <select
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 outline-none ring-0 focus:border-sky-400"
                    value={form.serviceId}
                    onChange={(e) => handleChange("serviceId", e.target.value)}
                  >
                    <option value="">Velg tjeneste …</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {selectedService && (
                <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-3 text-xs text-slate-200">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-400">
                        Valgt tjeneste
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-50">
                        {selectedService.name}
                      </p>
                    </div>
                  </div>
                  {/* Vi holder oss til navn her for å unngå kollisjon med ukjente felter i Service-typen */}
                </div>
              )}
            </div>
          )}

          {/* Steg 2 – Kontaktinfo */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-200">
                  Navn
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 outline-none focus:border-sky-400"
                  placeholder="F.eks. Ola Nordmann"
                  value={form.customerName}
                  onChange={(e) => handleChange("customerName", e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-200">
                    E-post
                  </label>
                  <input
                    type="email"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 outline-none focus:border-sky-400"
                    placeholder="din@mail.no"
                    value={form.customerEmail}
                    onChange={(e) =>
                      handleChange("customerEmail", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-200">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 outline-none focus:border-sky-400"
                    placeholder="+47 900 00 000"
                    value={form.customerPhone}
                    onChange={(e) =>
                      handleChange("customerPhone", e.target.value)
                    }
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                Verkstedet bruker kun kontaktinfo til å bekrefte, flytte eller
                avvise bookingen din – ikke til spam.
              </p>
            </div>
          )}

          {/* Steg 3 – Tid & notater */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-200">
                    Ønsket starttid
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 outline-none focus:border-sky-400"
                    value={form.startTime}
                    onChange={(e) => handleChange("startTime", e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-200">
                    Ønsket sluttid
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 outline-none focus:border-sky-400"
                    value={form.endTime}
                    onChange={(e) => handleChange("endTime", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-200">
                  Notater til verkstedet (valgfritt)
                </label>
                <textarea
                  className="h-24 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 outline-none focus:border-sky-400"
                  value={form.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="F.eks. hvilken bil du har, spesielle ønsker eller info om tidligere behandling."
                />
              </div>
            </div>
          )}

          {/* Feil / suksess */}
          {(submitError || submitSuccess) && (
            <div>
              {submitError && (
                <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-[11px] text-red-200">
                  {submitError}
                </p>
              )}
              {submitSuccess && (
                <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-200">
                  {submitSuccess}
                </p>
              )}
            </div>
          )}

          {/* Knapperekke */}
          <div className="flex items-center justify-between pt-2 text-xs">
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={step === 1 || submitting}
              className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-slate-200 hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Tilbake
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                disabled={submitting || loadingServices || !!servicesError}
                className="rounded-full bg-sky-500 px-4 py-1.5 text-[11px] font-semibold text-slate-950 shadow-sm shadow-sky-500/40 hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Neste steg
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-emerald-500 px-4 py-1.5 text-[11px] font-semibold text-slate-950 shadow-sm shadow-emerald-500/40 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Sender booking …" : "Send bookingforespørsel"}
              </button>
            )}
          </div>
        </form>
      </section>

      {/* HØYRE – Oppsummering / info */}
      <aside className="space-y-4 text-xs text-slate-200">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-400">
            Hvordan fungerer dette?
          </p>
          <ul className="mt-3 space-y-2 text-slate-200">
            <li>• Du sender inn ønsket tjeneste og tidspunkt.</li>
            <li>
              • Forespørselen går direkte inn i LYXso-systemet til verkstedet.
            </li>
            <li>
              • Verkstedet bekrefter, flytter eller avviser – du får beskjed på
              e-post eller SMS.
            </li>
            <li>
              • Når det blir bekreftet, dukker bookingen opp i kalenderen deres
              sammen med interne bookinger.
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            For partneren
          </p>
          <p className="mt-2 text-slate-300">
            Denne siden er bygget for å kunne kobles direkte til partnerens egen
            nettside eller landingsside. De trenger kun å:
          </p>
          <ul className="mt-2 space-y-1 text-slate-300">
            <li>• Sette riktig <code className="font-mono text-[10px]">NEXT_PUBLIC_ORG_ID</code>.</li>
            <li>
              • Konfigurere tjenester som skal være tilgjengelige for online
              booking.
            </li>
            <li>• Aktivt følge opp forespørsler i bookingmodulen.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
