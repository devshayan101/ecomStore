'use client';

import React from 'react';
import Link from 'next/link';
import { Package, CreditCard, Heart, HelpCircle, ArrowRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Category } from '@/lib/api';

export interface PromoCardItem {
  id?: string;
  tag?: string;
  title: string;
  desc?: string;
  btnText?: string;
  category?: string;
  image?: string;
  bgClass?: string;
  titleColor?: string;
  descColor?: string;
  btnTextColor?: string;
  btnBgColor?: string;
}

interface StoreFeatureGridProps {
  categories: Category[];
  promotionCards?: PromoCardItem[];
  onSelectCategory: (slug: string) => void;
}

const DEFAULT_PROMO_CARDS: PromoCardItem[] = [
  {
    id: 'promo-1',
    tag: 'UP TO 50% OFF',
    title: 'Skincare',
    category: 'skincare',
    btnText: 'Shop Skincare',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzT4BxPh7BwfGEdYyVE_TGfbuIb7yuca2hE6bTu7zUg5lgTu2EqazlLhNem44ED2vfvhLE3FOLN6fqkjxYkwD_AtV_L9e0oeJl5MxcD542xiw8_S2yNro__X2U6FuBlt_X1rz3s7E8mTKIe97_LvQuBPG4KhH1W4dcu_Xgau9sfJgH7G_fss1eRlgH_WQGHs49NgDT_WXLlbSfLPR9et3PLu_FKdMwWkBgMaedtAMss-T-uyP-c5hx',
  },
  {
    id: 'promo-2',
    tag: 'NEW COLLECTION',
    title: 'Cosmetics',
    category: 'cosmetics',
    btnText: 'Shop Cosmetics',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsTirY_e1jNQwxEIY6aktpPqvzu4qDUdVNzujEXjwOnmCzQtrJiTWgmjfwz88JWCEUEDySOJjNrhfzvewsDxg-xCHQDNmTm9NvLDPZrXWequcWFzw37K4WGQiR0ZcliZ1noC0gPXEd2z8jpS3nhOke7THNlMM5tQ44zt48g_wVNkPxR2FhK2NQfTM4pi8c_esijit6Y5F4_kWOeHQVWYP2qt_C4rAeTWTep5iC_wZhStAxcypoIogR',
  },
  {
    id: 'promo-3',
    tag: 'TRENDING STYLE',
    title: "Women's Fashion",
    category: 'women',
    btnText: "Shop Women's Fashion",
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBr6_rA76h40BVBwChWGZ8XPb95figuLUOe-FUbhq5kCeDJu7VRTVoSZU5oUIKixEucOdditbmZDqKeKYkz7V4RAniGVeQ_iKDy2GQYD4rgxGazye_93ns56B1vOWLryLoPm3Zn1JQ7M3F2MVFd2ZtK6ans_aRLsk3LVdTpaixIE-wEcQAjY1p_YNM3W1FE2bDNhwJm23SRdSpPyfYCHHblsBIDDjtbRxAbAbswtqtNPWn9BNZ4dU-c',
  },
  {
    id: 'promo-4',
    tag: 'BULK SAVINGS',
    title: 'Wholesale Program',
    category: 'wholesale',
    btnText: 'Shop Wholesale',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTXaQ56aX6NsCN63RKDG8-tYn-iVaF8MQZOcWzzHdwcHFrLHUQ968gJqJuSW2EvaA9BfrYZ0pJ1XdKTDHxevQvODhyUJi7o7-n4a4knMz1BE5FWplBQbyogVEwWuT48S46wvovDfPLn_Er7SaJ2osoQLC7xbKTp_MLwgqQwQFSL0sbfxmU74_DSOaCwQfAQkeEjIKc-9dIx8_nAQWH3CFguiV_aR401klhvYzV4r8cd-y6eNlGX85p',
  },
];

export default function StoreFeatureGrid({
  categories,
  promotionCards,
  onSelectCategory,
}: StoreFeatureGridProps) {
  const { data: session } = useSession();

  // Use all promotion cards configured in settings, or fallback to categories or defaults
  let displayPromos: PromoCardItem[] = [];

  if (promotionCards && promotionCards.length > 0) {
    displayPromos = promotionCards.slice(0, 4);
  } else if (categories && categories.length > 0) {
    displayPromos = categories.slice(0, 4).map((cat, idx) => ({
      id: cat._id,
      title: cat.name,
      category: cat.slug,
      btnText: `Shop ${cat.name}`,
      image: (cat as any).image || DEFAULT_PROMO_CARDS[idx % DEFAULT_PROMO_CARDS.length].image,
    }));
  } else {
    displayPromos = DEFAULT_PROMO_CARDS;
  }

  return (
    <section className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 -mt-12 sm:-mt-36 lg:-mt-44 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {displayPromos.map((promo, idx) => {
        const bgImage = promo.image || (promo as any).bg || DEFAULT_PROMO_CARDS[idx % DEFAULT_PROMO_CARDS.length].image;
        const targetCategory = promo.category || 'all';
        const buttonLabel = promo.btnText || (promo as any).buttonText || `Shop ${promo.title}`;

        return (
          <div
            key={promo.id || idx}
            className="bg-white p-5 flex flex-col h-[340px] sm:h-[400px] shadow-sm rounded-xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
          >
            <h3 
              className="text-base sm:text-lg font-extrabold text-gray-900 mb-3 truncate"
              style={promo.titleColor ? { color: promo.titleColor } : undefined}
            >
              {promo.title}
            </h3>
            <div
              onClick={() => onSelectCategory(targetCategory)}
              className="flex-grow bg-cover bg-center mb-3 rounded-lg cursor-pointer group-hover:scale-[1.01] transition-transform duration-300 relative overflow-hidden shadow-inner"
              style={{ backgroundImage: `url('${bgImage}')` }}
            >
              {promo.tag && (
                <span className="absolute top-2.5 left-2.5 bg-[#0058be] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow">
                  {promo.tag}
                </span>
              )}
            </div>
            <button
              onClick={() => onSelectCategory(targetCategory)}
              className="text-xs sm:text-sm text-[#0058be] hover:text-[#B91C1C] hover:underline font-bold text-left flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all w-fit cursor-pointer"
              style={{
                borderColor: promo.btnBgColor || 'transparent',
                backgroundColor: promo.btnBgColor || 'transparent',
                color: promo.btnTextColor || (promo.btnBgColor ? '#ffffff' : '#0058be'),
              }}
            >
              {buttonLabel} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </section>
  );
}
