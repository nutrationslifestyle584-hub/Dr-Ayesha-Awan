import React, { useState } from 'react';
import { SERVICES } from '../data/doctorData';
import { ServiceDetail } from '../types';
import { 
  Activity, 
  Sparkles, 
  MessageSquare, 
  Search, 
  CheckCircle2, 
  ShieldAlert, 
  HeartPulse, 
  Bone, 
  Trophy, 
  UserCheck, 
  Compass, 
  Zap, 
  Flame, 
  Syringe, 
  Stethoscope, 
  Bandage 
} from 'lucide-react';

interface ServicesGridProps {
  onAskAIAboutService: (serviceTitle: string) => void;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({ onAskAIAboutService }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Specialization', 'Therapy', 'Rehabilitation', 'Treatment'];

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity': return <Activity className="w-5 h-5 text-emerald-600" />;
      case 'Bone': return <Bone className="w-5 h-5 text-emerald-600" />;
      case 'Syringe': return <Syringe className="w-5 h-5 text-emerald-600" />;
      case 'Flame': return <Flame className="w-5 h-5 text-emerald-600" />;
      case 'Trophy': return <Trophy className="w-5 h-5 text-emerald-600" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-emerald-600" />;
      case 'Zap': return <Zap className="w-5 h-5 text-emerald-600" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-emerald-600" />;
      case 'HeartPulse': return <HeartPulse className="w-5 h-5 text-emerald-600" />;
      case 'Stethoscope': return <Stethoscope className="w-5 h-5 text-emerald-600" />;
      case 'Bandage': return <Bandage className="w-5 h-5 text-emerald-600" />;
      case 'UserCheck': return <UserCheck className="w-5 h-5 text-emerald-600" />;
      case 'Compass': return <Compass className="w-5 h-5 text-emerald-600" />;
      default: return <Activity className="w-5 h-5 text-emerald-600" />;
    }
  };

  const filteredServices = SERVICES.filter((s) => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (s.titleUrdu && s.titleUrdu.includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      {/* Title Header */}
      <div className="text-center space-y-2">
        <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          Clinical Treatments & Services
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
          Specialized Physiotherapy Programs
        </h2>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          Comprehensive physical therapy treatments offered by Dr. Ayesha Awan using modern non-invasive modalities, manual therapy, dry needling, and certified Hijama cupping.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search treatment (e.g. Dry needling, Sciatica)..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 shrink-0">
                  {getServiceIcon(service.iconName)}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                  {service.category}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900 leading-snug">
                  {service.title}
                </h3>
                {service.titleUrdu && (
                  <p className="text-xs text-emerald-700 font-medium mt-0.5" dir="rtl">
                    {service.titleUrdu}
                  </p>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {service.description}
              </p>

              {/* Key Benefits */}
              <div className="space-y-1 pt-1">
                <span className="text-[11px] font-semibold text-slate-700 block">
                  Key Patient Benefits:
                </span>
                <ul className="space-y-1">
                  {service.benefits.map((b, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4">
              <button
                onClick={() => onAskAIAboutService(`Can you explain ${service.title} treatment and how Dr. Ayesha Awan performs it?`)}
                className="w-full py-2 px-3 bg-slate-900 hover:bg-emerald-950 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ask AI Assistant About This</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
