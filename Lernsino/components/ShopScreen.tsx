
import React, { useState } from 'react';
import { SHOP_ITEMS, SKINS, CASES } from '../constants';
import { Coins, Lock, Check, TrendingUp } from 'lucide-react';
import { UserStats, Rarity } from '../types';
import { MarketplaceScreen } from './MarketplaceScreen';

interface ShopScreenProps {
  stats: UserStats;
  onBuy: (itemId: string, cost: number, isSkin?: boolean) => void;
  onOpenCase: (caseId: string) => void;
  onSellItem: (itemId: string, value: number) => void;
}

export const ShopScreen: React.FC<ShopScreenProps> = ({ stats, onBuy, onOpenCase, onSellItem }) => {
  const [activeTab, setActiveTab] = useState<'cases' | 'powerups' | 'market'>('cases');

  const getRarityColor = (rarity: Rarity) => {
    switch(rarity) {
        case Rarity.LEGENDARY: return 'border-yellow-500 text-yellow-500';
        case Rarity.EPIC: return 'border-purple-500 text-purple-500';
        case Rarity.RARE: return 'border-blue-400 text-blue-400';
        default: return 'border-gray-500 text-gray-400';
    }
  };

  return (
    <div className="pt-24 pb-32 px-4 max-w-md mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
            <h2 className="text-3xl font-black text-white">Market</h2>
            <p className="text-gray-400 text-sm">Spend & Sell.</p>
        </div>
        <div className="flex items-center gap-1 text-casino-gold font-bold text-xl bg-casino-gold/10 px-3 py-1 rounded-lg border border-casino-gold/20">
            <Coins className="fill-casino-gold w-5 h-5" />
            {stats.coins}
         </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-black/30 rounded-xl mb-6 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('cases')}
            className={`flex-1 py-2 px-3 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'cases' ? 'bg-casino-card text-white shadow-md' : 'text-gray-500'}`}
          >
              Loot Boxes
          </button>
          <button 
            onClick={() => setActiveTab('market')}
            className={`flex-1 py-2 px-3 rounded-lg font-bold text-sm transition-all whitespace-nowrap flex items-center gap-1 ${activeTab === 'market' ? 'bg-casino-card text-white shadow-md' : 'text-gray-500'}`}
          >
              Sell Items
          </button>
          <button 
            onClick={() => setActiveTab('powerups')}
            className={`flex-1 py-2 px-3 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'powerups' ? 'bg-casino-card text-white shadow-md' : 'text-gray-500'}`}
          >
              Powerups
          </button>
      </div>

      {activeTab === 'market' && (
          <MarketplaceScreen stats={stats} onSell={onSellItem} />
      )}

      {/* CASES LIST */}
      {activeTab === 'cases' && (
          <div className="space-y-4 animate-fade-in">
              {CASES.map((crate) => {
                  const canAfford = stats.coins >= crate.cost;
                  return (
                    <div key={crate.id} className="bg-casino-card border border-white/5 rounded-2xl p-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-casino-neon/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2" />
                        
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-20 h-20 bg-black/30 rounded-xl flex items-center justify-center text-4xl border border-white/10 shadow-inner">
                                {crate.image}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-white text-lg">{crate.name}</h3>
                                <div className="flex gap-1 mt-2">
                                    {crate.contains.slice(0, 3).map(id => {
                                        const skin = SKINS.find(s => s.id === id);
                                        return skin ? (
                                            <div key={id} className={`w-6 h-6 rounded bg-black/40 border ${getRarityColor(skin.rarity)}`} title={skin.name} />
                                        ) : null;
                                    })}
                                    {crate.contains.length > 3 && <div className="w-6 h-6 rounded bg-gray-800 flex items-center justify-center text-[10px] text-gray-500">+</div>}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => canAfford && onOpenCase(crate.id)}
                            className={`w-full mt-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                                canAfford 
                                ? 'bg-casino-neon text-white shadow-lg shadow-purple-900/20 hover:bg-purple-500 hover:scale-[1.02]' 
                                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            {canAfford ? 'Open Case' : 'Not Enough Coins'}
                            <span className="flex items-center bg-black/20 px-2 py-0.5 rounded text-xs">
                                {crate.cost} <Coins className="w-3 h-3 ml-1 fill-current text-casino-gold" />
                            </span>
                        </button>
                    </div>
                  );
              })}
          </div>
      )}

      {/* POWERUPS LIST */}
      {activeTab === 'powerups' && (
        <div className="space-y-4 animate-fade-in">
            {SHOP_ITEMS.map((item) => {
            const canAfford = stats.coins >= item.cost;
            return (
                <div key={item.id} className="bg-casino-card border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center text-3xl shadow-inner">
                    {item.icon}
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-white">{item.name}</h3>
                    <p className="text-xs text-gray-400 leading-tight mt-1">{item.description}</p>
                </div>
                <button
                    onClick={() => canAfford && onBuy(item.id, item.cost)}
                    className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-1 transition-all ${
                    canAfford 
                        ? 'bg-casino-gold text-yellow-900 shadow-lg shadow-yellow-500/20 active:scale-95' 
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    {canAfford ? (
                    <>
                        {item.cost} <Coins className="w-3 h-3 fill-current" />
                    </>
                    ) : (
                    <Lock className="w-4 h-4" />
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
