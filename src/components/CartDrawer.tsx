'use client';

import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { useRouter } from 'next/navigation';

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

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay background */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        {/* Sliding Panel */}
        <div className="w-screen max-w-md bg-white flex flex-col shadow-2xl animate-slideIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0f2444] to-[#1a3a6b] px-5 py-4 text-white flex items-center justify-between shadow-md">
            <h2 className="font-heading text-base font-bold flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#c9a84c]" />
              My Shopping Cart
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full text-white cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 division-y division-slate-100">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 select-none">
                <span className="text-5xl mb-3">🛒</span>
                <p className="text-sm font-bold text-slate-700">Your cart is empty</p>
                <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
                  Add items to your cart to see them here!
                </p>
              </div>
            ) : (
              cartItems.map((item) => {
                const emoji = item.product.variants[0]?.attributes?.emoji || '📦';
                return (
                  <div key={item.variantId} className="flex gap-4 py-4 border-b border-slate-100 last:border-0 items-center">
                    {/* Thumbnail Emoji */}
                    <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-3xl select-none flex-shrink-0">
                      {emoji}
                    </div>

                    {/* Detail Info */}
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight mb-1 select-none">
                        {item.product.name}
                      </h4>
                      <div className="text-xs font-bold text-[#1a3a6b] mb-2 select-none">
                        ₹{item.price.toLocaleString('en-IN')}
                      </div>

                      {/* Quantity Controls & Trash */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-slate-200 rounded-md bg-slate-50 overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.variantId, -1)}
                            className="p-1 hover:bg-slate-100 text-slate-500 cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-extrabold text-slate-800 select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.variantId, 1)}
                            className="p-1 hover:bg-slate-100 text-slate-500 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.variantId)}
                          className="text-slate-300 hover:text-[#ff6161] p-1.5 transition-colors cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Billing & Checkout */}
          {cartItems.length > 0 && (
            <div className="border-t border-slate-200 bg-slate-50 p-4 shadow-inner">
              <div className="flex justify-between items-center mb-4 select-none">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subtotal</span>
                <span className="font-heading text-2xl font-black text-slate-900">
                  ₹{cartTotal.toLocaleString('en-IN')}
                </span>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  router.push('/checkout');
                }}
                className="w-full bg-[#26a541] hover:bg-[#1da854] text-white py-3 rounded-lg text-sm font-black tracking-wider transition-all duration-200 shadow-md hover:-translate-y-0.5 cursor-pointer active:translate-y-0"
              >
                Proceed to Checkout
              </button>

              <div className="text-center text-[10px] text-slate-400 font-semibold mt-3 select-none">
                💰 COD Available &nbsp;•&nbsp; 🚚 Free Delivery across India
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
