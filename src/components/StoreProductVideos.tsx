'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Product, Category } from '@/lib/api';
import { 
  Play, 
  Volume2, 
  VolumeX, 
  Heart, 
  ShoppingCart, 
  X, 
  ArrowRight, 
  TrendingUp, 
  Eye,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import Link from 'next/link';

// Predefined high-quality public portrait/short videos linked to categories
const SHORT_VIDEOS_DATA = [
  {
    id: 'vid-1',
    title: 'Vitamin C Serum Daily Glow Routine',
    category: 'skincare',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=600&auto=format&fit=crop',
    views: '12.4K',
    likes: 843,
    duration: '0:15',
    productId: '1' // mapped to Vitamin C face serum
  },
  {
    id: 'vid-2',
    title: 'Luxury Lipstick Matte Shades swatch',
    category: 'cosmetics',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=600&auto=format&fit=crop',
    views: '8.9K',
    likes: 624,
    duration: '0:12',
    productId: '7' // mapped to Rose Gold Matte Lipstick Set
  },
  {
    id: 'vid-3',
    title: 'Summer Fashion Lookbook 2026',
    category: 'women',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop',
    views: '15.2K',
    likes: 1204,
    duration: '0:20',
    productId: '2' // mapped to Oversized Denim Jacket
  },
  {
    id: 'vid-4',
    title: 'Smart Watch Series X Unboxing',
    category: 'electronics',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop',
    views: '22.1K',
    likes: 1890,
    duration: '0:18',
    productId: '4' // mapped to Wireless Headphones
  },
  {
    id: 'vid-5',
    title: 'Techwear Streetwear Styling Guide',
    category: 'men',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=600&auto=format&fit=crop',
    views: '19.4K',
    likes: 1430,
    duration: '0:14',
    productId: '5' // mapped to Leather Boots
  }
];

interface StoreProductVideosProps {
  products: Product[];
  categories: Category[];
  selectedCategory?: string; // category slug from homepage state
  currencySymbol?: string;
}

export default function StoreProductVideos({ 
  products, 
  categories, 
  selectedCategory = 'all',
  currencySymbol = '₹' 
}: StoreProductVideosProps) {
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState('all');
  const [activeVideo, setActiveVideo] = useState<typeof SHORT_VIDEOS_DATA[0] | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [likedVideos, setLikedVideos] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [videoProgress, setVideoProgress] = useState(0);
  const [addedStatus, setAddedStatus] = useState<Record<string, boolean>>({});
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollShorts = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.75 : scrollLeft + clientWidth * 0.75;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  // Sync state with parent selected category
  useEffect(() => {
    setActiveTab(selectedCategory);
  }, [selectedCategory]);

  // Filter video data based on active category slug
  const filteredVideos = SHORT_VIDEOS_DATA.filter(vid => {
    if (activeTab === 'all') return true;
    return vid.category === activeTab;
  });

  // Track video progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.duration) {
        setVideoProgress((video.currentTime / video.duration) * 100);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [activeVideo]);

  // Sync mute state
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = isMuted;
    }
  }, [isMuted, activeVideo]);

  const playNextVideo = () => {
    if (!activeVideo) return;
    const currentIndex = filteredVideos.findIndex(v => v.id === activeVideo.id);
    if (currentIndex !== -1 && currentIndex < filteredVideos.length - 1) {
      setActiveVideo(filteredVideos[currentIndex + 1]);
    } else if (filteredVideos.length > 0) {
      setActiveVideo(filteredVideos[0]);
    }
  };

  const playPrevVideo = () => {
    if (!activeVideo) return;
    const currentIndex = filteredVideos.findIndex(v => v.id === activeVideo.id);
    if (currentIndex !== -1 && currentIndex > 0) {
      setActiveVideo(filteredVideos[currentIndex - 1]);
    } else if (filteredVideos.length > 0) {
      setActiveVideo(filteredVideos[filteredVideos.length - 1]);
    }
  };

  // Keyboard navigation effect
  useEffect(() => {
    if (!activeVideo) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        playNextVideo();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        playPrevVideo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeVideo, filteredVideos]);

  // Touch swipe navigation refs & handlers
  const touchStartY = useRef(0);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;

    if (deltaY > 50) {
      playNextVideo();
    } else if (deltaY < -50) {
      playPrevVideo();
    }
  };

  // Like video handler
  const handleLike = (videoId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const isAlreadyLiked = likedVideos[videoId];
    setLikedVideos(prev => ({
      ...prev,
      [videoId]: !isAlreadyLiked
    }));

    const baseLikes = SHORT_VIDEOS_DATA.find(v => v.id === videoId)?.likes || 0;
    setLikeCounts(prev => ({
      ...prev,
      [videoId]: isAlreadyLiked ? (prev[videoId] || baseLikes) - 1 : (prev[videoId] || baseLikes) + 1
    }));
  };

  // Quick Add to Cart from Video
  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    
    setAddedStatus(prev => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAddedStatus(prev => ({ ...prev, [product._id]: false }));
    }, 2000);
  };

  // Find product linked to video
  const getProductForVideo = (videoId: string) => {
    const video = SHORT_VIDEOS_DATA.find(v => v.id === videoId);
    if (!video) return null;
    // Attempt match via category or generic product mapping
    const matched = products.find(p => p.category_id === categories.find(c => c.slug === video.category)?._id) 
      || products[0];
    return matched;
  };

  return (
    <section className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 mb-6 sm:mb-12">
      <div className="bg-white text-slate-900 p-3 sm:p-8 rounded-xl sm:rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] relative overflow-hidden">
        {/* Decorative Left Border line */}
        <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b from-purple-600 to-indigo-600"></div>

        {/* Absolute Glowing Blur Backdrops */}
        <div className="absolute top-[-20%] left-[-10%] w-[40%] aspect-square rounded-full bg-blue-500/5 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] aspect-square rounded-full bg-purple-500/5 blur-[100px] pointer-events-none"></div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-6 mb-4 sm:mb-8 relative z-10">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="bg-blue-50 p-2 sm:p-2.5 rounded-xl text-blue-600">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                Trending Product Shorts
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest bg-gradient-to-r from-red-500 to-orange-500 text-white py-0.5 px-2 rounded-full">
                  Live
                </span>
              </h2>
              <p className="text-[11px] sm:text-sm text-slate-500">Watch short showcase videos and buy directly</p>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Shorts
            </button>
            {categories.map((cat, idx) => (
              <button
                key={`vid-cat-${cat._id || cat.slug || idx}-${idx}`}
                onClick={() => setActiveTab(cat.slug)}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  activeTab === cat.slug
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Video Thumbnail list */}
        {filteredVideos.length === 0 ? (
          <div className="text-center py-12 sm:py-16 text-xs sm:text-sm text-slate-400 border border-dashed border-slate-200 rounded-2xl">
            No product videos available for this category yet.
          </div>
        ) : (
          <div className="relative group/shorts-section">
            {/* Scroll Navigation Buttons */}
            <button
              onClick={() => scrollShorts('left')}
              className="absolute left-[-12px] sm:left-[-18px] top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-white border border-slate-200 text-slate-700 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-slate-50 active:scale-95 transition-all duration-200 opacity-0 group-hover/shorts-section:opacity-100"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </button>
            <button
              onClick={() => scrollShorts('right')}
              className="absolute right-[-12px] sm:right-[-18px] top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-white border border-slate-200 text-slate-700 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-slate-50 active:scale-95 transition-all duration-200 opacity-0 group-hover/shorts-section:opacity-100"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </button>

            <div
              ref={scrollRef}
              className="flex gap-2.5 sm:gap-4 overflow-x-auto pb-2 sm:pb-4 no-scrollbar scroll-smooth snap-x snap-mandatory relative z-10"
            >
              {filteredVideos.map(vid => {
                const matchedProduct = getProductForVideo(vid.id);

                return (
                  <div 
                    key={vid.id}
                    onClick={() => {
                      setActiveVideo(vid);
                      setIsMuted(false);
                    }}
                    className="group relative w-[135px] sm:w-[200px] md:w-[220px] aspect-[9/16] shrink-0 snap-start rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950 border border-slate-100 cursor-pointer hover:border-blue-500/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Thumbnail Image */}
                    <img
                      src={vid.thumbnail}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out opacity-80"
                    />

                    {/* Gradient bottom overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                    {/* View count tag */}
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-slate-900/80 backdrop-blur-md px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-slate-300">
                      <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-400" />
                      <span>{vid.views}</span>
                    </div>

                    {/* Play Button Icon Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-9 h-9 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center text-white scale-90 group-hover:scale-100 group-hover:bg-white group-hover:text-slate-950 transition-all duration-300">
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Title & Info Block */}
                    <div className="absolute bottom-2.5 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 flex flex-col gap-1 sm:gap-1.5">
                      <p className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-blue-400">
                        {vid.category}
                      </p>
                      <p className="text-[11px] sm:text-xs font-bold line-clamp-2 text-white leading-tight">
                        {vid.title}
                      </p>
                      
                      {/* Linked Product price tag if matched */}
                      {matchedProduct && (
                        <div className="mt-0.5 sm:mt-1 bg-black/45 backdrop-blur-md py-0.5 sm:py-1 px-1.5 sm:px-2.5 rounded-lg border border-white/5 flex items-center justify-between text-[10px] sm:text-[11px]">
                          <span className="truncate text-slate-200 font-medium">{matchedProduct.name}</span>
                          <span className="font-bold text-orange-400 ml-1 sm:ml-1.5 shrink-0">
                            {currencySymbol}{matchedProduct.variants?.[0]?.price}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Portrait Reels Modal Viewer */}
      {activeVideo && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-lg p-2 sm:p-4 select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative w-full max-w-md aspect-[9/16] max-h-[92vh] bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
            
            {/* Modal Header Controls */}
            <div className="absolute top-4 left-4 right-4 z-[110] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-white">
                  O
                </div>
                <div>
                  <p className="text-xs font-black text-white">Olinbuy Shorts</p>
                  <p className="text-[9px] text-slate-300 uppercase tracking-widest font-semibold">{activeVideo.category}</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveVideo(null)}
                className="w-8 h-8 bg-slate-900/60 backdrop-blur-md border border-slate-800 text-white rounded-full flex items-center justify-center hover:bg-slate-800 cursor-pointer active:scale-95 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Main Video Element */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                src={activeVideo.videoUrl}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Central play indicator overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70"></div>

              {/* Sidebar Action Buttons (TikTok Style) */}
              <div className="absolute bottom-24 right-4 z-[110] flex flex-col items-center gap-5">
                {/* Like Button */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => handleLike(activeVideo.id)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-200 cursor-pointer ${
                      likedVideos[activeVideo.id] 
                        ? 'bg-red-500 border-red-500 text-white' 
                        : 'bg-slate-900/60 border-slate-800 text-white hover:bg-slate-800'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${likedVideos[activeVideo.id] ? 'fill-current' : ''}`} />
                  </button>
                  <span className="text-[10px] font-bold text-white">
                    {likeCounts[activeVideo.id] !== undefined ? likeCounts[activeVideo.id] : activeVideo.likes}
                  </span>
                </div>

                {/* Mute Button */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-900/60 backdrop-blur-md border border-slate-800 text-white hover:bg-slate-800 cursor-pointer transition-all"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <span className="text-[10px] font-bold text-white">
                    {isMuted ? 'Muted' : 'Unmuted'}
                  </span>
                </div>
              </div>

              {/* Bottom Video Progress Scrub Bar */}
              <div className="absolute bottom-20 left-0 right-0 h-1 bg-slate-800 z-[110]">
                <div 
                  className="h-full bg-blue-500 transition-all duration-150"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>

              {/* Bottom Details Card & Cart actions */}
              <div className="absolute bottom-4 left-4 right-4 z-[110]">
                <div className="bg-slate-950/80 backdrop-blur-lg p-3 rounded-2xl border border-slate-800/80">
                  <p className="text-sm font-bold text-white line-clamp-1">{activeVideo.title}</p>
                  
                  {/* Matched Product link & details */}
                  {(() => {
                    const prod = getProductForVideo(activeVideo.id);
                    if (!prod) return null;
                    const price = prod.variants?.[0]?.price || 0;
                    const isAdded = !!addedStatus[prod._id];

                    return (
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <Link 
                          href={`/products/${prod._id}`}
                          onClick={() => setActiveVideo(null)}
                          className="flex-1 flex flex-col gap-0.5 cursor-pointer hover:opacity-90"
                        >
                          <p className="text-xs font-semibold text-slate-300 truncate">{prod.name}</p>
                          <p className="text-sm font-black text-orange-400">
                            {currencySymbol}{price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </p>
                        </Link>

                        <div className="flex gap-1.5 shrink-0">
                          <button
                            onClick={(e) => handleAddToCart(prod, e)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all duration-200 ${
                              isAdded 
                                ? 'bg-green-500 text-white' 
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="w-3.5 h-3.5" />
                                <span>Add</span>
                              </>
                            )}
                          </button>

                          <Link
                            href={`/products/${prod._id}`}
                            onClick={() => setActiveVideo(null)}
                            className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-xl text-xs font-bold flex items-center justify-center"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}
    </section>
  );
}
