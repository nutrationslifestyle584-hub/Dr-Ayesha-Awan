import React, { useState, useEffect } from 'react';
import { EmergencyBanner } from './components/EmergencyBanner';
import { Header } from './components/Header';
import { ChatAssistant } from './components/ChatAssistant';
import { ClinicsCard } from './components/ClinicsCard';
import { ServicesGrid } from './components/ServicesGrid';
import { ImageAnalyzer } from './components/ImageAnalyzer';
import { FAQsSection } from './components/FAQsSection';
import { AppointmentsManager } from './components/AppointmentsManager';
import { WorkspaceTools } from './components/WorkspaceTools';
import { AppointmentModal } from './components/AppointmentModal';
import { AppointmentDetails } from './types';
import { DOCTOR_PROFILE } from './data/doctorData';
import { MessageSquare, Calendar, Phone, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [userLanguage, setUserLanguage] = useState<'english' | 'urdu'>('english');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [bookingInitialData, setBookingInitialData] = useState<Partial<AppointmentDetails> | undefined>(undefined);
  const [localAppointments, setLocalAppointments] = useState<AppointmentDetails[]>([]);

  // Load saved local appointments on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dr_ayesha_appointments');
      if (saved) {
        setLocalAppointments(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Could not load local appointments", e);
    }
  }, []);

  const handleOpenBookingModal = (clinicName?: string) => {
    setBookingInitialData(clinicName ? { preferredClinic: clinicName as any } : undefined);
    setIsBookingModalOpen(true);
  };

  const handleOpenBookingWithData = (data?: Partial<AppointmentDetails>) => {
    setBookingInitialData(data);
    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = (newBooking: AppointmentDetails) => {
    setLocalAppointments((prev) => {
      const updated = [newBooking, ...prev];
      try {
        localStorage.setItem('dr_ayesha_appointments', JSON.stringify(updated));
      } catch (e) {
        console.warn("Could not save appointment to localStorage", e);
      }
      return updated;
    });
  };

  const handleAskAIAboutService = (question: string) => {
    setActiveTab('chat');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Medical Safety Alert Banner */}
      <EmergencyBanner />

      {/* Main Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userLanguage={userLanguage}
        setUserLanguage={setUserLanguage}
        onOpenBookingModal={() => handleOpenBookingModal()}
      />

      {/* Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6">
        {activeTab === 'chat' && (
          <ChatAssistant
            userLanguage={userLanguage}
            onOpenAppointmentModalWithData={handleOpenBookingWithData}
          />
        )}

        {activeTab === 'clinics' && (
          <ClinicsCard onOpenBookingModal={handleOpenBookingModal} />
        )}

        {activeTab === 'services' && (
          <ServicesGrid onAskAIAboutService={handleAskAIAboutService} />
        )}

        {activeTab === 'analyzer' && (
          <ImageAnalyzer />
        )}

        {activeTab === 'faqs' && (
          <FAQsSection onAskAI={handleAskAIAboutService} />
        )}

        {activeTab === 'my-appointments' && (
          <AppointmentsManager
            localAppointments={localAppointments}
            onOpenBookingModal={() => handleOpenBookingModal()}
          />
        )}

        {activeTab === 'workspace' && (
          <WorkspaceTools localAppointments={localAppointments} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 px-4 text-xs text-slate-400 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
              DA
            </div>
            <div>
              <p className="font-bold text-slate-200">
                {DOCTOR_PROFILE.name} • {DOCTOR_PROFILE.title}
              </p>
              <p className="text-[11px] text-slate-400">
                Satellite Town & Canal Road, Bhalwal, Punjab
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-300">
            <button
              onClick={() => setActiveTab('clinics')}
              className="hover:text-emerald-400 transition-colors"
            >
              Morning & Evening Timings
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('services')}
              className="hover:text-emerald-400 transition-colors"
            >
              Dry Needling & Hijama
            </button>
            <span>•</span>
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="hover:text-emerald-400 transition-colors font-semibold text-emerald-400"
            >
              Book Appointment
            </button>
          </div>

          <p className="text-[11px] text-slate-500 text-center md:text-right">
            © {new Date().getFullYear()} Dr. Ayesha Awan AI Portal. All Rights Reserved.
          </p>
        </div>
      </footer>

      {/* Global Appointment Booking Modal */}
      <AppointmentModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        initialData={bookingInitialData}
        onSuccessBooking={handleBookingSuccess}
      />
    </div>
  );
}
