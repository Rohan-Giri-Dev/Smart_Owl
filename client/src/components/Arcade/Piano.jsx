import React, { useEffect, useState } from 'react';
import { playNote, initAudio } from '../../utils/audioSynth';

const KEYS = [
  { note: 'C', freq: 261.63, key: 'ArrowLeft', label: 'LEFT', color: 'bg-red-500' },
  { note: 'D', freq: 293.66, key: 'ArrowDown', label: 'DOWN', color: 'bg-orange-500' },
  { note: 'E', freq: 329.63, key: 'ArrowUp', label: 'UP', color: 'bg-yellow-500' },
  { note: 'F', freq: 349.23, key: 'ArrowRight', label: 'RIGHT', color: 'bg-green-500' },
  { note: 'G', freq: 392.00, key: ' ', label: 'SPACE', color: 'bg-blue-500' },
  { note: 'A', freq: 440.00, key: 'Click', label: 'CLICK', color: 'bg-purple-500' },
];

const Piano = () => {
  const [activeKey, setActiveKey] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent scrolling with arrows/space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      // Find matching key
      const keyData = KEYS.find(k => k.key === e.key);
      if (keyData) {
        if (activeKey !== keyData.note) { // Prevent repeat on hold
            playNote(keyData.freq);
            setActiveKey(keyData.note);
        }
      }
    };

    const handleKeyUp = () => setActiveKey(null);

    // Click handling (Makey Makey CLICK is usually literal mouse click, 
    // but sometimes mapped to a key. We'll assume Mouse Click on screen for now or a specific key if configured).
    // Makey Makey default "CLICK" is usually mapped to left mouse click.
    const handleMouseDown = () => {
        const keyData = KEYS.find(k => k.key === 'Click');
        playNote(keyData.freq);
        setActiveKey(keyData.note);
    };
    const handleMouseUp = () => setActiveKey(null);


    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp); // Global mouse up

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [activeKey]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 select-none" onClick={initAudio}>
      <h2 className="text-4xl font-bold mb-8 text-white tracking-widest">MAKEY PIANO</h2>
      <div className="flex gap-4">
        {KEYS.map((k) => (
          <div
            key={k.note}
            className={`
              w-24 h-64 border-4 border-slate-900 rounded-b-xl flex flex-col justify-end items-center pb-4 transition-all duration-75
              ${activeKey === k.note ? `${k.color} translate-y-2 shadow-inner` : 'bg-white shadow-xl hover:bg-slate-100'}
            `}
            onMouseDown={() => {
                // Visual feedback for clicking specific keys if using mouse manually
                playNote(k.freq);
                setActiveKey(k.note);
            }}
            onMouseUp={() => setActiveKey(null)}
          >
            <span className={`text-2xl font-bold ${activeKey === k.note ? 'text-white' : 'text-slate-800'}`}>{k.note}</span>
            <span className={`text-xs font-bold mt-2 ${activeKey === k.note ? 'text-white/80' : 'text-slate-400'}`}>{k.label}</span>
          </div>
        ))}
      </div>
      <p className="mt-8 text-slate-400 animate-pulse">Connect Makey Makey clips to controls above!</p>
    </div>
  );
};

export default Piano;
