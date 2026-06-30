'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ShoppingBag, Landmark, Sparkles } from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id') || 'N/A';
  const method = searchParams.get('method') || 'COD';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-8 max-w-lg w-full text-center relative overflow-hidden select-none">
      {/* Decorative stars */}
      <Sparkles className="w-8 h-8 text-[#c9a84c] absolute top-6 left-6 animate-pulse" />
      <Sparkles className="w-8 h-8 text-[#c9a84c] absolute bottom-6 right-6 animate-pulse" />

      {/* Success Checkmark */}
      <div className="w-16 h-16 bg-emerald-50 text-[#26a541] rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <h1 className="font-heading text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight mb-2">
        Thank You for Your Order!
      </h1>
      <p className="text-xs text-slate-400 font-semibold mb-6">
        Your order has been recorded and is currently processing.
      </p>

      {/* Details Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-3 mb-8 text-xs md:text-sm">
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span className="text-slate-400 font-semibold">Order ID:</span>
          <span className="font-bold text-slate-800 font-mono select-all">
            {orderId}
          </span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span className="text-slate-400 font-semibold">Payment Option:</span>
          <span className="font-bold text-slate-800">
            {method === 'COD' ? 'Cash on Delivery (COD)' : 'Credit Card (Stripe)'}
          </span>
        </div>
        <div className="flex justify-between pb-1">
          <span className="text-slate-400 font-semibold">Delivery Time:</span>
          <span className="font-bold text-slate-800">
            3–7 Business Days
          </span>
        </div>
      </div>

      {/* Custom Payment instruction note */}
      <div className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto mb-8">
        {method === 'COD' ? (
          <div className="flex gap-2.5 bg-emerald-50 border border-emerald-100 text-[#1b8c34] p-3.5 rounded-lg font-semibold items-start text-left">
            <Landmark className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>
              Please keep the exact cash amount ready for the delivery rider when your package arrives. Free delivery is guaranteed!
            </p>
          </div>
        ) : (
          <div className="flex gap-2.5 bg-blue-50 border border-blue-100 text-blue-800 p-3.5 rounded-lg font-semibold items-start text-left">
            <Landmark className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>
              Your secure credit card transaction is complete. We will process and ship your package within 1-3 business days.
            </p>
          </div>
        )}
      </div>

      {/* Home Route button */}
      <Link
        href="/"
        className="w-full bg-[#1a3a6b] hover:bg-[#112952] text-white py-3 rounded-lg text-xs md:text-sm font-black tracking-wider transition-all duration-200 shadow-md inline-flex items-center justify-center gap-2 cursor-pointer"
      >
        <ShoppingBag className="w-4 h-4" />
        Continue Shopping
      </Link>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-8 max-w-lg w-full text-center">
          <p className="text-sm font-semibold text-slate-400">Loading success details...</p>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
