
import React, { useState, useRef, useEffect } from 'react';
import { UserStats } from '../types';
import { ArrowUp, RotateCw } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface RouletteGameProps {
  stats: UserStats;
  onUpdateStats: React.Dispatch<React.SetStateAction<UserStats>>;
}

// Standard European Wheel Order
const WHEEL_NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

type BetType = 'RED' | 'BLACK' | 'GREEN' | 'EVEN' | 'ODD' | number;

interface Bet {
    type: BetType;
    amount: number;
}

export const RouletteGame: React.FC<RouletteGameProps> = ({ stats, onUpdateStats }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [lastNumber, setLastNumber] = useState<number | null>(null);
  const [bets, setBets] = useState<Bet[]>([]);
  const [currentChip, setCurrentChip] = useState(10);
  const wheelRef = useRef<HTMLDivElement>(null);

  const placeBet = (type: BetType) => {
      if (isSpinning) return;
      if (stats.coins < currentChip) {
          soundManager.play('wrong');
          return;
      }

      onUpdateStats(prev => ({ ...prev, coins: prev.coins - currentChip }));
      soundManager.play('click');

      setBets(prev => {
          const existing = prev.find(b => b.type === type);
          if (existing) {
              return prev.map(b => b.type === type ? { ...b, amount: b.amount + currentChip } : b);
          }
          return [...prev, { type, amount: currentChip }];
      });
  };

  const spinWheel = () => {
      if (isSpinning || bets.length === 0) return;
      
      setIsSpinning(true);
      soundManager.play('electric');

      // 1. Determine Result
      const resultIndex = Math.floor(Math.random() * WHEEL_NUMBERS.length);
      const resultNumber = WHEEL_NUMBERS[resultIndex];
      
      // 2. Calculate Geometry
      const sliceDeg = 360 / 37;
      // The wheel index 0 is at 0 degrees (12 o'clock).
      // To bring index X to 12 o'clock, we must rotate the CONTAINER backwards by X * sliceDeg.
      // Or forward by (360 - X * sliceDeg).
      const targetAngle = (360 - (resultIndex * sliceDeg)) % 360;
      
      // 3. Calculate Delta from Current State
      // We need to account for the current rotation to find the shortest path forward
      const currentAngle = rotation % 360;
      let delta = targetAngle - currentAngle;
      
      // Ensure we always spin forward (clockwise)
      if (delta < 0) {
          delta += 360;
      }
      
      // 4. Add Momentum (Full Spins)
      const extraSpins = 5 * 360;
      
      // 5. Add Natural Jitter (random offset within the wedge)
      // Wedge is ~9.7 degrees. +/- 3 degrees is safe.
      const jitter = (Math.random() - 0.5) * 6;

      const finalRotation = rotation + delta + extraSpins + jitter;
      
      setRotation(finalRotation);

      setTimeout(() => {
          setIsSpinning(false);
          setLastNumber(resultNumber);
          handleResult(resultNumber);
      }, 3000);
  };

  const handleResult = (number: number) => {
      let winAmount = 0;
      const isRed = RED_NUMBERS.includes(number);
      const isBlack = number !== 0 && !isRed;
      const isEven = number !== 0 && number % 2 === 0;
      const isOdd = number !== 0 && number % 2 !== 0;

      bets.forEach(bet => {
          let won = false;
          let multiplier = 0;

          if (bet.type === 'RED' && isRed) { won = true; multiplier = 2; }
          if (bet.type === 'BLACK' && isBlack) { won = true; multiplier = 2; }
          if (bet.type === 'EVEN' && isEven) { won = true; multiplier = 2; }
          if (bet.type === 'ODD' && isOdd) { won = true; multiplier = 2; }
          if (bet.type === 'GREEN' && number === 0) { won = true; multiplier = 14; }
          if (typeof bet.type === 'number' && bet.type === number) { won = true; multiplier = 36; }

          if (won) {
              winAmount += bet.amount * multiplier;
          }
      });

      if (winAmount > 0) {
          onUpdateStats(prev => ({ ...prev, coins: prev.coins + winAmount }));
          soundManager.play('win');
      } else {
          soundManager.play('wrong');
      }
      
      setBets([]);
  };

  return (
    <div className="flex flex-col h-full items-center gap-6 animate-fade-in pb-10">
        
        {/* WHEEL CONTAINER */}
        {/* Fixed width/height to prevent wobble. Shadow and Border handled carefully. */}
        <div className="relative w-[320px] h-[320px] shrink-0 flex items-center justify-center mt-4">
            
            {/* 1. Static Outer Frame / Border */}
            <div className="absolute inset-0 rounded-full border-8 border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-gray-900 z-0"></div>

            {/* 2. Rotating Wheel */}
            <div 
                ref={wheelRef}
                className="absolute inset-2 rounded-full transition-transform duration-[3000ms] cubic-bezier(0.15, 0, 0.15, 1) z-10 overflow-hidden"
                style={{ transform: `rotate(${rotation}deg)` }}
            >
                {/* Inner Decorative Ring */}
                <div className="absolute inset-0 rounded-full border-4 border-yellow-600/30 z-20 pointer-events-none"></div>
                
                {WHEEL_NUMBERS.map((num, i) => {
                    const angle = (360 / 37) * i;
                    const isRed = RED_NUMBERS.includes(num);
                    const isGreen = num === 0;
                    const bgColor = isGreen ? '#22c55e' : isRed ? '#dc2626' : '#171717';
                    
                    return (
                        <React.Fragment key={num}>
                            {/* Color Wedge */}
                            {/* Using a simpler rect rotation technique for wedges to avoid clipping issues */}
                            <div
                                className="absolute top-0 left-1/2 w-[28px] h-[50%] origin-bottom -ml-[14px] z-0"
                                style={{
                                    transform: `rotate(${angle}deg)`,
                                }}
                            >
                                {/* The visible part of the wedge */}
                                <div className="w-full h-[60px] mt-1" style={{ backgroundColor: bgColor, clipPath: 'polygon(0% 0%, 100% 0%, 85% 100%, 15% 100%)' }}></div>
                            </div>

                            {/* Number Label */}
                            {/* Pushed out from center, rotated to face center */}
                            <div 
                                className="absolute top-1/2 left-1/2 z-10 flex items-center justify-center w-8 h-8"
                                style={{ 
                                    transform: `translate(-50%, -50%) rotate(${angle}deg) translate(0, -125px) rotate(180deg)`
                                }}
                            >
                                <span className="text-white font-bold font-sans text-sm drop-shadow-md">{num}</span>
                            </div>
                        </React.Fragment>
                    );
                })}
                
                {/* Inner Plate (Rotates with numbers) */}
                <div className="absolute inset-[60px] rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/5 z-0 shadow-inner"></div>
            </div>

            {/* 3. Static Center Cap (Does not rotate) */}
            <div className="absolute z-20 w-20 h-20 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-900 border-4 border-yellow-950 shadow-[0_0_20px_rgba(0,0,0,0.8)] flex items-center justify-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center border border-yellow-500/20">
                     <span className={`font-black text-2xl ${!lastNumber && lastNumber !== 0 ? 'text-white' : (lastNumber === 0 ? 'text-green-500' : RED_NUMBERS.includes(lastNumber!) ? 'text-red-500' : 'text-white')}`}>
                         {isSpinning ? '' : (lastNumber ?? '')}
                     </span>
                </div>
            </div>

             {/* 4. Static Indicator Arrow */}
             <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-30 text-yellow-500 filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                 <ArrowUp className="w-12 h-12 rotate-180 fill-current stroke-yellow-900 stroke-2" />
            </div>
        </div>

        {/* BETTING BOARD */}
        <div className="w-full max-w-md bg-casino-card border border-white/10 p-4 rounded-2xl shadow-xl">
            <div className="flex justify-between mb-4 items-end">
                <div className="flex gap-2">
                    {[10, 50, 100, 500].map(amt => (
                        <button 
                            key={amt} 
                            onClick={() => setCurrentChip(amt)}
                            className={`w-10 h-10 rounded-full font-bold text-[10px] border-2 shadow-lg flex items-center justify-center transition-transform ${currentChip === amt ? 'border-white scale-110' : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'}`}
                            style={{ backgroundColor: amt === 10 ? '#3b82f6' : amt === 50 ? '#ef4444' : amt === 100 ? '#22c55e' : '#f59e0b', color: '#000' }}
                        >
                            {amt}
                        </button>
                    ))}
                </div>
                <div className="text-right">
                     <p className="text-[10px] text-gray-500 uppercase font-bold">Total Bet</p>
                     <p className="text-white font-bold text-lg">{bets.reduce((a,b) => a + b.amount, 0)}</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-2">
                 <button onClick={() => placeBet('RED')} className="h-16 rounded-xl font-bold text-white bg-gradient-to-br from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 relative shadow-lg border border-red-400/20">
                    RED
                    {bets.find(b => b.type === 'RED') && <span className="absolute top-1 right-1 bg-white text-black text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">{bets.find(b => b.type === 'RED')?.amount}</span>}
                 </button>
                 <button onClick={() => placeBet('GREEN')} className="h-16 rounded-xl font-bold text-white bg-gradient-to-br from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 relative shadow-lg border border-green-400/20">
                    ZERO
                    {bets.find(b => b.type === 'GREEN') && <span className="absolute top-1 right-1 bg-white text-black text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">{bets.find(b => b.type === 'GREEN')?.amount}</span>}
                 </button>
                 <button onClick={() => placeBet('BLACK')} className="h-16 rounded-xl font-bold text-white bg-gradient-to-br from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 relative shadow-lg border border-gray-600/20">
                    BLACK
                    {bets.find(b => b.type === 'BLACK') && <span className="absolute top-1 right-1 bg-white text-black text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">{bets.find(b => b.type === 'BLACK')?.amount}</span>}
                 </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-6">
                 <button onClick={() => placeBet('EVEN')} className="py-3 bg-casino-card border border-white/10 hover:bg-white/5 rounded-lg font-bold text-xs relative">EVEN {bets.find(b => b.type === 'EVEN') && <span className="ml-1 text-casino-gold">({bets.find(b => b.type === 'EVEN')?.amount})</span>}</button>
                 <button onClick={() => placeBet('ODD')} className="py-3 bg-casino-card border border-white/10 hover:bg-white/5 rounded-lg font-bold text-xs relative">ODD {bets.find(b => b.type === 'ODD') && <span className="ml-1 text-casino-gold">({bets.find(b => b.type === 'ODD')?.amount})</span>}</button>
            </div>

            <button 
                onClick={spinWheel}
                disabled={isSpinning || bets.length === 0}
                className={`w-full py-4 rounded-xl font-black text-xl uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2 ${
                    !isSpinning && bets.length > 0
                    ? 'bg-gradient-to-r from-casino-gold to-yellow-600 text-black shadow-yellow-500/20 hover:scale-[1.02]'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
            >
                <RotateCw size={24} className={isSpinning ? 'animate-spin' : ''} />
                {isSpinning ? 'SPINNING...' : 'SPIN'}
            </button>
        </div>
    </div>
  );
};
