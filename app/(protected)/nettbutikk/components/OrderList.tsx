"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Search, ShoppingCart, Eye, Package, CheckCircle } from "lucide-react";
import type { WebshopOrder } from "@/types/webshop";

export default function OrderList() {
  const [orders, setOrders] = useState<WebshopOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<WebshopOrder | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/webshop/orders");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Kunne ikke laste ordrer");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/webshop/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update");

      toast.success("Status oppdatert");
      fetchOrders();
      
      // Update selected order if it's open
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Kunne ikke oppdatere status");
    }
  };

  const handleViewDetails = (order: WebshopOrder) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      !searchQuery ||
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !statusFilter || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string; color: string }> = {
      pending: { variant: "outline", label: "Venter", color: "text-yellow-600" },
      processing: { variant: "outline", label: "Behandles", color: "text-blue-600" },
      completed: { variant: "outline", label: "Fullført", color: "text-green-600" },
      cancelled: { variant: "outline", label: "Kansellert", color: "text-red-600" },
    };

    const config = variants[status] || variants.pending;
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string; color: string }> = {
      pending: { variant: "outline", label: "Venter", color: "text-yellow-600" },
      paid: { variant: "outline", label: "Betalt", color: "text-green-600" },
      refunded: { variant: "outline", label: "Refundert", color: "text-orange-600" },
      failed: { variant: "outline", label: "Feilet", color: "text-red-600" },
    };

    const config = variants[status] || variants.pending;
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    );
  };

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
      <div>
        <h2 className="text-xl font-bold">Ordrer</h2>
        <p className="text-sm text-muted-foreground">
          Administrer kundeordrer og bestillinger
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Søk etter ordrenummer, kunde..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Alle statuser</option>
          <option value="pending">Venter</option>
          <option value="processing">Behandles</option>
          <option value="completed">Fullført</option>
          <option value="cancelled">Kansellert</option>
        </select>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">
            {searchQuery || statusFilter
              ? "Ingen ordrer funnet"
              : "Ingen ordrer ennå"}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {searchQuery || statusFilter
              ? "Prøv å endre søkefiltrene"
              : "Ordrer vil vises her når kunder gjennomfører kjøp"}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Ordre
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Kunde
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Dato
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Betaling
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
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <p className="font-medium">#{order.order_number}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.items.length} vare(r)
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.customer_email}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm">
                        {new Date(order.created_at).toLocaleDateString("nb-NO", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleTimeString("nb-NO", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">kr {order.total}</p>
                    </td>
                    <td className="px-4 py-3">
                      {getPaymentStatusBadge(order.payment_status)}
                    </td>
                    <td className="px-4 py-3">
                      <Select
                        value={order.status}
                        onValueChange={(value) =>
                          handleStatusUpdate(order.id, value)
                        }
                      >
                        <SelectTrigger className="w-[140px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Venter</SelectItem>
                          <SelectItem value="processing">Behandles</SelectItem>
                          <SelectItem value="completed">Fullført</SelectItem>
                          <SelectItem value="cancelled">Kansellert</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
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
        <div className="grid grid-cols-5 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{orders.length}</p>
            <p className="text-xs text-muted-foreground">Totalt</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {orders.filter((o) => o.status === "pending").length}
            </p>
            <p className="text-xs text-muted-foreground">Venter</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {orders.filter((o) => o.status === "processing").length}
            </p>
            <p className="text-xs text-muted-foreground">Behandles</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {orders.filter((o) => o.status === "completed").length}
            </p>
            <p className="text-xs text-muted-foreground">Fullført</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              kr{" "}
              {orders
                .filter((o) => o.payment_status === "paid")
                .reduce((sum, o) => sum + o.total, 0)
                .toLocaleString("nb-NO")}
            </p>
            <p className="text-xs text-muted-foreground">Omsetning</p>
          </div>
        </div>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>
                  Ordre #{selectedOrder.order_number}
                </DialogTitle>
                <DialogDescription>
                  Opprettet {new Date(selectedOrder.created_at).toLocaleString("nb-NO")}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Status */}
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="text-sm font-medium">Ordrestatus</p>
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">Betalingsstatus</p>
                    {getPaymentStatusBadge(selectedOrder.payment_status)}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold">Kundeinformasjon</h3>
                  <div className="rounded-lg border p-4 space-y-2">
                    <p className="font-medium">{selectedOrder.customer_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedOrder.customer_email}
                    </p>
                    {selectedOrder.customer_phone && (
                      <p className="text-sm text-muted-foreground">
                        {selectedOrder.customer_phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Addresses */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">Faktureringsadresse</h3>
                    <div className="rounded-lg border p-4 text-sm space-y-1">
                      <p>{selectedOrder.billing_address}</p>
                      <p>
                        {selectedOrder.billing_postal_code}{" "}
                        {selectedOrder.billing_city}
                      </p>
                      <p>{selectedOrder.billing_country}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Leveringsadresse</h3>
                    <div className="rounded-lg border p-4 text-sm space-y-1">
                      {selectedOrder.shipping_same_as_billing ? (
                        <p className="text-muted-foreground">
                          Samme som faktureringsadresse
                        </p>
                      ) : (
                        <>
                          <p>{selectedOrder.shipping_address}</p>
                          <p>
                            {selectedOrder.shipping_postal_code}{" "}
                            {selectedOrder.shipping_city}
                          </p>
                          <p>{selectedOrder.shipping_country}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  <h3 className="font-semibold">Produkter</h3>
                  <div className="rounded-lg border">
                    <table className="w-full">
                      <thead className="border-b bg-muted/50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium">
                            Produkt
                          </th>
                          <th className="px-4 py-2 text-right text-xs font-medium">
                            Pris
                          </th>
                          <th className="px-4 py-2 text-right text-xs font-medium">
                            Ant.
                          </th>
                          <th className="px-4 py-2 text-right text-xs font-medium">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {selectedOrder.items.map((item: any, index: number) => (
                          <tr key={index}>
                            <td className="px-4 py-2">{item.name}</td>
                            <td className="px-4 py-2 text-right">
                              kr {item.price}
                            </td>
                            <td className="px-4 py-2 text-right">{item.qty}</td>
                            <td className="px-4 py-2 text-right">
                              kr {item.price * item.qty}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Totals */}
                <div className="space-y-2 rounded-lg border p-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>kr {selectedOrder.subtotal}</span>
                  </div>
                  {selectedOrder.shipping_cost > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Frakt</span>
                      <span>kr {selectedOrder.shipping_cost}</span>
                    </div>
                  )}
                  {selectedOrder.tax_amount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Mva</span>
                      <span>kr {selectedOrder.tax_amount}</span>
                    </div>
                  )}
                  {selectedOrder.discount_amount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Rabatt</span>
                      <span>-kr {selectedOrder.discount_amount}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2 font-bold">
                    <span>Total</span>
                    <span>kr {selectedOrder.total}</span>
                  </div>
                </div>

                {/* Payment & Shipping */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">Betalingsmetode</h3>
                    <div className="rounded-lg border p-4">
                      <p className="text-sm capitalize">
                        {selectedOrder.payment_method}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Leveringsmetode</h3>
                    <div className="rounded-lg border p-4">
                      <p className="text-sm capitalize">
                        {selectedOrder.shipping_method || "Ikke spesifisert"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {(selectedOrder.customer_note || selectedOrder.internal_note) && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Notater</h3>
                    {selectedOrder.customer_note && (
                      <div className="rounded-lg border p-4">
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Kunde:
                        </p>
                        <p className="text-sm">{selectedOrder.customer_note}</p>
                      </div>
                    )}
                    {selectedOrder.internal_note && (
                      <div className="rounded-lg border p-4">
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Internt:
                        </p>
                        <p className="text-sm">{selectedOrder.internal_note}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
