import React, { useState } from 'react';
import { FAQS } from '../data/doctorData';
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageSquare } from 'lucide-react';

interface FAQsSectionProps {
  onAskAI: (question: string) => void;
}

export const FAQsSection: React.FC<FAQsSectionProps> = ({ onAskAI }) => {
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showUrdu, setShowUrdu] = useState<boolean>(false);

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (faq.questionUrdu && faq.questionUrdu.includes(searchQuery))
  );

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      <div className="text-center space-y-2">
        <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          Frequently Asked Questions
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
          Patient FAQ & Treatment Information
        </h2>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Get clear, accurate answers about physiotherapy treatments, dry needling, cupping, clinic timings, and appointment procedures.
        </p>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs (e.g., dry needling, sessions, surgery)..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <button
          onClick={() => setShowUrdu(!showUrdu)}
          className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
        >
          {showUrdu ? 'Show Questions in English' : 'سوالات اردو میں دیکھیں'}
        </button>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600 shrink-0">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs md:text-sm text-slate-900">
                      {faq.question}
                    </h3>
                    {showUrdu && faq.questionUrdu && (
                      <p className="text-xs text-emerald-700 font-medium mt-0.5" dir="rtl">
                        {faq.questionUrdu}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-slate-400 p-1">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-4 pt-1 text-xs md:text-sm text-slate-600 border-t border-slate-100 bg-slate-50/50 space-y-3">
                  <p className="leading-relaxed">{faq.answer}</p>
                  <div className="flex justify-end">
                    <button
                      onClick={() => onAskAI(`I want to ask more details about: ${faq.question}`)}
                      className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Ask AI Receptionist for more details</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
