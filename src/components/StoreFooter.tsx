'use client';

import React from 'react';
import Link from 'next/link';
import { Globe, Share2 } from 'lucide-react';

export default function StoreFooter() {
  return (
    <footer className="bg-[#131b2e] text-gray-300 w-full py-10 sm:py-14 px-4 sm:px-6 border-t border-gray-800">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {/* Brand Column */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded bg-[#FFA41C] text-black font-black flex items-center justify-center text-sm">
              O
            </div>
            <span className="text-xl font-black text-white tracking-tight">
              Olin<span className="text-[#FFD814]">buy</span>
            </span>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed">
            Defining the standards of next-generation mobility and lifestyle products through innovative online shopping.
          </p>
          <div className="flex gap-2.5 mt-1">
            <button
              aria-label="Global"
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <Globe className="w-4 h-4 text-gray-300" />
            </button>
            <button
              aria-label="Share"
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <Share2 className="w-4 h-4 text-gray-300" />
            </button>
          </div>
        </div>

        {/* Links Column 1 */}
        <div className="flex flex-col gap-2.5 text-xs">
          <h5 className="text-white font-bold text-sm mb-1">Get to Know Us</h5>
          <Link href="/policy/about" className="text-gray-400 hover:text-white hover:underline">
            About Olinbuy
          </Link>
          <Link href="/policy/careers" className="text-gray-400 hover:text-white hover:underline">
            Careers
          </Link>
          <Link href="/policy/investors" className="text-gray-400 hover:text-white hover:underline">
            Investor Relations
          </Link>
        </div>

        {/* Links Column 2 */}
        <div className="flex flex-col gap-2.5 text-xs">
          <h5 className="text-white font-bold text-sm mb-1">Make Money with Us</h5>
          <Link href="/policy/sell" className="text-gray-400 hover:text-white hover:underline">
            Sell on Olinbuy
          </Link>
          <Link href="/policy/affiliates" className="text-gray-400 hover:text-white hover:underline">
            Become an Affiliate
          </Link>
          <Link href="/policy/advertise" className="text-gray-400 hover:text-white hover:underline">
            Advertise Products
          </Link>
        </div>

        {/* Links Column 3 */}
        <div className="flex flex-col gap-2.5 text-xs">
          <h5 className="text-white font-bold text-sm mb-1">Let Us Help You</h5>
          <Link href="/profile" className="text-gray-400 hover:text-white hover:underline">
            Account Settings
          </Link>
          <Link href="/policy/shipping" className="text-gray-400 hover:text-white hover:underline">
            Shipping Policies
          </Link>
          <Link href="/policy/privacy" className="text-gray-400 hover:text-white hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>

      {/* Sub Footer */}
      <div className="mt-10 pt-6 border-t border-white/10 max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-gray-500 text-[11px]">
        <span>© {new Date().getFullYear()} Olinbuy, Inc. or its affiliates</span>
        <div className="flex gap-4">
          <Link href="/policy/terms" className="hover:underline">
            Conditions of Use
          </Link>
          <Link href="/policy/privacy" className="hover:underline">
            Privacy Notice
          </Link>
        </div>
      </div>
    </footer>
  );
}
