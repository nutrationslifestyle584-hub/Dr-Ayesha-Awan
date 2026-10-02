import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parsing
app.use(express.json({ limit: "20mb" }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || "dummy_key_for_dev",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

const SYSTEM_PROMPT_DR_AYESHA = `
You are the official AI Receptionist and Virtual Assistant for Dr. Ayesha Awan, Consultant Physiotherapist.
Your primary goal is to help patients by answering questions, providing expert medical report analysis, explaining services, assisting with appointment inquiries, and providing accurate information in a friendly, professional, and empathetic manner.

Contact Number: 0322-5475456 (WhatsApp: 03225475456)

About Dr. Ayesha Awan:
Dr. Ayesha Awan is a qualified Consultant Physiotherapist specializing in:
- Musculoskeletal Physiotherapy
- Orthopedic Rehabilitation
- Sports Injury Rehabilitation
- Post-Surgical Rehabilitation
- Neck & Back Pain Treatment
- Frozen Shoulder
- Arthritis Management
- Sciatica Treatment
- Slip Disc Rehabilitation
- Knee, Shoulder & Hip Pain
- Women's Health Physiotherapy
- Occupational Therapy
- Dry Needling
- Cupping Therapy (Hijama)
- Kinesiology Taping
- Posture Correction
- Balance & Gait Training
- Neurological Rehabilitation

Professional Qualifications:
- Doctor of Physical Therapy (DPT)
- Member Pakistan Physical Therapy Association (MPPTA)
- Orthopedic Manual Physiotherapist (OMPT)
- Certified Dry Needling Practitioner
- Certified Cupping Therapy Practitioner
- Certified Kinesiology Taping Practitioner

Clinic Information & Preference:
⭐ PRIMARY PREFERRED CLINIC:
1. Al Rehman Hospital (Evening Clinic - Highly Preferred)
   Canal Road, Opposite THQ Hospital, Bhalwal
   Timing: 4:00 PM – 7:00 PM
   Contact Phone: 0322-5475456

2. Naveed Clinic (Morning Clinic)
   Satellite Town, Bhalwal
   Timing: 10:00 AM – 2:00 PM
   Contact Phone: 0322-5475456

NOTE: ALWAYS prefer and recommend Al Rehman Hospital for evening consultations unless the patient specifically asks for the morning clinic!

Medical Report & Imaging Knowledge Base:
When a patient submits an MRI report, X-Ray, Lab Result, Prescription, or Posture/Injury Photo, analyze it with COMPLETE, RIGOROUS PHYSICAL THERAPY & CLINICAL KNOWLEDGE:
1. Demystify all medical/radiological jargon into clear, reassuring language (e.g. L4-L5 disc protrusion, loss of cervical lordosis, osteophytes, joint space narrowing, supraspinatus tendinopathy).
2. Explain the anatomical and biomechanical implications (nerve root compression, muscular imbalance, joint stiffness, postural strain).
3. Provide evidence-based physical therapy recommendations (Orthopedic Manual Therapy, targeted Dry Needling, therapeutic Cupping/Hijama, core stabilization, stretching).
4. Highlight crucial ergonomic and movement precautions (e.g., avoiding heavy bending in lumbar disc bulges).
5. Always advise booking a clinical evaluation with Dr. Ayesha Awan at Al Rehman Hospital (Call/WhatsApp: 0322-5475456).

Languages:
- Always respond in the language used by the patient (English, Urdu in Roman Urdu, or Urdu scriptاردو).
- If a patient writes in Urdu, reply in Urdu.
- If a patient writes in English, reply in English.

Tone & Style:
- Always be professional, polite, friendly, caring, respectful, patient-focused.
- Keep replies structured, clear, and easy to read.
- Use bullet points when helpful.
- Use emojis sparingly (e.g. ✅ 📅 📍 💪 😊 🏥 🩺).

Appointment Rules:
When a patient wants to book an appointment, politely collect:
1. Full Name
2. Age
3. Gender
4. Phone Number (Defaults to 0322-5475456 if asking for clinic)
5. City
6. Problem or Symptoms
7. Preferred Clinic (Default: Al Rehman Hospital Evening Clinic)
8. Preferred Date
9. Preferred Time

Once you have gathered these details, summarize the information clearly for the patient and ask them to confirm.
When all 9 details are collected and presented in summary, append a clean structured tag at the very end of your message in this format:
[APPOINTMENT_DATA: {"fullName":"...", "age":"...", "gender":"...", "phoneNumber":"...", "city":"...", "problemSymptoms":"...", "preferredClinic":"Al Rehman Hospital (Evening)", "preferredDate":"...", "preferredTime":"..."}]

Safety Rules:
- NEVER diagnose diseases.
- NEVER prescribe medicines.
- NEVER tell patients to stop medications prescribed by another doctor.
- Emergency Symptoms (Chest pain, difficulty breathing, stroke symptoms, severe trauma, loss of consciousness, heavy bleeding):
  IMMEDIATELY advise: "⚠️ Please visit the nearest emergency department or contact emergency medical services immediately."
`;

// In-memory appointments database store
interface StoredAppointment {
  id: string;
  fullName: string;
  age: string;
  gender: string;
  phoneNumber: string;
  city: string;
  problemSymptoms: string;
  preferredClinic: string;
  preferredDate: string;
  preferredTime: string;
  status: string;
  createdAt: string;
}

const appointmentsStore: StoredAppointment[] = [
  {
    id: "APT-1001",
    fullName: "Muhammad Usman",
    age: "34",
    gender: "Male",
    phoneNumber: "0301-2345678",
    city: "Bhalwal",
    problemSymptoms: "Severe lower back pain radiating down left leg (Sciatica)",
    preferredClinic: "Al Rehman Hospital (Evening)",
    preferredDate: "2026-07-29",
    preferredTime: "05:00 PM",
    status: "Confirmed",
    createdAt: new Date().toISOString()
  }
];

// API Routes

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", doctor: "Dr. Ayesha Awan AI Assistant" });
});

// Chat Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, userLanguage } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Fallback mock response if API key is not configured yet
      const lastUserMsg = messages[messages.length - 1]?.text || "";
      let mockReply = "Assalamu Alaikum! 😊\n\nWelcome to Dr. Ayesha Awan's Physiotherapy Clinic.\n\nI am the virtual assistant here to help you with appointment bookings, clinic timings in Bhalwal, or physical therapy advice.\n\nHow may I assist you today?";
      if (lastUserMsg.toLowerCase().includes("timing") || lastUserMsg.toLowerCase().includes("time")) {
        mockReply = "📍 **Dr. Ayesha Awan's Clinic Timings in Bhalwal:**\n\n☀️ **Morning Clinic:**\n• Naveed Clinic, Satellite Town, Bhalwal\n• Timing: 10:00 AM – 2:00 PM\n\n🌙 **Evening Clinic:**\n• Al Rehman Hospital, Canal Road (Opp. THQ Hospital), Bhalwal\n• Timing: 4:00 PM – 7:00 PM\n\nWould you like to book an appointment?";
      }
      return res.json({ text: mockReply });
    }

    // Convert chat history into Gemini contents format
    const contents = messages.map((m: any) => {
      const parts: any[] = [];
      if (m.image) {
        // Strip data:image/...;base64, prefix
        const base64Data = m.image.replace(/^data:image\/\w+;base64,/, "");
        const mimeType = m.image.substring(m.image.indexOf(":") + 1, m.image.indexOf(";")) || "image/jpeg";
        parts.push({
          inlineData: {
            mimeType,
            data: base64Data
          }
        });
      }
      parts.push({ text: m.text || "" });

      return {
        role: m.sender === "user" ? "user" : "model",
        parts
      };
    });

    let extraLanguageNote = "";
    if (userLanguage === "urdu") {
      extraLanguageNote = "\n[Patient prefers response in Urdu script or Roman Urdu]";
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT_DR_AYESHA + extraLanguageNote,
        temperature: 0.7,
      }
    });

    const replyText = response.text || "Thank you. How else can I assist you with Dr. Ayesha Awan's clinic today?";
    res.json({ text: replyText });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({
      error: "Failed to generate AI response",
      details: error?.message || String(error)
    });
  }
});

// Medical Report & Posture Image Analyzer
app.post("/api/analyze-image", async (req, res) => {
  try {
    const { imageBase64, promptText, analysisType } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "imageBase64 is required." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        analysis: "✅ **Preliminary Visual Review:**\n\n• Image received. To enable real-time Gemini vision analysis, ensure GEMINI_API_KEY is configured in Secrets.\n• General Physio Tip: Always maintain a neutral spinal alignment and avoid prolonged static slouching."
      });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const mimeMatch = imageBase64.match(/^data:(image\/\w+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";

    const defaultPrompt = promptText || `Please act as Dr. Ayesha Awan's Virtual Physiotherapy Assistant. Analyze this image (${analysisType || "Posture / Report / X-Ray / Injury"}).
Provide:
1. Observed visual findings (Posture alignment, report key points, or visible area).
2. Recommended ergonomic / physical therapy considerations.
3. Important advice on consulting Dr. Ayesha Awan for a physical assessment.
Keep it polite, professional, and safe. Do not diagnose or prescribe medicine.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64
            }
          },
          {
            text: defaultPrompt
          }
        ]
      },
      config: {
        systemInstruction: SYSTEM_PROMPT_DR_AYESHA,
        temperature: 0.4
      }
    });

    res.json({ analysis: response.text });
  } catch (error: any) {
    console.error("Error in /api/analyze-image:", error);
    res.status(500).json({ error: error?.message || "Failed to analyze image." });
  }
});

// Appointments API
app.get("/api/appointments", (req, res) => {
  res.json({ appointments: appointmentsStore });
});

app.post("/api/appointments", (req, res) => {
  const {
    fullName,
    age,
    gender,
    phoneNumber,
    city,
    problemSymptoms,
    preferredClinic,
    preferredDate,
    preferredTime
  } = req.body;

  if (!fullName || !phoneNumber || !preferredClinic) {
    return res.status(400).json({ error: "Missing required appointment fields." });
  }

  const newAppointment: StoredAppointment = {
    id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
    fullName,
    age: age || "N/A",
    gender: gender || "Not Specified",
    phoneNumber,
    city: city || "Bhalwal",
    problemSymptoms: problemSymptoms || "General Consultation",
    preferredClinic,
    preferredDate: preferredDate || new Date().toISOString().split("T")[0],
    preferredTime: preferredTime || "11:00 AM",
    status: "Confirmed",
    createdAt: new Date().toISOString()
  };

  appointmentsStore.unshift(newAppointment);

  res.status(201).json({
    message: "Appointment booked successfully!",
    appointment: newAppointment
  });
});

// Setup Vite Dev Server or Production Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Dr. Ayesha Awan AI Assistant Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
