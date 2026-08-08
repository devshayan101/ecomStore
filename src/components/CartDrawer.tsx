'use client';

import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Package, ArrowRight, Sparkles, ShieldCheck, Truck, Zap } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { useRouter } from 'next/navigation';
import { fetchStorefrontSettings } from '@/lib/api';
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

  useEffect(() => {
    fetchStorefrontSettings()
      .then((s) => {
        if (s?.general?.currency) {
          const sym = s.general.currency === 'USD' ? '$' : (s.general.currency === 'EUR' ? '€' : (s.general.currency === 'GBP' ? '£' : '₹'));
          setCurrencySymbol(sym);
        }
      })
      .catch(console.error);
  }, []);

  if (!isCartOpen) return null;

  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Free shipping threshold logic (e.g., ₹999 / $50)
  const freeShippingThreshold = currencySymbol === '₹' ? 999 : 50;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartTotal);
  const freeShippingProgress = Math.min(100, (cartTotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Dimmed backdrop with smooth blur */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        {/* Slide-over Drawer Container */}
        <div className="w-screen max-w-md bg-white flex flex-col shadow-2xl border-l border-slate-200 animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] px-5 py-4 text-white flex items-center justify-between shadow-md border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading text-base font-extrabold tracking-tight flex items-center gap-2">
                  My Shopping Bag
                  {totalItemCount > 0 && (
                    <span className="text-xs font-mono font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                      {totalItemCount}
                    </span>
                  )}
                </h2>
                <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                  Olinbuy Storefront
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
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 shrink-0">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-amber-500" />
                  {remainingForFreeShipping === 0 ? (
                    <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> You unlocked FREE Express Delivery!
                    </span>
                  ) : (
                    <span>
                      Add <strong className="text-slate-900">{currencySymbol}{remainingForFreeShipping.toLocaleString('en-US')}</strong> more for <strong className="text-emerald-700">FREE Delivery</strong>
                    </span>
                  )}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    remainingForFreeShipping === 0
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      : 'bg-gradient-to-r from-amber-400 to-orange-400'
                  }`}
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
            {cartItems.length === 0 ? (
              /* Empty Cart View */
              <div className="h-full flex flex-col items-center justify-center text-center p-6 select-none space-y-4">
                <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 shadow-inner">
                  <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Your bag is empty</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-[240px] leading-relaxed">
                    Discover our latest techwear & catalog drops and add your favorite pieces!
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
              /* Items List */
              cartItems.map((item) => {
                const imageUrl = item.product.images?.[0] || item.product.variants?.[0]?.image || null;
                const itemTotal = item.price * item.quantity;

                return (
                  <div key={item.variantId} className="py-4 first:pt-0 flex gap-4 items-start group">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shrink-0 flex items-center justify-center relative">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <Package className="w-7 h-7 text-slate-300 stroke-[1.5]" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
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
                          className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                          aria-label="Remove item"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Variant SKU tag if present */}
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        SKU: {item.sku}
                      </p>

                      <div className="mt-2.5 flex items-center justify-between gap-2">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                          <button
                            onClick={() => updateQuantity(item.variantId, -1)}
                            className="p-1 hover:bg-slate-200 text-slate-600 rounded-l-lg transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-extrabold text-slate-900 select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.variantId, 1)}
                            className="p-1 hover:bg-slate-200 text-slate-600 rounded-r-lg transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="text-xs font-black text-slate-900">
                            {currencySymbol}{itemTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                          {item.quantity > 1 && (
                            <span className="block text-[10px] text-slate-400 font-medium">
                              {currencySymbol}{item.price.toLocaleString('en-US')} each
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

          {/* Footer Subtotal & Checkout Actions */}
          {cartItems.length > 0 && (
            <div className="border-t border-slate-200 bg-slate-50/80 p-5 shadow-inner shrink-0 space-y-3">
              {/* Price Subtotal Breakdown */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs text-slate-500 font-semibold">
                  <span>Subtotal ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})</span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    {currencySymbol}{cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-400">
                  <span>Taxes & Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              {/* Checkout CTAs */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  router.push('/checkout');
                }}
                className="w-full bg-[#FFA41C] hover:bg-[#FFB542] text-slate-950 py-3 rounded-xl text-xs font-black tracking-wider transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer border border-[#e49319] active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Security Badges */}
              <div className="pt-2 flex items-center justify-center gap-3 text-[10px] font-extrabold text-slate-500 select-none">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500 fill-amber-500" /> Express Checkout
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> SSL Secured
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
