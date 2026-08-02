'use client';

import React from 'react';
import Link from 'next/link';
import { Package, CreditCard, Heart, HelpCircle, ArrowRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Category } from '@/lib/api';

interface StoreFeatureGridProps {
  categories: Category[];
  onSelectCategory: (slug: string) => void;
}

const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  transporters: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzT4BxPh7BwfGEdYyVE_TGfbuIb7yuca2hE6bTu7zUg5lgTu2EqazlLhNem44ED2vfvhLE3FOLN6fqkjxYkwD_AtV_L9e0oeJl5MxcD542xiw8_S2yNro__X2U6FuBlt_X1rz3s7E8mTKIe97_LvQuBPG4KhH1W4dcu_Xgau9sfJgH7G_fss1eRlgH_WQGHs49NgDT_WXLlbSfLPR9et3PLu_FKdMwWkBgMaedtAMss-T-uyP-c5hx",
  wearables: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsTirY_e1jNQwxEIY6aktpPqvzu4qDUdVNzujEXjwOnmCzQtrJiTWgmjfwz88JWCEUEDySOJjNrhfzvewsDxg-xCHQDNmTm9NvLDPZrXWequcWFzw37K4WGQiR0ZcliZ1noC0gPXEd2z8jpS3nhOke7THNlMM5tQ44zt48g_wVNkPxR2FhK2NQfTM4pi8c_esijit6Y5F4_kWOeHQVWYP2qt_C4rAeTWTep5iC_wZhStAxcypoIogR",
  power: "https://lh3.googleusercontent.com/aida-public/AB6AXuBr6_rA76h40BVBwChWGZ8XPb95figuLUOe-FUbhq5kCeDJu7VRTVoSZU5oUIKixEucOdditbmZDqKeKYkz7V4RAniGVeQ_iKDy2GQYD4rgxGazye_93ns56B1vOWLryLoPm3Zn1JQ7M3F2MVFd2ZtK6ans_aRLsk3LVdTpaixIE-wEcQAjY1p_YNM3W1FE2bDNhwJm23SRdSpPyfYCHHblsBIDDjtbRxAbAbswtqtNPWn9BNZ4dU-c"
};

export default function StoreFeatureGrid({ categories, onSelectCategory }: StoreFeatureGridProps) {
  const { data: session } = useSession();

  // Pick up to 3 top categories, fallback to static defaults if none fetched yet
  const displayCategories = categories.length > 0 ? categories.slice(0, 3) : [
    { _id: '1', name: 'Personal Transporters', slug: 'transporters', description: '' },
    { _id: '2', name: 'Smart Wearables', slug: 'wearables', description: '' },
    { _id: '3', name: 'Power Solutions', slug: 'power', description: '' },
  ];

  return (
    <section className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 -mt-12 sm:-mt-36 lg:-mt-44 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {displayCategories.map((cat, idx) => {
        const bgImage = (cat as any).image || DEFAULT_CATEGORY_IMAGES[cat.slug] || DEFAULT_CATEGORY_IMAGES['transporters'];

        return (
          <div
            key={cat._id || idx}
            className="bg-white p-5 flex flex-col h-[340px] sm:h-[400px] shadow-sm rounded border border-gray-100 hover:shadow-md transition-shadow group"
          >
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 truncate">{cat.name}</h3>
            <div
              onClick={() => onSelectCategory(cat.slug)}
              className="flex-grow bg-cover bg-center mb-3 rounded cursor-pointer group-hover:scale-[1.01] transition-transform duration-300"
              style={{ backgroundImage: `url('${bgImage}')` }}
            />
            <button
              onClick={() => onSelectCategory(cat.slug)}
              className="text-xs sm:text-sm text-[#0058be] hover:text-[#B91C1C] hover:underline font-semibold text-left flex items-center gap-1"
            >
              Shop {cat.name} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}

      {/* Account / User Quick Links Box */}
      <div className="bg-white p-5 flex flex-col h-[340px] sm:h-[400px] shadow-sm rounded border border-gray-100 hover:shadow-md transition-shadow">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
          {session?.user ? `Welcome back, ${session.user.name?.split(' ')[0]}` : 'Welcome to Olinbuy'}
        </h3>
        <p className="text-xs text-gray-500 mb-4">Enjoy curated deals and fast shipping.</p>

        <div className="grid grid-cols-2 gap-2 flex-grow content-start">
          <Link
            href="/orders"
            className="bg-gray-50 p-2.5 rounded flex flex-col items-center justify-center hover:bg-gray-100 transition-colors text-gray-700"
          >
            <Package className="w-5 h-5 mb-1 text-[#0058be]" />
            <span className="text-[11px] font-semibold">Orders</span>
          </Link>
          <Link
            href="/profile"
            className="bg-gray-50 p-2.5 rounded flex flex-col items-center justify-center hover:bg-gray-100 transition-colors text-gray-700"
          >
            <CreditCard className="w-5 h-5 mb-1 text-[#0058be]" />
            <span className="text-[11px] font-semibold">Account</span>
          </Link>
          <Link
            href="/profile"
            className="bg-gray-50 p-2.5 rounded flex flex-col items-center justify-center hover:bg-gray-100 transition-colors text-gray-700"
          >
            <Heart className="w-5 h-5 mb-1 text-[#0058be]" />
            <span className="text-[11px] font-semibold">Wishlist</span>
          </Link>
          <Link
            href="/policy/help"
            className="bg-gray-50 p-2.5 rounded flex flex-col items-center justify-center hover:bg-gray-100 transition-colors text-gray-700"
          >
            <HelpCircle className="w-5 h-5 mb-1 text-[#0058be]" />
            <span className="text-[11px] font-semibold">Support</span>
          </Link>
        </div>

        {!session?.user && (
          <Link
            href="/login"
            className="w-full bg-[#FFD814] hover:bg-[#FFD814]/90 text-black py-2 rounded text-xs font-bold text-center mt-auto shadow-sm"
          >
            Sign in for best experience
          </Link>
        )}
      </div>
    </section>
  );
}

