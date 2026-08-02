'use client';

import React, { useState } from 'react';
import { Star, Image as ImageIcon, CheckCircle, Loader2, MessageSquarePlus, CornerDownRight } from 'lucide-react';
import { Review, createProductReview, getReviewImageUploadUrl } from '@/lib/api';

interface ProductReviewsSectionProps {
  productId: string;
  reviews: Review[];
  avgRating: number;
  totalReviews: number;
  breakdown: number[]; // 5 items for 1 to 5 stars count
  token?: string;
  onReviewAdded: (newReview: Review) => void;
}

export default function ProductReviewsSection({
  productId,
  reviews,
  avgRating,
  totalReviews,
  breakdown,
  token,
  onReviewAdded,
}: ProductReviewsSectionProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setUploadingImage(true);
    try {
      const { uploadUrl, objectUrl } = await getReviewImageUploadUrl(file.type, token);
      const res = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!res.ok) throw new Error('Failed to upload image');
      setImageUrls((prev) => [...prev, objectUrl]);
    } catch (err) {
      console.error(err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const newReview = await createProductReview(
        productId,
        { rating, title, comment, images: imageUrls },
        token
      );
      setSubmitSuccess(true);
      if (newReview.status === 'approved') {
        onReviewAdded(newReview);
      }
      setTitle('');
      setComment('');
      setImageUrls([]);
      setTimeout(() => {
        setShowReviewForm(false);
        setSubmitSuccess(false);
      }, 2000);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mb-14 grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Rating Bar Chart Summary (4 Cols) */}
      <div className="lg:col-span-4">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-[#1a1c1d] font-heading">
          Customer Reviews
        </h2>
        <div className="bg-white p-6 rounded-xl flex flex-col items-center text-center border border-[#e2e2e3] shadow-sm">
          <div className="text-[56px] font-extrabold text-[#a04100] leading-none font-heading">
            {avgRating > 0 ? avgRating.toFixed(1) : '5.0'}
          </div>
          <div className="flex text-[#FFA41C] my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(avgRating || 5)
                    ? 'fill-[#FFA41C] text-[#FFA41C]'
                    : 'text-slate-300'
                }`}
              />
            ))}
          </div>
          <div className="text-xs font-medium text-slate-500 mb-6">
            Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </div>

          {/* Rating Breakdown Bars */}
          <div className="w-full flex flex-col gap-2.5">
            {[5, 4, 3, 2, 1].map((starIndex) => {
              const count = breakdown[starIndex - 1] || 0;
              const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
              return (
                <div key={starIndex} className="flex items-center gap-3 text-xs">
                  <span className="w-3 text-slate-700 font-bold">{starIndex}</span>
                  <div className="flex-1 h-2 bg-[#f5f6f7] rounded-full overflow-hidden border border-[#e2e2e3]">
                    <div
                      className="h-full bg-[#FFA41C] transition-all duration-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-slate-500 font-medium">{pct}%</span>
                </div>
              );
            })}
          </div>

          {token && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="mt-6 w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquarePlus className="w-4 h-4" />
              {showReviewForm ? 'Cancel Review' : 'Write a Review'}
            </button>
          )}
        </div>
      </div>

      {/* Reviews List & Submission Form (8 Cols) */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        {showReviewForm && (
          <div className="bg-white p-5 rounded-xl border border-[#ff6b00] shadow-sm animate-in fade-in duration-200">
            <h3 className="text-base font-bold text-slate-900 mb-3">Submit Your Review</h3>

            {submitSuccess ? (
              <div className="flex items-center gap-2 text-green-700 bg-green-50 p-4 rounded-lg border border-green-200 text-sm font-semibold">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                Thank you! Your review has been submitted successfully.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rating</label>
                  <div className="flex text-[#FFA41C] gap-1 cursor-pointer">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className={`w-6 h-6 transition-transform hover:scale-110 ${
                          star <= (hoverRating || rating)
                            ? 'fill-[#FFA41C] text-[#FFA41C]'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Headline / Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Summary of your experience..."
                    className="w-full px-3 py-2 border border-[#e2e2e3] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#ff6b00]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Review Comment</label>
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What did you like or dislike?"
                    className="w-full px-3 py-2 border border-[#e2e2e3] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#ff6b00]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Attach Photos (Optional)</label>
                  <div className="flex items-center gap-3 flex-wrap">
                    {imageUrls.map((url, idx) => (
                      <div key={idx} className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200">
                        <img src={url} alt="Review attachment" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <label className="w-12 h-12 rounded-lg border-2 border-dashed border-slate-300 hover:border-[#ff6b00] flex items-center justify-center cursor-pointer transition-colors">
                      {uploadingImage ? (
                        <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-slate-400" />
                      )}
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                    </label>
                  </div>
                </div>

                {submitError && <p className="text-xs text-red-600">{submitError}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-[#FFA41C] hover:bg-[#FFB542] text-black font-bold text-sm rounded-lg transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Post Review'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* List of Reviews */}
        {reviews.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-[#e2e2e3] text-center text-slate-500 text-sm shadow-sm">
            No reviews yet. Be the first to share your experience with this product!
          </div>
        ) : (
          reviews.map((rev) => {
            const initials = rev.customer_name
              ? rev.customer_name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)
              : 'U';
            return (
              <div
                key={rev._id}
                className="bg-white p-5 rounded-xl border border-[#e2e2e3] shadow-sm flex flex-col gap-3"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#ebecee] flex items-center justify-center font-bold text-[#a04100] text-sm shrink-0">
                      {initials}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#1a1c1d]">
                        {rev.customer_name || 'Verified Customer'}
                      </div>
                      <div className="flex text-[#FFA41C] -ml-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= rev.rating
                                ? 'fill-[#FFA41C] text-[#FFA41C]'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(rev.created_at || Date.now()).toLocaleDateString()}
                  </span>
                </div>

                {rev.title && <h4 className="font-bold text-sm text-[#1a1c1d]">{rev.title}</h4>}
                <p className="text-sm text-slate-600 leading-relaxed">{rev.comment}</p>

                {rev.images && rev.images.length > 0 && (
                  <div className="flex gap-2 mt-1">
                    {rev.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="Customer review photo"
                        className="w-16 h-16 rounded-lg object-cover border border-slate-200"
                      />
                    ))}
                  </div>
                )}

                {rev.admin_reply && (
                  <div className="mt-2 p-3 bg-slate-50 rounded-lg border-l-4 border-[#ff6b00] text-xs text-slate-700 flex gap-2">
                    <CornerDownRight className="w-4 h-4 text-[#ff6b00] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block mb-0.5">
                        Store Manager Reply
                      </span>
                      {rev.admin_reply.text}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
