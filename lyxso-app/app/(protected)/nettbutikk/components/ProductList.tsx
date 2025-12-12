"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Plus, Edit, Trash2, Search, Package } from "lucide-react";
import type { WebshopProduct } from "@/types/webshop";
import ProductForm from "./ProductForm";

export default function ProductList() {
  const [products, setProducts] = useState<WebshopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<WebshopProduct | null>(
    null
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/webshop/products");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Kunne ikke laste produkter");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: WebshopProduct) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Er du sikker på at du vil slette dette produktet?")) return;

    try {
      const response = await fetch(`/api/webshop/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      toast.success("Produkt slettet");
      fetchProducts();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Kunne ikke slette produkt");
    }
  };

  const handleFormSuccess = () => {
    fetchProducts();
    setEditingProduct(null);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !categoryFilter || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Egne produkter</h2>
          <p className="text-sm text-muted-foreground">
            Administrer produkter fra eget lager
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingProduct(null);
            setFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Legg til produkt
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Søk etter navn eller SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Alle kategorier</option>
          <option value="dekk">Dekk</option>
          <option value="felger">Felger</option>
          <option value="bilpleie">Bilpleie</option>
          <option value="tilbehor">Tilbehør</option>
          <option value="verksted">Verksteddeler</option>
          <option value="vedlikehold">Vedlikehold</option>
          <option value="annet">Annet</option>
        </select>
      </div>

      {/* Products Table */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">
            {searchQuery || categoryFilter
              ? "Ingen produkter funnet"
              : "Ingen produkter ennå"}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {searchQuery || categoryFilter
              ? "Prøv å endre søkefiltrene"
              : "Kom i gang ved å legge til ditt første produkt"}
          </p>
          {!searchQuery && !categoryFilter && (
            <Button
              className="mt-4"
              onClick={() => {
                setEditingProduct(null);
                setFormOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Legg til produkt
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Produkt
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Kategori
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Pris
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Lager
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">
                    Handlinger
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <p className="font-medium">{product.name}</p>
                        {product.sku && (
                          <p className="text-xs text-muted-foreground">
                            SKU: {product.sku}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {product.category && (
                        <Badge variant="outline" className="capitalize">
                          {product.category}
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <p className="font-medium">kr {product.price}</p>
                        {product.compare_at_price && (
                          <p className="text-xs text-muted-foreground line-through">
                            kr {product.compare_at_price}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {product.track_inventory ? (
                        <div className="space-y-1">
                          <p className="font-medium">{product.quantity} stk</p>
                          {product.quantity <= product.low_stock_threshold && (
                            <Badge variant="destructive" className="text-xs">
                              Lavt lager
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Ikke sporet
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {product.is_active ? (
                        <Badge variant="outline" className="text-green-600">
                          Aktiv
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-red-600">
                          Inaktiv
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="rounded-lg border p-4">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{products.length}</p>
            <p className="text-xs text-muted-foreground">Totalt</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {products.filter((p) => p.is_active).length}
            </p>
            <p className="text-xs text-muted-foreground">Aktive</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {
                products.filter(
                  (p) =>
                    p.track_inventory && p.quantity <= p.low_stock_threshold
                ).length
              }
            </p>
            <p className="text-xs text-muted-foreground">Lavt lager</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {products.filter((p) => p.is_featured).length}
            </p>
            <p className="text-xs text-muted-foreground">Fremhevet</p>
          </div>
        </div>
      </div>

      {/* Product Form Dialog */}
      <ProductForm
        product={editingProduct}
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingProduct(null);
        }}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
