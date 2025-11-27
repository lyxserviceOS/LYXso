// app/(public)/kundeportal/page.tsx
import { redirect } from "next/navigation";
import { fetchCustomers } from "@/repos/customersRepo";

type PageProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

function normalizePhone(value: string): string {
  return value.replace(/\s+/g, "").replace(/^(\+47|0047)/, "");
}

export default async function CustomerPortalEntryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const qRaw = params?.q;
  const q =
    typeof qRaw === "string"
      ? qRaw.trim()
      : Array.isArray(qRaw)
      ? qRaw[0]?.trim()
      : "";

  let errorMessage: string | null = null;

  if (q) {
    try {
      const customers = await fetchCustomers();

      const lowered = q.toLowerCase();
      const normalizedInputPhone = normalizePhone(q);

      const match = customers.find((c) => {
        const emailMatch =
          c.email && c.email.toLowerCase() === lowered;

        const phoneMatch =
          c.phone &&
          normalizePhone(c.phone) === normalizedInputPhone;

        return emailMatch || phoneMatch;
      });

      if (match) {
        // Vi fant kunde – send direkte til /kundeportal/[id]
        redirect(`/kundeportal/${match.id}`);
      } else {
        errorMessage =
          "Fant ingen kunde med denne e-posten eller dette telefonnummeret.";
      }
    } catch (err) {
      console.error("[CustomerPortalEntryPage] Error fetching customers:", err);
      errorMessage = "Det oppstod en feil ved oppslag. Prøv igjen senere.";
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <header className="mb-4 space-y-1 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            KUNDEPORTAL
          </p>
          <h1 className="text-xl font-semibold text-slate-900">
            Logg inn på &quot;Min side&quot;
          </h1>
          <p className="text-xs text-slate-500">
            Skriv inn e-postadressen eller telefonnummeret du har brukt hos oss,
            så viser vi dine bookinger og kundeforhold.
          </p>
        </header>

        <form
          method="GET"
          action="/kundeportal"
          className="space-y-4"
        >
          <div className="space-y-1">
            <label
              htmlFor="q"
              className="block text-xs font-medium text-slate-700"
            >
              E-post eller telefon
            </label>
            <input
              id="q"
              name="q"
              type="text"
              defaultValue={q ?? ""}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="f.eks. din@epost.no eller 900 00 000"
            />
          </div>

          {errorMessage && (
            <p className="text-xs text-rose-600">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
          >
            Fortsett til min side
          </button>
        </form>

        <p className="mt-4 text-center text-[11px] text-slate-400">
          Dette er en første versjon av kundeportalen. For mer avansert
          innlogging (BankID, magiske lenker osv.) bygger vi på senere.
        </p>
      </div>
    </div>
  );
}
