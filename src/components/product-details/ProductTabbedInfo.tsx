'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Truck, FileText, Settings, Info, Star } from 'lucide-react';
import { Product, fetchShippingRates, ShippingRateOption } from '@/lib/api';

interface ProductTabbedInfoProps {
  product: Product;
}

export default function ProductTabbedInfo({ product }: ProductTabbedInfoProps) {
  // Accordion open/close states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    description: true,
    style: false,
    specs: false,
    additional: false,
    shipping: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

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

  const displayConfigs = product.display_configs || {
    top_highlights: true,
    about_this_item: true,
    additional_information: true,
    style_details: true,
    features_specs: true,
  };

  // Specs helper for alternating shading
  const renderKeyValueTable = (items: { key: string; value: string }[]) => {
    return (
      <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm text-left text-slate-800 border-collapse">
          <tbody>
            {items.map((item, idx) => (
              <tr
                key={idx}
                className="border-b border-slate-100 last:border-0 transition-colors hover:bg-slate-50/30 even:bg-slate-50/50"
              >
                <td className="px-5 py-3.5 font-bold text-slate-600 w-1/3 align-top min-h-[24px]">
                  {item.key}
                </td>
                <td className="px-5 py-3.5 text-slate-900 font-medium min-h-[24px]">
                  {item.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <section className="mb-14 space-y-3.5">
      {/* 1. In-Depth Description Accordion */}
      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
        <button
          onClick={() => toggleSection('description')}
          className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-base text-slate-800 hover:bg-slate-50 transition-colors select-none min-h-[48px]"
        >
          <span className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#00686f]" /> Product Narrative & Details
          </span>
          {openSections.description ? (
            <ChevronUp className="w-5 h-5 text-slate-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-500" />
          )}
        </button>
        {openSections.description && (
          <div className="px-6 pb-6 pt-2 text-sm text-slate-700 leading-relaxed space-y-3 border-t border-slate-100 animate-in fade-in duration-200">
            <p>
              {product.description ||
                'Experience next-level performance and design with OlinBuy. Built with premium materials to deliver maximum comfort, speed, and durability for daily use.'}
            </p>
          </div>
        )}
      </div>

      {/* 2. Style Accordion */}
      {displayConfigs.style_details && product.style_details && product.style_details.length > 0 && (
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
          <button
            onClick={() => toggleSection('style')}
            className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-base text-slate-800 hover:bg-slate-50 transition-colors select-none min-h-[48px]"
          >
            <span className="flex items-center gap-2">
              <Star className="w-5 h-5 text-[#00686f]" /> Style Configuration
            </span>
            {openSections.style ? (
              <ChevronUp className="w-5 h-5 text-slate-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-500" />
            )}
          </button>
          {openSections.style && (
            <div className="px-6 pb-6 pt-4 border-t border-slate-100 animate-in fade-in duration-200">
              {renderKeyValueTable(product.style_details)}
            </div>
          )}
        </div>
      )}

      {/* 3. Features & Specs Accordion */}
      {displayConfigs.features_specs && product.features_specs && product.features_specs.length > 0 && (
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
          <button
            onClick={() => toggleSection('specs')}
            className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-base text-slate-800 hover:bg-slate-50 transition-colors select-none min-h-[48px]"
          >
            <span className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#00686f]" /> Technical Features & Specifications
            </span>
            {openSections.specs ? (
              <ChevronUp className="w-5 h-5 text-slate-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-500" />
            )}
          </button>
          {openSections.specs && (
            <div className="px-6 pb-6 pt-4 border-t border-slate-100 animate-in fade-in duration-200">
              {renderKeyValueTable(product.features_specs)}
            </div>
          )}
        </div>
      )}

      {/* 4. Additional Info Accordion */}
      {displayConfigs.additional_information && product.additional_information && product.additional_information.length > 0 && (
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
          <button
            onClick={() => toggleSection('additional')}
            className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-base text-slate-800 hover:bg-slate-50 transition-colors select-none min-h-[48px]"
          >
            <span className="flex items-center gap-2">
              <Info className="w-5 h-5 text-[#00686f]" /> Additional Information
            </span>
            {openSections.additional ? (
              <ChevronUp className="w-5 h-5 text-slate-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-500" />
            )}
          </button>
          {openSections.additional && (
            <div className="px-6 pb-6 pt-4 border-t border-slate-100 animate-in fade-in duration-200">
              {renderKeyValueTable(product.additional_information)}
            </div>
          )}
        </div>
      )}

      {/* 5. Shipping & Fulfillment Accordion */}
      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
        <button
          onClick={() => toggleSection('shipping')}
          className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-base text-slate-800 hover:bg-slate-50 transition-colors select-none min-h-[48px]"
        >
          <span className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#00686f]" /> Shipping Options & Calculator
          </span>
          {openSections.shipping ? (
            <ChevronUp className="w-5 h-5 text-slate-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-500" />
          )}
        </button>
        {openSections.shipping && (
          <div className="px-6 pb-6 pt-4 border-t border-slate-100 space-y-4 animate-in fade-in duration-200 text-sm">
            <p className="text-xs text-slate-500">
              Enter your location details below to calculate exact shipping rates and estimated delivery times.
            </p>
            <form onSubmit={handleCalculateShipping} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Country</label>
                <input
                  type="text"
                  value={destCountry}
                  onChange={(e) => setDestCountry(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e2e2e3] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#ff6b00]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">State / Province</label>
                <input
                  type="text"
                  value={destState}
                  onChange={(e) => setDestState(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e2e2e3] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#ff6b00]"
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
                    className="w-full px-3 py-2 border border-[#e2e2e3] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#ff6b00]"
                    required
                  />
                  <button
                    type="submit"
                    disabled={calculating}
                    className="px-4 py-2 bg-[#FFA41C] hover:bg-[#FFB542] text-black font-bold text-xs rounded-lg transition-colors flex items-center justify-center shrink-0 disabled:opacity-50 min-h-[36px]"
                  >
                    Check
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
      </div>
    </section>
  );
}
