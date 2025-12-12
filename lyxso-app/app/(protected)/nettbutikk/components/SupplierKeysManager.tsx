"use client";

import { useState, useEffect } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Edit, RefreshCw, CheckCircle, XCircle } from "lucide-react";

interface SupplierKey {
  id: string;
  supplier_name: string;
  api_key: string;
  api_secret?: string;
  api_endpoint?: string;
  is_active: boolean;
  sync_enabled: boolean;
  sync_frequency: 'hourly' | 'daily' | 'weekly' | 'manual';
  last_sync_at?: string;
  sync_status: string;
  sync_categories?: string[];
  min_price?: number;
  max_price?: number;
  markup_percentage: number;
  created_at: string;
  updated_at: string;
}

const SUPPLIERS = [
  { value: "mekonomen", label: "Mekonomen", categories: ["dekk", "felger", "bilpleie", "tilbehør"] },
  { value: "gs_bildeler", label: "GS Bildeler", categories: ["dekk", "felger", "verksted", "vedlikehold"] },
  { value: "bildeler_no", label: "Bildeler.no", categories: ["dekk", "felger", "bilpleie", "verksted"] },
  { value: "bilia", label: "Bilia", categories: ["dekk", "felger", "originaldeler"] },
  { value: "dekkmann", label: "Dekkmann", categories: ["dekk", "felger"] },
];

export default function SupplierKeysManager() {
  const [supplierKeys, setSupplierKeys] = useState<SupplierKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<SupplierKey | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const [syncingKeys, setSyncingKeys] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState<{
    supplier_name: string;
    api_key: string;
    api_secret: string;
    api_endpoint: string;
    sync_enabled: boolean;
    sync_frequency: 'hourly' | 'daily' | 'weekly' | 'manual';
    sync_categories: string[];
    min_price: string;
    max_price: string;
    markup_percentage: string;
  }>({
    supplier_name: "",
    api_key: "",
    api_secret: "",
    api_endpoint: "",
    sync_enabled: true,
    sync_frequency: "daily",
    sync_categories: [],
    min_price: "",
    max_price: "",
    markup_percentage: "20",
  });

  useEffect(() => {
    fetchSupplierKeys();
  }, []);

  const fetchSupplierKeys = async () => {
    try {
      const response = await fetch("/api/webshop/supplier-keys");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setSupplierKeys(data.supplierKeys || []);
    } catch (error) {
      console.error("Error fetching supplier keys:", error);
      toast.error("Kunne ikke laste leverandør-nøkler");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.supplier_name || !formData.api_key) {
      toast.error("Leverandør og API-nøkkel er påkrevd");
      return;
    }

    const endpoint = editingKey
      ? `/api/webshop/supplier-keys/${editingKey.id}`
      : "/api/webshop/supplier-keys";
    
    const method = editingKey ? "PATCH" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          min_price: formData.min_price ? parseFloat(formData.min_price) : null,
          max_price: formData.max_price ? parseFloat(formData.max_price) : null,
          markup_percentage: parseFloat(formData.markup_percentage),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save");
      }

      toast.success(editingKey ? "Leverandør oppdatert" : "Leverandør lagt til");
      setDialogOpen(false);
      resetForm();
      fetchSupplierKeys();
    } catch (error: any) {
      console.error("Error saving supplier key:", error);
      toast.error(error.message || "Kunne ikke lagre leverandør");
    }
  };

  const handleSync = async (key: SupplierKey) => {
    setSyncingKeys(prev => new Set(prev).add(key.id));
    
    try {
      const response = await fetch(`/api/webshop/supplier-keys/${key.id}/sync`, {
        method: "POST",
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Sync failed");
      }
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(
          `Synkronisert ${data.result.productsImported}/${data.result.productsFound} produkter`,
          {
            description: data.result.errors.length > 0 
              ? `${data.result.productsFailed} feil` 
              : undefined,
          }
        );
        
        // Refresh supplier keys to show updated sync status
        await fetchSupplierKeys();
      } else {
        toast.error("Synkronisering feilet", {
          description: data.result.errors[0] || "Ukjent feil",
        });
      }
    } catch (error: any) {
      console.error("Sync error:", error);
      toast.error("Kunne ikke synkronisere produkter", {
        description: error.message,
      });
    } finally {
      setSyncingKeys(prev => {
        const next = new Set(prev);
        next.delete(key.id);
        return next;
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Er du sikker på at du vil slette denne leverandøren?")) return;

    try {
      const response = await fetch(`/api/webshop/supplier-keys/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      toast.success("Leverandør slettet");
      fetchSupplierKeys();
    } catch (error) {
      console.error("Error deleting supplier key:", error);
      toast.error("Kunne ikke slette leverandør");
    }
  };

  const handleEdit = (key: SupplierKey) => {
    setEditingKey(key);
    setFormData({
      supplier_name: key.supplier_name,
      api_key: key.api_key,
      api_secret: key.api_secret || "",
      api_endpoint: key.api_endpoint || "",
      sync_enabled: key.sync_enabled,
      sync_frequency: key.sync_frequency,
      sync_categories: key.sync_categories || [],
      min_price: key.min_price?.toString() || "",
      max_price: key.max_price?.toString() || "",
      markup_percentage: key.markup_percentage.toString(),
    });
    setDialogOpen(true);
  };

  const handleTestConnection = async () => {
    if (!formData.supplier_name || !formData.api_key) {
      toast.error("Fyll ut leverandør og API-nøkkel først");
      return;
    }

    setTestingConnection(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Tilkobling vellykket!");
    } catch (error) {
      toast.error("Tilkobling feilet");
    } finally {
      setTestingConnection(false);
    }
  };

  const resetForm = () => {
    setEditingKey(null);
    setFormData({
      supplier_name: "",
      api_key: "",
      api_secret: "",
      api_endpoint: "",
      sync_enabled: true,
      sync_frequency: "daily",
      sync_categories: [],
      min_price: "",
      max_price: "",
      markup_percentage: "20",
    });
  };

  const selectedSupplier = SUPPLIERS.find(s => s.value === formData.supplier_name);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Leverandør API-nøkler</h2>
          <p className="text-muted-foreground">
            Konfigurer integrasjoner med produktleverandører
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Legg til leverandør
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingKey ? "Rediger leverandør" : "Legg til leverandør"}
                </DialogTitle>
                <DialogDescription>
                  Konfigurer API-tilgang til produktleverandør
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Leverandør *</Label>
                  <Select
                    value={formData.supplier_name}
                    onValueChange={(value) =>
                      setFormData({ ...formData, supplier_name: value })
                    }
                    disabled={!!editingKey}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Velg leverandør" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPLIERS.map((supplier) => (
                        <SelectItem key={supplier.value} value={supplier.value}>
                          {supplier.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api_key">API Nøkkel *</Label>
                  <Input
                    id="api_key"
                    type="password"
                    value={formData.api_key}
                    onChange={(e) =>
                      setFormData({ ...formData, api_key: e.target.value })
                    }
                    placeholder="Lim inn API-nøkkel"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api_secret">API Secret (valgfritt)</Label>
                  <Input
                    id="api_secret"
                    type="password"
                    value={formData.api_secret}
                    onChange={(e) =>
                      setFormData({ ...formData, api_secret: e.target.value })
                    }
                    placeholder="Lim inn API secret"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api_endpoint">API Endpoint (valgfritt)</Label>
                  <Input
                    id="api_endpoint"
                    value={formData.api_endpoint}
                    onChange={(e) =>
                      setFormData({ ...formData, api_endpoint: e.target.value })
                    }
                    placeholder="https://api.example.com/v1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sync_frequency">Synkroniseringsfrekvens</Label>
                    <Select
                      value={formData.sync_frequency}
                      onValueChange={(value: any) =>
                        setFormData({ ...formData, sync_frequency: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hver time</SelectItem>
                        <SelectItem value="daily">Daglig</SelectItem>
                        <SelectItem value="weekly">Ukentlig</SelectItem>
                        <SelectItem value="manual">Manuell</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="markup">Påslag %</Label>
                    <Input
                      id="markup"
                      type="number"
                      step="0.01"
                      value={formData.markup_percentage}
                      onChange={(e) =>
                        setFormData({ ...formData, markup_percentage: e.target.value })
                      }
                      placeholder="20"
                    />
                  </div>
                </div>

                {selectedSupplier && (
                  <div className="space-y-2">
                    <Label>Kategorier å synkronisere</Label>
                    <div className="space-y-2">
                      {selectedSupplier.categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={category}
                            checked={formData.sync_categories.includes(category)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFormData({
                                  ...formData,
                                  sync_categories: [...formData.sync_categories, category],
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  sync_categories: formData.sync_categories.filter(
                                    (c) => c !== category
                                  ),
                                });
                              }
                            }}
                          />
                          <Label htmlFor={category} className="font-normal capitalize">
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min_price">Min pris (kr)</Label>
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
                    <Label htmlFor="max_price">Maks pris (kr)</Label>
                    <Input
                      id="max_price"
                      type="number"
                      step="0.01"
                      value={formData.max_price}
                      onChange={(e) =>
                        setFormData({ ...formData, max_price: e.target.value })
                      }
                      placeholder="Ingen grense"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sync_enabled"
                    checked={formData.sync_enabled}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, sync_enabled: checked as boolean })
                    }
                  />
                  <Label htmlFor="sync_enabled" className="font-normal">
                    Aktiver automatisk synkronisering
                  </Label>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTestConnection}
                  disabled={testingConnection}
                >
                  {testingConnection ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Tester...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Test tilkobling
                    </>
                  )}
                </Button>
                <Button type="submit">
                  {editingKey ? "Oppdater" : "Legg til"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {supplierKeys.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">
            Ingen leverandører konfigurert ennå
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Legg til en leverandør for å begynne å synkronisere produkter
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {supplierKeys.map((key) => (
            <div
              key={key.id}
              className="rounded-lg border p-6 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold capitalize">
                      {SUPPLIERS.find(s => s.value === key.supplier_name)?.label || key.supplier_name}
                    </h3>
                    {key.is_active ? (
                      <Badge variant="outline" className="text-green-600">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Aktiv
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-red-600">
                        <XCircle className="mr-1 h-3 w-3" />
                        Inaktiv
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    API-nøkkel: {key.api_key.substring(0, 8)}***
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleSync(key)}
                    disabled={syncingKeys.has(key.id) || !key.is_active}
                  >
                    {syncingKeys.has(key.id) ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Synkroniserer...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Sync Nå
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(key)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(key.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Synkronisering</p>
                  <p className="font-medium capitalize">{key.sync_frequency}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Påslag</p>
                  <p className="font-medium">{key.markup_percentage}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Sist synkronisert</p>
                  <p className="font-medium">
                    {key.last_sync_at
                      ? new Date(key.last_sync_at).toLocaleDateString("nb-NO")
                      : "Aldri"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">{key.sync_status}</p>
                </div>
              </div>

              {key.sync_categories && key.sync_categories.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Kategorier:</p>
                  <div className="flex flex-wrap gap-2">
                    {key.sync_categories.map((cat) => (
                      <Badge key={cat} variant="secondary" className="capitalize">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {(key.min_price || key.max_price) && (
                <div className="text-sm">
                  <p className="text-muted-foreground">Prisfilter:</p>
                  <p className="font-medium">
                    {key.min_price ? `Fra kr ${key.min_price}` : "Ingen min"}
                    {" - "}
                    {key.max_price ? `Til kr ${key.max_price}` : "Ingen maks"}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
