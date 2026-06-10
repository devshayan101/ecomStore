'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { X, Star, ShoppingCart, Image as ImageIcon, CheckCircle, Loader2, Sparkles, Package } from 'lucide-react';
import {
  Product,
  Review,
  fetchProductReviews,
  createProductReview,
  getReviewImageUploadUrl
} from '@/lib/api';

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductDetailsModal({
  product,
  isOpen,
  onClose,
  onAddToCart
}: ProductDetailsModalProps) {
  const { data: session } = useSession();
  const token = (session?.user as any)?.accessToken;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

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

  // Load reviews when product opens
  useEffect(() => {
    if (!product || !isOpen) return;

    setLoadingReviews(true);
    setSubmitSuccess(false);
    setSubmitError(null);
    setTitle('');
    setComment('');
    setImageUrls([]);
    setRating(5);

    fetchProductReviews(product._id)
      .then((data) => {
        setReviews(data);
        setLoadingReviews(false);
      })
      .catch((err) => {
        console.error('Error loading reviews:', err);
        setLoadingReviews(false);
      });
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const variant = product.variants[0];
  const price = variant?.price || 0;
  const mrp = variant?.attributes?.mrp || price;
  const imageUrl = product.images?.[0] || variant?.image || null;
  const discount = mrp > price ? Math.round((1 - price / mrp) * 100) : 0;

  // Calculate review aggregation locally
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? Math.round((reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews) * 10) / 10
    : 0;

  // Breakdown calculation
  const breakdown = [0, 0, 0, 0, 0]; // 1 to 5 stars
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
      // 1. Get presigned upload URL
      const { uploadUrl, objectUrl } = await getReviewImageUploadUrl(file.type, token);

      // 2. Upload file to presigned URL
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

      // 3. Add to uploaded image URLs
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
      // If approved (auto-published), prepend to local state.
      if (newReview.status === 'approved') {
        setReviews((prev) => [newReview, ...prev]);
      }
      
      // Reset form
      setTitle('');
      setComment('');
      setImageUrls([]);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row border border-slate-100 animate-[fadeIn_0.2s_ease-out]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-full p-2 cursor-pointer transition-colors shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Side */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col bg-gradient-to-b from-slate-50 to-white md:border-r border-slate-100">
          <div className="aspect-square bg-white rounded-2xl flex items-center justify-center border border-slate-200/60 shadow-inner relative mb-6 overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
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

          <div className="space-y-4">
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
            </div>

            <div className="text-xs text-slate-500 leading-relaxed space-y-2">
              <p className="font-extrabold text-slate-700 uppercase tracking-widest text-[9px]">Description</p>
              <p className="bg-white/80 p-3 rounded-lg border border-slate-200/50">{product.description || 'No description available for this product.'}</p>
            </div>

            <button
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white py-3.5 rounded-xl text-sm font-bold tracking-wider transition-all duration-200 shadow-md cursor-pointer active:scale-[0.98] select-none"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        </div>

        {/* Reviews Side */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col max-h-[85vh] overflow-y-auto">
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
                      className={`w-3.5 h-3.5 ${
                        i < Math.round(avgRating) ? 'fill-current' : 'text-slate-200'
                      }`}
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

                {/* Rating selection stars */}
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
                            className={`w-6 h-6 ${
                              active ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                            }`}
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

                {/* Images Attachment */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider select-none">Attach Photos</span>
                  <div className="flex flex-wrap gap-2 items-center">
                    {imageUrls.map((url, index) => (
                      <div className="relative h-12 w-12 border border-slate-200 rounded-lg overflow-hidden" key={index}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
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
              🔒 Please <a href="/login" className="text-blue-600 hover:underline">log in</a> to write a review.
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
                            className={`w-3 h-3 ${
                              i < rev.rating ? 'fill-current' : 'text-slate-200'
                            }`}
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

                    {/* Attached photos */}
                    {rev.images && rev.images.length > 0 && (
                      <div className="flex gap-1.5 pt-1">
                        {rev.images.map((imgUrl, imgIndex) => (
                          <a href={imgUrl} target="_blank" rel="noopener noreferrer" key={imgIndex}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imgUrl}
                              alt="Customer attachment"
                              className="h-12 w-12 object-cover rounded-lg border border-slate-100 hover:opacity-85 transition-opacity"
                            />
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Admin Response/Reply */}
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
    </div>
  );
}
