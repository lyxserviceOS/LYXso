"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  tags: string[];
  imageUrl?: string;
  stock: number;
  supplier?: string;
};

const CATEGORIES = [
  { value: "", label: "Alle kategorier" },
  { value: "dekk", label: "Dekk" },
  { value: "felger", label: "Felger" },
  { value: "bilpleie", label: "Bilpleie" },
  { value: "tilbehor", label: "Tilbehør" },
  { value: "verksted", label: "Verksteddeler" },
  { value: "vedlikehold", label: "Vedlikehold" },
];

const SORT_OPTIONS = [
  { value: "recommended", label: "Anbefalt" },
  { value: "price_asc", label: "Pris: Lav til høy" },
  { value: "price_desc", label: "Pris: Høy til lav" },
  { value: "newest", label: "Nyeste først" },
  { value: "popular", label: "Mest populære" },
];

export default function ButikkClient() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams?.get("category") || "");
  const [sortBy, setSortBy] = useState("recommended");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
  }, [category, sortBy, searchQuery]);

  const fetchProducts = async () => {
    setLoading(false);
    try {
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (sortBy) params.append("sort", sortBy);
      if (searchQuery) params.append("search", searchQuery);
      
      const response = await fetch(`/api/webshop/products?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
    if (selectedTags.length > 0 && !selectedTags.some(tag => product.tags.includes(tag))) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              Nettbutikk
            </h1>
            <p className="mt-2 text-slate-400">
              Finn alt du trenger til din bil
            </p>
          </div>

          {/* Search Bar */}
          <div className="mx-auto mt-8 max-w-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Søk etter produkter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={fetchProducts}
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
              >
                Søk
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <aside className="mb-8 lg:mb-0">
            <div className="sticky top-4 space-y-6 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Kategori</h3>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                        category === cat.value
                          ? "bg-blue-600 text-white"
                          : "text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Prisklasse</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>kr {priceRange[0]}</span>
                    <span>kr {priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Merker</h3>
                <div className="space-y-2">
                  {["premium", "budget", "eco", "performance"].map((tag) => (
                    <label key={tag} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTags([...selectedTags, tag]);
                          } else {
                            setSelectedTags(selectedTags.filter(t => t !== tag));
                          }
                        }}
                        className="rounded border-slate-600 bg-slate-800 text-blue-600"
                      />
                      <span className="text-sm text-slate-300 capitalize">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setCategory("");
                  setPriceRange([0, 10000]);
                  setSelectedTags([]);
                  setSearchQuery("");
                }}
                className="w-full rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
              >
                Nullstill filtre
              </button>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Sort and View Options */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-slate-400">
                {filteredProducts.length} produkter
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-xl border border-slate-800 bg-slate-900/50 p-4"
                  >
                    <div className="aspect-square rounded-lg bg-slate-800" />
                    <div className="mt-4 h-4 rounded bg-slate-800" />
                    <div className="mt-2 h-3 w-2/3 rounded bg-slate-800" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-12 text-center">
                <p className="text-slate-400">Ingen produkter funnet</p>
                <button
                  onClick={() => {
                    setCategory("");
                    setSearchQuery("");
                  }}
                  className="mt-4 text-sm text-blue-400 hover:text-blue-300"
                >
                  Vis alle produkter
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link
      href={`/butikk/${product.id}`}
      className="group rounded-xl border border-slate-800 bg-slate-900/50 p-4 transition hover:border-slate-700 hover:bg-slate-900"
    >
      <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-800">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-600">
            <span className="text-4xl">📦</span>
          </div>
        )}
        {discount > 0 && (
          <div className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
            -{discount}%
          </div>
        )}
        {product.stock < 5 && product.stock > 0 && (
          <div className="absolute left-2 top-2 rounded-full bg-yellow-500 px-2 py-1 text-xs font-bold text-white">
            Få igjen
          </div>
        )}
      </div>

      <div className="mt-4">
        <h3 className="font-medium text-white group-hover:text-blue-400 transition">
          {product.name}
        </h3>
        <p className="mt-1 text-xs text-slate-400 line-clamp-2">
          {product.description}
        </p>
        
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-white">
            kr {product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-slate-500 line-through">
              kr {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {product.supplier && (
          <p className="mt-2 text-xs text-slate-500">
            Levert av {product.supplier}
          </p>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            // Add to cart logic
          }}
          className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Legg i handlekurv
        </button>
      </div>
    </Link>
  );
}
