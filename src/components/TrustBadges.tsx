import React from 'react';
import { Truck, ShieldCheck, IndianRupee, RotateCcw, Star } from 'lucide-react';

export default function TrustBadges() {
  return (
    <section className="bg-white rounded-xl md:rounded-2xl border border-slate-200 shadow-sm p-3 sm:p-4 md:p-5 mb-6 select-none">
      <div className="grid grid-cols-6 sm:grid-cols-5 gap-y-4 gap-x-2 sm:gap-2 md:gap-3 divide-x-0 sm:divide-x divide-slate-100">
        {/* Badge 1 */}
        <div className="col-span-2 sm:col-span-1 flex flex-col items-center text-center p-1">
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-blue-50 text-[#1a3a6b] rounded-full flex items-center justify-center mb-1.5">
            <Truck className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </div>
          <h4 className="text-[11px] sm:text-xs md:text-sm font-bold text-slate-800 leading-tight">Free Delivery</h4>
          <p className="text-[9px] md:text-xs text-slate-400 mt-0.5">2-12 days</p>
        </div>

        {/* Badge 2 */}
        <div className="col-span-2 sm:col-span-1 flex flex-col items-center text-center p-1 sm:border-l sm:border-slate-100">
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-1.5">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </div>
          <h4 className="text-[11px] sm:text-xs md:text-sm font-bold text-slate-800 leading-tight">100% Original</h4>
          <p className="text-[9px] md:text-xs text-slate-400 mt-0.5">Guaranteed</p>
        </div>

        {/* Badge 3 */}
        <div className="col-span-2 sm:col-span-1 flex flex-col items-center text-center p-1 sm:border-l sm:border-slate-100">
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-1.5">
            <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </div>
          <h4 className="text-[11px] sm:text-xs md:text-sm font-bold text-slate-800 leading-tight">COD Available</h4>
          <p className="text-[9px] md:text-xs text-slate-400 mt-0.5">Pay on arrival</p>
        </div>

        {/* Badge 4 */}
        <div className="col-span-3 sm:col-span-1 flex flex-col items-center text-center p-1 sm:border-l sm:border-slate-100">
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-1.5">
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </div>
          <h4 className="text-[11px] sm:text-xs md:text-sm font-bold text-slate-800 leading-tight">Easy Returns</h4>
          <p className="text-[9px] md:text-xs text-slate-400 mt-0.5">7-day policy</p>
        </div>

        {/* Badge 5 */}
        <div className="col-span-3 sm:col-span-1 flex flex-col items-center text-center p-1 sm:border-l sm:border-slate-100">
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-yellow-50 text-amber-500 rounded-full flex items-center justify-center mb-1.5">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 fill-current" />
          </div>
          <h4 className="text-[11px] sm:text-xs md:text-sm font-bold text-slate-800 leading-tight">4.8★ Rated</h4>
          <p className="text-[9px] md:text-xs text-slate-400 mt-0.5">2000+ reviews</p>
        </div>
      </div>
    </section>
  );
}

