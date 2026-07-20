'use client';

import React, { useState, useEffect } from 'react';
import {
  fetchCategories,
  fetchProducts,
  Category,
  Product
} from '@/lib/api';
import { useCart } from '@/lib/CartContext';
import Navbar from '@/components/Navbar';
import HeroCarousel from '@/components/HeroCarousel';
import TrustBadges from '@/components/TrustBadges';
import PromotionGrid from '@/components/PromotionGrid';
import ProductCard from '@/components/ProductCard';
import ProductDetailsModal from '@/components/ProductDetailsModal';
import CartDrawer from '@/components/CartDrawer';
import { Sparkles, ShoppingBag, Shirt, Package, Heart, Scissors, Smile, Star, Phone } from 'lucide-react';

const CATEGORY_META: Record<string, { emoji: string; bg: string; icon: any }> = {
  all: { emoji: '🛍️', bg: 'from-blue-50 to-blue-200', icon: ShoppingBag },
  skincare: { emoji: '✨', bg: 'from-yellow-50 to-yellow-200', icon: Sparkles },
  cosmetics: { emoji: '💄', bg: 'from-pink-50 to-pink-200', icon: Heart },
  women: { emoji: '👗', bg: 'from-purple-50 to-purple-200', icon: Shirt },
  men: { emoji: '👔', bg: 'from-sky-50 to-sky-200', icon: Shirt },
  wholesale: { emoji: '📦', bg: 'from-emerald-50 to-emerald-200', icon: Package },
  fragrance: { emoji: '🌸', bg: 'from-amber-50 to-amber-200', icon: Smile },
  haircare: { emoji: '💇', bg: 'from-orange-50 to-orange-200', icon: Scissors },
};

const REVIEWS = [
  {
    name: 'Priya Sharma',
    city: 'Delhi',
    stars: 5,
    text: 'Vitamin C Face Serum works like magic! My skin feels incredibly bright and hydrated. Sourced from original vendors indeed.',
    tag: 'Verified Buyer',
    avatar: 'P'
  },
  {
    name: 'Rahul Verma',
    city: 'Mumbai',
    stars: 5,
    text: 'Excellent wholesale rates. Ordered 2 bundles of shirts for my shop, received in 5 days with zero hassle. Strongly recommend Olinbuy.',
    tag: 'Wholesale Buyer',
    avatar: 'R'
  },
  {
    name: 'Sneha Patel',
    city: 'Ahmedabad',
    stars: 5,
    text: 'Super fast delivery and Cash on Delivery was available. The matte lipstick set has gorgeous shades. Will order again!',
    tag: 'Verified Buyer',
    avatar: 'S'
  }
];

export default function Home() {
  const { addToCart } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  // Load categories
  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(data))
      .catch((err) => console.error('Error fetching categories:', err));
  }, []);

  // Fetch category counts dynamically on load
  useEffect(() => {
    fetchProducts({ limit: '100' })
      .then((data) => {
        const counts: Record<string, number> = {};
        let total = 0;
        (data.items || []).forEach((prod) => {
          const cat = categories.find((c) => c._id === prod.category_id);
          if (cat) {
            counts[cat.slug] = (counts[cat.slug] || 0) + 1;
            total++;
          }
        });
        counts['all'] = total;
        setCategoryCounts(counts);
      })
      .catch((err) => console.error('Error counting products:', err));
  }, [categories]);

  // Load products based on filter
  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (selectedCategory !== 'all') {
      const cat = categories.find((c) => c.slug === selectedCategory);
      if (cat) params.category_id = cat._id;
    }
    if (searchTerm) {
      params.search = searchTerm;
    }

    fetchProducts(params)
      .then((data) => {
        setProducts(data.items || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, [selectedCategory, searchTerm, categories]);

  const handleSelectCategory = (slug: string) => {
    setSelectedCategory(slug);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Main Header Navbar */}
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onMenuClick={() => setIsMobileMenuOpen(true)}
      />

      {/* Category Tab Bar (Under Header) */}
      <nav className="w-full bg-[#f0f4f9] border-b border-slate-200 select-none shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex gap-1 overflow-x-auto no-scrollbar py-2 text-xs font-bold text-slate-600">
            {/* 'Home' Tab */}
            <button
              onClick={() => handleSelectCategory('all')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-white text-[#1a3a6b] shadow-sm border border-slate-200'
                  : 'hover:bg-slate-200/50 hover:text-slate-800'
              }`}
            >
              <span>🏠</span> Home
            </button>
            {/* Other Category Tabs */}
            {categories.map((cat) => {
              const meta = CATEGORY_META[cat.slug] || { emoji: '📦' };
              const isActive = selectedCategory === cat.slug;
              return (
                <button
                  key={cat._id}
                  onClick={() => handleSelectCategory(cat.slug)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-[#1a3a6b] shadow-sm border border-slate-200'
                      : 'hover:bg-slate-200/50 hover:text-slate-800'
                  }`}
                >
                  <span>{meta.emoji}</span> {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6">
        {/* Category Circle Strips (Moved to the very top of main content area) */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
          <div className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar justify-start md:justify-around py-1">
            {/* 'All' Circle */}
            <button
              onClick={() => handleSelectCategory('all')}
              className="flex flex-col items-center gap-2 group flex-shrink-0 cursor-pointer"
            >
              <div className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${CATEGORY_META.all.bg} rounded-full flex items-center justify-center shadow transition-all duration-300 group-hover:-translate-y-1 group-active:scale-95 border-2 ${
                selectedCategory === 'all' ? 'border-[#1a3a6b] scale-105' : 'border-transparent'
              }`}>
                <span className="text-2xl md:text-3xl">{CATEGORY_META.all.emoji}</span>
              </div>
              <span className={`text-[11px] md:text-xs font-extrabold select-none ${
                selectedCategory === 'all' ? 'text-[#1a3a6b] font-black' : 'text-slate-700'
              }`}>
                All
              </span>
              <span className="text-[9px] text-slate-400 font-bold -mt-1 block">
                {categoryCounts['all'] !== undefined ? `${categoryCounts['all']} items` : 'Loading...'}
              </span>
            </button>

            {categories.map((cat) => {
              const meta = CATEGORY_META[cat.slug] || { emoji: '📦', bg: 'from-slate-50 to-slate-200' };
              const count = categoryCounts[cat.slug];
              const isComing = count === undefined || count === 0;
              const countLabel = isComing ? 'Coming' : `${count} items`;

              return (
                <button
                  key={cat._id}
                  onClick={() => handleSelectCategory(cat.slug)}
                  className="flex flex-col items-center gap-2 group flex-shrink-0 cursor-pointer"
                >
                  <div className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${meta.bg} rounded-full flex items-center justify-center shadow transition-all duration-300 group-hover:-translate-y-1 group-active:scale-95 border-2 ${
                    selectedCategory === cat.slug ? 'border-[#1a3a6b] scale-105' : 'border-transparent'
                  }`}>
                    <span className="text-2xl md:text-3xl">{meta.emoji}</span>
                  </div>
                  <span className={`text-[11px] md:text-xs font-extrabold select-none ${
                    selectedCategory === cat.slug ? 'text-[#1a3a6b] font-black' : 'text-slate-700'
                  }`}>
                    {cat.name.replace("Fashion", "").replace("Fashion", "").trim()}
                  </span>
                  <span className="text-[9px] text-slate-400 font-bold -mt-1 block">
                    {countLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Announcement / Marquee Bar (Moved under categories circle cards) */}
        <div className="w-full bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 text-white text-[10px] md:text-xs font-extrabold uppercase py-2.5 tracking-wider overflow-hidden border-b border-emerald-500/20 select-none rounded-xl mb-6 shadow-sm">
          <div className="animate-marquee">
            <span>🚚 FREE DELIVERY | 2-3 Days Local, 10-12 Days Pan-India &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span>✨ NEW ARRIVALS — SKINCARE, FASHION & MORE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span>📦 WHOLESALE AVAILABLE — MOQ ₹2000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span>💰 COD AVAILABLE ACROSS INDIA &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </div>
        </div>

        {/* Hero Banner Carousel (Only show on all products) */}
        {selectedCategory === 'all' && !searchTerm && (
          <HeroCarousel onSelectCategory={handleSelectCategory} />
        )}

        {/* Trust Badges */}
        {selectedCategory === 'all' && !searchTerm && <TrustBadges />}

        {/* Category Promotion Cards Grid */}
        {selectedCategory === 'all' && !searchTerm && (
          <PromotionGrid onSelectCategory={handleSelectCategory} />
        )}

        {/* Products Grid Header */}
        <div id="products-section" className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
          <h2 className="font-heading text-lg md:text-xl font-extrabold text-slate-800 tracking-tight capitalize select-none">
            {searchTerm ? `Search Results: "${searchTerm}"` : selectedCategory === 'all' ? 'All Products' : categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}
          </h2>
          <span className="text-xs text-slate-400 font-bold select-none">
            {products.length} products found
          </span>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 h-[280px] animate-pulse flex flex-col gap-4">
                <div className="bg-slate-100 rounded-lg aspect-square w-full" />
                <div className="bg-slate-100 h-4 rounded w-3/4" />
                <div className="bg-slate-100 h-3 rounded w-1/2 mt-auto" />
                <div className="bg-slate-100 h-8 rounded w-full mt-2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm select-none">
            <span className="text-6xl mb-4 block">🔍</span>
            <p className="font-heading text-base font-bold text-slate-700">No products found</p>
            <p className="text-xs text-slate-400 mt-1">Try changing your search term or select another category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((prod) => (
              <ProductCard
                key={prod._id}
                product={prod}
                onAddToCart={addToCart}
                onOpenDetails={setSelectedProduct}
              />
            ))}
          </div>
        )}

        {/* Review/Testimonials Section (Only on main landing) */}
        {selectedCategory === 'all' && !searchTerm && (
          <section className="mt-12">
            <div className="text-center mb-8 border-b border-slate-200 pb-3">
              <h2 className="font-heading text-lg md:text-2xl font-extrabold text-slate-800 select-none">
                What Our Customers Say
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {REVIEWS.map((rev, i) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold flex items-center justify-center select-none text-sm">
                      {rev.avatar}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{rev.name}</h4>
                      <span className="text-[10px] text-slate-400 font-semibold">{rev.city} · {rev.tag}</span>
                    </div>
                  </div>
                  <div className="flex gap-0.5 text-amber-500 mb-2.5">
                    {Array.from({ length: rev.stars }).map((_, s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed italic select-none">
                    "{rev.text}"
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer Section */}
      <footer className="bg-[#0a1828] text-slate-400 mt-16 border-t border-[#c9a84c]/20 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="font-heading text-xl font-bold text-white tracking-wider">
              Olin<span className="text-[#c9a84c]">buy</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 select-none">
              India's premier fashion, beauty, and skincare destination. Based in Mohali, Punjab, providing authentic products and pan-India shipping.
            </p>
            <a
              href="https://wa.me/919690914734"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md hover:bg-[#1da854] transition-colors cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              WhatsApp Support
            </a>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase text-white tracking-widest border-b border-[#c9a84c]/40 pb-1.5 w-fit">
              Customer Care
            </h4>
            <ul className="text-xs space-y-2 select-none">
              <li><a href="#" className="hover:text-white transition-colors">How to Order</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Delivery Info</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Return Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
            </ul>
          </div>

          {/* Policies links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase text-white tracking-widest border-b border-[#c9a84c]/40 pb-1.5 w-fit">
              Our Policies
            </h4>
            <ul className="text-xs space-y-2 select-none">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Wholesale Policy</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase text-white tracking-widest border-b border-[#c9a84c]/40 pb-1.5 w-fit">
              Contact Us
            </h4>
            <ul className="text-xs space-y-2 text-slate-400 select-none">
              <li>📍 Shahi Majra, Mohali, Punjab (Pan-India)</li>
              <li>🕐 Mon–Sat: 10:00 AM – 8:00 PM</li>
              <li>💳 COD & UPI payments accepted</li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom copyright */}
        <div className="bg-[#0f1921] py-4 border-t border-slate-900/60 text-center text-[10px] md:text-xs text-slate-600 select-none">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
            <span>© 2026 Olinbuy — All rights reserved.</span>
            <span>Made in Mohali, Punjab, India 🇮🇳</span>
          </div>
        </div>
      </footer>

      {/* Cart Slider Drawer */}
      <CartDrawer />

      {/* Product Details & Reviews Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(prod, varId) => addToCart(prod, 1, varId)}
      />

      {/* Mobile Navigation Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 max-w-[280px] w-full bg-white shadow-xl p-5 flex flex-col animate-[slideInLeft_0.3s_ease-out]">
            <div className="flex items-center justify-between mb-6">
              <span className="font-heading text-lg font-bold text-slate-800">
                Olin<span className="text-[#c9a84c]">buy</span> Menu
              </span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-500 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <ul className="space-y-4 text-sm font-bold text-slate-700 select-none">
              <li>
                <button
                  onClick={() => { handleSelectCategory('all'); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-3 w-full text-left cursor-pointer"
                >
                  <span>🛍️</span> Home
                </button>
              </li>
              {categories.map((cat) => {
                const meta = CATEGORY_META[cat.slug] || { emoji: '📦' };
                return (
                  <li key={cat._id}>
                    <button
                      onClick={() => { handleSelectCategory(cat.slug); setIsMobileMenuOpen(false); }}
                      className="flex items-center gap-3 w-full text-left cursor-pointer"
                    >
                      <span>{meta.emoji}</span> {cat.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple close icon for mobile menu
function X(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
