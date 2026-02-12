import React, { useState, useEffect, useRef } from 'react';

const FlappyBird = () => {
  const [gameState, setGameState] = useState('menu'); // menu, playing, gameover
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const birdY = useRef(300);
  const birdVelocity = useRef(0);
  const pipes = useRef([]);
  const requestRef = useRef();
  const birdX = 100; // Fixed x position
  
  const GAME_SPEED = 1.5; // Slower for kids
  const GRAVITY = 0.25; // Floatier
  const JUMP_STRENGTH = -5; // Adjusted for gravity
  const PIPE_SPAWN_RATE = 200; // More space between pipes horizontally
  
  const canvasRef = useRef(null);
  const frameCount = useRef(0);

  const resetGame = () => {
    birdY.current = 300;
    birdVelocity.current = 0;
    pipes.current = [];
    setScore(0);
    frameCount.current = 0;
    setGameState('playing');
  };

  const jump = () => {
    if (gameState === 'menu' || gameState === 'gameover') {
      resetGame();
    } else {
      birdVelocity.current = JUMP_STRENGTH;
    }
  };

  useEffect(() => {
    const handleInput = (e) => {
      // Makey Makey inputs: Space, ArrowUp, Click
      if (e.type === 'mousedown' || e.code === 'Space' || e.code === 'ArrowUp') {
        if(e.type === 'keydown') e.preventDefault(); 
        jump();
      }
    };

    window.addEventListener('keydown', handleInput);
    window.addEventListener('mousedown', handleInput);
    window.addEventListener('touchstart', handleInput);

    return () => {
      window.removeEventListener('keydown', handleInput);
      window.removeEventListener('mousedown', handleInput);
      window.removeEventListener('touchstart', handleInput);
    };
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return; // Guard clause
    const ctx = canvas.getContext('2d');
    
    // Set canvas resolution to match display size for sharpness, or fixed game logic size
    canvas.width = 800; 
    canvas.height = 600;

    const loop = () => {
      frameCount.current++;
      
      // Bird Physics
      birdVelocity.current += GRAVITY;
      birdY.current += birdVelocity.current;

      // Pipe Spawning
      if (frameCount.current % PIPE_SPAWN_RATE === 0) {
        const gapSize = 220; // Easier for kids
        const minPipeHeight = 50;
        const maxPipeHeight = canvas.height - gapSize - minPipeHeight;
        const pipeHeight = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight + 1)) + minPipeHeight;
        
        pipes.current.push({
          x: canvas.width,
          topHeight: pipeHeight,
          gap: gapSize,
          passed: false
        });
      }

      // Move Pipes
      pipes.current.forEach(pipe => {
        pipe.x -= GAME_SPEED;
      });

      // Cleanup off-screen pipes
      pipes.current = pipes.current.filter(pipe => pipe.x > -100);

      // Collision Detection
      const birdRadius = 20; 
      const collisionRadius = 14; // Smaller hitbox for forgiveness
      
      // Ground/Ceiling collision
      if (birdY.current + birdRadius > canvas.height || birdY.current - birdRadius < 0) {
        setGameState('gameover');
      }

      // Pipe collision
      pipes.current.forEach(pipe => {
        // Simple AABB collision check
        // Pipe Width is 60
        if (
          birdX + collisionRadius > pipe.x && 
          birdX - collisionRadius < pipe.x + 60 && 
          (birdY.current - collisionRadius < pipe.topHeight || birdY.current + collisionRadius > pipe.topHeight + pipe.gap)
        ) {
          setGameState('gameover');
        }

        // Score
        if (!pipe.passed && birdX > pipe.x + 60) {
          pipe.passed = true;
          setScore(prev => prev + 1);
        }
      });

      // Rendering
      
      // Sky Background
      ctx.fillStyle = '#7dd3fc'; // Sky Blue
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw Pipes
      const pipeColor = '#22c55e'; // Green
      const pipeBorder = '#14532d'; // Dark Green
      
      pipes.current.forEach(pipe => {
        // Top Pipe
        ctx.fillStyle = pipeColor;
        ctx.fillRect(pipe.x, 0, 60, pipe.topHeight);
        ctx.strokeStyle = pipeBorder;
        ctx.lineWidth = 4;
        ctx.strokeRect(pipe.x, -5, 60, pipe.topHeight + 5);
        
        // Top Cap
        ctx.fillStyle = pipeColor;
        ctx.fillRect(pipe.x - 5, pipe.topHeight - 30, 70, 30);
        ctx.strokeRect(pipe.x - 5, pipe.topHeight - 30, 70, 30);

        // Bottom Pipe
        ctx.fillStyle = pipeColor;
        ctx.fillRect(pipe.x, pipe.topHeight + pipe.gap, 60, canvas.height - (pipe.topHeight + pipe.gap));
        ctx.strokeRect(pipe.x, pipe.topHeight + pipe.gap, 60, canvas.height);
        
        // Bottom Cap
        ctx.fillStyle = pipeColor;
        ctx.fillRect(pipe.x - 5, pipe.topHeight + pipe.gap, 70, 30);
        ctx.strokeRect(pipe.x - 5, pipe.topHeight + pipe.gap, 70, 30);
      });

      // Draw Bird
      ctx.save();
      ctx.translate(birdX, birdY.current);
      // Rotation based on velocity
      const rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (birdVelocity.current * 0.1)));
      ctx.rotate(rotation);

      // Body
      ctx.beginPath();
      ctx.arc(0, 0, birdRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#fbbf24'; // Yellow
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Eye
      ctx.beginPath();
      ctx.arc(8, -8, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(10, -8, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'black';
      ctx.fill();

      // Beak
      ctx.beginPath();
      ctx.moveTo(10, 5);
      ctx.lineTo(25, 10);
      ctx.lineTo(10, 15);
      ctx.fillStyle = '#f97316'; // Orange
      ctx.fill();
      
      // Wing
      ctx.beginPath();
      ctx.ellipse(-5, 5, 12, 8, 0.2, 0, Math.PI * 2);
      ctx.fillStyle = '#fef3c7'; // Light Yellow
      ctx.fill();
      ctx.stroke();

      ctx.restore();

      // Ground (Visual only, collision is at canvas bottom)
      ctx.fillStyle = '#d97706'; // Dirt
      const groundHeight = 20;
      // We aren't really simulate ground scrolling here for simplicity, but could add parallax
      
      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'gameover') {
        const storedHigh = localStorage.getItem('flappyHighScore') || 0;
        if (score > storedHigh) {
            setHighScore(score);
            localStorage.setItem('flappyHighScore', score);
        } else {
            setHighScore(storedHigh);
        }
    } else if (gameState === 'menu') {
        const storedHigh = localStorage.getItem('flappyHighScore') || 0;
        setHighScore(storedHigh);
    }
  }, [gameState, score]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-900 rounded-xl overflow-hidden select-none">
        
        {/* Game Canvas */}
        <div className="relative rounded-lg overflow-hidden border-8 border-slate-700 shadow-2xl">
            <canvas 
                ref={canvasRef} 
                className="block bg-sky-300 cursor-pointer max-w-full max-h-[80vh] aspect-[4/3]"
                style={{ width: '800px', height: '600px' }} // Maintain aspect ratio visually
            />
            
            {/* HUD */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center pointer-events-none z-20">
                 <div className="text-6xl font-black text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.5)] stroke-black stroke-2">
                    {score}
                 </div>
            </div>
        </div>

        {/* Menu Overlay */}
        {gameState === 'menu' && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-50 text-white">
                <div className="animate-bounce-slow mb-8">
                     <h1 className="text-7xl font-black text-yellow-400 drop-shadow-[0_6px_0_#ca8a04] mb-2 tracking-wide transform -rotate-3">FLAPPY</h1>
                     <h1 className="text-7xl font-black text-white drop-shadow-[0_6px_0_#94a3b8] tracking-wide transform rotate-2">BIRD</h1>
                </div>

                <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-md border border-white/20 text-center mb-8">
                    <p className="text-xl font-bold mb-4 text-sky-200">CONTROLS</p>
                    <div className="flex gap-8 justify-center items-center">
                        <div className="flex flex-col items-center gap-2">
                             <div className="w-16 h-16 rounded-xl bg-white text-slate-900 flex items-center justify-center font-black text-xs shadow-[0_4px_0_#cbd5e1]">SPACE</div>
                             <span className="text-xs font-bold text-slate-400">JUMP</span>
                        </div>
                        <div className="text-2xl font-black text-white/20">OR</div>
                        <div className="flex flex-col items-center gap-2">
                             <div className="w-16 h-16 rounded-xl bg-white text-slate-900 flex items-center justify-center font-black text-2xl shadow-[0_4px_0_#cbd5e1] mb-1">↑</div>
                             <span className="text-xs font-bold text-slate-400">UP</span>
                        </div>
                        <div className="text-2xl font-black text-white/20">OR</div>
                         <div className="flex flex-col items-center gap-2">
                             <div className="w-16 h-16 rounded-xl bg-white text-slate-900 flex items-center justify-center font-black text-xs shadow-[0_4px_0_#cbd5e1]">CLICK</div>
                             <span className="text-xs font-bold text-slate-400">MOUSE</span>
                        </div>
                    </div>
                </div>

                <button 
                  onClick={resetGame}
                  className="bg-green-500 hover:bg-green-400 text-white font-black text-3xl py-4 px-12 rounded-full shadow-[0_8px_0_#15803d] active:translate-y-[4px] active:shadow-none transition-all"
                >
                    START GAME ▶
                </button>
            </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'gameover' && (
             <div className="absolute inset-0 bg-red-900/80 backdrop-blur-md flex flex-col items-center justify-center z-50 text-white animate-in fade-in duration-300">
                <h2 className="text-6xl font-black mb-8 text-white drop-shadow-[0_5px_0_rgba(0,0,0,0.5)]">GAME OVER</h2>
                
                <div className="bg-white text-slate-900 p-8 rounded-3xl shadow-2xl mb-8 text-center min-w-[320px] transform rotate-1 border-4 border-slate-200">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                             <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">SCORE</p>
                             <p className="text-5xl font-black text-slate-800">{score}</p>
                        </div>
                        <div>
                             <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">BEST</p>
                             <p className="text-5xl font-black text-yellow-500">{highScore}</p>
                        </div>
                    </div>
                </div>
                
                <button 
                  onClick={resetGame}
                  className="bg-sky-500 hover:bg-sky-400 text-white font-black text-2xl py-4 px-10 rounded-full shadow-[0_6px_0_#0369a1] active:translate-y-[4px] active:shadow-none transition-all flex items-center gap-3"
                >
                    <span>↻</span> TRY AGAIN
                </button>
            </div>
        )}

    </div>
  );
};

export default FlappyBird;
