'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const SLIDES = [
  {
    tag: '✦ New Arrivals 2026',
    title: 'Glowing Skin,',
    titleHighlight: 'Confident You',
    subtitle: 'Premium skincare — serums, moisturizers, SPF & more. Authentic products, pan-India delivery.',
    bg: 'linear-gradient(125deg, #0a1828 0%, #0f2444 50%, #1e3a6e 100%)',
    badge: '50%',
    badgeText: 'Upto Off',
    emoji: '✨',
    buttonText: 'Shop Skincare',
    category: 'skincare'
  },
  {
    tag: '💄 Beauty Collection',
    title: 'Bold Looks,',
    titleHighlight: 'Real You',
    subtitle: 'Lipsticks, foundations, eyeshadows & more. Long-lasting formulas at unbeatable prices.',
    bg: 'linear-gradient(125deg, #1a0533 0%, #3d0d6e 50%, #6b21a8 100%)',
    badge: '42%',
    badgeText: 'Upto Off',
    emoji: '💄',
    buttonText: 'Shop Cosmetics',
    category: 'cosmetics'
  },
  {
    tag: '👗 Fashion 2026',
    title: 'Dress to',
    titleHighlight: 'Impress',
    subtitle: 'Men\'s & Women\'s fashion — kurtis, shirts, co-ord sets & more. Latest trends, best prices.',
    bg: 'linear-gradient(125deg, #0d2f0d 0%, #14532d 50%, #166534 100%)',
    badge: '39%',
    badgeText: 'Upto Off',
    emoji: '👗',
    buttonText: 'Shop Fashion',
    category: 'women'
  },
  {
    tag: '📦 Wholesale Program',
    title: 'Grow Your',
    titleHighlight: 'Business',
    subtitle: 'Bulk orders at best rates. MOQ ₹2,000 se shuru. Retailers, resellers & boutique owners welcome.',
    bg: 'linear-gradient(125deg, #2d0a0a 0%, #7f1d1d 50%, #991b1b 100%)',
    badge: '30%',
    badgeText: 'Bulk Off',
    emoji: '📦',
    buttonText: 'Wholesale Inquiry',
    category: 'wholesale'
  }
];

interface HeroCarouselProps {
  onSelectCategory: (category: string) => void;
}

export default function HeroCarousel({ onSelectCategory }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  return (
    <section className="relative w-full h-[240px] md:h-[320px] rounded-2xl overflow-hidden shadow-xl mb-6 group">
      {SLIDES.map((slide, idx) => (
        <div
          key={idx}
          style={{ background: slide.bg }}
          className={`absolute inset-0 flex items-center justify-between px-6 md:px-16 transition-opacity duration-700 ease-in-out ${
            idx === current ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Slide Text Content */}
          <div className="z-10 max-w-[70%] text-white flex flex-col justify-center">
            <span className="inline-block bg-white/10 border border-white/20 text-[#fde68a] text-[9px] md:text-xs font-extrabold uppercase px-2.5 py-1 rounded-full w-fit tracking-wider mb-2.5">
              {slide.tag}
            </span>
            <h2 className="font-heading text-xl md:text-4xl font-extrabold leading-tight tracking-tight mb-2 select-none">
              {slide.title} <br className="hidden md:inline" />
              <span className="text-[#fde68a]">{slide.titleHighlight}</span>
            </h2>
            <p className="text-[11px] md:text-sm text-white/80 line-clamp-2 md:line-clamp-none max-w-lg mb-4 select-none">
              {slide.subtitle}
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => {
                  onSelectCategory(slide.category);
                  document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white text-slate-900 font-bold hover:shadow-lg transition-shadow text-[10px] md:text-xs px-4 py-2 rounded-lg cursor-pointer"
              >
                {slide.buttonText} →
              </button>
              {slide.category === 'wholesale' && (
                <a
                  href="https://wa.me/919690914734?text=Hello%2C%20I%20am%20interested%20in%20your%20wholesale%20program."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#1da854] text-white font-bold hover:shadow-lg transition-all text-[10px] md:text-xs px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1.5"
                >
                  <span className="text-sm">💬</span> WhatsApp
                </a>
              )}
            </div>
          </div>

          {/* Floating Badge */}
          <div className="absolute top-4 right-4 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 border border-amber-300 rounded-full w-16 h-16 md:w-20 md:h-20 flex flex-col items-center justify-center text-center shadow-lg select-none z-10 hidden sm:flex animate-pulse">
            <span className="font-heading text-base md:text-xl font-black text-slate-950 block leading-none">
              {slide.badge}
            </span>
            <span className="text-[7px] md:text-[8px] text-slate-950 tracking-wider uppercase font-black mt-0.5 block leading-none">
              {slide.badgeText}
            </span>
          </div>

          {/* Large Background Decorative Icon */}
          <span className="absolute bottom-2 right-8 text-[90px] md:text-[140px] opacity-15 pointer-events-none select-none select-none z-0">
            {slide.emoji}
          </span>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/30 backdrop-blur-sm text-white w-8 h-8 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20 cursor-pointer shadow-md"
        aria-label="Previous Slide"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/30 backdrop-blur-sm text-white w-8 h-8 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20 cursor-pointer shadow-md"
        aria-label="Next Slide"
      >
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Slide Indicators Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              idx === current ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
