
import React from 'react';
import { Heart, Coins } from 'lucide-react';
import { UserStats } from '../types';

interface TopBarProps {
  stats: UserStats;
}

export const TopBar: React.FC<TopBarProps> = ({ stats }) => {
  // Calculate simple level progress based on XP
  // Assuming 1000 XP per level for visualization
  const XP_PER_LEVEL = 1000;
  const currentLevelXp = stats.xp % XP_PER_LEVEL;
  const progressPercent = Math.min(100, (currentLevelXp / XP_PER_LEVEL) * 100);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-casino-bg/95 backdrop-blur-sm border-b border-white/10 pt-safe-top">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* Hearts */}
        <div className="flex items-center gap-1.5 bg-casino-card/80 px-3 py-1.5 rounded-full border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)] shrink-0">
          <Heart className={`w-5 h-5 ${stats.hearts > 0 ? 'text-red-500 fill-red-500 drop-shadow-md' : 'text-gray-500'}`} />
          <span className="text-red-100 font-bold text-sm">{stats.hearts}</span>
        </div>

        {/* Level Bar (Replaces Streak) */}
        <div className="flex-1 flex flex-col justify-center max-w-[140px]">
             <div className="flex justify-between items-baseline mb-1">
                 <span className="text-[10px] font-black text-casino-neon uppercase tracking-widest">Level {stats.level}</span>
                 <span className="text-[9px] font-bold text-gray-500">{Math.floor(progressPercent)}%</span>
             </div>
             <div className="w-full h-2 bg-black/50 rounded-full border border-white/5 overflow-hidden relative">
                 <div 
                    className="h-full bg-gradient-to-r from-casino-neon to-purple-400 shadow-[0_0_10px_rgba(139,92,246,0.5)] transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercent}%` }}
                 />
             </div>
        </div>

        {/* Coins */}
        <div className="flex items-center gap-1.5 bg-casino-card/80 px-3 py-1.5 rounded-full border border-casino-gold/20 shadow-[0_0_10px_rgba(251,191,36,0.2)] shrink-0">
          <Coins className="w-5 h-5 text-casino-gold fill-casino-gold drop-shadow-md" />
          <span className="text-yellow-100 font-bold text-sm">{stats.coins}</span>
        </div>

      </div>
    </div>
  );
};
