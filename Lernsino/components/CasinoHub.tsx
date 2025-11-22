
import React, { useState } from 'react';
import { UserStats } from '../types';
import { CrashGame } from './CrashGame';
import { MinesGame } from './MinesGame';
import { RouletteGame } from './RouletteGame';
import { Rocket, Bomb, Disc } from 'lucide-react';

interface CasinoHubProps {
  stats: UserStats;
  onUpdateStats: React.Dispatch<React.SetStateAction<UserStats>>;
}

type GameType = 'CRASH' | 'MINES' | 'ROULETTE';

export const CasinoHub: React.FC<CasinoHubProps> = ({ stats, onUpdateStats }) => {
  const [activeGame, setActiveGame] = useState<GameType>('CRASH');

  return (
    <div className="pt-20 pb-32 px-4 max-w-md mx-auto min-h-screen flex flex-col">
      
      {/* Game Selector */}
      <div className="flex bg-black/30 p-1 rounded-xl mb-6 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveGame('CRASH')}
            className={`flex-1 py-2 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all whitespace-nowrap ${activeGame === 'CRASH' ? 'bg-casino-card text-white shadow-md' : 'text-gray-500'}`}
          >
              <Rocket size={14} /> Rocket
          </button>
          {/* Plinko removed temporarily */}
          <button 
            onClick={() => setActiveGame('MINES')}
            className={`flex-1 py-2 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all whitespace-nowrap ${activeGame === 'MINES' ? 'bg-casino-card text-white shadow-md' : 'text-gray-500'}`}
          >
              <Bomb size={14} /> Mines
          </button>
          <button 
            onClick={() => setActiveGame('ROULETTE')}
            className={`flex-1 py-2 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all whitespace-nowrap ${activeGame === 'ROULETTE' ? 'bg-casino-card text-white shadow-md' : 'text-gray-500'}`}
          >
              <Disc size={14} /> Roulette
          </button>
      </div>

      {/* Active Game Container */}
      <div className="flex-1">
          {activeGame === 'CRASH' && <CrashGame stats={stats} onUpdateStats={onUpdateStats} />}
          {activeGame === 'MINES' && <MinesGame stats={stats} onUpdateStats={onUpdateStats} />}
          {activeGame === 'ROULETTE' && <RouletteGame stats={stats} onUpdateStats={onUpdateStats} />}
      </div>
    </div>
  );
};
