
import React, { useEffect, useState, useRef } from 'react';
import { Case, Skin, Rarity } from '../types';
import { SKINS } from '../constants';
import { X } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface CaseOpeningModalProps {
  crate: Case;
  onClose: () => void;
  onReward: (skin: Skin) => void;
}

export const CaseOpeningModal: React.FC<CaseOpeningModalProps> = ({ crate, onClose, onReward }) => {
  const [winningSkin, setWinningSkin] = useState<Skin | null>(null);
  const [rollingItems, setRollingItems] = useState<Skin[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // STRICT CONFIGURATION FOR PIXEL PERFECT ANIMATION
  const CARD_WIDTH = 144; 
  const MARGIN_X = 8; // 8px left + 8px right
  const ITEM_FULL_WIDTH = CARD_WIDTH + (MARGIN_X * 2); // 160px total per item slot
  const WINNER_INDEX = 50; // The winner is ALWAYS at this index
  const SPIN_DURATION = 6000; 

  const getRarityColor = (rarity: Rarity) => {
      switch(rarity) {
          case Rarity.LEGENDARY: return 'border-yellow-500 bg-yellow-500/10 text-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.4)]';
          case Rarity.EPIC: return 'border-purple-500 bg-purple-500/10 text-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]';
          case Rarity.RARE: return 'border-blue-500 bg-blue-500/10 text-blue-500';
          default: return 'border-gray-600 bg-gray-800 text-gray-400';
      }
  };

  useEffect(() => {
    // 1. Determine the pool
    const possibleSkins = crate.contains.map(id => SKINS.find(s => s.id === id)!).filter(Boolean);
    
    // Weighted Pool for random fillers
    const weightedPool: Skin[] = [];
    possibleSkins.forEach(skin => {
        let count = 1;
        if (skin.rarity === Rarity.COMMON) count = 100;
        if (skin.rarity === Rarity.RARE) count = 30;
        if (skin.rarity === Rarity.EPIC) count = 10;
        if (skin.rarity === Rarity.LEGENDARY) count = 2; 
        for(let i=0; i<count; i++) weightedPool.push(skin);
    });

    // 2. Select the ACTUAL Winner
    const winner = weightedPool[Math.floor(Math.random() * weightedPool.length)];
    setWinningSkin(winner);

    // 3. Construct the Strip
    const items: Skin[] = [];
    
    // Fill before winner
    for (let i = 0; i < WINNER_INDEX; i++) {
        items.push(weightedPool[Math.floor(Math.random() * weightedPool.length)]);
    }
    
    // --- CRITICAL: PLACE WINNER EXACTLY AT INDEX 50 ---
    items.push(winner);
    
    // Fill after winner
    for (let i = 0; i < 10; i++) {
        items.push(weightedPool[Math.floor(Math.random() * weightedPool.length)]);
    }
    
    setRollingItems(items);

    // 4. Execute Animation
    setTimeout(() => {
        if (scrollRef.current) {
            const containerWidth = scrollRef.current.parentElement?.clientWidth || window.innerWidth;
            
            // Math to center the card:
            // Position of Winner Center = (Index * ItemWidth) + (ItemWidth / 2)
            const winnerCenterPos = (WINNER_INDEX * ITEM_FULL_WIDTH) + (ITEM_FULL_WIDTH / 2);
            
            // We want the Winner Center to be at Container Center
            // Scroll Amount = WinnerCenterPos - ContainerCenter
            const centerOffset = containerWidth / 2;
            
            // Add a safe random offset (jitter) so it doesn't land dead center every time
            // Limit to +/- 40px to ensure we stay clearly inside the winning card (Card is 144px wide)
            const randomJitter = (Math.random() * 80) - 40; 

            const targetTranslate = -(winnerCenterPos - centerOffset + randomJitter);

            // Apply CSS Transform
            scrollRef.current.style.transition = `transform ${SPIN_DURATION}ms cubic-bezier(0.15, 0, 0.2, 1)`;
            scrollRef.current.style.transform = `translateX(${targetTranslate}px)`;
            
            // Sound Effects
            let ticks = 0;
            const totalTicks = 40; 
            const tickInterval = setInterval(() => {
                ticks++;
                // Slow down ticks near end
                const probability = ticks < totalTicks * 0.7 ? 0.5 : 0.1;
                if (Math.random() < probability) soundManager.play('tick');
                
                if (ticks >= totalTicks) clearInterval(tickInterval);
            }, SPIN_DURATION / totalTicks);

            // Finish Event
            setTimeout(() => {
                clearInterval(tickInterval);
                setIsFinished(true);
                onReward(winner); // Award the exact skin object we chose at start
                soundManager.play(winner.rarity === Rarity.LEGENDARY ? 'legendary' : 'coin');
            }, SPIN_DURATION + 500);
        }
    }, 100);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
       
       {isFinished && (
           <div className="absolute top-10 right-10">
               <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                   <X className="w-6 h-6" />
               </button>
           </div>
       )}

       <div className={`transition-opacity duration-500 text-center mb-12 ${isFinished ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
           <h2 className="text-3xl font-black text-white mb-2 animate-pulse">Opening Case...</h2>
           <p className="text-gray-400">Good luck!</p>
       </div>

       {/* THE ROLLER CONTAINER */}
       <div className="relative w-full max-w-4xl h-64 bg-casino-bg border-y-4 border-casino-gold overflow-hidden flex items-center shadow-[0_0_50px_rgba(0,0,0,0.8)]">
           
           {/* Center Indicator (Red Line) */}
           <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-red-500 z-30 shadow-[0_0_15px_rgba(239,68,68,1)]"></div>
           <div className="absolute left-1/2 -translate-x-1/2 top-0 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-red-500 z-30"></div>
           <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-red-500 z-30"></div>

           {/* Moving Strip */}
           <div ref={scrollRef} className="flex items-center h-full will-change-transform">
               {rollingItems.map((item, idx) => (
                   <div 
                     key={`${item.id}-${idx}`} 
                     className={`flex-shrink-0 bg-casino-card border-b-4 rounded-lg flex flex-col items-center justify-center p-2 relative ${getRarityColor(item.rarity)}`}
                     style={{ 
                         width: `${CARD_WIDTH}px`, 
                         height: '192px', 
                         marginLeft: `${MARGIN_X}px`,
                         marginRight: `${MARGIN_X}px`
                     }}
                   >
                       <div className="w-24 h-24 mb-3">
                           <img src={item.image} alt="" className="w-full h-full drop-shadow-lg object-contain" />
                       </div>
                       <span className="text-[10px] font-bold uppercase opacity-70">{item.rarity}</span>
                       <span className="text-xs font-bold text-white text-center leading-tight px-1 truncate w-full">{item.name}</span>
                   </div>
               ))}
           </div>

           {/* Vignette Gradients */}
           <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black via-black/80 to-transparent z-20 pointer-events-none" />
           <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black via-black/80 to-transparent z-20 pointer-events-none" />
       </div>

       {/* RESULT REVEAL POPUP */}
       {isFinished && winningSkin && (
           <div className="absolute inset-0 flex flex-col items-center justify-center z-40 bg-black/90 animate-fade-in">
               <div className="relative scale-0 animate-[pop-in_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
                    <div className={`absolute inset-0 rounded-full blur-[100px] opacity-60 animate-pulse-glow ${
                        winningSkin.rarity === Rarity.LEGENDARY ? 'bg-yellow-500' : 
                        winningSkin.rarity === Rarity.EPIC ? 'bg-purple-600' : 'bg-blue-500'
                    }`} />
                    
                    <div className={`relative bg-casino-card p-8 rounded-3xl border-4 flex flex-col items-center text-center max-w-sm shadow-2xl ${getRarityColor(winningSkin.rarity)}`}>
                        <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-6">You Unlocked</h3>
                        
                        <div className="w-40 h-40 mb-6 bg-black/40 rounded-full p-4 border border-white/10">
                            <img src={winningSkin.image} alt={winningSkin.name} className="w-full h-full object-contain drop-shadow-2xl" />
                        </div>
                        
                        <h2 className="text-3xl font-black text-white mb-2">{winningSkin.name}</h2>
                        <div className="flex gap-2 mb-8">
                            <span className={`px-3 py-1 rounded text-xs font-bold uppercase border ${getRarityColor(winningSkin.rarity)}`}>
                                {winningSkin.rarity}
                            </span>
                            <span className="px-3 py-1 rounded text-xs font-bold uppercase border border-gray-600 text-gray-400">
                                Value: {winningSkin.estimatedValue}
                            </span>
                        </div>

                        <button 
                          onClick={onClose}
                          className="w-full py-4 bg-white text-black font-black uppercase tracking-wider rounded-xl hover:bg-gray-200 hover:scale-[1.02] transition-all shadow-lg"
                        >
                            Collect Item
                        </button>
                    </div>
               </div>
           </div>
       )}

       <style>{`
         @keyframes pop-in {
             0% { transform: scale(0); opacity: 0; }
             100% { transform: scale(1); opacity: 1; }
         }
       `}</style>
    </div>
  );
};
