export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  image?: string; // Base64 or object URL
  isAppointmentPrompt?: boolean;
  appointmentData?: Partial<AppointmentDetails>;
}

export interface AppointmentDetails {
  id: string;
  fullName: string;
  age: string;
  gender: 'Male' | 'Female' | 'Other';
  phoneNumber: string;
  city: string;
  problemSymptoms: string;
  preferredClinic: 'Naveed Clinic (Morning)' | 'Al Rehman Hospital (Evening)';
  preferredDate: string;
  preferredTime: string;
  status: 'Pending Confirmation' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface ClinicInfo {
  id: string;
  name: string;
  session: 'Morning' | 'Evening';
  timing: string;
  location: string;
  address: string;
  phone: string;
  whatsapp: string;
  isAvailableNow?: boolean;
}

export interface ServiceDetail {
  id: string;
  title: string;
  titleUrdu?: string;
  category: 'Specialization' | 'Therapy' | 'Rehabilitation' | 'Treatment';
  description: string;
  benefits: string[];
  iconName: string;
}

export interface FAQItem {
  id: string;
  question: string;
  questionUrdu?: string;
  answer: string;
  category: string;
}
