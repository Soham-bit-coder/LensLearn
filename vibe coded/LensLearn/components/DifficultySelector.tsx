import React from 'react';
import { DifficultyLevel } from '../types';
import { Baby, School, BrainCircuit } from 'lucide-react';

interface DifficultySelectorProps {
  selected: DifficultyLevel;
  onChange: (level: DifficultyLevel) => void;
  disabled: boolean;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ selected, onChange, disabled }) => {
  const levels: { id: DifficultyLevel; label: string; icon: React.ReactNode }[] = [
    { id: 'Beginner', label: 'Beginner', icon: <Baby size={18} /> },
    { id: 'Intermediate', label: 'Intermediate', icon: <School size={18} /> },
    { id: 'Advanced', label: 'Advanced', icon: <BrainCircuit size={18} /> },
  ];

  return (
    <div className="flex flex-col gap-2 w-full animate-fade-in">
      <label className="text-sm font-semibold text-slate-700 ml-1">Explanation Level</label>
      <div className="flex p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
        {levels.map((level) => (
          <button
            key={level.id}
            onClick={() => onChange(level.id)}
            disabled={disabled}
            className={`
              flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
              ${selected === level.id 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }
              ${disabled && 'opacity-50 cursor-not-allowed'}
            `}
          >
            {level.icon}
            <span className="hidden sm:inline">{level.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DifficultySelector;