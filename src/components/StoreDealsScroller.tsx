'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Product } from '@/lib/api';
import { ShoppingCart, ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import Link from 'next/link';

interface StoreDealsScrollerProps {
  products: Product[];
  onSelectProduct?: (product: Product) => void;
  currencySymbol?: string;
}

export default function StoreDealsScroller({ products, onSelectProduct, currencySymbol = '₹' }: StoreDealsScrollerProps) {
  const { addToCart } = useCart();
  const scrollRef = useRef<HTMLDivElement>(null);
  const dealProducts = products.length > 0 ? products.slice(0, 8) : [];

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay.getTime() - now.getTime();

      if (diff > 0) {
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.75 : scrollLeft + clientWidth * 0.75;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const padZero = (num: number) => String(num).padStart(2, '0');

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-12 relative group/section">
      <div className="bg-white p-5 sm:p-8 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] relative overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500"></div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="bg-red-50 p-2.5 rounded-xl text-red-600 animate-pulse">
              <Flame className="w-5 h-5 fill-red-600" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Today's Hot Deals</h2>
              <p className="text-xs sm:text-sm text-slate-500">Super savings on our premium, top-selling gear</p>
            </div>
            <span className="text-xs text-red-600 font-extrabold bg-red-50 border border-red-100 px-3 py-1 rounded-full uppercase tracking-wider">
              Limited Stock
            </span>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 bg-slate-950 text-white py-2 px-4 rounded-2xl shadow-inner font-mono text-sm self-start md:self-auto">
            <span className="text-[10px] text-slate-400 font-sans font-bold uppercase tracking-wider mr-1">Ends In:</span>
            <div className="flex items-center gap-1 font-bold text-orange-400">
              <span>{padZero(timeLeft.hours)}</span>
              <span className="text-white animate-pulse">:</span>
              <span>{padZero(timeLeft.minutes)}</span>
              <span className="text-white animate-pulse">:</span>
              <span>{padZero(timeLeft.seconds)}</span>
            </div>
          </div>
        </div>

        {/* Scroller Container */}
        {dealProducts.length === 0 ? (
          <div className="text-center py-16 text-sm text-slate-400 font-medium">Preparing today's hottest deals...</div>
        ) : (
          <div className="relative">
            {/* Scroll Buttons */}
            <button
              onClick={() => scroll('left')}
              className="absolute left-[-18px] top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-slate-200 text-slate-700 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-slate-50 active:scale-95 transition-all duration-200 opacity-0 group-hover/section:opacity-100"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="absolute right-[-18px] top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-slate-200 text-slate-700 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-slate-50 active:scale-95 transition-all duration-200 opacity-0 group-hover/section:opacity-100"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>

            <div
              ref={scrollRef}
              className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 no-scrollbar scroll-smooth snap-x snap-mandatory"
            >
              {dealProducts.map((prod, index) => {
                const price = prod.variants?.[0]?.price || 0;
                const discountPercent = Math.floor(18 + (index * 7) % 24);
                const originalPrice = (price * (1 + discountPercent / 100)).toFixed(2);
                const mainImage = prod.images?.[0] || prod.variants?.[0]?.image || 'https://via.placeholder.com/300';
                // Simulated stock indicator
                const itemsLeft = (index * 3 + 4) % 9 + 2;
                const stockPercent = 100 - Math.floor((itemsLeft / 12) * 100);

                return (
                  <div
                    key={`deal-${prod._id || index}-${index}`}
                    className="min-w-[200px] max-w-[230px] sm:min-w-[230px] flex flex-col gap-0 group border border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-300 snap-start overflow-hidden"
                  >
                    <Link href={`/products/${prod._id}`} className="flex flex-col gap-0 flex-1 cursor-pointer">
                      <div className="bg-slate-50 aspect-square flex items-center justify-center p-0 w-full relative border-b border-slate-100 overflow-hidden">
                        {/* Discount Tag */}
                        <div className="absolute top-2.5 left-2.5 z-10 bg-red-600 text-white px-2 py-1 font-black text-[10px] rounded-lg tracking-wider uppercase shadow-md">
                          {discountPercent}% Off
                        </div>

                        <img
                          src={mainImage}
                          alt={prod.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ease-out"
                        />
                      </div>

                      <div className="p-4 flex flex-col gap-2.5 flex-1">
                        {/* Stock Indicator Progress */}
                        <div className="mt-1.5 space-y-1">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-red-600 font-bold">Only {itemsLeft} left!</span>
                            <span className="text-slate-400 font-medium">{stockPercent}% sold</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-500"
                              style={{ width: `${stockPercent}%` }}
                            />
                          </div>
                        </div>

                        {/* Pricing block */}
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-lg font-extrabold text-slate-900">
                            {currencySymbol}
                            {price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <span className="text-xs text-slate-400 line-through">
                            {currencySymbol}
                            {Number(originalPrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>

                        <p className="text-xs text-slate-700 font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                          {prod.name}
                        </p>
                      </div>
                    </Link>

                    {/* Add to Cart Button */}
                    <div className="px-4 pb-4">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(prod, 1);
                        }}
                        className="w-full bg-slate-900 hover:bg-orange-500 hover:text-white text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-lg active:scale-[0.98]"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
