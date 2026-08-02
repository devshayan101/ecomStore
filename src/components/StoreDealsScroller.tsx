'use client';

import React from 'react';
import { Product } from '@/lib/api';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/CartContext';

interface StoreDealsScrollerProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  currencySymbol?: string;
}

export default function StoreDealsScroller({ products, onSelectProduct, currencySymbol = '₹' }: StoreDealsScrollerProps) {
  const { addToCart } = useCart();
  const dealProducts = products.length > 0 ? products.slice(0, 8) : [];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
      <div className="bg-white p-4 sm:p-6 shadow-sm rounded-lg border border-gray-100">
        <div className="flex items-baseline justify-between mb-4 sm:mb-6">
          <div className="flex items-baseline gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Today's Deals</h2>
            <span className="text-xs text-[#B91C1C] font-semibold bg-red-50 px-2 py-0.5 rounded">
              Limited Time Offers
            </span>
          </div>
        </div>

        {dealProducts.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-500">Loading today's deals...</div>
        ) : (
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-3 no-scrollbar scroll-smooth">
            {dealProducts.map((prod, index) => {
               const price = prod.variants?.[0]?.price || 0;
               const discountPercent = Math.floor(15 + (index * 5) % 30);
               const originalPrice = (price * (1 + discountPercent / 100)).toFixed(2);
               const mainImage = prod.images?.[0] || prod.variants?.[0]?.image || 'https://via.placeholder.com/300';

               return (
                <div
                  key={prod._id}
                  className="min-w-[180px] max-w-[210px] sm:min-w-[210px] flex flex-col gap-2 group cursor-pointer border border-gray-100 p-2.5 rounded hover:shadow-md transition-shadow"
                >
                  <div
                    onClick={() => onSelectProduct(prod)}
                    className="bg-gray-50 aspect-square flex items-center justify-center p-2 rounded overflow-hidden relative"
                  >
                    <img
                      src={mainImage}
                      alt={prod.name}
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="bg-[#B91C1C] text-white px-1.5 py-0.5 font-bold text-[10px] rounded-sm">
                      {discountPercent}% Off
                    </span>
                    <span className="text-[#B91C1C] font-bold text-[10px]">Top Deal</span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-base sm:text-lg font-bold text-gray-900">{currencySymbol}{price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span className="text-xs text-gray-400 line-through">{currencySymbol}{Number(originalPrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>

                  <p
                    onClick={() => onSelectProduct(prod)}
                    className="text-xs text-gray-700 font-medium line-clamp-2 group-hover:text-[#0058be]"
                  >
                    {prod.name}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(prod, 1);
                    }}
                    className="mt-auto w-full bg-[#FFA41C] hover:bg-[#FFA41C]/90 text-black py-1.5 rounded text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
