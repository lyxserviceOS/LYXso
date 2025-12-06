"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  originalPrice?: number;
  category: string;
  tags: string[];
  imageUrl?: string;
  images?: string[];
  stock: number;
  supplier?: string;
  sku?: string;
  specifications?: Record<string, string>;
};

type Review = {
  id: string;
  rating: number;
  comment: string;
  author: string;
  date: string;
};

export default function ProductDetailClient({ productId }: { productId: string }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/webshop/products/${productId}`);
      const data = await response.json();
      
      if (response.ok) {
        setProduct(data.product);
      } else {
        router.push("/butikk");
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/webshop/products/${productId}/reviews`);
      const data = await response.json();
      
      if (response.ok) {
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      const response = await fetch("/api/webshop/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });

      if (response.ok) {
        router.push("/handlekurv");
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400">Laster produkt...</p>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex gap-2 text-sm text-slate-400">
          <Link href="/butikk" className="hover:text-blue-400">
            Nettbutikk
          </Link>
          <span>/</span>
          <Link href={`/butikk?category=${product.category}`} className="hover:text-blue-400 capitalize">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-slate-300">{product.name}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          {/* Images */}
          <div>
            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
              <div className="relative aspect-square">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-600">
                    <span className="text-6xl">📦</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="absolute right-4 top-4 rounded-full bg-red-500 px-3 py-1.5 text-sm font-bold text-white">
                    -{discount}%
                  </div>
                )}
              </div>
            </div>

            {/* Image thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 transition ${
                      selectedImage === idx
                        ? "border-blue-500"
                        : "border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              {product.supplier && (
                <p className="text-xs text-slate-500 mb-2">
                  Levert av {product.supplier}
                </p>
              )}
              <h1 className="text-3xl font-bold text-white">
                {product.name}
              </h1>
              {product.sku && (
                <p className="mt-1 text-xs text-slate-500">
                  SKU: {product.sku}
                </p>
              )}
            </div>

            {/* Rating */}
            {reviews.length > 0 && (
              <div className="mb-4 flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={
                        star <= avgRating ? "text-yellow-400" : "text-slate-600"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-slate-400">
                  {avgRating.toFixed(1)} ({reviews.length} vurderinger)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="mb-6 flex items-baseline gap-3">
              <span className="text-4xl font-bold text-white">
                kr {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-slate-500 line-through">
                  kr {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 10 ? (
                <p className="text-sm text-emerald-400">✓ På lager</p>
              ) : product.stock > 0 ? (
                <p className="text-sm text-yellow-400">⚠ Få igjen ({product.stock} stk)</p>
              ) : (
                <p className="text-sm text-red-400">✗ Utsolgt</p>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-slate-300 leading-relaxed">
                {product.longDescription || product.description}
              </p>
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="mb-8 space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm text-slate-400">Antall:</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="rounded-lg bg-slate-800 px-3 py-2 text-white hover:bg-slate-700"
                  >
                    −
                  </button>
                  <span className="w-12 text-center text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="rounded-lg bg-slate-800 px-3 py-2 text-white hover:bg-slate-700"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addingToCart}
                className="w-full rounded-lg bg-blue-600 px-6 py-4 font-medium text-white hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500"
              >
                {addingToCart ? "Legger til..." : "Legg i handlekurv"}
              </button>
            </div>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Spesifikasjoner
                </h3>
                <dl className="space-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <dt className="text-slate-400">{key}</dt>
                      <dd className="text-slate-200">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Kundeanmeldelser
            </h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/50 p-6"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={
                            star <= review.rating
                              ? "text-yellow-400"
                              : "text-slate-600"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-slate-500">{review.date}</span>
                  </div>
                  <p className="mb-2 font-medium text-white">{review.author}</p>
                  <p className="text-sm text-slate-300">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
