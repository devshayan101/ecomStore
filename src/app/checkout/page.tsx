'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/lib/CartContext';
// Force recompile to refresh Turbopack cache
import { checkout, CheckoutPayload, fetchStorefrontSettings, StorefrontSettings } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Gift, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<StorefrontSettings | null>(null);

  // Fetch settings on mount
  useEffect(() => {
    fetchStorefrontSettings()
      .then(setSettings)
      .catch(console.error);
  }, []);

  // Address Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postcode: '',
    country: 'India',
  });

  // Prefill authenticated customer details
  useEffect(() => {
    if (session?.user) {
      const u = session.user as any;
      setFormData({
        name: u.name || '',
        email: u.email || '',
        phone: u.phone || '',
        street: u.address?.street || '',
        city: u.address?.city || '',
        state: u.address?.state || '',
        postcode: u.address?.postcode || '',
        country: u.address?.country || 'India',
      });
    }
  }, [session]);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'STRIPE' | 'COD'>('COD');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (cartItems.length === 0) {
      setError('Your cart is empty. Add products before checking out.');
      return;
    }

    if (!formData.name || !formData.email || !formData.phone || !formData.street || !formData.city || !formData.state || !formData.postcode) {
      setError('Please fill in all shipping fields.');
      return;
    }

    setLoading(true);

    const payload: CheckoutPayload = {
      customer: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postcode: formData.postcode,
          country: formData.country,
        },
      },
      items: cartItems.map((item) => ({
        variant_id: item.variantId,
        sku: item.sku,
        price_at_purchase: item.price,
        quantity: item.quantity,
      })),
      payment_method: paymentMethod,
    };

    const token = (session?.user as any)?.accessToken;
    try {
      const result = await checkout(payload, token);
      clearCart();
      const orderId = result.order?._id || 'unknown';
      router.push(`/order-success?order_id=${orderId}&method=${paymentMethod}`);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'An error occurred during checkout. Please try again.');
      setLoading(false);
    }
  };

  const normalizeCountry = (country: string) => {
    const c = country.trim().toLowerCase();
    if (c === 'india') return 'in';
    if (c === 'united states' || c === 'usa' || c === 'us') return 'us';
    return c;
  };

  const getPricingDetails = () => {
    let subtotal = 0;
    let totalTax = 0;
    const isInclusive = settings?.taxes?.gstVatSettings?.inclusive ?? false;
    const isEnabled = settings?.taxes?.gstVatSettings?.enabled ?? true;
    const taxRules = settings?.taxes?.taxRules ?? [];

    cartItems.forEach((item) => {
      const itemSubtotal = item.price * item.quantity;
      subtotal += itemSubtotal;

      if (!isEnabled) return;

      // Find tax rate
      let taxRate = 0;
      const rawCountry = formData.country || 'India';
      const shippingCountry = normalizeCountry(rawCountry);
      const shippingState = formData.state || '';

      const productSlab = (item.product as any).tax_slabs?.find((slab: any) => {
        const slabRegion = normalizeCountry(slab.region);
        return slabRegion === shippingCountry ||
               slabRegion === `${shippingCountry} - ${shippingState}`.toLowerCase();
      });

      if (productSlab) {
        taxRate = productSlab.rate;
      } else {
        const globalRule = taxRules.find((rule: any) => {
          const ruleCountry = normalizeCountry(rule.country);
          return rule.active && (
            ruleCountry === shippingCountry &&
            (!rule.state || rule.state.toLowerCase() === shippingState.toLowerCase() || rule.state === "")
          );
        });
        if (globalRule) {
          taxRate = globalRule.rate;
        }
      }

      if (isInclusive) {
        // Tax is included: calculate how much tax is inside
        const itemTax = itemSubtotal - (itemSubtotal / (1 + taxRate / 100));
        totalTax += itemTax;
      } else {
        // Tax is exclusive: add on top
        const itemTax = itemSubtotal * (taxRate / 100);
        totalTax += itemTax;
      }
    });

    const shipping = 0;
    const totalAmount = isInclusive ? subtotal : (subtotal + totalTax);

    return {
      subtotal,
      tax: totalTax,
      shipping,
      total: totalAmount,
      isInclusive,
      isEnabled,
    };
  };

  const pricing = getPricingDetails();

  return (
    <div className="min-h-screen bg-[#f4f4f4] py-8 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#1a3a6b] mb-6 select-none transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>

        <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight mb-8 select-none">
          Complete Your Order
        </h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Forms */}
          <div className="lg:col-span-7 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <h3 className="font-heading text-base font-bold text-slate-800 border-b border-slate-100 pb-2.5 mb-1 select-none">
                📍 Delivery Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-[10px] font-black uppercase text-slate-400 tracking-wider select-none">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. John Doe"
                    className="border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white outline-none focus:border-[#1a3a6b] text-slate-800 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-[10px] font-black uppercase text-slate-400 tracking-wider select-none">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. john@example.com"
                    className="border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white outline-none focus:border-[#1a3a6b] text-slate-800 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label htmlFor="phone" className="text-[10px] font-black uppercase text-slate-400 tracking-wider select-none">Mobile/WhatsApp Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. 9876543210"
                    className="border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white outline-none focus:border-[#1a3a6b] text-slate-800 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label htmlFor="street" className="text-[10px] font-black uppercase text-slate-400 tracking-wider select-none">Street Address *</label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Apartment, Suite, Landmark, Street"
                    className="border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white outline-none focus:border-[#1a3a6b] text-slate-800 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="city" className="text-[10px] font-black uppercase text-slate-400 tracking-wider select-none">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Mohali"
                    className="border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white outline-none focus:border-[#1a3a6b] text-slate-800 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="state" className="text-[10px] font-black uppercase text-slate-400 tracking-wider select-none">State *</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Punjab"
                    className="border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white outline-none focus:border-[#1a3a6b] text-slate-800 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="postcode" className="text-[10px] font-black uppercase text-slate-400 tracking-wider select-none">ZIP/Postcode *</label>
                  <input
                    type="text"
                    id="postcode"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. 160071"
                    className="border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white outline-none focus:border-[#1a3a6b] text-slate-800 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="country" className="text-[10px] font-black uppercase text-slate-400 tracking-wider select-none">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    readOnly
                    className="border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-100 outline-none text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <h3 className="font-heading text-base font-bold text-slate-800 border-b border-slate-100 pb-2.5 mb-1 select-none">
                💳 Choose Payment Method
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Cash on Delivery option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`flex items-center gap-3 p-4 rounded-xl border text-left cursor-pointer transition-all ${paymentMethod === 'COD'
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                    }`}
                >
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Cash on Delivery (COD)</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Pay in cash when package arrives</p>
                  </div>
                </button>

                {/* Credit Card / Stripe Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('STRIPE')}
                  className={`flex items-center gap-3 p-4 rounded-xl border text-left cursor-pointer transition-all ${paymentMethod === 'STRIPE'
                    ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                    }`}
                >
                  <div className="w-10 h-10 bg-blue-50 text-[#1a3a6b] rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Stripe Secure Payment</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Pay with credit/debit card safely</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Cart Summary & Submit */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col">
              <h3 className="font-heading text-base font-bold text-slate-800 border-b border-slate-100 pb-2.5 mb-3 select-none">
                📋 Order Summary
              </h3>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto max-h-[220px] divide-y divide-slate-100 pr-1">
                {cartItems.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center select-none">No items in cart</p>
                ) : (
                  cartItems.map((item) => {
                    const emoji = item.product.variants[0]?.attributes?.emoji || '📦';
                    return (
                      <div key={item.variantId} className="flex gap-3 py-3 items-center">
                        <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-xl select-none flex-shrink-0">
                          {emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[11px] font-bold text-slate-800 truncate select-none">
                            {item.product.name}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-semibold select-none">
                            Qty: {item.quantity}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-slate-700 select-none">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Totals Panel */}
              <div className="border-t border-slate-100 pt-3.5 mt-3 space-y-2 select-none">
                <div className="flex justify-between items-center text-xs text-slate-500 font-bold">
                  <span>Subtotal</span>
                  <span>₹{pricing.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {pricing.isEnabled && pricing.tax > 0 && (
                  <div className="flex justify-between items-center text-xs text-slate-500 font-bold">
                    <span>Tax (GST/VAT) {pricing.isInclusive && '(Included)'}</span>
                    <span>₹{Math.round(pricing.tax).toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xs text-slate-500 font-bold">
                  <span>Shipping</span>
                  <span className="text-[#26a541]">FREE</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-100 pt-3 mt-1.5 font-heading text-lg font-black text-slate-900">
                  <span>Total Amount</span>
                  <span>₹{Math.round(pricing.total).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Error feedback */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-xs font-bold mt-4 select-none">
                  ❌ {error}
                </div>
              )}

              {/* Action Button */}
              <button
                type="submit"
                disabled={loading || cartItems.length === 0}
                className="w-full bg-[#1a3a6b] hover:bg-[#112952] disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3.5 rounded-lg text-sm font-black tracking-wider transition-all duration-200 mt-6 shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Placing Your Order...
                  </>
                ) : (
                  `Place Order — ₹${Math.round(pricing.total).toLocaleString('en-IN')}`
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
