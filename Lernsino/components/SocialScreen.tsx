
import React, { useState, useEffect, useRef } from 'react';
import { Friend, ChatMessage, FriendStatus, Rarity } from '../types';
import { SKINS, LEADERBOARD_DATA, MOCK_USER_DB } from '../constants';
import { MessageSquare, UserPlus, ArrowRightLeft, X, Send, Server, Clock, Wifi, WifiOff, Search } from 'lucide-react';
import { soundManager } from '../utils/sound';
import { multiplayerService } from '../services/MultiplayerService';

interface SocialScreenProps {
    friends: Friend[];
    onStartTrade: (friendId: string) => void;
    onAddFriend: (name: string) => void;
    currentUser: string;
}

export const SocialScreen: React.FC<SocialScreenProps> = ({ friends, onStartTrade, onAddFriend, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'chat' | 'leaderboard'>('friends');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null); // Holds the mock user found
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  
  // New Features
  const [friendSearch, setFriendSearch] = useState('');
  const [myStatus, setMyStatus] = useState<'ONLINE' | 'AWAY' | 'OFFLINE'>('ONLINE');
  
  // Chat & Server State
  const [chatMsg, setChatMsg] = useState('');
  const [isServerConnected, setIsServerConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
      { id: '1', senderId: 'system', senderName: 'System', text: 'Connecting to network...', timestamp: Date.now(), isSystem: true },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubMsg = multiplayerService.subscribeToMessages((msg) => {
        setMessages(prev => [...prev, msg]);
        soundManager.play('tick');
    });

    const unsubConn = multiplayerService.subscribeToConnection((connected) => {
        setIsServerConnected(connected);
        if (!connected) {
            setMessages(prev => [...prev, { id: `sys_${Date.now()}`, senderId: 'system', senderName: 'System', text: 'Using Local Mode (Tab-to-Tab). Start server.js for Global.', timestamp: Date.now(), isSystem: true }]);
        }
    });

    return () => {
        unsubMsg();
        unsubConn();
    };
  }, []);

  useEffect(() => {
      if (activeTab === 'chat') {
          chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
  }, [messages, activeTab]);

  const handleSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if (!chatMsg.trim()) return;

      const newMsg: ChatMessage = {
          id: Date.now().toString() + Math.random().toString(),
          senderId: currentUser, 
          senderName: currentUser,
          text: chatMsg,
          timestamp: Date.now()
      };

      setMessages(prev => [...prev, newMsg]);
      multiplayerService.sendMessage(newMsg);
      setChatMsg('');
      soundManager.play('click');
  };

  const toggleMyStatus = () => {
      soundManager.play('click');
      if (myStatus === 'ONLINE') setMyStatus('AWAY');
      else if (myStatus === 'AWAY') setMyStatus('OFFLINE');
      else setMyStatus('ONLINE');
  };

  const handleSearchUser = (e: React.FormEvent) => {
      e.preventDefault();
      if (!searchQuery.trim()) return;
      
      // Mock DB Search
      const user = MOCK_USER_DB.find(u => u.name.toLowerCase() === searchQuery.toLowerCase());
      
      if (user) {
          setSearchResult(user);
          soundManager.play('flip');
      } else {
          setSearchResult(null);
          soundManager.play('wrong');
          alert("User not found in database.");
      }
  };

  const handleConfirmAdd = () => {
      if (searchResult) {
          onAddFriend(searchResult.name);
          setShowAddModal(false);
          setSearchQuery('');
          setSearchResult(null);
      }
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'ONLINE': return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]';
          case 'AWAY': return 'bg-yellow-500';
          default: return 'bg-gray-500 border border-gray-400';
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

  const getSkin = (id: string) => SKINS.find(s => s.id === id);

  const activeFriends = friends.filter(f => f.status === FriendStatus.ACCEPTED);
  const pendingFriends = friends.filter(f => f.status === FriendStatus.PENDING || f.status === FriendStatus.INCOMING);
  const displayedFriends = activeFriends.filter(f => f.name.toLowerCase().includes(friendSearch.toLowerCase()));
  const sortedLeaderboard = [...LEADERBOARD_DATA].sort((a, b) => b.xp - a.xp);

  return (
    <div className="pt-24 pb-32 px-4 max-w-md mx-auto w-full min-h-screen flex flex-col">
        
        {/* Header Area with Status Toggle */}
        <div className="flex justify-between items-end mb-6">
            <div>
                <h2 className="text-3xl font-black text-white mb-1">Social Hub</h2>
                <p className="text-gray-400 text-sm">Connect, Trade, Compete</p>
            </div>
            <button 
                onClick={toggleMyStatus}
                className="flex items-center gap-2 bg-casino-card border border-white/10 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
            >
                <div className={`w-3 h-3 rounded-full ${getStatusColor(myStatus)} transition-colors`} />
                <span className="text-xs font-bold text-white">{myStatus}</span>
            </button>
        </div>

        <div className="flex p-1 bg-black/30 rounded-xl mb-6 shrink-0 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('friends')}
            className={`flex-1 py-2 px-3 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'friends' ? 'bg-casino-card text-white shadow-md' : 'text-gray-500'}`}
          >
              Friends
          </button>
          <button 
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-2 px-3 rounded-lg font-bold text-sm transition-all whitespace-nowrap relative ${activeTab === 'requests' ? 'bg-casino-card text-white shadow-md' : 'text-gray-500'}`}
          >
              Requests
              {pendingFriends.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
          </button>
           <button 
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2 px-3 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'chat' ? 'bg-casino-card text-white shadow-md' : 'text-gray-500'}`}
          >
              Global Chat
          </button>
           <button 
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 py-2 px-3 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'leaderboard' ? 'bg-casino-card text-white shadow-md' : 'text-gray-500'}`}
          >
              Rankings
          </button>
      </div>

      {/* FRIENDS TAB */}
      {activeTab === 'friends' && (
        <div className="space-y-3 animate-fade-in">
            <div className="relative mb-4">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input 
                    type="text" 
                    placeholder="Search friends..." 
                    value={friendSearch}
                    onChange={(e) => setFriendSearch(e.target.value)}
                    className="w-full bg-casino-card border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-600 focus:border-casino-neon focus:outline-none transition-all"
                />
            </div>

            {displayedFriends.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                    {friendSearch ? 'No friends found.' : 'No friends yet. Add some!'}
                </div>
            )}

            {displayedFriends.map(friend => (
                <div 
                    key={friend.id} 
                    onClick={() => setSelectedFriend(friend)}
                    className="bg-casino-card border border-white/5 rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-colors group"
                >
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden border-2 border-white/10 group-hover:border-casino-neon/50 transition-colors">
                            <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
                        </div>
                        <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-casino-card ${friend.isOnline ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]' : 'bg-gray-500'}`} />
                    </div>
                    
                    <div className="flex-1">
                        <h3 className="font-bold text-white group-hover:text-casino-neon transition-colors">{friend.name}</h3>
                        <p className="text-xs text-gray-500">{friend.isOnline ? 'Online' : 'Last seen 2h ago'}</p>
                    </div>

                    <div className="flex gap-2">
                        <button 
                            onClick={(e) => { e.stopPropagation(); setActiveTab('chat'); }} 
                            className="p-2 bg-gray-800 rounded-xl text-gray-400 hover:text-white"
                        >
                            <MessageSquare className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onStartTrade(friend.id); }}
                            className="px-3 py-2 bg-casino-neon/20 text-casino-neon rounded-xl font-bold text-xs flex items-center gap-1 hover:bg-casino-neon hover:text-white transition-colors"
                        >
                            <ArrowRightLeft className="w-4 h-4" /> Trade
                        </button>
                    </div>
                </div>
            ))}

            <button 
                onClick={() => setShowAddModal(true)}
                className="w-full py-4 border border-dashed border-white/20 rounded-2xl text-gray-500 font-bold hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2 mt-4"
            >
                <UserPlus className="w-5 h-5" /> Add Friend
            </button>
        </div>
      )}

      {/* REQUESTS TAB */}
      {activeTab === 'requests' && (
          <div className="space-y-3 animate-fade-in">
               {pendingFriends.length === 0 && (
                <div className="text-center py-10 text-gray-500">No pending requests.</div>
               )}
               {pendingFriends.map(friend => (
                   <div key={friend.id} className="bg-casino-card border border-white/5 rounded-2xl p-4 flex items-center gap-3 opacity-80">
                        <div className="relative grayscale">
                            <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden">
                                <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-white">{friend.name}</h3>
                            <p className="text-xs text-yellow-500 flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</p>
                        </div>
                   </div>
               ))}
          </div>
      )}

      {/* LEADERBOARD & CHAT TABS (unchanged logic) */}
      {activeTab === 'leaderboard' && (
          <div className="space-y-3 animate-fade-in">
              {sortedLeaderboard.map((user, index) => (
                  <div key={user.id} className={`flex items-center p-3 rounded-2xl border ${user.isCurrentUser ? 'bg-casino-neon/10 border-casino-neon' : 'bg-casino-card border-white/5'}`}>
                      <span className={`w-8 text-center text-lg ${index === 0 ? 'text-yellow-400 font-black' : 'text-gray-400 font-bold'}`}>{index + 1}</span>
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border-2 border-gray-700 ml-2 mr-4 object-cover" />
                      <div className="flex-1"><h3 className={`font-bold ${user.isCurrentUser ? 'text-casino-neon' : 'text-white'}`}>{user.name} {user.isCurrentUser && '(You)'}</h3></div>
                      <div className="text-right"><span className="font-mono text-casino-gold font-bold">{user.xp.toLocaleString()}</span><span className="text-[10px] text-gray-500 block">XP</span></div>
                  </div>
              ))}
          </div>
      )}
      
      {activeTab === 'chat' && (
          <div className="flex flex-col h-[60vh] bg-casino-card border border-white/10 rounded-3xl overflow-hidden animate-fade-in">
              <div className="bg-black/40 p-3 text-center border-b border-white/5 flex justify-between items-center px-4">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Server className={`w-3 h-3 ${isServerConnected ? 'text-green-500' : 'text-orange-500'}`} /> {isServerConnected ? 'Global' : 'Local'}
                  </h4>
                  <span className={`text-[10px] flex items-center gap-1 ${isServerConnected ? 'text-green-500' : 'text-orange-500'}`}>{isServerConnected ? <Wifi size={12} /> : <WifiOff size={12} />}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map(msg => (
                      <div key={msg.id} className={`flex flex-col ${msg.senderId === currentUser ? 'items-end' : 'items-start'}`}>
                          {!msg.isSystem && msg.senderId !== currentUser && <span className="text-[10px] text-gray-500 mb-1 ml-1">{msg.senderName}</span>}
                          <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${msg.isSystem ? 'bg-white/10 text-center w-full text-xs text-gray-400' : msg.senderId === currentUser ? 'bg-casino-neon text-white' : 'bg-gray-700 text-gray-200'}`}>{msg.text}</div>
                      </div>
                  ))}
                  <div ref={chatEndRef} />
              </div>
              <form onSubmit={handleSendMessage} className="p-3 bg-black/40 border-t border-white/5 flex gap-2">
                  <input className="flex-1 bg-gray-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-casino-neon" placeholder="Type a message..." value={chatMsg} onChange={e => setChatMsg(e.target.value)} />
                  <button type="submit" className="p-2 bg-casino-neon rounded-xl text-white"><Send size={18} /></button>
              </form>
          </div>
      )}

      {/* --- IMPROVED ADD FRIEND MODAL --- */}
      {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-sm bg-casino-card border border-white/10 rounded-3xl p-6">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-white">Find Player</h3>
                      <button onClick={() => { setShowAddModal(false); setSearchQuery(''); setSearchResult(null); }}><X className="text-gray-400" /></button>
                  </div>
                  
                  {!searchResult ? (
                      <>
                         <p className="text-xs text-gray-500 mb-4">Enter the exact username of the player you want to add.</p>
                         <form onSubmit={handleSearchUser}>
                             <div className="relative mb-4">
                                 <input 
                                   type="text" 
                                   placeholder="e.g. SarahStonk"
                                   value={searchQuery}
                                   onChange={(e) => setSearchQuery(e.target.value)}
                                   className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-casino-neon focus:outline-none"
                                   autoFocus
                                 />
                                 <button type="submit" className="absolute right-2 top-2 p-1.5 bg-gray-700 rounded-lg text-gray-300"><Search size={16} /></button>
                             </div>
                         </form>
                      </>
                  ) : (
                      // SEARCH RESULT PREVIEW
                      <div className="animate-fade-in">
                          <div className="flex flex-col items-center mb-6">
                              <div className="w-20 h-20 rounded-full border-4 border-casino-card shadow-xl overflow-hidden mb-3">
                                  <img src={searchResult.avatar} alt={searchResult.name} className="w-full h-full object-cover" />
                              </div>
                              <h2 className="text-2xl font-black text-white">{searchResult.name}</h2>
                              <span className="text-xs font-bold text-casino-gold mt-1">Level {searchResult.level || 1}</span>
                          </div>

                          <div className="bg-black/20 p-3 rounded-xl mb-6">
                              <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Top Items</p>
                              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                  {(searchResult.inventory || []).slice(0, 4).map((skinId: string, i: number) => {
                                      const skin = getSkin(skinId);
                                      if(!skin) return null;
                                      return (
                                          <div key={i} className={`w-12 h-12 shrink-0 rounded-lg bg-casino-card border p-1 ${getRarityColor(skin.rarity)}`}>
                                              <img src={skin.image} className="w-full h-full object-contain" />
                                          </div>
                                      )
                                  })}
                              </div>
                          </div>

                          <button onClick={handleConfirmAdd} className="w-full py-3 bg-casino-neon text-white font-bold rounded-xl flex items-center justify-center gap-2">
                              <UserPlus size={18} /> Send Request
                          </button>
                          <button onClick={() => setSearchResult(null)} className="w-full py-3 mt-2 text-gray-500 font-bold text-xs hover:text-white">Back to Search</button>
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* EXISTING FRIEND PROFILE MODAL (unchanged visual logic) */}
      {selectedFriend && (
          <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
              <div className="relative w-full max-w-sm bg-casino-bg border border-white/10 rounded-3xl p-6 overflow-hidden animate-bounce-slight">
                  <button onClick={() => setSelectedFriend(null)} className="absolute top-4 right-4 p-2 bg-black/40 rounded-full text-white z-20"><X size={20} /></button>
                  <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-casino-neon/20 to-transparent z-0" />
                  <div className="relative z-10 flex flex-col items-center mb-6 mt-4">
                      <div className="w-24 h-24 rounded-full border-4 border-casino-card shadow-xl overflow-hidden mb-3">
                          <img src={selectedFriend.avatar} alt={selectedFriend.name} className="w-full h-full" />
                      </div>
                      <h2 className="text-2xl font-black text-white">{selectedFriend.name}</h2>
                      <span className="text-xs font-bold text-green-500 bg-green-900/20 px-2 py-0.5 rounded mt-1">{selectedFriend.isOnline ? 'Online' : 'Offline'}</span>
                  </div>
                  <div className="bg-casino-card border border-white/5 rounded-2xl p-4 mb-6">
                      <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Showcase Inventory</h3>
                      <div className="grid grid-cols-4 gap-2">
                          {selectedFriend.inventory.slice(0, 8).map((skinId, i) => {
                              const skin = getSkin(skinId);
                              if (!skin) return null;
                              return (
                                  <div key={i} className={`aspect-square bg-black/30 rounded-lg p-1 border ${getRarityColor(skin.rarity)}`}>
                                      <img src={skin.image} className="w-full h-full object-contain" alt="" />
                                  </div>
                              );
                          })}
                      </div>
                  </div>
                  <button onClick={() => { onStartTrade(selectedFriend.id); setSelectedFriend(null); }} className="w-full py-3 bg-casino-neon text-white font-bold rounded-xl flex items-center justify-center gap-2"><ArrowRightLeft size={18} /> Start Trade</button>
              </div>
          </div>
      )}

    </div>
  );
};
