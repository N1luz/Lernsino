
import React, { useState } from 'react';
import { LevelData } from '../types';
import { X, RotateCcw, ThumbsUp, ArrowRight, AlertCircle } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface FlashcardGameProps {
  level: LevelData;
  onComplete: () => void;
  onExit: () => void;
}

export const FlashcardGame: React.FC<FlashcardGameProps> = ({ level, onComplete, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const flashcards = level.flashcards || [];
  
  if (flashcards.length === 0) {
      return (
          <div className="fixed inset-0 z-50 bg-casino-bg flex flex-col items-center justify-center p-6">
             <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
             <h2 className="text-xl font-bold text-white mb-2">No Content Found</h2>
             <p className="text-gray-400 text-center mb-6">This level currently has no flashcards available.</p>
             <button onClick={onExit} className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-bold">
                 Return to Map
             </button>
          </div>
      );
  }

  const currentCard = flashcards[currentIndex];

  const handleNext = () => {
    soundManager.play('click');
    if (currentIndex < flashcards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
    } else {
      onComplete();
    }
  };

  const handleFlip = () => {
    soundManager.play('flip');
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="fixed inset-0 z-50 bg-casino-bg flex flex-col">
       <div className="px-4 py-4 flex items-center justify-between bg-casino-card/50 backdrop-blur border-b border-white/5">
        <button onClick={onExit} className="text-gray-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
        <span className="text-gray-400 font-mono text-sm">
          Card {currentIndex + 1} / {flashcards.length}
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 perspective-1000">
        
        {/* Card Container with 3D preserve */}
        <div 
          onClick={handleFlip}
          className="relative w-full max-w-sm aspect-[3/4] cursor-pointer group perspective-1000"
        >
          <div className={`relative w-full h-full transition-all duration-500 preserve-3d transform ${isFlipped ? 'rotate-y-180' : ''}`}>
            
            {/* Front */}
            <div className="absolute inset-0 backface-hidden">
              <div className="w-full h-full bg-gradient-to-br from-casino-card to-gray-900 border border-white/10 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center p-8 text-center hover:border-casino-neon/50 transition-colors">
                 <span className="text-xs font-bold text-casino-neon uppercase tracking-widest mb-4">Term</span>
                 <h2 className="text-3xl font-bold text-white">{currentCard.front}</h2>
                 <p className="absolute bottom-8 text-gray-500 text-sm flex items-center gap-2">
                   <RotateCcw className="w-4 h-4" /> Tap to flip
                 </p>
              </div>
            </div>

            {/* Back */}
            <div className="absolute inset-0 backface-hidden rotate-y-180">
              <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900 border border-indigo-500/30 rounded-3xl shadow-[0_0_40px_rgba(99,102,241,0.3)] flex flex-col items-center justify-center p-8 text-center">
                 <span className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Definition</span>
                 <h2 className="text-2xl font-medium text-white leading-relaxed">{currentCard.back}</h2>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Controls */}
      <div className="p-6 pb-safe-bottom flex justify-center gap-4">
        <button 
          onClick={handleNext}
          className="flex items-center gap-2 bg-casino-gold hover:bg-yellow-400 text-yellow-950 px-8 py-4 rounded-full font-bold shadow-lg shadow-yellow-500/20 transition-all active:scale-95 w-full max-w-sm justify-center"
        >
           {currentIndex === flashcards.length - 1 ? 'Finish' : 'Next Card'} <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};
