import React from 'react';
import { DOCTOR_PROFILE } from '../data/doctorData';
import { 
  MessageSquare, 
  Calendar, 
  MapPin, 
  Activity, 
  HelpCircle, 
  FileSearch, 
  ListOrdered,
  Globe,
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userLanguage: 'english' | 'urdu';
  setUserLanguage: (lang: 'english' | 'urdu') => void;
  onOpenBookingModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userLanguage,
  setUserLanguage,
  onOpenBookingModal
}) => {
  const whatsappUrl = `https://wa.me/${DOCTOR_PROFILE.whatsappNumber}?text=${encodeURIComponent(
    "Assalamu Alaikum Dr. Ayesha Awan's Clinic! I would like to inquire about physiotherapy services / appointment."
  )}`;

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      {/* Top Professional Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xl ring-2 ring-emerald-400/40 shadow-inner">
              DA
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse" title="AI Assistant Online 24/7" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-white" style={{ backgroundColor: '#1b1313' }}>
                {DOCTOR_PROFILE.name}
              </h1>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>AI Assistant</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              {DOCTOR_PROFILE.title} • <span className="text-emerald-400 font-normal inline-block text-center" style={{ textAlign: 'center' }}>DPT, MPPTA, OMPT</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end overflow-x-auto py-1">
          {/* Language Selector */}
          <button
            onClick={() => setUserLanguage(userLanguage === 'english' ? 'urdu' : 'english')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors shrink-0"
            title="Switch response language"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{userLanguage === 'english' ? 'Language: English' : 'زبان: اردو'}</span>
          </button>

          {/* Quick WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-sm shrink-0"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.762.459 3.481 1.332 4.993l-1.416 5.172 5.292-1.388c1.455.793 3.09 1.21 4.777 1.21h.005c5.507 0 9.99-4.478 9.99-9.985 0-2.667-1.038-5.176-2.924-7.062a9.92 9.92 0 0 0-7.066-2.926zm0 18.128h-.004a8.28 8.28 0 0 1-4.223-1.157l-.303-.18-3.138.823.837-3.059-.197-.314a8.27 8.27 0 0 1-1.267-4.388c0-4.568 3.717-8.284 8.288-8.284 2.213 0 4.293.863 5.858 2.428a8.23 8.23 0 0 1 2.427 5.858c0 4.569-3.717 8.285-8.278 8.285z"/>
            </svg>
            <span>WhatsApp Clinic</span>
          </a>

          {/* Direct Book Appointment Button */}
          <button
            onClick={onOpenBookingModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 transition-colors shadow-md shrink-0"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="max-w-7xl mx-auto px-2 overflow-x-auto scrollbar-none">
        <nav className="flex items-center gap-1 py-1.5 text-xs font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all shrink-0 ${
              activeTab === 'chat'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-300" />
            <span>AI Receptionist Chat</span>
          </button>

          <button
            onClick={() => setActiveTab('clinics')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all shrink-0 ${
              activeTab === 'clinics'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <MapPin className="w-4 h-4 text-emerald-300" />
            <span>Clinic Timings (Bhalwal)</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all shrink-0 ${
              activeTab === 'services'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-300" />
            <span>Services & Treatments</span>
          </button>

          <button
            onClick={() => setActiveTab('analyzer')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all shrink-0 ${
              activeTab === 'analyzer'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <FileSearch className="w-4 h-4 text-emerald-300" />
            <span>MRI / Posture Analyzer</span>
          </button>

          <button
            onClick={() => setActiveTab('faqs')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all shrink-0 ${
              activeTab === 'faqs'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-emerald-300" />
            <span>FAQs</span>
          </button>

          <button
            onClick={() => setActiveTab('my-appointments')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all shrink-0 ${
              activeTab === 'my-appointments'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <ListOrdered className="w-4 h-4 text-emerald-300" />
            <span>My Bookings</span>
          </button>

          <button
            onClick={() => setActiveTab('workspace')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all shrink-0 ${
              activeTab === 'workspace'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
            <span>Google Sheets & Chat Sync</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
