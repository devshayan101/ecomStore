'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Product, fetchProducts } from '@/lib/api';

interface ProductRelatedSectionProps {
  currentProductId: string;
  categoryId?: string;
  onAddToCart: (product: Product) => void;
  currencySymbol?: string;
}

export default function ProductRelatedSection({
  currentProductId,
  categoryId,
  onAddToCart,
  currencySymbol = '₹',
}: ProductRelatedSectionProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params: Record<string, string> = { limit: '6' };
    if (categoryId) params.category = categoryId;

    fetchProducts(params)
      .then((data) => {
        const filtered = (data.items || []).filter((p) => p._id !== currentProductId);
        setRelatedProducts(filtered.slice(0, 4));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching related products:', err);
        setLoading(false);
      });
  }, [currentProductId, categoryId]);

  if (!loading && relatedProducts.length === 0) return null;

  return (
    <section className="mb-14">
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-[#1a1c1d] font-heading">
          Frequently Bought Together
        </h2>
        <Link
          href="/products"
          className="text-xs font-bold text-[#a04100] hover:underline flex items-center gap-1"
        >
          View all catalog <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="flex gap-5 overflow-x-auto pb-4 custom-scrollbar">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="min-w-[280px] w-[280px] bg-white rounded-xl h-72 animate-pulse border border-[#e2e2e3]"
              />
            ))
          : relatedProducts.map((prod) => {
              const mainVariant = prod.variants?.[0];
              const price = mainVariant?.price ?? 0;
              const img = prod.images?.[0] || mainVariant?.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80';
              return (
                <div
                  key={prod._id}
                  className="min-w-[280px] w-[280px] bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all border border-[#e2e2e3] shadow-sm flex flex-col group"
                >
                  <div className="h-48 bg-[#f5f6f7] relative overflow-hidden">
                    <img
                      src={img}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-[#1a1c1d] line-clamp-1 mb-1">
                        {prod.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[#a04100] font-bold text-sm">
                          {currencySymbol}{price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {mainVariant?.attributes?.material || 'Premium'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onAddToCart(prod)}
                      className="w-full py-2 bg-[#e5e2e3] hover:bg-[#d8c2b9] text-[#1b1b1c] rounded-lg font-bold text-xs transition-colors border border-[#d8c2b9] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Add to Bundle
                    </button>
                  </div>
                </div>
              );
            })}
      </div>
    </section>
  );
}
