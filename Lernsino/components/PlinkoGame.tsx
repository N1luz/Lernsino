
import React, { useState, useEffect, useRef } from 'react';
import { UserStats } from '../types';
import { Coins, Play, AlertTriangle } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface PlinkoGameProps {
  stats: UserStats;
  onUpdateStats: React.Dispatch<React.SetStateAction<UserStats>>;
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  id: number;
  bet: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export const PlinkoGame: React.FC<PlinkoGameProps> = ({ stats, onUpdateStats }) => {
  const [betAmount, setBetAmount] = useState(100);
  const [lastWin, setLastWin] = useState<{mult: number, amount: number} | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(null);
  const ballsRef = useRef<Ball[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const ballIdCounter = useRef(0);

  // Config
  const ROWS = 14; 
  const PIN_RADIUS = 3;
  const BALL_RADIUS = 5;
  const WIDTH = 360;
  const HEIGHT = 400;
  const GAP = WIDTH / (ROWS + 2); 

  // REBALANCED MULTIPLIERS (Standard Normal Distribution / Galton Board style)
  const MULTIPLIERS = [
      100, 25, 5, 2, 0.5, 0.2, 0.2, 0.2, 0.5, 2, 5, 25, 100
  ];
  
  const getBucketColor = (mult: number) => {
      if (mult >= 25) return '#EF4444'; 
      if (mult >= 2) return '#FBBF24';
      return '#374151';
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const dropBall = () => {
    if (stats.coins < betAmount) {
        soundManager.play('wrong');
        return;
    }

    onUpdateStats(prev => ({ ...prev, coins: prev.coins - betAmount }));
    soundManager.play('click');

    // Spawn at TOP CENTER with slight randomness
    const startX = WIDTH / 2 + (Math.random() - 0.5) * 2; 
    
    const newBall: Ball = {
        x: startX,
        y: 20,
        vx: 0,
        vy: 0,
        id: ballIdCounter.current++,
        bet: betAmount
    };
    
    ballsRef.current.push(newBall);
  };

  const loop = () => {
    updatePhysics();
    draw();
    requestRef.current = requestAnimationFrame(loop);
  };

  const updatePhysics = () => {
    const GRAVITY = 0.2; 
    const FRICTION = 0.98; 
    const COLLISION_DAMPING = 0.6; // Energy loss on bounce
    const MIN_SPEED = 0.5; // Minimum bounce speed to prevent sticking
    
    // Update particles
    for(let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.05;
        if(p.life <= 0) particlesRef.current.splice(i, 1);
    }

    for (let i = ballsRef.current.length - 1; i >= 0; i--) {
        const ball = ballsRef.current[i];
        
        ball.vy += GRAVITY;
        ball.vx *= FRICTION;
        ball.x += ball.vx;
        ball.y += ball.vy;

        // STRICT BOUNDARIES (Invisible Walls)
        if (ball.x < BALL_RADIUS) {
            ball.x = BALL_RADIUS;
            ball.vx *= -0.5;
        } else if (ball.x > WIDTH - BALL_RADIUS) {
            ball.x = WIDTH - BALL_RADIUS;
            ball.vx *= -0.5;
        }

        // Anti-Sticking Jitter
        // If velocity is extremely low and it's not near bottom, give it a nudge
        const speedSq = ball.vx*ball.vx + ball.vy*ball.vy;
        if (speedSq < 0.05 && ball.y < HEIGHT - 100) {
            ball.vx += (Math.random() - 0.5) * 0.5;
        }

        // Collision with Pins
        for (let row = 0; row < ROWS; row++) {
            const colsInRow = row + 3;
            const y = 80 + row * 20; 
            const rowWidth = (colsInRow - 1) * GAP;
            const startX = (WIDTH - rowWidth) / 2;

            for (let col = 0; col < colsInRow; col++) {
                const pinX = startX + col * GAP;
                const dx = ball.x - pinX;
                const dy = ball.y - y;
                const distSq = dx*dx + dy*dy;
                const minDist = PIN_RADIUS + BALL_RADIUS;

                // Check distance squared to avoid sqrt every time if not needed
                if (distSq < minDist * minDist) {
                    const dist = Math.sqrt(distSq);
                    
                    // --- PHYSICS FIX ---
                    
                    // 1. Resolve Overlap (Position Correction)
                    const overlap = minDist - dist;
                    
                    // Handle rare divide by zero if ball spawns exactly on pin center
                    const normalX = dist > 0 ? dx / dist : 0;
                    const normalY = dist > 0 ? dy / dist : 1;
                    
                    // Push out
                    ball.x += normalX * overlap;
                    ball.y += normalY * overlap;

                    // 2. Resolve Velocity (Bounce)
                    const dotProduct = (ball.vx * normalX + ball.vy * normalY);
                    
                    // Only bounce if moving towards pin
                    if (dotProduct < 0) {
                        // Reflect
                        ball.vx -= (1 + COLLISION_DAMPING) * dotProduct * normalX;
                        ball.vy -= (1 + COLLISION_DAMPING) * dotProduct * normalY;
                        
                        // Add micro-randomness to simulate surface imperfection and prevent vertical stacking
                        ball.vx += (Math.random() - 0.5) * 0.4;
                        
                        // Force minimum velocity to escape "sticky" situations
                        if (Math.abs(ball.vx) < MIN_SPEED) {
                            ball.vx = ball.vx < 0 ? -MIN_SPEED : MIN_SPEED;
                        }
                        
                        soundManager.play('tick');
                    }
                }
            }
        }

        // Floor collision (Buckets)
        if (ball.y > HEIGHT - 30) {
            const bucketW = WIDTH / MULTIPLIERS.length;
            const bucketIndex = Math.floor(ball.x / bucketW);
            const safeIndex = Math.max(0, Math.min(MULTIPLIERS.length - 1, bucketIndex));
            const multiplier = MULTIPLIERS[safeIndex];
            
            finishBall(safeIndex, multiplier, ball.bet);
            ballsRef.current.splice(i, 1);
        }
    }
  };

  const finishBall = (bucketIndex: number, multiplier: number, ballBet: number) => {
     const win = Math.floor(ballBet * multiplier);
     
     window.dispatchEvent(new CustomEvent('plinko-win', { detail: win }));
     
     setLastWin({ mult: multiplier, amount: win });
     if (multiplier >= 1) soundManager.play('win');
     
     const bucketW = WIDTH / MULTIPLIERS.length;
     const bucketX = bucketIndex * bucketW + bucketW/2;
     const color = getBucketColor(multiplier);
     
     for(let k=0; k<8; k++) {
         particlesRef.current.push({
             x: bucketX, y: HEIGHT - 10,
             vx: (Math.random() - 0.5) * 4,
             vy: -Math.random() * 4 - 2,
             life: 1.0,
             color: color
         });
     }
  };

  useEffect(() => {
      const handler = (e: Event) => {
          const win = (e as CustomEvent).detail;
          onUpdateStats((prev: UserStats) => ({...prev, coins: prev.coins + win}));
      };
      window.addEventListener('plinko-win', handler);
      return () => window.removeEventListener('plinko-win', handler);
  }, []);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Pins
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    for (let row = 0; row < ROWS; row++) {
        const colsInRow = row + 3;
        const y = 80 + row * 20;
        const rowWidth = (colsInRow - 1) * GAP;
        const startX = (WIDTH - rowWidth) / 2;
        for (let col = 0; col < colsInRow; col++) {
            ctx.beginPath();
            ctx.arc(startX + col * GAP, y, PIN_RADIUS, 0, Math.PI*2);
            ctx.fill();
        }
    }

    // Balls
    ctx.fillStyle = '#FBBF24'; 
    ballsRef.current.forEach(ball => {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI*2);
        ctx.fill();
    });

    // Particles
    particlesRef.current.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI*2);
        ctx.fill();
    });
    ctx.globalAlpha = 1.0;

    // Buckets
    const bucketW = WIDTH / MULTIPLIERS.length;
    for(let i=0; i<MULTIPLIERS.length; i++) {
        const mult = MULTIPLIERS[i];
        ctx.fillStyle = getBucketColor(mult);
        
        const h = mult < 1 ? 20 : 35;
        ctx.fillRect(i * bucketW, HEIGHT - h, bucketW - 2, h);
        
        ctx.fillStyle = mult < 1 ? '#aaa' : '#000';
        ctx.font = 'bold 9px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(`${mult}x`, i * bucketW + bucketW/2, HEIGHT - 6);
    }
  };

  return (
    <div className="flex flex-col h-full items-center">
        
        <div className="w-full flex justify-between items-center mb-4 bg-black/20 p-2 rounded-xl">
             <div>
                 <p className="text-xs text-gray-400 uppercase font-bold">Last</p>
                 {lastWin ? (
                     <p className={`${lastWin.mult >= 1 ? 'text-green-400' : 'text-red-400'} font-bold`}>{lastWin.mult}x</p>
                 ) : <p className="text-gray-600">-</p>}
             </div>
             <div className="flex items-center gap-2">
                <span className="text-xs text-red-400 flex items-center font-bold bg-red-900/20 px-2 py-1 rounded">
                    <AlertTriangle className="w-3 h-3 mr-1" /> High Risk
                </span>
                <div className="text-casino-gold font-bold flex items-center">
                    <Coins className="w-4 h-4 mr-1" /> {stats.coins}
                </div>
             </div>
        </div>

        <div className="relative bg-casino-card border-2 border-white/10 rounded-3xl shadow-2xl mb-4 overflow-hidden">
            <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} className="w-full h-auto" />
        </div>

        <div className="w-full bg-casino-card border border-white/10 p-4 rounded-2xl flex flex-col gap-4">
             <div className="flex items-center gap-2">
                <button onClick={() => setBetAmount(Math.max(10, betAmount - 50))} className="p-3 bg-gray-800 rounded-xl font-bold">-</button>
                <input 
                    type="number" 
                    value={betAmount}
                    onChange={(e) => setBetAmount(parseInt(e.target.value) || 0)}
                    className="flex-1 bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-white text-center font-mono font-bold text-lg focus:border-casino-neon focus:outline-none"
                />
                <button onClick={() => setBetAmount(betAmount + 50)} className="p-3 bg-gray-800 rounded-xl font-bold">+</button>
            </div>

            <button 
                onClick={dropBall}
                className="w-full py-4 bg-green-500 hover:bg-green-400 text-white rounded-xl font-black text-xl uppercase tracking-widest shadow-lg shadow-green-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
                <Play className="w-6 h-6 fill-current" /> DROP
            </button>
        </div>
    </div>
  );
};
