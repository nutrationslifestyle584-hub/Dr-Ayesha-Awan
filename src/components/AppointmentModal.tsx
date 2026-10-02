import React, { useState, useEffect } from 'react';
import { AppointmentDetails } from '../types';
import { CLINICS, DOCTOR_PROFILE } from '../data/doctorData';
import { X, Calendar, Clock, MapPin, User, Phone, CheckCircle2, Send, AlertCircle } from 'lucide-react';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<AppointmentDetails>;
  onSuccessBooking?: (booking: AppointmentDetails) => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSuccessBooking
}) => {
  const [formData, setFormData] = useState<Partial<AppointmentDetails>>({
    fullName: '',
    age: '',
    gender: 'Male',
    phoneNumber: '',
    city: 'Bhalwal',
    problemSymptoms: '',
    preferredClinic: 'Al Rehman Hospital (Evening)',
    preferredDate: new Date().toISOString().split('T')[0],
    preferredTime: '05:00 PM'
  });

  const [step, setStep] = useState<'form' | 'summary' | 'confirmed'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdBooking, setCreatedBooking] = useState<AppointmentDetails | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoToSummary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phoneNumber || !formData.problemSymptoms) {
      setError('Please fill in your Name, Phone Number, and Problem/Symptoms.');
      return;
    }
    setError(null);
    setStep('summary');
  };

  const handleConfirmAndSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit appointment.');
      }

      setCreatedBooking(data.appointment);
      setStep('confirmed');
      if (onSuccessBooking) {
        onSuccessBooking(data.appointment);
      }
    } catch (err: any) {
      setError(err?.message || 'Server connection issue. Please submit directly via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const getFormattedWhatsAppMessage = () => {
    const b = createdBooking || formData;
    return `*APPOINTMENT REQUEST - DR. AYESHA AWAN CLINIC*
----------------------------------------
👤 *Name:* ${b.fullName || 'N/A'}
🎂 *Age:* ${b.age || 'N/A'} | 🚻 *Gender:* ${b.gender || 'N/A'}
📞 *Phone:* ${b.phoneNumber || 'N/A'}
🏙️ *City:* ${b.city || 'Bhalwal'}
🏥 *Clinic:* ${b.preferredClinic || 'Naveed Clinic (Morning)'}
📅 *Preferred Date:* ${b.preferredDate || 'N/A'}
🕒 *Preferred Time:* ${b.preferredTime || 'N/A'}
🩺 *Symptoms / Problem:* ${b.problemSymptoms || 'Physiotherapy Consultation'}
----------------------------------------
Please confirm my appointment slot. Thank you!`;
  };

  const whatsappUrl = `https://wa.me/${DOCTOR_PROFILE.whatsappNumber}?text=${encodeURIComponent(
    getFormattedWhatsAppMessage()
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 rounded-xl text-white">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base md:text-lg leading-tight">
                Book Appointment
              </h3>
              <p className="text-xs text-emerald-400 font-medium">
                Dr. Ayesha Awan • Consultant Physiotherapist
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 'form' && (
            <form onSubmit={handleGoToSummary} className="space-y-4 text-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName || ''}
                    onChange={handleInputChange}
                    placeholder="e.g. Muhammad Ali"
                    required
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber || ''}
                    onChange={handleInputChange}
                    placeholder="e.g. 03001234567"
                    required
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age || ''}
                    onChange={handleInputChange}
                    placeholder="e.g. 35"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender || 'Male'}
                    onChange={handleInputChange}
                    className="w-full text-xs px-2 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city || ''}
                    onChange={handleInputChange}
                    placeholder="Bhalwal"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Clinic selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Clinic & Timing <span className="text-red-500">*</span>
                </label>
                <select
                  name="preferredClinic"
                  value={formData.preferredClinic || 'Al Rehman Hospital (Evening)'}
                  onChange={handleInputChange}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white font-medium text-slate-800"
                >
                  <option value="Al Rehman Hospital (Evening)">
                    ⭐ Al Rehman Hospital, Canal Road (Evening: 4:00 PM – 7:00 PM) - PREFERRED
                  </option>
                  <option value="Naveed Clinic (Morning)">
                    ☀️ Naveed Clinic, Satellite Town (Morning: 10:00 AM – 2:00 PM)
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate || ''}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Time Slot
                  </label>
                  <input
                    type="text"
                    name="preferredTime"
                    value={formData.preferredTime || ''}
                    onChange={handleInputChange}
                    placeholder="e.g. 11:30 AM or 05:00 PM"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Problem or Symptoms <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="problemSymptoms"
                  rows={2}
                  value={formData.problemSymptoms || ''}
                  onChange={handleInputChange}
                  placeholder="Describe your pain area or reason for visit (e.g., lower back pain, knee stiffness, dry needling inquiry)"
                  required
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md transition-colors flex items-center gap-1.5"
                >
                  <span>Review Details</span>
                </button>
              </div>
            </form>
          )}

          {step === 'summary' && (
            <div className="space-y-4 text-slate-800">
              <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-xl space-y-2 text-xs">
                <h4 className="font-bold text-emerald-950 text-sm border-b border-emerald-200/80 pb-2 flex items-center justify-between">
                  <span>Appointment Details Summary</span>
                  <span className="text-[10px] text-emerald-700 font-normal">Step 2 of 2</span>
                </h4>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-slate-500 block">Patient Name:</span>
                    <strong className="text-slate-900">{formData.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Phone Number:</span>
                    <strong className="text-slate-900">{formData.phoneNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Age & Gender:</span>
                    <strong className="text-slate-900">{formData.age || 'N/A'}, {formData.gender}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">City:</span>
                    <strong className="text-slate-900">{formData.city}</strong>
                  </div>
                </div>

                <div className="border-t border-emerald-200/60 pt-2">
                  <span className="text-slate-500 block">Selected Clinic:</span>
                  <strong className="text-emerald-900 font-semibold">{formData.preferredClinic}</strong>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-500 block">Requested Date:</span>
                    <strong className="text-slate-900">{formData.preferredDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Requested Time:</span>
                    <strong className="text-slate-900">{formData.preferredTime}</strong>
                  </div>
                </div>

                <div className="border-t border-emerald-200/60 pt-2">
                  <span className="text-slate-500 block">Problem / Symptoms:</span>
                  <p className="text-slate-800 italic">{formData.problemSymptoms}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={handleConfirmAndSubmit}
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Saving appointment...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Book Appointment</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => setStep('form')}
                    className="py-2 px-3 text-xs font-medium text-slate-600 hover:text-slate-900"
                  >
                    ← Edit Details
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send via WhatsApp Instead</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {step === 'confirmed' && createdBooking && (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-900">Appointment Saved!</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Booking Reference: <strong className="text-emerald-700">{createdBooking.id}</strong>
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl text-left text-xs space-y-1.5 border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient:</span>
                  <span className="font-semibold text-slate-800">{createdBooking.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Clinic:</span>
                  <span className="font-semibold text-emerald-800">{createdBooking.preferredClinic}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date & Time:</span>
                  <span className="font-semibold text-slate-800">{createdBooking.preferredDate} at {createdBooking.preferredTime}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500">
                Send this summary to Dr. Ayesha Awan's clinic on WhatsApp for instant confirmation.
              </p>

              <div className="pt-2 flex flex-col gap-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Confirmation to Clinic on WhatsApp</span>
                </a>

                <button
                  onClick={onClose}
                  className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Done & Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
