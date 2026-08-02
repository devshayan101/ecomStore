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
import StoreFooter from '@/components/StoreFooter';
import ProductCard from '@/components/ProductCard';
import ProductDetailsModal from '@/components/ProductDetailsModal';
import CartDrawer from '@/components/CartDrawer';
import { useCart } from '@/lib/CartContext';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { addToCart } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [promotionCards, setPromotionCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Sync search param from URL if redirected
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const search = params.get('search');
      if (search) setSearchTerm(search);
    }
  }, []);

  // Fetch settings
  useEffect(() => {
    fetchStorefrontSettings()
      .then((settings) => {
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

  // Fetch products based on category & search
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
    requestAnimationFrame(() => {
      document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col font-sans text-gray-900 selection:bg-[#FFD814] selection:text-black">
      {/* Header */}
      <StoreNavbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categories={categories}
        selectedCategory={selectedCategory}
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
        <StoreDealsScroller products={products} onSelectProduct={setSelectedProduct} />

        {/* Trending Items Scroller */}
        <StoreTrendingScroller products={products} onSelectProduct={setSelectedProduct} />

        {/* Full Products Section Grid */}
        <section id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 my-8">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {selectedCategory === 'all'
                  ? 'All Products'
                  : categories.find((c) => c.slug === selectedCategory)?.name || 'Products'}
              </h2>
              {searchTerm && (
                <p className="text-xs text-gray-500 mt-1">
                  Showing results for &quot;{searchTerm}&quot;
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
                  setSelectedCategory('all');
                  setSearchTerm('');
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

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(prod, vId) => addToCart(prod, 1, vId)}
      />
    </div>
  );
}
