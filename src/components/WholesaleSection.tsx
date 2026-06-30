'use client';

import React from 'react';
import { Package, Award, Sparkles, Send } from 'lucide-react';

interface WholesaleSectionProps {
  onSelectCategory: (category: string) => void;
}

export default function WholesaleSection({ onSelectCategory }: WholesaleSectionProps) {
  return (
    <section className="bg-white rounded-2xl border-2 border-emerald-500 shadow-[0_8px_30px_rgba(16,185,129,0.08)] p-6 md:p-8 mb-6">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Side Info */}
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-extrabold uppercase px-3.5 py-1.5 rounded-full select-none border border-emerald-200">
            <Package className="w-3.5 h-3.5" />
            Wholesale Program
          </div>
          <h2 className="font-heading text-xl md:text-3xl font-extrabold text-slate-800 tracking-tight leading-tight select-none">
            Grow Your Retail & Reselling Business
          </h2>
          <p className="text-slate-500 text-xs md:text-sm leading-relaxed max-w-2xl select-none">
            Get premium cosmetics, skincare, and fashion inventory at bulk discounts. Minimum Order Value (MOQ) starts at just <strong>₹2,000</strong>. Designed for shop owners, boutique operators, and online resellers.
          </p>

          {/* Perks list */}
          <div className="flex flex-wrap gap-2 pt-2 select-none">
            <span className="bg-[#f1f8e9] border border-[#c5e1a5] text-[#33691e] text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              100% Authentic Brands
            </span>
            <span className="bg-[#f1f8e9] border border-[#c5e1a5] text-[#33691e] text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Pan-India Free Shipping
            </span>
          </div>
        </div>

        {/* Right Side Callouts */}
        <div className="flex-shrink-0 text-center lg:text-right w-full lg:w-auto">
          {/* Discount Ring */}
          <div className="w-28 h-28 md:w-32 md:h-32 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex flex-col items-center justify-center shadow-lg shadow-emerald-500/20 mx-auto lg:ml-auto mb-4 select-none">
            <span className="font-heading text-2xl md:text-3xl font-black text-white leading-none">
              30%
            </span>
            <span className="text-[9px] text-white/90 font-bold uppercase tracking-widest mt-1 block">
              Bulk Off
            </span>
          </div>

          {/* Action button */}
          <button
            onClick={() => {
              onSelectCategory('wholesale');
              document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full lg:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-[#1b8c34] text-white font-extrabold px-6 py-3 rounded-lg text-xs md:text-sm tracking-wide transition-all shadow-md hover:-translate-y-0.5 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            Browse Wholesale Catalog
          </button>
        </div>
      </div>
    </section>
  );
}
