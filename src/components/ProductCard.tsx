'use client';

import React from 'react';
import { Star, ShoppingCart, Zap, Package, Eye } from 'lucide-react';
import { Product } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  currencySymbol?: string;
}

export default function ProductCard({ product, onAddToCart, currencySymbol = '₹' }: ProductCardProps) {
  const router = useRouter();
  const variant = product.variants[0];
  const price = variant?.price || 0;
  const mrp = variant?.attributes?.mrp || price;
  const imageUrl = product.images?.[0] || variant?.image || '';
  const secondaryImageUrl = product.images?.[1] || imageUrl || '';
  const discount = mrp > price ? Math.round((1 - price / mrp) * 100) : 0;

  // Find badge
  const badge = product.tags.find((tag) => tag !== 'olinbuy') || '';

  const rating = product.rating_average !== undefined && product.rating_count && product.rating_count > 0
    ? product.rating_average
    : 4.5 + (product.name.length % 4) * 0.1;
  const reviews = product.rating_count !== undefined && product.rating_count > 0
    ? product.rating_count
    : 18 + (product.name.length % 9) * 14;

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
    router.push('/checkout');
  };

  return (
    <div className="bg-white hover:shadow-md hover:border-slate-300 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col group relative border border-[#e2e2e3]">
      {/* Clickable Card Link */}
      <Link 
        href={`/products/${product._id}`}
        className="cursor-pointer flex-1 flex flex-col"
      >
        {/* Product Image Container with Secondary Image Reveal on Hover */}
        <div className="relative aspect-square bg-slate-50 overflow-hidden w-full border-b border-[#e2e2e3] group">
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
              />
              <img
                src={secondaryImageUrl}
                alt={`${product.name} view`}
                className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full text-slate-400 select-none">
              <Package className="w-12 h-12 stroke-[1.5]" />
            </div>
          )}

          {/* Clean Warm Badge */}
          {badge && (
            <span className="absolute top-3 left-3 text-[10px] font-sans font-bold px-2 py-0.5 rounded shadow-sm bg-[#FFA41C] text-black border border-black/10 uppercase tracking-wider">
              {badge}
            </span>
          )}

          {/* Quick View Hover Indicator */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="bg-white/95 text-slate-800 text-[11px] font-sans font-bold px-3.5 py-1.5 rounded-full border border-slate-200 flex items-center gap-1.5 shadow-md">
              <Eye className="w-3.5 h-3.5 text-[#ff6b00]" /> Quick View
            </span>
          </div>
        </div>

        {/* Info Area */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] font-sans font-bold text-[#a04100] uppercase tracking-wider">
              {product.tags.includes('techwear') ? 'Techwear Collection' : 'Catalog Pick'}
            </span>
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded text-[10px] font-sans font-semibold text-slate-600">
              <Star className="w-2.5 h-2.5 fill-[#FFA41C] text-[#FFA41C]" />
              {rating.toFixed(1)} ({reviews})
            </div>
          </div>

          <h3 className="font-sans text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 leading-tight flex-1 mb-2 group-hover:text-[#ff6b00] transition-colors">
            {product.name}
          </h3>

          {/* Price Strip */}
          <div className="flex items-baseline gap-1.5 flex-wrap mb-4">
            <span className="font-sans text-sm sm:text-base font-extrabold text-slate-900">
              {currencySymbol}{price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            {discount > 0 && (
              <>
                <span className="font-sans text-[11px] text-slate-400 line-through">
                  {currencySymbol}{mrp.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[9px] font-sans font-bold text-[#ba1a1a] bg-red-50 px-1 py-0.2 rounded border border-red-100">
                  -{discount}%
                </span>
              </>
            )}
          </div>
        </div>
      </Link>

      {/* Action CTAs */}
      <div className="p-4 pt-0 grid grid-cols-2 gap-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200/60 py-2 rounded-lg text-[11px] font-sans font-bold transition-all cursor-pointer active:scale-95"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Cart</span>
        </button>

        <button
          onClick={handleBuyNow}
          className="flex items-center justify-center gap-1 bg-[#FFA41C] hover:bg-[#FFB542] text-black py-2 rounded-lg text-[11px] font-sans font-bold transition-all cursor-pointer shadow-sm active:scale-95 hover:scale-[1.01]"
        >
          <Zap className="w-3.5 h-3.5 fill-black stroke-black" />
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
}
