'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface ProductFAQSectionProps {
  customFaqs?: FAQItem[];
  displayConfig?: boolean;
}

export default function ProductFAQSection({ customFaqs, displayConfig = true }: ProductFAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // If section display is disabled by admin OR no custom FAQs exist for product, hide section completely as fallback
  if (!displayConfig || !customFaqs || customFaqs.length === 0) {
    return null;
  }

  const faqs = customFaqs;

  return (
    <section className="mb-14">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-[#1a1c1d] font-heading">
        Frequently Asked Questions
      </h2>
      <div className="flex flex-col gap-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="bg-white p-4 rounded-xl border border-[#e2e2e3] cursor-pointer hover:bg-[#f5f6f7] transition-colors shadow-sm select-none"
            >
              <div className="flex justify-between items-center gap-3">
                <span className="font-bold text-base text-[#1a1c1d]">{faq.question}</span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-slate-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-500 shrink-0" />
                )}
              </div>
              {isOpen && (
                <div className="mt-3 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in duration-200">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
