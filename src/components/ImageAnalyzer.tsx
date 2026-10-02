import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Camera, Upload, AlertCircle, Sparkles, CheckCircle2, RotateCcw, FileText } from 'lucide-react';

export const ImageAnalyzer: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisType, setAnalysisType] = useState<string>('Posture Alignment');
  const [promptNotes, setPromptNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image file is too large. Please upload an image under 10MB.');
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          promptText: promptNotes,
          analysisType
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze image');
      }

      setAnalysisResult(data.analysis);
    } catch (err: any) {
      setError(err?.message || 'Failed to complete analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          AI Vision Assistant
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
          Posture & Medical Image Evaluation
        </h2>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Upload a posture photo, painful joint area, X-Ray, or MRI scan for preliminary visual physical therapy guidance powered by Dr. Ayesha Awan's Virtual Assistant.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-md">
        {/* Upload Column */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Evaluation Category
            </label>
            <select
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50"
            >
              <option value="Posture Alignment">Posture & Spinal Alignment Check</option>
              <option value="X-Ray or MRI Report">X-Ray / MRI Report Photo</option>
              <option value="Swollen or Pain Area">Pain / Swelling / Injury Area Photo</option>
              <option value="Prescription / Notes">Doctor's Prescription / Notes</option>
            </select>
          </div>

          {/* Upload Dropzone */}
          <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center bg-slate-50 transition-colors relative">
            {selectedImage ? (
              <div className="space-y-3">
                <img
                  src={selectedImage}
                  alt="Uploaded image"
                  className="max-h-60 mx-auto object-contain rounded-xl border border-slate-200"
                />
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setAnalysisResult(null);
                  }}
                  className="text-xs text-red-600 hover:underline flex items-center justify-center gap-1 mx-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Remove / Choose Another Image</span>
                </button>
              </div>
            ) : (
              <label className="cursor-pointer block space-y-2">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Click to upload photo
                  </span>
                  <span className="text-[11px] text-slate-500">
                    PNG, JPG, or WEBP up to 10MB
                  </span>
                </div>
                <input
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Additional Notes or Pain Symptoms (Optional)
            </label>
            <textarea
              rows={2}
              value={promptNotes}
              onChange={(e) => setPromptNotes(e.target.value)}
              placeholder="e.g. I feel sharp lower back pain when bending forward..."
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none bg-slate-50"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!selectedImage || loading}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Analyzing image with Gemini Vision...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Evaluate Image Now</span>
              </>
            )}
          </button>
        </div>

        {/* Results Column */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>AI Evaluation Report</span>
            </h3>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {analysisResult ? (
              <div className="prose prose-xs max-w-none text-slate-800 leading-relaxed overflow-y-auto max-h-[380px] pr-2">
                <ReactMarkdown>{analysisResult}</ReactMarkdown>
              </div>
            ) : (
              <div className="text-center py-12 space-y-2 text-slate-400">
                <Camera className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-medium">
                  Upload an image on the left and click "Evaluate Image Now".
                </p>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Note: AI analysis is for educational and ergonomic guidance and does not replace a physical clinical assessment by Dr. Ayesha Awan.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500">
            <strong className="text-slate-700">Safety Standard:</strong> All uploads are processed securely server-side and deleted after analysis.
          </div>
        </div>
      </div>
    </div>
  );
};
