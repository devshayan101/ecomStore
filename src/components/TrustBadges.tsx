import React from 'react';
import { Truck, ShieldCheck, IndianRupee, RotateCcw, Star } from 'lucide-react';

export default function TrustBadges() {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6 select-none">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-2 divide-x-0 md:divide-x divide-slate-100">
        {/* Badge 1 */}
        <div className="flex flex-col items-center text-center p-2">
          <div className="w-12 h-12 bg-blue-50 text-[#1a3a6b] rounded-full flex items-center justify-center mb-2.5">
            <Truck className="w-6 h-6" />
          </div>
          <h4 className="text-xs md:text-sm font-bold text-slate-800">Free Delivery</h4>
          <p className="text-[10px] md:text-xs text-slate-400 mt-0.5">2-12 days pan-India</p>
        </div>

        {/* Badge 2 */}
        <div className="flex flex-col items-center text-center p-2 border-l border-transparent md:border-l border-slate-100">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-2.5">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h4 className="text-xs md:text-sm font-bold text-slate-800">100% Original</h4>
          <p className="text-[10px] md:text-xs text-slate-400 mt-0.5">Quality guaranteed</p>
        </div>

        {/* Badge 3 */}
        <div className="flex flex-col items-center text-center p-2 border-l border-transparent md:border-l border-slate-100">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-2.5">
            <IndianRupee className="w-6 h-6" />
          </div>
          <h4 className="text-xs md:text-sm font-bold text-slate-800">Cash on Delivery</h4>
          <p className="text-[10px] md:text-xs text-slate-400 mt-0.5">COD available</p>
        </div>

        {/* Badge 4 */}
        <div className="flex flex-col items-center text-center p-2 border-l border-transparent md:border-l border-slate-100">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-2.5">
            <RotateCcw className="w-6 h-6" />
          </div>
          <h4 className="text-xs md:text-sm font-bold text-slate-800">Easy Returns</h4>
          <p className="text-[10px] md:text-xs text-slate-400 mt-0.5">7-day policy</p>
        </div>

        {/* Badge 5 */}
        <div className="flex flex-col items-center text-center p-2 border-l border-transparent md:border-l border-slate-100 col-span-2 sm:col-span-1">
          <div className="w-12 h-12 bg-yellow-50 text-amber-500 rounded-full flex items-center justify-center mb-2.5">
            <Star className="w-6 h-6 fill-current" />
          </div>
          <h4 className="text-xs md:text-sm font-bold text-slate-800">4.8★ Rated</h4>
          <p className="text-[10px] md:text-xs text-slate-400 mt-0.5">2000+ customers</p>
        </div>
      </div>
    </section>
  );
}

