'use client';

import { Product } from '@/lib/api';
import { Star } from 'lucide-react';
import Link from 'next/link';

interface StoreTrendingScrollerProps {
  products: Product[];
  onSelectProduct?: (product: Product) => void;
  currencySymbol?: string;
}

export default function StoreTrendingScroller({ products, onSelectProduct, currencySymbol = '₹' }: StoreTrendingScrollerProps) {
  const trendingProducts = products.length > 0 ? products.slice(0, 10) : [];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
      <div className="bg-white p-4 sm:p-6 shadow-sm rounded-lg border-t-4 border-[#0058be]">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Inspired by your shopping trend</h2>
          <span className="text-xs text-gray-500">Based on recent interest in top-performing gear</span>
        </div>

        {trendingProducts.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-500">Loading recommended items...</div>
        ) : (
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-3 no-scrollbar scroll-smooth">
            {trendingProducts.map((prod, index) => {
              const price = prod.variants?.[0]?.price || 0;
              const reviewCount = 450 + (index * 137) % 800;
              const mainImage = prod.images?.[0] || prod.variants?.[0]?.image || 'https://via.placeholder.com/300';

              return (
                <Link
                  key={`trending-${prod._id || index}-${index}`}
                  href={`/products/${prod._id}`}
                  className="min-w-[150px] max-w-[170px] sm:min-w-[170px] flex flex-col gap-2 group cursor-pointer"
                >
                  <div className="aspect-[3/4] flex items-center justify-center bg-gray-50 rounded overflow-hidden p-2">
                    <img
                      src={mainImage}
                      alt={prod.name}
                      className="w-full h-full object-cover rounded group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <p className="text-xs text-gray-800 line-clamp-2 group-hover:text-[#0058be] font-medium leading-tight">
                    {prod.name}
                  </p>

                  <div className="flex items-center text-[#FFA41C] text-xs">
                    <Star className="w-3.5 h-3.5 fill-[#FFA41C]" />
                    <Star className="w-3.5 h-3.5 fill-[#FFA41C]" />
                    <Star className="w-3.5 h-3.5 fill-[#FFA41C]" />
                    <Star className="w-3.5 h-3.5 fill-[#FFA41C]" />
                    <Star className="w-3.5 h-3.5 fill-[#FFA41C]" />
                    <span className="text-[#0058be] ml-1 text-[10px]">({reviewCount})</span>
                  </div>

                  <p className="font-bold text-sm sm:text-base text-gray-900">
                    {currencySymbol}{price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
