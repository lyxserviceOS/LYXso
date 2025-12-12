"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, X, Upload } from "lucide-react";
import type { WebshopProduct } from "@/types/webshop";

interface ProductFormProps {
  product?: WebshopProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const CATEGORIES = [
  { value: "dekk", label: "Dekk" },
  { value: "felger", label: "Felger" },
  { value: "bilpleie", label: "Bilpleie" },
  { value: "tilbehor", label: "Tilbehør" },
  { value: "verksted", label: "Verksteddeler" },
  { value: "vedlikehold", label: "Vedlikehold" },
  { value: "annet", label: "Annet" },
];

export default function ProductForm({
  product,
  open,
  onOpenChange,
  onSuccess,
}: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    short_description: product?.short_description || "",
    price: product?.price?.toString() || "",
    compare_at_price: product?.compare_at_price?.toString() || "",
    cost_price: product?.cost_price?.toString() || "",
    sku: product?.sku || "",
    barcode: product?.barcode || "",
    category: product?.category || "",
    tags: product?.tags?.join(", ") || "",
    quantity: product?.quantity?.toString() || "0",
    low_stock_threshold: product?.low_stock_threshold?.toString() || "5",
    track_inventory: product?.track_inventory ?? true,
    allow_backorder: product?.allow_backorder ?? false,
    is_active: product?.is_active ?? true,
    is_featured: product?.is_featured ?? false,
    requires_shipping: product?.requires_shipping ?? true,
    taxable: product?.taxable ?? true,
    meta_title: product?.meta_title || "",
    meta_description: product?.meta_description || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate slug from name
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const payload = {
        name: formData.name,
        slug,
        description: formData.description || null,
        short_description: formData.short_description || null,
        price: parseFloat(formData.price),
        compare_at_price: formData.compare_at_price
          ? parseFloat(formData.compare_at_price)
          : null,
        cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
        sku: formData.sku || null,
        barcode: formData.barcode || null,
        category: formData.category || null,
        tags: formData.tags
          ? formData.tags.split(",").map((t) => t.trim())
          : [],
        quantity: parseInt(formData.quantity) || 0,
        low_stock_threshold: parseInt(formData.low_stock_threshold) || 5,
        track_inventory: formData.track_inventory,
        allow_backorder: formData.allow_backorder,
        is_active: formData.is_active,
        is_featured: formData.is_featured,
        requires_shipping: formData.requires_shipping,
        taxable: formData.taxable,
        meta_title: formData.meta_title || null,
        meta_description: formData.meta_description || null,
        images: [],
      };

      const url = product
        ? `/api/webshop/products/${product.id}`
        : `/api/webshop/products`;
      const method = product ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save product");
      }

      toast.success(product ? "Produkt oppdatert" : "Produkt opprettet");
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Save product error:", error);
      toast.error("Kunne ikke lagre produkt", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {product ? "Rediger produkt" : "Legg til produkt"}
            </DialogTitle>
            <DialogDescription>
              Fyll ut produktinformasjon. Obligatoriske felt er merket med *.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Grunnleggende informasjon</h3>

              <div className="space-y-2">
                <Label htmlFor="name">Produktnavn *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="F.eks. Michelin Pilot Sport 4 225/45R17"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_description">Kort beskrivelse</Label>
                <Input
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      short_description: e.target.value,
                    })
                  }
                  placeholder="Kort sammendrag (vises i produktliste)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Beskrivelse</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Detaljert produktbeskrivelse..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Velg kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (kommaseparert)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    placeholder="sommer, performance, premium"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Priser</h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Pris *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="1299.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="compare_at_price">Før-pris</Label>
                  <Input
                    id="compare_at_price"
                    type="number"
                    step="0.01"
                    value={formData.compare_at_price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        compare_at_price: e.target.value,
                      })
                    }
                    placeholder="1499.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cost_price">Innkjøpspris</Label>
                  <Input
                    id="cost_price"
                    type="number"
                    step="0.01"
                    value={formData.cost_price}
                    onChange={(e) =>
                      setFormData({ ...formData, cost_price: e.target.value })
                    }
                    placeholder="999.00"
                  />
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Lager</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    placeholder="PROD-001"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="barcode">Strekkode</Label>
                  <Input
                    id="barcode"
                    value={formData.barcode}
                    onChange={(e) =>
                      setFormData({ ...formData, barcode: e.target.value })
                    }
                    placeholder="5901234123457"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="track_inventory"
                  checked={formData.track_inventory}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      track_inventory: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="track_inventory" className="font-normal">
                  Spor lagerbeholdning
                </Label>
              </div>

              {formData.track_inventory && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Antall på lager</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="low_stock_threshold">Lav lager-grense</Label>
                    <Input
                      id="low_stock_threshold"
                      type="number"
                      value={formData.low_stock_threshold}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          low_stock_threshold: e.target.value,
                        })
                      }
                      placeholder="5"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allow_backorder"
                  checked={formData.allow_backorder}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      allow_backorder: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="allow_backorder" className="font-normal">
                  Tillat restordre
                </Label>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Innstillinger</h3>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_active: checked as boolean })
                    }
                  />
                  <Label htmlFor="is_active" className="font-normal">
                    Aktiv (synlig i nettbutikk)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        is_featured: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="is_featured" className="font-normal">
                    Fremhevet produkt
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requires_shipping"
                    checked={formData.requires_shipping}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        requires_shipping: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="requires_shipping" className="font-normal">
                    Krever frakt
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="taxable"
                    checked={formData.taxable}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, taxable: checked as boolean })
                    }
                  />
                  <Label htmlFor="taxable" className="font-normal">
                    Mva-pliktig
                  </Label>
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">SEO (valgfritt)</h3>

              <div className="space-y-2">
                <Label htmlFor="meta_title">Meta-tittel</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) =>
                    setFormData({ ...formData, meta_title: e.target.value })
                  }
                  placeholder="SEO-tittel for søkemotorer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta-beskrivelse</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      meta_description: e.target.value,
                    })
                  }
                  placeholder="SEO-beskrivelse for søkemotorer"
                  rows={2}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Avbryt
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Lagrer...
                </>
              ) : product ? (
                "Oppdater"
              ) : (
                "Opprett"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
