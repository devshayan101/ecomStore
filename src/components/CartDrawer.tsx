'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Package, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Zap,
  Tag,
  RotateCcw
} from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { useRouter } from 'next/navigation';
import { fetchStorefrontSettings, validateCouponApi } from '@/lib/api';
import Link from 'next/link';

export default function CartDrawer() {
  const router = useRouter();
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
  } = useCart();

  const [currencySymbol, setCurrencySymbol] = useState('₹');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount_type: string; discount_value: number; discount_amount: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  useEffect(() => {
    fetchStorefrontSettings()
      .then((s) => {
        if (s?.general?.currency) {
          const sym = s.general.currency === 'USD' ? '$' : (s.general.currency === 'EUR' ? '€' : (s.general.currency === 'GBP' ? '£' : '₹'));
          setCurrencySymbol(sym);
        }
      })
      .catch(console.error);

    const savedCoupon = sessionStorage.getItem('olinbuy_coupon');
    if (savedCoupon) {
      try {
        setAppliedCoupon(JSON.parse(savedCoupon));
      } catch (e) {
        console.error('Failed to parse saved coupon');
      }
    }
  }, []);

  const [shouldRender, setShouldRender] = useState(isCartOpen);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isCartOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isCartOpen]);

  if (!shouldRender) return null;

  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Free shipping threshold logic (e.g., ₹999 / $50)
  const freeShippingThreshold = currencySymbol === '₹' ? 999 : 50;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartTotal);
  const freeShippingProgress = Math.min(100, (cartTotal / freeShippingThreshold) * 100);

  // Coupon application logic
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const code = couponCode.trim().toUpperCase();

    if (!code) return;

    setValidatingCoupon(true);
    try {
      const result = await validateCouponApi(code, cartTotal);
      setAppliedCoupon({
        code: result.code,
        discount_type: result.discount_type,
        discount_value: result.discount_value,
        discount_amount: result.discount_amount,
      });
      // Store applied coupon in sessionStorage for checkout
      sessionStorage.setItem('olinbuy_coupon', JSON.stringify({
        code: result.code,
        discount_type: result.discount_type,
        discount_value: result.discount_value,
        discount_amount: result.discount_amount,
      }));
    } catch (err: any) {
      setCouponError(err.message || 'Invalid promo code');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError(null);
    sessionStorage.removeItem('olinbuy_coupon');
  };

  const discountAmount = appliedCoupon ? appliedCoupon.discount_amount : 0;
  const finalTotal = Math.max(0, cartTotal - discountAmount);

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden font-sans select-none ${isClosing ? 'pointer-events-none' : ''}`}>
      {/* Dimmed backdrop with smooth blur */}
      <div
        className={`absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity ${
          isClosing ? 'animate-fade-out' : 'animate-fade-in'
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        {/* Slide-over Drawer Container (Light Theme) */}
        <div className={`w-screen max-w-md bg-white text-slate-900 flex flex-col shadow-2xl border-l border-slate-200 ${
          isClosing ? 'animate-slide-out-right' : 'animate-slide-in-right'
        }`}>
          
          {/* Header */}
          <div className="bg-slate-900 px-5 py-4 text-white flex items-center justify-between shadow-md border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shadow-inner">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading text-base font-extrabold tracking-tight flex items-center gap-2 text-white">
                  Shopping Bag
                  {totalItemCount > 0 && (
                    <span className="text-xs font-mono font-bold bg-[#FFA41C] text-black px-2 py-0.5 rounded-full shadow-sm">
                      {totalItemCount}
                    </span>
                  )}
                </h2>
                <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase flex items-center gap-1 mt-0.5">
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" /> OLINBUY STOREFRONT
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          {cartItems.length > 0 && (
            <div className="bg-slate-50/90 border-b border-slate-200/80 px-5 py-3 shrink-0 animate-fade-in">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#ff6b00]" />
                  {remainingForFreeShipping === 0 ? (
                    <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Unlocked FREE Express Delivery!
                    </span>
                  ) : (
                    <span>
                      Add <strong className="text-slate-900">{currencySymbol}{remainingForFreeShipping.toLocaleString('en-US')}</strong> more for <strong className="text-emerald-700">FREE Delivery</strong>
                    </span>
                  )}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden p-0.5">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    remainingForFreeShipping === 0
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm'
                      : 'bg-gradient-to-r from-amber-400 to-orange-400 shadow-sm'
                  }`}
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 no-scrollbar">
            {cartItems.length === 0 ? (
              /* Empty Cart View */
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 animate-pop-in">
                <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 shadow-inner">
                  <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Your bag is empty</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-[240px] leading-relaxed">
                    Explore our streetwear drops, techwear collection, and trending items!
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    router.push('/');
                  }}
                  className="mt-2 inline-flex items-center gap-2 bg-[#FFA41C] hover:bg-[#FFB542] text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-sm active:scale-95 border border-[#e49319] cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Shopping</span>
                </button>
              </div>
            ) : (
              /* Items Cards */
              cartItems.map((item) => {
                const imageUrl = item.product.images?.[0] || item.product.variants?.[0]?.image || null;
                const itemTotal = item.price * item.quantity;

                return (
                  <div 
                    key={item.variantId} 
                    className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 hover:bg-white hover:shadow-md transition-all duration-200 flex gap-3.5 items-start group relative shadow-2xs animate-pop-in"
                  >
                    {/* Item Thumbnail */}
                    <div className="w-20 h-20 bg-white rounded-xl overflow-hidden shrink-0 border border-slate-200/80 flex items-center justify-center relative shadow-2xs">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <Package className="w-7 h-7 text-slate-300 stroke-[1.5]" />
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/products/${item.product._id}`}
                            onClick={() => setIsCartOpen(false)}
                            className="text-xs font-bold text-slate-900 hover:text-[#ff6b00] line-clamp-2 transition-colors leading-tight"
                          >
                            {item.product.name}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.variantId)}
                            className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1 rounded-lg transition-colors cursor-pointer shrink-0"
                            aria-label="Remove item"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {item.sku && (
                          <span className="inline-block text-[10px] text-slate-400 font-mono mt-0.5">
                            SKU: {item.sku}
                          </span>
                        )}
                      </div>

                      {/* Quantity & Price Row */}
                      <div className="mt-2.5 flex items-end justify-between gap-2">
                        {/* Quantity Controller */}
                        <div className="flex items-center border border-slate-200 rounded-lg bg-white shadow-2xs">
                          <button
                            onClick={() => updateQuantity(item.variantId, -1)}
                            className="p-1 hover:bg-slate-100 text-slate-600 rounded-l transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-extrabold text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.variantId, 1)}
                            className="p-1 hover:bg-slate-100 text-slate-600 rounded-r transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price Breakdown */}
                        <div className="text-right">
                          <span className="text-xs font-black text-slate-900">
                            {currencySymbol}{itemTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                          {item.quantity > 1 && (
                            <span className="block text-[9px] text-slate-400 font-medium">
                              {currencySymbol}{item.price.toLocaleString('en-US')} ea
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cartItems.length > 0 && (
            <div className="border-t border-slate-200/80 bg-slate-50/90 backdrop-blur-md p-4 sm:p-5 shrink-0 space-y-4 shadow-lg animate-slide-down">
              
              {/* Promo Code Input Block */}
              <div className="space-y-1.5">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl text-xs text-emerald-700 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" /> Code <strong className="text-slate-900">{appliedCoupon.code}</strong> ({appliedCoupon.discount_type === 'PERCENTAGE' ? `${appliedCoupon.discount_value}% OFF` : `${currencySymbol}${appliedCoupon.discount_value} OFF`})
                    </span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-slate-500 hover:text-rose-600 text-[10px] underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Promo code (e.g. WELCOME10)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-slate-900 pl-8 pr-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[#ff6b00] placeholder:text-slate-400 uppercase font-mono shadow-2xs"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={validatingCoupon}
                      className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
                    >
                      {validatingCoupon ? '...' : 'Apply'}
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[10px] text-rose-600 font-medium pl-1">{couponError}</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 pt-1 text-xs">
                <div className="flex justify-between items-center text-slate-500">
                  <span>Subtotal ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})</span>
                  <span className="font-bold text-slate-900">
                    {currencySymbol}{cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between items-center text-emerald-600 font-semibold">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>
                      -{currencySymbol}{discountAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center text-slate-500">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-emerald-600">
                    {remainingForFreeShipping === 0 ? 'FREE Express' : 'Calculated at Address'}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-200/80 text-sm">
                  <span className="font-extrabold text-slate-900">Estimated Total</span>
                  <span className="font-black text-slate-900 text-base">
                    {currencySymbol}{finalTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Primary Action Button -> Directs to Delivery Address / Checkout */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  router.push('/checkout');
                }}
                className="w-full bg-[#FFA41C] hover:bg-[#FFB542] text-slate-950 py-3.5 rounded-xl text-xs font-black tracking-wider transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer border border-[#e49319] active:scale-[0.98] flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Delivery & Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Trust & Guarantee Icons */}
              <div className="pt-1 flex items-center justify-center gap-3 text-[10px] text-slate-500 font-semibold select-none">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500 fill-amber-500" /> Fast Shipping
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 256-Bit SSL Encrypted
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <RotateCcw className="w-3 h-3 text-cyan-600" /> Easy Returns
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
