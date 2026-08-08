'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart, Trash2, ArrowLeft, Sparkles, Check, AlertCircle, ShoppingBag, Loader2 } from 'lucide-react';
import StoreNavbar from '@/components/StoreNavbar';
import StoreFooter from '@/components/StoreFooter';
import CartDrawer from '@/components/CartDrawer';
import { useWishlist } from '@/lib/WishlistContext';
import { useCart } from '@/lib/CartContext';
import { fetchCategories, fetchStorefrontSettings, Category, Product } from '@/lib/api';

export default function WishlistPage() {
  const router = useRouter();
  const { wishlistProducts, removeFromWishlist, clearWishlist, isLoading } = useWishlist();
  const { addToCart } = useCart();

  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currencySymbol, setCurrencySymbol] = useState('₹');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch((err) => console.error('Failed to load categories', err));

    fetchStorefrontSettings()
      .then((settings) => {
        if (settings?.general?.currency) {
          const sym = settings.general.currency === 'USD' ? '$' : (settings.general.currency === 'EUR' ? '€' : (settings.general.currency === 'GBP' ? '£' : '₹'));
          setCurrencySymbol(sym);
        }
      })
      .catch(console.error);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value.trim()) {
      router.push(`/?search=${encodeURIComponent(value)}`);
    }
  };

  const showNotification = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => {
      setActionMessage(null);
    }, 3000);
  };

  const handleAddToCart = (product: Product, removeFromList = false) => {
    addToCart(product);
    if (removeFromList) {
      removeFromWishlist(product._id);
      showNotification(`Moved "${product.name}" to your cart!`);
    } else {
      showNotification(`Added "${product.name}" to your cart!`);
    }
  };

  const handleMoveAllToCart = () => {
    if (wishlistProducts.length === 0) return;
    wishlistProducts.forEach((prod) => {
      addToCart(prod);
    });
    clearWishlist();
    showNotification(`Moved all items to your cart!`);
  };

  return (
    <div className="min-h-screen bg-[#fbfcfd] text-slate-900 flex flex-col font-sans">
      <StoreNavbar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        categories={categories}
        selectedCategory=""
        onSelectCategory={(slug) => router.push(`/?category=${slug}`)}
      />
      <CartDrawer />

      {/* Notification Toast */}
      {actionMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-amber-400 border border-slate-700 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 text-xs font-bold">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{actionMessage}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#ff6b00] font-bold hover:underline mb-6 select-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
        </Link>

        {/* Page Header */}
        <div className="bg-white rounded-2xl border border-[#e2e2e3] p-6 shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shadow-sm">
              <Heart className="w-6 h-6 fill-rose-500" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  My Wishlist
                </h1>
                <span className="text-xs font-sans font-extrabold bg-rose-50 text-rose-600 border border-rose-200 px-2.5 py-0.5 rounded-full">
                  {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Save products you love and order them whenever you're ready.
              </p>
            </div>
          </div>

          {wishlistProducts.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleMoveAllToCart}
                className="flex items-center gap-2 bg-[#FFA41C] hover:bg-[#FFB542] text-slate-950 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-sm active:scale-95 border border-[#e49319]"
              >
                <ShoppingBag className="w-4 h-4 text-slate-950" />
                <span>Move All to Cart</span>
              </button>
            </div>
          )}
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-[#ff6b00]" />
            <p className="text-xs font-bold">Loading your wishlist...</p>
          </div>
        ) : wishlistProducts.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-[#e2e2e3] p-12 text-center max-w-md mx-auto shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-400 mx-auto">
              <Heart className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Your wishlist is empty</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Explore our trending collections and tap the heart icon on any product to save it for later.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#FFA41C] hover:bg-[#FFB542] text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-sm active:scale-95 border border-[#e49319]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Products</span>
            </Link>
          </div>
        ) : (
          /* Wishlist Items Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistProducts.map((product) => {
              const variant = product.variants?.[0];
              const price = variant?.price || 0;
              const mrp = variant?.attributes?.mrp || price;
              const imageUrl = product.images?.[0] || variant?.image || '';
              const discount = mrp > price ? Math.round((1 - price / mrp) * 100) : 0;
              const inStock = variant ? (variant.attributes?.stock ?? (variant as any).stock ?? 1) > 0 : true;

              return (
                <div
                  key={product._id}
                  className="bg-white border border-[#e2e2e3] rounded-2xl p-4 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all duration-300 group shadow-sm"
                >
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <Link
                      href={`/products/${product._id}`}
                      className="w-24 h-24 rounded-xl bg-slate-50 overflow-hidden shrink-0 border border-slate-200 relative group-hover:scale-105 transition-transform"
                    >
                      {imageUrl ? (
                        <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
                        </div>
                      )}
                    </Link>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/products/${product._id}`}
                            className="text-xs sm:text-sm font-bold text-slate-800 hover:text-[#ff6b00] line-clamp-2 transition-colors leading-snug"
                          >
                            {product.name}
                          </Link>
                          <button
                            onClick={() => removeFromWishlist(product._id)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                            aria-label="Remove item"
                            title="Remove from wishlist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Stock Badge */}
                        <div className="mt-1.5 flex items-center gap-1.5">
                          {inStock ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                              <Check className="w-3 h-3" /> In Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                              <AlertCircle className="w-3 h-3" /> Out of Stock
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="mt-2 flex items-baseline gap-2 flex-wrap">
                        <span className="text-base font-extrabold text-slate-900">
                          {currencySymbol}{price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                        {discount > 0 && (
                          <>
                            <span className="text-xs text-slate-400 line-through">
                              {currencySymbol}{mrp.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                            <span className="text-[10px] font-bold text-[#ba1a1a] bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                              -{discount}%
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleAddToCart(product, true)}
                      disabled={!inStock}
                      className="flex items-center justify-center gap-1.5 bg-[#FFA41C] hover:bg-[#FFB542] disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 py-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-sm active:scale-95 border border-[#e49319]"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Cart</span>
                    </button>

                    <button
                      onClick={() => handleAddToCart(product, false)}
                      disabled={!inStock}
                      className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 hover:text-slate-900 py-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer border border-slate-200/60 active:scale-95"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <StoreFooter />
    </div>
  );
}
