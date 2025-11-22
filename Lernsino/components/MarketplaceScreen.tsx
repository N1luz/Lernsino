
import React from 'react';
import { UserStats } from '../types';
import { SKINS } from '../constants';
import { Coins, ArrowUpRight } from 'lucide-react';

interface MarketplaceScreenProps {
  stats: UserStats;
  onSell: (itemId: string, value: number) => void;
}

export const MarketplaceScreen: React.FC<MarketplaceScreenProps> = ({ stats, onSell }) => {
  
  const getSkin = (id: string) => SKINS.find(s => s.id === id);

  // Count items
  const inventoryCounts = stats.inventory.reduce((acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
  }, {} as Record<string, number>);

  const uniqueItems = Object.keys(inventoryCounts);

  return (
    <div className="animate-fade-in">
        <div className="bg-black/20 p-4 rounded-xl mb-4">
            <h3 className="text-gray-400 text-xs font-bold uppercase mb-1">Liquidation Station</h3>
            <p className="text-sm text-gray-300">Sell your duplicates for quick coins. Market prices are fixed.</p>
        </div>

        {uniqueItems.length === 0 ? (
             <div className="text-center py-10 text-gray-500">
                 Your inventory is empty. Open some cases!
             </div>
        ) : (
            <div className="grid grid-cols-2 gap-3">
                {uniqueItems.map((skinId) => {
                    const skin = getSkin(skinId);
                    const count = inventoryCounts[skinId];
                    if (!skin) return null;
                    
                    // Prevent selling equipped item if it's the last one
                    const isEquipped = stats.equippedSkin === skinId;
                    const canSell = !isEquipped || count > 1;

                    return (
                        <div key={skinId} className="bg-casino-card border border-white/5 rounded-xl p-3 flex flex-col items-center relative group">
                            
                            <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                x{count}
                            </div>

                            <div className="w-16 h-16 rounded-full bg-black/30 mb-2 overflow-hidden mt-2">
                                <img src={skin.image} className="w-full h-full" alt={skin.name} />
                            </div>
                            <h4 className="font-bold text-white text-sm mb-1">{skin.name}</h4>
                            <p className="text-[10px] font-bold uppercase text-gray-500 mb-3">{skin.rarity}</p>
                            
                            <button 
                                onClick={() => canSell && onSell(skinId, skin.estimatedValue)}
                                className={`w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-all ${
                                    canSell 
                                    ? 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white' 
                                    : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                }`}
                            >
                                {canSell ? (
                                    <>Sell {skin.estimatedValue} <Coins className="w-3 h-3" /></>
                                ) : (
                                    <span className="text-[9px]">Equipped</span>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
        )}
    </div>
  );
};
