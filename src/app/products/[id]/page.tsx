'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import {
  Product,
  Review,
  Variant,
  fetchProductById,
  fetchProductReviews,
  fetchCategories,
  Category,
  fetchStorefrontSettings,
} from '@/lib/api';
import { useCart } from '@/lib/CartContext';
import StoreNavbar from '@/components/StoreNavbar';
import CartDrawer from '@/components/CartDrawer';
import StoreFooter from '@/components/StoreFooter';

import ProductBreadcrumbs from '@/components/product-details/ProductBreadcrumbs';
import ProductMediaGallery from '@/components/product-details/ProductMediaGallery';
import ProductInfoSection from '@/components/product-details/ProductInfoSection';
import ProductTabbedInfo from '@/components/product-details/ProductTabbedInfo';
import ProductFAQSection from '@/components/product-details/ProductFAQSection';
import ProductReviewsSection from '@/components/product-details/ProductReviewsSection';
import ProductRelatedSection from '@/components/product-details/ProductRelatedSection';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { data: session } = useSession();
  const token = (session?.user as any)?.accessToken;
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [currencySymbol, setCurrencySymbol] = useState('₹');

  // Load categories and settings
  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(console.error);

    fetchStorefrontSettings()
      .then((settings) => {
        if (settings?.general?.currency) {
          const sym = settings.general.currency === 'USD' ? '$' : (settings.general.currency === 'EUR' ? '€' : (settings.general.currency === 'GBP' ? '£' : '₹'));
          setCurrencySymbol(sym);
        }
      })
      .catch((err) => console.error('Error fetching settings:', err));
  }, []);

  // Load product and reviews
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    fetchProductById(id)
      .then((prod) => {
        setProduct(prod);
        const initialVariant = prod.variants?.[0] || null;
        setSelectedVariant(initialVariant);
        setActiveImage(prod.images?.[0] || initialVariant?.image || null);
        setLoading(false);

        return fetchProductReviews(prod._id);
      })
      .then((reviewsData) => {
        if (reviewsData) setReviews(reviewsData);
      })
      .catch((err) => {
        console.error('Error loading product details:', err);
        setError(err.message || 'Failed to load product details.');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbfcfd] flex items-center justify-center">
        <div className="text-center space-y-2 select-none">
          <Loader2 className="w-8 h-8 animate-spin text-[#ff6b00] mx-auto" />
          <p className="text-xs text-slate-500 font-bold">Loading OlinBuy Product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#fbfcfd] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-[#e2e2e3] p-6 text-center select-none shadow-sm space-y-3">
          <span className="text-4xl block">⚠️</span>
          <h3 className="text-base font-bold text-slate-800">Product Not Found</h3>
          <p className="text-xs text-slate-500">{error || 'The requested item could not be found.'}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#ff6b00] font-bold hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
          </Link>
        </div>
      </div>
    );
  }

  const resolvedVariant = selectedVariant || product.variants?.[0] || null;

  // Images list
  const productImages = product.images || [];
  const variantImages = (product.variants || []).map((v) => v.image).filter(Boolean) as string[];
  const allImages = Array.from(new Set([...productImages, ...variantImages]));

  // Calculate review aggregation
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? Math.round((reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews) * 10) / 10
      : product.rating_average || 0;

  const breakdown = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) {
      breakdown[r.rating - 1]++;
    }
  });

  const handleAddToCart = () => {
    if (product && resolvedVariant) {
      addToCart(product, 1, resolvedVariant._id);
      return true;
    }
    return false;
  };

  const handleBuyNow = () => {
    if (handleAddToCart()) {
      router.push('/checkout');
    }
  };

  const handleReviewAdded = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value.trim()) {
      router.push(`/?search=${encodeURIComponent(value)}`);
    }
  };

  const handleMenuClick = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#fbfcfd] text-[#1a1c1d] flex flex-col font-sans">
      <StoreNavbar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        categories={categories}
        selectedCategory=""
        onSelectCategory={(slug) => {
          router.push(`/?category=${slug}`);
        }}
      />
      <CartDrawer />

      <main className="max-w-[1440px] mx-auto w-full px-4 md:px-10 py-6 flex-1">
        {/* Breadcrumbs */}
        <ProductBreadcrumbs categoryName={product.category_id} productName={product.name} />

        {/* Product Hero: Media Gallery + Product Info */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          <div className="lg:col-span-7">
            <ProductMediaGallery
              images={allImages}
              productName={product.name}
              activeImage={activeImage}
              onSelectImage={(img) => setActiveImage(img)}
            />
          </div>
          <div className="lg:col-span-5">
            <ProductInfoSection
              product={product}
              selectedVariant={resolvedVariant}
              onSelectVariant={(v) => {
                setSelectedVariant(v);
                if (v.image) setActiveImage(v.image);
              }}
              avgRating={avgRating}
              totalReviews={totalReviews}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              currencySymbol={currencySymbol}
            />
          </div>
        </section>

        {/* Tabbed Info Section */}
        <ProductTabbedInfo product={product} currencySymbol={currencySymbol} />

        {/* FAQ Section */}
        <ProductFAQSection customFaqs={product.faqs} displayConfig={product.display_configs?.faqs} />

        {/* Customer Reviews Section */}
        <ProductReviewsSection
          productId={product._id}
          reviews={reviews}
          avgRating={avgRating}
          totalReviews={totalReviews}
          breakdown={breakdown}
          token={token}
          onReviewAdded={handleReviewAdded}
        />

        {/* Related Products / Frequently Bought Together */}
        <ProductRelatedSection
          currentProductId={product._id}
          categoryId={product.category_id}
          onAddToCart={(relProduct) => addToCart(relProduct, 1, relProduct.variants?.[0]?._id)}
          currencySymbol={currencySymbol}
        />
      </main>

      <StoreFooter />
    </div>
  );
}
