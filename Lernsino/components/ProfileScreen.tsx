
import React, { useState } from 'react';
import { UserStats, Skin, Rarity } from '../types';
import { SKINS } from '../constants';
import { Volume2, VolumeX, LogOut, Send, Check, Lock, Grid, Settings, Shield } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface ProfileScreenProps {
  username: string;
  stats: UserStats;
  onLogout: () => void;
  onEquip: (skinId: string) => void;
  onTrade: (skinId: string, targetUser: string) => void;
  onToggleMute: () => void;
  isMuted: boolean;
  onSwitchSubject: () => void;
  onOpenAdmin: () => void;
  isAdmin: boolean;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ 
  username, stats, onLogout, onEquip, onTrade, onToggleMute, isMuted, onSwitchSubject, onOpenAdmin, isAdmin 
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'settings'>('inventory');
  const [tradeTarget, setTradeTarget] = useState('');
  const [tradeSkin, setTradeSkin] = useState<string | null>(null);

  const getSkin = (id: string) => SKINS.find(s => s.id === id);
  const equippedSkin = getSkin(stats.equippedSkin);

  const handleTradeSubmit = () => {
    if (tradeSkin && tradeTarget) {
        onTrade(tradeSkin, tradeTarget);
        setTradeSkin(null);
        setTradeTarget('');
        soundManager.play('coin');
    }
  };

  const getRarityColor = (rarity: Rarity) => {
      switch(rarity) {
          case Rarity.LEGENDARY: return 'border-yellow-400 bg-yellow-400/10 text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)]';
          case Rarity.EPIC: return 'border-purple-500 bg-purple-500/10 text-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]';
          case Rarity.RARE: return 'border-blue-400 bg-blue-400/10 text-blue-400';
          default: return 'border-gray-600 bg-gray-800 text-gray-400';
      }
  };

  return (
    <div className="pt-24 pb-32 px-4 max-w-md mx-auto w-full min-h-screen flex flex-col">
      
      <div className="flex justify-end mb-2 h-8">
         {isAdmin && (
            <button onClick={onOpenAdmin} className="bg-red-900/50 border border-red-500/30 p-2 rounded-full text-red-400 hover:text-white hover:bg-red-800 transition-colors animate-pulse" title="Admin Panel">
                <Shield size={16} />
            </button>
         )}
      </div>

      <div className="bg-casino-card border border-white/10 rounded-3xl p-6 mb-8 text-center relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-casino-neon/20 to-transparent" />
         
         <div className="relative z-10 flex flex-col items-center">
            <div className={`w-24 h-24 rounded-full border-4 p-1 bg-casino-bg mb-4 ${getRarityColor(equippedSkin?.rarity || Rarity.COMMON).split(' ')[0]}`}>
                <img 
                    src={equippedSkin?.image} 
                    alt="Avatar" 
                    className="w-full h-full rounded-full object-cover" 
                />
            </div>
            <h2 className="text-2xl font-black text-white">{username}</h2>
            <p className="text-casino-gold font-mono text-sm font-bold mt-1">Lvl {stats.level} • {stats.xp.toLocaleString()} XP</p>
         </div>
      </div>

      <div className="flex p-1 bg-black/30 rounded-xl mb-6">
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'inventory' ? 'bg-casino-card text-white shadow-md' : 'text-gray-500'}`}
          >
              Inventory
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'settings' ? 'bg-casino-card text-white shadow-md' : 'text-gray-500'}`}
          >
              Settings
          </button>
      </div>

      {activeTab === 'inventory' && (
          <div className="grid grid-cols-2 gap-3 animate-fade-in">
              {stats.inventory.map((skinId) => {
                  const skin = getSkin(skinId);
                  if (!skin) return null;
                  const isEquipped = stats.equippedSkin === skinId;

                  return (
                    <div key={skinId} className={`relative group bg-casino-card border rounded-2xl p-3 flex flex-col items-center transition-all hover:-translate-y-1 ${isEquipped ? 'border-green-500 bg-green-900/10' : 'border-white/5'}`}>
                        
                        {isEquipped && <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">EQUIPPED</div>}
                        
                        <div className="w-16 h-16 rounded-full bg-black/30 mb-3 overflow-hidden">
                            <img src={skin.image} alt={skin.name} className="w-full h-full object-cover" />
                        </div>
                        
                        <h3 className="font-bold text-sm text-white text-center truncate w-full">{skin.name}</h3>
                        <span className={`text-[10px] font-bold uppercase mt-1 px-2 py-0.5 rounded border ${getRarityColor(skin.rarity)}`}>
                            {skin.rarity}
                        </span>
                        <span className="text-[10px] text-gray-500 mt-1">Est. {skin.estimatedValue} Coins</span>

                        <div className="flex gap-2 w-full mt-3">
                            {!isEquipped && (
                                <button 
                                    onClick={() => onEquip(skin.id)}
                                    className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-1.5 rounded-lg"
                                >
                                    Equip
                                </button>
                            )}
                            <button 
                                onClick={() => setTradeSkin(skin.id)}
                                className="flex-1 bg-casino-neon/20 hover:bg-casino-neon/40 text-casino-neon text-xs font-bold py-1.5 rounded-lg"
                            >
                                Trade
                            </button>
                        </div>
                    </div>
                  );
              })}
          </div>
      )}

      {activeTab === 'settings' && (
          <div className="space-y-4 animate-fade-in flex-1 flex flex-col">
              <div className="bg-casino-card border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                <span className="font-semibold text-gray-200 flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-gray-400" /> Sound & Music
                </span>
                <button 
                  onClick={onToggleMute}
                  className={`p-2 rounded-full transition-all ${isMuted ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
              </div>

              <button 
                 onClick={onSwitchSubject}
                 className="w-full p-4 bg-casino-card border border-white/10 rounded-2xl flex items-center justify-between hover:bg-white/5 transition-all group"
              >
                 <span className="font-semibold text-gray-200 flex items-center gap-3">
                    <Grid className="w-5 h-5 text-gray-400 group-hover:text-white" /> Change Subject
                 </span>
                 <Grid className="w-5 h-5 text-gray-600" />
              </button>

              <button 
                onClick={onLogout}
                className="w-full p-4 bg-red-900/10 border border-red-900/30 rounded-2xl flex items-center justify-center gap-2 text-red-400 font-bold hover:bg-red-900/20 transition-all mt-8"
              >
                <LogOut size={18} /> Sign Out
              </button>

              <div className="mt-auto pt-10 text-center pb-4">
                  <p className="text-xs text-gray-600 font-mono">LernCasino v1.2.0</p>
                  <p className="text-[10px] text-gray-700">Beta Build</p>
              </div>
          </div>
      )}

      {tradeSkin && (
          <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-casino-card border border-white/10 w-full max-w-sm rounded-3xl p-6 animate-bounce-slight">
                  <h3 className="text-xl font-bold text-white mb-2">Trade Item</h3>
                  <p className="text-gray-400 text-sm mb-6">Send <span className="text-casino-neon font-bold">{getSkin(tradeSkin)?.name}</span> to another player.</p>
                  
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Recipient Username</label>
                  <input 
                    type="text" 
                    value={tradeTarget}
                    onChange={(e) => setTradeTarget(e.target.value)}
                    placeholder="e.g. CryptoKing99"
                    className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-white mt-1 mb-6 focus:border-casino-neon focus:outline-none"
                  />
                  
                  <div className="flex gap-3">
                      <button 
                        onClick={() => setTradeSkin(null)}
                        className="flex-1 py-3 bg-gray-800 rounded-xl font-bold text-gray-400"
                      >
                          Cancel
                      </button>
                      <button 
                        onClick={handleTradeSubmit}
                        disabled={!tradeTarget}
                        className="flex-1 py-3 bg-casino-neon text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                          <Send className="w-4 h-4" /> Send
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
