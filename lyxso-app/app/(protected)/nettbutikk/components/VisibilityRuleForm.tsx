"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Loader2 } from "lucide-react";

interface VisibilityRule {
  id?: string;
  name: string;
  rule_type: "customer_type" | "location" | "plan" | "custom";
  conditions: {
    customer_types?: string[];
    locations?: string[];
    plans?: string[];
    custom?: Record<string, any>;
  };
  product_filters: {
    categories?: string[];
    tags?: string[];
    price_range?: { min?: number; max?: number };
    partner_products?: boolean;
    own_products?: boolean;
    specific_products?: string[];
  };
  is_active: boolean;
  priority: number;
}

interface VisibilityRuleFormProps {
  rule?: VisibilityRule | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const RULE_TYPES = [
  { value: "customer_type", label: "Kundetype", description: "Basert på kundetype (privat, bedrift, VIP)" },
  { value: "location", label: "Lokasjon", description: "Basert på kundens lokasjon" },
  { value: "plan", label: "Abonnement", description: "Basert på kundens abonnement" },
  { value: "custom", label: "Tilpasset", description: "Egendefinerte regler" },
];

const CUSTOMER_TYPES = [
  { value: "private", label: "Privatpersoner" },
  { value: "business", label: "Bedriftskunder" },
  { value: "vip", label: "VIP-kunder" },
];

const CATEGORIES = [
  { value: "dekk", label: "Dekk" },
  { value: "felger", label: "Felger" },
  { value: "bilpleie", label: "Bilpleie" },
  { value: "tilbehor", label: "Tilbehør" },
  { value: "verksted", label: "Verksteddeler" },
  { value: "vedlikehold", label: "Vedlikehold" },
  { value: "annet", label: "Annet" },
];

export default function VisibilityRuleForm({
  rule,
  open,
  onOpenChange,
  onSuccess,
}: VisibilityRuleFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: rule?.name || "",
    rule_type: rule?.rule_type || "customer_type" as const,
    priority: rule?.priority?.toString() || "0",
    is_active: rule?.is_active ?? true,
    
    // Conditions
    customer_types: rule?.conditions.customer_types || [],
    locations: rule?.conditions.locations || [],
    plans: rule?.conditions.plans || [],
    
    // Product filters
    categories: rule?.product_filters.categories || [],
    tags: rule?.product_filters.tags?.join(", ") || "",
    min_price: rule?.product_filters.price_range?.min?.toString() || "",
    max_price: rule?.product_filters.price_range?.max?.toString() || "",
    partner_products: rule?.product_filters.partner_products ?? true,
    own_products: rule?.product_filters.own_products ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        rule_type: formData.rule_type,
        priority: parseInt(formData.priority) || 0,
        is_active: formData.is_active,
        conditions: {
          ...(formData.rule_type === "customer_type" && {
            customer_types: formData.customer_types,
          }),
          ...(formData.rule_type === "location" && {
            locations: formData.locations,
          }),
          ...(formData.rule_type === "plan" && {
            plans: formData.plans,
          }),
        },
        product_filters: {
          categories: formData.categories.length > 0 ? formData.categories : undefined,
          tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : undefined,
          price_range: {
            ...(formData.min_price && { min: parseFloat(formData.min_price) }),
            ...(formData.max_price && { max: parseFloat(formData.max_price) }),
          },
          partner_products: formData.partner_products,
          own_products: formData.own_products,
        },
      };

      const url = rule
        ? `/api/webshop/visibility-rules/${rule.id}`
        : `/api/webshop/visibility-rules`;
      const method = rule ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save rule");
      }

      toast.success(rule ? "Regel oppdatert" : "Regel opprettet");
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Save rule error:", error);
      toast.error("Kunne ikke lagre regel", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedRuleType = RULE_TYPES.find((t) => t.value === formData.rule_type);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {rule ? "Rediger synlighetsregel" : "Opprett synlighetsregel"}
            </DialogTitle>
            <DialogDescription>
              Definer hvilke produkter som skal være synlige for hvem
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Regelnavn *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="F.eks. VIP-kunder ser premium produkter"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rule_type">Regeltype *</Label>
                  <Select
                    value={formData.rule_type}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, rule_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RULE_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedRuleType && (
                    <p className="text-xs text-muted-foreground">
                      {selectedRuleType.description}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Prioritet</Label>
                  <Input
                    id="priority"
                    type="number"
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                    placeholder="0"
                  />
                  <p className="text-xs text-muted-foreground">
                    Høyere tall = høyere prioritet
                  </p>
                </div>
              </div>
            </div>

            {/* Conditions */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Betingelser</h3>
              <p className="text-xs text-muted-foreground">
                Velg hvem denne regelen gjelder for
              </p>

              {formData.rule_type === "customer_type" && (
                <div className="space-y-2">
                  <Label>Kundetyper</Label>
                  <div className="space-y-2">
                    {CUSTOMER_TYPES.map((type) => (
                      <div key={type.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`customer_${type.value}`}
                          checked={formData.customer_types.includes(type.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                customer_types: [...formData.customer_types, type.value],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                customer_types: formData.customer_types.filter(
                                  (t) => t !== type.value
                                ),
                              });
                            }
                          }}
                        />
                        <Label htmlFor={`customer_${type.value}`} className="font-normal">
                          {type.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.rule_type === "location" && (
                <div className="space-y-2">
                  <Label htmlFor="locations">Lokasjoner (kommaseparert)</Label>
                  <Input
                    id="locations"
                    value={formData.locations.join(", ")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        locations: e.target.value.split(",").map((l) => l.trim()),
                      })
                    }
                    placeholder="Oslo, Bergen, Trondheim"
                  />
                </div>
              )}

              {formData.rule_type === "plan" && (
                <div className="space-y-2">
                  <Label htmlFor="plans">Abonnementer (kommaseparert)</Label>
                  <Input
                    id="plans"
                    value={formData.plans.join(", ")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        plans: e.target.value.split(",").map((p) => p.trim()),
                      })
                    }
                    placeholder="basic, pro, enterprise"
                  />
                </div>
              )}
            </div>

            {/* Product Filters */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Produktfilter</h3>
              <p className="text-xs text-muted-foreground">
                Velg hvilke produkter som skal være synlige
              </p>

              <div className="space-y-2">
                <Label>Kategorier</Label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => (
                    <div key={cat.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cat_${cat.value}`}
                        checked={formData.categories.includes(cat.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              categories: [...formData.categories, cat.value],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              categories: formData.categories.filter(
                                (c) => c !== cat.value
                              ),
                            });
                          }
                        }}
                      />
                      <Label htmlFor={`cat_${cat.value}`} className="font-normal">
                        {cat.label}
                      </Label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Tom = alle kategorier
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (kommaseparert)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="premium, sommer, performance"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min_price">Min pris</Label>
                  <Input
                    id="min_price"
                    type="number"
                    step="0.01"
                    value={formData.min_price}
                    onChange={(e) =>
                      setFormData({ ...formData, min_price: e.target.value })
                    }
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_price">Maks pris</Label>
                  <Input
                    id="max_price"
                    type="number"
                    step="0.01"
                    value={formData.max_price}
                    onChange={(e) =>
                      setFormData({ ...formData, max_price: e.target.value })
                    }
                    placeholder="∞"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="partner_products"
                    checked={formData.partner_products}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        partner_products: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="partner_products" className="font-normal">
                    Vis partnerprodukter
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="own_products"
                    checked={formData.own_products}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        own_products: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="own_products" className="font-normal">
                    Vis egne produkter
                  </Label>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked as boolean })
                }
              />
              <Label htmlFor="is_active" className="font-normal">
                Aktiv regel
              </Label>
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
              ) : rule ? (
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
