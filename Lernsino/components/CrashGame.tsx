
import React, { useState, useEffect, useRef } from 'react';
import { UserStats } from '../types';
import { Coins, Rocket } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface CrashGameProps {
  stats: UserStats;
  onUpdateStats: React.Dispatch<React.SetStateAction<UserStats>>;
}

export const CrashGame: React.FC<CrashGameProps> = ({ stats, onUpdateStats }) => {
  const [multiplier, setMultiplier] = useState(1.00);
  const [finalMultiplier, setFinalMultiplier] = useState<number | null>(null); // Store the cashout multiplier
  const [gameState, setGameState] = useState<'IDLE' | 'RUNNING' | 'CRASHED'>('IDLE');
  const [betAmount, setBetAmount] = useState(100);
  const [cashedOut, setCashedOut] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(null);
  const crashPointRef = useRef(0);
  const startTimeRef = useRef(0);
  const historyRef = useRef<{x: number, y: number}[]>([]);

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const startGame = () => {
    if (betAmount <= 0 || stats.coins < betAmount) {
      soundManager.play('wrong');
      return;
    }

    onUpdateStats(prev => ({ ...prev, coins: prev.coins - betAmount }));

    setGameState('RUNNING');
    setCashedOut(false);
    setFinalMultiplier(null);
    setMultiplier(1.00);
    historyRef.current = [];
    
    // --- SPECIFIC ODDS LOGIC ---
    const r = Math.random() * 100; 
    let crash = 1.00;

    if (r < 95) {
        crash = 1.00 + (Math.random() * 0.99);
    } else if (r < 99) {
        crash = 2.00 + (Math.random() * 8.00);
    } else {
        crash = 10.00 + (Math.random() * 90.00); 
    }
    
    crashPointRef.current = Math.floor(crash * 100) / 100;
    if (crashPointRef.current < 1.01) crashPointRef.current = 1.00;

    startTimeRef.current = Date.now();
    soundManager.play('tick');
    loop();
  };

  const loop = () => {
    const now = Date.now();
    const elapsed = (now - startTimeRef.current) / 1000; // seconds
    
    // Growth formula: Exponential
    const currentMult = 1 + (elapsed * elapsed * 0.08) + (elapsed * 0.05);
    
    setMultiplier(currentMult);

    if (currentMult >= crashPointRef.current) {
      handleCrash();
    } else {
      drawScene(currentMult, elapsed);
      animationRef.current = requestAnimationFrame(loop);
    }
  };

  const handleCrash = () => {
    setGameState('CRASHED');
    setMultiplier(crashPointRef.current);
    drawScene(crashPointRef.current, 0, true);
    soundManager.play('wrong');
  };

  const handleCashout = () => {
    if (gameState !== 'RUNNING' || cashedOut) return;
    
    setCashedOut(true);
    setFinalMultiplier(multiplier); // Freeze the value for display
    
    const winAmount = Math.floor(betAmount * multiplier);
    
    onUpdateStats(prev => ({
        ...prev,
        coins: prev.coins + winAmount
    }));
    soundManager.play('win');
  };

  const drawScene = (currentMult: number, time: number, isCrashed = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // 1. Background
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#1A1D29';
    ctx.fillRect(0, 0, w, h);
    
    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    const gridSize = 50;
    // Moving grid effect
    const offsetX = (time * 20) % gridSize;
    const offsetY = (time * 20) % gridSize;

    for (let x = -offsetX; x < w; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = h + offsetY; y > 0; y -= gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // 2. Calculate Position
    // Map time/mult to X,Y coordinates.
    // We want a visible curve from Bottom-Left to Top-Right.
    // Max visual X is w - 50.
    // Max visual Y is 50. Start Y is h - 50.
    
    let rocketX, rocketY;

    if (isCrashed) {
        // Use last known position
        const last = historyRef.current[historyRef.current.length - 1] || { x: 50, y: h - 50 };
        rocketX = last.x;
        rocketY = last.y;
    } else {
        // Dynamic Position
        // X moves linearly with time until it hits 80% width, then holds (camera pan effect simulated by grid, but here we clamp)
        // Y moves up exponentially
        
        // Normalizing: Let's say 10 seconds is "full screen" width visually roughly
        const xProgress = Math.min(1, time / 8); 
        rocketX = 50 + xProgress * (w - 100);
        
        // Y is inverse to multiplier. 1.00x = Bottom. 10.00x = Top?
        // We use log scale for Y usually in Crash games
        // Log(1) = 0. Log(10) = 1.
        const logMult = Math.log10(currentMult);
        const yProgress = Math.min(1, logMult / 1.5); // reaches top at ~30x
        rocketY = (h - 50) - (yProgress * (h - 100));
        
        historyRef.current.push({ x: rocketX, y: rocketY });
    }

    // 3. Draw Trajectory Line
    if (historyRef.current.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.moveTo(historyRef.current[0].x, historyRef.current[0].y);
        
        // Draw bezier or lines
        for (let i = 1; i < historyRef.current.length; i++) {
             ctx.lineTo(historyRef.current[i].x, historyRef.current[i].y);
        }
        ctx.stroke();

        // Glow under line
        ctx.save();
        ctx.shadowColor = '#8b5cf6';
        ctx.shadowBlur = 20;
        ctx.strokeStyle = 'rgba(139,92,246,0.5)';
        ctx.lineWidth = 8;
        ctx.stroke();
        ctx.restore();
    }

    // 4. Draw Rocket / Explosion
    if (isCrashed) {
        drawExplosion(ctx, rocketX, rocketY);
        
        ctx.font = "bold 30px Inter";
        ctx.fillStyle = "#EF4444";
        ctx.textAlign = "center";
        ctx.fillText(`CRASHED @ ${currentMult.toFixed(2)}x`, w/2, h/2);
    } else {
        ctx.save();
        ctx.translate(rocketX, rocketY);
        
        // Calculate angle based on trajectory
        let angle = -Math.PI / 4; // Default 45 deg up
        if (historyRef.current.length > 5) {
             const p1 = historyRef.current[historyRef.current.length - 5];
             const p2 = historyRef.current[historyRef.current.length - 1];
             angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        }
        ctx.rotate(angle); // Rotate towards movement

        // Rocket Body
        // Wings
        ctx.fillStyle = '#8b5cf6'; 
        ctx.beginPath(); ctx.moveTo(-20, 5); ctx.lineTo(-30, 20); ctx.lineTo(-15, 20); ctx.fill(); // Top wing
        ctx.beginPath(); ctx.moveTo(-20, -5); ctx.lineTo(-30, -20); ctx.lineTo(-15, -20); ctx.fill(); // Bottom wing

        // Flame
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        const flicker = Math.random() * 10;
        ctx.moveTo(-25, 0); ctx.lineTo(-45 - flicker, -5); ctx.lineTo(-45 - flicker, 5); ctx.fill();

        // BGB Book Body (sideways)
        ctx.fillStyle = '#EF4444'; 
        ctx.fillRect(-25, -15, 50, 30); // Cover
        ctx.fillStyle = '#FFF';
        ctx.fillRect(-20, -12, 40, 24); // Pages
        
        ctx.fillStyle = '#000';
        ctx.font = "bold 10px Inter";
        ctx.textAlign = "center";
        ctx.fillText("BGB", 0, 4);

        ctx.restore();

        // Multiplier Text
        ctx.font = "bold 60px Inter";
        ctx.fillStyle = "#fff";
        ctx.shadowColor = "#8b5cf6";
        ctx.shadowBlur = 30;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${currentMult.toFixed(2)}x`, w/2, h/2 - 40);
        ctx.shadowBlur = 0;
    }
  };

  const drawExplosion = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
      ctx.beginPath();
      ctx.arc(x, y, 50, 0, Math.PI * 2);
      ctx.fillStyle = '#EF4444';
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.fillStyle = '#F59E0B';
      ctx.fill();

      for(let i=0; i<8; i++) {
          ctx.fillStyle = '#fff';
          ctx.fillRect(x + Math.cos(i) * 40, y + Math.sin(i) * 40, 8, 8);
      }
  };

  return (
    <div className="flex flex-col h-full">
       {/* Game Canvas */}
       <div className="relative w-full aspect-video bg-black/50 border-2 border-white/10 rounded-3xl overflow-hidden shadow-2xl mb-6">
           <canvas ref={canvasRef} width={600} height={400} className="w-full h-full" />
           
           {gameState === 'IDLE' && (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                   <Rocket className="w-12 h-12 text-casino-neon mb-2 animate-bounce" />
                   <p className="text-white font-bold text-xl">BGB Rocket</p>
                   <p className="text-gray-400 text-xs">Multiplier increases until it crashes.</p>
               </div>
           )}
       </div>

       {/* Controls */}
       <div className="bg-casino-card border border-white/10 p-4 rounded-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-500 uppercase">Bet Amount</label>
                <div className="text-casino-gold font-bold flex items-center text-sm">
                    <Coins className="w-4 h-4 mr-1" /> {stats.coins} available
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                <button onClick={() => setBetAmount(Math.max(10, betAmount - 50))} className="p-3 bg-gray-800 rounded-xl font-bold">-</button>
                <input 
                    type="number" 
                    value={betAmount}
                    onChange={(e) => setBetAmount(parseInt(e.target.value) || 0)}
                    disabled={gameState === 'RUNNING'}
                    className="flex-1 bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-white text-center font-mono font-bold text-lg focus:border-casino-neon focus:outline-none"
                />
                <button onClick={() => setBetAmount(betAmount + 50)} className="p-3 bg-gray-800 rounded-xl font-bold">+</button>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
                {[100, 250, 500, 1000].map(amt => (
                    <button 
                        key={amt} 
                        onClick={() => setBetAmount(amt)}
                        className="py-2 bg-white/5 rounded-lg text-xs font-bold hover:bg-white/10"
                    >
                        {amt}
                    </button>
                ))}
            </div>

            {gameState === 'RUNNING' ? (
                 <button 
                    onClick={handleCashout}
                    disabled={cashedOut}
                    className={`w-full py-4 rounded-xl font-black text-xl uppercase tracking-widest transition-all shadow-lg ${
                        cashedOut 
                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                        : 'bg-green-500 hover:bg-green-400 text-white shadow-green-500/30 scale-105'
                    }`}
                 >
                    {cashedOut ? 'Cashed Out' : 'CASH OUT'}
                 </button>
            ) : (
                <button 
                    onClick={startGame}
                    className="w-full py-4 bg-casino-neon hover:bg-purple-500 text-white rounded-xl font-black text-xl uppercase tracking-widest shadow-lg shadow-purple-500/20 transition-all active:scale-95"
                >
                    Launch Rocket
                </button>
            )}
            
            {cashedOut && (
                <div className="text-center text-green-400 font-bold text-sm bg-green-900/20 py-2 rounded-lg border border-green-500/20">
                    You won {Math.floor(betAmount * (finalMultiplier || 1.00))} Coins!
                </div>
            )}
       </div>
    </div>
  );
};
