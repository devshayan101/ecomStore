'use client';

import React, { useState } from 'react';
import { ShoppingCart, Search, Menu, X, PhoneCall, User, LogOut, History, UserCog, ChevronDown } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

interface NavbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onMenuClick: () => void;
}

export default function Navbar({ searchTerm, onSearchChange, onMenuClick }: NavbarProps) {
  const { cartCount, setIsCartOpen } = useCart();
  const { data: session, status } = useSession();
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-gradient-to-r from-[#0f2444] via-[#1a3a6b] to-[#1e4d9e] text-white shadow-[0_4px_24px_rgba(10,25,60,0.5)] border-b border-[#c9a84c]/30">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Side: Logo & Burger */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <button
            onClick={onMenuClick}
            className="md:hidden p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>

          <Link href="/" className="flex flex-col select-none">
            <span className="font-heading text-xl md:text-2xl font-bold tracking-wider leading-none">
              Olin<span className="text-[#c9a84c]">buy</span>
            </span>
            <span className="text-[9px] text-white/90 tracking-[2px] uppercase font-bold mt-1">
              India's Best Store
            </span>
          </Link>
        </div>

        {/* Center: Search (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-lg items-center bg-white rounded-lg overflow-hidden shadow-inner border border-[#c9a84c]/20">
          <input
            type="text"
            placeholder="Search skincare, fashion, cosmetics..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 bg-transparent px-4 py-2 text-slate-800 outline-none text-sm placeholder-slate-400"
          />
          <button className="bg-gradient-to-r from-[#1a3a6b] to-[#1e4d9e] px-5 py-2.5 hover:opacity-90 transition-opacity border-l border-[#c9a84c]/30 text-white font-bold text-xs tracking-wider flex items-center gap-1 cursor-pointer">
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>

        {/* Right Side: Account, WA & Cart */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          <button
            onClick={() => setIsMobileSearchVisible(!isMobileSearchVisible)}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Customer Authentication Dropdown / Login Button */}
          {status === 'authenticated' && session?.user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-1 bg-white/12 hover:bg-white/22 px-3 py-2 rounded-lg text-xs font-semibold transition-all border border-white/10 cursor-pointer select-none"
              >
                <User className="w-4 h-4 text-[#c9a84c]" />
                <span className="hidden md:inline max-w-[80px] truncate">{session.user.name?.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3 text-white/70" />
              </button>

              {isProfileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white text-slate-700 rounded-xl border border-slate-200 shadow-xl py-2 z-40 select-none animate-[fadeIn_0.15s_ease-out]">
                    <div className="px-4 py-1.5 border-b border-slate-100 mb-1">
                      <p className="text-[10px] font-black uppercase text-slate-400">Account</p>
                      <p className="text-xs font-bold text-slate-800 truncate">{session.user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer text-slate-700"
                    >
                      <UserCog className="w-4 h-4 text-[#1a3a6b]" />
                      My Profile
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer text-slate-700"
                    >
                      <History className="w-4 h-4 text-[#1a3a6b]" />
                      Order History
                    </Link>
                    <button
                      onClick={() => { setIsProfileDropdownOpen(false); handleLogout(); }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold hover:bg-slate-50 hover:text-rose-600 border-t border-slate-100 mt-1.5 transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      Log Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 bg-white/12 hover:bg-white/22 px-3 py-2 rounded-lg text-xs font-semibold transition-all border border-white/10 cursor-pointer text-white"
            >
              <User className="w-4 h-4" />
              <span>Login</span>
            </Link>
          )}

          <a
            href="https://wa.me/919690914734"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 bg-[#25D366] hover:bg-[#1da854] px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-md hover:-translate-y-0.5 cursor-pointer text-white"
          >
            <PhoneCall className="w-4 h-4" />
            <span>WhatsApp Order</span>
          </a>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 bg-white/12 hover:bg-white/22 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer border border-white/10"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#ff6161] text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#1a3a6b] shadow-md animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Toggle Dropdown */}
      {isMobileSearchVisible && (
        <div className="md:hidden bg-[#0f2444] px-4 py-2 border-t border-[#c9a84c]/20 shadow-lg">
          <div className="flex items-center bg-white rounded-lg overflow-hidden border border-[#c9a84c]/20">
            <input
              type="text"
              placeholder="Search skincare, fashion, cosmetics..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="flex-1 bg-transparent px-3 py-2 text-slate-800 outline-none text-xs"
              autoFocus
            />
            <button
              onClick={() => setIsMobileSearchVisible(false)}
              className="p-2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
