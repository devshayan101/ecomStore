'use client';

import React from 'react';

const DEFAULT_CARDS = [
  {
    id: 'promo-1',
    tag: 'UP TO 50% OFF',
    title: 'Skincare & Beauty Deals',
    desc: 'Serums, moisturizers, SPF & more',
    btnText: 'Shop Skincare',
    category: 'skincare',
    bgClass: 'bg-gradient-to-br from-[#0c4a30] via-[#0f5c3c] to-[#062e1e]',
    btnClass: 'bg-white/10 hover:bg-white/20 border border-white/20 text-white',
    emoji: '🌿',
  },
  {
    id: 'promo-2',
    tag: 'NEW COLLECTION',
    title: "Women's Fashion",
    desc: 'Kurtis, dresses, co-ords & more',
    btnText: 'Shop Women',
    category: 'women',
    bgClass: 'bg-gradient-to-br from-[#881337] via-[#a21caf] to-[#4c0519]',
    btnClass: 'bg-white/10 hover:bg-white/20 border border-white/25 text-white',
    emoji: '👗',
  },
  {
    id: 'promo-3',
    tag: 'TRENDING NOW',
    title: "Men's Style Essentials",
    desc: 'Shirts, kurtas, trousers & more',
    btnText: 'Shop Men',
    category: 'men',
    bgClass: 'bg-gradient-to-br from-[#0369a1] via-[#0284c7] to-[#0c4a6e]',
    btnClass: 'bg-white/10 hover:bg-white/20 border border-white/25 text-white',
    emoji: '👔',
  },
  {
    id: 'promo-4',
    tag: 'BULK SAVINGS',
    title: 'Wholesale Program',
    desc: 'Upto 30% off on bulk orders',
    btnText: 'Shop Wholesale',
    category: 'wholesale',
    bgClass: 'bg-gradient-to-br from-[#78350f] via-[#b45309] to-[#451a03]',
    btnClass: 'bg-white/10 hover:bg-white/20 border border-white/25 text-white',
    emoji: '📦',
  },
];

interface PromoCardItem {
  id?: string;
  tag: string;
  title: string;
  desc: string;
  btnText: string;
  category: string;
  bgClass?: string;
  btnClass?: string;
  emoji?: string;
}

interface PromotionGridProps {
  cards?: PromoCardItem[];
  onSelectCategory: (category: string) => void;
}

export default function PromotionGrid({ cards, onSelectCategory }: PromotionGridProps) {
  const activeCards = (cards && cards.length > 0) ? cards : DEFAULT_CARDS;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {activeCards.map((card, idx) => (
        <div
          key={idx}
          className={`${card.bgClass} text-white rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[170px] shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 select-none`}
        >
          {/* Card Header & Content */}
          <div className="z-10 max-w-[70%]">
            <span className="text-[10px] md:text-xs font-extrabold tracking-widest text-white/70 block mb-1">
              {card.tag}
            </span>
            <h3 className="font-heading text-lg md:text-xl font-extrabold leading-tight mb-1">
              {card.title}
            </h3>
            <p className="text-xs text-white/80 font-medium mb-4">
              {card.desc}
            </p>
          </div>

          {/* Action Button */}
          <div className="z-10 mt-auto">
            <button
              onClick={() => onSelectCategory(card.category)}
              className={`${card.btnClass} font-bold text-xs px-4 py-2 rounded-lg cursor-pointer transition-colors`}
            >
              {card.btnText}
            </button>
          </div>

          {/* Floating Emoji Illustration */}
          <span className="absolute bottom-2 right-4 text-7xl md:text-8xl opacity-30 select-none pointer-events-none transform translate-y-2 translate-x-2">
            {card.emoji}
          </span>
        </div>
      ))}
    </section>
  );
}
