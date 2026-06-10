'use client';

import React from 'react';
import { Star, ShoppingCart, Package } from 'lucide-react';
import { Product } from '@/lib/api';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onOpenDetails: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart, onOpenDetails }: ProductCardProps) {
  const variant = product.variants[0];
  const price = variant?.price || 0;
  const mrp = variant?.attributes?.mrp || price;
  const imageUrl = product.images?.[0] || variant?.image || null;
  const discount = mrp > price ? Math.round((1 - price / mrp) * 100) : 0;

  // Find badge (excluding olinbuy tag)
  const badge = product.tags.find((tag) => tag !== 'olinbuy') || '';

  // Use real ratings if present, otherwise default to a consistent mock rating
  const rating = product.rating_average !== undefined && product.rating_count && product.rating_count > 0
    ? product.rating_average
    : 4.0 + (product.name.length % 5) * 0.2;
  const reviews = product.rating_count !== undefined && product.rating_count > 0
    ? product.rating_count
    : 12 + (product.name.length % 8) * 11;

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-blue-200 shadow-sm hover:shadow-[0_8px_24px_rgba(30,77,158,0.12)] transition-all duration-300 flex flex-col group relative">
      {/* Clickable Card Body */}
      <div 
        onClick={() => onOpenDetails(product)}
        className="cursor-pointer flex-1 flex flex-col"
      >
        {/* Product Image Box */}
        <div className="relative aspect-square bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center overflow-hidden border-b border-slate-100 w-full">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full text-slate-300 select-none">
              <Package className="w-12 h-12 stroke-[1.5]" />
            </div>
          )}

          {/* Dynamic Badge */}
          {badge && (
            <span className={`absolute top-2.5 left-2.5 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-sm text-white ${
              badge === 'wholesale' ? 'bg-[#26a541]' :
              badge === 'hot' ? 'bg-[#ff6161]' :
              badge === 'sale' ? 'bg-[#ff9f00]' :
              badge === 'new' ? 'bg-[#2874f0]' : 'bg-purple-600'
            }`}>
              {badge === 'wholesale' ? 'Wholesale' : badge}
            </span>
          )}
        </div>

        {/* Body Info */}
        <div className="p-3.5 flex-1 flex flex-col">
          {/* Category */}
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 block">
            {badge === 'wholesale' ? 'Wholesale' : product.tags.includes('skincare') ? 'Skincare' : product.tags.includes('cosmetics') ? 'Cosmetics' : product.tags.includes('women') ? 'Women' : 'Men'}
          </span>

          {/* Title */}
          <h3 className="text-xs md:text-sm font-bold text-slate-800 line-clamp-2 leading-snug flex-1 mb-1.5 select-none">
            {product.name}
          </h3>

          {/* Ratings */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="bg-[#26a541] text-white text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 select-none">
              <Star className="w-2.5 h-2.5 fill-white stroke-none" />
              {rating.toFixed(1)}
            </div>
            <span className="text-[10px] text-slate-400 font-semibold select-none">
              ({reviews})
            </span>
          </div>

          {/* Price Strip */}
          <div className="flex items-baseline gap-1.5 flex-wrap mb-3.5">
            <span className="font-heading text-base md:text-lg font-bold text-slate-900 leading-none select-none">
              ₹{price.toLocaleString('en-IN')}
            </span>
            {discount > 0 && (
              <>
                <span className="text-xs text-slate-400 line-through select-none">
                  ₹{mrp.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] md:text-xs font-black text-[#ff6161] select-none">
                  {discount}% off
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Actions (Not inside the clickable body) */}
      <div className="p-3.5 pt-0">
        <button
          onClick={() => onAddToCart(product)}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-[#1a3a6b] hover:to-[#1e4d9e] hover:text-white border border-[#1a3a6b] text-[#1a3a6b] py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.98]"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
