'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Flame, ShieldCheck, Zap, Sparkles, Clock } from 'lucide-react';
import Link from 'next/link';

export default function GenZHeroBanner() {
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full py-8 md:py-12 overflow-hidden select-none">
      {/* Background Neon Ambient Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#CCFF00]/15 rounded-full blur-[120px] pointer-events-none animate-glow" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Asymmetric Typography & CTA */}
          <div className="lg:col-span-7 flex flex-col space-y-6 z-10">
            {/* Live Drop Pill Badge */}
            <div className="inline-flex items-center gap-2 self-start bg-white/5 border border-[#CCFF00]/40 rounded-full px-3.5 py-1.5 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CCFF00] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#CCFF00]"></span>
              </span>
              <span className="text-[11px] font-mono font-bold tracking-widest text-[#CCFF00] uppercase">
                DROP 047 // LIMITED QUANTITY
              </span>
            </div>

            {/* Main Headline with Inline Photo Typography Punctuation */}
            <h1 className="font-heading text-4xl sm:text-6xl xl:text-7xl font-black text-white leading-[1.05] tracking-tight">
              CYBER <span className="inline-block align-middle mx-1 w-12 sm:w-16 h-8 sm:h-10 rounded-full overflow-hidden border border-[#CCFF00]/50 shadow-[0_0_15px_rgba(204,255,0,0.3)]">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80"
                  alt="Streetwear model"
                  className="w-full h-full object-cover"
                />
              </span> STREETWEAR <br />
              & TECHWEAR <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CCFF00] via-emerald-300 to-cyan-400">EVOLUTION</span>
            </h1>

            <p className="text-zinc-400 text-sm sm:text-base max-w-xl font-sans leading-relaxed">
              Designed for Gen Z taste-makers. High-impact tech lifestyle apparel, reflective accessories, and exclusive drops engineered for urban agility.
            </p>

            {/* Live Countdown & Primary CTA */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="#products-section"
                className="group relative flex items-center justify-center gap-3 bg-[#CCFF00] hover:bg-[#b8e600] text-black font-extrabold px-8 py-4 rounded-2xl text-sm font-mono tracking-tight transition-all duration-300 shadow-[0_0_30px_rgba(204,255,0,0.35)] hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <Zap className="w-5 h-5 fill-black stroke-none" />
                <span>EXPLORE DROP #047</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Countdown Glass Box */}
              <div className="flex items-center gap-3 bg-black/60 border border-white/10 px-4 py-3 rounded-2xl backdrop-blur-md self-start sm:self-auto">
                <Clock className="w-4 h-4 text-[#CCFF00]" />
                <div className="flex items-center gap-1 font-mono text-xs font-bold text-zinc-300">
                  <span className="bg-white/10 px-1.5 py-0.5 rounded text-white">{String(timeLeft.hours).padStart(2, '0')}</span>h :
                  <span className="bg-white/10 px-1.5 py-0.5 rounded text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>m :
                  <span className="bg-white/10 px-1.5 py-0.5 rounded text-white">{String(timeLeft.seconds).padStart(2, '0')}</span>s
                </div>
              </div>
            </div>

            {/* Feature Micro-Badges */}
            <div className="flex items-center gap-6 pt-4 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#CCFF00]" /> 100% Verified Drops
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#CCFF00]" /> Express Worldwide
              </div>
            </div>
          </div>

          {/* Right Column: 3D Tilt Card Featured Drop Preview */}
          <div className="lg:col-span-5 relative z-10">
            <div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="glass-panel rounded-3xl p-4 border border-white/15 relative overflow-hidden transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.8)] hover:border-[#CCFF00]/40 group"
            >
              {/* Top Card Tag */}
              <div className="flex items-center justify-between mb-3 px-2">
                <span className="text-[10px] font-mono font-bold text-[#CCFF00] bg-[#CCFF00]/10 px-2.5 py-1 rounded-full border border-[#CCFF00]/20 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> FEATURED HERO ITEM
                </span>
                <span className="text-xs font-mono text-zinc-400 font-semibold">₹3,499</span>
              </div>

              {/* Main Product Image Container */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-black/60">
                <img
                  src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80"
                  alt="Neon Cyber Hoodie"
                  className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
                    isHovered ? 'scale-110' : 'scale-100'
                  }`}
                />

                {/* Hover Video Overlay Sim / Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

                {/* Floating Interactive Product Info Card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 glass-panel rounded-2xl border border-white/10 backdrop-blur-xl">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-mono text-[#CCFF00]">NEO-TOKYO TECH HOODIE</p>
                      <h3 className="font-heading text-lg font-bold text-white leading-tight">Cyber-Reflective V2</h3>
                    </div>
                    <span className="text-[11px] font-mono font-black bg-[#CCFF00] text-black px-3 py-1 rounded-xl">
                      LIMITED
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
