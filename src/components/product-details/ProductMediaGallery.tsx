'use client';

import React, { useState } from 'react';
import { PlayCircle, ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductMediaGalleryProps {
  images: string[];
  productName: string;
  activeImage: string | null;
  onSelectImage: (img: string) => void;
}

export default function ProductMediaGallery({
  images,
  productName,
  activeImage,
  onSelectImage,
}: ProductMediaGalleryProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const displayImages = images && images.length > 0
    ? images
    : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'];

  const currentActive = activeImage || displayImages[0];
  const currentIndex = displayImages.indexOf(currentActive);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIdx = (currentIndex - 1 + displayImages.length) % displayImages.length;
    onSelectImage(displayImages[nextIdx]);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIdx = (currentIndex + 1) % displayImages.length;
    onSelectImage(displayImages[nextIdx]);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image Box */}
      <div
        onClick={() => setIsLightboxOpen(true)}
        className="relative bg-[#f5f6f7] rounded-xl overflow-hidden aspect-[4/3] group border border-[#e2e2e3] cursor-zoom-in shadow-sm select-none"
      >
        <img
          src={currentActive}
          alt={productName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/90 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow flex items-center gap-1.5 backdrop-blur-sm">
            <ZoomIn className="w-3.5 h-3.5" /> Click to enlarge
          </span>
        </div>

        {/* Carousel Arrow Navigation overlay */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              aria-label="Next Image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Dots indicator */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none">
            {displayImages.map((img, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-200 ${
                  img === currentActive
                    ? 'w-6 bg-[#ff6b00]'
                    : 'w-2 bg-slate-400 opacity-60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails grid (5 cols layout matching productDetails.html) */}
      <div className="grid grid-cols-5 gap-3">
        {displayImages.slice(0, 5).map((img, idx) => {
          const isActive = img === currentActive;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectImage(img)}
              className={`aspect-square bg-white rounded-lg overflow-hidden border transition-all cursor-pointer relative ${
                isActive
                  ? 'border-2 border-[#ff6b00] ring-1 ring-[#ff6b00]'
                  : 'border-[#e2e2e3] hover:border-slate-400'
              }`}
            >
              <img
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          );
        })}
        {/* Placeholder play video tile if fewer than 5 images */}
        {displayImages.length < 5 && (
          <div className="aspect-square bg-[#f0f1f2] rounded-lg border border-[#e2e2e3] flex items-center justify-center text-slate-500 cursor-pointer hover:bg-[#e2e2e3] transition-colors">
            <PlayCircle className="w-6 h-6 text-[#00686f]" />
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-slate-300 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            className="relative max-w-4xl max-h-[85vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentActive}
              alt={productName}
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
