'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, Phone, MapPin, Loader2, Save, ArrowLeft, ArrowRight, UserCheck } from 'lucide-react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/storefront';

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Profile fields state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postcode: '',
    country: 'India',
  });

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/profile');
    }
  }, [status, router]);

  // Load profile from backend
  useEffect(() => {
    if (status !== 'authenticated' || !session?.user) return;

    const token = (session.user as any).accessToken;
    if (!token) return;

    fetch(`${API_BASE}/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch profile details');
        return res.json();
      })
      .then((data) => {
        setName(data.name || '');
        setEmail(data.email || '');
        setPhone(data.phone || '');
        if (data.address) {
          setAddress({
            street: data.address.street || '',
            city: data.address.city || '',
            state: data.address.state || '',
            postcode: data.address.postcode || '',
            country: data.address.country || 'India',
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Could not load profile. Please refresh the page.');
        setLoading(false);
      });
  }, [status, session]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== 'authenticated' || !session?.user) return;

    const token = (session.user as any).accessToken;
    if (!token) return;

    setError(null);
    setMessage(null);
    setSaving(true);

    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, phone, address })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to update profile');
      }

      const updatedData = await res.json();

      // Update local NextAuth session
      await update({
        name: updatedData.name,
        phone: updatedData.phone,
        address: updatedData.address
      });

      setMessage('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center">
        <div className="text-center space-y-2 select-none">
          <Loader2 className="w-8 h-8 animate-spin text-[#1a3a6b] mx-auto" />
          <p className="text-xs text-slate-400 font-bold">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f4] py-8 px-4 md:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
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
            href="/orders"
            className="inline-flex items-center gap-1 text-xs font-black text-[#1a3a6b] hover:text-[#c9a84c] transition-colors"
          >
            My Orders History
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight select-none">
          My Account
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3.5 text-xs font-bold select-none">
            ❌ {error}
          </div>
        )}

        {message && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-3.5 text-xs font-bold select-none">
            ✅ {message}
          </div>
        )}

        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1 bg-gradient-to-br from-[#0f2444] to-[#1a3a6b] text-white rounded-2xl p-5 shadow-sm space-y-4 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#c9a84c]/20 border-2 border-[#c9a84c] rounded-full flex items-center justify-center text-[#c9a84c]">
              <UserCheck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-heading text-sm font-bold text-white">{name}</h3>
              <p className="text-[10px] text-white/70 font-semibold">{email}</p>
            </div>
            <div className="w-full border-t border-white/10 pt-4 text-left space-y-2 text-[10px] text-white/80 select-none">
              <p>🛍️ Authenticated Account</p>
              {phone && <p>📞 {phone}</p>}
              {address.city && <p>📍 {address.city}, {address.state}</p>}
            </div>
          </div>

          {/* Form Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Contact Details */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <h3 className="font-heading text-base font-bold text-slate-800 border-b border-slate-100 pb-2.5 mb-1 select-none flex items-center gap-2">
                <User className="w-4 h-4 text-[#1a3a6b]" />
                Personal Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-[10px] font-black uppercase text-slate-400 tracking-wider select-none">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white outline-none focus:border-[#1a3a6b] text-slate-800 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-[10px] font-black uppercase text-slate-400 tracking-wider select-none">Email (Read Only)</label>
                  <input
                    type="email"
                    id="email"
                    readOnly
                    value={email}
                    className="border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-100 outline-none text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label htmlFor="phone" className="text-[10px] font-black uppercase text-slate-400 tracking-wider select-none flex items-center gap-1">
                    <Phone className="w-3 h-3" /> WhatsApp / Mobile Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white outline-none focus:border-[#1a3a6b] text-slate-800 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <h3 className="font-heading text-base font-bold text-slate-800 border-b border-slate-100 pb-2.5 mb-1 select-none flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#1a3a6b]" />
                Saved Shipping Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label htmlFor="street" className="text-[10px] font-black uppercase text-slate-400 tracking-wider select-none">Street Address</label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={address.street}
                    onChange={handleAddressChange}
                    placeholder="e.g. Apartment, Suite, Landmark, Street"
                    className="border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white outline-none focus:border-[#1a3a6b] text-slate-800 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="city" className="text-[10px] font-black uppercase text-slate-400 tracking-wider select-none">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    placeholder="e.g. Mohali"
                    className="border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white outline-none focus:border-[#1a3a6b] text-slate-800 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="state" className="text-[10px] font-black uppercase text-slate-400 tracking-wider select-none">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    placeholder="e.g. Punjab"
                    className="border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white outline-none focus:border-[#1a3a6b] text-slate-800 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="postcode" className="text-[10px] font-black uppercase text-slate-400 tracking-wider select-none">ZIP/Postcode</label>
                  <input
                    type="text"
                    id="postcode"
                    name="postcode"
                    value={address.postcode}
                    onChange={handleAddressChange}
                    placeholder="e.g. 160071"
                    className="border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white outline-none focus:border-[#1a3a6b] text-slate-800 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="country" className="text-[10px] font-black uppercase text-slate-400 tracking-wider select-none">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={address.country}
                    readOnly
                    className="border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-100 outline-none text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Action button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#1a3a6b] hover:bg-[#112952] disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3.5 rounded-lg text-sm font-black tracking-wider transition-all duration-200 shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99] select-none"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
