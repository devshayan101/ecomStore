'use client';

import React, { useState } from 'react';
import { Flame, Shield, Truck, Zap, RefreshCw, Pause, Play } from 'lucide-react';

export default function MarqueeTicker() {
  const [isPaused, setIsPaused] = useState(false);

  const items = [
    { text: 'LIMITED DROP // #047 LIVE NOW', icon: Flame },
    { text: 'FREE WORLDWIDE EXPRESS DELIVERY ON ORDERS OVER ₹1,999', icon: Truck },
    { text: '100% VERIFIED AUTHENTIC TECHWEAR & STREETWEAR', icon: Shield },
    { text: 'GEN-Z LIFESTYLE & CYBER AESTHETIC', icon: Zap },
    { text: 'EASY 7-DAY REPLACEMENT & REFUND POLICY', icon: RefreshCw },
  ];

  return (
    <div className="w-full bg-[#121218] border-y border-white/10 py-3 overflow-hidden select-none relative group flex items-center">
      <div
        className={`animate-marquee flex items-center gap-12 ${
          isPaused ? '[animation-play-state:paused]' : ''
        } motion-reduce:[animation-play-state:paused]`}
      >
        {/* Primary copy announced by screen readers */}
        <div className="flex items-center gap-12 shrink-0">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={`primary-${idx}`} className="flex items-center gap-3 shrink-0">
                <Icon className="w-4 h-4 text-[#CCFF00]" />
                <span className="font-mono text-xs font-bold tracking-widest text-zinc-300 uppercase">
                  {item.text}
                </span>
                <span className="text-[#CCFF00] font-mono text-xs ml-4">//</span>
              </div>
            );
          })}
        </div>

        {/* Duplicate copies for continuous animation, hidden from screen readers */}
        <div className="flex items-center gap-12 shrink-0" aria-hidden="true">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={`dup1-${idx}`} className="flex items-center gap-3 shrink-0">
                <Icon className="w-4 h-4 text-[#CCFF00]" />
                <span className="font-mono text-xs font-bold tracking-widest text-zinc-300 uppercase">
                  {item.text}
                </span>
                <span className="text-[#CCFF00] font-mono text-xs ml-4">//</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-12 shrink-0" aria-hidden="true">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={`dup2-${idx}`} className="flex items-center gap-3 shrink-0">
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

      <button
        onClick={() => setIsPaused((prev) => !prev)}
        aria-label={isPaused ? 'Play marquee animation' : 'Pause marquee animation'}
        className="absolute right-4 z-10 p-1.5 rounded-full bg-zinc-900/80 border border-white/20 text-zinc-300 hover:text-[#CCFF00] focus:outline-none focus:ring-2 focus:ring-[#CCFF00] transition-colors"
      >
        {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

