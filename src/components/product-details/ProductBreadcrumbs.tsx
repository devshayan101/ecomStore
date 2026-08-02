'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface ProductBreadcrumbsProps {
  categoryName?: string;
  productName: string;
}

export default function ProductBreadcrumbs({ categoryName, productName }: ProductBreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-6 flex-wrap select-none">
      <Link href="/" className="hover:text-[#ff6b00] transition-colors">
        Home
      </Link>
      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      <Link href="/products" className="hover:text-[#ff6b00] transition-colors">
        {categoryName || 'Products'}
      </Link>
      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      <span className="text-slate-900 font-semibold truncate max-w-[280px] sm:max-w-md">
        {productName}
      </span>
    </nav>
  );
}
