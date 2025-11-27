// app/(public)/kundeportal/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  fetchCustomer,
  fetchCustomerBookings,
  fetchCustomerCoatingJobs,
  fetchCustomerTireSets,
  type Customer,
  type CoatingJob,
  type TireSet,
} from "@/repos/customersRepo";
import type { Booking } from "@/types/booking";

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

function sortBookingsByStartDesc(bookings: Booking[]): Booking[] {
  return [...bookings].sort((a, b) => {
    const ta = a.startTime ? new Date(a.startTime).getTime() : 0;
    const tb = b.startTime ? new Date(b.startTime).getTime() : 0;
    return tb - ta;
  });
}

function sortBookingsByStartAsc(bookings: Booking[]): Booking[] {
  return [...bookings].sort((a, b) => {
    const ta = a.startTime ? new Date(a.startTime).getTime() : 0;
    const tb = b.startTime ? new Date(b.startTime).getTime() : 0;
    return ta - tb;
  });
}

type CustomerPortalData = {
  customer: Customer;
  bookings: Booking[];
  coatingJobs: CoatingJob[];
  tireSets: TireSet[];
};

async function loadCustomerData(customerId: string): Promise<CustomerPortalData | null> {
  try {
    const [customer, bookings, coatingJobs, tireSets] = await Promise.all([
      fetchCustomer(customerId),
      fetchCustomerBookings(customerId).catch(() => []),
      fetchCustomerCoatingJobs(customerId).catch(() => []),
      fetchCustomerTireSets(customerId).catch(() => []),
    ]);

    if (!customer) {
      return null;
    }

    return { customer, bookings, coatingJobs, tireSets };
  } catch (error) {
    console.error("Error loading customer portal:", error);
    return null;
  }
}

export default async function CustomerPortalPage({ params }: PageProps) {
  const { id: customerId } = await params;
  const data = await loadCustomerData(customerId);

  if (!data) {
    return notFound();
  }

  const { customer, bookings, coatingJobs, tireSets } = data;

  // Use a server-safe date reference
  const serverNow = new Date();
  const now = serverNow.getTime();
  
  // Separate upcoming and past bookings
  const upcomingBookings = sortBookingsByStartAsc(
    bookings.filter((b) => {
      if (!b.startTime) return false;
      const t = new Date(b.startTime).getTime();
      return !Number.isNaN(t) && t >= now && (b.status === "pending" || b.status === "confirmed");
    })
  );
  
  const pastBookings = sortBookingsByStartDesc(
    bookings.filter((b) => {
      if (!b.startTime) return true; // No start time = assume past
      const t = new Date(b.startTime).getTime();
      return Number.isNaN(t) || t < now || b.status === "completed" || b.status === "cancelled";
    })
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                KUNDEPORTAL
              </p>
              <h1 className="mt-1 text-2xl font-semibold text-slate-900">
                Hei, {customer.name}!
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Velkommen til din side. Her kan du se dine bookinger og kundeforhold.
              </p>
            </div>
            <Link
              href="/kundeportal"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Logg ut
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
        {/* Upcoming Bookings */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Kommende bookinger
            </h2>
            <Link
              href="/bestill"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ny booking
            </Link>
          </div>

          {upcomingBookings.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="text-sm text-slate-500">
                Du har ingen kommende bookinger.
              </p>
              <Link
                href="/bestill"
                className="mt-3 inline-flex text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Bestill time →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.map((b) => (
                <div
                  key={b.id}
                  className="flex items-start justify-between rounded-lg border border-slate-200 bg-slate-50 p-4"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {b.serviceName || "Booking"}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {toNoDateTime(b.startTime)}
                    </p>
                    {b.notes && (
                      <p className="mt-2 text-xs text-slate-500">{b.notes}</p>
                    )}
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      b.status === "confirmed"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {b.status === "confirmed" ? "Bekreftet" : "Venter på bekreftelse"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Booking History */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Historikk
          </h2>

          {pastBookings.length === 0 ? (
            <p className="text-sm text-slate-500">
              Ingen tidligere bookinger registrert.
            </p>
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {pastBookings.slice(0, 10).map((b) => (
                    <tr key={b.id}>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                        {toNoDate(b.startTime)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">
                        {b.serviceName || "Uten navn"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            b.status === "completed"
                              ? "bg-emerald-100 text-emerald-800"
                              : b.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {b.status === "completed"
                            ? "Fullført"
                            : b.status === "cancelled"
                            ? "Avbestilt"
                            : b.status || "Ukjent"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Coating Jobs */}
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
                  {job.warrantyYears && job.installedAt && (
                    <div className="mt-2">
                      <p className="text-xs text-slate-500">
                        Garanti til:{" "}
                        <span className="font-medium text-slate-700">
                          {toNoDate(
                            new Date(
                              new Date(job.installedAt).getFullYear() + job.warrantyYears,
                              new Date(job.installedAt).getMonth(),
                              new Date(job.installedAt).getDate()
                            ).toISOString()
                          )}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tire Sets */}
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

        {/* Contact / Request Changes */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Trenger du hjelp?
          </h2>
          <p className="mb-4 text-sm text-slate-600">
            Hvis du vil endre eller avbestille en booking, ta kontakt med verkstedet.
          </p>
          <div className="flex flex-wrap gap-3">
            {customer.phone && (
              <a
                href={`tel:${customer.phone}`}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                📞 Ring oss
              </a>
            )}
            {customer.email && (
              <a
                href={`mailto:${customer.email}`}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                ✉️ Send e-post
              </a>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="text-xs text-slate-400">
            Drevet av LYXso • Din bilpleieportal
          </p>
        </div>
      </footer>
    </div>
  );
}
