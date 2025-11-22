import React from 'react';
import { LEADERBOARD_DATA } from '../constants';
import { Trophy } from 'lucide-react';

export const LeaderboardScreen: React.FC = () => {
  // Sort by XP
  const sortedData = [...LEADERBOARD_DATA].sort((a, b) => b.xp - a.xp);

  return (
    <div className="pt-24 pb-32 px-4 max-w-md mx-auto w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-white mb-1">Leaderboard</h2>
        <p className="text-gray-400 text-sm">Weekly League • Emerald Tier</p>
      </div>

      <div className="flex flex-col gap-3">
        {sortedData.map((user, index) => {
          const rank = index + 1;
          let rankColor = 'text-gray-400 font-bold';
          if (rank === 1) rankColor = 'text-yellow-400 font-black';
          if (rank === 2) rankColor = 'text-gray-300 font-black';
          if (rank === 3) rankColor = 'text-orange-400 font-black';

          return (
            <div 
              key={user.id} 
              className={`flex items-center p-4 rounded-2xl border transition-all ${
                user.isCurrentUser 
                  ? 'bg-casino-neon/10 border-casino-neon' 
                  : 'bg-casino-card border-white/5'
              }`}
            >
              <span className={`w-8 text-center text-lg ${rankColor}`}>
                {rank}
              </span>
              
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-10 h-10 rounded-full border-2 border-gray-700 ml-2 mr-4 object-cover"
              />
              
              <div className="flex-1">
                <h3 className={`font-bold ${user.isCurrentUser ? 'text-casino-neon' : 'text-white'}`}>
                  {user.name} {user.isCurrentUser && '(You)'}
                </h3>
              </div>

              <div className="text-right">
                <span className="font-mono text-casino-gold font-bold">{user.xp.toLocaleString()}</span>
                <span className="text-[10px] text-gray-500 block">XP</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};