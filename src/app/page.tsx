'use client';

import React, { useState, useEffect } from 'react';
import {
  fetchCategories,
  fetchProducts,
  fetchStorefrontSettings,
  Category,
  Product,
} from '@/lib/api';
import StoreNavbar from '@/components/StoreNavbar';
import StoreHero from '@/components/StoreHero';
import StoreFeatureGrid from '@/components/StoreFeatureGrid';
import StoreValueProps from '@/components/StoreValueProps';
import StoreDealsScroller from '@/components/StoreDealsScroller';
import StoreTrendingScroller from '@/components/StoreTrendingScroller';
import StoreProductVideos from '@/components/StoreProductVideos';
import StoreFooter from '@/components/StoreFooter';
import ProductCard from '@/components/ProductCard';
import CartDrawer from '@/components/CartDrawer';
import { useCart } from '@/lib/CartContext';
import { Loader2 } from 'lucide-react';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

function HomeContent() {
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchQ = searchParams?.get('search') || '';
  const categoryQ = searchParams?.get('category') || 'all';

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [promotionCards, setPromotionCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currencySymbol, setCurrencySymbol] = useState('₹');

  // Local state for search term (bind to input value)
  const [searchTerm, setSearchTerm] = useState(searchQ);

  // Sync state when URL updates
  useEffect(() => {
    setSearchTerm(searchQ);
  }, [searchQ]);

  // Fetch settings
  useEffect(() => {
    fetchStorefrontSettings()
      .then((settings) => {
        if (settings?.general?.currency) {
          const sym = settings.general.currency === 'USD' ? '$' : (settings.general.currency === 'EUR' ? '€' : (settings.general.currency === 'GBP' ? '£' : '₹'));
          setCurrencySymbol(sym);
        }
        if (settings?.content) {
          if (settings.content.heroSlides) setHeroSlides(settings.content.heroSlides);
          if (settings.content.promotionCards) setPromotionCards(settings.content.promotionCards);
        }
      })
      .catch((err) => console.error('Error fetching settings:', err));
  }, []);

  // Fetch categories
  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(data || []))
      .catch((err) => console.error('Error fetching categories:', err));
  }, []);

  // Fetch products based on category & search reactively from URL query params
  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (categoryQ !== 'all') {
      const cat = categories.find((c) => c.slug === categoryQ);
      if (cat) params.category_id = cat._id;
    }
    if (searchQ) {
      params.search = searchQ;
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
  }, [categoryQ, searchQ, categories]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    router.replace(`/?${params.toString()}`);
    requestAnimationFrame(() => {
      document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  const handleSelectCategory = (slug: string) => {
    const params = new URLSearchParams(window.location.search);
    if (slug !== 'all') {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    router.push(`/?${params.toString()}`);
    requestAnimationFrame(() => {
      document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col font-sans text-gray-900 selection:bg-[#FFD814] selection:text-black">
      {/* Header */}
      <StoreNavbar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        categories={categories}
        selectedCategory={categoryQ}
        onSelectCategory={handleSelectCategory}
      />

      <main className="flex-1 pb-16">
        {/* Hero Banner Carousel */}
        <StoreHero slides={heroSlides} />

        {/* Feature Grid Spotlight */}
        <StoreFeatureGrid
          categories={categories}
          promotionCards={promotionCards}
          onSelectCategory={handleSelectCategory}
        />

        {/* Value Props Bar */}
        <StoreValueProps />

        {/* Today's Deals Scroller */}
        <StoreDealsScroller products={products} currencySymbol={currencySymbol} />

        {/* Trending Items Scroller */}
        <StoreTrendingScroller products={products} currencySymbol={currencySymbol} />

        {/* Product Short Videos Section */}
        <StoreProductVideos
          products={products}
          categories={categories}
          selectedCategory={categoryQ}
          currencySymbol={currencySymbol}
        />

        {/* Full Products Section Grid */}
        <section id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 my-8">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {categoryQ === 'all'
                  ? 'All Products'
                  : categories.find((c) => c.slug === categoryQ)?.name || 'Products'}
              </h2>
              {searchQ && (
                <p className="text-xs text-gray-500 mt-1">
                  Showing results for &quot;{searchQ}&quot;
                </p>
              )}
            </div>
            <span className="text-xs text-gray-500 font-medium">
              {products.length} {products.length === 1 ? 'item' : 'items'} found
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-[#0058be]" />
              <span className="text-xs font-semibold">Loading Olinbuy catalog...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-lg border border-gray-200">
              <p className="text-sm font-semibold text-gray-600">No products match your criteria.</p>
              <button
                onClick={() => {
                  handleSelectCategory('all');
                  handleSearchChange('');
                }}
                className="mt-4 bg-[#FFD814] text-black px-4 py-2 rounded text-xs font-bold shadow hover:bg-[#FFD814]/90"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={(p) => addToCart(p, 1)}
                  currencySymbol={currencySymbol}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <StoreFooter />

      {/* Cart Side Drawer */}
      <CartDrawer />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#ff6b00]" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
