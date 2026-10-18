import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-10 px-4 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-base">PrepMate AI</span>
          <span className="text-xs text-slate-500">| Complete AI Interview Prep Platform</span>
        </div>

        <div className="flex items-center gap-1 text-xs text-slate-400">
          <span>Engineered with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 mx-1" />
          <span>using React, Node.js, MongoDB & Gemini AI</span>
        </div>

        <div className="text-xs text-slate-500">
          © {new Date().getFullYear()} PrepMate AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
