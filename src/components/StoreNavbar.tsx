'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  Search,
  ShoppingCart,
  MapPin,
  Menu,
  X,
  User,
  Package,
  Sparkles,
  Flame,
  ChevronDown
} from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { Category } from '@/lib/api';

interface StoreNavbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

export default function StoreNavbar({
  searchTerm,
  onSearchChange,
  categories,
  selectedCategory,
  onSelectCategory,
}: StoreNavbarProps) {
  const { cartCount, setIsCartOpen } = useCart();
  const { data: session } = useSession();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = React.useState(searchTerm);

  React.useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearch);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white shadow-xl border-b border-slate-700/50">
      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3 md:gap-6">
        {/* Left Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6 text-amber-400" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link href="/" className="flex items-center gap-2 group select-none">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 text-slate-950 font-black flex items-center justify-center text-lg tracking-tighter shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              O
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-black text-white tracking-tight leading-none">
                Olin<span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">buy</span>
              </span>
              <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase flex items-center gap-1 mt-0.5">
                <Flame className="w-2.5 h-2.5 text-amber-400" /> OFFICIAL STORE
              </span>
            </div>
          </Link>
        </div>

        {/* Location Picker (Desktop) */}
        <button className="hidden lg:flex items-center gap-2 text-slate-200 hover:bg-slate-800/80 px-3 py-2 transition-all rounded-xl border border-slate-700/40 hover:border-amber-400/40 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-amber-400/10 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex flex-col leading-none text-left">
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Deliver to</span>
            <span className="text-xs font-semibold text-white mt-0.5">Select Location</span>
          </div>
        </button>

        {/* Pill-Style Modern Search Bar (Desktop) */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-2xl bg-slate-900/90 rounded-full border border-slate-700/80 p-1 group focus-within:border-amber-400/80 focus-within:ring-2 focus-within:ring-amber-400/20 transition-all shadow-inner"
        >
          <select
            value={selectedCategory}
            onChange={(e) => onSelectCategory(e.target.value)}
            className="bg-slate-800 text-slate-200 text-xs px-3.5 py-1.5 rounded-full border-none focus:outline-none cursor-pointer font-medium max-w-[150px] truncate hover:bg-slate-700 transition-colors"
          >
            <option value="all">All Categories</option>
            {categories.map((cat, idx) => (
              <option key={`select-cat-${cat._id || cat.slug || idx}-${idx}`} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search products, brands, gear..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="flex-1 px-4 text-xs text-white bg-transparent focus:outline-none placeholder-slate-400 font-sans"
          />
          <button
            type="submit"
            aria-label="Search"
            className="bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 px-5 py-1.5 rounded-full flex items-center justify-center font-bold hover:brightness-110 shadow-sm transition-all cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Right Actions Cluster */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* User Account Button */}
          {session?.user ? (
            <Link
              href="/profile"
              className="flex items-center gap-2 bg-slate-800/60 hover:bg-slate-800 text-white px-3 py-1.5 rounded-xl transition-all border border-slate-700/60 hover:border-slate-600 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-400 font-mono flex items-center justify-center text-xs font-bold">
                {session.user.name?.[0] || 'U'}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-none">
                <span className="text-[10px] text-slate-400">Welcome</span>
                <span className="text-xs font-semibold max-w-[90px] truncate mt-0.5">{session.user.name?.split(' ')[0]}</span>
              </div>
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 bg-slate-800/60 hover:bg-slate-800 text-slate-200 hover:text-white px-3 py-2 rounded-xl transition-all border border-slate-700/60 hover:border-amber-400/40 cursor-pointer text-xs font-semibold"
            >
              <User className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          )}

          {/* Orders */}
          <Link
            href="/orders"
            className="hidden sm:flex items-center gap-1.5 bg-slate-800/60 hover:bg-slate-800 text-slate-200 hover:text-white px-3 py-2 rounded-xl transition-all border border-slate-700/60 text-xs font-semibold"
          >
            <Package className="w-4 h-4 text-cyan-400" />
            <span>Orders</span>
          </Link>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-xl transition-all cursor-pointer relative"
            aria-label="View Cart"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-amber-400" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FFA41C] text-black font-black text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md border border-slate-900">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-xs font-bold hidden sm:inline text-white">Cart</span>
          </button>
        </div>
      </div>

      {/* Mobile Search Expandable Bar */}
      {isMobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 pt-1 border-t border-slate-800">
          <form
            onSubmit={handleSearchSubmit}
            className="flex bg-slate-900 rounded-full border border-slate-700 overflow-hidden h-9 p-0.5"
          >
            <input
              type="text"
              placeholder="Search Olinbuy..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="flex-1 px-3 text-xs text-white bg-transparent focus:outline-none"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 px-3.5 rounded-full flex items-center justify-center font-bold cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Sub Nav Category Bar (Glassmorphism Dark) */}
      <nav className="bg-slate-950/60 backdrop-blur-md px-4 sm:px-6 flex items-center h-11 gap-3 border-t border-slate-800/80 overflow-x-auto no-scrollbar text-xs font-medium">
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all whitespace-nowrap shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" /> All Products
        </button>
        {categories.map((cat, idx) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <button
              key={`pill-cat-${cat._id || cat.slug || idx}-${idx}`}
              onClick={() => onSelectCategory(cat.slug)}
              className={`px-3 py-1 rounded-full transition-all whitespace-nowrap shrink-0 ${
                isSelected
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0f172a] border-t border-slate-800 px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
          <div className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">Navigation Menu</div>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-200">
            <button
              onClick={() => { onSelectCategory('all'); setIsMobileMenuOpen(false); }}
              className="text-left py-2 px-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" /> All Products
            </button>

            <Link
              href="/orders"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 px-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 flex items-center gap-2"
            >
              <Package className="w-4 h-4 text-cyan-400" /> Orders
            </Link>

            <Link
              href="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 px-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 flex items-center gap-2"
            >
              <User className="w-4 h-4 text-amber-400" /> Profile
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

