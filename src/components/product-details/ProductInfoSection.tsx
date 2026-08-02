'use client';

import React from 'react';
import { Star, ShoppingCart, Truck, RotateCcw, Check, Sparkles } from 'lucide-react';
import { Product, Variant } from '@/lib/api';

interface ProductInfoSectionProps {
  product: Product;
  selectedVariant: Variant | null;
  onSelectVariant: (variant: Variant) => void;
  avgRating: number;
  totalReviews: number;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

export default function ProductInfoSection({
  product,
  selectedVariant,
  onSelectVariant,
  avgRating,
  totalReviews,
  onAddToCart,
  onBuyNow,
}: ProductInfoSectionProps) {
  const currentVariant = selectedVariant || product.variants[0];
  const price = currentVariant?.price ?? 0;
  const mrp = currentVariant?.attributes?.mrp ?? price;
  const discount = mrp > price ? Math.round((1 - price / mrp) * 100) : 0;

  // Extract color or variant attributes
  const colorAttr = currentVariant?.attributes?.color || currentVariant?.attributes?.Color;

  return (
    <div className="flex flex-col gap-5">
      {/* Title & Ratings */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#1a1c1d] leading-tight font-heading">
          {product.name}
        </h1>
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          <div className="flex text-[#FFA41C]">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(avgRating)
                    ? 'fill-[#FFA41C] text-[#FFA41C]'
                    : 'text-slate-300'
                }`}
              />
            ))}
          </div>
          <span className="font-semibold text-sm text-[#a04100]">
            {avgRating > 0 ? avgRating.toFixed(1) : 'New'}{' '}
            <span className="text-slate-500 font-normal">
              ({totalReviews} {totalReviews === 1 ? 'Review' : 'Reviews'})
            </span>
          </span>
          <div className="w-px h-4 bg-[#e2e2e3]" />
          <span className="font-medium text-xs text-slate-500">423 Questions Answered</span>
        </div>
      </div>

      {/* Main Buy & Pricing Card */}
      <div className="bg-white border border-[#e2e2e3] p-5 rounded-xl shadow-sm space-y-4">
        <div className="flex items-end gap-3">
          <span className="text-3xl md:text-4xl font-extrabold text-[#1a1c1d] leading-none">
            ${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
          {discount > 0 && (
            <span className="text-[#ba1a1a] font-bold text-sm bg-red-50 px-2 py-0.5 rounded border border-red-100">
              -{discount}%
            </span>
          )}
          {mrp > price && (
            <span className="text-slate-400 line-through text-sm">
              ${mrp.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500">
          Prices include VAT. Financing available starting at $120/mo.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 pt-1">
          <button
            onClick={onAddToCart}
            type="button"
            className="w-full py-3 bg-[#FFA41C] hover:bg-[#FFB542] text-slate-900 font-bold rounded-lg text-base flex items-center justify-center gap-2 transition-transform active:scale-98 shadow-sm border border-[#e49319] cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5 text-slate-900" />
            Add to Cart
          </button>
          <button
            onClick={onBuyNow}
            type="button"
            className="w-full py-3 bg-[#FFD814] hover:bg-[#FFE354] text-slate-900 font-bold rounded-lg text-base transition-transform active:scale-98 shadow-sm border border-[#e2bf10] cursor-pointer"
          >
            Buy Now
          </button>
        </div>

        {/* Shipping & Returns perks grid */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#e2e2e3]">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1a1c1d]">
            <Truck className="w-4 h-4 text-[#00686f]" />
            <span>Free Shipping</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1a1c1d]">
            <RotateCcw className="w-4 h-4 text-[#00686f]" />
            <span>Free Returns</span>
          </div>
        </div>
      </div>

      {/* Variant Selector */}
      {product.variants && product.variants.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {colorAttr ? `Color: ${colorAttr}` : 'Select Option:'}
          </span>
          <div className="flex flex-wrap gap-2.5">
            {product.variants.map((v) => {
              const isSelected = v._id === currentVariant?._id;
              const swatchColor = v.attributes?.colorHex || (v.attributes?.color === 'Carbon Matte' ? '#121415' : '#333536');
              return (
                <button
                  key={v._id}
                  onClick={() => onSelectVariant(v)}
                  className={`px-3 py-2 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#ff6b00] bg-orange-50/50 text-[#ff6b00] ring-1 ring-[#ff6b00]'
                      : 'border-[#e2e2e3] bg-white text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {v.attributes?.color && (
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block"
                      style={{ backgroundColor: swatchColor }}
                    />
                  )}
                  <span>{v.attributes?.color || v.sku || `Option ${v.price}`}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#ff6b00]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Highlights (Invisible Table with Two Columns) */}
      {(!product.display_configs || product.display_configs.top_highlights) && product.top_highlights && product.top_highlights.length > 0 && (
        <div className="pt-4 border-t border-[#e2e2e3] space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Top Highlights
          </h4>
          <table className="w-full text-sm border-none border-collapse text-[#1a1c1d]">
            <tbody>
              {product.top_highlights.map((item, idx) => (
                <tr key={idx} className="border-none">
                  <td className="py-1 pr-4 font-bold text-slate-700 w-1/3 align-top border-none">
                    {item.key}
                  </td>
                  <td className="py-1 text-slate-900 border-none">
                    {item.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* About This Item (Bullet Points) */}
      {(!product.display_configs || product.display_configs.about_this_item) && (
        <div className="pt-4 border-t border-[#e2e2e3] space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            About This Item
          </h4>
          {product.about_this_item && product.about_this_item.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-700">
              {product.about_this_item.map((bullet, idx) => (
                <li key={idx}>
                  {bullet}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-600 leading-relaxed italic">
              {product.description || "No description details available."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
