const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/storefront';

export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface Variant {
  _id: string;
  sku: string;
  price: number;
  image?: string;
  attributes: Record<string, any>;
}

export interface ProductKeyValue {
  key: string;
  value: string;
}

export interface ProductFaq {
  question: string;
  answer: string;
}

export interface ProductDisplayConfig {
  top_highlights?: boolean;
  about_this_item?: boolean;
  additional_information?: boolean;
  style_details?: boolean;
  features_specs?: boolean;
  faqs?: boolean;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category_id: string;
  tags: string[];
  images: string[];
  status: 'active' | 'draft' | 'archived';
  variants: Variant[];
  tax_slabs?: Array<{ region: string; rate: number }>;
  rating_average?: number;
  rating_count?: number;
  top_highlights?: ProductKeyValue[];
  about_this_item?: string[];
  additional_information?: ProductKeyValue[];
  style_details?: ProductKeyValue[];
  features_specs?: ProductKeyValue[];
  faqs?: ProductFaq[];
  display_configs?: ProductDisplayConfig;
  variation_categories?: string[];
  created_at: string;
  updated_at: string;
}

export interface PaginatedResult<T> {
  items: T[];
  nextCursor?: string;
  hasMore: boolean;
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }
  const data = await res.json();
  return data.items || [];
}

export async function fetchProducts(params?: Record<string, string>): Promise<PaginatedResult<Product>> {
  const url = new URL(`${API_BASE}/products`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
    });
  }
  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return res.json();
}

export async function fetchProductById(id: string): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('Product not found');
    }
    throw new Error('Failed to fetch product details');
  }
  return res.json();
}

export interface CheckoutPayload {
  customer: {
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      postcode: string;
      country: string;
    };
  };
  billing_address?: {
    recipient_name?: string;
    street: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  items: Array<{
    variant_id: string;
    sku: string;
    price_at_purchase: number;
    quantity: number;
  }>;
  payment_method: 'STRIPE' | 'RAZORPAY' | 'COD';
  shipping_cost?: number;
  shipping_rate_name?: string;
  coupon_code?: string;
}

export async function checkout(payload: CheckoutPayload, token?: string): Promise<any> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}/checkout`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Checkout failed');
  }

  return res.json();
}

export async function verifyRazorpayPayment(
  orderId: string,
  razorpayPaymentId: string,
  razorpayOrderId: string,
  razorpaySignature: string
): Promise<any> {
  const res = await fetch(`${API_BASE}/verify-razorpay`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      order_id: orderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_order_id: razorpayOrderId,
      razorpay_signature: razorpaySignature,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Razorpay payment verification failed');
  }

  return res.json();
}

export interface TaxRule {
  _id?: string;
  country: string;
  countryCode: string;
  state: string;
  stateCode: string;
  rate: number;
  name: string;
  active: boolean;
}

export interface GstVatSettings {
  enabled: boolean;
  inclusive: boolean;
}

export interface StateConfig {
  name: string;
  code: string;
}

export interface CountryConfig {
  _id?: string;
  name: string;
  code: string;
  states: StateConfig[];
}

export interface TaxSettings {
  taxRules: TaxRule[];
  gstVatSettings: GstVatSettings;
  countriesConfig?: CountryConfig[];
}

export interface StorefrontSettings {
  taxes?: TaxSettings;
  general?: {
    currency: string;
  };
  content?: {
    heroSlides: any[];
    promotionCards: any[];
    productVideos?: any[];
  };
}

export async function fetchStorefrontSettings(): Promise<StorefrontSettings> {
  const res = await fetch(`${API_BASE}/settings`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch storefront settings');
  }
  return res.json();
}

export interface ShippingRateOption {
  id: string;
  name: string;
  price: number;
  type: string;
  carrier?: string;
  estimatedDays?: number;
  deliveryTime?: string;
}

export async function fetchShippingRates(payload: {
  destCountry: string;
  destState: string;
  destPostcode: string;
  totalWeight: number;
  subtotal: number;
}): Promise<ShippingRateOption[]> {
  const res = await fetch(`${API_BASE}/shipping-rates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ country: payload.destCountry, state: payload.destState, subtotal: payload.subtotal }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to fetch shipping rates');
  }
  const data = await res.json();
  return data.rates || [];
}

export interface ValidatedCouponResponse {
  code: string;
  discount_type: 'PERCENTAGE' | 'FIXED';
  discount_value: number;
  discount_amount: number;
  min_order_amount: number;
}

export async function validateCouponApi(code: string, cart_subtotal: number): Promise<ValidatedCouponResponse> {
  const res = await fetch(`${API_BASE}/coupons/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, cart_subtotal }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Invalid or expired coupon');
  }
  return res.json();
}


// --- Storefront Reviews API ---

export interface Review {
  _id: string;
  product_id: string;
  customer_id: string;
  customer_name: string;
  rating: number;
  title?: string;
  comment?: string;
  images: string[];
  status: 'pending' | 'approved' | 'rejected';
  admin_reply?: {
    text: string;
    replied_at: string;
    replied_by: string;
  };
  created_at: string;
  updated_at: string;
}

export async function fetchProductReviews(productId: string): Promise<Review[]> {
  const res = await fetch(`${API_BASE}/products/${productId}/reviews`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch product reviews');
  }
  return res.json();
}

export async function createProductReview(
  productId: string,
  data: { rating: number; title?: string; comment?: string; images?: string[] },
  token: string
): Promise<Review> {
  const res = await fetch(`${API_BASE}/products/${productId}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to submit review');
  }
  return res.json();
}

export async function getReviewImageUploadUrl(
  contentType: string,
  token: string
): Promise<{ uploadUrl: string; objectUrl: string }> {
  const res = await fetch(`${API_BASE}/products/reviews/upload-url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ content_type: contentType })
  });
  if (!res.ok) {
    throw new Error('Failed to generate upload URL');
  }
  return res.json();
}

export async function fetchWishlist(token: string): Promise<{ productIds: string[]; products: Product[] }> {
  const res = await fetch(`${API_BASE}/wishlist`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) {
    throw new Error('Failed to fetch wishlist');
  }
  return res.json();
}

export async function toggleWishlistApi(productId: string, token: string): Promise<{ productIds: string[] }> {
  const res = await fetch(`${API_BASE}/wishlist/toggle`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ productId })
  });
  if (!res.ok) {
    throw new Error('Failed to toggle wishlist item');
  }
  return res.json();
}

export async function syncWishlistApi(productIds: string[], token: string): Promise<{ productIds: string[] }> {
  const res = await fetch(`${API_BASE}/wishlist/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ productIds })
  });
  if (!res.ok) {
    throw new Error('Failed to sync wishlist');
  }
  return res.json();
}

export async function deleteWishlistApi(productId: string, token: string): Promise<{ productIds: string[] }> {
  const res = await fetch(`${API_BASE}/wishlist/${productId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) {
    throw new Error('Failed to remove wishlist item');
  }
  return res.json();
}
