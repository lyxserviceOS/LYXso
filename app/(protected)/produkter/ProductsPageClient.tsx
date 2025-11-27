"use client";

import { useEffect, useState, FormEvent } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";
const ORG_ID =
  process.env.NEXT_PUBLIC_ORG_ID ?? "ae407558-7f44-40cb-8fe9-1d023212b926";

type ProductCategory = {
  id: string;
  orgId: string;
  name: string;
  position: number;
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
};

type ProductCategoryFormState = {
  id?: string;
  name: string;
  position: string;
};

type ProductCategoryPayload = {
  name: string;
  position?: number;
};

type ProductFormState = {
  id?: string;
  name: string;
  description: string;
  sku: string;
  price: string;
  unit: string;
  isActive: boolean;
};

export default function ProductsPageClient() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [categoryForm, setCategoryForm] = useState<ProductCategoryFormState>({
    name: "",
    position: "",
  });

  const [productForm, setProductForm] = useState<ProductFormState>({
    name: "",
    description: "",
    sku: "",
    price: "",
    unit: "",
    isActive: true,
  });

  const isEditingCategory = Boolean(categoryForm.id);
  const isEditingProduct = Boolean(productForm.id);

  useEffect(() => {
    void loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    setError(null);

    try {
      const [catRes, prodRes] = await Promise.all([
        fetch(
          `${API_BASE_URL}/api/orgs/${encodeURIComponent(
            ORG_ID,
          )}/product-categories`,
        ),
        fetch(
          `${API_BASE_URL}/api/orgs/${encodeURIComponent(ORG_ID)}/products`,
        ),
      ]);

      if (!catRes.ok) {
        const txt = await catRes.text().catch(() => "");
        throw new Error(
          `Feil ved henting av produkt-kategorier (${catRes.status}): ${txt}`,
        );
      }

      if (!prodRes.ok) {
        const txt = await prodRes.text().catch(() => "");
        throw new Error(
          `Feil ved henting av produkter (${prodRes.status}): ${txt}`,
        );
      }

      const catJson = (await catRes.json()) as {
        categories?: ProductCategory[];
      };
      const prodJson = (await prodRes.json()) as { products?: Product[] };

      setCategories(catJson.categories ?? []);
      setProducts(prodJson.products ?? []);
    } catch (err: unknown) {
      console.error("loadAll products error:", err);
      const errorMessage = err instanceof Error ? err.message : "Uventet feil ved henting av data";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // ---------- PRODUKT-KATEGORIER ----------

  function resetCategoryForm() {
    setCategoryForm({ id: undefined, name: "", position: "" });
  }

  function handleEditCategory(cat: ProductCategory) {
    setCategoryForm({
      id: cat.id,
      name: cat.name ?? "",
      position:
        typeof cat.position === "number" && !Number.isNaN(cat.position)
          ? String(cat.position)
          : "",
    });
  }

  async function handleSubmitCategory(e: FormEvent) {
    e.preventDefault();
    if (!categoryForm.name.trim()) return;

    setSaving(true);
    setError(null);

    const isEdit = Boolean(categoryForm.id);
    const url = isEdit
      ? `${API_BASE_URL}/api/orgs/${encodeURIComponent(
          ORG_ID,
        )}/product-categories/${encodeURIComponent(categoryForm.id!)}`
      : `${API_BASE_URL}/api/orgs/${encodeURIComponent(
          ORG_ID,
        )}/product-categories`;

    const payload: ProductCategoryPayload = {
      name: categoryForm.name.trim(),
    };

    if (categoryForm.position.trim()) {
      const pos = Number(categoryForm.position.trim());
      if (!Number.isNaN(pos)) {
        payload.position = pos;
      }
    }

    try {
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(
          `Feil ved lagring av produkt-kategori (${res.status}): ${txt}`,
        );
      }

      resetCategoryForm();
      await loadAll();
    } catch (err: any) {
      console.error("handleSubmitCategory (product) error:", err);
      setError(
        err?.message ?? "Uventet feil ved lagring av produkt-kategori",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteCategory(id: string) {
    const confirmed = window.confirm(
      "Er du sikker på at du vil slette denne produkt-kategorien?",
    );
    if (!confirmed) return;

    setSaving(true);
    setError(null);

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/orgs/${encodeURIComponent(
          ORG_ID,
        )}/product-categories/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok && res.status !== 204) {
        const txt = await res.text().catch(() => "");
        throw new Error(
          `Feil ved sletting av produkt-kategori (${res.status}): ${txt}`,
        );
      }

      if (categoryForm.id === id) {
        resetCategoryForm();
      }

      await loadAll();
    } catch (err: any) {
      console.error("handleDeleteCategory (product) error:", err);
      setError(
        err?.message ?? "Uventet feil ved sletting av produkt-kategori",
      );
    } finally {
      setSaving(false);
    }
  }

  // ---------- PRODUKTER ----------

  function resetProductForm() {
    setProductForm({
      id: undefined,
      name: "",
      description: "",
      sku: "",
      price: "",
      unit: "",
      isActive: true,
    });
  }

  function handleEditProduct(product: Product) {
    setProductForm({
      id: product.id,
      name: product.name ?? "",
      description: product.description ?? "",
      sku: product.sku ?? "",
      price:
        product.price != null && !Number.isNaN(product.price)
          ? String(product.price)
          : "",
      unit: product.unit ?? "",
      isActive: product.isActive ?? true,
    });
  }

  async function handleSubmitProduct(e: FormEvent) {
    e.preventDefault();
    if (!productForm.name.trim()) return;

    setSaving(true);
    setError(null);

    const isEdit = Boolean(productForm.id);
    const url = isEdit
      ? `${API_BASE_URL}/api/orgs/${encodeURIComponent(
          ORG_ID,
        )}/products/${encodeURIComponent(productForm.id!)}`
      : `${API_BASE_URL}/api/orgs/${encodeURIComponent(ORG_ID)}/products`;

    const price =
      productForm.price.trim() !== ""
        ? Number(productForm.price.trim())
        : null;

    const payload: any = {
      name: productForm.name.trim(),
      description: productForm.description.trim() || null,
      sku: productForm.sku.trim() || null,
      price,
      unit: productForm.unit.trim() || null,
      isActive: productForm.isActive,
    };

    try {
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(
          `Feil ved lagring av produkt (${res.status}): ${txt}`,
        );
      }

      resetProductForm();
      await loadAll();
    } catch (err: any) {
      console.error("handleSubmitProduct error:", err);
      setError(err?.message ?? "Uventet feil ved lagring av produkt");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteProduct(id: string) {
    const confirmed = window.confirm(
      "Er du sikker på at du vil slette dette produktet?",
    );
    if (!confirmed) return;

    setSaving(true);
    setError(null);

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/orgs/${encodeURIComponent(
          ORG_ID,
        )}/products/${encodeURIComponent(id)}`,
        { method: "DELETE" },
      );

      if (!res.ok && res.status !== 204) {
        const txt = await res.text().catch(() => "");
        throw new Error(
          `Feil ved sletting av produkt (${res.status}): ${txt}`,
        );
      }

      if (productForm.id === id) {
        resetProductForm();
      }

      await loadAll();
    } catch (err: any) {
      console.error("handleDeleteProduct error:", err);
      setError(err?.message ?? "Uventet feil ved sletting av produkt");
    } finally {
      setSaving(false);
    }
  }

  // ---------- RENDER ----------

  if (loading) {
    return (
      <div className="h-full w-full overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm text-slate-500">Laster produkter …</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto px-6 py-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Produkter
            </h1>
            <p className="text-sm text-slate-500">
              Administrer produkter som brukes i tjenester, eller selges til
              kunder.
            </p>
          </div>
          <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
            <p className="font-medium text-slate-700">
              Org-ID: <span className="font-mono">{ORG_ID}</span>
            </p>
            {saving && (
              <p className="mt-1 text-[11px] text-blue-600">
                Lagrer endringer…
              </p>
            )}
          </div>
        </header>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          {/* PRODUKT-KATEGORIER */}
          <section className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3">
                <h2 className="text-sm font-semibold text-slate-900">
                  Produkt-kategorier
                </h2>
                <p className="text-xs text-slate-500">
                  Struktur for produktlisten (f.eks. “Coating”, “Rens”,
                  “Forbruk”).
                </p>
              </div>

              <form
                onSubmit={handleSubmitCategory}
                className="space-y-3 rounded-lg bg-slate-50 p-3"
              >
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="flex-1">
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Navn
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={categoryForm.name}
                      onChange={(e) =>
                        setCategoryForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="F.eks. Coating-produkter"
                    />
                  </div>
                  <div className="w-24">
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Sortering
                    </label>
                    <input
                      type="number"
                      className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={categoryForm.position}
                      onChange={(e) =>
                        setCategoryForm((prev) => ({
                          ...prev,
                          position: e.target.value,
                        }))
                      }
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
                    disabled={saving || !categoryForm.name.trim()}
                  >
                    {isEditingCategory
                      ? "Oppdater kategori"
                      : "Legg til kategori"}
                  </button>
                  {isEditingCategory && (
                    <button
                      type="button"
                      className="text-xs text-slate-500 hover:text-slate-700"
                      onClick={resetCategoryForm}
                    >
                      Avbryt redigering
                    </button>
                  )}
                </div>
              </form>

              <div className="mt-4 space-y-1">
                {categories.length === 0 && (
                  <p className="text-xs text-slate-500">
                    Ingen produkt-kategorier enda. Legg til den første over.
                  </p>
                )}

                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
                  >
                    <div>
                      <p className="font-medium text-slate-800">
                        {cat.name || "Uten navn"}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Sortering: {cat.position ?? 0}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="text-[11px] font-medium text-blue-600 hover:text-blue-700"
                        onClick={() => handleEditCategory(cat)}
                      >
                        Rediger
                      </button>
                      <button
                        type="button"
                        className="text-[11px] font-medium text-red-500 hover:text-red-600"
                        onClick={() => void handleDeleteCategory(cat.id)}
                      >
                        Slett
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* PRODUKTER */}
          <section className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3">
                <h2 className="text-sm font-semibold text-slate-900">
                  Produkter
                </h2>
                <p className="text-xs text-slate-500">
                  Produkter du bruker i tjenester, eller selger direkte.
                </p>
              </div>

              <form
                onSubmit={handleSubmitProduct}
                className="space-y-3 rounded-lg bg-slate-50 p-3"
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Navn
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={productForm.name}
                      onChange={(e) =>
                        setProductForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="F.eks. LYX 9H Quartz 30ml"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Pris (kr)
                    </label>
                    <input
                      type="number"
                      className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={productForm.price}
                      onChange={(e) =>
                        setProductForm((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                      placeholder="F.eks. 990"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Enhet
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={productForm.unit}
                      onChange={(e) =>
                        setProductForm((prev) => ({
                          ...prev,
                          unit: e.target.value,
                        }))
                      }
                      placeholder="F.eks. stk, flaske, liter"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      SKU / artikkelnummer
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={productForm.sku}
                      onChange={(e) =>
                        setProductForm((prev) => ({
                          ...prev,
                          sku: e.target.value,
                        }))
                      }
                      placeholder="Valgfritt internt nummer"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Beskrivelse
                    </label>
                    <textarea
                      className="min-h-[60px] w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={productForm.description}
                      onChange={(e) =>
                        setProductForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Kort forklaring på hva dette produktet brukes til."
                    />
                  </div>

                  <div className="flex items-center gap-2 md:col-span-2">
                    <input
                      id="product-active"
                      type="checkbox"
                      className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      checked={productForm.isActive}
                      onChange={(e) =>
                        setProductForm((prev) => ({
                          ...prev,
                          isActive: e.target.checked,
                        }))
                      }
                    />
                    <label
                      htmlFor="product-active"
                      className="text-xs text-slate-600"
                    >
                      Produktet er aktivt (tilgjengelig i systemet)
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
                    disabled={saving || !productForm.name.trim()}
                  >
                    {isEditingProduct ? "Oppdater produkt" : "Legg til produkt"}
                  </button>
                  {isEditingProduct && (
                    <button
                      type="button"
                      className="text-xs text-slate-500 hover:text-slate-700"
                      onClick={resetProductForm}
                    >
                      Avbryt redigering
                    </button>
                  )}
                </div>
              </form>

              <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
                {products.length === 0 ? (
                  <div className="px-3 py-4 text-xs text-slate-500">
                    Ingen produkter registrert enda. Legg til det første i
                    skjemaet over.
                  </div>
                ) : (
                  <table className="min-w-full text-left text-xs">
                    <thead className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-3 py-2">Navn</th>
                        <th className="px-3 py-2">SKU</th>
                        <th className="px-3 py-2">Pris</th>
                        <th className="px-3 py-2">Enhet</th>
                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr
                          key={product.id}
                          className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                        >
                          <td className="px-3 py-2 text-slate-800">
                            {product.name || "Uten navn"}
                          </td>
                          <td className="px-3 py-2 text-slate-500">
                            {product.sku ?? "–"}
                          </td>
                          <td className="px-3 py-2 text-slate-500">
                            {product.price != null
                              ? `${product.price.toLocaleString("nb-NO")} kr`
                              : "–"}
                          </td>
                          <td className="px-3 py-2 text-slate-500">
                            {product.unit ?? "–"}
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={[
                                "inline-flex items-center rounded-full px-2 py-0.5 text-[11px]",
                                product.isActive
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                  : "bg-slate-100 text-slate-500 border border-slate-200",
                              ].join(" ")}
                            >
                              {product.isActive ? "Aktiv" : "Inaktiv"}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-right">
                            <button
                              type="button"
                              className="mr-2 text-[11px] font-medium text-blue-600 hover:text-blue-700"
                              onClick={() => handleEditProduct(product)}
                            >
                              Rediger
                            </button>
                            <button
                              type="button"
                              className="text-[11px] font-medium text-red-500 hover:text-red-600"
                              onClick={() =>
                                void handleDeleteProduct(product.id)
                              }
                            >
                              Slett
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
