
import React, { useState } from 'react';
import { TradeSession, UserStats, Friend, Rarity } from '../types';
import { SKINS } from '../constants';
import { Check, Lock, X, ArrowRightLeft, Coins, TrendingUp, ChevronsRight, LayoutGrid, User, UserCheck } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface TradeModalProps {
  session: TradeSession;
  currentUserStats: UserStats;
  partner: Friend;
  onUpdateSession: (session: TradeSession) => void;
  onComplete: (finalSession: TradeSession) => void;
  onCancel: () => void;
}

export const TradeModal: React.FC<TradeModalProps> = ({ 
    session, currentUserStats, partner, onUpdateSession, onComplete, onCancel 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  // Mobile Tab State: 'offer' (Overview) or 'inventory' (Selection)
  const [mobileTab, setMobileTab] = useState<'overview' | 'inventory'>('overview');

  // Helper
  const getSkin = (id: string) => SKINS.find(s => s.id === id);

  const getRarityColor = (rarity: Rarity) => {
      switch(rarity) {
          case Rarity.LEGENDARY: return 'border-yellow-500 text-yellow-500';
          case Rarity.EPIC: return 'border-purple-500 text-purple-500';
          case Rarity.RARE: return 'border-blue-400 text-blue-400';
          default: return 'border-gray-600 text-gray-400';
      }
  };

  const calculateTotal = (items: string[]) => {
      return items.reduce((acc, id) => acc + (getSkin(id)?.estimatedValue || 0), 0);
  };

  const myTotal = calculateTotal(session.myOffer.items);
  const partnerTotal = calculateTotal(session.partnerOffer.items);
  
  // Handle User Actions
  const toggleUserItem = (skinId: string) => {
      if (session.myOffer.isLocked) return;
      
      const currentItems = session.myOffer.items;
      let newItems;
      if (currentItems.includes(skinId)) {
          newItems = currentItems.filter(i => i !== skinId);
      } else {
          if (currentItems.length >= 9) {
              soundManager.play('wrong');
              return; // Max 9 items
          }
          newItems = [...currentItems, skinId];
      }

      onUpdateSession({
          ...session,
          myOffer: { ...session.myOffer, items: newItems },
          status: 'OPEN' // Unlock if changed
      });
      soundManager.play('click');
  };

  const toggleUserLock = () => {
      const newLocked = !session.myOffer.isLocked;
      
      // Sim Partner Lock logic
      const partnerLocked = true; // Bot always agrees for MVP

      let newStatus = session.status;
      if (newLocked && partnerLocked) {
          // Both locked, wait for confirm
      } else {
          newStatus = 'OPEN';
      }

      onUpdateSession({
          ...session,
          myOffer: { ...session.myOffer, isLocked: newLocked },
          partnerOffer: { ...session.partnerOffer, isLocked: partnerLocked }, // Bot auto-locks
          status: newStatus
      });
      soundManager.play('click');
  };

  const handleFinalConfirm = () => {
      setIsProcessing(true);
      soundManager.play('coin');
      
      // Simulate delay
      setTimeout(() => {
          onComplete({ ...session, status: 'COMPLETED' });
      }, 1500);
  };

  // Rendering helper for the grid
  const renderGrid = (items: string[], isUser: boolean) => {
      const slots = Array(9).fill(null);
      items.forEach((item, i) => { if (i < 9) slots[i] = item; });

      return (
        <div className="grid grid-cols-3 gap-2 bg-black/40 p-2 rounded-xl border border-white/5 shadow-inner">
            {slots.map((skinId, idx) => {
                const skin = skinId ? getSkin(skinId) : null;
                return (
                    <div key={idx} className="aspect-square bg-casino-card border border-white/5 rounded-lg flex flex-col items-center justify-center relative overflow-hidden group">
                         {skin ? (
                             <>
                                <div className={`absolute inset-0 bg-gradient-to-br opacity-20 ${skin.rarity === 'LEGENDARY' ? 'from-yellow-500' : 'from-transparent'}`} />
                                <img src={skin.image} className="w-3/4 h-3/4 object-contain z-10 drop-shadow-md" alt="" />
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[9px] text-center py-0.5 text-gray-300 font-mono">
                                    {skin.estimatedValue}
                                </div>
                             </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center opacity-5">
                                <Coins size={12} />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
      );
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-0 md:p-6">
        <div className="w-full h-full md:h-[90vh] md:max-w-5xl bg-casino-bg md:border border-white/10 md:rounded-3xl overflow-hidden flex flex-col shadow-2xl animate-fade-in">
            
            {/* Header */}
            <div className="bg-casino-card px-4 py-3 border-b border-white/10 flex justify-between items-center shrink-0 shadow-md z-10 pt-safe-top">
                <div className="flex items-center gap-3">
                    <div className="bg-casino-neon/20 p-2 rounded-lg">
                         <ArrowRightLeft className="text-casino-neon w-5 h-5" /> 
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-white leading-none">Trade</h2>
                        <p className="text-[10px] text-gray-400 mt-0.5">with {partner.name}</p>
                    </div>
                </div>
                <button onClick={onCancel} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 text-white transition-colors"><X size={18} /></button>
            </div>

            {/* Mobile Tabs */}
            <div className="md:hidden flex border-b border-white/10 bg-casino-bg">
                <button 
                    onClick={() => setMobileTab('overview')}
                    className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 ${mobileTab === 'overview' ? 'bg-white/5 text-white border-b-2 border-casino-neon' : 'text-gray-500'}`}
                >
                    <UserCheck size={14} /> Overview
                </button>
                <button 
                    onClick={() => setMobileTab('inventory')}
                    className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 ${mobileTab === 'inventory' ? 'bg-white/5 text-white border-b-2 border-casino-neon' : 'text-gray-500'}`}
                >
                    <LayoutGrid size={14} /> My Items
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden relative flex flex-col md:flex-row">
                
                {/* --- OVERVIEW SECTION (Left/Top) --- */}
                <div className={`flex-1 flex flex-col overflow-y-auto md:overflow-visible ${mobileTab === 'inventory' ? 'hidden md:flex' : 'flex'}`}>
                    <div className="flex-1 flex flex-col md:flex-row h-full">
                        
                        {/* MY OFFER */}
                        <div className={`flex-1 p-4 border-b md:border-b-0 md:border-r border-white/10 transition-colors ${session.myOffer.isLocked ? 'bg-green-900/5' : ''}`}>
                            <div className="flex justify-between items-center mb-3">
                                 <div className="flex items-center gap-2">
                                     <div className="w-8 h-8 bg-gray-700 rounded-full overflow-hidden border border-white/20">
                                         <img src={getSkin(currentUserStats.equippedSkin)?.image} className="w-full h-full" alt="me" />
                                     </div>
                                     <div>
                                        <span className="text-sm font-bold text-white block">You</span>
                                        <div className="text-casino-gold font-bold text-xs flex items-center gap-1">
                                            {myTotal.toLocaleString()} <Coins size={10} />
                                        </div>
                                     </div>
                                 </div>
                                 {session.myOffer.isLocked ? (
                                     <span className="text-[10px] font-bold bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/30 flex items-center gap-1">
                                         <Lock size={10} /> LOCKED
                                     </span>
                                 ) : (
                                     <span className="text-[10px] text-gray-500">Editing...</span>
                                 )}
                             </div>
                             {renderGrid(session.myOffer.items, true)}
                             <p className="text-xs text-gray-500 mt-2 md:hidden">Tap "My Items" to add skins.</p>
                        </div>

                        {/* PARTNER OFFER */}
                        <div className={`flex-1 p-4 transition-colors ${session.partnerOffer.isLocked ? 'bg-green-900/5' : 'bg-black/10'}`}>
                            <div className="flex justify-between items-center mb-3">
                                 <div className="flex items-center gap-2">
                                     <div className="w-8 h-8 bg-gray-700 rounded-full overflow-hidden border border-white/20">
                                         <img src={partner.avatar} className="w-full h-full" alt="partner" />
                                     </div>
                                     <div>
                                        <span className="text-sm font-bold text-white block">{partner.name}</span>
                                        <div className="text-casino-gold font-bold text-xs flex items-center gap-1">
                                            {partnerTotal.toLocaleString()} <Coins size={10} />
                                        </div>
                                     </div>
                                 </div>
                                 {session.partnerOffer.isLocked ? (
                                     <span className="text-[10px] font-bold bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/30 flex items-center gap-1">
                                         <Lock size={10} /> READY
                                     </span>
                                 ) : (
                                     <span className="text-[10px] text-gray-500 animate-pulse">Selecting...</span>
                                 )}
                            </div>
                            {renderGrid(session.partnerOffer.items, false)}
                        </div>
                    </div>
                </div>

                {/* --- INVENTORY SECTION (Right/Bottom/Tab) --- */}
                <div className={`flex-1 bg-black/20 flex flex-col border-t md:border-t-0 md:border-l border-white/10 ${mobileTab === 'overview' ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-4 flex-1 overflow-y-auto">
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 flex justify-between items-center sticky top-0 bg-casino-bg/90 backdrop-blur p-2 rounded-lg z-10 border border-white/5">
                            <span>Your Inventory</span>
                            <span>{currentUserStats.inventory.length} items</span>
                        </h4>
                        
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 pb-20 md:pb-0">
                            {currentUserStats.inventory.map((id, i) => {
                                const skin = getSkin(id);
                                const isSelected = session.myOffer.items.includes(id);
                                if (!skin) return null;
                                
                                const rarityStyle = getRarityColor(skin.rarity);

                                return (
                                    <button 
                                        key={`${id}-${i}`} 
                                        onClick={() => toggleUserItem(id)}
                                        disabled={session.myOffer.isLocked}
                                        className={`relative aspect-square bg-casino-card border rounded-xl p-1 flex flex-col items-center justify-center transition-all group ${
                                            isSelected ? 'border-casino-neon bg-casino-neon/10 ring-1 ring-casino-neon' : 'border-white/10 hover:bg-white/5'
                                        } ${session.myOffer.isLocked ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}
                                    >
                                        {isSelected && (
                                            <div className="absolute top-1 right-1 bg-casino-neon text-white rounded-full p-0.5 z-20 shadow-sm">
                                                <Check size={10} strokeWidth={4} />
                                            </div>
                                        )}

                                        <img src={skin.image} className={`w-2/3 h-2/3 object-contain mb-1 transition-transform ${isSelected ? 'scale-90' : 'group-hover:scale-110'}`} alt="" />
                                        
                                        <div className={`absolute bottom-1 left-1 right-1 h-0.5 rounded-full ${rarityStyle.replace('text-', 'bg-').split(' ')[0]}`} />
                                        
                                        <div className="absolute top-1 left-1 text-[8px] font-bold text-gray-400 bg-black/60 px-1 rounded">
                                            {skin.estimatedValue}
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-casino-card border-t border-white/10 flex flex-row justify-between gap-4 shrink-0 shadow-[0_-5px_20px_rgba(0,0,0,0.2)] z-20 pb-safe-bottom">
                {isProcessing ? (
                    <div className="w-full py-3 bg-casino-card border border-casino-neon/30 rounded-xl flex items-center justify-center gap-3 text-casino-neon font-bold animate-pulse">
                        <ArrowRightLeft className="animate-spin" /> Completing Trade...
                    </div>
                ) : (
                    <>
                        <button 
                            onClick={onCancel}
                            className="px-4 py-3 rounded-xl bg-gray-800 font-bold text-gray-400 hover:bg-gray-700 hover:text-white transition-colors text-sm"
                        >
                            Cancel
                        </button>
                        
                        <div className="flex-1 flex gap-3">
                            {!session.myOffer.isLocked ? (
                                <button 
                                    onClick={toggleUserLock}
                                    className="flex-1 py-3 rounded-xl bg-casino-neon text-white font-bold shadow-lg shadow-purple-500/20 hover:bg-purple-500 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 text-sm"
                                >
                                    <Lock size={16} /> <span className="hidden md:inline">Lock Offer</span> <span className="md:hidden">Lock</span>
                                </button>
                            ) : (
                                <button 
                                    onClick={handleFinalConfirm}
                                    disabled={!session.partnerOffer.isLocked}
                                    className={`flex-1 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 text-sm ${
                                        session.partnerOffer.isLocked 
                                        ? 'bg-green-500 text-white hover:bg-green-400 hover:scale-[1.02] shadow-green-500/20' 
                                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    {session.partnerOffer.isLocked ? (
                                        <><Check className="w-5 h-5" /> CONFIRM</>
                                    ) : (
                                        <span className="flex items-center gap-2"><ChevronsRight className="animate-pulse"/> Waiting...</span>
                                    )}
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    </div>
  );
};
