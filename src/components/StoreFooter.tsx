'use client';

import React from 'react';
import Link from 'next/link';
import { Globe, Share2 } from 'lucide-react';

export default function StoreFooter() {
  return (
    <footer className="bg-[#0b1329] text-gray-300 w-full py-10 sm:py-14 px-4 sm:px-6 border-t border-slate-800/80">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {/* Brand Column */}
        <div className="flex flex-col gap-3">
          <Link href="/" className="inline-block shrink-0">
            <img 
              src="/logo-dark-theme.png" 
              alt="Olinbuy" 
              className="h-8 sm:h-9 w-auto object-contain drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)]" 
            />
          </Link>
          <p className="text-gray-400 text-xs leading-relaxed">
            India's premier online destination for fashion apparel, skincare, cosmetics, and lifestyle aesthetics.
          </p>
          <div className="flex gap-2.5 mt-1">
            <button
              aria-label="Global"
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
            >
              <Globe className="w-4 h-4 text-gray-300" />
            </button>
            <button
              aria-label="Share"
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-gray-300" />
            </button>
          </div>
        </div>

        {/* Links Column 1 */}
        <div className="flex flex-col gap-2.5 text-xs">
          <h5 className="text-white font-bold text-sm mb-1">Get to Know Us</h5>
          <Link href="/policy?tab=terms" className="text-gray-400 hover:text-amber-400 transition-colors">
            About Olinbuy
          </Link>
          <Link href="/policy?tab=terms" className="text-gray-400 hover:text-amber-400 transition-colors">
            Terms & Conditions
          </Link>
          <Link href="/policy?tab=faq" className="text-gray-400 hover:text-amber-400 transition-colors">
            Help & FAQ
          </Link>
        </div>

        {/* Links Column 2 */}
        <div className="flex flex-col gap-2.5 text-xs">
          <h5 className="text-white font-bold text-sm mb-1">Make Money with Us</h5>
          <Link href="/policy?tab=wholesale" className="text-gray-400 hover:text-amber-400 transition-colors font-medium">
            ✦ Wholesale Program
          </Link>
          <Link href="/policy?tab=wholesale" className="text-gray-400 hover:text-amber-400 transition-colors">
            Reseller Network
          </Link>
          <Link href="/policy?tab=wholesale" className="text-gray-400 hover:text-amber-400 transition-colors">
            Boutique & Bulk Orders
          </Link>
        </div>

        {/* Links Column 3 */}
        <div className="flex flex-col gap-2.5 text-xs">
          <h5 className="text-white font-bold text-sm mb-1">Let Us Help You</h5>
          <Link href="/profile" className="text-gray-400 hover:text-amber-400 transition-colors">
            Account Settings & Orders
          </Link>
          <Link href="/policy?tab=shipping" className="text-gray-400 hover:text-amber-400 transition-colors">
            Shipping & Delivery Policy
          </Link>
          <Link href="/policy?tab=return" className="text-gray-400 hover:text-amber-400 transition-colors">
            Return & Refund Policy
          </Link>
          <Link href="/policy?tab=payment" className="text-gray-400 hover:text-amber-400 transition-colors">
            Payment Methods & COD
          </Link>
          <Link href="/policy?tab=privacy" className="text-gray-400 hover:text-amber-400 transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>

      {/* Sub Footer */}
      <div className="mt-10 pt-6 border-t border-white/10 max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-gray-400 text-[11px]">
        <span>© {new Date().getFullYear()} Olinbuy. All rights reserved.</span>
        <div className="flex gap-4">
          <Link href="/policy?tab=terms" className="hover:text-white transition-colors">
            Conditions of Use
          </Link>
          <Link href="/policy?tab=privacy" className="hover:text-white transition-colors">
            Privacy Notice
          </Link>
          <Link href="/policy?tab=return" className="hover:text-white transition-colors">
            Return Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
