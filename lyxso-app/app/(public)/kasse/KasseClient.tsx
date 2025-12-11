"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

type CheckoutForm = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  deliveryMethod: "pickup" | "shipping";
  paymentMethod: "card" | "invoice" | "vipps";
  notes?: string;
};

export default function KasseClient() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<CheckoutForm>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    postalCode: "",
    city: "",
    deliveryMethod: "pickup",
    paymentMethod: "card",
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch("/api/webshop/cart");
      const data = await response.json();
      
      if (response.ok) {
        setCartItems(data.items || []);
        if (data.items?.length === 0) {
          router.push("/handlekurv");
        }
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/webshop/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to success page or payment
        router.push(`/ordre/${data.orderId}/bekreftelse`);
      } else {
        alert(data.error || "Noe gikk galt");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Kunne ikke fullføre bestillingen");
    } finally {
      setSubmitting(false);
    }
  };

  const updateForm = (field: keyof CheckoutForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = form.deliveryMethod === "shipping" && subtotal < 500 ? 99 : 0;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400">Laster...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-white">Kasse</h1>

        <form onSubmit={handleSubmit}>
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
                <h2 className="mb-4 text-lg font-semibold text-white">
                  Kontaktinformasjon
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">
                      E-post *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => updateForm("email", e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
                      placeholder="din@epost.no"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">
                        Fornavn *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.firstName}
                        onChange={(e) => updateForm("firstName", e.target.value)}
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">
                        Etternavn *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.lastName}
                        onChange={(e) => updateForm("lastName", e.target.value)}
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => updateForm("phone", e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
                      placeholder="+47 123 45 678"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Method */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
                <h2 className="mb-4 text-lg font-semibold text-white">
                  Leveringsmåte
                </h2>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer rounded-lg border border-slate-700 p-4 transition hover:border-blue-500">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="pickup"
                      checked={form.deliveryMethod === "pickup"}
                      onChange={(e) => updateForm("deliveryMethod", e.target.value as "pickup")}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-white">Henting i butikk</p>
                      <p className="text-sm text-slate-400">
                        Gratis - Hent varene dine hos oss
                      </p>
                    </div>
                    <p className="font-semibold text-emerald-400">Gratis</p>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer rounded-lg border border-slate-700 p-4 transition hover:border-blue-500">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="shipping"
                      checked={form.deliveryMethod === "shipping"}
                      onChange={(e) => updateForm("deliveryMethod", e.target.value as "shipping")}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-white">Levering på døren</p>
                      <p className="text-sm text-slate-400">
                        Få varene levert hjem til deg
                      </p>
                    </div>
                    <p className="font-semibold text-white">
                      {subtotal >= 500 ? "Gratis" : "kr 99"}
                    </p>
                  </label>
                </div>
              </div>

              {/* Shipping Address */}
              {form.deliveryMethod === "shipping" && (
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
                  <h2 className="mb-4 text-lg font-semibold text-white">
                    Leveringsadresse
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">
                        Adresse *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.address}
                        onChange={(e) => updateForm("address", e.target.value)}
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
                        placeholder="Gateadresse"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">
                          Postnummer *
                        </label>
                        <input
                          type="text"
                          required
                          value={form.postalCode}
                          onChange={(e) => updateForm("postalCode", e.target.value)}
                          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
                          placeholder="0000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">
                          Sted *
                        </label>
                        <input
                          type="text"
                          required
                          value={form.city}
                          onChange={(e) => updateForm("city", e.target.value)}
                          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
                          placeholder="By"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
                <h2 className="mb-4 text-lg font-semibold text-white">
                  Betalingsmåte
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer rounded-lg border border-slate-700 p-4 transition hover:border-blue-500">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={form.paymentMethod === "card"}
                      onChange={(e) => updateForm("paymentMethod", e.target.value as "card")}
                    />
                    <p className="font-medium text-white">Kort</p>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer rounded-lg border border-slate-700 p-4 transition hover:border-blue-500">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="vipps"
                      checked={form.paymentMethod === "vipps"}
                      onChange={(e) => updateForm("paymentMethod", e.target.value as "vipps")}
                    />
                    <p className="font-medium text-white">Vipps</p>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer rounded-lg border border-slate-700 p-4 transition hover:border-blue-500">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="invoice"
                      checked={form.paymentMethod === "invoice"}
                      onChange={(e) => updateForm("paymentMethod", e.target.value as "invoice")}
                    />
                    <p className="font-medium text-white">Faktura</p>
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
                <h2 className="mb-4 text-lg font-semibold text-white">
                  Kommentar (valgfritt)
                </h2>
                <textarea
                  value={form.notes || ""}
                  onChange={(e) => updateForm("notes", e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
                  placeholder="Har du spesielle ønsker eller kommentarer?"
                />
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="sticky top-4 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
                <h2 className="mb-4 text-lg font-semibold text-white">
                  Din bestilling
                </h2>

                <div className="mb-4 space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      {item.imageUrl && (
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-800">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm text-white">{item.name}</p>
                        <p className="text-xs text-slate-400">
                          {item.quantity} × kr {item.price.toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-white">
                        kr {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-800 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Delsum</span>
                    <span className="text-white">kr {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Frakt</span>
                    <span className="text-white">
                      {shipping === 0 ? "Gratis" : `kr ${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-2">
                    <span className="font-semibold text-white">Total</span>
                    <span className="text-lg font-bold text-white">
                      kr {total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-6 w-full rounded-lg bg-blue-600 px-6 py-4 font-medium text-white hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500"
                >
                  {submitting ? "Behandler..." : "Fullfør bestilling"}
                </button>

                <p className="mt-4 text-center text-xs text-slate-500">
                  Ved å fullføre bestillingen godtar du våre{" "}
                  <a href="/bruksvilkar" className="text-blue-400 hover:underline">
                    vilkår
                  </a>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
