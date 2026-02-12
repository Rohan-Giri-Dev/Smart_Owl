import React, { useState } from 'react';
import Piano from './Piano';
import Drums from './Drums';
import { Gamepad2, Music, ArrowLeft } from 'lucide-react';

const ArcadeMode = ({ onExit }) => {
  const [game, setGame] = useState('menu'); // menu, piano, drums

  if (game === 'menu') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8">
         <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 mb-12 animate-bounce">
            MAKEY MAKEY ARCADE
         </h1>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
            <button 
              onClick={() => setGame('piano')}
              className="group bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 hover:border-blue-500 rounded-3xl p-8 flex flex-col items-center gap-6 transition-all transform hover:scale-105"
            >
                <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center group-hover:animate-spin">
                    <Music className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">PIANO</h2>
                <p className="text-slate-400 text-center">Play melodies using arrow keys and space!</p>
            </button>

            <button 
              onClick={() => setGame('drums')}
              className="group bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 hover:border-red-500 rounded-3xl p-8 flex flex-col items-center gap-6 transition-all transform hover:scale-105"
            >
                <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center group-hover:animate-pulse">
                    <Gamepad2 className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">DRUMS</h2>
                <p className="text-slate-400 text-center">Drop beats with your Makey Makey kit!</p>
            </button>
         </div>

         <button 
           onClick={onExit}
           className="mt-16 text-slate-500 hover:text-white flex items-center gap-2"
         >
            <ArrowLeft className="w-5 h-5" /> Back to Dashboard
         </button>
      </div>
    );
  }

  // Game View
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
        {/* Arcade Header */}
        <div className="p-4 flex justify-between items-center bg-slate-800/50 backdrop-blur">
            <button 
               onClick={() => setGame('menu')}
               className="text-white font-bold flex items-center gap-2 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600"
            >
                <ArrowLeft className="w-4 h-4" /> MENU
            </button>
            <h2 className="text-xl font-bold text-white tracking-[0.2em]">{game.toUpperCase()}</h2>
            <div className="w-20"></div> {/* Spacer */}
        </div>

        {/* Game Content */}
        <div className="flex-1">
            {game === 'piano' && <Piano />}
            {game === 'drums' && <Drums />}
        </div>
    </div>
  );
};

export default ArcadeMode;
