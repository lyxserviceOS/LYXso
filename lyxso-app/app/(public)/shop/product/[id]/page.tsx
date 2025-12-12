'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, ShoppingCart, Star, Tag, Package, Truck, Shield, Plus, Minus } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  supplier: string;
  tags: string[];
  image_url?: string;
  stock_quantity: number;
  rating?: number;
  reviews_count?: number;
  specifications?: Record<string, string>;
}

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  useEffect(() => {
    // Load cart count from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.length);
  }, []);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/webshop/products/${productId}`);
      
      if (!response.ok) {
        throw new Error('Produkt ikke funnet');
      }
      
      const data = await response.json();
      setProduct(data.product);
      
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err instanceof Error ? err.message : 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    if (!product) return;
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    setCartCount(cart.length);
    
    // Show notification
    alert(`${quantity} x ${product.name} lagt til i handlekurv!`);
    
    // Optionally redirect to cart
    // router.push('/shop/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Laster produkt...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold">{error || 'Produkt ikke funnet'}</p>
          <button 
            onClick={() => router.push('/shop')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Tilbake til shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/shop')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Tilbake til shop
            </button>
            <button
              onClick={() => router.push('/shop/cart')}
              className="relative p-2 text-gray-600 hover:text-gray-900"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Tag className="h-32 w-32 text-gray-400" />
                )}
              </div>
              
              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
                  <Package className="h-8 w-8 text-blue-600 mb-2" />
                  <p className="text-xs text-gray-600">Gratis frakt over 500 kr</p>
                </div>
                <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
                  <Truck className="h-8 w-8 text-blue-600 mb-2" />
                  <p className="text-xs text-gray-600">Levering 1-3 dager</p>
                </div>
                <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
                  <Shield className="h-8 w-8 text-blue-600 mb-2" />
                  <p className="text-xs text-gray-600">30 dagers returrett</p>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Title and Rating */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                  {product.rating && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      {product.rating.toFixed(1)}
                      {product.reviews_count && (
                        <span className="ml-1 text-gray-500">({product.reviews_count} anmeldelser)</span>
                      )}
                    </div>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <p className="text-sm text-gray-500 mt-2">Leverandør: {product.supplier}</p>
              </div>

              {/* Tags */}
              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Price */}
              <div className="border-y border-gray-200 py-6">
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold text-gray-900">
                    {product.price.toLocaleString('no-NO')} kr
                  </p>
                  <p className="text-sm text-gray-500">inkl. mva</p>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {product.stock_quantity > 0 
                    ? `${product.stock_quantity} på lager` 
                    : 'Utsolgt'
                  }
                </p>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Beskrivelse</h2>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Spesifikasjoner</h2>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                        <span className="text-gray-600">{key}</span>
                        <span className="text-gray-900 font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">Antall:</label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock_quantity}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock_quantity, parseInt(e.target.value) || 1)))}
                      className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                      disabled={quantity >= product.stock_quantity}
                      className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={addToCart}
                  disabled={product.stock_quantity === 0}
                  className="w-full py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {product.stock_quantity === 0 ? 'Utsolgt' : 'Legg til i handlekurv'}
                </button>

                <div className="text-center text-sm text-gray-500">
                  Total: <span className="font-semibold text-gray-900">
                    {(product.price * quantity).toLocaleString('no-NO')} kr
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
