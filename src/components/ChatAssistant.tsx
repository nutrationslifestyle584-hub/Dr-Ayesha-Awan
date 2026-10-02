import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, AppointmentDetails } from '../types';
import { SAMPLE_PROMPTS, DOCTOR_PROFILE } from '../data/doctorData';
import { 
  Send, 
  Image as ImageIcon, 
  X, 
  Calendar, 
  Volume2, 
  Copy, 
  Check, 
  Mic, 
  MicOff, 
  Sparkles,
  Bot,
  User,
  Clock,
  RotateCcw,
  Zap
} from 'lucide-react';

interface ChatAssistantProps {
  userLanguage: 'english' | 'urdu';
  onOpenAppointmentModalWithData: (data?: Partial<AppointmentDetails>) => void;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({
  userLanguage,
  onOpenAppointmentModalWithData
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: userLanguage === 'urdu'
        ? "السلام علیکم! 😊\n\nڈاکٹر عائشہ اعوان (کنسلٹنٹ فزیوتھراپسٹ) کے کلینک میں خوش آمدید۔\n\nمیں ورچوئل اسسٹنٹ ہوں اور میں درج ذیل معاملات میں آپ کی مدد کر سکتی ہوں:\n\n✅ اپائنٹمنٹ بکنگ (بھلوال کلینک)\n✅ فزیوتھراپی علاج اور رہنمائی\n✅ کلینک کے اوقات اور معلومات\n✅ ڈرائے نیڈلنگ اور حجامہ تھراپی کے فوائد\n✅ ورزش اور پوسچر (بیٹھنے کا طریقہ) کی نصیحت\n\nآج میں آپ کی کیا مدد کر سکتی ہوں؟"
        : "Assalamu Alaikum! 😊\n\nWelcome to Dr. Ayesha Awan's Physiotherapy Clinic.\n\nI am the virtual receptionist and I am here to help you with:\n\n✅ Appointment booking (Bhalwal Clinics)\n✅ Physiotherapy treatment & exercise advice\n✅ Clinic timings & locations\n✅ Dry Needling & Hijama (Cupping) details\n✅ Neck, back, sciatica & joint pain guidance\n\nHow may I assist you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || input.trim();
    if (!messageText && !selectedImage) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageText,
      image: selectedImage || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setSelectedImage(null);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            sender: m.sender,
            text: m.text,
            image: m.image
          })),
          userLanguage
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      let replyText = data.text || "Thank you. How else can I assist you with Dr. Ayesha Awan's clinic?";

      // Parse appointment data tag if present
      let extractedAppointmentData: Partial<AppointmentDetails> | undefined = undefined;
      const appointmentMatch = replyText.match(/\[APPOINTMENT_DATA:\s*({.*?})\]/s);

      if (appointmentMatch && appointmentMatch[1]) {
        try {
          extractedAppointmentData = JSON.parse(appointmentMatch[1]);
          // Clean the hidden JSON tag from the displayed reply text
          replyText = replyText.replace(/\[APPOINTMENT_DATA:\s*({.*?})\]/s, '').trim();
        } catch (e) {
          console.warn("Could not parse appointment JSON tag", e);
        }
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        appointmentData: extractedAppointmentData
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: "I'm having trouble connecting to the clinic server. Please check your connection or book directly via WhatsApp.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*_#~]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("Voice input is not supported in this browser. Please type your query.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = userLanguage === 'urdu' ? 'ur-PK' : 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.start();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[550px] max-w-5xl mx-auto bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-800 my-2">
      {/* Assistant Status Bar */}
      <div className="bg-slate-950/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm ring-2 ring-emerald-500/30">
              DA
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
          </div>

          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Dr. Ayesha Awan - AI Receptionist</span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            </h2>
            <p className="text-[11px] text-slate-400">
              Consultant Physiotherapist • Bhalwal Clinics
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: 'welcome-reset',
                sender: 'assistant',
                text: "Assalamu Alaikum! 😊 How can I help you with Dr. Ayesha Awan's clinic today?",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ]);
          }}
          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors text-xs flex items-center gap-1"
          title="Reset conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Chat</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/60 scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white ${
                  isUser ? 'bg-teal-600' : 'bg-emerald-700'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-sm text-xs md:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-teal-600 text-white rounded-tr-none'
                    : 'bg-slate-800/90 border border-slate-700/80 text-slate-100 rounded-tl-none'
                }`}
              >
                {/* Attached Image inside message */}
                {msg.image && (
                  <div className="mb-2.5 rounded-xl overflow-hidden border border-slate-700/60">
                    <img
                      src={msg.image}
                      alt="Uploaded report or posture"
                      className="max-h-56 object-cover w-full"
                    />
                  </div>
                )}

                {/* Message Text with Markdown */}
                <div className="prose prose-invert prose-xs max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>

                {/* Interactive Appointment Card if detected */}
                {msg.appointmentData && (
                  <div className="mt-3.5 p-3.5 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-xs space-y-2 text-emerald-100">
                    <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2">
                      <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>Appointment Summary Prepared</span>
                      </span>
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        Ready to Book
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-200">
                      <div>Name: <strong className="text-white">{msg.appointmentData.fullName}</strong></div>
                      <div>Phone: <strong className="text-white">{msg.appointmentData.phoneNumber}</strong></div>
                      <div>Clinic: <strong className="text-emerald-300">{msg.appointmentData.preferredClinic}</strong></div>
                      <div>Date: <strong className="text-white">{msg.appointmentData.preferredDate} ({msg.appointmentData.preferredTime})</strong></div>
                    </div>

                    <button
                      onClick={() => onOpenAppointmentModalWithData(msg.appointmentData)}
                      className="w-full mt-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Click to Confirm & Finalize Appointment</span>
                    </button>
                  </div>
                )}

                {/* Footer Bar for Message */}
                <div
                  className={`mt-2 flex items-center justify-between text-[10px] ${
                    isUser ? 'text-teal-200' : 'text-slate-400 border-t border-slate-700/50 pt-1.5'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{msg.timestamp}</span>
                  </span>

                  {!isUser && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopyText(msg.id, msg.text)}
                        className="p-1 hover:text-white rounded transition-colors"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                      <button
                        onClick={() => handleSpeakText(msg.text)}
                        className="p-1 hover:text-white rounded transition-colors"
                        title="Read aloud"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2.5 text-slate-400 text-xs">
            <div className="w-8 h-8 rounded-full bg-emerald-800/80 flex items-center justify-center text-white">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700/70 px-4 py-3 rounded-2xl flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
              <span>Dr. Ayesha Awan's Virtual Assistant is typing...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="px-3 py-2 bg-slate-950/60 border-t border-slate-800 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-2">
        <span className="text-[11px] font-semibold text-slate-400 shrink-0">Quick Queries:</span>
        {SAMPLE_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt.text)}
            className="text-xs bg-slate-800 hover:bg-emerald-950 text-slate-200 hover:text-emerald-300 border border-slate-700/70 hover:border-emerald-500/50 px-3 py-1 rounded-full transition-all shrink-0 flex items-center gap-1"
          >
            <Zap className="w-3 h-3 text-emerald-400" />
            <span>{prompt.label}</span>
          </button>
        ))}
      </div>

      {/* Selected Image Attachment Preview */}
      {selectedImage && (
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={selectedImage}
              alt="Attachment preview"
              className="w-10 h-10 object-cover rounded-lg border border-emerald-500/50"
            />
            <div>
              <p className="text-xs font-semibold text-white">Image attached</p>
              <p className="text-[10px] text-slate-400">Will be analyzed alongside your query</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedImage(null)}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input Form */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* File input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors shrink-0"
            title="Attach Posture or Report Photo"
          >
            <ImageIcon className="w-4 h-4 text-emerald-400" />
          </button>

          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`p-2.5 rounded-xl border transition-colors shrink-0 ${
              isListening
                ? 'bg-red-600/20 text-red-400 border-red-500/50 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
            }`}
            title="Voice Speech Typing"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-400" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              userLanguage === 'urdu'
                ? "یہاں اپنا سوال یا اپائنٹمنٹ کی تفصیل لکھیں..."
                : "Type message or ask about appointments, timings, dry needling..."
            }
            className="flex-1 bg-slate-800/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs md:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/80"
          />

          <button
            type="submit"
            disabled={(!input.trim() && !selectedImage) || loading}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold transition-colors shadow-md shrink-0 flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
