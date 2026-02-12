import React, { useState } from 'react';
import Piano from '../Arcade/Piano';
import Drums from '../Arcade/Drums';
import FlappyBird from '../Arcade/FlappyBird';
import WordWizard from '../Arcade/WordWizard';
import { Gamepad2, Music, ArrowLeft, Bird, Palette } from 'lucide-react';


const KidsPlayground = () => {
  const [game, setGame] = useState('menu'); // menu, piano, drums

  if (game === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-8 pb-32">
         {/* Fun Header */}
         <div className="text-center mb-12 animate-bounce-slow">
             <h1 className="text-6xl font-black text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.3)] tracking-wider transform -rotate-2">
                KIDS ZONE
             </h1>
             <div className="bg-white text-purple-600 px-6 py-2 rounded-full font-bold text-xl inline-block mt-4 shadow-xl transform rotate-1">
                Let's Play! 🚀
             </div>
         </div>
         
         {/* Game Cards */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
            <button 
              onClick={() => setGame('piano')}
              className="group relative bg-white rounded-[2rem] p-8 flex flex-col items-center gap-6 shadow-[0_10px_0_rgb(200,200,200)] active:shadow-none active:translate-y-[10px] transition-all overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-4 bg-blue-400"></div>
                <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Music className="w-16 h-16 text-blue-500" />
                </div>
                <div>
                    <h2 className="text-4xl font-black text-slate-800 mb-2">PIANO</h2>
                    <span className="text-slate-400 font-bold text-lg">Make some music! 🎵</span>
                </div>
            </button>

            <button 
              onClick={() => setGame('drums')}
              className="group relative bg-white rounded-[2rem] p-8 flex flex-col items-center gap-6 shadow-[0_10px_0_rgb(200,200,200)] active:shadow-none active:translate-y-[10px] transition-all overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-4 bg-orange-400"></div>
                <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Gamepad2 className="w-16 h-16 text-orange-500" />
                </div>
                <div>
                    <h2 className="text-4xl font-black text-slate-800 mb-2">DRUMS</h2>
                    <span className="text-slate-400 font-bold text-lg">Rock the beat! 🥁</span>
                </div>
            </button>

            <button 
              onClick={() => setGame('flappy')}
              className="group relative bg-white rounded-[2rem] p-8 flex flex-col items-center gap-6 shadow-[0_10px_0_rgb(200,200,200)] active:shadow-none active:translate-y-[10px] transition-all overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-4 bg-yellow-400"></div>
                <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Bird className="w-16 h-16 text-yellow-500" />
                </div>
                <div>
                    <h2 className="text-4xl font-black text-slate-800 mb-2">FLAPPY BIRD</h2>
                    <span className="text-slate-400 font-bold text-lg">Fly high! 🐦</span>
                </div>
            </button>

            <button 
              onClick={() => setGame('wizard')}
              className="group relative bg-white rounded-[2rem] p-8 flex flex-col items-center gap-6 shadow-[0_10px_0_rgb(200,200,200)] active:shadow-none active:translate-y-[10px] transition-all overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-4 bg-purple-400"></div>
                <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Palette className="w-16 h-16 text-purple-500" />
                </div>
                <div>
                    <h2 className="text-4xl font-black text-slate-800 mb-2">WORD WIZARD</h2>
                    <span className="text-slate-400 font-bold text-lg">Spell Magic! 🪄</span>
                </div>
            </button>
         </div>
      </div>
    );
  }

  // Game View
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
        {/* Kids Header */}
        <div className="p-6 flex justify-between items-center bg-slate-800 shadow-xl z-10">
            <button 
               onClick={() => setGame('menu')}
               className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-black flex items-center gap-2 px-6 py-3 rounded-full shadow-[0_4px_0_rgb(180,130,0)] active:shadow-none active:translate-y-[4px] transition-all"
            >
                <ArrowLeft className="w-6 h-6" /> BACK
            </button>
            <h2 className="text-3xl font-black text-white tracking-widest drop-shadow-lg">{game.toUpperCase()}</h2>
            <div className="w-24"></div> {/* Spacer */}
        </div>

        {/* Game Content */}
        <div className="flex-1 relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="relative z-10 h-full">
                {game === 'piano' && <Piano />}
                {game === 'drums' && <Drums />}
                {game === 'flappy' && <FlappyBird />}
                {game === 'wizard' && <WordWizard />}
            </div>
        </div>
    </div>
  );
};

export default KidsPlayground;
