"use client";

import { useEffect, useState, FormEvent } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000";
const ORG_ID =
  process.env.NEXT_PUBLIC_ORG_ID ??
  "ae407558-7f44-40cb-8fe9-1d023212b926";

type ProductCategory = {
  id: string;
  orgId: string;
  name: string;
  position: number;
};

type Product = {
  id: string;
  orgId: string;
  name: string;
  description: string | null;
  sku: string | null;
  price: number | null;
  unit: string | null;
  isActive: boolean;
};

type ApiError = string | null;

export default function ProdukterPageClient() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError>(null);

  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Ny kategori
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryPosition, setNewCategoryPosition] = useState("");

  // Ny / rediger produkt
  const [editingProductId, setEditingProductId] = useState<string | null>(
    null,
  );
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productSku, setProductSku] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productUnit, setProductUnit] = useState("");
  const [productIsActive, setProductIsActive] = useState(true);

  const [savingProduct, setSavingProduct] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!ORG_ID) {
      setError(
        "Mangler NEXT_PUBLIC_ORG_ID – sett denne i .env.local for å kunne hente produkter.",
      );
      setLoading(false);
      return;
    }

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [catRes, prodRes] = await Promise.all([
          fetch(
            `${API_BASE_URL}/api/orgs/${encodeURIComponent(
              ORG_ID,
            )}/product-categories`,
          ),
          fetch(
            `${API_BASE_URL}/api/orgs/${encodeURIComponent(
              ORG_ID,
            )}/products`,
          ),
        ]);

        if (!catRes.ok) {
          const text = await catRes.text().catch(() => "");
          throw new Error(
            `Feil ved henting av produktkategorier (${catRes.status}): ${text}`,
          );
        }

        if (!prodRes.ok) {
          const text = await prodRes.text().catch(() => "");
          throw new Error(
            `Feil ved henting av produkter (${prodRes.status}): ${text}`,
          );
        }

        const catJson = await catRes.json();
        const prodJson = await prodRes.json();

        setCategories(catJson.categories ?? []);
        setProducts(prodJson.products ?? []);
      } catch (err: any) {
        console.error("Feil ved henting av produkter/kategorier:", err);
        setError(
          err?.message ??
            "Uventet feil ved henting av produkter og kategorier.",
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function resetProductForm() {
    setEditingProductId(null);
    setProductName("");
    setProductDescription("");
    setProductSku("");
    setProductPrice("");
    setProductUnit("");
    setProductIsActive(true);
  }

  function startEditProduct(product: Product) {
    setEditingProductId(product.id);
    setProductName(product.name);
    setProductDescription(product.description ?? "");
    setProductSku(product.sku ?? "");
    setProductPrice(
      product.price != null ? String(product.price) : "",
    );
    setProductUnit(product.unit ?? "");
    setProductIsActive(
      typeof product.isActive === "boolean" ? product.isActive : true,
    );
  }

  async function handleSaveCategory(e: FormEvent) {
    e.preventDefault();
    if (!ORG_ID) return;

    const name = newCategoryName.trim();
    if (!name) return;

    setSavingCategory(true);
    setError(null);

    try {
      const body = {
        name,
        position: newCategoryPosition
          ? Number(newCategoryPosition)
          : undefined,
      };

      const res = await fetch(
        `${API_BASE_URL}/api/orgs/${encodeURIComponent(
          ORG_ID,
        )}/product-categories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
      );

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(
          `Klarte ikke å opprette produktkategori (${res.status}): ${text}`,
        );
      }

      const json = await res.json();
      const created = json.category as ProductCategory;

      setCategories((prev) =>
        [...prev, created].sort((a, b) => a.position - b.position),
      );
      setNewCategoryName("");
      setNewCategoryPosition("");
    } catch (err: any) {
      console.error("Feil ved lagring av produktkategori:", err);
      setError(err?.message ?? "Feil ved lagring av produktkategori.");
    } finally {
      setSavingCategory(false);
    }
  }

  async function handleDeleteCategory(categoryId: string) {
    if (!ORG_ID) return;
    if (
      !window.confirm(
        "Slette produktkategori? Produkter beholder data, men mister evt. tilknytning i fremtidige løsninger.",
      )
    ) {
      return;
    }

    try {
      setDeletingId(categoryId);
      setError(null);

      const res = await fetch(
        `${API_BASE_URL}/api/orgs/${encodeURIComponent(
          ORG_ID,
        )}/product-categories/${encodeURIComponent(categoryId)}`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok && res.status !== 204) {
        const text = await res.text().catch(() => "");
        throw new Error(
          `Klarte ikke å slette produktkategori (${res.status}): ${text}`,
        );
      }

      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
      // Merk: products har per nå ingen categoryId-felt, så ingenting å rydde der.
    } catch (err: any) {
      console.error("Feil ved sletting av produktkategori:", err);
      setError(err?.message ?? "Feil ved sletting av produktkategori.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSaveProduct(e: FormEvent) {
    e.preventDefault();
    if (!ORG_ID) return;

    const name = productName.trim();
    if (!name) return;

    setSavingProduct(true);
    setError(null);

    try {
      const body = {
        name,
        description: productDescription.trim() || null,
        sku: productSku.trim() || null,
        price: productPrice ? Number(productPrice) : null,
        unit: productUnit.trim() || null,
        isActive: productIsActive,
      };

      const isEdit = !!editingProductId;

      const url = isEdit
        ? `${API_BASE_URL}/api/orgs/${encodeURIComponent(
            ORG_ID,
          )}/products/${encodeURIComponent(editingProductId!)}`
        : `${API_BASE_URL}/api/orgs/${encodeURIComponent(
            ORG_ID,
          )}/products`;

      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(
          `Klarte ikke å ${isEdit ? "oppdatere" : "opprette"} produkt (${
            res.status
          }): ${text}`,
        );
      }

      const json = await res.json();
      const saved = json.product as Product;

      setProducts((prev) => {
        if (isEdit) {
          return prev.map((p) => (p.id === saved.id ? saved : p));
        }
        return [...prev, saved].sort((a, b) =>
          a.name.localeCompare(b.name),
        );
      });

      resetProductForm();
    } catch (err: any) {
      console.error("Feil ved lagring av produkt:", err);
      setError(err?.message ?? "Feil ved lagring av produkt.");
    } finally {
      setSavingProduct(false);
    }
  }

  async function handleDeleteProduct(productId: string) {
    if (!ORG_ID) return;
    if (!window.confirm("Slette dette produktet?")) return;

    try {
      setDeletingId(productId);
      setError(null);

      const res = await fetch(
        `${API_BASE_URL}/api/orgs/${encodeURIComponent(
          ORG_ID,
        )}/products/${encodeURIComponent(productId)}`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok && res.status !== 204) {
        const text = await res.text().catch(() => "");
        throw new Error(
          `Klarte ikke å slette produkt (${res.status}): ${text}`,
        );
      }

      setProducts((prev) => prev.filter((p) => p.id !== productId));
      if (editingProductId === productId) {
        resetProductForm();
      }
    } catch (err: any) {
      console.error("Feil ved sletting av produkt:", err);
      setError(err?.message ?? "Feil ved sletting av produkt.");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="h-full w-full overflow-y-auto bg-slate-50 px-6 py-6">
        <div className="mx-auto max-w-6xl text-sm text-slate-500">
          Laster produkter og kategorier …
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto bg-slate-50 px-6 py-6">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Topptekst */}
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              DRIFT · PRODUKTER
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
              Produkter & forbruk
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Administrer produktene dere bruker i tjenester og salg – inkl.
              pris, SKU og enhet.
            </p>
          </div>
        </header>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        )}

        {/* Grid: venstre = produkter, høyre = kategorier */}
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          {/* PRODUKTER */}
          <section className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">
                {editingProductId ? "Rediger produkt" : "Nytt produkt"}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Bruk produktene både i intern oversikt, forbruk og evt. salg.
              </p>

              <form
                onSubmit={handleSaveProduct}
                className="mt-4 space-y-3 text-sm"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">
                      Navn
                    </label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="F.eks. LYX 9H Quartz, interiørrens …"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">
                      SKU / artikkelnummer (valgfritt)
                    </label>
                    <input
                      type="text"
                      value={productSku}
                      onChange={(e) => setProductSku(e.target.value)}
                      className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="F.eks. LYX-COAT-9H"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">
                    Beskrivelse (valgfritt)
                  </label>
                  <textarea
                    value={productDescription}
                    onChange={(e) =>
                      setProductDescription(e.target.value)
                    }
                    rows={2}
                    className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Kort info – f.eks. bruksområde eller type produkt."
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">
                      Pris (NOK, valgfritt)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                      className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="F.eks. 399"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">
                      Enhet (valgfritt)
                    </label>
                    <input
                      type="text"
                      value={productUnit}
                      onChange={(e) => setProductUnit(e.target.value)}
                      className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="F.eks. flaske, liter, stk"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    id="product-active"
                    type="checkbox"
                    className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    checked={productIsActive}
                    onChange={(e) => setProductIsActive(e.target.checked)}
                  />
                  <label
                    htmlFor="product-active"
                    className="text-xs text-slate-600"
                  >
                    Produktet er aktivt i systemet
                  </label>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={savingProduct}
                    className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {savingProduct
                      ? editingProductId
                        ? "Lagrer endringer …"
                        : "Oppretter produkt …"
                      : editingProductId
                      ? "Lagre endringer"
                      : "Legg til produkt"}
                  </button>
                  {editingProductId && (
                    <button
                      type="button"
                      onClick={resetProductForm}
                      className="text-xs font-medium text-slate-500 hover:text-slate-700"
                    >
                      Avbryt redigering
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">
                Eksisterende produkter
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Brukes i rapporter, forbruk og evt. salg.
              </p>

              {products.length === 0 ? (
                <div className="mt-3 rounded-md border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
                  Ingen produkter registrert ennå.
                </div>
              ) : (
                <div className="mt-3 overflow-hidden rounded-md border border-slate-200">
                  <table className="min-w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-100 text-[11px] uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-3 py-2">Navn</th>
                        <th className="px-3 py-2">SKU</th>
                        <th className="px-3 py-2">Pris</th>
                        <th className="px-3 py-2">Enhet</th>
                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2 text-right">Handlinger</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr
                          key={p.id}
                          className="border-t border-slate-200 bg-white hover:bg-slate-50"
                        >
                          <td className="px-3 py-2 align-top">
                            <div className="font-medium text-slate-900">
                              {p.name}
                            </div>
                            {p.description && (
                              <div className="text-[11px] text-slate-500">
                                {p.description}
                              </div>
                            )}
                          </td>
                          <td className="px-3 py-2 align-top text-[11px] text-slate-600">
                            {p.sku ?? "–"}
                          </td>
                          <td className="px-3 py-2 align-top text-[11px] text-slate-600">
                            {p.price != null
                              ? `${p.price.toLocaleString("nb-NO")} kr`
                              : "–"}
                          </td>
                          <td className="px-3 py-2 align-top text-[11px] text-slate-600">
                            {p.unit ?? "–"}
                          </td>
                          <td className="px-3 py-2 align-top">
                            <span
                              className={[
                                "inline-flex items-center rounded-full px-2 py-0.5 text-[11px]",
                                p.isActive
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                  : "bg-slate-100 text-slate-500 border border-slate-200",
                              ].join(" ")}
                            >
                              {p.isActive ? "Aktiv" : "Inaktiv"}
                            </span>
                          </td>
                          <td className="px-3 py-2 align-top text-right text-[11px]">
                            <button
                              type="button"
                              onClick={() => startEditProduct(p)}
                              className="mr-2 text-blue-600 hover:text-blue-800"
                            >
                              Rediger
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(p.id)}
                              disabled={deletingId === p.id}
                              className="text-red-600 hover:text-red-800 disabled:opacity-60"
                            >
                              {deletingId === p.id ? "Sletter…" : "Slett"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>

          {/* PRODUKTKATEGORIER */}
          <section className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">
                Produktkategorier
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Nyttig for å gruppere produkter (f.eks. “Coating”, “Innvendig”,
                “Felg & dekk”, “Forbruk”).
              </p>

              <form
                onSubmit={handleSaveCategory}
                className="mt-4 space-y-3 text-sm"
              >
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">
                    Navn
                  </label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="F.eks. Coating, Interiør, Forbruk"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">
                    Sorteringsposisjon (valgfritt)
                  </label>
                  <input
                    type="number"
                    value={newCategoryPosition}
                    onChange={(e) =>
                      setNewCategoryPosition(e.target.value)
                    }
                    className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Lavere tall = høyere opp"
                  />
                </div>
                <button
                  type="submit"
                  disabled={savingCategory}
                  className="inline-flex items-center rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingCategory
                    ? "Lagrer kategori …"
                    : "Legg til kategori"}
                </button>
              </form>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Eksisterende kategorier
              </h3>

              {categories.length === 0 ? (
                <div className="mt-3 rounded-md border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
                  Ingen produktkategorier enda. Legg til de viktigste du
                  skiller på i hverdagen.
                </div>
              ) : (
                <ul className="mt-3 space-y-2 text-xs text-slate-700">
                  {categories
                    .slice()
                    .sort((a, b) => a.position - b.position)
                    .map((cat) => (
                      <li
                        key={cat.id}
                        className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5"
                      >
                        <div>
                          <div className="font-medium text-slate-900">
                            {cat.name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Posisjon: {cat.position}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat.id)}
                          disabled={deletingId === cat.id}
                          className="text-[11px] text-red-600 hover:text-red-800 disabled:opacity-60"
                        >
                          {deletingId === cat.id ? "Sletter…" : "Slett"}
                        </button>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
