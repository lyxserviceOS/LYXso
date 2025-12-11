'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Package, CheckCircle } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutForm {
  // Customer Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Shipping Address
  address: string;
  postalCode: string;
  city: string;
  country: string;
  
  // Payment
  paymentMethod: 'card' | 'vipps' | 'invoice';
  
  // Additional
  notes: string;
  acceptTerms: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  const [form, setForm] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    postalCode: '',
    city: '',
    country: 'Norge',
    paymentMethod: 'card',
    notes: '',
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutForm, string>>>({});

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (cart.length === 0) {
        router.push('/shop/cart');
        return;
      }
      setCartItems(cart);
    } catch (error) {
      console.error('Error loading cart:', error);
      router.push('/shop/cart');
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal >= 500 ? 0 : 99;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CheckoutForm, string>> = {};

    if (!form.firstName.trim()) newErrors.firstName = 'Fornavn er påkrevd';
    if (!form.lastName.trim()) newErrors.lastName = 'Etternavn er påkrevd';
    if (!form.email.trim()) newErrors.email = 'E-post er påkrevd';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Ugyldig e-postadresse';
    if (!form.phone.trim()) newErrors.phone = 'Telefon er påkrevd';
    if (!form.address.trim()) newErrors.address = 'Adresse er påkrevd';
    if (!form.postalCode.trim()) newErrors.postalCode = 'Postnummer er påkrevd';
    if (!form.city.trim()) newErrors.city = 'By er påkrevd';
    if (!form.acceptTerms) newErrors.acceptTerms = 'Du må godta vilkårene';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Vennligst fyll ut alle påkrevde felt');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customer: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
        },
        shipping: {
          address: form.address,
          postalCode: form.postalCode,
          city: form.city,
          country: form.country,
        },
        items: cartItems,
        payment: {
          method: form.paymentMethod,
        },
        notes: form.notes,
        totals: {
          subtotal: calculateSubtotal(),
          shipping: calculateShipping(),
          total: calculateTotal(),
        },
      };

      const response = await fetch('/api/webshop/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();
      
      // Clear cart
      localStorage.removeItem('cart');
      
      // Show success
      setOrderId(data.orderId);
      setOrderComplete(true);

    } catch (error) {
      console.error('Error creating order:', error);
      alert('Det oppstod en feil ved oppretting av bestillingen. Vennligst prøv igjen.');
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (field: keyof CheckoutForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Takk for din bestilling!</h1>
            <p className="text-gray-600 mb-6">
              Din ordre har blitt registrert og du vil motta en bekreftelse på e-post.
            </p>
            {orderId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">Ordrenummer</p>
                <p className="text-xl font-mono font-semibold text-gray-900">{orderId}</p>
              </div>
            )}
            <div className="space-y-3">
              <button
                onClick={() => router.push('/min-side/orders')}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Se mine bestillinger
              </button>
              <button
                onClick={() => router.push('/shop')}
                className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                Fortsett å handle
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/shop/cart')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Tilbake til handlekurv
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Kasse</h1>
            <div className="w-32"></div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Kontaktinformasjon</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fornavn *
                  </label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => updateForm('firstName', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Etternavn *
                  </label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => updateForm('lastName', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-post *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateForm('email', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateForm('phone', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Leveringsadresse
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse *
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => updateForm('address', e.target.value)}
                    placeholder="Gate og husnummer"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postnummer *
                    </label>
                    <input
                      type="text"
                      value={form.postalCode}
                      onChange={(e) => updateForm('postalCode', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.postalCode ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.postalCode && <p className="text-red-600 text-sm mt-1">{errors.postalCode}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      By *
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => updateForm('city', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Land
                    </label>
                    <select
                      value={form.country}
                      onChange={(e) => updateForm('country', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Norge">Norge</option>
                      <option value="Sverige">Sverige</option>
                      <option value="Danmark">Danmark</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Betalingsmetode
              </h2>
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={form.paymentMethod === 'card'}
                    onChange={(e) => updateForm('paymentMethod', e.target.value as 'card' | 'vipps' | 'invoice')}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Kort</p>
                    <p className="text-sm text-gray-600">Betal med Visa, Mastercard eller American Express</p>
                  </div>
                </label>
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="vipps"
                    checked={form.paymentMethod === 'vipps'}
                    onChange={(e) => updateForm('paymentMethod', e.target.value as 'card' | 'vipps' | 'invoice')}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Vipps</p>
                    <p className="text-sm text-gray-600">Rask og sikker betaling med Vipps</p>
                  </div>
                </label>
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="invoice"
                    checked={form.paymentMethod === 'invoice'}
                    onChange={(e) => updateForm('paymentMethod', e.target.value as 'card' | 'vipps' | 'invoice')}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Faktura</p>
                    <p className="text-sm text-gray-600">Betal innen 14 dager</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tilleggsopplysninger</h2>
              <textarea
                value={form.notes}
                onChange={(e) => updateForm('notes', e.target.value)}
                placeholder="Spesielle ønsker eller instruksjoner..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Terms */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.acceptTerms}
                  onChange={(e) => updateForm('acceptTerms', e.target.checked)}
                  className="mt-1 mr-3"
                />
                <div>
                  <p className="text-gray-900">
                    Jeg godtar <a href="/bruksvilkar" className="text-blue-600 hover:underline">vilkårene</a> og{' '}
                    <a href="/personvern" className="text-blue-600 hover:underline">personvernerklæringen</a> *
                  </p>
                  {errors.acceptTerms && <p className="text-red-600 text-sm mt-1">{errors.acceptTerms}</p>}
                </div>
              </label>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Din bestilling</h2>

              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-gray-900 font-medium">
                      {(item.price * item.quantity).toLocaleString('no-NO')} kr
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Delsum</span>
                  <span>{calculateSubtotal().toLocaleString('no-NO')} kr</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Frakt</span>
                  <span>
                    {calculateShipping() === 0 
                      ? 'Gratis' 
                      : `${calculateShipping()} kr`
                    }
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>{calculateTotal().toLocaleString('no-NO')} kr</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">inkl. mva</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Behandler...' : 'Fullfør bestilling'}
              </button>

              <p className="text-xs text-center text-gray-500 mt-4">
                Sikker betaling med SSL-kryptering
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
