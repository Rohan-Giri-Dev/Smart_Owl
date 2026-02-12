import React, { useState, useEffect, useRef } from 'react';

// 4-Letter Words only
const WORDS = [
  { word: 'LION', emoji: '🦁' },
  { word: 'BEAR', emoji: '🐻' },
  { word: 'FROG', emoji: '🐸' },
  { word: 'BIRD', emoji: '🐦' },
  { word: 'FISH', emoji: '🐟' },
  { word: 'DUCK', emoji: '🦆' },
  { word: 'CAKE', emoji: '🎂' },
  { word: 'MILK', emoji: '🥛' },
  { word: 'BOOK', emoji: '📖' },
  { word: 'MOON', emoji: '🌙' },
  { word: 'STAR', emoji: '⭐' },
  { word: 'TREE', emoji: '🌳' },
  { word: 'BALL', emoji: '⚽' },
  { word: 'DRUM', emoji: '🥁' },
  { word: 'SHIP', emoji: '🚢' },
  { word: 'CORN', emoji: '🌽' },
  { word: 'BABY', emoji: '👶' },
  { word: 'KEYS', emoji: '🔑' },
  { word: 'RING', emoji: '💍' },
  { word: 'HAND', emoji: '🖐️' }
];

// Map Makey Makey inputs to indices 0-3 (No Up Arrow)
const KEY_MAP = {
  'ArrowLeft': 0,
  'ArrowDown': 1,
  'ArrowRight': 2,
  'Space': 3
};

const WordWizard = () => {
    const [gameState, setGameState] = useState('menu'); // menu, playing, gameover
    const [currentWordObj, setCurrentWordObj] = useState(null);
    const [shuffledLetters, setShuffledLetters] = useState([]);
    const [progress, setProgress] = useState(0); // How many letters correctly typed
    const [score, setScore] = useState(0);
    const [highScores, setHighScores] = useState([]);
    const [feedback, setFeedback] = useState(null); // 'correct', 'wrong', null

    useEffect(() => {
        try {
            const stored = localStorage.getItem('wizardHighScores');
            if (stored) setHighScores(JSON.parse(stored));
        } catch (e) {
            console.error('Error loading high scores', e);
        }
    }, []);

    const startGame = () => {
        setScore(0);
        setGameState('playing');
        nextLevel();
    };

    const nextLevel = () => {
        const randomObj = WORDS[Math.floor(Math.random() * WORDS.length)];
        setCurrentWordObj(randomObj);
        
        const letters = randomObj.word.split('');
        
        // Create 4 slots
        const slots = Array(4).fill(null).map((_, i) => ({
            id: i,
            letter: letters[i], 
        }));
        
        // Fisher-Yates shuffle
        let currentIndex = slots.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [slots[currentIndex], slots[randomIndex]] = [slots[randomIndex], slots[currentIndex]];
        }

        setShuffledLetters(slots);
        setProgress(0);
        setFeedback(null);
    };

    const handleInput = (keyIndex) => {
        if (gameState !== 'playing' || !currentWordObj || keyIndex >= shuffledLetters.length) return;

        const targetLetter = currentWordObj.word[progress];
        const pressedLetter = shuffledLetters[keyIndex].letter;

        if (pressedLetter === targetLetter) {
            setFeedback('correct');
            setTimeout(() => setFeedback(null), 200);
            
            const newProgress = progress + 1;
            setProgress(newProgress);
            setScore(s => s + 10);

            if (newProgress >= 4) {
                // Word Complete!
                setScore(s => s + 50); // Bonus
                setTimeout(nextLevel, 500);
            }

        } else {
            // Wrong
            setFeedback('wrong');
            setScore(s => Math.max(0, s - 5));
            setTimeout(() => setFeedback(null), 200);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (KEY_MAP[e.code] !== undefined) {
                e.preventDefault();
                handleInput(KEY_MAP[e.code]);
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState, currentWordObj, progress, shuffledLetters]);

    const endGame = () => {
        setGameState('gameover');
        const newScores = [...highScores, score].sort((a, b) => b - a).slice(0, 5);
        setHighScores(newScores);
        try {
            localStorage.setItem('wizardHighScores', JSON.stringify(newScores));
        } catch (e) {
            console.error('Error saving scores', e);
        }
    };

    const [timeLeft, setTimeLeft] = useState(60);
    
    useEffect(() => {
        if (gameState === 'playing' && timeLeft === 0) {
            endGame();
        }
    }, [timeLeft, gameState]);

    useEffect(() => {
        if (gameState === 'playing') {
            const timer = setInterval(() => {
                setTimeLeft(t => t > 0 ? t - 1 : 0);
            }, 1000);
            return () => clearInterval(timer);
        } else if (gameState === 'menu') {
            setTimeLeft(60);
        }
    }, [gameState]);


    return (
        <div className={`w-full h-full flex flex-col items-center justify-center rounded-xl overflow-hidden select-none transition-colors duration-300 ${feedback === 'correct' ? 'bg-green-600' : feedback === 'wrong' ? 'bg-red-600' : 'bg-slate-900'}`}>
            
            {gameState === 'menu' && (
                <div className="text-center text-white animate-fade-in">
                    <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4 filter drop-shadow-lg">
                        WORD WIZARD
                    </h1>
                    <p className="text-2xl mb-12 text-blue-200 font-bold">Spell the words before time runs out! ⏳</p>
                    
                    <button onClick={startGame} className="bg-gradient-to-r from-green-400 to-blue-500 hover:scale-105 transition-transform text-white font-black text-4xl py-6 px-16 rounded-3xl shadow-2xl border-b-8 border-blue-700 active:border-b-0 active:translate-y-2">
                        PLAY NOW 🪄
                    </button>

                    {highScores.length > 0 && (
                        <div className="mt-12 bg-white/10 p-8 rounded-2xl backdrop-blur-sm">
                            <h3 className="text-2xl font-bold text-yellow-400 mb-4">🏆 HALL OF FAME</h3>
                            {highScores.map((s, i) => (
                                <div key={i} className="text-xl font-mono text-white/80">{i+1}. {s} pts</div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {gameState === 'playing' && currentWordObj && (
                <div className="flex flex-col items-center w-full max-w-4xl">
                    {/* HUD */}
                    <div className="flex justify-between w-full px-8 mb-8 text-white font-black text-2xl uppercase tracking-widest">
                        <div className="bg-slate-800 px-6 py-2 rounded-full border border-slate-700">Score: <span className="text-yellow-400">{score}</span></div>
                        <div className="bg-slate-800 px-6 py-2 rounded-full border border-slate-700">Time: <span className={`${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-blue-400'}`}>{timeLeft}s</span></div>
                    </div>

                    {/* Target Image & Word Progress */}
                    <div className="mb-12 text-center">
                        <div className="text-[150px] mb-4 drop-shadow-2xl animate-bounce-slow">{currentWordObj.emoji}</div>
                        <div className="flex gap-4 justify-center">
                            {currentWordObj.word.split('').map((char, i) => (
                                <div key={i} className={`w-16 h-20 flex items-center justify-center text-4xl font-black rounded-xl border-4 transition-all duration-300 ${i < progress ? 'bg-green-500 border-green-700 text-white scale-110' : 'bg-slate-800 border-slate-600 text-slate-600'}`}>
                                    {i < progress ? char : '?'}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Interactive Keys (The "Piano") */}
                    <div className="grid grid-cols-4 gap-6 w-full px-4">
                        {shuffledLetters.map((slot, index) => {
                             // Visual mapping of keys (Left, Down, Right, Space)
                             const labels = ['⬅️', '⬇️', '➡️', 'SPACE'];
                             const colors = ['bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-purple-500'];
                             
                             return (
                                <div key={index} className="flex flex-col items-center gap-3 group">
                                    <div className={`w-full aspect-[3/4] rounded-2xl flex flex-col items-center justify-center shadow-[0_8px_0_rgba(0,0,0,0.3)] transition-all transform active:scale-95 active:shadow-none border-b-8 border-black/20 relative overflow-hidden ${colors[index]}`}>
                                        <span className="text-6xl font-black text-white drop-shadow-md z-10">{slot.letter}</span>
                                        {/* Key Hint */}
                                        <div className="absolute bottom-4 text-white/50 font-bold text-sm tracking-widest">{labels[index]}</div>
                                    </div>
                                    
                                    {/* Wire Visual (to look like Makey Makey connection) */}
                                    <div className="w-2 h-12 bg-slate-700 rounded-full"></div>
                                </div>
                             );
                        })}
                    </div>
                </div>
            )}
            
            {gameState === 'gameover' && (
                <div className="text-center text-white animate-zoom-in">
                    <h2 className="text-6xl font-black mb-4">GAME OVER</h2>
                    <p className="text-3xl mb-8">Final Score: <span className="text-yellow-400">{score}</span></p>
                    <button onClick={() => setGameState('menu')} className="bg-white text-slate-900 font-black text-2xl py-4 px-12 rounded-full hover:bg-slate-200 transition-colors">
                        SAY MENU
                    </button>
                </div>
            )}

        </div>
    );
};

export default WordWizard;
