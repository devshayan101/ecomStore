'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSlide {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  image?: string;
  largeImage?: string;
  smallImage?: string;
  bg?: string;
  buttonText?: string;
  category?: string;
  titleColor?: string;
  titleHighlightColor?: string;
  subtitleColor?: string;
  buttonTextColor?: string;
  buttonBgColor?: string;
  titleHighlight?: string;
}

interface StoreHeroProps {
  slides?: HeroSlide[];
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    title: 'Olinbuy Hover-Pro X',
    subtitle: 'Revolutionary magnetic-levitation tech for daily urban commuting. Silent. Fast. Safe.',
    ctaText: 'Shop Hover-Pro',
    ctaLink: '#products-section',
    largeImage: '/images/fallback/hero-slide-1-large.png',
    smallImage: '/images/fallback/hero-slide-1-small.png',
    image: '/images/fallback/hero-slide-1-large.png',
  },
  {
    title: 'Next-Gen Wearables',
    subtitle: 'Master your movement with the Pulse-Link ecosystem. Seamless bio-sync integration.',
    ctaText: 'Explore Gear',
    ctaLink: '#products-section',
    largeImage: '/images/fallback/hero-slide-2-large.png',
    smallImage: '/images/fallback/hero-slide-2-small.png',
    image: '/images/fallback/hero-slide-2-large.png',
  },
  {
    title: 'Nitro-Core Power',
    subtitle: 'High-density power cells designed for heavy-duty performance. Fast charge, long haul.',
    ctaText: 'Shop Energy',
    ctaLink: '#products-section',
    largeImage: '/images/fallback/hero-slide-3-large.png',
    smallImage: '/images/fallback/hero-slide-3-small.png',
    image: '/images/fallback/hero-slide-3-large.png',
  },
];

export default function StoreHero({ slides = DEFAULT_SLIDES }: StoreHeroProps) {
  const activeSlides = slides.length > 0 ? slides : DEFAULT_SLIDES;
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 7000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  return (
    <section className="relative w-full overflow-hidden bg-[#E3E6E6] h-[380px] sm:h-[480px] lg:h-[560px] group">
      <div className="relative w-full h-full">
        {activeSlides.map((slide, index) => {
          const isActive = index === currentSlide;
          const largeImg = slide.largeImage || slide.image;
          const smallImg = slide.smallImage || slide.largeImage || slide.image;
          const hasImage = !!(largeImg || smallImg);

          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {hasImage ? (
                <picture className="absolute inset-0 block w-full h-full">
                  {smallImg && <source media="(max-width: 640px)" srcSet={smallImg} />}
                  <img
                    src={largeImg || smallImg}
                    alt={slide.title || 'Hero Banner'}
                    className="w-full h-full object-cover object-center"
                  />
                </picture>
              ) : (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ background: slide.bg || '#0a1828' }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-100/90 via-black/30 to-black/50 sm:to-transparent" />
              <div className="relative z-20 max-w-7xl mx-auto px-2.5 sm:px-6 w-full h-full flex items-start pt-6 sm:pt-16">
                <div className="max-w-lg sm:max-w-xl flex flex-col gap-2 sm:gap-4 text-white sm:text-gray-900">
                  <h1 
                    className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight drop-shadow"
                    style={slide.titleColor ? { color: slide.titleColor } : undefined}
                  >
                    {slide.title}
                    {slide.titleHighlight && (
                      <span style={slide.titleHighlightColor ? { color: slide.titleHighlightColor } : undefined}>
                        {" "}{slide.titleHighlight}
                      </span>
                    )}
                  </h1>
                  <p 
                    className="text-xs sm:text-base font-medium opacity-90 sm:opacity-100 text-gray-100 sm:text-gray-700"
                    style={slide.subtitleColor ? { color: slide.subtitleColor } : undefined}
                  >
                    {slide.subtitle}
                  </p>
                  <div className="flex gap-3 mt-2 sm:mt-4">
                    <a
                      href={slide.ctaLink || (slide.category ? `#products-section` : '#products-section')}
                      className="bg-[#FFD814] text-black font-bold text-xs sm:text-sm px-5 py-2.5 sm:px-8 sm:py-3 rounded shadow hover:bg-[#FFD814]/90 transition-colors"
                      style={{
                        ...(slide.buttonTextColor ? { color: slide.buttonTextColor } : {}),
                        ...(slide.buttonBgColor ? { backgroundColor: slide.buttonBgColor } : {}),
                      }}
                    >
                      {slide.buttonText || slide.ctaText || 'Shop Now'}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 bg-black/20 hover:bg-black/40 text-white p-2 sm:p-3 rounded-full transition-all"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 bg-black/20 hover:bg-black/40 text-white p-2 sm:p-3 rounded-full transition-all"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-16 sm:bottom-44 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {activeSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              idx === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
