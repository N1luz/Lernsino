
import React, { useState } from 'react';
import { UserStats } from '../types';
import { Coins, Bomb, Diamond, Play, ShieldCheck } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface MinesGameProps {
  stats: UserStats;
  onUpdateStats: React.Dispatch<React.SetStateAction<UserStats>>;
}

type TileStatus = 'HIDDEN' | 'GEM' | 'BOMB';

export const MinesGame: React.FC<MinesGameProps> = ({ stats, onUpdateStats }) => {
  const [betAmount, setBetAmount] = useState(100);
  const [mineCount, setMineCount] = useState(3);
  const [gameActive, setGameActive] = useState(false);
  const [grid, setGrid] = useState<TileStatus[]>(Array(25).fill('HIDDEN'));
  const [revealed, setRevealed] = useState<boolean[]>(Array(25).fill(false));
  const [gemsFound, setGemsFound] = useState(0);
  const [isExploded, setIsExploded] = useState(false);

  // Multiplier logic (Simplified exponential growth)
  const calculateMultiplier = (gems: number, mines: number) => {
      if (gems === 0) return 1.00;
      let mult = 1.00;
      // Simple math model closer to typical casinos
      for (let i = 0; i < gems; i++) {
          const safeTiles = 25 - mines - i;
          const remainingTiles = 25 - i;
          mult *= (remainingTiles / safeTiles);
      }
      return mult * 0.99; // 1% House edge
  };

  const currentMultiplier = calculateMultiplier(gemsFound, mineCount);
  const nextMultiplier = calculateMultiplier(gemsFound + 1, mineCount);
  const potentialWin = Math.floor(betAmount * currentMultiplier);

  const startGame = () => {
      if (stats.coins < betAmount) {
          soundManager.play('wrong');
          return;
      }

      onUpdateStats(prev => ({ ...prev, coins: prev.coins - betAmount }));
      
      // Generate Grid
      const newGrid: TileStatus[] = Array(25).fill('GEM');
      let placedMines = 0;
      while (placedMines < mineCount) {
          const idx = Math.floor(Math.random() * 25);
          if (newGrid[idx] !== 'BOMB') {
              newGrid[idx] = 'BOMB';
              placedMines++;
          }
      }

      setGrid(newGrid);
      setRevealed(Array(25).fill(false));
      setGemsFound(0);
      setIsExploded(false);
      setGameActive(true);
      soundManager.play('click');
  };

  const handleTileClick = (index: number) => {
      if (!gameActive || revealed[index] || isExploded) return;

      const isBomb = grid[index] === 'BOMB';
      const newRevealed = [...revealed];
      newRevealed[index] = true;
      setRevealed(newRevealed);

      if (isBomb) {
          // BOOM
          setIsExploded(true);
          setGameActive(false);
          soundManager.play('wrong');
          // Reveal all
          setRevealed(Array(25).fill(true));
      } else {
          // GEM
          setGemsFound(prev => prev + 1);
          soundManager.play('coin');
      }
  };

  const cashout = () => {
      if (!gameActive || isExploded) return;
      
      onUpdateStats(prev => ({ ...prev, coins: prev.coins + potentialWin }));
      setGameActive(false);
      setIsExploded(false);
      // Reveal all
      setRevealed(Array(25).fill(true));
      soundManager.play('win');
  };

  return (
    <div className="flex flex-col h-full items-center gap-4 animate-fade-in">
        {/* HUD */}
        <div className="w-full flex justify-between items-center bg-casino-card border border-white/10 p-3 rounded-2xl">
             <div>
                 <p className="text-xs text-gray-400 font-bold uppercase">Current Win</p>
                 <p className={`text-xl font-black ${gameActive && gemsFound > 0 ? 'text-green-400' : 'text-gray-600'}`}>
                     {gameActive ? potentialWin : 0}
                 </p>
             </div>
             <div className="text-right">
                  <p className="text-xs text-gray-400 font-bold uppercase">Multiplier</p>
                  <p className="text-casino-gold font-mono font-bold">{currentMultiplier.toFixed(2)}x</p>
                  <p className="text-[10px] text-gray-500">Next: {nextMultiplier.toFixed(2)}x</p>
             </div>
        </div>

        {/* GRID */}
        <div className="w-full max-w-[350px] aspect-square grid grid-cols-5 gap-2 bg-black/20 p-3 rounded-2xl border border-white/5">
             {grid.map((type, idx) => {
                 const isRevealed = revealed[idx];
                 let content = null;
                 let style = "bg-casino-card hover:bg-white/10 border-white/10";
                 
                 if (isRevealed) {
                     if (type === 'BOMB') {
                         content = <Bomb className="w-6 h-6 text-red-500 animate-pulse" />;
                         style = "bg-red-900/50 border-red-500/50";
                     } else {
                         content = <Diamond className="w-6 h-6 text-green-400 animate-bounce" />;
                         style = "bg-green-900/50 border-green-500/50";
                     }
                 }

                 return (
                     <button 
                        key={idx}
                        onClick={() => handleTileClick(idx)}
                        disabled={!gameActive || isRevealed}
                        className={`rounded-xl border-2 flex items-center justify-center transition-all active:scale-95 ${style}`}
                     >
                         {content}
                     </button>
                 )
             })}
        </div>

        {/* CONTROLS */}
        <div className="w-full bg-casino-card border border-white/10 p-4 rounded-2xl space-y-4">
            {!gameActive ? (
                <>
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <label className="text-xs text-gray-500 font-bold uppercase">Bet Amount</label>
                            <div className="flex items-center gap-2 mt-1">
                                <button onClick={() => setBetAmount(Math.max(10, betAmount - 50))} className="w-8 h-8 bg-gray-800 rounded font-bold">-</button>
                                <span className="text-white font-bold w-16 text-center">{betAmount}</span>
                                <button onClick={() => setBetAmount(betAmount + 50)} className="w-8 h-8 bg-gray-800 rounded font-bold">+</button>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                             <label className="text-xs text-gray-500 font-bold uppercase">Mines</label>
                             <div className="flex gap-1 mt-1">
                                 {[1, 3, 5, 10].map(m => (
                                     <button 
                                        key={m}
                                        onClick={() => setMineCount(m)}
                                        className={`w-8 h-8 rounded font-bold text-xs ${mineCount === m ? 'bg-casino-neon text-white' : 'bg-gray-800 text-gray-400'}`}
                                     >
                                         {m}
                                     </button>
                                 ))}
                             </div>
                        </div>
                    </div>
                    <button 
                        onClick={startGame}
                        className="w-full py-4 bg-casino-neon hover:bg-purple-500 text-white rounded-xl font-black text-xl uppercase tracking-widest shadow-lg shadow-purple-500/20 transition-all active:scale-95"
                    >
                        Start Game
                    </button>
                </>
            ) : (
                <button 
                    onClick={cashout}
                    disabled={gemsFound === 0 || isExploded}
                    className={`w-full py-4 rounded-xl font-black text-xl uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${
                        gemsFound > 0 && !isExploded
                        ? 'bg-green-500 text-white shadow-green-500/30 hover:scale-105'
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    <ShieldCheck size={24} />
                    {isExploded ? 'GAME OVER' : `CASHOUT ${potentialWin}`}
                </button>
            )}
        </div>
    </div>
  );
};
