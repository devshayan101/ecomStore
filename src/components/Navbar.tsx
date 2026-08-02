'use client';

import React, { useState } from 'react';
import { ShoppingCart, Search, Menu, X, PhoneCall, User, LogOut, History, UserCog, ChevronDown, Flame } from 'lucide-react';
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
    <header className="sticky top-4 z-50 w-full max-w-7xl mx-auto px-4 sm:px-6">
      <div className="glass-panel rounded-2xl px-4 md:px-6 h-16 flex items-center justify-between gap-4 shadow-[0_8px_32px_rgba(0,0,0,0.6)] border border-white/10">
        {/* Left Side: Logo & Mobile Menu */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/" className="flex items-center gap-2 select-none group">
            <div className="w-8 h-8 rounded-xl bg-[#CCFF00] text-black font-extrabold flex items-center justify-center text-sm shadow-[0_0_20px_rgba(204,255,0,0.4)] group-hover:scale-105 transition-transform">
              OB
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-lg md:text-xl font-black tracking-tight leading-none text-white">
                OLIN<span className="text-[#CCFF00]">BUY</span>
              </span>
              <span className="text-[9px] text-zinc-400 font-mono tracking-widest uppercase mt-0.5 flex items-center gap-1">
                <Flame className="w-2.5 h-2.5 text-[#CCFF00]" /> DROP SYSTEM
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Glass Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md items-center bg-black/40 rounded-xl overflow-hidden border border-white/10 focus-within:border-[#CCFF00]/60 transition-colors">
          <Search className="w-4 h-4 ml-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search streetwear, hoodies, techwear drops..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 bg-transparent px-3 py-2 text-white outline-none text-xs placeholder-zinc-500 font-sans"
          />
          <span className="text-[10px] font-mono text-zinc-500 bg-white/5 px-2 py-1 rounded mr-2 border border-white/5">
            CMD + K
          </span>
        </div>

        {/* Right Side: Auth, WhatsApp & Cart */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button
            onClick={() => setIsMobileSearchVisible(!isMobileSearchVisible)}
            className="md:hidden p-2 text-zinc-300 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            aria-label="Toggle Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Customer Auth / Profile Dropdown */}
          {status === 'authenticated' && session?.user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl text-xs font-semibold transition-all border border-white/10 cursor-pointer select-none text-white"
              >
                <div className="w-6 h-6 rounded-full bg-[#CCFF00]/20 text-[#CCFF00] font-mono flex items-center justify-center text-xs">
                  {session.user.name?.[0] || 'U'}
                </div>
                <span className="hidden md:inline max-w-[80px] truncate">{session.user.name?.split(' ')[0]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {isProfileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-52 bg-[#121218] text-zinc-200 rounded-2xl border border-white/10 shadow-2xl py-2 z-40 select-none animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-white/5 mb-1">
                      <p className="text-[10px] font-mono uppercase text-[#CCFF00]">VERIFIED USER</p>
                      <p className="text-xs font-semibold text-white truncate">{session.user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium hover:bg-white/5 hover:text-white transition-colors cursor-pointer text-zinc-300"
                    >
                      <UserCog className="w-4 h-4 text-[#CCFF00]" />
                      Account Settings
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium hover:bg-white/5 hover:text-white transition-colors cursor-pointer text-zinc-300"
                    >
                      <History className="w-4 h-4 text-[#CCFF00]" />
                      Order Tracking
                    </Link>
                    <button
                      onClick={() => { setIsProfileDropdownOpen(false); handleLogout(); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium hover:bg-rose-500/10 text-rose-400 border-t border-white/5 mt-1 transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border border-white/10 cursor-pointer text-white"
            >
              <User className="w-4 h-4 text-[#CCFF00]" />
              <span>Login</span>
            </Link>
          )}

          <a
            href="https://wa.me/919690914734"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>VIP Drop Line</span>
          </a>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 bg-[#CCFF00] hover:bg-[#b8e600] text-black font-extrabold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer shadow-[0_0_15px_rgba(204,255,0,0.3)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline font-mono tracking-tight uppercase">Cart</span>
            {cartCount > 0 && (
              <span className="bg-black text-[#CCFF00] text-[10px] font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center ml-0.5">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isMobileSearchVisible && (
        <div className="md:hidden mt-2 glass-panel p-3 rounded-xl border border-white/10 shadow-xl">
          <div className="flex items-center bg-black/60 rounded-lg overflow-hidden border border-[#CCFF00]/40">
            <Search className="w-4 h-4 ml-3 text-zinc-400" />
            <input
              type="text"
              placeholder="Search streetwear, hoodies, techwear..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="flex-1 bg-transparent px-3 py-2 text-white outline-none text-xs"
              autoFocus
            />
            <button
              onClick={() => setIsMobileSearchVisible(false)}
              className="p-2 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

