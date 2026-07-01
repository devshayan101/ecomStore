'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { 
  Truck, 
  RotateCcw, 
  CreditCard, 
  Package, 
  Lock, 
  FileText, 
  HelpCircle, 
  Phone,
  ChevronDown,
  Check,
  X,
  Info,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

type TabType = 'shipping' | 'return' | 'payment' | 'wholesale' | 'privacy' | 'terms' | 'faq';

function PolicyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('shipping');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Sync tab with URL search parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab') as TabType;
    if (tabParam && ['shipping', 'return', 'payment', 'wholesale', 'privacy', 'terms', 'faq'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    // Update URL query parameter
    const params = new URLSearchParams(window.location.search);
    params.set('tab', tab);
    router.push(`/policy?${params.toString()}`);
    // Smooth scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-[#1a1a2e] flex flex-col font-sans">
      <Navbar searchTerm="" onSearchChange={() => {}} onMenuClick={() => {}} />

      {/* HEADER / HERO BAR */}
      <header className="bg-gradient-to-r from-[#0a1628] via-[#0f2444] to-[#1a3a6b] px-4 md:px-8 py-6 flex items-center justify-between shadow-lg border-b border-[#c9a84c]/20 sticky top-0 z-50">
        <Link href="/" className="flex flex-col gap-0.5">
          <span className="font-heading text-2xl font-bold text-white tracking-wide">
            Olin<em className="text-[#c9a84c] not-italic">buy</em>
          </span>
          <span className="text-[9px] text-[#c9a84c]/85 tracking-[3px] uppercase font-semibold">
            India's Best Store
          </span>
        </Link>
        <Link 
          href="/" 
          className="flex items-center gap-1.5 bg-[#c9a84c]/10 hover:bg-[#c9a84c]/20 border border-[#c9a84c]/30 text-[#e8d5a3] hover:text-[#fde68a] px-4 py-2 rounded-lg text-xs font-bold transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Shop
        </Link>
      </header>

      {/* TAB NAV */}
      <div className="bg-white border-b border-slate-200 sticky top-[77px] z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex overflow-x-auto no-scrollbar scroll-smooth">
          {(
            [
              { id: 'shipping', label: 'Shipping', icon: Truck, color: 'text-slate-600' },
              { id: 'return', label: 'Return & Refund', icon: RotateCcw, color: 'text-slate-600' },
              { id: 'payment', label: 'Payment', icon: CreditCard, color: 'text-slate-600' },
              { id: 'wholesale', label: 'Wholesale', icon: Package, color: 'text-amber-800' },
              { id: 'privacy', label: 'Privacy', icon: Lock, color: 'text-slate-600' },
              { id: 'terms', label: 'Terms', icon: FileText, color: 'text-slate-600' },
              { id: 'faq', label: 'FAQ', icon: HelpCircle, color: 'text-slate-600' }
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-5 py-4 text-xs font-bold border-b-3 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#c9a84c] text-[#0f2444] bg-[#f8faff]/50'
                    : 'border-transparent text-slate-500 hover:text-[#0f2444] hover:bg-slate-50/50'
                } ${tab.id === 'wholesale' ? 'text-amber-700' : ''}`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CONTENT AREA */}
      <main className="max-w-6xl w-full mx-auto px-4 py-8 flex-grow">
        
        {/* SHIPPING SECTION */}
        {activeTab === 'shipping' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#0a1628] via-[#0f2444] to-[#1a3a6b] rounded-xl p-8 text-white relative overflow-hidden shadow-md">
              <div className="absolute right-[-40px] top-[-40px] w-48 h-48 rounded-full bg-[#c9a84c]/5" />
              <div className="absolute right-[60px] bottom-[-60px] w-36 h-36 rounded-full bg-white/5" />
              <div className="inline-flex items-center gap-1.5 bg-[#c9a84c]/20 border border-[#c9a84c]/40 text-[#fde68a] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                ✦ Olinbuy Policy
              </div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold mb-2">Shipping & Delivery Policy</h1>
              <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
                We deliver quality products safely and swiftly across India. Complete transparency — no hidden charges, no surprises.
              </p>
              <div className="text-[11px] text-slate-400 mt-4">
                📅 Effective: June 2025 &nbsp;|&nbsp; Olinbuy, Mohali, Punjab, India
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Delivery Timeframes */}
              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-lg font-heading font-bold text-[#0f2444] border-b-2 border-slate-100 pb-3 mb-4">
                  <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600"><Truck className="w-5 h-5" /></span>
                  Delivery Timeframes
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#0f2444] text-white">
                        <th className="p-3 rounded-l-lg font-bold">Location</th>
                        <th className="p-3 font-bold">Time</th>
                        <th className="p-3 rounded-r-lg font-bold">Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-blue-50/40">
                        <td className="p-3"><strong>Mohali, Chandigarh, Kharar</strong></td>
                        <td className="p-3">2–3 Business Days</td>
                        <td className="p-3"><span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Fast</span></td>
                      </tr>
                      <tr className="hover:bg-blue-50/40 bg-slate-50/30">
                        <td className="p-3"><strong>Punjab & Haryana</strong></td>
                        <td className="p-3">3–5 Business Days</td>
                        <td className="p-3"><span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Fast</span></td>
                      </tr>
                      <tr className="hover:bg-blue-50/40">
                        <td className="p-3"><strong>Delhi, UP, HP, J&K</strong></td>
                        <td className="p-3">4–7 Business Days</td>
                        <td className="p-3"><span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Standard</span></td>
                      </tr>
                      <tr className="hover:bg-blue-50/40 bg-slate-50/30">
                        <td className="p-3"><strong>Rest of India</strong></td>
                        <td className="p-3">7–10 Business Days</td>
                        <td className="p-3"><span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Standard</span></td>
                      </tr>
                      <tr className="hover:bg-blue-50/40">
                        <td className="p-3"><strong>Remote & Hilly Areas</strong></td>
                        <td className="p-3">10–12 Business Days</td>
                        <td className="p-3"><span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Standard</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 p-4 rounded-lg bg-blue-50/70 border-l-4 border-blue-500 flex gap-3 text-xs text-blue-900 leading-relaxed font-medium">
                  <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <p>Business days = Monday to Saturday, excluding public holidays. Orders placed after 5:00 PM will be processed the next business day. Order cut-off: 12:00 PM (Mon–Sat).</p>
                </div>
              </div>

              {/* Shipping Charges */}
              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-lg font-heading font-bold text-[#0f2444] border-b-2 border-slate-100 pb-3 mb-4">
                  <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600"><CreditCard className="w-5 h-5" /></span>
                  Shipping Charges
                </div>
                <ul className="space-y-3.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Orders above ₹999 — <strong>FREE delivery pan-India</strong></span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>COD orders below ₹999 — Flat <strong>₹100</strong></span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Online/UPI orders below ₹999 — Flat <strong>₹60</strong></span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Wholesale orders (MOQ ₹2,000+) — <strong>Free delivery</strong></span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>No hidden charges — checkout price is final</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Processing */}
              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-lg font-heading font-bold text-[#0f2444] border-b-2 border-slate-100 pb-3 mb-4">
                  <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600"><Package className="w-5 h-5" /></span>
                  Order Processing
                </div>
                <ul className="space-y-3.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Order confirmed on WhatsApp within <strong>2–4 hours</strong></span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Processing & packing: <strong>1–3 business days</strong> after confirmation</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Tracking number shared via WhatsApp after dispatch</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>All products quality-checked before shipping</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Packed with Olinbuy-sealed packaging for security</span>
                  </li>
                  <li className="flex items-start gap-2.5 border-t border-slate-50 pt-2 text-slate-500">
                    <span className="text-slate-400 shrink-0 mt-0.5">›</span>
                    <span>Batch IDs may vary by stock — products will always be 100% authentic</span>
                  </li>
                </ul>
              </div>

              {/* Important Notes */}
              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-lg font-heading font-bold text-[#0f2444] border-b-2 border-slate-100 pb-3 mb-4">
                  <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600"><AlertTriangle className="w-5 h-5" /></span>
                  Important Notes
                </div>
                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <span className="text-slate-400 shrink-0 mt-0.5">›</span>
                    <span>Delivery may delay <strong>2–3 extra days</strong> during festive seasons</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-slate-400 shrink-0 mt-0.5">›</span>
                    <span>Provide correct address & active phone number while ordering</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-slate-400 shrink-0 mt-0.5">›</span>
                    <span>Courier attempts delivery <strong>3 times</strong> if no one is available</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-slate-400 shrink-0 mt-0.5">›</span>
                    <span>If package arrives damaged — photograph before opening & WhatsApp us</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>Olinbuy not liable for delays by courier partners or natural events</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>No resale/bulk commercial purchase without Wholesale Agreement</span>
                  </li>
                </ul>
                <div className="mt-4 p-4 rounded-lg bg-rose-50 border-l-4 border-rose-500 flex gap-3 text-xs text-rose-900 leading-relaxed font-semibold">
                  <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <p>Record an unboxing video when receiving your order — Olinbuy seal must be visible. This is MANDATORY for any damage or wrong product complaint. No video = no claim.</p>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-gradient-to-r from-[#0a1628] via-[#0f2444] to-[#1a3a6b] rounded-xl p-8 text-center text-white relative overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(201,168,76,0.1),transparent_70%)]" />
              <h3 className="font-heading text-xl font-bold mb-2">Shipping Query?</h3>
              <p className="text-slate-300 text-xs mb-5 max-w-md mx-auto leading-relaxed">
                Contact us on WhatsApp for tracking, delivery updates, or any shipping issue. We respond within 2 hours.
              </p>
              <a 
                href="https://wa.me/919690914734?text=Hello%20Olinbuy!%20I%20have%20a%20shipping%20query."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1da854] text-white px-8 py-3 rounded-lg text-sm font-bold shadow-lg hover:shadow-emerald-500/25 hover:translate-y-[-1px] transition-all"
              >
                <Phone className="w-4 h-4" /> 📲 WhatsApp: +91 9690914734
              </a>
              <div className="text-[10px] text-slate-400 mt-3.5">
                Mon–Sat · 10:00 AM – 8:00 PM · Response within 2 hours
              </div>
            </div>
          </div>
        )}

        {/* RETURN & REFUND SECTION */}
        {activeTab === 'return' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#1a0a2e] via-[#3b0764] to-[#6d28d9] rounded-xl p-8 text-white relative overflow-hidden shadow-md">
              <div className="absolute right-[-40px] top-[-40px] w-48 h-48 rounded-full bg-[#c9a84c]/5" />
              <div className="absolute right-[60px] bottom-[-60px] w-36 h-36 rounded-full bg-white/5" />
              <div className="inline-flex items-center gap-1.5 bg-[#c9a84c]/20 border border-[#c9a84c]/40 text-[#fde68a] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                ✦ Olinbuy Policy
              </div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold mb-2">Return & Refund Policy</h1>
              <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
                We stand behind every product. If something isn't right, we resolve it quickly and fairly. Your satisfaction is our commitment.
              </p>
              <div className="text-[11px] text-slate-400 mt-4">
                📅 Effective: June 2025 &nbsp;|&nbsp; Return Window: 3 Days from Delivery
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Valid Return Reasons */}
              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-lg font-heading font-bold text-[#0f2444] border-b-2 border-slate-100 pb-3 mb-4">
                  <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600"><Check className="w-5 h-5" /></span>
                  Valid Return Reasons
                </div>
                <ul className="space-y-3.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Wrong product delivered</strong> — full refund or free replacement</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Damaged or defective product</strong> — full refund or replacement</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Product significantly different from description</strong> — exchange or refund</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Missing item(s) in order</strong> — replacement of missing items</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Partial returns accepted — return one or all items</span>
                  </li>
                </ul>
                <div className="mt-4 p-4 rounded-lg bg-rose-50 border-l-4 border-rose-500 flex gap-3 text-xs text-rose-900 leading-relaxed font-semibold">
                  <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <p>Unboxing video showing Olinbuy seal is MANDATORY for all claims. No video = claim rejected. Always record when first opening your package.</p>
                </div>
              </div>

              {/* Non-Returnable Items */}
              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-lg font-heading font-bold text-[#0f2444] border-b-2 border-slate-100 pb-3 mb-4">
                  <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600"><X className="w-5 h-5" /></span>
                  Non-Returnable Items
                </div>
                <ul className="space-y-3.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>Opened or used skincare & cosmetic products (hygiene policy)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>Products with visible wear, use, or customer-caused damage</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>Return request after <strong>3 days</strong> of delivery date</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>Products without original packaging, seals, labels, or barcodes</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>Products with expiry within 6 months — unless wrong/damaged</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>Sale/discounted items — unless damaged or wrong</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>Wholesale orders — unless completely wrong product sent</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Return Process */}
            <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-lg font-heading font-bold text-[#0f2444] border-b-2 border-slate-100 pb-3 mb-4">
                <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600"><RotateCcw className="w-5 h-5" /></span>
                Return Process — Step by Step
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { step: 1, text: "WhatsApp us at +91 9690914734 within 3 days of delivery" },
                  { step: 2, text: "Share: Order ID + unboxing video (Olinbuy seal visible) + product photos with batch number" },
                  { step: 3, text: "Our team reviews claim within 24 hours — approval or rejection notified" },
                  { step: 4, text: "If approved — return pickup arranged within 3–4 business days (we bear cost)" },
                  { step: 5, text: "Damaged product sent to vendor for investigation" },
                  { step: 6, text: "Refund or replacement processed within 5–7 business days of receiving product" }
                ].map((item) => (
                  <div key={item.step} className="p-4 rounded-lg bg-slate-50 border border-slate-100 relative">
                    <span className="absolute top-2 right-2.5 bg-[#0f2444] text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center">
                      {item.step}
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed pr-6 mt-1">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cancellation Policy */}
              <div className="bg-white rounded-xl p-6 border border-slate-105 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-lg font-heading font-bold text-[#0f2444] border-b-2 border-slate-100 pb-3 mb-4">
                  <span className="p-1.5 rounded-lg bg-orange-50 text-orange-600"><X className="w-5 h-5" /></span>
                  Cancellation Policy
                </div>
                <ul className="space-y-3.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Cancellation allowed <strong>before dispatch only</strong></span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Can cancel only <strong>after 3 hours</strong> of placing order</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>Once tracking updated or dispatched — <strong>cannot cancel</strong></span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-400">
                    <span className="shrink-0 mt-0.5">›</span>
                    <span>If shipped, cancellation cannot be guaranteed</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-amber-700">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>If cancelled but courier delivers — <strong>do NOT accept</strong> the package</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-400">
                    <span className="shrink-0 mt-0.5">›</span>
                    <span>Auto-refund if shipment returned due to non-delivery</span>
                  </li>
                </ul>
              </div>

              {/* Refund Details */}
              <div className="bg-white rounded-xl p-6 border border-slate-105 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-lg font-heading font-bold text-[#0f2444] border-b-2 border-slate-100 pb-3 mb-4">
                  <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600"><CreditCard className="w-5 h-5" /></span>
                  Refund Details
                </div>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Approved refunds processed within <strong>5–7 business days</strong> after product received & inspected.
                </p>
                <ul className="space-y-3.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>COD orders</strong> — Refund via UPI or Bank Transfer</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>UPI/Online</strong> — Refund to original payment source</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Partial COD</strong> — 10% advance refunded to UPI/bank</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Exchange available if preferred over refund</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-400 border-t border-slate-50 pt-2">
                    <span className="shrink-0 mt-0.5">›</span>
                    <span>Shipping charges (₹60–₹100) non-refundable unless Olinbuy's error</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Return Process CTA */}
            <div className="bg-gradient-to-r from-[#1a0a2e] via-[#3b0764] to-[#6d28d9] rounded-xl p-8 text-center text-white relative overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(201,168,76,0.1),transparent_70%)]" />
              <h3 className="font-heading text-xl font-bold mb-2">Want to Return a Product?</h3>
              <p className="text-slate-300 text-xs mb-5 max-w-md mx-auto leading-relaxed">
                WhatsApp us within 3 days with your order ID and unboxing video. All valid claims resolved within 24 hours.
              </p>
              <a 
                href="https://wa.me/919690914734?text=Hello%20Olinbuy!%20I%20want%20to%20return%20a%20product."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1da854] text-white px-8 py-3 rounded-lg text-sm font-bold shadow-lg hover:shadow-emerald-500/25 hover:translate-y-[-1px] transition-all"
              >
                <Phone className="w-4 h-4" /> 📲 Start Return Process
              </a>
              <div className="text-[10px] text-slate-400 mt-3.5">
                Mon–Sat · 10:00 AM – 8:00 PM · Claims reviewed within 24 hours
              </div>
            </div>
          </div>
        )}

        {/* PAYMENT SECTION */}
        {activeTab === 'payment' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#0a1a0a] via-[#14532d] to-[#166534] rounded-xl p-8 text-white relative overflow-hidden shadow-md">
              <div className="absolute right-[-40px] top-[-40px] w-48 h-48 rounded-full bg-[#c9a84c]/5" />
              <div className="absolute right-[60px] bottom-[-60px] w-36 h-36 rounded-full bg-white/5" />
              <div className="inline-flex items-center gap-1.5 bg-[#c9a84c]/20 border border-[#c9a84c]/40 text-[#fde68a] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                ✦ Olinbuy Policy
              </div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold mb-2">Payment Policy</h1>
              <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
                Flexible, secure, and fully transparent payment options. Designed to protect both our customers and our business.
              </p>
              <div className="text-[11px] text-slate-400 mt-4">
                📅 Effective: June 2025
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payment Methods */}
              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-lg font-heading font-bold text-[#0f2444] border-b-2 border-slate-100 pb-3 mb-4">
                  <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600"><CreditCard className="w-5 h-5" /></span>
                  Payment Methods
                </div>
                <ul className="space-y-3.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Cash on Delivery (COD)</strong> — pan-India, up to ₹10,000</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Partial COD</strong> — 10% advance + 90% on delivery</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Full UPI</strong> — GPay, PhonePe, Paytm, BHIM, WhatsApp Pay</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Bank Transfer</strong> (NEFT/IMPS) — wholesale orders above ₹5,000</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Full Advance</strong> — priority dispatch within 24 hours</span>
                  </li>
                </ul>
              </div>

              {/* Payment Security */}
              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-lg font-heading font-bold text-[#0f2444] border-b-2 border-slate-100 pb-3 mb-4">
                  <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600"><Lock className="w-5 h-5" /></span>
                  Payment Security
                </div>
                <ul className="space-y-3.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>All UPI transactions secured via RBI-regulated bank servers</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>We never store card, UPI PIN, or banking details</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Official UPI ID shared only via WhatsApp: <strong>+91 9690914734</strong></span>
                  </li>
                  <li className="flex items-start gap-2.5 text-rose-600 font-semibold">
                    <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>We will <strong>NEVER</strong> ask for OTP, ATM PIN, or card number</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-rose-600 font-semibold">
                    <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>Never share OTP with anyone claiming to be Olinbuy</span>
                  </li>
                </ul>
                <div className="mt-4 p-4 rounded-lg bg-rose-55 border-l-4 border-rose-500 flex gap-3 text-xs text-rose-900 leading-relaxed font-semibold">
                  <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <p>FRAUD ALERT: Olinbuy will NEVER ask for OTP, ATM PIN, or card details. Anyone asking is a scammer. Block and report immediately.</p>
                </div>
              </div>
            </div>

            {/* Partial COD Steps */}
            <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="flex items-center gap-2 text-lg font-heading font-bold text-[#0f2444] border-b-2 border-slate-100 pb-3">
                <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600"><Truck className="w-5 h-5" /></span>
                Partial COD — How It Works
              </div>
              <div className="bg-gradient-to-br from-[#0a1628] via-[#0f2444] to-[#1a3a6b] rounded-xl p-6 text-white relative overflow-hidden">
                <div className="absolute right-[-20px] top-[-20px] w-24 h-24 rounded-full bg-[#c9a84c]/10" />
                <h4 className="font-heading text-md font-bold text-[#fde68a] mb-4">✦ Partial COD — Step by Step</h4>
                <ol className="space-y-3.5 text-xs text-slate-100">
                  <li className="flex items-center gap-3">
                    <span className="bg-[#c9a84c] text-[#0a1628] font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shrink-0">1</span>
                    <span>Place your order on WhatsApp</span>
                  </li>
                  <li className="flex items-center gap-3 border-t border-slate-700/40 pt-2.5">
                    <span className="bg-[#c9a84c] text-[#0a1628] font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shrink-0">2</span>
                    <span>Pay <strong>10% advance via UPI</strong> to confirm your order</span>
                  </li>
                  <li className="flex items-center gap-3 border-t border-slate-700/40 pt-2.5">
                    <span className="bg-[#c9a84c] text-[#0a1628] font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shrink-0">3</span>
                    <span>We dispatch within <strong>1–3 business days</strong></span>
                  </li>
                  <li className="flex items-center gap-3 border-t border-slate-700/40 pt-2.5">
                    <span className="bg-[#c9a84c] text-[#0a1628] font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shrink-0">4</span>
                    <span>Pay remaining <strong>90% cash</strong> to the delivery person</span>
                  </li>
                  <li className="flex items-center gap-3 border-t border-slate-700/40 pt-2.5 text-emerald-400 font-semibold">
                    <span className="bg-[#c9a84c] text-[#0a1628] font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shrink-0">5</span>
                    <span>Order complete ✓</span>
                  </li>
                </ol>
              </div>
              <div className="p-4 rounded-lg bg-blue-50 border-l-4 border-blue-500 flex gap-3 text-xs text-blue-900 leading-relaxed font-semibold">
                <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p>Partial COD confirms genuine orders and keeps prices low for all customers. The 10% advance reduces fraudulent orders, allowing us to serve genuine buyers better and faster.</p>
              </div>
            </div>

            {/* Resolve WhatsApp CTA */}
            <div className="bg-gradient-to-r from-[#0a1a0a] via-[#14532d] to-[#166534] rounded-xl p-8 text-center text-white relative overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(201,168,76,0.1),transparent_70%)]" />
              <h3 className="font-heading text-xl font-bold mb-2">Payment Issue?</h3>
              <p className="text-slate-300 text-xs mb-5 max-w-md mx-auto leading-relaxed">
                Contact us immediately on WhatsApp. All payment concerns resolved within 2 hours.
              </p>
              <a 
                href="https://wa.me/919690914734?text=Hello%20Olinbuy!%20I%20have%20a%20payment%20query."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1da854] text-white px-8 py-3 rounded-lg text-sm font-bold shadow-lg hover:shadow-emerald-500/25 hover:translate-y-[-1px] transition-all"
              >
                <Phone className="w-4 h-4" /> 📲 Resolve on WhatsApp
              </a>
              <div className="text-[10px] text-slate-400 mt-3.5">
                Mon–Sat · 10:00 AM – 8:00 PM · Emergency support available
              </div>
            </div>
          </div>
        )}

        {/* WHOLESALE SECTION */}
        {activeTab === 'wholesale' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#1a0a00] via-[#451a03] to-[#92400e] rounded-xl p-8 text-white relative overflow-hidden shadow-md">
              <div className="absolute right-[-40px] top-[-40px] w-48 h-48 rounded-full bg-[#c9a84c]/5" />
              <div className="absolute right-[60px] bottom-[-60px] w-36 h-36 rounded-full bg-white/5" />
              <div className="inline-flex items-center gap-1.5 bg-[#c9a84c]/20 border border-[#c9a84c]/40 text-[#fde68a] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                ✦ Exclusive Program
              </div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold mb-2">Wholesale Policy & Program</h1>
              <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
                Olinbuy's Wholesale Program is designed for serious retailers, resellers, and boutique owners. Best rates, genuine products, and dedicated support — built for business growth.
              </p>
              <div className="text-[11px] text-slate-400 mt-4">
                📅 Effective: June 2025 &nbsp;|&nbsp; For Retailers, Resellers & Boutique Owners
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { num: "30%", label: "Max Bulk Discount" },
                { num: "₹2K", label: "Min Order Value" },
                { num: "3", label: "Categories Available" }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white rounded-xl p-5 text-center border border-yellow-100 shadow-sm">
                  <span className="font-heading text-2xl md:text-4xl font-extrabold text-[#c9a84c] block">{stat.num}</span>
                  <span className="text-[10px] md:text-xs text-amber-900 font-bold tracking-wide uppercase mt-1 block">{stat.label}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Who Can Apply */}
              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-lg font-heading font-bold text-[#0f2444] border-b-2 border-slate-100 pb-3 mb-4">
                  <span className="p-1.5 rounded-lg bg-amber-50 text-[#c9a84c]"><Check className="w-5 h-5" /></span>
                  Who Can Apply
                </div>
                <ul className="space-y-3.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#c9a84c] font-bold shrink-0">✦</span>
                    <span>Retail shop owners & boutique owners</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#c9a84c] font-bold shrink-0">✦</span>
                    <span>Online resellers (Instagram, WhatsApp, Meesho, etc.)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#c9a84c] font-bold shrink-0">✦</span>
                    <span>Fashion & beauty entrepreneurs</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#c9a84c] font-bold shrink-0">✦</span>
                    <span>Event vendors & pop-up store owners</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#c9a84c] font-bold shrink-0">✦</span>
                    <span>Anyone with genuine intent to resell Olinbuy products</span>
                  </li>
                </ul>
                <div className="mt-4 p-4 rounded-lg bg-yellow-50/50 border-l-4 border-[#c9a84c] flex gap-3 text-xs text-amber-900 leading-relaxed font-semibold">
                  <AlertTriangle className="w-5 h-5 text-[#c9a84c] shrink-0 mt-0.5" />
                  <p>Wholesale is strictly for authorized resellers only. Personal buyers misusing wholesale pricing will have their access revoked and orders cancelled without refund.</p>
                </div>
              </div>

              {/* Available Categories */}
              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-lg font-heading font-bold text-[#0f2444] border-b-2 border-slate-100 pb-3 mb-4">
                  <span className="p-1.5 rounded-lg bg-orange-50 text-orange-600"><Package className="w-5 h-5" /></span>
                  Available Categories
                </div>
                <ul className="space-y-3.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#c9a84c] font-bold shrink-0">✦</span>
                    <span><strong>Skincare</strong> — Serums, moisturizers, SPF, toners, cleansers</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#c9a84c] font-bold shrink-0">✦</span>
                    <span><strong>Cosmetics</strong> — Lipsticks, foundations, eye shadows, kajal sets</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#c9a84c] font-bold shrink-0">✦</span>
                    <span><strong>Women's Fashion</strong> — Kurtis, co-ord sets, dresses, palazzo sets</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#c9a84c] font-bold shrink-0">✦</span>
                    <span><strong>Men's Fashion</strong> — Shirts, kurtas, trousers (select items)</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-400 border-t border-slate-50 pt-2">
                    <span className="shrink-0 mt-0.5">›</span>
                    <span>Fragrance & Hair Care — coming soon for wholesale</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Wholesale Payment Tiers */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-[#451a03] to-[#92400e] text-white p-4 flex items-center justify-between">
                <h3 className="font-heading text-sm md:text-base font-bold text-[#fde68a]">💳 Wholesale Payment Tiers</h3>
                <span className="bg-white/15 border border-white/30 text-white text-[10px] font-bold px-3 py-1 rounded-full">Structured for Your Business</span>
              </div>
              <div className="p-6 space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#0f2444] text-white">
                        <th className="p-3 rounded-l-lg font-bold">Order Value</th>
                        <th className="p-3 font-bold">Payment Terms</th>
                        <th className="p-3 rounded-r-lg font-bold">Discount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50">
                        <td className="p-3"><strong>Up to ₹5,000</strong></td>
                        <td className="p-3">COD or Full Advance</td>
                        <td className="p-3"><span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Up to 15%</span></td>
                      </tr>
                      <tr className="hover:bg-slate-50 bg-slate-50/30">
                        <td className="p-3"><strong>₹5,000 – ₹15,000</strong></td>
                        <td className="p-3">50% Advance + 50% on Delivery</td>
                        <td className="p-3"><span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Up to 20%</span></td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3"><strong>₹15,000 – ₹50,000</strong></td>
                        <td className="p-3">Full Advance via Bank Transfer</td>
                        <td className="p-3"><span className="bg-yellow-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Up to 25%</span></td>
                      </tr>
                      <tr className="hover:bg-slate-55 bg-slate-50/30">
                        <td className="p-3"><strong>Above ₹50,000</strong></td>
                        <td className="p-3">Full Advance — Negotiable Terms</td>
                        <td className="p-3"><span className="bg-yellow-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Up to 30%</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="p-4 rounded-lg bg-yellow-50/50 border-l-4 border-[#c9a84c] flex gap-3 text-xs text-amber-900 leading-relaxed font-semibold">
                  <Info className="w-5 h-5 text-[#c9a84c] shrink-0 mt-0.5" />
                  <p>All wholesale prices and discount slabs are confirmed via WhatsApp before order placement. Final pricing depends on category, quantity, and current stock availability.</p>
                </div>
              </div>
            </div>

            {/* Wholesale Order Process */}
            <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-lg font-heading font-bold text-[#0f2444] border-b-2 border-slate-100 pb-3 mb-4">
                <span className="p-1.5 rounded-lg bg-amber-50 text-[#c9a84c]"><RotateCcw className="w-5 h-5" /></span>
                Wholesale Order Process
              </div>
              <div className="flex flex-col sm:flex-row gap-4 overflow-x-auto py-2">
                {[
                  { icon: "📲", title: "WhatsApp Inquiry" },
                  { icon: "📋", title: "Product & Price Confirmation" },
                  { icon: "💰", title: "Advance Payment" },
                  { icon: "📦", title: "Packing & Dispatch" },
                  { icon: "✅", title: "Delivery & Final Payment" }
                ].map((step, idx) => (
                  <div key={idx} className="flex-1 min-w-[120px] text-center p-4 bg-slate-50 border border-slate-100 rounded-lg relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#451a03] to-[#92400e] rounded-full flex items-center justify-center text-lg mx-auto mb-2 text-white">
                      {step.icon}
                    </div>
                    <p className="text-[11px] font-bold text-amber-900 leading-snug">{step.title}</p>
                    {idx < 4 && (
                      <span className="hidden sm:block absolute top-[30px] right-[-10px] text-lg font-extrabold text-[#c9a84c] z-10">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Wholesale Terms */}
              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-lg font-heading font-bold text-[#0f2444] border-b-2 border-slate-100 pb-3 mb-4">
                  <span className="p-1.5 rounded-lg bg-amber-50 text-[#c9a84c]"><FileText className="w-5 h-5" /></span>
                  Wholesale Terms
                </div>
                <ul className="space-y-3.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#c9a84c] font-bold shrink-0">✦</span>
                    <span>Minimum order value: <strong>₹2,000</strong></span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#c9a84c] font-bold shrink-0">✦</span>
                    <span>Free delivery on all wholesale orders</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#c9a84c] font-bold shrink-0">✦</span>
                    <span>Bulk discount applied on confirmed orders only</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#c9a84c] font-bold shrink-0">✦</span>
                    <span>Product availability confirmed before payment</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#c9a84c] font-bold shrink-0">✦</span>
                    <span>Wholesale invoices provided on request</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#c9a84c] font-bold shrink-0">✦</span>
                    <span>Reorders get priority dispatch within 24 hours</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>Wholesale prices not applicable on individual/retail orders</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>No returns on wholesale orders — unless completely wrong product sent</span>
                  </li>
                </ul>
              </div>

              {/* Wholesale Delivery */}
              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-lg font-heading font-bold text-[#0f2444] border-b-2 border-slate-100 pb-3 mb-4">
                  <span className="p-1.5 rounded-lg bg-orange-50 text-orange-600"><Truck className="w-5 h-5" /></span>
                  Wholesale Delivery
                </div>
                <ul className="space-y-3.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#c9a84c] font-bold shrink-0">✦</span>
                    <span>Free delivery on all wholesale orders</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#c9a84c] font-bold shrink-0">✦</span>
                    <span>Dispatched within <strong>2–4 business days</strong> after payment confirmation</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#c9a84c] font-bold shrink-0">✦</span>
                    <span>Tracking shared on WhatsApp after dispatch</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#c9a84c] font-bold shrink-0">✦</span>
                    <span>Pan-India delivery — all major cities covered</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#c9a84c] font-bold shrink-0">✦</span>
                    <span>Securely packed — bulk shipments use reinforced packaging</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-400">
                    <span className="shrink-0 mt-0.5">›</span>
                    <span>Delivery: 3–5 days (Punjab/nearby), 7–12 days (rest of India)</span>
                  </li>
                </ul>
                <div className="mt-4 p-4 rounded-lg bg-orange-50 border-l-4 border-orange-500 flex gap-3 text-xs text-orange-900 leading-relaxed font-semibold">
                  <CameraIcon className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  <p>Wholesale buyers MUST record an unboxing video upon receiving the shipment. Any damage or shortage claims require video proof — no exceptions.</p>
                </div>
              </div>
            </div>

            {/* Wholesale Protection */}
            <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="flex items-center gap-2 text-lg font-heading font-bold text-[#0f2444] border-b-2 border-slate-100 pb-3">
                <span className="p-1.5 rounded-lg bg-red-50 text-red-600"><Lock className="w-5 h-5" /></span>
                Our Protection Policies — For Both Parties
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="space-y-2">
                  <p className="font-bold text-[#0f2444]">Protecting You (Reseller):</p>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>100% authentic products — all verified before dispatch</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>If wrong product sent — full replacement at our cost</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Transparent pricing — no hidden charges</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Dedicated WhatsApp support for wholesale clients</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Invoice & documentation provided for business records</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-[#0f2444]">Protecting Olinbuy:</p>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-slate-400 shrink-0 mt-0.5">›</span>
                      <span>Advance payment required for orders above ₹5,000</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-400 shrink-0 mt-0.5">›</span>
                      <span>No returns on wholesale unless wrong product sent</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-400 shrink-0 mt-0.5">›</span>
                      <span>Unboxing video mandatory for any complaint</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-400 shrink-0 mt-0.5">›</span>
                      <span>Orders confirmed only via WhatsApp — no verbal commitments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-400 shrink-0 mt-0.5">›</span>
                      <span>Unauthorized resale of Olinbuy-branded content prohibited</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Wholesale CTA */}
            <div className="bg-gradient-to-r from-[#1a0a00] via-[#451a03] to-[#92400e] rounded-xl p-8 text-center text-white relative overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(201,168,76,0.1),transparent_70%)]" />
              <h3 className="font-heading text-xl font-bold mb-2">Ready to Start Wholesale?</h3>
              <p className="text-slate-300 text-xs mb-5 max-w-md mx-auto leading-relaxed">
                WhatsApp us with your business details and product requirements. Our wholesale team responds within 4 hours.
              </p>
              <a 
                href="https://wa.me/919690914734?text=Hello%20Olinbuy!%20I%27m%20interested%20in%20your%20Wholesale%20Program.%20Please%20share%20details."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1da854] text-white px-8 py-3 rounded-lg text-sm font-bold shadow-lg hover:shadow-emerald-500/25 hover:translate-y-[-1px] transition-all"
              >
                <Phone className="w-4 h-4" /> 📲 Start Wholesale Inquiry
              </a>
              <div className="text-[10px] text-slate-400 mt-3.5">
                Mon–Sat · 10:00 AM – 8:00 PM · Wholesale team responds within 4 hours
              </div>
            </div>
          </div>
        )}

        {/* PRIVACY SECTION */}
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#1a1a0a] via-[#422006] to-[#92400e] rounded-xl p-8 text-white relative overflow-hidden shadow-md">
              <div className="absolute right-[-40px] top-[-40px] w-48 h-48 rounded-full bg-[#c9a84c]/5" />
              <div className="absolute right-[60px] bottom-[-60px] w-36 h-36 rounded-full bg-white/5" />
              <div className="inline-flex items-center gap-1.5 bg-[#c9a84c]/20 border border-[#c9a84c]/40 text-[#fde68a] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                ✦ Olinbuy Policy
              </div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold mb-2">Privacy Policy</h1>
              <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
                Olinbuy is committed to protecting your personal information. We explain clearly what we collect, why we collect it, and how we use it.
              </p>
              <div className="text-[11px] text-slate-400 mt-4">
                📅 Effective: June 2025 &nbsp;|&nbsp; Last Updated: June 2025
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* What We Collect */}
              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-lg font-heading font-bold text-[#0f2444] border-b-2 border-slate-100 pb-3 mb-4">
                  <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600"><FileText className="w-5 h-5" /></span>
                  What We Collect
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-slate-700 mb-1.5">Directly from you:</p>
                    <ul className="space-y-2 text-xs text-slate-655">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Name & WhatsApp number — for order processing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Delivery address — for shipping</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>UPI transaction ID — for payment verification only</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>WhatsApp chat history — for order records & support</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700 mb-1.5">Automatically from website:</p>
                    <ul className="space-y-2 text-xs text-slate-655">
                      <li className="flex items-start gap-2">
                        <span className="text-slate-400 shrink-0 mt-0.5">›</span>
                        <span>Device type & browser (website optimization)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-slate-400 shrink-0 mt-0.5">›</span>
                        <span>IP address & general location (security)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-slate-400 shrink-0 mt-0.5">›</span>
                        <span>Pages visited (to improve experience)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* How We Use It */}
              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-lg font-heading font-bold text-[#0f2444] border-b-2 border-slate-100 pb-3 mb-4">
                  <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600"><Lock className="w-5 h-5" /></span>
                  How We Use It
                </div>
                <ul className="space-y-3.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>To confirm, process, and deliver your orders</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>To send order updates & tracking via WhatsApp</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>To resolve returns, exchanges, or refund requests</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>To send offers & new arrivals — <strong>only with consent</strong></span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>To detect and prevent fraud</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>To comply with Indian laws and regulations</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>To improve our products and customer experience</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* When We Share Data */}
              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-lg font-heading font-bold text-[#0f2444] border-b-2 border-slate-100 pb-3 mb-4">
                  <span className="p-1.5 rounded-lg bg-orange-50 text-orange-600"><Check className="w-5 h-5" /></span>
                  When We Share Data
                </div>
                <p className="text-xs text-slate-600 mb-3.5">We share your data only when absolutely necessary:</p>
                <ul className="space-y-3.5 text-xs text-slate-600 mb-4">
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 shrink-0 mt-0.5">›</span>
                    <span><strong>Courier partners</strong> — name, address, phone only (for delivery)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 shrink-0 mt-0.5">›</span>
                    <span><strong>Payment processors</strong> — UPI platforms for secure transactions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 shrink-0 mt-0.5">›</span>
                    <span><strong>Legal requirements</strong> — Indian law, court order, or government authority</span>
                  </li>
                </ul>
                <div className="p-4 rounded-lg bg-rose-50 border-l-4 border-rose-500 flex gap-3 text-xs text-rose-900 leading-relaxed font-semibold">
                  <X className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <p>We NEVER sell, rent, or share your personal data with advertisers, marketers, or any unauthorized third party.</p>
                </div>
              </div>

              {/* What We Never Do */}
              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-lg font-heading font-bold text-[#0f2444] border-b-2 border-slate-100 pb-3 mb-4">
                  <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600"><X className="w-5 h-5" /></span>
                  What We Never Do
                </div>
                <ul className="space-y-3.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>Sell, rent, or trade your personal data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>Store card numbers, OTP, or banking credentials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>Send unsolicited SMS spam</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>Share your contact without permission</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>Use data beyond order fulfillment & service improvement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>Collect data from anyone under 18 years of age</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Your Rights */}
              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-lg font-heading font-bold text-[#0f2444] border-b-2 border-slate-100 pb-3 mb-4">
                  <span className="p-1.5 rounded-lg bg-amber-50 text-[#c9a84c]"><FileText className="w-5 h-5" /></span>
                  Your Rights
                </div>
                <ul className="space-y-3.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Know exactly what personal data we hold about you</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Request correction of inaccurate information</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Request complete deletion of your data</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Opt out of promotional messages anytime</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Lodge a complaint about our data practices</span>
                  </li>
                  <li className="flex items-start gap-2.5 border-t border-slate-50 pt-2 text-slate-500">
                    <span className="shrink-0 mt-0.5">›</span>
                    <span>To exercise any right — WhatsApp: <strong>+91 9690914734</strong></span>
                  </li>
                </ul>
              </div>

              {/* Website & Security */}
              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-lg font-heading font-bold text-[#0f2444] border-b-2 border-slate-100 pb-3 mb-4">
                  <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600"><Lock className="w-5 h-5" /></span>
                  Website & Security
                </div>
                <p className="text-xs text-[#475569] leading-relaxed mb-3">
                  Our website uses minimal browser localStorage to save cart items during your session only. This data stays on your device — nothing sent to our servers. No tracking cookies or ad pixels are used.
                </p>
                <p className="text-xs text-[#475569] leading-relaxed">
                  We take reasonable security precautions to protect your data. However, no internet transmission is 100% secure. We recommend not sharing sensitive personal information over any platform unnecessarily.
                </p>
                <div className="mt-4 p-4 rounded-lg bg-blue-50/70 border-l-4 border-blue-500 flex gap-3 text-xs text-blue-900 leading-relaxed font-semibold">
                  <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <p>This Privacy Policy may be updated periodically. Continued use of Olinbuy after changes means you accept the updated policy.</p>
                </div>
              </div>
            </div>

            {/* Privacy CTA */}
            <div className="bg-gradient-to-r from-[#1a1a0a] via-[#422006] to-[#92400e] rounded-xl p-8 text-center text-white relative overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(201,168,76,0.1),transparent_70%)]" />
              <h3 className="font-heading text-xl font-bold mb-2">Privacy Concern?</h3>
              <p className="text-slate-300 text-xs mb-5 max-w-md mx-auto leading-relaxed">
                Contact us to request data access, correction, or deletion. We respond within 24 hours.
              </p>
              <a 
                href="https://wa.me/919690914734?text=Hello%20Olinbuy!%20I%20have%20a%20privacy%20concern."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1da854] text-white px-8 py-3 rounded-lg text-sm font-bold shadow-lg hover:shadow-emerald-500/25 hover:translate-y-[-1px] transition-all"
              >
                <Phone className="w-4 h-4" /> 📲 Contact Us
              </a>
            </div>
          </div>
        )}

        {/* TERMS SECTION */}
        {activeTab === 'terms' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#0f0a1a] via-[#1e1b4b] to-[#312e81] rounded-xl p-8 text-white relative overflow-hidden shadow-md">
              <div className="absolute right-[-40px] top-[-40px] w-48 h-48 rounded-full bg-[#c9a84c]/5" />
              <div className="absolute right-[60px] bottom-[-60px] w-36 h-36 rounded-full bg-white/5" />
              <div className="inline-flex items-center gap-1.5 bg-[#c9a84c]/20 border border-[#c9a84c]/40 text-[#fde68a] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                ✦ Olinbuy Policy
              </div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold mb-2">Terms & Conditions</h1>
              <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
                By using Olinbuy's services or placing an order, you agree to these terms. They are fair and transparent for both parties.
              </p>
              <div className="text-[11px] text-slate-400 mt-4">
                📅 Effective: June 2025 &nbsp;|&nbsp; Governing Law: Punjab, India
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* About Olinbuy */}
              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-lg font-heading font-bold text-[#0f2444] border-b-2 border-slate-100 pb-3 mb-4">
                  <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600"><FileText className="w-5 h-5" /></span>
                  About Olinbuy
                </div>
                <ul className="space-y-3.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 shrink-0 mt-0.5">›</span>
                    <span>Olinbuy is an online retail store from Mohali, Punjab, India</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 shrink-0 mt-0.5">›</span>
                    <span>We sell skincare, cosmetics, men's & women's fashion, and wholesale products</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 shrink-0 mt-0.5">›</span>
                    <span>All orders confirmed via WhatsApp: <strong>+91 9690914734</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 shrink-0 mt-0.5">›</span>
                    <span>All prices in Indian Rupees (₹) inclusive of applicable taxes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 shrink-0 mt-0.5">›</span>
                    <span>We are an independent retailer — not affiliated with any specific brand</span>
                  </li>
                </ul>
              </div>

              {/* Product Authenticity */}
              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-lg font-heading font-bold text-[#0f2444] border-b-2 border-slate-100 pb-3 mb-4">
                  <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600"><Check className="w-5 h-5" /></span>
                  Product Authenticity
                </div>
                <ul className="space-y-3.5 text-xs text-slate-650">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>All products 100% authentic — sourced from verified vendors</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Every product verified before stocking</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Labeled with barcodes and batch numbers for traceability</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Quality-checked before every dispatch</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Sealed with Olinbuy packaging tape for security</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Terms */}
              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-lg font-heading font-bold text-[#0f2444] border-b-2 border-slate-100 pb-3 mb-4">
                  <span className="p-1.5 rounded-lg bg-orange-50 text-orange-600"><Package className="w-5 h-5" /></span>
                  Order Terms
                </div>
                <ul className="space-y-3.5 text-xs text-slate-655">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Orders confirmed only after WhatsApp acknowledgment</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Right to cancel orders if stock unavailable (full refund given)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Cancellation allowed before dispatch only</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>No cancellation once dispatched</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-slate-400 shrink-0 mt-0.5">›</span>
                    <span>Product images for reference — slight color variations possible</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>Bulk resale without Wholesale Agreement strictly prohibited</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-slate-400 shrink-0 mt-0.5">›</span>
                    <span>Olinbuy reserves right to refuse service at its discretion</span>
                  </li>
                </ul>
              </div>

              {/* Liability Limitations */}
              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-lg font-heading font-bold text-[#0f2444] border-b-2 border-slate-100 pb-3 mb-4">
                  <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600"><AlertTriangle className="w-5 h-5" /></span>
                  Liability Limitations
                </div>
                <p className="text-xs text-slate-705 mb-3 font-semibold">Olinbuy is not responsible for:</p>
                <ul className="space-y-3 text-xs text-slate-655 mb-4">
                  <li className="flex items-start gap-2.5">
                    <span className="text-slate-400 shrink-0 mt-0.5">›</span>
                    <span>Delays by courier partners or natural events</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-slate-400 shrink-0 mt-0.5">›</span>
                    <span>Damage from improper use by customer</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-slate-400 shrink-0 mt-0.5">›</span>
                    <span>Allergic reactions — always check ingredients before use</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-slate-400 shrink-0 mt-0.5">›</span>
                    <span>Non-delivery due to wrong address provided</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-slate-400 shrink-0 mt-0.5">›</span>
                    <span>Any indirect loss from use of our products</span>
                  </li>
                </ul>
                <div className="p-4 rounded-lg bg-orange-55 border-l-4 border-orange-500 flex gap-3 text-xs text-amber-900 leading-relaxed font-semibold">
                  <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  <p>For skincare & cosmetics — always do a patch test before full use. Consult a dermatologist if you have sensitive skin or known allergies.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Intellectual Property */}
              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-lg font-heading font-bold text-[#0f2444] border-b-2 border-slate-100 pb-3 mb-4">
                  <span className="p-1.5 rounded-lg bg-yellow-50 text-yellow-600"><FileText className="w-5 h-5" /></span>
                  Intellectual Property
                </div>
                <p className="text-xs text-slate-655 leading-relaxed">
                  All content on the Olinbuy website — including the Olinbuy name, logo, product descriptions, photography, and design — is the exclusive property of Olinbuy. Unauthorized copying, reproduction, or commercial use of any content is strictly prohibited and may result in legal action.
                </p>
              </div>

              {/* Changes & Jurisdiction */}
              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-lg font-heading font-bold text-[#0f2444] border-b-2 border-slate-100 pb-3 mb-4">
                  <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600"><Lock className="w-5 h-5" /></span>
                  Changes & Jurisdiction
                </div>
                <p className="text-xs text-[#475569] leading-relaxed mb-3.5">
                  Olinbuy reserves the right to update these Terms & Conditions at any time. The updated terms will be posted on this page with a revised effective date. Continued use of Olinbuy services after any update constitutes acceptance of the new terms.
                </p>
                <div className="p-4 rounded-lg bg-blue-50 border-l-4 border-blue-500 flex gap-3 text-xs text-blue-900 leading-relaxed font-semibold">
                  <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <p>Any disputes shall be subject to exclusive jurisdiction of courts in Mohali, Punjab, India. Indian law applies to all transactions.</p>
                </div>
              </div>
            </div>

            {/* Terms CTA */}
            <div className="bg-gradient-to-r from-[#0f0a1a] via-[#1e1b4b] to-[#312e81] rounded-xl p-8 text-center text-white relative overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(201,168,76,0.1),transparent_70%)]" />
              <h3 className="font-heading text-xl font-bold mb-2">Questions About Our Terms?</h3>
              <p className="text-slate-300 text-xs mb-5 max-w-md mx-auto leading-relaxed">
                We believe in full transparency. If anything is unclear, just ask — we'll explain it simply and honestly.
              </p>
              <a 
                href="https://wa.me/919690914734?text=Hello%20Olinbuy!%20I%20have%20a%20question%20about%20your%20terms."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1da854] text-white px-8 py-3 rounded-lg text-sm font-bold shadow-lg hover:shadow-emerald-500/25 hover:translate-y-[-1px] transition-all"
              >
                <Phone className="w-4 h-4" /> 📲 Ask Us Anything
              </a>
            </div>
          </div>
        )}

        {/* FAQ SECTION */}
        {activeTab === 'faq' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#0a1628] via-[#0f2444] to-[#1a3a6b] rounded-xl p-8 text-white relative overflow-hidden shadow-md">
              <div className="absolute right-[-40px] top-[-40px] w-48 h-48 rounded-full bg-[#c9a84c]/5" />
              <div className="absolute right-[60px] bottom-[-60px] w-36 h-36 rounded-full bg-white/5" />
              <div className="inline-flex items-center gap-1.5 bg-[#c9a84c]/20 border border-[#c9a84c]/40 text-[#fde68a] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                ✦ Quick Answers
              </div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold mb-2">Frequently Asked Questions</h1>
              <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
                Everything you need to know about Olinbuy — ordering, payments, delivery, returns, and wholesale.
              </p>
              <div className="text-[11px] text-slate-400 mt-4">
                📅 Updated: June 2025
              </div>
            </div>

            {/* Accordions */}
            <div className="space-y-6">
              {[
                {
                  category: "🛍️ About Olinbuy",
                  items: [
                    { q: "What is Olinbuy?", a: "Olinbuy is a trusted online fashion & beauty store from Mohali, Punjab. We sell skincare, cosmetics, men's & women's fashion, and wholesale products pan-India. All products are 100% authentic, quality-checked, and delivered fast.", id: 0 },
                    { q: "Are all products genuine?", a: "Yes, absolutely. We personally source, verify, and quality-check every product before dispatch. All items are sealed with Olinbuy packaging tape, labeled with batch numbers and barcodes for full traceability.", id: 1 },
                    { q: "How do I place an order?", a: "Simply WhatsApp us at +91 9690914734. Tell us the product name and your delivery address. We'll confirm availability, price, and process your order. Confirmation within 2–4 hours.", id: 2 }
                  ]
                },
                {
                  category: "💳 Payment",
                  items: [
                    { q: "What payment options are available?", a: "We accept: Cash on Delivery (COD), Partial COD (10% advance + 90% on delivery), Full UPI payment (Google Pay, PhonePe, Paytm, BHIM, WhatsApp Pay), and Bank Transfer for wholesale orders above ₹5,000.", id: 3 },
                    { q: "What is Partial COD and why is it needed?", a: "Partial COD means you pay just 10% advance online to confirm your order, and pay the remaining 90% cash when you receive delivery. This helps us confirm genuine orders, reduce fraud, and keep prices low for all customers.", id: 4 },
                    { q: "Is online payment safe?", a: "Yes. All UPI transactions are processed through RBI-regulated secure bank servers. We never store your card details, OTP, or banking credentials. We will NEVER ask for your OTP or ATM PIN — if anyone does, it's a scam.", id: 5 }
                  ]
                },
                {
                  category: "🚚 Delivery",
                  items: [
                    { q: "How long does delivery take?", a: "Mohali/Chandigarh: 2–3 business days. Punjab/Haryana: 3–5 days. Delhi/UP/HP: 4–7 days. Rest of India: 7–10 days. Remote areas: 10–12 days. Tracking shared via WhatsApp after dispatch.", id: 6 },
                    { q: "Is delivery free?", a: "Yes! Orders above ₹999 get free delivery pan-India. Below ₹999: ₹60 for online payment, ₹100 for COD. All wholesale orders (MOQ ₹2,000) always get free delivery.", id: 7 },
                    { q: "What if I miss the delivery?", a: "Courier will attempt delivery 3 times. If all attempts fail, the shipment returns to us. Contact us on WhatsApp to arrange re-delivery. Re-delivery charges may apply for COD orders.", id: 8 }
                  ]
                },
                {
                  category: "🔄 Returns & Refunds",
                  items: [
                    { q: "Can I return a product?", a: "Yes, within 3 days of delivery — for wrong product, damaged/defective product, or product significantly different from description only. Opened skincare/cosmetics cannot be returned due to hygiene policy.", id: 9 },
                    { q: "What is needed to process a return?", a: "You need: (1) Order ID, (2) Unboxing video showing Olinbuy seal, (3) Product photos with batch number clearly visible. WhatsApp these within 3 days of delivery. Claims without unboxing video will not be processed.", id: 10 },
                    { q: "How long does refund take?", a: "5–7 business days after we receive and inspect the returned product. COD refunds via UPI/bank transfer. Online payment refunds go to original payment source.", id: 11 }
                  ]
                },
                {
                  category: "📦 Wholesale",
                  items: [
                    { q: "How do I start wholesale with Olinbuy?", a: "WhatsApp us at +91 9690914734 with: your name, business type, and which products you're interested in. Our wholesale team responds within 4 hours with pricing and terms.", id: 12 },
                    { q: "What is the minimum wholesale order?", a: "Minimum order value is ₹2,000. Free delivery on all wholesale orders. Discounts range from 15% to 30% based on order value and category.", id: 13 },
                    { q: "Can I return wholesale orders?", a: "Wholesale orders are generally non-returnable. Exception: if completely wrong product is delivered — in that case, full replacement is provided at our cost. Unboxing video is mandatory for all wholesale claims.", id: 14 }
                  ]
                }
              ].map((cat, catIdx) => (
                <div key={catIdx} className="space-y-2.5">
                  <div className="font-heading text-lg font-bold text-[#0f2444] border-b-2 border-slate-100 pb-2 mb-3 mt-4">
                    {cat.category}
                  </div>
                  {cat.items.map((item) => {
                    const isOpen = openFaq === item.id;
                    return (
                      <div 
                        key={item.id} 
                        className="bg-white rounded-lg border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all"
                      >
                        <button
                          onClick={() => toggleFaq(item.id)}
                          className="w-full text-left p-4 text-xs md:text-sm font-bold text-slate-800 flex items-center justify-between gap-3 cursor-pointer select-none"
                        >
                          <span className="flex items-center gap-2"><span className="text-[#c9a84c] shrink-0">✦</span> {item.q}</span>
                          <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#c9a84c]' : ''}`} />
                        </button>
                        {isOpen && (
                          <div className="p-4 bg-[#fafbff] border-t border-slate-55 text-xs md:text-sm text-slate-600 leading-relaxed">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Still Have Questions CTA */}
            <div className="bg-gradient-to-r from-[#0a1628] via-[#0f2444] to-[#1a3a6b] rounded-xl p-8 text-center text-white relative overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(201,168,76,0.1),transparent_70%)]" />
              <h3 className="font-heading text-xl font-bold mb-2">Still Have Questions?</h3>
              <p className="text-slate-300 text-xs mb-5 max-w-md mx-auto leading-relaxed">
                We're happy to help with anything. WhatsApp us and we'll respond within 2 hours during business hours.
              </p>
              <a 
                href="https://wa.me/919690914734?text=Hello%20Olinbuy!%20I%20have%20a%2520question."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1da854] text-white px-8 py-3 rounded-lg text-sm font-bold shadow-lg hover:shadow-emerald-500/25 hover:translate-y-[-1px] transition-all"
              >
                <Phone className="w-4 h-4" /> 📲 WhatsApp: +91 9690914734
              </a>
              <div className="text-[10px] text-slate-400 mt-3.5">
                Mon–Sat · 10:00 AM – 8:00 PM · Sunday 11:00 AM – 6:00 PM
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER BOTTOM */}
      <footer className="bg-[#0f1921] py-5 border-t border-slate-900/60 text-center text-xs text-slate-500 select-none">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 Olinbuy — All rights reserved.</span>
          <span>Made in Mohali, Punjab, India 🇮🇳</span>
        </div>
      </footer>
    </div>
  );
}

// Custom camera icon to replace raw camera emoji or helper inline svg
function CameraIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

export default function PolicyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center font-bold text-slate-500 text-sm">
        Loading Policies...
      </div>
    }>
      <PolicyPageContent />
    </Suspense>
  );
}
