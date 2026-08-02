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
  Sparkles
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

  return (
    <header className="sticky top-0 z-50 w-full bg-[#131b2e] text-white shadow-md">
      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3 md:gap-6">
        {/* Left Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors"
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link href="/" className="flex items-center gap-1.5 group select-none">
            <div className="w-8 h-8 rounded bg-[#FFA41C] text-black font-black flex items-center justify-center text-base tracking-tighter shadow-sm">
              O
            </div>
            <span className="text-xl md:text-2xl font-black text-white tracking-tight">
              Olin<span className="text-[#FFD814]">buy</span>
            </span>
          </Link>
        </div>

        {/* Location Picker (Desktop) */}
        <button className="hidden lg:flex items-center gap-1 text-white/90 hover:bg-white/10 p-2 transition-colors rounded text-left shrink-0">
          <MapPin className="w-5 h-5 text-[#FFD814]" />
          <div className="flex flex-col leading-none">
            <span className="text-[11px] text-white/70">Deliver to</span>
            <span className="text-xs font-semibold">Select Location</span>
          </div>
        </button>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-2xl bg-white rounded overflow-hidden h-10 group focus-within:ring-2 focus-within:ring-[#FFD814]">
          <select
            value={selectedCategory}
            onChange={(e) => onSelectCategory(e.target.value)}
            className="bg-gray-100 border-r border-gray-200 text-xs px-3 focus:outline-none cursor-pointer text-gray-700 font-medium max-w-[140px] truncate"
          >
            <option value="all">All Departments</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search Olinbuy"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 px-3 text-sm text-gray-900 focus:outline-none placeholder-gray-400"
          />
          <button
            aria-label="Search"
            className="bg-[#FFD814] px-4 flex items-center justify-center hover:bg-[#FFD814]/90 transition-colors"
          >
            <Search className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Right Actions Cluster */}
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="md:hidden p-2 text-white/90 hover:bg-white/10 rounded transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Account */}
          {session?.user ? (
            <Link
              href="/profile"
              className="text-white hover:bg-white/10 p-1.5 sm:p-2 transition-colors rounded flex flex-col items-start leading-none"
            >
              <span className="text-[10px] text-white/70">Hello, {session.user.name?.split(' ')[0]}</span>
              <span className="text-xs font-semibold hidden sm:inline">Account & Lists</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-white hover:bg-white/10 p-1.5 sm:p-2 transition-colors rounded flex flex-col items-start leading-none"
            >
              <span className="text-[10px] text-white/70">Sign in</span>
              <span className="text-xs font-semibold hidden sm:inline">Account & Lists</span>
            </Link>
          )}

          {/* Orders (Desktop) */}
          <Link
            href="/orders"
            className="hidden sm:flex text-white hover:bg-white/10 p-2 transition-colors rounded flex-col items-start leading-none"
          >
            <span className="text-[10px] text-white/70">Returns</span>
            <span className="text-xs font-semibold">& Orders</span>
          </Link>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="text-white hover:bg-white/10 p-1.5 sm:p-2 transition-colors rounded flex items-center gap-1 relative"
            aria-label="View Cart"
          >
            <div className="relative">
              <ShoppingCart className="w-7 h-7 sm:w-8 sm:h-8" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FFA41C] text-black font-black text-[10px] w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-xs font-bold hidden sm:inline mb-0.5">Cart</span>
          </button>
        </div>
      </div>

      {/* Mobile Search Expandable Bar */}
      {isMobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 pt-1 border-t border-white/10">
          <div className="flex bg-white rounded overflow-hidden h-9">
            <input
              type="text"
              placeholder="Search Olinbuy..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="flex-1 px-3 text-sm text-gray-900 focus:outline-none"
            />
            <button className="bg-[#FFD814] px-3.5 flex items-center justify-center">
              <Search className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>
      )}

      {/* Sub Nav Category Bar */}
      <nav className="bg-[#232f3e] px-4 flex items-center h-10 gap-3 overflow-x-auto no-scrollbar text-xs font-medium text-white/80">
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex items-center gap-1 font-bold whitespace-nowrap shrink-0 ${
            selectedCategory === 'all' ? 'text-[#FFD814] border-b-2 border-[#FFD814] pb-0.5' : 'hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" /> All Products
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => onSelectCategory(cat.slug)}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              selectedCategory === cat.slug
                ? 'text-[#FFD814] font-bold border-b-2 border-[#FFD814] pb-0.5'
                : 'hover:text-white'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#131b2e] border-t border-white/10 px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
          <div className="text-xs font-bold text-[#FFD814] uppercase tracking-wider">Quick Navigation</div>
          <div className="grid grid-cols-2 gap-2 text-sm text-white/90">
            <button
              onClick={() => { onSelectCategory('all'); setIsMobileMenuOpen(false); }}
              className="text-left py-1.5 px-2 rounded hover:bg-white/10"
            >
              🛍️ All Categories
            </button>
            <Link
              href="/orders"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1.5 px-2 rounded hover:bg-white/10 flex items-center gap-1.5"
            >
              <Package className="w-4 h-4 text-[#FFD814]" /> Orders
            </Link>
            <Link
              href="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1.5 px-2 rounded hover:bg-white/10 flex items-center gap-1.5"
            >
              <User className="w-4 h-4 text-[#FFD814]" /> Profile
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
