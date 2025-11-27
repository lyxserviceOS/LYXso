'use client';

import { useEffect, useState } from 'react';

type Product = {
  id: string;
  org_id: string;
  name: string;
  description?: string | null;
  sku?: string | null;
  price?: number | null;
  stock?: number | null;
  active: boolean;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID ?? '';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

console.log('LYXso ProductsPage config', { SUPABASE_URL, ORG_ID });

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // form-state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('0');
  const [stock, setStock] = useState('0');
  const [active, setActive] = useState(true);

  async function loadProducts() {
    try {
      if (!ORG_ID) {
        setError('Mangler ORG_ID – sjekk .env.local');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${API_BASE}/api/orgs/${ORG_ID}/products`,
      );
      if (!res.ok) {
        throw new Error(`Kunne ikke hente produkter (${res.status})`);
      }
      const json = await res.json();
      const list: Product[] = json.products ?? [];
      setProducts(list);
    } catch (err: any) {
      console.error('Feil ved lasting av produkter', err);
      setError(err.message ?? 'Ukjent feil ved lasting av produkter');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      setError(null);

      const body = {
        name: name.trim(),
        description: description.trim() || null,
        sku: sku.trim() || null,
        price: Number(price) || 0,
        stock: Number(stock) || 0,
        active,
      };

      const res = await fetch(
        `${API_BASE}/api/orgs/${ORG_ID}/products`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        },
      );

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Feil ved lagring av produkt: ${txt}`);
      }

      setName('');
      setDescription('');
      setSku('');
      setPrice('0');
      setStock('0');
      setActive(true);

      await loadProducts();
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? 'Feil ved lagring av produkt');
    }
  }

  async function toggleActive(product: Product) {
    try {
      const res = await fetch(
        `${API_BASE}/api/orgs/${ORG_ID}/products/${product.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ active: !product.active }),
        },
      );
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Feil ved oppdatering av status: ${txt}`);
      }
      await loadProducts();
    } catch (err) {
      console.error(err);
      alert('Klarte ikke å oppdatere status på produktet.');
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex">
      {/* Venstremeny – samme stil som booking */}
      <aside className="w-64 bg-slate-950/90 border-r border-slate-800/60 p-4 hidden md:block">
        <div className="text-xl font-semibold mb-6 text-slate-100">
          LYXso
        </div>
        <nav className="space-y-2 text-sm text-slate-300">
          <div className="px-3 py-2 text-slate-500">Hjem</div>
          <div className="px-3 py-2 text-slate-500">Booking</div>
          <div className="px-3 py-2 text-slate-500">Tjenester</div>
          <div className="rounded-md bg-slate-900/80 px-3 py-2 border border-slate-800/60">
            Produkter
          </div>
          <div className="px-3 py-2 text-slate-500">Kontrollpanel</div>
          <div className="px-3 py-2 text-slate-500">Markedsføring</div>
          <div className="px-3 py-2 text-slate-500">Regnskap</div>
          <div className="px-3 py-2 text-slate-500">Betaling</div>
        </nav>
      </aside>

      {/* Hovedområde */}
      <main className="flex-1 bg-slate-900/90 flex flex-col">
        {/* Toppheader */}
        <header className="border-b border-slate-800/60 px-6 py-4 flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-wide text-slate-400">
              LYX Bil – Partner
            </div>
            <h1 className="text-lg md:text-xl font-semibold text-slate-50">
              Produkter
            </h1>
            <p className="text-xs text-slate-400">
              Administrer produkter, SKU og lager som brukes i tjenester og
              fakturering.
            </p>
          </div>
          <div className="text-xs text-slate-400">
            Org:{' '}
            <span className="font-mono text-[11px] text-slate-300">
              {ORG_ID}
            </span>
          </div>
        </header>

        {/* Innhold */}
        <div className="flex-1 px-6 py-5 space-y-6 overflow-auto">
          {error && (
            <div className="rounded-md border border-red-500/60 bg-red-950/40 px-4 py-3 text-xs md:text-sm text-red-100">
              {error}
            </div>
          )}

          {/* Skjema-kort */}
          <section className="rounded-2xl border border-slate-800/80 bg-slate-950/70 shadow-[0_0_35px_rgba(15,23,42,0.8)] p-4 md:p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm md:text-base font-semibold text-slate-50">
                  Legg til nytt produkt
                </h2>
                <p className="text-xs text-slate-400">
                  Produkter kan knyttes til tjenester og brukes i lagerstyring.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleCreate}
              className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 text-xs md:text-sm"
            >
              <div className="space-y-1">
                <label className="block text-slate-300 text-[11px] uppercase tracking-wide">
                  Produktnavn
                </label>
                <input
                  className="w-full rounded-lg border border-slate-700/70 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 outline-none"
                  placeholder="f.eks. Vedlikeholdsshampoo – LYX 9H"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1 md:col-span-1 lg:col-span-2">
                <label className="block text-slate-300 text-[11px] uppercase tracking-wide">
                  Beskrivelse
                </label>
                <input
                  className="w-full rounded-lg border border-slate-700/70 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 outline-none"
                  placeholder="Kort beskrivelse av produktet"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-300 text-[11px] uppercase tracking-wide">
                  SKU / Varenummer
                </label>
                <input
                  className="w-full rounded-lg border border-slate-700/70 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 outline-none"
                  placeholder="LYX-SHAMPO-9H"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-300 text-[11px] uppercase tracking-wide">
                  Pris (kr)
                </label>
                <input
                  type="number"
                  min={0}
                  className="w-full rounded-lg border border-slate-700/70 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 outline-none"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-300 text-[11px] uppercase tracking-wide">
                  Lager
                </label>
                <input
                  type="number"
                  min={0}
                  className="w-full rounded-lg border border-slate-700/70 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 outline-none"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setActive((v) => !v)}
                  className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] border 
                    ${
                      active
                        ? 'bg-emerald-500/15 border-emerald-400/70 text-emerald-100'
                        : 'bg-slate-800/80 border-slate-600/80 text-slate-200'
                    }`}
                >
                  {active ? 'Aktiv' : 'Deaktivert'}
                </button>
              </div>

              <div className="flex items-end mt-1">
                <button
                  type="submit"
                  className="w-full md:w-auto rounded-xl bg-indigo-500 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-400"
                >
                  Legg til
                </button>
              </div>
            </form>
          </section>

          {/* Liste-kort */}
          <section className="rounded-2xl border border-slate-800/80 bg-slate-950/70 shadow-[0_0_35px_rgba(15,23,42,0.8)] overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800/70 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-50">
                Produktliste
              </h2>
              {loading && (
                <span className="text-[11px] text-slate-400">
                  Laster…
                </span>
              )}
            </div>

            <div className="overflow-x-auto text-xs md:text-sm">
              <table className="min-w-full border-separate border-spacing-0">
                <thead className="bg-slate-900/90 text-slate-300">
                  <tr>
                    <th className="text-left px-4 py-2 border-b border-slate-800/70">
                      Produkt
                    </th>
                    <th className="text-left px-4 py-2 border-b border-slate-800/70">
                      SKU
                    </th>
                    <th className="text-left px-4 py-2 border-b border-slate-800/70">
                      Pris
                    </th>
                    <th className="text-left px-4 py-2 border-b border-slate-800/70">
                      Lager
                    </th>
                    <th className="text-left px-4 py-2 border-b border-slate-800/70">
                      Status
                    </th>
                    <th className="text-right px-4 py-2 border-b border-slate-800/70">
                      Handling
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-4 text-slate-500 italic"
                      >
                        Ingen produkter registrert enda.
                      </td>
                    </tr>
                  ) : (
                    products.map((p, idx) => (
                      <tr
                        key={p.id}
                        className={
                          idx % 2 === 0
                            ? 'bg-slate-900/80'
                            : 'bg-slate-900/60'
                        }
                      >
                        <td className="px-4 py-2 text-slate-100">
                          <div className="font-medium">{p.name}</div>
                          {p.description && (
                            <div className="text-[11px] text-slate-400">
                              {p.description}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-2 text-slate-100">
                          {p.sku || <span className="text-slate-500">–</span>}
                        </td>
                        <td className="px-4 py-2 text-slate-100">
                          {typeof p.price === 'number'
                            ? `${p.price} kr`
                            : '–'}
                        </td>
                        <td className="px-4 py-2 text-slate-100">
                          {typeof p.stock === 'number'
                            ? p.stock
                            : '–'}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] border 
                              ${
                                p.active
                                  ? 'bg-emerald-500/10 border-emerald-400/70 text-emerald-100'
                                  : 'bg-slate-800/80 border-slate-600/80 text-slate-300'
                              }`}
                          >
                            {p.active ? 'Aktiv' : 'Deaktivert'}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <button
                            type="button"
                            onClick={() => toggleActive(p)}
                            className="rounded-lg border border-slate-700/70 bg-slate-900/80 px-3 py-1 text-[11px] text-slate-100 hover:bg-slate-800/90"
                          >
                            {p.active ? 'Deaktiver' : 'Aktiver'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
