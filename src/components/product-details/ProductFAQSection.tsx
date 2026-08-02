'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface ProductFAQSectionProps {
  customFaqs?: FAQItem[];
}

export default function ProductFAQSection({ customFaqs }: ProductFAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const defaultFaqs: FAQItem[] = [
    {
      question: 'How long does the battery last on a single charge?',
      answer:
        'Equipped with a high-density graphene battery, it provides up to 45 miles of range under standard operating conditions. Rapid charging allows for 80% capacity in just 30 minutes.',
    },
    {
      question: 'Is it legal to use on city sidewalks and bike lanes?',
      answer:
        'Local regulations vary by region. Standard personal transporter speed limits (typically under 15 mph) apply. Please verify local municipal guidelines.',
    },
    {
      question: 'What is the weight capacity and maximum payload?',
      answer:
        'The structural frame is tested to safely support dynamic loads up to 300 lbs (136 kg) while maintaining full stability and equilibrium.',
    },
  ];

  const faqs = customFaqs && customFaqs.length > 0 ? customFaqs : defaultFaqs;

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
