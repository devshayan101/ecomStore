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
  items: Array<{
    variant_id: string;
    sku: string;
    price_at_purchase: number;
    quantity: number;
  }>;
  payment_method: 'STRIPE' | 'RAZORPAY' | 'COD';
  shipping_cost?: number;
  shipping_rate_name?: string;
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
  const res = await fetch(`${API_BASE}/shipping/rates`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Failed to fetch shipping rates');
  }
  const data = await res.json();
  return data.rates || [];
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
