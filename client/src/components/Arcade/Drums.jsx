import React, { useEffect, useState } from 'react';
import { playKick, playSnare, playHiHat, playTom, initAudio } from '../../utils/audioSynth';

const PADS = [
  { id: 'left', key: 'ArrowLeft', label: 'LEFT', sound: 'KICK', fn: playKick, color: 'bg-red-500' },
  { id: 'down', key: 'ArrowDown', label: 'DOWN', sound: 'SNARE', fn: playSnare, color: 'bg-orange-500' },
  { id: 'up', key: 'ArrowUp', label: 'UP', sound: 'HI-HAT', fn: playHiHat, color: 'bg-yellow-500' },
  { id: 'right', key: 'ArrowRight', label: 'RIGHT', sound: 'TOM', fn: playTom, color: 'bg-green-500' },
  { id: 'space', key: ' ', label: 'SPACE', sound: 'CRASH', fn: playHiHat, color: 'bg-blue-500' }, // Reusing hi-hat for space as filler for now
  { id: 'click', key: 'Click', label: 'CLICK', sound: 'COWBELL', fn: playSnare, color: 'bg-purple-500' }, // Reusing snare
];

const Drums = () => {
    const [activePad, setActivePad] = useState(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }
            const pad = PADS.find(p => p.key === e.key);
            if (pad) {
                if (activePad !== pad.id) {
                    pad.fn();
                    setActivePad(pad.id);
                }
            }
        };

        const handleKeyUp = () => setActivePad(null);

        // Click handling
        const handleMouseDown = () => {
             // Just trigger 'click' pad
             const pad = PADS.find(p => p.key === 'Click');
             pad.fn();
             setActivePad(pad.id);
        };
        const handleMouseUp = () => setActivePad(null);

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
    
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
          window.removeEventListener('keyup', handleKeyUp);
          window.removeEventListener('mousedown', handleMouseDown);
          window.removeEventListener('mouseup', handleMouseUp);
        };
      }, [activePad]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 select-none" onClick={initAudio}>
      <h2 className="text-4xl font-bold mb-8 text-white tracking-widest">MAKEY DRUMS</h2>
      
      <div className="grid grid-cols-3 gap-6 max-w-2xl">
        {/* Layout mimicking physical drum kit placement somewhat */}
        <div className="col-span-1 flex justify-center">
            <DrumPad pad={PADS.find(p => p.id === 'up')} active={activePad === 'up'} /> 
        </div>
        <div className="col-span-1 flex justify-center">
             {/* Empty or Tom */}
             <DrumPad pad={PADS.find(p => p.id === 'right')} active={activePad === 'right'} />
        </div>
        <div className="col-span-1 flex justify-center">
             {/* Crash/Space */}
             <DrumPad pad={PADS.find(p => p.id === 'space')} active={activePad === 'space'} />
        </div>

        <div className="col-span-1 flex justify-center">
             <DrumPad pad={PADS.find(p => p.id === 'left')} active={activePad === 'left'} />
        </div>
        <div className="col-span-1 flex justify-center">
             <DrumPad pad={PADS.find(p => p.id === 'down')} active={activePad === 'down'} />
        </div>
        <div className="col-span-1 flex justify-center">
             <DrumPad pad={PADS.find(p => p.id === 'click')} active={activePad === 'click'} />
        </div>
      </div>

      <p className="mt-8 text-slate-400 animate-pulse">Connect Makey Makey clips to controls!</p>
    </div>
  );
};

const DrumPad = ({ pad, active }) => (
    <div 
      className={`
        w-32 h-32 rounded-full border-4 border-slate-900 flex flex-col items-center justify-center transition-all duration-75
        ${active ? `${pad.color} scale-95 shadow-inner ring-4 ring-white/20` : 'bg-slate-200 shadow-xl hover:bg-slate-100'}
      `}
      onMouseDown={() => {
        pad.fn();
       // visual feedback handled by parent state for mouse click anyway
      }}
    >
       <span className={`text-xl font-black ${active ? 'text-white' : 'text-slate-800'}`}>{pad.sound}</span>
       <span className={`text-xs font-bold mt-1 ${active ? 'text-white/80' : 'text-slate-500'}`}>{pad.label}</span>
    </div>
);

export default Drums;
