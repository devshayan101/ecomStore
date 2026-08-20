'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Script from 'next/script';
import { useCart } from '@/lib/CartContext';
import { checkout, verifyRazorpayPayment, CheckoutPayload, fetchStorefrontSettings, StorefrontSettings, fetchShippingRates, ShippingRateOption, validateCouponApi } from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, CreditCard, Gift, Loader2, Package, Truck, Smartphone, ShoppingBag, MapPin, Check, Plus, Minus, Trash2, ShieldCheck, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStepParam = searchParams?.get('step');
  
  // Step state: 1 = Shipping & Billing Address, 2 = Payment Page
  const [step, setStep] = useState<1 | 2>(
    initialStepParam === '2' ? 2 : 1
  );

  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<StorefrontSettings | null>(null);
  
  // Shipping Rates State
  const [shippingRates, setShippingRates] = useState<ShippingRateOption[]>([]);
  const [selectedRate, setSelectedRate] = useState<ShippingRateOption | null>(null);
  const [fetchingRates, setFetchingRates] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount_type: string; discount_value: number; discount_amount: number } | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('olinbuy_coupon');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.code) {
          validateCouponApi(parsed.code, cartTotal)
            .then((res) => {
              const freshCoupon = {
                code: res.code,
                discount_type: res.discount_type,
                discount_value: res.discount_value,
                discount_amount: res.discount_amount,
              };
              setAppliedCoupon(freshCoupon);
              sessionStorage.setItem('olinbuy_coupon', JSON.stringify(freshCoupon));
            })
            .catch(() => {
              setAppliedCoupon(null);
              sessionStorage.removeItem('olinbuy_coupon');
            });
        }
      } catch (e) {
        setAppliedCoupon(null);
        sessionStorage.removeItem('olinbuy_coupon');
      }
    }
  }, [cartTotal]);

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

  // Billing Address Toggle State
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [billingData, setBillingData] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    postcode: '',
    country: 'India',
  });

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

      setBillingData({
        name: u.name || '',
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

  // Payment Method State
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

  const handleBillingInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBillingData((prev) => {
      if (name === 'country') {
        return { ...prev, country: value, state: '' };
      }
      return { ...prev, [name]: value };
    });
  };

  // Step Validation Helpers
  const goToStep2 = () => {
    setError(null);
    if (cartItems.length === 0) {
      setError('Your cart is empty. Add products before proceeding.');
      return;
    }
    if (!formData.name || !formData.email || !formData.phone || !formData.street || !formData.city || !formData.state || !formData.postcode) {
      setError('Please fill in all required shipping address fields.');
      return;
    }
    if (!sameAsShipping) {
      if (!billingData.name || !billingData.street || !billingData.city || !billingData.state || !billingData.postcode) {
        setError('Please fill in all required billing address fields.');
        return;
      }
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      setStep(1);
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
      billing_address: !sameAsShipping ? {
        recipient_name: billingData.name || formData.name,
        street: billingData.street,
        city: billingData.city,
        state: billingData.state,
        postcode: billingData.postcode,
        country: billingData.country,
      } : undefined,
      items: cartItems.map((item) => ({
        variant_id: item.variantId,
        sku: item.sku,
        price_at_purchase: item.price,
        quantity: item.quantity,
      })),
      payment_method: paymentMethod,
      shipping_cost: selectedRate?.price || 0,
      shipping_rate_name: selectedRate?.name || 'Standard Shipping',
      coupon_code: appliedCoupon?.code || undefined,
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
            color: '#FFA41C',
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
        const itemTax = itemSubtotal - (itemSubtotal / (1 + taxRate / 100));
        totalTax += itemTax;
      } else {
        const itemTax = itemSubtotal * (taxRate / 100);
        totalTax += itemTax;
      }
    });

    const shipping = selectedRate ? selectedRate.price : 0;
    const discount = appliedCoupon ? appliedCoupon.discount_amount : 0;
    const baseTotal = isInclusive ? (subtotal + shipping) : (subtotal + totalTax + shipping);
    const totalAmount = Math.max(0, baseTotal - discount);

    return {
      subtotal,
      tax: totalTax,
      shipping,
      discount,
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

  const selectedBillingCountryName = billingData.country || 'India';
  const matchedBillingCountryConfig = settings?.taxes?.countriesConfig?.find(
    (c: any) => c.name.toLowerCase() === selectedBillingCountryName.toLowerCase() || c.code.toLowerCase() === selectedBillingCountryName.toLowerCase()
  );
  const availableBillingStates = matchedBillingCountryConfig?.states || [];

  return (
    <div className="min-h-screen bg-[#fbfcfd] text-slate-900 font-sans py-8 px-4 md:px-8">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="max-w-5xl mx-auto">
        {/* Back to Storefront */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff6b00] hover:underline mb-6 select-none transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Storefront
        </Link>

        {/* Multi-Step Wizard Header Progress Bar */}
        <div className="bg-white rounded-2xl border border-[#e2e2e3] p-4 md:p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between max-w-xl mx-auto relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-12 right-12 -translate-y-1/2 h-0.5 bg-slate-200 z-0" />
            <div
              className="absolute top-1/2 left-12 -translate-y-1/2 h-0.5 bg-[#FFA41C] transition-all duration-500 z-0"
              style={{
                width: step === 1 ? '0%' : '100%',
              }}
            />

            {/* Step 1 Indicator: Delivery & Billing Address */}
            <button
              onClick={() => setStep(1)}
              className="relative z-10 flex flex-col items-center gap-1.5 cursor-pointer group"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                  step === 1
                    ? 'bg-[#FFA41C] text-slate-950 ring-4 ring-orange-100 scale-105'
                    : 'bg-emerald-500 text-white'
                }`}
              >
                {step > 1 ? <Check className="w-5 h-5 stroke-[2.5]" /> : <MapPin className="w-4 h-4" />}
              </div>
              <span
                className={`text-xs font-bold ${
                  step === 1 ? 'text-slate-900' : 'text-slate-500'
                }`}
              >
                1. Delivery Address
              </span>
            </button>

            {/* Step 2 Indicator: Payment & Place Order */}
            <button
              onClick={() => {
                if (cartItems.length > 0 && formData.name && formData.street) setStep(2);
              }}
              className={`relative z-10 flex flex-col items-center gap-1.5 ${
                cartItems.length > 0 && formData.name ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                  step === 2
                    ? 'bg-[#FFA41C] text-slate-950 ring-4 ring-orange-100 scale-105'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
              >
                <CreditCard className="w-4 h-4" />
              </div>
              <span
                className={`text-xs font-bold ${
                  step === 2 ? 'text-slate-900' : 'text-slate-500'
                }`}
              >
                2. Payment & Confirm
              </span>
            </button>
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-4 text-xs font-bold mb-6 flex items-center gap-2 select-none shadow-sm">
            <span>❌ {error}</span>
          </div>
        )}

        {/* STEP 1: SHIPPING & BILLING ADDRESS */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              {/* Delivery Address Card */}
              <div className="bg-white rounded-2xl border border-[#e2e2e3] p-5 shadow-sm space-y-4">
                <h3 className="font-heading text-base font-bold text-slate-900 border-b border-slate-100 pb-2.5 mb-1 flex items-center gap-2 select-none">
                  <MapPin className="w-5 h-5 text-[#ff6b00]" /> Delivery Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-[10px] font-black uppercase text-slate-500 tracking-wider select-none">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. John Doe"
                      className="border border-[#e2e2e3] rounded-lg p-2.5 text-xs bg-slate-50 focus:bg-white outline-none focus:border-[#ff6b00] text-slate-900 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-[10px] font-black uppercase text-slate-500 tracking-wider select-none">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. john@example.com"
                      className="border border-[#e2e2e3] rounded-lg p-2.5 text-xs bg-slate-50 focus:bg-white outline-none focus:border-[#ff6b00] text-slate-900 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label htmlFor="phone" className="text-[10px] font-black uppercase text-slate-500 tracking-wider select-none">Mobile/WhatsApp Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. 9876543210"
                      className="border border-[#e2e2e3] rounded-lg p-2.5 text-xs bg-slate-50 focus:bg-white outline-none focus:border-[#ff6b00] text-slate-900 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label htmlFor="street" className="text-[10px] font-black uppercase text-slate-500 tracking-wider select-none">Street Address *</label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Apartment, Suite, Landmark, Street"
                      className="border border-[#e2e2e3] rounded-lg p-2.5 text-xs bg-slate-50 focus:bg-white outline-none focus:border-[#ff6b00] text-slate-900 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="city" className="text-[10px] font-black uppercase text-slate-500 tracking-wider select-none">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Mohali"
                      className="border border-[#e2e2e3] rounded-lg p-2.5 text-xs bg-slate-50 focus:bg-white outline-none focus:border-[#ff6b00] text-slate-900 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="state" className="text-[10px] font-black uppercase text-slate-500 tracking-wider select-none">State *</label>
                    {availableStates.length > 0 ? (
                      <select
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="border border-[#e2e2e3] rounded-lg p-2.5 text-xs bg-slate-50 focus:bg-white outline-none focus:border-[#ff6b00] text-slate-900 transition-colors cursor-pointer"
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
                        className="border border-[#e2e2e3] rounded-lg p-2.5 text-xs bg-slate-50 focus:bg-white outline-none focus:border-[#ff6b00] text-slate-900 transition-colors"
                      />
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="postcode" className="text-[10px] font-black uppercase text-slate-500 tracking-wider select-none">ZIP/Postcode *</label>
                    <input
                      type="text"
                      id="postcode"
                      name="postcode"
                      value={formData.postcode}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. 160071"
                      className="border border-[#e2e2e3] rounded-lg p-2.5 text-xs bg-slate-50 focus:bg-white outline-none focus:border-[#ff6b00] text-slate-900 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="country" className="text-[10px] font-black uppercase text-slate-500 tracking-wider select-none">Country *</label>
                    {settings?.taxes?.countriesConfig && settings.taxes.countriesConfig.length > 0 ? (
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        className="border border-[#e2e2e3] rounded-lg p-2.5 text-xs bg-slate-50 focus:bg-white outline-none focus:border-[#ff6b00] text-slate-900 transition-colors cursor-pointer"
                      >
                        <option value="">Select Country</option>
                        {settings.taxes.countriesConfig.map((c: any) => (
                          <option key={c.name} value={c.name}>
                            {c.name}
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
                        className="border border-[#e2e2e3] rounded-lg p-2.5 text-xs bg-slate-50 focus:bg-white outline-none focus:border-[#ff6b00] text-slate-900 transition-colors"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Billing Address Card */}
              <div className="bg-white rounded-2xl border border-[#e2e2e3] p-5 shadow-sm space-y-4">
                <h3 className="font-heading text-base font-bold text-slate-900 border-b border-slate-100 pb-2.5 mb-1 flex items-center justify-between select-none">
                  <span>📄 Billing Address</span>
                </h3>

                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-800 select-none">
                  <input
                    type="checkbox"
                    checked={sameAsShipping}
                    onChange={(e) => setSameAsShipping(e.target.checked)}
                    className="w-4 h-4 rounded text-[#FFA41C] focus:ring-amber-400 cursor-pointer"
                  />
                  <span>Billing address is the same as delivery address</span>
                </label>

                {!sameAsShipping && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label htmlFor="bname" className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Billing Name *</label>
                      <input
                        type="text"
                        id="bname"
                        name="name"
                        value={billingData.name}
                        onChange={handleBillingInputChange}
                        placeholder="Full Name"
                        className="border border-[#e2e2e3] rounded-lg p-2.5 text-xs bg-slate-50 focus:bg-white outline-none focus:border-[#ff6b00] text-slate-900"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label htmlFor="bstreet" className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Street Address *</label>
                      <input
                        type="text"
                        id="bstreet"
                        name="street"
                        value={billingData.street}
                        onChange={handleBillingInputChange}
                        placeholder="Billing Street Address"
                        className="border border-[#e2e2e3] rounded-lg p-2.5 text-xs bg-slate-50 focus:bg-white outline-none focus:border-[#ff6b00] text-slate-900"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="bcity" className="text-[10px] font-black uppercase text-slate-500 tracking-wider">City *</label>
                      <input
                        type="text"
                        id="bcity"
                        name="city"
                        value={billingData.city}
                        onChange={handleBillingInputChange}
                        placeholder="City"
                        className="border border-[#e2e2e3] rounded-lg p-2.5 text-xs bg-slate-50 focus:bg-white outline-none focus:border-[#ff6b00] text-slate-900"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="bstate" className="text-[10px] font-black uppercase text-slate-500 tracking-wider">State *</label>
                      <input
                        type="text"
                        id="bstate"
                        name="state"
                        value={billingData.state}
                        onChange={handleBillingInputChange}
                        placeholder="State"
                        className="border border-[#e2e2e3] rounded-lg p-2.5 text-xs bg-slate-50 focus:bg-white outline-none focus:border-[#ff6b00] text-slate-900"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Shipping Rates Card */}
              <div className="bg-white rounded-2xl border border-[#e2e2e3] p-5 shadow-sm space-y-4">
                <h3 className="font-heading text-base font-bold text-slate-900 border-b border-slate-100 pb-2.5 mb-1 select-none flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#ff6b00]" /> Shipping Method
                </h3>
                
                {!formData.country || !formData.state ? (
                  <p className="text-xs text-slate-500 py-2">Please enter your country and state above to view available shipping options.</p>
                ) : fetchingRates ? (
                  <div className="flex items-center gap-2 text-xs text-slate-500 py-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#ff6b00]" />
                    Calculating available shipping rates...
                  </div>
                ) : shippingRates.length === 0 ? (
                  <p className="text-xs text-rose-600 font-medium py-2">No custom shipping rates available for destination. Standard fallback shipping applied.</p>
                ) : (
                  <div className="space-y-3">
                    {shippingRates.map((rate) => (
                      <button
                        key={rate.id}
                        type="button"
                        onClick={() => setSelectedRate(rate)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border text-left cursor-pointer transition-all ${
                          selectedRate?.id === rate.id
                            ? 'border-[#FFA41C] bg-amber-50/50 shadow-sm'
                            : 'border-[#e2e2e3] hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Truck className="w-5 h-5 text-slate-500" />
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">{rate.name}</h4>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              Estimated Delivery: {rate.deliveryTime || `${rate.estimatedDays || 3} days`}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-extrabold text-slate-900">
                          {rate.price === 0 ? 'FREE' : `₹${rate.price.toLocaleString('en-IN')}`}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Step 1 Action Buttons */}
              <div className="flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={goToStep2}
                  className="px-6 py-3 rounded-xl bg-[#FFA41C] hover:bg-[#FFB542] text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm border border-[#e49319]"
                >
                  <span>Proceed to Payment</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Summary Side */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-2xl border border-[#e2e2e3] p-5 shadow-sm space-y-3 select-none">
                <h3 className="font-heading text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Order Summary
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600 font-bold">
                    <span>Items Subtotal</span>
                    <span>₹{pricing.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-bold">
                    <span>Shipping</span>
                    <span className={selectedRate && selectedRate.price > 0 ? "text-slate-900" : "text-emerald-600"}>
                      {selectedRate && selectedRate.price > 0 ? `₹${selectedRate.price.toLocaleString('en-IN')}` : 'FREE'}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-2 font-black text-sm text-slate-900">
                    <span>Total</span>
                    <span>₹{Math.round(pricing.total).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: PAYMENT & CONFIRM PAGE */}
        {step === 2 && (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              {/* Payment Method Selector Card */}
              <div className="bg-white rounded-2xl border border-[#e2e2e3] p-5 shadow-sm space-y-4">
                <h3 className="font-heading text-base font-bold text-slate-900 border-b border-slate-100 pb-2.5 mb-1 select-none flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#ff6b00]" /> Select Payment Method
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {isDomestic ? (
                    <>
                      {/* Razorpay Online Payment */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('RAZORPAY')}
                        className={`flex items-center gap-3 p-4 rounded-xl border text-left cursor-pointer transition-all ${
                          paymentMethod === 'RAZORPAY'
                            ? 'border-[#FFA41C] bg-amber-50/60 ring-2 ring-orange-200 shadow-sm'
                            : 'border-[#e2e2e3] hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center shrink-0">
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">Razorpay (UPI / Cards / NetBanking)</h4>
                          <p className="text-[10px] text-slate-500 mt-0.5">Instant secure payment for India</p>
                        </div>
                      </button>

                      {/* Cash on Delivery */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('COD')}
                        className={`flex items-center gap-3 p-4 rounded-xl border text-left cursor-pointer transition-all ${
                          paymentMethod === 'COD'
                            ? 'border-[#FFA41C] bg-amber-50/60 ring-2 ring-orange-200 shadow-sm'
                            : 'border-[#e2e2e3] hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center shrink-0">
                          <Gift className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">Cash on Delivery (COD)</h4>
                          <p className="text-[10px] text-slate-500 mt-0.5">Pay cash when package arrives</p>
                        </div>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('STRIPE')}
                      className={`flex items-center gap-3 p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        paymentMethod === 'STRIPE'
                          ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-200 shadow-sm'
                          : 'border-[#e2e2e3] hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center shrink-0">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Stripe International Payment</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Pay with global credit/debit cards</p>
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* Delivery & Billing Address Summary Card */}
              <div className="bg-white rounded-2xl border border-[#e2e2e3] p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#ff6b00]" /> Delivering To
                  </h3>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-[#ff6b00] font-bold hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <div className="text-xs text-slate-700 leading-relaxed pt-1">
                  <p className="font-bold text-slate-900">{formData.name} ({formData.phone})</p>
                  <p>{formData.street}, {formData.city}, {formData.state} - {formData.postcode}, {formData.country}</p>
                </div>

                {!sameAsShipping && (
                  <div className="border-t border-slate-100 pt-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-[#ff6b00]" /> Billing Address
                      </h4>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-xs text-[#ff6b00] font-bold hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="text-xs text-slate-700 leading-relaxed pt-0.5">
                      <p className="font-bold text-slate-900">{billingData.name || formData.name}</p>
                      <p>{billingData.street}, {billingData.city}, {billingData.state} - {billingData.postcode}, {billingData.country}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2 Actions */}
              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-all cursor-pointer"
                >
                  ← Back to Delivery Address
                </button>
                <button
                  type="submit"
                  disabled={loading || cartItems.length === 0}
                  className="px-8 py-3.5 rounded-xl bg-[#FFA41C] hover:bg-[#FFB542] disabled:opacity-50 text-slate-950 font-black text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md border border-[#e49319] active:scale-95"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing Order...
                    </>
                  ) : (
                    `Pay & Complete Order — ₹${Math.round(pricing.total).toLocaleString('en-IN')}`
                  )}
                </button>
              </div>
            </div>

            {/* Right Summary Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-2xl border border-[#e2e2e3] p-5 shadow-sm space-y-4 select-none">
                <h3 className="font-heading text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Order Breakdown
                </h3>

                {/* Items Mini List */}
                <div className="max-h-48 overflow-y-auto divide-y divide-slate-100">
                  {cartItems.map((item) => (
                    <div key={item.variantId} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="truncate pr-2">
                        <span className="font-bold text-slate-800">{item.product.name}</span>
                        <span className="text-[10px] text-slate-500 block">Qty: {item.quantity}</span>
                      </div>
                      <span className="font-bold text-slate-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing Totals */}
                <div className="border-t border-slate-100 pt-3 space-y-2 text-xs font-bold text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{pricing.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>-₹{pricing.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {pricing.isEnabled && pricing.tax > 0 && (
                    <div className="flex justify-between text-slate-600 font-bold">
                      <span>Tax (GST/VAT) {pricing.isInclusive && '(Included)'}</span>
                      <span>₹{Math.round(pricing.tax).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className={selectedRate && selectedRate.price > 0 ? "text-slate-900" : "text-emerald-600"}>
                      {selectedRate && selectedRate.price > 0 ? `₹${selectedRate.price.toLocaleString('en-IN')}` : 'FREE'}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-3 text-base font-black text-slate-900">
                    <span>Grand Total</span>
                    <span>₹{Math.round(pricing.total).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> 256-Bit SSL Encrypted & Verified Checkout
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fbfcfd] flex items-center justify-center">
          <div className="text-center space-y-2 select-none">
            <Loader2 className="w-8 h-8 animate-spin text-[#ff6b00] mx-auto" />
            <p className="text-xs text-slate-500 font-bold">Loading Checkout...</p>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
