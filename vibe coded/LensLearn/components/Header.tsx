import React from 'react';
import { Microscope, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Microscope size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">LensLearn</h1>
            <p className="text-xs text-slate-500 font-medium">AI Visual Educator</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full text-sm font-medium">
          <Sparkles size={16} />
          <span>Powered by Gemini</span>
        </div>
      </div>
    </header>
  );
};

export default Header;