"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  stock: number;
};

export default function HandlekurvClient() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch("/api/webshop/cart");
      const data = await response.json();
      
      if (response.ok) {
        setCartItems(data.items || []);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setUpdatingItem(itemId);
    try {
      const response = await fetch("/api/webshop/cart/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity }),
      });

      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setUpdatingItem(null);
    }
  };

  const removeItem = async (itemId: string) => {
    setUpdatingItem(itemId);
    try {
      const response = await fetch("/api/webshop/cart/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });

      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setUpdatingItem(null);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 99;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400">Laster handlekurv...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Handlekurv</h1>
          <p className="mt-2 text-slate-400">
            {cartItems.length} {cartItems.length === 1 ? "vare" : "varer"} i handlekurven
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-12 text-center">
            <p className="mb-4 text-lg text-slate-300">
              Din handlekurv er tom
            </p>
            <Link
              href="/butikk"
              className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Fortsett å handle
            </Link>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/50 p-4"
                >
                  <div className="flex gap-4">
                    <Link
                      href={`/butikk/${item.productId}`}
                      className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-800"
                    >
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-600">
                          <span className="text-2xl">📦</span>
                        </div>
                      )}
                    </Link>

                    <div className="flex-1">
                      <Link
                        href={`/butikk/${item.productId}`}
                        className="font-medium text-white hover:text-blue-400"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-sm text-slate-400">
                        kr {item.price.toLocaleString()}
                      </p>

                      <div className="mt-4 flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={updatingItem === item.id || item.quantity <= 1}
                            className="rounded-lg bg-slate-800 px-2 py-1 text-white hover:bg-slate-700 disabled:opacity-50"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={updatingItem === item.id || item.quantity >= item.stock}
                            className="rounded-lg bg-slate-800 px-2 py-1 text-white hover:bg-slate-700 disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={updatingItem === item.id}
                          className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
                        >
                          Fjern
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-white">
                        kr {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-8 lg:mt-0">
              <div className="sticky top-4 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
                <h2 className="mb-4 text-lg font-semibold text-white">
                  Sammendrag
                </h2>

                <div className="space-y-3 border-b border-slate-800 pb-4">
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
                  {shipping > 0 && subtotal < 500 && (
                    <p className="text-xs text-blue-400">
                      Gratis frakt ved kjøp over kr 500
                    </p>
                  )}
                </div>

                <div className="mt-4 flex justify-between">
                  <span className="text-lg font-semibold text-white">Total</span>
                  <span className="text-lg font-bold text-white">
                    kr {total.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => router.push("/kasse")}
                  className="mt-6 w-full rounded-lg bg-blue-600 px-6 py-4 font-medium text-white hover:bg-blue-700"
                >
                  Gå til kassen
                </button>

                <Link
                  href="/butikk"
                  className="mt-3 block text-center text-sm text-blue-400 hover:text-blue-300"
                >
                  Fortsett å handle
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
