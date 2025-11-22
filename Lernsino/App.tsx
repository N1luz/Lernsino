
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter } from 'react-router-dom';
import { GameView, LevelData, LevelType, UserStats, LevelStatus, Case, Skin, TradeSession, MarketListing, Friend, FriendStatus } from './types';
import { INITIAL_STATS, LEVELS, SUBJECTS, CASES, FRIENDS as INITIAL_FRIENDS, SKINS, MOCK_USER_DB } from './constants';
import { soundManager } from './utils/sound';
import { generateDynamicLevel, generateDynamicFlashcards } from './utils/questionGenerator';
import { multiplayerService } from './services/MultiplayerService';

// Components
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { MapScreen } from './components/MapScreen';
import { QuizGame } from './components/QuizGame';
import { FlashcardGame } from './components/FlashcardGame';
import { ShopScreen } from './components/ShopScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { AuthScreen } from './components/AuthScreen';
import { SubjectSelectionScreen } from './components/SubjectSelectionScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { CaseOpeningModal } from './components/CaseOpeningModal';
import { CasinoHub } from './components/CasinoHub';
import { SocialScreen } from './components/SocialScreen';
import { TradeModal } from './components/TradeModal';
import { AdminScreen } from './components/AdminScreen';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  
  const [view, setView] = useState<GameView>(GameView.SUBJECT_SELECTION);
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [levels, setLevels] = useState<LevelData[]>(LEVELS);
  const [friends, setFriends] = useState<Friend[]>(INITIAL_FRIENDS);
  const [activeLevel, setActiveLevel] = useState<LevelData | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  
  // Animation State
  const [lastCompletedLevelId, setLastCompletedLevelId] = useState<string | null>(null);
  
  // Feature State
  const [activeCase, setActiveCase] = useState<Case | null>(null);
  const [tradeSession, setTradeSession] = useState<TradeSession | null>(null);

  const isFirstRun = useRef(true);

  // Load auth/basic data
  useEffect(() => {
    const savedAuth = localStorage.getItem('lerncasino_auth');
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      setIsAuthenticated(true);
      setUsername(authData.username);
      setIsAdmin(authData.isAdmin || false);
      
      // Connect to DB immediately if logged in
      multiplayerService.login(authData.username);
    }

    const savedSubject = localStorage.getItem('lerncasino_subject');
    if (savedSubject) {
      setSelectedSubjectId(savedSubject);
      setView(GameView.HOME);
    } else {
      setView(GameView.SUBJECT_SELECTION);
    }

    // We start with INITIAL_STATS or LocalStorage as a fallback
    // But the Server DB will overwrite this shortly if connected
    const savedStats = localStorage.getItem('lerncasino_stats');
    if (savedStats) {
      setStats(prev => ({ ...prev, ...JSON.parse(savedStats) }));
    }
  }, []);

  // --- SYNC: Listen for Server DB State ---
  useEffect(() => {
    const unsub = multiplayerService.subscribeToState((serverStats) => {
        // Server is authority. Update local.
        setStats(serverStats);
        
        // Also update LS as backup
        localStorage.setItem('lerncasino_stats', JSON.stringify(serverStats));
    });
    return () => unsub();
  }, []);

  // --- SYNC: Send updates to Server ---
  useEffect(() => {
    if (isAuthenticated && !isFirstRun.current) {
      // Save to LocalStorage (Backup)
      localStorage.setItem('lerncasino_stats', JSON.stringify(stats));
      
      // Save to Server DB (Primary)
      multiplayerService.updateStats(stats);
    }
    isFirstRun.current = false;
  }, [stats, isAuthenticated]);

  const handleLogin = (user: string, adminStatus: boolean) => {
    setIsAuthenticated(true);
    setUsername(user);
    setIsAdmin(adminStatus);
    localStorage.setItem('lerncasino_auth', JSON.stringify({ username: user, isAdmin: adminStatus }));
    
    // Login to Backend DB
    multiplayerService.login(user);

    soundManager.init();
    soundManager.startMusic();
    
    if (selectedSubjectId) {
        setView(GameView.HOME);
    } else {
        setView(GameView.SUBJECT_SELECTION);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setIsAdmin(false);
    localStorage.removeItem('lerncasino_auth');
    localStorage.removeItem('lerncasino_subject');
    soundManager.stopMusic();
  };

  const handleSubjectSelect = (subjectId: string) => {
    soundManager.play('click');
    setSelectedSubjectId(subjectId);
    localStorage.setItem('lerncasino_subject', subjectId);
    setView(GameView.HOME);
  };

  const switchSubject = () => {
     soundManager.play('click');
     setSelectedSubjectId(null);
     localStorage.removeItem('lerncasino_subject');
     setView(GameView.SUBJECT_SELECTION);
  };

  const toggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    soundManager.play('click');
  };

  const handleLevelSelect = (level: LevelData) => {
    if (level.status === LevelStatus.LOCKED) return;
    
    soundManager.play('click');
    
    let levelToPlay = { ...level };
    
    // Handle Quiz Generation
    const hasManualQuestions = level.questions && level.questions.length > 0;
    if (!hasManualQuestions && (level.type === LevelType.QUIZ || level.type === LevelType.BOSS)) {
        const count = level.type === LevelType.BOSS ? 10 : 5; // More questions for new structure
        const dynamicQuestions = generateDynamicLevel(
            level.subjectId, 
            level.topic, 
            level.difficulty || 'EASY', 
            count,
            stats.weakTopics,
            level.id // Pass ID to lookup static questions
        );
        levelToPlay.questions = dynamicQuestions;
    }

    // Handle Flashcard Generation
    const hasManualFlashcards = level.flashcards && level.flashcards.length > 0;
    if (!hasManualFlashcards && level.type === LevelType.FLASHCARD) {
         levelToPlay.flashcards = generateDynamicFlashcards(
            level.subjectId, 
            level.topic, 
            5
        );
    }
    
    setActiveLevel(levelToPlay);

    if (level.type === LevelType.QUIZ || level.type === LevelType.BOSS) {
      setView(GameView.QUIZ);
    } else if (level.type === LevelType.FLASHCARD) {
      setView(GameView.FLASHCARDS);
    }
  };

  const unlockNextLevel = (completedLevel: LevelData) => {
      const subjectLevels = levels.filter(l => l.subjectId === completedLevel.subjectId);
      const currentIndex = subjectLevels.findIndex(l => l.id === completedLevel.id);
      const nextLevel = subjectLevels[currentIndex + 1];

      if (nextLevel && nextLevel.status === LevelStatus.LOCKED) {
          const newLevels = levels.map(l => 
              l.id === nextLevel.id ? { ...l, status: LevelStatus.ACTIVE } : l
          );
          setLevels(newLevels);
          localStorage.setItem('lerncasino_levels', JSON.stringify(newLevels));
      }
  };

  const handleQuizComplete = (score: number) => {
    if (!activeLevel) return;
    
    const totalQuestions = activeLevel.questions?.length || 1;
    const isPerfectScore = score === totalQuestions;

    const xpGain = activeLevel.xpReward + (score * 10);
    const coinGain = isPerfectScore ? activeLevel.coinReward : Math.floor(activeLevel.coinReward / 2);

    setStats(prev => ({
        ...prev,
        xp: prev.xp + xpGain,
        coins: prev.coins + coinGain,
    }));

    if (isPerfectScore || score >= Math.ceil(totalQuestions * 0.7)) { // Allow passing with 70%
        soundManager.play('win');
        if (activeLevel.status !== LevelStatus.COMPLETED) {
            const newLevels = levels.map(l => 
                l.id === activeLevel.id ? { ...l, status: LevelStatus.COMPLETED } : l
            );
            setLevels(newLevels);
            localStorage.setItem('lerncasino_levels', JSON.stringify(newLevels));
            
            unlockNextLevel(activeLevel);
            setLastCompletedLevelId(activeLevel.id);

            if (activeLevel.type === LevelType.BOSS) {
                setStats(prev => ({ ...prev, coins: prev.coins + 250 }));
                setTimeout(() => soundManager.play('coin'), 500);
            }
        }
    } else {
        soundManager.play('wrong');
        setStats(prev => ({
             ...prev,
             weakTopics: [...new Set([...prev.weakTopics, activeLevel.topic])]
        }));
    }

    setActiveLevel(null);
    setView(GameView.HOME);
  };

  const handleFlashcardComplete = () => {
    if (!activeLevel) return;
    soundManager.play('win');
    
    setStats(prev => ({ ...prev, xp: prev.xp + 50 })); 
    
    if (activeLevel.status !== LevelStatus.COMPLETED) {
        const newLevels = levels.map(l => 
            l.id === activeLevel.id ? { ...l, status: LevelStatus.COMPLETED } : l
        );
        setLevels(newLevels);
        localStorage.setItem('lerncasino_levels', JSON.stringify(newLevels));

        unlockNextLevel(activeLevel);
        setLastCompletedLevelId(activeLevel.id);
    }

    setActiveLevel(null);
    setView(GameView.HOME);
  };

  const handleWrongAnswer = () => {
    setStats(prev => ({ ...prev, hearts: Math.max(0, prev.hearts - 1) }));
  };

  const handleBuyItem = (itemId: string, cost: number, isSkin: boolean = false) => {
    if (stats.coins >= cost) {
      soundManager.play('coin');
      
      setStats(prev => {
        const newStats = { ...prev, coins: prev.coins - cost };
        if (isSkin) {
            if (!newStats.inventory.includes(itemId)) {
                newStats.inventory = [...newStats.inventory, itemId];
            }
        } else {
            if (itemId === 'heart_refill') newStats.hearts = newStats.maxHearts;
        }
        return newStats;
      });
    } else {
      soundManager.play('wrong');
    }
  };

  const handleSellItem = (itemId: string, value: number) => {
      soundManager.play('coin');
      setStats(prev => {
          const index = prev.inventory.indexOf(itemId);
          if (index === -1) return prev;
          
          const newInv = [...prev.inventory];
          newInv.splice(index, 1);

          return {
              ...prev,
              coins: prev.coins + value,
              inventory: newInv
          };
      });
  };

  const handleOpenCaseRequest = (caseId: string) => {
      const crate = CASES.find(c => c.id === caseId);
      if (!crate) return;

      if (stats.coins >= crate.cost) {
          setStats(prev => ({ ...prev, coins: prev.coins - crate.cost }));
          setActiveCase(crate);
          soundManager.stopMusic();
      } else {
          soundManager.play('wrong');
      }
  };

  const handleCaseReward = (skin: Skin) => {
      setStats(prev => {
          const newInv = [...prev.inventory, skin.id];
          return { ...prev, inventory: newInv };
      });
  };

  const handleCloseCaseModal = () => {
      setActiveCase(null);
      soundManager.startMusic();
  };

  const handleEquipSkin = (skinId: string) => {
      setStats(prev => ({ ...prev, equippedSkin: skinId }));
      soundManager.play('click');
  };

  const handleAddFriend = (name: string) => {
      // 1. Validation: Check if user exists in MOCK_USER_DB
      const realUser = MOCK_USER_DB.find(u => u.name.toLowerCase() === name.toLowerCase());
      
      if (!realUser) {
          soundManager.play('wrong');
          alert("User not found in database. Make sure the name is correct.");
          return;
      }

      // 2. Check if already added
      if (friends.find(f => f.id === realUser.id)) {
          soundManager.play('wrong');
          alert("Request already sent or user is already a friend.");
          return;
      }

      soundManager.play('click');

      // 3. Add to list with PENDING status
      const newFriend: Friend = {
          id: realUser.id,
          name: realUser.name,
          avatar: realUser.avatar,
          isOnline: true,
          status: FriendStatus.PENDING,
          inventory: ['skin_student', 'skin_nerd'] // Mock inventory for trading
      };
      setFriends(prev => [...prev, newFriend]);

      // 4. Simulate Acceptance after 3 seconds
      setTimeout(() => {
          soundManager.play('win'); // Notification sound
          setFriends(prev => prev.map(f => 
             f.id === newFriend.id ? { ...f, status: FriendStatus.ACCEPTED } : f
          ));
      }, 3000);
  };
  
  const handleStartTrade = (friendId: string) => {
      const partner = friends.find(f => f.id === friendId);
      if (!partner) return;

      const partnerItem = partner.inventory[Math.floor(Math.random() * partner.inventory.length)];
      
      setTradeSession({
          partnerId: friendId,
          status: 'OPEN',
          myOffer: { coins: 0, items: [], isLocked: false },
          partnerOffer: { coins: 0, items: partnerItem ? [partnerItem] : [], isLocked: false }
      });
  };

  const handleTradeComplete = (completedSession: TradeSession) => {
      const newInventory = [...stats.inventory];
      completedSession.myOffer.items.forEach(item => {
          const idx = newInventory.indexOf(item);
          if (idx > -1) newInventory.splice(idx, 1);
      });
      completedSession.partnerOffer.items.forEach(item => {
          newInventory.push(item);
      });

      setStats(prev => ({ ...prev, inventory: newInventory }));
      setTradeSession(null);
      soundManager.play('win');
  };

  const renderMainContent = () => {
    switch (view) {
      case GameView.SUBJECT_SELECTION:
          return <SubjectSelectionScreen onSelect={handleSubjectSelect} />;

      case GameView.HOME:
        if (!selectedSubjectId) return <SubjectSelectionScreen onSelect={handleSubjectSelect} />;
        const currentSubject = SUBJECTS.find(s => s.id === selectedSubjectId);
        const filteredLevels = levels.filter(l => l.subjectId === selectedSubjectId);
        return (
            <MapScreen 
                levels={filteredLevels} 
                currentSubject={currentSubject} 
                onLevelSelect={handleLevelSelect} 
                onBack={switchSubject}
                lastCompletedLevelId={lastCompletedLevelId}
                onAnimationComplete={() => setLastCompletedLevelId(null)}
            />
        );
      
      case GameView.SHOP:
        return (
            <ShopScreen 
                stats={stats} 
                onBuy={handleBuyItem} 
                onOpenCase={handleOpenCaseRequest} 
                onSellItem={handleSellItem}
            />
        );
      
      case GameView.LEADERBOARD:
        return <LeaderboardScreen />;
      
      case GameView.CASINO:
        return <CasinoHub stats={stats} onUpdateStats={setStats} />;

      case GameView.SOCIAL:
        return (
          <SocialScreen 
            friends={friends} 
            onStartTrade={handleStartTrade} 
            onAddFriend={handleAddFriend}
            currentUser={username}
          />
        );
      
      case GameView.PROFILE:
        return (
            <ProfileScreen 
                username={username}
                stats={stats}
                onLogout={handleLogout}
                onEquip={handleEquipSkin}
                onTrade={(id, target) => console.log("Legacy trade")}
                onToggleMute={toggleMute}
                isMuted={isMuted}
                onSwitchSubject={switchSubject}
                isAdmin={isAdmin}
                onOpenAdmin={() => setView(GameView.ADMIN)}
            />
        );
      
      case GameView.ADMIN:
        return (
            <AdminScreen 
                levels={levels} 
                setLevels={(newLevels) => {
                    setLevels(newLevels);
                    localStorage.setItem('lerncasino_levels', JSON.stringify(newLevels));
                }}
                onBack={() => setView(GameView.PROFILE)}
            />
        );

      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  if (view === GameView.QUIZ && activeLevel) {
    return (
      <QuizGame 
        level={activeLevel} 
        onComplete={handleQuizComplete} 
        onExit={() => { soundManager.play('click'); setView(GameView.HOME); }}
        onWrongAnswer={handleWrongAnswer}
        hearts={stats.hearts}
      />
    );
  }

  if (view === GameView.FLASHCARDS && activeLevel) {
    return (
      <FlashcardGame 
        level={activeLevel} 
        onComplete={handleFlashcardComplete} 
        onExit={() => { soundManager.play('click'); setView(GameView.HOME); }} 
      />
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen bg-casino-bg font-sans text-white selection:bg-casino-neon selection:text-white pb-safe-bottom relative">
        <TopBar stats={stats} />
        
        <main className="w-full min-h-screen">
          {renderMainContent()}
        </main>

        {view !== GameView.ADMIN && (
            <BottomNav 
                currentView={view} 
                setView={(v) => { soundManager.play('click'); setView(v); }} 
            />
        )}

        {activeCase && (
            <CaseOpeningModal 
                crate={activeCase} 
                onClose={handleCloseCaseModal} 
                onReward={handleCaseReward} 
            />
        )}

        {tradeSession && (
            <TradeModal 
                session={tradeSession}
                currentUserStats={stats}
                partner={friends.find(f => f.id === tradeSession.partnerId) || friends[0]}
                onUpdateSession={setTradeSession}
                onComplete={handleTradeComplete}
                onCancel={() => setTradeSession(null)}
            />
        )}
      </div>
    </HashRouter>
  );
};

export default App;
