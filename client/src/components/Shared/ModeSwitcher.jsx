import React from 'react';
import { User, Baby } from 'lucide-react';

const ModeSwitcher = ({ currentMode, setMode }) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800/90 backdrop-blur-xl border border-slate-700 p-2 rounded-full shadow-2xl z-[100] flex gap-2">
      <button 
        onClick={() => setMode('parent')}
        className={`px-6 py-3 rounded-full flex items-center gap-3 transition-all ${
           currentMode === 'parent' 
           ? 'bg-blue-600 text-white shadow-lg' 
           : 'text-slate-400 hover:text-white hover:bg-slate-700'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="font-bold text-sm">Parents</span>
      </button>

      <button 
        onClick={() => setMode('kid')}
        className={`px-6 py-3 rounded-full flex items-center gap-3 transition-all ${
           currentMode === 'kid' 
           ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg' 
           : 'text-slate-400 hover:text-white hover:bg-slate-700'
        }`}
      >
        <Baby className="w-5 h-5" />
        <span className="font-bold text-sm">Kids</span>
      </button>
    </div>
  );
};

export default ModeSwitcher;
