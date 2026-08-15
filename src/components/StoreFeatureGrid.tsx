'use client';

import React from 'react';
import Link from 'next/link';
import { Package, CreditCard, Heart, HelpCircle, ArrowRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Category } from '@/lib/api';

export interface PromoCardItem {
  id?: string;
  tag?: string;
  title: string;
  desc?: string;
  btnText?: string;
  category?: string;
  image?: string;
  bgClass?: string;
  titleColor?: string;
  descColor?: string;
  btnTextColor?: string;
  btnBgColor?: string;
}

interface StoreFeatureGridProps {
  categories: Category[];
  promotionCards?: PromoCardItem[];
  onSelectCategory: (slug: string) => void;
}

const DEFAULT_PROMO_CARDS: PromoCardItem[] = [
  {
    id: 'promo-1',
    tag: 'UP TO 50% OFF',
    title: 'Skincare',
    category: 'skincare',
    btnText: 'Shop Skincare',
    image: '/images/fallback/promo-skincare.png',
  },
  {
    id: 'promo-2',
    tag: 'NEW COLLECTION',
    title: 'Cosmetics',
    category: 'cosmetics',
    btnText: 'Shop Cosmetics',
    image: '/images/fallback/promo-cosmetics.png',
  },
  {
    id: 'promo-3',
    tag: 'TRENDING STYLE',
    title: "Women's Fashion",
    category: 'women',
    btnText: "Shop Women's Fashion",
    image: '/images/fallback/promo-fashion.png',
  },
  {
    id: 'promo-4',
    tag: 'BULK SAVINGS',
    title: 'Wholesale Program',
    category: 'wholesale',
    btnText: 'Shop Wholesale',
    image: '/images/fallback/promo-wholesale.png',
  },
];

export default function StoreFeatureGrid({
  categories,
  promotionCards,
  onSelectCategory,
}: StoreFeatureGridProps) {
  const { data: session } = useSession();

  // Use all promotion cards configured in settings, or fallback to categories or defaults
  let displayPromos: PromoCardItem[] = [];

  if (promotionCards && promotionCards.length > 0) {
    displayPromos = promotionCards.slice(0, 4);
  } else if (categories && categories.length > 0) {
    displayPromos = categories.slice(0, 4).map((cat, idx) => ({
      id: cat._id,
      title: cat.name,
      category: cat.slug,
      btnText: `Shop ${cat.name}`,
      image: (cat as any).image || DEFAULT_PROMO_CARDS[idx % DEFAULT_PROMO_CARDS.length].image,
    }));
  } else {
    displayPromos = DEFAULT_PROMO_CARDS;
  }

  return (
    <section className="relative z-30 max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 -mt-6 sm:-mt-36 lg:-mt-22 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
      {displayPromos.map((promo, idx) => {
        const bgImage = promo.image || (promo as any).bg;
        const targetCategory = promo.category || 'all';
        const buttonLabel = promo.btnText || (promo as any).buttonText || `Shop ${promo.title}`;
        
        // Define fallback gradient colors matching original setup
        const bgGradientClass = promo.bgClass || (
          idx % 4 === 0 ? 'bg-gradient-to-br from-[#0c4a30] via-[#0f5c3c] to-[#062e1e]' :
          idx % 4 === 1 ? 'bg-gradient-to-br from-[#881337] via-[#a21caf] to-[#4c0519]' :
          idx % 4 === 2 ? 'bg-gradient-to-br from-[#0369a1] via-[#0284c7] to-[#0c4a6e]' :
          'bg-gradient-to-br from-[#78350f] via-[#b45309] to-[#451a03]'
        );

        return (
          <div
            key={`feature-promo-${promo.id || idx}-${idx}`}
            onClick={() => onSelectCategory(targetCategory)}
            className={`relative group overflow-hidden rounded-2xl h-[360px] sm:h-[400px] shadow-md border border-white/5 transition-all duration-500 hover:shadow-xl hover:shadow-[#0058be]/10 flex flex-col justify-end p-6 cursor-pointer select-none ${!bgImage ? bgGradientClass : ''}`}
          >
            {/* Background Image with Zoom */}
            {bgImage && (
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ backgroundImage: `url('${bgImage}')` }}
              />
            )}

            {/* Floating blurred glowing orbs for fallback mesh gradients */}
            {!bgImage && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50 mix-blend-screen">
                <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-white/10 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute top-1/3 right-4 w-36 h-36 rounded-full bg-[#ff00ea]/10 blur-2xl animate-pulse" style={{ animationDuration: '6s' }} />
                <div className="absolute -bottom-8 left-1/4 w-44 h-44 rounded-full bg-white/15 blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
              </div>
            )}

            {/* Dark & tinted gradient overlay for premium look & text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5 z-10" />

            {/* Content (Tag, Title, Button) */}
            <div className="relative z-20 flex flex-col h-full justify-between pointer-events-none">
              {/* Top Section - Tag */}
              <div>
                {promo.tag && (
                  <span className="inline-block bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-sm border border-white/10">
                    {promo.tag}
                  </span>
                )}
              </div>

              {/* Bottom Section - Title, Desc, and Button */}
              <div className="space-y-3">
                <div>
                  <h3 
                    className="text-base sm:text-lg font-extrabold text-white leading-tight tracking-tight drop-shadow-sm font-heading"
                    style={promo.titleColor ? { color: promo.titleColor } : undefined}
                  >
                    {promo.title}
                  </h3>
                  {promo.desc && (
                    <p 
                      className="text-xs text-white/80 mt-1 font-medium leading-relaxed max-w-[90%]"
                      style={promo.descColor ? { color: promo.descColor } : undefined}
                    >
                      {promo.desc}
                    </p>
                  )}
                </div>

                <div className="pt-1">
                  <span
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold shadow-sm bg-white/15 hover:bg-white/25 border border-white/20 text-white transition-all duration-300 transform group-hover:translate-x-1"
                    style={{
                      borderColor: promo.btnBgColor ? promo.btnBgColor : 'rgba(255,255,255,0.2)',
                      backgroundColor: promo.btnBgColor ? promo.btnBgColor : 'rgba(255,255,255,0.1)',
                      color: promo.btnTextColor || '#ffffff',
                    }}
                  >
                    {buttonLabel} <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
