import React from 'react';
import { CLINICS, DOCTOR_PROFILE } from '../data/doctorData';
import { MapPin, Clock, Phone, Calendar, ExternalLink, ShieldCheck, Sun, Moon } from 'lucide-react';

interface ClinicsCardProps {
  onOpenBookingModal: (clinicName?: string) => void;
}

export const ClinicsCard: React.FC<ClinicsCardProps> = ({ onOpenBookingModal }) => {
  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-6">
      {/* Intro Header */}
      <div className="text-center space-y-2">
        <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          Bhalwal Clinic Locations
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
          Dr. Ayesha Awan's Clinic Timings & Addresses
        </h2>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          Providing specialized physical therapy and orthopedic rehabilitation across Morning and Evening clinics in Bhalwal.
        </p>
      </div>

      {/* Grid of Clinics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {CLINICS.map((clinic) => {
          const isMorning = clinic.session === 'Morning';
          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            clinic.name + ' ' + clinic.address
          )}`;

          return (
            <div
              key={clinic.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-lg transition-all flex flex-col justify-between relative overflow-hidden"
            >
              {/* Top Accent Band */}
              <div
                className={`absolute top-0 left-0 right-0 h-2 ${
                  isMorning ? 'bg-amber-500' : 'bg-indigo-600'
                }`}
              />

              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 pt-1">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-2xl ${
                        isMorning ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'
                      }`}
                    >
                      {isMorning ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {clinic.session} Session
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 leading-tight">
                        {clinic.name}
                      </h3>
                    </div>
                  </div>

                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Active Practicing</span>
                  </span>
                </div>

                {/* Timing */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                    <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Clinic Timing: {clinic.timing}</span>
                  </div>
                  <p className="text-xs text-slate-500 pl-6">
                    Prior appointment recommended for minimal wait time.
                  </p>
                </div>

                {/* Address & Location */}
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900">{clinic.location}</strong>
                      <span className="text-slate-600">{clinic.address}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-100 mt-6 flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  onClick={() => onOpenBookingModal(clinic.name + ' (' + clinic.session + ')')}
                  className="w-full sm:flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book at {clinic.name}</span>
                </button>

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Google Maps</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Qualifications Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md">
        <h3 className="text-lg font-bold text-emerald-400 mb-3 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" />
          <span>Professional Qualifications & Certifications</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
          {DOCTOR_PROFILE.qualifications.map((qual, idx) => (
            <div key={idx} className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <span className="font-medium text-slate-200">{qual}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
