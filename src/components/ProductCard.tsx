'use client';

import React from 'react';
import { Star, ShoppingCart, Zap, Package, Eye } from 'lucide-react';
import { Product } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const router = RouterHook();
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
    <div className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col group relative border border-white/10 bg-[#121218]/80">
      {/* Clickable Card Link */}
      <Link 
        href={`/products/${product._id}`}
        className="cursor-pointer flex-1 flex flex-col"
      >
        {/* Product Image Container with Secondary Image Reveal on Hover */}
        <div className="relative aspect-square bg-black/40 overflow-hidden w-full border-b border-white/5 group">
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
            <div className="flex flex-col items-center justify-center w-full h-full text-zinc-600 select-none">
              <Package className="w-12 h-12 stroke-[1.5]" />
            </div>
          )}

          {/* Dynamic Streetwear Badge */}
          {badge && (
            <span className="absolute top-3 left-3 text-[10px] font-mono font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-lg bg-[#CCFF00] text-black border border-black/20">
              {badge}
            </span>
          )}

          {/* Quick View Hover Indicator */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="bg-black/80 text-white text-[11px] font-mono font-bold px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 backdrop-blur-md">
              <Eye className="w-3.5 h-3.5 text-[#CCFF00]" /> INSPECT DROP
            </span>
          </div>
        </div>

        {/* Info Area */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] font-mono text-[#CCFF00] uppercase tracking-wider">
              {product.tags.includes('techwear') ? '// TECHWEAR' : '// LIMITED DROP'}
            </span>
            <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded text-[10px] font-mono text-zinc-300">
              <Star className="w-2.5 h-2.5 fill-[#CCFF00] text-none stroke-none" />
              {rating.toFixed(1)} ({reviews})
            </div>
          </div>

          <h3 className="font-heading text-sm md:text-base font-bold text-white line-clamp-2 leading-tight flex-1 mb-2 group-hover:text-[#CCFF00] transition-colors">
            {product.name}
          </h3>

          {/* Price Strip */}
          <div className="flex items-baseline gap-2 flex-wrap mb-4">
            <span className="font-mono text-base md:text-lg font-extrabold text-white">
              ₹{price.toLocaleString('en-IN')}
            </span>
            {discount > 0 && (
              <>
                <span className="font-mono text-xs text-zinc-500 line-through">
                  ₹{mrp.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] font-mono font-black text-[#CCFF00] bg-[#CCFF00]/10 px-1.5 py-0.5 rounded border border-[#CCFF00]/30">
                  -{discount}%
                </span>
              </>
            )}
          </div>
        </div>
      </Link>

      {/* Dual CTA Actions: Add to Cart + Buy Now */}
      <div className="p-4 pt-0 grid grid-cols-2 gap-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer active:scale-95"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>CART</span>
        </button>

        <button
          onClick={handleBuyNow}
          className="flex items-center justify-center gap-1.5 bg-[#CCFF00] hover:bg-[#b8e600] text-black py-2.5 rounded-xl text-xs font-mono font-black tracking-tight transition-all cursor-pointer shadow-[0_0_12px_rgba(204,255,0,0.3)] active:scale-95 hover:scale-[1.02]"
        >
          <Zap className="w-3.5 h-3.5 fill-black stroke-none" />
          <span>BUY NOW</span>
        </button>
      </div>
    </div>
  );
}

function RouterHook() {
  return useRouter();
}

