// app/(protected)/kunder/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  fetchCustomers,
  fetchCustomerBookings,
  fetchCustomer,
  fetchCustomerStatistics,
  fetchCustomerNotes,
  fetchCustomerPayments,
  fetchCustomerCoatingJobs,
  fetchCustomerTireSets,
} from "@/repos/customersRepo";
import type { Booking } from "@/types/booking";
import AddNoteButton from "./AddNoteButton";

type PageProps = {
  params: Promise<{ id: string }>;
};

function toNoDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "Ingen dato";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "Ugyldig dato";
  return d.toLocaleDateString("no-NO");
}

function toNoDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "Ingen dato";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "Ugyldig dato";
  return d.toLocaleString("no-NO", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("no-NO", {
    style: "currency",
    currency: "NOK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function sortBookingsByStartDesc(bookings: Booking[]): Booking[] {
  return [...bookings].sort((a, b) => {
    const ta = a.startTime ? new Date(a.startTime).getTime() : 0;
    const tb = b.startTime ? new Date(b.startTime).getTime() : 0;
    return tb - ta;
  });
}

export default async function CustomerDetailPage({ params }: PageProps) {
  const { id: customerId } = await params;

  try {
    // Hent ALL kundedata parallelt for rask lasting
    const [customer, statistics, bookings, notes, payments, coatingJobs, tireSets] =
      await Promise.all([
        fetchCustomer(customerId),
        fetchCustomerStatistics(customerId).catch(() => null),
        fetchCustomerBookings(customerId).catch(() => []),
        fetchCustomerNotes(customerId).catch(() => []),
        fetchCustomerPayments(customerId).catch(() => ({
          payments: [],
          summary: { totalPaid: 0, totalPending: 0, totalAmount: 0 },
        })),
        fetchCustomerCoatingJobs(customerId).catch(() => []),
        fetchCustomerTireSets(customerId).catch(() => []),
      ]);

    if (!customer) {
      return notFound();
    }

    const totalBookings = bookings.length;
    const bookingsDesc = sortBookingsByStartDesc(bookings);

    const newBookingHref = `/booking?customerId=${encodeURIComponent(
      customerId,
    )}&customerName=${encodeURIComponent(customer.name)}`;

    return (
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        {/* HEADER */}
        <header className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-end">
          <div>
            <Link
              href="/kunder"
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              ← Tilbake til kunder
            </Link>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              KUNDEKORT
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">
              {customer.name}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {customer.email || "Ingen e-post"} •{" "}
              {customer.phone || "Ingen telefon"}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Opprettet {toNoDate(customer.createdAt)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href={newBookingHref}
              className="inline-flex items-center rounded-lg border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-50 hover:bg-slate-800"
            >
              + Ny booking
            </Link>

            {customer.phone && (
              <a
                href={`tel:${customer.phone}`}
                className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                📞 Ring
              </a>
            )}

            {customer.email && (
              <a
                href={`mailto:${customer.email}`}
                className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                ✉️ E-post
              </a>
            )}
          </div>
        </header>

        {/* STATISTIKK-KORT */}
        {statistics && (
          <section className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                TOTAL OMSETNING
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {formatCurrency(statistics.totalRevenue)}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                ÅPENT BELØP
              </p>
              <p
                className={`mt-2 text-2xl font-bold ${
                  statistics.openAmount > 0 ? "text-amber-600" : "text-slate-900"
                }`}
              >
                {formatCurrency(statistics.openAmount)}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                BOOKINGER
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {statistics.totalBookings}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {statistics.completedBookings} fullført
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                SISTE BESØK
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                {statistics.lastVisit ? toNoDate(statistics.lastVisit) : "Aldri"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-700">
                NESTE STEG
              </p>
              <p className="mt-2 text-sm font-medium text-blue-900">
                {statistics.nextRecommendedAction || "Ingen anbefalinger"}
              </p>
            </div>
          </section>
        )}

        {/* MAIN GRID */}
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* BOOKING-HISTORIKK */}
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Bookinghistorikk
              </h2>

              {totalBookings === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <p className="text-sm text-slate-500">
                    Ingen bookinger registrert på denne kunden enda.
                  </p>
                  <Link
                    href={newBookingHref}
                    className="mt-3 inline-flex text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Opprett første booking →
                  </Link>
                </div>
              ) : (
                <div className="overflow-auto rounded-lg border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                          Dato
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                          Tjeneste
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                          Notater
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {bookingsDesc.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50">
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                            {toNoDateTime(b.startTime)}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-slate-900">
                            {b.serviceName || "Uten navn"}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                b.status === "completed"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : b.status === "confirmed"
                                  ? "bg-blue-100 text-blue-800"
                                  : b.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {b.status || "pending"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-500">
                            {b.notes ? b.notes.slice(0, 60) + "..." : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* COATING-JOBBER */}
            {coatingJobs.length > 0 && (
              <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-slate-900">
                  Coating-jobber
                </h2>
                <div className="space-y-3">
                  {coatingJobs.map((job) => (
                    <div
                      key={job.id}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-slate-900">
                            {job.vehicleMake} {job.vehicleModel}
                          </p>
                          <p className="text-sm text-slate-600">
                            {job.vehicleReg} • {job.vehicleColor}
                          </p>
                        </div>
                        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
                          {job.coatingProduct}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-slate-500">
                        {job.layers} lag • {job.warrantyYears} års garanti •
                        Installert {toNoDate(job.installedAt)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* DEKKSETT */}
            {tireSets.length > 0 && (
              <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-slate-900">
                  Dekkhotell
                </h2>
                <div className="space-y-3">
                  {tireSets.map((set) => (
                    <div
                      key={set.id}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-slate-900">
                            {set.tireBrand || "Ukjent merke"}
                          </p>
                          <p className="text-sm text-slate-600">
                            {set.tireSize} • {set.vehicleReg}
                          </p>
                        </div>
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                          {set.tireType || "Ukjent type"}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-slate-500">
                        Plassering: {set.location || "Ikke angitt"} • Tilstand:{" "}
                        {set.condition || "Ukjent"}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* KUNDEDETALJER */}
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Kundedetaljer
              </h2>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-xs font-medium text-slate-500">Navn</dt>
                  <dd className="mt-1 text-slate-900">{customer.name}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-500">E-post</dt>
                  <dd className="mt-1 text-slate-900">
                    {customer.email || (
                      <span className="text-slate-400">Ikke satt</span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-500">Telefon</dt>
                  <dd className="mt-1 text-slate-900">
                    {customer.phone || (
                      <span className="text-slate-400">Ikke satt</span>
                    )}
                  </dd>
                </div>
                {customer.notes && (
                  <div>
                    <dt className="text-xs font-medium text-slate-500">
                      Interne notater
                    </dt>
                    <dd className="mt-1 whitespace-pre-wrap text-slate-700">
                      {customer.notes}
                    </dd>
                  </div>
                )}
              </dl>
            </section>

            {/* BETALINGSOVERSIKT */}
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Betalinger
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between rounded-lg bg-emerald-50 p-3">
                  <span className="text-sm font-medium text-emerald-900">
                    Totalt betalt
                  </span>
                  <span className="text-sm font-bold text-emerald-900">
                    {formatCurrency(payments.summary.totalPaid)}
                  </span>
                </div>
                <div className="flex justify-between rounded-lg bg-amber-50 p-3">
                  <span className="text-sm font-medium text-amber-900">
                    Åpne beløp
                  </span>
                  <span className="text-sm font-bold text-amber-900">
                    {formatCurrency(payments.summary.totalPending)}
                  </span>
                </div>
                <div className="flex justify-between rounded-lg bg-slate-50 p-3">
                  <span className="text-sm font-medium text-slate-700">
                    Total sum
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {formatCurrency(payments.summary.totalAmount)}
                  </span>
                </div>
              </div>

              {payments.payments.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-medium text-slate-500">
                    Siste transaksjoner
                  </p>
                  {payments.payments.slice(0, 5).map((payment) => (
                    <div
                      key={payment.id}
                      className="flex justify-between border-b border-slate-100 pb-2 text-xs"
                    >
                      <span className="text-slate-600">
                        {toNoDate(payment.createdAt)}
                      </span>
                      <span className="font-medium text-slate-900">
                        {formatCurrency(payment.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* NOTATER */}
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  Notater
                </h2>
                <AddNoteButton customerId={customerId} />
              </div>
              {notes.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <p className="text-sm text-slate-500">
                    Ingen notater enda. Legg til første notat.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                    >
                      <p className="text-sm text-slate-700">{note.note}</p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                        <span>{toNoDateTime(note.createdAt)}</span>
                        {note.isInternal && (
                          <span className="rounded bg-amber-100 px-2 py-0.5 text-amber-800">
                            Internt
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {notes.length > 5 && (
                    <p className="text-center text-xs text-slate-500">
                      Viser alle {notes.length} notater
                    </p>
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading customer details:", error);
    return notFound();
  }
}
