'use client';

import React from 'react';
import { Flame, Shield, Truck, Zap, RefreshCw } from 'lucide-react';

export default function MarqueeTicker() {
  const items = [
    { text: 'LIMITED DROP // #047 LIVE NOW', icon: Flame },
    { text: 'FREE WORLDWIDE EXPRESS DELIVERY ON ORDERS OVER ₹1,999', icon: Truck },
    { text: '100% VERIFIED AUTHENTIC TECHWEAR & STREETWEAR', icon: Shield },
    { text: 'GEN-Z LIFESTYLE & CYBER AESTHETIC', icon: Zap },
    { text: 'EASY 7-DAY REPLACEMENT & REFUND POLICY', icon: RefreshCw },
  ];

  return (
    <div className="w-full bg-[#121218] border-y border-white/10 py-3 overflow-hidden select-none">
      <div className="animate-marquee flex items-center gap-12">
        {[...items, ...items, ...items].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-3 shrink-0">
              <Icon className="w-4 h-4 text-[#CCFF00]" />
              <span className="font-mono text-xs font-bold tracking-widest text-zinc-300 uppercase">
                {item.text}
              </span>
              <span className="text-[#CCFF00] font-mono text-xs ml-4">//</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
