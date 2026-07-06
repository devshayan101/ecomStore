'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Package, Clock, CheckCircle, ShieldAlert, CreditCard, Truck, User } from 'lucide-react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/storefront';

interface OrderItem {
  variant_id: string;
  sku: string;
  price_at_purchase: number;
  quantity: number;
  _id: string;
}

interface Order {
  _id: string;
  customer_id: string;
  items: OrderItem[];
  shipping_address: {
    recipient_name: string;
    street: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  total_amount: number;
  payment_status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  shipping_status: 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  payment_method: 'STRIPE' | 'COD';
  created_at: string;
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/orders/' + id);
    }
  }, [status, id, router]);

  // Load order details
  useEffect(() => {
    if (status !== 'authenticated' || !session?.user || !id) return;

    const token = (session.user as any).accessToken;
    if (!token) return;

    fetch(`${API_BASE}/orders/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 403) {
            throw new Error('Access Denied: You do not own this order');
          }
          throw new Error('Failed to fetch order details');
        }
        return res.json();
      })
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || 'Failed to load order tracking details.');
        setLoading(false);
      });
  }, [status, session, id]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center">
        <div className="text-center space-y-2 select-none">
          <Loader2 className="w-8 h-8 animate-spin text-[#1a3a6b] mx-auto" />
          <p className="text-xs text-slate-400 font-bold">Loading tracking information...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#f4f4f4] py-8 px-4 md:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-6 text-center select-none shadow-sm">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h3 className="font-heading text-base font-bold text-slate-800">Error Loading Order</h3>
          <p className="text-xs text-slate-400 mt-1 mb-6">{error || 'Order details not found.'}</p>
          <Link
            href="/orders"
            className="bg-[#1a3a6b] hover:bg-[#112952] text-white px-6 py-2.5 rounded-lg text-xs font-black tracking-wider transition-colors shadow"
          >
            Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  // Calculate stepper state
  const isPaid = order.payment_status === 'PAID';
  const isShipped = order.shipping_status === 'SHIPPED' || order.shipping_status === 'DELIVERED';
  const isDelivered = order.shipping_status === 'DELIVERED';
  const isCancelled = order.shipping_status === 'CANCELLED';

  const steps = [
    { label: 'Order Placed', active: true, desc: 'Your order has been recorded' },
    { label: 'Payment Clear', active: isPaid || isShipped || isDelivered, desc: order.payment_status === 'PENDING' ? 'Awaiting payment confirmation' : 'Payment approved successfully' },
    { label: 'Shipped', active: isShipped || isDelivered, desc: isShipped ? 'Package in transit' : 'Awaiting dispatch' },
    { label: 'Delivered', active: isDelivered, desc: isDelivered ? 'Delivered to recipient' : 'Arrival at destination' }
  ];

  return (
    <div className="min-h-screen bg-[#f4f4f4] py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Link */}
        <div className="flex justify-between items-center select-none">
          <Link
            href="/orders"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#1a3a6b] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
          <span className="text-[10px] font-mono font-bold text-slate-400">Order ID: #{order._id}</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-8 shadow-sm space-y-8">
          {/* Header Stats */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 select-none border-b border-slate-100 pb-5">
            <div>
              <h2 className="font-heading text-lg font-black text-slate-800">Track Your Package</h2>
              <p className="text-xs text-slate-400 mt-0.5">Placed on {new Date(order.created_at).toLocaleString('en-IN')}</p>
            </div>
            <div className="flex gap-2">
              <span className={`text-[10px] font-black tracking-wider uppercase px-3 py-1 rounded-full border ${
                order.payment_status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                💰 Payment: {order.payment_status}
              </span>
              <span className={`text-[10px] font-black tracking-wider uppercase px-3 py-1 rounded-full border ${
                isCancelled ? 'bg-rose-50 text-rose-700 border-rose-200' : isDelivered ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                🚚 Shipping: {order.shipping_status}
              </span>
            </div>
          </div>

          {/* Canceled Banner */}
          {isCancelled ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center gap-3.5 select-none text-rose-700">
              <ShieldAlert className="w-8 h-8 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-black">Order Cancelled</h4>
                <p className="text-xs mt-0.5 text-rose-600/90">This order has been cancelled and cannot be processed further. If payment was made, refunds are processed within 5-7 business days.</p>
              </div>
            </div>
          ) : (
            /* Tracking Stepper */
            <div className="py-2">
              {/* Desktop Stepper */}
              <div className="hidden md:flex justify-between items-center relative select-none">
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-100 -z-0" />
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 -z-0 transition-all duration-500" style={{
                  width: isDelivered ? '100%' : isShipped ? '66.66%' : isPaid ? '33.33%' : '0%'
                }} />

                {steps.map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center w-40 relative z-10">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                      step.active
                        ? 'bg-gradient-to-br from-[#1a3a6b] to-[#1e4d9e] border-[#c9a84c] text-white shadow-md'
                        : 'bg-white border-slate-200 text-slate-300'
                    }`}>
                      {step.active && (isDelivered || (idx === 0) || (idx === 1 && isPaid) || (idx === 2 && isShipped)) ? (
                        <CheckCircle className="w-4 h-4 fill-current text-[#c9a84c]" />
                      ) : (
                        <Package className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <span className={`text-[11px] font-black mt-2.5 ${step.active ? 'text-slate-800' : 'text-slate-400'}`}>
                      {step.label}
                    </span>
                    <span className="text-[9px] text-slate-400 mt-0.5 select-none leading-tight">{step.desc}</span>
                  </div>
                ))}
              </div>

              {/* Mobile Stepper (Vertical) */}
              <div className="md:hidden space-y-6 relative pl-6 select-none border-l-2 border-slate-100">
                {steps.map((step, idx) => (
                  <div key={idx} className="relative">
                    {/* Line highlight */}
                    <div className={`absolute -left-[30px] top-1.5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                      step.active ? 'bg-[#1a3a6b] border-[#c9a84c] text-white' : 'bg-white border-slate-200 text-slate-300'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${step.active ? 'bg-[#c9a84c]' : 'bg-transparent'}`} />
                    </div>
                    <div>
                      <h4 className={`text-xs font-black ${step.active ? 'text-slate-800' : 'text-slate-400'}`}>{step.label}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Details Panels */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t border-slate-100">
            {/* Left: Items Summary */}
            <div className="md:col-span-7 space-y-4">
              <h3 className="font-heading text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5 select-none">
                <Package className="w-4 h-4" /> Ordered Items
              </h3>
              <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden bg-slate-50/50">
                {order.items.map((item) => (
                  <div key={item._id} className="flex gap-4 p-4 items-center">
                    <div className="w-12 h-12 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-2xl select-none flex-shrink-0">
                      📦
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate">
                        Product SKU: {item.sku}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-bold select-none">
                        ₹{item.price_at_purchase.toLocaleString('en-IN')} × {item.quantity}
                      </span>
                    </div>
                    <span className="text-xs font-black text-slate-700 select-none">
                      ₹{(item.price_at_purchase * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals panel */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 select-none text-xs space-y-2 text-slate-600 font-bold">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span>₹{order.total_amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Shipping</span>
                  <span className="text-emerald-600">FREE</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200 pt-2.5 mt-1.5 font-heading text-sm font-black text-slate-900">
                  <span>Total Amount Paid</span>
                  <span>₹{order.total_amount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Right: Address & Payment Details */}
            <div className="md:col-span-5 space-y-6">
              {/* Delivery Address info */}
              <div className="space-y-3">
                <h3 className="font-heading text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5 select-none">
                  <User className="w-4 h-4" /> Shipping Address
                </h3>
                <div className="border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-1">
                  <p className="font-bold text-slate-800">{order.shipping_address.recipient_name}</p>
                  <p>{order.shipping_address.street}</p>
                  <p>{order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.postcode}</p>
                  <p>{order.shipping_address.country}</p>
                </div>
              </div>

              {/* Payment Details info */}
              <div className="space-y-3">
                <h3 className="font-heading text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5 select-none">
                  <CreditCard className="w-4 h-4" /> Payment Details
                </h3>
                <div className="border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-2">
                  <div className="flex justify-between">
                    <span>Payment Method</span>
                    <span className="font-bold text-slate-800">{order.payment_method === 'STRIPE' ? 'Credit/Debit Card (Stripe)' : 'Cash on Delivery (COD)'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span className={`font-black uppercase text-[10px] ${
                      order.payment_status === 'PAID' ? 'text-emerald-600' : 'text-amber-600'
                    }`}>{order.payment_status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
