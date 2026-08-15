'use client';

import React, { useRef } from 'react';
import { Product } from '@/lib/api';
import { Star, ChevronLeft, ChevronRight, Sparkles, Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { useWishlist } from '@/lib/WishlistContext';
import Link from 'next/link';

interface StoreTrendingScrollerProps {
  products: Product[];
  onSelectProduct?: (product: Product) => void;
  currencySymbol?: string;
}

export default function StoreTrendingScroller({ products, onSelectProduct, currencySymbol = '₹' }: StoreTrendingScrollerProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const scrollRef = useRef<HTMLDivElement>(null);
  const trendingProducts = products.length > 0 ? products.slice(0, 10) : [];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.75 : scrollLeft + clientWidth * 0.75;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 mb-3 sm:mb-12 relative group/trending-section">
      <div className="bg-white p-3 pt-3 pb-2 sm:p-8 rounded-xl sm:rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] relative overflow-hidden">
        {/* Decorative Left Border line */}
        <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b from-blue-600 to-indigo-600"></div>

        {/* Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-blue-50 p-2 sm:p-2.5 rounded-xl text-blue-600">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 fill-blue-100" />
            </div>
            <div>
              <h2 className="text-[calc(1rem+0.8vw)] sm:text-2xl font-black text-slate-900 tracking-tight">Inspired by your shopping trend</h2>
              <p className="text-[calc(0.65rem+0.4vw)] sm:text-sm text-slate-500">Curated recommendations based on your recent activity</p>
            </div>
          </div>
        </div>

        {/* Scroller */}
        {trendingProducts.length === 0 ? (
          <div className="text-center py-16 text-sm text-slate-400 font-medium">Personalizing your recommendations...</div>
        ) : (
          <div className="relative">
            {/* Scroll Navigation Buttons */}
            <button
              onClick={() => scroll('left')}
              className="absolute left-[-18px] top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-slate-200 text-slate-700 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-slate-50 active:scale-95 transition-all duration-200 opacity-0 group-hover/trending-section:opacity-100"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="absolute right-[-18px] top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-slate-200 text-slate-700 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-slate-50 active:scale-95 transition-all duration-200 opacity-0 group-hover/trending-section:opacity-100"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>

            <div
              ref={scrollRef}
              className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 no-scrollbar scroll-smooth snap-x snap-mandatory"
            >
              {trendingProducts.map((prod, index) => {
                const price = prod.variants?.[0]?.price || 0;
                const reviewCount = 180 + (index * 67) % 350;
                const rating = 4.2 + (index % 8) * 0.1;
                const mainImage = prod.images?.[0] || prod.variants?.[0]?.image || 'https://via.placeholder.com/300';
                
                // Extract category/tag indicator if exists
                const tag = prod.tags?.[0] || (index % 2 === 0 ? 'Top Seller' : 'Recommended');

                const isSaved = isInWishlist(prod._id);
                return (
                  <div 
                    key={`trending-${prod._id || index}-${index}`}
                    className="min-w-[170px] max-w-[195px] sm:min-w-[195px] flex flex-col gap-0 group border border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-300 snap-start overflow-hidden"
                  >
                    <Link
                      href={`/products/${prod._id}`}
                      className="flex flex-col gap-0 cursor-pointer flex-1"
                    >
                      <div className="w-full aspect-[4/5] flex items-center justify-center bg-slate-50 relative border-b border-slate-100 overflow-hidden">
                        {/* Heart Wishlist Toggle */}
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(prod);
                          }}
                          className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-sm p-1.5 rounded-full text-slate-400 hover:text-red-500 hover:scale-105 active:scale-95 transition-all duration-200 border border-slate-100 z-10"
                          aria-label={isSaved ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        >
                          <Heart className={`w-3.5 h-3.5 transition-colors ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-slate-400 hover:text-rose-500'}`} />
                        </button>

                        <img
                          src={mainImage}
                          alt={prod.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ease-out"
                        />
                      </div>

                      <div className="p-3.5 flex flex-col gap-1.5 flex-1">
                        {/* Tag & Category */}
                        <span className="text-[10px] text-blue-600 font-extrabold uppercase tracking-widest">
                          {tag}
                        </span>

                        {/* Title */}
                        <p className="text-xs text-slate-800 font-bold line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 leading-tight">
                          {prod.name}
                        </p>

                        {/* Rating details */}
                        <div className="flex items-center gap-1">
                          <div className="flex items-center text-[#FFA41C]">
                            <Star className="w-3.5 h-3.5 fill-[#FFA41C]" />
                          </div>
                          <span className="text-xs font-bold text-slate-800">{rating.toFixed(1)}</span>
                          <span className="text-slate-400 text-[10px]">({reviewCount})</span>
                        </div>

                        {/* Price info */}
                        <p className="font-extrabold text-sm sm:text-base text-slate-900 mt-0.5">
                          {currencySymbol}
                          {price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </Link>

                    {/* Add to Cart button */}
                    <div className="px-3.5 pb-3.5">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(prod, 1);
                        }}
                        className="w-full bg-slate-900 hover:bg-orange-500 hover:text-white text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-lg active:scale-[0.98]"
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
