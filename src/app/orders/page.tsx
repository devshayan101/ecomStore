'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Eye, ShoppingBag, Calendar, CreditCard, ChevronRight } from 'lucide-react';
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
  total_amount: number;
  payment_status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  shipping_status: 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  payment_method: 'STRIPE' | 'COD';
  created_at: string;
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/orders');
    }
  }, [status, router]);

  // Load orders from backend
  useEffect(() => {
    if (status !== 'authenticated' || !session?.user) return;

    const token = (session.user as any).accessToken;
    if (!token) return;

    fetch(`${API_BASE}/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch orders history');
        return res.json();
      })
      .then((data) => {
        setOrders(data.items || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load your orders history. Please try again.');
        setLoading(false);
      });
  }, [status, session]);

  // Format date helper
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Status badge style helper
  const getStatusBadge = (type: 'payment' | 'shipping', status: string) => {
    const base = "text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full w-fit select-none";
    let classes = "";
    if (type === 'payment') {
      switch (status) {
        case 'PAID':
          classes = `${base} bg-emerald-50 text-emerald-700 border border-emerald-200/50`;
          break;
        case 'PENDING':
          classes = `${base} bg-amber-50 text-amber-700 border border-amber-200/50`;
          break;
        case 'FAILED':
          classes = `${base} bg-rose-50 text-rose-700 border border-rose-200/50`;
          break;
        case 'REFUNDED':
          classes = `${base} bg-purple-50 text-purple-700 border border-purple-200/50`;
          break;
        default:
          classes = `${base} bg-slate-50 text-slate-600`;
      }
    } else {
      switch (status) {
        case 'DELIVERED':
          classes = `${base} bg-emerald-50 text-emerald-700 border border-emerald-200/50`;
          break;
        case 'SHIPPED':
          classes = `${base} bg-blue-50 text-blue-700 border border-blue-200/50`;
          break;
        case 'PENDING':
          classes = `${base} bg-slate-100 text-slate-600 border border-slate-200/50`;
          break;
        case 'CANCELLED':
          classes = `${base} bg-rose-50 text-rose-700 border border-rose-200/50`;
          break;
        default:
          classes = `${base} bg-slate-50 text-slate-600`;
      }
    }
    return <span className={classes}>{status}</span>;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center">
        <div className="text-center space-y-2 select-none">
          <Loader2 className="w-8 h-8 animate-spin text-[#1a3a6b] mx-auto" />
          <p className="text-xs text-slate-400 font-bold">Loading order history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f4] py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Link */}
        <div className="flex justify-between items-center select-none">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#1a3a6b] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
          <Link
            href="/profile"
            className="text-xs font-black text-[#1a3a6b] hover:text-[#c9a84c] transition-colors"
          >
            My Profile Settings
          </Link>
        </div>

        <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight select-none">
          Order History
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3.5 text-xs font-bold select-none">
            ❌ {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm select-none">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-heading text-base font-bold text-slate-700">No orders placed yet</h3>
            <p className="text-xs text-slate-400 mt-1 mb-6">Looks like you haven't bought anything from us yet.</p>
            <Link
              href="/"
              className="bg-[#1a3a6b] hover:bg-[#112952] text-white px-6 py-2.5 rounded-lg text-xs font-black tracking-wider transition-colors shadow"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-400 font-bold select-none">
                    <th className="p-4 uppercase tracking-wider">Order ID</th>
                    <th className="p-4 uppercase tracking-wider">Date</th>
                    <th className="p-4 uppercase tracking-wider">Items Qty</th>
                    <th className="p-4 uppercase tracking-wider">Total</th>
                    <th className="p-4 uppercase tracking-wider">Payment</th>
                    <th className="p-4 uppercase tracking-wider">Shipping</th>
                    <th className="p-4 uppercase tracking-wider text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {orders.map((order) => {
                    const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);
                    return (
                      <tr key={order._id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="p-4 font-mono font-bold text-slate-800 text-[11px] truncate max-w-[120px]">
                          #{order._id}
                        </td>
                        <td className="p-4 select-none">
                          <span className="flex items-center gap-1.5 text-slate-500">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(order.created_at)}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500 font-bold select-none">
                          {totalQty} {totalQty === 1 ? 'item' : 'items'}
                        </td>
                        <td className="p-4 font-bold text-slate-900 select-none">
                          ₹{order.total_amount.toLocaleString('en-IN')}
                        </td>
                        <td className="p-4">
                          {getStatusBadge('payment', order.payment_status)}
                        </td>
                        <td className="p-4">
                          {getStatusBadge('shipping', order.shipping_status)}
                        </td>
                        <td className="p-4 text-center">
                          <Link
                            href={`/orders/${order._id}`}
                            className="inline-flex items-center gap-1 bg-slate-100 hover:bg-[#1a3a6b] hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-black transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            Track
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile List View */}
            <div className="md:hidden space-y-3">
              {orders.map((order) => {
                const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);
                return (
                  <Link
                    href={`/orders/${order._id}`}
                    key={order._id}
                    className="block bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:border-[#1a3a6b] transition-all"
                  >
                    <div className="flex justify-between items-start mb-3 select-none">
                      <div>
                        <span className="font-mono text-xs font-black text-slate-800">#{order._id.slice(-8)}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{formatDate(order.created_at)}</span>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        {getStatusBadge('shipping', order.shipping_status)}
                      </div>
                    </div>

                    <div className="flex justify-between items-center select-none pt-2.5 border-t border-slate-100">
                      <div className="text-[11px] text-slate-500 font-bold">
                        <span>{totalQty} {totalQty === 1 ? 'item' : 'items'}</span>
                        <span className="mx-1.5">·</span>
                        <span>₹{order.total_amount.toLocaleString('en-IN')}</span>
                      </div>
                      <span className="text-[10px] font-black text-[#1a3a6b] flex items-center gap-0.5">
                        Track Details
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
