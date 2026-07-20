'use client';

import React from 'react';

interface PromotionGridProps {
  onSelectCategory: (category: string) => void;
}

export default function PromotionGrid({ onSelectCategory }: PromotionGridProps) {
  const cards = [
    {
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
      tag: 'NEW COLLECTION',
      title: "Women's Fashion 2025",
      desc: 'Kurtis, dresses, co-ords & more',
      btnText: 'Shop Women',
      category: 'women',
      bgClass: 'bg-gradient-to-br from-[#881337] via-[#a21caf] to-[#4c0519]',
      btnClass: 'bg-white/10 hover:bg-white/20 border border-white/25 text-white',
      emoji: '👗',
    },
    {
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

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {cards.map((card, idx) => (
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
              onClick={() => {
                onSelectCategory(card.category);
                document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
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
