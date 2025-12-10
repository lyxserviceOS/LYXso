"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Plus, Edit, Trash2, Eye, EyeOff, MoveUp, MoveDown } from "lucide-react";
import VisibilityRuleForm from "./VisibilityRuleForm";

interface VisibilityRule {
  id: string;
  name: string;
  rule_type: "customer_type" | "location" | "plan" | "custom";
  conditions: any;
  product_filters: any;
  is_active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

export default function VisibilityRulesManager() {
  const [rules, setRules] = useState<VisibilityRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<VisibilityRule | null>(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await fetch("/api/webshop/visibility-rules");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setRules(data.rules || []);
    } catch (error) {
      console.error("Error fetching rules:", error);
      toast.error("Kunne ikke laste regler");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (rule: VisibilityRule) => {
    setEditingRule(rule);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Er du sikker på at du vil slette denne regelen?")) return;

    try {
      const response = await fetch(`/api/webshop/visibility-rules/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      toast.success("Regel slettet");
      fetchRules();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Kunne ikke slette regel");
    }
  };

  const handleToggleActive = async (rule: VisibilityRule) => {
    try {
      const response = await fetch(`/api/webshop/visibility-rules/${rule.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !rule.is_active }),
      });

      if (!response.ok) throw new Error("Failed to update");

      toast.success(rule.is_active ? "Regel deaktivert" : "Regel aktivert");
      fetchRules();
    } catch (error) {
      console.error("Toggle error:", error);
      toast.error("Kunne ikke oppdatere regel");
    }
  };

  const handlePriorityChange = async (rule: VisibilityRule, delta: number) => {
    try {
      const newPriority = rule.priority + delta;
      const response = await fetch(`/api/webshop/visibility-rules/${rule.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority: newPriority }),
      });

      if (!response.ok) throw new Error("Failed to update");

      toast.success("Prioritet oppdatert");
      fetchRules();
    } catch (error) {
      console.error("Priority error:", error);
      toast.error("Kunne ikke oppdatere prioritet");
    }
  };

  const handleFormSuccess = () => {
    fetchRules();
    setEditingRule(null);
  };

  const getRuleTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      customer_type: "Kundetype",
      location: "Lokasjon",
      plan: "Abonnement",
      custom: "Tilpasset",
    };
    return types[type] || type;
  };

  const getConditionsDisplay = (rule: VisibilityRule) => {
    const { conditions } = rule;
    if (conditions.customer_types?.length) {
      return conditions.customer_types.join(", ");
    }
    if (conditions.locations?.length) {
      return conditions.locations.join(", ");
    }
    if (conditions.plans?.length) {
      return conditions.plans.join(", ");
    }
    return "Alle";
  };

  const getFiltersDisplay = (rule: VisibilityRule) => {
    const { product_filters } = rule;
    const parts: string[] = [];

    if (product_filters.categories?.length) {
      parts.push(`${product_filters.categories.length} kategorier`);
    }
    if (product_filters.tags?.length) {
      parts.push(`${product_filters.tags.length} tags`);
    }
    if (product_filters.price_range?.min || product_filters.price_range?.max) {
      const min = product_filters.price_range.min || 0;
      const max = product_filters.price_range.max || "∞";
      parts.push(`kr ${min}-${max}`);
    }

    const productTypes: string[] = [];
    if (product_filters.partner_products) productTypes.push("partner");
    if (product_filters.own_products) productTypes.push("egne");
    if (productTypes.length) {
      parts.push(productTypes.join(" + "));
    }

    return parts.length > 0 ? parts.join(" · ") : "Alle produkter";
  };

  // Sort by priority (descending)
  const sortedRules = [...rules].sort((a, b) => b.priority - a.priority);

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
          <h2 className="text-xl font-bold">Synlighetsregler</h2>
          <p className="text-sm text-muted-foreground">
            Kontroller hvilke produkter som er synlige for ulike kunder
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingRule(null);
            setFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Ny regel
        </Button>
      </div>

      {/* Info Box */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm text-blue-900">
          <strong>Slik fungerer det:</strong> Regler evalueres i prioritert rekkefølge (høyeste først).
          Første regel som matcher brukerens profil bestemmer hvilke produkter som vises.
          Hvis ingen regler matcher, vises alle aktive produkter.
        </p>
      </div>

      {/* Rules List */}
      {sortedRules.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <Eye className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Ingen regler ennå</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Opprett din første synlighetsregel for å kontrollere hvilke produkter som vises til hvem
          </p>
          <Button
            className="mt-4"
            onClick={() => {
              setEditingRule(null);
              setFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Opprett regel
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedRules.map((rule, index) => (
            <div
              key={rule.id}
              className={`rounded-lg border p-4 ${
                rule.is_active ? "bg-background" : "bg-muted/50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{rule.name}</h3>
                    <Badge variant="outline" className="capitalize">
                      {getRuleTypeLabel(rule.rule_type)}
                    </Badge>
                    {rule.is_active ? (
                      <Badge variant="outline" className="text-green-600">
                        Aktiv
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-500">
                        Inaktiv
                      </Badge>
                    )}
                    <Badge variant="secondary">
                      Prioritet: {rule.priority}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Gjelder for:</p>
                      <p className="font-medium">{getConditionsDisplay(rule)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Produktfilter:</p>
                      <p className="font-medium">{getFiltersDisplay(rule)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {/* Priority controls */}
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePriorityChange(rule, 1)}
                      disabled={index === 0}
                      title="Øk prioritet"
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePriorityChange(rule, -1)}
                      disabled={index === sortedRules.length - 1}
                      title="Senk prioritet"
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Action buttons */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleActive(rule)}
                    title={rule.is_active ? "Deaktiver" : "Aktiver"}
                  >
                    {rule.is_active ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(rule)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(rule.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {rules.length > 0 && (
        <div className="rounded-lg border p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{rules.length}</p>
              <p className="text-xs text-muted-foreground">Totalt regler</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {rules.filter((r) => r.is_active).length}
              </p>
              <p className="text-xs text-muted-foreground">Aktive</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {rules.filter((r) => !r.is_active).length}
              </p>
              <p className="text-xs text-muted-foreground">Inaktive</p>
            </div>
          </div>
        </div>
      )}

      {/* Form Dialog */}
      <VisibilityRuleForm
        rule={editingRule}
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingRule(null);
        }}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
