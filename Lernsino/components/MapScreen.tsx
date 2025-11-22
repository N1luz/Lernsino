
import React, { useEffect } from 'react';
import { LevelData, LevelStatus, LevelType, Subject } from '../types';
import { Star, Lock, Play, Book, Sword, ArrowLeft, Unlock } from 'lucide-react';

interface MapScreenProps {
  levels: LevelData[];
  currentSubject?: Subject;
  onLevelSelect: (level: LevelData) => void;
  onBack: () => void;
  lastCompletedLevelId: string | null;
  onAnimationComplete: () => void;
}

export const MapScreen: React.FC<MapScreenProps> = ({ 
    levels, currentSubject, onLevelSelect, onBack, 
    lastCompletedLevelId, onAnimationComplete 
}) => {
  
  // Group levels by topic to render headers
  const groupedLevels = levels.reduce((acc, level) => {
    if (!acc[level.topic]) acc[level.topic] = [];
    acc[level.topic].push(level);
    return acc;
  }, {} as Record<string, LevelData[]>);

  const topics = Object.keys(groupedLevels);

  // Identify animation targets
  const completedIndex = levels.findIndex(l => l.id === lastCompletedLevelId);
  const nextLevelId = (lastCompletedLevelId && completedIndex !== -1 && completedIndex < levels.length - 1) 
    ? levels[completedIndex + 1].id 
    : null;

  useEffect(() => {
    if (lastCompletedLevelId) {
        const timer = setTimeout(() => {
            onAnimationComplete();
        }, 4000); // Animation Duration
        return () => clearTimeout(timer);
    }
  }, [lastCompletedLevelId]);

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto pt-24 pb-32 px-4 relative min-h-screen">
      
      {/* Ambient Glow Background */}
      <div className={`fixed top-20 left-0 w-full h-96 bg-gradient-to-b ${currentSubject?.colorFrom || 'from-casino-neon'} to-transparent opacity-20 blur-[100px] rounded-full pointer-events-none`} />

      {/* Header with Back Button */}
      <div className="w-full flex items-center justify-between mb-8 z-10 relative">
        <button 
          onClick={onBack}
          className="p-2 bg-casino-card border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors shadow-lg"
        >
           <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="text-center absolute left-1/2 -translate-x-1/2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Current World</h2>
            <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 whitespace-nowrap">
                {currentSubject?.name || 'Unknown'}
            </span>
        </div>
        
        <div className="w-9"></div> {/* Spacer to center title */}
      </div>

      <div className="relative w-full flex flex-col items-center gap-4">
        
        {topics.map((topic, topicIndex) => {
          const topicLevels = groupedLevels[topic];
          
          return (
            <div key={topic} className="w-full flex flex-col items-center">
              {/* Topic Header (Themenbereich) */}
              <div className="w-full bg-casino-card/50 border border-white/10 backdrop-blur-sm rounded-xl p-3 mb-8 text-center shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse-glow opacity-30" />
                <h3 className="text-sm font-bold text-casino-neon uppercase tracking-wider relative z-10">{topic}</h3>
              </div>

              {/* Levels in this topic */}
              <div className="flex flex-col items-center gap-8 w-full mb-12 relative">
                
                {topicLevels.map((level, index) => {
                  // Visual path offset logic
                  // We want a zigzag pattern within the topic
                  const isLeft = index % 2 === 0;
                  const offsetClass = isLeft ? '-translate-x-12' : 'translate-x-12';
                  
                  let ButtonIcon = Star;
                  let shapeClass = "rounded-3xl";
                  let sizeClass = "w-20 h-20";

                  if (level.type === LevelType.FLASHCARD) ButtonIcon = Book;
                  if (level.type === LevelType.BOSS) {
                      ButtonIcon = Sword;
                      shapeClass = "rounded-full"; // Boss is round
                      sizeClass = "w-24 h-24";
                  }

                  // Check Animation State
                  const isJustCompleted = level.id === lastCompletedLevelId;
                  const isJustUnlocked = level.id === nextLevelId;

                  if (level.status === LevelStatus.LOCKED && !isJustUnlocked) ButtonIcon = Lock;
                  if (level.status === LevelStatus.ACTIVE || isJustUnlocked) ButtonIcon = Play;

                  const isActive = level.status === LevelStatus.ACTIVE;
                  const isCompleted = level.status === LevelStatus.COMPLETED;
                  const isLocked = level.status === LevelStatus.LOCKED;

                  return (
                    <div key={level.id} className={`relative z-10 flex justify-center w-full ${level.type !== LevelType.BOSS ? offsetClass : ''}`}>
                      
                      {/* Connecting Line logic */}
                      {index < topicLevels.length - 1 && (
                        <div className={`absolute top-12 w-1 h-20 bg-white/10 -z-10 
                           ${level.type === LevelType.BOSS ? 'h-0' : ''} 
                           ${isLeft ? 'left-1/2 ml-12 rotate-12 origin-top' : 'right-1/2 mr-12 -rotate-12 origin-top'}
                           ${isCompleted ? 'bg-casino-gold shadow-[0_0_10px_rgba(251,191,36,0.5)]' : ''}
                        `} />
                      )}

                      {/* SPARKLE EFFECTS FOR JUST COMPLETED */}
                      {isJustCompleted && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                             {/* Burst */}
                             <div className="absolute w-32 h-32 bg-yellow-500/30 rounded-full blur-xl animate-ping" />
                             <div className="absolute w-full h-full border-2 border-yellow-400 rounded-full animate-[ping_1s_ease-out_infinite]" />
                             {/* Particles (Simulated with divs) */}
                             <div className="absolute -top-8 left-0 w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDuration: '0.6s' }} />
                             <div className="absolute -top-6 right-0 w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDuration: '0.8s' }} />
                             <div className="absolute top-0 -left-6 w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDuration: '0.7s' }} />
                             <div className="absolute top-0 -right-6 w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDuration: '0.9s' }} />
                        </div>
                      )}

                      <button
                        onClick={() => !isLocked && onLevelSelect(level)}
                        disabled={isLocked && !isJustUnlocked}
                        className={`
                          relative ${sizeClass} ${shapeClass} flex flex-col items-center justify-center border-b-4 transition-all duration-300
                          ${(isActive || isJustUnlocked)
                            ? 'bg-gradient-to-b from-casino-neon to-purple-900 border-purple-950 shadow-[0_0_30px_rgba(139,92,246,0.5)] scale-110 animate-bounce-slight' 
                            : ''}
                          ${isCompleted 
                            ? 'bg-gradient-to-b from-casino-gold to-yellow-700 border-yellow-900 text-white' 
                            : ''}
                          ${isLocked && !isJustUnlocked
                            ? 'bg-gray-800 border-gray-900 text-gray-600 cursor-not-allowed opacity-70' 
                            : ''}
                          ${!isLocked && !isActive && !isCompleted && !isJustUnlocked ? 'bg-gray-700 border-gray-800 hover:scale-105' : ''}
                        `}
                      >
                         {isJustUnlocked ? (
                             // Unlock Animation: Lock fades out, Play fades in
                             <div className="relative w-8 h-8">
                                 <Lock className="absolute inset-0 w-8 h-8 text-gray-500 animate-[ping_1s_ease-out_reverse_forwards] opacity-0" />
                                 <Unlock className="absolute inset-0 w-8 h-8 text-white animate-[ping_0.5s_ease-in]" />
                                 <Play className="absolute inset-0 w-8 h-8 text-white fill-white animate-[fade-in_1s_ease-in_1s_forwards] opacity-0" />
                             </div>
                         ) : (
                            <ButtonIcon 
                                className={`w-8 h-8 mb-1 ${isActive ? 'text-white fill-white' : ''} ${isCompleted ? 'text-yellow-900 fill-yellow-900' : ''}`} 
                                strokeWidth={3}
                            />
                         )}
                        
                        {/* Level Crown/Stars if completed */}
                        {isCompleted && (
                          <div className="absolute -top-2 -right-2 flex animate-bounce-slight">
                            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-casino-bg shadow-sm">
                              <Star className="w-3 h-3 text-white fill-white" />
                            </div>
                          </div>
                        )}
                      </button>
                      
                      {/* Floating Title for Active/Completed levels */}
                      {!isLocked && (
                        <div className={`absolute -bottom-6 whitespace-nowrap px-2 py-0.5 rounded bg-black/50 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider border border-white/10
                           ${isCompleted ? 'text-yellow-500' : 'text-white'}
                           ${isActive || isJustUnlocked ? 'text-casino-neon border-casino-neon/30' : ''}
                        `}>
                           {level.title}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
