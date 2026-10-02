import React, { useState, useEffect } from 'react';
import { AppointmentDetails } from '../types';
import { DOCTOR_PROFILE } from '../data/doctorData';
import { Calendar, Clock, MapPin, Send, CheckCircle2, User, Phone, RefreshCw } from 'lucide-react';

interface AppointmentsManagerProps {
  localAppointments: AppointmentDetails[];
  onOpenBookingModal: () => void;
}

export const AppointmentsManager: React.FC<AppointmentsManagerProps> = ({
  localAppointments,
  onOpenBookingModal
}) => {
  const [appointments, setAppointments] = useState<AppointmentDetails[]>(localAppointments);
  const [loading, setLoading] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/appointments');
      const data = await res.json();
      if (res.ok && data.appointments) {
        // Merge server appointments with local
        const merged = [...localAppointments];
        data.appointments.forEach((srvApp: AppointmentDetails) => {
          if (!merged.some((m) => m.id === srvApp.id)) {
            merged.push(srvApp);
          }
        });
        setAppointments(merged);
      }
    } catch (e) {
      console.warn("Could not sync server appointments", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setAppointments(localAppointments);
    fetchAppointments();
  }, [localAppointments]);

  const getWhatsAppShareUrl = (app: AppointmentDetails) => {
    const text = `*APPOINTMENT INQUIRY - DR. AYESHA AWAN CLINIC*
Ref ID: ${app.id}
Name: ${app.fullName} (${app.age} Y, ${app.gender})
Phone: ${app.phoneNumber}
City: ${app.city}
Clinic: ${app.preferredClinic}
Date & Time: ${app.preferredDate} at ${app.preferredTime}
Symptoms: ${app.problemSymptoms}

Assalamu Alaikum! Please confirm my booking status. Thank you.`;
    return `https://wa.me/${DOCTOR_PROFILE.whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Appointment Records</h2>
          <p className="text-xs text-slate-600">
            View your scheduled appointment requests for Dr. Ayesha Awan's Morning & Evening clinics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAppointments}
            disabled={loading}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Refresh appointments"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={onOpenBookingModal}
            className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>New Booking</span>
          </button>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">No appointments scheduled yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Book an appointment using our AI Assistant or fill out the appointment form for Dr. Ayesha Awan's clinics in Bhalwal.
          </p>
          <button
            onClick={onOpenBookingModal}
            className="mt-2 py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2 shadow-sm"
          >
            <span>Book Your First Appointment</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                      {app.id}
                    </span>
                    <span className="text-xs font-semibold text-slate-900">
                      {app.fullName}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Requested on {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{app.status || 'Confirmed'}</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">CLINIC</span>
                    <strong className="text-slate-800 font-semibold">{app.preferredClinic}</strong>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">DATE & TIME</span>
                    <strong className="text-slate-800 font-semibold">{app.preferredDate} ({app.preferredTime})</strong>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">PHONE</span>
                    <strong className="text-slate-800 font-semibold">{app.phoneNumber}</strong>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                <span className="text-slate-500 font-medium">Symptoms / Reason: </span>
                <span className="text-slate-800 italic">{app.problemSymptoms}</span>
              </div>

              <div className="flex justify-end pt-1">
                <a
                  href={getWhatsAppShareUrl(app)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Confirmation via WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
