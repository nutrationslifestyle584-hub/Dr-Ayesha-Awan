import { ClinicInfo, FAQItem, ServiceDetail } from '../types';

export const DOCTOR_PROFILE = {
  name: "Dr. Ayesha Awan",
  title: "Consultant Physiotherapist",
  qualifications: [
    "Doctor of Physical Therapy (DPT)",
    "Member Pakistan Physical Therapy Association (MPPTA)",
    "Orthopedic Manual Physiotherapist (OMPT)",
    "Certified Dry Needling Practitioner",
    "Certified Cupping Therapy Practitioner",
    "Certified Kinesiology Taping Practitioner"
  ],
  experience: "Consultant Specialist in Musculoskeletal & Neurological Rehabilitation",
  phone: "0322-5475456",
  whatsappNumber: "923225475456",
  email: "drayeshaawan.physio@gmail.com",
  about: "Dr. Ayesha Awan is a highly qualified Consultant Physiotherapist specializing in musculoskeletal disorders, post-surgical orthopedic rehabilitation, sports injuries, non-surgical spine care, women's health, dry needling, and therapeutic Hijama/cupping at Al Rehman Hospital."
};

export const CLINICS: ClinicInfo[] = [
  {
    id: "evening-alrehman",
    name: "Al Rehman Hospital",
    session: "Evening",
    timing: "4:00 PM – 7:00 PM",
    location: "Canal Road, Opposite THQ Hospital, Bhalwal",
    address: "Canal Road, Opposite THQ Hospital, Bhalwal, Punjab",
    phone: "0322-5475456",
    whatsapp: "923225475456"
  },
  {
    id: "morning-naveed",
    name: "Naveed Clinic",
    session: "Morning",
    timing: "10:00 AM – 2:00 PM",
    location: "Satellite Town, Bhalwal",
    address: "Main Boulevard, Satellite Town, Bhalwal, Punjab",
    phone: "0322-5475456",
    whatsapp: "923225475456"
  }
];

export const SERVICES: ServiceDetail[] = [
  {
    id: "musculoskeletal",
    title: "Musculoskeletal Physiotherapy",
    titleUrdu: "پٹھوں اور جوڑوں کا فزیوتھراپی علاج",
    category: "Specialization",
    description: "Specialized non-invasive evaluation and physical management for muscle stiffness, ligament strain, tendonitis, joint pain, and structural alignment issues.",
    benefits: ["Pain reduction", "Restored joint mobility", "Reduced inflammation", "Muscle strength restoration"],
    iconName: "Activity"
  },
  {
    id: "orthopedic-rehab",
    title: "Orthopedic Rehabilitation",
    titleUrdu: "آرتھوپیڈک بحالی",
    category: "Rehabilitation",
    description: "Tailored rehabilitation programs for fractures, ligament tears, cartilage repairs, and bone-related conditions.",
    benefits: ["Targeted muscle re-conditioning", "Weight-bearing transition guidance", "Full range of motion"],
    iconName: "Bone"
  },
  {
    id: "dry-needling",
    title: "Dry Needling Therapy",
    titleUrdu: "ڈرائے نیڈلنگ تھراپی",
    category: "Therapy",
    description: "Insertion of thin monofilament needles directly into myofascial trigger points to release deeply knotted muscles, alleviate neuropathic pain, and restore muscle function.",
    benefits: ["Immediate trigger point release", "Deep knot relief", "Accelerated healing response"],
    iconName: "Syringe"
  },
  {
    id: "cupping-hijama",
    title: "Cupping Therapy (Hijama)",
    titleUrdu: "حجامہ / کپنگ تھراپی",
    category: "Therapy",
    description: "Certified therapeutic cupping (dry & wet Hijama) to boost local blood circulation, release fascial restrictions, remove toxins, and relieve systemic muscle fatigue.",
    benefits: ["Enhanced tissue perfusion", "Muscle detoxification", "Deep relaxation & pain relief"],
    iconName: "Flame"
  },
  {
    id: "sports-rehab",
    title: "Sports Injury Rehabilitation",
    titleUrdu: "کھیلوں کی چوٹوں کا علاج",
    category: "Rehabilitation",
    description: "Evidence-based therapy for athletes suffering from ankle sprains, ACL/MCL injuries, tennis elbow, shoulder impingement, and hamstring pulls.",
    benefits: ["Fast return to play", "Injury prevention conditioning", "Neuromuscular stability"],
    iconName: "Trophy"
  },
  {
    id: "neck-back-pain",
    title: "Neck & Back Pain Treatment",
    titleUrdu: "گردن اور کمر کے درد کا علاج",
    category: "Treatment",
    description: "Comprehensive care for cervical spondylosis, lumbar muscle strain, postural disc compressions, and chronic lumbar fatigue.",
    benefits: ["Spinal decompression guidance", "Postural re-education", "Core stabilization"],
    iconName: "Sparkles"
  },
  {
    id: "sciatica-slipdisc",
    title: "Sciatica & Slip Disc Rehabilitation",
    titleUrdu: "عرق النساء (سیاٹیکا) اور ڈسک کا علاج",
    category: "Treatment",
    description: "Targeted non-surgical mechanical therapy and nerve gliding exercises to relieve leg radiation, disc nerve compression, and sciatic discomfort.",
    benefits: ["Nerve pressure relief", "Pain centralization", "Preventive core exercises"],
    iconName: "Zap"
  },
  {
    id: "frozen-shoulder",
    title: "Frozen Shoulder (Adhesive Capsulitis)",
    titleUrdu: "کندھے کا جام ہونا (فروزن شولڈر)",
    category: "Treatment",
    description: "Specialized manual joint mobilization, stretching protocols, and modalities to loosen tight shoulder joint capsules.",
    benefits: ["Overhead movement restoration", "Night pain reduction", "Capsular flexibility"],
    iconName: "ShieldAlert"
  },
  {
    id: "knee-hip-pain",
    title: "Knee, Shoulder & Hip Joint Care",
    titleUrdu: "گھٹنے، کندھے اور کولہے کا درد",
    category: "Treatment",
    description: "Targeted muscular stabilization and unloading exercises for knee osteoarthritis, rotator cuff stiffness, and hip joint bursitis.",
    benefits: ["Improved walking gait", "Joint lubrication stimulation", "Reduced grinding pain"],
    iconName: "HeartPulse"
  },
  {
    id: "post-surgical",
    title: "Post-Surgical Rehabilitation",
    titleUrdu: "آپریشن کے بعد کی فزیوتھراپی",
    category: "Rehabilitation",
    description: "Guided recovery protocols after knee replacement, hip arthroplasty, spine surgery, rotator cuff repair, and fracture fixations.",
    benefits: ["Scar tissue management", "Safe functional mobility restoration", "DVT prevention"],
    iconName: "Stethoscope"
  },
  {
    id: "kinesiology-taping",
    title: "Kinesiology Taping",
    titleUrdu: "کائینسیولوجی ٹیپنگ",
    category: "Therapy",
    description: "Application of flexible elastic neuromuscular tape to provide soft tissue support, reduce local edema, and enhance proprioception.",
    benefits: ["Dynamic joint support", "Lymphatic drainage boost", "Micro-circulation assistance"],
    iconName: "Bandage"
  },
  {
    id: "womens-health",
    title: "Women's Health Physiotherapy",
    titleUrdu: "خواتین کی صحت کی فزیوتھراپی",
    category: "Specialization",
    description: "Empathetic, confidential physical care for ante-natal/post-natal back pain, pelvic floor muscle conditioning, and postural corrections.",
    benefits: ["Pelvic floor strengthening", "Post-pregnancy recovery", "Safe exercise prescription"],
    iconName: "UserCheck"
  },
  {
    id: "posture-gait",
    title: "Posture Correction & Gait Training",
    titleUrdu: "پوسچر (بیٹھنے اٹھنے کا طریقہ) اور چال کی اصلاح",
    category: "Rehabilitation",
    description: "Ergonomic assessment, bio-mechanical alignment check, and re-education walking drills for desk workers and elderly patients.",
    benefits: ["Ergonomic pain prevention", "Balance improvement", "Reduced fall risk in elderly"],
    iconName: "Compass"
  }
];

export const FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "What is physiotherapy and how can Dr. Ayesha Awan help me?",
    questionUrdu: "فزیوتھراپی کیا ہے اور ڈاکٹر عائشہ اعوان میری کس طرح مدد کر سکتی ہیں؟",
    answer: "Physiotherapy is an evidence-based healthcare discipline that uses manual therapy, targeted exercises, electrotherapy modalities, and physical techniques to treat movement disorders, relieve pain, and restore body function without relying heavily on drugs or invasive surgery.",
    category: "General"
  },
  {
    id: "faq-2",
    question: "What is Dry Needling? Is dry needling painful?",
    questionUrdu: "ڈرائے نیڈلنگ کیا ہے؟ کیا اس میں درد ہوتا ہے؟",
    answer: "Dry Needling involves inserting hair-thin sterile monofilament needles into tight muscle trigger points (knots). Most patients feel a tiny prick or brief muscular twitch. It provides rapid relief for stubborn muscle spasms and chronic tension.",
    category: "Treatments"
  },
  {
    id: "faq-3",
    question: "What is Cupping Therapy (Hijama)?",
    questionUrdu: "کپنگ تھراپی (حجامہ) کیا ہے؟",
    answer: "Cupping therapy (Hijama) creates suction on specific muscular regions to increase micro-circulation, relax stiff fascial tissues, flush metabolic waste, and relieve deep fatigue. Dr. Ayesha Awan is a certified practitioner following strict hygienic standards.",
    category: "Treatments"
  },
  {
    id: "faq-4",
    question: "How many physiotherapy sessions will I require?",
    questionUrdu: "مجھے فزیوتھراپی کے کتنے سیشنز کی ضرورت ہوگی؟",
    answer: "The number of sessions depends on your specific diagnosis, condition severity, and body response. Acute pain may improve in 3 to 6 sessions, while complex post-surgical or neurological conditions may require a structured 2 to 4 week program.",
    category: "Appointments"
  },
  {
    id: "faq-5",
    question: "How long is each treatment session?",
    questionUrdu: "ایک سیشن کا دورانیہ کتنا ہوتا ہے؟",
    answer: "Each standard physiotherapy treatment session typically lasts between 30 to 45 minutes, tailored to your treatment plan.",
    category: "Appointments"
  },
  {
    id: "faq-6",
    question: "Can physiotherapy help me avoid surgery?",
    questionUrdu: "کیا فزیوتھراپی کے ذریعے سرجری سے بچا جا سکتا ہے؟",
    answer: "In many cases of slip disc, mild-to-moderate knee osteoarthritis, sciatica, and shoulder impingement, structured physical therapy strengthens surrounding musculature and decompresses joints, helping patients manage pain and avoid surgery.",
    category: "General"
  },
  {
    id: "faq-7",
    question: "Do you treat elderly patients and children?",
    questionUrdu: "کیا آپ بزرگوں اور بچوں کا علاج بھی کرتی ہیں؟",
    answer: "Yes! Dr. Ayesha Awan provides customized, gentle geriatric physical therapy (for joint stiffness, balance, and gait) and pediatric postural/rehabilitative care.",
    category: "General"
  },
  {
    id: "faq-8",
    question: "What are Dr. Ayesha Awan's clinic timings in Bhalwal?",
    questionUrdu: "ڈاکٹر عائشہ اعوان کے کلینک کے اوقات کیا ہیں؟",
    answer: "Morning Clinic (10:00 AM – 2:00 PM) at Naveed Clinic, Satellite Town, Bhalwal. Evening Clinic (4:00 PM – 7:00 PM) at Al Rehman Hospital, Canal Road, Opposite THQ Hospital, Bhalwal.",
    category: "Clinic Info"
  },
  {
    id: "faq-9",
    question: "How can I book an appointment with Dr. Ayesha Awan?",
    questionUrdu: "میں ڈاکٹر عائشہ اعوان سے اپائنٹمنٹ کیسے بک کر سکتا/سکتی ہوں؟",
    answer: "You can book directly using our AI Receptionist on this app, fill out the Appointment Booking Form, or click 'Send via WhatsApp' to message the clinic directly with your preferred time and details.",
    category: "Appointments"
  }
];

export const SAMPLE_PROMPTS = [
  { text: "📅 Book an appointment for back pain", label: "Book Appointment", icon: "Calendar" },
  { text: "🕒 What are Dr. Ayesha Awan's clinic timings in Bhalwal?", label: "Clinic Timings", icon: "Clock" },
  { text: "⚡ What is Dry Needling and is it painful?", label: "Dry Needling Info", icon: "Zap" },
  { text: "🍃 What are the benefits of Cupping Therapy (Hijama)?", label: "Hijama Therapy", icon: "Sparkles" },
  { text: "🩺 I have severe Sciatica & Leg pain, how can physio help?", label: "Sciatica Help", icon: "HeartPulse" },
  { text: "اردو میں بات کریں - مجھے کندھے میں درد کا علاج بتائیں", label: "Urdu Consultation", icon: "Globe" },
  { text: "📷 Upload my X-Ray / Posture photo for analysis", label: "Analyze Image / Report", icon: "Camera" }
];
