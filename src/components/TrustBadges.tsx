import React from 'react';
import { Truck, ShieldCheck, IndianRupee, RotateCcw } from 'lucide-react';

export default function TrustBadges() {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6 select-none">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 division-x division-slate-100">
        <div className="flex flex-col items-center text-center p-2">
          <div className="w-12 h-12 bg-blue-50 text-[#1a3a6b] rounded-full flex items-center justify-center mb-3">
            <Truck className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">Free Delivery</h4>
          <p className="text-[10px] md:text-xs text-slate-400 mt-1">2-12 days pan-India delivery</p>
        </div>

        <div className="flex flex-col items-center text-center p-2 border-l md:border-l border-slate-100">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">100% Original</h4>
          <p className="text-[10px] md:text-xs text-slate-400 mt-1">Quality & authenticity guaranteed</p>
        </div>

        <div className="flex flex-col items-center text-center p-2 border-l border-slate-100">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-3">
            <IndianRupee className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">Cash on Delivery</h4>
          <p className="text-[10px] md:text-xs text-slate-400 mt-1">COD option available on orders</p>
        </div>

        <div className="flex flex-col items-center text-center p-2 border-l border-slate-100">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-3">
            <RotateCcw className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">Easy Returns</h4>
          <p className="text-[10px] md:text-xs text-slate-400 mt-1">3 days easy return window</p>
        </div>
      </div>
    </section>
  );
}
