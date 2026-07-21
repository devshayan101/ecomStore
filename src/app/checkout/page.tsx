'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import { useCart } from '@/lib/CartContext';
import { checkout, verifyRazorpayPayment, CheckoutPayload, fetchStorefrontSettings, StorefrontSettings, fetchShippingRates, ShippingRateOption } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Gift, Loader2, Package, Truck, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<StorefrontSettings | null>(null);
  
  // Shipping State
  const [shippingRates, setShippingRates] = useState<ShippingRateOption[]>([]);
  const [selectedRate, setSelectedRate] = useState<ShippingRateOption | null>(null);
  const [fetchingRates, setFetchingRates] = useState(false);

  const getValidCountryAndState = (
    candidateCountry: string,
    candidateState: string,
    allowedCountries: any[]
  ) => {
    if (!allowedCountries || allowedCountries.length === 0) {
      return { country: candidateCountry, state: candidateState };
    }
    const matched = allowedCountries.find(
      (c: any) => c.name.toLowerCase() === candidateCountry.toLowerCase()
    );
    if (matched) {
      return { country: matched.name, state: candidateState };
    }
    return { country: allowedCountries[0].name, state: '' };
  };

  // Fetch settings on mount
  useEffect(() => {
    fetchStorefrontSettings()
      .then((s) => {
        setSettings(s);
        const allowedCountries = s.taxes?.countriesConfig || [];
        if (allowedCountries.length > 0) {
          setFormData((prev) => {
            const { country, state } = getValidCountryAndState(prev.country, prev.state, allowedCountries);
            return { ...prev, country, state };
          });
        }
      })
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
      const sessionCountry = u.address?.country || 'India';
      const sessionState = u.address?.state || '';
      const allowedCountries = settings?.taxes?.countriesConfig || [];
      const { country, state } = getValidCountryAndState(sessionCountry, sessionState, allowedCountries);

      setFormData({
        name: u.name || '',
        email: u.email || '',
        phone: u.phone || '',
        street: u.address?.street || '',
        city: u.address?.city || '',
        state,
        postcode: u.address?.postcode || '',
        country,
      });
    }
  }, [session, settings]);

  // Fetch shipping rates when address changes
  useEffect(() => {
    if (!formData.country || !formData.state) {
      setShippingRates([]);
      setSelectedRate(null);
      return;
    }

    const totalWeight = cartItems.reduce((sum, item) => sum + (item.quantity * 500), 0);
    const subtotal = cartTotal;

    setFetchingRates(true);
    fetchShippingRates({
      destCountry: formData.country,
      destState: formData.state,
      destPostcode: formData.postcode,
      totalWeight,
      subtotal
    })
      .then((rates) => {
        setShippingRates(rates);
        if (rates.length > 0) {
          setSelectedRate(rates[0]);
        } else {
          setSelectedRate(null);
        }
      })
      .catch((err) => {
        console.error('Error fetching shipping rates:', err);
        setShippingRates([]);
        setSelectedRate(null);
      })
      .finally(() => {
        setFetchingRates(false);
      });
  }, [formData.country, formData.state, formData.postcode, cartItems, cartTotal]);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'STRIPE' | 'RAZORPAY' | 'COD'>('RAZORPAY');

  const isDomestic = !formData.country || formData.country.trim().toLowerCase() === 'india' || formData.country.trim().toLowerCase() === 'in';

  useEffect(() => {
    if (isDomestic) {
      if (paymentMethod === 'STRIPE') {
        setPaymentMethod('RAZORPAY');
      }
    } else {
      if (paymentMethod !== 'STRIPE') {
        setPaymentMethod('STRIPE');
      }
    }
  }, [formData.country, isDomestic]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === 'country') {
        return { ...prev, country: value, state: '' };
      }
      return { ...prev, [name]: value };
    });
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
      shipping_cost: selectedRate?.price || 0,
      shipping_rate_name: selectedRate?.name || 'Standard Shipping',
    };

    const token = (session?.user as any)?.accessToken;
    try {
      const result = await checkout(payload, token);
      const orderId = result.order?._id || 'unknown';

      if (paymentMethod === 'RAZORPAY' && result.razorpay_order) {
        const { razorpay_order_id, razorpay_key_id, amount, currency } = result.razorpay_order;

        if (typeof (window as any).Razorpay === 'undefined') {
          setError('Razorpay SDK failed to load. Please refresh and try again.');
          setLoading(false);
          return;
        }

        const options = {
          key: razorpay_key_id,
          amount,
          currency,
          name: 'Olinbuy Storefront',
          description: `Order #${orderId}`,
          order_id: razorpay_order_id,
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: '#059669',
          },
          handler: async function (response: any) {
            try {
              await verifyRazorpayPayment(
                orderId,
                response.razorpay_payment_id,
                response.razorpay_order_id,
                response.razorpay_signature
              );
              clearCart();
              router.push(`/order-success?order_id=${orderId}&method=RAZORPAY`);
            } catch (verifyErr: any) {
              console.error('Razorpay verification error:', verifyErr);
              setError(verifyErr.message || 'Payment verification failed');
              setLoading(false);
            }
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        return;
      }

      clearCart();
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
        const slabRegion = slab.region.toLowerCase();
        const matchedCountry = rawCountry.toLowerCase();
        const matchedCode = normalizeCountry(rawCountry).toLowerCase();

        const matchedRules = taxRules.filter((r: any) => 
          (r.country.toLowerCase() === matchedCountry || (r.countryCode || '').toLowerCase() === matchedCode) &&
          r.state.toLowerCase() === shippingState.toLowerCase()
        );
        const resolvedStateCodes = matchedRules.map((r: any) => (r.stateCode || '').toLowerCase()).filter(Boolean);

        const stateMatches = (slabState: string) => {
          const s = slabState.toLowerCase();
          const sh = shippingState.toLowerCase();
          return s === sh || resolvedStateCodes.includes(s);
        };

        const parts = slabRegion.split(' - ');
        if (parts.length === 1) {
          return slabRegion === matchedCountry || slabRegion === matchedCode;
        } else if (parts.length === 2) {
          const slabCountry = parts[0];
          const slabState = parts[1];
          const countryMatches = slabCountry === matchedCountry || slabCountry === matchedCode;
          return countryMatches && stateMatches(slabState);
        }
        return false;
      });

      if (productSlab) {
        taxRate = productSlab.rate;
      } else {
        const matchedCountry = rawCountry.toLowerCase();
        const matchedCode = normalizeCountry(rawCountry).toLowerCase();
        const matchedState = shippingState.toLowerCase();

        const countryRules = taxRules.filter((rule: any) => {
          if (!rule.active) return false;
          const ruleCountry = rule.country.toLowerCase();
          const ruleCountryCode = (rule.countryCode || '').toLowerCase();
          return ruleCountry === matchedCountry || ruleCountryCode === matchedCode || ruleCountryCode === matchedCountry || ruleCountry === matchedCode;
        });

        let globalRule = countryRules.find((rule: any) => {
          const ruleState = (rule.state || '').toLowerCase();
          const ruleStateCode = (rule.stateCode || '').toLowerCase();
          if (!ruleState || ruleState === 'all states' || ruleStateCode === 'all') return false;
          return ruleState === matchedState || ruleStateCode === matchedState;
        });

        if (!globalRule) {
          globalRule = countryRules.find((rule: any) => {
            const ruleState = (rule.state || '').toLowerCase();
            const ruleStateCode = (rule.stateCode || '').toLowerCase();
            return ruleState === 'all states' || ruleStateCode === 'all';
          });
        }

        if (!globalRule) {
          globalRule = countryRules.find((rule: any) => !rule.state);
        }

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

    const shipping = selectedRate ? selectedRate.price : 0;
    const totalAmount = isInclusive ? (subtotal + shipping) : (subtotal + totalTax + shipping);

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

  const selectedCountryName = formData.country || 'India';
  const matchedCountryConfig = settings?.taxes?.countriesConfig?.find(
    (c: any) => c.name.toLowerCase() === selectedCountryName.toLowerCase() || c.code.toLowerCase() === selectedCountryName.toLowerCase()
  );
  const availableStates = matchedCountryConfig?.states || [];

  return (
    <div className="min-h-screen bg-[#f4f4f4] py-8 px-4 md:px-8">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
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
                  {availableStates.length > 0 ? (
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white outline-none focus:border-[#1a3a6b] text-slate-800 transition-colors cursor-pointer"
                    >
                      <option value="">Select State</option>
                      {availableStates.map((s: any) => (
                        <option key={s.code} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  ) : (
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
                  )}
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
                  <label htmlFor="country" className="text-[10px] font-black uppercase text-slate-400 tracking-wider select-none">Country *</label>
                  {settings?.taxes?.countriesConfig && settings.taxes.countriesConfig.length > 0 ? (
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white outline-none focus:border-[#1a3a6b] text-slate-800 transition-colors cursor-pointer"
                    >
                      <option value="">Select Country</option>
                      {settings.taxes.countriesConfig.map((c: any) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  ) : settings?.taxes?.taxRules && Array.from(new Set(settings.taxes.taxRules.map((r: any) => r.country))).filter(Boolean).length > 0 ? (
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white outline-none focus:border-[#1a3a6b] text-slate-800 transition-colors cursor-pointer"
                    >
                      <option value="">Select Country</option>
                      {Array.from(new Set(settings.taxes.taxRules.map((r: any) => r.country))).filter(Boolean).map((c: any) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. India"
                      className="border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white outline-none focus:border-[#1a3a6b] text-slate-800 transition-colors"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Method Selector */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <h3 className="font-heading text-base font-bold text-slate-800 border-b border-slate-100 pb-2.5 mb-1 select-none">
                🚚 Choose Shipping Method
              </h3>
              
              {!formData.country || !formData.state ? (
                <p className="text-xs text-slate-400 py-2">Please enter your country and state to view available shipping options.</p>
              ) : fetchingRates ? (
                <div className="flex items-center gap-2 text-xs text-slate-500 py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  Calculating shipping rates...
                </div>
              ) : shippingRates.length === 0 ? (
                <p className="text-xs text-red-500 font-medium py-2">No shipping methods are configured or available for your destination. Please contact store support.</p>
              ) : (
                <div className="space-y-3">
                  {shippingRates.map((rate) => (
                    <button
                      key={rate.id}
                      type="button"
                      onClick={() => setSelectedRate(rate)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        selectedRate?.id === rate.id
                          ? 'border-[#1a3a6b] bg-blue-50/50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Truck className="w-5 h-5 text-slate-400" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">{rate.name}</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {rate.type === 'carrier' ? `Live Quote via ${rate.carrier?.toUpperCase()} | ` : ''}
                            Estimated Delivery: {rate.deliveryTime || `${rate.estimatedDays || 3} days`}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-extrabold text-slate-800">
                        {rate.price === 0 ? 'FREE' : `₹${rate.price.toLocaleString('en-IN')}`}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <h3 className="font-heading text-base font-bold text-slate-800 border-b border-slate-100 pb-2.5 mb-1 select-none">
                💳 Choose Payment Method
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {isDomestic ? (
                  <>
                    {/* Razorpay Online Payment Option */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('RAZORPAY')}
                      className={`flex items-center gap-3 p-4 rounded-xl border text-left cursor-pointer transition-all ${paymentMethod === 'RAZORPAY'
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                        }`}
                    >
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">Razorpay (UPI / NetBanking / Cards)</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Instant online payment for India</p>
                      </div>
                    </button>

                    {/* Cash on Delivery option */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('COD')}
                      className={`flex items-center gap-3 p-4 rounded-xl border text-left cursor-pointer transition-all ${paymentMethod === 'COD'
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                        }`}
                    >
                      <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center">
                        <Gift className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">Cash on Delivery (COD)</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Pay in cash when package arrives</p>
                      </div>
                    </button>
                  </>
                ) : (
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
                      <h4 className="text-xs font-bold text-slate-800">Stripe International Payment</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Pay with global credit/debit cards</p>
                    </div>
                  </button>
                )}
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
                    const imageUrl = item.product.images?.[0] || item.product.variants[0]?.image || null;
                    return (
                      <div key={item.variantId} className="flex gap-3 py-3 items-center">
                        <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center select-none flex-shrink-0 overflow-hidden">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-5 h-5 text-slate-300 stroke-[1.5]" />
                          )}
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
                  <span>Shipping {selectedRate ? `(${selectedRate.name})` : ''}</span>
                  <span className={selectedRate && selectedRate.price > 0 ? "text-slate-800 font-extrabold" : "text-[#26a541]"}>
                    {selectedRate && selectedRate.price > 0 ? `₹${selectedRate.price.toLocaleString('en-IN')}` : 'FREE'}
                  </span>
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
