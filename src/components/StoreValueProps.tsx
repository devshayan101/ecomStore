'use client';

import React from 'react';
import { Truck, RotateCcw, Headset, ShieldCheck } from 'lucide-react';

export default function StoreValueProps() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 my-8 sm:my-12">
      <div className="bg-white py-6 px-6 sm:px-10 border border-gray-200 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 text-[#0058be] rounded-full flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-gray-900">Free Shipping</h4>
            <p className="text-[11px] sm:text-xs text-gray-500">On all orders over $99</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 text-[#0058be] rounded-full flex items-center justify-center shrink-0">
            <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-gray-900">Easy Returns</h4>
            <p className="text-[11px] sm:text-xs text-gray-500">30-day hassle-free window</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 text-[#0058be] rounded-full flex items-center justify-center shrink-0">
            <Headset className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-gray-900">24/7 Support</h4>
            <p className="text-[11px] sm:text-xs text-gray-500">Global expert assistance</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 text-[#0058be] rounded-full flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-gray-900">Secure Payments</h4>
            <p className="text-[11px] sm:text-xs text-gray-500">Encrypted transactions</p>
          </div>
        </div>
      </div>
    </section>
  );
}
