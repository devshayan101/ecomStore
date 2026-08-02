'use client';

import React, { useState } from 'react';
import { CheckCircle, Truck, Package, ShieldCheck, Calculator, Loader2 } from 'lucide-react';
import { Product, fetchShippingRates, ShippingRateOption } from '@/lib/api';

interface ProductTabbedInfoProps {
  product: Product;
}

export default function ProductTabbedInfo({ product }: ProductTabbedInfoProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'shipping'>('details');

  // Shipping calculator state
  const [destCountry, setDestCountry] = useState('India');
  const [destState, setDestState] = useState('Punjab');
  const [destPostcode, setDestPostcode] = useState('141001');
  const [calculating, setCalculating] = useState(false);
  const [rates, setRates] = useState<ShippingRateOption[] | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const handleCalculateShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    setCalculating(true);
    setCalcError(null);
    try {
      const fetchedRates = await fetchShippingRates({
        destCountry,
        destState,
        destPostcode,
        totalWeight: 500,
        subtotal: product.variants?.[0]?.price || 1000,
      });
      setRates(fetchedRates);
    } catch (err: any) {
      setCalcError(err.message || 'Unable to calculate shipping rates.');
    } finally {
      setCalculating(false);
    }
  };

  const defaultBullets = [
    'Aerospace-grade carbon fiber body construction',
    'Dual high-efficiency quiet performance motors',
    'Integrated smart dashboard & live connectivity',
    'Frictionless equilibrium levitation technology',
  ];

  return (
    <section className="mb-14">
      {/* Tab Header Navigation */}
      <div className="flex border-b border-[#e2e2e3] gap-8 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('details')}
          className={`pb-3 font-bold text-sm transition-colors border-b-2 cursor-pointer ${
            activeTab === 'details'
              ? 'border-[#ff6b00] text-[#ff6b00]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Product Details
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('specs')}
          className={`pb-3 font-bold text-sm transition-colors border-b-2 cursor-pointer ${
            activeTab === 'specs'
              ? 'border-[#ff6b00] text-[#ff6b00]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Technical Specs
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('shipping')}
          className={`pb-3 font-bold text-sm transition-colors border-b-2 cursor-pointer ${
            activeTab === 'shipping'
              ? 'border-[#ff6b00] text-[#ff6b00]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Shipping Info
        </button>
      </div>

      {/* Tab 1: Product Details */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
          <div className="flex flex-col gap-4">
            <p className="text-base leading-relaxed text-slate-800">
              {product.description ||
                'Experience next-level performance and design with OlinBuy. Built with premium materials to deliver maximum comfort, speed, and durability for daily use.'}
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Designed for reliability and style, this device transitions seamlessly across environments while maintaining top performance and durability.
            </p>
            <ul className="mt-2 flex flex-col gap-2.5">
              {defaultBullets.map((bullet, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm font-medium text-slate-800">
                  <CheckCircle className="w-4 h-4 text-[#00686f] shrink-0" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl overflow-hidden bg-[#f0f1f2] border border-[#e2e2e3] aspect-[4/3] relative">
            <img
              src={
                product.images?.[1] ||
                product.images?.[0] ||
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'
              }
              alt={`${product.name} schematic view`}
              className="w-full h-full object-cover opacity-90"
            />
          </div>
        </div>
      )}

      {/* Tab 2: Technical Specs */}
      {activeTab === 'specs' && (
        <div className="bg-white border border-[#e2e2e3] rounded-xl p-6 shadow-sm animate-in fade-in duration-300">
          <h3 className="text-base font-bold text-slate-900 mb-4">Product Specifications</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">SKU</span>
              <span className="font-semibold text-slate-900">{product.variants?.[0]?.sku || product._id.slice(-8)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Category</span>
              <span className="font-semibold text-slate-900">{product.category_id || 'Electronics'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Warranty</span>
              <span className="font-semibold text-slate-900">2-Year Limited Global</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Chassis Material</span>
              <span className="font-semibold text-slate-900">Carbon Fiber / Aircraft Grade</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Battery Life</span>
              <span className="font-semibold text-slate-900">Up to 45 Miles</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Status</span>
              <span className="font-semibold text-[#00686f] capitalize">{product.status || 'Active'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Shipping Info */}
      {activeTab === 'shipping' && (
        <div className="bg-white border border-[#e2e2e3] rounded-xl p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#00686f]" /> Shipping Options & Calculator
            </h3>
            <p className="text-xs text-slate-500">
              Enter your location details to calculate exact delivery costs and estimated arrival dates.
            </p>
          </div>

          <form onSubmit={handleCalculateShipping} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Country</label>
              <input
                type="text"
                value={destCountry}
                onChange={(e) => setDestCountry(e.target.value)}
                className="w-full px-3 py-2 border border-[#e2e2e3] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#ff6b00]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">State / Province</label>
              <input
                type="text"
                value={destState}
                onChange={(e) => setDestState(e.target.value)}
                className="w-full px-3 py-2 border border-[#e2e2e3] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#ff6b00]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Postal Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={destPostcode}
                  onChange={(e) => setDestPostcode(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e2e2e3] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#ff6b00]"
                  required
                />
                <button
                  type="submit"
                  disabled={calculating}
                  className="px-4 py-2 bg-[#FFA41C] hover:bg-[#FFB542] text-black font-bold text-xs rounded-lg transition-colors flex items-center justify-center shrink-0 disabled:opacity-50"
                >
                  {calculating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Check'}
                </button>
              </div>
            </div>
          </form>

          {rates && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase text-slate-500">Available Rates</h4>
              <div className="grid grid-cols-1 gap-2">
                {rates.map((rate) => (
                  <div
                    key={rate.id}
                    className="flex justify-between items-center p-3 rounded-lg border border-slate-200 bg-[#f5f6f7]"
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-900">{rate.name}</div>
                      <div className="text-[11px] text-slate-500">{rate.deliveryTime || '2-4 business days'}</div>
                    </div>
                    <div className="font-bold text-sm text-[#a04100]">
                      {rate.price === 0 ? 'FREE' : `$${rate.price}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {calcError && (
            <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100">{calcError}</p>
          )}
        </div>
      )}
    </section>
  );
}
