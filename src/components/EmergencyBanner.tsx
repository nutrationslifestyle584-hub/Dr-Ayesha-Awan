import React, { useState } from 'react';
import { AlertTriangle, X, PhoneCall } from 'lucide-react';

export const EmergencyBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-900 px-4 py-2.5 text-xs md:text-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="p-1 bg-amber-500/20 rounded-full text-amber-700 shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </span>
          <p className="leading-tight">
            <strong className="font-semibold text-amber-950">Medical Safety Notice:</strong> For severe symptoms such as chest pain, difficulty breathing, stroke signs, or heavy trauma, please visit the nearest Emergency Room immediately.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="tel:1122"
            className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white px-2.5 py-1 rounded-md transition-colors"
          >
            <PhoneCall className="w-3 h-3" />
            <span>Rescue 1122</span>
          </a>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 hover:bg-amber-500/20 rounded-md text-amber-800 transition-colors"
            title="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
