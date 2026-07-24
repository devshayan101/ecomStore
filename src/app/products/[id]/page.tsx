'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  X, Star, ShoppingCart, Image as ImageIcon, CheckCircle, Loader2, Sparkles, Package, ArrowLeft, Phone, ZoomIn, Search
} from 'lucide-react';
import {
  Product,
  Review,
  fetchProductById,
  fetchProductReviews,
  createProductReview,
  getReviewImageUploadUrl
} from '@/lib/api';
import { useCart } from '@/lib/CartContext';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Link from 'next/link';

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
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Lightbox State
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Search redirection
  const [searchTerm, setSearchTerm] = useState('');

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

        // Fetch reviews
        setLoadingReviews(true);
        return fetchProductReviews(prod._id);
      })
      .then((reviewsData) => {
        if (reviewsData) setReviews(reviewsData);
        setLoadingReviews(false);
      })
      .catch((err) => {
        console.error('Error loading product details:', err);
        setError(err.message || 'Failed to load product details.');
        setLoading(false);
        setLoadingReviews(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center">
        <div className="text-center space-y-2 select-none">
          <Loader2 className="w-8 h-8 animate-spin text-[#1a3a6b] mx-auto" />
          <p className="text-xs text-slate-400 font-bold">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-6 text-center select-none shadow-sm">
          <span className="text-4xl mb-3 block">⚠️</span>
          <h3 className="text-base font-bold text-slate-800">Error Loading Product</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">{error || 'Product not found.'}</p>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-bold hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const resolvedVariant = selectedVariant || product.variants[0];
  const price = resolvedVariant?.price || 0;
  const mrp = resolvedVariant?.attributes?.mrp || price;
  const discount = mrp > price ? Math.round((1 - price / mrp) * 100) : 0;

  const productImages = product.images || [];
  const variantImages = product.variants.map((v) => v.image).filter(Boolean) as string[];
  const allImages = Array.from(new Set([...productImages, ...variantImages]));

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? Math.round((reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews) * 10) / 10
    : 0;

  const breakdown = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) {
      breakdown[r.rating - 1]++;
    }
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setUploadingImage(true);
    try {
      const { uploadUrl, objectUrl } = await getReviewImageUploadUrl(file.type, token);
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error('Failed to upload image to storage');
      }

      setImageUrls((prev) => [...prev, objectUrl]);
    } catch (err) {
      console.error(err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSubmittingReview(true);
    setSubmitError(null);

    try {
      const newReview = await createProductReview(
        product._id,
        {
          rating,
          title,
          comment,
          images: imageUrls,
        },
        token
      );

      setSubmitSuccess(true);
      if (newReview.status === 'approved') {
        setReviews((prev) => [newReview, ...prev]);
      }

      setTitle('');
      setComment('');
      setImageUrls([]);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    router.push(`/?search=${encodeURIComponent(value)}`);
  };



  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f4f4f4]">
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onMenuClick={() => router.push('/')}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6">
        {/* Breadcrumbs / Back button */}
        <div className="mb-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-bold hover:text-slate-800 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to All Products
          </Link>
        </div>

        {/* Product Card Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row overflow-hidden mb-8">
          {/* Product Image Side */}
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col bg-gradient-to-b from-slate-50 to-white md:border-r border-slate-100">
            <div
              onClick={() => setIsLightboxOpen(true)}
              className="aspect-square bg-white rounded-2xl flex items-center justify-center border border-slate-200/60 shadow-inner relative mb-4 overflow-hidden cursor-zoom-in group"
            >
              {activeImage ? (
                <>
                  <img
                    src={activeImage}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full text-slate-300 select-none">
                  <Package className="w-24 h-24 stroke-[1.5]" />
                </div>
              )}
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-red-500 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Image Thumbnails Gallery */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 select-none">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                      activeImage === img ? 'border-blue-600 scale-95 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={img} alt={`${product.name} thumbnail ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-4 mt-2">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  {product.tags.includes('skincare') ? 'Skincare' : 'Product'}
                </span>
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 leading-tight select-none mt-1">
                  {product.name}
                </h2>
              </div>

              {/* Ratings Summary */}
              <div className="flex items-center gap-2 select-none">
                <div className="bg-[#26a541] text-white text-xs font-black px-2 py-0.5 rounded flex items-center gap-0.5 shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-white stroke-none" />
                  {(product.rating_average || avgRating || 0).toFixed(1)}
                </div>
                <span className="text-xs text-slate-400 font-bold">
                  ({product.rating_count || totalReviews || 0} reviews)
                </span>
              </div>

              <div className="flex items-baseline gap-2 py-2 border-y border-slate-100">
                <span className="text-2xl font-bold text-slate-900 font-heading">
                  ₹{price.toLocaleString('en-IN')}
                </span>
                {discount > 0 && (
                  <span className="text-sm text-slate-400 line-through">
                    ₹{mrp.toLocaleString('en-IN')}
                  </span>
                )}
                {resolvedVariant?.sku && (
                  <span className="text-[10px] text-slate-400 font-bold uppercase ml-auto self-center select-none">
                    SKU: {resolvedVariant.sku}
                  </span>
                )}
              </div>

              {/* Variant Selector */}
              {product.variants.length > 1 && (
                <div className="space-y-2 select-none border-t border-slate-100 pt-3">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Select Option / Variant</span>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => {
                      const isSelected = resolvedVariant?._id === v._id;
                      const attrLabel = v.attributes?.variant_name || v.attributes?.variant || Object.entries(v.attributes || {})
                        .filter(([key]) => key !== 'mrp')
                        .map(([key, val]) => `${key}: ${val}`)
                        .join(', ') || `SKU: ${v.sku}`;

                      return (
                        <button
                          key={v._id}
                          type="button"
                          onClick={() => {
                            setSelectedVariant(v);
                            setActiveImage(v.image || product.images?.[0] || null);
                          }}
                          className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50 text-blue-800 shadow-sm'
                              : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                          }`}
                        >
                          <span>{attrLabel}</span>
                          <span className="text-[10px] font-semibold text-slate-400 mt-1">₹{v.price.toLocaleString('en-IN')}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="text-xs text-slate-500 leading-relaxed space-y-2">
                <p className="font-extrabold text-slate-700 uppercase tracking-widest text-[9px]">Description</p>
                <p className="bg-white/80 p-3 rounded-lg border border-slate-200/50">{product.description || 'No description available for this product.'}</p>
              </div>

              <button
                onClick={() => {
                  addToCart(product, resolvedVariant?._id);
                }}
                className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white py-3.5 rounded-xl text-sm font-bold tracking-wider transition-all duration-200 shadow-md cursor-pointer active:scale-[0.98] select-none"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
            </div>
          </div>

          {/* Product Reviews Side */}
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col border-t md:border-t-0 md:border-l border-slate-100">
            <h3 className="font-heading text-lg font-extrabold text-slate-800 border-b border-slate-100 pb-3 mb-4 select-none">
              Customer Feedback
            </h3>

            {/* Ratings Stats Details */}
            {totalReviews > 0 ? (
              <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-6 border border-slate-200/60 mb-6 select-none">
                <div className="text-center">
                  <div className="text-3xl font-black text-slate-800 leading-none">{avgRating.toFixed(1)}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">out of 5</div>
                  <div className="flex gap-0.5 text-amber-400 justify-center mt-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < Math.round(avgRating) ? 'fill-current' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Progress Bars */}
                <div className="flex-1 space-y-1.5 text-slate-600">
                  {breakdown.slice().reverse().map((count, index) => {
                    const stars = 5 - index;
                    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                    return (
                      <div className="flex items-center gap-2 text-xs font-semibold" key={stars}>
                        <span className="w-3 text-right">{stars}</span>
                        <Star className="w-3 h-3 fill-slate-400 text-slate-400" />
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-5 text-right text-slate-400 text-[10px]">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/60 text-center text-slate-400 text-xs italic mb-6">
                No verified reviews yet. Be the first to share your experience!
              </div>
            )}

            {/* Review Submission Form */}
            {token ? (
              submitSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-5 text-xs font-bold text-center space-y-3 mb-6 select-none flex flex-col items-center">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                  <div>
                    <p className="text-sm font-black">Review Submitted Successfully!</p>
                    <p className="font-semibold text-emerald-600/80 mt-1">Your review will appear on the storefront shortly.</p>
                  </div>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-4 rounded-lg mt-1 transition-colors cursor-pointer"
                  >
                    Write Another Review
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 mb-6 space-y-4">
                  <h4 className="font-heading text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4.5 h-4.5 text-blue-600" />
                    Leave a Product Review
                  </h4>

                  {submitError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-2.5 text-xs font-bold">
                      ⚠️ {submitError}
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider select-none">Rating *</span>
                    <div className="flex gap-1 text-slate-200">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const starVal = i + 1;
                        const active = hoverRating ? starVal <= hoverRating : starVal <= rating;
                        return (
                          <button
                            type="button"
                            key={starVal}
                            onClick={() => setRating(starVal)}
                            onMouseEnter={() => setHoverRating(starVal)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-0.5 cursor-pointer text-slate-300 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`w-6 h-6 ${active ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="review_title" className="text-[10px] font-black uppercase text-slate-400 tracking-wider select-none">Review Title</label>
                    <input
                      type="text"
                      id="review_title"
                      placeholder="Summarize your review in a few words"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="border border-slate-200 rounded-lg p-2 text-xs bg-white outline-none focus:border-blue-600 text-slate-800"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="review_comment" className="text-[10px] font-black uppercase text-slate-400 tracking-wider select-none">Detailed Review</label>
                    <textarea
                      id="review_comment"
                      placeholder="Tell us what you liked or disliked about this product"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                      className="border border-slate-200 rounded-lg p-2 text-xs bg-white outline-none focus:border-blue-600 text-slate-800 resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider select-none">Attach Photos</span>
                    <div className="flex flex-wrap gap-2 items-center">
                      {imageUrls.map((url, index) => (
                        <div className="relative h-12 w-12 border border-slate-200 rounded-lg overflow-hidden" key={index}>
                          <img src={url} alt="Attached" className="object-cover w-full h-full" />
                        </div>
                      ))}
                      <label className="h-12 w-12 rounded-lg border border-dashed border-slate-300 hover:border-blue-500 bg-white flex flex-col items-center justify-center text-slate-400 hover:text-blue-500 cursor-pointer transition-colors">
                        {uploadingImage ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <ImageIcon className="w-5 h-5" />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full bg-[#1a3a6b] hover:bg-[#112952] disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-2 rounded-lg text-xs font-bold transition-all shadow cursor-pointer flex justify-center items-center"
                  >
                    {submittingReview ? 'Submitting Review...' : 'Submit Review'}
                  </button>
                </form>
              )
            ) : (
              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 text-center text-xs font-bold text-slate-500 mb-6 select-none">
                🔒 Please <Link href={`/login?callbackUrl=/products/${product._id}`} className="text-blue-600 hover:underline">log in</Link> to write a review.
              </div>
            )}

            {/* Reviews List feed */}
            <div className="space-y-4">
              <h4 className="font-heading text-xs font-black uppercase text-slate-400 tracking-wider select-none">
                Customer Reviews ({totalReviews})
              </h4>

              {loadingReviews ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="w-6 h-6 animate-spin text-[#1a3a6b]" />
                </div>
              ) : reviews.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-4">No reviews posted yet.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div key={rev._id} className="border-b border-slate-100 pb-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-extrabold text-slate-800">{rev.customer_name}</div>
                          <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
                            {new Date(rev.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex gap-0.5 text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-slate-200'}`}
                            />
                          ))}
                        </div>
                      </div>

                      {rev.title && (
                        <h5 className="text-xs font-black text-slate-800">"{rev.title}"</h5>
                      )}
                      {rev.comment && (
                        <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap">{rev.comment}</p>
                      )}

                      {rev.images && rev.images.length > 0 && (
                        <div className="flex gap-1.5 pt-1">
                          {rev.images.map((imgUrl, imgIndex) => (
                            <a href={imgUrl} target="_blank" rel="noopener noreferrer" key={imgIndex}>
                              <img
                                src={imgUrl}
                                alt="Customer attachment"
                                className="h-12 w-12 object-cover rounded-lg border border-slate-100 hover:opacity-85 transition-opacity"
                              />
                            </a>
                          ))}
                        </div>
                      )}

                      {rev.admin_reply && (
                        <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl mt-2 space-y-1">
                          <div className="text-[9px] font-black uppercase text-blue-600 tracking-wider">
                            Response from Olinbuy
                          </div>
                          <p className="text-xs text-slate-600 italic">"{rev.admin_reply.text}"</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-[#0a1828] text-slate-400 mt-16 border-t border-[#c9a84c]/20 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
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

          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase text-white tracking-widest border-b border-[#c9a84c]/40 pb-1.5 w-fit">
              Customer Care
            </h4>
            <ul className="text-xs space-y-2 select-none">
              <li><Link href="/policy?tab=faq" className="hover:text-white transition-colors">How to Order</Link></li>
              <li><Link href="/policy?tab=shipping" className="hover:text-white transition-colors">Delivery Info</Link></li>
              <li><Link href="/policy?tab=return" className="hover:text-white transition-colors">Return Policy</Link></li>
              <li><Link href="/policy?tab=shipping" className="hover:text-white transition-colors">Track Order</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase text-white tracking-widest border-b border-[#c9a84c]/40 pb-1.5 w-fit">
              Our Policies
            </h4>
            <ul className="text-xs space-y-2 select-none">
              <li><Link href="/policy?tab=privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/policy?tab=terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/policy?tab=wholesale" className="hover:text-white transition-colors">Wholesale Policy</Link></li>
            </ul>
          </div>

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

        <div className="bg-[#0f1921] py-4 border-t border-slate-900/60 text-center text-[10px] md:text-xs text-slate-600 select-none">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
            <span>© 2026 Olinbuy — All rights reserved.</span>
            <span>Made in Mohali, Punjab, India 🇮🇳</span>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Full Image Lightbox Overlay */}
      {isLightboxOpen && activeImage && (
        <div 
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out] select-none cursor-pointer"
        >
          {/* Close button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 cursor-pointer transition-all hover:scale-105 z-10"
            aria-label="Close Fullscreen View"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image Container */}
          <div className="relative w-full max-w-4xl h-[70vh] flex items-center justify-center pointer-events-none">
            <img
              src={activeImage}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Thumbnail strip in Fullscreen view */}
          {allImages.length > 1 && (
            <div className="absolute bottom-6 flex gap-2 overflow-x-auto no-scrollbar max-w-[90vw] py-2 bg-black/40 px-4 rounded-xl border border-white/10">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImage(img);
                  }}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                    activeImage === img ? 'border-blue-500 scale-95' : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <img src={img} alt={`Fullscreen thumbnail ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
